import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, normalize } from "node:path";
import { test, expect } from "@playwright/test";
import { createServiceWorkerBody } from "../../scripts/generate-service-worker.mjs";

const stager = new URL("../../scripts/stage-static-release.mjs", import.meta.url).pathname;
const generateHistoricalWorker = createServiceWorkerBody as unknown as (
  assets: string[],
  timestamp: number,
) => string;

function stage(state: string, candidate: string) {
  execFileSync(process.execPath, [stager, "stage", "--state", state, "--candidate", candidate], {
    stdio: "pipe",
  });
}

function release(
  root: string,
  name: string,
  assets: Record<string, string>,
  { historicalWorker = false }: { historicalWorker?: boolean } = {},
) {
  const output = join(root, name);
  mkdirSync(join(output, "assets"), { recursive: true });
  for (const [path, body] of Object.entries(assets)) {
    const target = join(output, "assets", path);
    mkdirSync(join(target, ".."), { recursive: true });
    writeFileSync(target, body);
  }
  writeFileSync(
    join(output, "index.html"),
    `<!doctype html><title>${name}</title>${historicalWorker ? '<script>navigator.serviceWorker.register("/sw.js")</script>' : ""}`,
  );
  writeFileSync(
    join(output, "sw.js"),
    historicalWorker
      ? generateHistoricalWorker(["/", "/index.html", "/sw.js", "/assets/main-a.js"], 1700000000000)
      : `self.release = ${JSON.stringify(name)};`,
  );
  return output;
}

function startStateServer(state: string) {
  const hits: string[] = [];
  const server = createServer((request, response) => {
    const pathname = new URL(request.url || "/", "http://localhost").pathname;
    hits.push(pathname);
    const relative = pathname === "/" ? "index.html" : pathname.slice(1);
    const root = relative.startsWith("assets/") ? join(state, "assets") : join(state, "current");
    const target = relative.startsWith("assets/")
      ? join(root, relative.slice("assets/".length))
      : join(root, relative);
    if (!normalize(target).startsWith(normalize(root))) {
      response.writeHead(400).end();
      return;
    }
    try {
      const body = readFileSync(target);
      response.writeHead(200, {
        "content-type": pathname.endsWith(".js") ? "application/javascript" : "text/html",
        "cache-control": pathname.startsWith("/assets/")
          ? "public, max-age=31536000, immutable"
          : "no-cache",
      });
      response.end(body);
    } catch {
      response.writeHead(404, { "content-type": "text/plain" }).end("not found");
    }
  });
  return new Promise<{ baseUrl: string; hits: string[]; close: () => Promise<void> }>((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("missing test server address");
      resolve({
        baseUrl: `http://127.0.0.1:${address.port}`,
        hits,
        close: () =>
          new Promise((done, reject) => server.close((error) => (error ? reject(error) : done()))),
      });
    });
  });
}

test("legacy cache miss fetches exact retained A lazy bytes from origin after B", async ({
  page,
}) => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-retained-origin-"));
  const oldBytes = "export const legacyLazy = 'A exact';";
  try {
    const state = join(root, "state");
    const a = release(
      root,
      "a",
      { "main-a.js": "export const shell = 'A';", "manual4Ruedas-deferred-a.js": oldBytes },
      { historicalWorker: true },
    );
    const b = release(root, "b", { "main-b-8c19.js": "export const current = 'B';" });
    stage(state, a);
    const server = await startStateServer(state);
    try {
      await page.goto(server.baseUrl);
      await page.waitForFunction(() =>
        navigator.serviceWorker.ready.then(() => Boolean(navigator.serviceWorker.controller)),
      );
      await page.reload();
      await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
      const cacheMiss = await page.evaluate(async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return {
          controlled: navigator.serviceWorker.controller !== null,
          generatedWorker: registrations.some((registration) =>
            registration.active?.scriptURL.endsWith("/sw.js"),
          ),
          missing: (await caches.match("/assets/manual4Ruedas-deferred-a.js")) === undefined,
        };
      });
      expect(cacheMiss).toEqual({ controlled: true, generatedWorker: true, missing: true });

      stage(state, b);
      const response = await page.evaluate(async () => {
        const value = await fetch("/assets/manual4Ruedas-deferred-a.js");
        return {
          status: value.status,
          type: value.headers.get("content-type"),
          body: await value.text(),
        };
      });
      expect(response.status).toBe(200);
      expect(response.type).toContain("application/javascript");
      expect(response.body).toBe(oldBytes);
      expect(createHash("sha256").update(response.body).digest("hex")).toBe(
        createHash("sha256").update(oldBytes).digest("hex"),
      );
      expect(server.hits).toContain("/assets/manual4Ruedas-deferred-a.js");
    } finally {
      await server.close();
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("the generated A controller returns 404 after destructive replacement", async ({ page }) => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-destructive-origin-"));
  try {
    const state = join(root, "state");
    const a = release(
      root,
      "a",
      { "main-a.js": "A", "lazy-a-does-not-exist.js": "export const lazy = 'A';" },
      { historicalWorker: true },
    );
    const b = release(root, "b", { "main-b.js": "B" });
    stage(state, a);
    const server = await startStateServer(state);
    try {
      await page.goto(server.baseUrl);
      await page.waitForFunction(() =>
        navigator.serviceWorker.ready.then(() => Boolean(navigator.serviceWorker.controller)),
      );
      await page.reload();
      await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
      const cacheMiss = await page.evaluate(
        async () => (await caches.match("/assets/lazy-a-does-not-exist.js")) === undefined,
      );
      expect(cacheMiss).toBe(true);
      stage(state, b);
      rmSync(join(state, "assets", "lazy-a-does-not-exist.js"));
      const response = await page.evaluate(async () => {
        const value = await fetch("/assets/lazy-a-does-not-exist.js");
        return { status: value.status, body: await value.text() };
      });
      expect(response.status).toBe(404);
      expect(response.body).toBe("not found");
    } finally {
      await server.close();
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
