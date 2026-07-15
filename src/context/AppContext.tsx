import { useState, useCallback, useEffect, type ReactNode } from 'react';
import type { UserProfile, LocationType, Quest, RewardEvent } from '../types';
import { QUESTS, BADGES, generateQuestsForDay, MOCK_FRIENDS } from '../data/quests';
import { AppContext } from './appContextValue';
import type { AppState } from './appContextValue';
import useSkillEngine from '../hooks/useSkillEngine';
import { initRecoveryState } from '../hooks/useRecoverySystem';
import { orchestrateQuestCompletion } from '../utils/questCompletionOrchestrator';
import { validateQuestCompletionResult, attemptStateRecovery } from '../utils/stateValidator';
import { buildPersistedSnapshot, loadPersistedState, persistAppStateSnapshot, loadAnalyticsEvents, loadNotificationsSent, loadNotificationFrequency, loadWeeklyInsights, persistSocialGraph, persistLocalePreferences } from '../utils/persistenceOwner';

const defaultUser: UserProfile = {
  name: '',
  bio: '',
  avatar: null,
  level: 1,
  xp: 0,
  xpToNext: 100,
  totalQuests: 0,
  streak: 1,
  badges: BADGES,
  isPremium: false,
  
  // Program Meydan Okuma
  challengeActive: false,
  challengeFocus: null,
  challengeDuration: 14,
  challengeStartTimestamp: null,
  challengeDay: 1,
  
  // Recovery System
  recoveryState: initRecoveryState(),
  streakRiskLevel: 'safe',
  lastQuestCompletedAt: null,
};

  // Başlangıç State'ini Yükleyen Yardımcı
const getInitialState = (): AppState => ({
  user: defaultUser,
  quests: QUESTS,
  selectedLocation: null,
  onboardingComplete: false,
  freeQuestsToday: 5,
  freeLocationsToday: 1,
  showPremiumModal: false,
  friends: MOCK_FRIENDS,
  friendRequests: [],
  blockedUsers: [],
  preferences: { locale: 'tr-TR', language: 'tr' },
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(getInitialState);
  const [completionResult, setCompletionResult] = useState<any>(null);
  const [rewardEvent, setRewardEvent] = useState<RewardEvent | null>(null);
  const skillEngine = useSkillEngine();

  // Persist a snapshot whenever the in-memory state or skill progress changes.
  useEffect(() => {
    const focusSkill = skillEngine?.getFocusSkill?.();
    const widgetData = {
      focusSkillId: focusSkill?.skillId ?? null,
      focusMastery: focusSkill?.mastery ?? 0,
      streak: state.user.streak,
      streakRisk: state.user.streakRiskLevel || 'safe',
      dailyProgress: { completed: state.quests.filter(q => q.completed).length, total: state.quests.length },
      lastUpdate: new Date().toISOString(),
    };

    const snapshot = buildPersistedSnapshot(
      state,
      skillEngine?.progressMap || {},
      widgetData,
      loadAnalyticsEvents(),
      loadWeeklyInsights(),
      loadNotificationsSent(),
      loadNotificationFrequency(),
      { friends: state.friends, friendRequests: state.friendRequests, blockedUsers: state.blockedUsers },
      { locale: 'tr-TR', language: 'tr' },
      []
    );

    void persistAppStateSnapshot(snapshot).then(({ success, message }) => {
      if (!success) console.warn('[PersistenceOwner] Snapshot failed:', message);
    }).catch(err => console.error('[PersistenceOwner] unexpected error:', err));
  }, [state, skillEngine?.progressMap, skillEngine]);

  useEffect(() => {
    void loadPersistedState().then(loaded => {
      if (loaded?.appState) {
        setState(loaded.appState);
      }
    }).catch(err => console.error('[PersistenceOwner] Load failed:', err));
  }, []);

  const setUser = useCallback((partial: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, user: { ...prev.user, ...partial } }));
  }, []);

  const setSelectedLocation = useCallback((loc: LocationType) => {
    setState(prev => {
      if (!prev.user.isPremium && prev.freeLocationsToday <= 0 && prev.selectedLocation !== loc) {
        return { ...prev, showPremiumModal: true };
      }
      const usedFree = prev.selectedLocation !== loc && !prev.user.isPremium
        ? prev.freeLocationsToday - 1
        : prev.freeLocationsToday;
      return { ...prev, selectedLocation: loc, freeLocationsToday: usedFree };
    });
  }, []);

  const completeQuest = useCallback(
    async (questId: string, verificationNote?: string) => {
      const questBefore = state.quests.find(q => q.id === questId);
      if (!questBefore) {
        console.error(`Quest ${questId} not found`);
        return;
      }

      // Snapshot before mutation
      const prevState = JSON.parse(JSON.stringify(state));

      // Build orchestration context
      const context = {
        quest: questBefore,
        difficulty: (questBefore.difficulty || 1) as 1 | 2 | 3 | 4 | 5,
        isDue: questBefore.timeSlot ? new Date().getHours() >= 12 : false,
        isChallenge: questBefore.isChallenge || false,
        streak: state.user?.streak ?? 0,
      };

      // ORCHESTRATE: Run deterministic 12-phase flow
      let result;
      try {
        result = await orchestrateQuestCompletion(state, context, skillEngine);
      } catch (e) {
        console.error('Orchestration failed:', e);
        return;
      }

      // If orchestration generated a reward event, store it
      if (result.rewardEvent) {
        setRewardEvent(result.rewardEvent);
      }

      // Store result for notification/UI feedback
      setCompletionResult(result);

      // VALIDATE: Check state integrity
      const validation = validateQuestCompletionResult(prevState, state, result.xpEarned);
      if (!validation.isValid) {
        console.error('State validation failed:', validation.warnings || validation);
        // Attempt recovery
        const recovered = attemptStateRecovery(state);
        setState(recovered);
        return;
      }

      if (validation.warnings.length > 0) {
        console.warn('State warnings:', validation.warnings);
      }

      // Update quest completion
      setState(prev => {
        const updated = { ...prev };
        const qIdx = updated.quests.findIndex(q => q.id === questId);
        if (qIdx !== -1) {
          updated.quests[qIdx] = {
            ...updated.quests[qIdx],
            completed: true,
            verificationNote: verificationNote || updated.quests[qIdx].verificationNote,
          };
        }

        // Sync result into state
        if (result.leveledUp && result.newLevel) {
          updated.user.level = result.newLevel;
        }

        return updated;
      });

      // Log validation result
      if (result.stateSnapshot) {
        console.log('[Quest Completion] State snapshot:', result.stateSnapshot);
      }

      if (result.warnings.length > 0) {
        console.warn('[Quest Completion] Warnings:', result.warnings);
      }
    },
    [state, skillEngine]
  );

  const startChallenge = useCallback((focus: LocationType, duration: number) => {
    setState(prev => {
      const dailyQuests = generateQuestsForDay(focus, 1);
      return {
        ...prev,
        quests: dailyQuests,
        user: {
          ...prev.user,
          challengeActive: true,
          challengeFocus: focus,
          challengeDuration: duration,
          challengeStartTimestamp: new Date().toISOString(),
          challengeDay: 1
        }
      };
    });
  }, []);

  const resetChallenge = useCallback(() => {
    setState(prev => {
      return {
        ...prev,
        quests: QUESTS,
        user: {
          ...prev.user,
          challengeActive: false,
          challengeFocus: null,
          challengeStartTimestamp: null,
          challengeDay: 1
        }
      };
    });
  }, []);

  const addQuest = useCallback((title: string, difficulty: number) => {
    setState(prev => {
      const category = prev.selectedLocation || 'kisisel-gelisim';
      const dopamine = difficulty === 1 ? 15 : difficulty === 3 ? 30 : 50;
      const duration = difficulty === 1 ? 5 : difficulty === 3 ? 15 : 30;
      
      const newQuest: Quest = {
        id: 'q_' + Date.now(),
        title,
        description: 'Kendi eklediğin özel gelişim hedefi.',
        location: category,
        skillId: skillEngine?.skills?.find(s => s.id === category)?.id || null,
        difficulty: difficulty as 1 | 2 | 3 | 4 | 5,
        duration,
        dopamine,
        calories: 0,
        scienceTag: 'Kişisel Disiplin',
        completed: false,
        locked: false,
        isChallenge: false,
      };

      return {
        ...prev,
        quests: [newQuest, ...prev.quests],
      };
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setState(prev => ({ ...prev, onboardingComplete: true }));
  }, []);

  const setShowPremiumModal = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showPremiumModal: show }));
  }, []);

  const canAccessLocation = useCallback((loc: LocationType) => {
    return state.user.isPremium || state.freeLocationsToday > 0 || state.selectedLocation === loc;
  }, [state.user.isPremium, state.freeLocationsToday, state.selectedLocation]);

  const canDoQuest = useCallback(() => {
    return state.user.isPremium || state.freeQuestsToday > 0;
  }, [state.user.isPremium, state.freeQuestsToday]);

  const sendSupportToFriend = useCallback((friendId: string) => {
    setState(prev => {
      const friendIndex = prev.friends.findIndex(f => f.id === friendId);
      if (friendIndex === -1) return prev;

      const friend = prev.friends[friendIndex];
      if (friend.sentSupportToday) return prev;

      const newXp = friend.xp + 10;
      let newLevel = friend.level;
      let xpToNext = friend.xpToNext;

      if (newXp >= xpToNext) {
        newLevel++;
        xpToNext = newLevel * 100;
      }

      const updatedFriends = prev.friends.map((f, idx) => {
        if (idx === friendIndex) {
          return {
            ...f,
            xp: newXp >= xpToNext ? newXp - xpToNext : newXp,
            level: newLevel,
            xpToNext,
            sentSupportToday: true
          };
        }
        return f;
      });

      const activeUserXp = prev.user.xp + 5;
      let activeUserLevel = prev.user.level;
      let activeUserXpToNext = prev.user.xpToNext;

      if (activeUserXp >= activeUserXpToNext) {
        activeUserLevel++;
        activeUserXpToNext = activeUserLevel * 100;
      }

      const next = {
        ...prev,
        friends: updatedFriends,
        user: {
          ...prev.user,
          xp: activeUserXp >= activeUserXpToNext ? activeUserXp - activeUserXpToNext : activeUserXp,
          level: activeUserLevel,
          xpToNext: activeUserXpToNext
        }
      };

      // Persist social graph (best-effort)
      try {
        persistSocialGraph({ friends: next.friends, friendRequests: next.friendRequests, blockedUsers: next.blockedUsers }).catch(() => {});
      } catch (e) {
        // ignore
      }

      return next;
    });
  }, []);

  // Persist social graph whenever social slices change (debounced not required here)
  useEffect(() => {
    try {
      persistSocialGraph({ friends: state.friends, friendRequests: state.friendRequests, blockedUsers: state.blockedUsers }).catch(() => {});
    } catch (e) {
      // ignore
    }
  }, [state.friends, state.friendRequests, state.blockedUsers]);

  // Preferences persistence
  const setPreferences = useCallback((prefs: { locale: string; language: string }) => {
    setState(prev => ({ ...prev, preferences: prefs }));
  }, []);

  const setLocale = useCallback((locale: string) => {
    setState(prev => ({ ...prev, preferences: { ...prev.preferences, locale } }));
  }, []);

  useEffect(() => {
    try {
      persistLocalePreferences(state.preferences).catch(() => {});
    } catch (e) {
      // ignore
    }
  }, [state.preferences]);

  return (
    <AppContext.Provider value={{
      ...state,
      skillEngine,
      completionResult,
      rewardEvent,
      setRewardEvent,
      setUser,
      setSelectedLocation,
      completeQuest,
      addQuest,
      completeOnboarding,
      setShowPremiumModal,
      canAccessLocation,
      canDoQuest,
      startChallenge,
      resetChallenge,
      sendSupportToFriend,
      setPreferences,
      setLocale,
    }}>
      {children}
    </AppContext.Provider>
  );
}

