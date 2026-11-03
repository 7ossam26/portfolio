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
    ambientBackground.append(ambientGrid, ambientOrbs, ambientBeam, ambientSpotlight, ambientEmbers);
    studio.prepend(ambientBackground);

    const onPointerMove = (event: PointerEvent): void => {
      if (!active || document.hidden || event.pointerType === 'touch' || pointerFrame !== null) return;
      pointerFrame = window.requestAnimationFrame(() => {
        pointerFrame = null;
        if (!active) return;
        ambientBackground.style.setProperty('--mouse-x', `${event.clientX}px`);
        ambientBackground.style.setProperty('--mouse-y', `${event.clientY}px`);
        ambientSpotlight.classList.add('is-active');
        heroField?.style.setProperty('--pointer-drift-x', Math.min(1, Math.max(-1, (event.clientX / Math.max(window.innerWidth, 1) - .5) * 2)).toFixed(3));
        heroField?.style.setProperty('--pointer-drift-y', Math.min(1, Math.max(-1, (event.clientY / Math.max(window.innerHeight, 1) - .5) * 2)).toFixed(3));
      });
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    cleanups.push(() => window.removeEventListener('pointermove', onPointerMove));

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
      const viewportHeight = Math.max(window.innerHeight, 1);
      const scrollRange = Math.max(root.scrollHeight - viewportHeight, 1);
      const pageProgress = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);
      progress.style.transform = `scaleX(${pageProgress.toFixed(4)})`;
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
