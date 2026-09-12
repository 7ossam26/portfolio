# Network and isolation evidence

Recorded 12 September 2026 during Phase 08 against the production `dist/` artifact.
Every request the browser made was captured through Playwright's `request` /
`response` / `requestfailed` events, so this is an observation of real traffic, not
a reading of the source.

Regenerate with `npm run build && npm run verify:network`. The raw record is
`output/playwright/phase-08/network-isolation.json`.

## 1. What was exercised

| Stage | Coverage |
| --- | --- |
| Cold entry | `/`, four case-study routes, `/404.html` — fresh context each time, then a 1.2 s idle settle |
| Demo scenarios | Each demo opened, driven through its full documented scenario, reset, and closed |
| Runtime surfaces | `WebSocket`, `EventSource`, `Worker`, `sendBeacon`, `Notification.requestPermission`, `geolocation`, service-worker registrations, `localStorage`, `sessionStorage`, `document.cookie` |
| Unsupported path | Re-selecting a roll that the Ramex sale already marked sold |

All 46 checks passed.

## 2. No demo requests before activation

| Route | Total requests on cold entry | Requests from any demo |
| --- | --- | --- |
| `/` | 4 | **0** |
| `/work/vertex/` | 4 | **0** |
| `/work/autozain/` | 4 | **0** |
| `/work/roya/` | 4 | **0** |
| `/work/ramex/` | 4 | **0** |
| `/404.html` | 3 | **0** |

The iframe is created only inside the `Try demo` click handler, so nothing under
`/demos/` is fetched, preloaded, or prefetched until a visitor asks for it.

## 3. Request counts across a full demo lifecycle

Cumulative request count at each stage of one uninterrupted session.

| Demo | On page | After ready | After scenario | After reset | After close |
| --- | --- | --- | --- | --- | --- |
| Vertex | 4 | 8 | 8 | 12 | **12** |
| AutoZain | 4 | 16 | 16 | 28 | **28** |
| Roya | 4 | 7 | 7 | 10 | **10** |
| Ramex | 4 | 15 | 15 | 26 | **26** |

Two things are visible here and both are intended:

- **Running the scenario costs zero requests.** Every mutation — producing four
  units, accepting a contact request, previewing a budget change, completing a roll
  sale — is served by the in-memory adapter. The count does not move.
- **Close is silent.** The count after close equals the count after reset in all
  four demos. No teardown beacon, no unload request.

Reset re-fetches the demo's assets because it recreates the frame from a new session
id, which is the documented reset behaviour.

## 4. Complete allow-list

These are the only 42 distinct paths requested across every run. All are relative
paths on the portfolio origin; no absolute off-origin URL appears anywhere.

**Documents** — `/`, `/404.html`, `/work/{vertex,autozain,roya,ramex}/`,
`/demos/{vertex,autozain,roya,ramex}/`

**Shell assets** — `/_assets/projects.*.css`, `/_assets/DemoHost.*.js`

**Case-study captures** — `/images/{vertex,autozain,roya,ramex}/*.png`

**Demo bundles** — `/demos/{slug}/assets/index-*.js`, `/demos/{slug}/assets/index-*.css`

**Self-hosted fonts** — `/demos/vertex/assets/Cairo-Regular-*.woff2`,
`/demos/ramex/assets/cairo-{arabic,latin}-{400,500,600,700}-normal-*.woff2`,
`/demos/autozain/assets/ibm-plex-sans-arabic-{arabic,latin}-{400,600,700}-*.woff2`

**Sample imagery** — `/demos/autozain/vehicles/{graphite-crossover,pearl-sedan,blue-hatchback}.webp`

No request failed and no response returned a status ≥ 400 during any scenario.

## 5. No connection to client services

Each request's **host** was checked against the client and third-party patterns
below, and its protocol against `ws:`, `wss:`, and `ftp:`. Matching on host rather
than on the whole URL matters: `/demos/autozain/` and `/work/ramex/` are legitimate
local paths, and an earlier version of this check flagged them as false positives.

Blocked host patterns: `autozain`, `ramex`, `erp-v2`, `film-production`, `vertex`,
`roya`, `api.*`, `socket`, `google-analytics`, `googletagmanager`, `plausible`,
`segment`, `sentry`, `hotjar`, `mixpanel`, `posthog`, `fonts.googleapis`,
`fonts.gstatic`, `cdn.jsdelivr`, `unpkg.com`, `cdnjs`, `*.onrender.com`,
`*.vercel.app`, `*.railway.app`, `supabase`, `firebase`.

**Zero matches across every run.** Every request resolved to the loopback origin.

## 6. Runtime channels and storage

Instrumented before any page script ran, then inspected inside each demo frame after
its full scenario.

| Surface | Vertex | AutoZain | Roya | Ramex |
| --- | --- | --- | --- | --- |
| `WebSocket` constructions | 0 | 0 | 0 | 0 |
| `EventSource` constructions | 0 | 0 | 0 | 0 |
| `Worker` constructions | 0 | 0 | 0 | 0 |
| `navigator.sendBeacon` calls | 0 | 0 | 0 | 0 |
| Notification permission prompts | 0 | 0 | 0 | 0 |
| Geolocation requests | 0 | 0 | 0 | 0 |
| Service-worker registrations | 0 | 0 | 0 | 0 |
| `localStorage` keys | none | none | none | none |
| `sessionStorage` keys | none | none | none | none |
| Cookies | none | none | none | none |

AutoZain is the significant case: its source uses Socket.io for live request and
availability events. The extracted demo constructs **no** WebSocket. Its events come
from an in-memory adapter and the UI labels them `Simulated events · Sample data`.

Because nothing is persisted, closing the demo genuinely discards its state; there
are no namespaced keys to clear and `localStorage.clear()` is never called.

## 7. Unsupported operations do not fall through

After the Ramex sale marks `RMX-M-0701` sold, re-selecting that roll produced **0**
new requests and **0** `xhr`/`fetch`/`websocket`/`eventsource` calls. The sold roll
is removed from the sellable list and the local service rejects it by code
(`ROLL_NOT_AVAILABLE`) rather than attempting a call. There is no adapter path that
falls back to a live request: the demos ship no HTTP client for domain data.

## 8. Console

No console errors and no uncaught page errors during any scenario, on any demo,
across three open/close/reset cycles each, or at any viewport in the visual matrix.
The only console error observed anywhere in Phase 08 was the deliberate 404 probe
at `/no-such-page/`, which is expected and excluded by name in the test.

## 9. Limitations

- Measured against a **loopback HTTP server**, not a deployed host. Response headers
  in production are set by the host, not by this artifact. The required header policy
  is specified in `docs/portfolio/maintenance.md` §7 and remains **unverified** until
  a target exists — deployed `frame-ancestors`, `frame-src`, `connect-src`, and
  caching headers must be inspected from the real host during release.
- **Chromium only.** Firefox and WebKit engines are not installed on this machine, so
  their network behaviour is unverified.
- This evidence shows that the demos *do not* contact client services in the flows
  exercised. A same-origin iframe is not a security boundary from its parent, and
  this document does not claim otherwise; the protection here is that the copied code
  contains no client endpoints, which the built-output scan in
  `docs/portfolio/validation/phase-08.md` §3 confirms independently.
