import { useContext } from 'react';
import { AppContext, type AppContextValue } from '../context/appContextValue';

const fallbackAppContext: AppContextValue = {
  user: {
    name: '',
    bio: '',
    avatar: null,
    level: 1,
    xp: 0,
    xpToNext: 100,
    totalQuests: 0,
    streak: 1,
    badges: [],
    isPremium: false,
    challengeActive: false,
    challengeFocus: null,
    challengeDuration: 14,
    challengeStartTimestamp: null,
    challengeDay: 1,
    recoveryState: { tokens: [], streakFrozen: false, lastRecovery: null },
  },
  quests: [],
  selectedLocation: null,
  onboardingComplete: false,
  freeQuestsToday: 3,
  freeLocationsToday: 3,
  showPremiumModal: false,
  friends: [],
  friendRequests: [],
  blockedUsers: [],
  preferences: { locale: 'tr-TR', language: 'tr' },
  setUser: () => undefined,
  setSelectedLocation: () => undefined,
  completeQuest: () => undefined,
  addQuest: () => undefined,
  completeOnboarding: () => undefined,
  setShowPremiumModal: () => undefined,
  canAccessLocation: () => true,
  canDoQuest: () => true,
  startChallenge: () => undefined,
  resetChallenge: () => undefined,
  sendSupportToFriend: () => undefined,
  setPreferences: () => undefined,
  setLocale: () => undefined,
  rewardEvent: null,
  setRewardEvent: () => undefined,
};

export function useApp() {
  const ctx = useContext(AppContext);
  return ctx ?? fallbackAppContext;
}
