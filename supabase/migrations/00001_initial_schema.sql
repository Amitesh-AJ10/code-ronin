-- CodeRonin: Initial schema for auth + profiles + game state
-- Run this in Supabase Dashboard → SQL Editor → New query, then Run.

-- =============================================================================
-- 1. PROFILES (one row per user; extends auth.users)
-- Stores display name + selected skill + difficulty for Skills.tsx / Difficulty.tsx
-- =============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  selected_skill text check (selected_skill in ('Pandas', 'OOPS', 'CP', 'Cryptograph')),
  selected_difficulty text check (selected_difficulty in ('syntax', 'logic', 'semantic')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: users can read/update only their own profile
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Optional: keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 2. USER PROGRESS (Arena state / caching)
-- Level, last code snapshot, last played — for resume and leaderboards
-- =============================================================================
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  level integer not null default 1,
  last_code_snapshot text,
  last_played_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.user_progress enable row level security;

create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- =============================================================================
-- 3. GRANT USAGE (so anon/authenticated can use the tables with RLS)
-- =============================================================================
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.user_progress to authenticated;
