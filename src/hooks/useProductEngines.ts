import { useEffect } from 'react';
import { useApp } from './useApp';
import { generateDailyPlan, saveDailyPlan, getDailyPlan } from './useDailyLoop';
import { applyDecayToAllSkills } from './useSkillDecay';
import { cleanExpiredTokens } from './useRecoverySystem';

/**
 * useProductEngines: Integrate all engines (daily loop, decay, recovery, retention)
 * Called on app startup and periodically
 */
export function useProductEngines() {
  const { skillEngine, user, setUser, quests } = useApp();

  // Initialize daily plan on app load
  useEffect(() => {
    if (!skillEngine) return;

    const plan = getDailyPlan();
    if (!plan) {
      // Generate new daily plan
      const newPlan = generateDailyPlan(quests, skillEngine.progressMap);
      saveDailyPlan(newPlan);
    }
  }, [skillEngine, quests]);

  // Apply skill decay periodically
  useEffect(() => {
    if (!skillEngine) return;
    const interval = setInterval(() => {
      const { updated, warnings } = applyDecayToAllSkills(skillEngine.progressMap);
      // Update skill engine (will trigger save)
      Object.entries(updated).forEach(([skillId, skill]) => {
        skillEngine.progressMap[skillId] = skill;
      });
      if (warnings.length > 0) {
        console.log('[Decay] Warnings:', warnings);
      }
    }, 6 * 60 * 60 * 1000); // Every 6 hours

    return () => clearInterval(interval);
  }, [skillEngine]);

  // Update streak risk level every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!user.lastQuestCompletedAt) {
        setUser({ streakRiskLevel: 'critical' });
        return;
      }

      const now = new Date();
      const last = new Date(user.lastQuestCompletedAt);
      const daysInactive = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

      let risk: 'safe' | 'warning' | 'critical' = 'safe';
      if (daysInactive > 1) risk = 'critical';
      else if (daysInactive > 0.5) risk = 'warning';

      setUser({ streakRiskLevel: risk });
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user.lastQuestCompletedAt, setUser]);

  // Clean expired tokens periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!user.recoveryState) return;
      const cleaned = cleanExpiredTokens(user.recoveryState);
      setUser({ recoveryState: cleaned });
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(interval);
  }, [user.recoveryState, setUser]);

  return { planReady: !!getDailyPlan() };
}
