import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSiteUrl } from '../../scripts/site-config.mjs';

test('publication accepts only an actual root HTTPS origin', () => {
  assert.equal(resolveSiteUrl({}), null);
  assert.equal(resolveSiteUrl({ PORTFOLIO_SITE_URL: 'https://portfolio.example/' }), 'https://portfolio.example');
  for (const value of ['http://portfolio.example', 'https://portfolio.example/path',
    'https://user:secret@portfolio.example/', 'https://portfolio.example/?x=1', 'https://portfolio.example/#preview']) {
    assert.throws(() => resolveSiteUrl({ PORTFOLIO_SITE_URL: value }));
  }
});
