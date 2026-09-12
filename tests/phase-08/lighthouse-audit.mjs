// Phase 08 — Lighthouse audit of the production artifact. One score is not
// sufficient evidence on its own; this supplements the measured payloads,
// click-to-ready timings, and lab metrics in performance.mjs.

import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Results, saveJson, startStaticServer } from './lib/harness.mjs';

// Lighthouse is not a repository dependency: its puppeteer chain carries known
// advisories that would sit in the lockfile for a check that runs once a release.
// Install it on demand instead — `npm i --no-save lighthouse@13.2.0`.
let lighthouse;
try {
  ({ default: lighthouse } = await import('lighthouse'));
} catch {
  console.error('Lighthouse is not installed. Run: npm i --no-save lighthouse@13.2.0');
  process.exit(2);
}

const chromePath = process.env.LIGHTHOUSE_CHROME_PATH
  ?? path.join(process.env.LOCALAPPDATA ?? '', 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const debugPort = 9222;

const server = await startStaticServer();
const profileDirectory = await mkdtemp(path.join(tmpdir(), 'lh-profile-'));
const chrome = spawn(chromePath, [
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profileDirectory}`,
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-extensions',
  '--disable-background-networking',
], { stdio: 'ignore' });

// Wait for the DevTools endpoint instead of sleeping a fixed amount.
const waitForDevTools = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (response.ok) return true;
    } catch { /* not listening yet */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return false;
};

const results = new Results('lighthouse');
const report = { conditions: {}, audits: [] };

if (!(await waitForDevTools())) {
  results.record('lighthouse/chrome-launch', false, `Chrome did not expose a DevTools endpoint at ${chromePath}`);
} else {
  report.conditions = {
    chrome: chromePath,
    lighthouse: '13.2.0',
    preset: 'default mobile emulation with simulated throttling',
    artifact: 'production dist/ served over loopback HTTP',
    measuredAt: new Date().toISOString(),
  };

  const routes = [
    { name: 'home', path: '/', performanceTarget: 95 },
    { name: 'work-vertex', path: '/work/vertex/', performanceTarget: 90 },
    { name: 'work-autozain', path: '/work/autozain/', performanceTarget: 90 },
    { name: 'work-roya', path: '/work/roya/', performanceTarget: 90 },
    { name: 'work-ramex', path: '/work/ramex/', performanceTarget: 90 },
  ];

  for (const route of routes) {
    const run = await lighthouse(`${server.origin}${route.path}`, {
      port: debugPort,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });

    const categories = Object.fromEntries(
      Object.entries(run.lhr.categories).map(([key, value]) => [key, Math.round((value.score ?? 0) * 100)]),
    );
    const metrics = {
      firstContentfulPaint: run.lhr.audits['first-contentful-paint']?.displayValue,
      largestContentfulPaint: run.lhr.audits['largest-contentful-paint']?.displayValue,
      totalBlockingTime: run.lhr.audits['total-blocking-time']?.displayValue,
      cumulativeLayoutShift: run.lhr.audits['cumulative-layout-shift']?.displayValue,
      speedIndex: run.lhr.audits['speed-index']?.displayValue,
    };
    const failedAudits = Object.values(run.lhr.audits)
      .filter((audit) => audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'informative')
      .map((audit) => ({ id: audit.id, title: audit.title, score: audit.score }));

    report.audits.push({ route: route.name, path: route.path, categories, metrics, failedAudits });

    results.record(
      `lighthouse/performance:${route.name}`,
      categories.performance >= route.performanceTarget,
      `performance ${categories.performance} against a ${route.performanceTarget} target (FCP ${metrics.firstContentfulPaint}, LCP ${metrics.largestContentfulPaint}, TBT ${metrics.totalBlockingTime}, CLS ${metrics.cumulativeLayoutShift})`,
    );
    results.record(
      `lighthouse/accessibility:${route.name}`,
      categories.accessibility >= 95,
      `accessibility ${categories.accessibility}`,
    );
    results.record(
      `lighthouse/best-practices:${route.name}`,
      categories['best-practices'] >= 90,
      `best-practices ${categories['best-practices']}`,
    );
    // SEO is expected to be held down by the deliberate noindex while the public
    // domain is unresolved; record the score without treating it as a failure.
    results.record(
      `lighthouse/seo-recorded:${route.name}`,
      true,
      `seo ${categories.seo} (a noindex robots tag is intentional until a public domain is supplied)`,
    );
  }
}

chrome.kill();
await server.close();
await rm(profileDirectory, { recursive: true, force: true, maxRetries: 5 }).catch(() => {});

report.summary = results.summary();
const reportPath = await saveJson('lighthouse.json', report);
console.log(`\nlighthouse: ${report.summary.passed}/${report.summary.total} passed → ${reportPath}`);
if (report.summary.failed > 0) process.exitCode = 1;
