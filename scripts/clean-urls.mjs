// Restructure pages into folders for clean URLs
// e.g. about.html → about/index.html
// Updates all internal links across all HTML files.

import { readFile, writeFile, readdir, mkdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';

// Pages to convert to folder structure
const pages = ['about', 'services', 'contact', 'privacy', 'cookies'];

// Link replacements (regex source, replacement)
// Order matters: longer/anchored first
const linkReplacements = [
  // index.html → /
  [/href="index\.html"/g, 'href="/"'],
  [/href="\.\/index\.html"/g, 'href="/"'],
  // page.html#anchor → /page/#anchor
  ...pages.map(p => [new RegExp(`href="${p}\\.html#`, 'g'), `href="/${p}/#`]),
  // page.html → /page/
  ...pages.map(p => [new RegExp(`href="${p}\\.html"`, 'g'), `href="/${p}/"`]),
];

// Asset paths: make absolute (root-relative) so they work from any depth
const assetReplacements = [
  [/src="assets\//g, 'src="/assets/'],
  [/href="assets\//g, 'href="/assets/'],
  [/srcset="assets\//g, 'srcset="/assets/'],
];

// Canonical URLs
const canonicalReplacements = [
  [/https:\/\/e-synergo\.gr\/index\.html/g, 'https://e-synergo.gr/'],
  ...pages.map(p => [
    new RegExp(`https://e-synergo\\.gr/${p}\\.html`, 'g'),
    `https://e-synergo.gr/${p}/`
  ]),
];

const allReplacements = [...linkReplacements, ...assetReplacements, ...canonicalReplacements];

// Step 1: process all HTML files (update links and assets paths)
const htmlFiles = (await readdir('.')).filter(f => f.endsWith('.html'));
console.log(`Processing ${htmlFiles.length} HTML files...\n`);

const processedContents = {};
for (const file of htmlFiles) {
  let content = await readFile(file, 'utf8');
  let changes = 0;
  for (const [re, rep] of allReplacements) {
    const matches = content.match(re);
    if (matches) changes += matches.length;
    content = content.replace(re, rep);
  }
  processedContents[file] = content;
  console.log(`✓ ${file}: ${changes} link/asset replacements`);
}

// Step 2: move page files into folders
console.log('\nMoving files into folder structure...');
for (const page of pages) {
  const src = `${page}.html`;
  const dir = page;
  const dest = path.join(dir, 'index.html');

  // Ensure folder exists
  try { await mkdir(dir, { recursive: true }); } catch {}

  // Check src exists
  try {
    await stat(src);
  } catch {
    console.log(`  ⚠ ${src}: not found, skipping`);
    continue;
  }

  // Write processed content to new location, then delete original
  await writeFile(dest, processedContents[src], 'utf8');
  await rename(src, src + '.bak'); // keep backup just in case
  console.log(`✓ ${src} → ${dest} (original kept as .bak)`);
}

// Step 3: rewrite index.html (kept at root)
if (processedContents['index.html']) {
  await writeFile('index.html', processedContents['index.html'], 'utf8');
  console.log(`✓ index.html (root) — links + assets updated`);
}

console.log('\nDone. Remember to:');
console.log('  1. Update tailwind.config.js content path to include subfolders');
console.log('  2. Run: npm run build:css');
console.log('  3. Delete .bak files once verified');
