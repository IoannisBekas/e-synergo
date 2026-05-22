// One-off: WebP versions of the new designer assets
import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const ASSETS = path.resolve('assets');

const targets = [
  { input: 'family.png',               webp: 'family.webp',               maxWidth: 900 },
  { input: 'mascot.png',               webp: 'mascot.webp',               maxWidth: 900 },
  { input: 'header-logo-desktop.png',  webp: 'header-logo-desktop.webp',  maxWidth: 600 },
  { input: 'header-logo-mobile.png',   webp: 'header-logo-mobile.webp',   maxWidth: 400 },
  { input: 'footer-logo.png',          webp: 'footer-logo.webp',          maxWidth: 500 },
];

const kb = (b) => (b / 1024).toFixed(1) + ' KB';

for (const t of targets) {
  const inp = path.join(ASSETS, t.input);
  const out = path.join(ASSETS, t.webp);
  await sharp(inp)
    .resize({ width: t.maxWidth, withoutEnlargement: true })
    .webp({ quality: 90, effort: 6 })
    .toFile(out);
  const before = await stat(inp);
  const after = await stat(out);
  console.log(`${t.input}: ${kb(before.size)} → ${kb(after.size)} (WebP)`);
}
console.log('\nDone.');
