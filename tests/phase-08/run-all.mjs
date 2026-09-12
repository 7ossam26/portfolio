// Runs the Phase 08 release-candidate suites in order against the current dist/
// and prints one consolidated pass/fail summary.
//
// Lighthouse is not included: it is not a repository dependency. Run it with
// `npm i --no-save lighthouse@13.2.0 && npm run verify:lighthouse`.

import { spawnSync } from 'node:child_process';
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, '..', '..');

try {
  await access(path.join(repositoryRoot, 'dist', 'index.html'), constants.R_OK);
} catch {
  console.error('dist/index.html is missing. Run `npm run build` before `npm run verify`.');
  process.exit(2);
}

const suites = [
  ['visual-responsive', 'visual-responsive.mjs'],
  ['accessibility-keyboard', 'accessibility-keyboard.mjs'],
  ['demo-journeys', 'demo-journeys.mjs'],
  ['network-isolation', 'network-isolation.mjs'],
  ['performance', 'performance.mjs'],
];

const outcomes = [];
for (const [name, file] of suites) {
  console.log(`\n──────── ${name} ────────`);
  const result = spawnSync(process.execPath, [path.join(here, file)], {
    cwd: repositoryRoot,
    stdio: 'inherit',
  });
  outcomes.push({ name, status: result.status });
}

console.log('\n──────── summary ────────');
for (const outcome of outcomes) {
  console.log(`${outcome.status === 0 ? 'PASS' : 'FAIL'}  ${outcome.name}`);
}

const failed = outcomes.filter((outcome) => outcome.status !== 0);
if (failed.length > 0) {
  console.error(`\n${failed.length} suite(s) failed.`);
  process.exit(1);
}
console.log('\nAll Phase 08 suites passed.');
