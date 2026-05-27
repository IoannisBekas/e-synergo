// Fix the parts that failed in part 1 due to CRLF line ending issues
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

function heartAccent() {
  return `<span class="heart-accent" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </span>`;
}

function newLightCTA(heading, subtitle, buttonText, buttonHref) {
  return `  <!-- CTA -->
  <section class="py-12 md:py-16">
    <div class="max-w-7xl mx-auto px-5">
      <div class="relative overflow-hidden rounded-[2rem] p-8 md:p-12" style="background-color: #E8F0F7;">
        <svg class="absolute top-8 right-8 w-10 h-10 text-brand-coral/70 hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <div class="text-center md:text-left max-w-2xl">
          <h2 class="text-2xl md:text-4xl font-extrabold mb-3 leading-tight text-brand-purple">${heading}</h2>
          <p class="text-base text-brand-muted mb-7">${subtitle}</p>
          <a href="${buttonHref}" class="inline-flex items-center gap-2 bg-brand-purple text-white px-6 py-3.5 rounded-full font-bold hover:bg-brand-purple-dark transition shadow-md">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${buttonText}
          </a>
        </div>
      </div>
    </div>
  </section>`;
}

const PROCESS_SECTION = `  <!-- ============ Η ΔΙΑΔΙΚΑΣΙΑ ============ -->
  <section id="process" class="py-16 md:py-20 bg-white scroll-mt-24">
    <div class="max-w-7xl mx-auto px-5">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="kicker mb-3">Η Διαδικασία</span>
        <h2 class="text-3xl md:text-5xl font-extrabold mb-2 leading-tight text-brand-purple">Πώς ξεκινάμε μαζί</h2>
        ${heartAccent()}
        <p class="text-lg text-brand-muted mt-3">Διαφανής και απλή — από την πρώτη επαφή μέχρι το εξατομικευμένο πλάνο.</p>
      </div>

      <div class="grid md:grid-cols-4 gap-5">
        <div class="bg-cream rounded-3xl p-6 border border-brand-purple/5">
          <div class="w-12 h-12 rounded-full bg-brand-yellow flex items-center justify-center font-extrabold text-xl mb-4">1</div>
          <h3 class="font-bold text-lg mb-2 text-brand-purple">Πρώτη επικοινωνία</h3>
          <p class="text-brand-muted text-sm">Μας τηλεφωνείτε ή στέλνετε μήνυμα. Συζητάμε σύντομα τις ανάγκες σας.</p>
        </div>
        <div class="bg-cream rounded-3xl p-6 border border-brand-purple/5">
          <div class="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center font-extrabold text-xl mb-4">2</div>
          <h3 class="font-bold text-lg mb-2 text-brand-purple">Ραντεβού γνωριμίας</h3>
          <p class="text-brand-muted text-sm">Συνάντηση με γονείς και παιδί σε ένα οικείο, ζεστό περιβάλλον.</p>
        </div>
        <div class="bg-cream rounded-3xl p-6 border border-brand-purple/5">
          <div class="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center font-extrabold text-xl mb-4">3</div>
          <h3 class="font-bold text-lg mb-2 text-brand-purple">Αξιολόγηση</h3>
          <p class="text-brand-muted text-sm">Διεπιστημονική εκτίμηση με κατάλληλα εργαλεία ανά ηλικία και ανάγκη.</p>
        </div>
        <div class="bg-cream rounded-3xl p-6 border border-brand-purple/5">
          <div class="w-12 h-12 rounded-full bg-brand-pink flex items-center justify-center font-extrabold text-xl mb-4">4</div>
          <h3 class="font-bold text-lg mb-2 text-brand-purple">Πλάνο & Θεραπεία</h3>
          <p class="text-brand-muted text-sm">Σχεδιάζουμε εξατομικευμένο πλάνο και ξεκινάμε, με τακτική ενημέρωση γονέων.</p>
        </div>
      </div>
    </div>
  </section>`;

async function processFile(file, fns) {
  let c = await readFile(file, 'utf8');
  const before = c;
  for (const fn of fns) c = fn(c);
  if (c !== before) {
    await writeFile(file, c, 'utf8');
    console.log(`✓ ${file}`);
  } else {
    console.log(`  ${file}: no changes`);
  }
}

// --- helpers using [\s\S] for newline flexibility ---
const removeFollowUs = c => c.replace(
  /[ \t]*<!-- FOLLOW US -->[\s\S]*?<\/section>[\s\S]{0,3}/,
  ''
);

const removeOldCTA = c => c.replace(
  /[ \t]*<!-- CTA -->[\s\S]*?bg-gradient-to-br from-brand-purple to-brand-purple-dark[\s\S]*?<\/section>/,
  ''
);

const insertCTABeforeMain = (newCTA) => c => c.replace(
  /([ \t]*<\/main>)/,
  newCTA + '\n\n$1'
);

// About-specific: insert process section before CTA, insert light CTA
async function fixAbout() {
  await processFile('about/index.html', [
    removeFollowUs,
    removeOldCTA,
    // Insert process section + new CTA before </main>
    c => c.replace(
      /([ \t]*<\/main>)/,
      PROCESS_SECTION + '\n\n' +
      newLightCTA('Επισκεφτείτε μας', 'Ελάτε να γνωριστούμε από κοντά. Σωκράτους 130 και Αθανασίου Διάκου, Αχαρναί.', 'Κλείστε ραντεβού', '/contact/') +
      '\n\n$1'
    ),
  ]);
}

async function fixServices() {
  await processFile('services/index.html', [
    removeFollowUs,
    removeOldCTA,
    insertCTABeforeMain(newLightCTA(
      'Δεν είστε σίγουροι από πού να αρχίσετε;',
      'Κλείστε ένα δωρεάν ραντεβού γνωριμίας. Θα σας ακούσουμε και θα σας προτείνουμε τα επόμενα βήματα.',
      'Επικοινωνία',
      '/contact/'
    )),
  ]);
}

async function fixContact() {
  await processFile('contact/index.html', [
    removeFollowUs,
  ]);
}

await fixAbout();
await fixServices();
await fixContact();

// Verify
console.log('\n--- Verification ---');
const files = ['about/index.html', 'services/index.html', 'contact/index.html'];
for (const f of files) {
  const c = await readFile(f, 'utf8');
  const issues = [];
  if (c.includes('FOLLOW US')) issues.push('FOLLOW US still present');
  if (c.includes('from-brand-purple to-brand-purple-dark text-white rounded-[2.5rem]')) issues.push('old dark CTA still present');
  console.log(`${f}: ${issues.length ? '⚠ ' + issues.join(', ') : '✓ clean'}`);
}

const aboutContent = await readFile('about/index.html', 'utf8');
console.log(`about/index.html #process anchor: ${aboutContent.includes('id="process"') ? '✓ exists' : '⚠ missing'}`);
