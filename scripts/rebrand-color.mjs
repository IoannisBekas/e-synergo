// Global rebrand: replace #7A99B7 → #7A99B7 and #5C7A99 → #5C7A99 everywhere
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const OLD_BRAND = '#7A99B7';
const NEW_BRAND = '#7A99B7';
const OLD_BRAND_DARK = '#5C7A99';
const NEW_BRAND_DARK = '#5C7A99';

// Also case-insensitive variants
const replaceAll = (s, from, to) => {
  // Replace both exact case and lowercase
  return s.split(from).join(to).split(from.toLowerCase()).join(to);
};

async function findFiles(dir, exts, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', '.git'].includes(e.name)) {
      await findFiles(full, exts, out);
    } else if (e.isFile() && exts.some(ext => e.name.endsWith(ext))) {
      out.push(full);
    }
  }
  return out;
}

// Update HTML, SVG, CSS, JS files
const files = await findFiles('.', ['.html', '.svg', '.css', '.js', '.mjs']);

let totalChanges = 0;
for (const file of files) {
  let c = await readFile(file, 'utf8');
  const before = c;
  c = replaceAll(c, OLD_BRAND, NEW_BRAND);
  c = replaceAll(c, OLD_BRAND_DARK, NEW_BRAND_DARK);
  if (c !== before) {
    await writeFile(file, c, 'utf8');
    const oldCount = (before.match(new RegExp(OLD_BRAND, 'gi')) || []).length +
                     (before.match(new RegExp(OLD_BRAND_DARK, 'gi')) || []).length;
    console.log(`✓ ${path.relative('.', file)}: ${oldCount} replacement(s)`);
    totalChanges += oldCount;
  }
}

console.log(`\nTotal: ${totalChanges} replacements across ${files.length} scanned files`);
console.log(`Brand color: ${OLD_BRAND} → ${NEW_BRAND}`);
console.log(`Brand dark:  ${OLD_BRAND_DARK} → ${NEW_BRAND_DARK}`);
