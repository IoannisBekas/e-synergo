// Process user's new icons: recolor to brand-blue, rename, replace old ones
import { readFile, writeFile, unlink, readdir } from 'node:fs/promises';
import path from 'node:path';

const ASSETS = path.resolve('assets');
const BRAND_BLUE = '#7A99B7';
const ORIGINAL_BLACK = /#231f20/gi;

// Mapping: source file → destination file
const tasks = [
  { src: 'call.svg',     dst: 'icon-phone.svg' },     // overwrites old phone icon
  { src: 'mail.svg',     dst: 'icon-mail.svg' },      // overwrites old mail icon
  { src: 'location.svg', dst: 'icon-address.svg' },   // overwrites old address icon
  { src: 'chatroom.svg', dst: 'icon-chat.svg' },      // new icon for future use
  { src: 'website.svg',  dst: 'icon-website.svg' },   // new icon for future use
];

for (const t of tasks) {
  const srcPath = path.join(ASSETS, t.src);
  const dstPath = path.join(ASSETS, t.dst);

  let svg = await readFile(srcPath, 'utf8');
  const matches = (svg.match(ORIGINAL_BLACK) || []).length;
  svg = svg.replace(ORIGINAL_BLACK, BRAND_BLUE);

  await writeFile(dstPath, svg, 'utf8');
  console.log(`✓ ${t.src} → ${t.dst}  (recolored ${matches} fill values to ${BRAND_BLUE})`);

  // Remove the original (now we have the renamed brand-colored copy)
  await unlink(srcPath);
}

// Clean up preview files
const previews = (await readdir(ASSETS)).filter(f => f.startsWith('_preview-'));
for (const f of previews) {
  await unlink(path.join(ASSETS, f));
}
if (previews.length) console.log(`\n✓ removed ${previews.length} preview file(s)`);

console.log('\nDone. Icons now in brand color and ready to use.');
