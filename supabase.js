/**
 * supabase.js — Rewa Kripa Travels
 * Universal data layer: Supabase (real-time, shared) or localStorage (offline fallback)
 * 
 * TO ENABLE SUPABASE (optional but recommended for multi-device sync):
 * 1. Go to https://supabase.com → Create free project
 * 2. SQL Editor → Run the SQL from README_SUPABASE.sql
 * 3. Settings → API → copy URL and anon key
 * 4. Replace the values below
 */

// ═══════════════════════════════════════════════
// CONFIGURATION — Edit these 2 lines to enable Supabase
// ═══════════════════════════════════════════════
const SUPABASE_URL  = 'YOUR_SUPABASE_URL';   // e.g. https://xxxx.supabase.co
const SUPABASE_ANON = 'YOUR_SUPABASE_ANON';  // eyJhbGci...

// ═══════════════════════════════════════════════
// AUTH — Change this password!
// ═══════════════════════════════════════════════
const ADMIN_PASSWORD = 'Swift@8606';

// ═══════════════════════════════════════════════
// INTERNAL — Do not edit below
// ═══════════════════════════════════════════════
const SUPABASE_CONFIGURED = (SUPABASE_URL !== 'https://wqxirssvjmilpkyszvml.supabase.co' && SUPABASE_ANON !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxeGlyc3N2am1pbHBreXN6dm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNjA3ODEsImV4cCI6MjA5MTYzNjc4MX0.XhC_DU2Z3H0n5zbcxiAjAgzhxczaNrnxXXfpPck-x-E');

let _sb = null;
let _sbReady = false;
let _sbQueue = [];

function _bootSDK() {
  if (!SUPABASE_CONFIGURED) {
    console.info('ℹ️ Supabase not configured — using localStorage. All data is device-local.');
    _sbReady = true;
    _sbQueue.forEach(fn => fn(null));
    _sbQueue = [];
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  script.onload = () => {
    try {
      _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
      _sbReady = true;
      console.log('✅ Supabase connected');
    } catch(e) {
      console.warn('Supabase init failed, using localStorage:', e.message);
      _sb = null; _sbReady = true;
    }
    _sbQueue.forEach(fn => fn(_sb));
    _sbQueue = [];
  };
  script.onerror = () => {
    console.warn('Supabase SDK load failed, using localStorage');
    _sbReady = true; _sb = null;
    _sbQueue.forEach(fn => fn(null));
    _sbQueue = [];
  };
  document.head.appendChild(script);
}

function _getSB() {
  return new Promise(resolve => {
    if (_sbReady) { resolve(_sb); return; }
    _sbQueue.push(resolve);
  });
}

_bootSDK();

/* ═══════════════════════════════════════════════
   SEATS
═══════════════════════════════════════════════ */

async function getBookedSeats(busId, date) {
  const sb = await _getSB();
  if (!sb) return _lsGetSeats(busId, date);
  try {
    const { data, error } = await sb.from('seats')
      .select('*').eq('bus_id', busId).eq('travel_date', date);
    if (error) throw error;
    return data || [];
  } catch(e) {
    console.warn('getBookedSeats fallback:', e.message);
    return _lsGetSeats(busId, date);
  }
}

async function bookSeats(busId, date, seats) {
  const sb = await _getSB();
  // Always save to localStorage as cache
  _lsSetSeats(busId, date, seats);
  if (!sb) return true;
  try {
    const rows = seats.map(s => ({
      bus_id: busId, travel_date: date,
      seat_num: s.num, gender: s.gender || 'M',
      passenger_name: s.passenger_name || s.paxName || '',
      passenger_phone: s.passenger_phone || s.paxPhone || '',
      status: 'booked', booked_at: new Date().toISOString()
    }));
    const { error } = await sb.from('seats')
      .upsert(rows, { onConflict: 'bus_id,travel_date,seat_num' });
    if (error) throw error;
    return true;
  } catch(e) {
    console.warn('bookSeats fallback:', e.message);
    return false;
  }
}

async function unblockSeat(busId, date, seatNum) {
  _lsRemoveSeat(busId, date, seatNum);
  const sb = await _getSB();
  if (!sb) return;
  try {
    const { error } = await sb.from('seats').delete()
      .eq('bus_id', busId).eq('travel_date', date).eq('seat_num', seatNum);
    if (error) throw error;
  } catch(e) { console.warn('unblockSeat:', e.message); }
}

async function unblockAllSeats(busId, date) {
  _lsClearSeats(busId, date);
  const sb = await _getSB();
  if (!sb) return;
  try {
    const { error } = await sb.from('seats').delete()
      .eq('bus_id', busId).eq('travel_date', date);
    if (error) throw error;
  } catch(e) { console.warn('unblockAllSeats:', e.message); }
}

async function unblockAllBusSeats(busId) {
  // Clear all localStorage for this bus
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith(`rk_seats_${busId}_`)) localStorage.removeItem(k);
  });
  const sb = await _getSB();
  if (!sb) return;
  try {
    const { error } = await sb.from('seats').delete().eq('bus_id', busId);
    if (error) throw error;
  } catch(e) { console.warn('unblockAllBusSeats:', e.message); }
}

/* ═══════════════════════════════════════════════
   REALTIME
═══════════════════════════════════════════════ */
const _channels = {};

async function subscribeSeats(busId, date, callback) {
  const sb = await _getSB();
  if (!sb) return () => {};
  const key = `${busId}_${date}`;
  // Clean up old subscription
  if (_channels[key]) {
    try { await sb.removeChannel(_channels[key]); } catch(e) {}
    delete _channels[key];
  }
  if (_channels[`${key}_poll`]) {
    clearInterval(_channels[`${key}_poll`]);
    delete _channels[`${key}_poll`];
  }
  try {
    const ch = sb.channel(`rk-seats-${key}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'seats',
        filter: `bus_id=eq.${busId}`
      }, () => callback())
      .subscribe(status => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          if (!_channels[`${key}_poll`]) {
            _channels[`${key}_poll`] = setInterval(() => callback(), 8000);
          }
        }
      });
    _channels[key] = ch;
    return () => {
      try { sb.removeChannel(ch); } catch(e) {}
      delete _channels[key];
      if (_channels[`${key}_poll`]) { clearInterval(_channels[`${key}_poll`]); delete _channels[`${key}_poll`]; }
    };
  } catch(e) {
    console.warn('subscribeSeats:', e.message);
    return () => {};
  }
}

/* ═══════════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════════ */
async function getConfig() {
  const sb = await _getSB();
  const local = (() => { try { return JSON.parse(localStorage.getItem('rk_admin_config') || 'null'); } catch(e) { return null; } })();
  if (!sb) return local;
  try {
    const { data, error } = await sb.from('site_config').select('*').eq('id', 1).single();
    if (error) throw error;
    return data ? data.config_json : local;
  } catch(e) {
    return local;
  }
}

async function saveConfig(configJson) {
  localStorage.setItem('rk_admin_config', JSON.stringify(configJson));
  const sb = await _getSB();
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

/* ═══════════════════════════════════════════════
   AUTH
═══════════════════════════════════════════════ */
function adminLogin(pw) {
  if (pw === ADMIN_PASSWORD) { sessionStorage.setItem('rk_admin', '1'); return true; }
  return false;
}
function isAdminLoggedIn() { return sessionStorage.getItem('rk_admin') === '1'; }
function adminLogout() { sessionStorage.removeItem('rk_admin'); }

/* ═══════════════════════════════════════════════
   AUTO-RESET
═══════════════════════════════════════════════ */
function checkAutoReset(bus, date) {
  const raw = (bus.departure || '').trim();
  const m = raw.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!m) return 'ok';
  let h = +m[1], min = +m[2];
  if (m[3]) {
    const ampm = m[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
  }
  const dep = new Date(date + 'T00:00:00'); dep.setHours(h, min, 0, 0);
  const resetAt = new Date(dep.getTime() + 7200000);
  const now = new Date();
  if (now >= resetAt) { unblockAllSeats(bus.id, date); return 'reset'; }
  if (now >= dep) return 'departed';
  return 'ok';
}

/* ═══════════════════════════════════════════════
   localStorage HELPERS
═══════════════════════════════════════════════ */
function _lsKey(busId, date) { return `rk_seats_${busId}_${date}`; }
function _lsGetSeats(busId, date) {
  try { return JSON.parse(localStorage.getItem(_lsKey(busId, date)) || '[]'); } catch(e) { return []; }
}
function _lsSetSeats(busId, date, newSeats) {
  const existing = _lsGetSeats(busId, date);
  newSeats.forEach(s => {
    const num = s.num || s.seat_num;
    const idx = existing.findIndex(e => e.seat_num === num);
    const row = {
      seat_num: num, gender: s.gender || 'M',
      passenger_name: s.passenger_name || s.paxName || '',
      passenger_phone: s.passenger_phone || s.paxPhone || '',
      status: 'booked'
    };
    if (idx >= 0) existing[idx] = row; else existing.push(row);
  });
  localStorage.setItem(_lsKey(busId, date), JSON.stringify(existing));
}
function _lsRemoveSeat(busId, date, seatNum) {
  localStorage.setItem(_lsKey(busId, date),
    JSON.stringify(_lsGetSeats(busId, date).filter(s => s.seat_num !== seatNum)));
}
function _lsClearSeats(busId, date) { localStorage.removeItem(_lsKey(busId, date)); }

/* ═══════════════════════════════════════════════
   GLOBAL EXPORT (window.RK)
═══════════════════════════════════════════════ */
window.RK = {
  getBookedSeats, bookSeats, unblockSeat,
  unblockAllSeats, unblockAllBusSeats,
  subscribeSeats, getConfig, saveConfig,
  adminLogin, isAdminLoggedIn, adminLogout,
  checkAutoReset,
  SUPABASE_CONFIGURED,
  ADMIN_PASSWORD,
  isSupabaseActive: () => !!_sb && _sbReady
};
