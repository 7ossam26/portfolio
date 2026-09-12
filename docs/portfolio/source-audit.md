# Phase 00 source audit

Audit date: 11 September 2026

This document grounds the approved Studio Dark portfolio and its four proposed demos in the source trees pinned by `content-and-evidence.md`. It is an implementation audit, not evidence that a demo has run. All client repositories were inspected read-only. No setup, migration, seed, deployment, production API, socket, upload, authentication, or database command was run.

## Audit result

- The complete approved design export and the current CV are present under `design-reference/studio-dark/`.
- The four recorded commits are reachable and were still the corresponding remote `main` revisions when checked on 11 September 2026.
- Each selected flow is grounded in real frontend and backend paths below.
- Vertex, AutoZain, and Roya support the bounded scenarios proposed in the planning package.
- Ramex does **not** support a partial-roll sale at its pinned revision. Its source derives invoice quantity from the whole roll and then marks that roll sold. The Phase 07 demo must therefore sell one complete selected roll. Decision D16 records the correction.
- No selected behavior was run in a browser during this phase. Responsive, RTL, and extraction judgments are inspected feasibility only.

## Approved reference and CV

`design-reference/studio-dark/` is a complete, buildless HTML/CSS/JavaScript export rather than a screenshot-only reference:

| File | SHA-256 | Audit note |
| --- | --- | --- |
| `index.html` | `704F8DCDE13E18BB462AC0A14D8F030B533DA631A7D604DEA4B0AEA0A2ED47A4` | Studio Dark page composition and semantic content are present. |
| `styles.css` | `D38342D95CA1B6C0B73A7CCD1E9F3723FA497B08C47102AA2FD0D517628FB429` | Dark tokens, breakpoints, focus treatments, and reduced-motion rules are present. |
| `app.js` | `FCBBE2ADC8E495B21EC80F40404C3DA3FF6AAB1817B886FED6D3A5D1FE6239A9` | Reference interactions are local; the Preview control is presentational, not a client demo. |
| `assets/favicon.svg` | `046DDA39DCD3F3C4691C48AA0ADE75823DF9FF66223EA17595B186E8DC9A2FF9` | Portable local favicon. |
| `assets/Ahmed_Hossam_CV.pdf` | `8997A9D85D6B9B2B03A7CC8011AFB51BF1EE02475FFEA829133351C2EC3074E8` | Current two-page A4 CV; unencrypted, extractable text, no forms or JavaScript. Both pages rendered cleanly in the Phase 00 visual check. |

`design-reference/REFERENCE.md` ties these files to the accepted snapshot `c416bfae87ebfec8ec282961b23c805984cd46fd`. The export uses system font stacks and local files only, so the shell does not need a remote font request to reproduce its baseline. The Phase 01 shell should preserve these tokens and composition, then replace the reference's fake Preview interaction with real lazy demo mounting in later phases.

## New-shell runtime baseline

Use Node.js `22.23.2` for CI and the build environment, with a repository engine range of `>=22.12.0 <23` unless Phase 01 finds a concrete tool incompatibility. Node 22 is an LTS line and is the only supported line that also satisfies Roya's strict `>=22 <23` engine constraint; Node 20 is already EOL. The workstation currently has Node `22.12.0`, which satisfies the minimum, and npm `11.1.0`.

Registry metadata was checked on 11 September 2026 rather than inferred from memory. The compatible stable shell set available for Phase 01 is Astro `7.3.2`, its Vite `^8.0.13` dependency (current Vite `8.3.0`), `@astrojs/check` `0.9.10`, and TypeScript `6.0.3`. TypeScript `7.0.2` is current but is outside `@astrojs/check`'s declared `^5 || ^6` peer range, so it must not be selected merely because it is newest. Astro requires Node `>=22.12.0`. No package was installed and no lockfile was created in Phase 00; Phase 01 must query registry metadata again at installation time and commit the exact resolved lock.

Source references: [Node release policy](https://nodejs.org/en/about/previous-releases), [Node 22.23.2 archive](https://nodejs.org/en/download/archive/v22.23.2), and npm registry metadata queried with `npm view`.

The demos must retain source-specific React boundaries rather than becoming a shared React component package:

| App | Source UI baseline at pinned revision |
| --- | --- |
| Vertex | React `18.3.1`, React Router `7.13.0`, Vite `5.4.21`, Tailwind `4.1.18` from its frontend lock. The README's React 19 wording is not the actual installed source version. |
| AutoZain | React `18.3.1`, React Router `6.30.3`, Vite `6.4.2`, Tailwind `3.4.19`, Socket.IO client `4.8.3`. |
| Roya | React `18.3.1`, React Router `7.15.0`, Vite `5.4.21`, Tailwind `3.4.19`, TanStack Query `5.x`; pnpm `9.15.9`. |
| Ramex | React `18.3.1`, React Router `6.30.3`, Vite `5.4.21`, Tailwind `3.4.19`, TanStack Query `5.100.9`. |

## Cross-demo safety boundary

Each demo gets its own entry, styles, source-derived dependencies, fixture state, local adapter, and reset action. Only the requested demo is mounted; closing it tears down timers and event listeners. The adapter must be the sole service dependency reachable from the extracted UI. It must not have a network fallback. CI will later scan built JavaScript for production hosts, `/api` defaults, socket startup, upload clients, analytics, auth refresh, and service workers.

Synthetic fixtures must be visibly labeled and must not contain client people, phone numbers, national identifiers, vehicle registration or license data, customer records, production financial data, uploaded images, or other source data. Client logos and photography remain excluded until permission is established. Preserve a provenance manifest for every copied file and do not add a license that implies the proprietary source is open source.

## Vertex ERP

### Revision and access

- Ledger repository: `https://github.com/7ossam26/ERP-V2`
- Pinned and inspected revision: `7254e34b49acfbe394da3a889abe6e458084cb38`
- Access evidence: the commit was present in a clean local `main` checkout and matched the ledger remote's current `main` on 11 September 2026. The local checkout remote is another fork, but its checked-out tree is the same commit.
- Notice: no root license file. Root `README.md` states “Private & Proprietary Software. All rights reserved.” Treat imported code as proprietary and retain provenance.

### Selected original-UI flow and real paths

The smallest meaningful flow is the existing Arabic production card/list plus its execution modal and production-history view: inspect a bill of materials, enter actual output, execute against synthetic stock, then inspect the new production order. Creation/editing of BOMs is not needed.

| Concern | Source path and responsibility |
| --- | --- |
| Main selected screen | `frontend/src/pages/bom/BOMManager.jsx` — BOM list/cards and embedded `ExecuteProductionModal`; loads BOMs, warehouses, and inventory, validates form state, submits execution. |
| Result screen | `frontend/src/pages/bom/ProductionHistory.jsx` — production-order list/search and cost/output details. |
| Specialized input | `frontend/src/components/ui/KgQuantityInput.jsx` — quantity entry used by the execution UI. |
| Router/guard | `frontend/src/App.jsx` — `/bom` and `/bom/production-history`; `ProtectedRoute` requires `PRODUCTION` or `CREATES_PRODUCTION`. |
| Global boot | `frontend/src/main.jsx`; `App.jsx` wraps the router with `BranchProvider` and `RealtimeNotificationsProvider`. These providers are not safe demo dependencies. |
| Styles/fonts | `frontend/src/index.css`, `frontend/index.html`, and Tailwind 4. The source HTML/CSS requests Cairo and Material fonts/icons from Google even though local Cairo WOFF2 files exist under `frontend/public/fonts/`. |
| Frontend services | `frontend/src/services/bomService.js`, `inventoryService.js`, `warehouseService.js`, `itemService.js`, `categoryService.js`, `apiClient.js`, and `domainServices.js`. |
| Backend route/rule | `backend/routes/bom.js`, mounted at `/api/bom` in `backend/index.js`; `backend/lib/productionService.js`; relevant precision in `backend/prisma/schema.prisma`. |

Dependency chain in the source:

`BOMManager` → `domainServices` barrel → BOM/item/category/warehouse/inventory services → shared Axios `apiClient` → `/api`; `App` also installs branch and realtime providers. The barrel eagerly imports many domains unrelated to this demo, and `App.jsx` eagerly imports many routes. The extracted UI must instead import a narrow local demo service directly and receive a fixed local branch/persona. It must not import `App.jsx`, `domainServices.js`, `apiClient.js`, `AuthService`, or the realtime provider.

The real service calls required by the selected screens are `GET /bom`, `GET /warehouses?all=true`, `GET /inventory`, fallback `GET /items`, `POST /bom/:id/execute`, and `GET /bom/production-orders`. Source authentication uses a JWT-aware API client, and execution is protected by `CREATES_PRODUCTION`. The demo will display a fictional production-operator persona with that capability; it will not emulate login or issue a token.

### Selected domain behavior

`backend/lib/productionService.js` computes a target multiplier as target quantity divided by BOM output quantity, calculates material quantities to six decimal places, checks available stock, totals consumed cost, derives actual unit cost, and performs inventory decrement, finished-item increment, production-order creation, and cost refresh in one transaction. Prisma stores BOM quantities at decimal scale 4 and production material quantities at scale 6.

The source-grounded deterministic fixture is:

- Material A: `100 kg` at `EGP 10/kg`; material B: `50 kg` at `EGP 20/kg`.
- One output unit consumes `2 kg` of A and `0.5 kg` of B.
- Actual output `4` consumes `8 kg` and `2 kg`, costs `EGP 120`, and has unit cost `EGP 30`.
- Success state: A `92 kg`, B `48 kg`, finished stock `4`, and one new order in history.
- Failure state: an intentionally excessive run returns an insufficient-stock error and leaves all fixture state unchanged. A pending lock prevents double submission; Reset restores the seed.

### Minimal local contract

```ts
interface VertexProductionDemoService {
  listBoms(): Promise<Bom[]>;
  listWarehouses(): Promise<Warehouse[]>;
  listInventory(): Promise<InventoryRow[]>;
  executeProduction(input: ExecuteProductionInput): Promise<ProductionOrder>;
  listProductionOrders(): Promise<ProductionOrder[]>;
  reset(): void;
}
```

The adapter connects where `BOMManager.jsx` and `ProductionHistory.jsx` currently call their domain services. It uses cloned in-memory state and commits only after every validation succeeds.

### Assets, layout, risk, and extraction boundary

- Preserve the original Arabic/RTL component markup, controls, tables/cards, and feedback patterns. The source had responsive Tailwind classes; Phase 04 records the extracted frame's mobile result below and in its validation report.
- Self-host the existing Cairo font subset. Replace remote Material font/icon dependencies with the exact needed local/icon implementation; no Google requests.
- Copy only the production list/card slice, execution modal, history view, `KgQuantityInput`, needed utilities, and required styles. Exclude BOM creation/edit routes, the full application shell, accounting/export/PDF/chart dependencies, auth, realtime, and unrelated service barrels.
- Primary bundle risk: eager `App.jsx` imports and the eager `domainServices.js` barrel. Secondary risk: remote fonts and broad MUI/export dependencies if extraction crosses the selected boundary.

### Phase 04 extraction and asset provenance

The Phase 04 implementation re-inspected the clean read-only checkout at the same pinned commit on 12 September 2026. The checkout remained clean after implementation. The public ledger repository was not cloned into the portfolio and no source remote was changed or pushed.

| Source path | Local path | Extraction/adaptation |
| --- | --- | --- |
| `frontend/src/pages/bom/BOMManager.jsx` | `apps/demo-vertex/src/components/BomManager.tsx`; `apps/demo-vertex/src/components/ExecuteProductionModal.tsx` | Preserved the Arabic BOM card, expanded material review, production modal, field order, stock badges, validation feedback, and production action. Removed create/edit/delete controls, router, toast library, auth calls, and broad service imports. |
| `frontend/src/pages/bom/ProductionHistory.jsx` | `apps/demo-vertex/src/components/ProductionHistory.tsx` | Preserved the searchable order card, completion badge, target/actual/cost details, and consumed-material table; connected it to the local order snapshot. |
| `frontend/src/pages/inventory/InventoryPage.jsx` | `apps/demo-vertex/src/components/InventoryView.tsx` | Retained the recognizable Arabic inventory heading, summary cards, item table, cost valuation, stock status, and branch context, limited to the three synthetic items. |
| `frontend/src/components/ui/KgQuantityInput.jsx` and the quantity controls embedded in `BOMManager.jsx` | `apps/demo-vertex/src/components/ExecuteProductionModal.tsx` | Kept numeric target/actual entry and the source's decimal behavior needed by this bounded recipe; no shared application-form dependency was copied. |
| `frontend/src/index.css`, `frontend/tailwind.config.js`, `frontend/index.html` | `apps/demo-vertex/src/styles.css`; `apps/demo-vertex/tailwind.config.js`; `apps/demo-vertex/index.html` | Preserved Cairo, RTL, the light ERP palette, rounded cards/tables, responsive breakpoints, and touch-sized controls. Remote Google font/icon requests were replaced by the source's local Cairo file and a small inline SVG icon set. |
| `frontend/public/fonts/Cairo-Regular.woff2` | `apps/demo-vertex/src/assets/Cairo-Regular.woff2` | Byte-for-byte copy. SHA-256: `1B36945F5F6A3D1FED3783999B887D0C56CFD66A41A04212A28AA79ABBDFF0E1`. |
| `frontend/src/services/bomService.js`, `inventoryService.js`, `warehouseService.js`, `itemService.js`, `categoryService.js` | `apps/demo-vertex/src/services/vertexDemoService.ts`; `apps/demo-vertex/src/domain/{types,fixtures}.ts` | Replaced all HTTP/auth behavior with a typed, cloned in-memory fixture and atomic commit boundary. There is no client-service fallback. |
| `backend/lib/productionService.js`, `backend/routes/bom.js`, `backend/prisma/schema.prisma` | `apps/demo-vertex/src/services/vertexDemoService.ts`; `apps/demo-vertex/tests/vertexDemoService.test.ts` | Reproduced target-multiplier material use, six-decimal consumption, stock validation, source/destination warehouse handling, material cost, actual-output unit cost, finished-stock increment, output cost refresh, history creation, and all-or-nothing rejection. |
| none — portfolio bridge | `apps/demo-vertex/src/frameBridge.ts`; `apps/demo-vertex/src/App.tsx` | Added the versioned READY/STEP_CHANGED/COMPLETE/ERROR/REQUEST_CLOSE bridge plus standalone sample/reset controls required by the portfolio host. |

The selected source route requires `CREATES_PRODUCTION`; the fictional local persona carries `PRODUCTION` and `CREATES_PRODUCTION` in one fixed branch. The source requests the warehouse list globally but reads branch-scoped inventory; the sample therefore exposes only warehouse `101` in fictional branch `11` and rejects other warehouse IDs in the adapter. Source quantities are BOM `Decimal(10,4)`, inventory/material usage `Decimal(18,6)`, and production output `Decimal(10,4)`; costs are `Decimal(10,2)`. Material consumption follows target output, finished-stock addition and unit cost follow actual output, and waste is target minus actual output.

The illustrative fixture required no arithmetic change: target/actual `4` consumes `8 kg` of material A and `2 kg` of material B; at EGP `10` and `20` per kg the total is EGP `120`, unit cost is EGP `30`, and ending quantities are `92`, `48`, and `4`. Money is stored as integer piasters locally so the two-decimal source boundary is deterministic. The source endpoint has no idempotency key and relies on the pending UI state; the demo retains that disabled state and adds one-operation single-flight/replay semantics so an accidental repeated submit cannot mutate the sample twice.

The dependency closure intentionally excludes `App.jsx`, `domainServices.js`, `apiClient.js`, `AuthService`, branch/realtime providers, sockets, uploads, Google font/icon calls, BOM administration, cancellation/editing, export/PDF/chart modules, and all unrelated routes. The production build contains only the local adapter and frame bridge.

The real sample-data UI capture is `apps/portfolio/public/images/vertex/production-result-1440x900.png`, captured from standalone `/demos/vertex/` in Chromium after the documented four-unit run. It is `1440×900`, `57,550` bytes, SHA-256 `ED1D14AAE1C953B46EA006D174E5B43A7F43DCF2B6E6876E46EAA86AC15C3287`, and is duplicated as browser evidence at `output/playwright/phase-04/vertex-production-result-1440x900.png`. Its project copy and case-study caption identify sample data and the exact reconciled quantities/cost. The existing labeled system diagram remains as supplementary architecture context, not as demo evidence.

## AutoZain

### Revision and access

- Ledger repository: `https://github.com/7ossam26/autozain-system`
- Pinned and inspected revision: `768e1de94464fc5dd0f401ce19b81bfec452e818`
- Access evidence: clean local `main`, matching the ledger remote's current `main` on 11 September 2026.
- Notice: no root license file. `README.md` labels the system “Internal Proprietary Software.” Retain provenance and do not publish source media or client data.

### Selected original-UI flow and real paths

The bounded flow uses the public inventory/employee request UI and the existing staff overlays: a buyer chooses an available employee and submits a fictional request; the local persona switches to staff, accepts it, and completes it with an allowed outcome.

| Concern | Source path and responsibility |
| --- | --- |
| Inventory | `frontend/src/pages/public/Cars.jsx`, `CarDetail.jsx`; `frontend/src/components/shared/CarCard.jsx`, `ImageGallery.jsx`, `FilterSidebar.jsx`, `SearchBar.jsx`. |
| Employee/request entry | `frontend/src/pages/public/Employees.jsx`; `frontend/src/components/shared/ContactRequestModal.jsx`, `RequestConfirmation.jsx`. |
| Staff handling | `frontend/src/components/shared/IncomingRequestOverlay.jsx`, `ActiveSessionPanel.jsx`, mounted by `frontend/src/components/layout/DashboardLayout.jsx`. |
| Router/providers | `frontend/src/App.jsx` routes `/cars`, `/cars/:id`, `/employees`, and `/dashboard`; it always wraps `AuthProvider`, `SocketProvider`, and `ToastProvider`. |
| Auth/socket | `frontend/src/context/AuthContext.jsx`, `SocketContext.jsx`, and `frontend/src/services/socket.js`. Auth probes `/auth/me`; the socket singleton connects to `/` with credentials. |
| HTTP | `frontend/src/services/publicApi.js` (`/api/v1/public` reads and `/api/v1` public writes) and `frontend/src/services/api.js` (authenticated client with refresh/redirect behavior). |
| Styles/fonts | `frontend/src/styles/index.css` and `frontend/index.html`; source requests IBM Plex Sans Arabic from Google and does not carry local font files. |
| Backend flow | `backend/src/routes/public.js`, `routes/contactRequests.js`, `controllers/publicController.js`, `controllers/contactRequestsController.js`, `services/contactRequestService.js`, `repositories/contactRequestRepository.js`, and `socket/index.js`. |

Source request state is `pending → accepted` or `rejected`; an accepted request can become `completed` with `sold`, `interested`, `no_answer`, or `cancelled`. Acceptance marks the selected employee busy. Completion returns the employee to available when no other active request remains. A timeout worker can expire pending requests, and socket events update public availability and buyer/staff state.

The public routes expose cars, car details, and employees; contact request creation is public. Responding, completion, and “my requests” are authenticated and employee/admin constrained. The demo will use explicit local Buyer and Staff persona controls instead of `AuthProvider`. Exact AutoZain contribution wording remains omitted because it is unconfirmed; this does not block the flow.

### Minimal local contract and event surface

```ts
interface AutoZainDemoService {
  listCars(filters?: CarFilters): Promise<CarSummary[]>;
  getCar(id: string): Promise<CarDetail>;
  listEmployees(): Promise<Employee[]>;
  createRequest(input: CreateContactRequestInput): Promise<ContactRequest>;
  listMyRequests(persona: DemoPersona): Promise<ContactRequest[]>;
  respond(id: string, action: "accept" | "reject"): Promise<ContactRequest>;
  complete(id: string, outcome: CompletionOutcome): Promise<ContactRequest>;
  advanceClock(ms: number): void;
  subscribe(listener: (event: DemoEvent) => void): () => void;
  reset(): void;
}
```

The in-memory event bus may reproduce only the events the selected UI consumes: `employee:status_changed`, `contact_request:new`, `contact_request:accepted`, `contact_request:rejected`, `contact_request:timeout`, and `session:ended`. Time advancement is deterministic; it must not use the source's repeating background jobs.

### Assets, layout, risk, and extraction boundary

- Use fictional vehicles, employees, buyer details, phone numbers, plates, licenses, and identifiers. Use locally generated or clearly reusable synthetic car images; do not copy uploaded client photos.
- The source contains responsive RTL Tailwind layouts and `<html lang="ar" dir="rtl">`, but mobile behavior has not run. Self-host only the needed Arabic font files or use a documented source-consistent local fallback.
- Preserve the selected cards, filters, request modal/confirmation, incoming overlay, and active-session panel. Provide a narrow demo shell and local event provider.
- Exclude the full `App`, auth/refresh client, socket singleton, push registration, audio alerts, queue administration, uploads, dashboards, exports, and production contact actions. Replace the staff panel's `tel:` action with a disabled/demo-safe display so a visitor cannot call a real number.
- Primary bundle/runtime risks: providers mounted for every route, Socket.IO startup, auth probing/refresh, push/audio behavior, external images/fonts, and sensitive car fields. XLSX/PapaParse and unrelated admin features are outside the extraction boundary.

### Phase 05 extraction and asset provenance

The Phase 05 implementation re-inspected the clean read-only checkout at the same pinned commit on 12 September 2026. The checkout remained on `main` at `768e1de94464fc5dd0f401ce19b81bfec452e818` with an empty status after implementation; no client repository file, remote, service, or deployment was changed.

| Source path | Local path | Extraction/adaptation |
| --- | --- | --- |
| `frontend/src/pages/public/Cars.jsx`; `frontend/src/components/shared/{CarCard,FilterSidebar,SearchBar}.jsx` | `apps/demo-autozain/src/components/{MarketplaceView,CarCard}.tsx` | Preserved the Arabic marketplace heading, search, transmission filter, vehicle cards, price/spec presentation, favorite affordance, and responsive filter drawer. Inventory is three explicitly fictional local vehicles. |
| `frontend/src/pages/public/CarDetail.jsx`; `frontend/src/components/shared/ImageGallery.jsx` | `apps/demo-autozain/src/components/CarDetail.tsx` | Preserved the vehicle detail hierarchy, image/specification panel, additional-information card, favorite affordance, and contact action. The single-image gallery is intentionally bounded to generated local media. |
| `frontend/src/pages/public/Employees.jsx`; `frontend/src/components/shared/{ContactRequestModal,RequestConfirmation}.jsx` | `apps/demo-autozain/src/components/{MarketplaceView,ContactRequestModal,RequestConfirmation}.tsx` | Preserved available/busy staff cards, the buyer-data modal, request confirmation/countdown, and status feedback. Buyer/staff names, phone number, IDs, and records are synthetic; the form commits only to memory. |
| `frontend/src/components/shared/{IncomingRequestOverlay,ActiveSessionPanel}.jsx`; `frontend/src/components/layout/DashboardLayout.jsx` | `apps/demo-autozain/src/components/{IncomingRequestOverlay,ActiveSessionPanel,StaffDashboard}.tsx` | Preserved the Arabic staff shell, incoming-request overlay, accept/reject actions, active-session panel, outcome selector, request history, and status summaries. The source phone action is rendered as a non-interactive demo-safe value. |
| `frontend/src/styles/index.css`; `frontend/tailwind.config.js`; `frontend/index.html` | `apps/demo-autozain/src/styles.css`; `apps/demo-autozain/index.html` | Flattened only the selected source Tailwind/class treatment into local CSS while retaining RTL, IBM Plex Sans Arabic, the blue/teal marketplace palette, cards, overlays, desktop staff sidebar, and mobile reflow. No Tailwind runtime or remote font request is present. |
| `frontend/src/services/publicApi.js`; `frontend/src/context/{AuthContext,SocketContext}.jsx`; `frontend/src/services/socket.js` | `apps/demo-autozain/src/services/autozainDemoService.ts`; `apps/demo-autozain/src/domain/{types,fixtures}.ts` | Replaced HTTP, auth probing/refresh, and Socket.IO with a typed cloned in-memory snapshot and a six-event local subscriber surface. There is no network fallback, token, browser storage, or simulated login. |
| `backend/src/{controllers,services,repositories,routes}` request files and `backend/src/socket/index.js` | `apps/demo-autozain/src/services/autozainDemoService.ts`; `apps/demo-autozain/tests/autozainDemoService.test.ts` | Reproduced `pending → accepted/rejected/expired`, accepted-only completion, the four source outcomes, staff busy/available changes, deterministic expiry, and timer/listener cleanup. Invalid and repeated transitions fail before mutation. |
| none — portfolio demo infrastructure | `apps/demo-autozain/src/App.tsx`; `apps/demo-autozain/src/frameBridge.ts`; `packages/demo-contract/demo-registry.json` | Added the explicit Buyer/Staff persona switch, visible simulation/sample label, shared READY/STEP_CHANGED/COMPLETE/REQUEST_CLOSE bridge, and standalone Reset/Back controls. Embedded Reset is owned by the host and replaces the whole frame/session. |

The selected source uses React `18.3.1`; the extracted app retains that version. It uses the already locked workspace Vite `8.3.0`, React plugin `6.1.1`, and TypeScript `6.0.3` instead of carrying the source's older build toolchain into a new lock boundary. React Router, Axios, Socket.IO, Tailwind, toast, spreadsheet, and unrelated admin dependencies are not imported because the bounded state/view routing needs none of them.

The adapter emits only `employee:status_changed`, `contact_request:new`, `contact_request:accepted`, `contact_request:rejected`, `contact_request:timeout`, and `session:ended`. Request `demo-request-001` starts pending, acceptance clears its timeout and marks sample staff `demo-staff-11` busy, and completion records one of `sold`, `interested`, `no_answer`, or `cancelled`. Staff returns to available only when no other accepted request remains. Reject and expiry do not create an active session. Reset cancels every pending handle, restores the fixed 12 September 2026 clock/sequence and seed, and keeps no state in storage.

The dependency closure excludes the full `App.jsx`, React Router, `AuthProvider`, auth refresh/redirect behavior, `SocketProvider`, Socket.IO singleton, push notification registration, audio alerts, queue and administration screens, dashboards beyond the selected staff slice, Axios clients, uploads, external images/fonts, exports, and live phone/message actions. The production boundary scan found none of the corresponding client/API/socket/storage strings.

#### Generated vehicle imagery

Three unbranded fictional images were generated with the built-in image generation tool in default mode, then converted locally to `1024×768` WebP assets. The prompts requested: (1) a dark graphite compact crossover in a clean indoor showroom; (2) a pearl-white midsize sedan at a neutral outdoor dealership; and (3) a deep-blue hatchback in a contemporary urban showroom. Every prompt specified a realistic editorial vehicle photograph, `4:3` composition, no people, no logo/brand badge, no readable text, and no license plate. These assets do not depict source inventory or a client location.

| Local asset | Bytes | SHA-256 |
| --- | ---: | --- |
| `apps/demo-autozain/public/vehicles/graphite-crossover.webp` | 76,580 | `41545204ACA91E9FC1102192C77A6D1D7A10B0F771C7202418D2B3E7B68B36F3` |
| `apps/demo-autozain/public/vehicles/pearl-sedan.webp` | 53,862 | `5D51ACCF04D487FC077526A5792741AE08F957F031BCA7642D1637096B5AFFE7` |
| `apps/demo-autozain/public/vehicles/blue-hatchback.webp` | 64,224 | `C294CBEBBCD5499FF9E6B4ED8A3161749D7B39EC9718527C9B310016453E496B` |

The source requested IBM Plex Sans Arabic from Google Fonts. Phase 05 reuses already self-hosted Arabic and Latin WOFF2 subsets from the local `hobz` workspace rather than making a remote request. The eight `400/500/600/700` subset files total `257,368` bytes. SHA-256 values:

| Subset | SHA-256 |
| --- | --- |
| Arabic 400 | `6010E7FD0DCE5D527583951750728CBE3C895EFBD16AA0F809AB8C824878C9D8` |
| Arabic 500 | `90AEF64FEA9794F232332E907D45810AB268D1A11721340025EBA2A2CDB36D5C` |
| Arabic 600 | `16734A5ADB27B0F363E566CBBEACEC480DA0DC0BAA19C8F0053251C2E2BC0EAC` |
| Arabic 700 | `04C730B4292731CCEDADD5BD80756124364AE4923895145D9CD7B1F28E443DE1` |
| Latin 400 | `9ED8DCB02E6C7246DE4C120295FAFA39A7BB73085F4951A4524A07DC911069F2` |
| Latin 500 | `BE6A3B2E37F3AD67AA822A55CE356D28C416331C97530A1EC076C2118240CA2D` |
| Latin 600 | `63F4757271E403F7BAEC0862F284FFAA4560EA6096BA9FE8BC6E585CA656E724` |
| Latin 700 | `AE2D59F91ECF9F7ED279E4A1FC1A9DA8170FB0CE5B9152917A8F759033F5777C` |

The case-study evidence is `apps/portfolio/public/images/autozain/contact-outcome-1440x900.png`, captured from standalone `/demos/autozain/` in Chromium after the fictional request was accepted and completed as `interested`. It is `1440×900`, `44,220` bytes, SHA-256 `869A198F18CCC3114B1FE24773B53F0AD9D66F0E4552BB02D90BFB6CA27869FF`, and is duplicated at `output/playwright/phase-05/autozain-staff-outcome-1440x900.png`. Its caption identifies original AutoZain staff UI adapted to local fictional data; the exact AutoZain role line remains omitted.

## Roya — Film & TV production finance

### Revision and access

- Ledger repository: `https://github.com/7ossam26/Film-production-fin-system`
- Pinned and inspected revision: `aaf1112b2deb32dbf6c3540e7eb1748abc87bbae`
- Access evidence: the older local working copy did not contain the ledger revision, so a separate temporary read-only checkout was created at the pinned commit. It matched the ledger remote's current `main` on 11 September 2026 and remained clean.
- Notice: no root `LICENSE`, `NOTICE`, or `COPYING` file was found. Treat copied code as proprietary/unlicensed for public redistribution unless rights are clarified; preserve file-level provenance.

### Selected original-UI flow and real paths

The meaningful read-only scenario is the existing project settings control and shooting-weeks preview modal: inspect a small budget slice, change project weeks from 4 to 6, see only week-dependent lines change, then cancel without persisting.

| Concern | Source path and responsibility |
| --- | --- |
| Selected screen/modal | `apps/web/src/features/projects/ProjectDetail.tsx` — `SettingsTab` and embedded `ShootingWeeksModal`, including current/new weeks, before/after/delta, affected lines, cap warning, reason, cancel, and confirm controls. |
| Budget UI reference | `apps/web/src/features/projects/BudgetTab.tsx` and its line/entity views. The full editable tab is deliberately too broad for V1; extract a read-only source-derived slice. |
| Project API | `apps/web/src/lib/projects-api.ts` — `POST /projects/:id/shooting-weeks/preview`; project patch is not needed in this demo. |
| Shared rules/types | `packages/shared/src/projects.ts` — line strategy schemas and `computeLineTotal`; project/preview response types. |
| Backend behavior | `apps/api/src/projects/handlers.ts` — read-only preview calculation; route registered in `apps/api/src/routes.ts` with auth and `project.update`. |
| Global boot/auth | `apps/web/src/main.tsx`, auth bootstrap/store, query client, and router. Bootstrap refreshes credentials and schedules token refresh; exclude it. |
| Styles/i18n | Web global CSS and i18n configuration. The source supports direction changes, but eagerly bundles locale namespaces. `apps/web/index.html` requests Cairo, Libre Bodoni, Noto Arabic, and Public Sans remotely. |

`ProjectDetail.tsx` eagerly imports many tabs and reports. The modal currently depends on shared cards/buttons/inputs/number input, `formatPiastres`, API error translation, auth store, preview API, project mutation hook, i18next, and shared types. The extracted modal should receive the local adapter and a tiny English message subset directly. It must not import the full `ProjectDetail`, auth store, query bootstrap, or project patch hook.

### Selected domain behavior

The backend preview is read-only: it performs no project write and no audit write. It considers only `weekly_x_weeks` and `units_x_rate_x_duration` lines whose inputs opt into project weeks. Every candidate is returned for display, while only approved candidates contribute to the budget-total delta. New totals are proportional to `current total / old weeks × new weeks`, rounded in integer piastres. It reports `exceeds=true` only when a positive cap is exceeded.

Use an integer-piastre fixture with a 4-week project and a 6-week preview. A weekly crew rate of EGP 5,000 has a current total of EGP 20,000 and previews at EGP 30,000. A fixed lump-sum line stays EGP 20,000 and is excluded from affected lines. With both approved, budget total changes from EGP 40,000 to EGP 50,000, delta EGP 10,000. Cancel closes the modal and preserves 4 weeks and all original totals.

### Minimal local contract

```ts
interface RoyaWeeksPreviewDemoService {
  getProject(): Promise<ProjectSummary>;
  getBudgetSnapshot(): Promise<ReadonlyBudgetSnapshot>;
  previewShootingWeeks(newWeeks: number): Promise<ShootingWeeksPreview>;
  reset(): void;
}
```

The demo intentionally omits `patchProject`: the promised behavior is inspect, preview, and cancel. The visible fictional persona can carry a local `project.update` capability label so the source UI state is coherent, but there is no token or account.

### Assets, layout, risk, and extraction boundary

- The scenario needs no client imagery. Use fictional project, participant, and line names; all currency values are synthetic.
- Preserve the source modal, project-settings surface, read-only budget line presentation, money formatting, and RTL/LTR direction-aware styles. Browser/mobile/RTL behavior has not run.
- Self-host only the needed typefaces or use documented local fallbacks. Bundle only the selected `common`, `projects`, and error messages rather than all locale namespaces.
- Exclude the full editable budget, reports, rich editor, charts, participants, payments, schedule, episodes, auth refresh, mutation/save path, and unrelated project tabs.
- Primary bundle risks: eager `ProjectDetail` tab/report imports, broad i18n namespace loading, Tiptap/report/chart dependencies, auth refresh, and remote font requests.

## Ramex Store — fabric ERP

### Revision and access

- Ledger repository: `https://github.com/7ossam26/Ramex-Store`
- Pinned and inspected revision: `0857f27ae4b9b327fb7f24cd83de038bb0b2ac86`
- Access evidence: the existing local Ramex checkout was a different fork/revision and did not contain the ledger commit, so a separate temporary read-only checkout was created at the pinned commit. It matched the ledger remote's current `main` on 11 September 2026 and remained clean.
- Notice: no root `LICENSE`, `NOTICE`, or `COPYING` file was found. Treat copied code as proprietary/unlicensed for public redistribution unless rights are clarified and retain provenance.

### Source correction: the sale unit is the whole roll

The existing `demo-spec.md` describes entering `7.5 m` against a `30 m` roll and leaving `22.5 m`. That behavior does not exist at the pinned revision:

- `backend/src/domain/sales/sales.schemas.ts` accepts a roll ID and pricing/discount fields but no sale-quantity field.
- `backend/src/domain/sales/lineQuantity.ts` resolves invoice quantity from the selected roll's complete `length_m` for meter fabrics or complete `weight_kg` for kilogram fabrics.
- `backend/src/domain/sales/invoices.service.ts` snapshots that full quantity and unit into the invoice line, then changes the selected roll's status from `in_stock`/`reserved` to `sold`; it does not subtract a partial length or weight.
- `backend/src/db/migrations/096_invoice_line_sold_quantity_snapshot.ts` establishes the immutable sold-quantity snapshot and legacy fallback.

The Phase 07 fixture must therefore select one fictional 30 m meter roll, sell the entire roll, show an invoice line of `30.000 meter`, and show that roll as sold/unavailable while a second roll remains unchanged. Re-adding the same roll or selling an already sold roll is the invalid path. A true partial-roll flow would require a product/backend change outside this portfolio.

### Selected original-UI flow and real paths

| Concern | Source path and responsibility |
| --- | --- |
| POS UI | `frontend/src/pages/pos/POS.tsx` — a large page containing the original `ProductsGrid`, `CartPanel`, payment/submit state, roll search, current-shift checks, and navigation to draft invoice. |
| Invoice view | `frontend/src/pages/invoices/DraftInvoicePrintPage.tsx` and `frontend/src/components/invoices/DraftInvoiceDocument.tsx` — source invoice mapping and printable Arabic document. |
| Quantity mapping | `frontend/src/lib/invoice-line-quantity.ts` and backend `backend/src/domain/sales/lineQuantity.ts`. |
| Frontend service | `frontend/src/lib/sales-api.ts`, used by `POS.tsx` for roll search, sale preview/create, and invoice retrieval; the source calls `/rolls`, `/sales`, and invoice endpoints. |
| Backend sale | `backend/src/domain/sales/sales.routes.ts`, `sales.schemas.ts`, `invoices.service.ts`, and `lineQuantity.ts`; roll listing/visibility rules in `backend/src/domain/items/items.routes.ts`. |
| Router/providers | Frontend `App`/main route `/pos` and invoice route. Root providers include browser router, TanStack Query, connectivity, auth, and permissions. Connectivity polls `/api/health` and can replace the UI with an offline gate. |
| Styles/fonts | Tailwind/global styles and package-local `@fontsource` Cairo assets. No remote font is required for the selected Arabic UI. |

The backend requires an authenticated, permitted user and an open shift. Sale creation locks selected rolls, rejects duplicate IDs and non-sellable/hidden/wrong-warehouse rolls, inserts the invoice and immutable line snapshot, and marks selected rolls sold in a transaction. The demo will provide a fixed local cashier persona, one fixed open sample shift, and one sample customer; it will not emulate accounts or shifts.

### Minimal local contract

```ts
interface RamexRollSaleDemoService {
  getCurrentShift(): Promise<DemoShift>;
  listRolls(query?: RollQuery): Promise<Roll[]>;
  listCustomers(): Promise<DemoCustomer[]>;
  previewSale(input: WholeRollSaleInput): Promise<SalePreview>;
  createSale(input: WholeRollSaleInput): Promise<Invoice>;
  getInvoice(id: string): Promise<Invoice>;
  reset(): void;
}
```

The V1 adapter is cash-only and whole-roll-only. It connects at the calls currently made by `POS.tsx` and `DraftInvoicePrintPage.tsx`. It must clone state, reject duplicates/already-sold rolls, and atomically commit invoice plus roll status. Reset restores both rolls and removes the synthetic invoice.

### Assets, layout, risk, and extraction boundary

- Use fictional fabrics, roll IDs/barcodes, customer, cashier, prices, and invoice numbers. No client stock or sales data. The flow does not require product photography.
- Preserve the original Arabic/RTL product grid, selected cart/payment slice, success transition, and draft invoice document. Responsive Tailwind classes and self-hosted Cairo are present, but mobile behavior has not run.
- Extract the nested selected sections from the POS monolith into source-derived demo components while retaining their recognizable markup and styling. Do not replace them with a new dashboard.
- Exclude the full app shell, connectivity polling/offline gate, auth/permissions, shift-opening workflow, accessories, returns, split/cheque/bank payment, labels/barcodes, PDF/export, printing/audit-reprint mutations, reports, and invoice-return actions.
- Primary bundle risks: the approximately 3,200-line POS module, eager cross-feature imports, Framer Motion, barcode/PDF/chart libraries, query providers, and always-on health polling.

## Explicit unknowns and deferred decisions

These items are not audit failures and are not represented as verified facts:

- AutoZain's exact contribution/role remains unconfirmed and must stay omitted from public copy.
- The public production domain, host, deployment adapter, and access settings remain Phase 09 decisions.
- Permission to publish specific client logos, uploaded imagery, or other branded media is unresolved. V1 uses synthetic/local assets.
- Roya and Ramex have no source-level license/notice file; Vertex and AutoZain explicitly describe themselves as proprietary. The planned narrow code reuse has source provenance but does not confer a public open-source license.
- Roya and Ramex browser behavior, keyboard traversal, mobile breakpoints, RTL/LTR layout, bundle budgets, network silence, and teardown have not been exercised. Vertex and AutoZain now have their phase-specific Chromium evidence; broader accessibility and cross-browser gates remain Phase 08.
- No source at the pinned Ramex revision supports a partial-roll sale. A later client-source change could be audited separately, but it must not be assumed.

## Phase 00 extraction verdict

| App | Grounded flow | Feasibility | Binding condition |
| --- | --- | --- | --- |
| Vertex | BOM production execution and history | Pass for implementation | Narrow direct adapter imports; preserve transactional inventory rules. |
| AutoZain | Buyer request → staff accept → complete | Pass for implementation | Local persona/event bus only; no auth, socket, push, phone action, or real media. |
| Roya | Budget impact preview → cancel | Pass for implementation | Read-only preview only; no project patch/save in V1. |
| Ramex | Whole-roll POS sale → draft invoice → sold stock state | Pass with corrected scenario | Full-roll quantity from source; partial decrement is forbidden. |

Phase 00 is complete. The next implementation prompt is `docs/portfolio/prompts/01-foundation.md`; it has not been run.
