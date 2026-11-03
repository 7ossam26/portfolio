type SaturnState = 'idle' | 'near' | 'over';
type Point = { x: number; y: number };

interface Saturn {
  root: HTMLElement;
  /** Element whose `saturn-flow-*` loops follow this planet's tempo (hero: planet + orbits). */
  scope: HTMLElement;
  /** Untransformed anchor box in viewport coordinates; drift and hover act on children. */
  box: { x: number; y: number; size: number } | null;
  state: SaturnState;
  energy: number;
  driftX: number;
  driftY: number;
  /** Ring-plane rotation in degrees, matching the `--saturn-angle` in use. */
  angle: number;
}

/** Ring-plane flattening shared with saturn.css (`scaleY(.3)`) and the hover geometry. */
const SATURN_RING_TILT = 0.3;
/** Resting ring angle of the hero planet; matches the `--saturn-angle` default in saturn.css. */
const HERO_SATURN_ANGLE = -20;
/** Playback multipliers for the continuous `saturn-flow-*` loops. */
const SATURN_TEMPO: Record<SaturnState, number> = { idle: 1, near: 2.2, over: 4.5 };
const SATURN_VARIABLES = ['--saturn-near', '--saturn-pull-x', '--saturn-pull-y', '--saturn-turn-x', '--saturn-turn-y', '--saturn-tip-x', '--saturn-tip-y'];

const clamp = (value: number, min = -1, max = 1): number => Math.min(max, Math.max(min, value));

const createSaturn = (root: HTMLElement, angle: number, scope: HTMLElement = root): Saturn => (
  { root, scope, box: null, state: 'idle', energy: 0, driftX: 0, driftY: 0, angle }
);

function measureSaturn(saturn: Saturn): void {
  const rect = saturn.root.getBoundingClientRect();
  saturn.box = Number.isFinite(rect.left) && Number.isFinite(rect.top) && rect.width > 0
    ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, size: rect.width }
    : null;
}

function setSaturnState(saturn: Saturn, state: SaturnState): void {
  if (state === saturn.state) return;
  saturn.state = state;
  saturn.root.dataset.saturn = state;
  // Accelerate the running loops in place instead of restarting them.
  if (typeof saturn.scope.getAnimations !== 'function') return;
  saturn.scope.getAnimations({ subtree: true }).forEach((animation) => {
    if (!('animationName' in animation) || !String(animation.animationName).startsWith('saturn-flow')) return;
    if (typeof animation.updatePlaybackRate === 'function') animation.updatePlaybackRate(SATURN_TEMPO[state]);
    else animation.playbackRate = SATURN_TEMPO[state];
  });
}

function releaseSaturn(saturn: Saturn): void {
  saturn.energy = 0;
  if (saturn.state === 'idle') return;
  SATURN_VARIABLES.forEach((name) => saturn.root.style.removeProperty(name));
  setSaturnState(saturn, 'idle');
}

/** Classifies the pointer against the planet disc, the flattened ring ellipse and the proximity field. */
function updateSaturn(saturn: Saturn, pointer: Point | null): void {
  if (!pointer || !saturn.box) {
    releaseSaturn(saturn);
    return;
  }
  const { size } = saturn.box;
  const dx = pointer.x - (saturn.box.x + saturn.driftX);
  const dy = pointer.y - (saturn.box.y + saturn.driftY);
  const angle = saturn.angle * Math.PI / 180;
  const along = dx * Math.cos(angle) + dy * Math.sin(angle);
  const across = dy * Math.cos(angle) - dx * Math.sin(angle);
  const distance = Math.hypot(dx, dy);
  const planetRadius = size * .21;
  const ringRadius = size * .485;
  const fieldRadius = size * 1.05;
  // The hit area follows the planet's visible swell (CSS scales it by up to
  // 1.08 × 1.07), which also keeps the state steady on an edge.
  const grow = saturn.state === 'over' ? 1.15 : 1 + saturn.energy * .08;
  const onPlanet = distance <= planetRadius * grow;
  const onRings = (along / (ringRadius * grow)) ** 2
    + (across / (ringRadius * SATURN_RING_TILT * grow)) ** 2 <= 1;
  const next: SaturnState = onPlanet || onRings ? 'over'
    : distance <= fieldRadius * (saturn.state === 'idle' ? 1 : 1.08) ? 'near' : 'idle';
  if (next === 'idle') {
    releaseSaturn(saturn);
    return;
  }
  const energy = next === 'over' ? 1 : clamp(1 - (distance - planetRadius) / (fieldRadius - planetRadius), 0, 1);
  saturn.energy = energy;
  const reachX = clamp(dx / fieldRadius);
  const reachY = clamp(dy / fieldRadius);
  const { style } = saturn.root;
  style.setProperty('--saturn-near', energy.toFixed(3));
  style.setProperty('--saturn-pull-x', (reachX * 26 * energy).toFixed(2));
  style.setProperty('--saturn-pull-y', (reachY * 20 * energy).toFixed(2));
  style.setProperty('--saturn-turn-x', (-reachY * 14 * energy).toFixed(2));
  style.setProperty('--saturn-turn-y', (reachX * 18 * energy).toFixed(2));
  // The hero label follows the pointer, relative to the planet's centre.
  style.setProperty('--saturn-tip-x', dx.toFixed(2));
  style.setProperty('--saturn-tip-y', dy.toFixed(2));
  setSaturnState(saturn, next);
}

/** Optional motion must leave the portfolio readable when disabled or unavailable. */
function startMotion(): () => void {
  const root = document.documentElement;
  const cleanups: Array<() => void> = [];
  let active = true;
  let pointerFrame: number | null = null;
  let scrollFrame: number | null = null;

  const cleanup = (): void => {
    active = false;
    // Remove the hiding gate before cleaning up any individual animation.
    root.classList.remove('motion-ready', 'motion-backgrounded');
    if (pointerFrame !== null) window.cancelAnimationFrame(pointerFrame);
    if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
    pointerFrame = scrollFrame = null;
    cleanups.splice(0).reverse().forEach((dispose) => dispose());
  };

  try {
    if (typeof window.IntersectionObserver !== 'function'
      || typeof window.requestAnimationFrame !== 'function'
      || typeof window.cancelAnimationFrame !== 'function') return cleanup;

    const studio = document.querySelector<HTMLElement>('.studio');
    if (!studio) return cleanup;

    const revealGroups: Array<{ selector: string; direction: string }> = [
      // Navigation stays visible, including when a page opens at a fragment.
      { selector: '.hero-main > .eyebrow, .case-heading > .eyebrow', direction: 'left' },
      { selector: '#studio-heading > span, .case-heading h1, .case-deck', direction: 'up' },
      { selector: '.hero-aside, .case-meta', direction: 'right' },
      { selector: '.section-heading, .case-section', direction: 'up' },
      { selector: '.featured-project, .case-capture, .system-diagram, .demo-status', direction: 'scale' },
      { selector: '.project-visual, .work-index, .background-intro, .skill-group, .education-block, .training-block > h3', direction: 'up' },
      { selector: '.training-list > li', direction: 'left' },
      { selector: '.hero-links', direction: 'up' },
      { selector: '.project-list > article', direction: 'left' },
      { selector: '.capability-list > div, .decision-list > article', direction: 'up' },
      { selector: '.case-next, .contact-copy, .contact-details, .footer-credit', direction: 'up' },
    ];
    const revealTargets: HTMLElement[] = [];
    cleanups.push(() => revealTargets.forEach((element) => {
      element.classList.remove('motion-reveal', 'motion-visible');
      delete element.dataset.motionDirection;
      element.style.removeProperty('--motion-delay');
    }));
    revealGroups.forEach(({ selector, direction }) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
        revealTargets.push(element);
        element.classList.add('motion-reveal');
        element.dataset.motionDirection = direction;
        element.style.setProperty('--motion-delay', `${Math.min(index % 4, 3) * 85}ms`);
      });
    });

    const lineTargets = document.querySelectorAll<HTMLElement>(
      '.section-heading, .case-section, .project-list, .footer-credit',
    );
    cleanups.push(() => lineTargets.forEach((element) => element.classList.remove('motion-line')));
    lineTargets.forEach((element) => element.classList.add('motion-line'));

    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    cleanups.push(() => progress.remove());
    document.body.prepend(progress);

    const ambientBackground = document.createElement('div');
    ambientBackground.className = 'motion-background';
    ambientBackground.setAttribute('aria-hidden', 'true');
    cleanups.push(() => ambientBackground.remove());

    const layer = (className: string, parent: HTMLElement, tag = 'div'): HTMLElement => {
      const node = document.createElement(tag);
      node.className = className;
      parent.append(node);
      return node;
    };
    // Paint order: nebula, light, stars, the ambient Saturn, then the pointer glow and embers.
    layer('motion-nebula', ambientBackground);
    const ambientOrbs = layer('motion-background-orbs', ambientBackground);
    for (let i = 1; i <= 3; i++) layer(`motion-orb motion-orb-${i}`, ambientOrbs);
    const ambientBeam = layer('motion-background-beam', ambientBackground);
    layer('motion-background-beam-surface', ambientBeam);
    // Three star depths follow the pointer at different distances; dust rides the nearest.
    const stars = layer('motion-stars', ambientBackground);
    ['far', 'mid', 'twinkle'].forEach((depth) => layer(`motion-star-layer motion-star-${depth}`, stars));
    const nearStars = layer('motion-star-layer motion-star-near', stars);
    for (let i = 0; i < 12; i++) layer('motion-dust', nearStars, 'span');
    // The ambient planet is cloned from inert markup so both planets share one source.
    const ambientSaturnRoot = (document.querySelector<HTMLTemplateElement>('template[data-saturn-template]')
      ?.content.firstElementChild?.cloneNode(true) ?? null) as HTMLElement | null;
    if (ambientSaturnRoot) ambientBackground.append(ambientSaturnRoot);
    const ambientSpotlight = layer('motion-background-spotlight', ambientBackground);
    const ambientEmbers = layer('motion-background-embers', ambientBackground);
    for (let i = 1; i <= 8; i++) layer(`motion-ember motion-ember-${i}`, ambientEmbers, 'span');
    for (let i = 1; i <= 2; i++) layer(`motion-shooting-star motion-shooting-star-${i}`, ambientBackground);
    studio.prepend(ambientBackground);

    // Saturn planets react to pointer geometry, not DOM hover: content stays above them.
    const saturns: Saturn[] = [];
    const heroSaturnRoot = document.querySelector<HTMLElement>('.hero-saturn .saturn');
    if (heroSaturnRoot) {
      saturns.push(createSaturn(heroSaturnRoot, HERO_SATURN_ANGLE, document.querySelector<HTMLElement>('.hero-saturn') ?? heroSaturnRoot));
    }
    const ambientSaturn = ambientSaturnRoot ? createSaturn(ambientSaturnRoot, -24) : null;
    if (ambientSaturn) saturns.push(ambientSaturn);
    // The hero planet is static markup: return it to its resting pose on cleanup.
    cleanups.push(() => saturns.forEach(releaseSaturn));

    let pointer: Point | null = null;
    const onPointerMove = (event: PointerEvent): void => {
      if (!active || document.hidden || event.pointerType === 'touch') return;
      pointer = { x: event.clientX, y: event.clientY };
      if (pointerFrame !== null) return;
      pointerFrame = window.requestAnimationFrame(() => {
        pointerFrame = null;
        if (!active) return;
        if (pointer) {
          const reachX = clamp((pointer.x / Math.max(window.innerWidth, 1) - .5) * 2).toFixed(3);
          const reachY = clamp((pointer.y / Math.max(window.innerHeight, 1) - .5) * 2).toFixed(3);
          ambientBackground.style.setProperty('--mouse-x', `${pointer.x}px`);
          ambientBackground.style.setProperty('--mouse-y', `${pointer.y}px`);
          ambientBackground.style.setProperty('--pointer-nx', reachX);
          ambientBackground.style.setProperty('--pointer-ny', reachY);
          ambientSpotlight.classList.add('is-active');
          heroField?.style.setProperty('--pointer-drift-x', reachX);
          heroField?.style.setProperty('--pointer-drift-y', reachY);
        }
        saturns.forEach((saturn) => updateSaturn(saturn, pointer));
      });
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    cleanups.push(() => window.removeEventListener('pointermove', onPointerMove));
    // Leaving the window (no related target) releases both planets immediately.
    const onPointerOut = (event: PointerEvent): void => {
      if (!active || event.relatedTarget) return;
      pointer = null;
      saturns.forEach((saturn) => updateSaturn(saturn, null));
    };
    window.addEventListener('pointerout', onPointerOut, { passive: true });
    cleanups.push(() => window.removeEventListener('pointerout', onPointerOut));

    const revealObserver = new window.IntersectionObserver((entries) => {
      if (!active) return;
      entries.forEach((entry) => {
        entry.target.classList.toggle('motion-visible', entry.isIntersecting);
      });
    }, {
      // Tall cards must reveal even when only a small part fits in the viewport.
      threshold: 0,
      rootMargin: '0px',
    });
    cleanups.push(() => revealObserver.disconnect());
    revealTargets.forEach((element) => revealObserver.observe(element));
    // Scene containers gate loops without hiding navigation or whole sections.
    const scenes = document.querySelectorAll<HTMLElement>('.studio-hero, .studio-nav, .studio-footer');
    cleanups.push(() => scenes.forEach((element) => element.classList.remove('motion-visible')));
    scenes.forEach((element) => revealObserver.observe(element));

    const nav = document.querySelector<HTMLElement>('.studio-nav');
    const heroField = document.querySelector<HTMLElement>('.hero-orbit-field');
    const training = document.querySelector<HTMLElement>('.training-list');
    const parallaxTargets = document.querySelectorAll<HTMLElement>(
      '.hero-main h1, .application-capture, .case-capture, .system-diagram, .project-visual, .hero-orbit-field',
    );
    const projectRows = document.querySelectorAll<HTMLElement>('.project-entry');
    cleanups.push(() => {
      nav?.removeAttribute('data-scrolled');
      parallaxTargets.forEach((element) => element.style.removeProperty('--scroll-offset'));
      projectRows.forEach((element) => element.style.removeProperty('--row-progress'));
      heroField?.style.removeProperty('--pointer-drift-x');
      heroField?.style.removeProperty('--pointer-drift-y');
      training?.style.removeProperty('--section-progress');
    });

    const updateScrollMotion = (): void => {
      scrollFrame = null;
      if (!active || document.hidden) return;
      // Read the planets' anchor boxes before this frame writes any styles.
      saturns.forEach(measureSaturn);
      const viewportHeight = Math.max(window.innerHeight, 1);
      const scrollRange = Math.max(root.scrollHeight - viewportHeight, 1);
      const pageProgress = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);
      progress.style.transform = `scaleX(${pageProgress.toFixed(4)})`;
      if (ambientSaturn) {
        // The ambient planet rises, opens its rings and steps back once the hero scrolls away.
        ambientSaturn.driftX = -pageProgress * window.innerWidth * .04;
        ambientSaturn.driftY = -pageProgress * viewportHeight * .34;
        ambientSaturn.angle = -24 + pageProgress * 12;
        const { style } = ambientSaturn.root;
        style.setProperty('--saturn-drift-x', `${ambientSaturn.driftX.toFixed(1)}px`);
        style.setProperty('--saturn-drift-y', `${ambientSaturn.driftY.toFixed(1)}px`);
        style.setProperty('--saturn-angle', `${ambientSaturn.angle.toFixed(2)}deg`);
        style.setProperty('--saturn-presence', (.28 - .06 * clamp(window.scrollY / (viewportHeight * .6), 0, 1)).toFixed(3));
      }
      // A stationary pointer can still meet a planet as the page moves.
      if (pointer) saturns.forEach((saturn) => updateSaturn(saturn, pointer));
      ambientOrbs.style.transform = `translate3d(0, ${(pageProgress * -16).toFixed(2)}vh, 0) rotate(${(-3 + pageProgress * 6).toFixed(2)}deg)`;
      ambientBeam.style.transform = `translate3d(${(pageProgress * 3).toFixed(2)}rem, ${(pageProgress * -5).toFixed(2)}rem, 0) scale(1.04)`;
      nav?.toggleAttribute('data-scrolled', window.scrollY > 48);
      if (training) {
        const rect = training.getBoundingClientRect();
        const sectionProgress = (viewportHeight * .85 - rect.top) / Math.max(rect.height, 1);
        training.style.setProperty('--section-progress', Math.min(Math.max(sectionProgress, 0), 1).toFixed(4));
      }

      parallaxTargets.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const centerOffset = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        element.style.setProperty('--scroll-offset', Math.min(Math.max(centerOffset, -1), 1).toFixed(4));
      });
      projectRows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        const progressThroughViewport = 1 - (rect.top + rect.height) / (viewportHeight + rect.height);
        row.style.setProperty('--row-progress', Math.min(Math.max(progressThroughViewport, 0), 1).toFixed(4));
      });
    };
    const scheduleUpdate = (): void => {
      if (!active || document.hidden || scrollFrame !== null) return;
      scrollFrame = window.requestAnimationFrame(updateScrollMotion);
    };
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    cleanups.push(() => window.removeEventListener('scroll', scheduleUpdate));
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    cleanups.push(() => window.removeEventListener('resize', scheduleUpdate));
    const onVisibilityChange = (): void => {
      if (!active) return;
      root.classList.toggle('motion-backgrounded', document.hidden);
      if (document.hidden) {
        if (pointerFrame !== null) window.cancelAnimationFrame(pointerFrame);
        if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
        pointerFrame = scrollFrame = null;
      } else {
        scheduleUpdate();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    cleanups.push(() => document.removeEventListener('visibilitychange', onVisibilityChange));
    root.classList.toggle('motion-backgrounded', document.hidden);
    updateScrollMotion();
    // Enable optional hiding only after all required setup has succeeded.
    root.classList.add('motion-ready');
  } catch {
    cleanup();
  }
  return cleanup;
}

// Keep the preference listener when reduced motion is active so changing the
// OS/browser setting can both stop and restore motion without a page reload.
if (typeof window.matchMedia === 'function') {
  let stopMotion = (): void => {};
  try {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const toggle = document.querySelector<HTMLButtonElement>('[data-motion-toggle]');
    const label = document.querySelector<HTMLElement>('[data-motion-label]');
    let paused = false;
    try { paused = window.sessionStorage.getItem('portfolio-motion-paused') === 'true'; } catch { /* Storage is optional. */ }
    const syncMotion = (): void => {
      stopMotion();
      document.documentElement.classList.toggle('motion-paused', paused);
      if (toggle) {
        toggle.hidden = !motionQuery.matches;
        toggle.setAttribute('aria-pressed', String(paused));
      }
      if (label) label.textContent = paused ? 'Resume motion' : 'Pause motion';
      stopMotion = motionQuery.matches && !paused ? startMotion() : (): void => {};
    };
    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', syncMotion);
    } else {
      // Without preference updates, leave the static presentation in place.
      throw new Error('Media-query change events are unavailable');
    }
    toggle?.addEventListener('click', () => {
      paused = !paused;
      try { window.sessionStorage.setItem('portfolio-motion-paused', String(paused)); } catch { /* Keep the in-page choice. */ }
      syncMotion();
    });
    syncMotion();
  } catch {
    stopMotion();
  }
}
