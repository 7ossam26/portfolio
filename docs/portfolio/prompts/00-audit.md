# Phase 00 — Ground the implementation

You are implementing Ahmed Hossam's portfolio in the current new portfolio repository. Execute this phase only. Work locally; do not publish, change access, or mutate any client repository or deployed client service.

Read `AGENTS.md`, `STATE.md`, `DECISIONS.md`, and these files under `docs/portfolio/`: `master-plan.md`, `design-spec.md`, `demo-spec.md`, `content-and-evidence.md`, and `acceptance-checklist.md`.

## Objective

Turn the existing project facts and approved design into an exact implementation audit. Do not return another generic plan, start a new design questionnaire, or scaffold all four demos yet.

## Work

1. Inspect the current repository and preserve unrelated files/instructions. Verify the approved design export at `design-reference/studio-dark/` and the current CV within it. Record missing reference files without substituting an unrelated template.
2. Obtain read-only access to the four repositories in the source ledger. Use the recorded commits as audit starting points, or record a newer intentionally selected commit after inspection. Do not execute their setup, migration, production seed, or deployment scripts.
3. For each proposed scenario, locate actual screen/component paths and their import dependencies, local/global providers, styles, router, API client, source auth/roles, and selected domain rules. Record the exact paths and source revision; do not invent filenames from a README.
4. Inventory the minimal service operations required. Note eager imports or backend dependencies that could make extraction expensive. Propose the smallest meaningful original-UI flow that fits the plan and identify where a local adapter will connect.
5. Inspect framework/package versions and relevant source notices. Choose a supported Node release and compatible stable versions for the new shell when needed; preserve differing source React versions where practical. Explain any concrete compatibility issue, without an unrelated upgrade campaign.
6. Identify sample-data/image/font needs. Determine whether each selected UI supports the desired mobile/RTL experience. Distinguish inspected feasibility from behavior that has actually run.
7. Record unresolved public claims. AutoZain's unconfirmed exact contribution can be omitted; it is not a reason to block the shell. The production host/domain can wait until release.

## Deliverables

- `docs/portfolio/source-audit.md`: one section per app with pinned revision, actual paths, dependency map, minimal service contract, assets, likely bundle risks, and planned extraction scope.
- `docs/portfolio/validation/phase-00.md`: files inspected, references verified, and concrete limitations.
- Updated `STATE.md` and any necessary entries in `DECISIONS.md`.

## Exit gate

The approved design is available, each accessible project's selected flow is grounded in real paths, and unknowns are explicitly separated from verified facts. If source access blocks an app, record exactly what is missing, finish independent auditing, and do not claim that app's audit passed.

Report the result and the next prompt, `docs/portfolio/prompts/01-foundation.md`. Do not run Phase 01 automatically.
