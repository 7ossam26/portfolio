# Phase 09 — release preparation and handoff

Executed 12 September 2026. **Preparation complete; publication blocked by missing
selected public origin, host/service, and deployment access. No public URL is verified.**

## Inspection and scope

Read AGENTS.md, STATE.md, DECISIONS.md, the master plan, Phase 09 prompt, demo/design
specifications, acceptance checklist, Phase 08 report/maintenance guide, and actual
Phase 08 JSON evidence. Initial Git tree was clean at
`0fe076bc3f6c24c5e890af5399a83b262076a70c`. All six prior JSON records report zero
failures (415 Chromium checks plus 20 Lighthouse checks); the four demos are actual
ready original-UI builds with recorded scenario evidence.

Repository files include no `.openai/hosting.json`, deployment workflow, target env
file, or selected service/domain configuration. No relevant deployment/origin env
variable was supplied. The GitHub remote is a source remote, not proof of hosting.
D14 remains unresolved. The design-review Site's identity/audience was not reused.
No client repository, API, service, DNS, CV content, or public account was modified.
No subagents were used. D21 records Ahmed's explicit Phase 09 browser/HTTP request.

## Repairs and prepared files

- Portable Node `22.23.2` downloaded from Node's official distribution and checked
  against official SHA-256 `1177b4137ba5adaa56354ae40f1080c7450e8ae09cecb47da459d1c52ac99f97`.
  Release uses existing npm `11.1.0`, not portable Node's bundled npm `10.9.8`.
  One initial install with bundled npm emitted an engine warning; a second clean
  `npm ci` with exact pinned npm completed without that warning.
  A separate `.local-tools/release-toolchain/` pairs the verified Node binary and
  copied npm `11.1.0` so nested `npm` script calls also use the declared version.
  Rebuilding with this paired PATH preserves the exact same archive hash.
- `scripts/site-config.mjs` now rejects credentials and non-root paths in an origin;
  all shipped asset paths are root-relative. `scripts/stage-static.mjs` omits the
  invented build-date `lastmod`, making sitemap bytes reproducible.
- `scripts/release-lib.mjs` generates deterministic archives, inspects actual built
  inline scripts/styles, and generates per-document Nginx policies and exact cache
  classes/content ETags. Existing demo noscript style attributes require only their
  exact hash; no broadly disabled CSP directive is needed.
- `scripts/prepare-release.mjs` enforces exact Node/npm and a complete build before
  writing immutable archives with source/output manifests and a build-source snapshot.
  Added `release:prepare` / `release:verify`, focused origin and HTTP checks, and
  optional external-origin/artifact-directory support to the existing browser harness.
- Retained the pre-phase static output before rebuilding, then archived it separately.
  Added release/maintenance/state handoff; corrected stale demo-readiness wording.
  No package dependency or lockfile version changed.

## Failures found and resolved

Native Nginx checks first rejected the default map hash bucket for long font paths;
the generated config now uses 256 bytes. Its Windows defaults expected a missing
parent temp directory; all temp paths now live under the service's own writable logs.
Adding a content ETag alone produced 200 rather than a conditional 304; explicit
exact GET/HEAD content-validator matching now supplies correct 304 behavior. Fixed
archive timestamps would make Last-Modified validation stale across equal-length
changes, so timestamp validation is disabled. Named missing-asset responses initially
inherited extension MIME mappings; an empty `types` block now makes them text/plain.
A transient invalid semicolon after that block was caught by `nginx -t` and corrected.
All final affected checks pass. Assertions were not relaxed to hide these failures.

## Commands and results

All final release commands use portable Node `22.23.2` and npm `11.1.0` as documented
in maintenance §0. Nginx `1.30.4` Windows package was downloaded from its official
stable page; downloaded ZIP SHA-256 is
`159294214d403f34f0bb4ae598801ab1f6a0d8c8da707f8f08748e294a222a01`.

| Gate | Result / scope |
| --- | --- |
| `npm ci` | Clean install, 308 packages; audit 0 vulnerabilities |
| `npm run release:prepare` | Complete shell + four demo typechecks/builds/staging/static gates; no engine warning with exact toolchain |
| `npm run typecheck` | Astro: 15 files, 0 errors/warnings/hints |
| `npm test --workspaces --if-present` | 27 existing domain tests pass: AutoZain 6, Ramex 10, Roya 6, Vertex 5 |
| `node --test tests/phase-09/site-origin.test.mjs` | 1 passes; invalid schemes/credentials/subpaths/query/fragments rejected |
| `npm audit --omit=dev` | 0 vulnerabilities |
| `nginx -t` and `release:verify` | 93 local native HTTP checks pass against final archive |
| `PORTFOLIO_VERIFY_BROWSER=1` release verification | Existing Chromium journeys 47/47, network isolation 46/46 against generated Nginx headers |
| Public metadata fixture build + HTTP | 88/88 checks; fixture origin only, labeled not for deployment |
| Source snapshot independent `npm ci` / `npm run build` | Complete 67-file static output matches exact prepared output hash |
| Repeated immutable preparation | Same exact SHA-256 archive bytes, including preparation with paired nested npm |
| Retained Phase 08 versus rebuilt preview | All 67 static file bytes and output-manifest hash identical |

HTTP coverage checks every file's status, bytes, cache and ETag; document-specific
CSP, same-origin frame policy, local connections policy, MIME, direct root/four
case-study/four demo paths, unchanged CV/link targets, HEAD/range, redirects, missing
pages/scripts/styles/source records, real 404/no-store, publication mode, matching
304s, stale validators, ignored future timestamp, gzip/Vary, and POST 405.
Browser coverage exercises all four scenarios, three lifecycle cycles each,
reset/close/reopen, direct hash/history, timeout/retry/error, forged messages, nested
Escape/focus/scroll, request capture, runtime data-channel/storage probes, and no
requests after close. No unexpected console/CSP errors appeared in those flows.

The browser suites ran against archive `5a442bea…f9c9695`, before source-packaging
and HTTP-test refinements. Complete static output and Nginx configuration hashes
are identical to the final prepared archive; equivalence was explicitly checked.
Phase 08 visual/a11y/performance evidence was not overwritten or rerun, since the
static bytes are unchanged and only the new serving/runtime gates needed testing.

## Artifacts

Exact source/archive hashes and retained baseline are in [release.md](../release.md).
Durable HTTP checks, browser summaries, source-reproduction and artifact-equivalence
records are also copied under `docs/portfolio/validation/phase-09-evidence/`.
Generated files are local and Git-ignored:

- `output/phase-09/prepared-release.json`, archive + checksum under `output/releases/`.
- `release-http.json` (93 final local checks), `verification-final-http.log`.
- `browser/demo-journeys.json` (47), `browser/network-isolation.json` (46), screenshots
  under `browser/{journeys,failure,history,focus}/`; `verification.log`.
- `browser-artifact-equivalence.json`, `source-reproduction.json` and its build log;
  `archive-reproducibility.json`, repeated and paired-runtime build logs.
- `prepared-public-fixture.json`, `release-http-public-fixture.json`, fixture build/HTTP logs.
- `retained-baseline.json`, immutable retained Phase 08 archive.
- `prepare.log`; extracted test bundle includes `logs/` and local-only listener config.

## Remaining gates and handoff

No selected public origin/host/access exists, so publication, final canonicals,
effective remote proxy/CDN/TLS/header/cache checks, native deployment status, and a
fresh unauthenticated public browser visit are blocked. Local responses are not
deployment evidence. The private design-review Site was untouched. Docker CLI exists
but its Linux daemon is unavailable; no container build/status is claimed.

Firefox/WebKit remain unverified. Earlier advice to install them and rerun `npm run
verify` was insufficient because the scripts hard-code Chromium; maintenance/state
now require actual equivalent engine runs/manual evidence or an explicit exception.
Field p75 metrics require real traffic; no field performance claim was made. The
pinned Node build gap is now closed. No agreed demo is incomplete.

Ask one deployment-specific question only after this preparation/handoff is complete:
the selected public HTTPS origin, hosting service, and deployment access. Resume
the remaining steps of `docs/portfolio/prompts/09-release.md` after that information
arrives. There is no next feature phase.

## Post-preparation repair — repeatable scroll motion (16 September 2026)

Ahmed requested a new, richer scroll-motion layer after reporting that the earlier
experiment ran only on initial page entry. The portfolio shell now applies repeatable
IntersectionObserver states, page progress, scroll-linked image/diagram movement,
project-row progression, section-line drawing, compact sticky navigation, and
restrained control motion. Elements lose their visible state after leaving the
viewport and animate again on re-entry. The feature does not add a mouse-following
cursor or an infinite ornamental loop.

The background now uses scroll-linked copper and blue ambient gradients, a masked
technical grid, sparse points, and a diagonal light sweep at separate movement
rates. These layers move only as scroll progress changes and are omitted when the
visitor requests reduced motion; no video, canvas loop, or continuous animation was
introduced.

Ahmed then reported slow scrolling. Inspection identified the expensive path: a
root-level custom property changed every frame while driving large fixed gradient
background positions, a mask, image scaling, and a blurred oversized pseudo-element.
The repair replaces that path with isolated decorative DOM layers whose already-
rasterized surfaces move through `transform` only. The progress line uses `scaleX`,
and the image zoom is no longer scroll-driven. The scroll handler remains coalesced
through one `requestAnimationFrame`. Typecheck and the complete build/static gate
passed again after this repair. Browser frame-time measurement remains deferred
under D18 and is not claimed here.

Ahmed subsequently requested continuous motion for the pictured homepage headline.
D23 records this as a narrow exception to the earlier general prohibition on infinite
ornamental motion. The two accent words use alternating transform-only float cycles,
their one-pixel underline uses transform/opacity, and the small eyebrow rule pulses.
The effect is scoped to `#studio-heading`, avoids page-wide paint properties, and is
disabled by the existing reduced-motion media query.

Ahmed then explicitly requested continuous background motion. D24 adds an Ambient
Studio treatment: nested copper/blue light and grid/point surfaces drift at separate
slow rates, while a hairline orbit rotates independently. The continuous animations
run on inner compositor layers; scroll transforms remain on outer wrappers so the
two motion sources do not overwrite each other. All use transform/opacity and the
decorative nodes are not created when reduced motion is requested.

Ahmed rejected that first continuous-background direction as both unclear and too
busy. D25 replaces it rather than stacking more effects: the grid, point field,
mask, and orbit are removed; two larger copper/teal ambient fields and one diagonal
light beam remain. They use separated inner/outer transform layers, retain reduced-
motion behavior, and are intentionally stronger in contrast while using fewer visual
primitives.

The authored page remains visible by default. Motion-only hiding is gated behind a
runtime `motion-ready` class, and the module does not start when the visitor requests
reduced motion. No demo code, fixture, API boundary, content claim, CV, or dependency
was changed.

Validation used the currently available system Node `24.11.1` and npm `11.6.2`:

- `npm.cmd run typecheck`: 16 Astro files, 0 errors, warnings, or hints.
- `npm.cmd run build`: asset checks, portfolio build, all four demo typechecks/builds,
  staging, and the static-output contract passed.

This runtime is outside the pinned Node 22 release range, so the result is local
development evidence rather than a replacement for pinned release preparation.
Browser/visual QA was not run under D18. The immutable archive documented above
predates this repair and must be regenerated after Ahmed's review before publication.

## Post-deployment repair — Vercel omitted all demo builds (21 September 2026)

Ahmed reported a production 404 for
`/demos/vertex/?embedded=1&sessionId=...`. Unauthenticated HTTP inspection confirmed
that the Vercel root served the current portfolio shell with the four demos marked
available, while `/demos/vertex/`, `/demos/vertex/index.html`, and
`/demos/vertex` all returned the styled 404. This rules out the query string and
frame session token: the deployed artifact did not contain the demo entry document.

The repository's full root build already builds each demo and stages it beneath the
root `dist/demos/{slug}/`. The production symptom is therefore a deployment output
mismatch: Vercel published the Astro workspace output instead of the merged root
artifact. Added a root `vercel.json` that selects the framework-neutral root
`npm run build`, publishes `dist`, and enables the directory-style trailing slash
used by the route contract. `scripts/check-static.mjs` now verifies those four
settings so a shell-only Vercel configuration cannot silently pass the production
build again.

Validation used the pinned release toolchain, Node `22.23.2` and npm `11.1.0`:

- `npm run build` passed asset checks, the Astro shell build, all four demo
  typechecks/builds, merged staging, and the complete static contract.
- The staged output contains 52 files under `dist/demos/`, including every demo
  `index.html` and the Vertex JavaScript/CSS assets.
- A local static HTTP check returned 200 for the exact reported Vertex path with
  `embedded=1` and its session ID, the referenced Vertex JavaScript asset, and the
  standalone Vertex, AutoZain, Roya, and Ramex demo entry routes.
- Browser automation was not run because D18 still reserves browser review for
  Ahmed unless explicitly re-authorized.

Production is not claimed repaired yet: no commit/push or Vercel redeploy occurred
in this execution. After redeployment, verify the four remote demo routes and their
assets. The observed production build also remains `noindex,nofollow`, serves the
styled 404 at `/robots.txt`, and lacks the prepared CSP/embedding headers; those are
separate Phase 09 publication gates and were not misreported as fixed here.
