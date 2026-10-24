'use strict';

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8000);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8'
};

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  const segments = pathname.split('/').filter(Boolean);
  const allowedRootEntries = new Set([
    'css',
    'images',
    'index.html',
    'js',
    'pages',
    'robots.txt',
    'sitemap.xml',
    'videos'
  ]);

  if (
    segments.some(segment => segment.startsWith('.')) ||
    (segments.length > 0 && !allowedRootEntries.has(segments[0]))
  ) {
    response.writeHead(404).end('Not found');
    return;
  }

  const filePath = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(404).end('Not found');
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError) {
      if (statError.code === 'ENOENT' || statError.code === 'ENOTDIR') {
        response.writeHead(404).end('Not found');
      } else {
        console.error(`Unable to inspect ${filePath}:`, statError);
        response.writeHead(500).end('Unable to inspect file');
      }
      return;
    }

    if (!stats.isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }

    const contentType = mimeTypes[path.extname(filePath).toLowerCase()];
    if (!contentType) {
      response.writeHead(404).end('Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff'
    });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on('error', error => {
      console.error(`Unable to read ${filePath}:`, error);
      if (!response.headersSent) response.writeHead(500);
      response.end('Unable to read file');
    });
    stream.pipe(response);
  });
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(3000) })
      .then(async response => {
        const page = await response.text();
        if (response.ok && page.includes('<title>') && page.includes('River Trading')) {
          console.log(`River Trading website is already running at http://localhost:${port}`);
          return;
        }

        console.error(`Port ${port} is already in use by another application.`);
        process.exitCode = 1;
      })
      .catch(probeError => {
        console.error(`Port ${port} is already in use, but the existing service could not be verified:`, probeError);
        process.exitCode = 1;
      });
    return;
  }

  console.error('Unable to start the River Trading website server:', error);
  process.exitCode = 1;
});

console.log('Starting local River Trading server on 127.0.0.1...');
server.listen(port, '127.0.0.1', () => {
  console.log(`River Trading website is running at http://localhost:${port}`);
});
