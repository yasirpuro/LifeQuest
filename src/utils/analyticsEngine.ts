/**
 * Analytics & Insights Engine:
 * - Product analytics (funnel, cohorts, user progression)
 * - Self-improvement insights (weekly reports, weak skill detection)
 */

export interface AnalyticsEvent {
  name: string;
  timestamp: string; // ISO
  userId?: string;
  properties: Record<string, any>;
}

export interface FunnelStep {
  name: string;
  count: number;
  conversionRate: number;
}

export interface WeeklyInsight {
  week: string; // YYYY-W##
  totalXp: number;
  questsCompleted: number;
  skillsMastered: string[];
  weakSkills: string[];
  avgStreak: number;
  focusSkill: string | null;
  trends: { skill: string; change: number }[]; // mastery change %
}

import { loadAnalyticsEvents, saveAnalyticsEvents, loadWeeklyInsights, saveWeeklyInsights } from './persistenceOwner';

/**
 * Track analytics event
 */
export function trackEvent(name: string, properties: Record<string, any> = {}): void {
  try {
    const event: AnalyticsEvent = {
      name,
      timestamp: new Date().toISOString(),
      properties,
    };

    const events = loadAnalyticsEvents();
    events.push(event);

    // Keep last 1000 events
    if (events.length > 1000) events.shift();
    saveAnalyticsEvents(events);
  } catch (e) {
    console.error('Failed to track event', e);
  }
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  try {
    return loadAnalyticsEvents();
  } catch {
    return [];
  }
}

/**
 * Calculate onboarding funnel
 * Track: start → select focus → complete first quest → set habit
 */
export function getOnboardingFunnel(): FunnelStep[] {
  const events = getAnalyticsEvents();

  const starts = events.filter(e => e.name === 'onboarding_start').length;
  const focusSelected = events.filter(e => e.name === 'focus_skill_selected').length;
  const firstQuest = events.filter(e => e.name === 'first_quest_completed').length;
  const habitSet = events.filter(e => e.name === 'habit_loop_created').length;

  return [
    { name: 'Start Onboarding', count: starts, conversionRate: 100 },
    { name: 'Select Focus', count: focusSelected, conversionRate: starts > 0 ? (focusSelected / starts) * 100 : 0 },
    { name: 'Complete Quest', count: firstQuest, conversionRate: focusSelected > 0 ? (firstQuest / focusSelected) * 100 : 0 },
    { name: 'Set Habit', count: habitSet, conversionRate: firstQuest > 0 ? (habitSet / firstQuest) * 100 : 0 },
  ];
}

/**
 * Detect weak skills (low mastery, high inactivity)
 */
export function detectWeakSkills(skillMap: Record<string, any>, threshold = 30): string[] {
  const weak: string[] = [];

  Object.entries(skillMap).forEach(([id, skill]) => {
    if (skill.mastery < threshold) {
      weak.push(id);
    }
  });

  return weak;
}

/**
 * Generate weekly insight report
 */
export function generateWeeklyInsight(
  skillMap: Record<string, any>,
  questHistory: Array<{ completedAt: string; skillId?: string; xp: number }>,
  currentFocus: string | null
): WeeklyInsight {
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekKey = weekStart.toISOString().split('T')[0]; // YYYY-MM-DD of week start

  // Filter quests from this week
  const weekQuests = questHistory.filter(q => {
    const qDate = new Date(q.completedAt);
    return qDate >= weekStart;
  });

  const totalXp = weekQuests.reduce((sum, q) => sum + (q.xp || 0), 0);

  // Detect mastery changes
  const trends = Object.entries(skillMap).map(([id, skill]) => {
    const skillQuests = weekQuests.filter(q => q.skillId === id);
    const previousMastery = skill.mastery - (skillQuests.length * 5); // rough estimate
    const change = skill.mastery - previousMastery;
    return { skill: id, change };
  });

  const masteredSkills = Object.entries(skillMap)
    .filter(([_, skill]) => skill.mastery >= 90)
    .map(([id]) => id);

  const weakSkills = detectWeakSkills(skillMap);

  return {
    week: `${weekKey}`, // e.g., \"2024-01-01\" start of week
    totalXp,
    questsCompleted: weekQuests.length,
    skillsMastered: masteredSkills,
    weakSkills,
    avgStreak: 0, // would need streak history
    focusSkill: currentFocus || null,
    trends: trends.filter(t => t.change !== 0).sort((a, b) => b.change - a.change),
  };
}

/**
 * Get weekly insights history
 */
export function getWeeklyInsights(): WeeklyInsight[] {
  try {
    return loadWeeklyInsights();
  } catch {
    return [];
  }
}

/**
 * Save weekly insight
 */
export function saveWeeklyInsight(insight: WeeklyInsight): void {
  try {
    const insights = getWeeklyInsights();
    const existing = insights.findIndex(i => i.week === insight.week);
    if (existing !== -1) {
      insights[existing] = insight;
    } else {
      insights.push(insight);
    }
    saveWeeklyInsights(insights);
  } catch (e) {
    console.error('Failed to save weekly insight', e);
  }
}

/**
 * Progression cohort analysis
 * Group users by level and see retention
 */
export interface CohortAnalysis {
  levelRange: string; // \"1-10\", \"11-25\", etc.
  userCount: number;
  retentionDay1: number; // %
  retentionDay7: number; // %
  retentionDay30: number; // %
  avgXpPerDay: number;
}

/**
 * Skill mastery distribution
 */
export function getMasteryDistribution(skillMap: Record<string, any>): Record<string, number> {
  const distribution: Record<string, number> = {
    'beginner_0-30': 0,
    'intermediate_30-60': 0,
    'advanced_60-90': 0,
    'master_90-100': 0,
  };

  Object.values(skillMap).forEach((skill: any) => {
    const mastery = skill.mastery || 0;
    if (mastery < 30) distribution['beginner_0-30']++;
    else if (mastery < 60) distribution['intermediate_30-60']++;
    else if (mastery < 90) distribution['advanced_60-90']++;
    else distribution['master_90-100']++;
  });

  return distribution;
}
