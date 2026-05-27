import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  collectInstallPrecacheAssets,
  generateServiceWorker,
  isManualDynamicChunk,
  shouldInstallPrecacheAsset
} from "../scripts/generate-service-worker.mjs";

function withTempDist(callback) {
  const dist = mkdtempSync(join(tmpdir(), "cabadrive-sw-"));
  try {
    mkdirSync(join(dist, "assets"), { recursive: true });
    mkdirSync(join(dist, "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages"), { recursive: true });
    writeFileSync(join(dist, "index.html"), "<!doctype html>");
    writeFileSync(join(dist, "assets/index-abc123.js"), "console.log('app');");
    writeFileSync(join(dist, "assets/manual4Ruedas-def456.js"), "console.log('manual');");
    writeFileSync(join(dist, "assets/manual4Ruedas-def456.css"), ".manual{}");
    writeFileSync(join(dist, "assets/manifest-xyz789.js"), "console.log('manifest');");
    writeFileSync(join(dist, "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-001.jpg"), "jpeg");
    writeFileSync(join(dist, "sw.js"), "old service worker");
    callback(dist);
  } finally {
    rmSync(dist, { recursive: true, force: true });
  }
}

test("service worker install precache excludes only the dynamic manual corpus chunk", () => {
  withTempDist((dist) => {
    const assets = collectInstallPrecacheAssets(dist);

    assert.equal(isManualDynamicChunk("/assets/manual4Ruedas-def456.js"), true);
    assert.equal(shouldInstallPrecacheAsset("/assets/manual4Ruedas-def456.js"), false);
    assert.equal(shouldInstallPrecacheAsset("/assets/manual4Ruedas-def456.css"), true);
    assert.equal(shouldInstallPrecacheAsset("/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-001.jpg"), true);
    assert.deepEqual(assets, [
      "/",
      "/assets/index-abc123.js",
      "/assets/manifest-xyz789.js",
      "/assets/manual4Ruedas-def456.css",
      "/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-001.jpg",
      "/index.html"
    ]);
  });
});

test("generated service worker keeps runtime GET caching for the manual chunk", () => {
  withTempDist((dist) => {
    const { assets, body } = generateServiceWorker({ dist, timestamp: 12345 });
    const generated = readFileSync(join(dist, "sw.js"), "utf8");

    assert.equal(assets.includes("/assets/manual4Ruedas-def456.js"), false);
    assert.equal(body, generated);
    assert.match(generated, /cache\.addAll\(ASSETS\)/);
    assert.match(generated, /fetch\(event\.request\)/);
    assert.match(generated, /cache\.put\(event\.request, copy\)/);
    assert.doesNotMatch(generated, /\/assets\/manual4Ruedas-def456\.js/);
  });
});
