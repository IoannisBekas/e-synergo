// Update privacy + cookies pages to match the light theme of the main pages
import { readFile, writeFile } from 'node:fs/promises';

const NEW_LEGAL_FOOTER = `  <!-- FOOTER -->
  <footer class="bg-white text-brand-ink border-t border-brand-purple/10 pt-12 pb-8 mt-16">
    <div class="border-t border-brand-purple/10 pt-6 max-w-7xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-brand-muted">
      <p>© <span id="year"></span> e_synergo — ΣυνΕργώ.</p>
      <div class="flex gap-4">
        <a href="/privacy/" class="hover:text-brand-purple transition">Πολιτική Απορρήτου</a>
        <a href="/cookies/" class="hover:text-brand-purple transition">Πολιτική Cookies</a>
        <a href="/" class="hover:text-brand-purple transition">Αρχική</a>
      </div>
    </div>
  </footer>`;

const replacements = [
  // Match the entire old dark footer block on the legal pages
  [
    /  <!-- FOOTER -->\r?\n  <footer class="bg-brand-ink[\s\S]*?<\/footer>/,
    NEW_LEGAL_FOOTER,
  ],
  // Bump logo size to match main pages
  [
    'class="h-20 md:h-24 w-auto group-hover:scale-105 transition"',
    'class="h-24 md:h-28 lg:h-32 w-auto group-hover:scale-105 transition"',
  ],
  // Bump header padding to match main pages
  [
    '<nav class="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between" aria-label="Κύρια πλοήγηση">',
    '<nav class="max-w-7xl mx-auto px-5 py-5 flex items-center justify-between" aria-label="Κύρια πλοήγηση">',
  ],
];

for (const file of ['privacy/index.html', 'cookies/index.html']) {
  let c = await readFile(file, 'utf8');
  const before = c;
  let n = 0;
  for (const [a, b] of replacements) {
    if (a instanceof RegExp) {
      const matches = c.match(a);
      if (matches) {
        c = c.replace(a, b);
        n += matches.length;
      }
    } else {
      const count = c.split(a).length - 1;
      if (count > 0) {
        c = c.split(a).join(b);
        n += count;
      }
    }
  }
  if (c !== before) {
    await writeFile(file, c, 'utf8');
    console.log(`✓ ${file}: ${n} change(s)`);
  } else {
    console.log(`  ${file}: no change`);
  }
}
