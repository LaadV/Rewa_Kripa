/**
 * config-loader.js — Rewa Kripa Travels
 *
 * Loads the admin-saved config from Supabase (or localStorage fallback)
 * and deep-merges it into the global CONFIG object BEFORE any page renders.
 *
 * HOW IT WORKS:
 *   1. Every page calls: await window.RK_CONFIG_READY
 *   2. This file fetches saved config and patches CONFIG
 *   3. Page then renders with the latest admin settings
 *
 * Load order on every page:
 *   <script src="config.js"></script>      ← default hardcoded CONFIG
 *   <script src="supabase.js"></script>    ← DB client
 *   <script src="config-loader.js"></script> ← this file (patches CONFIG)
 *   <script> ... page render ... </script>
 */

(function () {
  'use strict';

  /* Deep merge: source values override target, arrays are replaced */
  function deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    Object.keys(source).forEach(function (key) {
      var sv = source[key];
      var tv = target[key];
      if (Array.isArray(sv)) {
        target[key] = sv;                          // arrays: replace entirely
      } else if (sv && typeof sv === 'object' && !Array.isArray(sv) &&
                 tv && typeof tv === 'object' && !Array.isArray(tv)) {
        deepMerge(tv, sv);                         // objects: recurse
      } else if (sv !== undefined && sv !== null) {
        target[key] = sv;                          // primitives: override
      }
    });
    return target;
  }

  /* Expose a promise that resolves once CONFIG is patched */
  window.RK_CONFIG_READY = (async function () {
    try {
      /* Wait up to 3s for supabase.js SDK to boot */
      var waited = 0;
      while (!window.RK && waited < 3000) {
        await new Promise(function (r) { setTimeout(r, 100); });
        waited += 100;
      }

      var saved = null;

      /* Try Supabase first */
      if (window.RK && typeof window.RK.getConfig === 'function') {
        saved = await window.RK.getConfig();
      }

      /* Fallback to localStorage */
      if (!saved) {
        try {
          saved = JSON.parse(localStorage.getItem('rk_admin_config') || 'null');
        } catch (e) { saved = null; }
      }

      if (saved && typeof saved === 'object') {
        deepMerge(window.CONFIG, saved);
        console.log('✅ Config loaded from ' + (window.RK && window.RK.isSupabaseActive() ? 'Supabase' : 'localStorage'));
      } else {
        console.log('ℹ️ No saved config — using defaults from config.js');
      }
    } catch (err) {
      console.warn('config-loader error (using defaults):', err.message);
    }
    return window.CONFIG;
  })();

})();
