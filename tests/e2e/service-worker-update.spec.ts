import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { createServer, type Server } from "node:http";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";

test.describe.configure({ mode: "serial" });
test.skip(({ isMobile }) => Boolean(isMobile), "the two-build matrix runs once in Chromium");
test.setTimeout(90_000);

let server: Server;
let origin = "";
let root = "";
let activeBuild = "A";
let navigationRequests = 0;
const legacyLazyPath = "/assets/manual4Ruedas-a-legacy-only.js";

function generateProductionWorker(target: string, timestamp: string) {
  execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      'import { generateServiceWorker } from "./scripts/generate-service-worker.mjs"; generateServiceWorker({ dist: process.argv[1], timestamp: process.argv[2] });',
      target,
      timestamp,
    ],
    { cwd: process.cwd() },
  );
}

function makeLegacyWorker(generated: string) {
  const assets = generated.match(/const ASSETS = \[[\s\S]*?\];/u)?.[0];
  if (!assets?.includes(legacyLazyPath)) throw new Error("generated A precache omitted lazy chunk");
  return `const CACHE_NAME = "cabadrive-static-test-A";
${assets}
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: event.request.mode === "navigate" }).then(
      (cached) => cached ?? fetch(event.request),
    ),
  );
});
`;
}

function prepareBuild(name: "A" | "B" | "C" | "broken") {
  const target = join(root, name);
  cpSync("dist", target, { recursive: true });
  rmSync(join(target, "content"), { recursive: true, force: true });
  const marker = name === "broken" ? "BROKEN" : name;
  const indexPath = join(target, "index.html");
  const originalIndex = readFileSync(indexPath, "utf8");
  const index = originalIndex.replace(
    "<body>",
    `<body><div id="build-marker" style="position:fixed;z-index:9999">Build ${marker}</div>`,
  );
  writeFileSync(indexPath, index);
  if (name === "A") {
    writeFileSync(join(target, legacyLazyPath.slice(1)), "globalThis.aOnlyLoaded = true;");
  }
  const missingPath = join(target, "assets", "missing-install.js");
  if (name === "broken") writeFileSync(missingPath, "missing after generation");
  generateProductionWorker(target, `test-${name}`);
  const swPath = join(target, "sw.js");
  if (name === "A") writeFileSync(swPath, makeLegacyWorker(readFileSync(swPath, "utf8")));
  if (name === "broken") unlinkSync(missingPath);
}

function contentType(path: string) {
  if (extname(path) === ".js") return "text/javascript";
  if (extname(path) === ".css") return "text/css";
  if (extname(path) === ".json") return "application/json";
  if (extname(path) === ".svg") return "image/svg+xml";
  if (extname(path) === ".jpg") return "image/jpeg";
  return "text/html";
}

test.beforeAll(async () => {
  root = mkdtempSync(join(tmpdir(), "cabadrive-two-build-"));
  prepareBuild("A");
  prepareBuild("B");
  prepareBuild("C");
  prepareBuild("broken");
  server = createServer((request, response) => {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    if (pathname === "/" || pathname === "/index.html") navigationRequests += 1;
    const relative = pathname === "/" ? "index.html" : pathname.slice(1);
    const selected = activeBuild === "BROKEN" ? "broken" : activeBuild;
    const path = join(root, selected, relative);
    try {
      if (!statSync(path).isFile()) throw new Error("not a file");
      response.writeHead(200, {
        "content-type": contentType(path),
        "cache-control": pathname === "/sw.js" ? "no-cache" : "public, max-age=3600",
      });
      response.end(readFileSync(path));
    } catch {
      response.writeHead(404, { "content-type": "text/plain" });
      response.end("not found");
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("two-build server did not bind");
  origin = `http://127.0.0.1:${address.port}`;
});

test.afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  rmSync(root, { recursive: true, force: true });
});

test.beforeEach(() => {
  activeBuild = "A";
  navigationRequests = 0;
});

test("legacy A auto-activates complete B once, then C waits for the prompt", async ({
  page,
  context,
}) => {
  await page.goto(origin);
  await expect(page.locator("#build-marker")).toHaveText("Build A");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null))
    .toBe(true);
  const oldATab = await context.newPage();
  await oldATab.goto(origin);
  await expect(oldATab.locator("#build-marker")).toHaveText("Build A");
  await page.evaluate(() => {
    const progress = JSON.parse(localStorage.getItem("cabadrive.progress.v1")!) as unknown as {
      learningQuestionStats: Array<{
        questionId: string;
        showCount: number;
        activeMistakePriority: boolean;
        correctStreakAfterLastError: number;
      }>;
    };
    progress.learningQuestionStats.push({
      questionId: "future-content-ticket",
      showCount: 7,
      activeMistakePriority: true,
      correctStreakAfterLastError: 2,
    });
    progress.learningQuestionStats.sort((left, right) =>
      left.questionId.localeCompare(right.questionId),
    );
    localStorage.setItem("cabadrive.progress.v1", JSON.stringify(progress));
  });

  activeBuild = "B";
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration?.update();
  });
  await expect
    .poll(() => page.evaluate(() => caches.has("cabadrive-update-protocol-v1")))
    .toBe(true);
  await page.reload();
  await expect(page.locator("#build-marker")).toHaveText("Build B");
  expect(
    await page.evaluate(() =>
      (
        JSON.parse(localStorage.getItem("cabadrive.progress.v1")!) as unknown as {
          learningQuestionStats: Array<{ questionId: string }>;
        }
      ).learningQuestionStats.find((item) => item.questionId === "future-content-ticket"),
    ),
  ).toEqual(expect.objectContaining({ showCount: 7, activeMistakePriority: true }));
  const retainedChunk = await oldATab.evaluate(async (path) => {
    const response = await fetch(path);
    return { ok: response.ok, body: await response.text() };
  }, legacyLazyPath);
  expect(retainedChunk).toEqual({ ok: true, body: "globalThis.aOnlyLoaded = true;" });

  activeBuild = "C";
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration?.update();
  });
  await expect
    .poll(() =>
      page.evaluate(async () =>
        Boolean((await navigator.serviceWorker.getRegistration())?.waiting),
      ),
    )
    .toBe(true);
  await expect(page.getByText("Доступна новая версия приложения.")).toBeVisible();
  navigationRequests = 0;
  await page.getByRole("button", { name: "Обновить" }).click();
  await expect(page.locator("#build-marker")).toHaveText("Build C");
  await expect.poll(() => navigationRequests).toBe(1);

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("#build-marker")).toHaveText("Build C");
  await expect(page.getByRole("button", { name: /^Учить$/ })).toBeVisible();
  await context.setOffline(false);
});

test("failed compatibility install cannot mark or replace legacy A", async ({ page, context }) => {
  await page.goto(origin);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  activeBuild = "BROKEN";
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration?.update();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });
  await expect(page.getByText("Доступна новая версия приложения.")).toHaveCount(0);
  expect(await page.evaluate(() => caches.has("cabadrive-update-protocol-v1"))).toBe(false);

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("#build-marker")).toHaveText("Build A");
  await context.setOffline(false);

  activeBuild = "B";
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration?.update();
  });
  await expect
    .poll(() => page.evaluate(() => caches.has("cabadrive-update-protocol-v1")))
    .toBe(true);
  await page.reload();
  await expect(page.locator("#build-marker")).toHaveText("Build B");
});
