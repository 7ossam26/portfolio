import { access, cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SITE_URL_VARIABLE, indexableRoutes, resolveSiteUrl } from './site-config.mjs';

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

const removeDirectory = (target) => rm(target, {
  recursive: true,
  force: true,
  maxRetries: 10,
  retryDelay: 100,
});

// Windows briefly keeps handles on a freshly written tree (indexer/antivirus), so a
// directory rename can fail with EPERM/EBUSY even when nothing owns the destination.
// Retry the atomic move, then fall back to a plain copy so the build stays reproducible.
const transientCodes = new Set(['EPERM', 'EACCES', 'EBUSY', 'ENOTEMPTY', 'EEXIST']);

const promoteDirectory = async (from, to) => {
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    try {
      await rename(from, to);
      return 'rename';
    } catch (error) {
      if (!transientCodes.has(error.code) || attempt === 8) break;
      await new Promise((resolve) => setTimeout(resolve, attempt * 125));
      await removeDirectory(to);
    }
  }

  await removeDirectory(to);
  await cp(from, to, { recursive: true });
  await removeDirectory(from);
  return 'copy';
};

if (!(await exists(path.join(portfolioOutput, 'index.html')))) {
  throw new Error('Portfolio output is missing. Run the shell build before staging.');
}

await removeDirectory(stagedOutput);

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

  // robots.txt and sitemap.xml follow the resolved public origin. In preview mode
  // the artifact refuses indexing outright rather than advertising a placeholder.
  const siteUrl = resolveSiteUrl();

  if (siteUrl) {
    const lastModified = new Date().toISOString().slice(0, 10);
    const urls = indexableRoutes.map((route) => [
      '  <url>',
      `    <loc>${siteUrl}${route.path}</loc>`,
      `    <lastmod>${lastModified}</lastmod>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority}</priority>`,
      '  </url>',
    ].join('\n')).join('\n');

    await writeFile(path.join(stagedOutput, 'sitemap.xml'), [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls,
      '</urlset>',
      '',
    ].join('\n'), 'utf8');

    await writeFile(path.join(stagedOutput, 'robots.txt'), [
      'User-agent: *',
      'Allow: /',
      '',
      '# Sample-data demo applications are not search destinations.',
      'Disallow: /demos/',
      '',
      `Sitemap: ${siteUrl}/sitemap.xml`,
      '',
    ].join('\n'), 'utf8');

    console.log(`Generated sitemap.xml and robots.txt for ${siteUrl}.`);
  } else {
    await writeFile(path.join(stagedOutput, 'robots.txt'), [
      `# No public origin is configured. Set ${SITE_URL_VARIABLE} to publish.`,
      'User-agent: *',
      'Disallow: /',
      '',
    ].join('\n'), 'utf8');

    console.log(`No ${SITE_URL_VARIABLE} set; emitted a disallow-all robots.txt and no sitemap.`);
  }

  await removeDirectory(finalOutput);
  const strategy = await promoteDirectory(stagedOutput, finalOutput);
  console.log(`Staged merged production output in dist/ (${strategy}).`);
} catch (error) {
  await removeDirectory(stagedOutput);
  throw error;
}
