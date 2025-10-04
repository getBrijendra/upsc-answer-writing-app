-- ================================
-- 1. Core Database Schema
-- ================================

-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create answers table for storing user submissions
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  file_url TEXT,
  feedback JSONB,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mcq_questions table for generated questions
CREATE TABLE IF NOT EXISTS public.mcq_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  source_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_mcq_attempts table for tracking MCQ attempts
CREATE TABLE IF NOT EXISTS public.user_mcq_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mcq_question_id UUID NOT NULL REFERENCES public.mcq_questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 2. Credit System
-- ================================

CREATE TABLE IF NOT EXISTS user_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  credits INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS credit_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type TEXT NOT NULL UNIQUE,
  cost INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id),
  difficulty_level TEXT CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
  word_limit INTEGER DEFAULT 250,
  time_limit INTEGER DEFAULT 30,
  published_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- ================================
-- 3. Payment System
-- ================================

CREATE TABLE IF NOT EXISTS payment_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  credits INTEGER NOT NULL,
  price_inr INTEGER NOT NULL,
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('one_time', 'subscription')),
  subscription_duration_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES payment_plans(id),
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(500),
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES payment_plans(id),
  payment_id UUID REFERENCES payments(id),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','cancelled','expired','paused')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample plans
INSERT INTO payment_plans (name, description, credits, price_inr, plan_type, subscription_duration_days) VALUES
('Starter Pack', 'Perfect for beginners', 100, 9900, 'one_time', NULL),
('Standard Pack', 'Most popular choice', 250, 19900, 'one_time', NULL),
('Premium Pack', 'Best value for money', 500, 34900, 'one_time', NULL),
('Monthly Pro', 'Unlimited practice for a month', 1000, 49900, 'subscription', 30),
('Yearly Pro', 'Best annual deal', 15000, 499900, 'subscription', 365)
ON CONFLICT DO NOTHING;

-- ================================
-- 4. Seed Data
-- ================================

INSERT INTO public.subjects (name, description) VALUES
  ('General Studies Paper I', 'Indian Heritage and Culture, History and Geography of the World and Society'),
  ('General Studies Paper II', 'Governance, Constitution, Polity, Social Justice and International relations'),
  ('General Studies Paper III', 'Technology, Economic Development, Bio diversity, Environment, Security and Disaster Management'),
  ('General Studies Paper IV', 'Ethics, Integrity, and Aptitude'),
  ('Essay', 'Essay Writing for UPSC Mains'),
  ('Optional Subject', 'Optional Subject Papers'),
  ('Current Affairs', 'Current Affairs and Contemporary Issues')
ON CONFLICT (name) DO NOTHING;

-- ================================
-- 5. Alterations
-- ================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS optional_subject_id uuid REFERENCES subjects(id);

COMMENT ON COLUMN profiles.optional_subject_id IS 'Optional subject selection that can only be changed by contacting support';

CREATE INDEX IF NOT EXISTS idx_profiles_optional_subject_id ON profiles(optional_subject_id);

-- ================================
-- 6. RLS + Policies
-- ================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcq_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mcq_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Subjects
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);

-- Answers
CREATE POLICY "Users can view their own answers" ON public.answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own answers" ON public.answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own answers" ON public.answers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own answers" ON public.answers FOR DELETE USING (auth.uid() = user_id);

-- MCQ
CREATE POLICY "Users can view their own MCQ questions" ON public.mcq_questions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own MCQ questions" ON public.mcq_questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own MCQ questions" ON public.mcq_questions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own MCQ questions" ON public.mcq_questions FOR DELETE USING (auth.uid() = user_id);

-- MCQ Attempts
CREATE POLICY "Users can view their own MCQ attempts" ON public.user_mcq_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own MCQ attempts" ON public.user_mcq_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments & subscriptions
CREATE POLICY "Payment plans are viewable by everyone" ON payment_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own payments" ON payments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- ================================
-- 7. Functions & Triggers
-- ================================

-- Create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Credits auto-create
CREATE OR REPLACE FUNCTION create_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_credits (user_id, credits)
  VALUES (NEW.id, 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_user_credits_trigger ON profiles;
CREATE TRIGGER create_user_credits_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_credits();

-- update timestamp helper
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON user_credits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credit_costs_updated_at BEFORE UPDATE ON credit_costs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_questions_updated_at BEFORE UPDATE ON daily_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- END OF MIGRATION
-- ================================
