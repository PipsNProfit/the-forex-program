-- ===========================================================
-- THE FOREX PROGRAM — database setup
-- Run this once in Supabase: Project → SQL Editor → New query → paste → Run
-- ===========================================================

-- Tracks which lessons each user has marked complete.
create table if not exists public.progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id int not null,
  done boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);

-- Row Level Security: each user can only see and edit their own rows.
alter table public.progress enable row level security;

create policy "Users can view their own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.progress for update
  using (auth.uid() = user_id);

create policy "Users can delete their own progress"
  on public.progress for delete
  using (auth.uid() = user_id);
