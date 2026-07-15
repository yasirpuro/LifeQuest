import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { authRepository } from '../../core/repositories/authRepository';
import { premiumRepository } from '../../core/repositories/premiumRepository';
import { formatError } from '../../core/errorHandler';
import type { AuthState, AuthUser, LoginCredentials, SignupCredentials, AuthResult } from './authTypes';
import type { UserProfile } from '../../types';

interface AuthContextValue extends AuthState {
  // User profile state
  userProfile: UserProfile | null;
  isPremium: boolean;
  /** true when the user is authenticated but has no profile row in Supabase yet */
  userNeedsOnboarding: boolean;

  // Auth methods
  login: (creds: LoginCredentials) => Promise<AuthResult>;
  register: (creds: SignupCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<AuthResult>;

  // User profile methods
  updateUserProfile: (patch: Partial<UserProfile>) => void;
  /** Atomically creates the profile row in Supabase (Onboarding calls this) */
  createUserProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredDemoUser() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem('lifequest_demo_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function createDemoSession(user: { id: string; email: string; createdAt?: string } | null): Session | null {
  if (!user) return null;

  return {
    access_token: 'demo-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'demo-refresh',
    user: {
      id: user.id,
      email: user.email,
      created_at: user.createdAt || new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
    },
  } as Session;
}

function buildLocalProfileFromDemo(demoUser: { id: string; email: string; username?: string; createdAt?: string }) {
  const name = demoUser.username || demoUser.email.split('@')[0];
  return {
    id: demoUser.id,
    name,
    bio: '',
    avatar: null,
    level: 1,
    xp: 0,
    xpToNext: 100,
    totalQuests: 0,
    streak: 0,
    badges: [],
    isPremium: false,
    skillsProgress: {},
    challengeActive: false,
    challengeFocus: null,
    challengeDuration: 14,
    challengeStartTimestamp: null,
    challengeDay: 1,
    recoveryState: { tokens: [], streakFrozen: false, lastRecovery: null },
    lastQuestCompletedAt: null,
    streakRiskLevel: 'safe' as const,
    dailyXp: { date: new Date().toISOString().slice(0, 10), earned: 0 },
    lastActiveDay: new Date().toISOString().slice(0, 10),
  };
}

const fallbackAuthContext: AuthContextValue = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: typeof window !== 'undefined' && window.localStorage.getItem('lifequest_demo_authenticated') === 'true',
  userProfile: null,
  isPremium: false,
  userNeedsOnboarding: false,
  login: async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lifequest_demo_authenticated', 'true');
    }
    return {
      success: true,
      user: { id: 'local-user', email: 'local@example.com', createdAt: new Date().toISOString() },
    };
  },
  register: async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lifequest_demo_authenticated', 'true');
    }
    return {
      success: true,
      user: { id: 'local-user', email: 'local@example.com', createdAt: new Date().toISOString() },
    };
  },
  logout: async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('lifequest_demo_authenticated');
    }
  },
  sendPasswordReset: async () => ({ success: true }),
  updateUserProfile: () => undefined,
  createUserProfile: async () => true,
};

function sessionToUser(session: Session | null): AuthUser | null {
  if (!session?.user) return null;
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    createdAt: session.user.created_at,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    if (typeof window === 'undefined') return null;
    return createDemoSession(getStoredDemoUser());
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userNeedsOnboarding, setUserNeedsOnboarding] = useState(false);

  // ─── Hydrate session + profile on app start ───────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const demoUser = getStoredDemoUser();
        if (demoUser) {
          const demoSession = createDemoSession(demoUser);
          if (demoSession) {
            setSession(demoSession);
          }

          const localProfileStr = localStorage.getItem('lifequest_local_profile');
          if (localProfileStr) {
            try {
              const parsed = JSON.parse(localProfileStr);
              // If demo user, ensure demo profile is sanitized (no seeded XP/quests/streak)
              if (demoUser) {
                const sanitized = {
                  ...parsed,
                  xp: 0,
                  totalQuests: 0,
                  streak: 0,
                  dailyXp: { date: new Date().toISOString().slice(0,10), earned: 0 },
                };
                localStorage.setItem('lifequest_local_profile', JSON.stringify(sanitized));
                setUserProfile(sanitized);
              } else {
                setUserProfile(parsed);
              }
              setUserNeedsOnboarding(false);
            } catch (e) {
              console.error('[AuthContext] Error parsing local profile:', e);
            }
          } else {
            // Build a minimal local profile from the demo user so the UI shows the chosen name immediately
            try {
              const localProfile = buildLocalProfileFromDemo({ id: demoUser.id, email: demoUser.email, username: (demoUser as any).username, createdAt: demoUser.createdAt });
              localStorage.setItem('lifequest_local_profile', JSON.stringify(localProfile));
              setUserProfile(localProfile);
              setUserNeedsOnboarding(false);
            } catch (e) {
              console.error('[AuthContext] Failed to create local profile from demo user:', e);
              setUserNeedsOnboarding(true);
            }
          }

          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }

        const result = await authRepository.getSession();
        if (!isMounted) return;

        if (result.success && result.data?.user) {
          setSession(result.data ?? null);
          const userId = result.data.user.id;

          try {
            const profileResult = await authRepository.getUserProfile(userId);
            if (!isMounted) return;

            if (profileResult.success && profileResult.data) {
              setUserProfile(profileResult.data);
              localStorage.setItem('lifequest_local_profile', JSON.stringify(profileResult.data));
              setUserNeedsOnboarding(false);

              void premiumRepository.checkPremiumAccess(userId).then(premiumResult => {
                if (!isMounted) return;
                if (premiumResult.success) {
                  setUserProfile(prev => {
                    const updated = prev ? { ...prev, isPremium: premiumResult.data ?? false } : null;
                    if (updated) {
                      localStorage.setItem('lifequest_local_profile', JSON.stringify(updated));
                    }
                    return updated;
                  });
                }
              }).catch(err => {
                console.warn('[AuthContext] Premium check failed:', err);
              });
            } else {
              const localProfileStr = localStorage.getItem('lifequest_local_profile');
              if (localProfileStr) {
                try {
                  const localProfile = JSON.parse(localProfileStr);
                  if (localProfile && localProfile.id === userId) {
                    setUserProfile(localProfile);
                    setUserNeedsOnboarding(false);
                    setIsLoading(false);
                    return;
                  }
                } catch (e) {
                  console.error('[AuthContext] Error parsing local profile:', e);
                }
              }

              console.log('[AuthContext] No profile found — needs onboarding');
              setUserNeedsOnboarding(true);
            }
          } catch (profileError) {
            console.error('[AuthContext] Profile hydration failed:', profileError);
            setUserNeedsOnboarding(true);
          } finally {
            if (isMounted) {
              setIsLoading(false);
            }
          }
        } else {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('[AuthContext] Session hydration failed:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = async (creds: LoginCredentials): Promise<AuthResult> => {
    const result = await authRepository.login(creds);
    if (result.success) {
      const sessionResult = await authRepository.getSession();
      if (sessionResult.success && sessionResult.data?.user) {
        setSession(sessionResult.data ?? null);

        if (sessionResult.data.user.id) {
          const profileResult = await authRepository.getUserProfile(sessionResult.data.user.id);
          if (profileResult.success && profileResult.data) {
            setUserProfile(profileResult.data);
            setUserNeedsOnboarding(false);
          } else {
            setUserNeedsOnboarding(true);
          }
        }
      } else {
        const demoUser = {
          id: `local-${Date.now()}`,
          email: creds.email,
          createdAt: new Date().toISOString(),
        };
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('lifequest_demo_authenticated', 'true');
          window.localStorage.setItem('lifequest_demo_user', JSON.stringify(demoUser));
        }
        setSession(createDemoSession(demoUser));
        setUserNeedsOnboarding(true);
      }
      return { success: true, user: result.data ? { id: result.data.id, email: result.data.email ?? '', createdAt: result.data.created_at } : null };
    }

    const formattedError = formatError((result as any)?.error || result, (result as any)?.code || 'UNKNOWN');
    return { success: false, error: formattedError };
  };

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = async (creds: SignupCredentials): Promise<AuthResult> => {
    try {
      const result = await authRepository.register(creds);
      if (result.success) {
        const sessionResult = await authRepository.getSession();
        if (sessionResult.success) {
          setSession(sessionResult.data ?? null);
        }
        setUserNeedsOnboarding(true);
        return { success: true, user: result.data ? { id: result.data.id, email: result.data.email ?? '', createdAt: result.data.created_at } : null };
      }

      if (typeof window !== 'undefined') {
        const demoUser = {
          id: `local-${Date.now()}`,
          email: creds.email,
          username: creds.username || creds.email.split('@')[0],
          createdAt: new Date().toISOString(),
        };
        window.localStorage.setItem('lifequest_demo_authenticated', 'true');
        window.localStorage.setItem('lifequest_demo_user', JSON.stringify(demoUser));
        try {
          const localProfile = buildLocalProfileFromDemo(demoUser);
          window.localStorage.setItem('lifequest_local_profile', JSON.stringify(localProfile));
          setUserProfile(localProfile);
          setSession(createDemoSession(demoUser));
          setUserNeedsOnboarding(false);
        } catch (e) {
          console.error('[AuthContext] Failed to save demo local profile:', e);
          setSession(createDemoSession(demoUser));
          setUserNeedsOnboarding(true);
        }
      }

      return { success: true, user: { id: `local-${Date.now()}`, email: creds.email, createdAt: new Date().toISOString() } };
    } catch (error) {
      if (typeof window !== 'undefined') {
        const demoUser = {
          id: `local-${Date.now()}`,
          email: creds.email,
          username: creds.username || creds.email.split('@')[0],
          createdAt: new Date().toISOString(),
        };
        window.localStorage.setItem('lifequest_demo_authenticated', 'true');
        window.localStorage.setItem('lifequest_demo_user', JSON.stringify(demoUser));
        try {
          const localProfile = buildLocalProfileFromDemo(demoUser);
          window.localStorage.setItem('lifequest_local_profile', JSON.stringify(localProfile));
          setUserProfile(localProfile);
          setSession(createDemoSession(demoUser));
          setUserNeedsOnboarding(false);
        } catch (e) {
          console.error('[AuthContext] Failed to save demo local profile (catch):', e);
          setSession(createDemoSession(demoUser));
          setUserNeedsOnboarding(true);
        }
      }
      return { success: true, user: { id: `local-${Date.now()}`, email: creds.email, createdAt: new Date().toISOString() } };
    }
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    await authRepository.logout();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('lifequest_demo_authenticated');
      window.localStorage.removeItem('lifequest_demo_user');
      window.localStorage.removeItem('lifequest_local_profile');
    }
    setSession(null);
    setUserProfile(null);
    setUserNeedsOnboarding(false);
  };

  // ─── Password reset ───────────────────────────────────────────────────────
  const sendPasswordReset = async (email: string): Promise<AuthResult> => {
    const result = await authRepository.sendPasswordReset(email);
    if (result.success) return { success: true };

    const formattedError = formatError((result as any)?.error || result, (result as any)?.code || 'UNKNOWN');
    return { success: false, error: formattedError };
  };

  // ─── Update existing profile (optimistic) ────────────────────────────────
  const updateUserProfile = useCallback(async (patch: Partial<UserProfile>) => {
    const prevState = userProfile;
    // If we already have a profile, merge optimistically
    if (userProfile) {
      const nextState = { ...userProfile, ...patch };
      setUserProfile(nextState);
      try { localStorage.setItem('lifequest_local_profile', JSON.stringify(nextState)); } catch {}

      if (userProfile.id) {
        const result = await authRepository.updateUserProfile(userProfile.id, patch);
        if (!result.success) {
          console.error('[AuthContext] updateUserProfile failed, rolling back:', (result as any).error);
          setUserProfile(prevState);
          if (prevState) {
            localStorage.setItem('lifequest_local_profile', JSON.stringify(prevState));
          } else {
            localStorage.removeItem('lifequest_local_profile');
          }
          const formattedError = formatError((result as any)?.error || result, (result as any)?.code || 'UNKNOWN');
          console.warn('[AuthContext] User-friendly error:', formattedError);
        }
      }
      return;
    }

    // No existing profile: create a local profile from patch + session/demo info so avatar/name persist
    try {
      const demoRaw = typeof window !== 'undefined' ? window.localStorage.getItem('lifequest_demo_user') : null;
      const demo = demoRaw ? JSON.parse(demoRaw) : null;
      const userId = session?.user?.id ?? demo?.id ?? `local-${Date.now()}`;
      const baseProfile = buildLocalProfileFromDemo({ id: userId, email: demo?.email ?? `${userId}@local`, username: (patch.name ?? demo?.username) as string });
      const newProfile = { ...baseProfile, ...patch } as UserProfile;
      setUserProfile(newProfile);
      try { localStorage.setItem('lifequest_local_profile', JSON.stringify(newProfile)); } catch {}

      // Attempt server update if we have a real user id
      if (session?.user?.id) {
        const result = await authRepository.updateUserProfile(session.user.id, patch);
        if (!result.success) {
          console.warn('[AuthContext] server update failed for new profile, kept local version');
        }
      }
    } catch (e) {
      console.error('[AuthContext] Failed to create local profile from update patch:', e);
    }
  }, [userProfile]);

  // ─── Create profile row (called from Onboarding on completion) ────────────
  const createUserProfile = useCallback(async (profileData: Partial<UserProfile>): Promise<boolean> => {
    const userId = session?.user?.id;
    if (!userId) {
      console.error('[AuthContext] createUserProfile: no active session');
      return false;
    }

    const newProfile: UserProfile = {
      id: userId,
      name: profileData.name || 'Kahraman',
      bio: profileData.bio || '',
      avatar: profileData.avatar ?? null,
      level: 1,
      xp: 0,
      xpToNext: 100,
      totalQuests: 0,
      streak: 1,
      badges: [],
      isPremium: false,
      skillsProgress: {},
      challengeActive: profileData.challengeActive ?? false,
      challengeFocus: profileData.challengeFocus ?? null,
      challengeDuration: profileData.challengeDuration ?? 14,
      challengeStartTimestamp: profileData.challengeStartTimestamp ?? null,
      challengeDay: 1,
      recoveryState: { tokens: [], streakFrozen: false, lastRecovery: null },
      lastQuestCompletedAt: null,
      streakRiskLevel: 'safe',
      dailyXp: { date: new Date().toISOString().slice(0, 10), earned: 0 },
      lastActiveDay: new Date().toISOString().slice(0, 10),
    };

    const result = await authRepository.createUserProfile(newProfile);
    if (result.success) {
      localStorage.setItem('lifequest_local_profile', JSON.stringify(result.data));
      setUserProfile(result.data ?? null);
      setUserNeedsOnboarding(false);
      console.log('[AuthContext] Profile created in Supabase:', result.data);
      return true;
    }

    console.error('[AuthContext] createUserProfile Supabase error:', (result as any).error);

    // Fallback: If database profile creation fails, save it locally so user is not blocked
    try {
      localStorage.setItem('lifequest_local_profile', JSON.stringify(newProfile));
      setUserProfile(newProfile);
      setUserNeedsOnboarding(false);
      console.log('[AuthContext] Profile saved locally as fallback:', newProfile);
      return true;
    } catch (e) {
      console.error('[AuthContext] Failed to write local profile fallback:', e);
      return false;
    }
  }, [session]);

  const demoUser = getStoredDemoUser();
  const user = sessionToUser(session) ?? (demoUser ? {
    id: demoUser.id,
    email: demoUser.email,
    createdAt: demoUser.createdAt || new Date().toISOString(),
  } : null);
  const isPremium = userProfile?.isPremium ?? false;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      isAuthenticated: !!session || (typeof window !== 'undefined' && window.localStorage.getItem('lifequest_demo_authenticated') === 'true'),
      userProfile,
      isPremium,
      userNeedsOnboarding,
      login,
      register,
      logout,
      sendPasswordReset,
      updateUserProfile,
      createUserProfile,
    } as AuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  return ctx ?? fallbackAuthContext;
}
