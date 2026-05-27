import sharp from 'sharp';
import path from 'node:path';

const ASSETS_DIR = path.resolve('assets');

const tasks = [
  { input: 'header-logo-desktop.png',  webp: 'header-logo-desktop.webp',  width: 800 },
  { input: 'header-logo-mobile.png',   webp: 'header-logo-mobile.webp',   width: 500 },
  { input: 'footer-logo.png',          webp: 'footer-logo.webp',          width: 600 },
  { input: 'logo.png',                 webp: 'logo.webp',                 width: 800 }
];

async function main() {
  console.log('Trimming transparent padding from logo images and regenerating WebP copies...');

  for (const t of tasks) {
    const inputPath = path.join(ASSETS_DIR, t.input);
    const webpPath = path.join(ASSETS_DIR, t.webp);

    console.log(`Trimming & optimizing ${t.input} -> ${t.webp}`);

    // Read the file, trim transparent borders, and resize
    const trimmedBuffer = await sharp(inputPath)
      .trim() // automatically trims transparent edges
      .resize({ width: t.width, withoutEnlargement: true })
      .toBuffer();

    // Overwrite the PNG with the trimmed and resized version
    await sharp(trimmedBuffer)
      .png({ compressionLevel: 9, palette: false, effort: 10 })
      .toFile(inputPath);

    // Write the WebP version
    await sharp(trimmedBuffer)
      .webp({ quality: 90, effort: 6 })
      .toFile(webpPath);
  }

  console.log('\nAll logos trimmed and optimized successfully!');
}

main().catch(err => {
  console.error('Error trimming logos:', err);
  process.exit(1);
});
