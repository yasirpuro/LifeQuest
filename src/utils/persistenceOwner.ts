/**
 * PERSISTENCE OWNER
 * 
 * Single-writer pattern enforcement:
 * - ONLY THIS MODULE writes to localStorage, Preferences, Filesystem
 * - All other modules must call functions here to persist data
 * - Central orchestration ensures deterministic write order
 * - No hidden side effects in utilities
 */

import type { AppState } from '../context/appContextValue';
import type { SkillProgress, SocialGraph } from '../types';

export interface PersistedState {
  // Core app state
  appState: AppState;
  
  // Skill engine snapshot
  skillEngine: {
    progressMap: Record<string, SkillProgress>;
  };
  
  // Widget cache
  widget: {
    focusSkillId: string | null;
    focusMastery: number;
    streak: number;
    streakRisk: 'safe' | 'warning' | 'critical';
    dailyProgress: { completed: number; total: number };
    lastUpdate: string;
  };
  
  // Analytics & tracking
  analytics: {
    events: Array<any>;
    weeklyInsights: Array<any>;
  };
  
  // Notification state
  notifications: {
    sent: Record<string, string>; // skillId -> dateISO
    frequency: Record<string, any>;
  };

  // Social graph state
  social: SocialGraph;

  // Preferences / i18n state
  preferences: {
    locale: string;
    language: string;
  };
  
  // System state
  system: {
    onboardingDone: boolean;
    lastSyncs: Record<string, string>;
    crashLogs: Array<any>;
    dataVersion: number;
  };
  
  // Reconciliation state
  reconciliation: {
    retryQueue: Array<any>;
    logs: Array<any>;
  };
  
  timestamp: string; // ISO
  version: number; // schema version
}

const STORAGE_KEYS = {
  APP_STATE: 'lifequest_state',
  APP_STATE_NATIVE: 'lifequest_state', // same key for native sync
  SKILL_MAP: 'lifequest_skills_v1',
  WIDGET_CACHE: 'lifequest_widget_cache_v1',
  ANALYTICS_EVENTS: 'lifequest_analytics_events_v1',
  WEEKLY_INSIGHTS: 'lifequest_weekly_insights_v1',
  NOTIFICATIONS_SENT: 'lifequest_notifications_sent_v1',
  NOTIFICATION_FREQ: 'lifequest_notify_freq_v1',
  WIDGET_COMMANDS: 'lifequest_widget_commands_v1',
  DAILY_PLAN: 'lifequest_daily_plan_v1',
  ONBOARDING_DONE: 'lifequest_onboarding_done',
  SOCIAL_GRAPH: 'lifequest_social_graph_v1',
  LOCALE_PREFERENCES: 'lifequest_locale_preferences_v1',
  LAST_SYNC: 'lifequest_last_sync_v1',
  DEVICE_TIME_CHECK: 'lifequest_device_time_check',
  CRASH_LOGS: 'lifequest_crash_logs_v1',
  DATA_VERSION: 'lifequest_data_version_v1',
  RETRY_QUEUE: 'lifequest_retry_queue_v1',
  RECONCILIATION_LOG: 'lifequest_reconciliation_log_v1',
} as const;

const PERSISTED_STATE_VERSION = 1;

let persistWriteQueue: Promise<void> = Promise.resolve();
let pendingPersistCount = 0;

export function getPendingPersistCount(): number {
  return pendingPersistCount;
}

export function waitForPendingPersist(): Promise<void> {
  return persistWriteQueue;
}

function enqueuePersist<T>(task: () => Promise<T>): Promise<T> {
  pendingPersistCount += 1;
  const next = persistWriteQueue
    .then(task)
    .catch((error) => {
      console.error('[PersistenceOwner] queued write failed:', error);
      throw error;
    })
    .finally(() => {
      pendingPersistCount = Math.max(0, pendingPersistCount - 1);
    });

  persistWriteQueue = next.then(() => undefined).catch(() => undefined);
  return next;
}

async function writeAtomicFile(
  Filesystem: any,
  directory: any,
  filePath: string,
  data: string
): Promise<void> {
  const tempPath = `${filePath}.tmp`;

  await Filesystem.writeFile({
    path: tempPath,
    data,
    directory,
  });

  if (typeof Filesystem.rename === 'function') {
    await Filesystem.rename({ from: tempPath, to: filePath, directory });
  } else {
    try {
      await Filesystem.deleteFile({ path: filePath, directory });
    } catch {
      // ignore missing file
    }
    await Filesystem.writeFile({ path: filePath, data, directory });
    await Filesystem.deleteFile({ path: tempPath, directory }).catch(() => {});
  }
}

/**
 * WRITE OPERATION: Persist complete app state snapshot
 * Called ONLY by orchestrator after quest completion
 * Routes to localStorage, Preferences, Filesystem
 */
export async function persistAppStateSnapshot(snapshot: PersistedState): Promise<{
  success: boolean;
  targets: {
    localStorage: boolean;
    preferences: boolean;
    filesystem: boolean;
  };
  message: string;
}>
  {
  if (!snapshot || !snapshot.appState || !snapshot.skillEngine || !snapshot.widget) {
    throw new Error('[PersistenceOwner] persistAppStateSnapshot requires a complete snapshot');
  }

  const versionedSnapshot: PersistedState = {
    ...snapshot,
    version: snapshot.version || PERSISTED_STATE_VERSION,
  };

  const targets = {
    localStorage: false,
    preferences: false,
    filesystem: false,
  };

  return enqueuePersist(async () => {
    try {
      // ====================
      // 1. localStorage (primary, always available)
      // ====================
      try {
        localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(versionedSnapshot.appState));
        localStorage.setItem(STORAGE_KEYS.SKILL_MAP, JSON.stringify(versionedSnapshot.skillEngine.progressMap));
        localStorage.setItem(STORAGE_KEYS.WIDGET_CACHE, JSON.stringify(versionedSnapshot.widget));
        localStorage.setItem(STORAGE_KEYS.ANALYTICS_EVENTS, JSON.stringify(versionedSnapshot.analytics.events));
        localStorage.setItem(STORAGE_KEYS.WEEKLY_INSIGHTS, JSON.stringify(versionedSnapshot.analytics.weeklyInsights));
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_SENT, JSON.stringify(versionedSnapshot.notifications.sent));
        localStorage.setItem(STORAGE_KEYS.NOTIFICATION_FREQ, JSON.stringify(versionedSnapshot.notifications.frequency));
        localStorage.setItem(STORAGE_KEYS.RETRY_QUEUE, JSON.stringify(versionedSnapshot.reconciliation.retryQueue));
        targets.localStorage = true;
      } catch (e) {
        console.error('[PersistenceOwner] localStorage write failed:', e);
      }

      // ====================
      // 2. Native Preferences (Capacitor, Android only)
      // ====================
      try {
        const _modPref = '@capacitor/preferences';
        const { Preferences } = await import(_modPref).catch(() => ({ Preferences: null }));
        if (Preferences) {
          await Preferences.set({
            key: STORAGE_KEYS.APP_STATE_NATIVE,
            value: JSON.stringify({ version: versionedSnapshot.version, data: versionedSnapshot }),
          });
          await Preferences.set({
            key: STORAGE_KEYS.SKILL_MAP,
            value: JSON.stringify(versionedSnapshot.skillEngine.progressMap),
          });
          targets.preferences = true;
        }
      } catch (e) {
        console.warn('[PersistenceOwner] Preferences write failed (expected on web):', e);
      }

      // ====================
      // 3. Native Filesystem (Capacitor, Android only)
      // ====================
      try {
        const _modFs = '@capacitor/filesystem';
        const { Filesystem, Directory } = await import(_modFs).catch(() => ({
          Filesystem: null,
          Directory: null,
        }));
        if (Filesystem && Directory) {
          await writeAtomicFile(
            Filesystem,
            Directory.Data,
            'lifequest_state.json',
            JSON.stringify({ version: versionedSnapshot.version, data: versionedSnapshot })
          );
          await writeAtomicFile(
            Filesystem,
            Directory.Data,
            'lifequest_skills_v1.json',
            JSON.stringify(versionedSnapshot.skillEngine.progressMap)
          );
          await writeAtomicFile(
            Filesystem,
            Directory.Data,
            'lifequest_notifications_freq_v1.json',
            JSON.stringify(versionedSnapshot.notifications.frequency)
          );
          await writeAtomicFile(
            Filesystem,
            Directory.Data,
            'lifequest_analytics_weekly_insights_v1.json',
            JSON.stringify(versionedSnapshot.analytics.weeklyInsights)
          );
          targets.filesystem = true;
        }
      } catch (e) {
        console.warn('[PersistenceOwner] Filesystem write failed (expected on web):', e);
      }

      return {
        success: targets.localStorage,
        targets,
        message: `Persisted: ${Object.entries(targets)
          .filter(([_, v]) => v)
          .map(([k]) => k)
          .join(', ')}`,
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error('[PersistenceOwner] Persistence failed:', message);
      return {
        success: false,
        targets,
        message,
      };
    }
  });
}

/**
 * READ OPERATION: Load persisted app state
 * Called at app startup to restore state
 */
export async function loadPersistedState(): Promise<PersistedState | null> {
  try {
    // Try localStorage first (always available)
    const appStateJson = localStorage.getItem(STORAGE_KEYS.APP_STATE);
    const skillMapJson = localStorage.getItem(STORAGE_KEYS.SKILL_MAP);
    
    if (!appStateJson || !skillMapJson) {
      return null; // No saved state yet
    }

    const appState = JSON.parse(appStateJson);
    const progressMap = JSON.parse(skillMapJson);

    // Load optional components
    const widgetJson = localStorage.getItem(STORAGE_KEYS.WIDGET_CACHE);
    const analyticsEventsJson = localStorage.getItem(STORAGE_KEYS.ANALYTICS_EVENTS);
    const weeklyInsightsJson = localStorage.getItem(STORAGE_KEYS.WEEKLY_INSIGHTS);
    const notificationsSentJson = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_SENT);
    const notificationFreqJson = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_FREQ);
    const retryQueueJson = localStorage.getItem(STORAGE_KEYS.RETRY_QUEUE);

    const socialGraphJson = localStorage.getItem(STORAGE_KEYS.SOCIAL_GRAPH);
    const localePreferencesJson = localStorage.getItem(STORAGE_KEYS.LOCALE_PREFERENCES);

    return {
      appState,
      skillEngine: { progressMap },
      widget: widgetJson ? JSON.parse(widgetJson) : getDefaultWidget(),
      analytics: {
        events: analyticsEventsJson ? JSON.parse(analyticsEventsJson) : [],
        weeklyInsights: weeklyInsightsJson ? JSON.parse(weeklyInsightsJson) : [],
      },
      notifications: {
        sent: notificationsSentJson ? JSON.parse(notificationsSentJson) : {},
        frequency: notificationFreqJson ? JSON.parse(notificationFreqJson) : {},
      },
        social: socialGraphJson ? JSON.parse(socialGraphJson) : getDefaultSocialGraph(),
        preferences: localePreferencesJson ? JSON.parse(localePreferencesJson) : getDefaultLocalePreferences(),
      system: {
        onboardingDone: localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE) === 'true',
        lastSyncs: {},
        crashLogs: [],
        dataVersion: 1,
      },
      reconciliation: {
        retryQueue: retryQueueJson ? JSON.parse(retryQueueJson) : [],
        logs: [],
      },
      timestamp: new Date().toISOString(),
      version: 1,
    };
  } catch (e) {
    console.error('[PersistenceOwner] Failed to load persisted state:', e);
    return null;
  }
}

/**
 * HELPER: Build complete snapshot from components
 * Called by orchestrator before persisting
 */
export function buildPersistedSnapshot(
  appState: AppState,
  progressMap: Record<string, SkillProgress>,
  widgetData: any,
  analyticsEvents: any[],
  weeklyInsights: any[],
  notificationsSent: Record<string, string>,
  notificationFrequency: Record<string, any>,
  socialGraph: SocialGraph,
  localePreferences: { locale: string; language: string },
  retryQueue: any[]
): PersistedState {
  return {
    appState,
    skillEngine: { progressMap },
    widget: widgetData || getDefaultWidget(),
    analytics: { events: analyticsEvents || [], weeklyInsights: weeklyInsights || [] },
    notifications: { sent: notificationsSent || {}, frequency: notificationFrequency || {} },
    social: socialGraph || getDefaultSocialGraph(),
    preferences: localePreferences || getDefaultLocalePreferences(),
    system: {
      onboardingDone: false,
      lastSyncs: {},
      crashLogs: [],
      dataVersion: 1,
    },
    reconciliation: { retryQueue: retryQueue || [], logs: [] },
    timestamp: new Date().toISOString(),
    version: PERSISTED_STATE_VERSION,
  };
}

function getDefaultWidget() {
  return {
    focusSkillId: null,
    focusMastery: 0,
    streak: 0,
    streakRisk: 'safe' as const,
    dailyProgress: { completed: 0, total: 0 },
    lastUpdate: new Date().toISOString(),
  };
}

function getDefaultSocialGraph(): SocialGraph {
  return {
    friends: [],
    friendRequests: [],
    blockedUsers: [],
  };
}

function getDefaultLocalePreferences() {
  return {
    locale: 'tr-TR',
    language: 'tr',
  };
}

function readJsonKey<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

function writeJsonKey(key: string, value: any): boolean {
  try {
    enqueuePersist(async () => {
      localStorage.setItem(key, JSON.stringify(value));
    }).catch((e) => {
      console.error(`[PersistenceOwner] writeJsonKey(${key}) failed:`, e);
    });
    return true;
  } catch (e) {
    console.error(`[PersistenceOwner] writeJsonKey(${key}) failed:`, e);
    return false;
  }
}

function writeStringKey(key: string, value: string): boolean {
  try {
    enqueuePersist(async () => {
      localStorage.setItem(key, value);
    }).catch((e) => {
      console.error(`[PersistenceOwner] writeStringKey(${key}) failed:`, e);
    });
    return true;
  } catch (e) {
    console.error(`[PersistenceOwner] writeStringKey(${key}) failed:`, e);
    return false;
  }
}

export function saveJsonKey(key: string, value: any): boolean {
  return writeJsonKey(key, value);
}

export function loadJsonKey<T>(key: string): T | null {
  return readJsonKey<T>(key);
}

export function loadAnalyticsEvents(): any[] {
  return readJsonKey<any[]>(STORAGE_KEYS.ANALYTICS_EVENTS) || [];
}

export function saveAnalyticsEvents(events: any[]): boolean {
  return writeJsonKey(STORAGE_KEYS.ANALYTICS_EVENTS, events);
}

export function loadWeeklyInsights(): any[] {
  return readJsonKey<any[]>(STORAGE_KEYS.WEEKLY_INSIGHTS) || [];
}

export function saveWeeklyInsights(insights: any[]): boolean {
  return writeJsonKey(STORAGE_KEYS.WEEKLY_INSIGHTS, insights);
}

export function loadNotificationsSent(): Record<string, string> {
  return readJsonKey<Record<string, string>>(STORAGE_KEYS.NOTIFICATIONS_SENT) || {};
}

export function loadNotificationFrequency(): Record<string, any> {
  return readJsonKey<Record<string, any>>(STORAGE_KEYS.NOTIFICATION_FREQ) || {};
}

export function loadSkillMap(): Record<string, SkillProgress> {
  return readJsonKey<Record<string, SkillProgress>>(STORAGE_KEYS.SKILL_MAP) || {};
}

export function saveSkillMap(map: Record<string, SkillProgress>): boolean {
  return writeJsonKey(STORAGE_KEYS.SKILL_MAP, map);
}

export function loadWidgetCommandQueue(): any[] {
  return readJsonKey<any[]>(STORAGE_KEYS.WIDGET_COMMANDS) || [];
}

export function saveWidgetCommandQueue(cmds: any[]): boolean {
  return writeJsonKey(STORAGE_KEYS.WIDGET_COMMANDS, cmds);
}

export function loadWidgetCache(): any | null {
  return readJsonKey<any>(STORAGE_KEYS.WIDGET_CACHE);
}

export function saveWidgetCache(cache: any): boolean {
  return writeJsonKey(STORAGE_KEYS.WIDGET_CACHE, cache);
}

export function loadDailyPlan(): any | null {
  return readJsonKey<any>(STORAGE_KEYS.DAILY_PLAN);
}

export function saveDailyPlan(plan: any): boolean {
  return writeJsonKey(STORAGE_KEYS.DAILY_PLAN, plan);
}

export function isOnboardingDone(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE) === 'true';
  } catch {
    return false;
  }
}

export function markOnboardingDone(): boolean {
  return writeStringKey(STORAGE_KEYS.ONBOARDING_DONE, 'true');
}

export function loadCrashLogs(): any[] {
  return readJsonKey<any[]>(STORAGE_KEYS.CRASH_LOGS) || [];
}

export function saveCrashLogs(logs: any[]): boolean {
  return writeJsonKey(STORAGE_KEYS.CRASH_LOGS, logs);
}

export function loadLastSyncs(): Record<string, string> {
  return readJsonKey<Record<string, string>>(STORAGE_KEYS.LAST_SYNC) || {};
}

export function saveLastSyncs(syncs: Record<string, string>): boolean {
  return writeJsonKey(STORAGE_KEYS.LAST_SYNC, syncs);
}

export function getDeviceTimeCheck(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.DEVICE_TIME_CHECK);
  } catch {
    return null;
  }
}

export function saveDeviceTimeCheck(value: string): boolean {
  return writeStringKey(STORAGE_KEYS.DEVICE_TIME_CHECK, value);
}

export function getDataVersion(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
    return raw ? parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
}

export function saveDataVersion(version: number): boolean {
  return writeStringKey(STORAGE_KEYS.DATA_VERSION, String(version));
}

/**
 * Persist notification "sent" map (single-writer entrypoint)
 */
export async function persistNotificationsSent(sent: Record<string, string>): Promise<boolean> {
  return enqueuePersist(async () => {
    try {
      writeJsonKey(STORAGE_KEYS.NOTIFICATIONS_SENT, sent);
      try {
        const _mod = '@capacitor/preferences';
        const { Preferences } = await import(_mod).catch(() => ({ Preferences: null }));
        if (Preferences) {
          await Preferences.set({ key: STORAGE_KEYS.NOTIFICATIONS_SENT, value: JSON.stringify(sent) });
        }
      } catch (e) {
        // best-effort native write
      }
      return true;
    } catch (e) {
      console.error('[PersistenceOwner] persistNotificationsSent failed:', e);
      return false;
    }
  });
}

export async function persistSocialGraph(socialGraph: SocialGraph): Promise<boolean> {
  return enqueuePersist(async () => {
    try {
      writeJsonKey(STORAGE_KEYS.SOCIAL_GRAPH, socialGraph);
      try {
        const _mod = '@capacitor/preferences';
        const { Preferences } = await import(_mod).catch(() => ({ Preferences: null }));
        if (Preferences) {
          await Preferences.set({ key: STORAGE_KEYS.SOCIAL_GRAPH, value: JSON.stringify(socialGraph) });
        }
      } catch (e) {
        // best-effort native write
      }
      return true;
    } catch (e) {
      console.error('[PersistenceOwner] persistSocialGraph failed:', e);
      return false;
    }
  });
}

export async function persistLocalePreferences(localePreferences: { locale: string; language: string }): Promise<boolean> {
  return enqueuePersist(async () => {
    try {
      writeJsonKey(STORAGE_KEYS.LOCALE_PREFERENCES, localePreferences);
      try {
        const _mod = '@capacitor/preferences';
        const { Preferences } = await import(_mod).catch(() => ({ Preferences: null }));
        if (Preferences) {
          await Preferences.set({ key: STORAGE_KEYS.LOCALE_PREFERENCES, value: JSON.stringify(localePreferences) });
        }
      } catch (e) {
        // best-effort native write
      }
      return true;
    } catch (e) {
      console.error('[PersistenceOwner] persistLocalePreferences failed:', e);
      return false;
    }
  });
}

/**
 * Persist notification frequency map (single-writer entrypoint)
 */
export async function persistNotificationFrequency(map: Record<string, any>): Promise<boolean> {
  return enqueuePersist(async () => {
    try {
      writeJsonKey(STORAGE_KEYS.NOTIFICATION_FREQ, map);
      try {
        const _mod = '@capacitor/preferences';
        const { Preferences } = await import(_mod).catch(() => ({ Preferences: null }));
        if (Preferences) {
          await Preferences.set({ key: STORAGE_KEYS.NOTIFICATION_FREQ, value: JSON.stringify(map) });
        }
      } catch (e) {
        // best-effort native write
      }
      return true;
    } catch (e) {
      console.error('[PersistenceOwner] persistNotificationFrequency failed:', e);
      return false;
    }
  });
}
