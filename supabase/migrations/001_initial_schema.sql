-- LifeQuest Production Schema v1
-- Migration: 001_initial_schema
-- Description: Core database schema for user progression, quests, skills, rewards, subscriptions, and analytics

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- Main user progression data
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  
  -- Level & XP
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  
  -- Streak
  streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  
  -- Activity tracking
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- QUESTS TABLE
-- Completed quest history for analytics
-- ============================================================
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Quest details
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  
  -- Completion status
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Duplicate prevention
  completion_id TEXT NOT NULL, -- Unique ID per quest completion to prevent duplicates
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint to prevent duplicate completions
  UNIQUE(user_id, completion_id)
);

-- ============================================================
-- SKILLS TABLE
-- Meta progression tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Focus skill
  focus_xp INTEGER DEFAULT 0,
  focus_level INTEGER DEFAULT 1,
  
  -- Discipline skill
  discipline_xp INTEGER DEFAULT 0,
  discipline_level INTEGER DEFAULT 1,
  
  -- Consistency skill
  consistency_xp INTEGER DEFAULT 0,
  consistency_level INTEGER DEFAULT 1,
  
  -- Timestamps
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================================
-- REWARDS TABLE
-- Variable reward system tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Reward details
  type TEXT NOT NULL, -- jackpot, medium, small, identity
  tier TEXT NOT NULL, -- legendary, epic, rare
  
  -- XP bonus
  xp_bonus INTEGER NOT NULL,
  
  -- Additional data (JSON for flexibility)
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTIONS TABLE
-- RevenueCat integration for premium subscriptions
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Provider info
  provider TEXT NOT NULL, -- revenuecat
  status TEXT NOT NULL, -- active, expired, cancelled, trial
  
  -- Product info
  product_id TEXT NOT NULL,
  
  -- Expiration
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ANALYTICS_EVENTS TABLE
-- Important events for analytics (complement to Firebase)
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Event details
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Quests policies
CREATE POLICY "Users can view own quests"
ON quests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quests"
ON quests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quests"
ON quests
FOR UPDATE
USING (auth.uid() = user_id);

-- Skills policies
CREATE POLICY "Users can view own skills"
ON skills
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
ON skills
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
ON skills
FOR UPDATE
USING (auth.uid() = user_id);

-- Rewards policies
CREATE POLICY "Users can view own rewards"
ON rewards
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rewards"
ON rewards
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
ON subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
ON subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
ON subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- Analytics events policies
CREATE POLICY "Users can view own analytics_events"
ON analytics_events
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics_events"
ON analytics_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active DESC);

-- Quests indexes
CREATE INDEX IF NOT EXISTS idx_quests_user_id ON quests(user_id);
CREATE INDEX IF NOT EXISTS idx_quests_completed_at ON quests(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_quests_category ON quests(category);

-- Skills indexes
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);

-- Rewards indexes
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_type ON rewards(type);
CREATE INDEX IF NOT EXISTS idx_rewards_created_at ON rewards(created_at DESC);

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);

-- Analytics events indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- ============================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================

-- Profiles updated_at trigger
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

-- Skills updated_at trigger
CREATE OR REPLACE FUNCTION update_skills_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_skills_updated_at();

-- Subscriptions updated_at trigger
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();
