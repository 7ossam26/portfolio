# Portfolio implementation state

Last updated: 12 September 2026

## Current position

- Planning package: prepared.
- Visual direction: Studio Dark, accepted by Ahmed.
- Design reference: approved private Site snapshot and separate portable source export.
- Current implementation phase: 03, complete.
- Next prompt: `docs/portfolio/prompts/04-vertex.md`.
- Actual original-UI demos: none implemented.
- Public production domain: unresolved.

## Existing evidence

- Current CV reviewed and identity/contact details recorded in `content-and-evidence.md`.
- Four repositories audited at full pinned commits; remote `main`, real source paths, provider/API boundaries, selected domain rules, package versions, notices, assets, and extraction risks are recorded in `docs/portfolio/source-audit.md`.
- Approved design source passed static asset/reference, JavaScript syntax, and selected numerical contrast checks.
- Studio Dark export files were hash-verified; the two-page CV was parsed, rendered, and visually inspected in Phase 00.
- Ramex's pinned source supports whole-roll sales only. D16 replaces the earlier partial-roll fixture for Phase 07.
- The Phase 01 Astro shell now has limited headed-Chromium evidence at 1440×1000 and 390×844, plus initial-request, link, focus, and reduced-motion checks. This is implementation evidence, not full Phase 08 browser coverage.
- The Phase 03 parent demo host now has headed-Chromium lifecycle evidence for lazy frame creation, validated messages, reset/teardown, failure recovery, history, focus, scroll, mobile layout, and internal-harness exclusion. The harness is not an original-UI demo.

## Phase tracking

| Phase | Status | Evidence |
| --- | --- | --- |
| 00 — audit | Complete | `docs/portfolio/source-audit.md`; `docs/portfolio/validation/phase-00.md` |
| 01 — foundation | Complete | `docs/portfolio/validation/phase-01.md` |
| 02 — portfolio | Complete | `docs/portfolio/validation/phase-02.md` |
| 03 — demo host | Complete | `docs/portfolio/validation/phase-03.md` |
| 04 — Vertex | Not started | — |
| 05 — AutoZain | Not started | — |
| 06 — Roya | Not started | — |
| 07 — Ramex | Not started | — |
| 08 — quality | Not started | — |
| 09 — release | Not started | — |

## Open items

- Use Node `22.23.2` for repository work. The workstation's default Node `22.12.0` is below the actual locked `undici@8.10.2` engine floor; D17 records the supported range as `>=22.19.0 <23`.
- Integrate the first audited original-UI scenario (Vertex) in Phase 04; no real project demo is claimed yet.
- Omit AutoZain's exact role until confirmed; other content can proceed.
- Use safe synthetic assets until any specific client media/branding permission is established.
- Preserve source provenance. Vertex and AutoZain are explicitly proprietary; Roya and Ramex have no root license/notice file.
- Do not implement Ramex partial-roll quantity entry unless a later audited source revision actually supports it.
- Resolve final deployment domain/service/access during release preparation.

## Most recent execution

- Phase: 03 — demo host.
- Files/behavior changed: added the typed demo contract/registry, native Studio Dark host dialog, lazy trusted iframe lifecycle, exact bridge validation, reset/retry/teardown, hash/history/focus/scroll handling, responsive full-viewport mobile layout, test-only child harness, and availability-aware demo build/staging checks. All four real demos remain unavailable and no Try demo action is public.
- Checks: passed Astro typechecking and a clean six-page production build under Node `22.23.2`/npm `11.1.0`; production contains no harness or demo output; headed Chromium covered iframe focus, inner Escape, REQUEST_CLOSE, visible Close, three open/reset/close cycles, timeout/retry, child error, malformed/stale/source/origin rejection, direct hash, Back/Forward, unknown URLs, exact scroll/focus return, mobile/desktop layout, and zero initial demo requests.
- Validation: `docs/portfolio/validation/phase-03.md` with captures under `output/playwright/phase-03/`.
- Blockers: none for Phase 03. No original-UI project demo is ready yet; real app behavior/network isolation, cross-browser/full accessibility coverage, deployed headers, and the final host/domain remain deferred.
- Next action: run `docs/portfolio/prompts/04-vertex.md` only when explicitly requested.

## Update format

After each execution, record: phase, actual files/behavior changed, commands/checks and results, source revision where relevant, open blockers, next action, and the associated validation report path. Do not mark future work complete based on this plan.
