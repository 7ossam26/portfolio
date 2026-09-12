import registryData from '../demo-registry.json';

export const demoIds = ['vertex', 'autozain', 'roya', 'ramex'] as const;

export type DemoId = (typeof demoIds)[number];
export type DemoMessageType = 'READY' | 'STEP_CHANGED' | 'COMPLETE' | 'ERROR' | 'REQUEST_CLOSE';

export interface DemoEnvelope<TDemoId extends string = DemoId> {
  readonly channel: 'ah-portfolio-demo';
  readonly version: 1;
  readonly demoId: TDemoId;
  readonly sessionId: string;
  readonly type: DemoMessageType;
  readonly payload?: unknown;
}

export interface DemoRegistryEntry {
  readonly slug: DemoId;
  readonly name: string;
  readonly path: `/demos/${DemoId}/`;
  readonly frameTitle: string;
  readonly guidance: string;
  readonly available: boolean;
}

export interface EnvelopeExpectation<TDemoId extends string = DemoId> {
  readonly demoId: TDemoId;
  readonly sessionId: string;
}

const messageTypes = new Set<DemoMessageType>([
  'READY',
  'STEP_CHANGED',
  'COMPLETE',
  'ERROR',
  'REQUEST_CLOSE',
]);

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
);

export function isDemoEnvelope<TDemoId extends string>(
  value: unknown,
  expectation: EnvelopeExpectation<TDemoId>,
): value is DemoEnvelope<TDemoId> {
  if (!isRecord(value)) return false;

  return value.channel === 'ah-portfolio-demo'
    && value.version === 1
    && value.demoId === expectation.demoId
    && value.sessionId === expectation.sessionId
    && typeof value.type === 'string'
    && messageTypes.has(value.type as DemoMessageType);
}

export const demoRegistry = registryData as readonly DemoRegistryEntry[];

const configuredSlugs = new Set(demoRegistry.map((entry) => entry.slug));
if (configuredSlugs.size !== demoIds.length || demoIds.some((slug) => !configuredSlugs.has(slug))) {
  throw new Error('Demo registry must contain each supported demo exactly once.');
}
