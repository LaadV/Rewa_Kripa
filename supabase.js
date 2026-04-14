/**
 * supabase.js — Shared Supabase client for all pages
 * 
 * SETUP (one-time, 5 minutes, free):
 * 1. Go to https://supabase.com → New Project
 * 2. Copy your project URL and anon key below
 * 3. Run the SQL in README_SUPABASE.sql in your Supabase SQL editor
 * 
 * Until configured, the site works fine — admin portal uses
 * localStorage as fallback and shows a setup banner.
 */

const SUPABASE_URL  = 'YOUR_SUPABASE_URL';   // e.g. https://abcxyz.supabase.co
const SUPABASE_ANON = 'YOUR_SUPABASE_ANON_KEY';

// Admin credentials (change these!)
const ADMIN_EMAIL    = 'admin@rewakripa.com';
const ADMIN_PASSWORD = 'Swift@8606';

// Detect if Supabase is configured
const SUPABASE_CONFIGURED = !SUPABASE_URL.includes('YOUR_');

let _supabase = null;

async function getSupabase() {
  if (_supabase) return _supabase;
  if (!SUPABASE_CONFIGURED) return null;
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  _supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
  return _supabase;
}

// ── Seat operations ──────────────────────────────────────────

async function getBookedSeats(busId, date) {
  if (!SUPABASE_CONFIGURED) return getLocalSeats(busId, date);
  try {
    const sb = await getSupabase();
    const { data } = await sb.from('seats')
      .select('*').eq('bus_id', busId).eq('travel_date', date);
    return data || [];
  } catch(e) { return getLocalSeats(busId, date); }
}

async function bookSeats(busId, date, seats) {
  // seats = [{num, gender, passenger_name, passenger_phone}]
  if (!SUPABASE_CONFIGURED) { setLocalSeats(busId, date, seats); return true; }
  try {
    const sb = await getSupabase();
    const rows = seats.map(s => ({
      bus_id: busId, travel_date: date,
      seat_num: s.num, gender: s.gender,
      passenger_name: s.passenger_name,
      passenger_phone: s.passenger_phone,
      booked_at: new Date().toISOString(), status: 'booked'
    }));
    await sb.from('seats').upsert(rows, { onConflict: 'bus_id,travel_date,seat_num' });
    return true;
  } catch(e) { setLocalSeats(busId, date, seats); return false; }
}

async function unblockSeat(busId, date, seatNum) {
  if (!SUPABASE_CONFIGURED) { removeLocalSeat(busId, date, seatNum); return; }
  const sb = await getSupabase();
  await sb.from('seats').delete()
    .eq('bus_id', busId).eq('travel_date', date).eq('seat_num', seatNum);
}

async function unblockAllSeats(busId, date) {
  if (!SUPABASE_CONFIGURED) { clearLocalSeats(busId, date); return; }
  const sb = await getSupabase();
  await sb.from('seats').delete().eq('bus_id', busId).eq('travel_date', date);
}

async function unblockAllBusSeats(busId) {
  if (!SUPABASE_CONFIGURED) return;
  const sb = await getSupabase();
  await sb.from('seats').delete().eq('bus_id', busId);
}

// Subscribe to real-time seat changes
async function subscribeSeats(busId, date, callback) {
  if (!SUPABASE_CONFIGURED) return () => {};
  const sb = await getSupabase();
  const channel = sb.channel(`seats-${busId}-${date}`)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'seats',
      filter: `bus_id=eq.${busId}`
    }, () => callback())
    .subscribe();
  return () => sb.removeChannel(channel);
}

// ── Config operations (admin-driven dynamic config) ──────────

async function getConfig() {
  if (!SUPABASE_CONFIGURED) return null;
  try {
    const sb = await getSupabase();
    const { data } = await sb.from('site_config').select('*').single();
    return data ? data.config_json : null;
  } catch(e) { return null; }
}

async function saveConfig(configJson) {
  if (!SUPABASE_CONFIGURED) {
    localStorage.setItem('rk_admin_config', JSON.stringify(configJson));
    return true;
  }
  try {
    const sb = await getSupabase();
    await sb.from('site_config').upsert({ id: 1, config_json: configJson, updated_at: new Date().toISOString() });
    return true;
  } catch(e) {
    localStorage.setItem('rk_admin_config', JSON.stringify(configJson));
    return false;
  }
}

// ── Auth ─────────────────────────────────────────────────────

function adminLogin(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('rk_admin', '1');
    return true;
  }
  return false;
}

function isAdminLoggedIn() {
  return sessionStorage.getItem('rk_admin') === '1';
}

function adminLogout() {
  sessionStorage.removeItem('rk_admin');
}

// ── localStorage fallback ────────────────────────────────────

function lsKey(busId, date) { return `rk_seats_${busId}_${date}`; }

function getLocalSeats(busId, date) {
  try { return JSON.parse(localStorage.getItem(lsKey(busId, date)) || '[]'); }
  catch(e) { return []; }
}

function setLocalSeats(busId, date, newSeats) {
  const existing = getLocalSeats(busId, date);
  newSeats.forEach(s => {
    const idx = existing.findIndex(e => e.seat_num === s.num);
    const row = { seat_num: s.num, gender: s.gender, passenger_name: s.passenger_name, passenger_phone: s.passenger_phone, status: 'booked' };
    if (idx >= 0) existing[idx] = row; else existing.push(row);
  });
  localStorage.setItem(lsKey(busId, date), JSON.stringify(existing));
}

function removeLocalSeat(busId, date, seatNum) {
  const seats = getLocalSeats(busId, date).filter(s => s.seat_num !== seatNum);
  localStorage.setItem(lsKey(busId, date), JSON.stringify(seats));
}

function clearLocalSeats(busId, date) {
  localStorage.removeItem(lsKey(busId, date));
}

// ── Auto-reset check (2hrs post departure) ───────────────────

function checkAutoReset(bus, date) {
  const raw = (bus.departure || '').trim();
  const m12 = raw.match(/(\d+):(\d+)\s*(AM|PM)/i);
  const m24 = raw.match(/^(\d+):(\d+)$/);
  let h = 0, m = 0;
  if (m12) {
    h = +m12[1]; m = +m12[2];
    if (m12[3].toUpperCase() === 'PM' && h !== 12) h += 12;
    if (m12[3].toUpperCase() === 'AM' && h === 12) h = 0;
  } else if (m24) { h = +m24[1]; m = +m24[2]; }
  else return 'ok';

  const dep = new Date(date + 'T00:00:00'); dep.setHours(h, m, 0, 0);
  const resetAt = new Date(dep.getTime() + 7200000);
  const now = new Date();

  if (now >= resetAt) {
    unblockAllSeats(bus.id, date);
    return 'reset';
  }
  if (now >= dep) return 'departed';
  return 'ok';
}

// Expose globally
window.RK = { getBookedSeats, bookSeats, unblockSeat, unblockAllSeats, unblockAllBusSeats,
               subscribeSeats, getConfig, saveConfig, adminLogin, isAdminLoggedIn, adminLogout,
               checkAutoReset, SUPABASE_CONFIGURED, ADMIN_PASSWORD };
