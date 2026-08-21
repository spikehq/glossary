#!/usr/bin/env node
/**
 * Minimal static server for `_site`, used to preview a production build and to
 * give Lighthouse something realistic to measure. It gzips text responses, the
 * way any real host would, so the simulated-throttling numbers aren't inflated
 * by uncompressed HTML.
 *
 *   node scripts/serve.js [port]
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ROOT = path.join(__dirname, "..", "_site");
const PORT = Number(process.argv[2] || process.env.PORT || 8080);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
};

const COMPRESSIBLE = /^(text\/|application\/(json|xml|manifest))/;

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  let file = path.normalize(path.join(ROOT, clean));
  if (!file.startsWith(ROOT)) return null; // no escaping the output dir
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
  }
  return fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
}

http
  .createServer((req, res) => {
    const file = resolve(req.url);

    if (!file) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }

    const type = TYPES[path.extname(file)] || "application/octet-stream";
    const body = fs.readFileSync(file);
    const headers = {
      "Content-Type": type,
      "Cache-Control": path.extname(file) === ".html" ? "no-cache" : "max-age=31536000",
    };

    if (COMPRESSIBLE.test(type) && /\bgzip\b/.test(req.headers["accept-encoding"] || "")) {
      const gz = zlib.gzipSync(body);
      res.writeHead(200, { ...headers, "Content-Encoding": "gzip", "Content-Length": gz.length });
      res.end(gz);
      return;
    }

    res.writeHead(200, { ...headers, "Content-Length": body.length });
    res.end(body);
  })
  .listen(PORT, () => {
    console.log(`Serving _site on http://localhost:${PORT}`);
  });
