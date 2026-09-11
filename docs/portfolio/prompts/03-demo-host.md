# Phase 03 — Build the demo host

Execute this phase only, locally. Do not publish or connect to client services. Read `AGENTS.md`, `STATE.md`, `DECISIONS.md`, and `docs/portfolio/{master-plan,design-spec,demo-spec,acceptance-checklist}.md`. Inspect the existing shell before choosing components.

## Objective

Build the complete parent demo experience before integrating a production application's UI. The test child in this phase is internal validation infrastructure, not a portfolio demo or public project claim.

## Work

1. Implement a small typed demo registry and native accessible dialog (or an existing suitable accessible primitive), carrying Studio Dark through loading, ready, timeout/error, reset, and close states.
2. Create the selected iframe only after explicit activation. Keep all demo bundles and requests absent from initial portfolio loading. Never allow arbitrary frame URLs from user input.
3. Implement the minimal validated bridge envelope in `demo-spec.md`, checking source window, origin, channel/version, slug, and current session. Ignore malformed or stale messages.
4. Implement reset by recreating the frame/session. Remove frames, listeners, timers, and stale state on close. Keep only one demo mounted.
5. Implement hash/history behavior for click-open, Back/Forward, direct entry, and close while preserving scroll and focus. Avoid unconditional history.back on direct-entry URLs.
6. Make the host a full-viewport dialog on mobile, with persistent Close/Reset access and a separate scrollable app region. Set an accessible frame title and concise sample-data guidance.
7. Add an internal harness that can send ready/error/close messages, stall, and contain an inner dialog to verify Escape handling. Keep the harness out of production output and do not mark any real project ready from it.
8. Integrate demo-aware build staging and availability checks without filling all app workspaces with placeholder UIs.

## Validation

This phase explicitly requests browser integration testing: keyboard focus through the frame, inner-overlay Escape behavior, host close, three reset/open/close cycles, timeout/retry, malformed/stale messages, direct hash entry, Back/Forward, and no initial demo requests. Verify the harness is excluded from a production build. Do not treat same-origin iframe boundaries as a sandbox security guarantee.

## Deliverables and exit gate

The host lifecycle works with a controlled internal child and survives loading/child failures without breaking the portfolio. Write `docs/portfolio/validation/phase-03.md`, update state, and report the measured checks and limitations.

Next: `docs/portfolio/prompts/04-vertex.md`. Stop before extracting Vertex.
