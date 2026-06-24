import type { SkillProgress } from '../types';
import { loadNotificationFrequency, persistNotificationFrequency } from './persistenceOwner';

interface NotificationFrequency {
  ignoreCount: number;
  lastShown?: string; // ISO timestamp
  nextEligible: string; // ISO timestamp
  frequency: 'high' | 'normal' | 'low' | 'paused';
}

function getFrequencyMap(): Record<string, NotificationFrequency> {
  try {
    return loadNotificationFrequency() || {};
  } catch {
    return {};
  }
}

function saveFrequencyMap(map: Record<string, NotificationFrequency>) {
  try {
    void persistNotificationFrequency(map).catch(() => {
      // best-effort
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to persist notification frequency', e);
  }
}

/**
 * Track notification ignore/dismiss and adapt frequency
 */
export function trackNotificationIgnored(skillId: string, nowIso: string = new Date().toISOString()) {
  const map = getFrequencyMap();
  const freq = map[skillId] || { ignoreCount: 0, lastShown: nowIso, frequency: 'normal', nextEligible: nowIso };

  freq.ignoreCount = (freq.ignoreCount || 0) + 1;
  freq.lastShown = nowIso;

  if (freq.ignoreCount >= 5) freq.frequency = 'paused';
  else if (freq.ignoreCount >= 3) freq.frequency = 'low';

  const nextMs = freq.frequency === 'high' ? 2 * 60 * 60 * 1000
    : freq.frequency === 'normal' ? 6 * 60 * 60 * 1000
    : freq.frequency === 'low' ? 24 * 60 * 60 * 1000
    : 7 * 24 * 60 * 60 * 1000;

  const next = new Date(nowIso);
  next.setTime(next.getTime() + nextMs);
  freq.nextEligible = next.toISOString();

  map[skillId] = freq;
  saveFrequencyMap(map);
}

/**
 * Track successful notification engagement and relax limits
 */
export function trackNotificationEngaged(skillId: string, nowIso: string = new Date().toISOString()) {
  const map = getFrequencyMap();
  const freq = map[skillId] || { ignoreCount: 0, lastShown: nowIso, frequency: 'normal', nextEligible: nowIso };

  freq.ignoreCount = Math.max(0, (freq.ignoreCount || 0) - 1);
  freq.lastShown = nowIso;
  freq.frequency = 'normal';

  const next = new Date(nowIso);
  next.setTime(next.getTime() + 4 * 60 * 60 * 1000);
  freq.nextEligible = next.toISOString();

  map[skillId] = freq;
  saveFrequencyMap(map);
}

/**
 * Decide whether a skill is eligible for a notification now.
 */
export function canSendNotification(skillId: string, skill: SkillProgress, nowIso: string = new Date().toISOString()): boolean {
  const map = getFrequencyMap();
  const freq = map[skillId];

  if (freq?.frequency === 'paused') return false;
  if (freq?.nextEligible && new Date(freq.nextEligible) > new Date(nowIso)) return false;
  if (skill.nextDue && new Date(skill.nextDue) > new Date(nowIso)) return false;

  if (freq?.lastShown) {
    const last = new Date(freq.lastShown);
    const diff = new Date(nowIso).getTime() - last.getTime();
    if (diff < 60 * 60 * 1000) return false; // avoid reshow within 1h
  }

  return true;
}

/**
 * Build a simple notification payload for a skill.
 */
export function buildNotificationContent(_skill: SkillProgress, skillId: string, importance: 'low' | 'normal' | 'high' = 'normal') {
  const title = importance === 'high' ? 'Reminder: time to practice!' : 'Time to level up your skill';
  const body = skillId ? `Keep going with ${skillId}! Try a short quest to earn XP.` : `Try a short quest to earn XP and progress.`;

  return { title, body, skillId, importance };
}
