-- Create user_credits table to track user credits
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  credits INTEGER DEFAULT 100, -- Starting credits for new users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create credit_costs table for admin to manage AI operation costs
CREATE TABLE IF NOT EXISTS credit_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type TEXT NOT NULL UNIQUE, -- 'answer_review', 'quiz_generation', 'essay_review'
  cost INTEGER NOT NULL, -- Credits to deduct
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_questions table for admin published questions
CREATE TABLE IF NOT EXISTS daily_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id),
  difficulty_level TEXT CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
  word_limit INTEGER DEFAULT 250,
  time_limit INTEGER DEFAULT 30, -- in minutes
  published_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_daily_attempts table to track user attempts on daily questions
CREATE TABLE IF NOT EXISTS user_daily_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  daily_question_id UUID REFERENCES daily_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  credits_used INTEGER DEFAULT 0,
  feedback JSONB,
  score INTEGER,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, daily_question_id)
);

-- Insert default credit costs
INSERT INTO credit_costs (operation_type, cost, description) VALUES
  ('answer_review', 5, 'AI review and feedback for answer writing'),
  ('quiz_generation', 10, 'Generate MCQ quiz from content'),
  ('essay_review', 8, 'AI review and scoring for essay answers'),
  ('daily_question_review', 6, 'AI review for daily question attempts')
ON CONFLICT (operation_type) DO NOTHING;

-- Create function to automatically create user credits when profile is created
CREATE OR REPLACE FUNCTION create_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_credits (user_id, credits)
  VALUES (NEW.id, 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create credits for new users
DROP TRIGGER IF EXISTS create_user_credits_trigger ON profiles;
CREATE TRIGGER create_user_credits_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_credits();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON user_credits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credit_costs_updated_at BEFORE UPDATE ON credit_costs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_questions_updated_at BEFORE UPDATE ON daily_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
