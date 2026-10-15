#!/usr/bin/env node
import { readdirSync, statSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
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
  return path !== "/sw.js" && !isManualPageImageAsset(path) && !path.startsWith("/content/img/c/");
}

function ticketOfflineInventory(manifest, dist) {
  const map = {};
  const jpegAssets = [];
  const paths = new Set();
  for (const source of manifest.sources.filter((item) => item.class === "c")) {
    const jpeg = new Map();
    for (const variant of source.variants) {
      const extension = variant.format === "jpeg" ? "jpg" : variant.format;
      if (
        !["jpeg", "avif", "webp"].includes(variant.format) ||
        !/^content\/img\/c\/[a-zA-Z0-9-]+-\d+\.[a-f0-9]{8}\.(avif|webp|jpg)$/.test(variant.path) ||
        !variant.path.endsWith(`.${extension}`) ||
        paths.has(variant.path) ||
        !Number.isSafeInteger(variant.width) ||
        variant.width < 1 ||
        !Number.isSafeInteger(variant.height) ||
        variant.height < 1 ||
        !/^[a-f0-9]{64}$/.test(variant.sha256 ?? "")
      )
        throw new Error("Unsafe/incomplete ticket offline map");
      paths.add(variant.path);
      const bytes = readFileSync(join(dist, variant.path));
      if (createHash("sha256").update(bytes).digest("hex") !== variant.sha256)
        throw new Error("Ticket offline-map payload integrity mismatch");
      if (variant.format === "jpeg") {
        if (jpeg.has(variant.width)) throw new Error("Duplicate ticket JPEG width");
        jpeg.set(variant.width, variant);
        jpegAssets.push(`/${variant.path}`);
      }
    }
    for (const variant of source.variants.filter((item) => item.format !== "jpeg")) {
      const fallback = jpeg.get(variant.width);
      if (!fallback || fallback.height !== variant.height)
        throw new Error("Missing same-width ticket JPEG fallback");
      map[`/${variant.path}`] = `/${fallback.path}`;
    }
  }
  return { map, jpegAssets };
}

export function ticketOfflineMap(manifest, dist) {
  return ticketOfflineInventory(manifest, dist).map;
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

export function createServiceWorkerBody(assets, timestamp = Date.now(), offlineMap = {}) {
  return `const CACHE_PREFIX = "cabadrive-static-";
const CACHE_NAME = CACHE_PREFIX + "${timestamp}";
const UPDATE_PROTOCOL_CACHE = "cabadrive-update-protocol-v1";
const PROMPTED_ACTIVATION_MARKER = "/prompted-activation-v1";
const PROMPTED_ACTIVATION_VALUE = "prompted-activation-v1";
const ASSETS = ${JSON.stringify(assets, null, 2)};
const TICKET_OFFLINE_JPEG = ${JSON.stringify(offlineMap)};
const TICKET_MAP_PATH = "/ticket-offline-map-v1";

function validateRetainedTicketMap(map) {
  if (!map || typeof map !== "object" || Array.isArray(map)) return undefined;
  const modern = /^\\/content\\/img\\/c\\/([a-zA-Z0-9-]+)-(\\d+)\\.[a-f0-9]{8}\\.(avif|webp)$/;
  const jpeg = /^\\/content\\/img\\/c\\/([a-zA-Z0-9-]+)-(\\d+)\\.[a-f0-9]{8}\\.jpg$/;
  for (const [path, fallback] of Object.entries(map)) {
    const from = path.match(modern);
    const to = typeof fallback === "string" && fallback.match(jpeg);
    if (!from || !to || from[1] !== to[1] || from[2] !== to[2]) return undefined;
  }
  return map;
}

self.addEventListener("install", (event) => {
  const requests = ASSETS.map((asset) => new Request(asset, { cache: "reload" }));
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(requests);
      await cache.put(TICKET_MAP_PATH, new Response(JSON.stringify(TICKET_OFFLINE_JPEG), {
        headers: { "Content-Type": "application/json" },
      }));
      const snapshot = await cache.match(TICKET_MAP_PATH);
      if (!snapshot || JSON.stringify(await snapshot.json()) !== JSON.stringify(TICKET_OFFLINE_JPEG)) {
        throw new Error("Could not verify the installed ticket fallback map");
      }
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

async function retainedTicketJpeg(path) {
  const keys = await caches.keys();
  for (const key of keys) {
    if (!key.startsWith(CACHE_PREFIX) || key === CACHE_NAME) continue;
    const cache = await caches.open(key);
    const snapshot = await cache.match(TICKET_MAP_PATH);
    if (!snapshot) continue;
    let map;
    try { map = validateRetainedTicketMap(await snapshot.json()); } catch { continue; }
    const jpeg = map?.[path];
    if (jpeg) {
      const response = await cache.match(jpeg);
      if (response?.ok && response.headers.get("Content-Type")?.split(";")[0] === "image/jpeg") return response;
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
      const url = new URL(event.request.url);
      const localTicket = url.origin === self.location?.origin && !url.search;
      const jpegPath = localTicket
        ? TICKET_OFFLINE_JPEG[url.pathname] : undefined;
      const offlineJpeg = async () => {
        if (!localTicket) return undefined;
        const response = jpegPath && ((await currentCache.match(jpegPath)) ?? (await matchRetainedCabadriveCache(jpegPath)));
        if (response?.ok && response.headers.get("Content-Type")?.split(";")[0] === "image/jpeg") return response;
        return retainedTicketJpeg(url.pathname);
      };
      try {
        response = await fetch(event.request);
      } catch {
        return (await offlineJpeg()) || Response.error();
      }
      if (!response.ok) return (await offlineJpeg()) || response;
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

export function generateServiceWorker({
  dist = defaultDist,
  timestamp = Date.now(),
  manifest,
} = {}) {
  manifest ??=
    dist === defaultDist
      ? JSON.parse(readFileSync(join(root, "content/image-derivatives.manifest.json"), "utf8"))
      : { sources: [] };
  const { map, jpegAssets } = ticketOfflineInventory(manifest, dist);
  const assets = [...new Set([...collectInstallPrecacheAssets(dist), ...jpegAssets])].sort();
  const body = createServiceWorkerBody(assets, timestamp, map);
  writeFileSync(join(dist, "sw.js"), body);
  return { assets, body };
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const { assets } = generateServiceWorker();
  console.log(`Generated service worker with ${assets.length} cached assets.`);
}
