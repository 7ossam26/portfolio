import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectOutput, json, nginxConfig, sha256 } from '../../scripts/release-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const prepared = JSON.parse(await readFile(path.join(root, 'output/phase-09/prepared-release.json'), 'utf8'));
assert.equal(sha256(await readFile(prepared.artifact)), prepared.sha256, 'Archive checksum');
const bundle = path.join(root, 'output/phase-09', `serve-${prepared.sha256}`);
await mkdir(path.join(bundle, 'logs'), { recursive: true });
execFileSync('tar', ['-xzf', prepared.artifact, '-C', bundle]);
const manifest = JSON.parse(await readFile(path.join(bundle, 'release.json'), 'utf8'));
const actual = await inspectOutput(path.join(bundle, 'html'));
assert.equal(actual.outputSha256, manifest.outputSha256, 'Extracted output checksum');
assert.equal(sha256(await readFile(path.join(bundle, 'source.tar.gz'))), manifest.sourceArchiveSha256);
const archivedConfig = await readFile(path.join(bundle, 'nginx.conf'), 'utf8');
assert.equal(archivedConfig, nginxConfig(actual, manifest.origin), 'Configuration matches output');

let origin = process.env.PORTFOLIO_VERIFY_ORIGIN;
let processHandle;
const checks = [];
const check = (id, fn) => { fn(); checks.push({ id, passed: true }); };
const request = (route, options) => fetch(`${origin}${route}`, { redirect: 'manual', ...options });
try {
  if (origin) {
    assert.equal(new URL(origin).origin, manifest.origin, 'Verify only the selected artifact origin');
  } else {
    const binary = process.env.PORTFOLIO_NGINX;
    if (!binary) throw new Error('Set PORTFOLIO_NGINX to a native nginx executable for local HTTP verification.');
    const reservation = createServer();
    await new Promise((resolve) => reservation.listen(0, '127.0.0.1', resolve));
    const { port } = reservation.address();
    await new Promise((resolve) => reservation.close(resolve));
    const config = archivedConfig.replace('listen 8080;', `listen 127.0.0.1:${port};`);
    await writeFile(path.join(bundle, 'local-test.conf'), config);
    const prefix = `${bundle.replaceAll('\\', '/')}/`;
    execFileSync(binary, ['-p', prefix, '-c', 'local-test.conf', '-t']);
    processHandle = spawn(binary, ['-p', prefix, '-c', 'local-test.conf', '-g', 'daemon off;'], { windowsHide: true, stdio: 'ignore' });
    let startupError;
    processHandle.on('error', (error) => { startupError = error; });
    origin = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let attempt = 0; attempt < 40; attempt++) {
      if (startupError) throw startupError;
      try { await request('/'); ready = true; break; } catch { await new Promise((resolve) => setTimeout(resolve, 100)); }
    }
    assert.ok(ready, 'Nginx started');
  }
  for (const file of manifest.files) {
    const response = await request(`/${file.path}`);
    const body = Buffer.from(await response.arrayBuffer());
    check(`file/${file.path}`, () => {
      assert.equal(response.status, 200);
      assert.equal(sha256(body), file.sha256);
      assert.equal(response.headers.get('cache-control'), file.cache);
      assert.equal(response.headers.get('etag'), `W/"${file.sha256}"`);
      assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      const policy = response.headers.get('content-security-policy');
      assert.ok(policy?.includes("connect-src 'none'"));
      assert.ok(policy?.includes("frame-ancestors 'self'"));
      assert.ok(!/unsafe-inline|unsafe-eval|https?:|\*/.test(policy));
      if (file.path.endsWith('.html')) assert.equal(policy, manifest.documents[`/${file.path}`].policy);
      if (file.path.startsWith('demos/')) assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
      if (/\.js$/.test(file.path)) assert.match(response.headers.get('content-type'), /javascript/);
      if (/\.css$/.test(file.path)) assert.match(response.headers.get('content-type'), /text\/css/);
      if (/\.pdf$/.test(file.path)) assert.equal(response.headers.get('content-type'), 'application/pdf');
    });
  }
  const publicRoutes = ['/', ...['vertex', 'autozain', 'roya', 'ramex'].map((slug) => `/work/${slug}/`)];
  const routes = [...publicRoutes, ...['vertex', 'autozain', 'roya', 'ramex'].map((slug) => `/demos/${slug}/`)];
  for (const route of routes) {
    const response = await request(route);
    const html = await response.text();
    check(`direct/${route}`, () => {
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('content-security-policy'), manifest.documents[`${route}index.html`].policy);
      assert.match(html, /<title>[^<]+<\/title>/);
      if (manifest.origin && publicRoutes.includes(route)) {
        assert.ok(html.includes(`href="${manifest.origin}${route}"`));
        assert.ok(html.includes('content="index,follow"'));
        assert.equal(response.headers.get('x-robots-tag'), null);
      } else assert.match(html, /name="robots" content="noindex,nofollow"/);
    });
  }
  const home = await request('/');
  const homeBody = await home.text();
  check('contact-and-cv-links', () => {
    assert.ok(homeBody.includes('mailto:'));
    assert.ok(homeBody.includes('https://github.com/7ossam26'));
    assert.ok(homeBody.includes('/Ahmed_Hossam_CV.pdf'));
  });
  const conditional = await request('/', { headers: { 'If-None-Match': home.headers.get('etag') } });
  check('html-revalidation', () => {
    assert.equal(conditional.status, 304);
    assert.equal(conditional.headers.get('cache-control'), 'public, max-age=0, must-revalidate');
    assert.equal(conditional.headers.get('etag'), home.headers.get('etag'));
  });
  const staleValidator = await request('/', { headers: { 'If-None-Match': `W/"${'0'.repeat(64)}"` } });
  check('stale-content-validator', () => { assert.equal(staleValidator.status, 200); });
  const futureTimestamp = await request('/', { headers: { 'If-Modified-Since': 'Fri, 01 Jan 2038 00:00:00 GMT' } });
  check('timestamps-cannot-hide-a-release', () => { assert.equal(futureTimestamp.status, 200); });
  const immutable = manifest.files.find((file) => file.cache.includes('immutable') && file.path.endsWith('.js'));
  assert.ok(immutable);
  const asset = await request(`/${immutable.path}`, { headers: { 'Accept-Encoding': 'gzip' } });
  check('gzip-and-content-validator', () => {
    assert.equal(asset.headers.get('content-encoding'), 'gzip');
    assert.match(asset.headers.get('vary'), /Accept-Encoding/i);
    assert.equal(asset.headers.get('etag'), `W/"${immutable.sha256}"`);
  });
  const assetConditional = await request(`/${immutable.path}`, { headers: { 'If-None-Match': asset.headers.get('etag') } });
  check('immutable-revalidation', () => { assert.equal(assetConditional.status, 304); assert.equal(assetConditional.headers.get('cache-control'), immutable.cache); });
  const unsupportedMethod = await request('/', { method: 'POST' });
  check('static-only-methods', () => { assert.equal(unsupportedMethod.status, 405); assert.equal(unsupportedMethod.headers.get('cache-control'), 'no-store'); });
  const directory = await request('/work/vertex');
  check('directory-redirect', () => { assert.equal(directory.status, 301); assert.equal(directory.headers.get('location'), '/work/vertex/'); });
  const head = await request('/Ahmed_Hossam_CV.pdf', { method: 'HEAD' });
  check('cv-head', () => { assert.equal(head.status, 200); assert.equal(head.headers.get('content-type'), 'application/pdf'); });
  const cv = await request('/Ahmed_Hossam_CV.pdf', { headers: { Range: 'bytes=0-9' } });
  check('cv-range', () => { assert.equal(cv.status, 206); assert.match(cv.headers.get('content-range'), /^bytes 0-9\//); });
  for (const route of ['/missing-page/', '/_assets/missing.js', '/demos/vertex/assets/missing.css', '/source.tar.gz', '/release.json', '/.env']) {
    const response = await request(route);
    const body = await response.text();
    check(`missing/${route}`, () => {
      assert.equal(response.status, 404);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
      if (/\.(js|css|json)$/.test(route)) { assert.ok(!body.includes('<html')); assert.match(response.headers.get('content-type'), /text\/plain/); }
    });
  }
  const robot = await request('/robots.txt');
  const robotBody = await robot.text();
  const sitemap = await request('/sitemap.xml');
  const sitemapBody = await sitemap.text();
  check('publication-mode', () => {
    if (manifest.origin) {
      assert.ok(robotBody.includes(`Sitemap: ${manifest.origin}/sitemap.xml`));
      assert.ok(robotBody.includes('Disallow: /demos/'));
      assert.equal(sitemap.status, 200);
      assert.equal((sitemapBody.match(/<loc>/g) ?? []).length, 5);
      assert.ok(!sitemapBody.includes('/demos/') && !sitemapBody.includes('/404'));
    } else { assert.ok(robotBody.includes('Disallow: /')); assert.equal(sitemap.status, 404); }
  });
  const report = { scope: process.env.PORTFOLIO_VERIFY_ORIGIN ? 'selected-public-host' : 'local-native-nginx-only', origin,
    artifactSha256: prepared.sha256, node: process.version, checks, summary: { total: checks.length, passed: checks.length, failed: 0 } };
  await writeFile(path.join(root, 'output/phase-09/release-http.json'), json(report));
  console.log(`PASS ${checks.length} release HTTP checks (${report.scope})`);
  if (process.env.PORTFOLIO_VERIFY_BROWSER === '1') {
    for (const suite of ['demo-journeys', 'network-isolation']) {
      execFileSync(process.execPath, [path.join(root, `tests/phase-08/${suite}.mjs`)], {
        cwd: root, stdio: 'inherit', env: { ...process.env, PORTFOLIO_VERIFY_ORIGIN: origin,
          PORTFOLIO_VERIFY_ARTIFACT_ROOT: path.join(root, 'output/phase-09/browser') },
      });
    }
  }
} catch (error) {
  await writeFile(path.join(root, 'output/phase-09/release-http.json'), json({ origin, checks, error: error.stack, passed: false }));
  throw error;
} finally {
  if (processHandle) {
    execFileSync(process.env.PORTFOLIO_NGINX, ['-p', `${bundle.replaceAll('\\', '/')}/`, '-c', 'local-test.conf', '-s', 'quit']);
  }
}
