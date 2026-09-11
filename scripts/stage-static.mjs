import { access, cp, mkdir, rename, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const finalOutput = path.join(repositoryRoot, 'dist');
const stagedOutput = path.join(repositoryRoot, `.dist-stage-${process.pid}`);
const portfolioOutput = path.join(repositoryRoot, 'apps', 'portfolio', 'dist');
const demos = [
  ['vertex', path.join(repositoryRoot, 'apps', 'demo-vertex', 'dist')],
  ['autozain', path.join(repositoryRoot, 'apps', 'demo-autozain', 'dist')],
  ['roya', path.join(repositoryRoot, 'apps', 'demo-roya', 'dist')],
  ['ramex', path.join(repositoryRoot, 'apps', 'demo-ramex', 'dist')],
];

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

  for (const [slug, demoOutput] of demos) {
    if (!(await exists(demoOutput))) continue;
    if (!(await exists(path.join(demoOutput, 'index.html')))) {
      throw new Error(`Demo output exists without an index: ${slug}`);
    }

    const demoDestination = path.join(stagedOutput, 'demos', slug);
    if (await exists(demoDestination)) {
      throw new Error(`Static output collision at demos/${slug}.`);
    }
    await mkdir(path.dirname(demoDestination), { recursive: true });
    await cp(demoOutput, demoDestination, { recursive: true, errorOnExist: true });
    console.log(`Staged demo output: ${slug}`);
  }

  await rm(finalOutput, { recursive: true, force: true });
  await rename(stagedOutput, finalOutput);
  console.log('Staged merged production output in dist/.');
} catch (error) {
  await rm(stagedOutput, { recursive: true, force: true });
  throw error;
}
