import { defineConfig } from 'astro/config';
import { resolveSiteUrl } from '../../scripts/site-config.mjs';

// Keep preview builds non-indexable until Yousef supplies his public origin.
// Historical demo outputs and internal harnesses are never mounted in dev.
const site = resolveSiteUrl();

export default defineConfig({
  output: 'static',
  ...(site ? { site } : {}),
  build: {
    assets: '_assets',
  },
});
