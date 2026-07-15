import { getSupabase } from '../../shared/api/supabase';

export interface TestUser {
  id: string;
  email: string;
  password: string;
}

let testUser: TestUser | null = null;

/**
 * Create a test user for testing purposes
 */
export async function createTestUser(email?: string, password?: string): Promise<TestUser> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const testEmail = email || `test-${Date.now()}@lifequest.test`;
  const testPassword = password || 'TestPassword123!';

  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });

  if (error) {
    throw new Error(`Failed to create test user: ${error.message}`);
  }

  if (!data.user) {
    throw new Error('No user returned from signup');
  }

  testUser = {
    id: data.user.id,
    email: testEmail,
    password: testPassword,
  };

  return testUser;
}

/**
 * Login with test user
 */
export async function loginTestUser(): Promise<TestUser> {
  if (!testUser) {
    throw new Error('No test user available. Call createTestUser first.');
  }

  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: testUser.email,
    password: testUser.password,
  });

  if (error) {
    throw new Error(`Failed to login test user: ${error.message}`);
  }

  if (!data.user) {
    throw new Error('No user returned from login');
  }

  return testUser;
}

/**
 * Logout current user
 */
export async function logoutTestUser(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Failed to logout: ${error.message}`);
  }
}

/**
 * Clear test session (logout and clear local storage)
 */
export async function clearTestSession(): Promise<void> {
  await logoutTestUser();
  localStorage.clear();
  testUser = null;
}

/**
 * Get current test user
 */
export function getCurrentTestUser(): TestUser | null {
  return testUser;
}

/**
 * Check if current session is valid
 */
export async function checkSessionValid(): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return false;
  }

  return !!data.session;
}
