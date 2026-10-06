import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SITE_URL_VARIABLE, indexableRoutes, resolveSiteUrl } from './site-config.mjs';
import { activeDemoSlugs, portfolioCv, portfolioOwner, projectSlugs, publishedAssets } from './portfolio-config.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const staticRoot = path.join(repositoryRoot, 'dist');
const expectedPages = [
  'index.html',
  ...projectSlugs.map((slug) => `work/${slug}/index.html`),
  '404.html',
];
const vercelConfig = JSON.parse(await readFile(path.join(repositoryRoot, 'vercel.json'), 'utf8'));
for (const [key, expected] of Object.entries({
  framework: null,
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  trailingSlash: true,
})) {
  assert.equal(vercelConfig[key], expected, `Vercel ${key} must publish the checked repository-root dist/.`);
}
assert.equal(activeDemoSlugs.length, 0, 'Unaudited demos cannot be shipped.');

const filesUnder = async (directory, prefix = '') => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    assert.ok(!entry.isSymbolicLink(), `A public file must not be a symlink: ${relative}`);
    if (entry.isDirectory()) files.push(...await filesUnder(path.join(directory, entry.name), relative));
    else files.push(relative);
  }
  return files.sort();
};
const files = await filesUnder(staticRoot);
assert.deepEqual(files.filter((file) => file.endsWith('.html')).sort(), [...expectedPages].sort(),
  `The generated routes must contain only Yousef’s homepage, ${projectSlugs.length} case studies, and 404.`);
const allowedFiles = new Set([...expectedPages, ...publishedAssets, 'robots.txt', 'sitemap.xml']);
const staleOwner = /Ahmed|Hossam|7ossam26|hossam\.working1|\bVertex\b|AutoZain|\bRamex\b|\bRoya\b|ERP-V2|Film-production-fin-system|hossam-portfolio|ah-portfolio-demo|Ahmed_Hossam_CV|\bGiza\b/i;
for (const file of files) {
  assert.ok(allowedFiles.has(file) || /^_assets\/[^/]+\.(?:css|js)$/.test(file),
    `Unapproved public file: ${file}. Historical PDFs, screenshots, and demos must stay outside dist/.`);
  if (file === portfolioCv.path) {
    const cv = await readFile(path.join(staticRoot, file));
    assert.equal(createHash('sha256').update(cv).digest('hex'), portfolioCv.sha256,
      'The staged CV must match the inspected owner PDF.');
    continue;
  }
  const text = await readFile(path.join(staticRoot, file), 'utf8');
  // The RealEstate repository has verified collaborators. A single factual
  // prose credit may name Ahmed, but metadata/contact identity cannot do so.
  const checkedText = file === 'work/realestate/index.html'
    ? text.replace(/(<p(?:\s[^>]*)?>[^<]*)\bAhmed\b(?=[^<]*<\/p>)/, '$1verified collaborator')
    : text;
  assert.ok(!staleOwner.test(checkedText), `Historical owner/project content leaked into ${file}.`);
  assert.ok(!/LOCAL VALIDATION ONLY|host-harness|__demo-host-harness|data-demo-trigger|data-demo-host/i.test(text),
    `An inactive demo or internal harness leaked into ${file}.`);
}

const pages = new Map(await Promise.all(expectedPages.map(async (file) => [
  file, await readFile(path.join(staticRoot, file), 'utf8'),
])));
const home = pages.get('index.html');
assert.ok(home.includes(portfolioOwner.name), 'The homepage must identify the active owner.');
for (const link of [`mailto:${portfolioOwner.email}`, portfolioOwner.github, portfolioOwner.linkedin]) {
  assert.ok(home.includes(`href="${link}"`), `Missing verified owner contact link: ${link}`);
}
assert.ok(home.includes(`href="/${portfolioCv.path}"`), 'The homepage must link to the verified owner CV.');
assert.ok(!/\bIn production\b/i.test(home), 'Repository evidence does not confirm a production deployment.');
for (const slug of projectSlugs) {
  assert.ok(home.includes(`href="/work/${slug}/"`), `Homepage must link to case study ${slug}.`);
}

const siteUrl = resolveSiteUrl();
const publicRoutes = new Set(indexableRoutes.map((route) => route.path));
const titles = new Set();
const routeForPage = (file) => file === 'index.html' ? '/' : `/${file.replace(/index\.html$/, '')}`;
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1];
const decodeHtml = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const fixtureOrigin = 'https://portfolio-validation.invalid';

for (const [file, html] of pages) {
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  assert.ok(title?.includes(portfolioOwner.name), `Missing owner-specific title: ${file}`);
  assert.ok(!titles.has(title), `Page title is not unique: ${file}`);
  titles.add(title);
  assert.ok(/<meta name="description" content="[^"]+"/i.test(html), `Missing page description: ${file}`);
  assert.equal((html.match(/<h1(?:\s|>)/gi) ?? []).length, 1, `Expected one primary heading: ${file}`);
  const mainRegions = [...html.matchAll(/<main\b([^>]*)>([\s\S]*?)<\/main>/gi)];
  assert.equal(mainRegions.length, 1, `Expected one main content landmark: ${file}`);
  const [, mainAttributes, mainContent] = mainRegions[0];
  assert.equal(attribute(mainAttributes, 'id'), 'main-content', `Skip target must be the main content: ${file}`);
  assert.equal(attribute(mainAttributes, 'tabindex'), '-1', `Skip target must accept native fragment focus: ${file}`);
  assert.ok(/<h1(?:\s|>)/i.test(mainContent), `Skip target must contain the page heading: ${file}`);
  assert.ok(!/aria-label="Main navigation"|<footer\b/i.test(mainContent),
    `Skipping navigation must bypass the global header/footer: ${file}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate element IDs can break page navigation: ${file}`);
  for (const match of html.matchAll(/\baria-(?:labelledby|describedby)="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) {
      assert.ok(ids.includes(id), `Missing accessible label/description target ${id}: ${file}`);
    }
  }
  assert.ok(/<html[^>]+lang="en"/i.test(html), `Missing document language: ${file}`);
  assert.ok(!/\bTODO\b|lorem ipsum|details to confirm|not yet available/i.test(html),
    `Internal placeholder copy reached ${file}.`);

  const route = routeForPage(file);
  const shouldIndex = Boolean(siteUrl) && publicRoutes.has(route);
  const robotsTag = html.match(/<meta\b[^>]*name="robots"[^>]*>/i)?.[0] ?? '';
  assert.equal(attribute(robotsTag, 'content'), shouldIndex ? 'index,follow' : 'noindex,nofollow',
    `Incorrect indexing mode: ${file}`);
  const canonicalTag = html.match(/<link\b[^>]*rel="canonical"[^>]*>/i)?.[0];
  if (shouldIndex) {
    assert.equal(attribute(canonicalTag ?? '', 'href'), `${siteUrl}${route}`, `Wrong canonical URL: ${file}`);
    assert.ok(html.includes(`content="${portfolioOwner.name}"`), `Missing social owner metadata: ${file}`);
  } else {
    assert.ok(!canonicalTag, `Preview/error page must not carry a canonical URL: ${file}`);
  }

  for (const tag of html.matchAll(/<(?:a|img|script|link)\b[^>]*>/gi)) {
    const source = tag[0];
    const ref = attribute(source, 'href') ?? attribute(source, 'src');
    if (!ref) continue;
    const value = decodeHtml(ref);
    assert.ok(!/^(?:javascript|data):/i.test(value), `Unexpected active/embedded reference in ${file}: ${value}`);
    if (value.startsWith('mailto:')) {
      assert.equal(value, `mailto:${portfolioOwner.email}`, `Unexpected email recipient in ${file}`);
      continue;
    }
    const url = new URL(value, `${fixtureOrigin}${route}`);
    if (url.origin !== fixtureOrigin) {
      assert.equal(url.protocol, 'https:', `External URLs must use HTTPS: ${value}`);
      if (/^<(?:img|script)\b/i.test(source)
        || (/^<link\b/i.test(source) && /rel="(?:stylesheet|preload|modulepreload|icon)"/i.test(source))) {
        throw new Error(`Remote startup asset is not approved in ${file}: ${value}`);
      }
      if (url.hostname === 'github.com') {
        assert.ok(url.pathname === '/youseffahem' || url.pathname.startsWith('/youseffahem/'),
          `Repository/profile link belongs to a different owner: ${value}`);
      }
      if (attribute(source, 'target') === '_blank') {
        const rel = attribute(source, 'rel') ?? '';
        assert.ok(/\bnoopener\b/.test(rel) && /\bnoreferrer\b/.test(rel), `Missing external-link protection: ${value}`);
      }
      continue;
    }
    const localPath = decodeURIComponent(url.pathname);
    const target = localPath.endsWith('/') ? `${localPath}index.html` : localPath;
    assert.ok(!target.split('/').includes('..'), `Unsafe asset path in ${file}`);
    await access(path.join(staticRoot, target.slice(1)), constants.R_OK);
    if (url.hash) {
      const targetHtml = pages.get(target.slice(1));
      const anchor = decodeURIComponent(url.hash.slice(1));
      assert.ok(targetHtml?.includes(`id="${anchor}"`), `Broken local anchor in ${file}: ${value}`);
    }
  }
}

const robots = await readFile(path.join(staticRoot, 'robots.txt'), 'utf8');
if (siteUrl) {
  assert.ok(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`), 'robots.txt must point to the current sitemap.');
  const sitemap = await readFile(path.join(staticRoot, 'sitemap.xml'), 'utf8');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
  assert.deepEqual(locations, indexableRoutes.map((route) => `${siteUrl}${route.path}`).sort(),
    `The sitemap must include exactly the homepage and ${projectSlugs.length} active case studies.`);
} else {
  assert.match(robots, /^\s*Disallow:\s*\/\s*$/m, 'Preview robots must disallow indexing.');
  assert.ok(!files.includes('sitemap.xml'), `A sitemap requires ${SITE_URL_VARIABLE}.`);
}
console.log(`Verified ${pages.size} pages, every local link/anchor/asset, active owner metadata, and ${siteUrl ? 'public' : 'preview'} indexing.`);
console.log('Verified no historical identity, CV, screenshots, demo payloads, or unaudited production claims in dist/.');
