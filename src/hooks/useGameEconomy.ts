/**
 * Game Economy Engine:
 * - XP inflation control (soft cap, diminishing returns)
 * - Leveling progression curve
 * - Achievement/milestone system
 * - Cosmetic rewards (perks, titles)
 */

export interface Milestone {
  id: string;
  level: number;
  xpRequired: number;
  title: string;
  description: string;
  reward: 'title' | 'cosmetic' | 'feature_unlock' | 'recovery_token';
  rewardId: string; // cosmetic name, feature name, etc.
  unlocked: boolean;
}

export interface UserCosmetics {
  titles: string[];
  activeTitle: string | null;
  themes: string[]; // color themes
  badges: string[];
}

// XP to level progression (soft cap + diminishing returns)
const LEVEL_CAP = 100;
const BASE_XP_FOR_NEXT = 100;
const SOFTCAP_START = 50; // at level 50+, diminishing returns
const SOFTCAP_FACTOR = 1.1; // each level after 50: +10% harder

/**
 * Calculate XP required for next level (with soft cap)
 */
export function calculateXpForLevel(level: number): number {
  if (level >= LEVEL_CAP) return Infinity;

  const base = BASE_XP_FOR_NEXT * level;

  if (level < SOFTCAP_START) return base;

  // Diminishing returns: multiply by softcap factor per level above 50
  const excessLevels = level - SOFTCAP_START;
  return Math.floor(base * Math.pow(SOFTCAP_FACTOR, excessLevels));
}

/**
 * Apply XP inflation cap (max XP per day)
 */
export function applyXpCap(earnedXp: number, dailyXpEarned: number, dailyXpCap: number = 1000): number {
  const remaining = Math.max(0, dailyXpCap - dailyXpEarned);
  return Math.min(earnedXp, remaining);
}

/**
 * Get milestones for user
 */
export function getMilestones(currentLevel: number): Milestone[] {
  const milestones: Milestone[] = [
    {
      id: 'level-5',
      level: 5,
      xpRequired: 500,
      title: 'Adventurer I',
      description: 'Reached level 5',
      reward: 'cosmetic',
      rewardId: 'title_adventurer',
      unlocked: currentLevel >= 5,
    },
    {
      id: 'level-10',
      level: 10,
      xpRequired: 1500,
      title: 'Skilled Learner',
      description: 'Reached level 10',
      reward: 'feature_unlock',
      rewardId: 'unlock_analytics',
      unlocked: currentLevel >= 10,
    },
    {
      id: 'level-25',
      level: 25,
      xpRequired: 5000,
      title: 'Master of Skills',
      description: 'Reached level 25',
      reward: 'recovery_token',
      rewardId: 'recovery_token',
      unlocked: currentLevel >= 25,
    },
    {
      id: 'level-50',
      level: 50,
      xpRequired: 15000,
      title: 'Grandmaster',
      description: 'Reached level 50 — Soft cap begins',
      reward: 'cosmetic',
      rewardId: 'theme_premium',
      unlocked: currentLevel >= 50,
    },
    {
      id: 'level-100',
      level: 100,
      xpRequired: 999999,
      title: 'Legend',
      description: 'Reached level 100 — Ultimate rank',
      reward: 'feature_unlock',
      rewardId: 'unlock_leaderboard',
      unlocked: currentLevel >= 100,
    },
  ];

  return milestones;
}

/**
 * Check for newly unlocked milestone
 */
export function checkNewMilestones(prevLevel: number, newLevel: number): Milestone[] {
  if (newLevel <= prevLevel) return [];

  const milestones = getMilestones(newLevel);
  return milestones.filter(m => m.level > prevLevel && m.level <= newLevel);
}

/**
 * Reward cosmetic title
 */
export function grantTitle(cosmetcs: UserCosmetics, titleId: string): UserCosmetics {
  if (!cosmetcs.titles.includes(titleId)) {
    cosmetcs.titles.push(titleId);
  }
  if (!cosmetcs.activeTitle) {
    cosmetcs.activeTitle = titleId;
  }
  return cosmetcs;
}

/**
 * Reward theme/cosmetic
 */
export function grantTheme(cosmetics: UserCosmetics, themeId: string): UserCosmetics {
  if (!cosmetics.themes.includes(themeId)) {
    cosmetics.themes.push(themeId);
  }
  return cosmetics;
}
