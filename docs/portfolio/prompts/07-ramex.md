# Phase 07 — Implement the Ramex demo

Execute this phase only, locally. Keep `7ossam26/Ramex-Store` and client infrastructure unchanged. Read `AGENTS.md`, `STATE.md`, `DECISIONS.md`, and `docs/portfolio/{master-plan,design-spec,demo-spec,source-audit,content-and-evidence,acceptance-checklist}.md`.

## Objective

Show the original roll-specific sales interface and the connection between sold quantity, invoice snapshot, and remaining stock.

## Work

1. Inspect the pinned roll selector, quantity/unit controls, sale submission, invoice, stock view, auth/session context, and any required shift/payment assumptions.
2. Copy the selected original components/styles into `apps/demo-ramex/` and record provenance. Use a local sample persona rather than connecting to real auth or reproducing the production concurrent-session mechanism.
3. Create source-valid sample rolls and sale context. Verify the 30m minus 7.5m example against actual quantity semantics. A second roll of the same material must remain independent.
4. Implement the local sale, stock update, and invoice quantity/unit snapshot. Validate supported precision and prevent invalid/excess quantities. Do not invent meter/kg conversion logic; include another unit only after source verification.
5. Reconcile every displayed result through one local state/service boundary. Reset must remove sample transactions and restore original roll balances.
6. Integrate host and standalone lifecycle, stage output under `/demos/ramex/`, and enable the ready entry only after the scenario passes.
7. Add real original-UI captures with sample records and update the Ramex case study. Describe it as fabric retail ERP, not generic ecommerce.

## Validation and exit gate

Run focused tests for selected-roll updates, untouched other rolls, invoice snapshots, quantity limits/precision, reset, and relevant repeat-submit behavior. Browser-test the scenario, RTL layout, internal table scrolling, and host close/reopen. Check network activity and demo payload.

Write `docs/portfolio/validation/phase-07.md`, update provenance/state, and report actual evidence. Do not expand this phase into factory shipments or complete accounting unless a concrete dependency requires a small source-derived adaptation.

Next: `docs/portfolio/prompts/08-quality.md`. Stop here.
