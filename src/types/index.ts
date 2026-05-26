export type LocationType = 'gym' | 'cafe' | 'park' | 'home' | 'mall';

export interface LocationOption {
  id: LocationType;
  emoji: string;
  label: string;
  sublabel: string;
  color: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  location: LocationType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: number;
  dopamine: number;
  calories: number;
  scienceTag: string;
  completed: boolean;
  locked: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  premium: boolean;
}

export interface UserProfile {
  name: string;
  bio: string;
  avatar: string | null;
  level: number;
  xp: number;
  xpToNext: number;
  totalQuests: number;
  streak: number;
  badges: Badge[];
  isPremium: boolean;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'quest' | 'offline';
  currentQuest?: string;
  distance?: string;
}

export interface WeeklyStats {
  day: string;
  quests: number;
  xp: number;
}
