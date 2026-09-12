# Phase 07 validation — Ramex whole-roll sale

Validation date: 12 September 2026

## Delivered scope

- Added a separate React/Vite application at `apps/demo-ramex/`, built and staged at `/demos/ramex/`, with the recognizable Arabic/RTL roll grid, cart, payment modal, invoice, and roll-stock table from the selected Ramex flow.
- Added one deterministic in-memory service boundary for the local persona, open shift, customer, rolls, sale preview, atomic sale/invoice commit, invoice lookup, and reset. It has no production auth, concurrent-session behavior, HTTP, socket, storage, upload, or database fallback.
- Added two fictional, independently identified meter rolls for the same fabric. `RMX-M-0701` is `30.000 meter`; `RMX-M-0702` remains `24.750 meter` after the first roll is sold.
- Implemented a source-correct whole-roll sale. Quantity and unit are read-only values derived from the selected roll, price accepts positive two-decimal EGP, exact cash payment is required, the invoice snapshots quantity/unit, and only the selected roll becomes sold/unavailable.
- Added standalone Reset/Back controls and the shared frame bridge. Host Reset creates a new iframe/session and restores the default host guidance; Close tears down the iframe and returns focus to the trigger.
- Enabled the registry entry only after the scenario and focused checks passed. Updated the Ramex case study to describe a fabric retail ERP and added actual sample-data UI evidence.

## Source reinspection and quantity correction

The authoritative audited revision remains `0857f27ae4b9b327fb7f24cd83de038bb0b2ac86`. That object was not present in the later local source checkout used for the Phase 07 cross-check. The available checkout at `C:\Users\7OSS\Desktop\projects\Ramex-Store` was inspected read-only at clean commit `20cedc5d340e61fff6e387b791f6e3e53994b282`; its remote is a fork, so it does not replace the ledger repository or pin. The relevant POS, stock, invoice, sale-schema, and invoice-service paths retain the whole-roll behavior recorded by the pinned audit. The checkout remained clean and no client file, remote, API, database, auth system, or deployment was changed.

The requested `30 m - 7.5 m = 22.5 m` illustration was checked against the actual quantity semantics and rejected as unsupported:

- The roll sale input identifies a roll and price but has no partial sale-quantity field.
- Meter quantity comes from the selected roll's complete `length_m`; kilogram quantity comes from complete `weight_kg`.
- The invoice preserves that derived quantity/unit and sale completion marks the selected roll sold. It does not decrement a remaining length.
- The demo therefore sells the entire fictional `30.000 meter` roll. No kilogram fixture or meter/kilogram conversion was added.

Detailed source-to-local mappings and reuse boundaries are in `apps/demo-ramex/SOURCE.md` and `docs/portfolio/source-audit.md`.

## Reconciled scenario

| Stage | Expected and observed result |
| --- | --- |
| Seed | Both same-fabric rolls are independent and available: `RMX-M-0701` at `30.000 meter`, `RMX-M-0702` at `24.750 meter`. One fictional cashier, customer, and open shift `#707` are visible. |
| Select | Choosing `RMX-M-0701` adds exactly one cart line. Quantity is locked at `30.000 meter`; the second roll is untouched. |
| Price/preview | EGP `185.00` per meter produces `30,000` milliunits × `18,500` piastres / `1,000` = `555,000` piastres, or EGP `5,550.00`. More than two price decimals disables the payment path. |
| Pay | The bounded path accepts exact cash only. Invoice `DEMO-2026-0701` is created once with total/paid EGP `5,550.00`. |
| Invoice snapshot | The stored line remains `RMX-M-0701`, `30.000 meter`, EGP `185.00` per meter, EGP `5,550.00` total. It is read back through the same service boundary. |
| Stock | `RMX-M-0701` is sold/unavailable. `RMX-M-0702` remains available at `24.750 meter`; available aggregate is one roll / `24.750 meter`. |
| Repeat safety | Duplicate roll IDs, an already sold roll, and a second submit while the first is pending are rejected; the pending-submit test produces one invoice. |
| Reset | The invoice is removed and both exact seed roll balances/statuses are restored. Standalone and host resets both returned to this state. |

Quantities are represented as integer milliunits. The adapter accepts positive values up to the source `decimal(10,3)` ceiling (`9,999,999.999`, represented as `9,999,999,999` milliunits) and rejects zero, negative, fractional-milliunit, unsafe/non-integer, and over-limit values. Money is represented as integer piastres.

The final consistency review added two edge-case checks. A later independent sale of `RMX-M-0702` receives invoice `DEMO-2026-0702`, snapshots `24.750 meter` at EGP `4,578.75`, and does not overwrite the first invoice. Reset increments a local generation and cancels pending sale work, so an old submission cannot mutate restored stock or release a new submission's lock. Visible stock reconciliation and host guidance derive from the actual roll/invoice records rather than fixed first-roll text.

## Automated domain, type, build, and static checks

Final repository commands used Node `22.23.2` with npm `11.1.0` where the repository toolchain was required.

| Check | Result |
| --- | --- |
| `npm run test --workspace @portfolio/demo-ramex` | Pass: 10 tests, 0 failures. Covered full-roll arithmetic, selected-only stock mutation, immutable invoice quantity/unit, quantity precision/limits, pending repeat submit, duplicate/already-sold rejection, exact-payment atomicity, sequential independent invoice snapshots, in-flight reset cancellation, and reset. |
| `npm run typecheck --workspace @portfolio/demo-ramex` | Pass. |
| `npm run typecheck` | Pass: Astro checked 15 files with 0 errors, warnings, or hints. |
| `npm run build` | Pass under Node `22.23.2`: six Astro pages, all four demo builds, atomic nested-path staging, and registry/media/static checks. |
| Production dependency audit | `npm audit --omit=dev`: 0 vulnerabilities. |
| Complete dependency audit | `npm audit`: 0 vulnerabilities. The demo uses React `18.3.1`, Vite `8.3.0`, React plugin `6.1.1`, TypeScript `6.0.3`, and self-hosted Cairo package `5.2.7`. |
| Source boundary scan | 0 matches in `apps/demo-ramex/src` and its HTML entry for HTTP/WS clients, XHR, WebSocket/EventSource, Axios, browser storage, service workers, beacons, or analytics. |
| Browser request log | Every observed request was same-origin and `200`: case-study assets, `/demos/ramex/`, its hashed JS/CSS, the local favicon, and eight self-hosted Cairo WOFF2 subsets. |
| Reference checkout integrity | Pass: available cross-check checkout stayed at `20cedc5d340e61fff6e387b791f6e3e53994b282` with empty status. The ledger pin was unavailable locally and is not represented as rechecked. |

## Browser scenario and lifecycle validation

Tool: Chromium `152.0.0.0` on Windows through Playwright CLI. Ahmed explicitly required browser validation in the Phase 07 prompt, so this work overrides D18 for Phase 07 only.

| Check | Measured result |
| --- | --- |
| Complete standalone path | Selected `RMX-M-0701`, observed locked `30.000 meter` and EGP `5,550.00`, completed exact cash payment, inspected the `30.000 meter` invoice snapshot, then verified the selected sold row and untouched `RMX-M-0702` at `24.750 meter`. |
| Invalid precision | Entering `185.123` removed the valid preview and disabled Payment; restoring `185.00` restored EGP `5,550.00`. Quantity itself is deliberately not editable. |
| Standalone lifecycle | Direct `/demos/ramex/` loaded under its nested base with visible local-sample, Reset, and Back controls. Reset removed the invoice and restored both rolls. |
| Lazy host mount | A fresh `/work/ramex/` page had zero iframes and zero Ramex demo resource requests before Try was activated. |
| Embedded reset | Reset destroyed the active iframe/session, created a fresh frame, restored both rolls, disabled the invoice tab, and returned the host guidance to its default text. |
| Close/reopen | Three consecutive host close/reopen cycles passed. Every close removed the iframe and `#demo=ramex`, then returned focus to `Try Ramex demo`; every reopen began at the seed. |
| Keyboard nesting | With Payment open, the first Escape closed the inner payment dialog while leaving the iframe mounted. A second Escape triggered the child close request and removed the host/iframe. |
| RTL/mobile/table scroll | Arabic direction remained RTL. At `390×844`, document `scrollWidth` equaled `clientWidth` (`391`), while the stock table scroller measured `780` px content inside a `346` px viewport, confirming internal horizontal scrolling without page overflow. |
| Console | Final integrated production session: 0 errors and 0 warnings. |

## Network isolation and payload

The final request log contains only same-origin static GET requests. There were no production API, auth, health-poll, WebSocket, upload, payment-provider, analytics, service-worker, external-font, or other third-party requests. Repeated host sessions requested fresh iframe documents but did not create any external traffic.

The built-string scan was inspected rather than reported as zero: it contains Vite's same-origin module-preload `fetch` fallback, React's diagnostic URL and XML/SVG namespace strings. No application network client or client-service endpoint exists in the source; the observed final request set is static-only.

| Payload basis | Bytes |
| --- | ---: |
| Browser-loaded standalone runtime, raw (HTML + favicon + JS + CSS + eight requested WOFF2 subsets) | 310,748 (`303.46 KiB`) |
| Complete emitted `/demos/ramex/` directory, raw (includes unused WOFF and Latin-ext alternatives) | 528,744 (`516.35 KiB`) |
| Application JavaScript | 167,420 raw / 52,933 gzip |
| Application CSS | 26,475 raw / 5,563 gzip |
| HTML + favicon | 1,005 raw / 636 gzip |

The browser-loaded raw basis and the complete emitted directory are both below the `800 KiB` per-demo target. JS plus CSS is 58,496 bytes / `57.13 KiB` gzip. Click-to-ready timing is left to the consolidated Phase 08 performance pass; no Phase 07 timing result is claimed.

## Visual artifacts and provenance

- `apps/portfolio/public/images/ramex/roll-stock-result-1440x900.png` — authoritative case-study image showing the reconciled sold/available stock state; `1440×900`, `67,197` bytes, SHA-256 `A900C404E45D648CC5A302A88A04AC5722716F253B340FA7DCBFD457C5F85AFC`.
- `output/playwright/phase-07/ramex-stock-result-1440x900.png` — browser-evidence duplicate of the authoritative image and hash.
- `output/playwright/phase-07/ramex-invoice-1440x900.png` — actual invoice snapshot; `1440×900`, `70,923` bytes, SHA-256 `20473E4668672F6E2F7CD464DA9037228929CADEB652864384752E2D1B02DD81`.
- `output/playwright/phase-07/ramex-pos-seed-1440x900.png` — original seed POS treatment; `1440×900`, `77,258` bytes, SHA-256 `CEFDDB8E910D7951A54EDAC82A2D6AD8F1886BCF83376A0441B7328C8DB2ECB0`.
- `output/playwright/phase-07/ramex-stock-mobile-390x844.png` — mobile RTL stock/table-scroller evidence; `390×844`, `53,517` bytes, SHA-256 `657640BB309C102DC1D49B442B2F24F36CA75A3C3E487BAFFE49103B31E906E3`.

All visible people, companies, fabric/roll/customer identifiers, prices, invoice details, and dates are fictional local fixtures. No client stock or sales record appears in the captures.

## Limitations and deferred gates

- This is a deliberately bounded fabric retail ERP proof. It does not implement factory shipments, accessories, returns, split/cheque/bank payments, shift opening/closing, production authentication or concurrent sessions, accounting, reports, PDF/printing, labels/barcodes, or backend persistence.
- Only the meter path is included. The audited source also chooses a kilogram roll's complete weight, but no second unit was necessary for this scenario and no conversion rule was invented.
- Browser evidence is Chromium on Windows only. Firefox, WebKit, comprehensive assistive-technology testing, 200% text enlargement, and broader device coverage remain Phase 08; no pass is claimed for them.
- Deployment headers/CSP remain a release-environment gate.
- The audited ledger commit was unavailable in the later local checkout. The implementation relies on the recorded pinned audit plus a transparent clean-current-checkout cross-check; the fork revision does not replace the ledger pin.

## Exit gate

Phase 07 passes its exit gate. The original-UI sample flow performs a genuine source-derived whole-roll sale through one local service boundary, reconciles selected roll, invoice snapshot, and remaining independent stock, rejects invalid/repeated operations, resets exactly, mounts lazily, tears down on close, stays RTL/responsive with internal table scrolling, and makes no client or third-party request. The ready registry entry is enabled and the case-study evidence is an actual sample-data capture.

Next prompt: `docs/portfolio/prompts/08-quality.md`. It was not started.
