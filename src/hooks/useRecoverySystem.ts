import type { UserRecoveryState, RecoveryToken } from '../types';

/**
 * Recovery System:
 * - Streak Freeze Token (protect 1 day)
 * - Comeback Quest (earn partial recovery + bonus)
 * - Loss aversion messaging
 */

const COMEBACK_DURATION_DAYS = 3;
const FREEZE_TOKEN_ID = 'freeze-token';
const COMEBACK_TOKEN_ID = 'comeback-token';

/**
 * Initialize recovery state
 */
export function initRecoveryState(): UserRecoveryState {
  return {
    tokens: [],
    streakFrozen: false,
    lastRecovery: null,
  };
}

/**
 * Add freeze token (can use once to protect streak)
 */
export function grantFreezeToken(state: UserRecoveryState, nowIso: string = new Date().toISOString()): UserRecoveryState {
  const expiresAt = new Date(nowIso);
  expiresAt.setDate(expiresAt.getDate() + 7); // 1 week to use

  const newToken: RecoveryToken = {
    id: `${FREEZE_TOKEN_ID}-${Date.now()}`,
    type: 'freeze',
    expiresAt: expiresAt.toISOString(),
    used: false,
  };

  return {
    ...state,
    tokens: [...state.tokens, newToken],
  };
}

/**
 * Use freeze token to protect streak
 */
export function useFreezeToken(state: UserRecoveryState, nowIso: string = new Date().toISOString()): { success: boolean; newState: UserRecoveryState } {
  const freeze = state.tokens.find(t => t.type === 'freeze' && !t.used && new Date(t.expiresAt) > new Date(nowIso));
  if (!freeze) return { success: false, newState: state };

  freeze.used = true;
  return {
    success: true,
    newState: {
      ...state,
      streakFrozen: true,
      tokens: state.tokens,
      lastRecovery: nowIso,
    },
  };
}

/**
 * Grant comeback quest token
 * User has 3 days to complete quests, get recovery XP
 */
export function grantComebackToken(state: UserRecoveryState, nowIso: string = new Date().toISOString()): UserRecoveryState {
  const expiresAt = new Date(nowIso);
  expiresAt.setDate(expiresAt.getDate() + COMEBACK_DURATION_DAYS);

  const newToken: RecoveryToken = {
    id: `${COMEBACK_TOKEN_ID}-${Date.now()}`,
    type: 'comeback',
    expiresAt: expiresAt.toISOString(),
    used: false,
  };

  return {
    ...state,
    tokens: [...state.tokens, newToken],
  };
}

/**
 * Check if user has active comeback token
 */
export function getActiveComebackToken(state: UserRecoveryState, nowIso: string = new Date().toISOString()): RecoveryToken | null {
  return state.tokens.find(t => t.type === 'comeback' && !t.used && new Date(t.expiresAt) > new Date(nowIso)) || null;
}

/**
 * Mark comeback token as used (after sufficient recovery)
 */
export function useComebackToken(state: UserRecoveryState, tokenId: string, nowIso: string = new Date().toISOString()): { success: boolean; newState: UserRecoveryState } {
  const token = state.tokens.find(t => t.id === tokenId);
  if (!token) return { success: false, newState: state };

  token.used = true;
  return {
    success: true,
    newState: {
      ...state,
      tokens: state.tokens,
      lastRecovery: nowIso,
    },
  };
}

/**
 * Clean expired tokens
 */
export function cleanExpiredTokens(state: UserRecoveryState, nowIso: string = new Date().toISOString()): UserRecoveryState {
  const now = new Date(nowIso);
  const active = state.tokens.filter(t => new Date(t.expiresAt) > now);

  return {
    ...state,
    tokens: active,
  };
}

/**
 * Check streak risk and return messaging
 */
export function getStreakRiskMessage(daysSinceLastQuest: number, hasToken: boolean): { risk: 'safe' | 'warning' | 'critical'; message: string } {
  if (daysSinceLastQuest === 0) return { risk: 'safe', message: 'Streak safe today ✓' };
  if (daysSinceLastQuest === 1) return { risk: 'warning', message: '⚠️ 1 day away from losing streak!' };
  if (daysSinceLastQuest >= 2) {
    return {
      risk: 'critical',
      message: hasToken ? '🛡️ Your streak is frozen — use it wisely!' : '🔥 Streak lost! Comeback quest available.',
    };
  }
  return { risk: 'safe', message: 'Keep it up!' };
}

/**
 * Recovery bonus XP for comeback quests
 * Scales with inactivity days (incentivizes faster recovery)
 */
export function getComebackBonusXp(inactiveDays: number): number {
  // 1-3 days: +25%, 3-7 days: +50%, 7+ days: +80%
  if (inactiveDays < 3) return 25;
  if (inactiveDays < 7) return 50;
  return 80;
}
