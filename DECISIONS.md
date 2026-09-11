# Portfolio decision log

| ID | Decision | Status/source |
| --- | --- | --- |
| D01 | Companies/agencies are primary; freelance clients are secondary | Confirmed by Ahmed |
| D02 | Use Studio composition with a dark theme | Confirmed after visual review |
| D03 | Prioritize distinctive UI/UX and performance | Confirmed by Ahmed |
| D04 | Feature Vertex; include AutoZain, Roya, and Ramex | Confirmed by Ahmed |
| D05 | ERP-V2 is Vertex ERP | Confirmed by Ahmed |
| D06 | Do not use client sites for demos | Confirmed constraint |
| D07 | Copy selected UI into one new portfolio repo with local demo data | Agreed approach; per-flow feasibility still requires audit |
| D08 | Keep original client repositories and deployment settings unchanged | Consequence of the agreed isolated approach |
| D09 | Astro static shell; separate React/Vite demo builds | Planning recommendation for implementation |
| D10 | English portfolio; preserve original demo language/RTL | Planning default |
| D11 | Shareable static case studies and a lazy modal demo host | Planning default supporting hiring/freelance use |
| D12 | First scenarios: Vertex production, AutoZain request handling, Roya budget impact, Ramex roll sale | Proposed bounded scope, to validate against source |
| D13 | No full backend replicas, accounts, CMS, contact service, or analytics in V1 | Scope decision for a low-maintenance portfolio |
| D14 | New site deployment target remains unselected | Unresolved, not a foundation blocker |
| D15 | AutoZain exact contribution is omitted until verified | Conservative content default |
| D16 | Ramex V1 demonstrates a complete selected-roll sale, not a partial-roll quantity decrement | Changed 11 September 2026 after pinned-source audit; supersedes the partial-quantity detail proposed under D12 |
| D17 | Support Node `>=22.19.0 <23` and pin `22.23.2` for builds | Changed 11 September 2026 after Phase 01 dependency resolution |

### D16 evidence and impact

- Date: 11 September 2026.
- Evidence: at Ramex revision `0857f27ae4b9b327fb7f24cd83de038bb0b2ac86`, `backend/src/domain/sales/sales.schemas.ts` has no roll sale-quantity input, `backend/src/domain/sales/lineQuantity.ts` derives quantity from the roll's full length/weight, and `backend/src/domain/sales/invoices.service.ts` snapshots that quantity and marks the roll sold.
- Affected work: `docs/portfolio/source-audit.md`, the Ramex scenario currently described in `docs/portfolio/demo-spec.md`, and Phase 07 (`docs/portfolio/prompts/07-ramex.md`).
- Reason: the previous 7.5 m from 30 m fixture would invent unsupported client behavior. Phase 07 must instead sell one full fictional 30 m roll, show a 30.000 meter invoice snapshot, mark that roll sold/unavailable, and leave a second roll unchanged. A partial-roll demo would require a separately authorized source product change and a new audit.

### D17 evidence and impact

- Date: 11 September 2026.
- Evidence: Phase 01 installed the verified Astro `7.3.2` dependency set. Its resolved `unifont@0.7.5` dependency uses `undici@8.10.2`, which declares Node `>=22.19.0`. The earlier proposed `>=22.12.0` floor therefore produces an engine warning with the actual lock.
- Affected work: root `package.json`, `.nvmrc`, `package-lock.json`, Phase 01 validation, and future local/CI build setup.
- Reason: the repository's declared support range must match the dependencies actually locked. Node `22.23.2` remains within the Node 22 LTS line selected during the audit and satisfies the stricter source boundary already recorded for Roya.

When a decision changes, append its date, evidence, affected files/phases, and reason. Retain the previous rationale where it helps explain the change. Do not use this document to silently overrule a newer user instruction.
