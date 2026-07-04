/* ============================================================
   contact-init.js  –  Contact-page specific initialisation
   ============================================================ */
const ContactInit = (() => {
  'use strict';

  let contactData = null;

  const loadData = async () => {
    contactData = await Api.load('contact.json');
    return contactData;
  };

  /* ── Render: FAQ section ────────────────────────────────────── */
  const renderFAQ = () => {
    const container = document.getElementById('contactFaqItems');
    if (!container || !contactData) return;

    const faqItems = contactData.faq || [];
    container.innerHTML = faqItems.map(item => {
      const question = Language.t(item.questionKey);
      const answer = Language.t(item.answerKey);
      return `
        <div class="faq-item">
          <button class="faq-question">${question} <span class="faq-icon"><i class="bi bi-plus"></i></span></button>
          <div class="faq-answer"><div class="faq-answer-inner">${answer}</div></div>
        </div>`;
    }).join('');
  };

  /* ── Init FAQ accordion ─────────────────────────────────────── */
  const initFAQAccordion = () => {
    const container = document.getElementById('contactFaqItems');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-question');
      if (!btn) return;

      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');

      // Close all FAQ items in this container
      container.querySelectorAll('.faq-item').forEach(fi => {
        fi.classList.remove('is-open');
        const icon = fi.querySelector('.faq-icon i');
        if (icon) icon.className = 'bi bi-plus';
      });

      // Toggle clicked item
      if (!isOpen) {
        item.classList.add('is-open');
        const icon = item.querySelector('.faq-icon i');
        if (icon) icon.className = 'bi bi-dash';
      }
    });
  };

  /* ── Update select options for language change ──────────────── */
  const updateServiceOptions = () => {
    const select = document.getElementById('service');
    if (!select) return;

    const currentVal = select.value;
    const t = Language.t;

    select.innerHTML = `<option value="">${t('contact.servicePlaceholder')}</option>` +
      `<option value="Construction Works">${t('contact.serviceOption1')}</option>` +
      `<option value="Equipment Rental">${t('contact.serviceOption2')}</option>` +
      `<option value="Transportation">${t('contact.serviceOption3')}</option>` +
      `<option value="Manpower Supply">${t('contact.serviceOption4')}</option>` +
      `<option value="Integrated Solutions">${t('contact.serviceOption5')}</option>`;

    // Restore selection if possible
    if (currentVal) select.value = currentVal;
  };

  /* ── Render everything ──────────────────────────────────────── */
  const renderAll = () => {
    renderFAQ();
    initFAQAccordion();
    updateServiceOptions();
  };

  /* ── Init ───────────────────────────────────────────────────── */
  const init = async () => {
    await loadData();
    renderAll();
    ContactForm.init();
    Utils.initAOS();
  };

  const onLanguageChanged = () => {
    renderAll();
    Utils.refreshAOS();
  };

  document.addEventListener('app:ready', (e) => {
    if (e.detail && e.detail.page === 'contact') init();
  });

  document.addEventListener('language:changed', () => {
    onLanguageChanged();
  });

  return { init, renderAll, loadData };
})();
