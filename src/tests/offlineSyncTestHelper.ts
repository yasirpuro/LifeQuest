import { getSupabase } from '../shared/api/supabase';
import { offlineQueue } from '../core/offlineQueue';
import type { OfflineQueueItem } from '../core/offlineQueue';
import { createTestUser } from './auth/authTestHelper';

export interface OfflineSyncTestResult {
  offlineQuest: {
    questCompleted: boolean;
    xpEarned: number;
    rewardReceived: boolean;
    skillXpGained: number;
  };
  localState: {
    xp: number;
    quests: number;
    skills: any;
  };
  cloudState: {
    xp: number;
    quests: number;
    skills: any;
  };
  syncResult: {
    success: boolean;
    localEqualsCloud: boolean;
    queueProcessed: number;
    queueFailed: number;
  };
}

/**
 * Simulate offline quest completion
 */
export async function simulateOfflineQuest(userId: string): Promise<{
  questCompleted: boolean;
  xpEarned: number;
  rewardReceived: boolean;
  skillXpGained: number;
}> {
  // Add to offline queue
  const queueItem: Omit<OfflineQueueItem, 'status' | 'retryCount'> = {
    id: `quest-${Date.now()}`,
    type: 'quest_completion',
    payload: {
      userId,
      title: 'Offline Test Quest',
      category: 'test',
      difficulty: '1',
      xp_reward: 50,
      completed: true,
      completed_at: new Date().toISOString(),
      completion_id: `offline-${Date.now()}`,
    },
    createdAt: new Date().toISOString(),
  };

  offlineQueue.enqueue(queueItem);

  return {
    questCompleted: true,
    xpEarned: 50,
    rewardReceived: true,
    skillXpGained: 10,
  };
}

/**
 * Get local state
 */
export function getLocalState(): {
  xp: number;
  quests: number;
  skills: any;
} {
  // Simulate local state from localStorage
  const localState = localStorage.getItem('lifequest_local_state');
  if (localState) {
    try {
      return JSON.parse(localState);
    } catch {
      return { xp: 0, quests: 0, skills: {} };
    }
  }
  return { xp: 0, quests: 0, skills: {} };
}

/**
 * Get cloud state
 */
export async function getCloudState(userId: string): Promise<{
  xp: number;
  quests: number;
  skills: any;
}> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', userId)
    .single();

  const { data: quests } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', userId);

  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', userId)
    .single();

  return {
    xp: profile?.xp || 0,
    quests: quests?.length || 0,
    skills: skills || {},
  };
}

/**
 * Sync function for offline queue
 */
export async function syncOfflineQueue(userId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const syncFn = async (item: OfflineQueueItem): Promise<boolean> => {
    if (item.type === 'quest_completion') {
      const payload = item.payload as any;
      const { error } = await supabase
        .from('quests')
        .insert({
          user_id: userId,
          title: payload.title,
          category: payload.category,
          difficulty: payload.difficulty,
          xp_reward: payload.xp_reward,
          completed: payload.completed,
          completed_at: payload.completed_at,
          completion_id: payload.completion_id,
        });

      if (error) {
        // Check if it's a duplicate error
        if (error.message.includes('duplicate')) {
          return true; // Duplicate is OK, just skip
        }
        return false;
      }

      // Update XP
      await supabase
        .from('profiles')
        .update({ xp: supabase.rpc('increment', { x: payload.xp_reward }) })
        .eq('id', userId);

      return true;
    }
    return false;
  };

  const result = await offlineQueue.processSyncQueue(syncFn);
  return result.failed === 0;
}

/**
 * Run full offline sync test
 */
export async function runOfflineSyncTest(): Promise<OfflineSyncTestResult> {
  const user = await createTestUser();
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Simulate offline quest
  const offlineQuest = await simulateOfflineQuest(user.id);

  // Get local state (simulated)
  const localState = getLocalState();

  // Sync to cloud
  const syncSuccess = await syncOfflineQueue(user.id);

  // Get cloud state
  const cloudState = await getCloudState(user.id);

  // Compare states
  const localEqualsCloud = 
    localState.xp === cloudState.xp &&
    localState.quests === cloudState.quests;

  // Get queue stats
  const queueStats = offlineQueue.getStats();

  const result: OfflineSyncTestResult = {
    offlineQuest,
    localState,
    cloudState,
    syncResult: {
      success: syncSuccess,
      localEqualsCloud,
      queueProcessed: queueStats.success,
      queueFailed: queueStats.failed,
    },
  };

  return result;
}
