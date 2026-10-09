import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { resolve } from "node:path";

const stablePath = "/content/assets/stable.txt";
const fixtureAssets = ["/", "/assets/app-fixture.js", stablePath];
const policy =
  "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'";

function workerBody(version: number, legacy = false) {
  const builtWorker = readFileSync(resolve("dist/sw.js"), "utf8");
  const cacheNameDeclaration =
    /^const CACHE_NAME = (?:"cabadrive-static-\d+"|CACHE_PREFIX \+ "\d+");/m;
  expect(builtWorker.match(cacheNameDeclaration)).not.toBeNull();
  let body = builtWorker
    .replace(cacheNameDeclaration, `const CACHE_NAME = "cabadrive-static-${version}";`)
    .replace(
      /const ASSETS = \[[\s\S]*?\];\n\n/,
      `const ASSETS = ${JSON.stringify(fixtureAssets)};\n\n`,
    );
  if (legacy) {
    // Original install behavior is an HTTP-cache control, not a repaired historical fixture.
    body = body.replace(
      /self\.addEventListener\("install",[\s\S]*?(?=self\.addEventListener\("activate",)/,
      'self.addEventListener("install", (event) => {\n  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));\n  self.skipWaiting();\n});\n\n',
    );
  }
  return body;
}

async function fixtureOrigin(legacy = false) {
  let version = 1;
  let content = "origin-A";
  let contentFails = false;
  const stableRequests: { body: string; status: number }[] = [];
  const server = createServer((request, response) => {
    response.setHeader("Content-Security-Policy", policy);
    if (request.url === "/sw.js") {
      response.setHeader("Content-Type", "application/javascript");
      response.setHeader("Cache-Control", "no-cache");
      response.end(workerBody(version, legacy));
    } else if (request.url === stablePath) {
      response.statusCode = contentFails ? 503 : 200;
      response.setHeader("Content-Type", "text/plain");
      response.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
      stableRequests.push({ body: content, status: response.statusCode });
      response.end(contentFails ? "unavailable" : content);
    } else if (request.url === "/assets/app-fixture.js") {
      response.setHeader("Content-Type", "application/javascript");
      response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      response.end("/* immutable fixture */");
    } else {
      response.setHeader("Content-Type", "text/html");
      response.end("<!doctype html><title>Cache fixture</title><h1>Offline snapshot</h1>");
    }
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing fixture origin port");
  return {
    url: `http://127.0.0.1:${address.port}`,
    stableRequests,
    publish(nextVersion: number, nextContent: string, fails = false) {
      version = nextVersion;
      content = nextContent;
      contentFails = fails;
    },
    close: () => closeServer(server),
  };
}

async function closeServer(server: Server) {
  server.closeAllConnections();
  await new Promise<void>((done, reject) =>
    server.close((error) => (error ? reject(error) : done())),
  );
}

async function installWorker(page: Page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
  });
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
}

async function cachedBody(page: Page, version: number) {
  return page.evaluate(
    async ({ version, stablePath }) => {
      const cache = await caches.open(`cabadrive-static-${version}`);
      return (await cache.match(stablePath))?.text();
    },
    { version, stablePath },
  );
}

for (const legacy of [true, false]) {
  test(`${legacy ? "legacy default install promotes HTTP-cached A" : "new install reloads exact origin B"} after a stable URL changes`, async ({
    page,
  }) => {
    const origin = await fixtureOrigin(legacy);
    try {
      await page.goto(origin.url);
      expect(await page.evaluate(async (path) => (await fetch(path)).text(), stablePath)).toBe(
        "origin-A",
      );
      expect(origin.stableRequests).toEqual([{ body: "origin-A", status: 200 }]);
      origin.publish(2, "origin-B");
      // No routing or cache clearing: this control proves the real HTTP entry is still fresh A.
      expect(await page.evaluate(async (path) => (await fetch(path)).text(), stablePath)).toBe(
        "origin-A",
      );
      expect(origin.stableRequests).toHaveLength(1);
      await installWorker(page);
      expect(await cachedBody(page, 2)).toBe(legacy ? "origin-A" : "origin-B");
      expect(origin.stableRequests).toEqual(
        legacy
          ? [{ body: "origin-A", status: 200 }]
          : [
              { body: "origin-A", status: 200 },
              { body: "origin-B", status: 200 },
            ],
      );
    } finally {
      await origin.close();
    }
  });
}

test("failed atomic install keeps the prior active worker and offline snapshot", async ({
  page,
  context,
}) => {
  const origin = await fixtureOrigin();
  try {
    await page.goto(origin.url);
    await installWorker(page);
    expect(await cachedBody(page, 1)).toBe("origin-A");
    origin.publish(2, "origin-B", true);
    const state = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      const outcome = new Promise<string>((done) => {
        registration.addEventListener(
          "updatefound",
          () => {
            const worker = registration.installing;
            if (!worker) throw new Error("Missing new installing worker");
            worker.addEventListener("statechange", () => {
              if (worker.state === "redundant" || worker.state === "activated") done(worker.state);
            });
          },
          { once: true },
        );
      });
      await registration.update();
      return outcome;
    });
    expect(state).toBe("redundant");
    expect(origin.stableRequests).toEqual([
      { body: "origin-A", status: 200 },
      { body: "origin-B", status: 503 },
    ]);
    expect(
      await page.evaluate(
        async () => (await (await caches.open("cabadrive-static-2")).keys()).length,
      ),
    ).toBe(0);
    expect(await cachedBody(page, 1)).toBe("origin-A");
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Offline snapshot" })).toBeVisible();
    expect(await page.evaluate(async (path) => (await fetch(path)).text(), stablePath)).toBe(
      "origin-A",
    );
  } finally {
    await context.setOffline(false);
    await origin.close();
  }
});
