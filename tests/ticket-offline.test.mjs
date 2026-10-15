import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import vm from "node:vm";
import {
  ticketOfflineMap,
  generateServiceWorker,
  createServiceWorkerBody,
  shouldInstallPrecacheAsset,
} from "../scripts/generate-service-worker.mjs";

function ticketManifest(dist, generation, widths = [480, 800, 1240]) {
  mkdirSync(join(dist, "content/img/c"), { recursive: true });
  const variants = widths.flatMap((width) =>
    ["avif", "webp", "jpeg"].map((format) => {
      const bytes = Buffer.from(`${generation}-${width}-${format}`);
      const sha256 = createHash("sha256").update(bytes).digest("hex");
      const path = `content/img/c/b13-${width}.${sha256.slice(0, 8)}.${format === "jpeg" ? "jpg" : format}`;
      writeFileSync(join(dist, path), bytes);
      return { width, height: width / 2, format, path, sha256 };
    }),
  );
  return { sources: [{ class: "c", variants }] };
}

function installRequests(body) {
  const handlers = new Map();
  const snapshots = new Map();
  const requested = [];
  vm.runInNewContext(body, {
    Request: class extends Request {
      constructor(input, options) {
        super(new URL(input, "https://app.test"), options);
      }
    },
    Response,
    self: {
      addEventListener: (name, handler) => handlers.set(name, handler),
      skipWaiting: async () => {},
    },
    caches: {
      open: async (name) => ({
        addAll: async (requests) =>
          requested.push(...requests.map((request) => new URL(request.url).pathname)),
        put: async (key, value) => snapshots.set(`${name}:${key}`, value.clone()),
        match: async (key) => snapshots.get(`${name}:${key}`)?.clone(),
      }),
    },
  });
  let pending;
  handlers.get("install")({
    waitUntil: (value) => {
      pending = value;
    },
  });
  return pending.then(() => requested);
}

test("generated installs select all current JPEG widths without retained or unlisted ticket files", async () => {
  const dist = mkdtempSync(join(tmpdir(), "cabadrive-current-ticket-sw-"));
  try {
    const old = ticketManifest(dist, "old");
    const current = ticketManifest(dist, "current");
    // A current JPEG width with no modern peer still belongs in the install set.
    current.sources[0].variants.push(
      ticketManifest(dist, "jpeg-only", [1600]).sources[0].variants[2],
    );
    writeFileSync(join(dist, "index.html"), "shell");
    mkdirSync(join(dist, "assets"));
    writeFileSync(join(dist, "assets/app.js"), "app");
    const unrelated = "content/img/a/photo-800.12345678.jpg";
    mkdirSync(join(dist, "content/img/a"));
    writeFileSync(join(dist, unrelated), "unrelated");
    const expected = [
      "/",
      "/assets/app.js",
      `/${unrelated}`,
      "/index.html",
      ...current.sources[0].variants
        .filter((variant) => variant.format === "jpeg")
        .map((variant) => `/${variant.path}`),
    ].sort();
    const first = generateServiceWorker({ dist, timestamp: 3, manifest: current });
    assert.deepEqual([...first.assets].sort(), expected);
    assert.deepEqual((await installRequests(first.body)).sort(), expected);
    for (const variant of old.sources[0].variants)
      assert.equal(first.assets.includes(`/${variant.path}`), false);
    // More retained generations and an arbitrary file never become install authority.
    ticketManifest(dist, "older");
    writeFileSync(join(dist, "content/img/c/unlisted.jpg"), "not in manifest");
    writeFileSync(join(dist, "content/img/c/unknown.bin"), "not in manifest");
    const second = generateServiceWorker({ dist, timestamp: 4, manifest: current });
    assert.deepEqual(second.assets, first.assets);
    assert.deepEqual((await installRequests(second.body)).sort(), expected);
    for (const mutate of [
      (manifest) => {
        manifest.sources[0].variants[0].path = "../unsafe.avif";
      },
      (manifest) => {
        manifest.sources[0].variants.push(manifest.sources[0].variants[0]);
      },
      (manifest) => {
        manifest.sources[0].variants.find((variant) => variant.format === "jpeg").height++;
      },
      (manifest) => {
        manifest.sources[0].variants[0].path = "content/img/c/missing-480.12345678.avif";
      },
      (manifest) => {
        manifest.sources[0].variants.find((variant) => variant.format === "jpeg").path =
          "content/img/c/missing-480.12345678.jpg";
      },
    ]) {
      const broken = structuredClone(current);
      mutate(broken);
      assert.throws(() => generateServiceWorker({ dist, timestamp: 5, manifest: broken }));
      // Failed authentication does not replace the previously generated worker.
      assert.equal(readFileSync(join(dist, "sw.js"), "utf8"), second.body);
    }
    const jpegPath = join(
      dist,
      current.sources[0].variants.find((variant) => variant.format === "jpeg").path,
    );
    const jpegBytes = readFileSync(jpegPath);
    writeFileSync(jpegPath, "tampered current JPEG");
    assert.throws(() => generateServiceWorker({ dist, manifest: current }), /integrity/);
    assert.equal(readFileSync(join(dist, "sw.js"), "utf8"), second.body);
    writeFileSync(jpegPath, jpegBytes);
    writeFileSync(join(dist, current.sources[0].variants[0].path), "tampered");
    assert.throws(() => generateServiceWorker({ dist, manifest: current }), /integrity/);
    assert.equal(readFileSync(join(dist, "sw.js"), "utf8"), second.body);
  } finally {
    rmSync(dist, { recursive: true, force: true });
  }
});

test("generic precache excludes the ticket tree; fallback map authenticates exact same-width JPEG", () => {
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
    assert.equal(shouldInstallPrecacheAsset(`/${variants[2].path}`), false);
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
  const dist = mkdtempSync(join(tmpdir(), "cabadrive-retained-ticket-sw-"));
  try {
    const oldManifest = ticketManifest(dist, "old", [1240]);
    const oldModern = `/${oldManifest.sources[0].variants[0].path}`;
    const oldJpeg = `/${oldManifest.sources[0].variants[2].path}`;
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
    const installs = new Map();
    const worker = (version, manifest) => {
      const { assets, body } = generateServiceWorker({ dist, timestamp: version, manifest });
      installs.set(version, assets);
      const handlers = new Map();
      vm.runInNewContext(body, {
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
    const old = worker(1, oldManifest);
    await old.install();
    await old.activate();
    assert.equal(stores.get("cabadrive-static-1").has(oldModern), false);
    const newManifest = ticketManifest(dist, "new", [1240]);
    const newJpeg = `/${newManifest.sources[0].variants[2].path}`;
    const current = worker(2, newManifest);
    await current.install();
    await current.activate();
    assert.deepEqual(installs.get(2), ["/", newJpeg]);
    assert.equal(stores.get("cabadrive-static-2").has(oldJpeg), false);
    assert.equal(stores.get("cabadrive-static-1").has(oldJpeg), true);
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
      oldCache.set(
        "/ticket-offline-map-v1",
        new Response(JSON.stringify({ [oldModern]: invalid })),
      );
      oldCache.set(invalid, new Response("invalid", { headers: { "Content-Type": "image/jpeg" } }));
      assert.equal((await current.request(`https://app.test${oldModern}`)).status, 0);
    }
    oldCache.set("/ticket-offline-map-v1", new Response(JSON.stringify({ [oldModern]: oldJpeg })));
    oldCache.set(oldJpeg, new Response("wrong MIME", { headers: { "Content-Type": "text/html" } }));
    assert.equal((await current.request(`https://app.test${oldModern}`)).status, 0);
    oldCache.delete(oldJpeg);
    assert.equal((await current.request(`https://app.test${oldModern}`)).status, 0);
    assert.equal((await current.request(`https://app.test${oldModern}?unknown`)).status, 0);
  } finally {
    rmSync(dist, { recursive: true, force: true });
  }
});
