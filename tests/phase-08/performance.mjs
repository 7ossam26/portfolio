// Phase 08 — measured startup payloads, click-to-ready, and lab timings against
// the budgets in docs/portfolio/acceptance-checklist.md. Everything here is a
// measurement of the production dist/ output; nothing is a field metric.

import { chromium } from 'playwright';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import {
  Results, projectSlugs, recordRequests, saveJson, startStaticServer, staticRoot,
  waitForHostState,
} from './lib/harness.mjs';

const BUDGETS = {
  initialJsGzipKiB: 45,
  initialCssGzipKiB: 45,
  initialTransferKiB: 450,
  demoAssetsBeforeOpen: 0,
  firstDemoPayloadGzipKiB: 800,
  clickToReadyMs: 3000,
};

// Cold-cache network shaping from the checklist: 10 Mbps, 80 ms RTT, 4x CPU.
const THROTTLE = {
  offline: false,
  downloadThroughput: (10 * 1000 * 1000) / 8,
  uploadThroughput: (10 * 1000 * 1000) / 8,
  latency: 80,
};
const CPU_SLOWDOWN = 4;

const kib = (bytes) => Math.round((bytes / 1024) * 100) / 100;
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
};

const server = await startStaticServer();
const browser = await chromium.launch();
const results = new Results('performance');
const report = { conditions: {}, budgets: BUDGETS, emitted: {}, startup: [], demoPayloads: [], clickToReady: [], labTimings: [] };

const commit = await import('node:child_process')
  .then(({ execSync }) => execSync('git rev-parse HEAD', { cwd: staticRoot + '/..' }).toString().trim())
  .catch(() => 'unavailable');

report.conditions = {
  browser: `Chromium ${browser.version()} (Playwright 1.63.0, headless shell)`,
  node: process.version,
  platform: `${process.platform} ${process.arch}`,
  artifact: 'production dist/ served over loopback HTTP',
  commitAtMeasurement: commit,
  network: '10 Mbps down/up, 80 ms added latency (CDP Network.emulateNetworkConditions)',
  cpu: `${CPU_SLOWDOWN}x slowdown (CDP Emulation.setCPUThrottlingRate)`,
  cache: 'cold — a fresh browser context per run, no service worker',
  runs: 3,
  measuredAt: new Date().toISOString(),
  caveat: 'Lab measurements on one Windows workstation. They are not field data and not a substitute for real-user metrics.',
};

// =====================================================================
// 1. Emitted artifact sizes straight from disk
// =====================================================================
{
  const walk = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(target) : [target];
    }));
    return nested.flat();
  };

  const files = await walk(staticRoot);
  const grouped = {};
  let total = 0;
  for (const file of files) {
    const details = await stat(file);
    total += details.size;
    const relative = path.relative(staticRoot, file).replaceAll('\\', '/');
    const group = relative.startsWith('demos/') ? `demos/${relative.split('/')[1]}` : 'shell';
    grouped[group] = (grouped[group] ?? 0) + details.size;
  }
  report.emitted = {
    fileCount: files.length,
    totalKiB: kib(total),
    byArea: Object.fromEntries(Object.entries(grouped).map(([key, value]) => [key, kib(value)])),
  };
  results.record(
    'artifact/emitted-size',
    true,
    `dist/ holds ${files.length} files totalling ${kib(total)} KiB (${Object.entries(report.emitted.byArea).map(([k, v]) => `${k} ${v} KiB`).join(', ')})`,
  );
}

// =====================================================================
// 2. Startup payload per route, from real browser requests
// =====================================================================
for (const route of ['/', '/work/vertex/', '/work/autozain/', '/work/roya/', '/work/ramex/']) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const requests = recordRequests(page);
  await page.goto(`${server.origin}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const byType = (types) => requests.filter((entry) => types.includes(entry.resourceType));
  const sum = (entries, field) => entries.reduce((carry, entry) => carry + (entry[field] ?? 0), 0);

  const scripts = byType(['script']);
  const styles = byType(['stylesheet']);
  const all = requests.filter((entry) => entry.status !== null);

  const measurement = {
    route,
    requests: all.length,
    jsGzipKiB: kib(sum(scripts, 'gzipBytes')),
    jsRawKiB: kib(sum(scripts, 'transferBytes')),
    cssGzipKiB: kib(sum(styles, 'gzipBytes')),
    cssRawKiB: kib(sum(styles, 'transferBytes')),
    totalTransferKiB: kib(sum(all, 'transferBytes')),
    demoRequests: all.filter((entry) => entry.url.includes('/demos/')).length,
    breakdown: all.map((entry) => ({
      path: entry.url.replace(server.origin, ''),
      type: entry.resourceType,
      rawKiB: kib(entry.transferBytes ?? 0),
      gzipKiB: kib(entry.gzipBytes ?? 0),
    })),
  };
  report.startup.push(measurement);

  results.record(
    `budget/initial-js${route}`,
    measurement.jsGzipKiB <= BUDGETS.initialJsGzipKiB,
    `${measurement.jsGzipKiB} KiB gzip of JavaScript (${measurement.jsRawKiB} KiB raw) against a ${BUDGETS.initialJsGzipKiB} KiB budget`,
  );
  results.record(
    `budget/initial-css${route}`,
    measurement.cssGzipKiB <= BUDGETS.initialCssGzipKiB,
    `${measurement.cssGzipKiB} KiB gzip of CSS (${measurement.cssRawKiB} KiB raw) against a ${BUDGETS.initialCssGzipKiB} KiB budget`,
  );
  results.record(
    `budget/initial-transfer${route}`,
    measurement.totalTransferKiB <= BUDGETS.initialTransferKiB,
    `${measurement.totalTransferKiB} KiB across ${measurement.requests} requests against a ${BUDGETS.initialTransferKiB} KiB budget`,
  );
  results.record(
    `budget/no-demo-assets${route}`,
    measurement.demoRequests === BUDGETS.demoAssetsBeforeOpen,
    `${measurement.demoRequests} demo requests before activation (budget ${BUDGETS.demoAssetsBeforeOpen})`,
  );

  await context.close();
}

// =====================================================================
// 3. Click-to-ready, three cold runs per demo under the recorded throttle
// =====================================================================
for (const slug of projectSlugs) {
  const timings = [];
  const payloads = [];

  for (let run = 1; run <= 3; run += 1) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const requests = recordRequests(page);
    const session = await context.newCDPSession(page);
    await session.send('Network.emulateNetworkConditions', THROTTLE);
    await session.send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN });

    await page.goto(`${server.origin}${slug === 'vertex' ? '/' : `/work/${slug}/`}`, { waitUntil: 'networkidle' });
    const beforeClick = requests.length;

    // Time the host's own validated READY signal, measured inside the page.
    await page.evaluate(() => {
      window.__clickToReady = null;
      const dialog = document.querySelector('[data-demo-host]');
      const observer = new MutationObserver(() => {
        if (dialog.dataset.state === 'ready' && window.__readyStart && window.__clickToReady === null) {
          window.__clickToReady = performance.now() - window.__readyStart;
        }
      });
      observer.observe(dialog, { attributes: true, attributeFilter: ['data-state'] });
      document.addEventListener('click', (event) => {
        if (event.target.closest('[data-demo-trigger]')) window.__readyStart = performance.now();
      }, true);
    });

    await page.locator(`[data-demo-trigger="${slug}"]`).first().click();
    await waitForHostState(page, 'ready', 30_000);
    const elapsed = await page.evaluate(() => window.__clickToReady);
    timings.push(Math.round(elapsed));

    const demoAssets = requests.slice(beforeClick).filter((entry) => entry.url.includes('/demos/') && entry.status !== null);
    const scriptsAndStyles = demoAssets.filter((entry) => ['script', 'stylesheet'].includes(entry.resourceType));
    payloads.push({
      run,
      jsCssGzipKiB: kib(scriptsAndStyles.reduce((carry, entry) => carry + (entry.gzipBytes ?? 0), 0)),
      jsCssRawKiB: kib(scriptsAndStyles.reduce((carry, entry) => carry + (entry.transferBytes ?? 0), 0)),
      totalRawKiB: kib(demoAssets.reduce((carry, entry) => carry + (entry.transferBytes ?? 0), 0)),
      requests: demoAssets.length,
      assets: demoAssets.map((entry) => ({
        path: entry.url.replace(server.origin, '').split('?')[0],
        type: entry.resourceType,
        rawKiB: kib(entry.transferBytes ?? 0),
        gzipKiB: kib(entry.gzipBytes ?? 0),
      })),
    });

    await context.close();
  }

  const medianMs = median(timings);
  const worstMs = Math.max(...timings);
  const payload = payloads[0];

  results.record(
    `budget/click-to-ready:${slug}`,
    medianMs <= BUDGETS.clickToReadyMs,
    `median ${medianMs} ms, worst ${worstMs} ms across runs [${timings.join(', ')}] against a ${BUDGETS.clickToReadyMs} ms target`,
  );
  results.record(
    `budget/first-demo-payload:${slug}`,
    payload.jsCssGzipKiB <= BUDGETS.firstDemoPayloadGzipKiB,
    `${payload.jsCssGzipKiB} KiB gzip of JS+CSS (${payload.jsCssRawKiB} KiB raw; ${payload.totalRawKiB} KiB including fonts and images across ${payload.requests} requests) against a ${BUDGETS.firstDemoPayloadGzipKiB} KiB target`,
  );

  report.clickToReady.push({ slug, runs: timings, medianMs, worstMs });
  report.demoPayloads.push({ slug, ...payload });
}

// =====================================================================
// 4. Lab timings on the homepage and one case study (unthrottled + throttled)
// =====================================================================
for (const scenario of [
  { name: 'home-unthrottled', route: '/', throttled: false },
  { name: 'home-throttled', route: '/', throttled: true },
  { name: 'case-study-throttled', route: '/work/vertex/', throttled: true },
  { name: 'home-mobile-throttled', route: '/', throttled: true, viewport: { width: 390, height: 844 } },
]) {
  const samples = [];
  for (let run = 1; run <= 3; run += 1) {
    const context = await browser.newContext({ viewport: scenario.viewport ?? { width: 1440, height: 900 } });
    const page = await context.newPage();
    if (scenario.throttled) {
      const session = await context.newCDPSession(page);
      await session.send('Network.emulateNetworkConditions', THROTTLE);
      await session.send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN });
    }
    await page.goto(`${server.origin}${scenario.route}`, { waitUntil: 'load' });
    await page.waitForTimeout(2500); // let LCP and any late shifts settle

    const metrics = await page.evaluate(() => new Promise((resolve) => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paints = Object.fromEntries(performance.getEntriesByType('paint').map((entry) => [entry.name, entry.startTime]));
      let lcp = 0;
      let cls = 0;
      try {
        new PerformanceObserver((list) => { for (const entry of list.getEntries()) lcp = entry.startTime; })
          .observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) cls += entry.value;
        }).observe({ type: 'layout-shift', buffered: true });
      } catch { /* observer unsupported */ }
      setTimeout(() => resolve({
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd),
        loadEvent: Math.round(navigation.loadEventEnd),
        responseEnd: Math.round(navigation.responseEnd),
        firstPaint: Math.round(paints['first-paint'] ?? 0),
        firstContentfulPaint: Math.round(paints['first-contentful-paint'] ?? 0),
        largestContentfulPaint: Math.round(lcp),
        cumulativeLayoutShift: Math.round(cls * 1000) / 1000,
      }), 300);
    }));
    samples.push(metrics);
    await context.close();
  }

  const summarize = (field) => median(samples.map((sample) => sample[field]));
  const summary = {
    scenario: scenario.name,
    route: scenario.route,
    throttled: scenario.throttled,
    viewport: scenario.viewport ?? { width: 1440, height: 900 },
    runs: samples,
    median: {
      firstContentfulPaint: summarize('firstContentfulPaint'),
      largestContentfulPaint: summarize('largestContentfulPaint'),
      domContentLoaded: summarize('domContentLoaded'),
      loadEvent: summarize('loadEvent'),
      cumulativeLayoutShift: Math.max(...samples.map((sample) => sample.cumulativeLayoutShift)),
    },
  };
  report.labTimings.push(summary);

  results.record(
    `lab/${scenario.name}`,
    true,
    `median FCP ${summary.median.firstContentfulPaint} ms, LCP ${summary.median.largestContentfulPaint} ms, DCL ${summary.median.domContentLoaded} ms, load ${summary.median.loadEvent} ms, worst CLS ${summary.median.cumulativeLayoutShift}`,
  );
  // The checklist's good thresholds are field targets; record the lab proxy against them.
  results.record(
    `lab-proxy/${scenario.name}-lcp`,
    summary.median.largestContentfulPaint <= 2500,
    `lab LCP ${summary.median.largestContentfulPaint} ms against the 2,500 ms good field threshold (lab proxy, not field data)`,
  );
  results.record(
    `lab-proxy/${scenario.name}-cls`,
    summary.median.cumulativeLayoutShift <= 0.1,
    `worst observed CLS ${summary.median.cumulativeLayoutShift} against the 0.1 good field threshold (lab proxy, not field data)`,
  );
}

// =====================================================================
// 5. Gzip verification of the shell assets straight from disk
// =====================================================================
{
  const shellAssets = await readdir(path.join(staticRoot, '_assets'));
  const detail = [];
  for (const name of shellAssets) {
    const contents = await readFile(path.join(staticRoot, '_assets', name));
    detail.push({ name, rawKiB: kib(contents.length), gzipKiB: kib(gzipSync(contents).length) });
  }
  const html = await readFile(path.join(staticRoot, 'index.html'));
  detail.push({ name: 'index.html', rawKiB: kib(html.length), gzipKiB: kib(gzipSync(html).length) });
  report.shellAssets = detail;
  results.record(
    'artifact/shell-assets',
    true,
    detail.map((entry) => `${entry.name} ${entry.rawKiB} KiB raw / ${entry.gzipKiB} KiB gzip`).join('; '),
  );
}

await browser.close();
await server.close();

report.summary = results.summary();
const reportPath = await saveJson('performance.json', report);
console.log(`\nperformance: ${report.summary.passed}/${report.summary.total} passed → ${reportPath}`);
if (report.summary.failed > 0) process.exitCode = 1;
