import { defineConfig } from 'astro/config';
import { resolveSiteUrl } from '../../scripts/site-config.mjs';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const distDemosDir = path.join(rootDir, 'dist', 'demos');
const harnessRoot = path.join(rootDir, 'tests', 'fixtures', 'demo-host-harness');

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

function serveDemosDevPlugin() {
  return {
    name: 'serve-demos-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const url = new URL(req.url || '/', 'http://localhost');
          const decodedPath = decodeURIComponent(url.pathname);

          let targetFile = null;
          if (decodedPath.startsWith('/demos/')) {
            const rel = decodedPath.slice('/demos/'.length);
            const demoRelPath = rel === '' || rel.endsWith('/') ? `${rel}index.html` : rel;
            const candidate = path.resolve(distDemosDir, demoRelPath);
            if (candidate.startsWith(distDemosDir + path.sep) || candidate === distDemosDir) {
              targetFile = candidate;
            }
          } else if (decodedPath.startsWith('/__demo-host-harness/')) {
            const rel = decodedPath.slice('/__demo-host-harness/'.length);
            const harnessRelPath = rel === '' || rel.endsWith('/') ? `${rel}index.html` : rel;
            const candidate = path.resolve(harnessRoot, harnessRelPath);
            if (candidate.startsWith(harnessRoot + path.sep) || candidate === harnessRoot) {
              targetFile = candidate;
            }
          }

          if (targetFile) {
            let details;
            try {
              details = await stat(targetFile);
              if (details.isDirectory()) {
                targetFile = path.join(targetFile, 'index.html');
                details = await stat(targetFile);
              }
            } catch {
              return next();
            }

            const ext = path.extname(targetFile).toLowerCase();
            res.writeHead(200, {
              'Content-Type': mimeTypes.get(ext) || 'application/octet-stream',
              'Content-Length': details.size,
            });
            createReadStream(targetFile).pipe(res);
            return;
          }
        } catch {
          // ignore and pass to next
        }
        next();
      });
    },
  };
}

// `site` stays undefined until a real public origin is supplied, so no build can
// emit a canonical URL pointing at a placeholder domain.
const site = resolveSiteUrl();

export default defineConfig({
  output: 'static',
  ...(site ? { site } : {}),
  build: {
    assets: '_assets',
  },
  vite: {
    plugins: [serveDemosDevPlugin()],
  },
});

