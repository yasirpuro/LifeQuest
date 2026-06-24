from pathlib import Path

root = Path('src')

files = {
    'utils/analyticsEngine.ts': {
        'replace': [
            (
                "const ANALYTICS_EVENTS_KEY = 'lifequest_analytics_events_v1';\n"
                "const WEEKLY_INSIGHTS_KEY = 'lifequest_weekly_insights_v1';\n\n"
                "/**\n"
                " * Track analytics event\n"
                " */\n",
                "import { loadAnalyticsEvents, saveAnalyticsEvents, loadWeeklyInsights, saveWeeklyInsights } from './persistenceOwner';\n\n"
                "/**\n"
                " * Track analytics event\n"
                " */\n",
            ),
            (
                "    const events = getAnalyticsEvents();\n"
                "    events.push(event);\n\n"
                "    // Keep last 1000 events\n"
                "    if (events.length > 1000) events.shift();\n"
                "    localStorage.setItem(ANALYTICS_EVENTS_KEY, JSON.stringify(events));\n",
                "    const events = loadAnalyticsEvents();\n"
                "    events.push(event);\n\n"
                "    // Keep last 1000 events\n"
                "    if (events.length > 1000) events.shift();\n"
                "    saveAnalyticsEvents(events);\n",
            ),
            (
                "export function getAnalyticsEvents(): AnalyticsEvent[] {\n"
                "  try {\n"
                "    const raw = localStorage.getItem(ANALYTICS_EVENTS_KEY);\n"
                "    return raw ? JSON.parse(raw) : [];\n"
                "  } catch {\n"
                "    return [];\n"
                "  }\n"
                "}\n",
                "export function getAnalyticsEvents(): AnalyticsEvent[] {\n"
                "  try {\n"
                "    return loadAnalyticsEvents();\n"
                "  } catch {\n"
                "    return [];\n"
                "  }\n"
                "}\n",
            ),
            (
                "export function getWeeklyInsights(): WeeklyInsight[] {\n"
                "  try {\n"
                "    const raw = localStorage.getItem(WEEKLY_INSIGHTS_KEY);\n"
                "    return raw ? JSON.parse(raw) : [];\n"
                "  } catch {\n"
                "    return [];\n"
                "  }\n"
                "}\n\n"
                "/**\n"
                " * Save weekly insight\n"
                " */\n"
                "export function saveWeeklyInsight(insight: WeeklyInsight): void {\n"
                "  try {\n"
                "    const insights = getWeeklyInsights();\n"
                "    const existing = insights.findIndex(i => i.week === insight.week);\n"
                "    if (existing !== -1) {\n"
                "      insights[existing] = insight;\n"
                "    } else {\n"
                "      insights.push(insight);\n"
                "    }\n"
                "    localStorage.setItem(WEEKLY_INSIGHTS_KEY, JSON.stringify(insights));\n"
                "  } catch (e) {\n"
                "    console.error('Failed to save weekly insight', e);\n"
                "  }\n"
                "}\n",
                "export function getWeeklyInsights(): WeeklyInsight[] {\n"
                "  try {\n"
                "    return loadWeeklyInsights();\n"
                "  } catch {\n"
                "    return [];\n"
                "  }\n"
                "}\n\n"
                "/**\n"
                " * Save weekly insight\n"
                " */\n"
                "export function saveWeeklyInsight(insight: WeeklyInsight): void {\n"
                "  try {\n"
                "    const insights = getWeeklyInsights();\n"
                "    const existing = insights.findIndex(i => i.week === insight.week);\n"
                "    if (existing !== -1) {\n"
                "      insights[existing] = insight;\n"
                "    } else {\n"
                "      insights.push(insight);\n"
                "    }\n"
                "    saveWeeklyInsights(insights);\n"
                "  } catch (e) {\n"
                "    console.error('Failed to save weekly insight', e);\n"
                "  }\n"
                "}\n",
            ),
        ],
    },
    'utils/widgetCommandBus.ts': {
        'replace': [
            (
                "/**\n"
                " * Widget Command Bus:\n"
                " * - Quick actions from widget (start skill, recover streak, etc.)\n"
                " * - Offline-safe command queue\n"
                " * - Widget state fallback & caching\n"
                " */\n\n"
                "export type WidgetAction = 'startSkill' | 'recoverStreak' | 'completeFocusQuest' | 'openDailyPlan';\n",
                "import { loadWidgetCommandQueue, saveWidgetCommandQueue, loadWidgetCache, saveWidgetCache } from './persistenceOwner';\n\n"
                "/**\n"
                " * Widget Command Bus:\n"
                " * - Quick actions from widget (start skill, recover streak, etc.)\n"
                " * - Offline-safe command queue\n"
                " * - Widget state fallback & caching\n"
                " */\n\n"
                "export type WidgetAction = 'startSkill' | 'recoverStreak' | 'completeFocusQuest' | 'openDailyPlan';\n",
            ),
            (
                "  try {\n"
                "    const cmds = getWidgetCommandQueue();\n"
                "    cmds.push(cmd);\n"
                "    localStorage.setItem(WIDGET_COMMANDS_KEY, JSON.stringify(cmds));\n"
                "  } catch (e) {\n"
                "    console.error('Failed to queue widget command', e);\n"
                "  }\n",
                "  try {\n"
                "    const cmds = getWidgetCommandQueue();\n"
                "    cmds.push(cmd);\n"
                "    saveWidgetCommandQueue(cmds);\n"
                "  } catch (e) {\n"
                "    console.error('Failed to queue widget command', e);\n"
                "  }\n",
            ),
            (
                "export function getWidgetCommandQueue(): WidgetCommand[] {\n"
                "  try {\n"
                "    const raw = localStorage.getItem(WIDGET_COMMANDS_KEY);\n"
                "    return raw ? JSON.parse(raw) : [];\n"
                "  } catch {\n"
                "    return [];\n"
                "  }\n"
                "}\n",
                "export function getWidgetCommandQueue(): WidgetCommand[] {\n"
                "  try {\n"
                "    return loadWidgetCommandQueue();\n"
                "  } catch {\n"
                "    return [];\n"
                "  }\n"
                "}\n",
            ),
            (
                "    const cmds = getWidgetCommandQueue();\n"
                "    const cmd = cmds.find(c => c.id === commandId);\n"
                "    if (cmd) cmd.processed = true;\n"
                "    localStorage.setItem(WIDGET_COMMANDS_KEY, JSON.stringify(cmds));\n"
                "  } catch (e) {\n"
                "    console.error('Failed to mark command processed', e);\n"
                "  }\n",
                "    const cmds = getWidgetCommandQueue();\n"
                "    const cmd = cmds.find(c => c.id === commandId);\n"
                "    if (cmd) cmd.processed = true;\n"
                "    saveWidgetCommandQueue(cmds);\n"
                "  } catch (e) {\n"
                "    console.error('Failed to mark command processed', e);\n"
                "  }\n",
            ),
            (
                "    const active = cmds.filter(c => !c.processed || (now - new Date(c.timestamp).getTime()) < olderThan);\n"
                "    localStorage.setItem(WIDGET_COMMANDS_KEY, JSON.stringify(active));\n"
                "  } catch (e) {\n"
                "    console.error('Failed to clean commands', e);\n"
                "  }\n",
                "    const active = cmds.filter(c => !c.processed || (now - new Date(c.timestamp).getTime()) < olderThan);\n"
                "    saveWidgetCommandQueue(active);\n"
                "  } catch (e) {\n"
                "    console.error('Failed to clean commands', e);\n"
                "  }\n",
            ),
            (
                "export function updateWidgetCache(cache: WidgetCache) {\n"
                "  try {\n"
                "    localStorage.setItem(WIDGET_CACHE_KEY, JSON.stringify(cache));\n"
                "  } catch (e) {\n"
                "    console.error('Failed to update widget cache', e);\n"
                "  }\n"
                "}\n",
                "export function updateWidgetCache(cache: WidgetCache) {\n"
                "  try {\n"
                "    saveWidgetCache(cache);\n"
                "  } catch (e) {\n"
                "    console.error('Failed to update widget cache', e);\n"
                "  }\n"
                "}\n",
            ),
            (
                "export function getWidgetCache(): WidgetCache | null {\n"
                "  try {\n"
                "    const raw = localStorage.getItem(WIDGET_CACHE_KEY);\n"
                "    return raw ? JSON.parse(raw) : null;\n"
                "  } catch {\n"
                "    return null;\n"
                "  }\n"
                "}\n",
                "export function getWidgetCache(): WidgetCache | null {\n"
                "  try {\n"
                "    return loadWidgetCache();\n"
                "  } catch {\n"
                "    return null;\n"
                "  }\n"
                "}\n",
            ),
        ],
    },
    'utils/smartNotificationScheduler.ts': {
        'replace': [
            (
                "import type { SkillProgress } from '../types';\n"
                "import { persistNotificationFrequency } from './persistenceOwner';\n\n"
                "interface NotificationFrequency {\n",
                "import type { SkillProgress } from '../types';\n"
                "import { loadNotificationFrequency, persistNotificationFrequency } from './persistenceOwner';\n\n"
                "interface NotificationFrequency {\n",
            ),
            (
                "const FREQ_STORAGE_KEY = 'lifequest_notify_freq_v1';\n\n"
                "/**\n"
                " * Smart Notification Scheduler:\n"
                " * - Context-aware (skill-based) notifications\n"
                " * - Inactivity detection\n"
                " * - Fatigue control (adaptive frequency)\n"
                " */\n\n"
                "function getFrequencyMap(): Record<string, NotificationFrequency> {\n"
                "  try {\n"
                "    const raw = localStorage.getItem(FREQ_STORAGE_KEY);\n"
                "    return raw ? JSON.parse(raw) : {};\n"
                "  } catch {\n"
                "    return {};\n"
                "  }\n"
                "}\n",
                "/**\n"
                " * Smart Notification Scheduler:\n"
                " * - Context-aware (skill-based) notifications\n"
                " * - Inactivity detection\n"
                " * - Fatigue control (adaptive frequency)\n"
                " */\n\n"
                "function getFrequencyMap(): Record<string, NotificationFrequency> {\n"
                "  try {\n"
                "    return loadNotificationFrequency();\n"
                "  } catch {\n"
                "    return {};\n"
                "  }\n"
                "}\n",
            ),
        ],
    },
    'utils/productionSafety.ts': {
        'replace': [
            (
                "const CRASH_LOG_KEY = 'lifequest_crash_log_v1';\n"
                "const DATA_VERSION_KEY = 'lifequest_data_version';\n"
                "const LAST_SYNC_KEY = 'lifequest_last_sync_v1';\n"
                "const DEVICE_TIME_CHECK_KEY = 'lifequest_device_time_check';\n\n"
                "export interface CrashLog {\n",
                "import { loadCrashLogs, saveCrashLogs, loadLastSyncs, saveLastSyncs, getDeviceTimeCheck, saveDeviceTimeCheck, getDataVersion as loadDataVersion, saveDataVersion as persistDataVersion } from './persistenceOwner';\n\n"
                "const CRASH_LOG_KEY = 'lifequest_crash_log_v1';\n"
                "const DATA_VERSION_KEY = 'lifequest_data_version';\n"
                "const LAST_SYNC_KEY = 'lifequest_last_sync_v1';\n"
                "const DEVICE_TIME_CHECK_KEY = 'lifequest_device_time_check';\n\n"
                "export interface CrashLog {\n",
            ),
            (
                "    const logs = getCrashLogs();\n"
                "    logs.push(log);\n"
                "    // Keep only last 10 crashes\n"
                "    if (logs.length > 10) logs.shift();\n"
                "    localStorage.setItem(CRASH_LOG_KEY, JSON.stringify(logs));\n"
                "  } catch (e) {\n",
                "    const logs = getCrashLogs();\n"
                "    logs.push(log);\n"
                "    // Keep only last 10 crashes\n"
                "    if (logs.length > 10) logs.shift();\n"
                "    saveCrashLogs(logs);\n"
                "  } catch (e) {\n",
            ),
            (
                "export function getCrashLogs(): CrashLog[] {\n"
                "  try {\n"
                "    const raw = localStorage.getItem(CRASH_LOG_KEY);\n"
                "    return raw ? JSON.parse(raw) : [];\n"
                "  } catch {\n"
                "    return [];\n"
                "  }\n"
                "}\n",
                "export function getCrashLogs(): CrashLog[] {\n"
                "  try {\n"
                "    return loadCrashLogs();\n"
                "  } catch {\n"
                "    return [];\n"
                "  }\n"
                "}\n",
            ),
            (
                "export function getDataVersion(): number {\n"
                "  try {\n"
                "    const raw = localStorage.getItem(DATA_VERSION_KEY);\n"
                "    return raw ? parseInt(raw) : 1;\n"
                "  } catch {\n"
                "    return 1;\n"
                "  }\n"
                "}\n\n"
                "export function setDataVersion(version: number): void {\n"
                "  try {\n"
                "    localStorage.setItem(DATA_VERSION_KEY, String(version));\n"
                "  } catch (e) {\n"
                "    console.error('Failed to set data version', e);\n"
                "  }\n"
                "}\n",
                "export function getDataVersion(): number {\n"
                "  try {\n"
                "    return loadDataVersion();\n"
                "  } catch {\n"
                "    return 1;\n"
                "  }\n"
                "}\n\n"
                "export function setDataVersion(version: number): void {\n"
                "  try {\n"
                "    persistDataVersion(version);\n"
                "  } catch (e) {\n"
                "    console.error('Failed to set data version', e);\n"
                "  }\n"
                "}\n",
            ),
            (
                "export function recordSync(location: 'local' | 'preferences' | 'filesystem'): void {\n"
                "  try {\n"
                "    const syncs = getLastSyncs();\n"
                "    syncs[location] = new Date().toISOString();\n"
                "    localStorage.setItem(LAST_SYNC_KEY, JSON.stringify(syncs));\n"
                "  } catch (e) {\n"
                "    console.error('Failed to record sync', e);\n"
                "  }\n"
                "}\n\n"
                "export function getLastSyncs(): Record<string, string> {\n"
                "  try {\n"
                "    const raw = localStorage.getItem(LAST_SYNC_KEY);\n"
                "    return raw ? JSON.parse(raw) : {};\n"
                "  } catch {\n"
                "    return {};\n"
                "  }\n"
                "}\n",
                "export function recordSync(location: 'local' | 'preferences' | 'filesystem'): void {\n"
                "  try {\n"
                "    const syncs = getLastSyncs();\n"
                "    syncs[location] = new Date().toISOString();\n"
                "    saveLastSyncs(syncs);\n"
                "  } catch (e) {\n"
                "    console.error('Failed to record sync', e);\n"
                "  }\n"
                "}\n\n"
                "export function getLastSyncs(): Record<string, string> {\n"
                "  try {\n"
                "    return loadLastSyncs();\n"
                "  } catch {\n"
                "    return {};\n"
                "  }\n"
                "}\n",
            ),
            (
                "export function detectTimeTampering(): boolean {\n"
                "  try {\n"
                "    const raw = localStorage.getItem(DEVICE_TIME_CHECK_KEY);\n"
                "    if (!raw) {\n"
                "      localStorage.setItem(DEVICE_TIME_CHECK_KEY, new Date().toISOString());\n"
                "      return false;\n"
                "    }\n\n"
                "    const lastCheck = new Date(raw).getTime();\n"
                "    const now = Date.now();\n"
                "    const drift = Math.abs(now - lastCheck);\n\n"
                "    // If device time jumped > 24 hours since last check, suspect tampering\n"
                "    const isSuspicious = drift > 24 * 60 * 60 * 1000;\n\n"
                "    localStorage.setItem(DEVICE_TIME_CHECK_KEY, new Date().toISOString());\n"
                "    return isSuspicious;\n"
                "  } catch {\n"
                "    return false;\n"
                "  }\n"
                "}\n",
                "export function detectTimeTampering(): boolean {\n"
                "  try {\n"
                "    const raw = getDeviceTimeCheck();\n"
                "    if (!raw) {\n"
                "      saveDeviceTimeCheck(new Date().toISOString());\n"
                "      return false;\n"
                "    }\n\n"
                "    const lastCheck = new Date(raw).getTime();\n"
                "    const now = Date.now();\n"
                "    const drift = Math.abs(now - lastCheck);\n\n"
                "    // If device time jumped > 24 hours since last check, suspect tampering\n"
                "    const isSuspicious = drift > 24 * 60 * 60 * 1000;\n\n"
                "    saveDeviceTimeCheck(new Date().toISOString());\n"
                "    return isSuspicious;\n"
                "  } catch {\n"
                "    return false;\n"
                "  }\n"
                "}\n",
            ),
        ],
    },
    'components/OnboardingWizard.tsx': {
        'replace': [
            (
                "import React, { useState } from 'react';\n"
                "import { useApp } from '../hooks/useApp';\n"
                "import { SKILL_TREE } from '../data/skillTree';\n"
                "import styles from './OnboardingWizard.module.css';\n\n"
                "interface WizardStep {\n",
                "import React, { useState } from 'react';\n"
                "import { useApp } from '../hooks/useApp';\n"
                "import { SKILL_TREE } from '../data/skillTree';\n"
                "import styles from './OnboardingWizard.module.css';\n"
                "import { isOnboardingDone as persistenceIsOnboardingDone, markOnboardingDone as persistenceMarkOnboardingDone } from '../utils/persistenceOwner';\n\n"
                "interface WizardStep {\n",
            ),
            (
                "const WIZARD_KEY = 'lifequest_onboarding_done';\n\n"
                "export function isOnboardingDone(): boolean {\n"
                "  try {\n"
                "    return localStorage.getItem(WIZARD_KEY) === 'true';\n"
                "  } catch {\n"
                "    return false;\n"
                "  }\n"
                "}\n\n"
                "export function markOnboardingDone() {\n"
                "  try {\n"
                "    localStorage.setItem(WIZARD_KEY, 'true');\n"
                "  } catch (e) {\n"
                "    console.error('Failed to mark onboarding done', e);\n"
                "  }\n"
                "}\n\n"
                "export default function OnboardingWizard({ onComplete }: { onComplete?: () => void }) {\n",
                "export function isOnboardingDone(): boolean {\n"
                "  return persistenceIsOnboardingDone();\n"
                "}\n\n"
                "export function markOnboardingDone() {\n"
                "  return persistenceMarkOnboardingDone();\n"
                "}\n\n"
                "export default function OnboardingWizard({ onComplete }: { onComplete?: () => void }) {\n",
            ),
        ],
    },
    'utils/questCompletionOrchestrator.ts': {
        'replace': [
            (
                "    // PHASE 10.5: RECONCILIATION CHECK\n"
                "    // ============================================================\n"
                "    const reconciliation = await verifyAndRepairSync({\n"
                "      state,\n"
                "      skillMap,\n"
                "      lastQuestCompletedAt: now,\n"
                "      cache: loadWidgetCache(),\n"
                "      expectedWidgetData: {\n"
                "        focusSkillId: focusSkill?.skillId || null,\n"
                "        focusMastery: focusSkill?.mastery || 0,\n"
                "        streak: newStreak,\n"
                "        streakRisk: daysSinceLastQuest > 1 ? 'critical' : daysSinceLastQuest === 1 ? 'warning' : 'safe',\n"
                "        dailyProgress: { completed: state.quests.filter(q => q.completed).length, total: state.quests.length },\n"
                "        lastUpdate: now,\n"
                "      },\n"
                "    });\n\n"
                "    // PHASE 11: ANALYTICS TRACKING\n",
                "    // PHASE 10.5: RECONCILIATION CHECK SKIPPED (single-writer only)\n"
                "    // ============================================================\n"
                "    // Reconciliation is handled separately by the persistence owner; no direct native or write-side checks here.\n\n"
                "    // PHASE 11: ANALYTICS TRACKING\n",
            ),
        ],
    },
    'utils/reconciliationLayer.ts': {
        'replace': [
            (
                "  // CHECK 2: Native preferences vs AppState (best-effort, diagnostic)\n"
                "  try {\n"
                "    report.checksPerformed.push('native_preferences_check');\n"
                "    const nativeState = await getNativePreferencesState().catch(() => null);\n"
                "    if (nativeState) {\n"
                "      // Compare a small set of keys to detect divergence\n"
                "      if (nativeState.streak !== state.user.streak) {\n"
                "        report.mismatches.push({ component: 'native.streak', expected: state.user.streak, actual: nativeState.streak });\n"
                "        enqueueRepair('native_storage_resync', { key: 'streak', value: state.user.streak });\n"
                "        report.repairsApplied.push('native.streak_queued_for_resync');\n"
                "      }\n"
                "    }\n"
                "  } catch (e) {\n"
                "    // ignore native failures in diagnostics\n"
                "  }\n\n"
                "  // Populate retryQueue snapshot for report\n",
                "  // CHECK 2: Native preferences diagnostics skipped\n"
                "  try {\n"
                "    report.checksPerformed.push('native_preferences_check');\n"
                "    report.repairsApplied.push('native.preferences_skipped');\n"
                "  } catch (e) {\n"
                "    // ignore native diagnostics\n"
                "  }\n\n"
                "  // Populate retryQueue snapshot for report\n",
            ),
        ],
    },
}

for relative_path, data in files.items():
    path = root / relative_path
    if not path.exists():
        print(f'WARN: {path} missing')
        continue
    text = path.read_text(encoding='utf-8')
    for old, new in data['replace']:
        if old in text:
            text = text.replace(old, new)
        else:
            print(f'NO MATCH in {relative_path}: {old[:120]!r}')
    path.write_text(text, encoding='utf-8')
    print(f'PATCHED {relative_path}')
