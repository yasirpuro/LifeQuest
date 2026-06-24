/**
 * Production Safety Engine:
 * - Crash recovery screen
 * - Data versioning (schema migration)
 * - Offline conflict resolution
 * - Time tampering detection
 */

import {
  loadJsonKey,
  saveDataVersion,
  loadCrashLogs,
  saveCrashLogs,
  loadLastSyncs,
  saveLastSyncs,
  getDeviceTimeCheck,
  saveDeviceTimeCheck,
} from './persistenceOwner';

const DATA_VERSION_KEY = 'lifequest_data_version';

export interface CrashLog {
  timestamp: string; // ISO
  error: string;
  stack?: string;
  recovered: boolean;
  retryCount: number;
}

export const DATA_VERSION = 2; // Current schema version

/**
 * Log crash for debugging
 */
export function logCrash(error: Error | string): void {
  try {
    const log: CrashLog = {
      timestamp: new Date().toISOString(),
      error: typeof error === 'string' ? error : error.message,
      stack: error instanceof Error ? error.stack : undefined,
      recovered: false,
      retryCount: 0,
    };

    const logs = getCrashLogs();
    logs.push(log);
    // Keep only last 10 crashes
    if (logs.length > 10) logs.shift();
    saveCrashLogs(logs);
  } catch (e) {
    console.error('Failed to log crash', e);
  }
}

/**
 * Get crash logs
 */
export function getCrashLogs(): CrashLog[] {
  try {
    return loadCrashLogs();
  } catch {
    return [];
  }
}

/**
 * Recovery flow: user saw crash, offer recovery options
 */
export function getRecoveryOptions(crashLog: CrashLog): string[] {
  const options: string[] = [
    'Recover from last checkpoint',
    'Reload app',
    'Clear cache (⚠️ data loss)',
  ];

  if (crashLog.retryCount < 2) {
    options.unshift('Try again');
  }

  return options;
}

/**
 * Check for data version mismatch
 */
export function getDataVersion(): number {
  try {
    const raw = loadJsonKey<string>(DATA_VERSION_KEY);
    return raw ? parseInt(raw) : 1;
  } catch {
    return 1;
  }
}

export function setDataVersion(version: number): void {
  try {
    saveDataVersion(version);
  } catch (e) {
    console.error('Failed to set data version', e);
  }
}

/**
 * Schema migration v1 → v2
 * Adds: skill decay, recovery state, streak risk level
 */
export function migrateSchemaV1toV2(state: any): any {
  const migrated = { ...state };

  // Ensure all skills have decay system
  if (migrated.skills) {
    Object.values(migrated.skills).forEach((skill: any) => {
      if (!('decayRate' in skill)) skill.decayRate = 0.05;
      if (!('lastDecayCheck' in skill)) skill.lastDecayCheck = null;
    });
  }

  // Ensure user has recovery state
  if (migrated.user && !('recoveryState' in migrated.user)) {
    migrated.user.recoveryState = { tokens: [], streakFrozen: false, lastRecovery: null };
  }

  if (migrated.user && !('streakRiskLevel' in migrated.user)) {
    migrated.user.streakRiskLevel = 'safe';
  }

  return migrated;
}

/**
 * Track last sync timestamp
 */
export function recordSync(location: 'local' | 'preferences' | 'filesystem'): void {
  try {
    const syncs = getLastSyncs();
    syncs[location] = new Date().toISOString();
    saveLastSyncs(syncs);  } catch (e) {
    console.error('Failed to record sync', e);
  }
}

export function getLastSyncs(): Record<string, string> {
  try {
    return loadLastSyncs();
  } catch {
    return {};
  }
}

/**
 * Detect time tampering (user changed device clock)
 * Returns true if suspicious time jump detected
 */
export function detectTimeTampering(): boolean {
  try {
    const raw = getDeviceTimeCheck();
    if (!raw) {
      saveDeviceTimeCheck(new Date().toISOString());
      return false;
    }

    const lastCheck = new Date(raw).getTime();
    const now = Date.now();
    const drift = Math.abs(now - lastCheck);

    // If device time jumped > 24 hours since last check, suspect tampering
    const isSuspicious = drift > 24 * 60 * 60 * 1000;

    saveDeviceTimeCheck(new Date().toISOString());
    return isSuspicious;
  } catch {
    return false;
  }
}

/**
 * Resolve offline conflict: compare timestamps and keep most recent
 */
export function resolveConflict<T extends { timestamp?: string }>(local: T, remote: T): T {
  if (!local.timestamp || !remote.timestamp) return local;

  const localTime = new Date(local.timestamp).getTime();
  const remoteTime = new Date(remote.timestamp).getTime();

  return remoteTime > localTime ? remote : local;
}
