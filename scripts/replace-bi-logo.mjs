// Replace <img> BI Solutions logo with inline SVG (so color is controlled by CSS)
import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';

const OLD = /<img src="assets\/BI%20Solutions\.webp" alt="BI Solutions" class="h-8 w-auto brand-mark-light" \/>/g;
const NEW = `<svg viewBox="0 0 240 100" class="h-7 w-auto" aria-hidden="true"><g stroke="currentColor" stroke-width="7" stroke-linecap="round" fill="none"><line x1="20" y1="22" x2="68" y2="22"/><line x1="20" y1="50" x2="68" y2="50"/><line x1="20" y1="78" x2="68" y2="78"/><path d="M 68 22 Q 96 36 68 50"/><path d="M 68 50 Q 96 64 68 78"/><line x1="135" y1="22" x2="215" y2="22"/><line x1="175" y1="22" x2="175" y2="72"/><line x1="135" y1="78" x2="215" y2="78"/></g></svg>`;

const files = (await readdir('.')).filter(f => f.endsWith('.html'));
for (const file of files) {
  const before = await readFile(file, 'utf8');
  const after = before.replace(OLD, NEW);
  if (before !== after) {
    await writeFile(file, after, 'utf8');
    const count = (before.match(OLD) || []).length;
    console.log(`✓ ${file}: ${count} replacement(s)`);
  } else {
    console.log(`  ${file}: no match`);
  }
}

// Clean up preview file
try { await unlink('assets/bi-logo-preview.png'); console.log('✓ removed preview file'); } catch {}
