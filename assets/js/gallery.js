/* ==========================================================================
   gallery.js — Dynamic gallery grid, filter and lightbox for Taj Al Sharq United
   ========================================================================== */

const Gallery = (() => {
  'use strict';

  let galleryData = null;

  /* ---- Load gallery data ---- */
  const loadData = async () => {
    galleryData = await Api.load('gallery.json');
    return galleryData;
  };

  /* ---- Render gallery grid from data ---- */
  const renderGrid = (container) => {
    if (!container || !galleryData || !galleryData.items) return;

    const html = galleryData.items.map(item => {
      const title = Language.t(`gallery.${item.id}.title`);
      const cat = Language.t(`gallery.${item.id}.category`);

      return `
        <div class="${item.cols}" data-category="${item.categoryFilter}" data-aos="fade-up" data-aos-delay="${item.delay || 0}">
          <div class="gallery-item">
            <img src="${item.image}" alt="${Utils.escapeHTML(title)}" loading="lazy">
            <div class="gal-overlay"><div><div class="gal-cat">${Utils.escapeHTML(cat)}</div><div class="gal-title">${Utils.escapeHTML(title)}</div></div></div>
            <div class="gal-zoom"><i class="bi bi-arrows-fullscreen"></i></div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
    initLightbox();
  };

  /* ---- Render gallery filter pills ---- */
  const renderFilterPills = (container, filters) => {
    if (!container || !filters) return;

    const html = filters.map((f, i) => {
      const label = Language.t(`gallery.filters.${f.key}`);
      const activeClass = i === 0 ? ' active' : '';
      return `<button class="filter-pill${activeClass}" data-filter="${f.value}">${Utils.escapeHTML(label)}</button>`;
    }).join('');

    container.innerHTML = html;
  };

  /* ---- Initialize lightbox ---- */
  const initLightbox = () => {
    const lightbox = document.querySelector('.lightbox-overlay');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').getAttribute('src');
        const imgAlt = item.querySelector('img').getAttribute('alt');
        lightboxImg.setAttribute('src', imgSrc);
        lightboxImg.setAttribute('alt', imgAlt);
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });
  };

  return { loadData, renderGrid, renderFilterPills, initLightbox };
})();
