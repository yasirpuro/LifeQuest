import type { AppState } from '../context/appContextValue';

export interface StateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recovered?: boolean;
}

/**
 * STATE VALIDATOR ENGINE
 * Post-mutation invariant checks
 * Detects state drift before it causes UX bugs
 */

const VALIDATION_RULES = {
  userLevel: {
    min: 1,
    max: 100,
    description: 'User level must be 1-100',
  },
  userXp: {
    min: 0,
    max: 999999,
    description: 'Total XP must be non-negative',
  },
  streak: {
    min: 0,
    max: 9999,
    description: 'Streak must be non-negative',
  },
  mastery: {
    min: 0,
    max: 100,
    description: 'Skill mastery must be 0-100',
  },
};

/**
 * Validate entire app state
 */
export function validateAppState(state: AppState): StateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic user checks
  if (!state.user) {
    errors.push('Missing user object');
  } else {
    if (typeof state.user.level !== 'number' || state.user.level < VALIDATION_RULES.userLevel.min || state.user.level > VALIDATION_RULES.userLevel.max) {
      errors.push(`Invalid user level: ${state.user.level}`);
    }
    if (typeof state.user.xp === 'number' && (state.user.xp < VALIDATION_RULES.userXp.min || state.user.xp > VALIDATION_RULES.userXp.max)) {
      errors.push(`Invalid XP: ${state.user.xp}`);
    }
    if (typeof state.user.streak === 'number' && (state.user.streak < VALIDATION_RULES.streak.min || state.user.streak > VALIDATION_RULES.streak.max)) {
      errors.push(`Invalid streak: ${state.user.streak}`);
    }
  }

  // Last quest date sanity
  if (state.user?.lastQuestCompletedAt) {
    const lastDate = new Date(state.user.lastQuestCompletedAt);
    if (isNaN(lastDate.getTime())) {
      warnings.push(`Invalid lastQuestCompletedAt date: ${state.user.lastQuestCompletedAt}`);
    } else {
      if (lastDate > new Date()) errors.push(`lastQuestCompletedAt is in the future: ${state.user.lastQuestCompletedAt}`);
      const daysAgo = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysAgo > 30 && (state.user?.streak ?? 0) > 5) warnings.push(`Streak ${(state.user?.streak ?? 0)} but no quest for ${Math.floor(daysAgo)} days`);
    }
  }

  // Recovery tokens
  if (state.user?.recoveryState?.tokens) {
    const now = Date.now();
    state.user.recoveryState.tokens.forEach((t: any, idx: number) => {
      const exp = new Date(t.expiresAt).getTime();
      if (!exp || isNaN(exp)) warnings.push(`Recovery token ${idx} has invalid expiresAt`);
      else if (exp < now && !t.used) warnings.push(`Recovery token ${idx} expired but not used`);
    });
  }

  // Quests
  if (Array.isArray(state.quests)) {
    state.quests.forEach((q, i) => {
      if (!q) errors.push(`Quest ${i} is null or undefined`);
      else {
        if (!q.id) errors.push(`Quest ${i} missing id`);
        if (typeof q.difficulty === 'number' && (q.difficulty < 1 || q.difficulty > 5)) errors.push(`Quest ${q.id || i} difficulty out of range: ${q.difficulty}`);
      }
    });
  }

  // Skills (optional compatibility)
  const maybeSkills = (state as any).skills;
  if (maybeSkills && typeof maybeSkills === 'object') {
    Object.entries(maybeSkills).forEach(([skillId, skill]: any) => {
      if (skill && typeof skill.mastery === 'number') {
        if (skill.mastery < VALIDATION_RULES.mastery.min || skill.mastery > VALIDATION_RULES.mastery.max) errors.push(`Skill ${skillId} mastery out of range: ${skill.mastery}`);
      }
    });
  }

  // Notifications size
  const maybeNotifications = (state as any).notifications;
  if (Array.isArray(maybeNotifications) && maybeNotifications.length > 5000) {
    warnings.push(`Notifications unusually large: ${maybeNotifications.length}`);
  }

  const isValid = errors.length === 0;
  return { isValid, errors, warnings };
}

// Minimal helpers expected by AppContext
export function validateQuestCompletionResult(prevState: any, newState: any, xpEarned: number) {
  const warnings: string[] = [];
  // Basic sanity checks
  if (typeof xpEarned !== 'number' || xpEarned < 0) warnings.push('Invalid XP delta');
  // reference prevState/newState to avoid unused param errors
  if (prevState && newState && prevState.user && newState.user) {
    // no-op
  }
  const isValid = warnings.length === 0;
  return { isValid, warnings };
}

export function attemptStateRecovery(state: any) {
  // No-op recovery for now; future implementations can try to prune invalid entries
  return state;
}

export function isStateHealthy(state: any): boolean {
  return validateAppState(state as AppState).isValid;
}
