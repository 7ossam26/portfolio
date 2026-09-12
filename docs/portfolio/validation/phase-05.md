# Phase 05 validation — AutoZain original-UI demo

Validation date: 12 September 2026

## Delivered scope

- Added a separate React/Vite application at `apps/demo-autozain/`, built for `/demos/autozain/`, containing the source-derived Arabic/RTL marketplace, vehicle detail, employee request, buyer confirmation, incoming staff overlay, active session, and staff history views.
- Replaced the source HTTP/auth/Socket.IO/push boundary with a typed in-memory adapter and explicit Buyer/Staff demo personas. The adapter has no network fallback, stores no browser data, and emits only the six selected local events.
- Implemented source-consistent `pending → accepted/rejected/expired` transitions, accepted-only completion with `sold|interested|no_answer|cancelled`, employee busy/available reconciliation, a 30-second local timeout, an immediate deterministic timeout control, and complete timer/listener cleanup.
- Added three fictional vehicles, two fictional employees, clearly fictional buyer contact data, and three locally served unbranded generated vehicle images. No client upload, plate, customer identity, credential, or production configuration was copied.
- Added the shared frame bridge plus standalone sample-data, Reset, and Back controls. Embedded Reset recreates the frame/session; close tears it down and restores focus.
- Enabled AutoZain in the central registry only after the focused checks passed, staged it beside Vertex, and replaced the case-study's primary evidence with the real local staff-outcome UI capture. The exact AutoZain role remains omitted.

## Source reinspection and rule confirmation

Reference checkout: `C:\Users\7OSS\Desktop\projects\autozain-system`, clean `main`, commit `768e1de94464fc5dd0f401ce19b81bfec452e818`, remote `https://github.com/7ossam26/autozain-system.git`. Its commit and empty status were rechecked after implementation. No command wrote to or published the source repository.

The reinspection covered the public cars/detail/employees pages, car/filter/search/gallery/request components, incoming-request and active-session staff components, public/dashboard layouts, auth and socket contexts, Socket.IO singleton, public/API clients, relevant request routes/controllers/service/repository, socket handlers, and schema. Confirmed behavior:

- Public users can list cars/employees and create a contact request; staff response, completion, and request history are authenticated/role constrained in the source. The demo replaces credentials with visible local personas rather than emulating login.
- A request can leave `pending` only as `accepted`, `rejected`, or expired. Completion is valid only from `accepted` and requires one of `sold`, `interested`, `no_answer`, or `cancelled`.
- Acceptance marks the selected employee busy. Completion restores availability only when the employee has no other accepted request. Reject and timeout do not create an active staff session.
- The source has Socket.IO updates and a repeating timeout worker. The sample reproduces only the needed event names through an in-memory subscriber set and per-request timeout; it never creates a socket or background poller.
- The source's `tel:` action, auth probe/refresh, API clients, socket bootstrap, push/audio behavior, upload/media paths, full administration app, queue, exports, and unrelated dashboards are excluded.

The detailed source-to-local file map, dependency boundary, generated-image prompts, asset hashes, and capture provenance are in `docs/portfolio/source-audit.md`.

## Reconciled scenario

| Stage | Expected and observed result |
| --- | --- |
| Seed | Three fictional vehicles; sample employee Salma available, sample employee Omar busy; no requests/events. |
| Buyer request | Vehicle `demo-car-az-101` and available staff `demo-staff-11` create exactly `demo-request-001` in `pending`; buyer and staff views show the same vehicle, buyer, employee, and status. |
| Accept | Pending timer is cleared; request becomes `accepted`; Salma becomes busy; `employee:status_changed` and `contact_request:accepted` are recorded. |
| Complete | Outcome `interested` is stored; request becomes `completed`; Salma returns to available; `session:ended` closes the active session. Buyer and staff surfaces show the same completed outcome. |
| Reject | A separate reset scenario changes pending to `rejected`, leaves Salma available, and never creates an active session. |
| Timeout | Immediate clock advancement changes pending to `expired`, emits `contact_request:timeout`, leaves Salma available, and blocks a late accept. The normal 30-second path was also observed. |
| Reset/teardown | Fixture clock, request sequence, inventory, staff state, requests, events, timers, and listeners return to the seed or are disposed with the frame. |

## Automated domain, type, build, and static checks

Commands ran under the repository-pinned Node `22.23.2` and npm `11.1.0` where package scripts were involved.

| Check | Result |
| --- | --- |
| `npm run test --workspace @portfolio/demo-autozain` | Pass: 6 domain tests, 0 failures. Covered buyer/staff consistency, accept/complete and availability, forced invalid/repeated transitions without mutation, reject, deterministic timeout and late-response prevention, reset/dispose cleanup, and unavailable/unknown staff. |
| `npm run typecheck --workspace @portfolio/demo-autozain` | Pass. |
| `npm run typecheck` | Pass: Astro checked 15 files with 0 errors, warnings, or hints. |
| `npm run build` | Pass: six Astro pages, Vertex and AutoZain demo builds, atomic staging, registry/static checks, image presence, nested asset paths, and both Try actions. |
| Production dependency audit | `npm audit --omit=dev`: 0 vulnerabilities. |
| Complete dependency audit | `npm audit`: 0 vulnerabilities. The demo reuses compatible versions already locked in the workspace: React `18.3.1`, Vite `8.3.0`, React plugin `6.1.1`, and TypeScript `6.0.3`. |
| Source boundary scan | 0 matches outside tests/provenance for `fetch`, XHR, WebSocket/EventSource, Axios, `/api`, HTTP/WS hosts, browser storage, service workers, analytics, or beacon calls. |
| Built boundary scan | 0 matches for Axios, XHR, WebSocket, EventSource, `/api`, WS hosts, browser storage, service workers, analytics, source repository names, or localhost. |
| Reference checkout integrity | Pass: pinned commit unchanged and `git status --short` empty. |

## Browser scenario and lifecycle validation

Tool: Chromium `152.0.0.0` on Windows through Playwright CLI. Functional and visual checks used headed Chrome; isolated performance measurement used a fresh headless Chrome session. This browser work follows Ahmed's explicit Phase 05 instruction and overrides D18 only for this requested phase.

| Check | Measured result |
| --- | --- |
| Complete production path | From the AutoZain case study, opened the demo, selected the fictional graphite crossover, selected available sample staff, submitted the fictional buyer record, switched to Staff, accepted, verified busy status, completed as `interested`, switched back, and verified the same completed outcome plus restored availability. |
| Invalid transition prevention | After acceptance the incoming accept/reject overlay disappeared; after completion no completion control remained. Focused adapter tests forced complete-before-accept, repeated accept, completion-after-reject, and late accept-after-timeout and confirmed no mutation. |
| Repeated request activation | Double-clicked the buyer submit action. The modal's pending guard produced only `demo-request-001`; no `#002` request was created. |
| Reject path | On a fresh mobile scenario, staff rejected the pending request. Staff history showed `rejected`, pending/active counts stayed zero, and employee availability stayed intact. |
| Timeout path | The visible immediate-timeout control produced `expired` and left the employee available. The focused adapter test independently advanced the deterministic clock, confirmed the timeout event, and rejected a late staff response. |
| Standalone controls | Direct `/demos/autozain/` loaded under its nested base with visible sample-data, Reset, and Back controls. Reset returned to the three-vehicle seed. |
| Embedded reset/timer cleanup | Reset while a request was pending destroyed the old frame and created a new ready frame with a new session ID. Waiting 32 seconds produced no stale timeout or request in the replacement frame. |
| Close/reopen | Three consecutive open/close cycles passed. Each close removed the iframe and demo hash and returned focus to `Try AutoZain demo`; each reopen started from a fresh seed. |
| Direct entry | `/work/autozain/#demo=autozain` opened directly with host state `ready` and exactly one correctly titled frame. |
| Mobile/RTL | At `390×844` (reported inner layout width `391`), the host remained usable, the marketplace reflowed to its mobile filter control, buyer request modal and staff reject flow were operable, and the child reported `lang=ar`, `dir=rtl`, and zero document/body horizontal overflow. |
| Existing demo regression | `/work/vertex/` still exposed `Try Vertex ERP demo`; opening it reached host state `ready` with exactly one `Vertex ERP sample-data production demo` iframe and the prepared Arabic recipe UI. |
| Console | Final standalone and integrated sessions: 0 errors, 0 warnings. |

## Network isolation

Before activation on a fresh case-study navigation: iframe count `0`, AutoZain demo resource entries `0`, and only the case-study HTML, portfolio CSS/host JS, local evidence capture, and favicon were requested. After activation and across the exercised flow, the request set contained only same-origin portfolio files, `/demos/autozain/`, its hashed JS/CSS, eight self-hosted font subsets as needed, three local WebP vehicles, and the favicon; every observed response was `200`.

There were no API, auth, Socket.IO/WebSocket, phone, message, upload, notification, analytics, service-worker, production-host, Google Fonts, or other third-party requests. The source and built-string scans independently support the observed browser request log.

## Bundle and click-to-ready measurement

Final emitted entry and complete local-media set:

| Asset group | Raw | Compressed/transfer basis |
| --- | ---: | ---: |
| `index.html` | 656 bytes | 405 bytes gzip |
| Application JavaScript | 172,759 bytes | 54,423 bytes gzip |
| Application CSS | 20,703 bytes | 4,642 bytes gzip |
| Eight IBM Plex Sans Arabic WOFF2 subsets | 257,368 bytes | 257,368 bytes already compressed |
| Three vehicle WebP images | 194,666 bytes | 194,666 bytes already compressed |
| Favicon | 281 bytes | 197 bytes gzip |
| Complete emitted demo set | — | 511,701 bytes / `499.71 KiB` |

JavaScript plus CSS is 59,065 bytes / `57.68 KiB` gzip. The initial marketplace requested six of the eight font subsets; its complete code/font/image basis is 446,317 bytes / `435.86 KiB`. The two 500-weight subsets load only when later request/staff content needs them. The host requests none of these demo files before explicit activation.

Click-to-ready was measured on the final merged build at `1440×1000`, with Chromium cache disabled and cleared before each run, `80 ms` latency, `10 Mbps` download/upload, Wi-Fi connection type, and `4×` CPU throttling. Three cold runs were `1,029 ms`, `1,198 ms`, and `1,056 ms`; median `1,056 ms`, worst `1,198 ms`. The timer started immediately before activating the visible Try link and stopped when the host's `data-state` became `ready` after the child READY message. Every run confirmed zero iframe and zero AutoZain resource entries before activation.

## Visual artifacts and provenance

- `apps/portfolio/public/images/autozain/contact-outcome-1440x900.png` — actual standalone staff UI after the fictional request was accepted and completed as `interested`; `1440×900`, `44,220` bytes, SHA-256 `869A198F18CCC3114B1FE24773B53F0AD9D66F0E4552BB02D90BFB6CA27869FF`.
- `output/playwright/phase-05/autozain-staff-outcome-1440x900.png` — browser-evidence copy of the same capture and hash.
- `output/playwright/phase-05/autozain-host-mobile-390x844.png` — integrated mobile host and marketplace seed; `390×844`, `176,198` bytes, SHA-256 `03B52CBE7396D1D85F02503400ED24150F9A9D656E07714C0160EC33BCE05BEB`.
- `output/playwright/phase-05/autozain-mobile-rejected-390x844.png` — mobile staff history after rejection; `390×844`, `30,651` bytes, SHA-256 `3DE5090CAEE0E4D39D23CA552E5F5F9FB845D0847EA61DFC471ACB36AEA093D5`.

The three vehicle images were generated specifically for this phase with the built-in image generation tool in default mode, converted locally to WebP, and labeled as generated/demo imagery in Arabic alt text and interface copy. Full prompts, dimensions, hashes, and source-to-local provenance are recorded in `docs/portfolio/source-audit.md` and `apps/demo-autozain/SOURCE.md`.

## Limitations and deferred gates

- Browser evidence in this phase is Chromium on Windows only. Firefox, WebKit, comprehensive screen-reader/accessibility tooling, 200% text enlargement, and broader device coverage remain Phase 08; no pass is claimed for them.
- Deployment headers/CSP cannot be validated against the local static preview and remain a release-environment gate.
- The demo intentionally does not include real authentication, sockets, calls, messages, push notifications, uploads, external inventory, queue administration, deposits, financial calculations, sale closing, multiple simultaneous accepted requests, or full dealership administration.
- The exact AutoZain contribution/role is still unconfirmed and remains absent from the public case study. Generated unbranded vehicles replace client media pending any separate publication permission.

## Exit gate

Phase 05 passes its exit gate. The recognizable buyer and staff UI completes a real local request workflow; buyer/staff state, events, outcome, and employee availability reconcile; reject, timeout, invalid/repeated transitions, reset, teardown, nested routing, and mobile RTL interaction are covered; the final build makes no client or third-party request; the case-study evidence is the actual sample-data UI; Vertex still opens; and the read-only source checkout remains untouched.

Next prompt: `docs/portfolio/prompts/06-roya.md`. It was not started.
