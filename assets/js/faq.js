/* ==========================================================================
   faq.js — FAQ accordion for Taj Al Sharq United
   Can generate FAQ items from data or init existing ones
   ========================================================================== */

const FAQ = (() => {
  'use strict';

  /* ---- Initialize FAQ accordion on existing items ---- */
  const initAccordion = () => {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.classList.contains('is-open');

        // Close all other open items
        document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            openItem.querySelector('.faq-answer').style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('is-open');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('is-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  };

  /* ---- Generate FAQ items from data array ---- */
  const renderFromData = (container, faqItems, translations) => {
    if (!container || !faqItems || !faqItems.length) return;

    const html = faqItems.map(item => {
      const question = translations
        ? Language.t(`faq.${item.id}.question`)
        : item.question;
      const answer = translations
        ? Language.t(`faq.${item.id}.answer`)
        : item.answer;

      return `
        <div class="faq-item">
          <button class="faq-question">${Utils.escapeHTML(question)} <span class="faq-icon"><i class="bi bi-plus"></i></span></button>
          <div class="faq-answer"><div class="faq-answer-inner">${answer}</div></div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
    initAccordion();
  };

  return { initAccordion, renderFromData };
})();
