import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

const inventoryPath = "src/data/manual-signs/app4SignEntries.json";
const scriptPath = "scripts/manual-sign-inventory.mjs";
const appPath = "src/App.tsx";
const sectionPaths = [
  "src/data/manual-sections/app4-signs-regulatory.ts",
  "src/data/manual-sections/app4-signs-warning.ts",
  "src/data/manual-sections/app4-signs-informational.ts",
  "src/data/manual-sections/app4-signs-temporary.ts",
  "src/data/manual-sections/app4-signs-horizontal.ts",
  "src/data/manual-sections/app4-signs-traffic-lights.ts"
];

function loadInventory() {
  return JSON.parse(readFileSync(inventoryPath, "utf8"));
}

test("manual sign inventory validator passes and requires individual CSS-clipped regions", () => {
  const output = execFileSync("node", [scriptPath], { encoding: "utf8" });
  assert.match(output, /Manual sign inventory validation passed: 244 entries/u);

  const inventory = loadInventory();
  assert.equal(inventory.inventoryStatus, "individual-source-regions");
  assert.equal(inventory.entries.length, 244);

  for (const entry of inventory.entries) {
    assert.equal(entry.renderMode, "source-image-css-clip", entry.id);
    assert.equal(entry.noUpscale, true, entry.id);
    assert.ok(entry.cropRegion, `${entry.id} has cropRegion`);
    assert.ok(entry.cropRegion.width < entry.naturalWidth, `${entry.id} crop width is smaller than source asset`);
    assert.ok(entry.cropRegion.height < entry.naturalHeight, `${entry.id} crop height is smaller than source asset`);
    assert.ok(entry.cropRegion.x + entry.cropRegion.width <= entry.naturalWidth, `${entry.id} crop fits source width`);
    assert.ok(entry.cropRegion.y + entry.cropRegion.height <= entry.naturalHeight, `${entry.id} crop fits source height`);
    assert.deepEqual(entry.displayRegion, entry.cropRegion, `${entry.id} displayRegion matches cropRegion`);
  }
});

test("manual sign sections expose individual catalog and NO AVANZAR caption pair", () => {
  const inventory = loadInventory();
  const noAvanzar = inventory.entries.find((entry) => entry.spanishLabel === "NO AVANZAR");
  assert.ok(noAvanzar, "NO AVANZAR entry exists");
  assert.equal(noAvanzar.russianTranslation, "Проезд запрещен");
  assert.equal(noAvanzar.renderMode, "source-image-css-clip");

  for (const path of sectionPaths) {
    const source = readFileSync(path, "utf8");
    assert.match(source, /kind:\s*"manual-sign-catalog"/u, `${path} exposes individual catalog block`);
  }

  const appSource = readFileSync(appPath, "utf8");
  assert.match(appSource, /ManualSignCatalogBlockView/u);
  assert.match(appSource, /manualSignEntriesForSection/u);
  assert.match(appSource, /manual-sign-caption/u);
});
