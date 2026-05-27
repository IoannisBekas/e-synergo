// Two fixes:
// 1. Remove duplicate "Πώς ξεκινάμε μαζί" section in about/index.html
// 2. Revert header polish bumps that broke nav layout (too big logo)
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// ========================================================================
// 1) Remove duplicate process section in about
// ========================================================================
{
  const file = 'about/index.html';
  let c = await readFile(file, 'utf8');

  // Match the "Η ΔΙΑΔΙΚΑΣΙΑ" block (uniform across both duplicates)
  // Replace only the FIRST occurrence (so the second remains, which is
  // structurally adjacent to the CTA).
  const blockRegex = /[ \t]*<!-- ============ Η ΔΙΑΔΙΚΑΣΙΑ ============ -->[\s\S]*?<\/section>\r?\n\r?\n/;

  const matches = c.match(/<!-- ============ Η ΔΙΑΔΙΚΑΣΙΑ ============ -->/g) || [];
  if (matches.length >= 2) {
    // Remove first occurrence
    c = c.replace(blockRegex, '');
    await writeFile(file, c, 'utf8');
    console.log(`✓ about/index.html: removed duplicate process section (${matches.length} → ${matches.length - 1})`);
  } else {
    console.log(`  about/index.html: only ${matches.length} process section, no duplicate to remove`);
  }
}

// ========================================================================
// 2) Revert header polish (logo too big caused nav to wrap)
// ========================================================================
const headerRevert = [
  // Logo: rollback the polish bump on main pages
  [
    'class="h-28 md:h-32 lg:h-36 xl:h-40 w-auto group-hover:scale-105 transition"',
    'class="h-24 md:h-28 lg:h-32 w-auto group-hover:scale-105 transition"',
  ],
  // Logo: rollback on privacy/cookies
  [
    'class="h-28 md:h-32 w-auto group-hover:scale-105 transition"',
    'class="h-24 md:h-28 w-auto group-hover:scale-105 transition"',
  ],
  // Nav: smaller text + tighter gap so it fits in one row
  [
    'class="hidden lg:flex items-center gap-6 xl:gap-9 text-base font-semibold"',
    'class="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-semibold"',
  ],
  // CTA: smaller again so layout fits
  [
    'class="hidden md:inline-flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-full font-bold text-base hover:bg-brand-purple-dark transition shadow-md shrink-0"',
    'class="hidden md:inline-flex items-center gap-2 bg-brand-purple text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-brand-purple-dark transition shadow-md shrink-0"',
  ],
  [
    'class="hidden md:inline-flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-full font-bold text-base hover:bg-brand-purple-dark transition shadow-md"',
    'class="hidden md:inline-flex items-center gap-2 bg-brand-purple text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-brand-purple-dark transition shadow-md"',
  ],
  // Keep py-5 (the breathing room is good) — don't revert that
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
  for (const [a, b] of headerRevert) {
    const count = c.split(a).length - 1;
    if (count > 0) {
      c = c.split(a).join(b);
      n += count;
    }
  }
  if (c !== before) {
    await writeFile(file, c, 'utf8');
    console.log(`✓ ${path.relative('.', file)}: ${n} header revert(s)`);
  }
}
