# Phase 02 validation — portfolio and case studies

Validation date: 12 September 2026

## Delivered scope

- Completed the Studio Dark homepage with Ahmed's identity and positioning, the featured Vertex production story, distinct AutoZain/Roya/Ramex project rows, CV links, and contact footer.
- Added static `/work/vertex/`, `/work/autozain/`, `/work/roya/`, and `/work/ramex/` case studies with unique metadata, ordinary anchors, direct-refresh support, Back to work navigation, business context, verified contributions where available, capabilities, engineering decisions, technology, repository, CV, and contact paths.
- Omitted an AutoZain role/contribution claim because it remains unconfirmed.
- Added a useful generated `404.html`; the local production preview serves it with status 404 for missing paths.
- No original-UI captures were available. Vertex retains the approved labeled workflow diagram and every case study uses a clearly labeled explanatory system-flow diagram. No diagram is described as application UI.
- No Try demo or prototype Preview demo control is rendered. Every project remains `demoAvailable: false` and no `/demos/` asset is referenced.

## Build and static checks

| Check | Result |
| --- | --- |
| `npm run typecheck` under Node `22.23.2` / npm `11.1.0` | Pass: 14 files, 0 errors, 0 warnings, 0 hints. |
| `npm run clean` then `npm run build` under Node `22.23.2` / npm `11.1.0` | Pass: six static pages built and staged. |
| Asset integrity | Pass: the public CV and favicon still match the approved reference copies byte-for-byte. |
| Generated route/metadata checks | Pass: homepage, four case studies, and 404 exist; titles and descriptions are unique; every page is `noindex,nofollow`; no canonical is configured. |
| Public evidence/demo boundary | Pass: no internal evidence marker, TODO text, unavailable demo action, eager demo path, or selected internal source path is present in generated HTML. |
| Local asset paths | Pass: generated CSS, favicon, and CV paths resolve in `dist/`. |

## Browser validation

Tool: headed Chromium controlled through Playwright CLI against the merged production preview at `http://127.0.0.1:4323`.

| Check | Result |
| --- | --- |
| Direct routes and refresh-safe HTML | Pass. `/`, all four `/work/{slug}/` routes, and a missing path were requested directly. Project pages returned 200 with their unique titles; the missing path returned the designed page with status 404. |
| Responsive/overflow matrix | Pass in Chromium at 360×800, 390×844, 768×900, 1024×900, and 1440×1000 for the homepage, all four case studies, and 404. Document `scrollWidth` did not exceed `clientWidth`. |
| Visual inspection | Pass for the homepage and each case study across representative mobile, tablet, and desktop captures. Studio Dark hierarchy, metadata, diagrams, project distinctions, controls, and footer remained readable without overlap or clipped headings. |
| 200% text enlargement | Pass for the homepage and all four case studies using a 32px root font in a 1440×1000 Chromium viewport. No page-level overflow or clipped link target was measured. |
| Keyboard traversal | Pass on the complete AutoZain case-study path. Focus order followed skip link → identity/navigation → Back to work → project actions → footer links; every focused link showed a solid focus outline. Main control/link target heights measured 44–68 CSS pixels. |
| Ordinary navigation/history | Pass. The homepage AutoZain row navigated through its real anchor; browser Back and Forward returned to the expected pages and titles. |
| Reduced motion | Pass. With `prefers-reduced-motion: reduce`, computed root scroll behavior was `auto`; the global reduced-motion rule also removes optional transitions and animations. |
| CV/contact/repository paths | Pass through generated-link inspection and static HTTP/asset checks. CV links use the unchanged local PDF; mail and repository links retain normal browser URLs. |

## Visual artifacts

Artifacts are under `output/playwright/phase-02/`:

- Homepage: `home-360.png`, `home-768.png`, `home-1440.png`, `home-text-200.png`
- Vertex: `vertex-390.png`, `vertex-1440.png`, `vertex-text-200.png`
- AutoZain: `autozain-390.png`, `autozain-1024.png`
- Roya: `roya-390.png`, `roya-1440.png`
- Ramex: `ramex-390.png`, `ramex-1024.png`

## Limitations and deferred gates

- No safe original-UI project capture exists yet. The diagrams are deliberately explanatory and labeled as not being screenshots or substitute demos. Demo phases will provide original-UI captures only after the selected local flows are implemented and verified.
- Firefox and WebKit were not exercised in this phase. Cross-browser, automated accessibility, performance-budget, and broader release testing remain Phase 08 work; no pass is claimed for those gates.
- The work stayed local. No host, public domain, canonical value, client service, or client repository was changed.

## Exit gate

Phase 02 passes its exit gate: the homepage and all four static case studies are useful without a demo, maintain the approved Studio Dark identity, use credible source-grounded evidence, and remain navigable with ordinary links and keyboard controls.

Next prompt: `docs/portfolio/prompts/03-demo-host.md`.
