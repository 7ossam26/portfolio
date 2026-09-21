# Portfolio decision log

| ID | Decision | Status/source |
| --- | --- | --- |
| D01 | Companies/agencies are primary; freelance clients are secondary | Confirmed by Ahmed |
| D02 | Use Studio composition with a dark theme | Confirmed after visual review |
| D03 | Prioritize distinctive UI/UX and performance | Confirmed by Ahmed |
| D04 | Feature Vertex; include AutoZain, Roya, and Ramex | Confirmed by Ahmed |
| D05 | ERP-V2 is Vertex ERP | Confirmed by Ahmed |
| D06 | Do not use client sites for demos | Confirmed constraint |
| D07 | Copy selected UI into one new portfolio repo with local demo data | Agreed approach; per-flow feasibility still requires audit |
| D08 | Keep original client repositories and deployment settings unchanged | Consequence of the agreed isolated approach |
| D09 | Astro static shell; separate React/Vite demo builds | Planning recommendation for implementation |
| D10 | English portfolio; preserve original demo language/RTL | Planning default |
| D11 | Shareable static case studies and a lazy modal demo host | Planning default supporting hiring/freelance use |
| D12 | First scenarios: Vertex production, AutoZain request handling, Roya budget impact, Ramex roll sale | Proposed bounded scope, to validate against source |
| D13 | No full backend replicas, accounts, CMS, contact service, or analytics in V1 | Scope decision for a low-maintenance portfolio |
| D14 | Use the existing Vercel project at `https://hossam-portfolio-five.vercel.app` as the public deployment target | Resolved 21 September 2026 from Ahmed's production defect report and the observed live deployment; exact deployment access/settings remain unverified |
| D15 | AutoZain exact contribution is omitted until verified | Conservative content default |
| D16 | Ramex V1 demonstrates a complete selected-roll sale, not a partial-roll quantity decrement | Changed 11 September 2026 after pinned-source audit; supersedes the partial-quantity detail proposed under D12 |
| D17 | Support Node `>=22.19.0 <23` and pin `22.23.2` for builds | Changed 11 September 2026 after Phase 01 dependency resolution |
| D18 | Defer further browser testing to Ahmed's manual review after all phases; do not run browser automation again unless he explicitly requests it | Confirmed by Ahmed on 12 September 2026 |
| D19 | Phase 08 is re-authorised to run browser testing, Chromium only; Firefox/WebKit stay an open gap | Confirmed by Ahmed on 12 September 2026; narrows D18 for this phase only |
| D20 | The public origin is supplied at build time through `PORTFOLIO_SITE_URL`; no domain is hard-coded | Implementation of D14 during Phase 08 |
| D21 | Phase 09 explicitly requests browser and HTTP release verification; final-host checks require the selected target. Local checks of the new serving policy are permitted within this phase | Ahmed's Phase 09 request, 12 September 2026; scoped exception to D18 |
| D22 | Prepare a deterministic static bundle, exact build-source snapshot, content-hash validators, and generated Nginx per-path policy while hosting remains unselected | Phase 09 preparation, 12 September 2026; does not select a host or publish the private review Site |
| D23 | Allow a continuous, restrained transform/opacity animation only in the homepage hero accent words and eyebrow rule | Explicitly requested by Ahmed on 16 September 2026; narrow exception to the design spec's general prohibition on infinite ornamental animation |
| D24 | Allow a continuous Ambient Studio background using isolated transform/opacity layers | Explicitly requested by Ahmed on 16 September 2026; narrow background exception that preserves reduced motion and avoids repaint-heavy properties |
| D25 | Replace the subtle grid/orbit background with two clearly visible ambient light fields and one restrained diagonal beam | Confirmed by Ahmed on 16 September 2026 after the first continuous background was judged unclear and visually overcomplicated |
| D26 | Vercel must run the repository-root `npm run build` and publish the merged root `dist/`, not the Astro workspace output | Production repair on 21 September 2026; the shell-only deployment omitted all four `/demos/{slug}/` applications |
| D27 | Adopt a unified Solar Orange Studio palette across all UI states, status badges, and ambient lighting | Confirmed by Ahmed on 21 September 2026 |
| D28 | Multi-layer ambient animated background (grid, organic orbs, horizon beam, cursor spotlight, floating embers) | Explicitly requested by Ahmed on 21 September 2026 |
| D29 | Render all 4 projects as full 2-column featured cards on the homepage with Try Demo; elevate Try Demo to the hero top on case study pages | Explicitly requested by Ahmed on 21 September 2026 |

### D16 evidence and impact

- Date: 11 September 2026.
- Evidence: at Ramex revision `0857f27ae4b9b327fb7f24cd83de038bb0b2ac86`, `backend/src/domain/sales/sales.schemas.ts` has no roll sale-quantity input, `backend/src/domain/sales/lineQuantity.ts` derives quantity from the roll's full length/weight, and `backend/src/domain/sales/invoices.service.ts` snapshots that quantity and marks the roll sold.
- Affected work: `docs/portfolio/source-audit.md`, the Ramex scenario currently described in `docs/portfolio/demo-spec.md`, and Phase 07 (`docs/portfolio/prompts/07-ramex.md`).
- Reason: the previous 7.5 m from 30 m fixture would invent unsupported client behavior. Phase 07 must instead sell one full fictional 30 m roll, show a 30.000 meter invoice snapshot, mark that roll sold/unavailable, and leave a second roll unchanged. A partial-roll demo would require a separately authorized source product change and a new audit.

### D17 evidence and impact

- Date: 11 September 2026.
- Evidence: Phase 01 installed the verified Astro `7.3.2` dependency set. Its resolved `unifont@0.7.5` dependency uses `undici@8.10.2`, which declares Node `>=22.19.0`. The earlier proposed `>=22.12.0` floor therefore produces an engine warning with the actual lock.
- Affected work: root `package.json`, `.nvmrc`, `package-lock.json`, Phase 01 validation, and future local/CI build setup.
- Reason: the repository's declared support range must match the dependencies actually locked. Node `22.23.2` remains within the Node 22 LTS line selected during the audit and satisfies the stricter source boundary already recorded for Roya.

### D18 evidence and impact

- Date: 12 September 2026.
- Evidence: Ahmed explicitly asked Codex not to run another browser test after Phase 03 because he will manually test the portfolio after all phases and report any problems.
- Affected work: Phases 04–09 and any phase prompt or acceptance item that otherwise asks Codex to open a browser, run Playwright, capture browser screenshots, or claim browser coverage.
- Reason: browser review is reserved for Ahmed's final manual pass. Codex should continue non-browser typechecking, production builds, static/asset checks, and focused domain tests, and must record browser gates as deferred rather than passed. A later explicit instruction from Ahmed can re-authorize a specific browser check.

### D19 evidence and impact

- Date: 12 September 2026.
- Evidence: the Phase 08 prompt states that the phase "explicitly requests full visual, keyboard, accessibility, and end-to-end browser testing". This directly contradicts D18, which was written to override exactly that kind of phase instruction. The conflict was raised before work started and Ahmed chose to run the tests with Chromium only, and to record the two missing engines as a gap rather than download roughly 250 MB of additional browser binaries.
- Affected work: Phase 08 only. D18 still governs Phase 09 and any later phase unless Ahmed re-authorises again.
- Reason: the Phase 08 exit gate is unreachable without a browser, and D18's own text allows a later explicit instruction to re-authorise a specific check. Chromium-only keeps the cost proportionate; Firefox and WebKit are recorded as unverified in `docs/portfolio/validation/phase-08.md` §10, not as passed.

### D20 evidence and impact

- Date: 12 September 2026.
- Evidence: D14 leaves the deployment target unselected, but Phase 08 required production metadata, sitemap, and robots behaviour. Hard-coding any placeholder domain would put a false canonical URL into the artifact.
- Affected work: `scripts/site-config.mjs`, `apps/portfolio/astro.config.mjs`, `apps/portfolio/src/layouts/BaseLayout.astro`, `scripts/stage-static.mjs`, `scripts/check-static.mjs`.
- Reason: with `PORTFOLIO_SITE_URL` unset the build stays in preview mode — `noindex,nofollow` on every page, no canonical, no social metadata, a `Disallow: /` robots.txt, and no sitemap. Supplying a valid https origin switches the five public routes to `index,follow` with canonical URLs and emits a sitemap that excludes demo and 404 routes. `check:static` verifies whichever mode is configured, so a half-configured build cannot ship. Demo documents stay `noindex` in both modes. This resolves how the domain is applied; it does not resolve which domain, which stays open under D14.

When a decision changes, append its date, evidence, affected files/phases, and reason. Retain the previous rationale where it helps explain the change. Do not use this document to silently overrule a newer user instruction.

### D23 evidence and impact

- Date: 16 September 2026.
- Evidence: Ahmed explicitly requested that the pictured homepage hero remain in continuous motion.
- Affected work: the `#studio-heading` accent words and the small FULL-STACK DEVELOPMENT rule only.
- Reason: preserve a lively focal point without returning to expensive page-wide repaint work. The exception uses compositor-friendly transforms/opacity, remains disabled by `prefers-reduced-motion`, and does not authorize continuous motion elsewhere.

### D24 evidence and impact

- Date: 16 September 2026.
- Evidence: Ahmed explicitly requested a continuously animated background after approving the hero motion.
- Affected work: the decorative portfolio-shell background only.
- Reason: create an Ambient Studio atmosphere with slowly drifting copper/blue light, a floating grid/point field, and a rotating hairline orbit. Continuous animation stays on nested compositor layers, scroll movement stays on their outer wrappers, and all layers are omitted under `prefers-reduced-motion`.

### D25 evidence and impact

- Date: 16 September 2026.
- Evidence: Ahmed said the grid/orbit version was not clear enough and asked for something visibly animated without becoming overdone.
- Affected work: the decorative continuous background from D24; hero motion remains unchanged.
- Reason: two larger copper/teal light fields and one diagonal beam communicate motion more clearly with fewer visual primitives. The rejected grid, point field, mask, and orbit are removed rather than layered underneath.

### D26 evidence and impact

- Date: 21 September 2026.
- Evidence: Ahmed reviewed the deployed Vercel URL and reported that the demo routes returned 404. Inspection showed Vercel was invoking Astro's standalone workspace build rather than the repository-root build pipeline, omitting the staged `/demos/` static bundles.
- Affected work: `vercel.json` and build orchestration.
- Reason: the repository-root `npm run build` must run `check:assets`, `build:shell`, `build:demos`, `stage`, and `check:static` so the published `dist/` contains both the Astro shell and all four interactive applications.

### D27 evidence and impact

- Date: 21 September 2026.
- Evidence: Ahmed requested making the portfolio primary color exclusively orange, eliminating cyan, mint, and multi-color accents.
- Affected work: `apps/portfolio/src/styles/global.css`.
- Reason: unify the entire portfolio around a pure, cohesive Studio Orange visual identity (`--accent: #ff7043`, `--orange-light: #ffaa40`). All interactive rings, hover states, indices, wordmark accent dot, live production indicators, and ambient light surfaces are consolidated into solar orange and warm amber tones, preserving obsidian dark studio surfaces (`#111516`), crisp contrast (WCAG AAA), and reduced-motion compliance.

### D28 evidence and impact

- Date: 21 September 2026.
- Evidence: Ahmed requested changing the background with good animation in the background.
- Affected work: `apps/portfolio/src/scripts/motion.ts`, `apps/portfolio/src/styles/global.css`.
- Reason: implement a high-end multi-layer animated background comprising: (1) a subtle cybernetic technical grid with dot intersections and gentle pulse masking, (2) multi-layer molten plasma aurora orbs with 3D organic keyframe drifts in solar orange and amber, (3) a sweeping horizon flare beam with chromatic highlights, (4) a butter-smooth 60fps cursor-tracking ambient spotlight (`pointermove` with RAF throttle), and (5) delicate warm micro-embers floating upward. Strictly honors WCAG readability and `prefers-reduced-motion: reduce`.

### D29 evidence and impact

- Date: 21 September 2026.
- Evidence: Ahmed requested "try demo for autozain, roya, ramex outside like vertex erp system", "after i click on the one of those project try demo is the first thing in page", and provided an exact layout screenshot of the featured Vertex ERP card.
- Affected work: `apps/portfolio/src/components/ProjectCard.astro`, `apps/portfolio/src/pages/index.astro`, `apps/portfolio/src/components/CaseStudy.astro`, `apps/portfolio/src/styles/global.css`.
- Reason: (1) Render all four projects (Vertex ERP, AutoZain, Roya, Ramex) directly on the homepage as full featured 2-column cards matching the exact Vertex ERP presentation: title, project deck, distinction summary, key operational capabilities dl list, tech line, screenshot preview (`application-capture` with verified caption), and 3 action buttons: `[ Try demo > ]`, `[ Read case study -> ]`, and `[ View repository ↗ ]`. (2) Elevate "Try demo" to the very top of each case study page inside the hero section directly beneath the title and distinction, paired with a prominent scenario card, ensuring the interactive sample is the first thing users encounter upon opening a project.
