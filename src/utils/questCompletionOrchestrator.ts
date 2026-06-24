import type { AppState, } from '../context/appContextValue';
import type { Quest } from '../types';
import { calculateXpForLevel, applyXpCap } from '../hooks/useGameEconomy';
import { applyDecayToAllSkills } from '../hooks/useSkillDecay';
import { trackEvent } from './analyticsEngine';
import { getWidgetCache, updateWidgetCache } from './widgetCommandBus';
import { buildNotificationContent, canSendNotification, trackNotificationEngaged } from './smartNotificationScheduler';
import { getComebackRewardBonus } from './retentionEngine';
import { logCrash } from './productionSafety';

interface QuestCompletionContext {
  quest: Quest;
  difficulty: 1 | 2 | 3 | 4 | 5;
  isDue: boolean;
  isChallenge: boolean;
  streak: number;
}

interface QuestCompletionResult {
  xpEarned: number;
  masteryGain: number;
  leveledUp: boolean;
  newLevel?: number;
  notificationSent: boolean;
  notifications: Array<{ title: string; body: string }>;
  warnings: string[];
  stateSnapshot: Record<string, any>;
}

/**
 * CRITICAL: CompleteQuest Orchestrator
 * Deterministic event flow for quest completion
 * Order: XP calc → decay → recovery → notification → widget → native sync → analytics
 */
export async function orchestrateQuestCompletion(
  state: AppState,
  context: QuestCompletionContext,
  skillEngine: any
): Promise<QuestCompletionResult> {
  const result: QuestCompletionResult = {
    xpEarned: 0,
    masteryGain: 0,
    leveledUp: false,
    notificationSent: false,
    notifications: [],
    warnings: [],
    stateSnapshot: {},
  };

  const now = new Date().toISOString();

  try {
    // ============================================================
    // PHASE 1: XP CALCULATION (deterministic)
    // ============================================================
    const baseXp = context.quest.difficulty * 10; // 10-50 base
    const difficultyMultiplier = [0.8, 1, 1.2, 1.5, 2][context.difficulty - 1] || 1;
    const streakBonus = Math.log2(1 + context.streak) || 1;
    const dueBonus = context.isDue ? 1.5 : 1;
    const challengeBonus = context.isChallenge ? 1.3 : 1;

    let earnedXp = baseXp * difficultyMultiplier * streakBonus * dueBonus * challengeBonus;

    // PHASE 2: Check daily XP cap
    const dailyXpEarned = state.user.xp % 1000; // rough estimate
    earnedXp = applyXpCap(earnedXp, dailyXpEarned, 1000);

    result.xpEarned = Math.floor(earnedXp);

    // ============================================================
    // PHASE 3: SKILL ENGINE UPDATE
    // ============================================================
    if (context.quest.skillId && skillEngine) {
      const skill = skillEngine.progressMap[context.quest.skillId];
      if (skill) {
        const oldMastery = skill.mastery;
        skillEngine.addXp(context.quest.skillId, result.xpEarned, {
          difficulty: context.difficulty,
          streak: context.streak,
          isDue: context.isDue,
          isChallenge: context.isChallenge,
        });

        result.masteryGain = (skillEngine.progressMap[context.quest.skillId]?.mastery || 0) - oldMastery;
      }
    }

    // ============================================================
    // PHASE 4: DECAY SYSTEM CHECK (housekeeping)
    // ============================================================
    let skillMap = skillEngine?.progressMap || {};
    const { updated: decayedSkills, warnings: decayWarnings } = applyDecayToAllSkills(skillMap, now);
    skillMap = decayedSkills;
    if (decayWarnings.length > 0) result.warnings.push(...decayWarnings);

    // ============================================================
    // PHASE 5: LEVEL UP CHECK
    // ============================================================
    const prevLevel = state.user.level;
    const totalXp = state.user.xp + result.xpEarned;
    let newLevel = prevLevel;
    while (totalXp >= calculateXpForLevel(newLevel)) {
      newLevel++;
    }

    if (newLevel > prevLevel) {
      result.leveledUp = true;
      result.newLevel = newLevel;
      result.notifications.push({
        title: `🎉 Level ${newLevel}!`,
        body: `Congratulations! New features unlocked.`,
      });
    }

    // ============================================================
    // PHASE 6: STREAK & RECOVERY UPDATE
    // ============================================================
    const prevLastQuestDate = state.user.lastQuestCompletedAt;
    const daysSinceLastQuest = prevLastQuestDate
      ? Math.floor((Date.now() - new Date(prevLastQuestDate).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    let newStreak = state.user.streak;
    // streak message intentionally not stored here

    if (daysSinceLastQuest === 0) {
      // Same day quest
      newStreak = state.user.streak;
    } else if (daysSinceLastQuest === 1) {
      // Normal continuation
      newStreak = state.user.streak + 1;
      // streak message handled via notifications
    } else {
      // Missed days - check if frozen or comeback
      if (state.user.recoveryState.streakFrozen) {
        newStreak = state.user.streak;
        // streak message handled via notifications
        state.user.recoveryState.streakFrozen = false; // consume freeze
      } else {
        // Comeback - reset but with bonus
        const { xpBonus, recoveryMsg } = getComebackRewardBonus(daysSinceLastQuest, state.user.streak);
        newStreak = 1; // reset to 1
        earnedXp = Math.floor(earnedXp * (1 + xpBonus / 100));
        // streak message handled via notifications
        result.notifications.push({ title: '🔄 Comeback Mode', body: recoveryMsg });
      }
    }

    // ============================================================
    // PHASE 7: NOTIFICATION ELIGIBILITY
    // ============================================================
    let notificationSent = false;
    if (context.quest.skillId) {
      const skill = skillMap[context.quest.skillId];
      if (skill && canSendNotification(context.quest.skillId, skill, now)) {
        const content = buildNotificationContent(skill, context.quest.skillId, 'normal');
        result.notifications.push(content);
        notificationSent = true;
        trackNotificationEngaged(context.quest.skillId, now);
      }
    }

    result.notificationSent = notificationSent;

    // ============================================================
    // PHASE 8: WIDGET CACHE UPDATE
    // ============================================================
    const focusSkill = skillEngine?.getFocusSkill();
    updateWidgetCache({
      focusSkillId: focusSkill?.skillId || null,
      focusMastery: focusSkill?.mastery || 0,
      streak: newStreak,
      streakRisk: daysSinceLastQuest > 1 ? 'critical' : daysSinceLastQuest === 1 ? 'warning' : 'safe',
      dailyProgress: { completed: state.quests.filter(q => q.completed).length, total: state.quests.length },
      lastUpdate: now,
    });

    // ============================================================
    // PHASE 9: STATE MUTATION (atomic)
    // ============================================================
    state.user.xp = totalXp;
    state.user.level = newLevel;
    state.user.streak = newStreak;
    state.user.lastQuestCompletedAt = now;
    state.user.streakRiskLevel = daysSinceLastQuest > 1 ? 'critical' : daysSinceLastQuest === 1 ? 'warning' : 'safe';

    // ============================================================
    // PHASE 10: NATIVE STATE VERIFICATION (read-only)
    // ============================================================
    // Native state verification is intentionally skipped here. The single-writer
    // persistence owner owns any reconciliation and native write orchestration.

    // PHASE 10.5: RECONCILIATION CHECK SKIPPED (single-writer only)
    // ============================================================
    // Reconciliation is handled separately by the persistence owner; no direct native or write-side checks here.

    // PHASE 11: ANALYTICS TRACKING
    // ============================================================
    trackEvent('quest_completed', {
      questId: context.quest.id,
      skillId: context.quest.skillId,
      xpEarned: result.xpEarned,
      streak: newStreak,
      levelUp: result.leveledUp,
      isDue: context.isDue,
      difficulty: context.difficulty,
    });

    // ============================================================
    // PHASE 12: SNAPSHOT FOR VALIDATION
    // ============================================================
    result.stateSnapshot = {
      userLevel: state.user.level,
      userXp: state.user.xp,
      streak: state.user.streak,
      skillMapKeys: Object.keys(skillMap),
      widgetCache: getWidgetCache(),
      timestamp: now,
    };

    return result;
  } catch (error) {
    logCrash(error as any);
    result.warnings.push(`Orchestration error: ${error}`);
    return result;
  }
}

// widget cache verification helper removed (unused)

