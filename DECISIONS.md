# Portfolio decision log

## Current branch decisions — `tantawy`, 6 October 2026

- **D30 — Owner and scope:** The current user explicitly requested adapting the existing portfolio to **Yousef Fahim Amin** on the exact branch `tantawy`. His GitHub profile is `https://github.com/youseffahem`; his requested focus spans backend, AI/ML, and embedded systems. This supersedes historical owner/project/publication choices for this branch. Studio Dark and existing dependency versions remain.
- **D31 — Evidence and presentation:** Use seven of Yousef's projects, led by RealEstate. Where the profile README differs from actual source, prefer the source and document the discrepancy in `docs/portfolio/yousef-source-audit.md`. Gym App is a Flutter prototype; HeartGuard is an educational model study. Retain the exact RealEstate collaborator credit “Ahmed” without inferring a surname or identity. Training is not employment; no language-proficiency level is published because the supplied CVs differ.
- **D32 — Publication boundary:** No Yousef original-UI demo has been built or exercised. Publish case studies, repository links, and explicitly labeled architecture diagrams. Archive the previous public CV/screenshots and obsolete UI components outside the served tree; exclude all historical demo workspaces from build/staging/dev serving. Preserve their source and notices. This supersedes D04/D11/D12/D26/D29 where they require the original owner's projects or demos.
- **D33 — CV and target:** Use the unchanged updated PDF from the user's supplied Drive folder, whose displayed name matches his confirmation. Serve it as `/Yousef_Fahim_Amin_CV.pdf`; verify SHA256 `474d6fdbd294d6de8a4aa8b7ab5324e4d08386d18446e47200c79131917f2650`. No public target for Yousef has been selected; D14 does not authorize using Ahmed's Vercel site. Keep preview indexing and leave the original Git remote unchanged. No push or deployment was requested.
- **D34 — Validation:** The standing prohibition on unrequested browser QA remains. Default `npm run verify` runs type/build/static checks; historical browser suites must not run or be represented as validation of this branch. Source review and HTTP/file checks are distinct from visual, keyboard, accessibility, network, and performance browser evidence.

### D35 — SpaceDrums source and scope (6 October 2026)

The owner authorized an eighth case study before Phase 12, sourced exclusively from `https://github.com/youseffahem/air_drum_project`. The inspected public revision is `f5754e16c32632e506ed25f804755e8fbd358064`. After the source mismatch was raised, the owner confirmed that the fingertip version is local and unpushed and approved describing the public drumstick-endpoint implementation. Mention the local iteration only as **in development**, with no invented public revision or implementation claims. Supersedes D31's project count: retain RealEstate first and feature SpaceDrums second, followed by the existing work. No original-UI demo, metrics, physical acceptance, commit, push, deployment, or Phase 12 execution is authorized. Affects project content/evidence, case-study detail sections, homepage grouping, route manifest and source/validation documentation.

### D36 — Scoped browser review authorization (6 October 2026)

The owner explicitly requested an interactive desktop/mobile visual review before Phase 12 and allowed only obvious visual/functional fixes. This supersedes D34's deferral for this pass only. Keep the existing content/design; correct demonstrated anchor occlusion in CSS. Record actual browser coverage and unverified live reduced-motion/real-device coverage separately from Node checks. The request does not authorize Phase 12, a commit, push or publication. Future browser work still follows the owner's current authorization.

### D37 — Phase 12 owner feedback (6 October 2026)

The owner approved Phase 12 for final feedback and polishing only, specifically a shorter, scannable SpaceDrums case study that retains technical depth. Keep SpaceDrums second, the published drumstick-endpoint versus unpublished local fingertip distinction, repository-grounded claims, Studio Dark and the unchanged CV. Consolidate repeated explanations within the existing layout; no new product feature or design direction is authorized. Run non-browser checks and return for final manual approval. No subsequent phase, commit, push, deployment or publication is authorized by this scoped work.

### D38 — Selected Work background refinement (6 October 2026)

The owner requested a background-only refinement for Featured Projects / Selected Work: layered charcoal, restrained orange/brown ambience and approximately 5–10% subtle glass transparency. Scope the CSS to the existing homepage card group and its large cards; preserve layout, typography, spacing, content, motion, controls, other sections and Studio Dark. Use static gradients and background alpha, without new blur, particles, markup or global token changes. The referenced attachment was unavailable, so the written direction governs this pass. No branch creation, commit, push or publication is authorized.

### D39 — Applied ML/CV and academic background (3 November 2026)

The owner's new CV and explicit source hierarchy supersede D30/D31/D35/D37 where they retain broad backend-first positioning, older personal details, project order or the unpublished-fingertip distinction. Lead with applied machine learning and computer vision for academic reviewers and technical recruiters. Feature Space Drums, HeartGuard AI, RealEstate in that order; keep the remaining five studies compact. Retain the short name, put the full CV name and self-reported education/training/languages in dedicated academic background, and separate project-supported skills from CV-listed familiarity. Source review pins Space Drums at `e1964f4a198cbbf916b1bf891b84077c7f318b3f` and keeps offline experiments/data distinct from unresolved physical research outcomes. HeartGuard notebook methodology and its limitations are now explicit. See `docs/portfolio/academic-positioning-review.md`.

The owner's later Arabic correction explicitly forbids master's-study interest in website copy. Keep academic interests without an admission, enrollment or master's-intent statement. Preserve Studio Dark and dependency choices; no browser QA, commit, push or deployment is authorized.

### D40 — Explicit CV replacement approval (3 November 2026)

The owner first requested comparison and a review-only proposal, then explicitly requested using the attached new CV instead of the old download. This supersedes D33's old checksum and the review-only boundary. Copy `D:/Yousef_Fahim_CV.pdf` unchanged to the existing `/Yousef_Fahim_Amin_CV.pdf` path; expected SHA256 is `6ee685289ba4a19049e7313611b449d0f41486708c75179dbca7f777c0469d15`. The comparison is documented; phone, GPA, classification and the document's declaration are not added to webpage HTML. The approved unchanged PDF retains its original contents. This authorizes local replacement, not a deployment or a host change.

### D41 — Project-specific visual identities and richer motion (3 November 2026)

The owner explicitly requested a stronger portfolio layout, colors that express each project, substantially richer animation/transitions and a much better logo. This supersedes D27's uniform orange project palette and D37/D38's layout/background-only restrictions for this bounded Phase 12 follow-up. Preserve the Studio Dark graphite frame, orange personal identity, serif/sans contrast and verified November content/order. Introduce a drawn YF monogram; give all eight projects scoped palettes and authored, explicitly labeled SVG concept illustrations. Use distinct visual chapters for the three featured studies, an early project index, compact further-work rows and section links in the case studies. Keep dedicated academic background.

Motion includes viewport-aware project illustrations, reveals, parallax, hover feedback and progressive native page transitions. Provide a Pause/Resume control with optional tab-session persistence and honor runtime reduced-motion changes; the page remains readable without JavaScript or animation APIs. No animation framework or new dependency is needed. These conceptual visuals are not evidence of application execution, clinical performance, participant results or an original-UI demo. Validation remains non-browser, and delivery remains local on `tantawy`; no publication is authorized.

Affected files: portfolio presentation components, scoped `project-identity.css`, motion controller/tests, favicon and its asset identity check. Content records, CV and dependencies remain unchanged. Actual checks and limitations are recorded in `docs/portfolio/validation/phase-12.md`.

### D42 — Additional animation across the portfolio (3 November 2026)

After D41's project-specific redesign, the owner explicitly requested much more animation for the portfolio generally. Extend the motion vocabulary to the introduction, ambient background, navigation, section headings, academic skills/training, controls and footer. Preserve content, project palettes/order, logo, local-only delivery and the unchanged CV. Keep animation optional, scene-aware and subordinate to the existing manual pause/OS preference; suspend work while the document is hidden and avoid touch-driven pointer effects. No framework or dependency changes, browser QA or publication are authorized. Affects `Hero.astro`, layout CSS imports, new `site-motion.css`, the existing motion controller and its lifecycle tests; validation is in the latest Phase 12 addendum.

### D43 — View-only CV from the owner's Google Drive (3 November 2026)

The owner asked to remove Download CV and keep only Open CV, pointing to `https://drive.google.com/file/d/1HyJ6ZVG2oKNNknmskzUYkgvbSr7VIrm8/view?usp=drive_link`. This supersedes D40's linked download, not its approved CV content. The Drive file is publicly reachable and byte-identical to the D40 PDF (SHA256 `6ee68528…0469d15`). Every Open CV link (hero, footer, case-study actions) opens in a new tab with `noopener noreferrer`. No page publishes a `download` link. The verified local PDF is still served unlinked at `/Yousef_Fahim_Amin_CV.pdf`, so existing release checks keep their target. Removing it needs a separate owner request. `portfolioCv.viewUrl` in `scripts/portfolio-config.mjs` is the single source for the link. The dev server binds to `127.0.0.1` because IPv4 clients could not reach the IPv6-only default.

### D44 — Pointer-reactive Saturn in the ambient background (3 November 2026)

The owner asked for Saturn in the background with powerful animation: a strong reaction when the mouse comes close and a more intense one when it is directly over the planet, while fitting the existing design. Saturn is added as one more decorative layer of the fixed D42 ambient background. It uses the Studio orange/amber palette as a dark, backlit planet so text crossing it stays readable at rest. Its rings are split at the major axis to pass behind and in front of the planet. At rest it has flowing ring particles, rotating cloud bands, two moons on inclined orbits, glints, a breathing halo, a gentle float and scroll-linked rise and ring opening. Pointer geometry, not DOM hover, drives three states, because all content stays above it. **Near** (within about one Saturn width) gives magnetic pull and lean, halo/rays, ring shockwaves, a racing ring comet, some sparks and about 2.2× loop speed. **Over** (on the planet or rings) gives a flare, surging waves, full sparks, ignited atmosphere/rim and about 4.5× speed. Touch never drives it. It exists only while motion runs, so the manual pause, OS reduced motion and hidden-tab suspension still govern it. It uses the existing scroll and pointer frames and adds no new loop, dependency or content change. This supersedes the historical no-mouse-follow/no-ornamental-loop guidance for this layer only. Affects `motion.ts`, new `saturn.css`, the layout import and the motion lifecycle tests.

### D45 — Saturn as the hero centerpiece in a space scene (3 November 2026)

The owner supplied a mockup and notes. Saturn becomes the central interactive element with glowing rings and 3D detail. It moves and reacts to proximity, with a strong glow on hover. Orbits and glowing particles move at different speeds. Stars and particles respond subtly to the mouse. Project cards glow on hover in their own colours. Fonts and white/orange contrast are unchanged, and animation stays subtle while browsing and intensifies during interaction.

Implementation:
- **Hero:** wide screens use three zones (headline | Saturn | introduction). The desktop headline size is reduced to make room. On tablets Saturn sits above the introduction; on phones, between the headline and the introduction.
- **Hero planet:** a lit planet in its own text-free grid area, with orbits and motes centred on it and a "Saturn · Computer Vision" label that follows the pointer while over it. It is static markup, shown still when motion is paused or reduced.
- **Background planet:** the D44 planet now shares one `Saturn.astro` source through a `<template>`. It is lit but deliberately distant (resting opacity 0.28 → 0.22), so text crossing it stays readable. The mockup's brighter background planet was not reproduced for that reason.
- **Background:** the D28 technical grid is replaced by three pointer-parallax star depths, glowing dust, two occasional shooting stars and a faint nebula lane.
- **Project index:** links become separate cards with a glow and subject glyph in each project's colour. Featured chapters gain a subtle colour glow on hover.
- **Not adopted from the mockup:** carousel controls; the "Model & Architecture" label (the source-reviewed "Backend & architecture" stays); other cosmetic differences.

Content, project order, dependencies and the CV are unchanged. Affects `Saturn.astro`, `Hero.astro`, `WorkIndex.astro`, `BaseLayout.astro`, `motion.ts`, `saturn.css`, new `space-scene.css`, removed rules in `site-motion.css`/`global.css`, and the motion tests.

## Historical decisions

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
