# Original-UI Demo Specification

## 1. What a demo is

A demo is a bounded, functional copy of selected original frontend screens connected to deterministic local sample data. It demonstrates one meaningful workflow while keeping the application's recognizable interface and domain behavior.

It is not the client website, a browser pointed at production, a full duplicate backend, a screenshot with pretend controls, or a freshly invented replacement dashboard. Those distinctions define implementation scope; the public UI only needs a clear Sample data label and simple guidance.

The approved design's Preview demo is a presentation preview. All four implemented original-UI demos now have exercised scenario evidence in the Phase 04–08 validation reports. Readiness is tied to those flows; public-host verification remains a separate release gate.

## 2. Extraction contract

For each app, first record the exact source commit and inspect the selected UI path, imports, API client, auth/role context, global providers, styles, router, static assets, and related business rules.

Copy the smallest complete component dependency set. Preserve source filenames or record their mapping. The original repository remains read-only. Put a provenance record in `docs/portfolio/source-audit.md` with source path, commit, local destination, and what changed.

Do not copy the whole source tree and hope tree-shaking will hide it. Watch for eager route imports, barrel files, export libraries, rich editors, charts, socket startup, service workers, and default API URLs. Keep needed source dependencies at compatible versions. Vertex may use a different React version from the other applications; app workspaces can retain that difference. Do not share a React-dependent component package across incompatible app versions merely for neatness.

### Local data layer

- Define the service boundary required by the selected screens. Implement its read/write operations with an async in-memory adapter and typed fixtures.
- If existing screens call a tightly coupled HTTP client, replace that client's selected entry point in the copied app. An in-memory Axios adapter is acceptable where it preserves source call shapes. Do not recreate an entire REST server or install a service worker just to imitate every endpoint.
- Unsupported operations return a typed, visible demo limitation or are absent from the limited route. No adapter may fall back to a live request.
- Keep pure domain calculations from the source when portable. If backend logic must be adapted, implement only the selected rule and verify it against source-derived examples. Never bundle server credentials, ORM/database clients, or production configuration into browser code.
- Use a fixed fixture clock, deterministic IDs, and a repeatable seed. Mutations must update the next screen consistently. Reset restores the seed, not merely the current form values.
- Use decimal/minor-unit or source-established arithmetic for money. Respect source quantity precision and unit handling; do not use formatting to conceal floating-point errors.
- Auth/roles come from explicitly labeled sample personas. Do not issue JWTs or simulate credential entry.
- Keep state in the iframe session. Avoid localStorage unless an original component requires it; then namespace the keys per demo/version and clear those keys on reset. Never call `localStorage.clear()`.
- No analytics, socket connections, push subscriptions, or client uploads. AutoZain's selected events are locally simulated and visibly labeled.

## 3. Demo host and lifecycle

The parent shell owns the dialog, loading/error states, close/reset controls, history, and return focus. The child owns its route, local state, original UI, and domain updates.

Create the iframe only after an explicit Try demo action. An initial `loading="lazy"` iframe that already exists is not sufficient to meet the zero-demo-request startup requirement. Do not preload demo script/module assets from project cards.

| State | Visitor experience | Behavior |
| --- | --- | --- |
| Closed | Portfolio/case study | No mounted demo or active demo resources |
| Loading | Dialog title and immediate loading message | Start selected frame; measure click-to-ready |
| Ready | Original UI plus short guidance | Enable interaction/reset |
| Error/timeout | Plain error and Retry/Close | No endless spinner; retain case-study context |
| Resetting | Brief reset feedback | Recreate a fresh frame/session from the same seed |

Use a 12-second readiness timeout as an error-recovery threshold, not a performance target. Retry starts a new frame/session and ignores stale messages from the previous one.

Closing must remove the iframe and listeners, release any object URLs, stop timers owned by the host, unlock scroll, restore the previous scroll location, and return focus. Two demos must never be active at once. A demo crash must not remove the portfolio or prevent closing.

On mobile, use a full-viewport dialog with a stable header and independently scrollable application region. For a complex desktop table, keep overflow in the table region and provide short English guidance. Do not shrink the entire original application until its controls are unreadable.

### Keyboard and history

Use native modal behavior or an existing accessible primitive in the actual project. Give the dialog an accessible title and initial focus, label the iframe with its project/scenario, and restore focus to the opener. Native dialogs supply important focus behavior, but the integration still requires actual testing. [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)

Escape pressed inside an iframe does not automatically become the parent's Escape. The child bridge may request closing when no inner application dialog/menu is consuming that Escape. Check existing app overlays first. The visitor must be able to close the demo from the visible host Close button regardless.

Use `#demo={slug}` as the host URL state. Opening by click pushes one history entry, keeping the previous hash and scroll in memory. Browser Back closes an entry opened from the page; Forward can reopen it. A direct initial URL with a known demo hash opens that demo; closing this direct-entry case removes only the demo hash with replacement, not an unconditional history back. Unknown slugs show ordinary page content and do not open arbitrary URLs. Guard against duplicate history entries and stale popstate handling.

### Minimal frame message contract

Define a small discriminated TypeScript union and validate incoming messages. Suggested envelope:

```ts
type DemoEnvelope = {
  channel: 'ah-portfolio-demo';
  version: 1;
  demoId: 'vertex' | 'autozain' | 'roya' | 'ramex';
  sessionId: string;
  type: 'READY' | 'STEP_CHANGED' | 'COMPLETE' | 'ERROR' | 'REQUEST_CLOSE';
  payload?: unknown;
};
```

The host creates a random sessionId in the frame URL; it is a correlation token, not authentication. READY is sent only after the initial original UI, essential data, and interactions are usable. ERROR exposes a safe message, not raw secrets or production configuration. STEP_CHANGED/COMPLETE update small host guidance only when useful.

For same-origin deployments, send to `window.location.origin` and accept messages only from the exact frame window, expected origin, channel/version, demoId, and current sessionId. Never accept arbitrary iframe URLs or use wildcard target origins. [MDN postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

Reset can recreate the frame instead of adding a bidirectional command bus. Keep the protocol small. Standalone `/demos/{slug}/` views must still start correctly without a parent handshake, include Sample data/Reset/Back to portfolio controls, and handle unsupported query values safely.

## 4. Network isolation and embedding headers

Same-origin iframes separate document styles and application runtimes. They are not a strong security boundary from their parent. In particular, `allow-scripts` plus `allow-same-origin` on a same-origin sandbox must not be presented as protective isolation. Start with trusted reviewed demo code and no unnecessary sandbox tokens; use a separate origin only if a concrete requirement needs a stronger boundary. [MDN iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)

Serve the copied demos from the portfolio origin. Existing client `X-Frame-Options: SAMEORIGIN` or client `frame-ancestors` configuration does not need changing because the client sites are not embedded.

For the new deployment, validate a per-path header policy:

- The portfolio permits frames from itself using `frame-src 'self'`.
- Demo responses allow their same-origin parent using `frame-ancestors 'self'` and compatible X-Frame-Options.
- Demo adapters require no network data requests. Use `connect-src 'none'` for deployed demo routes when fixtures are bundled modules, after checking the built application for compatibility.
- Restrict scripts/images/fonts to required local assets and explicitly needed `data:`/`blob:` cases. Any allowances for existing inline styles need evidence from the copied app. Do not solve failures with wildcard origins, arbitrary remote endpoints, or `unsafe-eval`.
- Set `object-src 'none'`, an appropriate `base-uri`, and a restrictive `form-action` for sample-only forms. Do not activate external submissions through an original form element.

`frame-src` controls what the parent loads; `frame-ancestors` controls who can embed the child and needs an HTTP response header rather than a meta substitute. Inspect effective headers from the chosen host; do not merely write a config file and assume it is applied. [MDN frame-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-src) · [MDN frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors)

Avoid custom production-like DNS aliases for client services. A network test must demonstrate that selected flows cannot contact client APIs, databases, sockets, uploads, or telemetry. Normal local JS/CSS/image/font asset requests are allowed.

## 5. Scenario: Vertex ERP

### Goal

Show how bill-of-materials production connects raw materials, finished quantity, and production cost. Reuse the original production/BOM UI and the relevant stock/history views.

### Proposed seed and workflow

Use explicit sample labels and the source's supported units. An illustrative arithmetic fixture, subject to source rule validation:

| Record | Starting quantity | Unit cost |
| --- | --- | --- |
| Demo material A | 100 units | EGP 10 |
| Demo material B | 50 units | EGP 20 |
| Demo finished item | 0 units | No prior cost/stock |

One finished unit requires 2 units of A and 0.5 of B. Produce 4 units: consume 8 A and 2 B, costing EGP 120 in total and EGP 30 per finished unit. Ending quantities are A=92, B=48, finished=4. Starting with zero finished stock avoids assuming a particular weighted-average treatment. These are fictional demo numbers, not client results.

1. Open a prepared recipe and select production quantity.
2. Review required material quantities and supported validation.
3. Complete the local production command.
4. Inspect changed stock and a source-consistent production record/cost.
5. Reset and observe the original seed.

Match any additional production cost, unit conversion, rounding, warehouse, permission, or idempotency rules actually required by this source flow. Do not force the illustration above onto incompatible source semantics. Record any adjusted fixture with expected arithmetic.

Required checks: insufficient materials prevent an inconsistent update; repeated submission does not double-apply while pending; all changes reconcile; reset works. Preserve the selected UI's business validation. Do not implement accounting ledgers, purchasing, payroll, or a complete POS merely to support this scenario.

## 6. Scenario: AutoZain

### Goal

Show the link between buyer contact and staff handling. Keep the original marketplace/request interface and selected staff response/outcome interface.

Seed a few fictional vehicles with safe local imagery, sample staff with available/busy states, and fictional buyer contact data. Do not copy customer photos, plate numbers, IDs, seller details, or phone lists from uploads.

1. Browse/filter a small sample inventory and select a vehicle.
2. Request contact with an available sample staff member.
3. Switch to the clearly labeled staff demo persona; accept the request.
4. Record a sample outcome and see consistent status/history.

Use an in-memory event adapter matching only the source events required here. Display `Simulated events · Sample data`; no real Socket.io connection, phone call, push message, or notification permission request. Do not make the visitor wait through a production-length timeout. Expose a deterministic sample timeout path for testing if it is part of the selected flow.

Required checks: request state appears consistently on buyer/staff views; accept/reject/timeout transitions follow source rules; Reset clears timers and returns to the seed. CFO financial calculations and full sale closing stay outside this first interactive scope.

## 7. Scenario: Roya

### Goal

Show the shooting-week change preview and its budget impact. This is a distinctive production-finance flow that can be bounded without rebuilding the event-sourced platform.

Reuse original project/budget/impact-preview components. Seed a fictional production with a small number of budget lines covering weekly and fixed strategies. Define the treatment of contingency/margin/tax from source; simplify fixture settings explicitly where the UI permits it.

Illustrative seed: weekly crew cost EGP 5,000/week and a fixed EGP 20,000 line, initially 4 weeks. A proposed change to 6 weeks changes the weekly subtotal from EGP 20,000 to EGP 30,000 while the fixed line stays EGP 20,000. Any displayed final total must follow the actual source's additional settings. Do not claim the illustration is the client's calculation policy.

1. Inspect the original sample budget.
2. Propose a shooting-week change.
3. Compare affected lines and delta in the original preview UI.
4. Cancel without mutating the original values. Add an apply/save step only if its necessary rules are safely implemented and verified.

Required checks: only source-eligible lines change; the preview does not mutate current budget state; cancel and reset preserve the seed; RTL/LTR formatting is consistent. Do not implement approval quorum, banking, FX services, payment execution, and full historical replay as hidden prerequisites. Describe those verified production capabilities in the case study.

## 8. Scenario: Ramex

### Goal

Show per-roll inventory and the relationship between a whole-roll sale's quantity/unit snapshot and sellable stock. The pinned-source audit supersedes the earlier illustrative partial-roll fixture: this revision accepts a roll ID but no sale-quantity input.

Reuse the original roll selection, fixed quantity/unit presentation, invoice view, and selected stock treatment. Seed two fictional meter rolls of the same fabric. The selected roll is 30.000 meters; completing the fully paid sale preserves `30.000 meter` on the invoice and changes that roll to sold/unavailable. The second 24.750-meter roll remains independently in stock.

1. Select the identified 30.000-meter roll.
2. Review its read-only complete quantity and editable per-meter price, then complete a local cash sale using the fixed sample customer and open shift.
3. Inspect the immutable invoice quantity/unit snapshot and both roll statuses.
4. Reset to remove the synthetic invoice and restore both rolls.

Do not add a quantity input or a kilogram fixture merely to satisfy the older illustration. A partial roll sale would require an audited client product change; a kilogram example is unnecessary to prove the selected path and no conversion behavior is implied.

Required checks: source decimal quantity limits/precision, duplicate and already-sold rejection, one pending submission, exact payment/atomic failure, only the selected roll changing status, stable invoice values, internal table scrolling, and full reset. The original one-session policy is replaced by a local sample persona, never connected to real authentication.

## 9. Scope and fallback discipline

Complete Vertex first and record the extraction effort and limitations before repeating the architecture. If a scenario cannot be extracted cleanly, inspect a narrower meaningful path in the same original UI and record the decision. A blocker is not permission to silently replace a promised original-UI demo with a mock screen or to enable the original backend.

Production readiness requires all four agreed demos. A partial release is possible only as an explicit scope decision, with the incomplete demo clearly reported. Screenshots and case-study content can progress independently while an extraction blocker is resolved.
