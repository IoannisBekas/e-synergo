import sharp from 'sharp';
import { copyFile } from 'node:fs/promises';
import path from 'node:path';

const DESIGNER_DIR = path.resolve('assets/Assets from designer/ICONS SYNERGO');
const ASSETS_DIR = path.resolve('assets');

const tasks = [
  // Header Desktop
  { src: 'synergo-header-desktop-70px.png', destPng: 'header-logo-desktop.png', destWebp: 'header-logo-desktop.webp', width: 800 },
  // Logo metadata (duplicate of desktop header)
  { src: 'synergo-header-desktop-70px.png', destPng: 'logo.png', destWebp: 'logo.webp', width: 800 },
  // Header Mobile
  { src: 'synergo-header-mobile-52px.png', destPng: 'header-logo-mobile.png', destWebp: 'header-logo-mobile.webp', width: 500 },
  // Footer
  { src: 'synergo-footer-90px.png', destPng: 'footer-logo.png', destWebp: 'footer-logo.webp', width: 600 }
];

async function main() {
  console.log('Regenerating logos and favicons from correct designer files...\n');

  // Process image tasks
  for (const t of tasks) {
    const srcPath = path.join(DESIGNER_DIR, t.src);
    const pngPath = path.join(ASSETS_DIR, t.destPng);
    const webpPath = path.join(ASSETS_DIR, t.destWebp);

    console.log(`Processing ${t.src} -> ${t.destPng} & ${t.destWebp}`);

    // PNG
    await sharp(srcPath)
      .resize({ width: t.width, withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: false, effort: 10 })
      .toFile(pngPath);

    // WebP
    await sharp(srcPath)
      .resize({ width: t.width, withoutEnlargement: true })
      .webp({ quality: 90, effort: 6 })
      .toFile(webpPath);
  }

  // Favicons copying
  const faviconTasks = [
    { src: 'synergo-favicon-32x32.png', dest: 'favicon-32.png' },
    { src: 'synergo-favicon-48x48.png', dest: 'favicon-48.png' },
    { src: 'synergo-favicon-180x180.png', dest: 'apple-touch-icon.png' }
  ];

  for (const f of faviconTasks) {
    const srcPath = path.join(DESIGNER_DIR, f.src);
    const destPath = path.join(ASSETS_DIR, f.dest);
    console.log(`Copying ${f.src} -> ${f.dest}`);
    await copyFile(srcPath, destPath);
  }

  console.log('\nLogo regeneration finished successfully!');
}

main().catch(err => {
  console.error('Error updating logos:', err);
  process.exit(1);
});
