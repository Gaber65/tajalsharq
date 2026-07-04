/* ============================================================
   gallery-init.js  –  Gallery-page specific initialisation
   ============================================================ */
const GalleryInit = (() => {
  'use strict';

  let galleryData = null;

  const loadData = async () => {
    galleryData = await Api.load('gallery.json');
    return galleryData;
  };

  /* ── Render: Filter pills ───────────────────────────── */
  const renderFilterPills = () => {
    const container = document.getElementById('galleryFilterPills');
    if (!container || !galleryData) return;

    const filterKeys = { all: 'gallery.filters.all', equipment: 'gallery.filters.equipment', site: 'gallery.filters.site', team: 'gallery.filters.team' };
    const filters = galleryData.filters || [];
    container.innerHTML = filters.map((f, i) => {
      const label = Language.t(filterKeys[f] || f);
      return `<button class="filter-pill${i === 0 ? ' active' : ''}" data-filter="${f}">${label}</button>`;
    }).join('');
  };

  /* ── Render: Gallery grid ───────────────────────────── */
  const renderGrid = () => {
    const container = document.getElementById('galleryGrid');
    if (!container || !galleryData) return;

    const items = galleryData.items || [];
    container.innerHTML = items.map(item => {
      const cat   = Language.t(item.catKey);
      const title = Language.t(item.titleKey);
      return `
        <div class="col-6 col-lg-4" data-category="${item.category}" data-aos="fade-up" data-aos-delay="${item.delay}">
          <div class="gallery-item">
            <img src="${item.image}" alt="${item.alt}" loading="lazy">
            <div class="gal-overlay"><div><div class="gal-cat">${cat}</div><div class="gal-title">${title}</div></div></div>
            <div class="gal-zoom"><i class="bi bi-arrows-fullscreen"></i></div>
          </div>
        </div>`;
    }).join('');
  };

  /* ── Init filter pills click handler ────────────────── */
  const initFilters = () => {
    const container = document.getElementById('galleryFilterPills');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;

      container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      const grid = document.getElementById('galleryGrid');
      if (!grid) return;

      grid.querySelectorAll('[data-category]').forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  };

  /* ── Init lightbox ──────────────────────────────────── */
  const initLightbox = () => {
    const grid = document.getElementById('galleryGrid');
    const overlay = document.querySelector('.lightbox-overlay');
    if (!grid || !overlay) return;

    const closeBtn = overlay.querySelector('.lightbox-close');
    const img = overlay.querySelector('img');

    grid.addEventListener('click', (e) => {
      const zoom = e.target.closest('.gal-zoom');
      if (!zoom) return;

      const item = zoom.closest('.gallery-item');
      const itemImg = item ? item.querySelector('img') : null;
      if (itemImg && img) {
        img.src = itemImg.src;
        img.alt = itemImg.alt;
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });

    const closeLightbox = () => {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeLightbox();
    });
  };

  const renderAll = () => {
    renderFilterPills();
    renderGrid();
    initFilters();
    initLightbox();
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
    if (e.detail && e.detail.page === 'gallery') init();
  });

  document.addEventListener('language:changed', () => {
    onLanguageChanged();
  });

  return { init, renderAll, loadData };
})();
