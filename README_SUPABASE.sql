-- ═══════════════════════════════════════════════════════════════════
-- REWA KRIPA TRAVELS — Supabase Database Setup (FIXED VERSION)
-- 
-- HOW TO RUN:
-- 1. Go to your Supabase project dashboard
-- 2. Left sidebar → SQL Editor → click "New query"  
-- 3. Paste this ENTIRE file → click "Run" (green button)
-- 4. You should see: "Success. No rows returned."
--
-- This script is SAFE to run multiple times — it won't error on re-run.
-- ═══════════════════════════════════════════════════════════════════


-- ────────────────────────────────────────────────────────────────
-- STEP 1: Create the seats table
-- ────────────────────────────────────────────────────────────────
create table if not exists seats (
  id              bigint generated always as identity primary key,
  bus_id          text        not null,
  travel_date     date        not null,
  seat_num        int         not null,
  gender          text        not null default 'M',
  passenger_name  text        default '',
  passenger_phone text        default '',
  status          text        not null default 'booked',
  booked_at       timestamptz default now(),
  constraint seats_unique unique (bus_id, travel_date, seat_num),
  constraint gender_check check (gender in ('M','F'))
);


-- ────────────────────────────────────────────────────────────────
-- STEP 2: Create the site config table
-- ────────────────────────────────────────────────────────────────
create table if not exists site_config (
  id          int         primary key default 1,
  config_json jsonb,
  updated_at  timestamptz default now()
);


-- ────────────────────────────────────────────────────────────────
-- STEP 3: Enable Row Level Security (safe if already enabled)
-- ────────────────────────────────────────────────────────────────
alter table seats       enable row level security;
alter table site_config enable row level security;


-- ────────────────────────────────────────────────────────────────
-- STEP 4: Drop old policies first (so re-running never errors)
-- ────────────────────────────────────────────────────────────────
drop policy if exists "seats_read"    on seats;
drop policy if exists "seats_write"   on seats;
drop policy if exists "seats_update"  on seats;
drop policy if exists "seats_delete"  on seats;
drop policy if exists "seats_select"  on seats;
drop policy if exists "seats_insert"  on seats;
drop policy if exists "seats_all"     on seats;

drop policy if exists "config_read"   on site_config;
drop policy if exists "config_write"  on site_config;
drop policy if exists "config_all"    on site_config;
drop policy if exists "config_select" on site_config;
drop policy if exists "config_insert" on site_config;


-- ────────────────────────────────────────────────────────────────
-- STEP 5: Create fresh RLS policies (allow public access)
-- ────────────────────────────────────────────────────────────────

-- seats: public read + write (anyone can book/view seats)
create policy "seats_select" on seats
  for select using (true);

create policy "seats_insert" on seats
  for insert with check (true);

create policy "seats_update" on seats
  for update using (true);

create policy "seats_delete" on seats
  for delete using (true);


-- site_config: public read + write (admin can save config)
create policy "config_select" on site_config
  for select using (true);

create policy "config_all" on site_config
  for all using (true) with check (true);


-- ────────────────────────────────────────────────────────────────
-- STEP 6: Enable real-time for the seats table
-- (this may show a notice if already enabled — that's fine)
-- ────────────────────────────────────────────────────────────────
do $$
begin
  begin
    alter publication supabase_realtime add table seats;
  exception when others then
    -- already in publication, ignore
    null;
  end;
end $$;


-- ────────────────────────────────────────────────────────────────
-- STEP 7: Create a useful helper index (faster seat lookups)
-- ────────────────────────────────────────────────────────────────
create index if not exists idx_seats_bus_date
  on seats (bus_id, travel_date);


-- ────────────────────────────────────────────────────────────────
-- VERIFY: Check tables were created (should return 2 rows)
-- ────────────────────────────────────────────────────────────────
select
  table_name,
  pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
from information_schema.tables
where table_schema = 'public'
  and table_name in ('seats', 'site_config')
order by table_name;


-- ════════════════════════════════════════════════════════════════
-- DONE! ✅
-- You should see a table with 2 rows: seats | site_config
-- 
-- Next step: copy your Project URL and anon key into supabase.js
--
-- Project URL:   Settings → API → Project URL
-- Anon Key:      Settings → API → anon / public key
-- ════════════════════════════════════════════════════════════════
