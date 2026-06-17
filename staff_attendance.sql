-- ═══════════════════════════════════════════════════════════════════════
-- Rewa Kripa Travels — Staff & Attendance Tables
-- Run this in: Supabase → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════════

-- ── 1. STAFF DIRECTORY ──────────────────────────────────────────────────
create table if not exists staff (
  id           bigint generated always as identity primary key,
  name         text not null,
  role         text not null check (role in ('driver','conductor','helper','office')),
  phone        text not null,
  whatsapp     text default '',
  photo_url    text default '',
  bus_id       text default '',          -- assigned bus (nullable)
  bus_plate    text default '',          -- denormalised for display
  salary       int  default 0,
  join_date    text default '',
  address      text default '',
  id_proof     text default '',          -- Aadhaar / DL number
  active       boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Sample staff
insert into staff (name, role, phone, whatsapp, bus_id, bus_plate, salary, join_date) values
('Raju Sharma',    'driver',    '+91 98765 43210', '919876543210', 'bus1', 'MP09CY8606', 22000, '2020-01-15'),
('Suresh Patel',   'driver',    '+91 98765 43211', '919876543211', 'bus2', 'MP09CY7782', 22000, '2021-03-10'),
('Mohan Verma',    'conductor', '+91 98765 43212', '919876543212', 'bus1', 'MP09CY8606', 14000, '2020-01-15'),
('Dinesh Kumar',   'conductor', '+91 98765 43213', '919876543213', 'bus2', 'MP09CY7782', 14000, '2021-03-10'),
('Ramesh Helper',  'helper',    '+91 98765 43214', '919876543214', 'bus3', 'MP09CY9911', 10000, '2022-06-01'),
('Anita Devi',     'office',    '+91 98765 43215', '919876543215', '',    '',            15000, '2019-08-20')
on conflict do nothing;

-- ── 2. ATTENDANCE ────────────────────────────────────────────────────────
create table if not exists attendance (
  id           bigint generated always as identity primary key,
  staff_id     bigint references staff(id) on delete cascade,
  staff_name   text not null,            -- denormalised for quick display
  role         text not null,
  bus_id       text default '',
  bus_plate    text default '',
  date         date not null default current_date,
  status       text not null default 'absent'
                 check (status in ('present','absent','halfday','leave','late')),
  check_in     text default '',          -- e.g. "08:45 AM"
  note         text default '',
  marked_by    text default 'admin',     -- 'admin' | 'whatsapp' | 'self'
  wa_confirmed boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique(staff_id, date)
);

-- ── 3. RLS POLICIES ─────────────────────────────────────────────────────
alter table staff     enable row level security;
alter table attendance enable row level security;

create policy if not exists "staff_read"   on staff     for select using (true);
create policy if not exists "staff_write"  on staff     for all    using (true) with check (true);
create policy if not exists "att_read"     on attendance for select using (true);
create policy if not exists "att_write"    on attendance for all    using (true) with check (true);

-- Real-time for attendance (so admin dashboard updates live)
alter publication supabase_realtime add table attendance;
alter publication supabase_realtime add table staff;

-- ── DONE ─────────────────────────────────────────────────────────────────
-- staff_attendance.sql complete
-- ═════════════════════════════════════════════════════════════════════════
