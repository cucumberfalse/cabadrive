import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import test from "node:test";
import { promisify } from "node:util";
import {
  decodeRgbPng,
  encodeRgbPng,
  findOpaqueBlackRegion,
} from "../scripts/png-opaque-black-check.mjs";
import { compareBoundedScreenshotPixels } from "../scripts/verify-readme-screenshot-equivalence.mjs";

const execFileAsync = promisify(execFile);
const screenshotPaths = ["learn.png", "materials.png", "about.png"].map(
  (name) => `docs_project/screens/readme/${name}`,
);

function screenshotState() {
  return screenshotPaths.map((path) => ({
    path,
    hash: createHash("sha256").update(readFileSync(path)).digest("hex"),
    mtimeMs: statSync(path).mtimeMs,
  }));
}

test("opaque-black pixel guard rejects a large rectangular capture artifact", () => {
  const width = 160;
  const height = 40;
  const pixels = Buffer.alloc(width * height * 3, 255);
  for (let y = 10; y < 24; y += 1) {
    pixels.fill(0, (y * width + 20) * 3, (y * width + 140) * 3);
  }
  assert.deepEqual(findOpaqueBlackRegion({ width, height, pixels }), {
    found: true,
    maxRunWidth: 120,
    maxConsecutiveRows: 14,
  });
});

test("RGB PNG normalization is deterministic and lossless", () => {
  const source = {
    width: 2,
    height: 2,
    pixels: Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 250, 251, 252]),
  };
  const first = encodeRgbPng(source);
  const second = encodeRgbPng(source);
  assert.deepEqual(first, second);
  assert.deepEqual(decodeRgbPng(first), source);
});

test("bounded screenshot comparison fails closed outside rounded-corner antialias drift", () => {
  const first = { width: 5, height: 5, pixels: Buffer.alloc(5 * 5 * 3, 200) };
  const second = { width: 5, height: 5, pixels: Buffer.from(first.pixels) };
  second.pixels[0] = 201;
  const masks = [{ name: "test rounded corner", x: 0, y: 0, width: 2, height: 2 }];
  assert.deepEqual(compareBoundedScreenshotPixels(first, second, masks), [
    { x: 0, y: 0, delta: [1, 0, 0, 0], mask: "test rounded corner" },
  ]);

  const outside = { ...second, pixels: Buffer.from(second.pixels) };
  outside.pixels[(4 * 5 + 4) * 3] = 201;
  assert.throws(
    () => compareBoundedScreenshotPixels(first, outside, masks),
    /outside declared rounded-corner masks/,
  );

  const tooDark = { ...first, pixels: Buffer.from(first.pixels) };
  tooDark.pixels[0] = 198;
  assert.throws(
    () => compareBoundedScreenshotPixels(first, tooDark, masks),
    /exceeds per-channel delta 1/,
  );
});

test("capture helper fails promptly when preview exits before readiness", async () => {
  const startedAt = Date.now();
  await assert.rejects(
    execFileAsync(process.execPath, ["scripts/capture-readme-screenshots.mjs"], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        README_SCREENSHOT_FORCE_PREVIEW_EXIT: "1",
        README_SCREENSHOT_PORT: "4398",
      },
      timeout: 3_000,
    }),
    (error) => {
      assert.equal(error.killed, false);
      assert.match(`${error.stderr}\n${error.message}`, /exited before readiness with code 23/);
      return true;
    },
  );
  assert.ok(
    Date.now() - startedAt < 3_000,
    "forced early exit stays bounded by the regression timeout",
  );
});

test("capture helper rejects an unrelated HTTP 200 server on the strict port without mutating screenshots", async () => {
  const before = screenshotState();
  const server = createServer((_, response) => {
    response.writeHead(200, { "content-type": "text/plain" });
    response.end("unrelated server");
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  const startedAt = Date.now();
  try {
    await assert.rejects(
      execFileAsync(process.execPath, ["scripts/capture-readme-screenshots.mjs"], {
        cwd: process.cwd(),
        env: { ...process.env, README_SCREENSHOT_PORT: String(port) },
        timeout: 10_000,
      }),
      (error) => {
        assert.equal(error.killed, false);
        assert.doesNotMatch(error.stdout ?? "", /Captured and pixel-checked/);
        assert.match(`${error.stderr}\n${error.message}`, /exited before readiness|already in use/);
        return true;
      },
    );
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
  assert.ok(
    Date.now() - startedAt < 10_000,
    "occupied-port failure stays bounded by the regression timeout",
  );
  assert.deepEqual(screenshotState(), before);
});

test("public screenshot command uses an acyclic SPA build before capture and post-validates attribution", async () => {
  const packageScripts = JSON.parse(readFileSync("package.json", "utf8")).scripts;
  assert.equal(packageScripts["screenshots:readme"], "node scripts/run-readme-screenshots.mjs");
  assert.equal(
    packageScripts["build:app"],
    "pnpm run prepare:assets && vite build && pnpm run generate:sw",
  );
  assert.match(packageScripts.build, /validate:content/);
  assert.match(packageScripts.build, /build:app/);
  assert.match(packageScripts.preflight, /validate:content/);
  assert.match(packageScripts.preflight, /pnpm run build/);
  assert.doesNotMatch(
    packageScripts["build:app"],
    /screenshots:readme|validate:attribution|validate:content/,
  );
  assert.doesNotMatch(packageScripts.build, /screenshots:readme/);
  const before = screenshotState();
  await assert.rejects(
    execFileAsync("pnpm", ["run", "screenshots:readme"], {
      cwd: process.cwd(),
      env: { ...process.env, README_SCREENSHOT_FORCE_BUILD_FAILURE: "1" },
      timeout: 10_000,
    }),
    (error) => {
      assert.equal(error.killed, false);
      assert.doesNotMatch(
        `${error.stdout}\n${error.stderr}`,
        /Captured and pixel-checked|Vite preview/,
      );
      return true;
    },
  );
  assert.deepEqual(screenshotState(), before);
});
