// Comprehensive visual audit fixes for all pages
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// ========================================================================
// Snippet builders
// ========================================================================

function heartAccent() {
  return `<span class="heart-accent" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </span>`;
}

function newHero(kicker, headline, subtitle) {
  return `  <!-- HERO -->
  <section class="relative overflow-hidden py-16 md:py-24">
    <!-- Soft background blobs -->
    <div class="absolute top-20 left-1/3 w-[450px] h-[420px] rounded-[50%] bg-brand-coral/15 blur-3xl pointer-events-none"></div>
    <div class="absolute -top-10 right-0 w-[400px] h-[400px] rounded-[50%] bg-brand-yellow/20 blur-3xl pointer-events-none"></div>

    <div class="relative max-w-4xl mx-auto px-5 text-center">
      <span class="kicker mb-3">${kicker}</span>
      <h1 class="text-4xl md:text-6xl font-extrabold mb-2 leading-tight text-brand-purple">${headline}</h1>
      ${heartAccent()}
      <p class="text-lg md:text-xl text-brand-muted max-w-2xl mx-auto mt-3">${subtitle}</p>
    </div>
  </section>`;
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

// Process section to add to about page (target for #process anchor)
const PROCESS_SECTION = `  <!-- ============ Η ΔΙΑΔΙΚΑΣΙΑ ============ -->
  <section id="process" class="py-16 md:py-20 bg-white scroll-mt-24">
    <div class="max-w-7xl mx-auto px-5">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="kicker mb-3">Η Διαδικασία</span>
        <h2 class="text-3xl md:text-5xl font-extrabold mb-2 leading-tight text-brand-purple">Πώς ξεκινάμε μαζί</h2>
        <span class="heart-accent" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </span>
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

// ========================================================================
// Helper: find HTML files
// ========================================================================
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

// ========================================================================
// Page-specific updates
// ========================================================================

async function updateAbout() {
  let c = await readFile('about/index.html', 'utf8');

  // 1) Replace hero
  c = c.replace(
    /  <!-- HERO -->[\s\S]*?<\/section>/,
    newHero(
      'Το Κέντρο μας',
      'Γνωρίστε το e_synergo.',
      'Συνεργαζόμαστε με το παιδί, την οικογένεια και τους εκπαιδευτικούς για να χτίσουμε γέφυρες ανάμεσα στη θεραπεία και την καθημερινότητα.'
    )
  );

  // 2) ΑΞΙΕΣ section — replace emojis with SVG icons + add scroll target
  const valuesIconMap = {
    '🤝': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 11h.01M14 11h.01"/><path d="M18 12.5c0 2.5-2.5 4.5-6 4.5s-6-2-6-4.5"/><circle cx="12" cy="12" r="10"/><path d="M9 9l-2 2M15 9l2 2"/></svg>`,
    '💛': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    '🎯': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    '🌱': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4 2.1-.5 3.8-.3 5 .6z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>`,
    '🔍': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    '🎨': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  };
  const valueColors = ['brand-coral', 'brand-lavender', 'brand-green', 'brand-yellow', 'brand-pink', 'brand-blue'];
  let valueIdx = 0;
  c = c.replace(
    /<div class="w-14 h-14 rounded-2xl bg-brand-(coral|lavender|green|yellow|pink|blue)\/30 flex items-center justify-center text-3xl mb-4">([🤝💛🎯🌱🔍🎨])<\/div>/g,
    (m, color, emoji) => {
      const svg = valuesIconMap[emoji] || '';
      const sized = svg.replace('<svg ', '<svg class="w-7 h-7" ').replace('stroke="currentColor"', 'stroke="currentColor"');
      return `<div class="w-14 h-14 rounded-2xl bg-brand-${color}/25 flex items-center justify-center mb-4 text-brand-purple">${sized}</div>`;
    }
  );

  // Add id="values" to ΑΞΙΕΣ section header for anchor-ability (optional)

  // 3) ΟΜΑΔΑ section — replace emoji circles with initial-letter placeholders
  // Person 1: Ελένη Βίγλα → ΕΒ
  c = c.replace(
    /<div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-brand-coral\/40 to-brand-yellow\/40 mb-4 flex items-center justify-center text-5xl">👩‍⚕️<\/div>/,
    `<div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-brand-coral/40 to-brand-yellow/40 mb-4 flex items-center justify-center text-4xl font-extrabold text-brand-purple">ΕΒ</div>`
  );
  // Placeholders
  c = c.replace(
    /<div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-brand-lavender\/40 to-brand-pink\/40 mb-4 flex items-center justify-center text-5xl">👩‍🏫<\/div>/,
    `<div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-brand-lavender/40 to-brand-pink/40 mb-4 flex items-center justify-center text-4xl font-extrabold text-brand-purple">?</div>`
  );
  c = c.replace(
    /<div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-brand-blue\/40 to-brand-green\/40 mb-4 flex items-center justify-center text-5xl">👨‍⚕️<\/div>/,
    `<div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-brand-blue/40 to-brand-green/40 mb-4 flex items-center justify-center text-4xl font-extrabold text-brand-purple">?</div>`
  );
  c = c.replace(
    /<div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-brand-yellow\/50 to-brand-coral\/40 mb-4 flex items-center justify-center text-5xl">👩‍🎓<\/div>/,
    `<div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-brand-yellow/50 to-brand-coral/40 mb-4 flex items-center justify-center text-4xl font-extrabold text-brand-purple">?</div>`
  );
  c = c.replace(
    /<div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-brand-pink\/40 to-brand-lavender\/40 mb-4 flex items-center justify-center text-5xl">🧠<\/div>/,
    `<div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-brand-pink/40 to-brand-lavender/40 mb-4 flex items-center justify-center text-4xl font-extrabold text-brand-purple">?</div>`
  );

  // 4) Remove FOLLOW US section
  c = c.replace(/  <!-- FOLLOW US -->[\s\S]*?<\/section>\n\n/, '');

  // 5) Replace CTA with light version
  c = c.replace(
    /  <!-- CTA -->\n  <section class="py-16 md:py-20">[\s\S]*?<\/section>/,
    newLightCTA(
      'Επισκεφτείτε μας',
      'Ελάτε να γνωριστούμε από κοντά. Σωκράτους 130 και Αθανασίου Διάκου, Αχαρναί.',
      'Κλείστε ραντεβού',
      '/contact/'
    )
  );

  // 6) Add #process section before CTA
  c = c.replace(
    /  <!-- CTA -->/,
    PROCESS_SECTION + '\n\n  <!-- CTA -->'
  );

  await writeFile('about/index.html', c, 'utf8');
  console.log('✓ about/index.html');
}

async function updateServices() {
  let c = await readFile('services/index.html', 'utf8');

  // 1) Replace hero
  c = c.replace(
    /  <!-- PAGE HEADER -->[\s\S]*?<\/section>/,
    newHero(
      'Υπηρεσίες',
      'Εξειδικευμένη φροντίδα, σε κάθε βήμα.',
      'Έξι αλληλοσυνδεόμενες υπηρεσίες που λειτουργούν συνεργατικά γύρω από το παιδί και την οικογένεια.'
    ).replace('<!-- HERO -->', '<!-- PAGE HEADER -->')
  );

  // 2) Quick nav: add 6th item (Αξιολόγηση), update labels for consistency
  c = c.replace(
    /<a href="#parent-counseling"([^>]*)>([^<]*?)<\/a>\s*<\/div>/,
    `<a href="#parent-counseling"$1>$2</a>
      <a href="#assessment" class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-purple/10"><span class="w-2 h-2 rounded-full bg-brand-lavender"></span> Αξιολόγηση</a>
    </div>`
  );

  // 3) Remove FOLLOW US
  c = c.replace(/  <!-- FOLLOW US -->[\s\S]*?<\/section>\n\n/, '');

  // 4) Replace CTA with light version
  c = c.replace(
    /  <!-- CTA -->\n  <section class="py-16 md:py-20">[\s\S]*?<\/section>/,
    newLightCTA(
      'Δεν είστε σίγουροι από πού να αρχίσετε;',
      'Κλείστε ένα δωρεάν ραντεβού γνωριμίας. Θα σας ακούσουμε και θα σας προτείνουμε τα επόμενα βήματα.',
      'Επικοινωνία',
      '/contact/'
    )
  );

  await writeFile('services/index.html', c, 'utf8');
  console.log('✓ services/index.html');
}

async function updateContact() {
  let c = await readFile('contact/index.html', 'utf8');

  // 1) Replace hero with kicker style
  c = c.replace(
    /  <!-- HERO -->[\s\S]*?<\/section>/,
    newHero(
      'Επικοινωνία',
      'Ας μιλήσουμε.',
      'Είμαστε εδώ για να ακούσουμε. Επιλέξτε τον τρόπο που σας βολεύει.'
    )
  );

  // 2) Verify hours card shows correct time (in case it was missed earlier)
  c = c.replace(
    /<p class="text-sm text-brand-muted">Δευ - Παρ<br>09:00 - 21:00<\/p>/,
    '<p class="text-sm text-brand-muted">Δευ - Παρ<br>13:00 - 21:00</p>'
  );

  // 3) Update bottom note hours (if outdated)
  c = c.replace(
    /Ωράριο: Δευτέρα - Παρασκευή, 09:00 - 21:00/,
    'Ωράριο: Δευτέρα - Παρασκευή, 13:00 - 21:00'
  );

  // 4) Remove FOLLOW US
  c = c.replace(/  <!-- FOLLOW US -->[\s\S]*?<\/section>\n\n/, '');

  await writeFile('contact/index.html', c, 'utf8');
  console.log('✓ contact/index.html');
}

async function updateCookies() {
  let c = await readFile('cookies/index.html', 'utf8');

  // Replace emoji headers with colored dot indicators
  c = c.replace(
    /<h3 class="font-bold text-lg mb-2">🟢 Απολύτως απαραίτητα<\/h3>/,
    `<h3 class="font-bold text-lg mb-2 flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-emerald-500"></span> Απολύτως απαραίτητα</h3>`
  );
  c = c.replace(
    /<h3 class="font-bold text-lg mb-2">📊 Στατιστικά \(προαιρετικά\)<\/h3>/,
    `<h3 class="font-bold text-lg mb-2 flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-brand-blue"></span> Στατιστικά (προαιρετικά)</h3>`
  );
  c = c.replace(
    /<h3 class="font-bold text-lg mb-2">🎯 Marketing \(προαιρετικά\)<\/h3>/,
    `<h3 class="font-bold text-lg mb-2 flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-brand-coral"></span> Marketing (προαιρετικά)</h3>`
  );

  await writeFile('cookies/index.html', c, 'utf8');
  console.log('✓ cookies/index.html');
}

// ========================================================================
// Run all
// ========================================================================
await updateAbout();
await updateServices();
await updateContact();
await updateCookies();
console.log('\nDone.');
