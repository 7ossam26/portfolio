import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { portfolioCv, publishedAssets } from './portfolio-config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(root, 'apps', 'portfolio', 'public');
const entries = await readdir(publicRoot, { withFileTypes: true });
const actual = entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort();
if (entries.some((entry) => !entry.isFile())
  || JSON.stringify(actual) !== JSON.stringify([...publishedAssets].sort())) {
  throw new Error('Public assets must match the active portfolio allowlist; archive unapproved CVs and project media outside public/.');
}

const favicon = await readFile(path.join(publicRoot, 'favicon.svg'), 'utf8');
if (!/<svg\b/i.test(favicon) || !/yf\./i.test(favicon)
  || /ah\.|Ahmed|Hossam|7ossam26/i.test(favicon)
  || /(?:https?:|<script\b|\bon\w+\s*=)/i.test(favicon.replace('http://www.w3.org/2000/svg', ''))) {
  throw new Error('The local favicon must use Yousef’s yf. identity and contain no remote or executable content.');
}
const cv = await readFile(path.join(publicRoot, portfolioCv.path));
if (cv.subarray(0, 5).toString() !== '%PDF-'
  || createHash('sha256').update(cv).digest('hex') !== portfolioCv.sha256) {
  throw new Error('The published CV must match Yousef’s inspected, unchanged PDF.');
}
console.log(`Verified ${actual.length} approved public asset: ${actual.join(', ')}.`);
