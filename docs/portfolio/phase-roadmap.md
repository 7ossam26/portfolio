# Phased Codex Execution Roadmap

Run one prompt at a time. Each phase depends on the preceding exit gate unless its prompt explicitly permits independent work. Do not treat source/readme review already performed in this conversation as proof that a production demo has been extracted.

| Phase | Prompt | Deliverable | Exit gate |
| --- | --- | --- | --- |
| 00 | `prompts/00-audit.md` | Exact source/design audit and feasible selected flows | Access verified, UI paths and service boundaries mapped, unresolved claims recorded |
| 01 | `prompts/01-foundation.md` | New workspace, static shell, tokens, typed content foundation | Clean build; approved visual direction recognizable; no demo startup payload |
| 02 | `prompts/02-portfolio.md` | Finished homepage and four case-study routes | Content/fidelity/responsive checks; truthful media and working CV/contact/navigation |
| 03 | `prompts/03-demo-host.md` | Lazy demo dialog, frame lifecycle, routing/history, error recovery | Test harness proves open/close/reset/focus/message behavior without production connections |
| 04 | `prompts/04-vertex.md` | First functional original-UI demo: Vertex production | Arithmetic/validation/reset and original UI verified; payload and readiness measured |
| 05 | `prompts/05-autozain.md` | Original-UI marketplace-to-staff demo | Consistent local event state and timer cleanup; no real contact/socket behavior |
| 06 | `prompts/06-roya.md` | Original-UI budget impact preview | Source-consistent change calculations; preview/cancel isolation; RTL/LTR checked |
| 07 | `prompts/07-ramex.md` | Original-UI roll sale demo | Roll-specific stock and invoice snapshots reconcile; units and reset checked |
| 08 | `prompts/08-quality.md` | Release candidate plus recorded browser/performance/network evidence | All four demos and portfolio pass required gates or clearly reported exceptions remain |
| 09 | `prompts/09-release.md` | Deployment configuration, public release if target/access available, handoff | Actual route/header/visitor checks and rollback verified |

## How to use each prompt

Read the current `STATE.md` before choosing the next prompt. Copy the complete prompt file into Codex, or tell Codex to execute that exact file if it can access the repository. The prompt is an execution brief; Codex should perform the work, not return another implementation plan instead of making changes.

At the end of a phase, Codex must give:

1. The concrete behavior delivered.
2. The checks actually run and their results.
3. Any relevant limitations or unresolved decisions.
4. The updated state/decision/evidence paths.
5. The next phase filename, without running it.

## Scope checkpoints

- Phase 00 confirms source feasibility. It is not another general business-analysis questionnaire.
- Phase 02 is the visual/content milestone. The approved Studio Dark reference remains the baseline.
- Phase 04 is the architectural proof: one real source-derived demo before scaling to the other three.
- Phase 08 is the full quality gate. Build success alone cannot satisfy it.
- Phase 09 is the publication gate. A missing domain or deployment credential is not permission to use a client service or silently make a private review site public.

## Continuing after an interruption

Use `prompts/resume.md`. It instructs Codex to reconcile files and recorded evidence before resuming the current phase. It must not restart from a template or repeat already completed work.

## Fixing a specific problem

Use `prompts/fix.md` with a short reproduction and expected behavior. It limits the repair to the actual defect, checks the relevant regression, and keeps the approved design/architecture intact.

## Planning the effort honestly

The shell is the straightforward part. Effort depends mainly on how tightly each selected UI relies on server-side business logic, global providers, and eager imports. Source-audit evidence should drive estimates after Phase 00. There is no credible fixed promise that all four production apps can be demo-ready in a single prompt or in a few hours.
