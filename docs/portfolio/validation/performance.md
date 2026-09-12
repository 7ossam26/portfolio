# Performance measurements

Recorded 12 September 2026 during Phase 08. Every number below is a measurement of
the production `dist/` artifact. Nothing here is a field metric.

Regenerate with `npm run build && npm run verify:performance`. The raw record,
including per-request breakdowns and all individual runs, is
`output/playwright/phase-08/performance.json`.

## 1. Conditions

| Item | Value |
| --- | --- |
| Artifact | Production `dist/`, served over loopback HTTP by `tests/phase-08/lib/harness.mjs` |
| Commit at measurement | `bfab0c8` plus the uncommitted Phase 08 changes |
| Browser | Chromium 153.0.8010.12 (Playwright 1.63.0, headless shell) |
| Node | v22.12.0 — **below** the declared `>=22.19.0` floor; see the limitation in §7 |
| Platform | Windows 11, x64 |
| Network shaping | 10 Mbps down/up, 80 ms added latency via CDP `Network.emulateNetworkConditions` |
| CPU shaping | 4× slowdown via CDP `Emulation.setCPUThrottlingRate` |
| Cache | Cold. A fresh browser context per run; no service worker exists |
| Runs | 3 per measurement; median reported with the worst case alongside |
| Viewport | 1440×900 unless stated |

Gzip sizes are computed by compressing each response body with Node's `zlib` at its
default level. The loopback server does not itself negotiate content encoding, so
these are modelled transfer sizes for a gzip-serving host, not observed wire bytes.

## 2. Startup payload against the project budgets

Measured from a cold entry to each route, after `networkidle` plus an 800 ms settle.

| Route | Requests | JS gzip | CSS gzip | Total transfer | Demo requests |
| --- | --- | --- | --- | --- | --- |
| `/` | 4 | 2.94 KiB | 5.73 KiB | 97.63 KiB | 0 |
| `/work/vertex/` | 4 | 2.94 KiB | 5.73 KiB | 98.55 KiB | 0 |
| `/work/autozain/` | 4 | 2.94 KiB | 5.73 KiB | 87.92 KiB | 0 |
| `/work/roya/` | 4 | 2.94 KiB | 5.73 KiB | 141.70 KiB | 0 |
| `/work/ramex/` | 4 | 2.94 KiB | 5.73 KiB | 111.53 KiB | 0 |

| Budget | Target | Measured (worst route) | Result |
| --- | --- | --- | --- |
| Initial portfolio JavaScript | ≤ 45 KiB gzip | 2.94 KiB | Pass, 6.5% of budget |
| Initial portfolio CSS | ≤ 45 KiB gzip | 5.73 KiB | Pass, 12.7% of budget |
| Initial homepage transfer | ≤ 450 KiB | 97.63 KiB | Pass, 21.7% of budget |
| Demo assets before opening | 0 | 0 on all six routes | Pass |

The homepage's four requests are the document, one stylesheet, one script, and the
Vertex capture:

| Request | Raw | Gzip |
| --- | --- | --- |
| `/` (document) | 9.75 KiB | 3.29 KiB |
| `/_assets/projects.*.css` | 25.52 KiB | 5.73 KiB |
| `/_assets/DemoHost.*.js` | 7.57 KiB | 2.94 KiB |
| `/images/vertex/production-result-1440x900.png` | 54.78 KiB | 49.94 KiB |

There are no font requests: the design uses system stacks by decision, so the
portfolio shell fetches no web fonts at all. The single script is the demo host;
the rest of the page is static HTML.

## 3. Click-to-ready

Measured inside the page, from the trigger `click` to the host's `data-state="ready"`,
which is only set after the validated `READY` envelope arrives from the frame. Three
cold runs per demo under the shaping in §1.

| Demo | Runs (ms) | Median | Worst | Target | Result |
| --- | --- | --- | --- | --- | --- |
| Vertex | 651, 642, 673 | **651 ms** | 673 ms | ≤ 3,000 ms | Pass |
| AutoZain | 767, 748, 702 | **748 ms** | 767 ms | ≤ 3,000 ms | Pass |
| Roya | 685, 687, 679 | **685 ms** | 687 ms | ≤ 3,000 ms | Pass |
| Ramex | 947, 912, 900 | **912 ms** | 947 ms | ≤ 3,000 ms | Pass |

Ramex is the slowest because it loads eight self-hosted Cairo font files. This is
measured in the host, not assumed from parent-only instrumentation: the timer stops
on the message the host actually validated for the current session id.

## 4. First usable demo payload

Assets fetched between the trigger click and readiness, per demo.

| Demo | JS+CSS gzip | JS+CSS raw | All assets raw | Requests | Target | Result |
| --- | --- | --- | --- | --- | --- | --- |
| Vertex | 58.13 KiB | 194.04 KiB | 208.37 KiB | 4 | ≤ 800 KiB gzip | Pass |
| AutoZain | 57.79 KiB | 188.93 KiB | 242.83 KiB | 6 | ≤ 800 KiB gzip | Pass |
| Roya | 53.40 KiB | 167.89 KiB | 169.15 KiB | 3 | ≤ 800 KiB gzip | Pass |
| Ramex | 57.21 KiB | 189.69 KiB | 205.88 KiB | 4 | ≤ 800 KiB gzip | Pass |

"All assets raw" adds fonts and sample vehicle images to the JS+CSS figure. No demo
exceeds the budget and none needed an exception.

## 5. Lab timings

Median of three runs. These are lab proxies measured with a Performance Observer in
Chromium, not Core Web Vitals from real users.

| Scenario | FCP | LCP | DCL | Load | Worst CLS |
| --- | --- | --- | --- | --- | --- |
| Homepage, unthrottled, 1440×900 | 60 ms | 68 ms | 48 ms | 48 ms | 0 |
| Homepage, throttled, 1440×900 | 460 ms | 592 ms | 445 ms | 446 ms | 0 |
| Vertex case study, throttled, 1440×900 | 516 ms | 532 ms | 503 ms | 504 ms | 0 |
| Homepage, throttled, 390×844 | 428 ms | 428 ms | 420 ms | 421 ms | 0 |

CLS is zero on every run. The case-study captures carry explicit `width`/`height`
attributes and a CSS `aspect-ratio`, so images reserve their space before loading.

## 6. Lighthouse

Lighthouse 13.2.0 against the production artifact, default mobile emulation with
simulated throttling, run in headless Chrome 153. Raw record:
`output/playwright/phase-08/lighthouse.json`.

| Route | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/` | **100** | 100 | 100 | 66 |
| `/work/vertex/` | **100** | 100 | 100 | 66 |
| `/work/autozain/` | **100** | 100 | 100 | 66 |
| `/work/roya/` | **100** | 100 | 100 | 66 |
| `/work/ramex/` | **100** | 100 | 100 | 66 |

Targets were 95+ on the homepage and 90+ on case studies: both met. Lighthouse
reported FCP 0.9 s, LCP 1.1–1.8 s, TBT 0 ms, CLS 0 across the five routes.

The SEO score of 66 is the deliberate `noindex,nofollow` robots tag that every page
carries while no public domain is configured. Supplying `PORTFOLIO_SITE_URL` switches
the five public routes to `index,follow` with canonical URLs and emits a sitemap; see
`docs/portfolio/maintenance.md`. Re-run Lighthouse after a domain is chosen — this
score is expected to move and is not evidence about the published site.

Lighthouse is intentionally **not** a repository dependency: its `puppeteer-core`
chain carries known advisories that would otherwise sit in the lockfile permanently
for a check that runs once per release. Install it on demand:

```
npm i --no-save lighthouse@13.2.0 && npm run verify:lighthouse
```

## 7. Emitted artifact

| Area | Size |
| --- | --- |
| Shell (HTML, CSS, JS, CV, favicon, captures) | 402.28 KiB |
| `demos/autozain` | 631.95 KiB |
| `demos/ramex` | 517.34 KiB |
| `demos/vertex` | 208.59 KiB |
| `demos/roya` | 169.44 KiB |
| **Total** | **1,929.59 KiB across 67 files** |

Demo bytes only ever reach a visitor who opens that demo.

## 8. Lab versus field, and limitations

- **These are lab measurements.** Field Core Web Vitals (LCP ≤ 2.5 s, INP ≤ 200 ms,
  CLS ≤ 0.1 at p75) are **unavailable**: the site is not deployed and has no real
  users. They stay unavailable until the site is live and has traffic.
- **Lighthouse does not measure INP.** No INP figure is claimed. Interaction latency
  was only observed indirectly through TBT (0 ms) and the click-to-ready timings.
- **One machine, one engine.** All numbers come from a single Windows workstation
  running Chromium. Firefox and WebKit were not measured; their engines are not
  installed locally. Real devices on real networks will be slower.
- **Node version mismatch.** The repository declares `>=22.19.0 <23` and `.nvmrc`
  pins `22.23.2`, but only Node v22.12.0 is installed on this machine. The build and
  all measurements ran on v22.12.0 and succeeded, with npm emitting `EBADENGINE`
  warnings for the root package and `undici@8.10.2`. **The release candidate has not
  been built or measured on the pinned Node version.**
- **Gzip is modelled, not negotiated.** See the note in §1.
- The loopback server has no TLS, no CDN, and no real latency beyond the emulated
  80 ms. Deployed timings will differ and must be re-measured against the real host.
