import { access, readFile, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SITE_URL_VARIABLE, indexableRoutes, resolveSiteUrl } from './site-config.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const staticRoot = path.join(repositoryRoot, 'dist');
const vercelConfig = JSON.parse(await readFile(path.join(repositoryRoot, 'vercel.json'), 'utf8'));
const registry = JSON.parse(await readFile(path.join(
  repositoryRoot,
  'packages',
  'demo-contract',
  'demo-registry.json',
), 'utf8'));
const pages = [
  ['home', 'index.html', 'Ahmed Hossam — Software Engineer'],
  ['Vertex', 'work/vertex/index.html', 'Vertex ERP case study — Ahmed Hossam'],
  ['AutoZain', 'work/autozain/index.html', 'AutoZain case study — Ahmed Hossam'],
  ['Roya', 'work/roya/index.html', 'Roya case study — Ahmed Hossam'],
  ['Ramex', 'work/ramex/index.html', 'Ramex case study — Ahmed Hossam'],
  ['404', '404.html', 'Page not found — Ahmed Hossam'],
];
const renderedPages = await Promise.all(pages.map(async ([label, relativePath, title]) => ({
  label,
  relativePath,
  title,
  html: await readFile(path.join(staticRoot, relativePath), 'utf8'),
})));
const html = renderedPages[0].html;

const expectedVercelConfig = {
  framework: null,
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  trailingSlash: true,
};

for (const [key, expected] of Object.entries(expectedVercelConfig)) {
  if (vercelConfig[key] !== expected) {
    throw new Error(`Vercel ${key} must be ${JSON.stringify(expected)} so the merged static output is deployed.`);
  }
}
console.log('Verified Vercel deploys the merged root dist/ with trailing-slash routes.');

const siteUrl = resolveSiteUrl();
const publishedRoutes = new Set(indexableRoutes.map((route) => route.path));
const routeForPage = (relativePath) => (relativePath === 'index.html'
  ? '/'
  : `/${relativePath.replace(/index\.html$/, '')}`);

const requirements = [
  ['approved page title', /<title>Ahmed Hossam — Software Engineer<\/title>/i],
  ['local CV path', /href="\/Ahmed_Hossam_CV\.pdf"/i],
  ['local favicon path', /href="\/favicon\.svg"/i],
  ['contact email path', /href="mailto:hossam\.working1@gmail\.com"/i],
];

for (const [label, pattern] of requirements) {
  if (!pattern.test(html)) throw new Error(`Missing ${label} in generated index.html.`);
  console.log(`Verified static HTML: ${label}`);
}

for (const page of renderedPages) {
  if (!page.html.includes(`<title>${page.title}</title>`)) {
    throw new Error(`Missing unique title for ${page.label}: ${page.relativePath}`);
  }
  if (!/<meta name="description" content="[^"]+"\s*\/?\s*>/i.test(page.html)) {
    throw new Error(`Missing description for ${page.label}: ${page.relativePath}`);
  }

  const route = routeForPage(page.relativePath);
  const shouldIndex = Boolean(siteUrl) && publishedRoutes.has(route);
  const expectedRobots = shouldIndex ? 'index,follow' : 'noindex,nofollow';
  if (!new RegExp(`<meta name="robots" content="${expectedRobots}"\\s*/?\\s*>`, 'i').test(page.html)) {
    throw new Error(`Expected robots "${expectedRobots}" on ${page.relativePath}`);
  }

  const hasCanonical = /<link[^>]+rel="canonical"/i.test(page.html);
  if (shouldIndex) {
    const expectedCanonical = `<link rel="canonical" href="${siteUrl}${route}">`;
    if (!page.html.includes(expectedCanonical)) {
      throw new Error(`Expected canonical ${expectedCanonical} on ${page.relativePath}`);
    }
  } else if (hasCanonical) {
    throw new Error(
      siteUrl
        ? `A non-indexable page must not declare a canonical URL: ${page.relativePath}`
        : `A canonical URL was generated before ${SITE_URL_VARIABLE} was supplied: ${page.relativePath}`,
    );
  }

  console.log(`Verified generated page: ${page.relativePath} (robots ${expectedRobots}${shouldIndex ? ', canonical present' : ''})`);
}

// Demo documents must never become search destinations, published or not.
for (const entry of registry.filter((candidate) => candidate.available)) {
  const demoHtml = await readFile(path.join(staticRoot, 'demos', entry.slug, 'index.html'), 'utf8');
  if (!/<meta name="robots" content="noindex,nofollow"\s*\/?\s*>/i.test(demoHtml)) {
    throw new Error(`Demo document is missing its noindex protection: demos/${entry.slug}/index.html`);
  }
  if (!/<noscript>/i.test(demoHtml)) {
    throw new Error(`Demo document is missing a no-JavaScript fallback: demos/${entry.slug}/index.html`);
  }
  console.log(`Verified demo document: demos/${entry.slug}/index.html (noindex, noscript fallback)`);
}

// robots.txt and sitemap.xml must match the resolved publication mode.
const robots = await readFile(path.join(staticRoot, 'robots.txt'), 'utf8');
if (siteUrl) {
  if (!robots.includes('Disallow: /demos/') || !robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) {
    throw new Error('robots.txt does not disallow /demos/ or does not reference the sitemap.');
  }
  const sitemap = await readFile(path.join(staticRoot, 'sitemap.xml'), 'utf8');
  for (const route of indexableRoutes) {
    if (!sitemap.includes(`<loc>${siteUrl}${route.path}</loc>`)) {
      throw new Error(`sitemap.xml is missing ${route.path}`);
    }
  }
  if (/\/demos\//.test(sitemap)) throw new Error('sitemap.xml must not list demo routes.');
  if (/404/.test(sitemap)) throw new Error('sitemap.xml must not list the 404 page.');
  console.log(`Verified robots.txt and sitemap.xml for ${siteUrl}.`);
} else {
  if (!/^\s*Disallow:\s*\/\s*$/m.test(robots)) {
    throw new Error('Without a public origin, robots.txt must disallow everything.');
  }
  try {
    await access(path.join(staticRoot, 'sitemap.xml'), constants.R_OK);
    throw new Error(`A sitemap was generated before ${SITE_URL_VARIABLE} was supplied.`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  console.log(`Verified preview mode: disallow-all robots.txt and no sitemap (${SITE_URL_VARIABLE} unset).`);
}

const allHtml = renderedPages.map((page) => page.html).join('\n');

if (/(?:src|href)="[^"]*\/demos\//i.test(allHtml)) {
  throw new Error('The initial shell references demo assets before a demo can be opened.');
}

if (/Preview demo|Project contribution details to confirm|\bTODO\b/i.test(allHtml)) {
  throw new Error('Generated pages expose internal placeholder copy.');
}

for (const entry of registry) {
  const triggerPattern = new RegExp(`data-demo-trigger=["']${entry.slug}["']`, 'i');
  if (entry.available && !triggerPattern.test(allHtml)) {
    throw new Error(`Available demo has no host trigger: ${entry.slug}`);
  }
  if (!entry.available && triggerPattern.test(allHtml)) {
    throw new Error(`Unavailable demo exposes a host trigger: ${entry.slug}`);
  }

  if (entry.available) {
    await access(path.join(staticRoot, 'demos', entry.slug, 'index.html'), constants.R_OK);
    console.log(`Verified available demo entry: ${entry.slug}`);
  }
}

const internalEvidenceMarkers = [
  '7254e34b49acfbe394da3a889abe6e458084cb38',
  'frontend/src/pages/bom/BOMManager.jsx',
  'Exact contribution is unconfirmed',
];

for (const marker of internalEvidenceMarkers) {
  if (allHtml.includes(marker)) {
    throw new Error(`Internal project evidence was rendered publicly: ${marker}`);
  }
}


const localAssetPaths = new Set();
for (const match of allHtml.matchAll(/(?:src|href)="(\/[^"#?]+\.(?:css|js|pdf|svg|woff2|png|webp|jpe?g))[^\"]*"/gi)) {
  localAssetPaths.add(match[1]);
}

for (const assetPath of localAssetPaths) {
  await access(path.join(staticRoot, assetPath.slice(1)), constants.R_OK);
  console.log(`Verified local asset path: ${assetPath}`);
}

const listFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(target) : [target];
  }));
  return nested.flat();
};

for (const filePath of await listFiles(staticRoot)) {
  const relativePath = path.relative(staticRoot, filePath).replaceAll('\\', '/');
  if (relativePath.includes('__demo-host-harness')) {
    throw new Error(`Internal harness file reached production output: ${relativePath}`);
  }
  if (/\.(?:html|js|css|json)$/i.test(filePath)) {
    const contents = await readFile(filePath, 'utf8');
    if (contents.includes('LOCAL VALIDATION ONLY') || contents.includes('host-harness')) {
      throw new Error(`Internal harness marker reached production output: ${relativePath}`);
    }
  }
}

console.log('Verified registry availability, no canonical URL, no eager demo asset references, no harness output, and no internal evidence notes.');
