// Upgrade hero mascot + header/footer logos from new F1_SYNERGW source files
import sharp from 'sharp';
import { stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const ASSETS = path.resolve('assets');
const kb = b => (b / 1024).toFixed(1) + ' KB';

const tasks = [
  // ---- HERO MASCOT (from F1_SYNERGW-06, the tight-cropped color version) ----
  { src: 'F1_SYNERGW-06.png', out: 'mascot.webp',  width: 800, format: 'webp', quality: 92, label: 'Mascot WebP' },
  { src: 'F1_SYNERGW-06.png', out: 'mascot.png',   width: 800, format: 'png',  label: 'Mascot PNG (fallback)' },

  // ---- HEADER DESKTOP LOGO (from F1_SYNERGW-01 — full logo with text) ----
  { src: 'F1_SYNERGW-01.png', out: 'header-logo-desktop.webp', width: 800, format: 'webp', quality: 90, label: 'Header desktop WebP' },
  { src: 'F1_SYNERGW-01.png', out: 'header-logo-desktop.png',  width: 800, format: 'png', label: 'Header desktop PNG' },

  // ---- HEADER MOBILE LOGO (smaller version) ----
  { src: 'F1_SYNERGW-01.png', out: 'header-logo-mobile.webp', width: 500, format: 'webp', quality: 90, label: 'Header mobile WebP' },
  { src: 'F1_SYNERGW-01.png', out: 'header-logo-mobile.png',  width: 500, format: 'png', label: 'Header mobile PNG' },

  // ---- FOOTER LOGO ----
  { src: 'F1_SYNERGW-01.png', out: 'footer-logo.webp', width: 600, format: 'webp', quality: 90, label: 'Footer WebP' },
  { src: 'F1_SYNERGW-01.png', out: 'footer-logo.png',  width: 600, format: 'png', label: 'Footer PNG' },
];

console.log('Generating optimized assets from new F1 source files...\n');

for (const t of tasks) {
  const inp = path.join(ASSETS, t.src);
  const out = path.join(ASSETS, t.out);

  let before = 0;
  try { before = (await stat(out)).size; } catch {}

  const pipeline = sharp(inp).resize({ width: t.width, withoutEnlargement: true });

  if (t.format === 'webp') {
    await pipeline.webp({ quality: t.quality, effort: 6 }).toFile(out);
  } else {
    await pipeline.png({ compressionLevel: 9, palette: false, effort: 10 }).toFile(out);
  }

  const after = (await stat(out)).size;
  const change = before ? ` (was ${kb(before)})` : ' (new)';
  console.log(`✓ ${t.label.padEnd(22)} → ${t.out.padEnd(30)} ${kb(after)}${change}`);
}

// ---- Cleanup: delete F1_SYNERGW source files (no longer needed in repo) ----
console.log('\nCleaning up source files (they were just for generation)...');
const cleanup = [
  'F1_SYNERGW.png',
  'F1_SYNERGW-01.png',
  'F1_SYNERGW-02.png',
  'F1_SYNERGW-03.png',
  'F1_SYNERGW-05.png',
  'F1_SYNERGW-06.png',
  'F1_SYNERGW-07.png',
];

for (const f of cleanup) {
  try {
    await unlink(path.join(ASSETS, f));
    console.log(`✓ removed ${f}`);
  } catch (e) {
    console.log(`  ${f}: ${e.code === 'ENOENT' ? 'already gone' : 'error: ' + e.message}`);
  }
}

console.log('\nDone! Run: npm run build:css if needed.');
