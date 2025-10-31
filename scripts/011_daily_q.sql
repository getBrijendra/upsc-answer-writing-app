create table public.daily_questions (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  question_id text not null,
  question text not null,
  difficulty_level text null,
  question_date date not null,
  source text null,
  constraint daily_questions_pkey primary key (id),
  constraint unique_daily_question unique (question_id, question_date),
  constraint daily_questions_difficulty_level_check check (
    (
      difficulty_level = any (array['Easy'::text, 'Medium'::text, 'Hard'::text])
    )
  )
) TABLESPACE pg_default;

create index IF not exists daily_questions_question_date_idx on public.daily_questions using btree (question_date) TABLESPACE pg_default;