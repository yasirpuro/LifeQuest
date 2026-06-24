export type LocationType = 'din' | 'spor' | 'egitim' | 'dil' | 'kisisel-gelisim' | 'lookmaxing' | 'futbol' | 'basketbol';

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
  skillId?: string | null; // optional mapping to a Skill
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: number;
  dopamine: number;
  calories: number;
  scienceTag: string;
  completed: boolean;
  locked: boolean;
  verificationNote?: string; // Kanıt notu
  isChallenge?: boolean; // Günlük program görevi mi
  // Prioritization & Daily Loop
  timeSlot?: TimeSlot; // morning/midday/evening
  urgency?: 'high' | 'normal' | 'low'; // overdue/normal/future
  priorityScore?: number; // 0..100 algorithmic priority
  effortRequired?: 1 | 2 | 3 | 4 | 5; // separate from difficulty
  plannedDate?: string; // YYYY-MM-DD
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
  
  // Program Meydan Okuma Alanları
  challengeActive: boolean;
  challengeFocus: LocationType | null;
  challengeDuration: number; // 14, 30, 60
  challengeStartTimestamp: string | null;
  challengeDay: number;
  
  // Recovery System
  recoveryState: UserRecoveryState;
  
  // Streak psychology
  lastQuestCompletedAt?: string | null; // ISO timestamp
  streakRiskLevel?: 'safe' | 'warning' | 'critical'; // based on inactivity
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'quest' | 'offline';
  currentQuest?: string;
  level: number;
  xp: number;
  xpToNext: number;
  sentSupportToday?: boolean;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string; // ISO
}

export interface SocialGraph {
  friends: Friend[];
  friendRequests: FriendRequest[];
  blockedUsers: string[];
}

export interface SocialProfile {
  userId: string;
  username: string;
  avatar: string | null;
  level: number;
  xp: number;
  completedQuests: number;
  streak: number;
  publicStats: Record<string, any>;
}

export interface WeeklyStats {
  day: string;
  quests: number;
  xp: number;
}

// DynEd / Skill Engine types
export interface Skill {
  id: string;
  name: string;
  description?: string;
  location?: LocationType; // optional mapping to existing locations
  parentId?: string | null;
}

export interface SkillProgress {
  skillId: string;
  xp: number;
  mastery: number; // 0..100
  lastPracticed?: string | null; // ISO timestamp
  nextDue?: string | null; // ISO timestamp for spaced repetition
  // Decay system
  decayRate: number; // 0..1, how much mastery drops per week of inactivity
  lastDecayCheck?: string | null; // ISO timestamp of last decay calc
}

export interface SkillTreeNode extends Skill {
  children?: SkillTreeNode[];
}

// Daily Loop types
export type TimeSlot = 'morning' | 'midday' | 'evening';

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  morning: Quest[];
  midday: Quest[];
  evening: Quest[];
  completed: number;
  total: number;
  resetAt?: string; // ISO timestamp
}

// Recovery system
export interface RecoveryToken {
  id: string;
  type: 'freeze' | 'comeback';
  expiresAt: string; // ISO timestamp
  used: boolean;
}

export interface UserRecoveryState {
  tokens: RecoveryToken[];
  streakFrozen: boolean;
  lastRecovery?: string | null; // ISO timestamp
}
