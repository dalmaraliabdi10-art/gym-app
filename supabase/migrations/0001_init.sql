-- gym-app initial schema
-- Skapar tabeller, foreign keys och Row Level Security-policies.

-- ============================================================================
-- 1. Profiles (1:1 med auth.users)
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 2. Muscle groups (statisk lookup)
-- ============================================================================
create table public.muscle_groups (
  slug text primary key,                           -- 'chest', 'biceps', 'lats' ...
  name_sv text not null,
  name_en text not null,
  region text not null check (region in ('front', 'back'))
);

-- ============================================================================
-- 3. Exercises (delat övningsbibliotek)
-- ============================================================================
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  form_tips text[] not null default '{}',
  equipment text not null default 'bodyweight',
  difficulty text not null default 'beginner'
    check (difficulty in ('beginner', 'intermediate', 'advanced')),
  video_url text,
  primary_muscles text[] not null,                 -- referenser till muscle_groups.slug
  secondary_muscles text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index exercises_primary_muscles_idx on public.exercises using gin (primary_muscles);

-- ============================================================================
-- 4. Workouts (träningspass per användare)
-- ============================================================================
create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index workouts_user_started_idx on public.workouts (user_id, started_at desc);

-- ============================================================================
-- 5. Workout sets
-- ============================================================================
create table public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  set_index int not null,
  reps int,
  weight_kg numeric(6,2),
  rpe numeric(3,1),
  completed_at timestamptz not null default now()
);

create index workout_sets_workout_idx on public.workout_sets (workout_id);

-- ============================================================================
-- 6. Auto-create profile vid ny användare
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 7. Row Level Security
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.muscle_groups enable row level security;
alter table public.exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_sets enable row level security;

-- Profiles: bara egen profil
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Muscle groups & exercises: läsbart för inloggade
create policy "muscle_groups_read_authenticated" on public.muscle_groups
  for select using (auth.role() = 'authenticated');
create policy "exercises_read_authenticated" on public.exercises
  for select using (auth.role() = 'authenticated');

-- Workouts: bara egna pass (alla operationer)
create policy "workouts_all_own" on public.workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Workout sets: bara set som tillhör egna pass
create policy "workout_sets_all_own" on public.workout_sets
  for all using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_sets.workout_id and w.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.workouts w
      where w.id = workout_sets.workout_id and w.user_id = auth.uid()
    )
  );
