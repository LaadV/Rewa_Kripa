-- ═══════════════════════════════════════════════════════════════════
-- REWA KRIPA TRAVELS — Supabase Database Setup (SAFE TO RE-RUN)
--
-- HOW TO RUN:
-- 1. Go to your Supabase project dashboard
-- 2. Left sidebar → SQL Editor → click "New query"
-- 3. Paste this ENTIRE file → click "Run" (green button)
-- 4. You should see a table listing: seats | site_config
--
-- This script is idempotent — safe to run multiple times, never errors
-- on re-run, and never wipes existing data.
-- ═══════════════════════════════════════════════════════════════════


-- ────────────────────────────────────────────────────────────────
-- STEP 1: Seats table (shared, real-time seat bookings)
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
-- STEP 2: Site config table (admin-editable content, read by all pages)
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
-- STEP 5: Create fresh RLS policies (public read + write)
-- Public write is required because there is no Supabase Auth login
-- for customers — booking/admin access is gated by the app's own
-- password check, not by Postgres roles.
-- ────────────────────────────────────────────────────────────────
create policy "seats_select" on seats for select using (true);
create policy "seats_insert" on seats for insert with check (true);
create policy "seats_update" on seats for update using (true);
create policy "seats_delete" on seats for delete using (true);

create policy "config_select" on site_config for select using (true);
create policy "config_all"    on site_config for all using (true) with check (true);


-- ────────────────────────────────────────────────────────────────
-- STEP 6: Enable real-time for the seats table
-- (safe if already enabled — the exception is swallowed)
-- ────────────────────────────────────────────────────────────────
do $$
begin
  begin
    alter publication supabase_realtime add table seats;
  exception when others then
    null; -- already in publication, ignore
  end;
end $$;


-- ────────────────────────────────────────────────────────────────
-- STEP 7: Helper index for faster seat lookups
-- ────────────────────────────────────────────────────────────────
create index if not exists idx_seats_bus_date
  on seats (bus_id, travel_date);


-- ────────────────────────────────────────────────────────────────
-- STEP 8: Storage bucket for admin-uploaded images
-- (bus photos, driver photos, route/trip images, hero slider images)
-- ────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "site_images_read"   on storage.objects;
drop policy if exists "site_images_write"  on storage.objects;
drop policy if exists "site_images_update" on storage.objects;
drop policy if exists "site_images_delete" on storage.objects;

create policy "site_images_read"   on storage.objects for select using (bucket_id = 'site-images');
create policy "site_images_write"  on storage.objects for insert with check (bucket_id = 'site-images');
create policy "site_images_update" on storage.objects for update using (bucket_id = 'site-images');
create policy "site_images_delete" on storage.objects for delete using (bucket_id = 'site-images');


-- ────────────────────────────────────────────────────────────────
-- VERIFY: Check tables were created (should return 2 rows)
-- ────────────────────────────────────────────────────────────────
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('seats', 'site_config')
order by table_name;


-- ════════════════════════════════════════════════════════════════
-- DONE! ✅
-- Tables:  seats | site_config
-- Storage: site-images bucket (public, anon read/write)
--
-- Next step: copy your Project URL and anon key into supabase.js
--   Project URL:  Settings → API → Project URL
--   Anon Key:     Settings → API → anon / public key
--
-- Staff & attendance tables are a SEPARATE migration — run
-- staff_attendance.sql for those (staff.html / attendance-checkin.html).
-- ════════════════════════════════════════════════════════════════
