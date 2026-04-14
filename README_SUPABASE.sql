-- ═══════════════════════════════════════════════════════════════════
-- Rewa Kripa Travels — Supabase Database Setup
-- Run this entire file in: Supabase → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════

-- 1. Seat bookings (shared across all customers, real-time)
create table if not exists seats (
  id            bigint generated always as identity primary key,
  bus_id        text not null,
  travel_date   date not null,
  seat_num      int  not null,
  gender        text not null default 'M' check (gender in ('M','F')),
  passenger_name  text,
  passenger_phone text,
  status        text not null default 'booked',
  booked_at     timestamptz default now(),
  unique(bus_id, travel_date, seat_num)
);

-- 2. Site config (admin-editable, read by all pages)
create table if not exists site_config (
  id          int primary key default 1,
  config_json jsonb,
  updated_at  timestamptz default now()
);

-- 3. Enable Row Level Security
alter table seats       enable row level security;
alter table site_config enable row level security;

-- 4. Policies: anyone can read, anyone can insert/update (booking)
--    For production, tighten with Supabase Auth
create policy "seats_read"   on seats for select using (true);
create policy "seats_write"  on seats for insert with check (true);
create policy "seats_update" on seats for update using (true);
create policy "seats_delete" on seats for delete using (true);

create policy "config_read"  on site_config for select using (true);
create policy "config_write" on site_config for all using (true);

-- 5. Enable real-time for seats table
alter publication supabase_realtime add table seats;

-- Done! Copy your Project URL + anon key into supabase.js
