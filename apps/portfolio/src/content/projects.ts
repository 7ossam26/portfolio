export const projectSlugs = ['vertex', 'autozain', 'roya', 'ramex'] as const;

export type ProjectSlug = (typeof projectSlugs)[number];

export interface ProjectCapability {
  readonly label: string;
  readonly detail: string;
}

export interface EngineeringDecision {
  readonly title: string;
  readonly detail: string;
  readonly tradeoff: string;
}

export interface ProjectMedia {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly caption: string;
}

export interface ProjectContent {
  readonly slug: ProjectSlug;
  readonly name: string;
  readonly domain: string;
  readonly summary: string;
  readonly distinction: string;
  readonly problem: string;
  readonly role?: string;
  readonly contribution?: string;
  readonly capabilities: readonly ProjectCapability[];
  readonly decisions: readonly EngineeringDecision[];
  readonly flow: readonly string[];
  readonly demoSummary: string;
  readonly stack: readonly string[];
  readonly repositoryUrl: string;
  readonly demoAvailable: boolean;
  readonly media?: readonly ProjectMedia[];
}

export const projects = [
  {
    slug: 'vertex',
    name: 'Vertex ERP',
    domain: 'Retail & business operations',
    summary: 'A multi-branch ERP connecting retail sales with inventory, production, and finance.',
    distinction: 'Recipe execution consumes exact inputs, updates finished stock, and records production cost as one operation.',
    problem: 'Sales, material consumption, finished stock, and financial records need to remain connected across branch operations. Production is especially sensitive: completing an order should not leave stock, cost, or history telling different stories.',
    role: 'Full-stack development',
    contribution: 'Ahmed worked across the application stack and translated operating requirements into architecture and data flows. The selected evidence follows the existing production workflow from a bill of materials through inventory and costing; it does not imply sole ownership or a particular team size.',
    capabilities: [
      { label: 'Connected selling', detail: 'Point of sale, wholesale, and call-center workflows share the wider inventory and finance context instead of acting as isolated storefronts.' },
      { label: 'Production control', detail: 'Bill-of-materials recipes calculate required inputs, consume material stock, add finished stock, and preserve production cost and history.' },
      { label: 'Operating context', detail: 'Branch access and shift workflows constrain day-to-day activity, while reporting and audit-related behavior make operations inspectable.' },
    ],
    decisions: [
      {
        title: 'Commit production effects together',
        detail: 'The production service checks stock, decrements materials, increments finished inventory, creates the production order, and refreshes cost inside one database transaction.',
        tradeoff: 'This coordinates more work at the transaction boundary, but a rejected or failed run does not leave a half-applied production record.',
      },
      {
        title: 'Keep quantity precision explicit',
        detail: 'Recipe quantities and consumed-material quantities use defined decimal scales, while the service calculates target material requirements before it writes stock changes.',
        tradeoff: 'The extra precision and rounding discipline add implementation detail, but they avoid treating production quantities like imprecise display numbers.',
      },
    ],
    flow: ['Bill of materials', 'Stock validation', 'Material consumption', 'Finished stock & cost'],
    demoSummary: 'Execute a fictional bill of materials for four finished units, then reconcile the material usage, finished stock, and production cost. An excessive run is rejected without changing sample state. The bounded adapter is local only: no production API, login, realtime service, or client data is connected.',
    stack: ['React', 'Vite', 'Node.js / Express', 'Prisma', 'MySQL'],
    repositoryUrl: 'https://github.com/7ossam26/ERP-V2',
    demoAvailable: true,
    media: [
      {
        src: '/images/vertex/production-result-1440x900.png',
        width: 1440,
        height: 900,
        alt: 'Arabic Vertex ERP production history showing the completed sample order, material quantities, and costs.',
        caption: 'Original Vertex production-history UI running on local fictional data: four finished units consume 8 kg and 2 kg, with EGP 120 total material cost and EGP 30 unit cost.',
      },
    ],
  },
  {
    slug: 'autozain',
    name: 'AutoZain',
    domain: 'Automotive marketplace & operations',
    summary: 'A used-car marketplace connected to staff contact handling and dealership operations.',
    distinction: 'A buyer request moves from vehicle browsing to available staff and a recorded outcome.',
    problem: 'A vehicle listing can attract a buyer, but the operational work starts when that enquiry reaches an available employee. Buyer feedback, staff availability, request status, and the eventual outcome need to remain aligned.',
    capabilities: [
      { label: 'Marketplace', detail: 'Public vehicle search, filtering, detail views, and favorites support the buyer-facing discovery journey.' },
      { label: 'Contact handling', detail: 'A buyer can choose available staff, create a request, and receive live state changes as that request is accepted, rejected, timed out, or completed.' },
      { label: 'Dealership controls', detail: 'Deposit review and controlled sale closing connect public interest to later financial operations without presenting them as the same workflow.' },
    ],
    decisions: [
      {
        title: 'Model contact work as explicit states',
        detail: 'Requests move from pending to accepted or rejected; accepted requests can complete with one of a bounded set of outcomes. Staff availability changes with active work.',
        tradeoff: 'A state machine makes invalid transitions easier to reject, but every buyer and staff surface must reconcile to the same current state.',
      },
      {
        title: 'Separate live events from durable request behavior',
        detail: 'Socket events broadcast request and availability changes, while service and repository layers own the underlying transitions and timeout handling.',
        tradeoff: 'Live feedback improves coordination, but disconnects, timeouts, and session cleanup must be handled deliberately rather than left to the interface.',
      },
    ],
    flow: ['Vehicle discovery', 'Staff selection', 'Contact request', 'Tracked outcome'],
    demoSummary: 'Browse fictional local inventory, select a vehicle, and send a clearly fictional buyer request. Switch to the Staff persona to accept it, observe the employee become busy, record a source-supported outcome, and verify the same completed status from either view. A short deterministic timeout and Reset path are included. No socket, phone, message, notification, upload, login, or client service is connected.',
    stack: ['React', 'Vite', 'Node.js / Express', 'Socket.io', 'Prisma', 'PostgreSQL'],
    repositoryUrl: 'https://github.com/7ossam26/autozain-system',
    demoAvailable: true,
    media: [
      {
        src: '/images/autozain/contact-outcome-1440x900.png',
        width: 1440,
        height: 900,
        alt: 'Arabic AutoZain staff interface showing one completed fictional contact request and its local event history.',
        caption: 'Original AutoZain staff UI adapted to local fictional data: the accepted request records an interested outcome, the employee returns to available, and the simulated event history remains consistent.',
      },
    ],
  },
  {
    slug: 'roya',
    name: 'Roya',
    domain: 'Film & TV production finance',
    summary: 'A bilingual film and TV finance platform connecting production plans, budgets, commitments, payments, and auditable history.',
    distinction: 'Preview how shooting-week changes affect only the budget lines that depend on duration before anything is saved.',
    problem: 'Production schedules and budgets change while teams still need controlled approvals and a financial history they can inspect. A planning change has to show its effect without quietly rewriting unrelated costs.',
    role: 'System design and full-stack development',
    contribution: 'Ahmed handled system design and full-stack development, including requirements, architecture, and deployment. The source evidence used here focuses on shooting-week budget previews and the financial history model rather than claiming every product area as an interactive example.',
    capabilities: [
      { label: 'Planning impact', detail: 'Budget versions and shooting-week previews identify affected lines, before-and-after values, the aggregate delta, and cap warnings.' },
      { label: 'Financial history', detail: 'Append-only events support rebuildable projections and point-in-time replay instead of relying only on the latest editable totals.' },
      { label: 'Controlled workflows', detail: 'Payment approval rules, separation of duties, production scheduling, and day-out-of-days concerns share the production context.' },
    ],
    decisions: [
      {
        title: 'Preview a schedule change without writing it',
        detail: 'The shooting-weeks preview is read-only. It recalculates opted-in duration-dependent lines, reports candidates, and includes only approved lines in the budget-total delta.',
        tradeoff: 'A distinct preview path avoids speculative mutations, but the calculation contract must stay aligned with any later commit behavior.',
      },
      {
        title: 'Preserve financial events, rebuild projections',
        detail: 'Financial activity is represented through append-only events with projections that can be replayed to reconstruct state at a point in time.',
        tradeoff: 'This keeps history inspectable, but projection code and event ordering require more discipline than updating a single mutable total.',
      },
    ],
    flow: ['Current shooting plan', 'Weeks impact preview', 'Affected budget lines', 'Review without mutation'],
    demoSummary: 'The local sample previews a fictional change from four to six shooting weeks, recalculates the eligible weekly line, keeps the fixed line unchanged, and cancels without saving. Approvals, payments, reports, and project mutation remain outside this bounded view.',
    stack: ['React', 'TypeScript', 'Node.js / Express', 'PostgreSQL', 'Kysely'],
    repositoryUrl: 'https://github.com/7ossam26/Film-production-fin-system',
    demoAvailable: true,
    media: [
      {
        src: '/images/roya/shooting-weeks-impact-1440x900.png',
        width: 1440,
        height: 900,
        alt: 'Roya bilingual project interface showing a fictional shooting-weeks budget impact preview with before, after, and affected-line totals.',
        caption: 'Original Roya project and impact-preview UI adapted to local fictional data: the opted-in weekly crew line changes from four to six weeks while the fixed equipment line remains unchanged.',
      },
    ],
  },
  {
    slug: 'ramex',
    name: 'Ramex',
    domain: 'Fabric retail & inventory',
    summary: 'A fabric retail ERP designed around individual rolls, supported sale units, and durable invoice records.',
    distinction: 'A sale identifies one complete fabric roll and preserves its measured quantity and unit on the invoice.',
    problem: 'Fabric stock cannot be represented as interchangeable item counts. A roll has its own identity and a measured quantity in meters or kilograms, and a completed sale must remain understandable after inventory changes.',
    role: 'System design and full-stack development',
    contribution: 'Ahmed handled system design and full-stack development, including requirements and architecture. The inspected sale path confirms whole-roll handling at the pinned source revision; it does not support a partial-roll quantity decrement.',
    capabilities: [
      { label: 'Roll inventory', detail: 'Per-roll identity and factory shipment workflows keep physically distinct stock visible instead of collapsing it into a generic item count.' },
      { label: 'Source-correct sales', detail: 'The inspected workflow sells a complete selected roll in its supported meter or kilogram unit and marks that roll unavailable.' },
      { label: 'Durable records', detail: 'Invoices preserve the sold quantity and unit as a snapshot, supporting later review even after live inventory state changes.' },
    ],
    decisions: [
      {
        title: 'Treat the selected roll as the sale boundary',
        detail: 'Sale creation locks the selected records, rejects duplicate or non-sellable rolls, creates the invoice, and marks those rolls sold in one transaction.',
        tradeoff: 'This protects roll-level traceability, but the audited version intentionally cannot represent a partial sale from a longer roll.',
      },
      {
        title: 'Snapshot quantity and unit on the invoice',
        detail: 'The invoice line records the complete roll length or weight and its unit, with an explicit migration and fallback for historical rows.',
        tradeoff: 'Snapshots keep old invoices stable, but schema evolution needs a careful compatibility path for records created before the fields existed.',
      },
    ],
    flow: ['Select identified roll', 'Validate sellable state', 'Create whole-roll sale', 'Preserve invoice snapshot'],
    demoSummary: 'The planned local scenario will sell one fictional 30 m roll, preserve a 30.000 meter invoice line, and leave a second roll unchanged. It is not available in this preview; there is no partial-roll control, backend, account, or live stock connection.',
    stack: ['React', 'TypeScript', 'Node.js / Express', 'PostgreSQL', 'Knex'],
    repositoryUrl: 'https://github.com/7ossam26/Ramex-Store',
    demoAvailable: false,
  },
] as const satisfies readonly ProjectContent[];

export const projectBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
) as { readonly [Slug in ProjectSlug]: Extract<(typeof projects)[number], { slug: Slug }> };
