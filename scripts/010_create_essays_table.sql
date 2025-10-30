-- Create essays table to store essay submissions
CREATE TABLE IF NOT EXISTS essays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  essay_text TEXT NOT NULL,
  file_url TEXT,
  language TEXT DEFAULT 'english',
  feedback JSONB,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS essays_user_id_idx ON essays(user_id);
CREATE INDEX IF NOT EXISTS essays_created_at_idx ON essays(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_essays_updated_at BEFORE UPDATE ON essays FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
