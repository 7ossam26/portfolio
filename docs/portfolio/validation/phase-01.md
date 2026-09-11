# Phase 01 validation — foundation

Validation date: 11 September 2026

## Delivered scope

- Created an npm workspace with an Astro/TypeScript shell, four dependency-free reserved demo packages, and a reserved framework-free demo-contract package.
- Ported the approved Studio Dark navigation, first-screen hero, Vertex feature, workflow diagram, contact controls, tokens, responsive rules, focus treatment, and reduced-motion behavior.
- Added typed public content for Vertex, AutoZain, Roya, and Ramex. Internal source revisions, source paths, and claim notes live in `project-evidence.server.ts` and are not rendered.
- Copied the approved favicon and CV unchanged into the shell's public assets.
- Added atomic root staging, merged-output preview, asset-integrity, and generated-HTML checks. Empty demo workspaces are neither built nor staged.

## Runtime and resolved versions

Registry metadata was queried again on 11 September 2026 with `npm view` before installation.

| Item | Recorded result |
| --- | --- |
| Supported Node range | `>=22.19.0 <23`; `.nvmrc` pins `22.23.2` |
| Package manager | npm `11.1.0`; lockfile version 3 |
| Astro | `7.3.2` |
| Astro's resolved Vite | `8.3.0` |
| `@astrojs/check` | `0.9.10` |
| TypeScript | `6.0.3` |
| Compatibility change | The fresh lock resolved `undici@8.10.2`, whose engine is Node `>=22.19.0`; this is why D17 raises the earlier `>=22.12.0` floor. |

The workstation default is Node `22.12.0`, so direct npm installation reports an engine warning. The clean build below ran through Node `22.23.2` and npm `11.1.0` using temporary `npx` tool resolution; the repository does not vendor that runtime.

## Automated checks

| Check | Result |
| --- | --- |
| `npm run typecheck` under Node `22.23.2` | Pass: 10 files, 0 errors, 0 warnings, 0 hints. |
| `npm run clean` then `npm run build` under Node `22.23.2` / npm `11.1.0` | Pass: one static route built, atomically staged into root `dist/`. |
| `npm run preview:all -- --port 4322` | Pass: served the merged root output at the requested port; `/` returned `200 text/html` with the final 5,564-byte document. |
| Asset integrity | Pass: public CV and favicon SHA-256 values match the approved reference files byte-for-byte. CV hash remains `8997A9D85D6B9B2B03A7CC8011AFB51BF1EE02475FFEA829133351C2EC3074E8`; favicon remains `046DDA39DCD3F3C4691C48AA0ADE75823DF9FF66223EA17595B186E8DC9A2FF9`. |
| Generated metadata/paths | Pass: approved title, preview `noindex,nofollow`, local favicon, local CV, and email link are present; no canonical is generated. |
| Public evidence boundary | Pass: selected internal commit/path/claim markers are absent from generated HTML. |
| Demo startup boundary | Pass: generated HTML has no demo asset URL; browser startup loaded only `/`, the shell CSS, and `/favicon.svg`. No script loaded. |
| Static asset HTTP checks | Pass: `/Ahmed_Hossam_CV.pdf` returned `200 application/pdf` with 47,156 bytes; `/favicon.svg` returned `200 image/svg+xml` with 229 bytes. |
| Initial shell size (informational) | HTML 5,564 bytes raw / 2,045 gzip; CSS 12,796 bytes raw / 3,328 gzip; initial JavaScript 0 bytes. |

## Browser inspection

Tool: Playwright CLI `0.1.19`, headed Chromium with user agent Chrome `152.0.0.0`, against `npm run preview:all` at `http://127.0.0.1:4321`.

| View/check | Result | Artifact |
| --- | --- | --- |
| Desktop, 1440×1000 | Pass. Studio Dark identity/navigation, large split hero, copper serif emphasis, work divider, and two-column Vertex feature match the approved hierarchy; no overlap was observed. | `output/playwright/phase-01/desktop-1440x1000.png` |
| Mobile, 390×844 | Pass. Header, hero, actions, divider, and Vertex opening reflow without clipping. Browser measurement returned document `scrollWidth=376` and `clientWidth=376`, so there was no page-level horizontal overflow. | `output/playwright/phase-01/mobile-390x844.png` |
| Keyboard focus | Pass for the requested limited first-screen check. The first Tab exposes the skip link with a high-contrast focus outline. | `output/playwright/phase-01/mobile-focus-390x844.png` |
| Reduced motion | Pass. With `prefers-reduced-motion: reduce`, computed root scroll behavior was `auto` and link transition duration was `0s`. |
| Essential paths | Pass. `Explore my work` navigated to `#selected-work`; snapshot inspection confirmed the CV, mailto, repository, home, and GitHub hrefs. The browser began the CV download and the direct HTTP asset check passed. |
| Console | Pass: zero warnings or errors during the initial desktop load. |

## Limitations and deferred gates

- This phase performed the explicitly requested limited visual check in Chromium at one desktop and one mobile width. Firefox, WebKit, the remaining acceptance widths, 200% enlargement, full keyboard traversal, and automated accessibility scanning remain Phase 08 coverage; no pass is claimed for them here.
- No case-study routes or runnable demos exist yet by phase design. The sole project action is a working repository link; there is no control that suggests a demo can launch.
- The work was local only. No host, canonical domain, external service, or client repository was changed.

## Exit gate

Phase 01 passes its exit gate: the static shell builds reproducibly under the supported runtime, visibly follows Studio Dark, uses grounded content and unchanged assets, exposes working essential links, and starts with no demo runtime.

Next prompt: `docs/portfolio/prompts/02-portfolio.md`.
