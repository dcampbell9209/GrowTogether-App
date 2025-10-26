-- GrowTogether Database Schema
-- This file contains the complete database schema for the GrowTogether mobile app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'volunteer');
CREATE TYPE chat_status AS ENUM ('active', 'student_closed', 'volunteer_completed', 'archived');
CREATE TYPE message_type AS ENUM ('text', 'system', 'admin');
CREATE TYPE admin_action_type AS ENUM ('PROMOTE', 'DEMOTE', 'ADMIN_MESSAGE', 'CHAT_ARCHIVE');
CREATE TYPE school_type AS ENUM ('elementary', 'middle', 'high', 'k12');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role user_role NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  age INTEGER CHECK (age >= 5 AND age <= 25),
  current_grade INTEGER CHECK (current_grade >= 1 AND current_grade <= 12),
  school TEXT NOT NULL,
  student_subject_preference TEXT NOT NULL,
  
  -- Availability as JSONB for flexible querying
  availability JSONB NOT NULL DEFAULT '{}',
  
  -- Profile completion tracking
  profile_completed_at TIMESTAMPTZ,
  volunteer_profile_completed_at TIMESTAMPTZ,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Volunteer profiles table
CREATE TABLE volunteer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Tutoring preferences
  subjects_to_tutor JSONB NOT NULL DEFAULT '[]',
  grade_levels_comfortable JSONB NOT NULL DEFAULT '[]',
  
  -- Status tracking
  is_complete BOOLEAN DEFAULT FALSE,
  is_discoverable BOOLEAN DEFAULT FALSE,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Chats table
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Participants (always 2 users)
  student_user_id UUID NOT NULL REFERENCES users(id),
  volunteer_user_id UUID NOT NULL REFERENCES users(id),
  created_by UUID NOT NULL REFERENCES users(id),
  
  -- Chat lifecycle
  status chat_status NOT NULL DEFAULT 'active',
  
  -- Closure tracking
  closed_by UUID REFERENCES users(id),
  closed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique active chats between same participants
  UNIQUE(student_user_id, volunteer_user_id, status) 
    DEFERRABLE INITIALLY DEFERRED
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  
  -- Message content
  content TEXT NOT NULL,
  message_type message_type DEFAULT 'text',
  
  -- Read status
  read_at TIMESTAMPTZ,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Soft delete for message history
  deleted_at TIMESTAMPTZ
);

-- Admin action logs table
CREATE TABLE admin_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES users(id),
  
  -- Action details
  action_type admin_action_type NOT NULL,
  target_user_id UUID REFERENCES users(id),
  target_email TEXT,
  
  -- Action context
  metadata JSONB DEFAULT '{}',
  description TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User push notification tokens table
CREATE TABLE user_push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  device_info JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- Schools lookup table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  district TEXT,
  type school_type,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects lookup table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_push_tokens_user_id ON user_push_tokens(user_id);
CREATE INDEX idx_user_push_tokens_token ON user_push_tokens(token);
CREATE INDEX idx_users_school ON users(school);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
CREATE INDEX idx_users_last_active ON users(last_active_at);

CREATE INDEX idx_volunteer_profiles_user_id ON volunteer_profiles(user_id);
CREATE INDEX idx_volunteer_profiles_discoverable ON volunteer_profiles(is_discoverable);
CREATE INDEX idx_volunteer_profiles_complete ON volunteer_profiles(is_complete);

CREATE INDEX idx_chats_student_user_id ON chats(student_user_id);
CREATE INDEX idx_chats_volunteer_user_id ON chats(volunteer_user_id);
CREATE INDEX idx_chats_status ON chats(status);
CREATE INDEX idx_chats_created_at ON chats(created_at);
CREATE INDEX idx_chats_updated_at ON chats(updated_at);

CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_deleted_at ON messages(deleted_at);
CREATE INDEX idx_messages_read_at ON messages(read_at);

CREATE INDEX idx_admin_action_logs_admin_user_id ON admin_action_logs(admin_user_id);
CREATE INDEX idx_admin_action_logs_target_user_id ON admin_action_logs(target_user_id);
CREATE INDEX idx_admin_action_logs_action_type ON admin_action_logs(action_type);
CREATE INDEX idx_admin_action_logs_created_at ON admin_action_logs(created_at);

-- Views for complex queries
CREATE VIEW volunteer_matches AS
SELECT 
  s.id as student_id,
  v.id as volunteer_id,
  s.first_name as student_name,
  v.first_name as volunteer_name,
  s.current_grade,
  s.school,
  s.student_subject_preference,
  vp.subjects_to_tutor,
  vp.grade_levels_comfortable,
  
  -- Calculate availability overlap
  (
    SELECT COUNT(*)
    FROM jsonb_object_keys(s.availability) sk
    JOIN jsonb_object_keys(v.availability) vk ON sk = vk
    WHERE (s.availability->sk)::boolean = true 
    AND (v.availability->vk)::boolean = true
  ) as overlapping_days,
  
  -- Subject match priority
  CASE 
    WHEN vp.subjects_to_tutor ? s.student_subject_preference THEN 2
    WHEN s.student_subject_preference = 'General Homework Help' THEN 1
    ELSE 0
  END as subject_match_score
FROM users s
JOIN users v ON v.role = 'volunteer' AND v.deleted_at IS NULL
JOIN volunteer_profiles vp ON vp.user_id = v.id AND vp.is_discoverable = true
WHERE s.role = 'student' 
  AND s.deleted_at IS NULL
  AND s.profile_completed_at IS NOT NULL
  AND vp.grade_levels_comfortable ? s.current_grade::text
  AND EXISTS (
    SELECT 1
    FROM jsonb_object_keys(s.availability) sk
    JOIN jsonb_object_keys(v.availability) vk ON sk = vk
    WHERE (s.availability->sk)::boolean = true 
    AND (v.availability->vk)::boolean = true
  );

-- Functions for business logic
CREATE OR REPLACE FUNCTION get_volunteer_matches(student_id UUID)
RETURNS TABLE (
  volunteer_id UUID,
  volunteer_name TEXT,
  subjects JSONB,
  grade_levels JSONB,
  school TEXT,
  overlapping_days INTEGER,
  subject_match_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vm.volunteer_id,
    vm.volunteer_name,
    vm.subjects_to_tutor,
    vm.grade_levels_comfortable,
    vm.school,
    vm.overlapping_days,
    vm.subject_match_score
  FROM volunteer_matches vm
  WHERE vm.student_id = get_volunteer_matches.student_id
    AND vm.overlapping_days > 0
    AND vm.subject_match_score > 0
  ORDER BY 
    vm.subject_match_score DESC,
    vm.overlapping_days DESC,
    vm.volunteer_name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user's last_active_at
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET last_active_at = NOW() 
  WHERE id = NEW.sender_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_active_at when user sends a message
CREATE TRIGGER trigger_update_user_last_active
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_active();

-- Function to update chat's updated_at when a message is added
CREATE OR REPLACE FUNCTION update_chat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chats 
  SET updated_at = NOW() 
  WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update chat's updated_at when a message is added
CREATE TRIGGER trigger_update_chat_updated_at
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_updated_at();

-- Function to update user's updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at columns
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_volunteer_profiles_updated_at
  BEFORE UPDATE ON volunteer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_chats_updated_at
  BEFORE UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_action_logs ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Users can read volunteer profiles
CREATE POLICY "Users can read volunteer profiles" ON volunteer_profiles
  FOR SELECT USING (true);

-- Users can update their own volunteer profile
CREATE POLICY "Users can update own volunteer profile" ON volunteer_profiles
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Users can read chats they participate in
CREATE POLICY "Users can read own chats" ON chats
  FOR SELECT USING (
    auth.uid()::text = student_user_id::text OR 
    auth.uid()::text = volunteer_user_id::text
  );

-- Users can create chats
CREATE POLICY "Users can create chats" ON chats
  FOR INSERT WITH CHECK (
    auth.uid()::text = student_user_id::text OR 
    auth.uid()::text = volunteer_user_id::text
  );

-- Users can update chats they participate in
CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (
    auth.uid()::text = student_user_id::text OR 
    auth.uid()::text = volunteer_user_id::text
  );

-- Users can read messages in their chats
CREATE POLICY "Users can read own chat messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND (
        chats.student_user_id::text = auth.uid()::text OR 
        chats.volunteer_user_id::text = auth.uid()::text
      )
    )
  );

-- Users can insert messages in their chats
CREATE POLICY "Users can insert messages in own chats" ON messages
  FOR INSERT WITH CHECK (
    auth.uid()::text = sender_id::text AND
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND (
        chats.student_user_id::text = auth.uid()::text OR 
        chats.volunteer_user_id::text = auth.uid()::text
      )
    )
  );

-- Users can update their own messages
CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (auth.uid()::text = sender_id::text);

-- Admin policies (for admin users)
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can read all chats" ON chats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can read all messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can read admin logs" ON admin_action_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can insert admin logs" ON admin_action_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- RLS Policies for user_push_tokens
CREATE POLICY "Users can view their own push tokens" ON user_push_tokens
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own push tokens" ON user_push_tokens
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own push tokens" ON user_push_tokens
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own push tokens" ON user_push_tokens
  FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all push tokens" ON user_push_tokens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Insert sample data
INSERT INTO schools (name, type) VALUES
  ('Lincoln Elementary School', 'elementary'),
  ('Washington Middle School', 'middle'),
  ('Roosevelt High School', 'high'),
  ('Jefferson K-12 Academy', 'k12');

INSERT INTO subjects (name, category) VALUES
  ('Mathematics', 'STEM'),
  ('Science', 'STEM'),
  ('English Language Arts', 'Language'),
  ('History', 'Social Studies'),
  ('Geography', 'Social Studies'),
  ('Physics', 'STEM'),
  ('Chemistry', 'STEM'),
  ('Biology', 'STEM'),
  ('Algebra', 'STEM'),
  ('Geometry', 'STEM'),
  ('Calculus', 'STEM'),
  ('Reading', 'Language'),
  ('Writing', 'Language'),
  ('General Homework Help', 'General');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
