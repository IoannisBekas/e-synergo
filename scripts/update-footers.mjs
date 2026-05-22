// One-off: replace the old footer block in services/about/contact pages
// with the new restructured footer (matching the index.html footer).
import { readFile, writeFile } from 'node:fs/promises';

const NEW_FOOTER = `  <footer class="bg-brand-ink text-white/85 pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-5">
      <div class="grid md:grid-cols-12 gap-8 mb-10">
        <!-- Logo + tagline + social -->
        <div class="md:col-span-4">
          <div class="bg-white/95 inline-block rounded-2xl p-3 mb-5">
            <img src="assets/footer-logo.webp" alt="ΣυνΕργώ — Κέντρο Ειδικών Θεραπειών — Βίγλα Ελένη" class="h-20 w-auto" />
          </div>
          <p class="font-bold text-white mb-4">Μαζί. Σε κάθε βήμα.</p>
          <div class="flex items-center gap-3">
            <a href="https://www.instagram.com/e_synergo/" target="_blank" rel="noopener" aria-label="Instagram" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
              <img src="assets/icon-instagram.svg" alt="" class="w-5 h-5 brand-mark-light" style="opacity:0.9" />
            </a>
            <a href="#" target="_blank" rel="noopener" aria-label="Facebook" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
              <img src="assets/icon-facebook.svg" alt="" class="w-5 h-5 brand-mark-light" style="opacity:0.9" />
            </a>
          </div>
        </div>

        <!-- Μενού -->
        <div class="md:col-span-2">
          <h4 class="font-bold text-white mb-4 text-sm uppercase tracking-wider">Μενού</h4>
          <ul class="space-y-2.5 text-sm">
            <li><a href="index.html" class="hover:text-brand-yellow transition">Αρχική</a></li>
            <li><a href="services.html" class="hover:text-brand-yellow transition">Υπηρεσίες</a></li>
            <li><a href="about.html" class="hover:text-brand-yellow transition">Το Κέντρο</a></li>
            <li><a href="contact.html" class="hover:text-brand-yellow transition">Επικοινωνία</a></li>
          </ul>
        </div>

        <!-- Υπηρεσίες -->
        <div class="md:col-span-3">
          <h4 class="font-bold text-white mb-4 text-sm uppercase tracking-wider">Υπηρεσίες</h4>
          <ul class="space-y-2.5 text-sm">
            <li><a href="services.html#ergotherapy" class="hover:text-brand-yellow transition">Εργοθεραπεία</a></li>
            <li><a href="services.html#logotherapy" class="hover:text-brand-yellow transition">Λογοθεραπεία</a></li>
            <li><a href="services.html#special-education" class="hover:text-brand-yellow transition">Ειδικό μαθησιακό</a></li>
            <li><a href="services.html#psychology" class="hover:text-brand-yellow transition">Ψυχολογική υποστήριξη</a></li>
            <li><a href="services.html#parent-counseling" class="hover:text-brand-yellow transition">Συμβουλευτική γονέων</a></li>
            <li><a href="services.html#assessment" class="hover:text-brand-yellow transition">Αξιολόγηση & Εκτίμηση</a></li>
          </ul>
        </div>

        <!-- Επικοινωνία -->
        <div class="md:col-span-3">
          <h4 class="font-bold text-white mb-4 text-sm uppercase tracking-wider">Επικοινωνία</h4>
          <ul class="space-y-2.5 text-sm">
            <li class="flex gap-2"><span aria-hidden="true">📍</span> Σωκράτους 130<br>Αχαρναί</li>
            <li class="flex gap-2"><span aria-hidden="true">📞</span> <a href="tel:" class="hover:text-brand-yellow">[ Τηλέφωνο ]</a></li>
            <li class="flex gap-2"><span aria-hidden="true">✉️</span> <a href="mailto:vigla@e-synergo.gr" class="hover:text-brand-yellow break-all">vigla@e-synergo.gr</a></li>
            <li class="flex gap-2"><span aria-hidden="true">🕐</span> Δευ-Παρ 09:00-21:00</li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar: copyright + legal links + BI credit -->
      <div class="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/55">
        <div class="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
          <p>© <span id="year"></span> e_synergo — ΣυνΕργώ.</p>
          <a href="privacy.html" class="hover:text-brand-yellow transition">Πολιτική Απορρήτου</a>
          <a href="cookies.html" class="hover:text-brand-yellow transition">Πολιτική Cookies</a>
        </div>
        <a href="https://www.bisolutions.group/" target="_blank" rel="noopener" class="credit-line" aria-label="Σχεδιασμός & ανάπτυξη από BI Solutions">
          <span>Σχεδιασμός &amp; ανάπτυξη από</span>
          <span class="credit-divider"></span>
          <img src="assets/BI%20Solutions.webp" alt="BI Solutions" class="h-8 w-auto brand-mark-light" />
        </a>
      </div>
    </div>
  </footer>`;

const files = ['services.html', 'about.html', 'contact.html'];

for (const file of files) {
  const content = await readFile(file, 'utf8');
  const newContent = content.replace(
    /  <footer class="bg-brand-ink text-white\/85 pt-16 pb-8">[\s\S]*?<\/footer>/,
    NEW_FOOTER
  );
  if (content === newContent) {
    console.log(`⚠ ${file}: no footer match found`);
  } else {
    await writeFile(file, newContent, 'utf8');
    console.log(`✓ ${file}: footer replaced`);
  }
}
