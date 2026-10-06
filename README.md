# Yousef Fahim Amin — Portfolio

Yousef's software engineering portfolio, personalized on branch `tantawy` from the existing Studio Dark portfolio. It covers backend development, applied machine learning, computer vision, mobile interfaces, and embedded systems.

## Run locally

Use Node **22.23.2** and npm **11.1.0**, as pinned in `.nvmrc` and `package.json`.

```sh
npm ci
npm run dev
```

```sh
npm run typecheck
npm run build
npm run preview:all
```

`npm run verify` performs non-browser type checks, motion lifecycle regression tests, and a complete build/static check. `npm run test:motion` runs the focused Node tests by themselves. These tests use event/DOM doubles; they do not establish rendered layout or browser accessibility. Browser review requires explicit owner authorization; the scoped interactive pass is recorded in `docs/portfolio/validation/phase-11-visual-review.md`. Historical `verify:*` browser scripts target the original portfolio and are not evidence for this branch.

## Content

- `apps/portfolio/src/content/profile.ts`: identity, contacts, CV path, skills, and training data.
- `apps/portfolio/src/components/Background.astro`: introduction and education presentation.
- `apps/portfolio/src/content/projects.ts`: eight project records and case studies; RealEstate leads, followed by SpaceDrums. Featured flags select five full cards, with three further projects below.
- `apps/portfolio/src/content/project-evidence.server.ts`: internal source revisions and limits.
- `scripts/portfolio-config.mjs`: active route/asset manifest and verified CV checksum.
- `docs/portfolio/yousef-source-audit.md`: profile-versus-source review and conservative content decisions.
- `docs/portfolio/validation/phase-10.md`: checks performed and remaining limitations.
- `docs/portfolio/validation/phase-11.md`: review corrections and their non-browser validation.
- `docs/portfolio/spacedrums-source-audit.md` and `docs/portfolio/validation/phase-11-spacedrums.md`: the bounded SpaceDrums addition, source evidence and local checks before Phase 12.
- `docs/portfolio/validation/phase-11-visual-review.md`: the subsequently authorized interactive browser review, anchor fixes, screenshots and remaining live reduced-motion coverage gap.
- `docs/portfolio/validation/phase-12.md`: completed owner-feedback polishing, shorter SpaceDrums case study, validation and final manual approval handoff.

The build produces the homepage, eight case studies, and a 404 page. Project diagrams are labeled explanations. No original-UI demos have been implemented for Yousef's projects; the build excludes the previous owner's demos entirely.

SpaceDrums is grounded in the public drumstick-endpoint implementation at revision `f5754e16c32632e506ed25f804755e8fbd358064` of `youseffahem/air_drum_project`. The owner also described an unpushed local fingertip iteration that is still in development; it was not independently inspected and has no invented public branch or commit link. Source, test-presence, attribution, and physical-validation limits are recorded in the source audit.

The unchanged CV is copied from the supplied public Drive folder. Skills and background come from that document and the supplied GitHub profile. Where profile claims conflict with project source, public copy follows the source. Education and training are not presented as employment.

## Publishing

Without `PORTFOLIO_SITE_URL`, the artifact stays `noindex` and has no canonical or sitemap. A public build requires Yousef's selected HTTPS origin. The existing Git remote belongs to the original portfolio; this work neither changes it nor publishes to its Vercel project.

Original demos, notices, and historical phase records remain for provenance. Previous public assets and obsolete components are retained under `archive/` and are never staged into `dist/`. Historical plans describe the original owner; Phase 10 governs this branch.
