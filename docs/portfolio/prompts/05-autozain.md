# Phase 05 — Implement the AutoZain demo

Execute this phase only, locally. The original `7ossam26/autozain-system` repository and all client services are read-only. Read `AGENTS.md`, `STATE.md`, `DECISIONS.md`, and `docs/portfolio/{master-plan,design-spec,demo-spec,source-audit,content-and-evidence,acceptance-checklist}.md`. Review the Vertex proof's actual findings before repeating its approach.

## Objective

Reuse the original buyer and staff UI to demonstrate a contact request's lifecycle with local simulated events.

## Work

1. Inspect the pinned marketplace/request/staff components, role context, Socket.io integration, request state transitions, and timeout cleanup. Map the minimal events/services actually required.
2. Copy the selected original UI into `apps/demo-autozain/` with its styles/fonts and compatible dependencies. Record provenance and avoid copying uploads, seed credentials, customer records, or the full administration app.
3. Add a few fictional vehicles, safe local imagery, sample staff, and clearly fictional contact records. Expose an explicit demo-persona switch between buyer and staff for this scenario.
4. Implement browse/select/request, staff accept, and outcome handling through a small local state/event adapter. Label the experience `Simulated events · Sample data`. Do not create a socket connection, make a call, request notification permission, or send any message.
5. Preserve source-consistent state transitions. Handle reject/timeout only to the extent needed for this selected flow; avoid making the visitor wait through a long production timeout. Clear timers/listeners on reset and teardown.
6. Integrate the shared frame lifecycle and standalone behavior. Build with base `/demos/autozain/` and enable the manifest entry only after validation.
7. Capture original-UI evidence using the sample scenario and update the AutoZain case study. Keep the exact role line omitted until confirmed.

## Validation and exit gate

Browser-test buyer-to-staff continuity, acceptance/outcome, invalid transition prevention, repeat/reset/close, timer cleanup, and mobile/RTL interaction. Confirm no remote data/socket/contact requests and measure the demo startup payload. Recheck host integration and that the existing Vertex flow still opens; do not rerun unrelated tests without a regression reason.

Write `docs/portfolio/validation/phase-05.md`, update the source audit and state, and report limitations. A public-looking marketplace with a fake nonfunctional request button is not a completed demo.

Next: `docs/portfolio/prompts/06-roya.md`. Stop here.
