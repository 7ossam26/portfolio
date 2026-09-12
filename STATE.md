# Portfolio implementation state

Last updated: 12 September 2026

## Current position

- Planning package: prepared.
- Visual direction: Studio Dark, accepted by Ahmed.
- Design reference: approved private Site snapshot and separate portable source export.
- Current implementation phase: 04, complete.
- Next prompt: `docs/portfolio/prompts/05-autozain.md`.
- Actual original-UI demos: Vertex ready; AutoZain, Roya, and Ramex not implemented.
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

## Phase tracking

| Phase | Status | Evidence |
| --- | --- | --- |
| 00 — audit | Complete | `docs/portfolio/source-audit.md`; `docs/portfolio/validation/phase-00.md` |
| 01 — foundation | Complete | `docs/portfolio/validation/phase-01.md` |
| 02 — portfolio | Complete | `docs/portfolio/validation/phase-02.md` |
| 03 — demo host | Complete | `docs/portfolio/validation/phase-03.md` |
| 04 — Vertex | Complete | `docs/portfolio/validation/phase-04.md`; `docs/portfolio/source-audit.md` |
| 05 — AutoZain | Not started | — |
| 06 — Roya | Not started | — |
| 07 — Ramex | Not started | — |
| 08 — quality | Not started | — |
| 09 — release | Not started | — |

## Open items

- Use Node `22.23.2` for repository work. The workstation's default Node `22.12.0` is below the actual locked `undici@8.10.2` engine floor; D17 records the supported range as `>=22.19.0 <23`.
- Integrate the next audited original-UI scenario (AutoZain) in Phase 05; Vertex is the first ready proof.
- Omit AutoZain's exact role until confirmed; other content can proceed.
- Use safe synthetic assets until any specific client media/branding permission is established.
- Preserve source provenance. Vertex and AutoZain are explicitly proprietary; Roya and Ramex have no root license/notice file.
- Do not implement Ramex partial-roll quantity entry unless a later audited source revision actually supports it.
- Resolve final deployment domain/service/access during release preparation.

## Most recent execution

- Phase: 04 — Vertex original-UI demo.
- Files/behavior changed: added the bounded React/Vite Vertex application, typed fictional fixture/adapter, source-consistent production transaction and replay guard, recipe/material/stock/history UI, standalone controls and frame bridge, nested-base build/staging, registry/portfolio integration, actual UI capture/caption, Windows-safe demo build launch, and PNG-aware static checks.
- Checks: 5 focused domain tests passed; Astro and demo TypeScript checks passed; the clean six-page plus Vertex production build and static checks passed under Node `22.23.2`/npm `11.1.0`; full dependency audit is 0; source scan and observed requests show no client/production boundary. Chromium covered the four-unit reconciliation, excessive-stock rejection, double activation, standalone and host reset, three close/reopen cycles, direct entry, keyboard Escape/focus, mobile overflow, and final console/network behavior. First-usable transfer is `71.55 KiB`; throttled cold click-to-ready was 461–740 ms, median 471 ms.
- Validation: `docs/portfolio/validation/phase-04.md` with captures under `output/playwright/phase-04/`; extraction and asset provenance in `docs/portfolio/source-audit.md`.
- Blockers: none for Phase 04. Firefox/WebKit, full accessibility and 200% text coverage, deployed headers, and the final host/domain remain deferred to their planned phases.
- Next action: run `docs/portfolio/prompts/05-autozain.md` only when explicitly requested.

## Update format

After each execution, record: phase, actual files/behavior changed, commands/checks and results, source revision where relevant, open blockers, next action, and the associated validation report path. Do not mark future work complete based on this plan.
