-- Auto-create profile trigger for new auth users
-- Migration: 002_auto_profile_trigger
-- Description: Automatically creates a profile when a new user signs up via Supabase Auth

-- Set search_path for security
SET search_path = public;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if profile already exists to prevent duplicates
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = NEW.id
  ) THEN
    INSERT INTO public.profiles (id, username, level, xp, streak, longest_streak, last_active)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      1,
      0,
      0,
      0,
      NOW()
    );
  END IF;
  
  -- Check if skills already exists to prevent duplicates
  IF NOT EXISTS (
    SELECT 1 FROM public.skills WHERE user_id = NEW.id
  ) THEN
    -- Also create initial skills entry
    INSERT INTO public.skills (user_id, focus_xp, focus_level, discipline_xp, discipline_level, consistency_xp, consistency_level)
    VALUES (
      NEW.id,
      0,
      1,
      0,
      1,
      0,
      1
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to handle user deletion (cascade delete)
CREATE OR REPLACE FUNCTION handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Profile deletion is handled by ON DELETE CASCADE in the schema
  -- This function is for any additional cleanup if needed
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user deletion
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_delete();
