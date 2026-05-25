// Bump logo sizes across all HTML files (header + footer logos)
import { readFile, writeFile, readdir } from 'node:fs/promises';

const replacements = [
  // Header logos (4 main pages with lg:h-16)
  ['class="h-12 md:h-14 lg:h-16 w-auto', 'class="h-16 md:h-20 lg:h-24 w-auto'],
  // Header logos (privacy/cookies, simpler)
  ['class="h-12 md:h-14 w-auto', 'class="h-16 md:h-20 w-auto'],
  // Footer logo (h-20 → h-28)
  ['footer-logo.webp" alt="ΣυνΕργώ — Κέντρο Ειδικών Θεραπειών — Βίγλα Ελένη" class="h-20 w-auto"',
   'footer-logo.webp" alt="ΣυνΕργώ — Κέντρο Ειδικών Θεραπειών — Βίγλα Ελένη" class="h-28 w-auto"'],
];

const files = (await readdir('.')).filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = await readFile(file, 'utf8');
  const before = content;
  let changes = 0;

  for (const [from, to] of replacements) {
    const count = (content.match(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    content = content.split(from).join(to);
    changes += count;
  }

  if (content !== before) {
    await writeFile(file, content, 'utf8');
    console.log(`✓ ${file}: ${changes} logo size changes`);
  } else {
    console.log(`  ${file}: no logos to update`);
  }
}
