import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const generatedDirectories = [
  path.join(repositoryRoot, 'dist'),
  path.join(repositoryRoot, 'apps', 'portfolio', 'dist'),
  path.join(repositoryRoot, 'apps', 'demo-vertex', 'dist'),
  path.join(repositoryRoot, 'apps', 'demo-autozain', 'dist'),
  path.join(repositoryRoot, 'apps', 'demo-roya', 'dist'),
  path.join(repositoryRoot, 'apps', 'demo-ramex', 'dist'),
];

for (const directory of generatedDirectories) {
  if (!directory.startsWith(repositoryRoot + path.sep)) {
    throw new Error(`Refusing to clean a path outside the repository: ${directory}`);
  }
  await rm(directory, { recursive: true, force: true });
}

console.log('Removed generated shell and merged static output.');
