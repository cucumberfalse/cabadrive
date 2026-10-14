import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import vm from "node:vm";
import {
  ticketOfflineMap,
  createServiceWorkerBody,
  shouldInstallPrecacheAsset,
} from "../scripts/generate-service-worker.mjs";

test("only ticket modern codecs skip precache; fallback map authenticates exact same-width JPEG", () => {
  const dist = mkdtempSync(join(tmpdir(), "cabadrive-ticket-sw-"));
  try {
    mkdirSync(join(dist, "content/img/c"), { recursive: true });
    const variants = ["avif", "webp", "jpeg"].map((format) => {
      const bytes = Buffer.from(`fixture-${format}`);
      const sha256 = createHash("sha256").update(bytes).digest("hex");
      const path = `content/img/c/b13-1240.${sha256.slice(0, 8)}.${format === "jpeg" ? "jpg" : format}`;
      writeFileSync(join(dist, path), bytes);
      return { width: 1240, height: 800, format, path, sha256 };
    });
    const manifest = { sources: [{ class: "c", variants }] };
    const map = ticketOfflineMap(manifest, dist);
    assert.equal(map[`/${variants[0].path}`], `/${variants[2].path}`);
    assert.equal(map[`/${variants[1].path}`], `/${variants[2].path}`);
    assert.equal(shouldInstallPrecacheAsset(`/${variants[0].path}`), false);
    assert.equal(shouldInstallPrecacheAsset(`/${variants[1].path}`), false);
    assert.equal(shouldInstallPrecacheAsset(`/${variants[2].path}`), true);
    assert.equal(shouldInstallPrecacheAsset("/content/img/a/photo-800.12345678.avif"), true);
    const stale = structuredClone(manifest);
    stale.sources[0].variants[2].width = 1200;
    assert.throws(() => ticketOfflineMap(stale, dist), /same-width/);
    writeFileSync(join(dist, variants[0].path), "tampered");
    assert.throws(() => ticketOfflineMap(manifest, dist), /integrity/);
  } finally {
    rmSync(dist, { recursive: true, force: true });
  }
});
test("offline unvisited modern URLs use honest JPEG only for mapped same-origin requests", async () => {
  const modern = "/content/img/c/b13-1240.12345678.avif";
  const jpeg = "/content/img/c/b13-1240.87654321.jpg";
  const body = createServiceWorkerBody([jpeg], 1, { [modern]: jpeg });
  const handlers = new Map();
  const response = new Response("precached JPEG", { headers: { "Content-Type": "image/jpeg" } });
  let online = false;
  let puts = 0;
  const context = vm.createContext({
    Request,
    Response,
    URL,
    fetch: async () => {
      if (online) return new Response("AVIF", { headers: { "Content-Type": "image/avif" } });
      throw Error("offline");
    },
    caches: {
      keys: async () => [],
      open: async () => ({
        match: async (key) => (key === jpeg ? response.clone() : undefined),
        put: async () => {
          puts++;
        },
      }),
    },
    self: {
      location: { origin: "https://app.test" },
      addEventListener: (name, fn) => handlers.set(name, fn),
    },
  });
  vm.runInContext(body, context);
  const request = async (url) => {
    let promise;
    handlers.get("fetch")({
      request: new Request(url),
      respondWith: (p) => {
        promise = p;
      },
    });
    return promise;
  };
  const fallback = await request(`https://app.test${modern}`);
  assert.equal(fallback.status, 200);
  assert.equal(fallback.headers.get("Content-Type"), "image/jpeg");
  assert.equal(await fallback.text(), "precached JPEG");
  assert.equal(puts, 0); // Never poison the modern URL with JPEG bytes.
  assert.equal((await request(`https://other.test${modern}`)).status, 0);
  assert.equal((await request(`https://app.test${modern}?unvalidated`)).status, 0);
  assert.equal((await request("https://app.test/unmapped.avif")).status, 0);
  online = true;
  assert.equal(
    (await request(`https://app.test${modern}`)).headers.get("Content-Type"),
    "image/avif",
  );
  assert.equal(puts, 1);
});

test("new worker resolves an unvisited old-tab codec only through the old atomic cache map", async () => {
  const oldModern = "/content/img/c/b13-1240.11111111.avif";
  const oldJpeg = "/content/img/c/b13-1240.22222222.jpg";
  const newModern = "/content/img/c/b13-1240.33333333.avif";
  const newJpeg = "/content/img/c/b13-1240.44444444.jpg";
  const stores = new Map();
  const cacheFor = async (name) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const entries = stores.get(name);
    return {
      match: async (key) =>
        entries.get(key instanceof Request ? new URL(key.url).pathname : key)?.clone(),
      put: async (key, value) => entries.set(key, value.clone()),
      delete: async (key) => entries.delete(key),
      addAll: async (requests) => {
        for (const request of requests)
          entries.set(
            request.input,
            new Response("actual cached JPEG fixture", {
              headers: { "Content-Type": "image/jpeg" },
            }),
          );
      },
    };
  };
  const worker = (version, map) => {
    const handlers = new Map();
    vm.runInNewContext(createServiceWorkerBody(Object.values(map), version, map), {
      Request: class extends Request {
        constructor(input, options) {
          super(new URL(input, "https://app.test").href, options);
          this.input = input;
        }
      },
      Response,
      URL,
      fetch: async () => {
        throw Error("offline");
      },
      caches: { keys: async () => [...stores.keys()], open: cacheFor },
      self: {
        location: { origin: "https://app.test" },
        clients: { claim: async () => {} },
        skipWaiting: async () => {},
        addEventListener: (name, fn) => handlers.set(name, fn),
      },
    });
    return {
      install: async () => {
        let pending;
        handlers.get("install")({
          waitUntil: (value) => {
            pending = value;
          },
        });
        await pending;
      },
      activate: async () => {
        let pending;
        handlers.get("activate")({
          waitUntil: (value) => {
            pending = value;
          },
        });
        await pending;
      },
      request: async (url) => {
        let pending;
        handlers.get("fetch")({
          request: new Request(url),
          respondWith: (value) => {
            pending = value;
          },
        });
        return pending;
      },
    };
  };
  const old = worker(1, { [oldModern]: oldJpeg });
  await old.install();
  await old.activate();
  assert.equal(stores.get("cabadrive-static-1").has(oldModern), false);
  const current = worker(2, { [newModern]: newJpeg });
  await current.install();
  await current.activate();
  const response = await current.request(`https://app.test${oldModern}`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "image/jpeg");
  assert.equal(stores.get("cabadrive-static-2").has(oldModern), false);
  const oldCache = stores.get("cabadrive-static-1");
  for (const invalid of [
    "/content/img/c/b14-1240.22222222.jpg",
    "/content/img/c/b13-800.22222222.jpg",
    "https://other.test/evil.jpg",
  ]) {
    oldCache.set("/ticket-offline-map-v1", new Response(JSON.stringify({ [oldModern]: invalid })));
    oldCache.set(invalid, new Response("invalid", { headers: { "Content-Type": "image/jpeg" } }));
    assert.equal((await current.request(`https://app.test${oldModern}`)).status, 0);
  }
  oldCache.set("/ticket-offline-map-v1", new Response(JSON.stringify({ [oldModern]: oldJpeg })));
  oldCache.set(oldJpeg, new Response("wrong MIME", { headers: { "Content-Type": "text/html" } }));
  assert.equal((await current.request(`https://app.test${oldModern}`)).status, 0);
  oldCache.delete(oldJpeg);
  assert.equal((await current.request(`https://app.test${oldModern}`)).status, 0);
  assert.equal((await current.request(`https://app.test${oldModern}?unknown`)).status, 0);
});
