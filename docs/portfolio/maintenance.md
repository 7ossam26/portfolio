# Maintenance guide

How to keep this portfolio current without re-reading every phase document. Written
12 September 2026 at the end of Phase 08.

## 0. Prerequisites

| Requirement | Value |
| --- | --- |
| Node | `>=22.19.0 <23`; `.nvmrc` pins `22.23.2` (DECISIONS.md D17) |
| npm | `>=11 <12`; the repository is pinned to `npm@11.1.0` |
| Install | `npm install` at the repository root — it is an npm workspace, do not install inside `apps/*` |

Node v22.12.0 is currently installed on the workstation, which is **below** the
declared floor. Builds succeed but npm emits `EBADENGINE` warnings. Install
`22.23.2` before cutting a release so the artifact matches the declared support
range.

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

The public domain is **unresolved** (D14). Nothing in the artifact names a host.

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

The value must be an absolute `https` URL with no query or fragment; anything else
fails the build. `check:static` verifies both modes, so a half-configured build cannot
ship.

### Headers the host must set

Not yet verified against any host. Inspect the effective response headers after the
first deploy — writing a config file is not evidence it was applied.

| Path | Header | Value |
| --- | --- | --- |
| All | `Content-Security-Policy` | `default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'none'; frame-ancestors 'self'` |
| `/` and `/work/*` | `frame-src` | `'self'` — the portfolio embeds only its own demos |
| `/demos/*` | `frame-ancestors` | `'self'` plus a matching `X-Frame-Options: SAMEORIGIN` |
| `/demos/*` | `connect-src` | `'none'` — the demos bundle their fixtures and make no data requests. Verify against the built bundles before enforcing |
| All | `img-src` | `'self' data:` — the demos use inline SVG data URIs |
| All | `font-src` | `'self'` — every font file is self-hosted |
| All | `style-src` | `'self' 'unsafe-inline'` only if the copied apps need it; check first and prefer dropping it |
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

### Rollback

Keep the previous `dist/` artifact and the commit it was built from. Rolling back is
redeploying that artifact; there is no server state, database, or migration to undo.
Record the deployed commit, artifact hash, and target URL in `docs/portfolio/release.md`.

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

- **Firefox and WebKit are unverified.** Only Chromium is installed. `npx playwright
  install firefox webkit` (~250 MB) then re-run `npm run verify` to close this.
- **No deployed-host verification.** Headers, caching, TLS, and a fresh
  unauthenticated visit remain unchecked until a target exists.
- **No field metrics.** See `docs/portfolio/validation/performance.md` §8.
- **Not built on the pinned Node version.** See §0.
