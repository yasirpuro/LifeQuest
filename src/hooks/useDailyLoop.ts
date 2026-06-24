import type { Quest, TimeSlot, DailyPlan } from '../types';
import { loadDailyPlan as loadPersistedDailyPlan, saveDailyPlan as savePersistedDailyPlan } from '../utils/persistenceOwner';

/**
 * Daily Loop Engine:
 * - Görevleri morning/midday/evening slotlarına böler
 * - Otomatik gün planı oluşturur
 * - Gün sonu reset'i yönetir
 * - Urgency scoring yapar
 */

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

// getTimeSlot removed (unused)

function calculateUrgency(quest: Quest): 'high' | 'normal' | 'low' {
  if (!quest.plannedDate) return 'normal';
  const planned = new Date(quest.plannedDate);
  const today = new Date();
  const daysOverdue = Math.floor((today.getTime() - planned.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysOverdue >= 1) return 'high'; // overdue
  if (daysOverdue >= -1) return 'normal'; // today or tomorrow
  return 'low'; // future
}

function calculatePriorityScore(quest: Quest, mastery: number = 0): number {
  // urgency weight: high=40, normal=20, low=5
  const urgencyMap = { high: 40, normal: 20, low: 5 };
  const urgencyScore = urgencyMap[calculateUrgency(quest)];
  
  // skill weakness: lower mastery = higher priority
  const masteryScore = Math.max(0, 40 - mastery);
  
  // difficulty reward: harder = higher priority (reward better)
  const diffScore = quest.difficulty * 5;
  
  // effort/reward balance: (dopamine / effortRequired) * 15
  const effortReward = ((quest.dopamine || 10) / (quest.effortRequired || 3)) * 15;
  
  return Math.min(100, urgencyScore + masteryScore + diffScore + effortReward);
}

export function generateDailyPlan(availableQuests: Quest[], skillMasteryMap: Record<string, number> = {}): DailyPlan {
  const today = getTodayDate();
  const slots: Record<TimeSlot, Quest[]> = { morning: [], midday: [], evening: [] };
  
  // Filter available quests and sort by priority
  const viable = availableQuests.filter(q => !q.completed && !q.locked);
  const sorted = viable.map(q => ({
    quest: q,
    priority: calculatePriorityScore(q, skillMasteryMap[q.skillId || ''] || 0),
    effort: q.effortRequired || 3
  })).sort((a, b) => b.priority - a.priority);

  // Distribute to time slots based on effort
  // Morning: medium effort | Midday: high effort | Evening: low effort
  let morning = 0, midday = 0, evening = 0;
  const maxPerSlot = 3;

  for (const { quest, effort } of sorted) {
    if (effort <= 2 && morning < maxPerSlot) {
      slots.morning.push(quest);
      morning++;
    } else if (effort >= 4 && midday < maxPerSlot) {
      slots.midday.push(quest);
      midday++;
    } else if (evening < maxPerSlot) {
      slots.evening.push(quest);
      evening++;
    } else if (morning < maxPerSlot) {
      slots.morning.push(quest);
      morning++;
    } else if (midday < maxPerSlot) {
      slots.midday.push(quest);
      midday++;
    }
  }

  const all = [...slots.morning, ...slots.midday, ...slots.evening];
  const resetTime = new Date();
  resetTime.setHours(24, 0, 0, 0);

  return {
    date: today,
    morning: slots.morning,
    midday: slots.midday,
    evening: slots.evening,
    completed: 0,
    total: all.length,
    resetAt: resetTime.toISOString(),
  };
}

export function getDailyPlan(): DailyPlan | null {
  try {
    const plan = loadPersistedDailyPlan() as DailyPlan | null;
    if (!plan) return null;
    if (plan.date !== getTodayDate()) return null;
    return plan;
  } catch (e) {
    return null;
  }
}

export function saveDailyPlan(plan: DailyPlan) {
  try {
    const success = savePersistedDailyPlan(plan);
    if (!success) {
      console.error('Failed to save daily plan');
    }
  } catch (e) {
    console.error('Failed to save daily plan', e);
  }
}

export function getQuestsByTimeSlot(slot: TimeSlot): Quest[] {
  const plan = getDailyPlan();
  if (!plan) return [];
  return plan[slot] || [];
}

export function getTodayProgress(): { completed: number; total: number; percent: number } {
  const plan = getDailyPlan();
  if (!plan) return { completed: 0, total: 0, percent: 0 };
  const percent = plan.total > 0 ? (plan.completed / plan.total) * 100 : 0;
  return { completed: plan.completed, total: plan.total, percent };
}

export function markQuestInPlanAsCompleted(questId: string) {
  const plan = getDailyPlan();
  if (!plan) return;
  const timeSlots: TimeSlot[] = ['morning', 'midday', 'evening'];
  timeSlots.forEach((slot) => {
    const idx = plan[slot].findIndex(q => q.id === questId);
    if (idx !== -1) {
      plan.completed = Math.min(plan.total, plan.completed + 1);
    }
  });
  saveDailyPlan(plan);
}
