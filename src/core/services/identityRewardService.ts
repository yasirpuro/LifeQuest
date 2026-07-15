import type { IdentityReward } from '../../types';

/**
 * Identity Reward Service
 * Meaning injection beyond dopamine - character-defining achievements
 */

// Identity reward definitions - REDUCED to 5 core rewards for value
const IDENTITY_REWARDS: Omit<IdentityReward, 'id' | 'earnedAt'>[] = [
  // Core Focus Reward
  {
    title: 'FOCUS MASTER',
    description: 'Bugün 5 görev tamamladın',
    icon: '🎯',
    rarity: 'legendary',
    category: 'focus',
  },
  
  // Core Discipline Rewards
  {
    title: 'DISCIPLINE ELITE',
    description: '7 gün üst üste görev tamamladın',
    icon: '🔥',
    rarity: 'legendary',
    category: 'discipline',
  },
  {
    title: 'IRON WILL',
    description: '14 gün streak korudun',
    icon: '💪',
    rarity: 'epic',
    category: 'discipline',
  },
  
  // Core Consistency Reward
  {
    title: 'PERFECT WEEK',
    description: 'Haftada her gün görev tamamladın',
    icon: '🌟',
    rarity: 'epic',
    category: 'consistency',
  },
  
  // Rare Streak Reward
  {
    title: 'UNSTOPPABLE',
    description: '50 günlük streak',
    icon: '🚀',
    rarity: 'legendary',
    category: 'streak',
  },
];

export interface IdentityRewardCheck {
  qualifies: boolean;
  reward?: IdentityReward;
  reason?: string;
}

/**
 * Check if user qualifies for identity rewards based on recent behavior
 */
export function checkIdentityRewards(context: {
  questsCompletedToday: number;
  currentStreak: number;
  consecutiveQuests: number;
  totalQuests: number;
  daysActive: number;
  perfectWeek: boolean;
  streakSaved: boolean;
}): IdentityRewardCheck[] {
  const checks: IdentityRewardCheck[] = [];
  
  // Focus rewards
  if (context.questsCompletedToday >= 5) {
    const reward = IDENTITY_REWARDS.find(r => r.title === 'FOCUS MASTER');
    if (reward) {
      checks.push({
        qualifies: true,
        reward: { ...reward, id: `focus_master_${Date.now()}`, earnedAt: new Date().toISOString() },
        reason: '5 quests completed today',
      });
    }
  }
  
  if (context.consecutiveQuests >= 10) {
    const reward = IDENTITY_REWARDS.find(r => r.title === 'FOCUS WARRIOR');
    if (reward) {
      checks.push({
        qualifies: true,
        reward: { ...reward, id: `focus_warrior_${Date.now()}`, earnedAt: new Date().toISOString() },
        reason: '10 consecutive quests',
      });
    }
  }
  
  // Discipline rewards
  if (context.currentStreak >= 7) {
    const reward = IDENTITY_REWARDS.find(r => r.title === 'DISCIPLINE ELITE');
    if (reward) {
      checks.push({
        qualifies: true,
        reward: { ...reward, id: `discipline_elite_${Date.now()}`, earnedAt: new Date().toISOString() },
        reason: '7 day streak',
      });
    }
  }
  
  if (context.currentStreak >= 14) {
    const reward = IDENTITY_REWARDS.find(r => r.title === 'IRON WILL');
    if (reward) {
      checks.push({
        qualifies: true,
        reward: { ...reward, id: `iron_will_${Date.now()}`, earnedAt: new Date().toISOString() },
        reason: '14 day streak',
      });
    }
  }
  
  if (context.currentStreak >= 50) {
    const reward = IDENTITY_REWARDS.find(r => r.title === 'UNSTOPPABLE');
    if (reward) {
      checks.push({
        qualifies: true,
        reward: { ...reward, id: `unstoppable_${Date.now()}`, earnedAt: new Date().toISOString() },
        reason: '50 day streak',
      });
    }
  }
  
  if (context.daysActive >= 30) {
    const reward = IDENTITY_REWARDS.find(r => r.title === 'CONSISTENCY KING');
    if (reward) {
      checks.push({
        qualifies: true,
        reward: { ...reward, id: `consistency_king_${Date.now()}`, earnedAt: new Date().toISOString() },
        reason: '30 days active',
      });
    }
  }
  
  // Consistency rewards
  if (context.perfectWeek) {
    const reward = IDENTITY_REWARDS.find(r => r.title === 'PERFECT WEEK');
    if (reward) {
      checks.push({
        qualifies: true,
        reward: { ...reward, id: `perfect_week_${Date.now()}`, earnedAt: new Date().toISOString() },
        reason: 'Perfect week completed',
      });
    }
  }
  
  // Streak rewards
  if (context.streakSaved) {
    const reward = IDENTITY_REWARDS.find(r => r.title === 'STREAK SAVIOR');
    if (reward) {
      checks.push({
        qualifies: true,
        reward: { ...reward, id: `streak_savior_${Date.now()}`, earnedAt: new Date().toISOString() },
        reason: 'Streak saved at last minute',
      });
    }
  }
  
  // Milestone rewards
  if (context.totalQuests >= 100) {
    const reward = IDENTITY_REWARDS.find(r => r.title === 'CENTURION');
    if (reward) {
      checks.push({
        qualifies: true,
        reward: { ...reward, id: `centurion_${Date.now()}`, earnedAt: new Date().toISOString() },
        reason: '100 quests completed',
      });
    }
  }
  
  if (context.totalQuests >= 500) {
    const reward = IDENTITY_REWARDS.find(r => r.title === 'QUEST MASTER');
    if (reward) {
      checks.push({
        qualifies: true,
        reward: { ...reward, id: `quest_master_${Date.now()}`, earnedAt: new Date().toISOString() },
        reason: '500 quests completed',
      });
    }
  }
  
  return checks;
}

/**
 * Get all available identity rewards for display
 */
export function getAllIdentityRewards(): Omit<IdentityReward, 'id' | 'earnedAt'>[] {
  return IDENTITY_REWARDS;
}

/**
 * Get identity rewards by category
 */
export function getIdentityRewardsByCategory(category: IdentityReward['category']): Omit<IdentityReward, 'id' | 'earnedAt'>[] {
  return IDENTITY_REWARDS.filter(r => r.category === category);
}
