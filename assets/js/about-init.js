/* ============================================================
   about-init.js  –  About-page specific initialisation
   ============================================================ */
const AboutInit = (() => {
  'use strict';

  let aboutData = null;

  /* ── Load JSON data ─────────────────────────────────── */
  const loadData = async () => {
    aboutData = await Api.load('about.json');
    return aboutData;
  };

  /* ── Render: Foundation cards (Vision / Mission / Values) */
  const renderFoundation = () => {
    const container = document.getElementById('foundationCards');
    if (!container || !aboutData) return;

    const items = aboutData.foundation || [];
    container.innerHTML = items.map(item => {
      const title = Language.t(item.titleKey);
      const desc  = Language.t(item.descKey);
      return `
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="${item.delay}">
          <div class="feature-card feature-card--dark">
            <div class="feature-icon"><i class="${item.icon}"></i></div>
            <h3>${title}</h3>
            <p>${desc}</p>
          </div>
        </div>`;
    }).join('');
  };

  /* ── Render: Stats band ─────────────────────────────── */
  const renderStats = () => {
    const container = document.getElementById('statsBand');
    if (!container || !aboutData) return;

    const items = aboutData.stats || [];
    container.innerHTML = items.map(item => {
      const label = Language.t(item.labelKey);
      return `
        <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="${item.delay}">
          <div class="stat-block">
            <i class="${item.icon} stat-icon"></i>
            <div class="stat-value">
              <span data-counter="${item.counter}">0</span><span>+</span>
            </div>
            <div class="stat-caption">${label}</div>
          </div>
        </div>`;
    }).join('');
  };

  /* ── Render: Client logos ────────────────────────────── */
  const renderClients = () => {
    const container = document.getElementById('clientLogos');
    if (!container || !aboutData) return;

    const items = aboutData.clients || [];
    container.innerHTML = items.map(item => {
      return `
        <div class="col-4 col-md-2" data-aos="fade-up">
          <div class="client-badge">
            <span class="client-name">${item.name}</span>
          </div>
        </div>`;
    }).join('');
  };

  /* ── Render: Why-choose-us check list ───────────────── */
  const renderWhyUsChecks = () => {
    const container = document.getElementById('whyUsChecks');
    if (!container || !aboutData) return;

    const items = aboutData.whyUsChecks || [];
    container.innerHTML = items.map(item => {
      const text = Language.t(item.key);
      return `<li><i class="${item.icon}"></i> ${text}</li>`;
    }).join('');
  };

  /* ── Render all dynamic sections ─────────────────────── */
  const renderAll = () => {
    renderFoundation();
    renderStats();
    renderClients();
    renderWhyUsChecks();
  };

  /* ── Init ───────────────────────────────────────────── */
  const init = async () => {
    await loadData();
    renderAll();
    Utils.initAOS();
    Utils.initCounters();
  };

  /* ── Language change handler ────────────────────────── */
  const onLanguageChanged = () => {
    renderAll();
    Utils.refreshAOS();
    Utils.initCounters();
  };

  /* ── Event listeners ───────────────────────────────── */
  document.addEventListener('app:ready', (e) => {
    const page = e.detail && e.detail.page;
    if (page === 'about') {
      init();
    }
  });

  document.addEventListener('language:changed', () => {
    onLanguageChanged();
  });

  return { init, renderAll, loadData };
})();
