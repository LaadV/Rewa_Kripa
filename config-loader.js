/**
 * config-loader.js — Rewa Kripa Travels
 *
 * Fetches admin-saved config from Supabase and deep-merges into global CONFIG.
 * Include AFTER config.js and supabase.js on every page.
 *
 *   <script src="config.js"></script>
 *   <script src="supabase.js"></script>
 *   <script src="config-loader.js"></script>
 *
 * Pages await window.RK_CONFIG_READY before rendering CONFIG-dependent content.
 */

(function() {
  'use strict';

  /** Deep-merge source into target. Arrays are replaced entirely. */
  function deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    Object.keys(source).forEach(function(key) {
      var val = source[key];
      if (Array.isArray(val)) {
        target[key] = val;
      } else if (val && typeof val === 'object') {
        if (!target[key] || typeof target[key] !== 'object') target[key] = {};
        deepMerge(target[key], val);
      } else {
        target[key] = val;
      }
    });
    return target;
  }

  // Expose for admin.html and other pages that need deep-merge
  window.RK_deepMerge = deepMerge;

  /** Resolves once CONFIG has been updated from Supabase (or falls back gracefully). */
  window.RK_CONFIG_READY = new Promise(function(resolve) {
    var attempts = 0;
    var maxAttempts = 50; // 5 seconds

    function tryLoad() {
      attempts++;
      if (typeof window.RK === 'undefined' || typeof window.RK.getConfig !== 'function') {
        if (attempts < maxAttempts) {
          setTimeout(tryLoad, 100);
        } else {
          console.warn('[config-loader] window.RK not ready after 5s — using default CONFIG');
          resolve(window.CONFIG);
        }
        return;
      }

      window.RK.getConfig().then(function(saved) {
        if (saved && typeof saved === 'object') {
          try {
            deepMerge(window.CONFIG, saved);
            console.info('[config-loader] ✅ Admin config loaded from Supabase');
          } catch(e) {
            console.warn('[config-loader] Merge error:', e.message);
          }
        } else {
          console.info('[config-loader] No saved config — using defaults');
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
