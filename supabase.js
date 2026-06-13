/**
 * supabase.js — Shared Supabase client for all pages
 *
 * FIX: Replaced broken dynamic import() with a <script> tag that loads
 * the Supabase UMD bundle. The old import() silently failed in most
 * browser environments, so all seat operations fell back to localStorage.
 * This version connects to Supabase correctly in every browser.
 */

const SUPABASE_URL  = 'https://wqxirssvjmilpkyszvml.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxeGlyc3N2am1pbHBreXN6dm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNjA3ODEsImV4cCI6MjA5MTYzNjc4MX0.XhC_DU2Z3H0n5zbcxiAjAgzhxczaNrnxXXfpPck-x-E';

const ADMIN_EMAIL    = 'admin@rewakripa.com';
const ADMIN_PASSWORD = 'Swift@8606';

const SUPABASE_CONFIGURED = true;  // credentials are real

/* ── SDK BOOTSTRAP ──────────────────────────────────────────
   Injects the UMD build via <script> tag so it works in every
   browser without needing ES module support or dynamic import().
─────────────────────────────────────────────────────────── */
let _supabase = null;
let _sdkReady = false;
let _sdkQueue = [];  // functions waiting for the client

function _initClient() {
  try {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    _sdkReady = true;
    console.log('✅ Supabase connected');
    _sdkQueue.forEach(fn => fn(_supabase));
    _sdkQueue = [];
  } catch(e) {
    console.error('❌ Supabase init error:', e);
    _sdkQueue.forEach(fn => fn(null));
    _sdkQueue = [];
  }
}

(function() {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  s.onload  = _initClient;
  s.onerror = function() {
    console.warn('⚠️ Supabase SDK load failed — using localStorage fallback');
    _sdkQueue.forEach(fn => fn(null));
    _sdkQueue = [];
  };
  document.head.appendChild(s);
})();

function getSB() {
  return new Promise(resolve => {
    if (_sdkReady) { resolve(_supabase); return; }
    _sdkQueue.push(resolve);
  });
}

/* ── SEAT OPERATIONS ──────────────────────────────────────── */

async function getBookedSeats(busId, date) {
  const sb = await getSB();
  if (!sb) return getLocalSeats(busId, date);
  try {
    const { data, error } = await sb.from('seats')
      .select('*').eq('bus_id', busId).eq('travel_date', date);
    if (error) throw error;
    return data || [];
  } catch(e) {
    console.warn('getBookedSeats:', e.message);
    return getLocalSeats(busId, date);
  }
}

async function bookSeats(busId, date, seats) {
  const sb = await getSB();
  if (!sb) { setLocalSeats(busId, date, seats); return true; }
  try {
    const rows = seats.map(s => ({
      bus_id: busId, travel_date: date,
      seat_num: s.num, gender: s.gender,
      passenger_name:  s.passenger_name  || '',
      passenger_phone: s.passenger_phone || '',
      booked_at: new Date().toISOString(), status: 'booked'
    }));
    const { error } = await sb.from('seats')
      .upsert(rows, { onConflict: 'bus_id,travel_date,seat_num' });
    if (error) throw error;
    setLocalSeats(busId, date, seats);
    return true;
  } catch(e) {
    console.warn('bookSeats:', e.message);
    setLocalSeats(busId, date, seats);
    return false;
  }
}

async function unblockSeat(busId, date, seatNum) {
  const sb = await getSB();
  if (!sb) { removeLocalSeat(busId, date, seatNum); return; }
  try {
    const { error } = await sb.from('seats').delete()
      .eq('bus_id', busId).eq('travel_date', date).eq('seat_num', seatNum);
    if (error) throw error;
    removeLocalSeat(busId, date, seatNum);
  } catch(e) {
    console.warn('unblockSeat:', e.message);
    removeLocalSeat(busId, date, seatNum);
  }
}

async function unblockAllSeats(busId, date) {
  const sb = await getSB();
  if (!sb) { clearLocalSeats(busId, date); return; }
  try {
    const { error } = await sb.from('seats').delete()
      .eq('bus_id', busId).eq('travel_date', date);
    if (error) throw error;
    clearLocalSeats(busId, date);
  } catch(e) {
    console.warn('unblockAllSeats:', e.message);
    clearLocalSeats(busId, date);
  }
}

async function unblockAllBusSeats(busId) {
  const sb = await getSB();
  if (!sb) return;
  try {
    const { error } = await sb.from('seats').delete().eq('bus_id', busId);
    if (error) throw error;
  } catch(e) {
    console.warn('unblockAllBusSeats:', e.message);
  }
}

/* ── REAL-TIME SUBSCRIPTION ───────────────────────────────── */
const _channels = {};

async function subscribeSeats(busId, date, callback) {
  const sb = await getSB();
  if (!sb) return () => {};

  const key = `${busId}_${date}`;

  if (_channels[key])           { try { await sb.removeChannel(_channels[key]); } catch(e){} delete _channels[key]; }
  if (_channels[key + '_poll']) { clearInterval(_channels[key + '_poll']); delete _channels[key + '_poll']; }

  try {
    const channel = sb.channel(`seats-${key}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'seats',
        filter: `bus_id=eq.${busId}`
      }, () => callback())
      .subscribe(status => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          if (!_channels[key + '_poll']) {
            _channels[key + '_poll'] = setInterval(() => callback(), 10000);
          }
        }
      });

    _channels[key] = channel;

    return () => {
      try { sb.removeChannel(channel); } catch(e) {}
      delete _channels[key];
      if (_channels[key + '_poll']) { clearInterval(_channels[key + '_poll']); delete _channels[key + '_poll']; }
    };
  } catch(e) {
    console.warn('subscribeSeats:', e.message);
    return () => {};
  }
}

/* ── CONFIG OPERATIONS ────────────────────────────────────── */

async function getConfig() {
  const sb = await getSB();
  if (!sb) {
    try { return JSON.parse(localStorage.getItem('rk_admin_config') || 'null'); } catch(e) { return null; }
  }
  try {
    const { data, error } = await sb.from('site_config').select('*').eq('id', 1).single();
    if (error) throw error;
    return data ? data.config_json : null;
  } catch(e) {
    console.warn('getConfig:', e.message);
    try { return JSON.parse(localStorage.getItem('rk_admin_config') || 'null'); } catch(e2) { return null; }
  }
}

async function saveConfig(configJson) {
  localStorage.setItem('rk_admin_config', JSON.stringify(configJson));
  const sb = await getSB();
  if (!sb) return true;
  try {
    const { error } = await sb.from('site_config')
      .upsert({ id: 1, config_json: configJson, updated_at: new Date().toISOString() });
    if (error) throw error;
    return true;
  } catch(e) {
    console.warn('saveConfig:', e.message);
    return false;
  }
}

/* ── AUTH ─────────────────────────────────────────────────── */

function adminLogin(password) {
  if (password === ADMIN_PASSWORD) { sessionStorage.setItem('rk_admin', '1'); return true; }
  return false;
}
function isAdminLoggedIn() { return sessionStorage.getItem('rk_admin') === '1'; }
function adminLogout()     { sessionStorage.removeItem('rk_admin'); }

/* ── localStorage FALLBACK ────────────────────────────────── */

function lsKey(busId, date) { return `rk_seats_${busId}_${date}`; }

function getLocalSeats(busId, date) {
  try { return JSON.parse(localStorage.getItem(lsKey(busId, date)) || '[]'); } catch(e) { return []; }
}

function setLocalSeats(busId, date, newSeats) {
  const existing = getLocalSeats(busId, date);
  newSeats.forEach(s => {
    const idx = existing.findIndex(e => e.seat_num === s.num);
    const row = { seat_num: s.num, gender: s.gender,
      passenger_name: s.passenger_name || '', passenger_phone: s.passenger_phone || '', status: 'booked' };
    if (idx >= 0) existing[idx] = row; else existing.push(row);
  });
  localStorage.setItem(lsKey(busId, date), JSON.stringify(existing));
}

function removeLocalSeat(busId, date, seatNum) {
  localStorage.setItem(lsKey(busId, date),
    JSON.stringify(getLocalSeats(busId, date).filter(s => s.seat_num !== seatNum)));
}

function clearLocalSeats(busId, date) { localStorage.removeItem(lsKey(busId, date)); }

/* ── AUTO-RESET (2hrs after bus departure) ────────────────── */

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
  if (now >= resetAt) { unblockAllSeats(bus.id, date); return 'reset'; }
  if (now >= dep) return 'departed';
  return 'ok';
}

/* ── GLOBAL EXPORTS (same interface — no other files need to change) ── */
window.RK = {
  getBookedSeats, bookSeats, unblockSeat, unblockAllSeats, unblockAllBusSeats,
  subscribeSeats, getConfig, saveConfig,
  adminLogin, isAdminLoggedIn, adminLogout,
  checkAutoReset, SUPABASE_CONFIGURED, ADMIN_PASSWORD
};
