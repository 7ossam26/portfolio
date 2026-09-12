import { createHash } from 'node:crypto';
import { readdir, readFile, lstat } from 'node:fs/promises';
import path from 'node:path';

export const sha256 = (data) => createHash('sha256').update(data).digest('hex');
export const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

export async function filesUnder(root, prefix = '') {
  const files = [];
  for (const name of (await readdir(path.join(root, prefix))).sort()) {
    const relative = prefix ? `${prefix}/${name}` : name;
    const info = await lstat(path.join(root, relative));
    if (info.isSymbolicLink()) throw new Error(`Release cannot contain symlinks: ${relative}`);
    if (info.isDirectory()) files.push(...await filesUnder(root, relative));
    else if (info.isFile()) files.push(relative);
  }
  return files;
}

// Canonical ustar: sorted entries, fixed ownership/mode/mtime, no host metadata.
// This makes the same bytes reproducible on Windows and Linux.
export function tar(entries) {
  const chunks = [];
  for (const [name, data] of [...entries].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) {
    const header = Buffer.alloc(512);
    let shortName = name;
    let prefix = '';
    if (Buffer.byteLength(name) > 100) {
      const split = name.lastIndexOf('/');
      prefix = name.slice(0, split);
      shortName = name.slice(split + 1);
    }
    if (Buffer.byteLength(shortName) > 100 || Buffer.byteLength(prefix) > 155) {
      throw new Error(`Path exceeds ustar limits: ${name}`);
    }
    const field = (value, offset, length) => header.write(value, offset, length, 'utf8');
    const octal = (value, offset, length) => field(`${value.toString(8).padStart(length - 1, '0')}\0`, offset, length);
    field(shortName, 0, 100);
    octal(0o644, 100, 8);
    octal(0, 108, 8);
    octal(0, 116, 8);
    octal(data.length, 124, 12);
    octal(0, 136, 12);
    header.fill(32, 148, 156);
    field('0', 156, 1);
    field('ustar\0', 257, 6);
    field('00', 263, 2);
    field(prefix, 345, 155);
    const checksum = header.reduce((total, byte) => total + byte, 0);
    field(`${checksum.toString(8).padStart(6, '0')}\0 `, 148, 8);
    chunks.push(header, data, Buffer.alloc((512 - data.length % 512) % 512));
  }
  return Buffer.concat([...chunks, Buffer.alloc(1024)]);
}

const hashSource = (text) => `'sha256-${createHash('sha256').update(text).digest('base64')}'`;
export function inspectHtml(html, demo) {
  const scriptHashes = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(([, attributes, body]) => !/\bsrc\s*=/.test(attributes) && body.trim())
    .map(([, , body]) => hashSource(body));
  const styleHashes = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
    .map(([, body]) => hashSource(body));
  const attributes = [...html.matchAll(/\sstyle="([^"]*)"/gi)].map(([, value]) => value);
  if (!demo && attributes.length) throw new Error('Unexpected inline portfolio style: inspect before release.');
  if (/\son[a-z]+\s*=/i.test(html)) throw new Error('Inline event handler cannot be released.');
  // Only the existing bilingual noscript paragraphs need style attributes. JSX
  // inspection found no runtime style props. Allow their exact bytes, not all inline CSS.
  const attributeHashes = [...new Set(attributes.map(hashSource))];
  const policy = [
    "default-src 'none'", "base-uri 'none'", "object-src 'none'", "form-action 'none'",
    "frame-ancestors 'self'", `frame-src ${demo ? "'none'" : "'self'"}`,
    "connect-src 'none'", `script-src 'self' ${[...new Set(scriptHashes)].join(' ')}`.trim(),
    "script-src-attr 'none'", `style-src 'self' ${[...new Set(styleHashes)].join(' ')}`.trim(),
    `style-src-attr ${attributeHashes.length ? `'unsafe-hashes' ${attributeHashes.join(' ')}` : "'none'"}`,
    "img-src 'self'", "font-src 'self'", "media-src 'none'", "worker-src 'none'", "manifest-src 'none'",
  ].join('; ');
  return { policy, scriptHashes, styleHashes, attributeHashes };
}

export async function inspectOutput(root) {
  const files = [];
  const documents = {};
  for (const name of await filesUnder(root)) {
    const data = await readFile(path.join(root, name));
    const immutable = /^(?:_assets\/|demos\/[^/]+\/assets\/)/.test(name)
      && /[.-][\w-]{8,}\.(?:js|css|woff2?|png|webp|svg)$/.test(name);
    files.push({ path: name, bytes: data.length, sha256: sha256(data), cache: immutable
      ? 'public, max-age=31536000, immutable'
      : /\.(?:pdf|svg|png|webp|woff2?)$/.test(name)
        ? 'public, max-age=3600' : 'public, max-age=0, must-revalidate' });
    if (name.endsWith('.html')) documents[`/${name}`] = inspectHtml(data.toString(), name.startsWith('demos/'));
  }
  return { files, documents, outputSha256: sha256(json(files)) };
}

export function nginxConfig(output, origin) {
  const quote = (value) => `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
  const defaultCsp = inspectHtml('', false).policy;
  const aliases = (uri) => uri.endsWith('/index.html') ? [uri, uri.slice(0, -10)] : [uri];
  return `# Generated for this portfolio artifact only. Prefix must be the extracted bundle.\n
worker_processes 1;
pid logs/nginx.pid;
error_log logs/error.log warn;
events { worker_connections 1024; }
http {
  map_hash_bucket_size 256;
  client_body_temp_path logs/client_body_temp;
  proxy_temp_path logs/proxy_temp;
  fastcgi_temp_path logs/fastcgi_temp;
  uwsgi_temp_path logs/uwsgi_temp;
  scgi_temp_path logs/scgi_temp;
  types {
    text/html html; text/css css; application/javascript js;
    application/json json; application/pdf pdf; image/svg+xml svg;
    image/png png; image/webp webp; font/woff2 woff2; font/woff woff;
    text/plain txt; application/xml xml;
  }
  default_type application/octet-stream;
  server_tokens off;
  access_log logs/access.log;
  sendfile on;
  etag off;
  if_modified_since off;
  gzip on;
  gzip_vary on;
  gzip_types text/css application/javascript application/json image/svg+xml application/xml;
  map $uri $portfolio_csp {
    default ${quote(defaultCsp)};
${Object.entries(output.documents).flatMap(([uri, doc]) => aliases(uri).map((alias) => `    ${quote(alias)} ${quote(doc.policy)};`)).join('\n')}
  }
  map $uri $portfolio_file_cache {
    default "public, max-age=0, must-revalidate";
${output.files.flatMap((file) => aliases(`/${file.path}`).map((alias) => `    ${quote(alias)} ${quote(file.cache)};`)).join('\n')}
  }
  map $uri $portfolio_file_etag {
    default "";
${output.files.flatMap((file) => aliases(`/${file.path}`).map((alias) => `    ${quote(alias)} ${quote(`W/"${file.sha256}"`)};`)).join('\n')}
  }
  map "$request_method:$http_if_none_match:$portfolio_file_etag" $portfolio_not_modified {
    default 0;
    ${quote('~^(?:GET|HEAD):(?<portfolio_tag>W/"[a-f0-9]{64}"):(?P=portfolio_tag)$')} 1;
  }
  map $status $portfolio_etag {
    default "";
    200 $portfolio_file_etag; 206 $portfolio_file_etag; 304 $portfolio_file_etag;
  }
  map $status $portfolio_cache {
    default "no-store";
    200 $portfolio_file_cache; 206 $portfolio_file_cache; 304 $portfolio_file_cache;
  }
  map "$status:$request_uri" $portfolio_robots {
    default ${quote(origin ? '' : 'noindex, nofollow')};
    ~^[45] "noindex, nofollow";
    ~^[0-9]+:/demos/ "noindex, nofollow";
    ~^[0-9]+:/404.html "noindex, nofollow";
  }
  server {
    listen 8080;
    server_name _;
    root html;
    index index.html;
    absolute_redirect off;
    add_header Content-Security-Policy $portfolio_csp always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Cache-Control $portfolio_cache always;
    add_header ETag $portfolio_etag always;
    add_header X-Robots-Tag $portfolio_robots always;
    error_page 404 /404.html;
    if ($request_method !~ ^(GET|HEAD)$) { return 405; }
    if ($portfolio_not_modified = 1) { return 304; }
    location / { try_files $uri $uri/ =404; }
    location ~ \\.(?:js|css|json|pdf|svg|png|webp|woff2?|map|txt|xml)$ {
      error_page 404 = @missing_asset;
      try_files $uri =404;
    }
    location @missing_asset { types {} default_type text/plain; return 404 "Not found\\n"; }
    location ~ /\\. { return 404; }
  }
}
`;
}
