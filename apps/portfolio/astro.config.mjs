import { defineConfig } from 'astro/config';
import { resolveSiteUrl } from '../../scripts/site-config.mjs';

// `site` stays undefined until a real public origin is supplied, so no build can
// emit a canonical URL pointing at a placeholder domain.
const site = resolveSiteUrl();

export default defineConfig({
  output: 'static',
  ...(site ? { site } : {}),
  build: {
    assets: '_assets',
  },
});
