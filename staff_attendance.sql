-- ═══════════════════════════════════════════════════════════════════════
-- Rewa Kripa Travels — Staff & Attendance Tables
-- Run this in: Supabase → SQL Editor → New Query → Run
--
-- NOTE: each statement below is kept on a SINGLE line on purpose.
-- Some copy/paste paths (notes apps, mobile keyboards, auto-format
-- tools) insert a stray ";" at every line break, which breaks
-- multi-line statements. Paste this directly into the Supabase SQL
-- Editor without passing it through any other app first.
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists staff (id bigint generated always as identity primary key, name text not null, role text not null check (role in ('driver','conductor','helper','office')), phone text not null unique, whatsapp text default '', photo_url text default '', bus_id text default '', bus_plate text default '', salary int default 0, join_date text default '', address text default '', id_proof text default '', active boolean default true, created_at timestamptz default now(), updated_at timestamptz default now());

delete from staff s using staff s2 where s.phone = s2.phone and s.id > s2.id;

do $$ begin begin alter table staff add constraint staff_phone_key unique (phone); exception when duplicate_object then null; end; end $$;

insert into staff (name, role, phone, whatsapp, bus_id, bus_plate, salary, join_date) values ('Raju Sharma','driver','+91 98765 43210','919876543210','bus1','MP09CY8606',22000,'2020-01-15'), ('Suresh Patel','driver','+91 98765 43211','919876543211','bus2','MP09CY7782',22000,'2021-03-10'), ('Mohan Verma','conductor','+91 98765 43212','919876543212','bus1','MP09CY8606',14000,'2020-01-15'), ('Dinesh Kumar','conductor','+91 98765 43213','919876543213','bus2','MP09CY7782',14000,'2021-03-10'), ('Ramesh Helper','helper','+91 98765 43214','919876543214','bus3','MP09CY9911',10000,'2022-06-01'), ('Anita Devi','office','+91 98765 43215','919876543215','','',15000,'2019-08-20') on conflict (phone) do nothing;

create table if not exists attendance (id bigint generated always as identity primary key, staff_id bigint references staff(id) on delete cascade, staff_name text not null, role text not null, bus_id text default '', bus_plate text default '', date date not null default current_date, status text not null default 'absent' check (status in ('present','absent','halfday','leave','late')), check_in text default '', note text default '', marked_by text default 'admin', wa_confirmed boolean default false, created_at timestamptz default now(), updated_at timestamptz default now(), unique(staff_id, date));

alter table staff enable row level security;

alter table attendance enable row level security;

drop policy if exists "staff_read" on staff;

drop policy if exists "staff_write" on staff;

drop policy if exists "att_read" on attendance;

drop policy if exists "att_write" on attendance;

create policy "staff_read" on staff for select using (true);

create policy "staff_write" on staff for all using (true) with check (true);

create policy "att_read" on attendance for select using (true);

create policy "att_write" on attendance for all using (true) with check (true);

do $$ begin begin alter publication supabase_realtime add table attendance; exception when duplicate_object then null; end; end $$;

do $$ begin begin alter publication supabase_realtime add table staff; exception when duplicate_object then null; end; end $$;

-- ── DONE ─────────────────────────────────────────────────────────────────
-- staff_attendance.sql complete
-- ═════════════════════════════════════════════════════════════════════════
