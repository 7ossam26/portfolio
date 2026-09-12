import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = path.join(repositoryRoot, 'packages', 'demo-contract', 'demo-registry.json');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const expectedSlugs = new Set(['vertex', 'autozain', 'roya', 'ramex']);

if (!Array.isArray(registry) || registry.length !== expectedSlugs.size) {
  throw new Error('Demo registry must contain the four declared project entries.');
}

const seen = new Set();
for (const entry of registry) {
  if (!entry || typeof entry !== 'object' || !expectedSlugs.has(entry.slug) || seen.has(entry.slug)) {
    throw new Error('Demo registry contains an unknown or duplicate slug.');
  }
  if (entry.path !== `/demos/${entry.slug}/` || typeof entry.available !== 'boolean') {
    throw new Error(`Demo registry entry is invalid: ${entry.slug}`);
  }
  seen.add(entry.slug);
}

const availableEntries = registry.filter((entry) => entry.available);
if (availableEntries.length === 0) {
  console.log('No original-UI demos are marked available; skipped demo workspace builds.');
}

for (const entry of availableEntries) {
  const workspace = `@portfolio/demo-${entry.slug}`;
  const packagePath = path.join(repositoryRoot, 'apps', `demo-${entry.slug}`, 'package.json');
  await access(packagePath, constants.R_OK);
  const packageData = JSON.parse(await readFile(packagePath, 'utf8'));
  if (typeof packageData.scripts?.build !== 'string') {
    throw new Error(`Available demo has no build script: ${entry.slug}`);
  }

  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npmCommand, ['run', 'build', '--workspace', workspace], {
    cwd: repositoryRoot,
    stdio: 'inherit',
  });
  if (result.status !== 0) throw new Error(`Demo build failed: ${entry.slug}`);
}
