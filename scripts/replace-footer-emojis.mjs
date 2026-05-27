// Replace emoji icons in footer Επικοινωνία column with proper SVG icons
import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';

// Build common icon snippet. Icons use brand-blue fill, on dark footer
// we want them light → apply CSS filter via inline style.
const iconCls = 'w-4 h-4 mt-1 shrink-0';
// brightness(0) invert(1) turns blue → white. Same trick as BI Solutions credit.
const iconStyle = 'filter: brightness(0) invert(1); opacity: 0.85';

const replacements = [
  // Address (📍 → icon-address.svg)
  [
    /<li class="flex gap-2"><span aria-hidden="true">📍<\/span>\s*<span>(Σωκράτους[^<]*(?:<br>[^<]*)*)<\/span><\/li>/g,
    `<li class="flex gap-2 items-start"><img src="/assets/icon-address.svg" alt="" class="${iconCls}" style="${iconStyle}" aria-hidden="true" /><span>$1</span></li>`
  ],
  // Phone (📞 → icon-phone.svg)
  [
    /<li class="flex gap-2"><span aria-hidden="true">📞<\/span>\s*<a href="(tel:[^"]+)" class="hover:text-brand-yellow">([^<]+)<\/a><\/li>/g,
    `<li class="flex gap-2 items-start"><img src="/assets/icon-phone.svg" alt="" class="${iconCls}" style="${iconStyle}" aria-hidden="true" /><a href="$1" class="hover:text-brand-yellow">$2</a></li>`
  ],
  // Email (✉️ → icon-mail.svg)
  [
    /<li class="flex gap-2"><span aria-hidden="true">✉️<\/span>\s*<a href="(mailto:[^"]+)" class="hover:text-brand-yellow([^"]*)">([^<]+)<\/a><\/li>/g,
    `<li class="flex gap-2 items-start"><img src="/assets/icon-mail.svg" alt="" class="${iconCls}" style="${iconStyle}" aria-hidden="true" /><a href="$1" class="hover:text-brand-yellow$2">$3</a></li>`
  ],
  // Hours (🕐 → inline SVG clock since we don't have a clock icon file)
  [
    /<li class="flex gap-2"><span aria-hidden="true">🕐<\/span>\s*([^<]+)<\/li>/g,
    `<li class="flex gap-2 items-start"><svg class="${iconCls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>$1</span></li>`
  ],
];

async function findHtml(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules','.git','scripts','src','assets'].includes(e.name)) {
      out.push(...(await findHtml(full)));
    } else if (e.isFile() && e.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

const files = await findHtml('.');
for (const file of files) {
  let c = await readFile(file, 'utf8');
  let n = 0;
  for (const [re, rep] of replacements) {
    const matches = c.match(re);
    if (matches) {
      c = c.replace(re, rep);
      n += matches.length;
    }
  }
  if (n > 0) {
    await writeFile(file, c, 'utf8');
    console.log(`✓ ${path.relative('.', file)}: ${n} emoji(s) replaced`);
  }
}

// Cleanup temp preview files
for (const f of ['assets/_check-mail.png', 'assets/_check-ig.png']) {
  try { await unlink(f); } catch {}
}
console.log('\nDone.');
