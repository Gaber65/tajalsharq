/* ==========================================================================
   home-init.js — Page-specific initialization for index.html
   Loads home data, renders dynamic sections, handles language:changed re-render
   ========================================================================== */

const HomeInit = (() => {
  'use strict';

  let homeData = null;

  /* ---- Load home data ---- */
  const loadData = async () => {
    homeData = await Api.load('home.json');
    return homeData;
  };

  /* ---- Render marquee strip ---- */
  const renderMarquee = () => {
    const track = document.getElementById('marqueeTrack');
    if (!track || !homeData || !homeData.marquee) return;

    const items = homeData.marquee.items;
    const html = items.map(item => {
      const label = Language.t(`marquee.${item.key}`);
      return `<span><i class="bi ${item.icon}"></i> ${Utils.escapeHTML(label)}</span>`;
    }).join('');

    // Duplicate for seamless loop
    track.innerHTML = html + html;
  };

  /* ---- Render why-choose-us feature cards ---- */
  const renderWhyUs = () => {
    const container = document.getElementById('whyUsFeatures');
    if (!container || !homeData || !homeData.whyUs) return;

    const html = homeData.whyUs.features.map(f => {
      const title = Language.t(f.titleKey);
      const desc = Language.t(f.descKey);
      return `
        <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="${f.delay}">
          <div class="feature-card feature-card--dark">
            <div class="feature-index">${f.index}</div>
            <div class="feature-icon"><i class="bi ${f.icon}"></i></div>
            <h3>${Utils.escapeHTML(title)}</h3>
            <p>${desc}</p>
          </div>
        </div>`;
    }).join('');

    container.innerHTML = html;
  };

  /* ---- Render equipment categories ---- */
  const renderCategories = () => {
    const container = document.getElementById('equipmentCategories');
    if (!container || !homeData || !homeData.categories) return;

    const html = homeData.categories.map(cat => {
      const name = Language.t(`equipment.categories.${cat.id}.name`);
      const count = Language.t(`equipment.categories.${cat.id}.count`);
      return `
        <div class="${cat.cols}" data-aos="zoom-in" data-aos-delay="${cat.delay}">
          <a href="equipment.html${cat.anchor}" class="category-card">
            <img src="${cat.image}" alt="${Utils.escapeHTML(name)}" loading="lazy">
            <div class="cat-body">
              <i class="bi ${cat.icon} cat-icon"></i>
              <h4>${Utils.escapeHTML(name)}</h4>
              <div class="cat-count">${Utils.escapeHTML(count)}</div>
            </div>
          </a>
        </div>`;
    }).join('');

    container.innerHTML = html;
  };

  /* ---- Render featured equipment slider ---- */
  const renderFeaturedSlider = () => {
    const wrapper = document.getElementById('featuredSliderWrapper');
    if (!wrapper || !homeData || !homeData.featured) return;

    const html = homeData.featured.map(item => {
      const name = Language.t(`equipment.${item.id}.name`);
      const category = Language.t(`equipment.${item.id}.category`);
      const spec1 = Language.t(`equipment.${item.id}.spec1`);
      const spec2 = Language.t(`equipment.${item.id}.spec2`);
      const ctaText = Language.t('equipment.viewDetails');
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
                <span class="spec"><i class="bi ${item.spec1Icon}"></i> ${Utils.escapeHTML(spec1)}</span>
                <span class="spec"><i class="bi ${item.spec2Icon}"></i> ${Utils.escapeHTML(spec2)}</span>
              </div>
              <a href="equipment.html" class="equip-cta">${ctaText} <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>`;
    }).join('');

    wrapper.innerHTML = html;
  };

  /* ---- Render services preview cards ---- */
  const renderServices = () => {
    const container = document.getElementById('servicesPreview');
    if (!container || !homeData || !homeData.services) return;

    const html = homeData.services.map(s => {
      const title = Language.t(s.titleKey);
      const desc = Language.t(s.descKey);
      return `
        <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${s.delay}">
          <div class="feature-card">
            <div class="feature-icon"><i class="bi ${s.icon}"></i></div>
            <h3>${Utils.escapeHTML(title)}</h3>
            <p>${desc}</p>
          </div>
        </div>`;
    }).join('');

    container.innerHTML = html;
  };

  /* ---- Render stats band ---- */
  const renderStats = () => {
    const container = document.getElementById('statsBand');
    if (!container || !homeData || !homeData.stats) return;

    const html = homeData.stats.map(s => {
      const label = Language.t(s.labelKey);
      return `
        <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="${s.delay}">
          <div class="stat-block">
            <i class="bi ${s.icon} stat-icon"></i>
            <div class="stat-value"><span data-counter="${s.counter}">0</span><span>+</span></div>
            <div class="stat-caption">${Utils.escapeHTML(label)}</div>
          </div>
        </div>`;
    }).join('');

    container.innerHTML = html;
  };

  /* ---- Render testimonials ---- */
  const renderTestimonials = () => {
    const wrapper = document.getElementById('testimonialWrapper');
    if (!wrapper || !homeData || !homeData.testimonials) return;

    const html = homeData.testimonials.map(t => {
      const quote = Language.t(`testimonials.${t.id}quote`);
      const name = Language.t(`testimonials.${t.id}name`);
      const role = Language.t(t.roleKey);
      return `
        <div class="swiper-slide">
          <div class="testimonial-card">
            <div class="quote-mark">&ldquo;</div>
            <div class="stars"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i></div>
            <p>${quote}</p>
            <div class="testi-person">
              <div class="testi-avatar">${t.avatar}</div>
              <div>
                <div class="testi-name">${Utils.escapeHTML(name)}</div>
                <div class="testi-role">${Utils.escapeHTML(role)}</div>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');

    wrapper.innerHTML = html;
  };

  /* ---- Render client logos ---- */
  const renderClients = () => {
    const container = document.getElementById('clientLogos');
    if (!container || !homeData || !homeData.clients) return;

    const html = homeData.clients.map(c => {
      return `
        <div class="col-4 col-md-2" data-aos="fade-up" data-aos-delay="${c.delay}">
          <div class="client-badge"><span class="client-name">${Utils.escapeHTML(c.name)}</span></div>
        </div>`;
    }).join('');

    container.innerHTML = html;
  };

  /* ---- Render FAQ preview ---- */
  const renderFAQ = () => {
    const container = document.getElementById('faqPreview');
    if (!container || !homeData || !homeData.faq) return;

    const html = homeData.faq.map(item => {
      const question = Language.t(`faq.${item.id}`);
      const answer = Language.t(`faq.a${item.id.slice(1)}`);
      return `
        <div class="faq-item">
          <button class="faq-question">${Utils.escapeHTML(question)} <span class="faq-icon"><i class="bi bi-plus"></i></span></button>
          <div class="faq-answer"><div class="faq-answer-inner">${answer}</div></div>
        </div>`;
    }).join('');

    container.innerHTML = html;
    FAQ.initAccordion();
  };

  /* ---- Render all dynamic sections ---- */
  const renderAll = () => {
    renderMarquee();
    renderWhyUs();
    renderCategories();
    renderFeaturedSlider();
    renderServices();
    renderStats();
    renderTestimonials();
    renderClients();
    renderFAQ();
  };

  /* ---- Initialize home page ---- */
  const init = async () => {
    await loadData();
    renderAll();
    Utils.initAOS();
    Utils.initCounters();
    App.initSwipers();
  };

  /* ---- Re-render on language change ---- */
  const onLanguageChanged = () => {
    renderAll();
    Utils.refreshAOS();
    Utils.initCounters();
    App.reinitSwipers();
  };

  /* ---- Listen for app:ready (page-specific) ---- */
  document.addEventListener('app:ready', (e) => {
    if (e.detail.page === 'index' || e.detail.page === '') {
      init();
    }
  });

  /* ---- Listen for language:changed ---- */
  document.addEventListener('language:changed', () => {
    const pageName = Language.getCurrentPageName();
    if (pageName === 'index' || pageName === '') {
      onLanguageChanged();
    }
  });

  return { init, renderAll, loadData };
})();
