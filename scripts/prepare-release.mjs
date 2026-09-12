import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { inspectOutput, json, nginxConfig, sha256, tar } from './release-lib.mjs';
import { resolveSiteUrl } from './site-config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
if (process.version !== `v${(await readFile(path.join(root, '.nvmrc'), 'utf8')).trim()}`) {
  throw new Error('Release preparation requires the exact .nvmrc Node runtime.');
}
// A full build is mandatory; prepare never accepts an unchecked existing dist.
const npm = process.env.PORTFOLIO_NPM_CLI ?? process.env.npm_execpath;
if (!npm) throw new Error('Run npm run release:prepare, or set PORTFOLIO_NPM_CLI to the npm@11.1.0 bin/npm-cli.js path.');
const npmVersion = execFileSync(process.execPath, [npm, '--version'], { encoding: 'utf8' }).trim();
if (npmVersion !== '11.1.0') throw new Error('Release preparation requires npm@11.1.0.');
execFileSync(process.execPath, [npm, 'run', 'build'], { cwd: root, stdio: 'inherit' });
const origin = resolveSiteUrl();
const output = await inspectOutput(path.join(root, 'dist'));
const sourcePaths = git('ls-files', '--cached', '--others', '--exclude-standard', '-z').split('\0')
  .filter((name) => /^(?:apps\/|packages\/|scripts\/|tests\/|package(?:-lock)?\.json$|\.nvmrc$|\.gitignore$|AGENTS\.md$|DECISIONS\.md$|design-reference\/studio-dark\/assets\/(?:Ahmed_Hossam_CV\.pdf|favicon\.svg)$)/.test(name)).sort();
const sourceEntries = await Promise.all(sourcePaths.map(async (name) => [name, await readFile(path.join(root, name))]));
const sourceFiles = sourceEntries.map(([name, data]) => ({ path: name, sha256: sha256(data) }));
const sourceArchive = gzipSync(tar(sourceEntries));
const manifest = {
  schema: 1, status: process.env.PORTFOLIO_RELEASE_TEST === '1' ? 'test-fixture-not-for-deployment'
    : origin ? 'public-candidate-not-deployed' : 'preview-candidate-not-deployed',
  origin, baseRevision: git('rev-parse', 'HEAD'), sourceTreeSha256: sha256(json(sourceFiles)),
  sourceArchiveSha256: sha256(sourceArchive), node: process.version, npm: npmVersion,
  outputSha256: output.outputSha256, files: output.files, documents: output.documents,
  deployment: null,
};
const entries = await Promise.all(output.files.map(async ({ path: name }) => [`html/${name}`, await readFile(path.join(root, 'dist', name))]));
entries.push(['nginx.conf', Buffer.from(nginxConfig(output, origin))],
  ['release.json', Buffer.from(json(manifest))], ['source-manifest.json', Buffer.from(json(sourceFiles))],
  ['source.tar.gz', sourceArchive]);
const archive = gzipSync(tar(entries));
const digest = sha256(archive);
const destination = path.join(root, 'output', 'releases', `portfolio-${digest}.tar.gz`);
await mkdir(path.dirname(destination), { recursive: true });
try {
  await access(destination);
  if (sha256(await readFile(destination)) !== digest) throw new Error('Existing immutable artifact was modified.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  await writeFile(destination, archive, { flag: 'wx' });
}
await writeFile(`${destination}.sha256`, `${digest}  ${path.basename(destination)}\n`);
await mkdir(path.join(root, 'output', 'phase-09'), { recursive: true });
await writeFile(path.join(root, 'output', 'phase-09', 'prepared-release.json'), json({ artifact: destination, sha256: digest, ...manifest }));
console.log(`Prepared ${manifest.status}: ${destination}\nSHA-256 ${digest}`);
