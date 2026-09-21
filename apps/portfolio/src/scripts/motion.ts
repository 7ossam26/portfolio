/**
 * Scroll motion for the portfolio shell.
 *
 * Content is visible in the authored HTML/CSS. Motion-only hiding is enabled
 * after this module starts, keeping the site readable without JavaScript.
 */

const motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');

if (motionQuery.matches) {
  const root = document.documentElement;

  const revealGroups: Array<{ selector: string; direction?: string }> = [
    { selector: '.studio-nav', direction: 'down' },
    { selector: '.hero-main > .eyebrow, .case-heading > .eyebrow', direction: 'left' },
    { selector: '#studio-heading > span, .case-heading h1, .case-deck', direction: 'up' },
    { selector: '.hero-aside, .case-meta', direction: 'right' },
    { selector: '.section-heading, .case-section', direction: 'up' },
    { selector: '.featured-project, .case-capture, .system-diagram, .demo-status', direction: 'scale' },
    { selector: '.project-list > article', direction: 'left' },
    { selector: '.capability-list > div, .decision-list > article', direction: 'up' },
    { selector: '.case-next, .contact-copy, .contact-details, .footer-credit', direction: 'up' },
  ];

  const revealTargets: HTMLElement[] = [];
  revealGroups.forEach(({ selector, direction }) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
      element.classList.add('motion-reveal');
      element.dataset.motionDirection = direction ?? 'up';
      element.style.setProperty('--motion-delay', `${Math.min(index % 4, 3) * 85}ms`);
      revealTargets.push(element);
    });
  });

  document.querySelectorAll<HTMLElement>('.section-heading, .case-section, .project-list, .footer-credit')
    .forEach((element) => element.classList.add('motion-line'));

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  const studio = document.querySelector<HTMLElement>('.studio');
  const ambientBackground = document.createElement('div');
  ambientBackground.className = 'motion-background';
  ambientBackground.setAttribute('aria-hidden', 'true');

  // 1. Cybernetic studio grid
  const ambientGrid = document.createElement('div');
  ambientGrid.className = 'motion-background-grid';

  // 2. Interactive cursor tracking spotlight
  const ambientSpotlight = document.createElement('div');
  ambientSpotlight.className = 'motion-background-spotlight';

  // 3. Multi-layer molten plasma aurora orbs
  const ambientOrbs = document.createElement('div');
  ambientOrbs.className = 'motion-background-orbs';
  const orb1 = document.createElement('div');
  orb1.className = 'motion-orb motion-orb-1';
  const orb2 = document.createElement('div');
  orb2.className = 'motion-orb motion-orb-2';
  const orb3 = document.createElement('div');
  orb3.className = 'motion-orb motion-orb-3';
  ambientOrbs.append(orb1, orb2, orb3);

  // 4. Sweeping horizon beam
  const ambientBeam = document.createElement('div');
  ambientBeam.className = 'motion-background-beam';
  const ambientBeamSurface = document.createElement('div');
  ambientBeamSurface.className = 'motion-background-beam-surface';
  ambientBeam.append(ambientBeamSurface);

  // 5. Floating embers
  const ambientEmbers = document.createElement('div');
  ambientEmbers.className = 'motion-background-embers';
  for (let i = 1; i <= 8; i++) {
    const ember = document.createElement('span');
    ember.className = `motion-ember motion-ember-${i}`;
    ambientEmbers.append(ember);
  }

  ambientBackground.append(ambientGrid, ambientOrbs, ambientBeam, ambientSpotlight, ambientEmbers);
  studio?.prepend(ambientBackground);

  // Interactive mouse pointer tracking for ambient spotlight
  let pointerScheduled = false;
  window.addEventListener(
    'pointermove',
    (event: PointerEvent) => {
      if (pointerScheduled) return;
      pointerScheduled = true;
      requestAnimationFrame(() => {
        ambientBackground.style.setProperty('--mouse-x', `${event.clientX}px`);
        ambientBackground.style.setProperty('--mouse-y', `${event.clientY}px`);
        ambientSpotlight.classList.add('is-active');
        pointerScheduled = false;
      });
    },
    { passive: true },
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('motion-visible', entry.isIntersecting);
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -7% 0px' },
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
  root.classList.add('motion-ready');

  const nav = document.querySelector<HTMLElement>('.studio-nav');
  const parallaxTargets = document.querySelectorAll<HTMLElement>(
    '.hero-main h1, .application-capture, .case-capture, .system-diagram',
  );
  const projectRows = document.querySelectorAll<HTMLElement>('.project-entry');
  let scheduled = false;

  const updateScrollMotion = (): void => {
    const viewportHeight = Math.max(window.innerHeight, 1);
    const scrollRange = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
    const pageProgress = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);

    progress.style.transform = `scaleX(${pageProgress.toFixed(4)})`;
    ambientOrbs.style.transform = `translate3d(0, ${(pageProgress * -16).toFixed(2)}vh, 0) rotate(${(-3 + pageProgress * 6).toFixed(2)}deg)`;
    ambientBeam.style.transform = `translate3d(${(pageProgress * 3).toFixed(2)}rem, ${(pageProgress * -5).toFixed(2)}rem, 0) scale(1.04)`;
    nav?.toggleAttribute('data-scrolled', window.scrollY > 48);

    parallaxTargets.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const centerOffset = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
      const clamped = Math.min(Math.max(centerOffset, -1), 1);
      element.style.setProperty('--scroll-offset', clamped.toFixed(4));
    });

    projectRows.forEach((row) => {
      const rect = row.getBoundingClientRect();
      const progressThroughViewport = 1 - (rect.top + rect.height) / (viewportHeight + rect.height);
      const clamped = Math.min(Math.max(progressThroughViewport, 0), 1);
      row.style.setProperty('--row-progress', clamped.toFixed(4));
    });

    scheduled = false;
  };

  const scheduleUpdate = (): void => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateScrollMotion);
  };

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  updateScrollMotion();
}
