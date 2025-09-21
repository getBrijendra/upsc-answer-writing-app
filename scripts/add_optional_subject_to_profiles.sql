-- Add optional_subject_id column to profiles table
ALTER TABLE profiles 
ADD COLUMN optional_subject_id uuid REFERENCES subjects(id);

-- Add a comment to explain the purpose
COMMENT ON COLUMN profiles.optional_subject_id IS 'Optional subject selection that can only be changed by contacting support';

-- Create an index for better query performance
CREATE INDEX idx_profiles_optional_subject_id ON profiles(optional_subject_id);
