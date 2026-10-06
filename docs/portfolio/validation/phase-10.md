# Phase 10 — Yousef portfolio personalization

Date: 6 October 2026. Branch: `tantawy`. Starting revision: `3f079e55c89ca32e05f86bd2675dbbf1a62aad56`. Changes are local and uncommitted; nothing was pushed or deployed.

## Delivered behavior

The Studio Dark portfolio now identifies **Yousef Fahim Amin** in navigation, hero, footer, favicon, titles, descriptions, social metadata, and contacts. His selected focus spans backend, AI/ML, and embedded systems.

The homepage presents four featured projects and three further-work entries, with seven static case studies and verified repository destinations. RealEstate leads. Background sections cover skills, Modern Academy Computer Science (2023–2027, expected graduation 2027), and documented Ray Group, IT Gate Academy, Microsoft/Sprints, and Ex-Fresher training. Training is not employment. No project dates, commercial impact, production usage, or sole ownership were invented.

Seven project READMEs and focused implementation files were compared with the profile. The audit records contradictions in HeartGuard model/deployment claims, Gym cloud/auth features, Arduino sketch readiness, and digit-classifier metrics. Public copy follows the source and includes project scope notes. Architecture diagrams are labeled; no application screenshots or runnable demos are fabricated.

The supplied updated CV is downloadable unchanged. The previous public CV and screenshots are preserved in `archive/ahmed-public/`, obsolete components in `archive/ahmed-components/`. Original demo workspaces/notices remain but are excluded from active build, staging and development serving. RealEstate's actual collaborator credit “Ahmed” is retained without inferring the original portfolio owner's surname.

## Inputs and provenance

- Profile and seven projects: exact revisions and inspected files in [`../yousef-source-audit.md`](../yousef-source-audit.md).
- User's supplied [CV folder](https://drive.google.com/drive/folders/1EapS7lF0xhEb4ii_3twZg9e5LVnRyyRa).
- Selected [updated CV](https://drive.google.com/file/d/1PHw1Fqpm3M-8RdNWjj3r5wdpKpM6eKYY/view), served from `apps/portfolio/public/Yousef_Fahim_Amin_CV.pdf`: 421,463 bytes; SHA256 `474d6fdbd294d6de8a4aa8b7ab5324e4d08386d18446e47200c79131917f2650`.
- Both supplied CVs were extracted and rendered with Poppler; their complete one-page renders were visually inspected using the PDF skill. The selected version displays the confirmed name. Both support Egypt, contacts, expected graduation and training. Language proficiency differs and is omitted.
- All referenced project access was read-only: no setup scripts, migrations, seeds, model deserialization, camera access or hardware interaction.

## Checks performed

System Node 25.2.1 is outside the repository's range. Validation used portable **Node 22.23.2 / npm 11.1.0**, preserving dependency versions. The Node executable matched the official `https://nodejs.org/dist/v22.23.2/SHASUMS256.txt` checksum `0d0f5e39f9f3d9587bc19f73eab3c2c9c4903fd02d6dbf9c853dd81b3d95fad4`; the npm tarball matched its official registry checksum. Tools remain ignored under `.local-tools/toolchain/`.

| Check | Result |
| --- | --- |
| `npm ci --no-audit --no-fund` | Pass; 308 packages installed from the existing lock. |
| `npm run typecheck` / final `npm run verify` | Pass; Astro checked 18 files, 0 errors, 0 warnings, 0 hints. |
| `npm run build` | Pass; homepage + 7 case studies + 404, staged in root `dist/`. |
| Asset checks | Pass; only favicon and checksum-verified Yousef CV are approved public source assets. |
| Content/routes/links/anchors | Pass; all 9 pages have distinct owner-specific titles, one h1, descriptions, valid local references/anchors, intended contacts/repositories. |
| Historical-content exclusion | Pass; no old client routes, demo bundles/markup, screenshots, CV or owner metadata in `dist/`. Exact RealEstate collaborator credit is permitted only in its case-study prose. |
| Configured-origin build | Pass with non-routable fixture `https://portfolio-validation.invalid`; 8 indexable destinations with matching canonicals/social metadata/robots/sitemap. No publication occurred. |
| Final preview build | Pass after removing origin variable; `noindex,nofollow`, disallow-all robots, no canonical/sitemap or fixture origin. This is the final artifact. |
| Local HTTP | **24 pass**: 8 public routes, exact PDF bytes/MIME, startup asset bytes, and 14 legacy/private/missing routes returning 404. Temporary Node server was stopped. |
| `node --test tests/phase-09/site-origin.test.mjs` | 1 test passes. |
| Source review | Lock package resolutions unchanged; all archived original assets byte-identical. Corrected narrow diagram wrapping and made scope notes visible. |
| Script syntax; `git diff --check` | Pass. |

Local HTTP evidence: [`phase-10-evidence/local-http.json`](phase-10-evidence/local-http.json).

Reproduce ordinary checks on this workstation:

```powershell
$env:PATH = "$((Resolve-Path '.local-tools/toolchain').Path);$env:PATH"
$env:ASTRO_TELEMETRY_DISABLED = '1'
npm.cmd run verify
node --test tests/phase-09/site-origin.test.mjs
```

HTTP checks used `scripts/preview-static.mjs` and Node `fetch`, not a browser. They do not establish production headers, deployment behavior or browser request isolation. The release HTTP script was adapted to the current manifest, but full Nginx release archive/header verification was **not run**.

## Limits and next action

Browser automation, preview review, visual/reflow/keyboard/accessibility testing, runtime network capture and performance measurement were **not performed**, following the standing instruction. Prior Phase 08/09 scores belong to the original portfolio. Referenced project tests, ML experiments, hardware and mobile runtime behavior were not rerun. Scope notes distinguish repository-reported evidence from checks performed here.

The final artifact is local and unindexed. The original Git remote is unchanged; no deployment to the original owner's Vercel site occurred, and no public domain for Yousef was assumed.

Next prompt: [`../prompts/11-personal-review.md`](../prompts/11-personal-review.md). Stop here until the owner requests it.
