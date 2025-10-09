-- Add language column to answers table
ALTER TABLE answers 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'english' CHECK (language IN ('english', 'hindi'));

-- Add language column to user_daily_attempts table
ALTER TABLE user_daily_attempts 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'english' CHECK (language IN ('english', 'hindi'));

-- Add language column to essay_analyses table
ALTER TABLE essay_analyses 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'english' CHECK (language IN ('english', 'hindi'));

-- Add language column to mcq_questions table
ALTER TABLE mcq_questions 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'english' CHECK (language IN ('english', 'hindi'));

-- Add comment to explain the purpose
COMMENT ON COLUMN answers.language IS 'Language preference for answer submission (english or hindi)';
COMMENT ON COLUMN user_daily_attempts.language IS 'Language preference for daily question attempt (english or hindi)';
COMMENT ON COLUMN essay_analyses.language IS 'Language preference for essay submission (english or hindi)';
COMMENT ON COLUMN mcq_questions.language IS 'Language preference for MCQ generation (english or hindi)';
