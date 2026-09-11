# Phase 02 — Complete the portfolio and case studies

Execute this phase only. Work locally; do not publish. Read `AGENTS.md`, `STATE.md`, `DECISIONS.md`, and `docs/portfolio/{master-plan,design-spec,content-and-evidence,source-audit,acceptance-checklist}.md`. Inspect the current implementation and approved visual reference.

## Objective

Finish the portfolio's reading and navigation experience with a consistent Studio Dark identity and credible project evidence.

## Work

1. Complete the homepage: identity, introduction, Vertex feature, AutoZain/Roya/Ramex rows, CV links, and contact footer. Give every project a specific operational distinction.
2. Build the four static `/work/{slug}/` case-study routes from the content specification. Use real anchors and normal browser navigation, unique titles/descriptions, and a useful Back to work path.
3. Present verified contribution, business context, selected capabilities, and source-grounded engineering decisions. Omit unconfirmed AutoZain role claims; do not publish internal TODO text.
4. Reuse safe original-UI captures if they already exist. Otherwise use explicitly labeled diagrams or omit optional imagery until the demo phases provide captures. Do not create fake application screenshots or claim a diagram is the original UI.
5. Refine button hierarchy, control dimensions, responsive spacing/type, focus/pressed states, and metadata readability according to `design-spec.md`. Preserve the approved direction; remove filler instead of adding ornamental sections.
6. Keep demo entry behavior honest. Until a demo is ready, the production-facing project record must not expose a functional Try demo action. The later demo phases will enable it. Never carry the prototype's explanatory Preview demo forward as a completed app experience.
7. Add a useful static 404 page and verify local asset paths. Keep the preview non-indexable and final-domain values unconfigured rather than invented.

## Validation

This phase requests visual and keyboard browser testing of the homepage and four case studies. Check representative mobile/tablet/desktop sizes, 200% enlargement, links/CV, readable metadata, absence of overflow, and reduced motion. Use the relevant acceptance checklist. Run the production build after changes.

## Deliverables and exit gate

The homepage and all case studies are useful without opening a demo, visually consistent with the approved reference, and navigable with ordinary links and keyboard controls. Record checks and any missing original media in `docs/portfolio/validation/phase-02.md`; update `STATE.md` and any changed decisions.

Do not begin app extraction in this phase. Next: `docs/portfolio/prompts/03-demo-host.md`.
