# Phase 04 validation — Vertex original-UI demo

Validation date: 12 September 2026

## Delivered scope

- Added a separate React/Vite application at `apps/demo-vertex/`, built for `/demos/vertex/`, containing the source-derived Arabic/RTL BOM list, material review, execution modal, inventory result, and production-history views.
- Replaced Vertex's API/auth/branch/realtime boundary with a typed in-memory adapter and one fictional production operator in one fictional branch/warehouse. The adapter has no request fallback and returns cloned state.
- Implemented source-consistent target-based material consumption, actual-output finished stock and unit costing, stock rejection, completed history, six-/four-/two-decimal boundaries, atomic state commit, and one-operation single-flight/replay protection.
- Added the Phase 03 frame bridge plus standalone sample-data, Reset, and Back controls. Embedded Reset recreates the frame/session; standalone Reset restores inventory, orders, notices, operation replay state, and the recipe view.
- Marked only Vertex available in the central registry, staged its output under the portfolio, and exposed the real Try demo action after the focused and browser checks passed.
- Replaced the feature's diagram-only evidence with an actual local sample-data UI capture and caption; the labeled system diagram remains supplementary context.

## Source reinspection and rule confirmation

Reference checkout: `C:\Users\7OSS\Desktop\projects\ghoneimy\ERP-V2`, clean `main`, commit `7254e34b49acfbe394da3a889abe6e458084cb38`. Its remote remained `https://github.com/lilme5a25/ERP-V2.git`; the checkout was clean after this phase. No command wrote to or published `7ossam26/ERP-V2`.

The reinspection covered `frontend/src/pages/bom/BOMManager.jsx`, `ProductionHistory.jsx`, `InventoryPage.jsx`, `KgQuantityInput.jsx`, the five direct frontend services and Axios boundary, `backend/routes/bom.js`, `backend/lib/productionService.js`, and the relevant Prisma models. Confirmed behavior:

- Manual execution requires `CREATES_PRODUCTION`; viewing uses `PRODUCTION` or `CREATES_PRODUCTION`. The sample persona carries both locally, with no token or login emulation.
- The source lets the operator choose a source and optional destination warehouse; inventory is warehouse keyed and operational access is branch constrained. The bounded sample supplies only warehouse `101` in branch `11` and rejects any other ID.
- BOM output and production output use four decimal places; inventory and material usage use six; money/cost use two. The local adapter stores money as integer piasters and rounds at the same boundaries.
- Material usage is recipe quantity multiplied by `targetOutputQty / bom.outputQuantity`. Finished stock uses actual output; waste is target minus actual; unit cost is total component cost divided by actual output, or zero when actual is zero.
- Stock validation precedes all writes. Material decrements, finished-stock increment, output cost refresh, and order creation happen in one Prisma transaction in the source and one commit boundary in the sample.
- The source endpoint has no idempotency key. Its modal disables submission while pending; the local adapter preserves that guard and adds operation-ID single-flight/replay so repeated activation cannot apply the fixture twice.

The detailed source-to-local file map, exclusions, font hash, and capture provenance are in `docs/portfolio/source-audit.md`.

## Reconciled scenario

The illustrative seed in `demo-spec.md` required no adjustment.

| Value | Start / rule | Expected and observed result |
| --- | --- | --- |
| Material A | `100 kg`, EGP `10/kg`; recipe `2 kg/unit` | Consumed `8 kg`; ending `92 kg`; cost EGP `80` |
| Material B | `50 kg`, EGP `20/kg`; recipe `0.5 kg/unit` | Consumed `2 kg`; ending `48 kg`; cost EGP `40` |
| Finished item | `0 piece`; target and actual `4` | Ending `4 piece`; waste `0` |
| Production cost | A cost + B cost | EGP `120` total; EGP `30` per finished unit |
| History | No initial orders | Exactly one completed order `#9001` with the same quantities and costs |

An excessive target/actual quantity of `60` calculated `120 kg` of A and `30 kg` of B. The UI marked A insufficient and disabled execution. The adapter rejection test confirmed the complete snapshot remained byte-for-byte equivalent to its pre-attempt state.

## Automated domain, type, build, and static checks

Commands ran under Node `22.23.2` and npm `11.1.0` because the workstation default remains below the repository's supported engine floor.

| Check | Result |
| --- | --- |
| `npm run --workspace @portfolio/demo-vertex test` | Pass: 5 domain tests, 0 failures. Covered known arithmetic/reconciliation, simultaneous and completed operation replay, atomic insufficient-stock rejection, warehouse enforcement, complete reset, and reset invalidation of an already pending commit. |
| `npm run typecheck` | Pass: Astro checked 15 files with 0 errors, warnings, or hints; the demo's TypeScript check also passed during its build. |
| `npm run build` | Pass: six Astro pages, one Vertex demo build, atomic staging, registry/static checks, image presence, nested asset paths, and Try action. |
| Production dependency audit | `npm audit --omit=dev`: 0 vulnerabilities. |
| Complete dependency audit | 0 vulnerabilities after using the current compatible stable Vite `8.3.0`, React plugin `6.1.1`, and PostCSS `8.5.28`; versions and Node engines were checked from the npm registry. |
| Source boundary scan | 0 matches in demo source for `fetch`, XHR, WebSocket/EventSource, Axios, `/api`, HTTP/WS hosts, browser storage, service workers, analytics, or beacon calls. |
| Built boundary scan | No `/api`, Axios, XHR, WebSocket, EventSource, production host, storage, service-worker, or analytics string. Vite's module-preload bootstrap includes a generic `fetch(e.href)` that can load only emitted local preload links; observed requests below confirm no external use. |
| Reference checkout integrity | Pass: pinned commit unchanged and `git status --short` empty. |

The first full demo build exposed a Windows process-launch ambiguity in `scripts/build-demos.mjs`. The orchestrator now invokes the current Node executable with npm's resolved CLI path, which made the available-demo build deterministic without changing package-manager or lockfile policy.

## Browser scenario and lifecycle validation

Tool: Chromium `152.0.0.0` on Windows through Playwright CLI. The functional flow and captures used the headed browser session; the final isolated performance rerun used a fresh headless Chrome session. This browser work is authorized by the explicit Phase 04 prompt; the general later-phase deferral in D18 remains otherwise unchanged.

| Check | Measured result |
| --- | --- |
| Complete production path | From the portfolio, opened the original UI, chose the prepared recipe, reviewed materials, entered target/actual `4`, chose warehouse `101`, executed, and reconciled order `#9001`, A `92`, B `48`, finished `4`, EGP `120` total, and EGP `30` unit cost. |
| Repeated submission | Double-activated the enabled submit action; pending UI plus operation replay produced one order and one inventory mutation only. |
| Invalid material path | Quantity `60` displayed required A `120 kg` against `100 kg`, marked it insufficient, disabled submit, and did not change stock/history. The atomic adapter test independently covers forced invocation. |
| Standalone controls | Direct `/demos/vertex/` entry loaded with visible sample-data, Reset, and Back controls. After a successful order, Reset restored A `100`, B `50`, finished `0`, no orders, and recipe capacity `50`. |
| Embedded reset | Host Reset destroyed the completed frame/session and created a fresh ready frame with seed state and no history. |
| Close/reopen | Three consecutive open/close cycles passed. Every close removed the iframe/hash and returned focus to `Try Vertex ERP demo`; every reopen used a fresh frame state. |
| Direct entry | `/work/vertex/#demo=vertex` opened the ready demo directly. Standalone `/demos/vertex/` also loaded correctly under its nested base. |
| Keyboard | Opening focused host Close; Tab reached Reset and then the iframe. Escape first closed the inner production modal while retaining the host; with no inner modal, Escape emitted REQUEST_CLOSE and removed the host. |
| Mobile frame | At `390×844` (layout width reported as `391`), the host occupied the full viewport, persistent Close/Reset stayed visible, Arabic navigation/content reflowed, and parent and child both measured `scrollWidth === clientWidth` (`391`), so there was no horizontal page overflow. |
| Console | Final standalone and integrated reloads: 0 errors, 0 warnings. |

## Network isolation

On a fresh case-study navigation before activation: iframe count `0`, demo resource entries `0`, and external resource entries `0`. After activation, the final-build request set consisted only of same-origin portfolio HTML/CSS/host JS, the local Vertex capture, `/demos/vertex/`, its hashed JS/CSS/Cairo font, and the favicon; every response was `200`. There were no API, auth, socket, upload, analytics, service-worker, production-host, or third-party font requests.

## Bundle and click-to-ready measurement

Final emitted first-usable Vertex files:

| Asset | Raw | Compressed/transfer basis |
| --- | ---: | ---: |
| `index.html` | 896 bytes | 541 bytes gzip |
| Application JavaScript | 174,908 bytes | 53,878 bytes gzip |
| Application CSS | 23,622 bytes | 5,552 bytes gzip |
| Cairo WOFF2 | 13,292 bytes | 13,292 bytes already compressed |
| Total first-usable entry | — | 73,263 bytes / `71.55 KiB` |

JavaScript plus CSS is 59,430 bytes / `58.04 KiB` gzip. The host does not request any of these demo assets before explicit activation.

Click-to-ready was measured on the final merged build at `1440×1000`, with Chromium cache disabled and cleared before each run, `80 ms` latency, `10 Mbps` download/upload, Wi-Fi connection type, and `4×` CPU throttling. Three cold runs were `740 ms`, `461 ms`, and `471 ms`; median `471 ms`, worst `740 ms`. The timer started immediately before clicking the visible Try action and stopped when the host's `data-state` became `ready` after the child READY message.

## Visual artifacts and provenance

- `apps/portfolio/public/images/vertex/production-result-1440x900.png` — actual standalone sample-data production-history UI, `1440×900`, `57,550` bytes, SHA-256 `ED1D14AAE1C953B46EA006D174E5B43A7F43DCF2B6E6876E46EAA86AC15C3287`.
- `output/playwright/phase-04/vertex-production-result-1440x900.png` — evidence copy of the same capture and hash.
- `output/playwright/phase-04/vertex-host-mobile-390x844.png` — integrated mobile host, `390×844`, `39,180` bytes, SHA-256 `5CF4C16EFC92D2A585CFA04D7B2D7E85DE3AF64CB44B61198FCC254D87501013`.

The portfolio image is captioned as original Vertex production-history UI running on fictional local data and names the exact four-unit reconciliation. No client logo, production data, person, upload, or remote media is present.

## Limitations and deferred gates

- Browser evidence in this phase is Chromium on Windows only. Firefox, WebKit, full accessibility tooling, 200% text enlargement, and broader device coverage remain Phase 08; no pass is claimed for them.
- Deployment headers/CSP cannot be validated against the local static preview and remain a release-environment gate.
- Cancellation, production-order editing, BOM administration, multiple branches/warehouses, realtime updates, exports, and authentication are intentionally outside this bounded proof and are not represented as completed features.

## Exit gate

Phase 04 passes its exit gate. The recognizable original Vertex UI performs the documented fictional production scenario, its stock/cost/history records reconcile, insufficient stock and accidental repeat submission cannot corrupt state, standalone and host reset restore the whole sample, the final build is isolated and nested-path safe, the actual UI capture is integrated with provenance, and the source checkout remains untouched.

Next prompt: `docs/portfolio/prompts/05-autozain.md`. It was not started.
