import { useState, useCallback, type ReactNode } from 'react';
import type { UserProfile, LocationType } from '../types';
import { QUESTS, BADGES } from '../data/quests';
import { AppContext } from './appContextValue';
import type { AppState } from './appContextValue';

const defaultUser: UserProfile = {
  name: '',
  bio: '',
  avatar: null,
  level: 1,
  xp: 0,
  xpToNext: 100,
  totalQuests: 0,
  streak: 3,
  badges: BADGES,
  isPremium: false,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: defaultUser,
    quests: QUESTS,
    selectedLocation: null,
    onboardingComplete: false,
    freeQuestsToday: 3,
    freeLocationsToday: 1,
    showPremiumModal: false,
  });

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

  const completeQuest = useCallback((questId: string) => {
    setState(prev => {
      if (!prev.user.isPremium && prev.freeQuestsToday <= 0) {
        return { ...prev, showPremiumModal: true };
      }

      const quest = prev.quests.find(q => q.id === questId);
      if (!quest || quest.completed) return prev;

      const newXp = prev.user.xp + quest.dopamine;
      const newTotal = prev.user.totalQuests + 1;
      let newLevel = prev.user.level;
      let remainingXp = newXp;
      let xpToNext = prev.user.xpToNext;

      while (remainingXp >= xpToNext) {
        remainingXp -= xpToNext;
        newLevel++;
        xpToNext = newLevel * 100;
      }

      const newBadges = prev.user.badges.map(b => {
        if (b.id === 'first-quest' && newTotal >= 1) return { ...b, unlocked: true };
        if (b.id === 'social-butterfly' && newTotal >= 5) return { ...b, unlocked: true };
        if (b.id === 'streak-3' && prev.user.streak >= 3) return { ...b, unlocked: true };
        return b;
      });

      return {
        ...prev,
        quests: prev.quests.map(q => q.id === questId ? { ...q, completed: true } : q),
        user: {
          ...prev.user,
          xp: remainingXp,
          xpToNext: xpToNext,
          level: newLevel,
          totalQuests: newTotal,
          badges: newBadges,
        },
        freeQuestsToday: prev.user.isPremium ? prev.freeQuestsToday : prev.freeQuestsToday - 1,
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

  return (
    <AppContext.Provider value={{
      ...state,
      setUser,
      setSelectedLocation,
      completeQuest,
      completeOnboarding,
      setShowPremiumModal,
      canAccessLocation,
      canDoQuest,
    }}>
      {children}
    </AppContext.Provider>
  );
}
