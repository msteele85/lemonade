# Lemonade

Turn your skills into a real business. An AI-powered web app that helps teens plan a business or side gig.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy the environment template and fill in your keys:

```bash
cp .env.local.example .env.local
```

3. Add your environment variables to `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

4. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
/app
  /onboarding        → 6-step guided questionnaire
  /ideas             → AI-generated business ideas
  /plan              → Business plan viewer (coming soon)
  /api
    /generate-ideas  → Claude Haiku: profile → 5 business ideas
    /generate-plan   → Claude Sonnet: idea + profile → full plan
/components
  /onboarding        → Step components, progress bar, option buttons
  /ideas             → Idea card component
/lib
  anthropic.ts       → Claude API client + prompt templates
  supabase.ts        → Supabase client
  types.ts           → Shared TypeScript types
  utils.ts           → Tailwind utility (cn)
  mock-ideas.ts      → Fallback mock data for /ideas
```

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** + custom design tokens
- **Supabase** (anonymous sessions)
- **Anthropic Claude** (Haiku for ideas, Sonnet for plans)
- **Framer Motion** (micro-animations)

## Supabase Table Setup

Create a `sessions` table:

```sql
create table sessions (
  id uuid default gen_random_uuid() primary key,
  profile jsonb not null default '{}',
  ideas jsonb,
  chosen_idea_id text,
  plan jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table sessions enable row level security;

-- Allow anonymous inserts and reads
create policy "Allow anonymous insert" on sessions for insert with check (true);
create policy "Allow read own session" on sessions for select using (true);
```
