// Increase header logo size across all pages
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// Old sizes → new sizes (bumped 2 steps bigger)
const replacements = [
  // Main pages: h-16 md:h-20 lg:h-24 → h-24 md:h-32 lg:h-36
  ['class="h-16 md:h-20 lg:h-24 w-auto', 'class="h-24 md:h-32 lg:h-36 w-auto'],
  // Privacy/cookies (simpler nav): h-16 md:h-20 → h-24 md:h-28
  ['class="h-16 md:h-20 w-auto', 'class="h-24 md:h-28 w-auto'],
];

// Find all index.html files (root + subfolders)
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
  let content = await readFile(file, 'utf8');
  const before = content;
  let changes = 0;

  for (const [from, to] of replacements) {
    const count = (content.match(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (count > 0) {
      content = content.split(from).join(to);
      changes += count;
    }
  }

  if (changes > 0) {
    await writeFile(file, content, 'utf8');
    console.log(`✓ ${file}: ${changes} change(s)`);
  } else {
    console.log(`  ${file}: no header logo found`);
  }
}
