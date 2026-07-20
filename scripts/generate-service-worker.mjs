#!/usr/bin/env node
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const root = resolve(dirname(scriptPath), "..");
const defaultDist = join(root, "dist");

export function isManualDynamicChunk(path) {
  return /^\/assets\/manual4Ruedas-[^/]+\.js$/u.test(path);
}

export function isManualPageImageAsset(path) {
  return /^\/content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/pages\/page-\d{3}\.jpg$/u.test(
    path,
  );
}

export function shouldInstallPrecacheAsset(path) {
  return path !== "/sw.js" && !isManualDynamicChunk(path) && !isManualPageImageAsset(path);
}

function walk(dir, dist) {
  return readdirSync(dir).flatMap((entry) => {
    const absolute = join(dir, entry);
    const stat = statSync(absolute);
    if (stat.isDirectory()) return walk(absolute, dist);
    const path = `/${relative(dist, absolute).replaceAll("\\", "/")}`;
    return shouldInstallPrecacheAsset(path) ? [path] : [];
  });
}

export function collectInstallPrecacheAssets(dist = defaultDist) {
  return ["/", ...walk(dist, dist).sort()];
}

export function createServiceWorkerBody(assets, timestamp = Date.now()) {
  return `const CACHE_NAME = "cabadrive-static-${timestamp}";
const ASSETS = ${JSON.stringify(assets, null, 2)};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match("/") || caches.match("/index.html"));
    })
  );
});
`;
}

export function generateServiceWorker({ dist = defaultDist, timestamp = Date.now() } = {}) {
  const assets = collectInstallPrecacheAssets(dist);
  const body = createServiceWorkerBody(assets, timestamp);
  writeFileSync(join(dist, "sw.js"), body);
  return { assets, body };
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const { assets } = generateServiceWorker();
  console.log(`Generated service worker with ${assets.length} cached assets.`);
}
