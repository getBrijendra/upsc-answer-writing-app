# UPSC Answer Writing App

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/techyhut-solutions-projects/v0-upsc-answer-writing-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/7L8H0rxqwut)

An AI-assisted workspace that helps UPSC aspirants practice GS answers, essays, MCQs, and revision material inside one dashboard. The codebase is automatically synced with the deployed [v0.app](https://v0.app) project, so UI tweaks made in v0 stay in lockstep with this repo.

## Live Deployment

- **Production**: [vercel.com/techyhut-solutions-projects/v0-upsc-answer-writing-app](https://vercel.com/techyhut-solutions-projects/v0-upsc-answer-writing-app)  
- **Designer Workspace**: [v0.app/chat/projects/7L8H0rxqwut](https://v0.app/chat/projects/7L8H0rxqwut)

## Core Functionalities

| Module | What it does | Key Details |
| --- | --- | --- |
| **Answer Writing Practice** | Authenticated users pick a GS or optional subject, paste/write the question & answer, optionally upload answer-sheet images, and submit for AI feedback. | Uses Supabase auth + storage, enforces credit deductions (`credit_costs` table), extracts text from uploaded images, and saves answers + AI feedback (`answers` table). |
| **Essay Practice Lab** | Generate topics from text, links, or uploaded notes, or enter a custom prompt, draft the essay, and get detailed AI review. | Handles topic generation, essay storage (`essays` table), language toggle, credit usage tracking, and OCR for scanned essays. |
| **MCQ Generator** | Turns study notes (typed, linked, or uploaded) into MCQ sets and lets users view stats about their generated questions and attempts. | Persists questions (`mcq_questions`), attempts (`user_mcq_attempts`), and accuracy metrics while supporting both mains and optional subjects. |
| **Daily Questions Feed** | On first visit each day, fetches a fresh set of Civil Services questions from the backend API and stores them for reuse. | Uses Supabase `daily_questions` table as cache keyed by date; includes copy-to-clipboard and difficulty badges. |
| **Mindmaps & Flashcards** | From the dashboard, users can create visual mindmaps and flashcard decks out of any uploaded content and revisit them later. | Generated assets are saved in `mindmaps` and `flashcard_sets`, surfaced via quick-launch cards and Saved Items sections. |
| **Progress Dashboard** | Consolidates answer, essay, MCQ, mindmap, and flashcard stats with charts, trends, and history filters. | Pulls per-user analytics from Supabase (`answers`, `essays`, `user_mcq_attempts`, etc.) and renders multiple tabbed views. |
| **Profile & Subject Management** | Users manage their profile, select optional subjects, and sync that choice across practice modules. | `profiles` table stores subject preference; subject selection drives dropdowns in practice tools. |

## Tech Stack

- **Framework**: Next.js App Router + React Server Components
- **UI**: Tailwind CSS, shadcn/ui, framer-motion, lucide-react icons
- **Backend & Auth**: Supabase (auth, SQL tables, storage buckets)
- **AI/Automation**: Custom API routes (`/api/generate-feedback`, `/api/generate-essay-topics`, `/api/generate-flashcards`, etc.) plus external OCR endpoints exposed through `NEXT_PUBLIC_API_URL`
- **Deployment**: Vercel (auto-deployed from this repository)

## Feature Walkthrough

1. **Authenticate** via Supabase; unauthenticated users are redirected to `/auth/login` for gated routes such as `/practice`, `/essay-practice`, `/mcq`, and `/progress`.
2. **Dashboard Hub (`/dashboard`)**
   - Quick tiles to open answer writing, MCQ generator, mindmap builder, and flashcard creator.
   - Modals trigger AI pipelines for mindmaps/flashcards, with toasts + router navigation on success.
3. **Answer Writing (`/practice`)**
   - Subject grouped by Mains vs Optional (auto-includes user’s optional subject).
   - Image uploads → Supabase storage → OCR API → auto-fill text area.
   - Credit validation before submission, AI feedback storage, redirect to `/answer/[id]` for review.
4. **Essay Practice (`/essay-practice`)**
   - Multi-input topic generator (text/link/file) that calls `/api/generate-essay-topics`.
   - Custom topic mode, OCR for essay images, word-count tracker, AI feedback pipeline identical to answer writing but billed separately.
5. **MCQ Generator (`/mcq/generate`)**
   - Displays generated question/attempt stats, accuracy percentage, and feeds the `MCQQuizGenerator` component for new sets.
6. **Daily Questions (`/daily-questions`)**
   - Pulls cached questions or triggers backend generation; shows difficulty badges and copy shortcut for quick practice.
7. **Progress Tracker (`/progress`)**
   - Tabbed interface for Answer Writing, Essay Practice, MCQ stats, and saved Mindmaps/Flashcards.
   - Includes charts (`ProgressChart`, `SubjectProgressChart`), suggestions, timelines, and history grids with filters.

## Local Development

```bash
npm install
npm run dev
```

Environment variables (see `.env.example` if available) must include Supabase keys, `NEXT_PUBLIC_API_URL`, and any OpenAI/provider keys required by the custom API routes.

## Data Flow & Credits

- **Credits**: `credit_costs` table stores per-operation cost (e.g., `answer_review`, `essay_review`). Helper `getUserCredits` checks remaining balance before AI calls.
- **Uploads**: `uploadToSupabase` streams user files (answer sheets, essays, flashcard sources) into Supabase Storage buckets, returning public URLs for downstream OCR or prompt construction.
- **Feedback Loop**: After storing user submissions, the app invokes `/api/generate-feedback` which returns structured feedback + score. These results are merged back into Supabase so dashboards and history views stay updated.

## Keeping Code & v0 UI in Sync

The repository is linked to the v0 project. Typical workflow:

1. Design/edit UI blocks inside v0.
2. Deploy from v0; the deployment pushes code changes to this repo automatically.
3. Vercel detects repo updates and publishes the latest build.

Manual edits done here should be reconciled with future v0 syncs to avoid overwriting changes.

---

Have ideas for new modules (e.g., interview simulations or voice-based answer capture)? File an issue or prototype it in v0, then sync the flow back here.
