/* ============================================================
   equipment-init.js  –  Equipment-page specific initialisation
   ============================================================ */
const EquipmentInit = (() => {
  'use strict';

  let equipData = null;

  const loadData = async () => {
    equipData = await Api.load('equipment.json');
    return equipData;
  };

  /* ── Render: Filter pills ───────────────────────────── */
  const renderFilterPills = () => {
    const container = document.getElementById('filterPillsContainer');
    if (!container || !equipData) return;

    const filterKeys = { all: 'equipment.filters.all', cranes: 'equipment.filters.cranes', earthmoving: 'equipment.filters.earthmoving', access: 'equipment.filters.access', power: 'equipment.filters.power' };
    const filters = equipData.filters || [];
    container.innerHTML = filters.map((f, i) => {
      const label = Language.t(filterKeys[f] || f);
      return `<button class="filter-pill${i === 0 ? ' active' : ''}" data-filter="${f}">${label}</button>`;
    }).join('');
  };

  /* ── Render: Equipment grid ─────────────────────────── */
  const renderGrid = () => {
    const container = document.getElementById('equipmentGrid');
    if (!container || !equipData) return;

    const items = equipData.items || [];
    container.innerHTML = items.map(item => {
      const cat    = Language.t(item.catKey);
      const name   = Language.t(item.nameKey);
      const spec1  = Language.t(item.spec1Key);
      const spec2  = Language.t(item.spec2Key);
      const cta    = Language.t('equipment.requestQuote');
      return `
        <div class="col-md-6 col-lg-3" data-category="${item.category}" data-aos="fade-up" data-aos-delay="${item.delay}">
          <div class="equip-card">
            <div class="blueprint-frame"><img src="${item.image}" alt="${name}"><span class="tag-code">${item.tagCode}</span></div>
            <div class="equip-body">
              <div class="equip-cat">${cat}</div>
              <h3>${name}</h3>
              <div class="equip-specs">
                <span class="spec"><i class="${item.spec1Icon}"></i> ${spec1}</span>
                <span class="spec"><i class="${item.spec2Icon}"></i> ${spec2}</span>
              </div>
              <a href="contact.html" class="equip-cta">${cta} <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>`;
    }).join('');
  };

  /* ── Render: Manpower cards ─────────────────────────── */
  const renderManpower = () => {
    const container = document.getElementById('manpowerCards');
    if (!container || !equipData) return;

    const items = equipData.manpower || [];
    container.innerHTML = items.map(item => {
      const title = Language.t(item.titleKey);
      const desc  = Language.t(item.descKey);
      return `
        <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="${item.delay}">
          <div class="feature-card feature-card--dark text-center">
            <div class="feature-icon mx-auto"><i class="${item.icon}"></i></div>
            <h3>${title}</h3>
            <p>${desc}</p>
          </div>
        </div>`;
    }).join('');
  };

  /* ── Init filter pills click handler ────────────────── */
  const initFilters = () => {
    const container = document.getElementById('filterPillsContainer');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;

      container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      const grid = document.getElementById('equipmentGrid');
      if (!grid) return;

      grid.querySelectorAll('[data-category]').forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  };

  const renderAll = () => {
    renderFilterPills();
    renderGrid();
    renderManpower();
    initFilters();
  };

  const init = async () => {
    await loadData();
    renderAll();
    Utils.initAOS();
  };

  const onLanguageChanged = () => {
    renderAll();
    Utils.refreshAOS();
  };

  document.addEventListener('app:ready', (e) => {
    if (e.detail && e.detail.page === 'equipment') init();
  });

  document.addEventListener('language:changed', () => {
    onLanguageChanged();
  });

  return { init, renderAll, loadData };
})();
