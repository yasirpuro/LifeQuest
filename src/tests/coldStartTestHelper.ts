import { getSupabase } from '../shared/api/supabase';
import { createTestUser, loginTestUser, logoutTestUser } from './auth/authTestHelper';

export interface ColdStartScenario {
  userId: string;
  createdAt: string;
  lastActiveAt: string;
  sessionDuration: number;
  daysUsed: number;
}

/**
 * Create a cold start scenario
 */
export async function createColdStartScenario(): Promise<ColdStartScenario> {
  const user = await createTestUser();
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const now = new Date();
  const createdAt = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
  const lastActiveAt = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  // Update profile with cold start data
  const { error } = await supabase
    .from('profiles')
    .update({
      last_active: lastActiveAt.toISOString(),
      created_at: createdAt.toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    throw new Error(`Failed to update profile for cold start: ${error.message}`);
  }

  const scenario: ColdStartScenario = {
    userId: user.id,
    createdAt: createdAt.toISOString(),
    lastActiveAt: lastActiveAt.toISOString(),
    sessionDuration: 5 * 24 * 60 * 60, // 5 days in seconds
    daysUsed: 5,
  };

  return scenario;
}

/**
 * Simulate days of usage
 */
export async function simulateDays(days: number, userId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const now = new Date();
  const lastActive = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const { error } = await supabase
    .from('profiles')
    .update({
      last_active: lastActive.toISOString(),
      streak: days,
    })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to simulate days: ${error.message}`);
  }
}

/**
 * Close app simulation
 */
export async function closeAppSimulation(): Promise<void> {
  await logoutTestUser();
  // Clear local storage to simulate app closure
  localStorage.clear();
}

/**
 * Wait simulation (for testing purposes)
 */
export async function waitSimulation(days: number): Promise<void> {
  // In real testing, this would be a time delay
  // For now, just update the last_active timestamp
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No user found');
  }

  const now = new Date();
  const lastActive = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const { error } = await supabase
    .from('profiles')
    .update({
      last_active: lastActive.toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    throw new Error(`Failed to wait simulation: ${error.message}`);
  }
}

/**
 * Open app simulation
 */
export async function openAppSimulation(): Promise<{ sessionRestored: boolean; localStorageRestored: boolean; cloudSynced: boolean }> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Check session
  const { data: { session } } = await supabase.auth.getSession();
  const sessionRestored = !!session;

  // Check local storage
  const localStorageRestored = localStorage.length > 0;

  // Check cloud sync
  let cloudSynced = false;
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    cloudSynced = !!profile;
  }

  return {
    sessionRestored,
    localStorageRestored,
    cloudSynced,
  };
}

/**
 * Run full cold start test
 */
export async function runColdStartTest(): Promise<{
  success: boolean;
  results: {
    sessionRestored: boolean;
    localStorageRestored: boolean;
    cloudSynced: boolean;
    lastActiveUpdated: boolean;
  };
}> {
  try {
    // Create scenario
    const scenario = await createColdStartScenario();
    
    // Simulate 5 days of usage
    await simulateDays(5, scenario.userId);
    
    // Close app
    await closeAppSimulation();
    
    // Wait 7 days
    await waitSimulation(7);
    
    // Open app (login)
    await loginTestUser();
    
    // Check results
    const results = await openAppSimulation();
    
    // Check last_active updated
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No user found');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('last_active')
      .eq('id', user.id)
      .single();

    const lastActiveUpdated = profile ? 
      new Date(profile.last_active).getTime() > new Date(scenario.lastActiveAt).getTime() : 
      false;

    return {
      success: results.sessionRestored && results.cloudSynced && lastActiveUpdated,
      results: {
        ...results,
        lastActiveUpdated,
      },
    };
  } catch (error) {
    console.error('Cold start test failed:', error);
    return {
      success: false,
      results: {
        sessionRestored: false,
        localStorageRestored: false,
        cloudSynced: false,
        lastActiveUpdated: false,
      },
    };
  }
}
