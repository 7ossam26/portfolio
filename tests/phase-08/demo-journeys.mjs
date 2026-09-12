// Phase 08 — normal and failure journeys through the demo host and all four demos.
// Covers three lifecycle cycles per demo, domain mutations and reset, timeout and
// retry, child error, direct hash entry, stale/forged frame messages, Back/Forward,
// inner-modal Escape, focus return, and scroll restoration.

import { chromium } from 'playwright';
import {
  Results, normalizeDigits, projectSlugs, recordConsole, recordRequests, saveJson, shot,
  startStaticServer, waitForHostState,
} from './lib/harness.mjs';

const server = await startStaticServer();
const browser = await chromium.launch();
const results = new Results('demo-journeys');
const report = { lifecycle: [], scenarios: [], failure: [], history: [], focus: [] };

const hostPath = (slug) => (slug === 'vertex' ? '/' : `/work/${slug}/`);

const newPage = async (viewport = { width: 1440, height: 900 }) => {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  return { context, page };
};

// =====================================================================
// 1. Three open/close/reopen/reset cycles per demo
// =====================================================================
for (const slug of projectSlugs) {
  const { context, page } = await newPage();
  const consoleMessages = recordConsole(page);
  const cycles = [];

  for (let cycle = 1; cycle <= 3; cycle += 1) {
    await page.goto(`${server.origin}${hostPath(slug)}`, { waitUntil: 'networkidle' });
    const started = Date.now();
    await page.locator(`[data-demo-trigger="${slug}"]`).first().click();
    await waitForHostState(page, 'ready');
    const readyMs = Date.now() - started;

    // Reset must rebuild the frame from the same seed.
    const frameBefore = await page.locator('iframe.demo-host-frame').getAttribute('src');
    await page.locator('[data-demo-reset]').click();
    await waitForHostState(page, 'ready');
    const frameAfter = await page.locator('iframe.demo-host-frame').getAttribute('src');

    await page.locator('[data-demo-close]').click();
    await page.waitForTimeout(120);
    const afterClose = await page.evaluate(() => ({
      dialogOpen: document.querySelector('[data-demo-host]')?.open ?? false,
      frames: document.querySelectorAll('iframe.demo-host-frame').length,
      hash: window.location.hash,
      htmlLocked: document.documentElement.classList.contains('demo-host-open'),
    }));

    cycles.push({ cycle, readyMs, sessionChanged: frameBefore !== frameAfter, ...afterClose });
  }

  const allClean = cycles.every((entry) => !entry.dialogOpen && entry.frames === 0 && entry.hash === '' && !entry.htmlLocked);
  const allReset = cycles.every((entry) => entry.sessionChanged);
  results.record(
    `lifecycle/${slug}`,
    allClean && allReset,
    `3 cycles: ${cycles.map((c) => `#${c.cycle} ready ${c.readyMs}ms, new session ${c.sessionChanged}, frames after close ${c.frames}, hash "${c.hash}", scroll lock ${c.htmlLocked}`).join(' | ')}`,
  );
  const errors = consoleMessages.filter((message) => message.type === 'error' || message.type === 'pageerror');
  results.record(
    `lifecycle-console/${slug}`,
    errors.length === 0,
    errors.length === 0 ? 'no console errors across three cycles' : JSON.stringify(errors),
  );
  report.lifecycle.push({ slug, cycles, errors });
  await context.close();
}

// =====================================================================
// 2. Per-demo domain journeys: mutate, inspect, reset
// =====================================================================

// --- Vertex: produce 4 units, reconcile stock and cost, reject an excessive run ---
{
  const { context, page } = await newPage();
  await page.goto(`${server.origin}/`, { waitUntil: 'networkidle' });
  await page.locator('[data-demo-trigger="vertex"]').click();
  await waitForHostState(page, 'ready');
  const frame = page.frameLocator('iframe.demo-host-frame');

  await frame.locator('[data-testid="open-production"]').first().click();
  await frame.locator('[data-testid="target-quantity"]').fill('4');
  await frame.locator('[data-testid="execute-production"]').click();
  await frame.locator('[data-testid="production-order"]').first().waitFor();

  const totalCost = (await frame.locator('[data-testid="order-total-cost"]').first().innerText()).trim();

  // The newest order opens expanded. Collapse and reopen it from the keyboard to
  // show the disclosure is operable without a mouse, then read the unit cost.
  const disclosure = frame.locator('[data-testid="production-order"] [role="button"]').first();
  await disclosure.focus();
  await disclosure.press('Enter');
  await page.waitForTimeout(200);
  const collapsedByKeyboard = await frame.locator('[data-testid="order-details"]').count() === 0;
  await disclosure.press('Enter');
  await frame.locator('[data-testid="order-details"]').first().waitFor();
  results.record(
    'scenario/vertex-keyboard-disclosure',
    collapsedByKeyboard,
    `Enter on the production-order disclosure collapsed it (${collapsedByKeyboard}) and Enter again reopened it`,
  );

  const unitCost = (await frame.locator('[data-testid="order-unit-cost"]').first().innerText()).trim();
  const producedShot = await shot(page, 'journeys/vertex-production-result.png');

  await frame.locator('nav[aria-label="أقسام تجربة Vertex"] button').nth(1).click();
  const inventory = normalizeDigits(await frame.locator('[data-testid="inventory-table"]').innerText());

  const reconciles = /120/.test(totalCost) && /30/.test(unitCost)
    && /92/.test(inventory) && /48/.test(inventory) && /\b4\b/.test(inventory);
  results.record(
    'scenario/vertex-production',
    reconciles,
    `total cost "${totalCost}", unit cost "${unitCost}"; stock row text contains 92 / 48 / 4 → ${reconciles}`,
    [producedShot],
  );

  // Reset restores the seed, then an excessive run must be refused.
  await page.locator('[data-demo-reset]').click();
  await waitForHostState(page, 'ready');
  const resetFrame = page.frameLocator('iframe.demo-host-frame');
  await resetFrame.locator('nav[aria-label="أقسام تجربة Vertex"] button').nth(1).click();
  const inventoryAfterReset = normalizeDigits(await resetFrame.locator('[data-testid="inventory-table"]').innerText());
  results.record(
    'scenario/vertex-reset',
    /100/.test(inventoryAfterReset) && /50/.test(inventoryAfterReset),
    `stock after reset contains the 100 / 50 seed: ${/100/.test(inventoryAfterReset) && /50/.test(inventoryAfterReset)}`,
  );

  await resetFrame.locator('nav[aria-label="أقسام تجربة Vertex"] button').first().click();
  await resetFrame.locator('[data-testid="open-production"]').first().click();
  await resetFrame.locator('[data-testid="target-quantity"]').fill('900');
  await page.waitForTimeout(300);
  const executeButton = resetFrame.locator('[data-testid="execute-production"]');
  const executeDisabled = await executeButton.isDisabled();
  const reviewText = normalizeDigits(await resetFrame.locator('[data-testid="material-review"]').innerText());
  const excessiveShot = await shot(page, 'journeys/vertex-insufficient-stock.png');

  // Even if the control were reachable, submitting must not change stock.
  await executeButton.click({ force: true }).catch(() => {});
  await page.waitForTimeout(400);
  await resetFrame.locator('button[aria-label="إغلاق نافذة تنفيذ الإنتاج"]').click().catch(() => {});
  await resetFrame.locator('nav[aria-label="أقسام تجربة Vertex"] button').nth(1).click();
  const stockAfterRefusal = normalizeDigits(await resetFrame.locator('[data-testid="inventory-table"]').innerText());
  const stockPreserved = /100/.test(stockAfterRefusal) && /50/.test(stockAfterRefusal);

  results.record(
    'scenario/vertex-insufficient-stock',
    executeDisabled && stockPreserved,
    `requesting 900 units marks the materials short (${/غير متاح|نقص/.test(reviewText) ? 'shortage shown' : reviewText.slice(0, 80)}), the execute control is disabled (${executeDisabled}), and stock is still the 100 / 50 seed (${stockPreserved})`,
    [excessiveShot],
  );
  report.scenarios.push({ slug: 'vertex', totalCost, unitCost, inventory: inventory.slice(0, 160), inventoryAfterReset: inventoryAfterReset.slice(0, 160) });
  await context.close();
}

// --- AutoZain: buyer request → staff accept → outcome → reject path → reset ---
{
  const { context, page } = await newPage();
  await page.goto(`${server.origin}/work/autozain/`, { waitUntil: 'networkidle' });
  await page.locator('[data-demo-trigger="autozain"]').click();
  await waitForHostState(page, 'ready');
  const frame = page.frameLocator('iframe.demo-host-frame');

  await frame.locator('.car-card, article').first().click();
  await frame.locator('button:has-text("تواصل مع موظف")').first().click();
  await frame.locator('.employee-card button:not([disabled])').first().click();
  await frame.locator('form button[type="submit"], .modal button:has-text("إرسال")').first().click();
  await page.waitForTimeout(400);

  const buyerStatus = await page.evaluate(() => document.querySelector('iframe.demo-host-frame')
    ?.contentDocument?.querySelector('.demo-root')?.getAttribute('data-request-status'));
  results.record(
    'scenario/autozain-request-created',
    buyerStatus === 'pending',
    `buyer view request status after submit: "${buyerStatus}"`,
    [await shot(page, 'journeys/autozain-buyer-pending.png')],
  );

  await frame.locator('button:has-text("Staff"), .persona-switch button').last().click();
  await page.waitForTimeout(300);
  await frame.locator('button:has-text("قبول"), button:has-text("Accept")').first().click();
  await page.waitForTimeout(300);
  const acceptedStatus = await page.evaluate(() => document.querySelector('iframe.demo-host-frame')
    ?.contentDocument?.querySelector('.demo-root')?.getAttribute('data-request-status'));

  await frame.locator('.session-outcome button, button:has-text("مهتم")').first().click();
  await page.waitForTimeout(400);
  const completedStatus = await page.evaluate(() => document.querySelector('iframe.demo-host-frame')
    ?.contentDocument?.querySelector('.demo-root')?.getAttribute('data-request-status'));
  const staffShot = await shot(page, 'journeys/autozain-staff-outcome.png');

  results.record(
    'scenario/autozain-accept-complete',
    acceptedStatus === 'accepted' && completedStatus === 'completed',
    `pending → "${acceptedStatus}" → "${completedStatus}"`,
    [staffShot],
  );

  // Buyer view must agree with the staff view.
  await frame.locator('.persona-switch button').first().click();
  await page.waitForTimeout(300);
  const buyerAfter = await page.evaluate(() => document.querySelector('iframe.demo-host-frame')
    ?.contentDocument?.querySelector('.demo-root')?.getAttribute('data-request-status'));
  results.record(
    'scenario/autozain-continuity',
    buyerAfter === 'completed',
    `buyer view reports the same completed state: "${buyerAfter}"`,
  );

  await page.locator('[data-demo-reset]').click();
  await waitForHostState(page, 'ready');
  await page.waitForTimeout(300);
  const afterReset = await page.evaluate(() => document.querySelector('iframe.demo-host-frame')
    ?.contentDocument?.querySelector('.demo-root')?.getAttribute('data-request-status'));
  results.record(
    'scenario/autozain-reset',
    afterReset === 'none',
    `request status after reset: "${afterReset}"`,
  );
  report.scenarios.push({ slug: 'autozain', buyerStatus, acceptedStatus, completedStatus, buyerAfter, afterReset });
  await context.close();
}

// --- Roya: preview 4→6 weeks, confirm the fixed line is untouched, cancel without mutating ---
{
  const { context, page } = await newPage();
  await page.goto(`${server.origin}/work/roya/`, { waitUntil: 'networkidle' });
  await page.locator('[data-demo-trigger="roya"]').click();
  await waitForHostState(page, 'ready');
  const frame = page.frameLocator('iframe.demo-host-frame');

  const savedWeeksBefore = await page.evaluate(() => document.querySelector('iframe.demo-host-frame')
    ?.contentDocument?.querySelector('.demo-root')?.getAttribute('data-saved-weeks'));
  const budgetBefore = normalizeDigits(await frame.locator('.budget-table').innerText());
  const capBefore = normalizeDigits(await frame.locator('.project-kpis').innerText());

  await frame.locator('[role="tab"]').nth(1).click();
  await frame.locator('button').filter({ hasText: /تعديل أسابيع|Change shooting/ }).first().click();
  await frame.locator('input[type="number"]').first().fill('6');
  await frame.locator('button').filter({ hasText: /معاينة التأثير|Preview impact/ }).first().click();
  await page.waitForTimeout(500);

  const impact = normalizeDigits(await frame.locator('[class*="modal"]').first().innerText());
  const impactShot = await shot(page, 'journeys/roya-impact-preview.png');
  const weeklyMoved = /20,000/.test(impact) && /30,000/.test(impact);
  const totalMoved = /40,000/.test(impact) && /50,000/.test(impact);
  const fixedHeld = /بدون تغيير|No change/.test(impact);
  results.record(
    'scenario/roya-impact',
    weeklyMoved && totalMoved && fixedHeld,
    `preview shows the weekly line 20,000 → 30,000, the total 40,000 → 50,000, and the fixed line unchanged: ${weeklyMoved && totalMoved && fixedHeld}`,
    [impactShot],
  );
  results.record(
    'scenario/roya-cap-warning',
    /يتجاوز حد ميزانية|exceeds the project budget/i.test(impact) && /48,000/.test(capBefore),
    `the preview warns that the new total exceeds the cap, and the project cap reads 48,000 (${/48,000/.test(capBefore)})`,
  );

  await frame.locator('button').filter({ hasText: /^إلغاء$|^Cancel$/ }).first().click();
  await page.waitForTimeout(300);
  await frame.locator('[role="tab"]').first().click();
  const budgetAfter = normalizeDigits(await frame.locator('.budget-table').innerText());
  const savedWeeksAfter = await page.evaluate(() => document.querySelector('iframe.demo-host-frame')
    ?.contentDocument?.querySelector('.demo-root')?.getAttribute('data-saved-weeks'));

  results.record(
    'scenario/roya-no-mutation',
    budgetBefore === budgetAfter && savedWeeksBefore === savedWeeksAfter && savedWeeksAfter === '4',
    `saved weeks ${savedWeeksBefore} → ${savedWeeksAfter}; budget table identical after cancel: ${budgetBefore === budgetAfter}`,
  );
  report.scenarios.push({ slug: 'roya', savedWeeksBefore, savedWeeksAfter, impact: impact.slice(0, 200) });
  await context.close();
}

// --- Ramex: whole-roll sale, invoice snapshot, second roll untouched, invalid price ---
{
  const { context, page } = await newPage();
  await page.goto(`${server.origin}/work/ramex/`, { waitUntil: 'networkidle' });
  await page.locator('[data-demo-trigger="ramex"]').click();
  await waitForHostState(page, 'ready');
  const frame = page.frameLocator('iframe.demo-host-frame');

  await frame.locator('article[data-roll-id="701"] .primary-button').click();
  const payButton = frame.locator('button.pay-button');

  // A price outside the source's two-decimal precision must block payment and
  // explain why, rather than leaving a silently dead control.
  await frame.locator('.field-label input').first().fill('185.123');
  await page.waitForTimeout(300);
  const payBlocked = await payButton.isDisabled();
  const priceMessage = (await frame.locator('#price-format-error').innerText().catch(() => '')).trim();
  const lineTotal = (await frame.locator('.line-total').innerText().catch(() => '')).trim();
  results.record(
    'scenario/ramex-invalid-precision',
    payBlocked && priceMessage.length > 0,
    `payment disabled=${payBlocked} with the visible reason "${priceMessage.replace(/\s+/g, ' ')}" (line total "${lineTotal.replace(/\s+/g, ' ')}")`,
    [await shot(page, 'journeys/ramex-invalid-price.png')],
  );

  await frame.locator('.field-label input').first().fill('185.00');
  await page.waitForTimeout(300);
  results.record(
    'scenario/ramex-valid-price-enables',
    !(await payButton.isDisabled()) && (await frame.locator('#price-format-error').count()) === 0,
    'restoring a two-decimal price clears the message and re-enables payment',
  );
  await payButton.click();
  await page.waitForTimeout(300);
  await frame.locator('button').filter({ hasText: /تأكيد البيع والدفع/ }).first().click();
  await page.waitForTimeout(800);

  const invoiceText = normalizeDigits(await frame.locator('[class*="invoice"]').first().innerText());
  const invoiceShot = await shot(page, 'journeys/ramex-invoice.png');
  results.record(
    'scenario/ramex-invoice-snapshot',
    /30\.000/.test(invoiceText) && /5,550|5550/.test(invoiceText),
    `invoice preserves 30.000 and totals EGP 5,550: ${/30\.000/.test(invoiceText) && /5,550|5550/.test(invoiceText)} — "${invoiceText.slice(0, 120)}"`,
    [invoiceShot],
  );

  await frame.locator('nav[aria-label="أقسام العرض"] button').nth(1).click();
  await page.waitForTimeout(300);
  const stockText = normalizeDigits(await frame.locator('.stock-table-card').innerText());
  const stockShot = await shot(page, 'journeys/ramex-stock-result.png');
  results.record(
    'scenario/ramex-independent-rolls',
    /24\.750/.test(stockText),
    `the untouched RMX-M-0702 roll still reads 24.750: ${/24\.750/.test(stockText)}`,
    [stockShot],
  );

  await page.locator('[data-demo-reset]').click();
  await waitForHostState(page, 'ready');
  await page.waitForTimeout(400);
  const afterReset = await page.evaluate(() => document.querySelector('iframe.demo-host-frame')
    ?.contentDocument?.querySelector('.demo-root')?.getAttribute('data-sale-state'));
  results.record(
    'scenario/ramex-reset',
    afterReset === 'seed',
    `sale state after reset: "${afterReset}"`,
  );
  report.scenarios.push({ slug: 'ramex', invoice: invoiceText.slice(0, 200), stock: stockText.slice(0, 200), afterReset });
  await context.close();
}

// =====================================================================
// 3. Failure journeys: timeout + retry, child error, stale/forged messages
// =====================================================================
{
  const { context, page } = await newPage();
  const requests = recordRequests(page);
  await page.goto(`${server.origin}/work/roya/`, { waitUntil: 'networkidle' });

  // Block the demo bundle so readiness never arrives. The wait below exercises the
  // real 12-second production threshold rather than a shortened test-only value.
  await page.route('**/demos/roya/assets/*.js', (route) => route.abort());

  await page.locator('[data-demo-trigger="roya"]').click();
  const loadingImmediately = await page.evaluate(() => document.querySelector('[data-demo-host]')?.dataset.state);
  const timeoutStarted = Date.now();
  await waitForHostState(page, 'error', 20_000);
  const timeoutElapsedMs = Date.now() - timeoutStarted;
  const errorState = await page.evaluate(() => {
    const dialog = document.querySelector('[data-demo-host]');
    return {
      title: dialog.querySelector('[data-demo-state-title]')?.textContent?.trim(),
      copy: dialog.querySelector('[data-demo-state-copy]')?.textContent?.trim(),
      retryVisible: !dialog.querySelector('[data-demo-retry]')?.hidden,
      closeVisible: Boolean(dialog.querySelector('[data-demo-close]')),
      frames: dialog.querySelectorAll('iframe').length,
      spinnerStillShown: dialog.dataset.state === 'loading',
    };
  });
  const timeoutShot = await shot(page, 'failure/timeout-error.png');
  results.record(
    'failure/loading-immediate',
    loadingImmediately === 'loading',
    `the host enters "${loadingImmediately}" on click, before any readiness message`,
  );
  results.record(
    'failure/timeout-recovery',
    errorState.retryVisible && errorState.closeVisible && !errorState.spinnerStillShown,
    `after ${timeoutElapsedMs}ms the host showed "${errorState.title}" / "${errorState.copy}" with Retry visible=${errorState.retryVisible}, torn-down frames=${errorState.frames}`,
    [timeoutShot],
  );
  results.record(
    'failure/timeout-threshold',
    timeoutElapsedMs >= 11_000 && timeoutElapsedMs <= 15_000,
    `the documented 12-second readiness threshold fired at ${timeoutElapsedMs}ms`,
  );

  // Retry with the asset available again must reach ready.
  await page.unroute('**/demos/roya/assets/*.js');
  await page.locator('[data-demo-retry]').click();
  await waitForHostState(page, 'ready', 15000);
  const recoveredShot = await shot(page, 'failure/retry-recovered.png');
  results.record('failure/retry-succeeds', true, 'Retry started a fresh session that reached ready', [recoveredShot]);

  // The portfolio behind the dialog must still be intact and closable.
  await page.locator('[data-demo-close]').click();
  await page.waitForTimeout(150);
  const stillUsable = await page.evaluate(() => ({
    heading: document.querySelector('h1')?.textContent?.trim(),
    dialogOpen: document.querySelector('[data-demo-host]')?.open ?? false,
  }));
  results.record(
    'failure/portfolio-survives',
    Boolean(stillUsable.heading) && !stillUsable.dialogOpen,
    `after the failure the page still renders "${stillUsable.heading}" and the dialog is closed`,
  );
  report.failure.push({ loadingImmediately, errorState, demoRequests: requests.filter((r) => r.url.includes('/demos/')).length });
  await context.close();
}

// --- Child error message surfaces a safe message ---
{
  const { context, page } = await newPage();
  await page.goto(`${server.origin}/work/ramex/`, { waitUntil: 'networkidle' });
  await page.locator('[data-demo-trigger="ramex"]').click();
  await waitForHostState(page, 'ready');

  const sessionId = await page.evaluate(() => new URL(document.querySelector('iframe.demo-host-frame').src).searchParams.get('sessionId'));

  // The message must originate inside the frame so that event.source matches the
  // host's expected window; posting from the parent is a different case entirely.
  const childFrame = page.frames().find((candidate) => candidate.url().includes('/demos/ramex/'));
  await childFrame.evaluate((session) => {
    window.parent.postMessage({
      channel: 'ah-portfolio-demo', version: 1, demoId: 'ramex', sessionId: session,
      type: 'ERROR', payload: { message: 'The local sample data could not be prepared.' },
    }, window.location.origin);
  }, sessionId);
  await waitForHostState(page, 'error', 5000);
  const childError = await page.evaluate(() => document.querySelector('[data-demo-state-copy]')?.textContent?.trim());
  results.record(
    'failure/child-error',
    /could not be prepared/i.test(childError ?? ''),
    `host surfaced the child's safe message: "${childError}"`,
    [await shot(page, 'failure/child-error.png')],
  );
  await context.close();
}

// --- Stale and forged frame messages cannot change the current demo ---
{
  const { context, page } = await newPage();
  await page.goto(`${server.origin}/work/ramex/`, { waitUntil: 'networkidle' });
  await page.locator('[data-demo-trigger="ramex"]').click();
  await waitForHostState(page, 'ready');

  const sessionId = await page.evaluate(() => new URL(document.querySelector('iframe.demo-host-frame').src).searchParams.get('sessionId'));
  const guidanceBefore = await page.locator('[data-demo-guidance]').textContent();
  const child = page.frames().find((candidate) => candidate.url().includes('/demos/ramex/'));
  const base = { channel: 'ah-portfolio-demo', version: 1, demoId: 'ramex', sessionId };

  // Every envelope below is sent from inside the real frame, so event.source is
  // correct and only the envelope contents are on trial.
  const cases = [
    ['stale-session', { ...base, sessionId: 'stale-session-from-a-previous-frame', type: 'ERROR', payload: { message: 'stale' } }],
    ['wrong-demo-id', { ...base, demoId: 'vertex', type: 'ERROR', payload: { message: 'wrong demo' } }],
    ['wrong-channel', { ...base, channel: 'some-other-channel', type: 'ERROR', payload: { message: 'wrong channel' } }],
    ['wrong-version', { ...base, version: 99, type: 'ERROR', payload: { message: 'wrong version' } }],
    ['unknown-type', { ...base, type: 'DROP_DATABASE', payload: { message: 'nope' } }],
    ['not-an-envelope', { hello: 'world' }],
    ['oversized-guidance', { ...base, type: 'STEP_CHANGED', payload: { guidance: 'x'.repeat(400) } }],
  ];

  const probes = [];
  for (const [name, message] of cases) {
    await child.evaluate((data) => { window.parent.postMessage(data, window.location.origin); }, message);
    await page.waitForTimeout(140);
    probes.push(await page.evaluate((previous) => {
      const dialog = document.querySelector('[data-demo-host]');
      return {
        state: dialog.dataset.state,
        guidanceChanged: dialog.querySelector('[data-demo-guidance]').textContent !== previous,
        frames: dialog.querySelectorAll('iframe').length,
      };
    }, guidanceBefore).then((observed) => ({ name, ...observed })));
  }

  // A valid envelope posted by the top window instead of the frame must also be ignored.
  await page.evaluate((message) => { window.postMessage(message, window.location.origin); }, { ...base, type: 'ERROR', payload: { message: 'from the top window' } });
  await page.waitForTimeout(140);
  probes.push(await page.evaluate((previous) => {
    const dialog = document.querySelector('[data-demo-host]');
    return {
      state: dialog.dataset.state,
      guidanceChanged: dialog.querySelector('[data-demo-guidance]').textContent !== previous,
      frames: dialog.querySelectorAll('iframe').length,
    };
  }, guidanceBefore).then((observed) => ({ name: 'foreign-window', ...observed })));

  const ignoredAll = probes.every((probe) => probe.state === 'ready' && !probe.guidanceChanged && probe.frames === 1);
  results.record(
    'failure/stale-and-forged-messages',
    ignoredAll,
    `all ${probes.length} invalid envelopes were ignored: ${probes.map((p) => `${p.name}=${p.state}${p.guidanceChanged ? '/guidance changed' : ''}`).join(', ')}`,
  );
  report.failure.push({ probes });
  await context.close();
}

// =====================================================================
// 4. History, direct entry, unknown slugs
// =====================================================================
{
  const { context, page } = await newPage();
  await page.goto(`${server.origin}/work/roya/`, { waitUntil: 'networkidle' });

  const historyBefore = await page.evaluate(() => history.length);
  await page.locator('[data-demo-trigger="roya"]').click();
  await waitForHostState(page, 'ready');
  const historyAfterOpen = await page.evaluate(() => ({ length: history.length, hash: location.hash }));

  await page.goBack();
  await page.waitForTimeout(250);
  const afterBack = await page.evaluate(() => ({
    open: document.querySelector('[data-demo-host]')?.open ?? false,
    hash: location.hash,
    frames: document.querySelectorAll('iframe.demo-host-frame').length,
  }));

  await page.goForward();
  await waitForHostState(page, 'ready', 15000);
  const afterForward = await page.evaluate(() => ({
    open: document.querySelector('[data-demo-host]')?.open ?? false,
    hash: location.hash,
  }));

  results.record(
    'history/one-entry-per-open',
    historyAfterOpen.length === historyBefore + 1 && historyAfterOpen.hash === '#demo=roya',
    `history ${historyBefore} → ${historyAfterOpen.length}, hash "${historyAfterOpen.hash}"`,
  );
  results.record(
    'history/back-closes',
    !afterBack.open && afterBack.hash === '' && afterBack.frames === 0,
    `Back closed the demo and removed the hash: open=${afterBack.open}, hash="${afterBack.hash}", frames=${afterBack.frames}`,
  );
  results.record(
    'history/forward-reopens',
    afterForward.open && afterForward.hash === '#demo=roya',
    `Forward reopened it: open=${afterForward.open}, hash="${afterForward.hash}"`,
  );

  // Repeated clicks on the same trigger must not stack history entries or frames.
  await page.locator('[data-demo-close]').click();
  await page.waitForTimeout(150);
  const beforeDouble = await page.evaluate(() => history.length);
  await page.locator('[data-demo-trigger="roya"]').click();
  await waitForHostState(page, 'ready');
  await page.locator('[data-demo-trigger="roya"]').click({ force: true }).catch(() => {});
  await page.waitForTimeout(300);
  const afterDouble = await page.evaluate(() => ({
    length: history.length,
    frames: document.querySelectorAll('iframe.demo-host-frame').length,
  }));
  results.record(
    'history/no-duplicate-frames',
    afterDouble.frames === 1,
    `after a repeated activation there is still exactly ${afterDouble.frames} frame (history ${beforeDouble} → ${afterDouble.length})`,
  );
  report.history.push({ historyBefore, historyAfterOpen, afterBack, afterForward, afterDouble });
  await context.close();
}

// --- Direct hash entry, and closing direct entry must not leave the site ---
{
  const { context, page } = await newPage();
  await page.goto(`${server.origin}/work/ramex/#demo=ramex`, { waitUntil: 'networkidle' });
  await waitForHostState(page, 'ready', 20000);
  const directOpen = await page.evaluate(() => document.querySelector('[data-demo-host]')?.open ?? false);
  const directShot = await shot(page, 'history/direct-entry.png');

  await page.locator('[data-demo-close]').click();
  await page.waitForTimeout(200);
  const afterDirectClose = await page.evaluate(() => ({
    open: document.querySelector('[data-demo-host]')?.open ?? false,
    hash: location.hash,
    pathname: location.pathname,
    heading: document.querySelector('h1')?.textContent?.trim(),
  }));
  results.record(
    'history/direct-entry',
    directOpen,
    `a direct #demo=ramex URL opened the demo: ${directOpen}`,
    [directShot],
  );
  results.record(
    'history/direct-close-stays',
    !afterDirectClose.open && afterDirectClose.hash === '' && afterDirectClose.pathname === '/work/ramex/',
    `closing direct entry stayed on ${afterDirectClose.pathname} ("${afterDirectClose.heading}") and removed the hash`,
  );

  // Unknown and hostile slugs must be inert.
  for (const slug of ['not-a-demo', 'host-harness', '../../etc/passwd', 'https://example.com']) {
    await page.goto(`${server.origin}/work/ramex/#demo=${encodeURIComponent(slug)}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const state = await page.evaluate(() => ({
      open: document.querySelector('[data-demo-host]')?.open ?? false,
      frames: document.querySelectorAll('iframe').length,
      heading: document.querySelector('h1')?.textContent?.trim(),
    }));
    results.record(
      `history/unknown-slug:${slug}`,
      !state.open && state.frames === 0 && Boolean(state.heading),
      `"${slug}" showed ordinary page content ("${state.heading}") with no frame`,
    );
  }
  await context.close();
}

// =====================================================================
// 5. Inner-modal Escape, focus return, scroll restoration
// =====================================================================
{
  const { context, page } = await newPage();
  await page.goto(`${server.origin}/work/ramex/`, { waitUntil: 'networkidle' });

  // Scroll down so restoration is observable, and open from a scrolled trigger.
  await page.locator('[data-demo-trigger="ramex"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.locator('[data-demo-trigger="ramex"]').click();
  await waitForHostState(page, 'ready');
  const frame = page.frameLocator('iframe.demo-host-frame');

  // Open the inner payment modal, then press Escape: it must close the inner
  // overlay and leave the host open.
  await frame.locator('article[data-roll-id="701"] .primary-button').click();
  await frame.locator('button:has-text("الدفع"), button:has-text("متابعة")').first().click();
  await page.waitForTimeout(300);
  const innerOpen = await page.evaluate(() => Boolean(document.querySelector('iframe.demo-host-frame')
    ?.contentDocument?.querySelector('.payment-modal, [class*="modal"]')));

  await frame.locator('body').press('Escape');
  await page.waitForTimeout(300);
  const afterFirstEscape = await page.evaluate(() => ({
    innerModal: Boolean(document.querySelector('iframe.demo-host-frame')
      ?.contentDocument?.querySelector('.payment-modal, [class*="modal"]')),
    hostOpen: document.querySelector('[data-demo-host]')?.open ?? false,
  }));
  results.record(
    'escape/inner-overlay-first',
    innerOpen && !afterFirstEscape.innerModal && afterFirstEscape.hostOpen,
    `inner overlay open=${innerOpen}; after Escape inner=${afterFirstEscape.innerModal}, host still open=${afterFirstEscape.hostOpen}`,
    [await shot(page, 'focus/after-inner-escape.png')],
  );

  // A second Escape, with no inner overlay, closes the host.
  await frame.locator('body').press('Escape');
  await page.waitForTimeout(400);
  const afterSecondEscape = await page.evaluate(() => ({
    hostOpen: document.querySelector('[data-demo-host]')?.open ?? false,
    scrollY: window.scrollY,
    activeText: document.activeElement?.textContent?.trim().slice(0, 40),
    activeIsTrigger: document.activeElement?.hasAttribute('data-demo-trigger') ?? false,
  }));
  results.record(
    'escape/closes-host',
    !afterSecondEscape.hostOpen,
    `a second Escape closed the host: open=${afterSecondEscape.hostOpen}`,
  );
  results.record(
    'focus/returns-to-trigger',
    afterSecondEscape.activeIsTrigger,
    `focus returned to the opener ("${afterSecondEscape.activeText}"): ${afterSecondEscape.activeIsTrigger}`,
  );
  results.record(
    'focus/scroll-restored',
    Math.abs(afterSecondEscape.scrollY - scrollBefore) <= 4,
    `scrollY ${scrollBefore} before opening → ${afterSecondEscape.scrollY} after closing`,
  );
  report.focus.push({ scrollBefore, ...afterSecondEscape });

  // The same restoration must hold for the visible Close button.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('[data-demo-trigger="ramex"]').scrollIntoViewIfNeeded();
  const scrollBeforeClose = await page.evaluate(() => window.scrollY);
  await page.locator('[data-demo-trigger="ramex"]').click();
  await waitForHostState(page, 'ready');
  await page.locator('[data-demo-close]').click();
  await page.waitForTimeout(400);
  const afterCloseButton = await page.evaluate(() => ({
    scrollY: window.scrollY,
    activeIsTrigger: document.activeElement?.hasAttribute('data-demo-trigger') ?? false,
  }));
  results.record(
    'focus/close-button-restores',
    afterCloseButton.activeIsTrigger && Math.abs(afterCloseButton.scrollY - scrollBeforeClose) <= 4,
    `Close returned focus to the trigger (${afterCloseButton.activeIsTrigger}) and scroll ${scrollBeforeClose} → ${afterCloseButton.scrollY}`,
  );
  report.focus.push({ scrollBeforeClose, ...afterCloseButton });
  await context.close();
}

// --- Only one demo can be active at a time ---
{
  const { context, page } = await newPage();
  await page.goto(`${server.origin}/`, { waitUntil: 'networkidle' });
  await page.locator('[data-demo-trigger="vertex"]').click();
  await waitForHostState(page, 'ready');
  await page.evaluate(() => { window.location.hash = '#demo=ramex'; });
  await page.waitForTimeout(600);
  const single = await page.evaluate(() => ({
    frames: document.querySelectorAll('iframe.demo-host-frame').length,
    src: document.querySelector('iframe.demo-host-frame')?.src ?? '',
    title: document.querySelector('[data-demo-title]')?.textContent?.trim(),
  }));
  results.record(
    'lifecycle/single-active-demo',
    single.frames <= 1,
    `switching demos by hash leaves ${single.frames} frame(s); host title "${single.title}"`,
  );
  await context.close();
}

await browser.close();
await server.close();

report.summary = results.summary();
const reportPath = await saveJson('demo-journeys.json', report);
console.log(`\ndemo-journeys: ${report.summary.passed}/${report.summary.total} passed → ${reportPath}`);
if (report.summary.failed > 0) process.exitCode = 1;
