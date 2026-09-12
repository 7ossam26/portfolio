import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const staticRoot = path.join(repositoryRoot, 'dist');
const harnessRoot = path.join(repositoryRoot, 'tests', 'fixtures', 'demo-host-harness');
const previewArguments = process.argv.slice(2);
const harnessEnabled = previewArguments.includes('--demo-harness');
const harnessPrefix = '/__demo-host-harness/';
const requestedPortIndex = previewArguments.indexOf('--port');
const equalsPort = previewArguments.find((argument) => argument.startsWith('--port='));
const requestedPortValue = requestedPortIndex >= 0
  ? previewArguments[requestedPortIndex + 1]
  : equalsPort?.slice('--port='.length) ?? previewArguments.find((argument) => /^\d+$/.test(argument));
const requestedPort = requestedPortValue ? Number(requestedPortValue) : 4321;
const port = Number.isInteger(requestedPort) && requestedPort > 0 ? requestedPort : 4321;
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.svg', 'image/svg+xml'],
  ['.woff2', 'font/woff2'],
]);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const decodedPath = decodeURIComponent(url.pathname);
    const isHarnessRequest = harnessEnabled && decodedPath.startsWith(harnessPrefix);
    const requestRoot = isHarnessRequest ? harnessRoot : staticRoot;
    const rootRelativePath = isHarnessRequest
      ? decodedPath.slice(harnessPrefix.length)
      : decodedPath.slice(1);
    const relativePath = rootRelativePath === '' || rootRelativePath.endsWith('/')
      ? `${rootRelativePath}index.html`
      : rootRelativePath;
    let filePath = path.resolve(requestRoot, relativePath);

    if (filePath !== requestRoot && !filePath.startsWith(requestRoot + path.sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    let details;
    try {
      details = await stat(filePath);
      if (details.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
        details = await stat(filePath);
      }
    } catch {
      const fallback = path.join(staticRoot, '404.html');
      try {
        const fallbackDetails = await stat(fallback);
        response.writeHead(404, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': fallbackDetails.size,
        });
        createReadStream(fallback).pipe(response);
      } catch {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
      }
      return;
    }

    response.writeHead(200, {
      'Content-Type': mimeTypes.get(path.extname(filePath).toLowerCase()) ?? 'application/octet-stream',
      'Content-Length': details.size,
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Bad request');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving merged static output at http://127.0.0.1:${port}`);
});
