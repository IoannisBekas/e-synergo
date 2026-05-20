// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    menu.classList.add('hidden-menu');
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open-menu');
      menu.classList.toggle('hidden-menu', !isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // FAQ accordion
  document.querySelectorAll('[data-faq]').forEach(item => {
    const btn = item.querySelector('button');
    const panel = item.querySelector('[data-panel]');
    if (!btn || !panel) return;
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Scroll-reveal animations (intersection observer)
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  // Contact form (front-end stub — wire to Formspree/Web3Forms in production)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      if (!form.gdpr.checked) {
        status.textContent = 'Παρακαλώ αποδεχτείτε τους όρους επεξεργασίας δεδομένων.';
        status.className = 'mt-4 text-sm text-red-600';
        return;
      }
      // TODO: replace with real endpoint (Formspree / Web3Forms / your backend)
      status.textContent = 'Ευχαριστούμε! Θα επικοινωνήσουμε μαζί σας σύντομα. (Demo — δεν στάλθηκε email — απαιτείται integration)';
      status.className = 'mt-4 text-sm text-emerald-700';
      form.reset();
    });
  }
});
