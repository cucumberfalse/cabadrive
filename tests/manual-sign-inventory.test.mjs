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
  assert.match(output, /Manual sign inventory validation passed: \d+ entries/u);

  const inventory = loadInventory();
  assert.equal(inventory.inventoryStatus, "individual-source-regions");
  assert.equal(inventory.entries.length, inventory.summary.totalEntries);
  assert.ok(inventory.entries.length > 0);

  for (const entry of inventory.entries) {
    assert.equal(entry.renderMode, "source-image-css-clip", entry.id);
    assert.equal(entry.noUpscale, true, entry.id);
    assert.ok(["catalog-entry", "category-heading"].includes(entry.entryKind), `${entry.id} has entryKind`);
    assert.ok(["reconciled-source-visual", "pending-reconciliation"].includes(entry.auditStatus), `${entry.id} has auditStatus`);
    assert.ok(entry.sourceSheetLabelEvidence, `${entry.id} has sourceSheetLabelEvidence`);
    assert.ok(entry.cropRegion, `${entry.id} has cropRegion`);
    assert.ok(entry.cropRegion.width < entry.naturalWidth, `${entry.id} crop width is smaller than source asset`);
    assert.ok(entry.cropRegion.height < entry.naturalHeight, `${entry.id} crop height is smaller than source asset`);
    assert.ok(entry.cropRegion.x + entry.cropRegion.width <= entry.naturalWidth, `${entry.id} crop fits source width`);
    assert.ok(entry.cropRegion.y + entry.cropRegion.height <= entry.naturalHeight, `${entry.id} crop fits source height`);
    assert.deepEqual(entry.displayRegion, entry.cropRegion, `${entry.id} displayRegion matches cropRegion`);
  }
});

test("regulatory and warning visual rows are reconciled while other sections stay visibly pending", () => {
  const inventory = loadInventory();
  const reconciledSections = new Set(["app4-signs-regulatory", "app4-signs-warning"]);
  const regulatoryWarning = inventory.entries.filter((entry) => reconciledSections.has(entry.sectionId));
  const pending = inventory.entries.filter((entry) => !reconciledSections.has(entry.sectionId));

  assert.ok(regulatoryWarning.length > 0, "regulatory/warning explicit visual rows exist");
  assert.ok(pending.length > 0, "non-regulatory/warning pending rows remain visible");

  for (const entry of regulatoryWarning) {
    assert.equal(entry.auditStatus, "reconciled-source-visual", entry.id);
    assert.notEqual(entry.sourceSheetLabelEvidence, "pending visual-source reconciliation", entry.id);
  }

  for (const entry of pending) {
    assert.equal(entry.auditStatus, "pending-reconciliation", entry.id);
    assert.equal(entry.sourceSheetLabelEvidence, "pending visual-source reconciliation", entry.id);
  }
});

test("explicit visual variants required by the rebuild slice exist", () => {
  const inventory = loadInventory();
  const findVariant = (spanishLabel, variant) =>
    inventory.entries.find((entry) => entry.spanishLabel === spanishLabel && entry.variant === variant && entry.auditStatus === "reconciled-source-visual");

  assert.ok(findVariant("CURVA", "En \"S\""), "CURVA (En \"S\") visual variant exists");
  assert.ok(findVariant("PENDIENTE", "Ascendente"), "PENDIENTE (Ascendente) visual variant exists");
  assert.ok(findVariant("ESTRECHAMIENTO", "En una sola mano"), "ESTRECHAMIENTO (En una sola mano) visual variant exists");
  assert.ok(findVariant("CRUZ DE SAN ANDRÉS", "Más de dos vías"), "CRUZ DE SAN ANDRÉS (Más de dos vías) visual variant exists");
  assert.ok(findVariant("PROXIMIDAD DE SEÑAL RESTRICTIVA", "Pare"), "PROXIMIDAD DE SEÑAL RESTRICTIVA (Pare) exists");
  assert.ok(findVariant("PROXIMIDAD DE SEÑAL RESTRICTIVA", "Paso"), "PROXIMIDAD DE SEÑAL RESTRICTIVA (Paso) exists");
  assert.ok(findVariant("PROXIMIDAD DE SEÑAL RESTRICTIVA", "Otra"), "PROXIMIDAD DE SEÑAL RESTRICTIVA (Otra) exists");
});

test("manual sign sections expose individual catalog and NO AVANZAR caption pair", () => {
  const inventory = loadInventory();
  const noAvanzar = inventory.entries.find((entry) => entry.spanishLabel === "NO AVANZAR");
  assert.ok(noAvanzar, "NO AVANZAR entry exists");
  assert.equal(noAvanzar.russianTranslation, "Проезд запрещен");
  assert.equal(noAvanzar.renderMode, "source-image-css-clip");
  assert.equal(noAvanzar.auditStatus, "reconciled-source-visual");

  for (const path of sectionPaths) {
    const source = readFileSync(path, "utf8");
    assert.match(source, /kind:\s*"manual-sign-catalog"/u, `${path} exposes individual catalog block`);
  }

  const appSource = readFileSync(appPath, "utf8");
  assert.match(appSource, /ManualSignCatalogBlockView/u);
  assert.match(appSource, /manualSignEntriesForSection/u);
  assert.match(appSource, /manual-sign-caption/u);
});
