import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const BRAIN_DIR = 'C:\\Users\\bekas\\.gemini\\antigravity\\brain\\6ff5f753-b559-44aa-82b1-1db108bfb200';
const ASSETS_DIR = path.resolve('assets');

const files = [
  { src: 'therapy_room_1_1779878029296.png', dest: 'therapy_room_1' },
  { src: 'therapy_room_2_1779878050489.png', dest: 'therapy_room_2' },
  { src: 'therapy_room_3_1779878191147.png', dest: 'therapy_room_3' },
  { src: 'therapy_room_4_1779878207986.png', dest: 'therapy_room_4' }
];

async function main() {
  console.log('Optimizing generated therapy room images...');

  for (const f of files) {
    const srcPath = path.join(BRAIN_DIR, f.src);
    const pngDest = path.join(ASSETS_DIR, `${f.dest}.png`);
    const webpDest = path.join(ASSETS_DIR, `${f.dest}.webp`);

    console.log(`Processing ${f.src} -> ${f.dest}`);

    // PNG
    await sharp(srcPath)
      .resize({ width: 800, withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
      .toFile(pngDest);

    // WebP
    await sharp(srcPath)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toFile(webpDest);
  }

  console.log('Done optimizing therapy room images!');
}

main().catch(err => {
  console.error('Error optimizing room images:', err);
  process.exit(1);
});
