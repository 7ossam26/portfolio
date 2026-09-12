# Phase 08 — Release-candidate validation

Executed 12 September 2026. Scope: build the complete production artifact, run the
acceptance checklist's test matrix against it in a browser, fix the concrete defects
found, and prepare production metadata without resolving the domain.

**Outcome: the release candidate passes every check that this environment can run.
Four coverage gaps remain and are listed in §10. The release is not complete until
they are closed or explicitly accepted.**

## 0. Browser testing authorisation

`DECISIONS.md` D18 (12 September 2026) defers browser automation to Ahmed's manual
pass and explicitly names phase prompts that ask for it. The Phase 08 prompt asks for
the opposite. This conflict was raised before any work started and Ahmed re-authorised
browser testing for this phase, Chromium only, recorded as D19.

Firefox and WebKit were **not** downloaded by explicit instruction. Their engines are
recorded as an open gap, not as passed.

## 1. Tooling added

| Package | Scope | Reason |
| --- | --- | --- |
| `playwright@1.63.0` | devDependency | Drives every suite below |
| `@axe-core/playwright@4.11.2` | devDependency | Automated WCAG scan, as a supplement |
| `lighthouse@13.2.0` | **not a dependency** | Installed with `--no-save` for the audit, then pruned. Its `puppeteer-core` chain carries 20 known advisories that would otherwise live in the lockfile permanently |

`npm audit` and `npm audit --omit=dev` both report **0 vulnerabilities** on the
committed tree. Both devDependencies are pinned exactly, matching the repository's
existing convention.

Six suites live in `tests/phase-08/`, runnable as `npm run verify` (all five browser
suites) or individually. They serve the real `dist/` over loopback HTTP and write a
JSON record plus screenshots to `output/playwright/phase-08/`.

## 2. Build

`npm run build` — checks assets, builds the shell, builds four demos, stages the
merged output, then checks the static output. Run under Node v22.12.0 / npm 11.1.0.

**Defect 1 — the build was broken on Windows.** `npm run build` failed reproducibly at
the staging step:

```
Error: EPERM: operation not permitted, rename
  '.dist-stage-43852' -> 'dist'
```

`scripts/stage-static.mjs` removed `dist/` and immediately renamed the staged
directory over it. On Windows the OS holds transient handles on a freshly written
tree, so the rename fails even when nothing owns the destination — and it failed on
the second attempt too, after `dist/` no longer existed. The failure was silent about
its cause and left no output. Fixed by giving `rm` bounded retries and adding
`promoteDirectory()`: retry the rename up to eight times with backoff on
`EPERM`/`EACCES`/`EBUSY`/`ENOTEMPTY`/`EEXIST`, then fall back to copy-then-remove.
The build now reports which strategy it used. Verified across more than fifteen
consecutive builds, including after `npm run clean`.

### Output verification

| Check | Result |
| --- | --- |
| Output isolation | 67 files, 1,929.59 KiB. Shell 402.28 KiB; demos in their own `dist/demos/{slug}/` directories with no collisions |
| Nested demo bases | Every demo document references only `/demos/{slug}/…`. No absolute `/assets/` reference escapes a demo. All four demo favicons resolve |
| Enabled manifest entries | All four registry entries `available: true`; each has a host trigger and a staged `index.html`. `check:static` fails if an available demo lacks assets or an unavailable one exposes a trigger |
| Case-study routes | `/work/{vertex,autozain,roya,ramex}/` plus `/` and `/404.html` all render with unique titles and descriptions |
| Local assets | Every `src`/`href` to a `.css/.js/.pdf/.svg/.woff2/.png/.webp` resolves to a real file |
| CV unchanged | `dist/Ahmed_Hossam_CV.pdf` is SHA-256 `8997a9d8…3074e8`, byte-identical to `apps/portfolio/public/` and to the Phase 00 record for `design-reference/studio-dark/assets/` |

## 3. Built output inspected for things that should not ship

Scanned every `.html`, `.js`, `.css`, `.json` in `dist/`:

| Looked for | Found |
| --- | --- |
| `localhost:NNNN`, `127.0.0.1`, `VITE_API`, `REACT_APP_`, `process.env.*`, `DATABASE_URL`, `JWT_SECRET`, bearer tokens | **None.** `process.env` does not appear in any shipped bundle |
| Source maps | **None.** No `.map` files, no `sourceMappingURL` |
| Client hosts, `.onrender.com`, `.vercel.app`, Supabase, Firebase, the private design-review domain | **None** |
| Absolute external URLs | Only XML namespaces (`w3.org`), Ahmed's four GitHub repositories, React's error-decoder URL, and a Tailwind licence comment |
| Internal evidence markers | **None.** The source commit `7254e34b…`, the source path `frontend/src/pages/bom/BOMManager.jsx`, and "Exact contribution is unconfirmed" are all absent and asserted against by `check:static` |
| Internal harness | **None.** No `__demo-host-harness` file and no `LOCAL VALIDATION ONLY` / `host-harness` marker |
| Admin seed credentials from the AutoZain source | **None** |

Two grep hits were checked and are legitimate: the string `Socket.io` in the AutoZain
case study (stack description) and `Ramex-Store` in the Ramex repository link.

## 4. Test matrix

415 browser checks across five suites, all passing, plus 20 Lighthouse checks.

| Suite | Checks | Record |
| --- | --- | --- |
| `visual-responsive` | 218 | `output/playwright/phase-08/visual-responsive.json` |
| `accessibility-keyboard` | 62 | `…/accessibility-keyboard.json` |
| `demo-journeys` | 47 | `…/demo-journeys.json` |
| `network-isolation` | 46 | `…/network-isolation.json` |
| `performance` | 42 | `…/performance.json` |
| `lighthouse` | 20 | `…/lighthouse.json` |

### 4.1 Viewports and enlargement

Six routes × five viewports — 360×780, 390×844, 768×1024, 1024×768, 1440×900 — then
200% text enlargement at desktop and mobile, and a 640×360 layout viewport standing
in for 200% page zoom of a 1280×720 window.

At every combination: no page-level horizontal scrolling; no non-scrollable element
extends past the viewport; no heading or control clips its own content. Screenshots
in `visual/` and `enlargement/`.

### 4.2 Contrast and touch targets

Contrast ratios were computed from resolved colours against each element's effective
background, for every distinct text style and every control boundary, at all five
viewports. All meet WCAG AA (4.5:1 normal, 3:1 large) and all control boundaries meet
3:1. Host dialog Close and Reset measure 68×44 to 76×44 CSS px at every viewport.

### 4.3 Accessibility scan

axe-core WCAG 2.1 A/AA across 13 scopes — six portfolio routes, four standalone demo
routes, and four embedded host-plus-frame combinations. **Zero violations.** Lighthouse
reports accessibility 100 on all five public routes.

The scan is a supplement. The substantive evidence is §4.4 and §4.5.

### 4.4 Keyboard

- First Tab reaches the skip link; it becomes visible on focus.
- Tab order advances down the page within each column; the footer's two-column band
  is correctly read column-by-column.
- Every tab stop renders a focus outline.
- Case-study navigation uses real anchors; no nested interactive controls exist.
  External links carry `rel="noopener noreferrer"`.
- Inside an open demo dialog, 40 consecutive Tab presses never leave the dialog.
- Close is focusable at all times.

### 4.5 Reduced motion, direction, and no-JavaScript

| Check | Evidence |
| --- | --- |
| Reduced motion | Under `prefers-reduced-motion: reduce`, root `scroll-behavior` is `auto`, button transitions are `0s`, the host spinner animation is `none`. "Explore my work" jumps: scrollY moves within 60 ms and does not change over the next 600 ms. With `no-preference` the same root computes `smooth`, proving the media query does the work |
| RTL / LTR | All four demo frames compute `direction: rtl` with `lang="ar"` while the host dialog stays `ltr`. Roya's toggle moves the document from `ar`/`rtl` to `en`/`ltr` and back — captured in `direction/` |
| Without JavaScript | All five content routes render their heading, CV link, email link, and case-study links. Screenshot in `no-js/` |

**Defect 2 — three of four demos had no no-JavaScript fallback.** Only Vertex had a
`<noscript>`, and it was plain text with no way back. All four now carry a bilingual
Arabic/English `<noscript>` linking to the matching case study, and the `Try demo`
buttons on the homepage and case studies carry a `<noscript>` note explaining that the
sample needs JavaScript. `check:static` now fails the build if a demo document loses
its fallback.

### 4.6 Demo dialog layout

Each demo opened at 390×844, 768×1024, and 1440×900: Close and Reset are visible
without scrolling, the host page never scrolls horizontally, the child body either
fits or provides its own internal scroll region, and no rendered text inside any frame
falls below 11px. Screenshots in `demo-layout/`.

## 5. Journeys

### 5.1 Lifecycle

Three open → ready → reset → close cycles per demo. Every cycle: reset produced a new
session id, close removed the frame, cleared the hash, and released the scroll lock.
Zero console errors.

### 5.2 Domain scenarios

| Demo | Verified |
| --- | --- |
| Vertex | Producing 4 units consumes 8 kg and 2 kg, records EGP 120 total and EGP 30 unit cost, and leaves stock 92 / 48 / 4. Reset restores 100 / 50. Requesting 900 units marks the materials short and disables execution; stock is unchanged afterwards |
| AutoZain | Buyer request `pending` → staff `accepted` → `completed`; the buyer view reports the same completed state; reset returns the request state to `none` |
| Roya | Preview moves the weekly line 20,000 → 30,000 and the total 40,000 → 50,000, leaves the fixed line "بدون تغيير", and warns that the new total exceeds the project cap. Cancel leaves the saved budget table byte-identical and `data-saved-weeks` at 4 |
| Ramex | A whole-roll sale preserves `30.000` and EGP 5,550 on the invoice; `RMX-M-0702` still reads `24.750`; reset returns the sale state to `seed` |

### 5.3 Failure paths

| Path | Result |
| --- | --- |
| Loading feedback | The host enters `loading` on click, before any readiness message |
| Timeout | With the demo bundle blocked, the documented **12-second** threshold fired at 12,038 ms with "The sample could not be prepared." / "The application did not become ready within the expected time.", Retry visible, and the frame torn down. No endless spinner |
| Retry | Unblocking the asset and pressing Retry started a fresh session that reached ready |
| Portfolio survives | After the failure the page still rendered its `h1` and the dialog closed normally |
| Child error | A genuine `ERROR` envelope from inside the live frame surfaced the child's safe message |
| Stale and forged messages | Eight invalid envelopes — stale session id, wrong `demoId`, wrong channel, wrong version, unknown type, non-envelope object, 400-character guidance, and a valid envelope posted by the top window instead of the frame — all ignored. State stayed `ready`, guidance unchanged, one frame |

### 5.4 History, entry, focus, and scroll

| Check | Result |
| --- | --- |
| Open pushes one entry | `history.length` +1, hash `#demo=roya` |
| Back | Closes the demo, removes the hash, removes the frame |
| Forward | Reopens the same demo |
| Repeated activation | Still exactly one frame |
| Direct `#demo=` entry | Opens the demo; closing stays on `/work/ramex/` and removes only the hash |
| Unknown slugs | `not-a-demo`, `host-harness`, `../../etc/passwd`, and `https://example.com` all show ordinary page content with zero frames |
| Inner-modal Escape | With Ramex's payment overlay open, Escape closes the overlay and leaves the host open. A second Escape closes the host |
| Focus return | Focus returns to the opening trigger, via Escape and via Close |
| Scroll restoration | scrollY 3,465 before opening → 3,465 after closing, both paths |
| Single active demo | Switching demos by hash leaves one frame |

## 6. Network

Full evidence in `docs/portfolio/validation/network.md`. Headlines:

- **Zero** demo requests on cold entry to any of the six routes.
- Running a scenario costs **zero** requests — the count is identical before and after
  every mutation.
- Close is silent: request count after close equals the count after reset, all four demos.
- 42 distinct paths requested across every run, all relative to the portfolio origin.
- Zero matches against client and third-party host patterns; zero `ws:`/`wss:`.
- Zero WebSockets, EventSources, Workers, beacons, notification prompts, geolocation
  requests, or service-worker registrations. AutoZain, whose source uses Socket.io,
  constructs none.
- Zero `localStorage` keys, `sessionStorage` keys, and cookies in every demo.
- Re-selecting an already-sold roll produced zero requests and zero fetch/XHR calls.

## 7. Performance

Full evidence in `docs/portfolio/validation/performance.md`. Against the project budgets:

| Budget | Target | Measured | Result |
| --- | --- | --- | --- |
| Initial JavaScript | ≤ 45 KiB gzip | 2.94 KiB | Pass |
| Initial CSS | ≤ 45 KiB gzip | 5.73 KiB | Pass |
| Initial homepage transfer | ≤ 450 KiB | 97.63 KiB | Pass |
| Demo assets before opening | 0 | 0 | Pass |
| First usable demo payload | ≤ 800 KiB gzip | 53.40–58.13 KiB | Pass |
| Click-to-ready | ≤ 3,000 ms | 651 / 748 / 685 / 912 ms median | Pass |
| Lighthouse performance | 95+ home, 90+ case studies | 100 on all five | Pass |

Conditions: cold cache, 10 Mbps, 80 ms RTT, 4× CPU, three runs, median plus worst
recorded. **These are lab measurements, not field metrics.** Field Core Web Vitals are
unavailable because the site is not deployed and has no users. Lighthouse does not
measure INP and none is claimed.

## 8. UI review and defects fixed

Reviewed against `design-reference/studio-dark/` and the anti-template criteria in
`docs/portfolio/design-spec.md`. No decorative library was added, no demo was replaced
by a fabricated interface, and the approved composition, tokens, and project ordering
are unchanged.

| # | Defect | Fix |
| --- | --- | --- |
| 1 | Build failed reproducibly on Windows | Retrying directory promotion in `stage-static.mjs` (§2) |
| 2 | Three demos had no no-JS fallback; the host had none at all | Bilingual `<noscript>` in every demo document plus a note beside each `Try demo` button; enforced by `check:static` (§4.5) |
| 3 | **200% text enlargement at 390px forced horizontal page scrolling.** `body { min-width: 20rem }` doubles to 640px under text-only zoom | Floor changed to `320px`. A rem floor ties the reflow limit to font size, failing WCAG 1.4.4 / 1.4.10 |
| 4 | The "In production" pill escaped the feature card at 200% text | `.feature-topline` wraps by default instead of only below 370px |
| 5 | The "Vertex ERP" heading overflowed its column at 200% text | `overflow-wrap: anywhere` plus `min-width: 0` on display headings. `break-word` alone is insufficient: only `anywhere` reduces the intrinsic min-content width that fit-content sizing floors at |
| 6 | Label/value rows squeezed their value column to **zero width** at 200% text, spilling 149px of text | `.project-evidence` and `.case-meta` rows are now wrapping flex rows, so the value stacks when the fixed-rem label no longer fits. Driven by available space, not a breakpoint |
| 7 | Action buttons overflowed their container at 200% text | `min-width: 0` and `overflow-wrap: break-word` on `.button` |
| 8 | **The Vertex feature capture left a large empty cream block** under its caption — a stretched grid item revealing its light backplate | `align-self: start` on `.application-capture` / `.case-capture` |
| 9 | Two filled primary buttons competed in the featured project | "Read case study" is now secondary, matching the approved reference's one-primary/one-secondary pairing |
| 10 | **Focus escaped the modal.** Tabbing past the end of the same-origin frame dropped focus onto the parent `body`, outside the dialog | A focus guard after the frame region returns focus to Close, plus a `focusin` fallback. Verified: 40 Tab presses never leave the dialog |
| 11 | **Roya's budget list used invalid ARIA** — `role="row"` without cell children inside `role="table"`, a critical axe violation | Replaced with `role="list"` / `role="listitem"`; it is a card list, not a grid |
| 12 | **Production-order details were mouse-only** — a `div` with `onClick`, no role, no tabindex, no key handler | Now `role="button"`, `tabIndex={0}`, `aria-expanded`, `aria-controls`, and Enter/Space handling. Exercised from the keyboard in the journey suite |
| 13 | Demo text rendered as small as **8–9px**, mostly Arabic | An 11px floor across all three Arabic demos; collided label/value pairs nudged apart to keep hierarchy |
| 14 | Demo text failed AA contrast: Vertex `text-gray-500` 4.42:1, AutoZain `--text-muted` 3.47:1, Ramex `--tertiary` 3.05:1 and `--accent` 3.79:1 (also as button background) | Each token darkened to the minimum that clears 4.5:1 on every surface it is used on, keeping its hue: `#7b8492→#69707c`, `#8b94a6→#656c79`, `#c4624a→#a95440`; Vertex grays stepped down one level |
| 15 | **Ramex's pay button was silently disabled** on an out-of-precision price, with no explanation — a dead control | An inline `role="alert"` message with `aria-invalid` / `aria-describedby`; the existing `LINE_PRICE_REQUIRED` copy was unreachable because the button was disabled |
| 16 | Vertex's production modal required choosing from a **one-option** warehouse dropdown before the guided flow could proceed | Both selects default to the single sample warehouse. The controls and their validation are untouched; only the starting value is filled |
| 17 | The four case-study captures **no longer matched the shipped demos** after fixes 13 and 14 | Regenerated from the current build by `tests/phase-08/capture-evidence.mjs`; each caption re-checked against the new image |
| 18 | The 404 page offered only one generic link | Direct links to all four case studies, equal-height cards |

Three test defects were also corrected rather than worked around: an intentional 404
probe counted as a console error; a naive "tab order must move down" rule misread the
two-column footer; and Arabic-Indic digits were compared against ASCII.

## 9. Content, claims, and production metadata

### Case-study claims

Every claim in `apps/portfolio/src/content/projects.ts` was re-read against
`content-and-evidence.md` and the source audit. No invented metrics, user counts,
timelines, or testimonials. AutoZain still omits `role` and `contribution` per D15.
The system-flow diagram is labelled "not an application screenshot or a substitute
demo". All four captures show the real demos on fictional data and their captions
match the regenerated images. No placeholder copy, no design-comparison toolbar, and
a `Try demo` button exists only where a working demo exists — all four.

### Metadata, sitemap, robots, 404

A single hook, `PORTFOLIO_SITE_URL`, resolved in `scripts/site-config.mjs`:

| | Unset (current default) | Set to an https origin |
| --- | --- | --- |
| robots meta | `noindex,nofollow` everywhere | `index,follow` on the five public routes; 404 stays `noindex` |
| Canonical | none | on the five public routes only |
| Social metadata | none | Open Graph + `twitter:card=summary`, text only |
| `robots.txt` | `Disallow: /` | `Allow: /`, `Disallow: /demos/`, `Sitemap:` line |
| `sitemap.xml` | not emitted | five public routes; demos and 404 excluded |

Both modes were built and verified, and a non-https value is rejected at build time.
No domain is named anywhere in the artifact. **No social artwork was generated and no
analytics were added.**

The 404 returns status 404 with the styled document; a missing `.js`/`.css` returns
status 404 with `text/plain`, not an HTML page with status 200.

Caching and header requirements are specified in `docs/portfolio/maintenance.md` §7.
They are requirements, not verified behaviour — no host exists yet.

## 10. Unresolved gaps

The release is **not** complete. These four items are open:

1. **Firefox and WebKit are unverified.** Only Chromium was run, by explicit
   instruction (D19). The checklist asks for all three engines where the environment
   supports them. Closing this is `npx playwright install firefox webkit` (~250 MB)
   followed by `npm run verify`.
2. **Nothing is verified against a deployed host.** Effective CSP, `frame-ancestors`,
   `connect-src`, caching headers, TLS, and a fresh unauthenticated visit are all
   unchecked. This is Phase 09 work and depends on D14 being resolved.
3. **No field metrics.** LCP / INP / CLS at p75 require real traffic. All timings here
   are lab proxies from one machine.
4. **Not built on the pinned Node version.** The repository declares `>=22.19.0 <23`
   and pins `22.23.2`; only v22.12.0 is installed. Builds and measurements succeeded
   with `EBADENGINE` warnings. Phase 07 recorded builds under `22.23.2`; that runtime
   is not present now and the claim could not be reproduced.

No agreed demo is blocked. All four are ready and all four scenarios were exercised
end to end in a browser.

## 11. Commands run

```
npm run build                                  # clean, after the staging fix
npm run verify                                 # 415 checks, 5 suites, all pass
npm i --no-save lighthouse@13.2.0
npm run verify:lighthouse                      # 20 checks, all pass
npm install                                    # prunes lighthouse again
npm audit / npm audit --omit=dev               # 0 vulnerabilities, both
PORTFOLIO_SITE_URL="https://example-portfolio-target.test" npm run build
PORTFOLIO_SITE_URL="http://insecure.test" npm run build     # correctly rejected
node tests/phase-08/capture-evidence.mjs       # regenerated the four captures
```

## 12. Artifacts

63 files under `output/playwright/phase-08/`:

| Directory | Contents |
| --- | --- |
| `*.json` | Full machine-readable record of all 435 checks |
| `visual/` | Homepage, Vertex case study, and 404 at five viewports |
| `enlargement/` | 200% text at desktop and mobile; 200%-zoom-equivalent layouts |
| `demo-layout/` | All four demos open at three viewports |
| `journeys/` | Each demo's mutated state and result screens |
| `failure/` | Timeout error, recovered retry, child error |
| `history/` | Direct `#demo=` entry |
| `focus/` | State after the inner-overlay Escape |
| `direction/` | Roya standalone in Arabic and English |
| `keyboard/` | Skip link focused |
| `no-js/` | Homepage and a demo route with scripting disabled |
| `standalone/` | Each `/demos/{slug}/` route |
| `review/` | Homepage, a case study, and the 404 after the UI fixes |
