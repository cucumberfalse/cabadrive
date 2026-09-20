import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import vm from "node:vm";
import {
  collectInstallPrecacheAssets,
  generateServiceWorker,
  isManualPageImageAsset,
  shouldInstallPrecacheAsset,
} from "../scripts/generate-service-worker.mjs";

function withTempDist(callback) {
  const dist = mkdtempSync(join(tmpdir(), "cabadrive-sw-"));
  try {
    mkdirSync(join(dist, "assets"), { recursive: true });
    mkdirSync(join(dist, "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages"), {
      recursive: true,
    });
    mkdirSync(join(dist, "content/assets/manuals/other-local-guide/pages"), { recursive: true });
    writeFileSync(join(dist, "index.html"), "<!doctype html>");
    writeFileSync(join(dist, "assets/index-abc123.js"), "console.log('app');");
    writeFileSync(join(dist, "assets/manual4Ruedas-def456.js"), "console.log('manual');");
    writeFileSync(join(dist, "assets/manual4Ruedas-def456.css"), ".manual{}");
    writeFileSync(join(dist, "assets/manifest-xyz789.js"), "console.log('manifest');");
    writeFileSync(
      join(dist, "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/cover.jpg"),
      "cover",
    );
    writeFileSync(
      join(dist, "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-001.jpg"),
      "jpeg",
    );
    writeFileSync(
      join(dist, "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-200.jpg"),
      "jpeg",
    );
    writeFileSync(
      join(dist, "content/assets/manuals/other-local-guide/pages/page-001.jpg"),
      "other jpeg",
    );
    writeFileSync(join(dist, "sw.js"), "old service worker");
    callback(dist);
  } finally {
    rmSync(dist, { recursive: true, force: true });
  }
}

test("service worker precaches hashed deferred assets but excludes manual page images", () => {
  withTempDist((dist) => {
    const assets = collectInstallPrecacheAssets(dist);

    assert.equal(
      isManualPageImageAsset(
        "/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-001.jpg",
      ),
      true,
    );
    assert.equal(
      isManualPageImageAsset(
        "/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-200.jpg",
      ),
      true,
    );
    assert.equal(
      isManualPageImageAsset(
        "/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/cover.jpg",
      ),
      false,
    );
    assert.equal(
      isManualPageImageAsset("/content/assets/manuals/other-local-guide/pages/page-001.jpg"),
      false,
    );
    assert.equal(shouldInstallPrecacheAsset("/assets/manual4Ruedas-def456.js"), true);
    assert.equal(shouldInstallPrecacheAsset("/assets/manual4Ruedas-def456.css"), true);
    assert.equal(
      shouldInstallPrecacheAsset(
        "/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-001.jpg",
      ),
      false,
    );
    assert.equal(
      shouldInstallPrecacheAsset(
        "/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-200.jpg",
      ),
      false,
    );
    assert.equal(
      shouldInstallPrecacheAsset(
        "/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/cover.jpg",
      ),
      true,
    );
    assert.equal(
      shouldInstallPrecacheAsset("/content/assets/manuals/other-local-guide/pages/page-001.jpg"),
      true,
    );
    assert.deepEqual(assets, [
      "/",
      "/assets/index-abc123.js",
      "/assets/manifest-xyz789.js",
      "/assets/manual4Ruedas-def456.css",
      "/assets/manual4Ruedas-def456.js",
      "/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/cover.jpg",
      "/content/assets/manuals/other-local-guide/pages/page-001.jpg",
      "/index.html",
    ]);
  });
});

test("generated service worker precaches manual JS and keeps runtime GET caching", () => {
  withTempDist((dist) => {
    const { assets, body } = generateServiceWorker({ dist, timestamp: 12345 });
    const generated = readFileSync(join(dist, "sw.js"), "utf8");

    assert.equal(assets.includes("/assets/manual4Ruedas-def456.js"), true);
    assert.equal(
      assets.includes(
        "/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-001.jpg",
      ),
      false,
    );
    assert.equal(
      assets.includes(
        "/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-200.jpg",
      ),
      false,
    );
    assert.equal(
      assets.includes("/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/cover.jpg"),
      true,
    );
    assert.equal(body, generated);
    assert.match(generated, /new Request\(asset, \{ cache: "reload" \}\)/);
    assert.match(generated, /cache\.addAll\(requests\)/);
    assert.match(generated, /fetch\(event\.request\)/);
    assert.match(generated, /currentCache\.put\(event\.request, response\.clone\(\)\)/);
    assert.match(generated, /\/assets\/manual4Ruedas-def456\.js/);
    assert.doesNotMatch(
      generated,
      /\/content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/pages\/page-001\.jpg/,
    );
    assert.doesNotMatch(
      generated,
      /\/content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/pages\/page-200\.jpg/,
    );
  });
});

test("runtime cache write failure does not discard a successful network response", async () => {
  let body;
  withTempDist((dist) => {
    body = generateServiceWorker({ dist, timestamp: 12345 }).body;
  });
  const handlers = new Map();
  const networkResponse = new Response("fresh runtime asset", { status: 200 });
  const context = vm.createContext({
    Request,
    Response,
    fetch: async () => networkResponse,
    caches: {
      keys: async () => [],
      open: async () => ({
        match: async () => undefined,
        put: async () => {
          throw new Error("quota exceeded");
        },
      }),
    },
    self: {
      addEventListener: (name, handler) => handlers.set(name, handler),
      clients: { claim: async () => undefined },
      skipWaiting: () => undefined,
    },
  });
  vm.runInContext(body, context);

  let responsePromise;
  handlers.get("fetch")({
    request: new Request("https://example.test/runtime.js"),
    respondWith: (promise) => {
      responsePromise = promise;
    },
  });
  const response = await responsePromise;

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "fresh runtime asset");
});

test("runtime network failure still returns an error response", async () => {
  let body;
  withTempDist((dist) => {
    body = generateServiceWorker({ dist, timestamp: 12345 }).body;
  });
  const handlers = new Map();
  const context = vm.createContext({
    Request,
    Response,
    fetch: async () => {
      throw new Error("offline");
    },
    caches: {
      keys: async () => [],
      open: async () => ({ match: async () => undefined, put: async () => undefined }),
    },
    self: {
      addEventListener: (name, handler) => handlers.set(name, handler),
      clients: { claim: async () => undefined },
      skipWaiting: () => undefined,
    },
  });
  vm.runInContext(body, context);

  let responsePromise;
  handlers.get("fetch")({
    request: new Request("https://example.test/runtime.js"),
    respondWith: (promise) => {
      responsePromise = promise;
    },
  });
  const response = await responsePromise;

  assert.equal(response.type, "error");
  assert.equal(response.status, 0);
});

test("generated service worker fetch handler has correct offline fallbacks", () => {
  withTempDist((dist) => {
    const { body } = generateServiceWorker({ dist, timestamp: 12345 });
    const generated = readFileSync(join(dist, "sw.js"), "utf8");

    assert.equal(body, generated);

    const installHandler = generated.match(
      /self\.addEventListener\("install",[\s\S]*?\n\}\);/,
    )?.[0];
    assert.match(installHandler, /if \(existingMarker\) return;/u);
    assert.match(installHandler, /await self\.skipWaiting\(\)/u);
    assert.doesNotMatch(installHandler, /event\.waitUntil\(self\.skipWaiting/u);
    assert.match(generated, /event\.data\?\.type === "SKIP_WAITING"/u);
    assert.match(generated, /cabadrive-update-protocol-v1/u);
    assert.match(generated, /prompted-activation-v1/u);
    assert.doesNotMatch(generated, /caches\.delete/);
    assert.match(generated, /new Request\(event\.request, \{ cache: "no-store" \}\)/);
    assert.match(generated, /currentCache\.match\(event\.request, \{ ignoreSearch: true \}\)/);
    assert.match(
      generated,
      /\(await currentCache\.match\("\/"\)\) \?\?\s*\(await currentCache\.match\("\/index\.html"\)\) \?\?/,
    );
    assert.match(generated, /key\.startsWith\(CACHE_PREFIX\) && key !== CACHE_NAME/);
    assert.match(generated, /await matchRetainedCabadriveCache\(event\.request\)/);
    assert.match(generated, /return Response\.error\(\);/);
  });
});

test("first prompted worker persists its fixed marker before compatibility activation", async () => {
  let body;
  withTempDist((dist) => {
    body = generateServiceWorker({ dist, timestamp: 12345 }).body;
  });
  const handlers = new Map();
  const protocolEntries = new Map();
  let skipWaitingCalls = 0;
  const context = vm.createContext({
    Request: class Request {
      constructor(input, options = {}) {
        this.input = input;
        this.cache = options.cache;
      }
    },
    Response,
    fetch: async () => new Response("ok"),
    caches: {
      open: async (name) =>
        name === "cabadrive-update-protocol-v1"
          ? {
              match: async (key) => protocolEntries.get(key)?.clone(),
              put: async (key, response) => protocolEntries.set(key, response.clone()),
              delete: async (key) => protocolEntries.delete(key),
            }
          : { addAll: async () => undefined },
    },
    self: {
      addEventListener: (name, handler) => handlers.set(name, handler),
      clients: { claim: async () => undefined },
      skipWaiting: async () => {
        skipWaitingCalls += 1;
      },
    },
  });
  vm.runInContext(body, context);

  let installPromise;
  handlers.get("install")({ waitUntil: (promise) => (installPromise = promise) });
  await installPromise;

  assert.equal(skipWaitingCalls, 1);
  assert.equal(protocolEntries.size, 1);
  assert.equal(await [...protocolEntries.values()][0].text(), "prompted-activation-v1");
});

test("marked workers stay waiting and marker failures abort compatibility activation", async () => {
  let body;
  withTempDist((dist) => {
    body = generateServiceWorker({ dist, timestamp: 12345 }).body;
  });
  const runInstall = async ({ marked = false, failPrecache = false, failMarker = false } = {}) => {
    const handlers = new Map();
    let skipWaitingCalls = 0;
    let protocolOpenCalls = 0;
    const marker = marked ? new Response("prompted-activation-v1") : undefined;
    const context = vm.createContext({
      Request: class Request {
        constructor(input, options = {}) {
          this.input = input;
          this.cache = options.cache;
        }
      },
      Response,
      fetch: async () => new Response("ok"),
      caches: {
        open: async (name) => {
          if (name !== "cabadrive-update-protocol-v1")
            return {
              addAll: async () => {
                if (failPrecache) throw new Error("precache failed");
              },
            };
          protocolOpenCalls += 1;
          return {
            match: async () => marker?.clone(),
            put: async () => {
              if (failMarker) throw new Error("marker failed");
            },
            delete: async () => true,
          };
        },
      },
      self: {
        addEventListener: (name, handler) => handlers.set(name, handler),
        clients: { claim: async () => undefined },
        skipWaiting: async () => {
          skipWaitingCalls += 1;
        },
      },
    });
    vm.runInContext(body, context);
    let installPromise;
    handlers.get("install")({ waitUntil: (promise) => (installPromise = promise) });
    const result = await Promise.allSettled([installPromise]);
    return { result: result[0], skipWaitingCalls, protocolOpenCalls };
  };

  assert.deepEqual(await runInstall({ marked: true }), {
    result: { status: "fulfilled", value: undefined },
    skipWaitingCalls: 0,
    protocolOpenCalls: 1,
  });
  const precacheFailure = await runInstall({ failPrecache: true });
  assert.equal(precacheFailure.result.status, "rejected");
  assert.equal(precacheFailure.skipWaitingCalls, 0);
  assert.equal(precacheFailure.protocolOpenCalls, 0);
  const markerFailure = await runInstall({ failMarker: true });
  assert.equal(markerFailure.result.status, "rejected");
  assert.equal(markerFailure.skipWaitingCalls, 0);
});
