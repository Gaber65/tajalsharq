/* ==========================================================================
   utils.js — Reusable utility functions for Taj Al Sharq United
   AOS init, counter animation, footer year, active nav link
   ========================================================================== */

const Utils = (() => {
  'use strict';

  /* ---- Initialize AOS (Animate On Scroll) ---- */
  const initAOS = () => {
    if (window.AOS) {
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60
      });
    } else {
      initRevealOnScroll();
    }
  };

  /* ---- Fallback scroll reveal animation ---- */
  const initRevealOnScroll = () => {
    const elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;

    const activateElement = (el) => {
      if (el.dataset.aosState === 'animated') return;

      const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add('reveal-visible', 'aos-animate');
      el.dataset.aosState = 'animated';
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.16,
      rootMargin: '0px 0px -70px 0px'
    });

    elements.forEach((el) => {
      if (el.dataset.aosState === 'animated') {
        activateElement(el);
        return;
      }

      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        activateElement(el);
      } else {
        observer.observe(el);
      }
    });
  };

  /* ---- Refresh AOS after dynamic content is loaded ---- */
  const refreshAOS = () => {
    if (window.AOS) {
      AOS.refresh();
    } else {
      initRevealOnScroll();
    }
  };

  /* ---- Animated counter (IntersectionObserver driven) ---- */
  const initCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
  };

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const duration = 1600;
    let startTime = null;
    const decimals = el.getAttribute('data-decimals')
      ? parseInt(el.getAttribute('data-decimals'), 10)
      : 0;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = decimals > 0
        ? value.toFixed(decimals)
        : Math.floor(value).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = decimals > 0
          ? target.toFixed(decimals)
          : target.toLocaleString();
      }
    };
    requestAnimationFrame(step);
  };

  /* ---- Set footer year ---- */
  const setFooterYear = () => {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  };

  /* ---- Highlight active nav link based on current page ---- */
  const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  };

  /* ---- Escape HTML to prevent XSS ---- */
  const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  /* ---- Create an element from HTML string ---- */
  const createElementFromHTML = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstChild;
  };

  return {
    initAOS,
    initRevealOnScroll,
    refreshAOS,
    initCounters,
    setFooterYear,
    setActiveNavLink,
    escapeHTML,
    createElementFromHTML
  };
})();
