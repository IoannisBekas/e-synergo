// Modest header logo size bump (between original and the too-big version)
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const replacements = [
  // Main pages: h-16 md:h-20 lg:h-24 → h-20 md:h-24 lg:h-28
  ['class="h-16 md:h-20 lg:h-24 w-auto', 'class="h-20 md:h-24 lg:h-28 w-auto'],
  // Privacy/cookies: h-16 md:h-20 → h-20 md:h-24
  ['class="h-16 md:h-20 w-auto', 'class="h-20 md:h-24 w-auto'],
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
  let n = 0;
  for (const [a, b] of replacements) {
    const m = (c.match(new RegExp(a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (m) { c = c.split(a).join(b); n += m; }
  }
  if (n > 0) { await writeFile(file, c, 'utf8'); console.log(`✓ ${file}: ${n}`); }
}
