// Shared helpers for the Phase 08 release-candidate validation runs.
// Every run serves the real production `dist/` output over loopback HTTP and
// drives it with Playwright Chromium. Nothing here touches a client service.

import { createReadStream } from 'node:fs';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

export const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
);
export const staticRoot = path.join(repositoryRoot, 'dist');
export const artifactRoot = process.env.PORTFOLIO_VERIFY_ARTIFACT_ROOT
  ? path.resolve(process.env.PORTFOLIO_VERIFY_ARTIFACT_ROOT)
  : path.join(repositoryRoot, 'output', 'playwright', 'phase-08');

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

const assetExtensions = new Set(['.css', '.js', '.json', '.woff', '.woff2', '.png', '.svg', '.webp', '.pdf']);

/**
 * Serve `dist/` the way the release target is expected to: directory indexes,
 * a real 404 status for unknown paths, and a non-HTML body for missing assets.
 */
export async function startStaticServer() {
  if (process.env.PORTFOLIO_VERIFY_ORIGIN) {
    const origin = new URL(process.env.PORTFOLIO_VERIFY_ORIGIN).origin;
    return { origin, close: async () => {} };
  }
  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    const decodedPath = decodeURIComponent(url.pathname);
    const relativePath = decodedPath.endsWith('/') ? `${decodedPath.slice(1)}index.html` : decodedPath.slice(1);
    let filePath = path.resolve(staticRoot, relativePath);

    if (filePath !== staticRoot && !filePath.startsWith(staticRoot + path.sep)) {
      response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Forbidden');
      return;
    }

    let details;
    try {
      details = await stat(filePath);
      if (details.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
        details = await stat(filePath);
      }
    } catch {
      const extension = path.extname(filePath).toLowerCase();
      if (assetExtensions.has(extension)) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
        return;
      }
      const fallback = path.join(staticRoot, '404.html');
      try {
        const fallbackDetails = await stat(fallback);
        response.writeHead(404, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': fallbackDetails.size,
        });
        createReadStream(fallback).pipe(response);
      } catch {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
      }
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      'Content-Type': mimeTypes.get(extension) ?? 'application/octet-stream',
      'Content-Length': details.size,
      'Cache-Control': filePath.includes(`${path.sep}_assets${path.sep}`) || /-[A-Za-z0-9_-]{8}\./.test(path.basename(filePath))
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=0, must-revalidate',
    });
    createReadStream(filePath).pipe(response);
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return {
    origin: `http://127.0.0.1:${port}`,
    async close() {
      await new Promise((resolve) => server.close(resolve));
    },
  };
}

/** Record every request the browser makes, with transfer sizes where available. */
export function recordRequests(page) {
  const entries = [];
  page.on('request', (request) => {
    entries.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      frame: request.frame()?.url() ?? null,
      status: null,
      transferBytes: null,
      failure: null,
    });
  });
  page.on('response', async (response) => {
    const entry = entries.findLast((candidate) => candidate.url === response.url() && candidate.status === null);
    if (!entry) return;
    entry.status = response.status();
    try {
      const body = await response.body();
      entry.transferBytes = body.length;
      entry.gzipBytes = gzipSync(body).length;
    } catch {
      /* body unavailable (redirect/aborted); size stays null */
    }
  });
  page.on('requestfailed', (request) => {
    const entry = entries.findLast((candidate) => candidate.url === request.url() && candidate.status === null);
    if (entry) entry.failure = request.failure()?.errorText ?? 'failed';
  });
  return entries;
}

/** Collect console output and page errors so "clean console" is an observation, not a claim. */
export function recordConsole(page) {
  const messages = [];
  page.on('console', (message) => {
    messages.push({ type: message.type(), text: message.text(), location: message.location() });
  });
  page.on('pageerror', (error) => {
    messages.push({ type: 'pageerror', text: error.message, location: null });
  });
  return messages;
}

export function externalRequests(entries, origin) {
  return entries.filter((entry) => {
    if (entry.url.startsWith(origin)) return false;
    if (entry.url.startsWith('data:') || entry.url.startsWith('blob:') || entry.url === 'about:blank') return false;
    return true;
  });
}

export function demoRequests(entries, origin) {
  return entries.filter((entry) => entry.url.startsWith(`${origin}/demos/`));
}

export async function saveArtifact(relativePath, contents) {
  const target = path.join(artifactRoot, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents);
  return path.relative(repositoryRoot, target).replaceAll('\\', '/');
}

export async function saveJson(relativePath, value) {
  return saveArtifact(relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

export async function shot(pageOrLocator, relativePath, options = {}) {
  const target = path.join(artifactRoot, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await pageOrLocator.screenshot({ path: target, ...options });
  return path.relative(repositoryRoot, target).replaceAll('\\', '/');
}

/** Minimal assertion recorder: every check lands in the report whether it passed or not. */
export class Results {
  constructor(label) {
    this.label = label;
    this.checks = [];
  }

  record(id, passed, detail, artifacts = []) {
    this.checks.push({ id, passed: Boolean(passed), detail, artifacts });
    const mark = passed ? 'PASS' : 'FAIL';
    console.log(`  [${mark}] ${id} — ${detail}`);
    return Boolean(passed);
  }

  get failed() {
    return this.checks.filter((check) => !check.passed);
  }

  summary() {
    return {
      label: this.label,
      total: this.checks.length,
      passed: this.checks.length - this.failed.length,
      failed: this.failed.length,
      checks: this.checks,
    };
  }
}

export const projectSlugs = ['vertex', 'autozain', 'roya', 'ramex'];

/** The Arabic demos render numbers with Arabic-Indic digits; compare on ASCII. */
export function normalizeDigits(text) {
  return (text ?? '')
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٫٬]/g, (mark) => (mark === '٫' ? '.' : ','))
    .replace(/\s+/g, ' ');
}

/** Wait until the host dialog reports a given lifecycle state. */
export async function waitForHostState(page, state, timeout = 20_000) {
  await page.waitForFunction(
    (expected) => document.querySelector('[data-demo-host]')?.dataset.state === expected,
    state,
    { timeout },
  );
}

export async function openDemoFromPage(page, slug) {
  await page.locator(`[data-demo-trigger="${slug}"]`).first().click();
  await waitForHostState(page, 'ready');
  return page.frameLocator('iframe.demo-host-frame');
}
