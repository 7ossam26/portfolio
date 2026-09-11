# Acceptance, Performance, and Release Checks

These are implementation requirements and targets. They are not claims about checks already performed. The approved reference has only static checks, syntax checks, and selected numerical contrast checks; it has not had browser QA or measured runtime performance.

## 1. Product and content

- [ ] The first screen shows Ahmed's identity and business-software focus.
- [ ] Studio Dark matches the approved reference in hierarchy, color, typography, and spacing.
- [ ] Vertex is the flagship; AutoZain, Roya, and Ramex keep their distinct domains.
- [ ] All four project routes load directly, refresh correctly, and have meaningful page titles.
- [ ] Public claims trace to the current CV, source, or explicit confirmation.
- [ ] Every supplied CV link retrieves the correct unchanged PDF.
- [ ] Email and repository links point to the intended destinations.
- [ ] No internal placeholders, design-comparison toolbar, fake figures, or fabricated application screenshots are shipped.
- [ ] A Try demo button exists only for a working demo. A full release has all four ready.

## 2. Visual, responsive, and accessibility checks

Browser-test at 360px, 390px, 768px, 1024px, and 1440px and at 200% text/zoom enlargement. Check Chromium, Firefox, and WebKit where the environment supports them; record unavailable coverage honestly.

- [ ] No accidental page-level horizontal scrolling, clipped headings, overlapping characters, or unreadable shrunk demo UI.
- [ ] Primary controls have usable touch targets and visible focus states.
- [ ] Main reading text, metadata, and control boundaries have appropriate contrast in normal and interaction states.
- [ ] Keyboard navigation follows the visual hierarchy. Native links support normal browser actions.
- [ ] Reduced motion removes optional motion and smooth scrolling.
- [ ] Dialogs are named; the frame has a meaningful title; background content is inert while a modal is open.
- [ ] Tab navigation enters and leaves the frame appropriately within the modal; Close is always reachable.
- [ ] Escape respects an inner application overlay before closing the host; close returns focus and scroll position.
- [ ] Arabic UI remains RTL while English host guidance remains LTR.
- [ ] The portfolio content/CV/contact paths remain usable without JavaScript; demos give a clear JS-required fallback.

Automated accessibility scanning is a useful supplement. A clean scanner result does not replace keyboard or visual review. Do not add tests that only assert a CSS class or duplicate the implementation's markup.

## 3. Demo journeys

Run each scenario from a fresh state, mutate it, inspect its result, reset it, close it, and reopen it. Save evidence of the visible before/after states and the relevant test result.

| Demo | Required behavior |
| --- | --- |
| Vertex | Correct material consumption, finished stock, cost, insufficient-stock behavior, and safe repeated submission |
| AutoZain | Consistent buyer/staff request state, valid accept/outcome behavior, deterministic timeout/rejection where implemented, timer cleanup |
| Roya | Source-consistent impact calculations, unchanged fixed lines where appropriate, no mutation from preview/cancel |
| Ramex | Only the selected roll changes, source-correct quantity/unit handling, stable invoice snapshot, invalid quantity rejection |

- [ ] Open, close, reopen, and reset are reliable after three cycles per demo.
- [ ] Back/Forward and direct demo-hash entry behave as specified.
- [ ] Direct `/demos/{slug}/` loading works and provides sample context/return controls.
- [ ] Loading shows immediately; readiness is sent after the UI is usable.
- [ ] Simulated slow load, missing asset, and child error produce useful recovery rather than an endless spinner.
- [ ] Stale/invalid frame messages cannot change the current demo.
- [ ] No demo assets/data/socket requests occur before a demo is opened.
- [ ] No client-production network requests occur during any scenario, reset, or close.
- [ ] An unsupported operation cannot fall through to a real API.

## 4. Performance budgets

Measure the production build, not development/HMR output. Record browser/tool version, viewport, network/CPU settings, cache condition, and commit. Use three cold runs and report the median plus notable worst cases; do not pick only the best run.

### Project-specific startup targets

| Measurement | Target | Scope |
| --- | --- | --- |
| Initial portfolio JavaScript | At most 45 KiB gzip | All scripts fetched on first load before demo interaction |
| Initial portfolio CSS | At most 45 KiB gzip | All styles fetched for the initial page |
| Initial homepage transfer | At most 450 KiB | Above-the-fold startup requests, including fonts/images |
| Demo assets before opening | Zero | Requests/bundles from any demo application |
| First usable demo payload | Target at most 800 KiB gzip for JS+CSS | Selected app only; record heavier exceptions explicitly |
| Click-to-ready | Target at most 3 seconds | Cold cache, 10 Mbps, 80 ms RTT, 4× CPU slowdown; record device/tool |
| Lighthouse performance | Target 95+ on homepage; 90+ on case studies | Default simulated-mobile audit, production artifact |

These budgets are chosen for this project. If a selected original component exceeds them, inspect eager imports, charts, fonts, and unused routes first. Do not silently discard meaningful behavior or change the approved design to game a score. Report any unresolved exception and its user-visible impact.

For field data, target the documented good Core Web Vitals thresholds: LCP ≤2.5 seconds, INP ≤200 ms, and CLS ≤0.1 at the 75th percentile. A new low-traffic portfolio may not have enough field data. Lighthouse does not measure real-user INP; use interaction traces during development and report field metrics as unavailable until real data exists. [Google Web Vitals](https://web.dev/articles/vitals)

Cross-frame measurements require care. Measure demo click-to-ready in the host using the validated READY message and inspect child interactions separately. Do not assume parent-only instrumentation includes every iframe interaction.

## 5. Build and deployment

- [ ] One reproducible install/build creates the complete static `dist/`.
- [ ] Each demo uses its own output directory and correct nested asset base.
- [ ] A build manifest fails the release if a ready demo entry is missing its assets.
- [ ] A missing JS/CSS asset returns an error response, not an HTML page with status 200.
- [ ] Root/case-study/demo routes, PDF, favicon, and images load correctly from the chosen host.
- [ ] Effective deployed frame/CSP headers permit the intended self-hosted embedding.
- [ ] Deployed demo network policy blocks unintended data connections without breaking local assets.
- [ ] Deployment does not modify client services or their headers.
- [ ] HTML caching supports releases; hashed assets have immutable caching.
- [ ] Final canonical/robots/sitemap configuration uses the actual public domain. Demo routes remain out of search indexing.
- [ ] The public URL works in a fresh unauthenticated visitor session.
- [ ] A prior artifact and rollback instructions exist.

## 6. Required evidence files

During implementation, create these under `docs/portfolio/` rather than asserting success in chat alone:

| File | Record |
| --- | --- |
| `source-audit.md` | Exact source revisions, selected paths, dependencies, copied-file mapping, API boundaries |
| `validation/phase-NN.md` | Commands/tests run, outcomes, screenshots or trace paths, limitations |
| `validation/performance.md` | Budget measurements, conditions, field-vs-lab distinction |
| `validation/network.md` | Allowed static requests and absence of client service connections |
| `release.md` | Deployed commit/artifact, actual target URL, route/header checks, rollback |

No fabricated pass results. If browser tooling, source access, or deployment access is unavailable, state the missing coverage and its consequence. Do not mark the affected gate as passed.
