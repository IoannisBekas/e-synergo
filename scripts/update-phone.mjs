// Replace all phone placeholders with the real number
import { readFile, writeFile, readdir } from 'node:fs/promises';

const PHONE_RAW = '2102403368';
const PHONE_DISPLAY = '210 2403368';
const PHONE_TEL = '+302102403368';

const files = (await readdir('.')).filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = await readFile(file, 'utf8');
  const before = content;

  // 1. Empty tel: links → real tel: link
  content = content.replace(/href="tel:"/g, `href="tel:${PHONE_TEL}"`);

  // 2. [ Τηλέφωνο ] display placeholder → real number
  content = content.replace(/\[ Τηλέφωνο \]/g, PHONE_DISPLAY);

  // 3. Existing placeholder "210 1234567"
  content = content.replace(/210 1234567/g, PHONE_DISPLAY);

  // 4. Existing placeholder "[ Συμπληρώστε ]" inside contact.html for phone
  // (be careful — there's also email Συμπληρώστε, scoped to phone block)
  content = content.replace(
    /(<h3[^>]*>Τηλέφωνο<\/h3>\s*<a href="[^"]*"[^>]*>)\[ Συμπληρώστε \](<\/a>)/g,
    `$1${PHONE_DISPLAY}$2`
  );

  if (content !== before) {
    await writeFile(file, content, 'utf8');
    const count = (before.match(/href="tel:"|\[ Τηλέφωνο \]|210 1234567/g) || []).length;
    console.log(`✓ ${file}: ${count} replacements`);
  } else {
    console.log(`  ${file}: no changes`);
  }
}
