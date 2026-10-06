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
  root.append(body);
  body.append(studio);
  studio.append(nav, heading, divider, feature, row);
  const selectors = new Map([
    ['.studio', studio], ['.studio-nav', nav], ['.featured-project', feature],
    ['.hero-main h1', heading], ['#studio-heading > span', heading],
    ['.section-heading', divider], ['.project-entry', row],
  ]);
  const document = {
    documentElement: root, body,
    querySelector(selector) { return selectors.get(selector) ?? null; },
    querySelectorAll(selector) {
      return [...new Set(selector.split(',').map((item) => selectors.get(item.trim())).filter(Boolean))];
    },
    createElement() { return element(); },
  };
  const preference = Object.assign(eventTarget(), { matches: options.initialMotion ?? true });
  if (options.missingPreferenceEvents) delete preference.addEventListener;
  const observers = [];
  const frames = new Map();
  let nextFrame = 1;
  const window = Object.assign(eventTarget(), {
    innerHeight: 600, scrollY: 200,
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
    assert.equal(nav.classList.contains('motion-reveal'), false);
    assert.equal(nav.hasAttribute('data-scrolled'), false);
    for (const node of [feature, heading, divider]) {
      for (const name of ['motion-reveal', 'motion-visible', 'motion-line']) {
        assert.equal(node.classList.contains(name), false);
      }
      assert.equal(node.style.getPropertyValue('--motion-delay'), '');
      assert.equal(node.dataset.motionDirection, undefined);
    }
    assert.equal(heading.style.getPropertyValue('--scroll-offset'), '');
    assert.equal(row.style.getPropertyValue('--row-progress'), '');
    assert.deepEqual(body.children, [studio]);
    assert.deepEqual(studio.children, [nav, heading, divider, feature, row]);
    for (const event of ['scroll', 'resize', 'pointermove']) assert.equal(window.count(event), 0);
    assert.equal(frames.size, 0);
    assert.ok(observers.every((observer) => observer.disconnected));
  };
  return { root, studio, nav, feature, heading, row, preference, window, observers, frames,
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
  assert.equal(observer.observed.has(page.nav), false);
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
