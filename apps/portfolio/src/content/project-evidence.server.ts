import type { ProjectSlug } from './projects';

export interface ProjectEvidence {
  readonly sourceRevision: string;
  readonly sourceNotes: readonly string[];
  readonly claimNotes: readonly string[];
}

/**
 * Internal implementation evidence. This module is server/build-only and is not
 * imported by client code or rendered into public pages.
 */
export const projectEvidence = {
  vertex: {
    sourceRevision: '7254e34b49acfbe394da3a889abe6e458084cb38',
    sourceNotes: [
      'frontend/src/pages/bom/BOMManager.jsx',
      'frontend/src/pages/bom/ProductionHistory.jsx',
      'backend/lib/productionService.js',
    ],
    claimNotes: ['Full-stack development is supported by the current CV; do not imply sole ownership or team size.'],
  },
  autozain: {
    sourceRevision: '768e1de94464fc5dd0f401ce19b81bfec452e818',
    sourceNotes: ['Public marketplace, request service, staff availability, and socket event paths are mapped in the Phase 00 audit.'],
    claimNotes: ['Exact contribution is unconfirmed, so the public role field is intentionally omitted.'],
  },
  roya: {
    sourceRevision: 'aaf1112b2deb32dbf6c3540e7eb1748abc87bbae',
    sourceNotes: ['apps/web/src/lib/projects-api.ts', 'apps/api/src/projects/handlers.ts', 'packages/shared/src/projects.ts'],
    claimNotes: ['System design and full-stack development are supported by the current CV.'],
  },
  ramex: {
    sourceRevision: '0857f27ae4b9b327fb7f24cd83de038bb0b2ac86',
    sourceNotes: ['frontend/src/pages/pos/POS.tsx', 'backend/src/domain/sales/lineQuantity.ts', 'backend/src/domain/sales/invoices.service.ts'],
    claimNotes: ['The pinned source sells a complete selected roll; it does not support a partial-roll decrement.'],
  },
} as const satisfies Readonly<Record<ProjectSlug, ProjectEvidence>>;
