/**
 * config-loader.js — Rewa Kripa Travels
 *
 * Fetches the admin-saved config from Supabase (saved via admin.html → "Save All Changes")
 * and deep-merges it into the global CONFIG object defined in config.js.
 *
 * Usage: include AFTER config.js and supabase.js on any page that needs live admin config.
 *
 *   <script src="config.js"></script>
 *   <script src="supabase.js"></script>
 *   <script src="config-loader.js"></script>
 *
 * Pages should await window.RK_CONFIG_READY before reading CONFIG:
 *
 *   window.RK_CONFIG_READY.then(function() {
 *     // safe to use CONFIG here
 *   });
 *
 * If Supabase is not configured or fetch fails, the default CONFIG from config.js is used.
 */

(function() {
  'use strict';

  /**
   * Deep-merge source into target (non-destructive for target keys not in source).
   * Arrays are replaced (not merged) so admin can fully override routes/buses/trips.
   */
  function deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    Object.keys(source).forEach(function(key) {
      var val = source[key];
      if (Array.isArray(val)) {
        // Replace arrays entirely — admin intent is to replace, not append
        target[key] = val;
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        if (!target[key] || typeof target[key] !== 'object') target[key] = {};
        deepMerge(target[key], val);
      } else {
        target[key] = val;
      }
    });
    return target;
  }

  /**
   * Main loader — resolves once CONFIG has been updated (or falls back gracefully).
   */
  window.RK_CONFIG_READY = new Promise(function(resolve) {
    // Wait for supabase.js to expose window.RK
    var attempts = 0;
    var maxAttempts = 50; // 5 seconds max wait

    function tryLoad() {
      attempts++;

      if (typeof window.RK === 'undefined' || typeof window.RK.getConfig !== 'function') {
        if (attempts < maxAttempts) {
          setTimeout(tryLoad, 100);
        } else {
          // supabase.js never loaded — use default CONFIG as-is
          console.warn('[config-loader] supabase.js not ready after 5s — using default CONFIG');
          resolve(window.CONFIG);
        }
        return;
      }

      // supabase.js is ready — attempt to fetch saved config
      window.RK.getConfig().then(function(saved) {
        if (saved && typeof saved === 'object') {
          try {
            deepMerge(window.CONFIG, saved);
            console.info('[config-loader] ✅ Admin config loaded from Supabase');
          } catch(e) {
            console.warn('[config-loader] Merge error:', e.message);
          }
        } else {
          console.info('[config-loader] No saved config found — using defaults from config.js');
        }
        resolve(window.CONFIG);
      }).catch(function(err) {
        console.warn('[config-loader] getConfig failed:', err && err.message);
        resolve(window.CONFIG);
      });
    }

    tryLoad();
  });

})();
