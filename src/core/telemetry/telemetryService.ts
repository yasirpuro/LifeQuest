/**
 * Telemetry Service - Event tracking and analytics
 * Currently using console.log for development
 * TODO: Integrate with Firebase Analytics, Mixpanel, or similar
 */

type EventName = 
  | 'app_opened'
  | 'app_started'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'quest_created'
  | 'quest_completed'
  | 'skill_unlocked'
  | 'level_up'
  | 'streak_lost'
  | 'streak_saved'
  | 'premium_viewed'
  | 'premium_started'
  | 'auth_login'
  | 'auth_signup'
  | 'auth_logout'
  | 'error';

interface TelemetryEvent {
  event: EventName;
  timestamp: string;
  data?: Record<string, unknown>;
  userId?: string;
  sessionId: string;
}

// Simple in-memory event buffer for development
const eventBuffer: TelemetryEvent[] = [];
const MAX_BUFFER_SIZE = 100;

// Generate session ID
let sessionId = crypto.randomUUID?.() || `session_${Date.now()}`;

export function reportEvent(event: EventName, data?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const telemetryEvent: TelemetryEvent = {
    event,
    timestamp: new Date().toISOString(),
    data,
    sessionId,
  };

  // Add to buffer
  eventBuffer.push(telemetryEvent);
  
  // Keep buffer size manageable
  if (eventBuffer.length > MAX_BUFFER_SIZE) {
    eventBuffer.shift();
  }

  // Log to console for development
  console.log('[Telemetry]', telemetryEvent);

  // TODO: Send to analytics service (Firebase, Mixpanel, etc.)
  // Example: analytics.logEvent(event, data);
}

export function reportError(error: Error | unknown, context?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const errorEvent: TelemetryEvent = {
    event: 'error',
    timestamp: new Date().toISOString(),
    data: {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
    },
    sessionId,
  };

  // Add to buffer
  eventBuffer.push(errorEvent);
  
  // Keep buffer size manageable
  if (eventBuffer.length > MAX_BUFFER_SIZE) {
    eventBuffer.shift();
  }

  // Log to console for development
  console.error('[Telemetry Error]', errorEvent);

  // TODO: Send to error tracking service (Sentry, Firebase Crashlytics, etc.)
  // Example: Sentry.captureException(error, { extra: context });
}

// Get event buffer for debugging
export function getEventBuffer(): TelemetryEvent[] {
  return [...eventBuffer];
}

// Clear event buffer
export function clearEventBuffer(): void {
  eventBuffer.length = 0;
}

// Reset session ID (call on logout)
export function resetSession(): void {
  sessionId = crypto.randomUUID?.() || `session_${Date.now()}`;
}
