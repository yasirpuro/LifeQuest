import { useCallback, useState } from 'react';
import type { Skill, SkillProgress } from '../types';
import { SKILL_TREE } from '../data/skillTree';
import { persistNotificationsSent, loadNotificationsSent } from '../utils/persistenceOwner';

function nowIso() {
  return new Date().toISOString();
}

function addDays(dateIso: string | number, days: number) {
  const d = typeof dateIso === 'string' ? new Date(dateIso) : new Date(dateIso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function useSkillEngine() {
  const [skills] = useState<Skill[]>(() => {
    // flatten tree to list
    const list: Skill[] = [];
    const walk = (node: any) => {
      list.push({ id: node.id, name: node.name, description: node.description, parentId: node.parentId || null });
      if (node.children) node.children.forEach((c: any) => walk(c));
    };
    SKILL_TREE.forEach(n => walk(n));
    return list;
  });

  const [progressMap, setProgressMap] = useState<Record<string, SkillProgress>>(() => {
    try {
    } catch (e) {
      console.error('SkillEngine load error', e);
    }
    // init default
    const init: Record<string, SkillProgress> = {};
    skills.forEach(s => {
      init[s.id] = { skillId: s.id, xp: 0, mastery: 0, lastPracticed: null, nextDue: null, decayRate: 0.05 };
    });
    return init;
  });

  const calculateMasteryFromXp = useCallback((xp: number) => {
    // simple curve for v1: mastery = min(100, floor(xp/10))
    return Math.min(100, Math.floor(xp / 10));
  }, []);

  const addXp = useCallback((skillId: string, xpAmount: number, options?: { difficulty?: number, baseInterval?: number }) => {
    setProgressMap(prev => {
      const cur = prev[skillId] || { skillId, xp: 0, mastery: 0, lastPracticed: null, nextDue: null, decayRate: 0.05 };
      const newXp = cur.xp + xpAmount;
      const newMastery = calculateMasteryFromXp(newXp);

      // Real spaced repetition formula (v1): nextDue = now + (baseInterval * difficultyFactor / masteryFactor)
      const baseInterval = options?.baseInterval ?? 1; // days
      const difficultyFactor = (options?.difficulty && options.difficulty > 0) ? options.difficulty : 1;
      const masteryFactor = Math.max(1, newMastery); // avoid division by zero
      // interval scaled: lower mastery -> smaller interval
      const intervalDays = Math.max(1, Math.round((baseInterval * difficultyFactor) / (masteryFactor / 10)));

      const now = nowIso();
      const nextDue = addDays(now, intervalDays);

      return {
        ...prev,
        [skillId]: { ...cur, xp: newXp, mastery: newMastery, lastPracticed: now, nextDue },
      };
    });
  }, [calculateMasteryFromXp]);

  const getFocusSkill = useCallback(() => {
    // 1) overdue (nextDue in past) — choose most overdue
    // 2) soon due (nextDue near future)
    // 3) lowest mastery
    const list = Object.values(progressMap);
    const now = new Date();
    const overdue = list
      .filter(p => p.nextDue && new Date(p.nextDue) <= now)
      .sort((a, b) => {
        // most overdue first
        const ta = a.nextDue ? now.getTime() - new Date(a.nextDue).getTime() : 0;
        const tb = b.nextDue ? now.getTime() - new Date(b.nextDue).getTime() : 0;
        return tb - ta;
      })[0];
    if (overdue) return overdue;

    const soon = list
      .filter(p => p.nextDue)
      .sort((a, b) => new Date(a.nextDue!).getTime() - new Date(b.nextDue!).getTime())[0];
    if (soon) return soon;

    return list.sort((a, b) => a.mastery - b.mastery)[0];
  }, [progressMap]);

  const buildDecisionPayload = useCallback((userStreak: number | null = 0) => {
    const focus = getFocusSkill();
    if (!focus) return null;
    const streak = userStreak || 0;
    let urgency: 'overdue' | 'normal' | 'mastered' = 'normal';
    const now = new Date();
    if (focus.nextDue && new Date(focus.nextDue) <= now) urgency = 'overdue';
    else if (focus.mastery >= 95) urgency = 'mastered';

    const xpToNextLevel = Math.max(1, (Math.ceil((focus.mastery + 1) / 10) * 10) - focus.mastery);

    return {
      streak,
      focusSkill: focus,
      urgency,
      xpToNextLevel,
    };
  }, [getFocusSkill]);

  // Notification gate: track sent notifications per day in localStorage
  const shouldSendNotification = useCallback((skillId: string) => {
    try {
      const sent = loadNotificationsSent();
      const today = new Date().toISOString().slice(0, 10);
      if (sent[skillId] === today) return false; // already sent today

      const p = progressMap[skillId];
      if (!p) return false;
      if (!p.nextDue) return false;
      if (new Date(p.nextDue) <= new Date()) return true;
      return false;
    } catch (e) {
      return false;
    }
  }, [progressMap]);

  const markNotificationSent = useCallback((skillId: string) => {
    try {
      const sent = loadNotificationsSent();
      const today = new Date().toISOString().slice(0, 10);
      sent[skillId] = today;
      // Delegate writes to single-writer
      persistNotificationsSent(sent).catch(() => {});
    } catch (e) {
      // ignore
    }
  }, []);

  const onTaskCompleted = useCallback((locationId: string, baseXp = 10, options?: { difficulty?: number, streak?: number, isDue?: boolean, isChallenge?: boolean }) => {
    // Map locationId -> skillId if exists, otherwise apply to a generic skill
    const skillId = skills.find(s => s.id === locationId)?.id || skills[0]?.id;
    if (!skillId) return;

    const difficulty = options?.difficulty ?? 1;
    const streak = options?.streak ?? 0;
    const isDue = options?.isDue ?? false;
    const isChallenge = options?.isChallenge ?? false;

    // difficulty multiplier
    const difficultyMultiplier = difficulty === 1 ? 0.8 : difficulty === 2 ? 1 : difficulty === 3 ? 1.2 : difficulty === 4 ? 1.5 : 2;

    // XP curve: baseXp * multiplier * Math.log2(1 + streak)
    const streakMultiplier = streak > 0 ? Math.log2(1 + streak) : 1;

    let xpGain = Math.max(5, Math.floor(baseXp * difficultyMultiplier * (streakMultiplier || 1)));

    // due bonus
    if (isDue) xpGain = Math.floor(xpGain * 1.5);

    // challenge bonus
    if (isChallenge) xpGain = Math.floor(xpGain * 1.3);

    // comeback bonus: if lastPracticed > 2 days ago
    const cur = progressMap[skillId];
    if (cur && cur.lastPracticed) {
      const days = Math.floor((Date.now() - new Date(cur.lastPracticed).getTime()) / (1000 * 60 * 60 * 24));
      if (days >= 2) xpGain = Math.floor(xpGain * 1.8);
    }

    addXp(skillId, xpGain, { difficulty, baseInterval: 1 });
  }, [skills, addXp, progressMap]);

  return {
    skills,
    progressMap,
    addXp,
    getFocusSkill,
    buildDecisionPayload,
    shouldSendNotification,
    markNotificationSent,
    onTaskCompleted,
  } as const;
}

export default useSkillEngine;
