type SaturnState = 'idle' | 'near' | 'over';

/** Ring-plane flattening shared with saturn.css (`scaleY(.3)`) and the hover geometry. */
const SATURN_RING_TILT = 0.3;
/** Playback multipliers for Saturn's continuous `saturn-flow-*` loops. */
const SATURN_TEMPO: Record<SaturnState, number> = { idle: 1, near: 2.2, over: 4.5 };

const clamp = (value: number, min = -1, max = 1): number => Math.min(max, Math.max(min, value));

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

    const ambientGrid = document.createElement('div');
    ambientGrid.className = 'motion-background-grid';
    const ambientSpotlight = document.createElement('div');
    ambientSpotlight.className = 'motion-background-spotlight';
    const ambientOrbs = document.createElement('div');
    ambientOrbs.className = 'motion-background-orbs';
    for (let i = 1; i <= 3; i++) {
      const orb = document.createElement('div');
      orb.className = `motion-orb motion-orb-${i}`;
      ambientOrbs.append(orb);
    }

    const ambientBeam = document.createElement('div');
    ambientBeam.className = 'motion-background-beam';
    const ambientBeamSurface = document.createElement('div');
    ambientBeamSurface.className = 'motion-background-beam-surface';
    ambientBeam.append(ambientBeamSurface);

    const ambientEmbers = document.createElement('div');
    ambientEmbers.className = 'motion-background-embers';
    for (let i = 1; i <= 8; i++) {
      const ember = document.createElement('span');
      ember.className = `motion-ember motion-ember-${i}`;
      ambientEmbers.append(ember);
    }

    // Saturn: decorative layers inside the fixed background. Content stays above
    // it, so hover is derived from pointer geometry rather than DOM hit-testing.
    const layer = (className: string, parent: HTMLElement): HTMLElement => {
      const node = document.createElement('div');
      node.className = className;
      parent.append(node);
      return node;
    };
    const saturn = document.createElement('div');
    saturn.className = 'saturn';
    saturn.dataset.saturn = 'idle';
    const saturnLean = layer('saturn-lean', layer('saturn-float', layer('saturn-drift', saturn)));
    layer('saturn-halo', saturnLean);
    layer('saturn-corona', saturnLean);
    const saturnTilt = layer('saturn-tilt', saturnLean);
    // Rings and shockwaves are split at the major axis: the far half is drawn
    // behind the planet and the near half in front of it.
    const addWaves = (side: 'back' | 'front'): void => {
      const waves = layer(`saturn-waves saturn-waves-${side}`, saturnTilt);
      for (let i = 0; i < 3; i++) layer('saturn-wave', waves).style.setProperty('--wave-index', String(i));
    };
    const addRings = (side: 'back' | 'front'): void => {
      const rings = layer(`saturn-rings saturn-rings-${side}`, saturnTilt);
      ['saturn-ring-bands', 'saturn-ring-flow saturn-ring-flow-inner', 'saturn-ring-flow saturn-ring-flow-outer', 'saturn-ring-arc']
        .forEach((name) => layer(name, rings));
    };
    addWaves('back');
    addRings('back');
    const saturnPlanet = layer('saturn-planet', saturnTilt);
    ['saturn-bands', 'saturn-ignite', 'saturn-shade'].forEach((name) => layer(name, saturnPlanet));
    addRings('front');
    addWaves('front');
    [18, 162, 206, 334].forEach((degrees, index) => {
      const glint = layer('saturn-glint', saturnTilt);
      const radians = degrees * Math.PI / 180;
      glint.style.setProperty('left', `${(50 + Math.cos(radians) * 40).toFixed(2)}%`);
      glint.style.setProperty('top', `${(50 + Math.sin(radians) * 40 * SATURN_RING_TILT).toFixed(2)}%`);
      glint.style.setProperty('--glint-index', String(index));
    });
    [1, 2].forEach((moon) => layer('saturn-moon-body', layer('saturn-moon-y', layer(`saturn-moon saturn-moon-${moon}`, saturnTilt))));
    const saturnSparks = layer('saturn-sparks', saturnLean);
    for (let i = 0; i < 16; i++) {
      const radians = (i / 16) * Math.PI * 2 + (i % 3) * .13;
      const spark = layer('saturn-spark', saturnSparks);
      spark.style.setProperty('--sx', Math.cos(radians).toFixed(3));
      spark.style.setProperty('--sy', (Math.sin(radians) * .42).toFixed(3));
      spark.style.setProperty('--sd', (.62 + ((i * 5) % 7) * .045).toFixed(3));
      spark.style.setProperty('--spark-delay', `${(-((i * 7) % 16) * .11).toFixed(2)}s`);
    }
    layer('saturn-burst', saturnLean);
    layer('saturn-ping', saturnLean);

    ambientBackground.append(ambientGrid, ambientOrbs, ambientBeam, saturn, ambientSpotlight, ambientEmbers);
    studio.prepend(ambientBackground);

    let pointer: { x: number; y: number } | null = null;
    let saturnBox: { x: number; y: number; size: number } | null = null;
    let saturnState: SaturnState = 'idle';
    let saturnEnergy = 0;
    let saturnDriftX = 0;
    let saturnDriftY = 0;
    let saturnAngle = -24;
    const saturnVariables = ['--saturn-near', '--saturn-pull-x', '--saturn-pull-y', '--saturn-turn-x', '--saturn-turn-y'];

    const setSaturnState = (state: SaturnState): void => {
      if (state === saturnState) return;
      saturnState = state;
      saturn.dataset.saturn = state;
      // Accelerate the running loops in place instead of restarting them.
      if (typeof saturn.getAnimations !== 'function') return;
      saturn.getAnimations({ subtree: true }).forEach((animation) => {
        if (!('animationName' in animation) || !String(animation.animationName).startsWith('saturn-flow')) return;
        if (typeof animation.updatePlaybackRate === 'function') animation.updatePlaybackRate(SATURN_TEMPO[state]);
        else animation.playbackRate = SATURN_TEMPO[state];
      });
    };

    const releaseSaturn = (): void => {
      saturnEnergy = 0;
      if (saturnState === 'idle') return;
      saturnVariables.forEach((name) => saturn.style.removeProperty(name));
      setSaturnState('idle');
    };

    const updateSaturn = (): void => {
      if (!pointer || !saturnBox) {
        releaseSaturn();
        return;
      }
      const { size } = saturnBox;
      const dx = pointer.x - (saturnBox.x + saturnDriftX);
      const dy = pointer.y - (saturnBox.y + saturnDriftY);
      const angle = saturnAngle * Math.PI / 180;
      const along = dx * Math.cos(angle) + dy * Math.sin(angle);
      const across = dy * Math.cos(angle) - dx * Math.sin(angle);
      const distance = Math.hypot(dx, dy);
      const planetRadius = size * .21;
      const ringRadius = size * .485;
      const fieldRadius = size * 1.05;
      // The hit area follows the planet's visible swell (CSS scales it by up to
      // 1.08 × 1.07), which also keeps the state steady on an edge.
      const grow = saturnState === 'over' ? 1.15 : 1 + saturnEnergy * .08;
      const onPlanet = distance <= planetRadius * grow;
      const onRings = (along / (ringRadius * grow)) ** 2
        + (across / (ringRadius * SATURN_RING_TILT * grow)) ** 2 <= 1;
      const next: SaturnState = onPlanet || onRings ? 'over'
        : distance <= fieldRadius * (saturnState === 'idle' ? 1 : 1.08) ? 'near' : 'idle';
      if (next === 'idle') {
        releaseSaturn();
        return;
      }
      const energy = next === 'over' ? 1 : clamp(1 - (distance - planetRadius) / (fieldRadius - planetRadius), 0, 1);
      saturnEnergy = energy;
      const reachX = clamp(dx / fieldRadius);
      const reachY = clamp(dy / fieldRadius);
      saturn.style.setProperty('--saturn-near', energy.toFixed(3));
      saturn.style.setProperty('--saturn-pull-x', (reachX * 26 * energy).toFixed(2));
      saturn.style.setProperty('--saturn-pull-y', (reachY * 20 * energy).toFixed(2));
      saturn.style.setProperty('--saturn-turn-x', (-reachY * 14 * energy).toFixed(2));
      saturn.style.setProperty('--saturn-turn-y', (reachX * 18 * energy).toFixed(2));
      setSaturnState(next);
    };

    const onPointerMove = (event: PointerEvent): void => {
      if (!active || document.hidden || event.pointerType === 'touch') return;
      pointer = { x: event.clientX, y: event.clientY };
      if (pointerFrame !== null) return;
      pointerFrame = window.requestAnimationFrame(() => {
        pointerFrame = null;
        if (!active) return;
        if (pointer) {
          ambientBackground.style.setProperty('--mouse-x', `${pointer.x}px`);
          ambientBackground.style.setProperty('--mouse-y', `${pointer.y}px`);
          ambientSpotlight.classList.add('is-active');
          heroField?.style.setProperty('--pointer-drift-x', clamp((pointer.x / Math.max(window.innerWidth, 1) - .5) * 2).toFixed(3));
          heroField?.style.setProperty('--pointer-drift-y', clamp((pointer.y / Math.max(window.innerHeight, 1) - .5) * 2).toFixed(3));
        }
        updateSaturn();
      });
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    cleanups.push(() => window.removeEventListener('pointermove', onPointerMove));
    // Leaving the window (no related target) releases Saturn immediately.
    const onPointerOut = (event: PointerEvent): void => {
      if (!active || event.relatedTarget) return;
      pointer = null;
      updateSaturn();
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
      // Saturn's anchor box is untransformed; drift and hover act on its children.
      const saturnRect = saturn.getBoundingClientRect();
      saturnBox = Number.isFinite(saturnRect.left) && Number.isFinite(saturnRect.top) && saturnRect.width > 0
        ? { x: saturnRect.left + saturnRect.width / 2, y: saturnRect.top + saturnRect.height / 2, size: saturnRect.width }
        : null;
      const viewportHeight = Math.max(window.innerHeight, 1);
      const scrollRange = Math.max(root.scrollHeight - viewportHeight, 1);
      const pageProgress = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);
      progress.style.transform = `scaleX(${pageProgress.toFixed(4)})`;
      // Saturn rises and its rings open slightly as the visitor reads down the page.
      saturnDriftX = -pageProgress * window.innerWidth * .04;
      saturnDriftY = -pageProgress * viewportHeight * .34;
      saturnAngle = -24 + pageProgress * 12;
      saturn.style.setProperty('--saturn-drift-x', `${saturnDriftX.toFixed(1)}px`);
      saturn.style.setProperty('--saturn-drift-y', `${saturnDriftY.toFixed(1)}px`);
      saturn.style.setProperty('--saturn-angle', `${saturnAngle.toFixed(2)}deg`);
      // A stationary pointer can still meet the planet as it drifts.
      if (pointer) updateSaturn();
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
