-- Admin role: allow specific users to write to exercises and muscle_groups.
-- Idempotent: re-running is safe.

-- ============================================================================
-- 1. is_admin column on profiles
-- ============================================================================
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- ============================================================================
-- 2. Helper function (avoids subselect in every policy and centralizes logic)
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ============================================================================
-- 3. exercises: admins can write, everyone authenticated can read
-- ============================================================================
drop policy if exists "exercises_read_authenticated" on public.exercises;
drop policy if exists "exercises_admin_insert" on public.exercises;
drop policy if exists "exercises_admin_update" on public.exercises;
drop policy if exists "exercises_admin_delete" on public.exercises;

create policy "exercises_read_authenticated" on public.exercises
  for select using (auth.role() = 'authenticated');

create policy "exercises_admin_insert" on public.exercises
  for insert with check (public.is_admin());

create policy "exercises_admin_update" on public.exercises
  for update using (public.is_admin()) with check (public.is_admin());

create policy "exercises_admin_delete" on public.exercises
  for delete using (public.is_admin());

-- ============================================================================
-- 4. muscle_groups: same pattern
-- ============================================================================
drop policy if exists "muscle_groups_read_authenticated" on public.muscle_groups;
drop policy if exists "muscle_groups_admin_write" on public.muscle_groups;

create policy "muscle_groups_read_authenticated" on public.muscle_groups
  for select using (auth.role() = 'authenticated');

create policy "muscle_groups_admin_write" on public.muscle_groups
  for all using (public.is_admin()) with check (public.is_admin());
