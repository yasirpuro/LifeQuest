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

export type RewardTier = 'none' | 'small' | 'medium' | 'jackpot' | 'near_miss' | 'identity';

export interface RewardMemory {
  tier: RewardTier;
  amount: number;
  timestamp: string; // ISO
}

export interface RewardEvent {
  tier: RewardTier;
  amount: number;
  questTitle: string;
  timestamp: string;
  identityTitle?: string;
}

export interface MetaSkills {
  focus: MetaSkill; // Based on quest completion streak and focus sessions
  discipline: MetaSkill; // Based on streak maintenance and consistency
  consistency: MetaSkill; // Based on daily completion patterns
}

export interface UserProfile {
  id?: string;
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
  skillsProgress?: Record<string, any>;
  dailyXp?: { date: string; earned: number };
  lastActiveDay?: string | null;
  
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

  // Variable Reward System state
  tasksCompletedToday?: number;
  jackpotCooldown?: number;
  lastReward?: RewardMemory | null;
  
  // Meta Progression
  metaSkills?: MetaSkills;
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

// ─── META PROGRESSION SYSTEM ──────────────────────────────────────────────────
// Character development beyond XP - passive abilities that evolve through behavior

export type MetaSkillType = 'focus' | 'discipline' | 'consistency';

export interface MetaSkill {
  type: MetaSkillType;
  level: number; // 1..10
  xp: number;
  xpToNext: number;
  // Passive benefits at each level
  benefits: {
    level: number;
    description: string;
    effect: string; // e.g., "+5% bonus chance", "streak decay slower"
  }[];
}

export interface MetaSkills {
  focus: MetaSkill; // Based on quest completion streak and focus sessions
  discipline: MetaSkill; // Based on streak maintenance and consistency
  consistency: MetaSkill; // Based on daily completion patterns
}

// ─── IDENTITY REWARDS SYSTEM ───────────────────────────────────────────────────
// Meaning injection beyond dopamine - character-defining achievements

export interface IdentityReward {
  id: string;
  title: string; // e.g., "FOCUS MASTER", "DISCIPLINE ELITE"
  description: string; // e.g., "Bugün 5 görev tamamladın"
  icon: string;
  rarity: 'legendary' | 'epic' | 'rare';
  earnedAt: string; // ISO timestamp
  category: 'focus' | 'discipline' | 'consistency' | 'streak' | 'milestone';
}

// ─── SESSION CHAINING SYSTEM ───────────────────────────────────────────────────
// Momentum triggers to extend session length

export interface SessionChain {
  consecutiveQuests: number; // Quests completed in current session
  bonusMultiplier: number; // Current bonus multiplier
  nextBonusThreshold: number; // Quests needed for next bonus
  active: boolean;
  startedAt: string; // ISO timestamp
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
