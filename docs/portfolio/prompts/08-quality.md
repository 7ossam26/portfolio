# Phase 08 — Validate the release candidate

Execute this phase only and work locally. Do not publish or change access. Read `AGENTS.md`, `STATE.md`, `DECISIONS.md`, all previous validation reports, and `docs/portfolio/{master-plan,design-spec,demo-spec,content-and-evidence,acceptance-checklist}.md`.

## Objective

Produce a verified release candidate, fixing concrete quality problems without redesigning the approved site or broadening product scope.

## Work and validation

1. Build the complete production artifact from the current source. Verify output isolation, nested demo bases, enabled manifest entries, case-study routes, local assets, and the unchanged CV.
2. This phase explicitly requests full visual, keyboard, accessibility, and end-to-end browser testing of the portfolio and four bounded demos. Follow the actual test matrix in the acceptance checklist, including mobile/tablet/desktop, 200% enlargement, reduced motion, RTL/LTR, and browser engines available in the environment.
3. Exercise normal and failure journeys: demo startup, three lifecycle cycles, local mutations/reset, timeout/retry, child error, direct entry, stale messages, Back/Forward, inner-modal Escape, focus return, and scroll restoration.
4. Inspect the browser's requests from fresh page entry through each demo. Demonstrate no demo startup requests before activation and no connections to client services. Inspect the built public output for source configuration or data that should not be there.
5. Measure startup payloads, click-to-ready, and production-build lab performance under recorded conditions. Use the project's budgets. Separate measured facts from targets and field metrics from lab proxies.
6. Review UI against the actual approved reference and the anti-template criteria. Fix specific spacing, readability, overflow, hierarchy, and interaction issues; do not add decorative libraries or replace source demos with fabricated interfaces.
7. Review every case-study claim/capture. Remove internal placeholders and incomplete demo affordances. If any agreed demo is still blocked, report the full-release blocker instead of claiming completion.
8. Prepare production metadata hooks, sitemap/robots behavior, caching/header requirements, a useful 404, and a maintenance guide. Keep final domain values unresolved until a real target is supplied. Do not generate unrequested social artwork or add analytics.

## Deliverables

- `docs/portfolio/validation/phase-08.md` with the full matrix, test artifacts, and defects fixed.
- `docs/portfolio/validation/performance.md` with real measurements and conditions.
- `docs/portfolio/validation/network.md` with actual request/isolation evidence.
- `docs/portfolio/maintenance.md` covering content/CV updates, adding a project, updating copied source, fixtures, builds, and regression checks.
- Updated `STATE.md` with a truthful release-candidate status.

## Exit gate

All required checklist items pass, or exact unresolved blockers/coverage gaps are documented and the release remains incomplete. A successful build, an accessibility scan alone, or a single Lighthouse score is insufficient evidence.

Next: `docs/portfolio/prompts/09-release.md`. Stop before deploying.
