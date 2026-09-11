# Phase 09 — Release and handoff

Execute the final release phase for this portfolio only. Read `AGENTS.md`, `STATE.md`, `DECISIONS.md`, `docs/portfolio/master-plan.md`, `docs/portfolio/demo-spec.md`, the acceptance checklist, and the release-candidate evidence. Do not modify any client project/service or reuse a client site's deployment target.

## Objective

Prepare a reproducible release and publish it to the actual target selected by Ahmed when the target and access are available. The existing private design-review Site is not automatically the public production site.

## Work

1. Confirm the release candidate is complete from actual evidence. Finish any required local repair and rerun only affected gates; do not hide an incomplete demo behind a release label.
2. Resolve the actual domain/origin, hosting service, audience, and available deployment access from this session/configuration. Do not invent them. If those are missing, first prepare the artifact/configuration/handoff completely, then ask one concise deployment-specific question and report the remaining blocker.
3. For a chosen VPS/Dokploy target, prepare a separate static portfolio service with its own configuration, immutable release artifact, and rollback path. For another chosen static host, implement the same output/header/route contract using that host's supported settings. Follow applicable Sites instructions if this project is actually hosted through Sites; never copy the old reference project's identity.
4. Set the final canonical metadata and sitemap/robots configuration using the actual public origin. Remove preview noindex only for the intended public portfolio pages; keep demo routes non-indexable and out of the sitemap.
5. Apply and verify effective embedding/CSP/cache headers. Keep the copied demos same-origin and client headers unchanged. Inspect the built scripts/styles to choose compatible CSP hashes or narrowly required style allowances; do not disable policies broadly to make a frame load.
6. Deploy within the supplied authorization and target, retaining the prior artifact. Do not create accounts, purchase a domain, change unrelated DNS, or broaden an unrelated site's audience.
7. This phase requests browser and HTTP verification of the actual final release where the environment allows it. Check unauthenticated access, direct case-study/demo loads, asset errors/404s, CV, contact links, each demo's ready/reset/close path, headers, and cache behavior. Use native deployment status checks where required by the hosting environment. Do not claim checks that could not be performed.

## Handoff

Write `docs/portfolio/release.md` with the exact deployed source revision/artifact, final URL, effective configuration, checks, known limitations, and rollback instructions. Update `STATE.md` and the maintenance guide.

Give Ahmed the verified public URL and concise deployment/maintenance guidance. If publication is blocked, give the concrete prepared result and exactly what is still needed, without claiming the site is live. Adding the new URL to the CV is a separate requested CV edit; never silently modify the supplied PDF.

This is the final phase. Do not invent another feature phase.
