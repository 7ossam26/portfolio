import { activeDemoSlugs } from './portfolio-config.mjs';

// Do not consult the historical demo registry: it describes Ahmed's projects,
// not the active portfolio owner's work. New demos need an explicit audit and
// build integration before they may be published.
if (activeDemoSlugs.length !== 0) {
  throw new Error('A new active demo requires an audited workspace and build integration.');
}
console.log('No demos are approved for this portfolio; historical demo builds are excluded.');
