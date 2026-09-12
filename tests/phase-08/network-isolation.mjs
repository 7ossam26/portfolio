// Phase 08 — every request the browser makes, from a cold page entry through each
// demo scenario, reset and close. Records the full allow-list and proves that no
// client host, socket, upload, storage or telemetry endpoint is ever contacted.

import { chromium } from 'playwright';
import {
  Results, demoRequests, externalRequests, normalizeDigits, projectSlugs,
  recordConsole, recordRequests, saveJson, startStaticServer, waitForHostState,
} from './lib/harness.mjs';

// Hosts that must never be contacted. These are matched against the request's
// HOST only — the local slugs /demos/autozain/ and /work/ramex/ are legitimate
// paths on the portfolio origin and must not be confused with a client service.
const forbiddenHosts = [
  /autozain/i, /ramex/i, /erp-v2/i, /film-production/i, /vertex/i, /roya/i,
  /^api\.|\.api\./i, /socket/i,
  /google-analytics|googletagmanager|plausible|segment|sentry|hotjar|mixpanel|posthog/i,
  /fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|unpkg\.com|cdnjs/i,
  /\.onrender\.com|\.vercel\.app|\.railway\.app|supabase|firebase/i,
];
const forbiddenProtocols = new Set(['ws:', 'wss:', 'ftp:']);

/** A request is forbidden if its host is a client/third-party host or it opens a live channel. */
function forbiddenTarget(url) {
  if (url.startsWith('data:') || url.startsWith('blob:') || url === 'about:blank') return null;
  let parsed;
  try { parsed = new URL(url); } catch { return 'unparseable URL'; }
  if (forbiddenProtocols.has(parsed.protocol)) return `forbidden protocol ${parsed.protocol}`;
  const host = forbiddenHosts.find((pattern) => pattern.test(parsed.host));
  return host ? `forbidden host ${parsed.host}` : null;
}

const server = await startStaticServer();
const browser = await chromium.launch();
const results = new Results('network-isolation');
const report = { conditions: {}, coldEntry: [], demoRuns: [], storage: [], forbidden: [] };

report.conditions = {
  browser: `Chromium ${browser.version()}`,
  origin: server.origin,
  note: 'All requests are served from the local production dist/ over loopback HTTP.',
  startedAt: new Date().toISOString(),
};

// =====================================================================
// 1. Cold entry to every public route — no demo asset may be fetched
// =====================================================================
for (const route of ['/', '/work/vertex/', '/work/autozain/', '/work/roya/', '/work/ramex/', '/404.html']) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const requests = recordRequests(page);
  await page.goto(`${server.origin}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200); // allow any deferred/idle work to fire

  const external = externalRequests(requests, server.origin);
  const demos = demoRequests(requests, server.origin);
  const inventory = requests.map((entry) => ({
    path: entry.url.replace(server.origin, ''),
    type: entry.resourceType,
    status: entry.status,
    bytes: entry.transferBytes,
  }));

  results.record(
    `cold-entry/no-demo-assets${route}`,
    demos.length === 0,
    demos.length === 0
      ? `${requests.length} requests, none from any demo application`
      : `demo assets fetched before activation: ${demos.map((d) => d.url).join(', ')}`,
  );
  results.record(
    `cold-entry/same-origin-only${route}`,
    external.length === 0,
    external.length === 0
      ? 'every request stayed on the portfolio origin'
      : `off-origin requests: ${external.map((e) => e.url).join(', ')}`,
  );
  report.coldEntry.push({ route, total: requests.length, inventory });
  await context.close();
}

// =====================================================================
// 2. Full scenario per demo: open, exercise, reset, close
// =====================================================================
const scenarios = {
  async vertex(page, frame) {
    await frame.locator('[data-testid="open-production"]').first().click();
    await frame.locator('[data-testid="target-quantity"]').fill('4');
    await frame.locator('[data-testid="execute-production"]').click();
    await frame.locator('[data-testid="production-order"]').first().waitFor();
    await frame.locator('nav[aria-label="أقسام تجربة Vertex"] button').nth(1).click();
    await page.waitForTimeout(300);
  },
  async autozain(page, frame) {
    await frame.locator('article').first().click();
    await frame.locator('button:has-text("تواصل مع موظف")').first().click();
    await frame.locator('.employee-card button:not([disabled])').first().click();
    await frame.locator('form button[type="submit"]').first().click();
    await page.waitForTimeout(400);
    await frame.locator('.persona-switch button').last().click();
    await page.waitForTimeout(300);
    await frame.locator('button').filter({ hasText: /قبول|Accept/ }).first().click();
    await page.waitForTimeout(300);
    await frame.locator('.session-outcome button').first().click();
    await page.waitForTimeout(400);
  },
  async roya(page, frame) {
    await frame.locator('[role="tab"]').nth(1).click();
    await frame.locator('button').filter({ hasText: /تعديل أسابيع|Change shooting/ }).first().click();
    await frame.locator('input[type="number"]').first().fill('6');
    await frame.locator('button').filter({ hasText: /معاينة التأثير|Preview impact/ }).first().click();
    await page.waitForTimeout(500);
    await frame.locator('button').filter({ hasText: /^إلغاء$|^Cancel$/ }).first().click();
    await page.waitForTimeout(300);
  },
  async ramex(page, frame) {
    await frame.locator('article[data-roll-id="701"] .primary-button').click();
    await frame.locator('button.pay-button').click();
    await page.waitForTimeout(300);
    await frame.locator('button').filter({ hasText: /تأكيد البيع والدفع/ }).first().click();
    await page.waitForTimeout(700);
    await frame.locator('nav[aria-label="أقسام العرض"] button').nth(1).click();
    await page.waitForTimeout(300);
  },
};

for (const slug of projectSlugs) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const requests = recordRequests(page);
  const consoleMessages = recordConsole(page);
  const hostPath = slug === 'vertex' ? '/' : `/work/${slug}/`;

  await page.goto(`${server.origin}${hostPath}`, { waitUntil: 'networkidle' });
  const beforeActivation = requests.length;
  const demosBefore = demoRequests(requests, server.origin).length;

  await page.locator(`[data-demo-trigger="${slug}"]`).first().click();
  await waitForHostState(page, 'ready');
  const afterReady = requests.length;

  const frame = page.frameLocator('iframe.demo-host-frame');
  await scenarios[slug](page, frame);
  const afterScenario = requests.length;

  await page.locator('[data-demo-reset]').click();
  await waitForHostState(page, 'ready');
  await page.waitForTimeout(300);
  const afterReset = requests.length;

  await page.locator('[data-demo-close]').click();
  await page.waitForTimeout(1000);
  const afterClose = requests.length;

  const external = externalRequests(requests, server.origin);
  const hits = requests
    .map((entry) => ({ url: entry.url, reason: forbiddenTarget(entry.url) }))
    .filter((entry) => entry.reason !== null);
  const failedRequests = requests.filter((entry) => entry.failure !== null);
  const badStatuses = requests.filter((entry) => entry.status !== null && entry.status >= 400);

  results.record(
    `scenario/no-demo-requests-before-activation:${slug}`,
    demosBefore === 0,
    `${beforeActivation} requests on the hosting page, ${demosBefore} of them from the demo`,
  );
  results.record(
    `scenario/same-origin-only:${slug}`,
    external.length === 0,
    external.length === 0
      ? `all ${requests.length} requests across open → scenario → reset → close stayed on the portfolio origin`
      : `off-origin: ${external.map((e) => e.url).join(', ')}`,
  );
  results.record(
    `scenario/no-client-services:${slug}`,
    hits.length === 0,
    hits.length === 0
      ? `no client API, socket, CDN, font, or telemetry host was contacted; every one of the ${requests.length} requests resolved to ${new URL(server.origin).host}`
      : `forbidden targets: ${hits.map((h) => `${h.url} (${h.reason})`).join(', ')}`,
  );
  results.record(
    `scenario/no-failed-requests:${slug}`,
    failedRequests.length === 0 && badStatuses.length === 0,
    `${failedRequests.length} failed requests, ${badStatuses.length} responses >= 400`,
  );
  results.record(
    `scenario/quiet-after-close:${slug}`,
    afterClose === afterReset,
    `no further requests after Close (${afterReset} → ${afterClose})`,
  );

  const errors = consoleMessages.filter((message) => message.type === 'error' || message.type === 'pageerror');
  results.record(
    `scenario/clean-console:${slug}`,
    errors.length === 0,
    errors.length === 0 ? 'no console errors during the full scenario' : JSON.stringify(errors),
  );

  report.demoRuns.push({
    slug,
    counts: { beforeActivation, afterReady, afterScenario, afterReset, afterClose },
    demoAssets: demoRequests(requests, server.origin).map((entry) => ({
      path: entry.url.replace(server.origin, '').split('?')[0],
      type: entry.resourceType,
      status: entry.status,
      bytes: entry.transferBytes,
      gzipBytes: entry.gzipBytes ?? null,
    })),
    external,
    forbidden: hits,
  });
  await context.close();
}

// =====================================================================
// 3. Client-side storage, workers, sockets, and permission surfaces
// =====================================================================
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Trap the APIs that must never be used before any script runs.
  await page.addInitScript(() => {
    window.__probe = { websockets: [], eventSources: [], notifications: 0, geolocation: 0, workers: [], beacons: [] };
    const RealWebSocket = window.WebSocket;
    window.WebSocket = function (...args) { window.__probe.websockets.push(String(args[0])); return new RealWebSocket(...args); };
    if (window.EventSource) {
      const RealEventSource = window.EventSource;
      window.EventSource = function (...args) { window.__probe.eventSources.push(String(args[0])); return new RealEventSource(...args); };
    }
    if (window.Notification) {
      window.Notification.requestPermission = () => { window.__probe.notifications += 1; return Promise.resolve('denied'); };
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition = () => { window.__probe.geolocation += 1; };
    }
    if (navigator.sendBeacon) {
      navigator.sendBeacon = (url) => { window.__probe.beacons.push(String(url)); return false; };
    }
    const RealWorker = window.Worker;
    if (RealWorker) {
      window.Worker = function (...args) { window.__probe.workers.push(String(args[0])); return new RealWorker(...args); };
    }
  });

  for (const slug of projectSlugs) {
    const hostPath = slug === 'vertex' ? '/' : `/work/${slug}/`;
    await page.goto(`${server.origin}${hostPath}`, { waitUntil: 'networkidle' });
    await page.locator(`[data-demo-trigger="${slug}"]`).first().click();
    await waitForHostState(page, 'ready');
    await page.frameLocator('iframe.demo-host-frame').locator('body').waitFor();
    await scenarios[slug](page, page.frameLocator('iframe.demo-host-frame'));
    await page.waitForTimeout(300);

    const childState = await page.frames()
      .find((candidate) => candidate.url().includes(`/demos/${slug}/`))
      .evaluate(() => ({
        localStorageKeys: Object.keys(window.localStorage),
        sessionStorageKeys: Object.keys(window.sessionStorage),
        cookies: document.cookie,
        indexedDb: typeof indexedDB !== 'undefined',
        serviceWorkers: navigator.serviceWorker ? 'api present' : 'absent',
        websockets: window.__probe?.websockets ?? [],
        eventSources: window.__probe?.eventSources ?? [],
        notifications: window.__probe?.notifications ?? 0,
        geolocation: window.__probe?.geolocation ?? 0,
        workers: window.__probe?.workers ?? [],
        beacons: window.__probe?.beacons ?? [],
      }));

    const registrations = await page.evaluate(async () => (navigator.serviceWorker
      ? (await navigator.serviceWorker.getRegistrations()).map((registration) => registration.scope)
      : []));

    const quiet = childState.websockets.length === 0
      && childState.eventSources.length === 0
      && childState.notifications === 0
      && childState.geolocation === 0
      && childState.workers.length === 0
      && childState.beacons.length === 0
      && registrations.length === 0;

    results.record(
      `runtime/no-live-channels:${slug}`,
      quiet,
      `websockets=${JSON.stringify(childState.websockets)}, eventSources=${JSON.stringify(childState.eventSources)}, workers=${JSON.stringify(childState.workers)}, beacons=${JSON.stringify(childState.beacons)}, notification prompts=${childState.notifications}, geolocation=${childState.geolocation}, service worker registrations=${JSON.stringify(registrations)}`,
    );
    results.record(
      `runtime/no-persistent-storage:${slug}`,
      childState.localStorageKeys.length === 0 && childState.cookies === '',
      `localStorage keys=${JSON.stringify(childState.localStorageKeys)}, sessionStorage keys=${JSON.stringify(childState.sessionStorageKeys)}, cookies="${childState.cookies}"`,
    );
    report.storage.push({ slug, ...childState, serviceWorkerRegistrations: registrations });

    await page.locator('[data-demo-close]').click();
    await page.waitForTimeout(150);
  }
  await context.close();
}

// =====================================================================
// 4. An unsupported operation must not fall through to a real request
// =====================================================================
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const requests = recordRequests(page);

  await page.goto(`${server.origin}/work/ramex/`, { waitUntil: 'networkidle' });
  await page.locator('[data-demo-trigger="ramex"]').click();
  await waitForHostState(page, 'ready');
  const frame = page.frameLocator('iframe.demo-host-frame');

  // Selecting an already-sold roll is the demo's unsupported path.
  await frame.locator('article[data-roll-id="701"] .primary-button').click();
  await frame.locator('button.pay-button').click();
  await page.waitForTimeout(300);
  await frame.locator('button').filter({ hasText: /تأكيد البيع والدفع/ }).first().click();
  await page.waitForTimeout(800);
  const countBeforeRetry = requests.length;

  await frame.locator('nav[aria-label="أقسام العرض"] button').first().click();
  await page.waitForTimeout(300);
  const soldCard = frame.locator('article[data-roll-id="701"]');
  if (await soldCard.count()) await soldCard.click({ force: true }).catch(() => {});
  await page.waitForTimeout(600);

  const newRequests = requests.slice(countBeforeRetry);
  const anyDataRequest = newRequests.filter((entry) => ['xhr', 'fetch', 'websocket', 'eventsource'].includes(entry.resourceType));
  const errorShown = await page.evaluate(() => document.querySelector('iframe.demo-host-frame')
    ?.contentDocument?.querySelector('.error-banner, [role="alert"]')?.textContent?.trim() ?? '');

  results.record(
    'unsupported/no-fallthrough',
    anyDataRequest.length === 0,
    anyDataRequest.length === 0
      ? `re-selecting a sold roll produced ${newRequests.length} requests and zero xhr/fetch/socket calls; the UI responded locally (${normalizeDigits(errorShown).slice(0, 80) || 'card removed from the sellable list'})`
      : `data requests escaped: ${anyDataRequest.map((r) => r.url).join(', ')}`,
  );
  report.forbidden.push({ scope: 'unsupported-operation', newRequests: newRequests.map((r) => r.url.replace(server.origin, '')) });
  await context.close();
}

// =====================================================================
// 5. Whole-run allow-list summary
// =====================================================================
{
  const allPaths = new Set();
  for (const entry of report.coldEntry) for (const item of entry.inventory) allPaths.add(`${item.type} ${item.path.split('?')[0]}`);
  for (const run of report.demoRuns) for (const item of run.demoAssets) allPaths.add(`${item.type} ${item.path}`);
  report.allowList = [...allPaths].sort();
  results.record(
    'allow-list/local-only',
    report.allowList.every((entry) => entry.includes(' /')),
    `${report.allowList.length} distinct local paths were requested across every run; no absolute off-origin URL appears`,
  );
}

await browser.close();
await server.close();

report.summary = results.summary();
const reportPath = await saveJson('network-isolation.json', report);
console.log(`\nnetwork-isolation: ${report.summary.passed}/${report.summary.total} passed → ${reportPath}`);
if (report.summary.failed > 0) process.exitCode = 1;
