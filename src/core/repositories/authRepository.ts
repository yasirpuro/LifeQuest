import { getSupabase } from '../../shared/api/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { UserProfile } from '../../types';
import type { LoginCredentials, SignupCredentials } from '../../features/auth/authTypes';
import { 
  createSuccessResult, 
  createErrorResult, 
  RepositoryErrorCode,
  withRetry 
} from './baseRepository';
import type { Result } from './baseRepository';

/**
 * AuthRepository - Single source of truth for authentication operations
 * - Wraps Supabase auth API
 * - Provides caching for session/user data
 * - Consistent error handling via Result pattern
 * - Offline-ready fallback support
 */
export class AuthRepository {
  private cache: Map<string, any> = new Map();
  private sessionCache: Session | null = null;
  private userProfileCache: UserProfile | null = null;

  /**
   * Login with email and password (with retry)
   */
  async login(creds: LoginCredentials): Promise<Result<User>> {
    return withRetry(async () => {
      try {
        const sb = getSupabase();
        if (!sb) {
          return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
        }

        const { data, error } = await sb.auth.signInWithPassword({ 
          email: creds.email, 
          password: creds.password 
        });

        if (error) {
          return createErrorResult(error.message, this.mapAuthError(error.message));
        }

        this.sessionCache = data.session;
        if (!data.user) {
          return createErrorResult('User not found', RepositoryErrorCode.NOT_FOUND);
        }
        return createSuccessResult(data.user);
      } catch (error) {
        return createErrorResult(
          error instanceof Error ? error.message : 'Giriş başarısız',
          RepositoryErrorCode.UNKNOWN
        );
      }
    });
  }

  /**
   * Register new user (with retry)
   */
  async register(creds: SignupCredentials): Promise<Result<User>> {
    return withRetry(async () => {
      try {
        const sb = getSupabase();
        if (!sb) {
          return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
        }

        const { data, error } = await sb.auth.signUp({
          email: creds.email,
          password: creds.password,
          options: {
            data: { username: creds.username || creds.email.split('@')[0] },
          },
        });

        if (error) {
          return createErrorResult(error.message, this.mapAuthError(error.message));
        }

        this.sessionCache = data.session;
        if (!data.user) {
          return createErrorResult('User not found', RepositoryErrorCode.NOT_FOUND);
        }
        return createSuccessResult(data.user);
      } catch (error) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('lifequest_demo_authenticated', 'true');
          window.localStorage.setItem('lifequest_demo_user', JSON.stringify({
            id: `local-${Date.now()}`,
            email: creds.email,
            username: creds.username || creds.email.split('@')[0],
            createdAt: new Date().toISOString(),
          }));
        }
        return createSuccessResult({
          id: `local-${Date.now()}`,
          email: creds.email,
          created_at: new Date().toISOString(),
        } as User);
      }
    });
  }

  /**
   * Logout current user
   */
  async logout(): Promise<Result<void>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      await sb.auth.signOut();
      this.clearCache();
      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Çıkış başarısız',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Send password reset email (with retry)
   */
  async sendPasswordReset(email: string): Promise<Result<void>> {
    return withRetry(async () => {
      try {
        const sb = getSupabase();
        if (!sb) {
          return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
        }

        const { error } = await sb.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
          return createErrorResult(error.message, this.mapAuthError(error.message));
        }

        return createSuccessResult(undefined);
      } catch (error) {
        return createErrorResult(
          error instanceof Error ? error.message : 'Şifre sıfırlama başarısız',
          RepositoryErrorCode.UNKNOWN
        );
      }
    });
  }

  /**
   * Get current session (with cache)
   */
  async getSession(): Promise<Result<Session | null>> {
    try {
      // Return cached session if available
      if (this.sessionCache) {
        return createSuccessResult(this.sessionCache);
      }

      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data } = await sb.auth.getSession();
      this.sessionCache = data.session;
      return createSuccessResult(data.session);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Session alınamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Get user profile from database
   */
  async getUserProfile(userId: string): Promise<Result<UserProfile | null>> {
    try {
      // Check cache first
      if (this.userProfileCache && this.userProfileCache.id === userId) {
        return createSuccessResult(this.userProfileCache);
      }

      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // returns null (not error) when row is missing

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.NOT_FOUND);
      }

      if (!data) {
        // Profile doesn't exist yet — caller should redirect to onboarding
        return createSuccessResult(null);
      }

      const mapped = mapDbProfileToUserProfile(data);
      this.userProfileCache = mapped;
      return createSuccessResult(mapped);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Profil alınamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, patch: Partial<UserProfile>): Promise<Result<UserProfile>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const dbPatch = mapUserProfileToDbProfile(patch);
      const { data, error } = await sb
        .from('profiles')
        .update(dbPatch)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return createErrorResult(error.message, this.mapAuthError(error.message));
      }

      const mapped = mapDbProfileToUserProfile(data);
      // Update cache
      this.userProfileCache = mapped;
      return createSuccessResult(mapped);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Profil güncellenemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Create user profile (for new users)
   */
  async createUserProfile(profile: UserProfile): Promise<Result<UserProfile>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      // Map only the columns that exist in the DB schema
      const dbRow = mapUserProfileToDbProfile(profile);
      dbRow.updated_at = new Date().toISOString();

      const { data, error } = await sb
        .from('profiles')
        .upsert(dbRow, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        // Fall back to a plain insert if the database rejects the upsert shape
        const fallback = await sb.from('profiles').insert(dbRow).select().single();
        if (fallback.error) {
          return createErrorResult(fallback.error.message, this.mapAuthError(fallback.error.message));
        }
        const mapped = mapDbProfileToUserProfile(fallback.data);
        this.userProfileCache = mapped;
        return createSuccessResult(mapped);
      }

      const mapped = mapDbProfileToUserProfile(data);
      this.userProfileCache = mapped;
      return createSuccessResult(mapped);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Profil oluşturulamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.sessionCache = null;
    this.userProfileCache = null;
    this.cache.clear();
  }

  /**
   * Map Supabase auth errors to RepositoryErrorCode
   */
  private mapAuthError(message: string): RepositoryErrorCode {
    if (message.includes('Invalid login')) {
      return RepositoryErrorCode.VALIDATION_ERROR;
    }
    if (message.includes('User not found')) {
      return RepositoryErrorCode.NOT_FOUND;
    }
    if (message.includes('already registered')) {
      return RepositoryErrorCode.CONFLICT;
    }
    if (message.includes('Network')) {
      return RepositoryErrorCode.NETWORK_ERROR;
    }
    return RepositoryErrorCode.UNKNOWN;
  }
}

// ─── MAPPER HELPERS ─────────────────────────────────────────────────────────

function mapDbProfileToUserProfile(db: any): UserProfile {
  if (!db) return null as any;
  return {
    id: db.id,
    name: db.name || 'Kahraman',
    bio: db.bio || '',
    avatar: db.avatar || null,
    level: db.level ?? 1,
    xp: db.xp ?? 0,
    xpToNext: db.xp_to_next ?? 100,
    totalQuests: db.total_quests ?? 0,
    streak: db.streak ?? 1,
    isPremium: db.is_premium ?? false,
    lastQuestCompletedAt: db.last_quest_completed_at || null,
    dailyXp: db.daily_xp || { date: '', earned: 0 },
    lastActiveDay: db.last_active_day || null,
    badges: [],
    challengeActive: false,
    challengeFocus: null,
    challengeDuration: 14,
    challengeStartTimestamp: null,
    challengeDay: 1,
    recoveryState: { tokens: [], streakFrozen: false, lastRecovery: null }
  };
}

function mapUserProfileToDbProfile(profile: Partial<UserProfile>): any {
  const db: any = {};
  if (profile.id !== undefined) db.id = profile.id;
  if (profile.name !== undefined) db.name = profile.name;
  if (profile.bio !== undefined) db.bio = profile.bio;
  if (profile.avatar !== undefined) db.avatar = profile.avatar;
  if (profile.level !== undefined) db.level = profile.level;
  if (profile.xp !== undefined) db.xp = profile.xp;
  if (profile.xpToNext !== undefined) db.xp_to_next = profile.xpToNext;
  if (profile.totalQuests !== undefined) db.total_quests = profile.totalQuests;
  if (profile.streak !== undefined) db.streak = profile.streak;
  if (profile.isPremium !== undefined) db.is_premium = profile.isPremium;
  if (profile.lastQuestCompletedAt !== undefined) db.last_quest_completed_at = profile.lastQuestCompletedAt;
  if (profile.dailyXp !== undefined) db.daily_xp = profile.dailyXp;
  if (profile.lastActiveDay !== undefined) db.last_active_day = profile.lastActiveDay;
  return db;
}

// Singleton instance
export const authRepository = new AuthRepository();

