// Regenerates the four case-study captures from the demos in the current build,
// so every published screenshot shows exactly what a visitor sees today.
// Each capture is taken from the standalone /demos/{slug}/ route at 1440x900.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { repositoryRoot, startStaticServer } from './lib/harness.mjs';

const publicImages = path.join(repositoryRoot, 'apps', 'portfolio', 'public', 'images');
const viewport = { width: 1440, height: 900 };

const captures = [
  {
    slug: 'vertex',
    file: 'vertex/production-result-1440x900.png',
    async run(page) {
      await page.locator('[data-testid="open-production"]').first().click();
      await page.locator('[data-testid="target-quantity"]').fill('4');
      await page.locator('[data-testid="execute-production"]').click();
      await page.locator('[data-testid="order-details"]').first().waitFor();
      await page.waitForTimeout(400);
    },
  },
  {
    slug: 'autozain',
    file: 'autozain/contact-outcome-1440x900.png',
    async run(page) {
      await page.locator('article').first().click();
      await page.locator('button:has-text("تواصل مع موظف")').first().click();
      await page.locator('.employee-card button:not([disabled])').first().click();
      await page.locator('form button[type="submit"]').first().click();
      await page.waitForTimeout(400);
      await page.locator('.persona-switch button').last().click();
      await page.waitForTimeout(300);
      await page.locator('button').filter({ hasText: /قبول|Accept/ }).first().click();
      await page.waitForTimeout(300);
      await page.locator('.session-outcome button').first().click();
      await page.waitForTimeout(600);
    },
  },
  {
    slug: 'roya',
    file: 'roya/shooting-weeks-impact-1440x900.png',
    async run(page) {
      await page.locator('[role="tab"]').nth(1).click();
      await page.locator('button').filter({ hasText: /تعديل أسابيع|Change shooting/ }).first().click();
      await page.locator('input[type="number"]').first().fill('6');
      await page.locator('button').filter({ hasText: /معاينة التأثير|Preview impact/ }).first().click();
      await page.waitForTimeout(600);
    },
  },
  {
    slug: 'ramex',
    file: 'ramex/roll-stock-result-1440x900.png',
    async run(page) {
      await page.locator('article[data-roll-id="701"] .primary-button').click();
      await page.locator('button.pay-button').click();
      await page.waitForTimeout(300);
      await page.locator('button').filter({ hasText: /تأكيد البيع والدفع/ }).first().click();
      await page.waitForTimeout(800);
      await page.locator('nav[aria-label="أقسام العرض"] button').nth(1).click();
      await page.waitForTimeout(500);
    },
  },
];

const server = await startStaticServer();
const browser = await chromium.launch();

for (const capture of captures) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(`${server.origin}/demos/${capture.slug}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await capture.run(page);

  const target = path.join(publicImages, capture.file);
  await mkdir(path.dirname(target), { recursive: true });
  await page.screenshot({ path: target, clip: { x: 0, y: 0, ...viewport } });
  console.log(`captured ${capture.slug} → apps/portfolio/public/images/${capture.file}`);
  await context.close();
}

await browser.close();
await server.close();
