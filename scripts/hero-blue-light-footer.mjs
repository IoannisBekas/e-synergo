// 1) Hero headline: both lines blue (match mockup)
// 2) Footer: switch from dark to LIGHT theme (white bg, blue text, colored social icons)
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// ---------- HERO (index.html only) ----------
// "Σε κάθε βήμα." line should be brand-purple like "Μαζί."
const heroOld = `<span class="text-brand-ink">Σε κάθε βήμα.</span>`;
const heroNew = `<span class="text-brand-purple">Σε κάθε βήμα.</span>`;

// ---------- LIGHT FOOTER ----------
// Replace the entire dark footer with a clean light-theme version.
// We'll match the old footer's outer pattern and replace its inner styling.

const LIGHT_FOOTER_SOCIAL = `<div class="flex items-center gap-3">
            <a href="tel:+302102403368" aria-label="Τηλέφωνο" class="w-10 h-10 rounded-full bg-brand-yellow/30 hover:bg-brand-yellow/50 flex items-center justify-center transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A12E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
            <a href="https://www.instagram.com/e_synergo/" target="_blank" rel="noopener" aria-label="Instagram" class="w-10 h-10 rounded-full bg-brand-pink/30 hover:bg-brand-pink/50 flex items-center justify-center transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#C76B82" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.2-.1 1.6-.1 4.8-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.3-8.3a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z"/></svg>
            </a>
            <a href="#" target="_blank" rel="noopener" aria-label="Facebook" class="w-10 h-10 rounded-full bg-brand-blue/30 hover:bg-brand-blue/50 flex items-center justify-center transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0267C1" aria-hidden="true"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
            </a>
          </div>`;

const replacements = [
  // === HERO ===
  [heroOld, heroNew],

  // === FOOTER: outer container ===
  [
    '<footer class="bg-brand-ink text-white/85 pt-16 pb-8">',
    '<footer class="bg-white text-brand-ink border-t border-brand-purple/10 pt-16 pb-8">',
  ],

  // === FOOTER: logo wrapper (remove white card on light bg) ===
  [
    '<div class="bg-white/95 inline-block rounded-2xl p-3 mb-5">\n            <img src="/assets/brand-logo-footer.webp"',
    '<div class="mb-5">\n            <img src="/assets/brand-logo-footer.webp"',
  ],

  // === FOOTER: tagline color ===
  [
    '<p class="font-bold text-white mb-4">Μαζί. Σε κάθε βήμα.</p>',
    '<p class="font-bold text-brand-purple mb-4">Μαζί. Σε κάθε βήμα.</p>',
  ],

  // === FOOTER: replace 2 social icons block with 3 colored ones ===
  [
    /<div class="flex items-center gap-3">\s*<a href="https:\/\/www\.instagram\.com\/e_synergo\/" target="_blank" rel="noopener" aria-label="Instagram" class="w-10 h-10 rounded-full bg-white\/10 hover:bg-white\/20[\s\S]*?<\/a>\s*<a href="#" target="_blank" rel="noopener" aria-label="Facebook" class="w-10 h-10 rounded-full bg-white\/10 hover:bg-white\/20[\s\S]*?<\/a>\s*<\/div>/,
    LIGHT_FOOTER_SOCIAL,
  ],

  // === FOOTER: column headers (text-white → text-brand-ink) ===
  [
    /<h4 class="font-bold text-white mb-4 text-sm uppercase tracking-wider">/g,
    '<h4 class="font-bold text-brand-ink mb-4 text-sm uppercase tracking-wider">',
  ],

  // === FOOTER: link hover color (yellow → brand-purple) ===
  [
    /class="hover:text-brand-yellow transition"/g,
    'class="hover:text-brand-purple transition"',
  ],

  // === FOOTER: Επικοινωνία icon filter (remove white inversion) ===
  [
    /style="filter: brightness\(0\) invert\(1\); opacity: 0\.85"/g,
    '',
  ],

  // === FOOTER: Map border ===
  [
    'border border-white/10 hover:scale-[1.02]',
    'border border-brand-purple/15 hover:scale-[1.02]',
  ],

  // === FOOTER: Bottom bar border + text colors ===
  [
    '<div class="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/55">',
    '<div class="border-t border-brand-purple/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brand-muted">',
  ],

  // === FOOTER: bottom legal links hover (yellow → brand-purple) ===
  // Already covered by global hover-text-brand-yellow replacement above

  // === Footer phone tel link "hover:text-brand-yellow" inside contact list ===
  // Some lis use just hover:text-brand-yellow (no transition). Handle both.
  [
    /class="hover:text-brand-yellow"/g,
    'class="hover:text-brand-purple"',
  ],

  // === FOOTER: phone link "hover:text-brand-yellow break-all" variants ===
  [
    /class="hover:text-brand-yellow break-all/g,
    'class="hover:text-brand-purple break-all',
  ],
];

async function findHtml(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules','.git','scripts','src','assets'].includes(e.name)) {
      out.push(...(await findHtml(full)));
    } else if (e.isFile() && e.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

const files = await findHtml('.');
for (const file of files) {
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
    console.log(`✓ ${path.relative('.', file)}: ${n} change(s)`);
  }
}
