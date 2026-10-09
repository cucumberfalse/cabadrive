#!/usr/bin/env node
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const root = resolve(dirname(scriptPath), "..");
const defaultDist = join(root, "dist");

export function isManualPageImageAsset(path) {
  return /^\/content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/pages\/page-\d{3}\.jpg$/u.test(
    path,
  );
}

export function shouldInstallPrecacheAsset(path) {
  return path !== "/sw.js" && !isManualPageImageAsset(path);
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
  return `const CACHE_PREFIX = "cabadrive-static-";
const CACHE_NAME = CACHE_PREFIX + "${timestamp}";
const UPDATE_PROTOCOL_CACHE = "cabadrive-update-protocol-v1";
const PROMPTED_ACTIVATION_MARKER = "/prompted-activation-v1";
const PROMPTED_ACTIVATION_VALUE = "prompted-activation-v1";
const ASSETS = ${JSON.stringify(assets, null, 2)};

self.addEventListener("install", (event) => {
  const requests = ASSETS.map((asset) => new Request(asset, { cache: "reload" }));
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(requests);
      const protocolCache = await caches.open(UPDATE_PROTOCOL_CACHE);
      const existingMarker = await protocolCache.match(PROMPTED_ACTIVATION_MARKER);
      if (existingMarker) return;
      try {
        await protocolCache.put(
          PROMPTED_ACTIVATION_MARKER,
          new Response(PROMPTED_ACTIVATION_VALUE),
        );
        const persistedMarker = await protocolCache.match(PROMPTED_ACTIVATION_MARKER);
        if (!persistedMarker || (await persistedMarker.text()) !== PROMPTED_ACTIVATION_VALUE) {
          throw new Error("Could not verify the prompted-activation protocol marker");
        }
        await self.skipWaiting();
      } catch (error) {
        try {
          await protocolCache.delete(PROMPTED_ACTIVATION_MARKER);
        } catch {
          // The original install error remains authoritative.
        }
        throw error;
      }
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

async function matchRetainedCabadriveCache(request) {
  const keys = await caches.keys();
  for (const key of keys) {
    if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
      const cached = await (await caches.open(key)).match(request);
      if (cached) return cached;
    }
  }
  return undefined;
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    (async () => {
      const currentCache = await caches.open(CACHE_NAME);
      if (event.request.mode === "navigate") {
        try {
          const response = await fetch(new Request(event.request, { cache: "no-store" }));
          if (response.ok) return response;
        } catch {
          // The fully installed current cache remains the last-known-good shell.
        }
        return (
          (await currentCache.match(event.request, { ignoreSearch: true })) ??
          (await currentCache.match("/")) ??
          (await currentCache.match("/index.html")) ??
          Response.error()
        );
      }

      const current = await currentCache.match(event.request);
      if (current) return current;
      const retained = await matchRetainedCabadriveCache(event.request);
      if (retained) return retained;
      let response;
      try {
        response = await fetch(event.request);
      } catch {
        return Response.error();
      }
      if (response.ok) {
        try {
          await currentCache.put(event.request, response.clone());
        } catch {
          // A cache quota/write failure must not hide a valid network response.
        }
      }
      return response;
    })(),
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
