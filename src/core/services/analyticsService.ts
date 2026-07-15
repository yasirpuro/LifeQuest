/**
 * Event Tracking Service
 * Hybrid Calibration: Measures WHAT happens + WHY it happens
 * Core KPIs: Tasks Per Session, Continuation Rate, Reward Impact Score
 */

export type EventType = 
  | 'quest_completed'
  | 'reward_shown'
  | 'identity_shown'
  | 'skill_level_up'
  | 'session_hook_clicked'
  | 'session_hook_ignored'
  | 'session_start'
  | 'session_end'
  | 'streak_loss'
  | 'anticipation_hint_shown'
  | 'premium_teaser_view'
  | 'premium_page_open'
  | 'trial_button_click'
  | 'subscription_start'
  | 'auth_signup_completed'
  | 'auth_login_completed'
  | 'profile_created'
  | 'profile_sync_success'
  | 'profile_sync_failed'
  | 'app_initialized'
  | 'supabase_connection_success'
  | 'supabase_connection_failed'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'sync_failed'
  | 'dashboard_error';

export interface EventData {
  timestamp: string;
  sessionId: string;
  event: EventType;
  data?: Record<string, any>;
}

// Session tracking
let currentSessionId: string | null = null;
let sessionStartTime: number | null = null;
let sessionTasksCount: number = 0;
let tasksBeforeReward: number = 0;
let tasksAfterReward: number = 0;
let rewardsShown: number = 0;
let sessionHooksClicked: number = 0;
let sessionHooksIgnored: number = 0;

// Event buffer for local storage
const EVENT_BUFFER_KEY = 'lifequest_event_buffer';
const MAX_BUFFER_SIZE = 500;

/**
 * Generate session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Start a new session
 */
export function startSession(): void {
  currentSessionId = generateSessionId();
  sessionStartTime = Date.now();
  sessionTasksCount = 0;
  tasksBeforeReward = 0;
  tasksAfterReward = 0;
  rewardsShown = 0;
  sessionHooksClicked = 0;
  sessionHooksIgnored = 0;

  trackEvent('session_start', {
    sessionId: currentSessionId,
  });
}

/**
 * End current session and calculate metrics
 */
export function endSession(): void {
  if (!currentSessionId || !sessionStartTime) return;

  const sessionDuration = Date.now() - sessionStartTime;

  trackEvent('session_end', {
    sessionId: currentSessionId,
    duration: sessionDuration,
    tasks: sessionTasksCount,
    rewardsShown,
    sessionHooksClicked,
    sessionHooksIgnored,
    tasksBeforeReward,
    tasksAfterReward,
  });

  // Reset session state
  currentSessionId = null;
  sessionStartTime = null;
}

/**
 * Track an event
 */
export function trackEvent(event: EventType, data?: Record<string, any>): void {
  if (!currentSessionId) {
    // Auto-start session if not active
    startSession();
  }

  const eventData: EventData = {
    timestamp: new Date().toISOString(),
    sessionId: currentSessionId!,
    event,
    data,
  };

  // Log to console for development
  console.log('[TRACK]', event, data);

  // Add to buffer
  addToBuffer(eventData);

  // Update session metrics
  updateSessionMetrics(event);
}

/**
 * Add event to local storage buffer
 */
function addToBuffer(eventData: EventData): void {
  if (typeof window === 'undefined') return;

  try {
    const buffer = getEventBuffer();
    buffer.push(eventData);

    // Keep buffer size manageable
    if (buffer.length > MAX_BUFFER_SIZE) {
      buffer.shift();
    }

    localStorage.setItem(EVENT_BUFFER_KEY, JSON.stringify(buffer));
  } catch (error) {
    console.error('[Analytics] Failed to add event to buffer:', error);
  }
}

/**
 * Get event buffer from local storage
 */
export function getEventBuffer(): EventData[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(EVENT_BUFFER_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear event buffer
 */
export function clearEventBuffer(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(EVENT_BUFFER_KEY);
}

/**
 * Update session metrics based on event
 */
function updateSessionMetrics(event: EventType): void {
  switch (event) {
    case 'quest_completed':
      sessionTasksCount++;
      if (rewardsShown === 0) {
        tasksBeforeReward++;
      } else {
        tasksAfterReward++;
      }
      break;

    case 'reward_shown':
      rewardsShown++;
      break;

    case 'session_hook_clicked':
      sessionHooksClicked++;
      break;

    case 'session_hook_ignored':
      sessionHooksIgnored++;
      break;
  }
}

/**
 * Calculate Core KPIs from event buffer
 */
export function calculateKPIs(): {
  tasksPerSession: number;
  continuationRate: number;
  rewardImpactScore: number;
  averageSessionLength: number;
  dropOffPoint: number;
} {
  const buffer = getEventBuffer();
  
  // Group events by session
  const sessions = new Map<string, EventData[]>();
  buffer.forEach(event => {
    if (!sessions.has(event.sessionId)) {
      sessions.set(event.sessionId, []);
    }
    sessions.get(event.sessionId)!.push(event);
  });

  // Calculate metrics
  let totalTasks = 0;
  let totalSessions = sessions.size;
  let totalContinuations = 0;
  let totalRewards = 0;
  let totalSessionLength = 0;
  let dropOffPoints: number[] = [];

  sessions.forEach((events) => {
    const sessionTasks = events.filter(e => e.event === 'quest_completed').length;
    const sessionRewards = events.filter(e => e.event === 'reward_shown').length;
    const sessionHooksClicked = events.filter(e => e.event === 'session_hook_clicked').length;
    const sessionEnd = events.find(e => e.event === 'session_end');
    
    totalTasks += sessionTasks;
    totalRewards += sessionRewards;
    totalContinuations += sessionHooksClicked;
    
    if (sessionEnd) {
      totalSessionLength += sessionEnd.data?.duration || 0;
      dropOffPoints.push(sessionTasks);
    }
  });

  const tasksPerSession = totalSessions > 0 ? totalTasks / totalSessions : 0;
  const continuationRate = totalRewards > 0 ? totalContinuations / totalRewards : 0;
  const rewardImpactScore = tasksBeforeReward > 0 ? tasksAfterReward / tasksBeforeReward : 0;
  const averageSessionLength = totalSessions > 0 ? totalSessionLength / totalSessions : 0;
  const dropOffPoint = dropOffPoints.length > 0 
    ? dropOffPoints.reduce((a, b) => a + b, 0) / dropOffPoints.length 
    : 0;

  return {
    tasksPerSession,
    continuationRate,
    rewardImpactScore,
    averageSessionLength,
    dropOffPoint,
  };
}

/**
 * Get current session metrics
 */
export function getCurrentSessionMetrics(): {
  sessionId: string | null;
  duration: number;
  tasks: number;
  rewardsShown: number;
  sessionHooksClicked: number;
  sessionHooksIgnored: number;
} {
  return {
    sessionId: currentSessionId,
    duration: sessionStartTime ? Date.now() - sessionStartTime : 0,
    tasks: sessionTasksCount,
    rewardsShown,
    sessionHooksClicked,
    sessionHooksIgnored,
  };
}
