# Yousef Fahim Amin — Portfolio

Yousef's portfolio on branch `tantawy`, preserving the existing Studio Dark design. It focuses on applied machine learning and computer vision for academic reviewers and technical recruiters, with dedicated academic background and source-supported project evidence.

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
- `apps/portfolio/src/components/Background.astro`: academic background, interests, project-supported skills and CV-listed familiarity.
- `apps/portfolio/src/content/projects.ts`: eight project records; Space Drums, HeartGuard AI and RealEstate form the three featured cards, with five compact further-work rows.
- `apps/portfolio/src/content/project-evidence.server.ts`: internal source revisions and limits.
- `scripts/portfolio-config.mjs`: active route/asset manifest and verified CV checksum.
- `docs/portfolio/yousef-source-audit.md`: profile-versus-source review and conservative content decisions.
- `docs/portfolio/validation/phase-10.md`: checks performed and remaining limitations.
- `docs/portfolio/validation/phase-11.md`: review corrections and their non-browser validation.
- `docs/portfolio/spacedrums-source-audit.md` and `docs/portfolio/validation/phase-11-spacedrums.md`: the bounded SpaceDrums addition, source evidence and local checks before Phase 12.
- `docs/portfolio/validation/phase-11-visual-review.md`: the subsequently authorized interactive browser review, anchor fixes, screenshots and remaining live reduced-motion coverage gap.
- `docs/portfolio/validation/phase-12.md`: owner feedback, including the November positioning follow-up and its non-browser validation.
- `docs/portfolio/academic-positioning-review.md`: latest CV comparison, source hierarchy, discrepancy resolutions and project audit.

The build produces the homepage, eight case studies, and a 404 page. Project diagrams are labeled explanations. No original-UI demos have been implemented for Yousef's projects; the build excludes the previous owner's demos entirely.

Space Drums is grounded in revision `e1964f4a198cbbf916b1bf891b84077c7f318b3f` of `youseffahem/air_drum_project`. The source implements fingertip, ordinary-stick and red-tip modes, multiple layouts and an AR view. Offline LightGBM/PyTorch experiments are separate from the reactive application; synthetic/developer data do not establish participant results or physical latency improvements. HeartGuard's case study describes PCA/RFE, model comparison, the interface and observed evaluation limitations.

At the owner's explicit follow-up request, the download now serves the unchanged `D:/Yousef_Fahim_CV.pdf` attachment under the existing local URL. The latest CV supplies stated personal background; implementation and saved artifacts supply technical evidence. None is independently verified credentials. Master's-study interest is omitted from website copy; the approved PDF retains its original content. Phone, GPA, classification and the declaration are not copied into HTML.

## Publishing

Without `PORTFOLIO_SITE_URL`, the artifact stays `noindex` and has no canonical or sitemap. A public build requires Yousef's selected HTTPS origin. The existing Git remote belongs to the original portfolio; this work neither changes it nor publishes to its Vercel project.

Original demos, notices, and historical phase records remain for provenance. Previous public assets and obsolete components are retained under `archive/` and are never staged into `dist/`. Historical plans describe the original owner; the current Phase 12 prompt and D39/D40 govern this follow-up.
