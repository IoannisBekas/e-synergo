// Polish header: bigger logo, larger nav text, more breathing room
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const replacements = [
  // Header padding (more vertical breathing room)
  [
    'class="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4"',
    'class="max-w-7xl mx-auto px-5 py-5 flex items-center justify-between gap-4"',
  ],
  // Main pages logo: h-24/28/32 → h-28/32/36 (+1 step), add xl:h-40
  [
    'class="h-24 md:h-28 lg:h-32 w-auto group-hover:scale-105 transition"',
    'class="h-28 md:h-32 lg:h-36 xl:h-40 w-auto group-hover:scale-105 transition"',
  ],
  // Privacy/Cookies logo (simpler): h-24/28 → h-28/32
  [
    'class="h-24 md:h-28 w-auto group-hover:scale-105 transition"',
    'class="h-28 md:h-32 w-auto group-hover:scale-105 transition"',
  ],
  // Nav UL: bigger text + gap
  [
    'class="hidden lg:flex items-center gap-5 lg:gap-7 text-sm font-semibold"',
    'class="hidden lg:flex items-center gap-6 xl:gap-9 text-base font-semibold"',
  ],
  // CTA button: slightly larger
  [
    'class="hidden md:inline-flex items-center gap-2 bg-brand-purple text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-brand-purple-dark transition shadow-md shrink-0"',
    'class="hidden md:inline-flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-full font-bold text-base hover:bg-brand-purple-dark transition shadow-md shrink-0"',
  ],
  // CTA on subpages (simpler version)
  [
    'class="hidden md:inline-flex items-center gap-2 bg-brand-purple text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-brand-purple-dark transition shadow-md"',
    'class="hidden md:inline-flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-full font-bold text-base hover:bg-brand-purple-dark transition shadow-md"',
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
    const count = c.split(a).length - 1;
    if (count > 0) {
      c = c.split(a).join(b);
      n += count;
    }
  }
  if (c !== before) {
    await writeFile(file, c, 'utf8');
    console.log(`✓ ${path.relative('.', file)}: ${n} replacement(s)`);
  }
}
