# Portfolio implementation state

Last updated: 12 September 2026

## Current position

- Planning package: prepared.
- Visual direction: Studio Dark, accepted by Ahmed.
- Design reference: approved private Site snapshot and separate portable source export.
- Current implementation phase: 06, complete.
- Next prompt: `docs/portfolio/prompts/07-ramex.md`.
- Actual original-UI demos: Vertex, AutoZain, and Roya ready; Ramex not implemented.
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
| 07 — Ramex | Not started | — |
| 08 — quality | Not started | — |
| 09 — release | Not started | — |

## Open items

- Use Node `22.23.2` for repository work. The workstation's default Node `22.12.0` is below the actual locked `undici@8.10.2` engine floor; D17 records the supported range as `>=22.19.0 <23`.
- Integrate the final audited original-UI scenario (Ramex) in Phase 07; Vertex, AutoZain, and Roya are ready proofs.
- Omit AutoZain's exact role until confirmed; other content can proceed.
- Use safe synthetic assets until any specific client media/branding permission is established.
- Preserve source provenance. Vertex and AutoZain are explicitly proprietary; Roya and Ramex have no root license/notice file.
- Do not implement Ramex partial-roll quantity entry unless a later audited source revision actually supports it.
- Resolve final deployment domain/service/access during release preparation.

## Most recent execution

- Phase: 06 — Roya original-UI demo.
- Files/behavior changed: added the bounded React/Vite Roya application; a typed fictional film/project and approved budget; source-consistent integer-piastre cost/preview calculations; bilingual budget/settings/impact UI; explicit preview-only boundary; standalone controls/frame bridge; nested-base build/staging; registry/case-study integration; and actual six-week impact UI evidence.
- Checks: 6 focused domain tests passed; Astro and demo TypeScript checks passed; the six-page plus Vertex/AutoZain/Roya production build and static checks passed under Node `22.23.2`/npm `11.1.0`; production and complete dependency audits are 0; source/built scans and observed requests show no client, API, socket, storage, finance-service, or third-party boundary. Chromium covered exact 4→6 arithmetic, unchanged fixed line, cap warning, Arabic/English paths, preview isolation, cancel/reset, three close/reopen cycles, direct/history entry, mobile RTL/overflow, and final console/network behavior. Complete emitted demo basis is `53.99 KiB`; throttled cold click-to-ready was 1,021–1,046 ms, median 1,044 ms.
- Validation: `docs/portfolio/validation/phase-06.md` with captures under `output/playwright/phase-06/`; extraction and evidence provenance in `apps/demo-roya/SOURCE.md` and `docs/portfolio/source-audit.md`.
- Blockers: none for Phase 06. Apply/save remains intentionally omitted because its source mutation/reason/audit rules are outside the bounded preview. The Phase 00 pinned commit was unavailable in the later checkout; the recorded audit was transparently cross-checked against the clean available revision. Firefox/WebKit, comprehensive accessibility and 200% text coverage, deployed headers, and the final host/domain remain deferred.
- Next action: run `docs/portfolio/prompts/07-ramex.md` only when explicitly requested.

## Update format

After each execution, record: phase, actual files/behavior changed, commands/checks and results, source revision where relevant, open blockers, next action, and the associated validation report path. Do not mark future work complete based on this plan.
