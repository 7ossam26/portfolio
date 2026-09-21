# Phase 09 release and handoff

Prepared 12 September 2026. The immutable artifact below is historical and was not
published. On 21 September 2026 Ahmed identified the current production target as
`https://hossam-portfolio-five.vercel.app`. Unauthenticated inspection found an
incomplete shell-only deployment there: the root responds, but every demo directory
is absent and Vertex returns 404. A repository fix now configures Vercel to run the
full root build and publish merged `dist/`; it still requires redeployment and remote
verification. Exact Vercel deployment access/settings were not available here.

## Prepared source and artifact

| Item | Exact value |
| --- | --- |
| Deployed revision / artifact / final URL | None; deployment has not occurred |
| Base Git revision | `0fe076bc3f6c24c5e890af5399a83b262076a70c` |
| Phase 09 build-source tree SHA-256 | `48500d9d1a91a3c712cd448436acc16b59188736f9c2a6be3ba41695c23fc321` |
| Source snapshot SHA-256 | `272c755665a8c8f6a5b13d98140ff8c58bfdf6f0c113ac4d0eaedc47b48ae797` |
| Prepared archive | `output/releases/portfolio-2d412b8331edab54b7ecacef7ed90ccc68bc9fa8bb1fe7d1ce5a20fcb20ed340.tar.gz` |
| Archive SHA-256 | `2d412b8331edab54b7ecacef7ed90ccc68bc9fa8bb1fe7d1ce5a20fcb20ed340` |
| Static output manifest SHA-256 | `1d102ade406b63c4f3566cfc0b48f25254c5ec1f47f88d4f1b461da95394d8f4` |
| Generated Nginx configuration SHA-256 | `9b7acc374308cbe5c83a4bef9cddfb7a31544810546b9ac46721a118df0db882` |
| Toolchain | Node `22.23.2`, npm `11.1.0`, committed npm lockfile |
| Publication mode | Preview: null origin, all pages noindex, disallow-all robots, no sitemap |

The base revision alone does not describe this artifact: Phase 09 changes are
uncommitted. `source.tar.gz` and `source-manifest.json` contain the exact build
sources and hashes, including copied-source notices and the two reference assets
required by the asset gate. Documentation and historical QA output remain in Git
separately. The snapshot contains no old Site deployment identity or full client
repository. It can reproduce the static output with `npm ci` / `npm run build`;
that was verified in an independent directory without the existing node_modules.

The archive includes `html/`, `nginx.conf`, `release.json`, `source-manifest.json`,
and `source.tar.gz`. **Serve only `html/`.** Archives, source snapshots, and release
records stay outside the public document root. Generated bundles and local tools
are ignored by Git; copy the archive and checksum to the selected deployment's
private artifact store when available. No artifact has been uploaded anywhere.

`npm run release:prepare` enforces the exact Node/npm versions, performs the full
build/static gates, and writes a content-addressed archive plus SHA-256 sidecar.
Canonical tar ownership/mode/mtime and deterministic gzip remove workstation
metadata. An existing archive is checked rather than overwritten. Repeated
preparation with unchanged sources/origin produced the same archive hash, including
a rebuild with the paired Node/npm PATH used for nested npm script calls.

## Serving configuration

This is a tested **local Nginx serving option**, not a chosen VPS/Dokploy service.
Nginx `1.30.4` was obtained from the official stable download page. Configuration
syntax and effective local HTTP responses were exercised with its native Windows
binary. No Linux container, remote proxy, TLS configuration, DNS, hosting service,
or deployed status has been tested or changed. Docker's Linux daemon is unavailable
on this workstation.

The configuration listens on internal port `8080`, resolves `html/` relative to its
own release prefix, and uses only its own logs/temp paths. It supports directory
indexes and redirects, a styled page 404, and plain-text missing-asset 404s. There
is no SPA fallback that returns a success document for missing scripts.

| Contract | Effective local configuration |
| --- | --- |
| Embedding | Portfolio `frame-src 'self'`; demo `frame-src 'none'`; every response `frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN` |
| Network | `connect-src 'none'`; scripts/styles/images/fonts local only; no data/blob image allowance needed |
| Inline content | Exact built inline-script hashes; exact style-element hashes if present; demo noscript attribute style uses `unsafe-hashes` with its single exact hash |
| CSP restrictions | `default-src`, `base-uri`, `object-src`, `form-action`, script attributes, media, workers, and manifests are `none`; no `unsafe-inline`, `unsafe-eval`, or wildcard origin |
| Other headers | `nosniff`, `strict-origin-when-cross-origin`, and camera/microphone/geolocation disabled |
| Hashed assets | Manifest-identified JS/CSS/fonts/images: one-year immutable cache |
| HTML / robots / sitemap | `public, max-age=0, must-revalidate` |
| Stable CV / favicon / images | `public, max-age=3600` |
| Validators | Weak content-SHA-256 ETags; exact matching GET/HEAD requests return 304; gzip varies by Accept-Encoding |
| Timestamp caching | `if_modified_since off`; fixed archive timestamps cannot incorrectly suppress changed content |
| Errors / methods | Errors `no-store` and non-indexable; methods other than GET/HEAD return 405 |
| Search | Preview header noindex on all responses; public-mode demos and 404s remain noindex |

The full document-specific CSP hashes and file cache policies are in `release.json`.
Selected JSX has no runtime inline style props; the only required style attributes
are existing bilingual noscript paragraphs. Vite's modulepreload fallback contains
`fetch`, but the tested Chromium supports modulepreload natively; no data connection
was made in any selected flow. Other engines remain a coverage gap.

For a selected different static host, implement these same routes, header policies,
and validators using its supported configuration and inspect actual responses.
If Sites is selected, use applicable Sites hosting instructions and a new portfolio
identity. Nothing here authorizes changing the old review Site's audience.

## Validation

See [Phase 09 evidence](validation/phase-09.md).

- Clean `npm ci` under Node `22.23.2` / npm `11.1.0`; full production build and all
  demo typechecks; shell check: zero errors/warnings/hints.
- 27 existing domain tests pass; one focused public-origin validation test passes;
  production dependency audit reports zero vulnerabilities.
- 93 local native-Nginx HTTP checks pass against this exact archive: all 67 files
  byte-checked, direct routes, MIME/CSP/cache/noindex, unchanged CV and contact links,
  missing files, HEAD/range, 304s, stale validators, gzip, and static-only methods.
- 47 Chromium journey checks and 46 network-isolation checks pass under the new
  headers. All four ready/reset/close and domain paths work; no off-origin request,
  live data channel, persistent storage, or unexpected console error was observed.
  Those suites used archive `5a442bea…f9c9695`; its complete static output and
  Nginx configuration were hash-verified identical to this final prepared archive.
- A local-only `https://release-verification.invalid` metadata fixture passed 88
  HTTP checks, including five canonical/sitemap public routes, indexable public
  pages, and non-indexable demos. Its manifest says `test-fixture-not-for-deployment`.
  This is not Ahmed's origin and is not the retained final preview.
- Independent source-snapshot install/build reproduces all 67 static files exactly.
  The preview bytes also match the retained Phase 08 static baseline exactly.

No public-host, unauthenticated public browser, TLS, CDN, effective remote header,
remote cache, or native deployment-status check has passed. Firefox/WebKit remain
unverified; current historical suites explicitly launch Chromium, so downloading
other engines alone cannot close that gap. Field p75 LCP/INP/CLS are unavailable
until real traffic exists; earlier measurements remain lab evidence. Imported-source
notice/branding constraints and omitted AutoZain contribution still apply. The
supplied CV PDF is unchanged (`8997a9d85d6b9b2b03a7cc8011afb51bf1ee02475ffea829133351c2ec3074e8`).

## Remaining deployment steps

1. Ahmed supplies the actual public HTTPS origin, selected host, and access to the
   separate portfolio deployment. No client service, unrelated DNS, account purchase,
   domain purchase, or unrelated audience change is permitted.
2. Set `PORTFOLIO_SITE_URL` to that root origin and run `npm run release:prepare` with
   `PORTFOLIO_RELEASE_TEST` unset. Verify checksum and retain this preview archive.
   This produces real canonicals/social metadata and a five-route sitemap; demos
   remain noindex and excluded. Preview noindex is removed only on public pages.
3. Apply the host's own static-service/header configuration; retain the prior public
   artifact/configuration if one exists. On an isolated Nginx service, extract into
   a new release directory, create `logs/`, run `nginx -p <release-directory>/ -c
   nginx.conf -t`, then let the selected service manager start that same prefix.
   The selected reverse proxy provides the confirmed hostname/TLS. Do not reuse a
   client's service or publish internal port 8080 as an unconfigured public endpoint.
4. Verify native deployment status and TLS, then run `release:verify` with
   `PORTFOLIO_VERIFY_ORIGIN` set to the exact selected origin. Perform fresh public
   browser checks for direct routes, assets/404s, CV/contact, and each demo's
   ready/reset/close path. Check effective CSP/noindex/cache/304 behavior beyond the
   proxy/CDN. Record cross-engine results or an explicit accepted limitation.
5. Replace this pending record with the exact deployed archive/source, origin,
   effective host settings, native status, public verification, and rollback command.
   Do not call the portfolio live before this evidence exists.

## Rollback and maintenance

Retained development baseline:
`output/releases/retained-phase-08-ae98453dbb1c11715b504e64033dba8a66ea8d2d31e9306945875426aace2349.tar.gz`
(SHA-256 `ae98453dbb1c11715b504e64033dba8a66ea8d2d31e9306945875426aace2349`).
It preserves the pre-phase static files and source-revision/output record; it has
never been a public deployment and has no prior public host configuration.

For future deployments, retain the previous **deployed** immutable archive and host
configuration before switching. Rollback is restarting/redeploying only the separate
portfolio service with that exact prior archive/configuration, without rebuilding.
Repeat native status, HTTP, and fresh-browser checks. Do not switch only HTML while
leaving CSP hashes from a different release. There is no server state or migration.
For the first publication, a failed rollout is withdrawn by stopping/removing only
the new portfolio service/routing; no unrelated service may be changed. Host-specific
rollback commands are pending target selection.

Use [the maintenance guide](maintenance.md) for toolchain commands, content/fixture
updates, source notices, capture refresh, and regression checks. Rebuild captures
when demo visuals change, regenerate the policy from built bytes, and retain every
public release archive. Adding the public URL to the CV requires a separate requested
CV edit. Phase 09 is the final phase; there is no new feature prompt.
