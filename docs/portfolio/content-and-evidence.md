# Content, Evidence, and Source Ledger

## Evidence status

The CV and the four repositories were reviewed during planning. Repository README content and current HEADs were refreshed on 10 September 2026. This is enough to ground the portfolio narrative; it is not a claim that every component has been audited for extraction.

Phase 00 must pin the source revisions it actually uses and map selected screen dependencies. If a source has changed, inspect the relevant differences and record the new revision. Do not assume that a README blob SHA is a repository commit SHA.

| Project | Repository | HEAD observed on 10 September 2026 | README blob observed |
| --- | --- | --- | --- |
| Vertex ERP | https://github.com/7ossam26/ERP-V2 | `7254e34b49acfbe394da3a889abe6e458084cb38` | `1525a4452a4f7a5838a0e551d5c0ec4081b0cefd` |
| AutoZain | https://github.com/7ossam26/autozain-system | `768e1de94464fc5dd0f401ce19b81bfec452e818` | `1e65ff825c674c5330d2fc710eecac123e12c760` |
| Roya | https://github.com/7ossam26/Film-production-fin-system | `aaf1112b2deb32dbf6c3540e7eb1748abc87bbae` | `d26d1ef468b734a97a130a82e13ff3a636817b10` |
| Ramex | https://github.com/7ossam26/Ramex-Store | `0857f27ae4b9b327fb7f24cd83de038bb0b2ac86` | `a3e0c4107716cf0c7ddcd719442d6aa5f0616140` |

Some code-level evidence from the earlier review includes Vertex's production service and API client, AutoZain's app/socket/request service, Roya's replay/approval implementation, and Ramex's roll/invoice quantity handling. Resolve actual paths from the pinned tree during the audit rather than treating remembered path names as a complete file manifest.

## Ahmed's identity

Source: current supplied `Ahmed_Hossam_Software_Engineer_CV.pdf`, not older conversation memories.

| Field | Value/use |
| --- | --- |
| Display name | Ahmed Hossam |
| Professional title | Full-Stack Software Engineer |
| Primary stack positioning | React and Node.js; broader skills can remain in the CV |
| Email | `hossam.working1@gmail.com` |
| Public location | Giza, Egypt |
| CV file | Use the exact supplied PDF; the design export contains its unchanged copy |
| GitHub profile | https://github.com/7ossam26 |
| Phone | Present in CV; do not add another homepage contact channel by default |
| LinkedIn | Extract and verify the link from the current CV if added; do not reuse an unverified remembered URL |

The current CV states 3+ years of experience. The homepage does not need a numeric experience badge. Do not bring back removed statistics such as 50+ projects or percentage traffic improvements.

The CV remains unchanged in this task. Adding the final portfolio URL to it is a separate final-stage CV edit when requested; do not insert a private preview URL into the public CV.

## Project content records

Use a typed source of truth with fields such as slug, name, domain, summary, role (optional), selected capabilities, engineering notes with source references, stack, repository URL, media, and demo availability. Keep evidence notes separate from public copy. Do not render internal unknowns such as "role to confirm" to visitors.

### Vertex ERP

**Summary:** A multi-branch ERP connecting retail sales with inventory, production, and finance.

**Problem framing:** Sales, material consumption, finished stock, and financial records need to remain connected across branch operations.

**Confirmed role:** Full-stack development; the CV also describes translating requirements into architecture and data flows. Do not infer sole development or a team size.

**Selected capabilities:**

- Point of sale, wholesale, and call-center workflows within one operating system.
- Bill-of-materials recipes, automatic material consumption, and production history/costing.
- Branch access and shift workflows, with reporting and audit-related behavior.

**Engineering evidence to expand:** Trace the selected production transaction and its stock/cost effects; inspect where branch and shift context constrain operations. Describe what the code does before assigning a motivation to the design.

**Stack:** React, Vite, Node.js/Express, Prisma, MySQL. The current README identifies React 19; verify installed versions from source before copying.

**Homepage treatment:** Featured project, largest visual area. Use the production scenario to distinguish it from a generic sales dashboard.

**Do not claim:** Revenue uplift, measured user counts, zero accounting errors, a certified tamper-proof system, or a universal ERP covering every industry.

### AutoZain

**Summary:** A used-car marketplace connected to staff contact handling and dealership operations.

**Problem framing:** A buyer's enquiry needs to move from public browsing into staff availability, response, and a tracked outcome.

**Role:** Exact contribution is not described in the supplied CV and has not been specifically confirmed. Omit the public role line until Ahmed confirms it; do not block other content or assume sole ownership.

**Selected capabilities:**

- Public vehicle search/filtering, details, and favorites.
- Staff contact requests with live availability, response handling, and manager monitoring.
- Deposit review and controlled sale closing through financial operations.

**Engineering evidence to expand:** The relationship between the request service, socket events, staff availability, and timeout/session cleanup. Financial values should be discussed as source behavior, not business results.

**Stack:** React, Vite, Node.js/Express, Socket.io, Prisma, PostgreSQL.

**Public preview assets:** Use fictional vehicle records and safe local images. Avoid customer uploads or IDs. Source admin seed credentials are irrelevant to the portfolio and must not appear in it.

### Roya

**Summary:** A bilingual film and TV finance platform connecting production plans, budgets, commitments, payments, and auditable history.

**Problem framing:** Production schedules and budgets change while teams still need controlled approvals and a financial history that can be inspected.

**Confirmed role:** System design and full-stack development; requirements, architecture, and deployment are supported by the current CV.

**Selected capabilities:**

- Budget versions and shooting-week change previews showing affected lines and financial impact.
- An append-only financial event history with rebuildable projections and point-in-time replay.
- Payment approval rules, separation of duties, and production scheduling/DOOD-related workflows.

**Engineering evidence to expand:** Why append-only events and projections differ from editable totals in this implementation; how the impact preview handles cost strategies. State observed mechanics and label any inferred rationale until Ahmed confirms it.

**Stack:** React, TypeScript, Node.js/Express, PostgreSQL, Kysely; Docker/deployment details can appear when relevant.

**Interactive scope:** Start with shooting-week budget impact. Approvals/replay remain source-backed case-study evidence, with a possible second demo later.

**Do not claim:** Legal/accounting certification, a financial audit outcome, guaranteed compliance, or quantified production savings.

### Ramex

**Summary:** A fabric retail ERP designed around individual rolls, variable sale quantities, and invoice records.

**Problem framing:** Fabric stock cannot always be represented as interchangeable item counts. The selected roll, quantity, and unit matter during sale and later review.

**Confirmed role:** System design and full-stack development, including requirements and architecture, as described in the current CV.

**Selected capabilities:**

- Per-roll inventory and factory shipment workflows.
- Sales in supported meter/kilogram units, with quantity/unit snapshots on invoices.
- Multi-payment sales and customer/accounting-related views.

**Engineering evidence to expand:** How roll identity and historical invoice quantities remain consistent. Inspect unit behavior rather than inventing conversion rules.

**Stack:** React, TypeScript, Node.js/Express, PostgreSQL, Knex.

**Do not describe it as:** A generic online clothing store or a simple ecommerce shopping cart.

## Evidence capture rules

- Every screenshot comes from the selected original UI running with fictional records. Keep an asset provenance entry with project, source revision, route, fixture, and capture date.
- Captions explain what is visible, rather than making unmeasured outcome claims.
- Do not include sensitive documents, live customer data, client URLs, or source configuration in the image crop.
- A diagram can explain relationships but must stay labeled as a diagram.
- Preserve source notices for copied components/assets. The Vertex README labels its software proprietary; do not automatically add a broad MIT license covering imported client code. Resolve actual restrictions relevant to the selected files instead of inferring reuse terms from public visibility.

## Unresolved details and defaults

| Detail | Default until resolved | When it matters |
| --- | --- | --- |
| Exact AutoZain role | Omit role attribution | Before claiming a specific ownership role publicly |
| Client branding/assets | Use project names, code UI, and safe sample assets | Before publishing a client logo or original uploaded media |
| Final domain/host | Build portable static output | Release configuration |
| Component extraction feasibility | Inspect and record during Phase 00 and each demo phase | Before promising that scenario as implemented |
| Measured performance | Mark not measured until actual tests | Release gate |

Only ask Ahmed for information that cannot be established from the available source and materially affects the current phase. Do not restart the original broad requirements questionnaire.
