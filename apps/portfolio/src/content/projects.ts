export const projectSlugs = ['vertex', 'autozain', 'roya', 'ramex'] as const;

export type ProjectSlug = (typeof projectSlugs)[number];

export interface ProjectCapability {
  readonly label: string;
  readonly detail: string;
}

export interface ProjectContent {
  readonly slug: ProjectSlug;
  readonly name: string;
  readonly domain: string;
  readonly summary: string;
  readonly role?: string;
  readonly capabilities: readonly ProjectCapability[];
  readonly stack: readonly string[];
  readonly repositoryUrl: string;
  readonly demoAvailable: boolean;
}

export const projects = [
  {
    slug: 'vertex',
    name: 'Vertex ERP',
    domain: 'Retail & business operations',
    summary: 'A multi-branch ERP connecting retail sales with inventory, production, and finance.',
    role: 'Full-stack development',
    capabilities: [
      { label: 'Sales', detail: 'Point of sale, wholesale, and call-center workflows' },
      { label: 'Production', detail: 'Bill-of-materials recipes, material consumption, and costing' },
      { label: 'Operations', detail: 'Branch access, shifts, reporting, and audit-related behavior' },
    ],
    stack: ['React', 'Vite', 'Node.js / Express', 'Prisma', 'MySQL'],
    repositoryUrl: 'https://github.com/7ossam26/ERP-V2',
    demoAvailable: false,
  },
  {
    slug: 'autozain',
    name: 'AutoZain',
    domain: 'Automotive marketplace & operations',
    summary: 'A used-car marketplace connected to staff contact handling and dealership operations.',
    capabilities: [
      { label: 'Marketplace', detail: 'Public vehicle search, filtering, details, and favorites' },
      { label: 'Requests', detail: 'Staff availability, live contact handling, and tracked outcomes' },
      { label: 'Operations', detail: 'Deposit review and controlled sale closing' },
    ],
    stack: ['React', 'Vite', 'Node.js / Express', 'Socket.io', 'Prisma', 'PostgreSQL'],
    repositoryUrl: 'https://github.com/7ossam26/autozain-system',
    demoAvailable: false,
  },
  {
    slug: 'roya',
    name: 'Roya',
    domain: 'Film & TV production finance',
    summary: 'A bilingual film and TV finance platform connecting production plans, budgets, commitments, payments, and auditable history.',
    role: 'System design and full-stack development',
    capabilities: [
      { label: 'Budgets', detail: 'Versioned budgets and shooting-week impact previews' },
      { label: 'History', detail: 'Append-only financial events and rebuildable projections' },
      { label: 'Controls', detail: 'Payment approvals and production scheduling workflows' },
    ],
    stack: ['React', 'TypeScript', 'Node.js / Express', 'PostgreSQL', 'Kysely'],
    repositoryUrl: 'https://github.com/7ossam26/Film-production-fin-system',
    demoAvailable: false,
  },
  {
    slug: 'ramex',
    name: 'Ramex',
    domain: 'Fabric retail & inventory',
    summary: 'A fabric retail ERP designed around individual rolls, supported sale units, and durable invoice records.',
    role: 'System design and full-stack development',
    capabilities: [
      { label: 'Inventory', detail: 'Per-roll stock and factory shipment workflows' },
      { label: 'Sales', detail: 'Whole-roll sales in supported meter or kilogram units' },
      { label: 'Records', detail: 'Quantity and unit snapshots preserved on invoices' },
    ],
    stack: ['React', 'TypeScript', 'Node.js / Express', 'PostgreSQL', 'Knex'],
    repositoryUrl: 'https://github.com/7ossam26/Ramex-Store',
    demoAvailable: false,
  },
] as const satisfies readonly ProjectContent[];

export const projectBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
) as { readonly [Slug in ProjectSlug]: Extract<(typeof projects)[number], { slug: Slug }> };
