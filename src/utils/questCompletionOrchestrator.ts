import type { AppState, } from '../context/appContextValue';
import type { Quest } from '../types';
import { calculateXpForLevel, applyXpCap } from '../hooks/useGameEconomy';
import { applyDecayToAllSkills } from '../hooks/useSkillDecay';
import { trackEvent } from './analyticsEngine';
import { getWidgetCache, updateWidgetCache } from './widgetCommandBus';
import { buildNotificationContent, canSendNotification, trackNotificationEngaged } from './smartNotificationScheduler';
import { getComebackRewardBonus } from './retentionEngine';
import { logCrash } from './productionSafety';
import { checkIdentityRewards } from '../core/services/identityRewardService';
import { getSessionChain, incrementSessionChain, calculateSessionBonus, getSessionChainHook } from '../core/services/sessionChainService';
import { getAnticipationHint } from '../core/services/anticipationService';
import { trackEvent as trackBehaviorEvent } from '../core/services/analyticsService';

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
  rewardEvent?: import('../types').RewardEvent;
  sessionChainHook?: {
    showHook: boolean;
    message: string;
    bonusProgress: number;
    nextReward: string;
  };
  metaSkills?: import('../types').MetaSkills;
  anticipationHint?: {
    type: string;
    message: string;
  };
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
    // PHASE 1: XP CALCULATION & VARIABLE REWARD ENGINE
    // ============================================================
    const baseXp = context.quest.difficulty * 10; // 10-50 base
    const difficultyMultiplier = [0.8, 1, 1.2, 1.5, 2][context.difficulty - 1] || 1;
    const dueBonus = context.isDue ? 1.5 : 1;
    const challengeBonus = context.isChallenge ? 1.3 : 1;
    let earnedXp = baseXp * difficultyMultiplier * dueBonus * challengeBonus;

    // ============================================================
    // PHASE 0: BEHAVIOR TRACKING
    // ============================================================
    trackBehaviorEvent('quest_completed', { 
      questId: context.quest.id, 
      difficulty: context.difficulty,
      xp: baseXp 
    });

    // --- Variable Reward Logic ---
    let weights = {
      none: 0.60,
      small: 0.25,
      medium: 0.12,
      jackpot: 0.03,
    };

    // Initialize Meta Skills if missing
    const metaSkills = state.user.metaSkills || {
      focus: { type: 'focus', level: 1, xp: 0, xpToNext: 100, benefits: [] },
      discipline: { type: 'discipline', level: 1, xp: 0, xpToNext: 100, benefits: [] },
      consistency: { type: 'consistency', level: 1, xp: 0, xpToNext: 100, benefits: [] }
    };

    const isLastTaskOfDay = state.quests.filter(q => q.completed).length + 1 === state.quests.length && state.quests.length > 0;
    const xpToLevel = (state.user.xpToNext || 100) - (state.user.xp || 0);
    const tasksCompletedToday = state.user.tasksCompletedToday || 0;

    // Context Modifiers
    if (isLastTaskOfDay) weights.jackpot += 0.05;
    if (xpToLevel < 30) weights.medium += 0.10;
    if (context.streak >= 7) weights.small += 0.15; // Streak fusion
    
    // Meta Skill Passive Bonuses
    // Focus gives +1% jackpot chance and +2% medium chance per level above 1
    const focusBonus = Math.max(0, metaSkills.focus.level - 1);
    weights.jackpot += focusBonus * 0.01;
    weights.medium += focusBonus * 0.02;

    // Discipline gives decay resistance (handled in decay system normally, but here we can give small boost)
    // Consistency gives base XP multiplier
    const consistencyMultiplier = 1 + (Math.max(0, metaSkills.consistency.level - 1) * 0.02);
    earnedXp *= consistencyMultiplier;


    // Control Illusion: back-to-back completion
    const lastQuestTime = state.user.lastQuestCompletedAt ? new Date(state.user.lastQuestCompletedAt).getTime() : 0;
    const timeSinceLastQuest = Date.now() - lastQuestTime;
    const isBackToBack = timeSinceLastQuest > 0 && timeSinceLastQuest < 2 * 60 * 60 * 1000; // within 2 hours
    if (isBackToBack) {
      weights.medium += 0.15;
    }

    // Premium Boost
    if (state.user.isPremium) {
      weights.medium += 0.05;
      weights.jackpot += 0.02;
    }

    // Anti-Abuse (Gizli Nerf)
    if (tasksCompletedToday > 10) {
      weights.small *= 0.7;
      weights.medium *= 0.5;
      weights.jackpot *= 0.3;
    }

    // Cooldown logic
    const jackpotCooldown = state.user.jackpotCooldown || 0;
    if (jackpotCooldown > 0) {
      weights.jackpot = 0;
    }

    // Normalize weights
    const totalWeight = weights.none + weights.small + weights.medium + weights.jackpot;
    weights.none /= totalWeight;
    weights.small /= totalWeight;
    weights.medium /= totalWeight;
    weights.jackpot /= totalWeight;

    // Roll
    const roll = Math.random();
    let selectedTier: import('../types').RewardTier = 'none';
    let cumulative = 0;
    
    if (roll < (cumulative += weights.none)) selectedTier = 'none';
    else if (roll < (cumulative += weights.small)) selectedTier = 'small';
    else if (roll < (cumulative += weights.medium)) selectedTier = 'medium';
    else selectedTier = 'jackpot';

    // Near Miss Effect
    if (selectedTier === 'none') {
      const nearMissChance = 0.15;
      if (Math.random() < nearMissChance && (isBackToBack || isLastTaskOfDay)) {
        selectedTier = 'near_miss';
      }
    }

    // Identity Roll
    let identityTitle = '';
    // if 5th task of the day, OR hitting a streak milestone (e.g. 10, 20, 30) on first task
    if (tasksCompletedToday + 1 === 5) {
      selectedTier = 'identity';
      identityTitle = 'FOCUS MASTER';
    } else if (context.streak > 0 && context.streak % 10 === 0 && tasksCompletedToday === 0) {
      selectedTier = 'identity';
      identityTitle = 'DISCIPLINE ELITE';
    }

    // Check for identity rewards using the service
    const identityChecks = checkIdentityRewards({
      questsCompletedToday: tasksCompletedToday + 1,
      currentStreak: context.streak,
      consecutiveQuests: getSessionChain().consecutiveQuests + 1,
      totalQuests: state.user.totalQuests || 0,
      daysActive: 0, // TODO: track days active
      perfectWeek: false, // TODO: track perfect week
      streakSaved: false, // TODO: track streak saved
    });

    // If identity reward qualifies, override tier
    if (identityChecks.length > 0 && identityChecks[0].qualifies) {
      selectedTier = 'identity';
      identityTitle = identityChecks[0].reward?.title || identityTitle;
    }

    // Apply Reward XP
    let rewardXp = 0;
    if (selectedTier === 'small') rewardXp = 10;
    else if (selectedTier === 'medium') rewardXp = 25;
    else if (selectedTier === 'jackpot') rewardXp = 50;
    else if (selectedTier === 'identity') rewardXp = 100; // Identity reward gives massive XP

    earnedXp += rewardXp;

    // Session Chain Bonus
    const currentChain = getSessionChain();
    const sessionBonus = calculateSessionBonus(currentChain);
    earnedXp *= sessionBonus;

    // Increment session chain
    const updatedChain = incrementSessionChain();

    // Meta Skills Progress calculation
    // Focus: gains XP on task complete, extra for medium/jackpot
    metaSkills.focus.xp += 10 + (selectedTier === 'medium' ? 10 : selectedTier === 'jackpot' ? 20 : 0);
    // Discipline: gains XP based on streak multiplier
    metaSkills.discipline.xp += 10 * (1 + (context.streak * 0.1));
    // Consistency: gains XP heavily on last task of day
    if (isLastTaskOfDay) metaSkills.consistency.xp += 50;

    // Check Meta Skill level ups (100 XP per level)
    ['focus', 'discipline', 'consistency'].forEach((skill) => {
      const key = skill as keyof typeof metaSkills;
      while (metaSkills[key].xp >= metaSkills[key].level * 100) {
        metaSkills[key].xp -= metaSkills[key].level * 100;
        metaSkills[key].level++;
        metaSkills[key].xpToNext = metaSkills[key].level * 100;
      }
    });

    // Set Reward Event for UI
    if (selectedTier !== 'none') {
      result.rewardEvent = {
        tier: selectedTier,
        amount: rewardXp,
        questTitle: context.quest.title,
        timestamp: now,
        ...(identityTitle && { identityTitle })
      };

      // Track reward shown
      trackBehaviorEvent('reward_shown', { 
        tier: selectedTier, 
        amount: rewardXp,
        ...(identityTitle && { identityTitle })
      });

      // Track identity reward separately
      if (selectedTier === 'identity') {
        trackBehaviorEvent('identity_shown', { 
          title: identityTitle 
        });
      }
    }

    // Add session chain hook for UI
    result.sessionChainHook = getSessionChainHook(updatedChain);

    // Add meta skills to result
    result.metaSkills = metaSkills;

    // Add anticipation hint for curiosity
    const anticipationHint = getAnticipationHint();
    if (anticipationHint) {
      result.anticipationHint = {
        type: anticipationHint.type,
        message: anticipationHint.message,
      };

      // Track anticipation hint shown
      trackBehaviorEvent('anticipation_hint_shown', { 
        type: anticipationHint.type 
      });
    }

    // Track skill level up if happened
    ['focus', 'discipline', 'consistency'].forEach((skill) => {
      const key = skill as keyof typeof metaSkills;
      while (metaSkills[key].xp >= metaSkills[key].level * 100) {
        metaSkills[key].xp -= metaSkills[key].level * 100;
        metaSkills[key].level++;
        metaSkills[key].xpToNext = metaSkills[key].level * 100;

        // Track skill level up
        trackBehaviorEvent('skill_level_up', { 
          skill: skill,
          level: metaSkills[key].level 
        });
      }
    });

    // --- End Variable Reward Logic ---

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
    
    // Update Reward System Memory
    state.user.tasksCompletedToday = tasksCompletedToday + 1;
    state.user.jackpotCooldown = Math.max(0, jackpotCooldown - 1);
    state.user.metaSkills = metaSkills;
    
    if (result.rewardEvent && result.rewardEvent.tier !== 'near_miss') {
      state.user.lastReward = {
        tier: result.rewardEvent.tier,
        amount: result.rewardEvent.amount,
        timestamp: now
      };
      if (result.rewardEvent.tier === 'jackpot') {
        state.user.jackpotCooldown = 2; // disable jackpot for next 2 tasks
      }
    }

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

