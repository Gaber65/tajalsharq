/* ==========================================================================
   language.js — i18n engine for Taj Al Sharq United
   Handles: localStorage persistence, RTL/LTR switching, Bootstrap CSS swap,
   translation loading, data-i18n attribute processing
   ========================================================================== */

const Language = (() => {
  'use strict';

  const STORAGE_KEY = 'tajalsharq_lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED_LANGS = ['en', 'ar'];
  const RTL_LANGS = ['ar'];

  /* Map URL-derived page names to translation file names */
  const PAGE_NAME_MAP = { 'index': 'home', '': 'home' };

  let currentLang = DEFAULT_LANG;
  let translations = {};

  /* ---- Helpers ---- */
  const isRTL = (lang) => RTL_LANGS.includes(lang || currentLang);

  const getSavedLang = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved && SUPPORTED_LANGS.includes(saved) ? saved : null;
    } catch { return null; }
  };

  const saveLang = (lang) => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
  };

  /* ---- Deep access nested key like "hero.title" ---- */
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => {
      if (acc === undefined || acc === null) return undefined;
      return acc[part];
    }, obj);
  };

  /* ---- Apply translations to all [data-i18n] elements ---- */
  const applyTranslations = () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = getNestedValue(translations, key);
      if (value !== undefined) {
        el.innerHTML = value;
      }
    });

    // Apply data-i18n-placeholder for inputs/textareas
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const value = getNestedValue(translations, key);
      if (value !== undefined) {
        el.setAttribute('placeholder', value);
      }
    });

    // Apply data-i18n-title for elements needing title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const value = getNestedValue(translations, key);
      if (value !== undefined) {
        el.setAttribute('title', value);
      }
    });

    // Apply data-i18n-aria for aria-label attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const value = getNestedValue(translations, key);
      if (value !== undefined) {
        el.setAttribute('aria-label', value);
      }
    });

    // Apply data-i18n-alt for img alt attributes
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      const value = getNestedValue(translations, key);
      if (value !== undefined) {
        el.setAttribute('alt', value);
      }
    });
  };

  /* ---- Update document direction and lang attribute ---- */
  const updateDocumentDirection = (lang) => {
    const dir = isRTL(lang) ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
  };

  /* ---- Swap Bootstrap CSS between LTR and RTL ---- */
  const swapBootstrapCSS = (lang) => {
    const bootstrapLink = document.getElementById('bootstrap-css');
    if (bootstrapLink) {
      if (isRTL(lang)) {
        bootstrapLink.setAttribute('href', 'assets/css/bootstrap.rtl.min.css');
      } else {
        bootstrapLink.setAttribute('href', 'assets/css/bootstrap.min.css');
      }
    }
  };

  /* ---- Update language switcher UI ---- */
  const updateSwitcherUI = (lang) => {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;

    const options = switcher.querySelectorAll('.lang-option');
    options.forEach(opt => {
      const optLang = opt.getAttribute('data-lang');
      opt.classList.toggle('active', optLang === lang);
    });
  };

  /* ---- Deep merge helper: page overrides common recursively ---- */
  const deepMerge = (target, source) => {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (
        source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
        result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])
      ) {
        result[key] = deepMerge(result[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  };

  /* ---- Load translation files for current page ---- */
  const loadTranslations = async (lang, pageName) => {
    try {
      const [commonRes, pageRes] = await Promise.all([
        fetch(`assets/lang/${lang}/common.json`),
        fetch(`assets/lang/${lang}/${pageName}.json`)
      ]);

      const commonData = await commonRes.json();
      const pageData = await pageRes.json();

      // Deep merge: page translations override common on collision, but preserve nested keys
      translations = deepMerge(commonData, pageData);
    } catch (err) {
      console.error('Failed to load translations:', err);
      translations = {};
    }
  };

  /* ---- Initialize language on page load ---- */
  const init = async (pageName) => {
    const saved = getSavedLang();
    currentLang = saved || DEFAULT_LANG;

    updateDocumentDirection(currentLang);
    swapBootstrapCSS(currentLang);

    await loadTranslations(currentLang, pageName);
    applyTranslations();
    updateSwitcherUI(currentLang);

    // Dispatch event for other modules to react
    document.dispatchEvent(new CustomEvent('language:ready', { detail: { lang: currentLang } }));
  };

  /* ---- Switch language without page reload ---- */
  const switchLang = async (newLang) => {
    if (!SUPPORTED_LANGS.includes(newLang) || newLang === currentLang) return;

    currentLang = newLang;
    saveLang(currentLang);

    updateDocumentDirection(currentLang);
    swapBootstrapCSS(currentLang);

    // Determine current page name from URL
    const pageName = getCurrentPageName();
    await loadTranslations(currentLang, pageName);
    applyTranslations();
    updateSwitcherUI(currentLang);

    // Dispatch event so dynamic components can re-render
    document.dispatchEvent(new CustomEvent('language:changed', { detail: { lang: currentLang } }));
  };

  /* ---- Get current page name from URL ---- */
  const getCurrentPageName = () => {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    const rawName = filename.replace('.html', '') || 'index';
    return PAGE_NAME_MAP[rawName] || rawName;
  };

  /* ---- Get a single translation value ---- */
  const t = (key) => {
    return getNestedValue(translations, key) || key;
  };

  /* ---- Get current language code ---- */
  const getCurrentLang = () => currentLang;

  /* ---- Check if current language is RTL ---- */
  const isCurrentRTL = () => isRTL(currentLang);

  /* ---- Get all loaded translations ---- */
  const getTranslations = () => translations;

  return {
    init,
    switchLang,
    t,
    getCurrentLang,
    isCurrentRTL,
    getCurrentPageName,
    applyTranslations,
    loadTranslations,
    getTranslations
  };
})();
