import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ─── SUPABASE CLIENT (Singleton) ────────────────────────────────────────────
// Credentials come from .env.local:
//   VITE_SUPABASE_URL=https://xxxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhb...
//
// If env vars are missing, operations silently become no-ops via isConfigured flag.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const appEnv = import.meta.env.VITE_APP_ENV as string | undefined || 'development';

export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseKey &&
  !supabaseUrl.includes('YOUR_PROJECT_ID');

export const isProduction = appEnv === 'production';

// Demo mode: Only enable in development if Supabase is not configured
const DEMO_MODE = !isProduction && !isSupabaseConfigured;

if (!isSupabaseConfigured && !DEMO_MODE) {
  console.error('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check .env.local');
}

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_client) {
    return _client;
  }

  if (DEMO_MODE) {
    console.warn('[Supabase] Running in demo mode - using mock client');
    _client = createClient('https://demo.supabase.co', 'demo-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }) as any;
    return _client;
  }

  if (!isSupabaseConfigured) return null;

  _client = createClient(supabaseUrl!, supabaseKey!);
  return _client;
}

// ─── DATABASE TYPES ──────────────────────────────────────────────────────────
// Matches schema defined in supabase/migrations/001_initial_schema.sql

export interface DbProfile {
  id: string;
  username: string;
  level: number;
  xp: number;
  streak: number;
  longest_streak: number;
  last_active: string;
  created_at: string;
  updated_at: string;
}

export interface DbQuest {
  id: string;
  user_id: string;
  title: string;
  category: string;
  difficulty: string;
  xp_reward: number;
  completed: boolean;
  completed_at: string | null;
  completion_id: string;
  created_at: string;
}

export interface DbSkill {
  id: string;
  user_id: string;
  focus_xp: number;
  focus_level: number;
  discipline_xp: number;
  discipline_level: number;
  consistency_xp: number;
  consistency_level: number;
  updated_at: string;
}

export interface DbReward {
  id: string;
  user_id: string;
  type: string;
  tier: string;
  xp_bonus: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface DbSubscription {
  id: string;
  user_id: string;
  provider: string;
  status: string;
  product_id: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbAnalyticsEvent {
  id: string;
  user_id: string | null;
  event_name: string;
  event_data: Record<string, any>;
  created_at: string;
}

// ─── SYNC QUEUE TYPES ────────────────────────────────────────────────────────
export type SyncActionType =
  | 'COMPLETE_QUEST'
  | 'UPDATE_PROFILE'
  | 'UPDATE_SKILL'
  | 'DAILY_RESET';

export interface SyncAction {
  id: string;        // uuid — unique per mutation
  type: SyncActionType;
  payload: Record<string, any>;
  timestamp: string; // ISO — for Last-Write-Wins reconciliation
  retries: number;
}

export const SYNC_QUEUE_KEY = 'lifequest_sync_queue_v1';

// ─── PROFILE UPSERT ──────────────────────────────────────────────────────────
export async function upsertProfile(profile: DbProfile): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb
    .from('profiles')
    .upsert(profile, { onConflict: 'id' });

  if (error) {
    console.warn('[Supabase] upsertProfile failed:', error.message);
    return false;
  }
  return true;
}

// ─── SKILL PROGRESS UPSERT ───────────────────────────────────────────────────
export async function upsertSkillProgress(
  entry: DbSkill
): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb
    .from('skills')
    .upsert(entry, { onConflict: 'user_id' });

  if (error) {
    console.warn('[Supabase] upsertSkillProgress failed:', error.message);
    return false;
  }
  return true;
}

// ─── PULL PROFILE ────────────────────────────────────────────────────────────
export async function pullProfile(
  userId: string
): Promise<DbProfile | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[Supabase] pullProfile failed:', error.message);
    return null;
  }
  return data as DbProfile | null;
}

// ─── PULL SKILLS ─────────────────────────────────────────────────────────────
export async function pullSkillProgress(
  userId: string
): Promise<DbSkill[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from('skills')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.warn('[Supabase] pullSkillProgress failed:', error.message);
    return [];
  }
  return (data ?? []) as DbSkill[];
}

// ─── KEEP ALIVE (Anti-pause ping) ────────────────────────────────────────────
// Supabase free tier auto-pauses after inactivity. This pings every 4 minutes.
let _keepAliveInterval: ReturnType<typeof setInterval> | null = null;

export function startSupabaseKeepAlive(): void {
  if (!isSupabaseConfigured || _keepAliveInterval) return;

  _keepAliveInterval = setInterval(async () => {
    try {
      await fetch(`${supabaseUrl}/rest/v1/`, { method: 'GET' });
      console.log('[Supabase] KeepAlive ping ✅');
    } catch {
      // sessizce geç, offline olabilir
    }
  }, 4 * 60 * 1000); // her 4 dakikada bir

  console.log('[Supabase] KeepAlive başlatıldı 🟢');
}
