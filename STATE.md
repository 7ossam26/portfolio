# Portfolio implementation state

Last updated: 12 September 2026 (Phase 08)

## Current position

- Planning package: prepared.
- Visual direction: Studio Dark, accepted by Ahmed.
- Design reference: approved private Site snapshot and separate portable source export.
- Current implementation phase: 08, complete.
- Next prompt: `docs/portfolio/prompts/09-release.md`.
- Actual original-UI demos: Vertex, AutoZain, Roya, and Ramex ready.
- Release-candidate status: **validated but incomplete.** Every check this environment can run passes — 435 in total across six suites. Four gaps remain open and are listed under Open items: Firefox/WebKit, deployed-host headers, field metrics, and the pinned Node version. Do not describe the release as complete until those are closed or explicitly accepted.
- Public production domain: unresolved. The build now accepts it through `PORTFOLIO_SITE_URL` (D20); with the variable unset the artifact stays `noindex` with a `Disallow: /` robots.txt and no sitemap.

## Existing evidence

- Current CV reviewed and identity/contact details recorded in `content-and-evidence.md`.
- Four repositories audited at full pinned commits; remote `main`, real source paths, provider/API boundaries, selected domain rules, package versions, notices, assets, and extraction risks are recorded in `docs/portfolio/source-audit.md`.
- Approved design source passed static asset/reference, JavaScript syntax, and selected numerical contrast checks.
- Studio Dark export files were hash-verified; the two-page CV was parsed, rendered, and visually inspected in Phase 00.
- Ramex's pinned source supports whole-roll sales only. D16 replaces the earlier partial-roll fixture for Phase 07.
- The Phase 01 Astro shell now has limited headed-Chromium evidence at 1440×1000 and 390×844, plus initial-request, link, focus, and reduced-motion checks. This is implementation evidence, not full Phase 08 browser coverage.
- The Phase 03 parent demo host now has headed-Chromium lifecycle evidence for lazy frame creation, validated messages, reset/teardown, failure recovery, history, focus, scroll, mobile layout, and internal-harness exclusion. The harness is not an original-UI demo.
- The Phase 04 Vertex demo now provides the source-derived Arabic BOM execution, inventory, and production-history UI on a typed local fixture. Four output units reconcile to 8 kg and 2 kg consumed, EGP 120 total/EGP 30 unit cost, ending stock 92/48/4, and one order; Chromium evidence covers rejection, repeat safety, reset, direct entry, keyboard/mobile behavior, network isolation, and a 471 ms median cold click-to-ready under the recorded throttle.
- The Phase 05 AutoZain demo now provides the source-derived Arabic marketplace, buyer request, staff response/session, and history UI on typed local fixtures and simulated events. Chromium evidence covers buyer/staff continuity, accept/complete, reject, deterministic timeout, double activation, reset/teardown, direct entry, mobile RTL, network isolation, a Vertex-open regression, and a 1,056 ms median cold click-to-ready under the recorded throttle.
- The Phase 06 Roya demo now provides the source-derived bilingual project, budget, settings, and shooting-weeks impact UI on a deterministic local fixture. Four-to-six weeks changes only the approved weekly camera line from EGP 20,000 to EGP 30,000, retains the EGP 20,000 fixed line, moves the approved total from EGP 40,000 to EGP 50,000, and warns against the EGP 48,000 cap. Chromium evidence covers Arabic/English direction switching, preview isolation, cancel/reset, lazy host lifecycle, direct/nested paths, mobile RTL, network silence, and a 1,044 ms median cold click-to-ready under the recorded throttle.
- The Phase 07 Ramex demo now provides the source-derived Arabic roll POS, exact-cash payment, invoice snapshot, and stock result on one deterministic local service. It truthfully replaces the unsupported partial-roll illustration with a complete `30.000 meter` sale: invoice total EGP 5,550, selected `RMX-M-0701` becomes sold, and same-fabric `RMX-M-0702` remains available at `24.750 meter`. Chromium evidence covers the complete path, invalid price precision, RTL/mobile internal table scrolling, standalone/host reset, nested Escape, lazy mount, three close/reopen cycles, console/network isolation, and a `303.46 KiB` raw browser-loaded payload.
- Phase 08 ran the consolidated release-candidate matrix in Chromium against the production `dist/`: 415 browser checks across five suites plus 20 Lighthouse checks, all passing. Coverage includes five viewports × six routes, 200% text and zoom-equivalent reflow, measured contrast, axe across 13 scopes, keyboard order and modal focus containment, reduced motion, RTL/LTR, no-JavaScript, three lifecycle cycles per demo, all four domain scenarios, the real 12-second timeout with retry, forged frame messages, history and focus/scroll restoration, complete request capture, and measured payloads and timings. Eighteen product defects were found and fixed.
- Measured against the project budgets: initial JS `2.94 KiB` gzip of a 45 KiB budget, CSS `5.73 KiB` of 45 KiB, homepage transfer `97.63 KiB` of 450 KiB, zero demo requests before activation, first demo payload `53.40–58.13 KiB` gzip of an 800 KiB target, click-to-ready medians `651/748/685/912 ms` against a 3,000 ms target, and Lighthouse performance `100` on all five public routes. All lab, not field.

## Phase tracking

| Phase | Status | Evidence |
| --- | --- | --- |
| 00 — audit | Complete | `docs/portfolio/source-audit.md`; `docs/portfolio/validation/phase-00.md` |
| 01 — foundation | Complete | `docs/portfolio/validation/phase-01.md` |
| 02 — portfolio | Complete | `docs/portfolio/validation/phase-02.md` |
| 03 — demo host | Complete | `docs/portfolio/validation/phase-03.md` |
| 04 — Vertex | Complete | `docs/portfolio/validation/phase-04.md`; `docs/portfolio/source-audit.md` |
| 05 — AutoZain | Complete | `docs/portfolio/validation/phase-05.md`; `docs/portfolio/source-audit.md` |
| 06 — Roya | Complete | `docs/portfolio/validation/phase-06.md`; `docs/portfolio/source-audit.md` |
| 07 — Ramex | Complete | `docs/portfolio/validation/phase-07.md`; `docs/portfolio/source-audit.md` |
| 08 — quality | Complete, with four recorded gaps | `docs/portfolio/validation/phase-08.md`; `validation/performance.md`; `validation/network.md`; `docs/portfolio/maintenance.md` |
| 09 — release | Not started | — |

## Open items

### Release-candidate gaps (block calling the release complete)

- **Firefox and WebKit are unverified.** Phase 08 ran Chromium only under D19. Close with `npx playwright install firefox webkit` then `npm run verify`.
- **Nothing is verified against a deployed host.** Effective CSP, `frame-ancestors`, `connect-src`, caching headers, TLS, and a fresh unauthenticated visit are unchecked. Requirements are written in `docs/portfolio/maintenance.md` §7; Phase 09 must inspect the real responses rather than assume the config applied.
- **No field metrics.** LCP/INP/CLS at the 75th percentile need real traffic. Everything recorded is a lab proxy from one Windows workstation.
- **The release candidate was not built on the pinned Node version.** Only `22.12.0` is installed; the repository declares `>=22.19.0 <23` and `.nvmrc` pins `22.23.2`. Builds and measurements succeeded with `EBADENGINE` warnings. Phase 07 recorded builds under `22.23.2`, but that runtime is not present now and the claim could not be reproduced — install `22.23.2` and rebuild before release.

### Standing constraints

- Omit AutoZain's exact role until confirmed; other content can proceed.
- Use safe synthetic assets until any specific client media/branding permission is established.
- Preserve source provenance. Vertex and AutoZain are explicitly proprietary; Roya and Ramex have no root license/notice file.
- Do not implement Ramex partial-roll quantity entry unless a later audited source revision actually supports it.
- Resolve the final deployment domain/service/access during release preparation, then build with `PORTFOLIO_SITE_URL` set (D20).
- D18 still applies after Phase 08: do not run browser automation in Phase 09 unless Ahmed asks again.

## Most recent execution

- Phase: 08 — release-candidate validation.
- Files/behavior changed: fixed a reproducible Windows build failure in `scripts/stage-static.mjs`; fixed six reflow and overflow defects that only appeared at 200% text enlargement; closed a modal focus-containment hole where Tab escaped the dialog past the iframe; made Vertex's production-order disclosure keyboard-operable; replaced invalid ARIA table roles in Roya's budget list; raised all demo text to an 11px floor and darkened four colour tokens to clear WCAG AA; added a visible reason for Ramex's disabled pay control; defaulted Vertex's single-option warehouse selects; added bilingual no-JavaScript fallbacks to all four demos and to the `Try demo` triggers; corrected a duplicated primary action and a stretched capture backplate; expanded the 404 with case-study shortcuts; added `PORTFOLIO_SITE_URL` metadata/sitemap/robots plumbing with build-time verification of both modes; regenerated the four case-study captures so they match the shipped demos; and added six re-runnable verification suites under `tests/phase-08/`.
- Checks: `npm run build` clean; `npm run verify` 415 browser checks across five suites, all passing; Lighthouse 20 checks, all passing — performance/accessibility/best-practices `100` on all five public routes; `npm audit` and `npm audit --omit=dev` both 0. Built and verified in both publication modes, and a non-https `PORTFOLIO_SITE_URL` is rejected at build time. Node `22.12.0`/npm `11.1.0` — below the pinned runtime, see the gap above.
- Validation: `docs/portfolio/validation/phase-08.md`, `validation/performance.md`, `validation/network.md`, and `docs/portfolio/maintenance.md`, with 63 artifacts under `output/playwright/phase-08/`.
- Blockers: no agreed demo is blocked; all four are ready and were exercised end to end. The four release-candidate gaps above remain open, so the release is validated but not complete.
- Next action: run `docs/portfolio/prompts/09-release.md` only when explicitly requested. Stop before deploying.

## Update format

After each execution, record: phase, actual files/behavior changed, commands/checks and results, source revision where relevant, open blockers, next action, and the associated validation report path. Do not mark future work complete based on this plan.
