// Update address + hours across all HTML files with real values
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// Encoded address for Google Maps URLs
const ADDRESS_ENCODED = encodeURIComponent('Σωκράτους 130 και Αθανασίου Διάκου, Αχαρναί');
const MAPS_EMBED  = `https://www.google.com/maps?q=${ADDRESS_ENCODED}&output=embed`;
const MAPS_DIR    = `https://www.google.com/maps/dir/?api=1&destination=${ADDRESS_ENCODED}`;

const replacements = [
  // Text address (with <br>)
  ['Σωκράτους 130<br>Αχαρναί', 'Σωκράτους 130<br>& Αθανασίου Διάκου<br>Αχαρναί'],
  // Text address (single line, in CTA paragraphs)
  ['Σωκράτους 130, Αχαρναί', 'Σωκράτους 130 και Αθανασίου Διάκου, Αχαρναί'],

  // Hours: Δευ-Παρ 09:00-21:00 → Δευ-Παρ 13:00-21:00
  ['Δευ-Παρ 09:00-21:00', 'Δευ-Παρ 13:00-21:00'],
  // Long form
  ['Δευ - Παρ<br>09:00 - 21:00', 'Δευ - Παρ<br>13:00 - 21:00'],
  // Quick-contact bottom note
  ['Ωράριο: Δευτέρα - Παρασκευή, 09:00 - 21:00',
   'Ωράριο: Δευτέρα - Παρασκευή, 13:00 - 21:00'],
  // Footer "Δευ - Παρ: 09:00 - 20:00 / Σάβ: 09:00 - 14:00" (the older format if present)
  ['Δευ - Παρ: 09:00 - 20:00<br>Σάβ: 09:00 - 14:00',
   'Δευ - Παρ: 13:00 - 21:00'],

  // Google Maps title attributes
  ['title="Χάρτης - Σωκράτους 130, Αχαρναί"',
   'title="Χάρτης - Σωκράτους 130 και Αθανασίου Διάκου, Αχαρναί"'],
  ['title="Σωκράτους 130, Αχαρναί"',
   'title="Σωκράτους 130 και Αθανασίου Διάκου, Αχαρναί"'],

  // Google Maps embed src (replace the q= URL)
  ['src="https://www.google.com/maps?q=%CE%A3%CF%89%CE%BA%CF%81%CE%AC%CF%84%CE%BF%CF%85%CF%82%20130%2C%20%CE%91%CF%87%CE%B1%CF%81%CE%BD%CE%B1%CE%AF&output=embed"',
   `src="${MAPS_EMBED}"`],

  // Google Maps directions URL
  ['href="https://www.google.com/maps/dir/?api=1&destination=Σωκράτους+130,+Αχαρναί"',
   `href="${MAPS_DIR}"`],
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
  for (const [a, b] of replacements) {
    const matches = (c.match(new RegExp(a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (matches) {
      c = c.split(a).join(b);
      n += matches;
    }
  }
  if (n > 0) {
    await writeFile(file, c, 'utf8');
    console.log(`✓ ${file}: ${n} update(s)`);
  }
}
