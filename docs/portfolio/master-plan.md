# Ahmed Hossam — Portfolio Master Plan

Version 1.0 · 10 September 2026 · Implementation handoff for Codex

## 1. The outcome

Build Ahmed's primary portfolio for applications to companies and agencies, with freelance platforms as the second use case. A visitor should quickly understand what Ahmed builds, see evidence of substantial work, try a short original-UI demonstration, and find his CV or contact details.

This is a production portfolio specification. The approved Studio Dark page is its visual reference, not a finished production portfolio. Its existing Preview demo explains a proposed flow; it does not run any of the four applications. Actual project screenshots, runnable demos, browser validation, final SEO, and public deployment remain implementation work.

Execute one phase at a time using `phase-roadmap.md` and `prompts/`. Do not implement the entire plan from a single prompt. The user deliberately works through a master plan, bounded execution phases, and a separate Codex prompt for each phase.

## 2. Confirmed decisions

| Item | Decision |
| --- | --- |
| Primary audience | Hiring teams at software companies and agencies |
| Secondary audience | Potential freelance clients |
| Positioning | Full-stack engineer building substantial business applications |
| Visual direction | Studio: introduce Ahmed first, then lead with the strongest project |
| Theme | Dark graphite, light text, restrained copper accent |
| Quality priorities | Clear UX, distinctive UI, credible project evidence, fast delivery to the browser |
| Featured project | Vertex ERP, which is the same project as `ERP-V2` |
| Remaining work | AutoZain, Roya, Ramex, in that order |
| Client applications | All four are deployed for clients; their production sites cannot be used for portfolio demos |
| Demo approach | Copy selected original frontend components into a new portfolio repository and connect them to local sample data |
| Original repositories | Read-only references; no modifications, pushes, migrations, or production configuration changes |
| Delivery | One new repository and one deployable static output containing the portfolio and independent demo builds |

Do not replace the approved design with an unrelated theme or start a fresh design-options exercise.

## 3. Defaults selected for implementation

These are planning decisions, not previously confirmed personal preferences. They allow implementation to proceed without another long interview.

- English portfolio copy; preserve each original application's language and RTL/LTR behavior in its demo. Give English guidance outside an Arabic demo so an international reviewer can follow it.
- A homepage and four shareable project case studies. No separate About page; the introduction and CV cover that need initially.
- Contact through email, with GitHub and CV links. No contact backend, account creation, newsletter, blog, CMS, visitor tracking, or chat widget in V1.
- No theme toggle. The chosen identity is Studio Dark.
- A short guided scenario per project, with local interactions limited to that scenario. Do not expose the full navigation of four ERPs.
- Demo data resets on close/reopen and on an explicit Reset action. No shared visitor state and no account/password required.
- Use real captures from the implemented sample-data demo for project imagery. Until those exist, keep explicitly labeled diagrams; do not manufacture application screenshots.
- The final host/domain are unresolved. Prepare portable static output; resolve the actual deployment target in Phase 09. The private review Site is not automatically the public URL for job applications.

## 4. User journeys and information architecture

### Hiring reviewer

1. Open the homepage from the CV.
2. See Ahmed's name, full-stack role, and business software focus in the first screen.
3. Reach Vertex immediately below the introduction, with a clear reason it is substantial.
4. Open a case study for engineering context or Try demo for a short hands-on experience.
5. Close the demo and return to the same place; download the CV or contact Ahmed.

### Agency or freelance client

1. Scan the four business contexts.
2. Open the project closest to their problem.
3. Understand the business need, Ahmed's contribution, and the delivered workflow without needing to read code.
4. Try the project if useful, then start an email conversation.

The suggested scanning times are design goals, not measured conversion claims. Do not publish claims that this portfolio increases interview or conversion rates.

| Route | Purpose | Rendering |
| --- | --- | --- |
| `/` | Identity, featured Vertex, three further projects, CV and contact | Static HTML |
| `/work/vertex/` | Vertex case study | Static HTML |
| `/work/autozain/` | AutoZain case study | Static HTML |
| `/work/roya/` | Roya case study | Static HTML |
| `/work/ramex/` | Ramex case study | Static HTML |
| `/demos/{slug}/` | Selected original application UI, loaded on demand | Independent static React application |
| `/404.html` | Useful missing-page response with a link home | Static HTML |

Use `#demo={slug}` on the current portfolio/case-study URL for an open demo. The underlying case-study remains a normal linkable page. See `demo-spec.md` for history and close behavior. Direct demo URLs must work independently, display sample-data context, and provide a return link.

## 5. Homepage and case-study content

Preserve the approved homepage's silhouette: compact identity/navigation, a large typographic introduction with a smaller explanatory column, a clear work divider, a prominent Vertex feature, three substantial project rows, and an understated contact footer.

Use the approved introduction as the starting copy:

> From business rules to working software.

> I build web applications for the parts of a business that have to work together: sales, inventory, production, and finance.

A project needs evidence, not a list of every feature. Each case study should contain:

1. Name, business domain, concise scope, and a verified role when available.
2. The operational problem in plain English.
3. One or two original-UI captures with useful captions.
4. Three distinctive capabilities with their practical meaning.
5. Two engineering decisions grounded in source or Ahmed's confirmed account, including a relevant tradeoff.
6. A short description of the demo and its limitations.
7. Technology summary, repository link, and a contact/CV path.

Target roughly 350–600 words per case study, allowing less when that is enough. Do not pad to a word count. `content-and-evidence.md` provides approved facts, proposed copy, and unresolved claims. Do not infer sole ownership, business impact percentages, team size, or exact dates from a README.

## 6. Technical architecture

### Recommended stack

| Area | Decision | Reason |
| --- | --- | --- |
| Portfolio shell | Astro + TypeScript, static output | Build content routes into HTML; keep the reading experience independent of the demos |
| Portfolio styles | Authored CSS with the approved tokens | Carry forward the approved identity with minimal dependencies |
| Portfolio interaction | Small TypeScript controller and native `dialog` | The shell needs modal/history behavior, not a whole application state framework |
| Each demo | Its own React + Vite workspace | Preserve selected source components and keep app styles, routers, and dependency versions separate |
| Demo behavior | Per-app local data adapters and deterministic fixtures | Allow useful interactions without production APIs or databases |
| Shared demo support | Small framework-free TypeScript bridge/contracts | Reuse lifecycle messages without coupling all React versions |
| Package management | npm workspaces for the new repository | One reproducible install and lockfile; app-specific dependencies remain explicit |
| Testing | Existing suitable tools; focused domain tests plus browser journeys | Test meaningful behavior, isolation, navigation, and performance |
| Hosting artifact | Static `dist/` containing the shell and all demo outputs | One deployment; no Node service or database at runtime |

Astro supports static output; Vite supports nested deployment base paths. This stack selection is an engineering recommendation for this portfolio, not a claim that other frameworks cannot perform well. Choose compatible stable releases during Phase 00/01, record the versions, and commit the lockfile. Do not guess future version numbers. [Astro configuration](https://docs.astro.build/en/reference/configuration-reference/) · [Vite production builds](https://vite.dev/guide/build.html)

Do not install a React integration in the shell unless a concrete shell component actually needs it. The demo frames can use React without hydrating the portfolio. Preserve source JavaScript where appropriate; new adapters/contracts should use TypeScript. Do not turn extraction into a full source-language migration.

### Repository layout

| Path | Responsibility |
| --- | --- |
| `docs/portfolio/` | This plan, specs, phase prompts, source evidence, and validation reports |
| `AGENTS.md` | Project-level execution guardrails, merged with any existing instructions |
| `STATE.md` / `DECISIONS.md` | Current phase, evidence, unresolved items, and recorded decisions |
| `design-reference/studio-dark/` | Read-only exported approved HTML/CSS/JS and current CV |
| `apps/portfolio/` | Astro pages, reusable layouts, content records, public assets |
| `apps/demo-vertex/` | Selected Vertex UI, its local services and fixtures |
| `apps/demo-autozain/` | Selected AutoZain UI and simulated local contact workflow |
| `apps/demo-roya/` | Selected Roya UI and bounded financial/planning scenario |
| `apps/demo-ramex/` | Selected Ramex UI and roll-specific sales scenario |
| `packages/demo-contract/` | Framework-free bridge types and validation helpers |
| `scripts/` | Explicit build/staging/asset checks |
| `tests/` | Cross-app browser journeys and deployment checks |
| `dist/` | Generated, deployable static output; never the source of truth |

Keep temporary source checkouts outside the new repository or in a specifically ignored local directory. Never publish full client source archives, environment files, uploads, database exports, or build credentials under a public folder.

### Build contract

1. Build the portfolio into its own output directory.
2. Build only implemented demos into their respective output directories with a fixed public base `/demos/{slug}/`.
3. Recreate the repository-root `dist/`; copy the portfolio output first, then each demo into `dist/demos/{slug}/`.
4. Validate that every enabled demo manifest entry has an `index.html` and that asset URLs resolve under its prefix.
5. Never let one build delete another application's output. Do not point multiple bundlers at the same output directory.

Prefer an in-memory router for the short embedded scenario. Do not create server-dependent deep routes inside each demo. If source dependencies require a router, adapt the selected route table rather than shipping the complete production router. Test direct loading of each `/demos/{slug}/` index.

### Development and integrated preview

Provide a shell development command and per-demo standalone development commands. Also provide a root `preview:all` command that serves the fully built, merged `dist/` from one origin. Use that combined production preview for iframe integration, header, and network testing. A standalone Vite development server on another port is useful for editing a component, but it is not evidence that the same-origin host contract works. Do not loosen production origin checks or network policy to accommodate development ports. If hot-reloading every app together later becomes necessary, add a documented same-origin development proxy only for that concrete need.

## 7. Demo architecture and scope

The portfolio and demos live in one repository and one deployment, but they are separate builds. A demo gets an iframe only after the visitor explicitly opens it. Static screenshots must not preload the application bundles. Closing destroys the frame and clears session resources.

This avoids CSS/router collisions while keeping the homepage small. It does not automatically make same-origin application code a security boundary or remove all extraction work. A frontend that relies on backend rules still needs a carefully bounded local implementation of the selected interactions.

| Project | Initial scenario | What it should demonstrate |
| --- | --- | --- |
| Vertex | Recipe → material consumption → finished stock/cost | Connected production logic rather than another generic POS screen |
| AutoZain | Buyer request → staff acceptance → request outcome | The relationship between the marketplace and staff operations |
| Roya | Change shooting weeks → inspect budget impact | Production-specific planning and financial consequences |
| Ramex | Select a roll → sell a quantity → inspect remaining stock/invoice snapshot | Domain-specific inventory and quantity handling |

Each scenario is proposed and must be checked against the exact source revision. Do not promise that a component can be extracted until its dependencies and business rules are mapped. The corresponding phase must preserve an original UI route/component, implement meaningful local interaction, and show a consistent result. Click-through descriptions are not completed demos.

Roya's approvals, event-sourced history, and historical replay belong in the case study. A second interactive replay/approval scenario is an extension after the first four bounded demos pass; it is not required to build the first release. Likewise, AutoZain's CFO path is evidence in its case study, not an instruction to simulate its entire back office.

The full contract, scenario data, adapter behavior, iframe lifecycle, and limitations are in `demo-spec.md`.

## 8. Performance, accessibility, and reliability

Use `acceptance-checklist.md` as the executable quality bar. Its numbers are project targets, not existing measurements or automatic guarantees. Keep the shell fast before optimizing application code the visitor may never open.

- The portfolio must remain readable and navigable without JavaScript; demo entry points should explain that JavaScript is needed when unavailable.
- Primary controls have clear names, keyboard focus, touch targets, and appropriate loading/error feedback.
- Application language and direction are scoped to the frame. The surrounding portfolio stays in English.
- Test real interaction across the iframe boundary, including Escape, focus return, reset, Back/Forward, and repeated open/close.
- Local demo updates must reconcile across the screens used by the scenario. Unsupported actions fail clearly inside the sample experience rather than quietly issuing real requests.
- Content and asset dimensions should prevent avoidable layout jumps.
- Do not report field performance from a local Lighthouse run. No browser QA or runtime performance measurements have yet been performed on the approved design reference.

## 9. Deployment and SEO

The final output can be served as static files. Default operational recommendation, if Ahmed wants to reuse his VPS workflow: a separate portfolio service behind his existing reverse proxy, with a static web server and independent deployment. Do not alter client applications or their headers. A different static host is acceptable if selected in Phase 09; keep the same output contract.

The production domain, canonical URL, HTTPS routing, and deployment access must be resolved before public publication. Prepare the release first. Ask only for missing deployment-specific information at that point; do not invent a domain or assume access.

Requirements:

- Root and every case-study route load directly and after refresh.
- Real HTTP 404 behavior for missing pages/assets, without a catch-all that silently returns the portfolio HTML for demo scripts.
- Fingerprinted assets get long-lived immutable caching; HTML is revalidated. The CV uses its own sensible cache policy and a stable download path.
- Stage reviews privately. Keep preview `noindex`; enable indexable metadata on the public release and keep `/demos/` out of the sitemap and marked `noindex`.
- Unique page titles/descriptions, final canonical URLs, favicon, sitemap, and robots rules. Do not ship the private review URL as a production canonical.
- No fabricated structured-data reviews, employer relationships, or results. Social-sharing artwork is optional future work, not a release blocker.
- Export behavior, if any remains in a demo, must generate only sample documents locally. Otherwise exclude that action from the selected route.
- Preserve a previous deployable artifact and write a rollback procedure.

## 10. Delivery phases and stopping rules

The order is fixed in `phase-roadmap.md`: source/design audit; foundation; portfolio/case studies; demo host; Vertex; AutoZain; Roya; Ramex; final QA; release.

Every phase prompt must cause Codex to inspect the actual repository, read the relevant specs and current state, implement only that phase, validate its exit criteria, and update the state files. A phase is not complete because code exists or a build succeeds.

If a selected demo requires too much unrelated production machinery, first narrow the scenario while preserving a meaningful original UI flow. Record the dependency problem and the feasible scope. If even that cannot work, report the blocker explicitly; do not quietly substitute a fake dashboard, static slides, or a public client login. Continue independent authorized work where possible, but do not mark the affected demo or the full release complete.

The exact AutoZain contribution, permission for any non-code client branding/assets, and final domain are not currently established. Use the conservative content defaults in `content-and-evidence.md`; these do not block the foundation or interface work. Source access or an unavailable required UI component can block the corresponding demo phase.

## 11. Definition of done

The release is complete when the approved Studio Dark identity is carried through a responsive portfolio, all four case studies contain grounded evidence, all four selected original-UI demos perform their documented local scenarios, the CV/contact paths work, quality gates have recorded evidence, and the chosen public URL has been verified from a fresh visitor session. Any exception must be stated to Ahmed; it must not be hidden behind a success message.

The handoff must include reproducible setup/build commands, source provenance for extracted files, a maintenance guide for adding a project, and the exact test/deployment evidence. The user remains in control of the phase sequence; do not auto-run the next prompt.
