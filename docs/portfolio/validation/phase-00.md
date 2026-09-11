# Phase 00 validation — source audit

Validation date: 11 September 2026

Status: **Pass for Phase 00**. This result validates source grounding and reference availability only. It does not claim that the portfolio shell or any original-UI demo has been built or run.

## Scope and safety

- Audited only Phase 00.
- Performed read-only filesystem, Git, registry-metadata, and source inspections.
- Did not run client setup, install, migration, seed, test, dev-server, build, production API, socket, upload, auth, database, deployment, or access-control commands.
- Did not modify any client repository. Each source checkout used for final evidence reported a clean worktree after inspection.
- Did not start Phase 01.

The portfolio directory itself has no `.git` metadata, so `git status` reports “not a git repository.” This prevents a repository diff/status assertion for the new portfolio but does not block the Phase 00 document deliverables. File-level verification is recorded below.

## Required inputs read

- `AGENTS.md`
- `STATE.md`
- `DECISIONS.md`
- `docs/portfolio/master-plan.md`
- `docs/portfolio/phase-roadmap.md`
- `docs/portfolio/design-spec.md`
- `docs/portfolio/demo-spec.md`
- `docs/portfolio/content-and-evidence.md`
- `docs/portfolio/acceptance-checklist.md`
- `docs/portfolio/prompts/00-audit.md`
- `design-reference/REFERENCE.md`

Plans and READMEs were treated as leads. Path and behavior conclusions in `source-audit.md` were checked against the pinned source files rather than inferred from those documents.

## Approved-reference verification

| Check | Result |
| --- | --- |
| `design-reference/studio-dark/index.html` | Present; SHA-256 `704F8DCDE13E18BB462AC0A14D8F030B533DA631A7D604DEA4B0AEA0A2ED47A4`. |
| `styles.css` | Present; SHA-256 `D38342D95CA1B6C0B73A7CCD1E9F3723FA497B08C47102AA2FD0D517628FB429`. |
| `app.js` | Present; SHA-256 `FCBBE2ADC8E495B21EC80F40404C3DA3FF6AAB1817B886FED6D3A5D1FE6239A9`. |
| `assets/favicon.svg` | Present; SHA-256 `046DDA39DCD3F3C4691C48AA0ADE75823DF9FF66223EA17595B186E8DC9A2FF9`. |
| `assets/Ahmed_Hossam_CV.pdf` | Present; SHA-256 `8997A9D85D6B9B2B03A7CC8011AFB51BF1EE02475FFEA829133351C2EC3074E8`. |
| Reference provenance | `REFERENCE.md` identifies accepted snapshot `c416bfae87ebfec8ec282961b23c805984cd46fd`. |

PDF inspection used Poppler and pypdf read-only checks. The CV is 47,156 bytes, A4, 2 pages, unencrypted, optimized, has extractable text, and contains no forms or document JavaScript. Both pages were rendered to temporary PNGs and visually inspected: content is legible, no clipping or overlap was seen, and the identity/title and project sections are present. One console extraction attempt encountered a Windows CP1252 encoding error on Unicode hyphen U+2010 after metadata had printed; this was a terminal-output encoding issue, not a PDF parse or rendering failure.

`node --check design-reference/studio-dark/app.js` passed, and every local `src`/`href` referenced by `index.html` resolved. No browser was launched in Phase 00. Existing planning-time contrast checks were read as prior evidence but were not rerun or re-labelled as browser QA.

## Source revision verification

`git ls-remote` was used against the four ledger URLs. On 11 September 2026, each recorded commit matched the remote `main`/HEAD. Final local status evidence:

| App | Revision | Audit checkout | Final status |
| --- | --- | --- | --- |
| Vertex | `7254e34b49acfbe394da3a889abe6e458084cb38` | Existing local checkout; tree matches ledger commit | Clean `main` |
| AutoZain | `768e1de94464fc5dd0f401ce19b81bfec452e818` | Existing local checkout | Clean `main` |
| Roya | `aaf1112b2deb32dbf6c3540e7eb1748abc87bbae` | Isolated temporary checkout because the existing local copy was older | Clean `main` |
| Ramex | `0857f27ae4b9b327fb7f24cd83de038bb0b2ac86` | Isolated temporary checkout because the existing local copy was a different fork/revision | Clean `main` |

The temporary checkout locations are audit working copies only; durable provenance is the repository URL plus full commit recorded in `source-audit.md`. No intentionally newer commit was selected.

## Path and rule evidence

Representative path existence and content checks passed for every chosen flow:

- Vertex: `frontend/src/pages/bom/BOMManager.jsx`, `ProductionHistory.jsx`, `frontend/src/components/ui/KgQuantityInput.jsx`, selected service modules, `backend/routes/bom.js`, `backend/lib/productionService.js`, and Prisma precision fields.
- AutoZain: public `Cars.jsx`/`Employees.jsx`, shared car/request components, `IncomingRequestOverlay.jsx`, `ActiveSessionPanel.jsx`, global auth/socket providers, public/authenticated API clients, contact-request routes/controller/service/repository, and socket events.
- Roya: `ProjectDetail.tsx` settings/preview modal, `BudgetTab.tsx`, `projects-api.ts`, shared project calculation/types, backend preview handler/route, boot/auth/i18n/style boundaries.
- Ramex: `POS.tsx`, `DraftInvoicePrintPage.tsx`, `DraftInvoiceDocument.tsx`, `frontend/src/lib/sales-api.ts`, `invoice-line-quantity.ts`, sale schemas/routes/service, `backend/src/domain/sales/lineQuantity.ts`, and migration `096_invoice_line_sold_quantity_snapshot.ts`.

Imports, providers, router guards, API defaults, role/permission checks, font/style sources, package manifests/locks, and root notice/license files were inspected. No root license file was found in any of the four source trees. Vertex and AutoZain READMEs explicitly state proprietary/internal-proprietary terms; Roya and Ramex contain no root license/notice. These facts are recorded as a public-reuse constraint, not silently interpreted as an open-source grant.

## Runtime and package evidence

Read-only environment/registry commands produced:

- PowerShell `7.6.5`
- Local Node `v22.12.0`
- Local npm `11.1.0`
- Official current Node 22 patch: `22.23.2`, LTS
- Astro `7.3.2`, engine Node `>=22.12.0`, dependency Vite `^8.0.13`
- Vite `8.3.0`, engine `^20.19.0 || >=22.12.0`
- `@astrojs/check` `0.9.10`, TypeScript peer `^5 || ^6`
- TypeScript `6.0.3` selected over incompatible-current `7.0.2` for the check peer range

No new-shell package was installed in this phase. Phase 01 must recheck stable metadata, scaffold the shell, and produce the exact lockfile.

## Material finding and decision update

The pinned Ramex source has no partial sale quantity in its roll-sale input. It snapshots the selected roll's complete meter/kilogram quantity and marks the roll sold. Therefore the planning fixture “sell 7.5 m from 30 m and leave 22.5 m” cannot be implemented truthfully. `DECISIONS.md` D16 changes the bounded Phase 07 scenario to a whole-roll sale and preserves the source evidence and affected phase/spec.

No other recorded product decision changed. In particular, AutoZain's exact contribution stays omitted, client branding/media permission stays unresolved, and production host/domain selection remains deferred.

## Deliverables verified

| Deliverable | Verification |
| --- | --- |
| `docs/portfolio/source-audit.md` | Created; contains reference/runtime audit plus one path-level section per app, dependency/provider boundary, local service contract, fixtures/assets, risks, extraction scope, and explicit unknowns. |
| `docs/portfolio/validation/phase-00.md` | Created; records inputs, commands/checks, safety boundary, source status, limitations, and exit gate. |
| `DECISIONS.md` | D16 appended for the Ramex whole-roll correction. |
| `STATE.md` | Phase 00 marked complete with actual evidence, blockers/deferred items, validation path, and Phase 01 as the next prompt. |

## Limitations and not-yet-run gates

- No portfolio or demo source exists yet; no build, test, or runtime validation was possible or claimed.
- No browser QA, responsive breakpoint exercise, RTL visual comparison, keyboard/focus test, assistive-technology test, Lighthouse measurement, bundle report, network log, or mount/teardown lifecycle test was run.
- Source mobile and RTL support is based on inspected markup/styles/configuration only.
- Local adapters, fixtures, provenance manifests, synthetic media, and font subsets are proposed at path-level boundaries but are not implemented.
- Public rights for client logos/media and the absence of explicit licenses remain release constraints. Synthetic assets are the default.
- AutoZain exact contribution and the final production domain/host remain unresolved by design and do not block Phase 01.

## Exit gate

| Requirement | Evidence | Result |
| --- | --- | --- |
| Approved design available | Complete Studio Dark export, provenance file, hashes, and rendered CV verification | Pass |
| Every accessible selected project flow grounded in real paths | Four full commit pins; clean source trees; frontend/backend/provider/service/rule paths recorded per app | Pass |
| Unknowns separated from verified facts | Dedicated unknowns and limitations in the audit; no role/domain/media/browser claims promoted to fact | Pass |
| Source access blockers recorded | No app remains access-blocked; temporary pinned checkouts resolved the two local revision mismatches | Pass |
| Phase boundary respected | No shell/demo scaffold, client mutation, production access, or Phase 01 action | Pass |

Next prompt: `docs/portfolio/prompts/01-foundation.md`. It was not run.
