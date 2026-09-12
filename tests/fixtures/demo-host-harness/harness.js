const parameters = new URLSearchParams(window.location.search);
const sessionId = parameters.get('sessionId') ?? '';
const demoId = 'host-harness';
const targetOrigin = window.location.origin;
const status = document.querySelector('#status');
const innerDialog = document.querySelector('#inner-dialog');
const allowedModes = new Set(['ready', 'validation', 'error', 'stall']);
const requestedMode = parameters.get('mode') ?? 'ready';
const mode = allowedModes.has(requestedMode) ? requestedMode : 'ready';

const envelope = (type, payload, overrides = {}) => ({
  channel: 'ah-portfolio-demo',
  version: 1,
  demoId,
  sessionId,
  type,
  ...(payload === undefined ? {} : { payload }),
  ...overrides,
});

const send = (type, payload, overrides) => {
  window.parent.postMessage(envelope(type, payload, overrides), targetOrigin);
};

const setStatus = (message) => {
  status.textContent = message;
};

const sendReady = () => {
  send('READY');
  setStatus('READY sent for the current session.');
};

document.addEventListener('click', (event) => {
  const control = event.target.closest('[data-action]');
  if (!control) return;

  switch (control.dataset.action) {
    case 'ready':
      sendReady();
      break;
    case 'error':
      send('ERROR', { message: 'The controlled child reported a sample failure.' });
      setStatus('ERROR sent for the current session.');
      break;
    case 'close':
      send('REQUEST_CLOSE');
      break;
    case 'malformed':
      window.parent.postMessage({ unexpected: true }, targetOrigin);
      setStatus('Malformed message sent. The host should ignore it.');
      break;
    case 'stale':
      send('READY', undefined, { sessionId: `${sessionId}-stale` });
      setStatus('Stale-session READY sent. The host should ignore it.');
      break;
    case 'inner-dialog':
      innerDialog.showModal();
      setStatus('Inner dialog opened.');
      break;
    case 'close-inner':
      innerDialog.close();
      setStatus('Inner dialog closed.');
      break;
  }
});

innerDialog.addEventListener('close', () => setStatus('Inner dialog closed.'));

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || innerDialog.open) return;
  event.preventDefault();
  send('REQUEST_CLOSE');
});

if (window.parent === window || !sessionId) {
  setStatus('Standalone harness view. No parent session is active.');
} else if (mode === 'error') {
  window.setTimeout(() => send('ERROR', { message: 'The controlled child failed during startup.' }), 80);
} else if (mode === 'stall') {
  const stallKey = 'demo-host-harness-stalled-once';
  if (window.sessionStorage.getItem(stallKey) === '1') {
    window.setTimeout(sendReady, 80);
  } else {
    window.sessionStorage.setItem(stallKey, '1');
    setStatus('Intentionally stalled. The host timeout should provide recovery.');
  }
} else if (mode === 'validation') {
  window.setTimeout(() => {
    window.parent.postMessage({ unexpected: true }, targetOrigin);
    send('READY', undefined, { version: 2 });
    send('READY', undefined, { sessionId: `${sessionId}-stale` });
    send('READY', undefined, { demoId: 'vertex' });
    setStatus('Malformed and mismatched messages sent. Waiting before valid READY.');
  }, 40);
  window.setTimeout(sendReady, 320);
} else {
  window.setTimeout(sendReady, 80);
}
