/* ============================================================
   services-init.js  –  Services-page specific initialisation
   ============================================================ */
const ServicesInit = (() => {
  'use strict';

  let servicesData = null;

  /* ── Load JSON data ─────────────────────────────────── */
  const loadData = async () => {
    servicesData = await Api.load('services.json');
    return servicesData;
  };

  /* ── Render: Service rows ───────────────────────────── */
  const renderServiceRows = () => {
    const container = document.getElementById('serviceRowsContainer');
    if (!container || !servicesData) return;

    const items = servicesData.serviceRows || [];
    container.innerHTML = items.map(item => {
      const num   = Language.t(item.numKey);
      const title = Language.t(item.titleKey);
      const desc  = Language.t(item.descKey);
      return `
        <div class="service-row" data-aos="fade-up">
          <div class="svc-num">${num}</div>
          <div class="svc-icon"><i class="${item.icon}"></i></div>
          <div class="svc-body">
            <h3>${title}</h3>
            <p>${desc}</p>
          </div>
          <i class="bi bi-arrow-right svc-arrow"></i>
        </div>`;
    }).join('');
  };

  /* ── Render: Detail cards ───────────────────────────── */
  const renderDetailCards = () => {
    const container = document.getElementById('detailCardsContainer');
    if (!container || !servicesData) return;

    const items = servicesData.detailCards || [];
    container.innerHTML = items.map(item => {
      const title = Language.t(item.titleKey);
      const desc  = Language.t(item.descKey);
      const c1    = Language.t(item.check1Key);
      const c2    = Language.t(item.check2Key);
      const c3    = Language.t(item.check3Key);
      return `
        <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${item.delay}">
          <div class="service-detail-card">
            <div class="svc-icon-lg"><i class="${item.icon}"></i></div>
            <h3>${title}</h3>
            <p>${desc}</p>
            <ul>
              <li><i class="bi bi-check2"></i> ${c1}</li>
              <li><i class="bi bi-check2"></i> ${c2}</li>
              <li><i class="bi bi-check2"></i> ${c3}</li>
            </ul>
          </div>
        </div>`;
    }).join('');
  };

  /* ── Render: Process steps ──────────────────────────── */
  const renderProcess = () => {
    const container = document.getElementById('processStepsContainer');
    if (!container || !servicesData) return;

    const items = servicesData.process || [];
    container.innerHTML = items.map(item => {
      const num   = Language.t(item.numKey);
      const title = Language.t(item.titleKey);
      const desc  = Language.t(item.descKey);
      return `
        <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="${item.delay}">
          <div class="process-step">
            <div class="step-circle">${num}</div>
            <h4>${title}</h4>
            <p>${desc}</p>
          </div>
        </div>`;
    }).join('');
  };

  /* ── Render all dynamic sections ─────────────────────── */
  const renderAll = () => {
    renderServiceRows();
    renderDetailCards();
    renderProcess();
  };

  /* ── Init ───────────────────────────────────────────── */
  const init = async () => {
    await loadData();
    renderAll();
    Utils.initAOS();
  };

  /* ── Language change handler ────────────────────────── */
  const onLanguageChanged = () => {
    renderAll();
    Utils.refreshAOS();
  };

  /* ── Event listeners ───────────────────────────────── */
  document.addEventListener('app:ready', (e) => {
    const page = e.detail && e.detail.page;
    if (page === 'services') {
      init();
    }
  });

  document.addEventListener('language:changed', () => {
    onLanguageChanged();
  });

  return { init, renderAll, loadData };
})();
