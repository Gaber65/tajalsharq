/* ==========================================================================
   app.js — Main orchestrator for Taj Al Sharq United
   Handles: navbar, back-to-top, Swiper sliders, page initialization
   ========================================================================== */

const App = (() => {
  'use strict';

  let navbar, toggler, navLinks, backdrop, backToTop;

  /* ---- Sticky navbar + mobile menu ---- */
  const initNavbar = () => {
    navbar = document.querySelector('.site-navbar');
    toggler = document.querySelector('.navbar-toggler-custom');
    navLinks = document.querySelector('.nav-links');
    backdrop = document.querySelector('.nav-backdrop');

    const handleScroll = () => {
      if (!navbar) return;
      if (window.scrollY > 40) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const closeMenu = () => {
      if (navLinks) navLinks.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      if (navLinks) navLinks.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    if (toggler) {
      toggler.addEventListener('click', () => {
        if (navLinks && navLinks.classList.contains('is-open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });
    }

    if (backdrop) backdrop.addEventListener('click', closeMenu);

    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
  };

  /* ---- Back to top button ---- */
  const initBackToTop = () => {
    backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  /* ---- Swiper sliders ---- */
  const initSwipers = () => {
    if (!window.Swiper) return;

    // Testimonial slider
    const testiSlider = document.querySelector('.testimonial-slider');
    if (testiSlider) {
      new Swiper(testiSlider, {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.testimonial-slider .swiper-pagination', clickable: true },
        breakpoints: {
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 }
        }
      });
    }

    // Equipment slider
    const equipSlider = document.querySelector('.equipment-slider');
    if (equipSlider) {
      new Swiper(equipSlider, {
        slidesPerView: 1.15,
        spaceBetween: 20,
        loop: true,
        autoplay: { delay: 4200, disableOnInteraction: false },
        navigation: {
          nextEl: '.equipment-slider-next',
          prevEl: '.equipment-slider-prev'
        },
        breakpoints: {
          576: { slidesPerView: 1.6 },
          768: { slidesPerView: 2.3 },
          992: { slidesPerView: 3.2 },
          1200: { slidesPerView: 4 }
        }
      });
    }
  };

  /* ---- Re-initialize Swipers after dynamic content ---- */
  const reinitSwipers = () => {
    initSwipers();
  };

  /* ---- Language switcher event listener ---- */
  const initLangSwitcher = () => {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;

    switcher.addEventListener('click', (e) => {
      const option = e.target.closest('.lang-option');
      if (option) {
        const lang = option.getAttribute('data-lang');
        if (lang) Language.switchLang(lang);
      }
    });
  };

  /* ---- Master init ---- */
  const init = async () => {
    Loader.init();

    const pageName = Language.getCurrentPageName();
    await Language.init(pageName);

    initNavbar();
    initBackToTop();
    initLangSwitcher();

    Utils.initAOS();
    Utils.setFooterYear();
    Utils.setActiveNavLink();

    // Dispatch page-specific init event
    document.dispatchEvent(new CustomEvent('app:ready', { detail: { page: pageName } }));
  };

  return { init, initNavbar, initBackToTop, initSwipers, reinitSwipers, initLangSwitcher };
})();

/* ---- Bootstrap the app on DOM ready ---- */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

/* ---- Listen for language changes to re-render dynamic sections ---- */
document.addEventListener('language:changed', () => {
  Utils.refreshAOS();
  Utils.initCounters();
  Utils.setFooterYear();
});
