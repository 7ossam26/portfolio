# Roya demo source provenance

This workspace contains a narrow adaptation of the shooting-weeks budget preview from Roya (`7ossam26/Film-production-fin-system`) at the audited ledger revision `aaf1112b2deb32dbf6c3540e7eb1748abc87bbae`.

The source repository has no root `LICENSE`, `NOTICE`, or `COPYING` file. This provenance record does not grant or imply an open-source license. The original repository remains read-only and is not part of this build.

The selected UI maps from `apps/web/src/features/projects/ProjectDetail.tsx` (`SettingsTab` and `ShootingWeeksModal`) and `apps/web/src/features/projects/BudgetTab.tsx`. The local calculation maps from `apps/api/src/projects/handlers.ts`, with cost-strategy names and line-total rules cross-checked against `packages/shared/src/projects.ts`. The extracted application replaces the source auth, router, query client, API, and project-mutation boundaries with one deterministic in-memory service.

All project names and financial records in this demo are fictional. No client production data, credentials, API configuration, uploaded media, or remote fonts were copied. The bounded interaction is preview and cancel only; it cannot save or patch a project.

Detailed source-to-local mappings, calculation notes, checkout limitations, and screenshot provenance are recorded in `docs/portfolio/source-audit.md`.
