-- ═══════════════════════════════════════════════════════════════════════
-- Rewa Kripa Travels — Finance Entries Table (bus-only, shared via Supabase)
-- Run this in: Supabase → SQL Editor → New Query → Run
--
-- NOTE: each statement is on a single line on purpose — some copy/paste
-- paths insert a stray ";" at every line break, which breaks multi-line
-- statements. Paste this directly into the Supabase SQL Editor.
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists finance_entries (id bigint generated always as identity primary key, bus_id text not null, bus_plate text default '', bus_title text default '', date date not null, type text not null check (type in ('income','expense')), category text not null default '', amount numeric not null default 0, note text default '', created_at timestamptz default now());

alter table finance_entries enable row level security;

drop policy if exists "finance_read" on finance_entries;

drop policy if exists "finance_write" on finance_entries;

create policy "finance_read" on finance_entries for select using (true);

create policy "finance_write" on finance_entries for all using (true) with check (true);

do $$ begin begin alter publication supabase_realtime add table finance_entries; exception when duplicate_object then null; end; end $$;

create index if not exists idx_finance_bus_date on finance_entries (bus_id, date);

-- ── DONE ─────────────────────────────────────────────────────────────────
-- finance_entries.sql complete. Every entry is tied to a Bus only — no
-- routes, no passenger counts. Deleting a bus in admin.html does NOT
-- delete its finance history; finance.html shows it as "Archived".
-- ═════════════════════════════════════════════════════════════════════════
