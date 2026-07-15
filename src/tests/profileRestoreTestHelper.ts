import { getSupabase } from '../shared/api/supabase';
import { createTestUser } from './auth/authTestHelper';

export interface RestoreScenario {
  profile: {
    level: number;
    xp: number;
    streak: number;
    premium_status: boolean;
    last_active: string;
  };
  skills: {
    focus_level: number;
    discipline_level: number;
    consistency_level: number;
  };
  quests: {
    completed: number;
    total: number;
  };
  rewards: {
    identity_rewards: number;
    xp_rewards: number;
  };
  analytics: {
    event_count: number;
  };
}

/**
 * Create a restore scenario with test data
 */
export async function createRestoreScenario(): Promise<RestoreScenario> {
  const user = await createTestUser();
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Update profile with test data
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      level: 4,
      xp: 380,
      streak: 7,
      premium_status: false,
      last_active: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (profileError) {
    throw new Error(`Failed to update profile: ${profileError.message}`);
  }

  // Update skills with test data
  const { error: skillsError } = await supabase
    .from('skills')
    .update({
      focus_level: 3,
      discipline_level: 2,
      consistency_level: 3,
    })
    .eq('user_id', user.id);

  if (skillsError) {
    throw new Error(`Failed to update skills: ${skillsError.message}`);
  }

  // Insert test quests
  const testQuests = Array.from({ length: 5 }, (_, i) => ({
    user_id: user.id,
    title: `Test Quest ${i + 1}`,
    category: 'test',
    difficulty: '1',
    xp_reward: 20,
    completed: true,
    completed_at: new Date().toISOString(),
    completion_id: `test-quest-${i}-${Date.now()}`,
  }));

  const { error: questsError } = await supabase
    .from('quests')
    .insert(testQuests);

  if (questsError) {
    throw new Error(`Failed to insert test quests: ${questsError.message}`);
  }

  // Insert test analytics events
  const testEvents = Array.from({ length: 10 }, (_, i) => ({
    user_id: user.id,
    event_type: 'quest_completed',
    event_data: { test: true, index: i },
    created_at: new Date().toISOString(),
  }));

  const { error: analyticsError } = await supabase
    .from('analytics_events')
    .insert(testEvents);

  if (analyticsError) {
    throw new Error(`Failed to insert test analytics: ${analyticsError.message}`);
  }

  const scenario: RestoreScenario = {
    profile: {
      level: 4,
      xp: 380,
      streak: 7,
      premium_status: false,
      last_active: new Date().toISOString(),
    },
    skills: {
      focus_level: 3,
      discipline_level: 2,
      consistency_level: 3,
    },
    quests: {
      completed: 5,
      total: 5,
    },
    rewards: {
      identity_rewards: 5,
      xp_rewards: 100,
    },
    analytics: {
      event_count: 10,
    },
  };

  return scenario;
}

/**
 * Get current restore scenario from database
 */
export async function getCurrentRestoreScenario(userId: string): Promise<RestoreScenario> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    throw new Error(`Failed to get profile: ${profileError?.message}`);
  }

  // Get skills
  const { data: skills, error: skillsError } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (skillsError || !skills) {
    throw new Error(`Failed to get skills: ${skillsError?.message}`);
  }

  // Get quests
  const { data: quests, error: questsError } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', userId);

  if (questsError) {
    throw new Error(`Failed to get quests: ${questsError.message}`);
  }

  // Get analytics
  const { data: analytics, error: analyticsError } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('user_id', userId);

  if (analyticsError) {
    throw new Error(`Failed to get analytics: ${analyticsError.message}`);
  }

  const scenario: RestoreScenario = {
    profile: {
      level: profile.level,
      xp: profile.xp,
      streak: profile.streak,
      premium_status: profile.premium_status,
      last_active: profile.last_active,
    },
    skills: {
      focus_level: skills.focus_level,
      discipline_level: skills.discipline_level,
      consistency_level: skills.consistency_level,
    },
    quests: {
      completed: quests.filter(q => q.completed).length,
      total: quests.length,
    },
    rewards: {
      identity_rewards: quests.filter(q => q.completed).length,
      xp_rewards: quests.filter(q => q.completed).reduce((sum, q) => sum + q.xp_reward, 0),
    },
    analytics: {
      event_count: analytics.length,
    },
  };

  return scenario;
}

/**
 * Compare two restore scenarios
 */
export function compareRestoreScenarios(
  before: RestoreScenario,
  after: RestoreScenario
): { success: boolean; differences: string[] } {
  const differences: string[] = [];

  if (before.profile.level !== after.profile.level) {
    differences.push(`Level: ${before.profile.level} → ${after.profile.level}`);
  }
  if (before.profile.xp !== after.profile.xp) {
    differences.push(`XP: ${before.profile.xp} → ${after.profile.xp}`);
  }
  if (before.profile.streak !== after.profile.streak) {
    differences.push(`Streak: ${before.profile.streak} → ${after.profile.streak}`);
  }
  if (before.profile.premium_status !== after.profile.premium_status) {
    differences.push(`Premium: ${before.profile.premium_status} → ${after.profile.premium_status}`);
  }
  if (before.skills.focus_level !== after.skills.focus_level) {
    differences.push(`Focus Level: ${before.skills.focus_level} → ${after.skills.focus_level}`);
  }
  if (before.skills.discipline_level !== after.skills.discipline_level) {
    differences.push(`Discipline Level: ${before.skills.discipline_level} → ${after.skills.discipline_level}`);
  }
  if (before.skills.consistency_level !== after.skills.consistency_level) {
    differences.push(`Consistency Level: ${before.skills.consistency_level} → ${after.skills.consistency_level}`);
  }
  if (before.quests.completed !== after.quests.completed) {
    differences.push(`Quests Completed: ${before.quests.completed} → ${after.quests.completed}`);
  }
  if (before.analytics.event_count !== after.analytics.event_count) {
    differences.push(`Analytics Events: ${before.analytics.event_count} → ${after.analytics.event_count}`);
  }

  return {
    success: differences.length === 0,
    differences,
  };
}
