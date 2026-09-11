# Phase 01 — Build the foundation

Execute Phase 01 only in the new portfolio repository. Work locally; do not publish or change external services. Follow applicable environment instructions without copying the reference Site's hosting identity into this project.

Read `AGENTS.md`, `STATE.md`, `DECISIONS.md`, and `docs/portfolio/{master-plan,design-spec,content-and-evidence,source-audit,acceptance-checklist}.md`. Inspect the actual repository and the approved `design-reference/studio-dark/` files before editing. If Phase 00 is incomplete, address its relevant dependency first; do not silently mark it complete.

## Objective

Create a small, maintainable foundation that reproduces the approved Studio Dark first screen and supports later independent demo builds.

## Work

1. Establish the new npm workspace structure from the plan, preserving any existing valid package manager/lockfile. Set a supported Node requirement and record actual compatible dependency versions. Use Astro static output and TypeScript for the shell.
2. Create shared layout, metadata, global tokens, navigation, hero, CV/contact controls, and a representative Vertex feature from the approved source. Port deliberately; do not start from a generic portfolio theme or reinterpret the design.
3. Define a typed project-content source with the four real project records and source/evidence notes kept out of public rendering. Keep exact role claims conservative.
4. Copy the provided CV unchanged into the portfolio's public assets. Add the approved favicon, page title, and preview noindex metadata. Do not manufacture a public canonical domain.
5. Establish shell build/typecheck scripts and a root static-output staging script that will later collect demo builds without destructive output-directory collisions. Provide `preview:all` for the merged production output; keep standalone demo development distinct from same-origin integrated testing.
6. Reserve demo package boundaries without installing or bundling four complete applications. The shell must not fetch React/demo bundles before a visitor opens a demo.
7. Add semantic anchors, visible focus states, reduced-motion support, and responsive first-screen behavior. Do not make nonfunctional controls appear to launch real demos.

## Validation

Run a clean production build and relevant type/asset checks. Inspect the rendered first screen at a desktop and mobile width when browser testing is available; this phase explicitly requests that limited visual check. Verify the CV/contact/navigation paths and confirm there are no demo startup requests. Record any unavailable browser coverage honestly.

## Deliverables and exit gate

The repository builds a recognizable Studio Dark shell with truthful content, working essential links, valid static output, and no eager demo runtime. Write `docs/portfolio/validation/phase-01.md`, update `STATE.md`/`DECISIONS.md`, and report actual checks.

Next prompt: `docs/portfolio/prompts/02-portfolio.md`. Stop before running it.
