import type { IdentityReward } from '../../types';

/**
 * Event Priority System
 * UI Conflict Resolution - Shows maximum 2 events at once
 * Prevents cognitive overload while maintaining engagement
 */

export type EventType = 'identity' | 'reward' | 'skill_level_up' | 'session_hook' | 'streak_loss';

export interface GameEvent {
  type: EventType;
  priority: number; // 1 = highest, 5 = lowest
  data: any;
  timestamp: string;
}

export interface EventResolution {
  primaryEvent: GameEvent | null;
  secondaryEvent: GameEvent | null;
  suppressedEvents: GameEvent[];
}

/**
 * Priority Stack (1 = highest priority)
 * 1. Identity Reward (very rare, always spotlight)
 * 2. Streak Loss (emotional impact)
 * 3. Skill Level Up (character progression)
 * 4. Reward (regular dopamine)
 * 5. Session Hook (background momentum)
 */
const EVENT_PRIORITIES: Record<EventType, number> = {
  identity: 1,
  streak_loss: 2,
  skill_level_up: 3,
  reward: 4,
  session_hook: 5,
};

/**
 * Resolve event conflicts - determine which events to show
 * Maximum 2 events at once (primary + secondary)
 */
export function resolveEventConflicts(events: GameEvent[]): EventResolution {
  if (events.length === 0) {
    return {
      primaryEvent: null,
      secondaryEvent: null,
      suppressedEvents: [],
    };
  }

  // Sort by priority (lower number = higher priority)
  const sortedEvents = [...events].sort((a, b) => {
    const priorityDiff = EVENT_PRIORITIES[a.type] - EVENT_PRIORITIES[b.type];
    if (priorityDiff !== 0) return priorityDiff;
    
    // If same priority, use timestamp (more recent first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Identity reward always gets fullscreen (no secondary)
  const identityEvent = sortedEvents.find(e => e.type === 'identity');
  if (identityEvent) {
    return {
      primaryEvent: identityEvent,
      secondaryEvent: null,
      suppressedEvents: sortedEvents.filter(e => e !== identityEvent),
    };
  }

  // Streak loss gets fullscreen (no secondary)
  const streakLossEvent = sortedEvents.find(e => e.type === 'streak_loss');
  if (streakLossEvent) {
    return {
      primaryEvent: streakLossEvent,
      secondaryEvent: null,
      suppressedEvents: sortedEvents.filter(e => e !== streakLossEvent),
    };
  }

  // Skill level up gets fullscreen (no secondary)
  const skillLevelUpEvent = sortedEvents.find(e => e.type === 'skill_level_up');
  if (skillLevelUpEvent) {
    return {
      primaryEvent: skillLevelUpEvent,
      secondaryEvent: null,
      suppressedEvents: sortedEvents.filter(e => e !== skillLevelUpEvent),
    };
  }

  // For regular events, show primary + session hook as secondary
  const primaryEvent = sortedEvents[0];
  const sessionHookEvent = sortedEvents.find(e => e.type === 'session_hook');
  
  if (sessionHookEvent && sessionHookEvent !== primaryEvent) {
    return {
      primaryEvent,
      secondaryEvent: sessionHookEvent,
      suppressedEvents: sortedEvents.filter(e => e !== primaryEvent && e !== sessionHookEvent),
    };
  }

  return {
    primaryEvent,
    secondaryEvent: null,
    suppressedEvents: sortedEvents.slice(1),
  };
}

/**
 * Check if event should be shown based on cooldown
 * Prevents spamming the same event type
 */
export function shouldShowEvent(
  eventType: EventType,
  lastShownEvents: Map<EventType, string>,
  cooldownMs: number = 5000
): boolean {
  const lastShown = lastShownEvents.get(eventType);
  if (!lastShown) return true;

  const timeSinceLastShown = Date.now() - new Date(lastShown).getTime();
  return timeSinceLastShown >= cooldownMs;
}

/**
 * Create event objects from various sources
 */
export function createIdentityRewardEvent(reward: IdentityReward): GameEvent {
  return {
    type: 'identity',
    priority: EVENT_PRIORITIES.identity,
    data: reward,
    timestamp: new Date().toISOString(),
  };
}

export function createRewardEvent(tier: string, amount: number, questTitle: string): GameEvent {
  return {
    type: 'reward',
    priority: EVENT_PRIORITIES.reward,
    data: { tier, amount, questTitle },
    timestamp: new Date().toISOString(),
  };
}

export function createSkillLevelUpEvent(skill: string, level: number): GameEvent {
  return {
    type: 'skill_level_up',
    priority: EVENT_PRIORITIES.skill_level_up,
    data: { skill, level },
    timestamp: new Date().toISOString(),
  };
}

export function createSessionHookEvent(message: string, bonusProgress: number): GameEvent {
  return {
    type: 'session_hook',
    priority: EVENT_PRIORITIES.session_hook,
    data: { message, bonusProgress },
    timestamp: new Date().toISOString(),
  };
}

export function createStreakLossEvent(streakLost: number): GameEvent {
  return {
    type: 'streak_loss',
    priority: EVENT_PRIORITIES.streak_loss,
    data: { streakLost },
    timestamp: new Date().toISOString(),
  };
}
