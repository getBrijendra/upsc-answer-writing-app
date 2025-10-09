-- Create mindmaps table
CREATE TABLE IF NOT EXISTS mindmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  edges JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flashcard_sets table
CREATE TABLE IF NOT EXISTS flashcard_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mindmaps_user_id ON mindmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_sets_user_id ON flashcard_sets(user_id);

-- Enable RLS
ALTER TABLE mindmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_sets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own mindmaps"
  ON mindmaps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mindmaps"
  ON mindmaps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mindmaps"
  ON mindmaps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mindmaps"
  ON mindmaps FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own flashcard sets"
  ON flashcard_sets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own flashcard sets"
  ON flashcard_sets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcard sets"
  ON flashcard_sets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcard sets"
  ON flashcard_sets FOR DELETE
  USING (auth.uid() = user_id);
