// ============================================================
// e_synergo — Site JavaScript
// ============================================================

// 👉 CONFIG: Replace this with your Formspree endpoint after signup at https://formspree.io
// Example: 'https://formspree.io/f/xpzgkqyz'
const FORMSPREE_ENDPOINT = '';

const CONSENT_KEY = 'esynergo_cookie_consent';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initYear();
  initFaqAccordion();
  initScrollReveal();
  initContactForm();
  initCookieBanner();
});

// ------- Mobile menu -------
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  menu.classList.add('hidden-menu');
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open-menu');
    menu.classList.toggle('hidden-menu', !isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// ------- Current year in footer -------
function initYear() {
  document.querySelectorAll('#year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

// ------- FAQ accordion -------
function initFaqAccordion() {
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
}

// ------- Scroll-reveal animations -------
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => io.observe(el));
}

// ------- Contact form (Formspree integration) -------
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // GDPR check
    if (!form.gdpr.checked) {
      setStatus(status, 'Παρακαλώ αποδεχτείτε τους όρους επεξεργασίας δεδομένων.', 'error');
      return;
    }

    // Honeypot anti-spam
    if (form.website && form.website.value) {
      setStatus(status, 'Σφάλμα. Δοκιμάστε ξανά.', 'error');
      return;
    }

    // If no Formspree endpoint configured, fall back to mailto
    if (!FORMSPREE_ENDPOINT) {
      setStatus(status, '⚠ Η φόρμα δεν έχει συνδεθεί ακόμα. Παρακαλώ καλέστε ή στείλτε email απευθείας.', 'warn');
      console.warn('[e_synergo] FORMSPREE_ENDPOINT not configured in assets/app.js');
      return;
    }

    // Submit to Formspree
    const formData = new FormData(form);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Αποστολή... <span aria-hidden="true">⏳</span>';
    }
    setStatus(status, 'Αποστολή...', 'info');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        setStatus(status, '✓ Ευχαριστούμε! Λάβαμε το μήνυμά σας και θα επικοινωνήσουμε εντός 24 ωρών.', 'success');
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data?.errors?.[0]?.message || 'Σφάλμα κατά την αποστολή. Παρακαλώ δοκιμάστε ξανά.';
        setStatus(status, '✗ ' + msg, 'error');
      }
    } catch (err) {
      setStatus(status, '✗ Σφάλμα δικτύου. Παρακαλώ ελέγξτε τη σύνδεσή σας και δοκιμάστε ξανά.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Αποστολή μηνύματος →';
      }
    }
  });
}

function setStatus(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  const cls = {
    success: 'mt-4 text-sm font-semibold text-emerald-700',
    error:   'mt-4 text-sm font-semibold text-red-600',
    warn:    'mt-4 text-sm font-semibold text-amber-700',
    info:    'mt-4 text-sm text-brand-muted'
  };
  el.className = cls[type] || cls.info;
}

// ------- Cookie consent banner -------
function initCookieBanner() {
  if (localStorage.getItem(CONSENT_KEY)) return; // already consented

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-labelledby', 'cookie-title');
  banner.className = 'fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-brand-purple/20 shadow-2xl no-print';
  banner.innerHTML = `
    <div class="max-w-6xl mx-auto px-5 py-5 md:py-6 flex flex-col md:flex-row items-start md:items-center gap-4">
      <div class="flex-1">
        <h2 id="cookie-title" class="font-bold mb-1">🍪 Χρησιμοποιούμε ελάχιστα cookies</h2>
        <p class="text-sm text-brand-muted">
          Μόνο τα απολύτως απαραίτητα για τη λειτουργία του site. Δεν κάνουμε tracking ή marketing.
          <a href="cookies.html" class="text-brand-purple underline">Μάθετε περισσότερα</a>.
        </p>
      </div>
      <div class="flex gap-3 shrink-0">
        <button id="cookie-accept" class="bg-brand-purple text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-brand-purple-dark transition">
          Εντάξει
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ essential: true, ts: Date.now() }));
    banner.style.transition = 'transform 0.3s, opacity 0.3s';
    banner.style.transform = 'translateY(100%)';
    banner.style.opacity = '0';
    setTimeout(() => banner.remove(), 300);
  });
}
