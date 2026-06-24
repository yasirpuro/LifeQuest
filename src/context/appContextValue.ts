import { createContext } from 'react';
import type { UserProfile, LocationType, Quest, Friend, FriendRequest } from '../types';
import type { Badge } from '../types';

export interface AppState {
  user: UserProfile;
  quests: Quest[];
  selectedLocation: LocationType | null;
  onboardingComplete: boolean;
  freeQuestsToday: number;
  freeLocationsToday: number;
  showPremiumModal: boolean;
  friends: Friend[];
  friendRequests: FriendRequest[];
  blockedUsers: string[];
  preferences: {
    locale: string;
    language: string;
  };
}

export interface AppContextValue extends AppState {
  // DynEd skill engine (optional)
  skillEngine?: any;
  // Last quest completion result (for UI feedback)
  completionResult?: any;
  setUser: (user: Partial<UserProfile>) => void;
  setSelectedLocation: (loc: LocationType) => void;
  completeQuest: (questId: string, verificationNote?: string) => void;
  addQuest: (title: string, difficulty: number) => void;
  completeOnboarding: () => void;
  setShowPremiumModal: (show: boolean) => void;
  canAccessLocation: (loc: LocationType) => boolean;
  canDoQuest: () => boolean;
  startChallenge: (focus: LocationType, duration: number) => void;
  resetChallenge: () => void;
  sendSupportToFriend: (friendId: string) => void;
  setPreferences: (prefs: { locale: string; language: string }) => void;
  setLocale: (locale: string) => void;
}

// workaround: keep Badge in scope for the type alias
export type { Badge };

export const AppContext = createContext<AppContextValue | null>(null);
