/* ==========================================================================
   api.js — Data loader for Taj Al Sharq United
   Loads JSON data files from /assets/data/ with caching
   ========================================================================== */

const Api = (() => {
  'use strict';

  const DATA_BASE = 'assets/data/';
  const cache = {};

  /* ---- Load a JSON data file ---- */
  const load = async (filename) => {
    if (cache[filename]) return cache[filename];

    try {
      const res = await fetch(`${DATA_BASE}${filename}`);
      if (!res.ok) throw new Error(`Failed to load ${filename}`);
      const data = await res.json();
      cache[filename] = data;
      return data;
    } catch (err) {
      console.error(`Api.load error for ${filename}:`, err);
      return null;
    }
  };

  /* ---- Load multiple files at once ---- */
  const loadMultiple = async (filenames) => {
    const results = await Promise.all(filenames.map(f => load(f)));
    const mapped = {};
    filenames.forEach((f, i) => {
      mapped[f.replace('.json', '')] = results[i];
    });
    return mapped;
  };

  /* ---- Clear cache ---- */
  const clearCache = () => {
    Object.keys(cache).forEach(k => delete cache[k]);
  };

  return { load, loadMultiple, clearCache };
})();
