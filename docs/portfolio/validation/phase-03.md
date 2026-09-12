# Phase 03 validation — demo host

Validation date: 12 September 2026

## Delivered scope

- Added a framework-free typed contract with the four production demo IDs, the versioned `ah-portfolio-demo` envelope, runtime envelope validation, and one registry that also drives build availability.
- Added a native modal dialog to every portfolio route. The host owns loading, ready, resetting, timeout/error, Retry, Reset, Close, focus restoration, scroll restoration, history, and frame teardown.
- The host resolves only trusted registry paths. It creates an iframe after an explicit registered trigger, adds a new random session to the frame URL, and accepts messages only from the exact active frame window and origin with the expected channel, version, slug, and current session.
- Reset removes the active frame/listener/timer and creates a new session. Close removes the frame and session resources, restores the prior scroll/focus, and keeps at most one child mounted.
- The dialog uses the Studio Dark surfaces and becomes a full-viewport mobile shell with a fixed host header and a separate application region. Close and Reset remain outside the child scroll surface.
- Added an internal child capable of READY, ERROR, REQUEST_CLOSE, one-time stall/retry, malformed/stale envelopes, and an inner native dialog. It is served only by an explicit local preview flag and is not a production project claim.
- Added demo-aware build orchestration. Only registry entries marked available are built/staged, and an available entry without a build script or `index.html` fails the build. All four production entries remain unavailable, so no placeholder UI or Try demo action was added.

## Build and static checks

Commands ran under Node `22.23.2` and npm `11.1.0` through an isolated `npx` toolchain because the workstation default Node remains `22.12.0`.

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass: 15 files, 0 errors, 0 warnings, 0 hints. |
| Clean `npm run build` | Pass: asset hashes, six-page Astro build, demo availability pass, atomic staging, and generated-output checks. |
| Demo-aware build | Pass: zero demos were built because all four original-UI entries remain `available: false`. |
| Production harness exclusion | Pass: generated files contain no harness route/marker, production has zero demo triggers and an empty active registry, and `/__demo-host-harness/` returns 404 without the local flag. |
| Initial production demo loading | Pass: initial resources were the portfolio CSS, host controller, and favicon only; no `/demos/` or harness request occurred. |
| Initial asset size | Portfolio CSS is 24,380 bytes / 5,529 bytes gzip; the demo-host controller is 7,491 bytes / 2,929 bytes gzip. |
| Production console | Pass: 0 errors and 0 warnings in headed Chromium. |

## Browser integration validation

Tool: headed Chromium `152.0.0.0` on Windows through Playwright CLI. The controlled child ran from a test-only merged build at one origin. The production build was rebuilt afterward and checked separately.

| Check | Measured result |
| --- | --- |
| Explicit lazy activation | Before activation, `iframe` count was 0 and resource entries contained no demo/harness URL. Clicking the registered harness action added exactly one frame. |
| Accessible name and keyboard entry | The native dialog is named by its project heading. Focus opened on Close, then Tab moved to Reset, then into the titled iframe; the first child focus target was `Send ready`. |
| Inner-overlay Escape | With focus inside the child, first Escape closed the child's inner dialog while the host stayed open. A second Escape with no child overlay sent REQUEST_CLOSE; the host closed, removed the frame/hash, and focused the opener. |
| Visible host close | The persistent Close button closed ready and error states. After close, frame count was 0 and the portfolio remained interactive. |
| Three open/reset/close cycles | Pass for all three cycles. Every Reset produced a different `sessionId`; every Close left zero frames and returned focus to `Open ready child`. |
| Timeout and Retry | The internal 700 ms test timeout produced the recovery state, removed the stalled frame, and exposed Retry. Retry created a new session and reached ready. Production demo entries retain the specified 12-second timeout. |
| Child error | A valid ERROR envelope displayed the safe harness message and removed the child; frame count was 0 and host Close/Retry remained available. |
| Malformed/stale/source/origin checks | Malformed data plus wrong version, slug, session, source window, and origin left the host in `loading` after 140 ms. The later valid READY at 320 ms moved it to `ready` with one frame. |
| Click history | Browser Back closed and removed the frame; Forward reopened a fresh frame from the demo hash. Closing the reopened entry returned focus to its trigger. |
| Direct hash entry | `#demo=host-harness` opened directly. Close replaced only the demo hash: history length stayed 11 before/after and frame count became 0, so no unconditional Back was used. |
| Existing hash, scroll, and focus | Opening from `#selected-work` restored that hash, scroll Y exactly from `1443.8835` to `1443.8835`, and focus to the trigger after close. |
| Arbitrary/unknown hash | A hash containing an encoded external frame URL opened no dialog/frame and produced no external resource request. A production `#demo=vertex` also opened nothing while Vertex remains unavailable. |
| Mobile host | At a 390×844 test viewport (reported layout viewport 391×844), the dialog measured from `(0,0)` to `(390.67,844.27)`, page overflow was 0, both host controls were visible, and the app region occupied the remaining viewport below the 157.67 px header. |
| Desktop host | At 1440×1000, the dialog measured 1353.59×899.99 with zero page overflow and a distinct scrollable child region. |

## Visual artifacts

Artifacts are under `output/playwright/phase-03/`:

- `mobile-ready-390x844.png`
- `desktop-ready-1440x1000.png`
- `timeout-error-1440x1000.png`

## Limitations and deferred gates

- The harness proves the parent lifecycle only. It is not an original application UI, does not make Vertex or another project ready, and is absent from the production output.
- No client repository, client service, authentication system, production API, socket, upload, database, or external frame was contacted.
- Same-origin framing is used for trusted reviewed code and style/runtime separation. It is not claimed as a security sandbox.
- A real demo's direct `/demos/{slug}/` controls, domain behavior, request isolation, RTL behavior, and click-to-ready payload remain for Phases 04–07. Vertex is next.
- Firefox, WebKit, 200% text enlargement, deployed headers/CSP, and full performance/accessibility coverage remain Phase 08/09 gates; no pass is claimed here.

## Exit gate

Phase 03 passes its exit gate: the production shell contains a bounded, history-aware, failure-tolerant demo host; the controlled child exercises its lifecycle; normal production output contains no harness or original-UI demo; and failure/close paths leave the portfolio usable.

Next prompt: `docs/portfolio/prompts/04-vertex.md`.
