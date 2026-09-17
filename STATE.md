# Portfolio implementation state

Last updated: 16 September 2026 (post-Phase 09 motion repair)

## Current position

- Planning package: prepared.
- Visual direction: Studio Dark, accepted by Ahmed.
- Design reference: approved private Site snapshot and separate portable source export.
- Current implementation phase: 09 — preparation complete; public publication blocked.
- Remaining prompt: resume deployment/handoff steps in `docs/portfolio/prompts/09-release.md` after Ahmed supplies the target/access. There is no next feature phase.
- Actual original-UI demos: Vertex, AutoZain, Roya, and Ramex ready.
- Release status: **prepared baseline, not deployed.** Four actual demos are ready. A 16 September scroll-motion repair changes the portfolio shell after the prepared archive, so that archive is no longer the current release candidate and must be regenerated before publication. Public-host verification and Firefox/WebKit remain open; field metrics remain unavailable before traffic. Do not call the portfolio live or the release complete.
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
- Phase 09 rebuilt under checksum-verified Node `22.23.2` / npm `11.1.0`. An independent clean install/build from the exact source snapshot reproduces all 67 static files byte for byte. Generated Nginx CSP/cache/embedding policies pass native local HTTP and Chromium demo/network gates. The prepared immutable preview archive, exact source/tree hashes, retained pre-phase baseline, and rollback handoff are recorded in `docs/portfolio/release.md`.

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
| 09 — release | Prepared; publication blocked by target/access; no public URL verified | `docs/portfolio/validation/phase-09.md`; `docs/portfolio/release.md` |

## Post-Phase 09 local repair — scroll motion

- Added a progressive motion layer to the portfolio shell: repeatable viewport reveals, staggered entrance directions, a page progress line, scroll-linked image/diagram parallax, project-row progress treatment, section-line drawing, compact sticky navigation, and restrained button/link motion.
- Added a layered scroll-reactive background with copper/blue ambient light, a masked technical grid, sparse light points, and a diagonal light sweep. It is driven by scroll progress rather than an infinite ornamental loop.
- After Ahmed reported slow scrolling, replaced cascading root-variable/background-position updates and a large blurred fixed pseudo-element with isolated DOM layers updated only through compositor-friendly transforms. The progress indicator now uses `scaleX`; image zoom no longer repaints on every scroll frame.
- D23 adds Ahmed's explicitly requested continuous homepage-hero motion: the two accent words float in alternating phases with transform/opacity underlines, and the eyebrow rule pulses. The effect is scoped to the hero and still respects reduced motion.
- D24 adds an explicitly requested continuous Ambient Studio background. Nested light/grid surfaces drift independently inside scroll-transformed wrappers, plus one slow hairline orbit; this keeps continuous motion and scroll motion composited separately.
- D25 replaces the rejected subtle grid/orbit treatment with a clearer restrained version: two larger copper/teal ambient fields and one softly moving diagonal beam. Grid, particles, mask, and orbit were removed.
- Reveal classes are applied only after JavaScript starts; authored content stays visible without JavaScript. `prefers-reduced-motion` prevents the optional layer from starting.
- Re-entry removes and reapplies the visible state, so motion is not limited to the first page load or first intersection.
- Validation on system Node `24.11.1` / npm `11.6.2`: Astro check reports 0 diagnostics and the complete shell + four-demo build/static gate passes. This runtime is outside the repository's pinned Node 22 release range, so it is development evidence only.
- Browser/visual QA was not run because D18 still reserves it for Ahmed unless explicitly re-authorized. The prepared Phase 09 archive predates this source change and must be regenerated with the pinned toolchain after review.

## Open items

### Release-candidate gaps (block calling the release complete)

- **Firefox and WebKit are unverified.** Phases 08/09 ran Chromium. Existing suites explicitly launch Chromium, so merely installing the other engines does not close this gap. Run actual equivalent reflow/keyboard/journey checks in those engines, record Ahmed's manual results, or obtain an explicit exception.
- **Nothing is verified against a deployed host.** Effective CSP, `frame-ancestors`, `connect-src`, caching headers, TLS, and a fresh unauthenticated visit are unchecked. Requirements are written in `docs/portfolio/maintenance.md` §7; Phase 09 must inspect the real responses rather than assume the config applied.
- **No field metrics.** LCP/INP/CLS at the 75th percentile need real traffic. Everything recorded is a lab proxy from one Windows workstation.
- **Pinned-runtime build gap closed in Phase 09.** Portable Node `22.23.2` is installed locally and checksum-verified, and clean install/build/type/domain gates pass with npm `11.1.0`. System Node remains older; maintenance §0 gives the exact release commands.
- **Publication is blocked.** Ahmed's actual public HTTPS origin, selected hosting service/portfolio service, and available deployment access are absent. Current archive is explicitly a preview with noindex, no sitemap, and no invented final canonical. No private review Site audience, client service, DNS, or external account was changed.

### Standing constraints

- Omit AutoZain's exact role until confirmed; other content can proceed.
- Use safe synthetic assets until any specific client media/branding permission is established.
- Preserve source provenance. Vertex and AutoZain are explicitly proprietary; Roya and Ramex have no root license/notice file.
- Do not implement Ramex partial-roll quantity entry unless a later audited source revision actually supports it.
- Resolve the final deployment domain/service/access during release preparation, then build with `PORTFOLIO_SITE_URL` set (D20).
- D21 records Ahmed's explicit Phase 09 browser/HTTP request. It does not authorize publication to an unspecified host or reopen browser testing for unrelated future work.

## Most recent execution

- Phase: post-Phase 09 local repair — repeatable portfolio scroll motion.
- Files/behavior changed: added `apps/portfolio/src/scripts/motion.ts`, loaded it from the base layout, and added progressive motion styling. Reveals replay on viewport re-entry; page progress, layered scroll-reactive background lighting/grid, scroll-linked parallax, project-row progression, section-line drawing, compact navigation, and control motion are included. No demo or content data changed.
- Checks: system Node `24.11.1` / npm `11.6.2`; Astro check reports 0 diagnostics; complete `npm.cmd run build` passes the shell, four demo typechecks/builds, staging, assets, and static-output contract after the scroll-performance repair. Browser/visual/performance QA remains deferred under D18.
- Release impact: the Phase 09 immutable archive remains historical evidence but predates this repair and is not the current source candidate. Regenerate it with pinned Node `22.23.2` / npm `11.1.0` after review.
- Validation: appended to `docs/portfolio/validation/phase-09.md`.
- Blockers: visual approval is pending Ahmed's manual review; public origin/host/access remain missing; public-host, Firefox/WebKit, and field checks remain open.
- Next action: Ahmed manually reviews the motion. Apply any focused correction, then regenerate the pinned release artifact when deployment target/access are supplied.

## Update format

After each execution, record: phase, actual files/behavior changed, commands/checks and results, source revision where relevant, open blockers, next action, and the associated validation report path. Do not mark future work complete based on this plan.
