import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const staticRoot = path.join(repositoryRoot, 'dist');
const pages = [
  ['home', 'index.html', 'Ahmed Hossam — Software Engineer'],
  ['Vertex', 'work/vertex/index.html', 'Vertex ERP case study — Ahmed Hossam'],
  ['AutoZain', 'work/autozain/index.html', 'AutoZain case study — Ahmed Hossam'],
  ['Roya', 'work/roya/index.html', 'Roya case study — Ahmed Hossam'],
  ['Ramex', 'work/ramex/index.html', 'Ramex case study — Ahmed Hossam'],
  ['404', '404.html', 'Page not found — Ahmed Hossam'],
];
const renderedPages = await Promise.all(pages.map(async ([label, relativePath, title]) => ({
  label,
  relativePath,
  title,
  html: await readFile(path.join(staticRoot, relativePath), 'utf8'),
})));
const html = renderedPages[0].html;

const requirements = [
  ['preview noindex metadata', /<meta name="robots" content="noindex,nofollow"\s*\/?\s*>/i],
  ['approved page title', /<title>Ahmed Hossam — Software Engineer<\/title>/i],
  ['local CV path', /href="\/Ahmed_Hossam_CV\.pdf"/i],
  ['local favicon path', /href="\/favicon\.svg"/i],
  ['contact email path', /href="mailto:hossam\.working1@gmail\.com"/i],
];

for (const [label, pattern] of requirements) {
  if (!pattern.test(html)) throw new Error(`Missing ${label} in generated index.html.`);
  console.log(`Verified static HTML: ${label}`);
}

for (const page of renderedPages) {
  if (!page.html.includes(`<title>${page.title}</title>`)) {
    throw new Error(`Missing unique title for ${page.label}: ${page.relativePath}`);
  }
  if (!/<meta name="description" content="[^"]+"\s*\/?\s*>/i.test(page.html)) {
    throw new Error(`Missing description for ${page.label}: ${page.relativePath}`);
  }
  if (!/<meta name="robots" content="noindex,nofollow"\s*\/?\s*>/i.test(page.html)) {
    throw new Error(`Preview indexing protection missing from ${page.relativePath}`);
  }
  console.log(`Verified generated page: ${page.relativePath}`);
}

if (renderedPages.some((page) => /<link[^>]+rel="canonical"/i.test(page.html))) {
  throw new Error('A canonical URL was generated before a public domain was selected.');
}

const allHtml = renderedPages.map((page) => page.html).join('\n');

if (/(?:src|href)="[^"]*\/demos\//i.test(allHtml)) {
  throw new Error('The initial shell references demo assets before a demo can be opened.');
}

if (/Try demo|Preview demo|Project contribution details to confirm|\bTODO\b/i.test(allHtml)) {
  throw new Error('Generated pages expose an unavailable demo action or internal placeholder copy.');
}

const internalEvidenceMarkers = [
  '7254e34b49acfbe394da3a889abe6e458084cb38',
  'frontend/src/pages/bom/BOMManager.jsx',
  'Exact contribution is unconfirmed',
];

for (const marker of internalEvidenceMarkers) {
  if (allHtml.includes(marker)) {
    throw new Error(`Internal project evidence was rendered publicly: ${marker}`);
  }
}


const localAssetPaths = new Set();
for (const match of allHtml.matchAll(/(?:src|href)="(\/[^"#?]+\.(?:css|js|pdf|svg|woff2))[^\"]*"/gi)) {
  localAssetPaths.add(match[1]);
}

for (const assetPath of localAssetPaths) {
  await access(path.join(staticRoot, assetPath.slice(1)), constants.R_OK);
  console.log(`Verified local asset path: ${assetPath}`);
}

console.log('Verified no canonical URL, eager demo asset references, or internal evidence notes.');
