// Phase 08 — visual and responsive matrix against the production dist/ output.
// Viewports, 200% text enlargement, a 200%-zoom-equivalent layout viewport,
// page-level overflow, touch targets, and measured text contrast.

import { chromium } from 'playwright';
import {
  Results, projectSlugs, recordConsole, saveJson, shot, startStaticServer, waitForHostState,
} from './lib/harness.mjs';

const viewports = [
  { name: '360x780', width: 360, height: 780, class: 'mobile' },
  { name: '390x844', width: 390, height: 844, class: 'mobile' },
  { name: '768x1024', width: 768, height: 1024, class: 'tablet' },
  { name: '1024x768', width: 1024, height: 768, class: 'tablet' },
  { name: '1440x900', width: 1440, height: 900, class: 'desktop' },
];

const routes = [
  { name: 'home', path: '/' },
  { name: 'work-vertex', path: '/work/vertex/' },
  { name: 'work-autozain', path: '/work/autozain/' },
  { name: 'work-roya', path: '/work/roya/' },
  { name: 'work-ramex', path: '/work/ramex/' },
  { name: 'not-found', path: '/no-such-page/' },
];

const relativeLuminance = ([r, g, b]) => {
  const channel = (value) => {
    const scaled = value / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const contrastRatio = (foreground, background) => {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
};

/** Collect layout facts the browser alone can answer. */
const measurePage = () => {
  const parseColor = (value) => {
    const match = /rgba?\(([^)]+)\)/.exec(value);
    if (!match) return null;
    const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()));
    return { rgb: parts.slice(0, 3), alpha: parts.length > 3 ? parts[3] : 1 };
  };

  const effectiveBackground = (element) => {
    let node = element;
    while (node && node !== document.documentElement.parentElement) {
      const parsed = parseColor(getComputedStyle(node).backgroundColor);
      if (parsed && parsed.alpha > 0.95) return parsed.rgb;
      node = node.parentElement;
    }
    return [17, 21, 22];
  };

  const documentOverflow = {
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
  };

  const overflowingElements = [];
  for (const element of document.querySelectorAll('body *')) {
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const style = getComputedStyle(element);
    const scrollable = /(auto|scroll)/.test(style.overflowX);
    if (rect.right > document.documentElement.clientWidth + 1 || rect.left < -1) {
      overflowingElements.push({
        selector: element.tagName.toLowerCase() + (element.className && typeof element.className === 'string' ? `.${element.className.trim().split(/\s+/).slice(0, 2).join('.')}` : ''),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        scrollable,
      });
    }
  }

  // A heading whose content is taller/wider than its own box is visibly clipped.
  const clippedHeadings = [];
  for (const heading of document.querySelectorAll('h1, h2, h3, .eyebrow, .button')) {
    const style = getComputedStyle(heading);
    const hiddenOverflow = style.overflow === 'hidden' || style.overflowY === 'hidden';
    if (!hiddenOverflow) continue;
    if (heading.scrollHeight > heading.clientHeight + 2 || heading.scrollWidth > heading.clientWidth + 2) {
      clippedHeadings.push({
        text: (heading.textContent ?? '').trim().slice(0, 60),
        scrollHeight: heading.scrollHeight,
        clientHeight: heading.clientHeight,
        scrollWidth: heading.scrollWidth,
        clientWidth: heading.clientWidth,
      });
    }
  }

  const interactive = [];
  for (const element of document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')) {
    if (element.closest('[data-demo-host]') && !document.querySelector('[data-demo-host]')?.open) continue;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (element.classList.contains('skip-link')) continue;
    interactive.push({
      tag: element.tagName.toLowerCase(),
      text: (element.textContent ?? '').trim().slice(0, 48),
      width: Math.round(rect.width * 10) / 10,
      height: Math.round(rect.height * 10) / 10,
      classes: typeof element.className === 'string' ? element.className : '',
    });
  }

  const textSamples = [];
  const seen = new Set();
  for (const element of document.querySelectorAll('p, li, h1, h2, h3, h4, span, a, dt, dd, figcaption, .eyebrow, .button, strong, em, small, code, th, td')) {
    const directText = Array.from(element.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent.trim())
      .join(' ')
      .trim();
    if (directText.length < 3) continue;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const style = getComputedStyle(element);
    if (style.visibility === 'hidden' || style.opacity === '0') continue;
    const key = `${style.color}|${style.fontSize}|${style.fontWeight}|${element.tagName}|${element.className}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const parsed = parseColor(style.color);
    if (!parsed) continue;
    textSamples.push({
      text: directText.slice(0, 48),
      tag: element.tagName.toLowerCase(),
      classes: typeof element.className === 'string' ? element.className : '',
      color: parsed.rgb,
      alpha: parsed.alpha,
      background: effectiveBackground(element),
      fontSizePx: Number.parseFloat(style.fontSize),
      fontWeight: style.fontWeight,
    });
  }

  const boundarySamples = [];
  for (const element of document.querySelectorAll('.button, input, select, textarea, [data-demo-trigger]')) {
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const style = getComputedStyle(element);
    const parsed = parseColor(style.borderTopColor);
    if (!parsed || parsed.alpha < 0.05 || Number.parseFloat(style.borderTopWidth) === 0) continue;
    const key = `${style.borderTopColor}|${element.className}`;
    if (boundarySamples.some((sample) => sample.key === key)) continue;
    boundarySamples.push({
      key,
      text: (element.textContent ?? '').trim().slice(0, 40),
      classes: typeof element.className === 'string' ? element.className : '',
      color: parsed.rgb,
      background: effectiveBackground(element.parentElement ?? element),
    });
  }

  return { documentOverflow, overflowingElements, clippedHeadings, interactive, textSamples, boundarySamples };
};

const server = await startStaticServer();
const browser = await chromium.launch();
const results = new Results('visual-responsive');
const report = { conditions: {}, routes: [], enlargement: [], demoLayout: [], contrast: [], touchTargets: [] };

report.conditions = {
  browser: `Chromium ${browser.version()}`,
  playwright: '1.63.0',
  origin: server.origin,
  startedAt: new Date().toISOString(),
};

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  const consoleMessages = recordConsole(page);

  for (const route of routes) {
    await page.goto(`${server.origin}${route.path}`, { waitUntil: 'networkidle' });
    const measured = await page.evaluate(measurePage);
    const artifacts = [];
    if (route.name === 'home' || route.name === 'work-vertex' || route.name === 'not-found') {
      artifacts.push(await shot(page, `visual/${route.name}-${viewport.name}.png`, { fullPage: route.name !== 'not-found' }));
    }

    const horizontalOverflow = measured.documentOverflow.scrollWidth > measured.documentOverflow.clientWidth + 1;
    results.record(
      `overflow/${route.name}@${viewport.name}`,
      !horizontalOverflow,
      `documentElement scrollWidth ${measured.documentOverflow.scrollWidth} vs clientWidth ${measured.documentOverflow.clientWidth}`,
      artifacts,
    );

    const unexpectedOverflow = measured.overflowingElements.filter((element) => !element.scrollable);
    results.record(
      `bleed/${route.name}@${viewport.name}`,
      unexpectedOverflow.length === 0,
      unexpectedOverflow.length === 0
        ? 'no non-scrollable element extends past the viewport'
        : `elements past the viewport: ${unexpectedOverflow.map((e) => `${e.selector}(${e.left}..${e.right})`).join(', ')}`,
    );

    results.record(
      `clipped/${route.name}@${viewport.name}`,
      measured.clippedHeadings.length === 0,
      measured.clippedHeadings.length === 0
        ? 'no heading or control clips its own content'
        : `clipped: ${JSON.stringify(measured.clippedHeadings)}`,
    );

    const smallTargets = measured.interactive.filter((element) => element.height < 44 || element.width < 44);
    report.touchTargets.push({ route: route.name, viewport: viewport.name, smallTargets });

    const lowContrast = measured.textSamples
      .map((sample) => ({ ...sample, ratio: Math.round(contrastRatio(sample.color, sample.background) * 100) / 100 }))
      .filter((sample) => {
        const large = sample.fontSizePx >= 24 || (sample.fontSizePx >= 18.66 && Number(sample.fontWeight) >= 700);
        return sample.ratio < (large ? 3 : 4.5);
      });
    report.contrast.push({ route: route.name, viewport: viewport.name, lowContrast });

    const boundaryIssues = measured.boundarySamples
      .map((sample) => ({ ...sample, ratio: Math.round(contrastRatio(sample.color, sample.background) * 100) / 100 }))
      .filter((sample) => sample.ratio < 3);

    results.record(
      `contrast-text/${route.name}@${viewport.name}`,
      lowContrast.length === 0,
      lowContrast.length === 0
        ? `all ${measured.textSamples.length} distinct text styles meet WCAG AA`
        : `below AA: ${lowContrast.map((s) => `"${s.text}" ${s.ratio}:1 @${s.fontSizePx}px`).join('; ')}`,
    );

    results.record(
      `contrast-boundary/${route.name}@${viewport.name}`,
      boundaryIssues.length === 0,
      boundaryIssues.length === 0
        ? `all ${measured.boundarySamples.length} control boundaries meet 3:1`
        : `below 3:1: ${boundaryIssues.map((s) => `"${s.text}" ${s.ratio}:1`).join('; ')}`,
    );

    report.routes.push({ route: route.name, viewport: viewport.name, ...measured.documentOverflow, artifacts });
  }

  // The /no-such-page/ route is requested on purpose, so its 404 is expected output.
  const unexpectedConsole = consoleMessages.filter((message) => {
    if (message.type !== 'error' && message.type !== 'pageerror') return false;
    return !(message.location?.url ?? '').includes('/no-such-page/');
  });
  results.record(
    `console/${viewport.name}`,
    unexpectedConsole.length === 0,
    unexpectedConsole.length === 0
      ? `no unexpected console errors across ${routes.length} routes (the deliberate 404 probe is excluded)`
      : JSON.stringify(unexpectedConsole),
  );

  await context.close();
}

// ---- 200% text enlargement and a 200%-zoom-equivalent layout viewport ----
const enlargementCases = [
  { name: 'text-200-1440', width: 1440, height: 900, rootFontPercent: 200, path: '/' },
  { name: 'text-200-390', width: 390, height: 844, rootFontPercent: 200, path: '/' },
  { name: 'text-200-work-vertex-1440', width: 1440, height: 900, rootFontPercent: 200, path: '/work/vertex/' },
  { name: 'zoom-200-equivalent-640x360', width: 640, height: 360, rootFontPercent: null, path: '/' },
  { name: 'zoom-200-equivalent-work-ramex-640x360', width: 640, height: 360, rootFontPercent: null, path: '/work/ramex/' },
];

for (const enlargement of enlargementCases) {
  const context = await browser.newContext({ viewport: { width: enlargement.width, height: enlargement.height } });
  const page = await context.newPage();
  await page.goto(`${server.origin}${enlargement.path}`, { waitUntil: 'networkidle' });
  if (enlargement.rootFontPercent) {
    await page.addStyleTag({ content: `html { font-size: ${enlargement.rootFontPercent}% !important; }` });
    await page.waitForTimeout(150);
  }
  const measured = await page.evaluate(measurePage);
  const artifact = await shot(page, `enlargement/${enlargement.name}.png`, { fullPage: true });

  const horizontalOverflow = measured.documentOverflow.scrollWidth > measured.documentOverflow.clientWidth + 1;
  results.record(
    `enlarge-overflow/${enlargement.name}`,
    !horizontalOverflow,
    `scrollWidth ${measured.documentOverflow.scrollWidth} vs clientWidth ${measured.documentOverflow.clientWidth}`,
    [artifact],
  );
  const unexpectedOverflow = measured.overflowingElements.filter((element) => !element.scrollable);
  results.record(
    `enlarge-bleed/${enlargement.name}`,
    unexpectedOverflow.length === 0,
    unexpectedOverflow.length === 0
      ? 'no non-scrollable element extends past the viewport'
      : `past viewport: ${unexpectedOverflow.map((e) => `${e.selector}(${e.left}..${e.right})`).join(', ')}`,
  );
  results.record(
    `enlarge-clipped/${enlargement.name}`,
    measured.clippedHeadings.length === 0,
    measured.clippedHeadings.length === 0 ? 'no clipped headings or controls' : JSON.stringify(measured.clippedHeadings),
  );

  report.enlargement.push({ ...enlargement, ...measured.documentOverflow, artifact, clipped: measured.clippedHeadings });
  await context.close();
}

// ---- Demo dialog layout across viewports: readable app, reachable controls ----
for (const viewport of [
  { name: '390x844', width: 390, height: 844 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1440x900', width: 1440, height: 900 },
]) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();

  // Vertex is the only demo triggered from the homepage; the other three are
  // launched from their own case-study route, which is where their button lives.
  for (const slug of projectSlugs) {
    await page.goto(`${server.origin}${slug === 'vertex' ? '/' : `/work/${slug}/`}`, { waitUntil: 'networkidle' });
    await page.locator(`[data-demo-trigger="${slug}"]`).first().click();
    await waitForHostState(page, 'ready');
    await page.waitForTimeout(400);

    const artifact = await shot(page, `demo-layout/${slug}-${viewport.name}.png`);

    const layout = await page.evaluate(() => {
      const dialog = document.querySelector('[data-demo-host]');
      const frame = dialog.querySelector('iframe.demo-host-frame');
      const close = dialog.querySelector('[data-demo-close]');
      const reset = dialog.querySelector('[data-demo-reset]');
      const frameRect = frame.getBoundingClientRect();
      const closeRect = close.getBoundingClientRect();
      const resetRect = reset.getBoundingClientRect();
      return {
        frame: { width: Math.round(frameRect.width), height: Math.round(frameRect.height) },
        closeVisible: closeRect.top >= 0 && closeRect.bottom <= window.innerHeight + 1 && closeRect.width > 0,
        resetVisible: resetRect.top >= 0 && resetRect.bottom <= window.innerHeight + 1 && resetRect.width > 0,
        closeSize: { width: Math.round(closeRect.width), height: Math.round(closeRect.height) },
        resetSize: { width: Math.round(resetRect.width), height: Math.round(resetRect.height) },
        pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    });

    const childOverflow = await page.frameLocator('iframe.demo-host-frame').locator('body').evaluate((body) => ({
      scrollWidth: body.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      innerScrollRegions: Array.from(document.querySelectorAll('*'))
        .filter((element) => {
          const style = getComputedStyle(element);
          return /(auto|scroll)/.test(style.overflowX) && element.scrollWidth > element.clientWidth + 1;
        }).length,
      smallestBodyFontPx: Math.min(
        ...Array.from(document.querySelectorAll('p, td, span, li, button, label, dd'))
          .filter((element) => (element.textContent ?? '').trim().length > 2 && element.getBoundingClientRect().width > 0)
          .map((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
      ),
    }));

    results.record(
      `demo-controls/${slug}@${viewport.name}`,
      layout.closeVisible && layout.resetVisible,
      `Close ${JSON.stringify(layout.closeSize)} visible=${layout.closeVisible}; Reset ${JSON.stringify(layout.resetSize)} visible=${layout.resetVisible}`,
      [artifact],
    );
    results.record(
      `demo-host-overflow/${slug}@${viewport.name}`,
      !layout.pageOverflow,
      `host page horizontal overflow while the ${slug} dialog is open: ${layout.pageOverflow}`,
    );
    results.record(
      `demo-legibility/${slug}@${viewport.name}`,
      childOverflow.smallestBodyFontPx >= 11,
      `smallest rendered text inside the ${slug} frame: ${childOverflow.smallestBodyFontPx}px (frame ${layout.frame.width}x${layout.frame.height})`,
    );
    results.record(
      `demo-child-reflow/${slug}@${viewport.name}`,
      childOverflow.scrollWidth <= childOverflow.clientWidth + 1 || childOverflow.innerScrollRegions > 0,
      `child body scrollWidth ${childOverflow.scrollWidth} vs ${childOverflow.clientWidth}; internal scroll regions: ${childOverflow.innerScrollRegions}`,
    );

    report.demoLayout.push({ slug, viewport: viewport.name, ...layout, child: childOverflow, artifact });

    await page.locator('[data-demo-close]').click();
    await page.waitForTimeout(150);
  }

  await context.close();
}

await browser.close();
await server.close();

report.summary = results.summary();
const reportPath = await saveJson('visual-responsive.json', report);
console.log(`\nvisual-responsive: ${report.summary.passed}/${report.summary.total} passed → ${reportPath}`);
if (report.summary.failed > 0) process.exitCode = 1;
