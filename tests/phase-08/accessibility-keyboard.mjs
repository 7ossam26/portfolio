// Phase 08 — accessibility, keyboard, reduced motion, direction, and no-JS checks.
// The axe scan is a supplement; the keyboard and semantic checks below are the
// substantive evidence, per the acceptance checklist.

import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import {
  Results, projectSlugs, saveJson, shot, startStaticServer, waitForHostState,
} from './lib/harness.mjs';

const routes = [
  { name: 'home', path: '/' },
  { name: 'work-vertex', path: '/work/vertex/' },
  { name: 'work-autozain', path: '/work/autozain/' },
  { name: 'work-roya', path: '/work/roya/' },
  { name: 'work-ramex', path: '/work/ramex/' },
  { name: 'not-found', path: '/no-such-page/' },
];

const server = await startStaticServer();
const browser = await chromium.launch();
const results = new Results('accessibility-keyboard');
const report = { axe: [], keyboard: [], reducedMotion: [], direction: [], noJs: [], standalone: [] };

// ---- axe-core scans: portfolio routes, standalone demos, and embedded demos ----
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const route of routes) {
    await page.goto(`${server.origin}${route.path}`, { waitUntil: 'networkidle' });
    const scan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const violations = scan.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
    }));
    report.axe.push({ scope: `route:${route.name}`, violations });
    results.record(
      `axe/${route.name}`,
      violations.length === 0,
      violations.length === 0 ? 'no WCAG 2.1 A/AA violations' : JSON.stringify(violations),
    );
  }

  for (const slug of projectSlugs) {
    await page.goto(`${server.origin}/demos/${slug}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const scan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const violations = scan.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
    }));
    report.axe.push({ scope: `standalone:${slug}`, violations });
    results.record(
      `axe/standalone-${slug}`,
      violations.length === 0,
      violations.length === 0 ? 'no WCAG 2.1 A/AA violations' : JSON.stringify(violations),
    );
  }

  // Embedded scan covers the host dialog and the framed application together.
  for (const slug of projectSlugs) {
    await page.goto(`${server.origin}${slug === 'vertex' ? '/' : `/work/${slug}/`}`, { waitUntil: 'networkidle' });
    await page.locator(`[data-demo-trigger="${slug}"]`).first().click();
    await waitForHostState(page, 'ready');
    await page.waitForTimeout(400);
    const scan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const violations = scan.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
    }));
    report.axe.push({ scope: `embedded:${slug}`, violations });
    results.record(
      `axe/embedded-${slug}`,
      violations.length === 0,
      violations.length === 0 ? 'no WCAG 2.1 A/AA violations across host + frame' : JSON.stringify(violations),
    );
  }

  await context.close();
}

// ---- Keyboard order, focus visibility, skip link, native link behaviour ----
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${server.origin}/`, { waitUntil: 'networkidle' });

  await page.keyboard.press('Tab');
  const firstStop = await page.evaluate(() => ({
    text: document.activeElement?.textContent?.trim(),
    className: document.activeElement?.className,
  }));
  results.record(
    'keyboard/skip-link-first',
    firstStop.className?.includes('skip-link'),
    `first Tab stop: "${firstStop.text}" (${firstStop.className})`,
    [await shot(page, 'keyboard/skip-link-focused.png')],
  );

  // Walk the document order and confirm it advances down the page, not around it.
  const order = [];
  const seen = new Set();
  for (let index = 0; index < 40; index += 1) {
    const stop = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element || element === document.body) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        text: (element.textContent ?? '').trim().slice(0, 36),
        href: element.getAttribute('href'),
        top: Math.round(rect.top + window.scrollY),
        left: Math.round(rect.left),
        outlineWidth: style.outlineWidth,
        outlineStyle: style.outlineStyle,
        outlineColor: style.outlineColor,
      };
    });
    if (!stop) { await page.keyboard.press('Tab'); continue; }
    const key = `${stop.tag}|${stop.text}|${stop.top}|${stop.left}`;
    if (seen.has(key)) break; // focus wrapped past the last stop; stop walking
    seen.add(key);
    order.push(stop);
    await page.keyboard.press('Tab');
  }
  report.keyboard.push({ scope: 'home', order });

  // Ignore the skip link: it is deliberately positioned above everything.
  // A backwards step into a different column is normal reading order for a
  // two-column band, so only flag reversals inside the same column.
  const flow = order.filter((stop) => !/Skip to portfolio/i.test(stop.text));
  const regressions = flow.filter((stop, index) => {
    if (index === 0) return false;
    const previous = flow[index - 1];
    const sameColumn = Math.abs(stop.left - previous.left) < 120;
    return sameColumn && stop.top < previous.top - 8;
  });
  results.record(
    'keyboard/visual-order',
    regressions.length === 0,
    regressions.length === 0
      ? `${flow.length} tab stops advance down the page within each column (${flow.map((s) => `"${s.text}"`).join(' → ')})`
      : `tab order jumps backwards within a column at: ${regressions.map((s) => `"${s.text}"`).join(', ')}`,
  );

  const withoutFocusRing = flow.filter((stop) => stop.outlineStyle === 'none' || Number.parseFloat(stop.outlineWidth) === 0);
  results.record(
    'keyboard/focus-visible',
    withoutFocusRing.length === 0,
    withoutFocusRing.length === 0
      ? `all ${flow.length} tab stops render a focus outline`
      : `no visible outline on: ${withoutFocusRing.map((s) => `"${s.text}"`).join(', ')}`,
  );

  // Case-study navigation and the repository link must stay real anchors.
  const anchors = await page.evaluate(() => ({
    caseStudyLinks: Array.from(document.querySelectorAll('a[href^="/work/"]')).map((a) => a.getAttribute('href')),
    repositoryLinks: Array.from(document.querySelectorAll('a[href^="https://github.com"]')).map((a) => ({
      href: a.getAttribute('href'), target: a.getAttribute('target'), rel: a.getAttribute('rel'),
    })),
    cvLinks: Array.from(document.querySelectorAll('a[href$=".pdf"]')).map((a) => ({
      href: a.getAttribute('href'), download: a.hasAttribute('download'),
    })),
    mailto: Array.from(document.querySelectorAll('a[href^="mailto:"]')).map((a) => a.getAttribute('href')),
    nestedInteractive: Array.from(document.querySelectorAll('a a, a button, button a, button button')).length,
  }));
  results.record(
    'links/native-anchors',
    anchors.caseStudyLinks.length >= 4 && anchors.nestedInteractive === 0,
    `case-study anchors: ${anchors.caseStudyLinks.join(', ')}; nested interactive controls: ${anchors.nestedInteractive}`,
  );
  results.record(
    'links/new-tab-rel',
    anchors.repositoryLinks.every((link) => link.target !== '_blank' || (link.rel ?? '').includes('noopener')),
    JSON.stringify(anchors.repositoryLinks),
  );
  results.record(
    'links/cv-and-email',
    anchors.cvLinks.every((link) => link.href === '/Ahmed_Hossam_CV.pdf') && anchors.mailto.includes('mailto:hossam.working1@gmail.com'),
    `CV: ${JSON.stringify(anchors.cvLinks)}; email: ${anchors.mailto.join(', ')}`,
  );

  await context.close();
}

// ---- Dialog semantics: naming, frame title, background inertness, Close reachable ----
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const slug of projectSlugs) {
    await page.goto(`${server.origin}${slug === 'vertex' ? '/' : `/work/${slug}/`}`, { waitUntil: 'networkidle' });
    await page.locator(`[data-demo-trigger="${slug}"]`).first().click();
    await waitForHostState(page, 'ready');

    const semantics = await page.evaluate(() => {
      const dialog = document.querySelector('[data-demo-host]');
      const labelId = dialog.getAttribute('aria-labelledby');
      const label = labelId ? document.getElementById(labelId)?.textContent?.trim() : null;
      const frame = dialog.querySelector('iframe.demo-host-frame');
      const feedback = dialog.querySelector('[data-demo-feedback]');
      return {
        isModal: dialog.matches(':modal'),
        open: dialog.open,
        accessibleName: label,
        frameTitle: frame?.getAttribute('title') ?? null,
        liveRegion: feedback?.getAttribute('aria-live') ?? null,
        hostDirection: getComputedStyle(dialog).direction,
        guidanceText: dialog.querySelector('[data-demo-guidance]')?.textContent?.trim() ?? '',
      };
    });

    results.record(
      `dialog/named-${slug}`,
      Boolean(semantics.accessibleName) && semantics.isModal,
      `:modal=${semantics.isModal}, accessible name="${semantics.accessibleName}"`,
    );
    results.record(
      `dialog/frame-title-${slug}`,
      Boolean(semantics.frameTitle) && semantics.frameTitle.length > 12,
      `iframe title="${semantics.frameTitle}"`,
    );

    // Background inertness: many Tabs must never escape the modal.
    let escaped = false;
    const visited = [];
    for (let index = 0; index < 40; index += 1) {
      await page.keyboard.press('Tab');
      const where = await page.evaluate(() => {
        const active = document.activeElement;
        return {
          insideDialog: Boolean(active?.closest('[data-demo-host]')),
          tag: active?.tagName.toLowerCase(),
          text: (active?.textContent ?? '').trim().slice(0, 24),
        };
      });
      visited.push(where.tag);
      if (!where.insideDialog) { escaped = true; break; }
    }
    results.record(
      `dialog/background-inert-${slug}`,
      !escaped,
      escaped
        ? 'focus left the dialog into background content'
        : `focus stayed within the dialog or its frame across 40 Tab presses (${[...new Set(visited)].join(', ')})`,
    );

    const closeReachable = await page.evaluate(() => {
      const close = document.querySelector('[data-demo-close]');
      close.focus();
      return document.activeElement === close;
    });
    results.record(`dialog/close-reachable-${slug}`, closeReachable, `Close button focusable: ${closeReachable}`);

    report.direction.push({ slug, host: semantics.hostDirection, guidance: semantics.guidanceText.slice(0, 60) });

    // Arabic child stays RTL while English host guidance stays LTR.
    const childDirection = await page.frameLocator('iframe.demo-host-frame').locator('html').evaluate((html) => ({
      dir: html.getAttribute('dir'),
      lang: html.getAttribute('lang'),
      computed: getComputedStyle(html).direction,
      controlBar: getComputedStyle(document.querySelector('.demo-control-bar') ?? html).direction,
    }));
    results.record(
      `direction/${slug}`,
      childDirection.computed === 'rtl' && semantics.hostDirection === 'ltr',
      `child <html dir=${childDirection.dir} lang=${childDirection.lang} computed=${childDirection.computed}; host dialog direction=${semantics.hostDirection}; child demo control bar=${childDirection.controlBar}`,
    );

    await page.locator('[data-demo-close]').click();
    await page.waitForTimeout(120);
  }

  await context.close();
}

// ---- Roya language toggle: Arabic RTL and English LTR inside the same demo ----
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${server.origin}/demos/roya/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.roya-mark');
  const arabic = await page.evaluate(() => ({ dir: document.documentElement.dir, lang: document.documentElement.lang }));
  const arabicShot = await shot(page, 'direction/roya-standalone-ar.png');
  await page.locator('.language-toggle').click();
  await page.waitForTimeout(250);
  const english = await page.evaluate(() => ({ dir: document.documentElement.dir, lang: document.documentElement.lang }));
  const englishShot = await shot(page, 'direction/roya-standalone-en.png');
  results.record(
    'direction/roya-toggle',
    arabic.dir === 'rtl' && arabic.lang === 'ar' && english.dir === 'ltr' && english.lang === 'en',
    `Arabic ${JSON.stringify(arabic)} → English ${JSON.stringify(english)}`,
    [arabicShot, englishShot],
  );
  report.direction.push({ slug: 'roya-toggle', arabic, english });
  await context.close();
}

// ---- Reduced motion ----
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`${server.origin}/`, { waitUntil: 'networkidle' });

  const motion = await page.evaluate(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const button = document.querySelector('.button');
    const spinner = document.querySelector('.demo-host-spinner');
    return {
      scrollBehavior: rootStyle.scrollBehavior,
      buttonTransitionDuration: getComputedStyle(button).transitionDuration,
      spinnerAnimation: spinner ? getComputedStyle(spinner).animationName : 'absent',
      matches: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  });
  results.record(
    'reduced-motion/preference-detected',
    motion.matches,
    `prefers-reduced-motion matched: ${motion.matches}`,
  );
  results.record(
    'reduced-motion/no-smooth-scroll',
    motion.scrollBehavior === 'auto',
    `documentElement scroll-behavior: ${motion.scrollBehavior}`,
  );
  results.record(
    'reduced-motion/transitions-off',
    /^(0s|0s, 0s)/.test(motion.buttonTransitionDuration) || motion.buttonTransitionDuration === '0s',
    `button transition-duration: ${motion.buttonTransitionDuration}`,
  );
  results.record(
    'reduced-motion/animations-off',
    motion.spinnerAnimation === 'none' || motion.spinnerAnimation === 'absent',
    `host spinner animation-name: ${motion.spinnerAnimation}`,
  );

  // "Explore my work" must jump rather than smooth-scroll under the preference.
  const beforeScroll = await page.evaluate(() => window.scrollY);
  await page.locator('a[href="#selected-work"]').first().click();
  await page.waitForTimeout(60);
  const immediatelyAfter = await page.evaluate(() => window.scrollY);
  await page.waitForTimeout(600);
  const settled = await page.evaluate(() => window.scrollY);
  results.record(
    'reduced-motion/jump-scroll',
    immediatelyAfter > beforeScroll && Math.abs(settled - immediatelyAfter) < 8,
    `scrollY ${beforeScroll} → ${immediatelyAfter} after 60ms → ${settled} after 600ms (no animated interpolation)`,
  );
  report.reducedMotion.push({ ...motion, beforeScroll, immediatelyAfter, settled });

  // The same anchor animates when motion is allowed, proving the media query is doing the work.
  const motionContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(`${server.origin}/`, { waitUntil: 'networkidle' });
  const allowedBehavior = await motionPage.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  results.record(
    'reduced-motion/contrast-case',
    allowedBehavior === 'smooth',
    `with no-preference the root scroll-behavior is "${allowedBehavior}", so the reduce rule is what removes it`,
  );
  await motionContext.close();
  await context.close();
}

// ---- No-JavaScript: portfolio still usable, demos explain the requirement ----
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await context.newPage();

  for (const route of routes.slice(0, 5)) {
    await page.goto(`${server.origin}${route.path}`, { waitUntil: 'domcontentloaded' });
    const usable = await page.evaluate(() => ({
      heading: document.querySelector('h1')?.textContent?.trim() ?? null,
      cv: document.querySelector('a[href="/Ahmed_Hossam_CV.pdf"]') !== null,
      email: document.querySelector('a[href^="mailto:"]') !== null,
      workLinks: document.querySelectorAll('a[href^="/work/"]').length,
      noscriptCount: document.querySelectorAll('noscript').length,
    }));
    report.noJs.push({ route: route.name, ...usable });
    results.record(
      `no-js/${route.name}`,
      Boolean(usable.heading) && usable.cv && usable.email,
      `heading="${usable.heading}", CV link=${usable.cv}, email link=${usable.email}, work links=${usable.workLinks}`,
    );
  }

  const homeShot = await shot(page, 'no-js/home-no-js.png', { fullPage: true });
  results.record('no-js/home-capture', true, 'captured the homepage with scripting disabled', [homeShot]);

  for (const slug of projectSlugs) {
    await page.goto(`${server.origin}/demos/${slug}/`, { waitUntil: 'domcontentloaded' });
    const fallback = await page.evaluate(() => {
      const noscript = document.querySelector('noscript');
      const text = noscript?.textContent?.trim() ?? '';
      return { present: Boolean(noscript), text: text.slice(0, 160), rendered: (document.body.innerText ?? '').trim().slice(0, 160) };
    });
    results.record(
      `no-js/demo-${slug}`,
      fallback.present && /javascript/i.test(fallback.text),
      fallback.present ? `fallback shown: "${fallback.rendered.replace(/\s+/g, ' ')}"` : 'no noscript fallback in the demo document',
    );
    report.noJs.push({ demo: slug, ...fallback });
  }

  const noJsDemoShot = await shot(page, 'no-js/demo-ramex-no-js.png');
  results.record('no-js/demo-capture', true, 'captured a demo route with scripting disabled', [noJsDemoShot]);
  await context.close();
}

// ---- Standalone demo routes: sample context and return controls ----
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  for (const slug of projectSlugs) {
    await page.goto(`${server.origin}/demos/${slug}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const controls = await page.evaluate(() => {
      const text = document.body.innerText ?? '';
      const back = Array.from(document.querySelectorAll('a')).find((a) => /work\//.test(a.getAttribute('href') ?? ''));
      const reset = Array.from(document.querySelectorAll('button')).find((b) => /reset|إعادة/i.test(b.textContent ?? ''));
      return {
        sampleLabel: /sample data|بيانات تجريبية|simulated|عرض محلي|local only|خيالي/i.test(text),
        backHref: back?.getAttribute('href') ?? null,
        resetLabel: reset?.textContent?.trim() ?? null,
      };
    });
    const artifact = await shot(page, `standalone/${slug}.png`);
    report.standalone.push({ slug, ...controls, artifact });
    results.record(
      `standalone/${slug}`,
      controls.sampleLabel && Boolean(controls.backHref) && Boolean(controls.resetLabel),
      `sample label=${controls.sampleLabel}, back="${controls.backHref}", reset="${controls.resetLabel}"`,
      [artifact],
    );
  }
  await context.close();
}

await browser.close();
await server.close();

report.summary = results.summary();
const reportPath = await saveJson('accessibility-keyboard.json', report);
console.log(`\naccessibility-keyboard: ${report.summary.passed}/${report.summary.total} passed → ${reportPath}`);
if (report.summary.failed > 0) process.exitCode = 1;
