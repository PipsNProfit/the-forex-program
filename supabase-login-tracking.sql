-- ===========================================================
-- THE FOREX PROGRAM — login tracking for account-sharing detection
-- Run this in Supabase SQL Editor (after supabase-setup.sql)
-- ===========================================================

create table if not exists public.login_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  ip_address text,
  city text,
  country text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.login_events enable row level security;

-- Users can log their own login event, but cannot read the table
-- (only you, via the Supabase dashboard/SQL editor, can review it —
-- that access bypasses RLS since it uses your project's own credentials).
create policy "Users can insert their own login event"
  on public.login_events for insert
  with check (auth.uid() = user_id);

-- ===========================================================
-- REVIEW QUERY — run this any time in the SQL Editor to see
-- accounts with the most distinct locations/devices in the last 7 days.
-- Higher numbers = worth a manual look, not automatic proof of sharing.
-- ===========================================================

select
  u.email,
  count(*) as total_logins,
  count(distinct le.ip_address) as distinct_ips,
  count(distinct le.city) as distinct_cities,
  count(distinct le.user_agent) as distinct_devices,
  max(le.created_at) as last_login
from public.login_events le
join auth.users u on u.id = le.user_id
where le.created_at > now() - interval '7 days'
group by u.email
having count(distinct le.ip_address) > 2
order by distinct_ips desc, distinct_cities desc;
