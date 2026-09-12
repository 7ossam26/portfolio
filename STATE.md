# Portfolio implementation state

Last updated: 12 September 2026 (Phase 09 preparation)

## Current position

- Planning package: prepared.
- Visual direction: Studio Dark, accepted by Ahmed.
- Design reference: approved private Site snapshot and separate portable source export.
- Current implementation phase: 09 — preparation complete; public publication blocked.
- Remaining prompt: resume deployment/handoff steps in `docs/portfolio/prompts/09-release.md` after Ahmed supplies the target/access. There is no next feature phase.
- Actual original-UI demos: Vertex, AutoZain, Roya, and Ramex ready.
- Release status: **prepared, not deployed.** Four actual demos are ready. Phase 08 Chromium/lab evidence remains valid for unchanged static bytes; Phase 09 adds 93 local HTTP, 47 journey, 46 network, 27 domain, and focused origin checks. The pinned-runtime and reproducible build gaps are closed. Public-host verification and Firefox/WebKit remain open; field metrics remain unavailable before traffic. Do not call the portfolio live or the release complete.
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

- Phase: 09 — release preparation and handoff, publication pending.
- Files/behavior changed: enforced root HTTPS origins and removed invented sitemap build dates; added deterministic immutable release/source archives, exact content manifests, generated narrowly hashed CSP and cache/embedding Nginx configuration, content ETags/304/error behavior, native HTTP verification, and an external-origin option for existing browser suites. Added release/validation handoff and updated maintenance/demo wording. Dependencies/lockfile/CV and the 67 preview static files are unchanged.
- Checks: exact Node `22.23.2` / npm `11.1.0` clean `npm ci`, full build/demo typechecks, Astro check 0 diagnostics, 27 existing domain tests, one origin test, production audit 0 vulnerabilities. Final archive: 93 native local HTTP checks. New headers: 47 Chromium journey + 46 network checks. Public metadata fixture: 88 local HTTP checks, explicitly test-only. Independent source snapshot build reproduces exact static bytes; retained Phase 08 output is identical. No public-host, TLS, cross-engine, field, or container verification is claimed.
- Prepared archive: `output/releases/portfolio-2d412b8331edab54b7ecacef7ed90ccc68bc9fa8bb1fe7d1ce5a20fcb20ed340.tar.gz`; base revision `0fe076bc3f6c24c5e890af5399a83b262076a70c` plus exact uncommitted source tree/snapshot hashes in `docs/portfolio/release.md`.
- Validation: `docs/portfolio/validation/phase-09.md`, `docs/portfolio/release.md`; local machine evidence under `output/phase-09/`; immutable archives/baseline under `output/releases/`.
- Blockers: actual public origin/host/service/access missing; public deployment verification pending; Firefox/WebKit unverified; field metrics unavailable until traffic. All four demos remain ready. No unrelated target or client service was changed.
- Next action: receive Ahmed's deployment-specific target/access, then resume only the remaining Phase 09 steps. No new feature phase.

## Update format

After each execution, record: phase, actual files/behavior changed, commands/checks and results, source revision where relevant, open blockers, next action, and the associated validation report path. Do not mark future work complete based on this plan.
