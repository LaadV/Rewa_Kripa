-- ═══════════════════════════════════════════════════════════════════════
-- Rewa Kripa Travels — Server-Side Password Verification
--
-- WHY THIS EXISTS: the admin and finance passwords used to be plain text
-- strings inside supabase.js / config.js — any visitor could open browser
-- dev tools or view-source and read them directly. This migration moves
-- password checking into Postgres: the password hash lives in a table
-- the browser can never read (RLS denies it entirely), and a function
-- checks it internally, returning only true/false to the app. The real
-- password is never sent to, or stored in, any file the browser loads.
--
-- Run this in: Supabase → SQL Editor → New Query → Run
-- Safe to re-run — it will NOT reset your password back to the default
-- if you've already changed it (uses ON CONFLICT DO NOTHING on seed).
--
-- NOTE: each statement is on a single line on purpose — some copy/paste
-- paths insert a stray ";" at every line break, which breaks multi-line
-- statements. Paste this directly into the Supabase SQL Editor.
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

create table if not exists app_secrets (key text primary key, value text not null, updated_at timestamptz default now());

alter table app_secrets enable row level security;

revoke all on app_secrets from anon, authenticated;

insert into app_secrets (key, value) values ('admin_password_hash', crypt('Swift@8606', gen_salt('bf'))) on conflict (key) do nothing;

insert into app_secrets (key, value) values ('finance_password_hash', crypt('Swift@8606', gen_salt('bf'))) on conflict (key) do nothing;

create or replace function verify_admin_password(input_password text) returns boolean language plpgsql security definer set search_path = public as $$ declare stored text; begin select value into stored from app_secrets where key = 'admin_password_hash'; if stored is null then return false; end if; return stored = crypt(input_password, stored); end; $$;

create or replace function verify_finance_password(input_password text) returns boolean language plpgsql security definer set search_path = public as $$ declare stored text; begin select value into stored from app_secrets where key = 'finance_password_hash'; if stored is null then return false; end if; return stored = crypt(input_password, stored); end; $$;

create or replace function set_admin_password(current_password text, new_password text) returns boolean language plpgsql security definer set search_path = public as $$ declare stored text; begin select value into stored from app_secrets where key = 'admin_password_hash'; if stored is null or stored != crypt(current_password, stored) then return false; end if; update app_secrets set value = crypt(new_password, gen_salt('bf')), updated_at = now() where key = 'admin_password_hash'; return true; end; $$;

create or replace function set_finance_password(current_password text, new_password text) returns boolean language plpgsql security definer set search_path = public as $$ declare stored text; begin select value into stored from app_secrets where key = 'finance_password_hash'; if stored is null or stored != crypt(current_password, stored) then return false; end if; update app_secrets set value = crypt(new_password, gen_salt('bf')), updated_at = now() where key = 'finance_password_hash'; return true; end; $$;

grant execute on function verify_admin_password(text) to anon, authenticated;

grant execute on function verify_finance_password(text) to anon, authenticated;

grant execute on function set_admin_password(text, text) to anon, authenticated;

grant execute on function set_finance_password(text, text) to anon, authenticated;

-- ── DONE ─────────────────────────────────────────────────────────────────
-- Default password remains Swift@8606 for both admin and finance until you
-- change it from within admin.html (Settings) or finance.html (top bar).
-- The browser never sees the stored hash or plaintext — only true/false.
-- ═════════════════════════════════════════════════════════════════════════
