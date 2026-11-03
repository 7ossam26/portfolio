import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

// Execute the real module with small DOM/event doubles. These tests check the
// preference/resource lifecycle; they do not render or emulate a browser.
const source = await readFile(new URL('../../apps/portfolio/src/scripts/motion.ts', import.meta.url), 'utf8');
const javascript = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;

function eventTarget() {
  const listeners = new Map();
  return {
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
    emit(name, event = {}) { [...(listeners.get(name) ?? [])].forEach((callback) => callback(event)); },
    count(name) { return listeners.get(name)?.size ?? 0; },
  };
}

function element(className = '') {
  const classes = new Set(className.split(' ').filter(Boolean));
  const properties = new Map();
  const attributes = new Map();
  return {
    children: [], parent: null, dataset: {}, scrollHeight: 8000,
    classList: {
      add(...names) { names.forEach((name) => classes.add(name)); },
      remove(...names) { names.forEach((name) => classes.delete(name)); },
      contains(name) { return classes.has(name); },
      toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); },
    },
    set className(value) { classes.clear(); value.split(' ').forEach((name) => classes.add(name)); },
    style: {
      setProperty(name, value) { properties.set(name, value); },
      removeProperty(name) { properties.delete(name); },
      getPropertyValue(name) { return properties.get(name) ?? ''; },
    },
    setAttribute(name, value) { attributes.set(name, value); },
    getAttribute(name) { return attributes.get(name) ?? null; },
    removeAttribute(name) { attributes.delete(name); },
    toggleAttribute(name, enabled) { enabled ? attributes.set(name, '') : attributes.delete(name); },
    hasAttribute(name) { return attributes.has(name); },
    append(...nodes) { nodes.forEach((node) => { node.parent = this; this.children.push(node); }); },
    prepend(node) { node.parent = this; this.children.unshift(node); },
    remove() {
      if (this.parent) this.parent.children = this.parent.children.filter((node) => node !== this);
      this.parent = null;
    },
    getBoundingClientRect() { return { top: 200, height: 1400 }; },
  };
}

function setup(options = {}) {
  const root = element();
  const body = element();
  const studio = element('studio');
  const nav = element('studio-nav');
  const feature = element('featured-project');
  const heading = element();
  const row = element('project-entry');
  const divider = element('section-heading');
  const visual = element('project-visual');
  const hero = element('studio-hero');
  const heroField = element('hero-orbit-field');
  const training = element('training-list');
  const toggle = Object.assign(element('motion-toggle'), eventTarget());
  const label = element();
  const storage = options.storage ?? new Map();
  root.append(body);
  body.append(studio);
  studio.append(nav, heading, divider, feature, row);
  feature.append(visual);
  heading.append(hero, training);
  hero.append(heroField);
  nav.append(toggle);
  const selectors = new Map([
    ['.studio', studio], ['.studio-nav', nav], ['.featured-project', feature],
    ['.hero-main h1', heading], ['#studio-heading > span', heading],
    ['.section-heading', divider], ['.project-entry', row],
    ['.project-visual', visual], ['[data-motion-toggle]', toggle], ['[data-motion-label]', label],
    ['.studio-hero', hero], ['.hero-orbit-field', heroField], ['.training-list', training],
  ]);
  const document = Object.assign(eventTarget(), {
    documentElement: root, body, hidden: options.hidden ?? false,
    querySelector(selector) { return selectors.get(selector) ?? null; },
    querySelectorAll(selector) {
      return [...new Set(selector.split(',').map((item) => selectors.get(item.trim())).filter(Boolean))];
    },
    createElement() { return element(); },
  });
  const preference = Object.assign(eventTarget(), { matches: options.initialMotion ?? true });
  if (options.missingPreferenceEvents) delete preference.addEventListener;
  const observers = [];
  const frames = new Map();
  let nextFrame = 1;
  const window = Object.assign(eventTarget(), {
    innerHeight: 600, innerWidth: 1200, scrollY: 200,
    sessionStorage: {
      getItem(key) { if (options.blockStorage) throw new Error('Storage unavailable'); return storage.get(key) ?? null; },
      setItem(key, value) { if (options.blockStorage) throw new Error('Storage unavailable'); storage.set(key, value); },
    },
    matchMedia() { return preference; },
    requestAnimationFrame(callback) { const id = nextFrame++; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    IntersectionObserver: class {
      constructor(callback, config) {
        if (options.failObserver) throw new Error('Observer unavailable');
        this.callback = callback;
        this.config = config;
        this.observed = new Set();
        this.disconnected = false;
        observers.push(this);
      }
      observe(node) {
        if (options.failObserve) throw new Error('Observation failed');
        this.observed.add(node);
      }
      disconnect() { this.disconnected = true; this.observed.clear(); }
    },
  });
  if (options.missingAPI) delete window[options.missingAPI];
  if (options.failInitialLayout) heading.getBoundingClientRect = () => { throw new Error('Layout unavailable'); };
  vm.runInNewContext(javascript, { window, document });
  const preferenceChange = (matches) => {
    preference.matches = matches;
    preference.emit('change', { matches });
  };
  const flushFrames = () => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback());
  };
  const assertStatic = () => {
    assert.equal(root.classList.contains('motion-ready'), false);
    assert.equal(root.classList.contains('motion-backgrounded'), false);
    assert.equal(nav.classList.contains('motion-reveal'), false);
    assert.equal(nav.hasAttribute('data-scrolled'), false);
    for (const node of [feature, heading, divider, visual]) {
      for (const name of ['motion-reveal', 'motion-visible', 'motion-line']) {
        assert.equal(node.classList.contains(name), false);
      }
      assert.equal(node.style.getPropertyValue('--motion-delay'), '');
      assert.equal(node.dataset.motionDirection, undefined);
    }
    assert.equal(heading.style.getPropertyValue('--scroll-offset'), '');
    assert.equal(visual.style.getPropertyValue('--scroll-offset'), '');
    assert.equal(row.style.getPropertyValue('--row-progress'), '');
    assert.equal(heroField.style.getPropertyValue('--scroll-offset'), '');
    assert.equal(heroField.style.getPropertyValue('--pointer-drift-x'), '');
    assert.equal(heroField.style.getPropertyValue('--pointer-drift-y'), '');
    assert.equal(training.style.getPropertyValue('--section-progress'), '');
    assert.equal(hero.classList.contains('motion-visible'), false);
    assert.equal(nav.classList.contains('motion-visible'), false);
    assert.deepEqual(body.children, [studio]);
    assert.deepEqual(studio.children, [nav, heading, divider, feature, row]);
    for (const event of ['scroll', 'resize', 'pointermove', 'pointerout']) assert.equal(window.count(event), 0);
    assert.equal(frames.size, 0);
    assert.equal(document.count('visibilitychange'), 0);
    assert.ok(observers.every((observer) => observer.disconnected));
  };
  return { root, studio, nav, feature, heading, row, visual, hero, heroField, training, document, toggle, label, storage, preference, window, observers, frames,
    preferenceChange, flushFrames, assertStatic };
}

test('a changed motion preference stops pending work and can restart without duplicate resources', () => {
  const page = setup({ initialMotion: false });
  page.assertStatic();
  for (let cycle = 0; cycle < 3; cycle++) {
    page.preferenceChange(true);
    assert.equal(page.root.classList.contains('motion-ready'), true);
    assert.equal(page.nav.classList.contains('motion-reveal'), false);
    assert.equal(page.nav.hasAttribute('data-scrolled'), true);
    for (const event of ['scroll', 'resize', 'pointermove']) assert.equal(page.window.count(event), 1);
    page.window.emit('scroll');
    page.window.emit('resize');
    page.window.emit('pointermove', { clientX: 10, clientY: 20 });
    page.window.emit('pointermove', { clientX: 15, clientY: 25 });
    assert.equal(page.frames.size, 2, 'scroll/resize and pointer updates each share a single pending frame');
    const staleFrames = [...page.frames.values()];
    const staleObserver = page.observers.at(-1);
    page.preferenceChange(false);
    page.assertStatic();
    staleFrames.forEach((callback) => callback());
    staleObserver.callback([{ target: page.feature, isIntersecting: true }]);
    page.assertStatic();
  }
  assert.equal(page.preference.count('change'), 1);
});

test('small intersections reveal tall cards, re-entry repeats the reveal, and navigation stays visible', () => {
  const page = setup();
  const observer = page.observers[0];
  assert.equal(observer.config.threshold, 0);
  assert.equal(observer.config.rootMargin, '0px');
  assert.equal(page.nav.classList.contains('motion-reveal'), false, 'observing a navigation scene must never hide it');
  for (const visible of [true, false, true]) {
    observer.callback([{ target: page.feature, isIntersecting: visible, intersectionRatio: visible ? 0.01 : 0 }]);
    assert.equal(page.feature.classList.contains('motion-visible'), visible);
  }
  page.window.scrollY = 0;
  page.window.emit('scroll');
  page.flushFrames();
  assert.equal(page.nav.hasAttribute('data-scrolled'), false);
  page.preferenceChange(false);
  page.assertStatic();
});

for (const missingAPI of ['matchMedia', 'IntersectionObserver', 'requestAnimationFrame', 'cancelAnimationFrame']) {
  test(`missing ${missingAPI} keeps the static portfolio readable`, () => setup({ missingAPI }).assertStatic());
}
for (const failure of ['missingPreferenceEvents', 'failObserver', 'failObserve', 'failInitialLayout']) {
  test(`${failure} leaves no partially enabled motion`, () => setup({ [failure]: true }).assertStatic());
}

test('the visitor can pause pending motion, keep content visible, and resume without duplicate listeners', () => {
  const page = setup();
  page.window.emit('scroll');
  page.window.emit('pointermove', { clientX: 20, clientY: 30 });
  page.toggle.emit('click');
  page.assertStatic();
  assert.equal(page.toggle.getAttribute('aria-pressed'), 'true');
  assert.equal(page.label.textContent, 'Resume motion');
  assert.equal(page.root.classList.contains('motion-paused'), true);
  page.toggle.emit('click');
  assert.equal(page.root.classList.contains('motion-ready'), true);
  assert.equal(page.root.classList.contains('motion-paused'), false);
  assert.equal(page.label.textContent, 'Pause motion');
  for (const event of ['scroll', 'resize', 'pointermove', 'pointerout']) assert.equal(page.window.count(event), 1);
  assert.equal(page.toggle.count('click'), 1);
});

test('a manual pause survives navigation and the system preference remains authoritative', () => {
  const page = setup();
  page.toggle.emit('click');
  const nextPage = setup({ storage: page.storage });
  nextPage.assertStatic();
  assert.equal(nextPage.toggle.getAttribute('aria-pressed'), 'true');
  nextPage.preferenceChange(false);
  assert.equal(nextPage.toggle.hidden, true);
  nextPage.assertStatic();
  nextPage.preferenceChange(true);
  assert.equal(nextPage.toggle.hidden, false);
  nextPage.assertStatic();
  nextPage.toggle.emit('click');
  assert.equal(nextPage.root.classList.contains('motion-ready'), true);
  nextPage.preferenceChange(false);
  nextPage.assertStatic();
});

test('unavailable session storage does not prevent pausing or resuming motion', () => {
  const page = setup({ blockStorage: true });
  assert.equal(page.root.classList.contains('motion-ready'), true);
  page.toggle.emit('click');
  page.assertStatic();
  page.toggle.emit('click');
  assert.equal(page.root.classList.contains('motion-ready'), true);
});

test('illustrations track their own viewport visibility even inside a visible project', () => {
  const page = setup();
  const observer = page.observers[0];
  assert.equal(observer.observed.has(page.visual), true);
  observer.callback([{ target: page.feature, isIntersecting: true }, { target: page.visual, isIntersecting: true }]);
  assert.equal(page.visual.classList.contains('motion-visible'), true);
  observer.callback([{ target: page.visual, isIntersecting: false }]);
  assert.equal(page.feature.classList.contains('motion-visible'), true);
  assert.equal(page.visual.classList.contains('motion-visible'), false);
  page.preferenceChange(false);
  page.assertStatic();
});

test('backgrounding cancels queued work, ignores input, and resumes with one fresh layout update', () => {
  const page = setup();
  page.window.emit('scroll');
  page.window.emit('pointermove', { clientX: 400, clientY: 200, pointerType: 'mouse' });
  assert.equal(page.frames.size, 2);
  page.document.hidden = true;
  page.document.emit('visibilitychange');
  assert.equal(page.frames.size, 0);
  assert.equal(page.root.classList.contains('motion-backgrounded'), true);
  page.window.emit('scroll');
  page.window.emit('pointermove', { clientX: 300, clientY: 100 });
  assert.equal(page.frames.size, 0);
  page.document.hidden = false;
  page.document.emit('visibilitychange');
  page.document.emit('visibilitychange');
  assert.equal(page.root.classList.contains('motion-backgrounded'), false);
  assert.equal(page.frames.size, 1);
  page.flushFrames();
  assert.equal(page.document.count('visibilitychange'), 1);
  page.preferenceChange(false);
  page.assertStatic();
});

test('pausing a background tab cleans up visibility listeners and cannot restart behind the pause', () => {
  const page = setup({ hidden: true });
  assert.equal(page.root.classList.contains('motion-backgrounded'), true);
  page.toggle.emit('click');
  page.assertStatic();
  page.document.hidden = false;
  page.document.emit('visibilitychange');
  page.assertStatic();
  page.toggle.emit('click');
  assert.equal(page.document.count('visibilitychange'), 1);
  assert.equal(page.root.classList.contains('motion-ready'), true);
});

test('touch input does not move the decorative field and pointer drift remains bounded and disposable', () => {
  const page = setup();
  page.window.emit('pointermove', { clientX: 400, clientY: 200, pointerType: 'touch' });
  assert.equal(page.frames.size, 0);
  page.window.emit('pointermove', { clientX: 99999, clientY: -400, pointerType: 'mouse' });
  page.flushFrames();
  assert.equal(page.heroField.style.getPropertyValue('--pointer-drift-x'), '1.000');
  assert.equal(page.heroField.style.getPropertyValue('--pointer-drift-y'), '-1.000');
  page.toggle.emit('click');
  page.assertStatic();
});

test('the training rail fills as its section scrolls into view and clamps at both ends', () => {
  const page = setup();
  for (const [top, height, expected] of [[1000, 400, '0.0000'], [310, 400, '0.5000'], [-200, 400, '1.0000'], [600, 0, '0.0000']]) {
    page.training.getBoundingClientRect = () => ({ top, height });
    page.window.emit('scroll');
    page.flushFrames();
    assert.equal(page.training.style.getPropertyValue('--section-progress'), expected);
  }
  page.preferenceChange(false);
  page.assertStatic();
});

function findSaturn(page) {
  const background = page.studio.children[0];
  assert.equal(background.classList.contains('motion-background'), true);
  const saturn = background.children.find((node) => node.classList.contains('saturn'));
  assert.ok(saturn, 'Saturn is created inside the decorative background');
  return saturn;
}

// Saturn geometry used below: centre (1000, 500), size 400 → planet radius 84,
// ring radius 194 (flattened to 30%), proximity field 420; rings tilted −24° at the top of the page.
const TILT = -24 * Math.PI / 180;
const acrossRings = (distance) => [1000 - Math.sin(TILT) * distance, 500 + Math.cos(TILT) * distance];
const alongRings = (distance) => [1000 + Math.cos(TILT) * distance, 500 + Math.sin(TILT) * distance];

test('Saturn intensifies as the pointer approaches, peaks over the planet or rings, and releases on exit', () => {
  const page = setup();
  const saturn = findSaturn(page);
  assert.equal(saturn.dataset.saturn, 'idle');
  const animations = [
    { animationName: 'saturn-flow-spin', rate: 1, updatePlaybackRate(rate) { this.rate = rate; } },
    { animationName: 'saturn-flow-moon-x', playbackRate: 1 },
    { animationName: 'saturn-burst', rate: 1, updatePlaybackRate(rate) { this.rate = rate; } },
  ];
  saturn.getAnimations = () => animations;
  saturn.getBoundingClientRect = () => ({ left: 800, top: 300, width: 400, height: 400 });
  page.window.scrollY = 0;
  page.window.emit('scroll');
  page.flushFrames();
  const move = ([clientX, clientY], pointerType = 'mouse') => {
    page.window.emit('pointermove', { clientX, clientY, pointerType });
    page.flushFrames();
  };
  const tempo = () => [animations[0].rate, animations[1].playbackRate, animations[2].rate];

  move([100, 100]);
  assert.equal(saturn.dataset.saturn, 'idle');
  assert.equal(saturn.style.getPropertyValue('--saturn-near'), '');

  move([700, 500]);
  assert.equal(saturn.dataset.saturn, 'near');
  assert.equal(saturn.style.getPropertyValue('--saturn-near'), '0.357');
  assert.ok(Number(saturn.style.getPropertyValue('--saturn-pull-x')) < 0, 'Saturn is drawn toward a pointer on its left');
  assert.ok(Number(saturn.style.getPropertyValue('--saturn-turn-y')) < 0);
  assert.deepEqual(tempo(), [2.2, 2.2, 1], 'only the continuous flow loops accelerate');

  move(acrossRings(95));
  assert.equal(saturn.dataset.saturn, 'near', 'just beyond the planet edge is close, not over');
  assert.equal(saturn.style.getPropertyValue('--saturn-near'), '0.967');

  move([1000, 500]);
  assert.equal(saturn.dataset.saturn, 'over');
  assert.equal(saturn.style.getPropertyValue('--saturn-near'), '1.000');
  assert.deepEqual(tempo(), [4.5, 4.5, 1]);

  move(acrossRings(95));
  assert.equal(saturn.dataset.saturn, 'over', 'the swollen planet keeps the pointer over it');
  move(acrossRings(105));
  assert.equal(saturn.dataset.saturn, 'near');
  move(alongRings(170));
  assert.equal(saturn.dataset.saturn, 'over', 'the rings are part of the hover target');

  move([1000, 500], 'touch');
  page.window.emit('pointerout', {});
  assert.equal(saturn.dataset.saturn, 'idle', 'leaving the window releases Saturn');
  for (const name of ['--saturn-near', '--saturn-pull-x', '--saturn-pull-y', '--saturn-turn-x', '--saturn-turn-y']) {
    assert.equal(saturn.style.getPropertyValue(name), '');
  }
  assert.deepEqual(tempo(), [1, 1, 1]);

  move([1000, 500], 'touch');
  assert.equal(saturn.dataset.saturn, 'idle', 'touch never drives Saturn');
  page.preferenceChange(false);
  page.assertStatic();
});

test('Saturn rises with page progress and re-evaluates a resting pointer as it drifts', () => {
  const page = setup();
  const saturn = findSaturn(page);
  saturn.getBoundingClientRect = () => ({ left: 800, top: 300, width: 400, height: 400 });
  page.window.scrollY = 0;
  page.window.emit('scroll');
  page.flushFrames();
  assert.equal(saturn.style.getPropertyValue('--saturn-angle'), '-24.00deg');
  page.window.emit('pointermove', { clientX: 1000, clientY: 500, pointerType: 'mouse' });
  page.flushFrames();
  assert.equal(saturn.dataset.saturn, 'over');

  page.window.scrollY = 7400;
  page.window.emit('scroll');
  page.flushFrames();
  assert.equal(saturn.style.getPropertyValue('--saturn-drift-x'), '-48.0px');
  assert.equal(saturn.style.getPropertyValue('--saturn-drift-y'), '-204.0px');
  assert.equal(saturn.style.getPropertyValue('--saturn-angle'), '-12.00deg');
  assert.equal(saturn.dataset.saturn, 'near', 'the planet moved out from under a stationary pointer');
  page.toggle.emit('click');
  page.assertStatic();
});

test('Saturn stays idle and harmless when its layout box is unavailable', () => {
  const page = setup();
  const saturn = findSaturn(page);
  page.window.emit('pointermove', { clientX: 1000, clientY: 500, pointerType: 'mouse' });
  page.flushFrames();
  assert.equal(saturn.dataset.saturn, 'idle');
  assert.equal(page.root.classList.contains('motion-ready'), true);
});
