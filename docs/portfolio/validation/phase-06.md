# Phase 06 validation — Roya shooting-weeks budget preview

Validation date: 12 September 2026

## Delivered scope

- Added a separate React/Vite application at `apps/demo-roya/`, built for `/demos/roya/`, containing the recognizable bilingual project header, read-only budget slice, project settings, and shooting-weeks impact modal.
- Added one deterministic in-memory service that reproduces the selected source calculation in integer piastres. It has no HTTP, socket, authentication, storage, audit, or persistence fallback.
- Added a visibly fictional four-week film with a zero-contingency/zero-margin/zero-VAT budget, one approved week-dependent camera-crew line, one approved fixed equipment line, and a positive project cap.
- Implemented real input-driven preview calculation, affected and unchanged line display, aggregate before/after/delta totals, cap warning, validation, cancel, Escape, reset, and Arabic RTL / English LTR switching.
- Deliberately omitted apply/save. The source mutation path also carries reason/audit semantics; extracting it without that complete rule set would overstate the bounded demo. Preview, cancel, and reset never change the saved fixture.
- Added standalone controls and the shared frame bridge; enabled Roya only after checks passed; staged it beside Vertex and AutoZain; and updated the case study with an actual sample-data UI capture.

## Source reinspection and rule confirmation

The authoritative ledger revision remains `aaf1112b2deb32dbf6c3540e7eb1748abc87bbae`, inspected and recorded in Phase 00. That object was no longer present in the later local source working copy. Phase 06 cross-checked the still-relevant paths in the clean read-only checkout at `C:\Users\7OSS\Desktop\projects\Film-production-fin-system`, commit `310b1cbb5694d3ef8c1e08e5794a9b9e4961bd72`. Its status remained empty after implementation. No source file was changed, no remote was changed or pushed, and no source service was contacted.

The reinspection covered `ProjectDetail.tsx` (`SettingsTab` and `ShootingWeeksModal`), `BudgetTab.tsx`, `projects-api.ts`, the project handlers and routes, and shared project schemas/calculation helpers. Confirmed behavior:

- The handler selects only `weekly_x_weeks` and `units_x_rate_x_duration` lines whose inputs opt into project weeks.
- It returns every eligible candidate for line-level display, but only approved candidate deltas affect the aggregate budget total.
- Each candidate uses `Math.round((current total / old weeks) × new weeks)` in integer piastres. With zero old weeks, current total is retained.
- The before total is the active approved budget-version total. The warning is true only when a positive cap exists and the after total exceeds it.
- Project contingency basis/rate or fixed amount, producer margin, and VAT exist as settings but are not separately recomputed by this preview handler. The fixture sets all three to zero to keep the demonstrated total exactly traceable.
- The preview endpoint is read-only. Project patch, reason submission, and audit writes belong to the save path and are excluded.
- Week input is a whole number from 1 through 520. Source money display divides piastres by 100 and rounds to whole EGP, using Western digits in both languages; the extracted display preserves that convention.

Detailed source-to-local mappings and evidence provenance are in `apps/demo-roya/SOURCE.md` and `docs/portfolio/source-audit.md`.

## Reconciled scenario

| Stage | Expected and observed result |
| --- | --- |
| Seed | Fictional `Dawn Over Cairo` / `فجر القاهرة`; 4 shooting weeks; EGP 48,000 cap; approved budget total EGP 40,000. |
| Source strategy check | Weekly crew: 500,000 piastres × 4 = 2,000,000 piastres / EGP 20,000. Fixed package: lump amount 2,000,000 piastres / EGP 20,000. |
| Preview 6 weeks | Weekly crew: `round((2,000,000 / 4) × 6)` = 3,000,000 piastres / EGP 30,000; delta +1,000,000 piastres / +EGP 10,000. |
| Unchanged line | Fixed lump-sum equipment remains 2,000,000 piastres / EGP 20,000 and is labeled unchanged. It is not an affected candidate. |
| Aggregate | Before EGP 40,000; after EGP 50,000; delta +EGP 10,000; positive EGP 48,000 cap is exceeded. |
| Isolation | Preview leaves project weeks at 4 and approved budget at EGP 40,000. Cancel closes the preview without mutation. |
| Reset | Language returns to Arabic, the budget tab returns, the modal closes, and the exact 4-week/EGP 40,000 seed is restored. |

The focused rounding fixture independently confirms a non-even proportional result: a current total of 10,001 piastres over 3 weeks previewed at 4 weeks becomes 13,335 piastres, a 3,334-piastre delta.

## Automated domain, type, build, and static checks

Package scripts ran under the repository-pinned Node `22.23.2` and npm `11.1.0` toolchain for the final build.

| Check | Result |
| --- | --- |
| `npm run test --workspace @portfolio/demo-roya` | Pass: 6 domain tests, 0 failures. Covered the fixture's weekly and lump strategies, exact 4→6 math, changed/unchanged eligibility, approved-only aggregation, preview isolation/reset, integer-piastre rounding, and 1–520 whole-number validation. |
| `npm run typecheck --workspace @portfolio/demo-roya` | Pass. |
| `npm run typecheck` | Pass: Astro checked 15 files with 0 errors, warnings, or hints. |
| `npm run build` | Pass under Node `22.23.2`: six Astro pages, Vertex/AutoZain/Roya demo builds, atomic staging, and registry/static checks. |
| Production dependency audit | `npm audit --omit=dev`: 0 vulnerabilities. |
| Complete dependency audit | `npm audit`: 0 vulnerabilities. The demo uses compatible workspace versions React `18.3.1`, Vite `8.3.0`, React plugin `6.1.1`, and TypeScript `6.0.3`. |
| Source boundary scan | 0 matches in the application entry/source for `fetch`, XHR, WebSocket/EventSource, Axios, API/HTTP/WS hosts, browser storage, service workers, beacons, or analytics. |
| Built boundary scan | 0 matches for those client/network mechanisms, the source repository name, or localhost. |
| Reference checkout integrity | Pass: later cross-check commit unchanged and `git status --short` empty. |

## Browser scenario and lifecycle validation

Tool: Chromium `152.0.0.0` on Windows through Playwright CLI. Ahmed explicitly required browser validation in the Phase 06 prompt, so this work overrides D18 for Phase 06 only.

| Check | Measured result |
| --- | --- |
| Complete Arabic path | Budget seed showed 4 weeks, EGP 40,000 total, and both EGP 20,000 lines. Settings showed zero contingency/margin/VAT and approved-lines basis. Previewing 6 produced EGP 40,000 → EGP 50,000, +EGP 10,000, the cap warning, weekly EGP 20,000 → EGP 30,000, and fixed EGP 20,000 unchanged. Cancel restored focus and left 4 weeks/EGP 40,000 visible. |
| English/LTR path | Switched Arabic → English, repeated the 6-week preview and exact values, cancelled, then switched English → Arabic. Both direction changes and preserved Western-digit money presentation were observed. |
| Input-driven state | The totals were generated after entering 6 and invoking preview; the UI reads the adapter response. Focused tests call the same service with other inputs and rounding cases. This is not a diagram or prewritten total toggle. |
| Standalone controls | Direct `/demos/roya/` loaded under its nested base with visible sample-data, Reset, and Portfolio/Back controls. Reset returned to Arabic budget seed. |
| Embedded reset | Host Reset destroyed the iframe/session and created a fresh ready frame at 4 weeks/EGP 40,000. |
| Close/reopen | Three consecutive close/reopen cycles passed. Each close removed the iframe/hash and restored focus to `Try Roya demo`; each reopen started from the seed. |
| History/direct entry | Browser Back closed and removed the demo frame/hash; Forward reopened a fresh ready frame. The `/work/roya/#demo=roya` host path resolved to one Roya iframe. |
| Keyboard | Escape closed the inner preview first. With no inner modal open, the bridge requested host close. Cancel restored focus to the change-weeks control. |
| Mobile/RTL | At `390×844`, the preview remained operable and scrollable. The integrated host reported one ready frame and zero document horizontal overflow; direction remained Arabic RTL. |
| Lazy mount | Before activation the fresh case study had zero iframes and zero Roya resource entries. The demo mounted only after the Try action. |
| Console | Final standalone and integrated production sessions: 0 errors, 0 warnings. |

## Network isolation

Before activation, only the case-study HTML, portfolio CSS/host JavaScript, local Roya evidence capture, and favicon were requested; there was no iframe and no `/demos/roya/` resource. After activation and throughout the exercised flow, the observed set added only same-origin `/demos/roya/`, its hashed JavaScript/CSS, and its favicon. Every observed response was `200`.

There were no API, auth, WebSocket, upload, payment, banking, foreign-exchange, document-storage, analytics, service-worker, source-host, remote-font, or other third-party requests. The independent source and built-string scans support the browser request log.

## Bundle and click-to-ready measurement

| Asset | Raw | Gzip/transfer basis |
| --- | ---: | ---: |
| `index.html` | 625 bytes | 364 bytes gzip |
| Application JavaScript | 159,739 bytes | 51,232 bytes gzip |
| Application CSS | 12,178 bytes | 3,448 bytes gzip |
| Favicon | 299 bytes | 240 bytes gzip |
| Complete emitted demo set | — | 55,284 bytes / `53.99 KiB` |

JavaScript plus CSS is 54,680 bytes / `53.40 KiB` gzip. The host requests none of these demo files before explicit activation.

Click-to-ready was measured on the final merged production build at `1440×1000`, with cache disabled and cleared before each run, `80 ms` latency, `10 Mbps` download/upload, and `4×` CPU throttling. Three cold runs were `1,046 ms`, `1,021 ms`, and `1,044 ms`; median `1,044 ms`, worst `1,046 ms`. The timer started immediately before activating the visible Try link and stopped when the host entered `ready` after the child READY message. Every run confirmed zero iframe and zero Roya resource entries before activation.

## Visual artifacts and provenance

- `apps/portfolio/public/images/roya/shooting-weeks-impact-1440x900.png` — authoritative actual Arabic/RTL preview with fictional six-week impact; `1440×900`, `103,476` bytes, SHA-256 `1FC89B63E09A108803E768BC943C57FB416F4030C3B0A649BE17C7F70A6E2469`.
- `output/playwright/phase-06/roya-impact-final-1440x900.png` — browser-evidence duplicate of the authoritative image and hash.
- `output/playwright/phase-06/roya-budget-ar-1440x900.png` — Arabic read-only budget seed; `91,529` bytes, SHA-256 `1635B2E9592C95616F4B7A751DA5CEF9DCED32F7A4076686228D2923C2E2AE3A`.
- `output/playwright/phase-06/roya-impact-mobile-390x844.png` — standalone mobile impact preview; `32,736` bytes, SHA-256 `4189BD06918397FEDCF1B806866FD5BDF2ED935B666588A13AA4EFF24EEA3E80`.
- `output/playwright/phase-06/roya-host-mobile-390x844.png` — integrated mobile host and fresh child; `58,299` bytes, SHA-256 `7FD580085C69641C9EB50A5FCD547027C94BC59E0572E745F011358565007C54`.

No client imagery is needed for this scenario. Every visible name and financial value is the local fictional fixture.

## Limitations and deferred gates

- The demo is intentionally a read-only budget impact proof. It does not save weeks, collect a reason, write audit events, edit a budget, calculate full contingency/margin/VAT behavior, or reproduce ledger/replay, approvals, payments, scheduling, DOOD, accounts, reports, or the full finance application.
- Browser evidence is Chromium on Windows only. Firefox, WebKit, comprehensive assistive-technology testing, 200% text enlargement, and broader device coverage remain Phase 08; no pass is claimed for them.
- Deployment headers/CSP cannot be validated against the local static preview and remain a release-environment gate.
- The audited Phase 00 ledger commit was unavailable in the later local checkout. The implementation relies on the recorded pinned audit plus a transparent read-only cross-check of the later clean revision; no claim is made that the later revision replaces the ledger pin.

## Exit gate

Phase 06 passes its exit gate. The recognizable local UI computes a genuine source-derived six-week preview from editable input; changed and unchanged lines, integer-piastre rounding, approved totals, cap warning, preview isolation, cancel, reset, lazy mount, teardown, direct/nested paths, and both retained directions are covered. The final production build makes no client or third-party request, the case-study capture is actual fictional-data UI, and the source checkout remains untouched.

Next prompt: `docs/portfolio/prompts/07-ramex.md`. It was not started.
