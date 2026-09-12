// Single source of truth for the public origin.
//
// The domain is deliberately unresolved (DECISIONS.md D14). Until a real target
// is supplied through PORTFOLIO_SITE_URL, the build stays in preview mode:
// no canonical URL, no social metadata, robots noindex, and a robots.txt that
// disallows everything. Supplying the variable switches every one of those on.

export const SITE_URL_VARIABLE = 'PORTFOLIO_SITE_URL';

/**
 * @param {Record<string, string | undefined>} [environment]
 * @returns {string | null} the normalised origin (no trailing slash) or null in preview mode
 */
export function resolveSiteUrl(environment = process.env) {
  const raw = (environment[SITE_URL_VARIABLE] ?? '').trim();
  if (raw === '') return null;

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`${SITE_URL_VARIABLE} is not a valid absolute URL: "${raw}"`);
  }

  if (parsed.protocol !== 'https:') {
    throw new Error(`${SITE_URL_VARIABLE} must use https, received "${parsed.protocol}//"`);
  }
  if (parsed.search !== '' || parsed.hash !== '') {
    throw new Error(`${SITE_URL_VARIABLE} must not carry a query string or fragment: "${raw}"`);
  }
  if (parsed.username || parsed.password || parsed.pathname !== '/') {
    throw new Error(`${SITE_URL_VARIABLE} must be an origin without credentials or a path.`);
  }
  return parsed.origin;
}

/** Public routes that belong in a sitemap. Demo routes are deliberately excluded. */
export const indexableRoutes = [
  { path: '/', changefreq: 'monthly', priority: '1.0' },
  { path: '/work/vertex/', changefreq: 'monthly', priority: '0.8' },
  { path: '/work/autozain/', changefreq: 'monthly', priority: '0.7' },
  { path: '/work/roya/', changefreq: 'monthly', priority: '0.7' },
  { path: '/work/ramex/', changefreq: 'monthly', priority: '0.7' },
];
