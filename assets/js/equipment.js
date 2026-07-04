/* ==========================================================================
   equipment.js — Dynamic equipment cards and filter for Taj Al Sharq United
   ========================================================================== */

const Equipment = (() => {
  'use strict';

  let equipmentData = null;

  /* ---- Load equipment data ---- */
  const loadData = async () => {
    equipmentData = await Api.load('equipment.json');
    return equipmentData;
  };

  /* ---- Render equipment grid (for equipment.html) ---- */
  const renderGrid = (container) => {
    if (!container || !equipmentData || !equipmentData.equipment) return;

    const lang = Language.getCurrentLang();
    const html = equipmentData.equipment.map(item => {
      const name = Language.t(`equipment.${item.id}.name`);
      const category = Language.t(`equipment.${item.id}.category`);
      const spec1Label = Language.t(`equipment.${item.id}.spec1`);
      const spec2Label = Language.t(`equipment.${item.id}.spec2`);
      const ctaText = Language.t('common.equipment.requestQuote');

      return `
        <div class="col-md-6 col-lg-3" data-category="${item.categoryFilter}" data-aos="fade-up" id="${item.anchor || ''}">
          <div class="equip-card">
            <div class="blueprint-frame">
              <img src="${item.image}" alt="${Utils.escapeHTML(name)}" loading="lazy">
              <span class="tag-code">${item.tagCode}</span>
            </div>
            <div class="equip-body">
              <div class="equip-cat">${Utils.escapeHTML(category)}</div>
              <h3>${Utils.escapeHTML(name)}</h3>
              <div class="equip-specs">
                <span class="spec"><i class="bi ${item.spec1Icon}"></i> ${Utils.escapeHTML(spec1Label)}</span>
                <span class="spec"><i class="bi ${item.spec2Icon}"></i> ${Utils.escapeHTML(spec2Label)}</span>
              </div>
              <a href="contact.html" class="equip-cta">${ctaText} <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  };

  /* ---- Render equipment slider (for index.html featured section) ---- */
  const renderSlider = (wrapper) => {
    if (!wrapper || !equipmentData || !equipmentData.featured) return;

    const html = equipmentData.featured.map(item => {
      const name = Language.t(`equipment.${item.id}.name`);
      const category = Language.t(`equipment.${item.id}.category`);
      const spec1Label = Language.t(`equipment.${item.id}.spec1`);
      const spec2Label = Language.t(`equipment.${item.id}.spec2`);
      const ctaText = Language.t('common.equipment.viewDetails');

      return `
        <div class="swiper-slide">
          <div class="equip-card">
            <div class="blueprint-frame">
              <img src="${item.image}" alt="${Utils.escapeHTML(name)}" loading="lazy">
              <span class="tag-code">${item.tagCode}</span>
            </div>
            <div class="equip-body">
              <div class="equip-cat">${Utils.escapeHTML(category)}</div>
              <h3>${Utils.escapeHTML(name)}</h3>
              <div class="equip-specs">
                <span class="spec"><i class="bi ${item.spec1Icon}"></i> ${Utils.escapeHTML(spec1Label)}</span>
                <span class="spec"><i class="bi ${item.spec2Icon}"></i> ${Utils.escapeHTML(spec2Label)}</span>
              </div>
              <a href="equipment.html" class="equip-cta">${ctaText} <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    wrapper.innerHTML = html;
  };

  /* ---- Render category cards (for index.html) ---- */
  const renderCategories = (container) => {
    if (!container || !equipmentData || !equipmentData.categories) return;

    const html = equipmentData.categories.map(item => {
      const name = Language.t(`equipment.categories.${item.id}.name`);
      const count = Language.t(`equipment.categories.${item.id}.count`);

      return `
        <div class="${item.cols}" data-aos="zoom-in" data-aos-delay="${item.delay}">
          <a href="equipment.html${item.anchor}" class="category-card">
            <img src="${item.image}" alt="${Utils.escapeHTML(name)}" loading="lazy">
            <div class="cat-body">
              <i class="bi ${item.icon} cat-icon"></i>
              <h4>${Utils.escapeHTML(name)}</h4>
              <div class="cat-count">${Utils.escapeHTML(count)}</div>
            </div>
          </a>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  };

  /* ---- Initialize filter pills ---- */
  const initFilters = () => {
    document.querySelectorAll('[data-filter-group]').forEach(group => {
      const pills = group.querySelectorAll('.filter-pill');
      const targetSelector = group.getAttribute('data-filter-group');
      const items = document.querySelectorAll(targetSelector + ' [data-category]');

      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const filter = pill.getAttribute('data-filter');

          items.forEach(item => {
            const cats = item.getAttribute('data-category');
            const show = filter === 'all' || (cats && cats.indexOf(filter) !== -1);
            if (show) {
              item.style.display = '';
              item.classList.add('aos-animate');
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    });
  };

  /* ---- Render filter pills from data ---- */
  const renderFilterPills = (container, filters) => {
    if (!container || !filters) return;

    const targetSelector = container.getAttribute('data-filter-group') || '#equipmentGrid';

    const html = filters.map((f, i) => {
      const label = Language.t(`equipment.filters.${f.key}`);
      const activeClass = i === 0 ? ' active' : '';
      return `<button class="filter-pill${activeClass}" data-filter="${f.value}">${Utils.escapeHTML(label)}</button>`;
    }).join('');

    container.innerHTML = html;
  };

  /* ---- Render skilled manpower section ---- */
  const renderManpower = (container) => {
    if (!container || !equipmentData || !equipmentData.manpower) return;

    const html = equipmentData.manpower.map(item => {
      const title = Language.t(`equipment.manpower.${item.id}.title`);
      const desc = Language.t(`equipment.manpower.${item.id}.description`);

      return `
        <div class="${item.cols}" data-aos="fade-up" data-aos-delay="${item.delay}">
          <div class="feature-card feature-card--dark text-center">
            <div class="feature-icon mx-auto"><i class="bi ${item.icon}"></i></div>
            <h3>${Utils.escapeHTML(title)}</h3>
            <p>${desc}</p>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  };

  return {
    loadData,
    renderGrid,
    renderSlider,
    renderCategories,
    initFilters,
    renderFilterPills,
    renderManpower
  };
})();
