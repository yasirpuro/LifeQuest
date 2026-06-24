/**
 * Growth & Retention Engine:
 * - Habit loop mechanics (cue → action → reward)
 * - Retention hooks (comeback mechanics, falling behind logic)
 * - Streak psychology (loss aversion, near-miss effects)
 */

export interface HabitCue {
  type: 'time' | 'location' | 'emotion' | 'trigger';
  text: string;
  trigger: string; // morning, after_lunch, evening, etc.
}

export interface HabitLoop {
  skillId: string;
  cue: HabitCue;
  action: string; // \"Complete daily quest\"
  reward: { xp: number; dopamine: number };
  frequency: 'daily' | 'weekly';
  consistency: number; // 0..100 (completion rate)
}

// habit loops storage key removed (unused)

/**
 * Build habit loop for skill
 */
export function createHabitLoop(skillId: string, skillName: string): HabitLoop {
  const cues: HabitCue[] = [
    { type: 'time', text: 'Sabah kahvesini yaparken', trigger: 'morning' },
    { type: 'time', text: 'Öğle yemeğinden sonra', trigger: 'after_lunch' },
    { type: 'time', text: 'Akşam yatmadan önce', trigger: 'evening' },
    { type: 'emotion', text: 'Boş zaman bulduğunda', trigger: 'free_time' },
  ];

  const randomCue = cues[Math.floor(Math.random() * cues.length)];

  return {
    skillId,
    cue: randomCue,
    action: `${skillName} practice quest'i tamamla`,
    reward: { xp: 50, dopamine: 8 },
    frequency: 'daily',
    consistency: 0,
  };
}

/**
 * Track habit consistency
 */
export function updateHabitConsistency(habit: HabitLoop, completed: boolean): HabitLoop {
  const completionRate = (habit.consistency * 9 + (completed ? 100 : 0)) / 10;
  return { ...habit, consistency: Math.round(completionRate) };
}

/**
 * Falling behind detection:
 * User missed multiple days or significantly behind goal
 */
export function getFallingBehindMessage(
  userStreak: number,
  avgStreak: number = 14,
  skillMastery: Record<string, number> = {}
): { isBehind: boolean; message: string; hookType: 'FOMO' | 'guilt' | 'progress' } {
  if (userStreak > avgStreak) {
    return { isBehind: false, message: '✨ Leading the pack!', hookType: 'progress' };
  }

  const weakSkills = Object.entries(skillMastery)
    .filter(([_, m]) => m < 30)
    .map(([id]) => id);

  if (userStreak === 0) {
    return {
      isBehind: true,
      message: `📉 Streak kaybettin. ${weakSkills.length} skill risk altında. Geri dön!`,
      hookType: 'guilt',
    };
  }

  if (userStreak < 5 && weakSkills.length > 0) {
    return {
      isBehind: true,
      message: `⚠️ Streak düşüşte. ${weakSkills[0]} önem kazanıyor!`,
      hookType: 'FOMO',
    };
  }

  return { isBehind: false, message: 'On track!', hookType: 'progress' };
}

/**
 * Streak psychology: near-miss effects
 * \"If you complete next quest, you'll reach X day streak!\"
 */
export function getStreakNearMissMessage(currentStreak: number): { show: boolean; milestone: number; message: string } {
  const milestones = [7, 14, 30, 60, 100];
  const nextMilestone = milestones.find(m => m > currentStreak);

  if (!nextMilestone) {
    return { show: false, milestone: 0, message: '' };
  }

  const daysRemaining = nextMilestone - currentStreak;

  if (daysRemaining <= 3) {
    return {
      show: true,
      milestone: nextMilestone,
      message: `🎯 Sadece ${daysRemaining} gün kaldı ${nextMilestone} günlük streak'e!`,
    };
  }

  return { show: false, milestone: 0, message: '' };
}

/**
 * Loss aversion messaging
 * \"Don't lose your X day streak\" is more powerful than \"Build X day streak\"
 */
export function getLossAversionMessage(currentStreak: number): string {
  if (currentStreak === 0) return '🔄 Streaks aynı anda birden fazla kabiliyetin var. Kaybetme!';
  if (currentStreak < 7) return `⚠️ ${currentStreak} günlük streak'i kaybetmeyin!`;
  if (currentStreak < 30) return `🔥 ${currentStreak} günlük güzel streak var. Bugün devam et!`;
  if (currentStreak < 100) return `💪 ${currentStreak} günlük harika streak! Bugün de devam et!`;
  return `👑 ${currentStreak} günlük efsane streak! Daha yüksek git!`;
}

/**
 * Comeback reward bonus calculation
 */
export function getComebackRewardBonus(inactiveDays: number, currentStreak: number): { xpBonus: number; recoveryMsg: string } {
  const baseBonus = Math.min(50, inactiveDays * 10); // 10% per day, max 50%
  const streakBonus = currentStreak > 0 ? 20 : 0; // extra if had streak
  const totalBonus = baseBonus + streakBonus;

  return {
    xpBonus: totalBonus,
    recoveryMsg: `🎉 Geri döndün! +${totalBonus}% XP comeback bonus!`,
  };
}

/**
 * Retention hook: \"you're falling behind\" notification
 */
export function getRetentionPushMessage(
  lastActiveDate: string,
  userLevel: number,
  friendsLevel: number
): { shouldPush: boolean; message: string } {
  const daysInactive = (Date.now() - new Date(lastActiveDate).getTime()) / (1000 * 60 * 60 * 24);

  if (daysInactive < 1) return { shouldPush: false, message: '' };

  if (daysInactive === 1) {
    return { shouldPush: true, message: '⏰ Bir görev kaldı streak kaybetmemek için!' };
  }

  if (daysInactive === 2) {
    return { shouldPush: true, message: '🔥 Streak kaybettin! Comeback bonus varken geri dön!' };
  }

  if (userLevel < friendsLevel) {
    return {
      shouldPush: true,
      message: `📊 Arkadaşların seni geçti! Pratik yap ve catch up et!`,
    };
  }

  return { shouldPush: false, message: '' };
}
