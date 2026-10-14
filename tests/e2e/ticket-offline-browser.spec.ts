import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";

type Variant = { width: number; height: number; format: string; path: string; sha256: string };
const manifest = JSON.parse(readFileSync("content/image-derivatives.manifest.json", "utf8")) as {
  sources: { class: string; variants: Variant[] }[];
};

for (const dpr of [1, 2])
  test(`DPR${dpr}: a new worker decodes all unvisited mobile/desktop codecs through retained JPEG maps`, async ({
    browser,
  }, testInfo) => {
    test.setTimeout(90_000);
    const sources = manifest.sources.filter((source) => source.class === "c").slice(0, 2);
    const widths = [480, 800, 1240];
    const variants = sources.map((source) =>
      source.variants.filter((variant) => widths.includes(variant.width)),
    );
    const modern = variants.flat().filter((variant) => variant.format !== "jpeg");
    const jpeg = variants.flat().filter((variant) => variant.format === "jpeg");
    let version = 0;
    let modernRequests = 0;
    const workers = variants.map((release, index) =>
      execFileSync(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          'import { createServiceWorkerBody } from "./scripts/generate-service-worker.mjs"; process.stdout.write(createServiceWorkerBody(JSON.parse(process.argv[1]), process.argv[2], JSON.parse(process.argv[3])));',
          JSON.stringify([
            "/",
            ...release
              .filter((variant) => variant.format === "jpeg")
              .map((variant) => `/${variant.path}`),
          ]),
          `ticket-browser-${index}-${Date.now()}`,
          JSON.stringify(
            Object.fromEntries(
              release
                .filter((variant) => variant.format !== "jpeg")
                .map((variant) => [
                  `/${variant.path}`,
                  `/${release.find((item) => item.width === variant.width && item.format === "jpeg")!.path}`,
                ]),
            ),
          ),
        ],
        { encoding: "utf8" },
      ),
    );
    const server = createServer((request, response) => {
      const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
      if (pathname === "/sw.js") {
        response.writeHead(200, { "content-type": "text/javascript", "cache-control": "no-store" });
        response.end(workers[version]);
      } else if (pathname === "/") {
        response.writeHead(200, { "content-type": "text/html" });
        response.end("<!doctype html><title>Real ticket offline decode</title><body></body>");
      } else {
        const variant = [...modern, ...jpeg].find((item) => `/${item.path}` === pathname);
        if (!variant) {
          response.writeHead(404);
          response.end("missing");
          return;
        }
        if (variant.format !== "jpeg") modernRequests++;
        response.writeHead(200, {
          "content-type": `image/${variant.format === "jpeg" ? "jpeg" : variant.format}`,
          "cache-control": "public,max-age=31536000,immutable",
        });
        response.end(
          readFileSync(join("content/assets-derived", variant.path.slice("content/".length))),
        );
      }
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string")
      throw new Error("offline test server did not bind");
    const context = await browser.newContext({
      viewport: { width: 390, height: 900 },
      deviceScaleFactor: dpr,
    });
    try {
      const oldTab = await context.newPage();
      await oldTab.goto(`http://127.0.0.1:${address.port}`);
      await oldTab.evaluate(async () => {
        await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;
      });
      await expect
        .poll(() => oldTab.evaluate(() => Boolean(navigator.serviceWorker.controller)))
        .toBe(true);
      version = 1;
      const newTab = await context.newPage();
      await newTab.goto(`http://127.0.0.1:${address.port}`);
      await newTab.evaluate(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        await registration!.update();
      });
      await expect
        .poll(() =>
          newTab.evaluate(async () =>
            Boolean((await navigator.serviceWorker.getRegistration())?.waiting),
          ),
        )
        .toBe(true);
      const before = await oldTab.evaluate(() => navigator.serviceWorker.controller!.scriptURL);
      await newTab.evaluate(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        await new Promise<void>((resolve) => {
          navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), {
            once: true,
          });
          registration!.waiting!.postMessage({ type: "SKIP_WAITING" });
        });
      });
      expect(before).toContain("/sw.js");
      expect(modernRequests).toBe(0);
      const cachedModern = await oldTab.evaluate(
        async (paths) => Promise.all(paths.map(async (path) => Boolean(await caches.match(path)))),
        modern.map((variant) => `/${variant.path}`),
      );
      expect(cachedModern).toEqual(modern.map(() => false));
      await context.setOffline(true);
      const evidence = await oldTab.evaluate(async (variants) => {
        const results = [];
        for (const variant of variants) {
          const image = new Image();
          image.src = `/${variant.path}`;
          document.body.append(image);
          await image.decode();
          const response = await fetch(image.src);
          const bytes = await response.arrayBuffer();
          const hash = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("");
          results.push({
            path: variant.path,
            width: image.naturalWidth,
            height: image.naturalHeight,
            status: response.status,
            mime: response.headers.get("content-type"),
            hash,
          });
        }
        return results;
      }, variants.flat());
      for (const actual of evidence) {
        const release = variants.find((items) =>
          items.some((variant) => variant.path === actual.path),
        )!;
        const requested = release.find((variant) => variant.path === actual.path)!;
        const fallback = release.find(
          (variant) => variant.width === requested.width && variant.format === "jpeg",
        )!;
        expect(actual.width).toBe(fallback.width);
        expect(actual.height).toBe(fallback.height);
        expect(actual.status).toBe(200);
        expect(actual.mime).toBe("image/jpeg");
        expect(actual.hash).toBe(fallback.sha256);
      }
      expect(modernRequests).toBe(0);
      const responsive = [];
      for (const slot of [304, 618]) {
        await oldTab.setViewportSize({ width: slot === 304 ? 390 : 1280, height: 900 });
        const selected = await oldTab.evaluate(
          async ({ releases, slot }) => {
            const results = [];
            for (const release of releases) {
              const picture = document.createElement("picture");
              for (const format of ["avif", "webp"]) {
                const source = document.createElement("source");
                source.type = `image/${format}`;
                source.sizes = `${slot}px`;
                source.srcset = release
                  .filter((variant) => variant.format === format)
                  .map((variant) => `/${variant.path} ${variant.width}w`)
                  .join(", ");
                picture.append(source);
              }
              const image = new Image();
              image.sizes = `${slot}px`;
              image.srcset = release
                .filter((variant) => variant.format === "jpeg")
                .map((variant) => `/${variant.path} ${variant.width}w`)
                .join(", ");
              image.src = `/${release.find((variant) => variant.format === "jpeg")!.path}`;
              image.style.width = `${slot}px`;
              picture.append(image);
              document.body.append(picture);
              await image.decode();
              const response = await fetch(image.currentSrc);
              const bitmap = await createImageBitmap(await response.blob());
              results.push({
                slot: image.getBoundingClientRect().width,
                dpr: devicePixelRatio,
                currentSrc: new URL(image.currentSrc).pathname.slice(1),
                encodedWidth: bitmap.width,
                mime: response.headers.get("content-type"),
              });
              bitmap.close();
            }
            return results;
          },
          { releases: variants, slot },
        );
        for (const actual of selected) {
          expect(actual.slot).toBe(slot);
          expect(actual.dpr).toBe(dpr);
          expect(actual.mime).toBe("image/jpeg");
          expect(actual.currentSrc).toMatch(/\.avif$/);
          expect(actual.encodedWidth).toBe(
            slot === 304 ? (dpr === 1 ? 480 : 800) : dpr === 1 ? 800 : 1240,
          );
        }
        responsive.push(...selected);
      }
      const unknownFailed = await oldTab.evaluate(async () => {
        try {
          await fetch("/content/img/c/unknown-1240.00000000.avif");
          return false;
        } catch {
          return true;
        }
      });
      expect(unknownFailed).toBe(true);
      await testInfo.attach("two-worker-real-ticket-decode.json", {
        body: JSON.stringify(
          {
            dpr,
            cachedModern,
            evidence,
            responsive,
            modernRequests,
            unknownFailed,
            oldBytes: createHash("sha256")
              .update(
                readFileSync(join("content/assets-derived", jpeg[0].path.slice("content/".length))),
              )
              .digest("hex"),
          },
          null,
          2,
        ),
        contentType: "application/json",
      });
      await oldTab.screenshot({ path: testInfo.outputPath("unvisited-offline-old-current.png") });
    } finally {
      await context.close();
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });
