-- Update credit costs for all operations
-- This script updates existing costs and adds new operation types

-- Update existing costs
UPDATE credit_costs SET cost = 6 WHERE operation_type = 'answer_review';
UPDATE credit_costs SET cost = 7 WHERE operation_type = 'essay_review';
UPDATE credit_costs SET cost = 5 WHERE operation_type = 'daily_question_review';

-- Add new operation types
INSERT INTO credit_costs (operation_type, cost, description) VALUES
  ('mindmap_generation', 5, 'Generate AI-powered mindmap from content'),
  ('flashcard_generation', 5, 'Generate AI-powered flashcards from content'),
  ('mcq_generation_per_question', 1, 'Generate MCQ questions (cost per question)')
ON CONFLICT (operation_type) DO UPDATE SET
  cost = EXCLUDED.cost,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Update quiz_generation to be per-question based
UPDATE credit_costs 
SET cost = 1, 
    description = 'Generate MCQ questions (cost per question)',
    updated_at = NOW()
WHERE operation_type = 'quiz_generation';
