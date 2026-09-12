type DemoMessageType = 'READY' | 'STEP_CHANGED' | 'COMPLETE' | 'ERROR' | 'REQUEST_CLOSE';

const params = new URLSearchParams(window.location.search);
export const isEmbedded = params.get('embedded') === '1';
const sessionId = params.get('sessionId');
const validSession = typeof sessionId === 'string' && /^[a-zA-Z0-9-]{8,80}$/.test(sessionId);

export function postDemoMessage(type: DemoMessageType, payload?: unknown) {
  if (!isEmbedded || !validSession || window.parent === window) return;
  window.parent.postMessage({
    channel: 'ah-portfolio-demo',
    version: 1,
    demoId: 'roya',
    sessionId,
    type,
    payload,
  }, window.location.origin);
}
