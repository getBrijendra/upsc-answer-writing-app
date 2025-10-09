# Database Migration Scripts

This directory contains all SQL migration scripts for the UPSC Answer Writing App. Scripts should be run in numerical order.

## Script Execution Order

### Initial Setup (Run Once)
1. **001_create_database_schema.sql** - Creates core tables (profiles, subjects, answers, mcq_questions, user_mcq_attempts) with RLS policies
2. **002_create_credit_system.sql** - Creates credit management system (user_credits, credit_costs, daily_questions, user_daily_attempts)
3. **003_create_payment_system.sql** - Creates payment infrastructure (payment_plans, payments, subscriptions)

### Data Seeding
4. **002_seed_subjects.sql** - Seeds initial subject data
5. **003_update_optional_subjects.sql** - Adds optional subjects for UPSC

### Feature Additions
6. **004_add_subject_categories.sql** - Adds category field to subjects (PRELIMS, MAINS, OPTIONAL)
7. **005_add_optional_subject_to_profiles.sql** - Adds optional subject selection to user profiles
8. **006_create_essay_analyses_table.sql** - Creates table for essay analysis storage
9. **007_create_mindmaps_flashcards_tables.sql** - Creates tables for mindmaps and flashcard sets
10. **008_add_language_support.sql** - Adds language support (English/Hindi) to various tables
11. **009_update_credit_costs.sql** - Updates credit costs for all operations (mindmap: 5, flashcard: 5, answer: 6, essay: 7, MCQ: 1/question)

## Running Scripts

### Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the script content
4. Click "Run" to execute

### Using Supabase CLI
\`\`\`bash
supabase db push
\`\`\`

### Using psql
\`\`\`bash
psql -h <host> -U <user> -d <database> -f scripts/001_create_database_schema.sql
\`\`\`

## Notes

- All scripts use `IF NOT EXISTS` or `ON CONFLICT` clauses to be idempotent
- Scripts include Row Level Security (RLS) policies for data protection
- Triggers are created for automatic timestamp updates
- Foreign key constraints ensure data integrity

## Database Schema Overview

### Core Tables
- **profiles** - User profile information
- **subjects** - UPSC subjects (Prelims, Mains, Optional)
- **answers** - User answer submissions
- **mcq_questions** - Generated MCQ questions
- **user_mcq_attempts** - MCQ attempt tracking

### Credit System
- **user_credits** - User credit balances
- **credit_costs** - AI operation costs
- **daily_questions** - Admin-published daily questions
- **user_daily_attempts** - Daily question attempts

### Payment System
- **payment_plans** - Credit packages and subscriptions
- **payments** - Payment transaction records
- **subscriptions** - Active subscriptions

### Additional Features
- **essay_analyses** - Essay analysis results
- **mindmaps** - Saved mindmap data
- **flashcard_sets** - Saved flashcard sets

## Credit Costs

Current credit costs for AI operations:
- **Mindmap Generation**: 5 credits
- **Flashcard Generation**: 5 credits
- **Answer Review**: 6 credits
- **Essay Review**: 7 credits
- **MCQ Generation**: 1 credit per question
- **Daily Question Review**: 5 credits

## Language Support

The following tables support English and Hindi language preferences:
- answers
- user_daily_attempts
- essay_analyses
- mcq_questions
