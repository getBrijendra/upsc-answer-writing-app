-- Add category column to subjects table
ALTER TABLE subjects 
ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('PRELIMS', 'MAINS', 'OPTIONAL'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_subjects_category ON subjects(category);

-- Update existing subjects with categories

-- Mark Mains subjects
UPDATE subjects SET category = 'MAINS' 
WHERE name IN (
  'General Studies Paper I',
  'General Studies Paper II', 
  'General Studies Paper III',
  'General Studies Paper IV',
  'Essay',
  'English Language',
  'Indian Language'
);

-- Mark all optional subjects
UPDATE subjects SET category = 'OPTIONAL'
WHERE name IN (
  'Agriculture', 'Animal Husbandry and Veterinary Science', 'Anthropology', 'Botany', 
  'Chemistry', 'Civil Engineering', 'Commerce and Accountancy', 'Economics',
  'Electrical Engineering', 'Geography', 'Geology', 'History', 'Law', 'Management',
  'Mathematics', 'Mechanical Engineering', 'Medical Science', 'Philosophy', 'Physics',
  'Political Science and International Relations', 'Psychology', 'Public Administration',
  'Sociology', 'Statistics', 'Zoology',
  'Assamese Literature', 'Bengali Literature', 'Bodo Literature', 'Dogri Literature',
  'Gujarati Literature', 'Hindi Literature', 'Kannada Literature', 'Kashmiri Literature',
  'Konkani Literature', 'Maithili Literature', 'Malayalam Literature', 'Manipuri Literature',
  'Marathi Literature', 'Nepali Literature', 'Oriya Literature', 'Punjabi Literature',
  'Sanskrit Literature', 'Santali Literature', 'Sindhi Literature', 'Tamil Literature',
  'Telugu Literature', 'Urdu Literature', 'English Literature'
);

-- Insert Prelims subjects (General Studies topics)
INSERT INTO subjects (name, description, category) VALUES
('Current Affairs', 'Current events and contemporary issues', 'PRELIMS'),
('History of India and Indian National Movement', 'Ancient, Medieval, and Modern Indian History', 'PRELIMS'),
('Indian and World Geography', 'Physical, Social, and Economic Geography', 'PRELIMS'),
('Indian Polity and Governance', 'Constitution, Political System, and Governance', 'PRELIMS'),
('Economic and Social Development', 'Economic Development, Social Issues, and Poverty', 'PRELIMS'),
('Environmental Ecology, Biodiversity, and Climate Change', 'Environment, Ecology, and Climate Change', 'PRELIMS'),
('General Science', 'Physics, Chemistry, Biology, and Technology', 'PRELIMS')
ON CONFLICT (name) DO UPDATE SET category = 'PRELIMS';

-- Insert CSAT (Prelims Paper II) subjects
INSERT INTO subjects (name, description, category) VALUES
('Comprehension', 'Reading comprehension and understanding', 'PRELIMS'),
('Logical Reasoning and Analytical Ability', 'Logical reasoning and analytical skills', 'PRELIMS'),
('Decision-Making and Problem-Solving', 'Decision-making and problem-solving abilities', 'PRELIMS'),
('Basic Numeracy', 'Basic mathematics and numerical ability', 'PRELIMS'),
('Data Interpretation', 'Data interpretation and analysis', 'PRELIMS')
ON CONFLICT (name) DO NOTHING;

-- Insert Mains qualifying papers if not exists
INSERT INTO subjects (name, description, category) VALUES
('English Language', 'English language proficiency (Qualifying Paper)', 'MAINS'),
('Indian Language', 'Indian language from 8th Schedule (Qualifying Paper)', 'MAINS')
ON CONFLICT (name) DO UPDATE SET category = 'MAINS';

-- Insert Mains General Studies papers with proper names
INSERT INTO subjects (name, description, category) VALUES
('Indian Heritage and Culture', 'Indian Heritage, Culture, History and Geography', 'MAINS'),
('Governance, Constitution, Polity, and International Relations', 'Governance, Constitution, Polity, Social Justice and International Relations', 'MAINS'),
('Technology, Economic Development, and Environment', 'Technology, Economic Development, Bio-diversity, Environment, Security and Disaster Management', 'MAINS'),
('Ethics, Integrity, and Aptitude', 'Ethics, Integrity, and Aptitude', 'MAINS')
ON CONFLICT (name) DO UPDATE SET category = 'MAINS';

-- Update Current Affairs to PRELIMS if it exists
UPDATE subjects SET category = 'PRELIMS' WHERE name = 'Current Affairs';

-- Remove generic "Optional Subject" entry as we have specific optional subjects
DELETE FROM subjects WHERE name = 'Optional Subject' AND category IS NULL;
