(() => {
  'use strict';
  const projects = {
    vertex: {
      name: 'Vertex ERP', domain: 'Retail & business operations',
      summary: 'A deployed multi-branch ERP connecting retail sales, inventory, production, and financial workflows.',
      challenge: 'Keep the effect of an operation visible across the business: a sale affects stock; producing an item consumes materials and updates its cost.',
      features: ['Point of sale, wholesale, and call-center workflows', 'Bill-of-materials production and stock movements', 'Branch access, shifts, and financial reporting'],
      role: 'Full-stack development',
      stack: 'React · Node.js · Prisma · MySQL',
      source: 'https://github.com/7ossam26/ERP-V2'
    },
    autozain: {
      name: 'AutoZain', domain: 'Automotive marketplace & operations',
      summary: 'A deployed system connecting a public used-car marketplace with the day-to-day work of a dealership.',
      challenge: 'Connect the buyer experience with staff availability, contact requests, vehicle status, and financial approvals.',
      features: ['Public car browsing, filtering, and favorites', 'Real-time employee contact requests and monitoring', 'Deposit review, sale closing, and financial reporting'],
      role: 'Project contribution details to confirm',
      stack: 'React · Node.js · Socket.io · PostgreSQL',
      source: 'https://github.com/7ossam26/autozain-system'
    },
    roya: {
      name: 'Roya', domain: 'Film & TV production finance',
      summary: 'A deployed bilingual platform for the budgets, commitments, payments, and schedules behind film and television production.',
      challenge: 'Keep production planning and financial history connected while managing changing budgets, approval requirements, and shooting schedules.',
      features: ['Budget versions and shooting-week impact previews', 'Append-only financial history and payment approvals', 'Production scheduling, episode progress, and delay analysis'],
      role: 'System design & full-stack development',
      stack: 'React · TypeScript · Node.js · PostgreSQL',
      source: 'https://github.com/7ossam26/Film-production-fin-system'
    },
    ramex: {
      name: 'Ramex', domain: 'Fabric retail & inventory',
      summary: 'A deployed Arabic-first retail ERP built around the details of fabric trading, from factory shipments to individual rolls.',
      challenge: 'Represent real stock accurately when rolls have individual identities and fabrics can be sold by weight or length.',
      features: ['Per-roll inventory and factory shipment workflows', 'Meter- and kilogram-based sale quantities', 'Invoices, split payments, and customer statements'],
      role: 'System design & full-stack development',
      stack: 'React · TypeScript · Node.js · PostgreSQL',
      source: 'https://github.com/7ossam26/Ramex-Store'
    }
  };
  const steps = [
    ['Start with a prepared recipe.', 'Select a sample product and its bill of materials, then choose the quantity to produce.'],
    ['Trace the materials and their cost.', 'Review the required materials, available quantities, and associated costs before completing the sample production order.'],
    ['See the stock and cost change.', 'Inspect the resulting material consumption, finished stock, and production cost. This preview describes the proposed flow; it does not run the application.']
  ];
  let dialogOpener = null;
  function openDialog(dialog, opener) {
    dialogOpener = opener;
    document.body.classList.add('dialog-open');
    dialog.showModal();
    dialog.querySelector('[data-close-dialog]').focus();
  }
  for (const dialog of document.querySelectorAll('dialog')) {
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      if (dialogOpener && dialogOpener.isConnected) dialogOpener.focus();
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    for (const button of dialog.querySelectorAll('[data-close-dialog]')) button.addEventListener('click', () => dialog.close());
  }
  function appendText(parent, tag, content, className) {
    const element = document.createElement(tag);
    element.textContent = content;
    if (className) element.className = className;
    parent.appendChild(element);
    return element;
  }
  for (const button of document.querySelectorAll('[data-project]')) button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project) return;
    const root = document.getElementById('project-dialog-content');
    root.replaceChildren();
    appendText(root, 'p', project.domain.toUpperCase(), 'dialog-kicker');
    appendText(root, 'h2', project.name).id = 'project-dialog-title';
    appendText(root, 'p', project.summary, 'project-summary');
    const grid = appendText(root, 'div', '', 'project-note-grid');
    const challenge = appendText(grid, 'div', '');
    appendText(challenge, 'h3', 'THE BUSINESS CHALLENGE');
    appendText(challenge, 'p', project.challenge);
    const features = appendText(grid, 'div', '');
    appendText(features, 'h3', 'WHAT THE SYSTEM HANDLES');
    const list = appendText(features, 'ul', '');
    for (const feature of project.features) appendText(list, 'li', feature);
    const stack = appendText(grid, 'div', '');
    appendText(stack, 'h3', 'TECHNOLOGY');
    appendText(stack, 'p', project.stack);
    if (button.dataset.project !== 'autozain') {
      const role = appendText(grid, 'div', '');
      appendText(role, 'h3', 'MY ROLE');
      appendText(role, 'p', project.role);
    }
    const footer = appendText(root, 'div', '', 'project-source-link');
    const link = appendText(footer, 'a', 'View repository ↗');
    link.href = project.source; link.target = '_blank'; link.rel = 'noopener noreferrer';
    appendText(footer, 'span', 'In production');
    openDialog(document.getElementById('project-dialog'), button);
  });
  function setStep(index) {
    const step = steps[index];
    if (!step) return;
    for (const button of document.querySelectorAll('[data-step]')) {
      const active = Number(button.dataset.step) === index;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    }
    document.getElementById('step-label').textContent = `PLANNED STEP / 0${index + 1}`;
    document.getElementById('step-title').textContent = step[0];
    document.getElementById('step-description').textContent = step[1];
  }
  for (const button of document.querySelectorAll('[data-step]')) button.addEventListener('click', () => setStep(Number(button.dataset.step)));
  for (const button of document.querySelectorAll('[data-open-demo]')) button.addEventListener('click', () => { setStep(0); openDialog(document.getElementById('demo-dialog'), button); });
})();
