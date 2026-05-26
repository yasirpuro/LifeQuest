import { createContext } from 'react';
import type { UserProfile, LocationType, Quest } from '../types';
import type { Badge } from '../types';

export interface AppState {
  user: UserProfile;
  quests: Quest[];
  selectedLocation: LocationType | null;
  onboardingComplete: boolean;
  freeQuestsToday: number;
  freeLocationsToday: number;
  showPremiumModal: boolean;
}

export interface AppContextValue extends AppState {
  setUser: (user: Partial<UserProfile>) => void;
  setSelectedLocation: (loc: LocationType) => void;
  completeQuest: (questId: string) => void;
  completeOnboarding: () => void;
  setShowPremiumModal: (show: boolean) => void;
  canAccessLocation: (loc: LocationType) => boolean;
  canDoQuest: () => boolean;
}

// workaround: keep Badge in scope for the type alias
export type { Badge };

export const AppContext = createContext<AppContextValue | null>(null);
