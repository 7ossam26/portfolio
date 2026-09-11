# Phase 04 — Implement the first original-UI demo: Vertex

Execute this phase only, locally. Do not publish or modify `7ossam26/ERP-V2`. Read `AGENTS.md`, `STATE.md`, `DECISIONS.md`, and `docs/portfolio/{master-plan,design-spec,demo-spec,source-audit,content-and-evidence,acceptance-checklist}.md`.

## Objective

Deliver a functional, bounded Vertex production demo using the original application UI. This is the proof that the extraction approach works; a diagram or clickable explanation does not satisfy it.

## Work

1. Reinspect the pinned production/BOM screens, API boundary, stock/history view, and relevant source calculations. Confirm quantity units, costing, branch/warehouse context, permissions, and any required idempotency behavior.
2. Copy only the selected original components and their dependency closure into `apps/demo-vertex/`, recording source-to-local mappings. Preserve recognizable UI and its language/fonts. Keep original server/client setup scripts out of the new build path.
3. Replace required service/auth boundaries with local typed sample adapters. Use the scenario in `demo-spec.md`, adapting its illustrative seed only when actual source rules require it. Record expected arithmetic and reasons for any adjustment.
4. Implement recipe selection, material review, production completion, and source-consistent stock/cost/history results. Reject insufficient material and prevent accidental repeated submission from corrupting sample state.
5. Add the frame bridge and standalone sample-data controls. Reset must restore every related entity and cached view. Never fall back to a client request.
6. Build with base `/demos/vertex/`, exclude unrelated routes/heavy imports, stage the output, and integrate the ready demo into the host only after it works.
7. Capture the actual sample-data original UI for the Vertex feature/case study, add useful captions and asset provenance, and replace or supplement the labeled concept diagram appropriately.

## Validation

Run focused domain checks with known expected quantities/costs, then browser-test the whole scenario, invalid material path, reset, close/reopen, direct entry, and keyboard/mobile frame behavior. Inspect network requests for production connections. Measure the first usable bundle and host click-to-ready under the specified conditions; report actual values, not expected scores.

## Exit gate

The original UI performs a coherent production scenario and the resulting records reconcile. All checks are recorded in `docs/portfolio/validation/phase-04.md`; provenance and state are updated. Mark Vertex ready only then.

If extraction requires a large unrelated system, first identify a narrower meaningful production path. Document the concrete dependency problem; do not switch to a fake UI or connect to production. Do not claim the proof succeeded while the core flow is blocked.

Next: `docs/portfolio/prompts/05-autozain.md`. Do not start it automatically.
