// Image optimization script — generates WebP + optimized PNG copies
// Run: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ASSETS_DIR = path.resolve('assets');

const targets = [
  // [input, outputWebp, outputPngFallback, maxWidth]
  { input: 'logo.png', webp: 'logo.webp', png: 'logo.png', maxWidth: 800 },
  { input: 'BI Solutions.png', webp: 'BI Solutions.webp', png: 'BI Solutions.png', maxWidth: 400 },
];

const fmt = (b) => (b / 1024).toFixed(1) + ' KB';

for (const t of targets) {
  const inputPath = path.join(ASSETS_DIR, t.input);
  const webpPath = path.join(ASSETS_DIR, t.webp);
  const pngPath = path.join(ASSETS_DIR, t.png);

  const beforeStat = await stat(inputPath);

  // WebP — high-quality, lossy
  await sharp(inputPath)
    .resize({ width: t.maxWidth, withoutEnlargement: true })
    .webp({ quality: 88, effort: 6 })
    .toFile(webpPath);

  // PNG fallback — optimized
  await sharp(inputPath)
    .resize({ width: t.maxWidth, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
    .toFile(pngPath + '.tmp');

  // Replace original PNG only if smaller
  const { rename, unlink } = await import('node:fs/promises');
  const tmpStat = await stat(pngPath + '.tmp');
  if (tmpStat.size < beforeStat.size) {
    await rename(pngPath + '.tmp', pngPath);
  } else {
    await unlink(pngPath + '.tmp');
  }

  const webpStat = await stat(webpPath);
  const afterPngStat = await stat(pngPath);

  console.log(`${t.input}:`);
  console.log(`  PNG: ${fmt(beforeStat.size)} → ${fmt(afterPngStat.size)}`);
  console.log(`  WebP: ${fmt(webpStat.size)}`);
}

console.log('\nDone.');
