import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetPairs = [
  ['design-reference/studio-dark/assets/Ahmed_Hossam_CV.pdf', 'apps/portfolio/public/Ahmed_Hossam_CV.pdf'],
  ['design-reference/studio-dark/assets/favicon.svg', 'apps/portfolio/public/favicon.svg'],
];

const digest = (contents) => createHash('sha256').update(contents).digest('hex');

for (const [sourceRelative, publicRelative] of assetPairs) {
  const [source, published] = await Promise.all([
    readFile(path.join(repositoryRoot, sourceRelative)),
    readFile(path.join(repositoryRoot, publicRelative)),
  ]);
  if (digest(source) !== digest(published)) {
    throw new Error(`${publicRelative} does not match its approved source asset.`);
  }
  console.log(`Verified unchanged asset: ${publicRelative}`);
}
