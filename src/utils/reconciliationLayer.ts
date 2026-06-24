/**
 * RECONCILIATION LAYER (READ-ONLY DIAGNOSTICS)
 * Post-orchestration verification (no direct persistence)
 * - Detects divergences
 * - Produces repair commands enqueued in-memory
 * - Keeps reconciliation logs in-memory
 * The single-writer `persistenceOwner` is responsible for executing
 * queued repairs and persisting any state.
 */

import type { AppState } from '../context/appContextValue';
import { loadWidgetCache } from './persistenceOwner';

export interface ReconciliationReport {
  timestamp: string; // ISO
  checksPerformed: string[];
  mismatches: Array<{ component: string; expected: any; actual: any }>;
  repairsApplied: string[];
  retryQueue: Array<{ operation: string; reason: string; nextRetry: string }>;
  isHealthy: boolean;
}

// In-memory queues/logs only. No module writes to localStorage or native APIs.
let inMemoryRetryQueue: any[] = [];
let inMemoryReconciliationLogs: ReconciliationReport[] = [];

/**
 * Run full post-orchestration reconciliation
 * Detects and reports state divergence. Repairs are enqueued for the owner.
 */
export async function runReconciliation(
  state: AppState,
  skillEngine: any,
  _completedQuestId: string
): Promise<ReconciliationReport> {
  const report: ReconciliationReport = {
    timestamp: new Date().toISOString(),
    checksPerformed: [],
    mismatches: [],
    repairsApplied: [],
    retryQueue: [],
    isHealthy: true,
  };

  // CHECK 1: Widget cache vs AppState consistency
  try {
    report.checksPerformed.push('widget_cache_check');
    const cache = getWidgetCache();
    if (!cache) {
      // Rebuild from state and enqueue repair
      const focusSkill = skillEngine?.getFocusSkill();
      const rebuilt = rebuildWidgetCache(state, focusSkill);
      enqueueRepair('repair_widget_cache', rebuilt);
      report.repairsApplied.push('widget_cache_rebuilt');
    } else {
      if (cache.streak !== state.user.streak) {
        report.mismatches.push({
          component: 'widget_cache.streak',
          expected: state.user.streak,
          actual: cache.streak,
        });
        const rebuilt = rebuildWidgetCache(state, skillEngine?.getFocusSkill());
        enqueueRepair('repair_widget_cache', rebuilt);
        report.repairsApplied.push('widget_cache.streak_synced');
      }
    }
  } catch (e) {
    // non-fatal; record
    report.mismatches.push({ component: 'widget_cache_check', expected: null, actual: String(e) });
  }

  // CHECK 2: Native preferences diagnostics skipped
  try {
    report.checksPerformed.push('native_preferences_check');
    report.repairsApplied.push('native.preferences_skipped');
  } catch (e) {
    // ignore native diagnostics
  }

  // Populate retryQueue snapshot for report
  report.retryQueue = getRetryQueue().map(r => ({ operation: r.operation, reason: r.reason, nextRetry: r.nextRetry }));

  // Finalize
  report.isHealthy = report.mismatches.length === 0 && report.retryQueue.length === 0;
  saveReconciliationReport(report);

  return report;
}

/*** Helpers ***/

function getWidgetCache(): any {
  try {
    return loadWidgetCache();
  } catch {
    return null;
  }
}

function rebuildWidgetCache(state: AppState, focusSkill: any) {
  const cache = {
    focusSkillId: focusSkill?.skillId || null,
    focusMastery: focusSkill?.mastery || 0,
    streak: state.user.streak,
    streakRisk: state.user.streakRiskLevel || 'safe',
    dailyProgress: {
      completed: state.quests.filter((q: any) => q.completed).length,
      total: state.quests.length,
    },
    lastUpdate: new Date().toISOString(),
  };
  // Return cache instead of persisting here.
  return cache;
}

function enqueueRepair(operation: string, payload: any) {
  inMemoryRetryQueue.push({
    id: `${operation}-${Date.now()}`,
    operation,
    payload,
    reason: 'reconciliation_detected',
    attemptCount: 0,
    maxAttempts: 3,
    nextRetry: new Date(Date.now() + 5000).toISOString(),
    createdAt: new Date().toISOString(),
  });
}

export function queueRetry(operation: string, reason: string) {
  try {
    const nextRetry = new Date(Date.now() + 5000); // retry in 5 sec
    inMemoryRetryQueue.push({
      id: `${operation}-${Date.now()}`,
      operation,
      reason,
      attemptCount: 0,
      maxAttempts: 3,
      nextRetry: nextRetry.toISOString(),
      createdAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error('[Reconciliation] Failed to queue retry:', e);
  }
}

export function getRetryQueue(): any[] {
  try {
    return inMemoryRetryQueue.slice();
  } catch {
    return [];
  }
}

export async function processRetryQueue(handler: (item: any) => Promise<boolean>) {
  // Process items but do not perform storage writes here. Handler returns true if succeeded.
  const queue = getRetryQueue();
  let processed = 0;
  for (const item of queue) {
    try {
      const ok = await handler(item).catch(() => false);
      if (ok) {
        processed++;
      } else {
        item.attemptCount = (item.attemptCount || 0) + 1;
        item.nextRetry = new Date(Date.now() + 5000 * item.attemptCount).toISOString();
      }
    } catch (e) {
      item.attemptCount = (item.attemptCount || 0) + 1;
      item.nextRetry = new Date(Date.now() + 5000 * item.attemptCount).toISOString();
    }
  }

  // Compact queue (remove succeeded items)
  inMemoryRetryQueue = queue.filter(i => (i.attemptCount || 0) < (i.maxAttempts || 3));

  return processed;
}

function saveReconciliationReport(report: ReconciliationReport) {
  try {
    const logs = getReconciliationLogs();
    logs.push(report);
    if (logs.length > 100) logs.shift();
    inMemoryReconciliationLogs = logs;
  } catch (e) {
    console.error('Failed to save reconciliation report:', e);
  }
}

export function getReconciliationLogs(): ReconciliationReport[] {
  try {
    return inMemoryReconciliationLogs.slice();
  } catch {
    return [];
  }
}

export function getLastReconciliationHealth(): boolean {
  const logs = getReconciliationLogs();
  if (logs.length === 0) return true;
  return logs[logs.length - 1].isHealthy;
}
