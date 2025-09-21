-- Insert default UPSC subjects
INSERT INTO public.subjects (name, description) VALUES
  ('General Studies Paper I', 'Indian Heritage and Culture, History and Geography of the World and Society'),
  ('General Studies Paper II', 'Governance, Constitution, Polity, Social Justice and International relations'),
  ('General Studies Paper III', 'Technology, Economic Development, Bio diversity, Environment, Security and Disaster Management'),
  ('General Studies Paper IV', 'Ethics, Integrity, and Aptitude'),
  ('Essay', 'Essay Writing for UPSC Mains'),
  ('Optional Subject', 'Optional Subject Papers'),
  ('Current Affairs', 'Current Affairs and Contemporary Issues')
ON CONFLICT (name) DO NOTHING;
