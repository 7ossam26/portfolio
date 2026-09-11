# Phase 06 — Implement the Roya demo

Execute this phase only, locally. Do not modify `7ossam26/Film-production-fin-system` or contact its services. Read `AGENTS.md`, `STATE.md`, `DECISIONS.md`, and `docs/portfolio/{master-plan,design-spec,demo-spec,source-audit,content-and-evidence,acceptance-checklist}.md`.

## Objective

Deliver the original shooting-week budget impact preview using deterministic local project/budget data. Show a production-specific planning decision without rebuilding the entire finance platform.

## Work

1. Inspect the pinned original budget/project/impact-preview screens and required cost strategy rules. Verify how weekly/fixed lines, contingency, margin, tax, rounding, language, and preview/apply state are represented.
2. Copy only the needed original UI and providers into `apps/demo-roya/`, keeping styling and RTL/LTR behavior recognizable. Record source mappings and required dependencies.
3. Create a small fictional production with source-valid settings and budget lines. Validate the illustrative weekly/fixed fixture in `demo-spec.md` against real code and record the exact expected deltas.
4. Implement proposing a shooting-week change, viewing affected lines/totals, and canceling without changing the saved sample budget. Only add apply/save when the selected source rules are implemented and tested; otherwise the original preview/cancel flow is the bounded demo.
5. Keep every required read/calculation local. Do not introduce banking, FX network calls, document storage, real approvals, or a full event-sourcing backend.
6. Integrate bridge/reset/standalone behavior, stage `/demos/roya/`, and enable readiness only after the scenario works.
7. Capture sample-data original UI and update the case study. Keep source-backed ledger/replay/approval details in the narrative while clearly limiting this demo to budget impact.

## Validation and exit gate

Use source-derived expected values to check changed and unchanged lines, final totals under the chosen fixture settings, rounding, preview isolation, cancel, and reset. Browser-test the complete scenario, host lifecycle, and both supported directions if the selected UI retains its language switch. Inspect network activity and startup size.

Write `docs/portfolio/validation/phase-06.md`, update source evidence and state, and report any narrowed scope. Do not mark completion from a chart that simply swaps between prewritten totals when the visitor changes an input.

Next: `docs/portfolio/prompts/07-ramex.md`. Do not run it yet.
