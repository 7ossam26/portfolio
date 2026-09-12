# Portfolio implementation state

Last updated: 12 September 2026

## Current position

- Planning package: prepared.
- Visual direction: Studio Dark, accepted by Ahmed.
- Design reference: approved private Site snapshot and separate portable source export.
- Current implementation phase: 07, complete.
- Next prompt: `docs/portfolio/prompts/08-quality.md`.
- Actual original-UI demos: Vertex, AutoZain, Roya, and Ramex ready.
- Public production domain: unresolved.

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
| 08 — quality | Not started | — |
| 09 — release | Not started | — |

## Open items

- Use Node `22.23.2` for repository work. The workstation's default Node `22.12.0` is below the actual locked `undici@8.10.2` engine floor; D17 records the supported range as `>=22.19.0 <23`.
- Run the consolidated quality, accessibility, performance, cross-browser, and regression pass in Phase 08; all four original-UI demos are ready for it.
- Omit AutoZain's exact role until confirmed; other content can proceed.
- Use safe synthetic assets until any specific client media/branding permission is established.
- Preserve source provenance. Vertex and AutoZain are explicitly proprietary; Roya and Ramex have no root license/notice file.
- Do not implement Ramex partial-roll quantity entry unless a later audited source revision actually supports it.
- Resolve final deployment domain/service/access during release preparation.

## Most recent execution

- Phase: 07 — Ramex original-UI demo.
- Files/behavior changed: added the bounded React/Vite Ramex application; fictional cashier/open shift/customer and two independent same-fabric rolls; source-correct whole-roll quantity and invoice-unit snapshot rules; exact-cash payment; selected-roll sold-state reconciliation; standalone/host lifecycle; nested-base staging; ready registry/case-study integration; and actual POS/invoice/stock UI evidence. Corrected the stale 7.5 m partial-roll illustration in the demo/content specs.
- Checks: 10 focused service tests passed; demo and Astro TypeScript checks passed; the six-page plus all-four-demo production build/static checks passed under Node `22.23.2`/npm `11.1.0`; production and complete dependency audits are 0; source scans and browser requests show no client/API/socket/storage/third-party boundary. Chromium covered the exact 30.000 meter/EGP 5,550 path, untouched 24.750 meter roll, invoice snapshot, invalid price precision, standalone and host reset, nested Escape, three close/reopen cycles, mobile RTL/internal table scrolling, and clean console/network behavior. Browser-loaded raw payload is `303.46 KiB`; complete emitted directory is `516.35 KiB`.
- Validation: `docs/portfolio/validation/phase-07.md` with captures under `output/playwright/phase-07/`; extraction and evidence provenance in `apps/demo-ramex/SOURCE.md` and `docs/portfolio/source-audit.md`.
- Blockers: none for Phase 07. Partial-roll decrement, kilogram conversion, production auth/concurrent sessions, additional payment methods, factory shipments, and complete accounting remain intentionally outside this source-bounded scenario. The Phase 00 pin was unavailable in the current fork checkout; the recorded audit was transparently cross-checked against clean commit `20cedc5d340e61fff6e387b791f6e3e53994b282`. Firefox/WebKit, comprehensive accessibility, 200% text coverage, consolidated timing, deployed headers, and the final host/domain remain deferred.
- Next action: run `docs/portfolio/prompts/08-quality.md` only when explicitly requested.

## Update format

After each execution, record: phase, actual files/behavior changed, commands/checks and results, source revision where relevant, open blockers, next action, and the associated validation report path. Do not mark future work complete based on this plan.
