// Fix footer left column alignment + broken Instagram icon
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// Proper Instagram SVG with separate paths for outer ring, lens, and dot
const PROPER_IG_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="#C76B82" aria-hidden="true"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10z"/><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/><circle cx="17.5" cy="6.5" r="1.2"/></svg>`;

// Old broken IG SVG pattern (single-path version that renders as filled square)
const OLD_IG_SVG_REGEX = /<svg width="18" height="18" viewBox="0 0 24 24" fill="#C76B82" aria-hidden="true"><path d="M12 2\.2c3\.2 0[^"]*"\/><\/svg>/g;

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

  // 1) Fix Instagram SVG
  const igMatches = c.match(OLD_IG_SVG_REGEX);
  if (igMatches) {
    c = c.replace(OLD_IG_SVG_REGEX, PROPER_IG_SVG);
    n += igMatches.length;
  }

  // 2) Logo column alignment — wrap logo+tagline+social into flex flex-col items-start
  // Pattern: the column starts with <div class="md:col-span-3"> then has img + p + div
  c = c.replace(
    /<div class="md:col-span-3">[\s\S]*?<div class="mb-5">\s*<img src="\/assets\/footer-logo\.webp"([^>]+)\/>\s*<\/div>\s*<p class="font-bold text-brand-purple mb-4">/,
    `<div class="md:col-span-3 flex flex-col items-start gap-5">
          <img src="/assets/brand-logo-footer.webp"$1/>
          <p class="font-bold text-brand-purple">`
  );

  // Also strip mb-5/mb-4 from the wrapped items since we use gap now
  // (Already handled in replacement above)

  if (c !== before) {
    await writeFile(file, c, 'utf8');
    const diff = (c.length - before.length);
    console.log(`✓ ${path.relative('.', file)}: ${n} IG fix(es), wrapper restructure (Δ${diff > 0 ? '+' : ''}${diff} chars)`);
  }
}
