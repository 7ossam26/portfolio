import { defineConfig } from 'astro/config';
import { resolveSiteUrl } from '../../scripts/site-config.mjs';

// Keep preview builds non-indexable until Yousef supplies his public origin.
// Historical demo outputs and internal harnesses are never mounted in dev.
const site = resolveSiteUrl();

export default defineConfig({
  output: 'static',
  ...(site ? { site } : {}),
  // Plain `localhost` binds only IPv6 ::1 on this Windows setup, which IPv4-only
  // clients such as external download managers cannot reach.
  server: {
    host: '127.0.0.1',
  },
  build: {
    assets: '_assets',
  },
});
