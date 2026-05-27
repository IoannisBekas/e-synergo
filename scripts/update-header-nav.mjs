// Bigger logo + 6-item nav matching the designer's mockup
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// 1) Logo size bump: h-20 md:h-24 lg:h-28 → h-24 md:h-28 lg:h-32
const logoOld = 'class="h-20 md:h-24 lg:h-28 w-auto group-hover:scale-105 transition"';
const logoNew = 'class="h-24 md:h-28 lg:h-32 w-auto group-hover:scale-105 transition"';

// 2) Page-specific nav menus.
// Order matches mockup: Αρχική, Το Κέντρο, Υπηρεσίες, Η Διαδικασία, Ενημέρωση, Επικοινωνία.

function buildDesktopNav(activeKey) {
  const items = [
    { key: 'home',     href: '/',             label: 'Αρχική' },
    { key: 'about',    href: '/about/',       label: 'Το Κέντρο' },
    { key: 'services', href: '/services/',    label: 'Υπηρεσίες' },
    { key: 'process',  href: '/about/#process', label: 'Η Διαδικασία' },
    { key: 'updates',  href: 'https://www.instagram.com/e_synergo/', label: 'Ενημέρωση', external: true },
    { key: 'contact',  href: '/contact/',     label: 'Επικοινωνία' },
  ];
  return items.map(i => {
    const cls = i.key === activeKey ? 'text-brand-purple' : 'hover:text-brand-purple transition';
    const ext = i.external ? ' target="_blank" rel="noopener"' : '';
    return `        <li><a href="${i.href}" class="${cls}"${ext}>${i.label}</a></li>`;
  }).join('\n');
}

function buildMobileNav(activeKey, ctaHref, ctaLabel) {
  const items = [
    { key: 'home',     href: '/',             label: 'Αρχική' },
    { key: 'about',    href: '/about/',       label: 'Το Κέντρο' },
    { key: 'services', href: '/services/',    label: 'Υπηρεσίες' },
    { key: 'process',  href: '/about/#process', label: 'Η Διαδικασία' },
    { key: 'updates',  href: 'https://www.instagram.com/e_synergo/', label: 'Ενημέρωση', external: true },
    { key: 'contact',  href: '/contact/',     label: 'Επικοινωνία' },
  ];
  const links = items.map(i => {
    const cls = i.key === activeKey ? 'block py-2 text-brand-purple' : 'block py-2';
    const ext = i.external ? ' target="_blank" rel="noopener"' : '';
    return `        <li><a href="${i.href}" class="${cls}"${ext}>${i.label}</a></li>`;
  }).join('\n');

  return `${links}
        <li><a href="${ctaHref}" class="block bg-brand-purple text-white text-center py-3 rounded-full mt-2">${ctaLabel}</a></li>
        <li class="pt-2 border-t border-brand-purple/10">
          <a href="https://www.instagram.com/e_synergo/" target="_blank" rel="noopener" class="flex items-center gap-2 py-2 text-brand-purple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.2-.1 1.6-.1 4.8-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.3-8.3a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z"/></svg>
            Instagram @e_synergo
          </a>
        </li>`;
}

const pageConfigs = {
  'index.html':           { active: 'home',     ctaHref: '/contact/', ctaLabel: 'Κλείστε ραντεβού' },
  'about/index.html':     { active: 'about',    ctaHref: '/contact/', ctaLabel: 'Κλείστε ραντεβού' },
  'services/index.html':  { active: 'services', ctaHref: '/contact/', ctaLabel: 'Κλείστε ραντεβού' },
  'contact/index.html':   { active: 'contact',  ctaHref: 'tel:+302102403368', ctaLabel: 'Καλέστε μας' },
};

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
  const before = c;

  // Logo size
  if (c.includes(logoOld)) {
    c = c.replace(logoOld, logoNew);
  }

  // Only update full menus on main pages (skip privacy/cookies — they have simpler nav)
  const rel = path.relative('.', file).replace(/\\/g, '/');
  const cfg = pageConfigs[rel];
  if (cfg) {
    // Replace desktop nav UL
    c = c.replace(
      /<ul class="hidden md:flex items-center gap-7 text-sm font-semibold">[\s\S]*?<\/ul>/,
      `<ul class="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-semibold">\n${buildDesktopNav(cfg.active)}\n      </ul>`
    );

    // Replace mobile nav UL
    c = c.replace(
      /<ul class="px-5 py-4 space-y-3 font-semibold">[\s\S]*?<\/ul>/,
      `<ul class="px-5 py-4 space-y-3 font-semibold">\n${buildMobileNav(cfg.active, cfg.ctaHref, cfg.ctaLabel)}\n      </ul>`
    );
  }

  if (c !== before) {
    await writeFile(file, c, 'utf8');
    console.log(`✓ ${rel}`);
  }
}
