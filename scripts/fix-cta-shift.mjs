// Fix nav shift between pages by giving the header CTA a consistent min-width
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// Add min-w-[180px] justify-center to all variants of the header CTA button
const replacements = [
  // Main pages CTA (with shrink-0)
  [
    'class="hidden md:inline-flex items-center gap-2 bg-brand-purple text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-brand-purple-dark transition shadow-md shrink-0"',
    'class="hidden md:inline-flex items-center justify-center gap-2 bg-brand-purple text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-brand-purple-dark transition shadow-md shrink-0 min-w-[180px] whitespace-nowrap"',
  ],
  // Contact page CTA (no shrink-0)
  [
    'class="hidden md:inline-flex items-center gap-2 bg-brand-purple text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-brand-purple-dark transition shadow-md"',
    'class="hidden md:inline-flex items-center justify-center gap-2 bg-brand-purple text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-brand-purple-dark transition shadow-md shrink-0 min-w-[180px] whitespace-nowrap"',
  ],
];

async function findHtml(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', '.git', 'scripts', 'src', 'assets'].includes(e.name)) {
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
    console.log(`✓ ${path.relative('.', file)}: ${n} CTA fix(es)`);
  }
}
