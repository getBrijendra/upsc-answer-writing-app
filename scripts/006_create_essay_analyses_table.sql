-- Create essay_analyses table
CREATE TABLE IF NOT EXISTS essay_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  essay TEXT NOT NULL,
  analysis TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_essay_analyses_user_id ON essay_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_essay_analyses_created_at ON essay_analyses(created_at DESC);

-- Enable RLS
ALTER TABLE essay_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own essay analyses"
  ON essay_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own essay analyses"
  ON essay_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_essay_analyses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER essay_analyses_updated_at
  BEFORE UPDATE ON essay_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_essay_analyses_updated_at();
