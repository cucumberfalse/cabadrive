import { expect, test } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { cpSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
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

function prepareBuild(name: "A" | "B" | "broken") {
  const target = join(root, name);
  cpSync("dist", target, { recursive: true });
  const marker = name === "broken" ? "BROKEN" : name;
  const indexPath = join(target, "index.html");
  const originalIndex = readFileSync(indexPath, "utf8");
  const shellAssets = [
    "/",
    "/index.html",
    ...[...originalIndex.matchAll(/(?:src|href)="([^"]+)"/gu)]
      .map((match) => match[1])
      .filter((path) => path.startsWith("/")),
  ];
  const index = originalIndex.replace(
    "<body>",
    `<body><div id="build-marker" style="position:fixed;z-index:9999">Build ${marker}</div>`,
  );
  writeFileSync(indexPath, index);
  const swPath = join(target, "sw.js");
  let sw = readFileSync(swPath, "utf8").replace(
    /CACHE_PREFIX \+ "[^"]+"/,
    `CACHE_PREFIX + "test-${name}"`,
  );
  if (name === "A") {
    writeFileSync(join(target, "assets", "a-only.js"), "globalThis.aOnlyLoaded = true;");
    shellAssets.push("/assets/a-only.js");
  }
  if (name === "broken") shellAssets.push("/missing-install.js");
  sw = sw.replace(
    /const ASSETS = \[[\s\S]*?\];/u,
    `const ASSETS = ${JSON.stringify(shellAssets)};`,
  );
  writeFileSync(swPath, sw);
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

test("ordinary online reload gets B, apply reloads once, progress and old chunks survive", async ({
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
  await expect(page.getByText("Доступна новая версия приложения.")).toBeVisible();

  navigationRequests = 0;
  await page.getByRole("button", { name: "Обновить" }).click();
  await expect(page.locator("#build-marker")).toHaveText("Build B");
  await expect.poll(() => navigationRequests).toBe(1);
  const retainedChunk = await page.evaluate(async () => {
    const response = await fetch("/assets/a-only.js");
    return { ok: response.ok, body: await response.text() };
  });
  expect(retainedChunk).toEqual({ ok: true, body: "globalThis.aOnlyLoaded = true;" });

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("#build-marker")).toHaveText("Build B");
  await expect(page.getByRole("button", { name: /^Учить$/ })).toBeVisible();
  await context.setOffline(false);
});

test("failed B install keeps A active offline and a later valid update remains retryable", async ({
  page,
  context,
}) => {
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

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("#build-marker")).toHaveText("Build A");
  await context.setOffline(false);

  activeBuild = "B";
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration?.update();
  });
  await expect(page.getByText("Доступна новая версия приложения.")).toBeVisible();
});
