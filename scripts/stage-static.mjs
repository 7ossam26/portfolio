import { access, cp, mkdir, readFile, rename, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const finalOutput = path.join(repositoryRoot, 'dist');
const stagedOutput = path.join(repositoryRoot, `.dist-stage-${process.pid}`);
const portfolioOutput = path.join(repositoryRoot, 'apps', 'portfolio', 'dist');
const registry = JSON.parse(await readFile(path.join(
  repositoryRoot,
  'packages',
  'demo-contract',
  'demo-registry.json',
), 'utf8'));

const exists = async (target) => {
  try {
    await access(target, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

if (!(await exists(path.join(portfolioOutput, 'index.html')))) {
  throw new Error('Portfolio output is missing. Run the shell build before staging.');
}

await rm(stagedOutput, { recursive: true, force: true });

try {
  await cp(portfolioOutput, stagedOutput, { recursive: true, errorOnExist: true });

  for (const entry of registry) {
    if (!entry.available) continue;
    const demoOutput = path.join(repositoryRoot, 'apps', `demo-${entry.slug}`, 'dist');
    if (!(await exists(path.join(demoOutput, 'index.html')))) {
      throw new Error(`Available demo output is missing its index: ${entry.slug}`);
    }

    const demoDestination = path.join(stagedOutput, 'demos', entry.slug);
    if (await exists(demoDestination)) {
      throw new Error(`Static output collision at demos/${entry.slug}.`);
    }
    await mkdir(path.dirname(demoDestination), { recursive: true });
    await cp(demoOutput, demoDestination, { recursive: true, errorOnExist: true });
    console.log(`Staged available demo output: ${entry.slug}`);
  }

  await rm(finalOutput, { recursive: true, force: true });
  await rename(stagedOutput, finalOutput);
  console.log('Staged merged production output in dist/.');
} catch (error) {
  await rm(stagedOutput, { recursive: true, force: true });
  throw error;
}
