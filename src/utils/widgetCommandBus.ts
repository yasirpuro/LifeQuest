/**
 * Widget Command Bus:
 * - Quick actions from widget (start skill, recover streak, etc.)
 * - Offline-safe command queue
 * - Widget state fallback & caching
 */

export type WidgetAction = 'startSkill' | 'recoverStreak' | 'completeFocusQuest' | 'openDailyPlan';

export interface WidgetCommand {
  id: string;
  action: WidgetAction;
  skillId?: string;
  questId?: string;
  timestamp: string; // ISO
  processed: boolean;
}

import { loadWidgetCommandQueue, saveWidgetCommandQueue, loadWidgetCache, saveWidgetCache } from './persistenceOwner';

// storage keys (kept for reference)

export interface WidgetCache {
  focusSkillId: string | null;
  focusMastery: number;
  streak: number;
  streakRisk: 'safe' | 'warning' | 'critical';
  dailyProgress: { completed: number; total: number };
  lastUpdate: string; // ISO
}

/**
 * Queue widget command (offline-safe)
 */
export function queueWidgetCommand(action: WidgetAction, skillId?: string, questId?: string): WidgetCommand {
  const cmd: WidgetCommand = {
    id: `cmd-${Date.now()}`,
    action,
    skillId,
    questId,
    timestamp: new Date().toISOString(),
    processed: false,
  };

  try {
    const cmds = getWidgetCommandQueue();
    cmds.push(cmd);
    saveWidgetCommandQueue(cmds);
  } catch (e) {
    console.error('Failed to queue widget command', e);
  }

  return cmd;
}

/**
 * Get pending commands
 */
export function getWidgetCommandQueue(): WidgetCommand[] {
  try {
    return (loadWidgetCommandQueue() || []) as WidgetCommand[];
  } catch {
    return [];
  }
}

/**
 * Mark command as processed
 */
export function markCommandProcessed(commandId: string) {
  try {
    const cmds = getWidgetCommandQueue();
    const cmd = cmds.find(c => c.id === commandId);
    if (cmd) cmd.processed = true;
    saveWidgetCommandQueue(cmds);
  } catch (e) {
    console.error('Failed to mark widget command processed', e);
  }
}

/**
 * Widget cache helpers
 */
export function getWidgetCache(): WidgetCache | null {
  try {
    return (loadWidgetCache() as WidgetCache) || null;
  } catch {
    return null;
  }
}

export function updateWidgetCache(updater: ((prev: WidgetCache | null) => WidgetCache) | WidgetCache) {
  try {
    const prev = getWidgetCache();
    const next = typeof updater === 'function' ? (updater as (prev: WidgetCache | null) => WidgetCache)(prev) : (updater as WidgetCache);
    saveWidgetCache(next);
  } catch (e) {
    console.error('Failed to update widget cache', e);
  }
}
