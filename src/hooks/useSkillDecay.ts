import type { SkillProgress } from '../types';

/**
 * Skill Decay System:
 * - Forgetting curve (Ebbinghaus)
 * - Inactivity penalty
 * - Mastery erosion
 */

const EBBINGHAUS_HALFLIFE = 7; // days to halve retention
// WEEK_MS removed (unused)

/**
 * Calculate decay based on days inactive
 * Ebbinghaus-inspired: retention = 2^(-days / halflife)
 * At 7 days: 50% retention
 * At 14 days: 25% retention
 */
export function calculateMasteryDecay(skill: SkillProgress, nowIso: string = new Date().toISOString()): number {
  if (!skill.lastPracticed) return skill.mastery; // no decay if never practiced

  const lastDate = new Date(skill.lastPracticed);
  const now = new Date(nowIso);
  const daysInactive = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

  // exponential decay: mastery * 2^(-days / halflife)
  const decayFactor = Math.pow(2, -(daysInactive / EBBINGHAUS_HALFLIFE));
  const newMastery = skill.mastery * decayFactor;

  // floor to prevent floating point noise
  return Math.max(0, Math.floor(newMastery * 100) / 100);
}

/**
 * Apply decay and check inactivity threshold
 * Returns updated skill + warning flag
 */
export function applyDecayToSkill(skill: SkillProgress, nowIso: string = new Date().toISOString()): { decayedSkill: SkillProgress; inactivityWarning: boolean } {
  const lastDecay = skill.lastDecayCheck ? new Date(skill.lastDecayCheck) : new Date(skill.lastPracticed || 0);
  const now = new Date(nowIso);

  // only apply decay if > 1 day has passed since last check
  const daysSinceLastDecay = (now.getTime() - lastDecay.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceLastDecay < 1) {
    return { decayedSkill: skill, inactivityWarning: false };
  }

  const decayedMastery = calculateMasteryDecay(skill, nowIso);
  const inactivityDays = skill.lastPracticed ? (now.getTime() - new Date(skill.lastPracticed).getTime()) / (1000 * 60 * 60 * 24) : 0;

  return {
    decayedSkill: {
      ...skill,
      mastery: decayedMastery,
      lastDecayCheck: nowIso,
      decayRate: Math.min(1, 0.05 + decayedMastery * 0.01), // higher mastery = slower decay
    },
    inactivityWarning: inactivityDays > 3 && decayedMastery < skill.mastery * 0.8, // drop > 20%
  };
}

/**
 * Apply decay to entire skill set
 */
export function applyDecayToAllSkills(
  skillMap: Record<string, SkillProgress>,
  nowIso: string = new Date().toISOString()
): { updated: Record<string, SkillProgress>; warnings: string[] } {
  const warnings: string[] = [];
  const updated: Record<string, SkillProgress> = {};

  for (const [skillId, skill] of Object.entries(skillMap)) {
    const { decayedSkill, inactivityWarning } = applyDecayToSkill(skill, nowIso);
    updated[skillId] = decayedSkill;

    if (inactivityWarning) {
      warnings.push(`${skillId} mastery dropping due to inactivity`);
    }
  }

  return { updated, warnings };
}

/**
 * Check if skill needs immediate review
 */
export function isSkillAtRisk(skill: SkillProgress): boolean {
  if (!skill.lastPracticed) return true; // never practiced
  const daysInactive = (Date.now() - new Date(skill.lastPracticed).getTime()) / (1000 * 60 * 60 * 24);
  return daysInactive > 7 || (daysInactive > 3 && skill.mastery < 30);
}

/**
 * Reset decay (on practice)
 */
export function resetSkillDecay(skill: SkillProgress, nowIso: string = new Date().toISOString()): SkillProgress {
  return {
    ...skill,
    lastPracticed: nowIso,
    lastDecayCheck: nowIso,
    decayRate: 0.05, // reset to baseline
  };
}
