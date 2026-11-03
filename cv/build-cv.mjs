// Genera public/cv.pdf (español) y public/cv-en.pdf (inglés) con Chrome headless.
// Uso: npm run cv   (requiere google-chrome o CHROME_BIN)
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cv } from './cv-data.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'cv', 'out');
mkdirSync(outDir, { recursive: true });

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const bare = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

function render(d) {
  const c = d.contact;
  const link = (url, text = bare(url)) => `<a href="${esc(url)}">${esc(text)}</a>`;
  return `<!doctype html>
<html lang="${d.lang}">
<head>
<meta charset="utf-8">
<title>${esc(d.title)}</title>
<style>
@page { size: A4; margin: 12mm 14mm 10mm; }
:root { --ink: #1d2433; --muted: #5b6475; --accent: #c2502a; --rule: #e6d9cf; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Lato, 'DejaVu Sans', sans-serif; color: var(--ink); font-size: 9.4pt; line-height: 1.36; }
a { color: inherit; text-decoration: none; }
header { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px;
  padding-bottom: 9px; border-bottom: 2px solid var(--accent); }
h1 { font-size: 24pt; font-weight: 900; line-height: 1; letter-spacing: -0.01em; }
.headline { white-space: nowrap; margin-top: 5px; font-size: 10.5pt; font-weight: 500; color: var(--accent); }
.contact { text-align: right; font-size: 8.8pt; line-height: 1.5; color: var(--muted); }
.contact a { color: var(--ink); }
.contact .portfolio { color: var(--accent); font-weight: 600; }
section { margin-top: 9px; }
h2 { font-size: 8.4pt; font-weight: 700; text-transform: uppercase; color: var(--accent);
  border-bottom: 1px solid var(--rule); padding-bottom: 2px; margin-bottom: 6px; }
.skills { display: grid; grid-template-columns: 26mm 1fr; gap: 1.5px 10px; }
.skills dt { font-weight: 600; }
.skills dd { color: #333b4d; }
.item + .item { margin-top: 6px; }
.item-head { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }
.item-title { font-weight: 650; font-size: 10.2pt; }
.item-sub { color: var(--muted); }
.period { color: var(--muted); white-space: nowrap; font-size: 9pt; }
ul { margin: 4px 0 0 14px; }
li { margin-top: 2px; padding-left: 2px; }
li::marker { color: var(--accent); }
.project a.url { color: var(--accent); font-weight: 500; font-size: 9pt; }
.project .stack { color: var(--muted); font-size: 8.7pt; margin-top: 1px; }
.project p { margin-top: 2px; }
.two { display: grid; grid-template-columns: 1.6fr 1fr; gap: 18px; }
</style>
</head>
<body>
<header>
  <div>
    <h1>${esc(d.name)}</h1>
    <div class="headline">${esc(d.headline)}</div>
  </div>
  <div class="contact">
    <div>${esc(d.location)}</div>
    <div>${link(`mailto:${c.email}`, c.email)}</div>
    <div>${link(c.linkedin)}</div>
    <div>${link(c.github)}</div>
    <div class="portfolio">${esc(d.labels.portfolio)}: ${link(c.portfolio)}</div>
  </div>
</header>

<section>
  <h2>${esc(d.labels.profile)}</h2>
  <p>${esc(d.profile)}</p>
</section>

<section>
  <h2>${esc(d.labels.skills)}</h2>
  <dl class="skills">
    ${d.skills.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('\n    ')}
  </dl>
</section>

<section>
  <h2>${esc(d.labels.experience)}</h2>
  ${d.experience
    .map(
      (e) => `<div class="item">
    <div class="item-head"><span class="item-title">${esc(e.role)}</span><span class="period">${esc(e.period)}</span></div>
    <div class="item-sub">${esc(e.org)} · ${esc(e.meta)}</div>
    <ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  </div>`,
    )
    .join('\n')}
</section>


<div class="two">
  <section>
    <h2>${esc(d.labels.education)}</h2>
    ${d.education
      .map(
        (e) => `<div class="item"><div class="item-head"><span class="item-title">${esc(e.title)}</span></div>
      <div class="item-sub">${esc(e.org)} · ${esc(e.period)}</div></div>`,
      )
      .join('')}
  </section>
  <section>
    <h2>${esc(d.labels.languages)}</h2>
    ${d.languages.map((l) => `<div>${esc(l)}</div>`).join('')}
  </section>
</div>
</body>
</html>`;
}

const chrome = process.env.CHROME_BIN || 'google-chrome';
for (const d of Object.values(cv)) {
  const html = join(outDir, `${d.file.replace(/\.pdf$/, '')}.html`);
  const pdf = join(root, 'public', d.file);
  writeFileSync(html, render(d));
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdf}`,
    pathToFileURL(html).href,
  ], { stdio: 'ignore' });
  console.info(`OK ${d.file}`);
}

// Versión para evitar que el navegador muestre un PDF viejo cacheado (?v=...).
const hash = createHash('sha256');
for (const d of Object.values(cv)) hash.update(readFileSync(join(root, 'public', d.file)));
writeFileSync(
  join(root, 'src', 'portfolio', 'cvVersion.js'),
  `// Generado por npm run cv. No editar a mano.\nexport const cvVersion = '${hash.digest('hex').slice(0, 10)}';\n`,
);
