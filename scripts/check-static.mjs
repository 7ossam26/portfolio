import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(repositoryRoot, 'dist', 'index.html'), 'utf8');

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

if (/<link[^>]+rel="canonical"/i.test(html)) {
  throw new Error('A canonical URL was generated before a public domain was selected.');
}

if (/(?:src|href)="[^"]*\/demos\//i.test(html)) {
  throw new Error('The initial shell references demo assets before a demo can be opened.');
}

const internalEvidenceMarkers = [
  '7254e34b49acfbe394da3a889abe6e458084cb38',
  'frontend/src/pages/bom/BOMManager.jsx',
  'Exact contribution is unconfirmed',
];

for (const marker of internalEvidenceMarkers) {
  if (html.includes(marker)) {
    throw new Error(`Internal project evidence was rendered publicly: ${marker}`);
  }
}

console.log('Verified no canonical URL, eager demo asset references, or internal evidence notes.');
