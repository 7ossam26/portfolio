# Maintenance guide

How to keep this portfolio current without re-reading every phase document. Written
12 September 2026, updated during Phase 09 release preparation.

## 0. Prerequisites

| Requirement | Value |
| --- | --- |
| Node | `>=22.19.0 <23`; `.nvmrc` pins `22.23.2` (DECISIONS.md D17) |
| npm | `>=11 <12`; the repository is pinned to `npm@11.1.0` |
| Install | `npm ci` at the repository root — it is an npm workspace, do not install inside `apps/*` |

Phase 09 uses checksum-verified Node `22.23.2` paired with the already-installed
npm `11.1.0` in `.local-tools/release-toolchain/`. This directory copies the verified
Node binary and npm package without altering the system runtime or original download.
The system Node remains `22.12.0`; the portable runtime's bundled npm is `10.9.8`.
Neither is the release toolchain. On this workstation use PowerShell:

```powershell
$env:PATH = "$((Resolve-Path '.local-tools/release-toolchain').Path);$env:PATH"
npm.cmd ci
npm.cmd run release:prepare
```

Elsewhere install the pinned Node and npm versions, verify `node --version` and
`npm --version`, then use normal `npm ci` / `npm run release:prepare` commands.
Local tool downloads are ignored and are not included in the served output.

## 1. Everyday commands

```
npm run build        # check assets → build shell → build demos → stage → check static output
npm run preview:all  # serve the merged dist/ at http://127.0.0.1:4321
npm run typecheck    # astro check on the shell
npm run clean        # remove generated shell and merged output
npm run verify       # the full Phase 08 browser suite against the current dist/
```

`npm run build` is the only build entry point. It fails the release if a demo marked
`available` is missing its output, if a demo asset is referenced before activation,
if internal harness files reach `dist/`, or if the metadata does not match the
configured publication mode.

## 2. Updating written content

All public copy lives in one typed file: `apps/portfolio/src/content/projects.ts`.
Edit the `projects` array; `ProjectContent` will reject a missing field.

| Field | Where it appears |
| --- | --- |
| `name`, `domain` | Homepage row, case-study hero, 404 shortcuts |
| `summary` | Case-study `Scope` row |
| `distinction` | Homepage row description and the case-study deck |
| `problem` | Case study, "The operational problem" |
| `role`, `contribution` | Case study, "Verified contribution" — **both optional.** AutoZain deliberately omits them (D15); leave them out rather than guessing |
| `capabilities` | Case study, "Selected capabilities"; entries 2 and 3 also feed the homepage Vertex feature |
| `decisions` | Case study, "Engineering decisions" |
| `flow` | The four-step system-flow diagram |
| `demoSummary` | Case study, "A bounded sample-data scenario" |
| `stack`, `repositoryUrl` | Case-study `Technology` row and the repository link |

Rules that the build does not enforce but the project requires:

- Every public claim traces to the current CV, inspected source, or an explicit
  confirmation from Ahmed. No user counts, revenue figures, timelines, or testimonials.
- Keep internal evidence notes in `docs/portfolio/content-and-evidence.md`, never in
  `projects.ts`. `check:static` fails the build if a known internal marker — a source
  commit SHA, a source file path, or "Exact contribution is unconfirmed" — reaches the
  rendered HTML.
- Describe a diagram as a diagram. `flow` renders under an explicit "not an
  application screenshot" caption; do not relabel it.

After editing: `npm run build && npm run verify:a11y` (copy changes can alter contrast
and heading structure).

## 3. Updating the CV

1. Replace `apps/portfolio/public/Ahmed_Hossam_CV.pdf` with the new file, keeping the
   exact filename — `/Ahmed_Hossam_CV.pdf` is linked from the hero, the footer, and
   every case study.
2. Run `npm run build`. `check:assets` and `check:static` verify the link resolves to
   a real file in the output.
3. Record the new SHA-256 in `docs/portfolio/content-and-evidence.md` so future phases
   can tell whether the CV changed.

The current file is `47,156` bytes, SHA-256
`8997a9d85d6b9b2b03a7cc8011afb51bf1ee02475ffea829133351c2ec3074e8`, byte-identical to
the copy in `design-reference/studio-dark/assets/`.

Do not add a preview URL to the CV. Adding the final public URL is a separate,
explicitly requested edit once the domain is chosen.

## 4. Adding a project

1. **Audit the source first.** Record the exact commit, the selected screen's
   dependency set, its API boundary, and any licence or notice in
   `docs/portfolio/source-audit.md`. A plan is not evidence that extraction works.
2. Add the slug to `projectSlugs` and a full entry to `projects` in
   `apps/portfolio/src/content/projects.ts`.
3. Add a matching entry to `packages/demo-contract/demo-registry.json` with
   `available: false` — this is what keeps a `Try demo` button off a project that has
   no working demo. `build:demos` validates that the registry holds exactly the
   declared slugs with `path: "/demos/{slug}/"`.
4. The case-study route `/work/{slug}/` is generated automatically by
   `apps/portfolio/src/pages/work/[slug].astro`. Add the slug to the `pages` list in
   `scripts/check-static.mjs` and to `indexableRoutes` in `scripts/site-config.mjs`.
5. Add a capture under `apps/portfolio/public/images/{slug}/` and reference it from
   the entry's `media` array with real `width`/`height`. Captures must come from the
   demo running on fictional data — see §6.
6. Only flip `available: true` after the demo's scenario actually passes. Then add its
   journey to `tests/phase-08/demo-journeys.mjs` and its scenario driver to
   `tests/phase-08/network-isolation.mjs` and `tests/phase-08/capture-evidence.mjs`.

## 5. Updating copied source

Each demo records its provenance in `apps/demo-{slug}/SOURCE.md` and in
`docs/portfolio/source-audit.md`.

1. Re-pin the client repository at a new commit and diff **only** the selected paths.
2. If a domain rule changed, update the local service under
   `apps/demo-{slug}/src/services/` and its fixtures together, then verify the
   arithmetic against source-derived examples.
3. If the change alters what the portfolio claims publicly, update `projects.ts`,
   `docs/portfolio/demo-spec.md`, and add a dated entry to `DECISIONS.md` explaining
   the evidence — D16 is the worked example: the pinned Ramex source accepts a roll id
   and no sale quantity, so the partial-roll illustration was replaced rather than
   implemented.
4. Never widen the adapter to reach a real endpoint. Unsupported operations return a
   typed local error or are absent from the bounded route.
5. Keep source notices. Vertex and AutoZain are explicitly proprietary; Roya and Ramex
   carry no root licence file. Do not add a permissive licence covering imported code.

### Fixtures

Fixtures live at `apps/demo-{slug}/src/domain/fixtures.ts`. They must stay
deterministic: fixed clock, fixed ids, one repeatable seed. `reset()` restores the
seed, not just the form state. Money is held in minor units (piastres) and quantities
in milliunits; format at the edge, never round mid-calculation.

The published numbers below are load-bearing — the case studies state them, so
changing a fixture means changing the copy and the captures too:

| Demo | Committed figures |
| --- | --- |
| Vertex | 4 units consume 8 kg + 2 kg; EGP 120 total, EGP 30 unit; ending stock 92 / 48 / 4 |
| Roya | 4→6 weeks moves the weekly line 20,000 → 30,000; fixed line stays 20,000; total 40,000 → 50,000 against a 48,000 cap |
| Ramex | `RMX-M-0701` sells whole at `30.000 meter` for EGP 5,550; `RMX-M-0702` stays available at `24.750 meter` |
| AutoZain | One buyer request → accept → "interested" outcome; the employee returns to available |

## 6. Regenerating case-study captures

Run `node tests/phase-08/capture-evidence.mjs` after `npm run build`. It drives each
standalone demo through its scenario at 1440×900 and overwrites the four PNGs in
`apps/portfolio/public/images/`, then `npm run build` again to stage them.

Do this whenever a demo's visuals change. During Phase 08 the captures had drifted
from the shipped UI after contrast and type-size fixes, which is exactly the failure
this script prevents. Check afterwards that each `media.caption` in `projects.ts`
still describes what the new image actually shows.

## 7. Deployment requirements

The public domain, hosting service, and access remain **unresolved** (D14).
The private review Site is not the production target. See `release.md` for the
prepared artifact and exact remaining gates.

### Publishing

Set `PORTFOLIO_SITE_URL` to the real origin and rebuild:

```
PORTFOLIO_SITE_URL="https://your-domain.example" npm run build
```

| | `PORTFOLIO_SITE_URL` unset (default) | Set to an https origin |
| --- | --- | --- |
| `robots` meta | `noindex,nofollow` on every page | `index,follow` on the five public routes; 404 stays `noindex` |
| Canonical | none | `<link rel="canonical">` on the five public routes |
| Social metadata | none | Open Graph and `twitter:card=summary`, text only — no artwork is generated |
| `robots.txt` | `Disallow: /` | `Allow: /`, `Disallow: /demos/`, plus a `Sitemap:` line |
| `sitemap.xml` | not emitted | the five public routes; demo and 404 routes excluded |

The value must be a root `https` origin without credentials, a path, query, or
fragment. Root-relative asset paths make subpath hosting unsupported. The sitemap
has no build-time `lastmod`; it does not invent a content modification date and its
bytes are reproducible. `check:static` verifies both modes.

### Immutable release bundle

`npm run release:prepare` enforces the pinned Node/npm versions and performs the
complete build. It creates `output/releases/portfolio-<sha256>.tar.gz` and a checksum
sidecar without replacing prior archives. The companion
`output/phase-09/prepared-release.json` identifies the current prepared bundle.

The bundle contains `html/` (the complete static site), `nginx.conf`, `release.json`,
`source-manifest.json`, and an exact `source.tar.gz` build-source snapshot. Only
`html/` is a document root. Source/provenance files stay outside it. The snapshot
includes the two approved reference assets used by the asset gate; it includes no
old Site hosting identity. Documentation and historical QA output are maintained
in Git separately. A base Git revision plus the source-tree hash identifies the
uncommitted Phase 09 changes precisely; do not label it a deployment of just the
base revision.

After receiving the selected origin, rebuild with that value and retain the preview
archive. The test-only `PORTFOLIO_RELEASE_TEST=1` labels a metadata fixture as
`test-fixture-not-for-deployment`; leave it unset for real preparation.

### Optional separate Nginx static service

The generated configuration is a portable serving option, not a selected host.
It listens on service port `8080`, serves `html/` relative to its own prefix, and
uses only its own logs/temp paths. After extracting into a new immutable release
directory, create `logs/`, then run `nginx -p <absolute-release-directory>/ -c
nginx.conf -t`. A selected VPS/Dokploy service must use that artifact/configuration
independently of client services. Its reverse proxy supplies the confirmed public
hostname and TLS. Do not publish service port 8080 directly without the intended
proxy/audience configuration.

For another static host, translate the manifest's exact document policies, route
rules, and cache classes into its supported settings and verify real responses.
For Sites, load the Sites hosting instructions and use the new portfolio's identity.
No container or remote service has been created or tested in Phase 09.

### Headers the host must set

Generated Nginx policies were exercised over local native HTTP. Final-host responses
are still unverified. `release.json` contains the actual per-document policy and
asset hashes; regenerate it whenever built inline content changes.

| Path | Header | Value |
| --- | --- | --- |
| All | `Content-Security-Policy` | `default-src 'none'; base-uri 'none'; object-src 'none'; form-action 'none'; frame-ancestors 'self'` |
| `/` and `/work/*` | `frame-src` | `'self'` — the portfolio embeds only its own demos |
| `/demos/*` | `frame-ancestors` | `'self'` plus a matching `X-Frame-Options: SAMEORIGIN` |
| `/demos/*` | `connect-src` | `'none'` — the demos bundle their fixtures and make no data requests. Verify against the built bundles before enforcing |
| All | `img-src` | `'self'` — built CSS/selected components require no `data:` or `blob:` images |
| All | `font-src` | `'self'` — every font file is self-hosted |
| All | `script-src` / `script-src-attr` | Local scripts plus exact built inline hashes / `'none'`; no `unsafe-eval` |
| All | `style-src` | Local styles plus exact `<style>` hashes when present; no `unsafe-inline` |
| Demo HTML | `style-src-attr` | `'unsafe-hashes'` and the exact hash of the existing bilingual noscript paragraph style; no runtime JSX style props were found |
| Portfolio | `style-src-attr` | `'none'` |
| All | `Referrer-Policy` | `strict-origin-when-cross-origin` |
| All | `X-Content-Type-Options` | `nosniff` |

`frame-src` governs what the parent may load; `frame-ancestors` governs who may embed
the child and must be a real response header, not a `<meta>` substitute. Do not solve
a CSP failure with a wildcard origin or `unsafe-eval`.

### Caching

| Path | `Cache-Control` |
| --- | --- |
| `/_assets/*`, `/demos/*/assets/*` | `public, max-age=31536000, immutable` — content-hashed filenames |
| `*.html`, `/robots.txt`, `/sitemap.xml` | `public, max-age=0, must-revalidate` |
| `/Ahmed_Hossam_CV.pdf`, `/favicon.svg`, `/images/*` | `public, max-age=3600` — stable names, so keep revalidation cheap but possible |

A missing `.js`/`.css` must return a real error status, not an HTML page with status
200. The local preview server models this: unknown asset extensions get a plain-text
404 while unknown page paths get the styled 404 document, both with status 404.
Confirm the deployed host does the same.

Validators are weak content-SHA-256 ETags (compatible with gzip representations),
with exact matching GET/HEAD conditional requests returning 304. Archive mtimes are
fixed for reproducibility, so `if_modified_since off` prevents timestamp-based stale
304s. Error responses are `no-store`; non-GET/HEAD methods return 405. Check cache
and policy headers on 304 and missing assets too.

### Rollback

Keep both the previous deployed archive and its effective host configuration. Roll
back the separate portfolio service by restarting/redeploying that exact archive
and configuration, then repeat HTTP and fresh-browser checks. A prior source rebuild
is not a rollback artifact. There is no database or migration. Phase 09 retains the
pre-phase static output as a development baseline; it is not a previous public
deployment. Exact commands for the chosen service can be recorded only after it is
selected. See `release.md`.

### Verify the extracted serving contract

```powershell
$env:PORTFOLIO_NGINX = (Resolve-Path '.local-tools/nginx-1.30.4/nginx.exe').Path
$env:PORTFOLIO_VERIFY_BROWSER = '1'
npm.cmd run release:verify
```

Without `PORTFOLIO_VERIFY_ORIGIN`, this starts only a loopback Nginx instance,
checks the archive/configuration and every served file, and stops it. The optional
browser flag reruns existing journey/network suites against those headers, keeping
Phase 08 evidence separate. To verify a deployed artifact, set
`PORTFOLIO_VERIFY_ORIGIN` to its exact selected public origin; no local Nginx is needed
in that mode. The native host's deployment/TLS/status checks and fresh unauthenticated
browser review remain mandatory. Never count a local pass as a public deployment pass.

## 8. Regression checks before any release

```
npm ci                                  # reproducible install from the lockfile
npm run build                           # must be clean; it fails on real problems
npm audit --omit=dev                    # currently 0 vulnerabilities
npm run verify                          # 415 browser checks across five suites
npm i --no-save lighthouse@13.2.0 && npm run verify:lighthouse
```

`npm run verify` runs, against the current `dist/`:

| Suite | Covers |
| --- | --- |
| `verify:visual` | Five viewports × six routes, 200% text, zoom-equivalent reflow, overflow, contrast, touch targets, demo dialog layout |
| `verify:a11y` | axe on 13 scopes, keyboard order, focus visibility, dialog semantics, focus containment, reduced motion, RTL/LTR, no-JS |
| `verify:journeys` | Three lifecycle cycles per demo, domain scenarios, timeout/retry, child error, forged messages, history, Escape, focus and scroll restoration |
| `verify:network` | Cold-entry and full-scenario request capture, forbidden-host matching, runtime channel and storage traps |
| `verify:performance` | Startup payloads, click-to-ready, first-demo payload, lab timings |

Each suite writes a JSON record to `output/playwright/phase-08/` and exits non-zero on
any failure. Screenshots land in the same directory.

If a check fails, fix the product rather than the assertion. Where a test itself is
wrong — the Phase 08 run had three such cases, an intentional 404 counted as a console
error, a naive tab-order rule that misread a two-column footer, and Arabic-Indic digits
compared against ASCII — correct the test and say so in the validation report.

### Known coverage gaps

- **Firefox and WebKit are unverified.** Current suites explicitly launch Chromium.
  Installing other engines and rerunning the same command does not close this gap;
  drive equivalent journeys/reflow/keyboard checks in those engines or record Ahmed's
  manual results/explicit exception.
- **No deployed-host verification.** Headers, caching, TLS, and a fresh
  unauthenticated visit remain unchecked until a target exists.
- **No field metrics.** See `docs/portfolio/validation/performance.md` §8.
- The pinned-runtime build gap is closed in Phase 09; see §0 and `validation/phase-09.md`.
