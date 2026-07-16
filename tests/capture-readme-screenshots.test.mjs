import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import test from "node:test";
import { promisify } from "node:util";
import { decodeRgbPng, encodeRgbPng, findOpaqueBlackRegion } from "../scripts/png-opaque-black-check.mjs";

const execFileAsync = promisify(execFile);

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
    maxConsecutiveRows: 14
  });
});

test("RGB PNG normalization is deterministic and lossless", () => {
  const source = { width: 2, height: 2, pixels: Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 250, 251, 252]) };
  const first = encodeRgbPng(source);
  const second = encodeRgbPng(source);
  assert.deepEqual(first, second);
  assert.deepEqual(decodeRgbPng(first), source);
});

test("capture helper fails promptly when preview exits before readiness", async () => {
  const startedAt = Date.now();
  await assert.rejects(
    execFileAsync(process.execPath, ["scripts/capture-readme-screenshots.mjs"], {
      cwd: process.cwd(),
      env: { ...process.env, README_SCREENSHOT_FORCE_PREVIEW_EXIT: "1", README_SCREENSHOT_PORT: "4398" },
      timeout: 3_000
    }),
    (error) => {
      assert.equal(error.killed, false);
      assert.match(`${error.stderr}\n${error.message}`, /exited before readiness with code 23/);
      return true;
    }
  );
  assert.ok(Date.now() - startedAt < 3_000, "forced early exit stays bounded by the regression timeout");
});
