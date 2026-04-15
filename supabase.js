/**
 * supabase.js — Shared Supabase client for all pages
 *
 * SETUP (one-time, 5 minutes, free):
 * 1. Go to https://supabase.com → New Project
 * 2. Your credentials are already filled in below.
 * 3. Run the SQL in README_SUPABASE.sql in your Supabase SQL editor.
 *
 * HOW IT WORKS:
 * - Loads the Supabase SDK via a <script> tag injected into <head>
 * - All seat/config calls wait for the SDK to be ready before running
 * - Falls back to localStorage automatically if Supabase is unreachable
 */

const SUPABASE_URL  = 'https://wqxirssvjmilpkyszvml.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxeGlyc3N2am1pbHBreXN6dm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNjA3ODEsImV4cCI6MjA5MTYzNjc4MX0.XhC_DU2Z3H0n5zbcxiAjAgzhxczaNrnxXXfpPck-x-E';

// Admin credentials
const ADMIN_PASSWORD = 'Swift@8606';

// Is Supabase configured?
const SUPABASE_CONFIGURED = SUPABASE_URL.length > 0 && !SUPABASE_URL.includes('YOUR_');

/* ─────────────────────────────────────────────────────────────
   SDK BOOTSTRAP
   Inject the Supabase UMD bundle via <script> tag so it works
   in any browser without needing ES-module dynamic import().
───────────────────────────────────────────────────────────── */
let _supabase   = null;
let _sdkReady   = false;
let _sdkPending = [];   // queued callbacks waiting for SDK

function _onSdkReady() {
  try {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
      realtime: { params: { eventsPerSecond: 10 } }
    });
    _sdkReady = true;
    _sdkPending.forEach(function(fn){ fn(_supabase); });
    _sdkPending = [];
  } catch(e) {
    console.warn('Supabase init failed:', e);
    _sdkReady = false;
    _sdkPending.forEach(function(fn){ fn(null); });
    _sdkPending = [];
  }
}

function getSB() {
  // Returns a Promise that resolves to the Supabase client (or null)
  return new Promise(function(resolve) {
    if (!SUPABASE_CONFIGURED) { resolve(null); return; }
    if (_sdkReady)            { resolve(_supabase); return; }
    _sdkPending.push(resolve);
  });
}

if (SUPABASE_CONFIGURED) {
  var _script = document.createElement('script');
  _script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  _script.onload  = _onSdkReady;
  _script.onerror = function() {
    console.warn('Failed to load Supabase SDK — using localStorage fallback.');
    _sdkPending.forEach(function(fn){ fn(null); });
    _sdkPending = [];
  };
  document.head.appendChild(_script);
}

/* ─────────────────────────────────────────────────────────────
   SEAT OPERATIONS
───────────────────────────────────────────────────────────── */

async function getBookedSeats(busId, date) {
  var sb = await getSB();
  if (!sb) return getLocalSeats(busId, date);
  try {
    var res = await sb.from('seats')
      .select('*')
      .eq('bus_id', busId)
      .eq('travel_date', date);
    if (res.error) throw res.error;
    return res.data || [];
  } catch(e) {
    console.warn('getBookedSeats error:', e.message);
    return getLocalSeats(busId, date);
  }
}

async function bookSeats(busId, date, seats) {
  // seats = [{num, gender, passenger_name, passenger_phone}]
  var sb = await getSB();
  if (!sb) { setLocalSeats(busId, date, seats); return true; }
  try {
    var rows = seats.map(function(s) {
      return {
        bus_id:           busId,
        travel_date:      date,
        seat_num:         s.num,
        gender:           s.gender,
        passenger_name:   s.passenger_name  || '',
        passenger_phone:  s.passenger_phone || '',
        status:           'booked',
        booked_at:        new Date().toISOString()
      };
    });
    var res = await sb.from('seats').upsert(rows, { onConflict: 'bus_id,travel_date,seat_num' });
    if (res.error) throw res.error;
    // Also mirror to localStorage as offline cache
    setLocalSeats(busId, date, seats);
    return true;
  } catch(e) {
    console.warn('bookSeats error:', e.message);
    setLocalSeats(busId, date, seats);
    return false;
  }
}

async function unblockSeat(busId, date, seatNum) {
  var sb = await getSB();
  if (!sb) { removeLocalSeat(busId, date, seatNum); return; }
  try {
    var res = await sb.from('seats').delete()
      .eq('bus_id', busId)
      .eq('travel_date', date)
      .eq('seat_num', seatNum);
    if (res.error) throw res.error;
    removeLocalSeat(busId, date, seatNum);
  } catch(e) {
    console.warn('unblockSeat error:', e.message);
    removeLocalSeat(busId, date, seatNum);
  }
}

async function unblockAllSeats(busId, date) {
  var sb = await getSB();
  if (!sb) { clearLocalSeats(busId, date); return; }
  try {
    var res = await sb.from('seats').delete()
      .eq('bus_id', busId)
      .eq('travel_date', date);
    if (res.error) throw res.error;
    clearLocalSeats(busId, date);
  } catch(e) {
    console.warn('unblockAllSeats error:', e.message);
    clearLocalSeats(busId, date);
  }
}

async function unblockAllBusSeats(busId) {
  var sb = await getSB();
  if (!sb) return;
  try {
    var res = await sb.from('seats').delete().eq('bus_id', busId);
    if (res.error) throw res.error;
  } catch(e) {
    console.warn('unblockAllBusSeats error:', e.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   REAL-TIME SUBSCRIPTION
───────────────────────────────────────────────────────────── */
var _channels = {};

async function subscribeSeats(busId, date, callback) {
  var sb = await getSB();
  if (!sb) return function(){};

  var key = busId + '_' + date;

  // Remove any existing channel for this bus+date
  if (_channels[key]) {
    try { await sb.removeChannel(_channels[key]); } catch(e){}
    delete _channels[key];
  }

  try {
    var channel = sb.channel('seats-' + key)
      .on('postgres_changes', {
        event:  '*',
        schema: 'public',
        table:  'seats',
        filter: 'bus_id=eq.' + busId
      }, function(payload) {
        callback(payload);
      })
      .subscribe(function(status) {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime subscribed:', key);
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Realtime issue for', key, '— will poll instead');
          // Fallback: poll every 8 seconds
          if (!_channels[key + '_poll']) {
            _channels[key + '_poll'] = setInterval(function(){ callback({}); }, 8000);
          }
        }
      });

    _channels[key] = channel;

    // Return unsubscribe function
    return function() {
      try { sb.removeChannel(channel); } catch(e){}
      delete _channels[key];
      if (_channels[key + '_poll']) {
        clearInterval(_channels[key + '_poll']);
        delete _channels[key + '_poll'];
      }
    };
  } catch(e) {
    console.warn('subscribeSeats error:', e.message);
    return function(){};
  }
}

/* ─────────────────────────────────────────────────────────────
   CONFIG OPERATIONS  (admin-driven dynamic config)
───────────────────────────────────────────────────────────── */

async function getConfig() {
  var sb = await getSB();
  if (!sb) {
    var local = localStorage.getItem('rk_admin_config');
    try { return local ? JSON.parse(local) : null; } catch(e){ return null; }
  }
  try {
    var res = await sb.from('site_config').select('*').eq('id', 1).single();
    if (res.error) throw res.error;
    return res.data ? res.data.config_json : null;
  } catch(e) {
    console.warn('getConfig error:', e.message);
    var local = localStorage.getItem('rk_admin_config');
    try { return local ? JSON.parse(local) : null; } catch(e2){ return null; }
  }
}

async function saveConfig(configJson) {
  // Always save to localStorage as backup
  localStorage.setItem('rk_admin_config', JSON.stringify(configJson));

  var sb = await getSB();
  if (!sb) return true;
  try {
    var res = await sb.from('site_config').upsert({
      id:          1,
      config_json: configJson,
      updated_at:  new Date().toISOString()
    });
    if (res.error) throw res.error;
    return true;
  } catch(e) {
    console.warn('saveConfig error:', e.message);
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   AUTH
───────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────
   localStorage FALLBACK
───────────────────────────────────────────────────────────── */

function lsKey(busId, date) { return 'rk_seats_' + busId + '_' + date; }

function getLocalSeats(busId, date) {
  try { return JSON.parse(localStorage.getItem(lsKey(busId, date)) || '[]'); }
  catch(e) { return []; }
}

function setLocalSeats(busId, date, newSeats) {
  var existing = getLocalSeats(busId, date);
  newSeats.forEach(function(s) {
    var idx = existing.findIndex(function(e){ return e.seat_num === s.num; });
    var row = {
      seat_num:         s.num,
      gender:           s.gender,
      passenger_name:   s.passenger_name  || '',
      passenger_phone:  s.passenger_phone || '',
      status: 'booked'
    };
    if (idx >= 0) existing[idx] = row; else existing.push(row);
  });
  localStorage.setItem(lsKey(busId, date), JSON.stringify(existing));
}

function removeLocalSeat(busId, date, seatNum) {
  var seats = getLocalSeats(busId, date).filter(function(s){ return s.seat_num !== seatNum; });
  localStorage.setItem(lsKey(busId, date), JSON.stringify(seats));
}

function clearLocalSeats(busId, date) {
  localStorage.removeItem(lsKey(busId, date));
}

/* ─────────────────────────────────────────────────────────────
   AUTO-RESET  (2 hrs after bus departure)
───────────────────────────────────────────────────────────── */

function checkAutoReset(bus, date) {
  var raw = (bus.departure || '').trim();
  var m12 = raw.match(/(\d+):(\d+)\s*(AM|PM)/i);
  var m24 = raw.match(/^(\d+):(\d+)$/);
  var h = 0, m = 0;
  if (m12) {
    h = +m12[1]; m = +m12[2];
    if (m12[3].toUpperCase() === 'PM' && h !== 12) h += 12;
    if (m12[3].toUpperCase() === 'AM' && h === 12) h = 0;
  } else if (m24) { h = +m24[1]; m = +m24[2]; }
  else return 'ok';

  var dep = new Date(date + 'T00:00:00'); dep.setHours(h, m, 0, 0);
  var resetAt = new Date(dep.getTime() + 7200000);
  var now = new Date();

  if (now >= resetAt) {
    unblockAllSeats(bus.id, date);
    return 'reset';
  }
  if (now >= dep) return 'departed';
  return 'ok';
}

/* ─────────────────────────────────────────────────────────────
   EXPOSE GLOBALLY  (same interface as before — no breaking changes)
───────────────────────────────────────────────────────────── */
window.RK = {
  getBookedSeats,
  bookSeats,
  unblockSeat,
  unblockAllSeats,
  unblockAllBusSeats,
  subscribeSeats,
  getConfig,
  saveConfig,
  adminLogin,
  isAdminLoggedIn,
  adminLogout,
  checkAutoReset,
  SUPABASE_CONFIGURED,
  ADMIN_PASSWORD
};
