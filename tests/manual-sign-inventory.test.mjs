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

const regulatoryPage185Rows = [
  {
    entryKind: "category-heading",
    spanishLabel: "Reglamentarias",
    russianTranslation: "Регулирующие",
    cropRegion: { x: 132, y: 130, width: 245, height: 36 },
    sourceSheetLabelEvidence: "visible source heading: Reglamentarias"
  },
  {
    entryKind: "category-heading",
    spanishLabel: "De prohibición",
    russianTranslation: "Запрещающие",
    cropRegion: { x: 132, y: 170, width: 165, height: 30 },
    sourceSheetLabelEvidence: "visible source heading: De prohibición"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO AVANZAR",
    russianTranslation: "Проезд запрещен",
    cropRegion: { x: 178, y: 215, width: 72, height: 74 },
    sourceSheetLabelEvidence: "visible source label: NO AVANZAR"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CONTRAMANO",
    russianTranslation: "Встречное направление",
    cropRegion: { x: 264, y: 215, width: 74, height: 74 },
    sourceSheetLabelEvidence: "visible source label: CONTRAMANO"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Automóvil",
    russianTranslation: "Движение автомобилей запрещено",
    cropRegion: { x: 350, y: 215, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Automóvil)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Moto",
    russianTranslation: "Движение мотоциклов запрещено",
    cropRegion: { x: 436, y: 215, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Moto)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Bicicleta",
    russianTranslation: "Движение велосипедов запрещено",
    cropRegion: { x: 520, y: 215, width: 88, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Bicicleta)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Camión",
    russianTranslation: "Движение грузовиков запрещено",
    cropRegion: { x: 177, y: 302, width: 78, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Camión)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Acoplado",
    russianTranslation: "Движение с прицепом запрещено",
    cropRegion: { x: 262, y: 302, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Acoplado)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Peatón",
    russianTranslation: "Движение пешеходов запрещено",
    cropRegion: { x: 349, y: 302, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Peatón)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Carro de tracción animal",
    russianTranslation: "Движение гужевых повозок запрещено",
    cropRegion: { x: 428, y: 302, width: 108, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Carro de tracción animal)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Jinetes",
    russianTranslation: "Движение всадников запрещено",
    cropRegion: { x: 520, y: 302, width: 88, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Jinetes)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Carro a mano",
    russianTranslation: "Движение ручных тележек запрещено",
    cropRegion: { x: 176, y: 390, width: 84, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Carro a mano)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Tractor agrícola",
    russianTranslation: "Движение сельхозтракторов запрещено",
    cropRegion: { x: 260, y: 390, width: 92, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Tractor agrícola)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO GIRAR",
    variant: "Izquierda",
    russianTranslation: "Поворот налево запрещен",
    cropRegion: { x: 351, y: 390, width: 78, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO GIRAR (Izquierda)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO GIRAR",
    variant: "Derecha",
    russianTranslation: "Поворот направо запрещен",
    cropRegion: { x: 436, y: 390, width: 80, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO GIRAR (Derecha)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO GIRAR EN U",
    russianTranslation: "Разворот запрещен",
    cropRegion: { x: 522, y: 390, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO GIRAR EN U"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ADELANTAR",
    russianTranslation: "Обгон запрещен",
    cropRegion: { x: 176, y: 477, width: 82, height: 78 },
    sourceSheetLabelEvidence: "visible source label: NO ADELANTAR"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO RUIDOS MOLESTOS",
    russianTranslation: "Раздражающие шумы запрещены",
    cropRegion: { x: 263, y: 477, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO RUIDOS MOLESTOS"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    russianTranslation: "Стоянка запрещена",
    cropRegion: { x: 351, y: 477, width: 78, height: 78 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Acarreo de infractores - placa horaria superior 1",
    russianTranslation: "Стоянка запрещена, эвакуация нарушителей",
    cropRegion: { x: 436, y: 477, width: 88, height: 125 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Acarreo de infractores - placa horaria superior 1)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Acarreo de infractores - placa horaria superior 2",
    russianTranslation: "Стоянка запрещена, эвакуация нарушителей",
    cropRegion: { x: 520, y: 477, width: 92, height: 125 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Acarreo de infractores - placa horaria superior 2)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Entre discos",
    russianTranslation: "Стоянка запрещена между знаками",
    cropRegion: { x: 176, y: 590, width: 88, height: 88 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Entre discos)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Entre aceras",
    russianTranslation: "Стоянка запрещена между тротуарами",
    cropRegion: { x: 262, y: 590, width: 88, height: 88 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Entre aceras)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Zona de Caudales - flecha derecha",
    russianTranslation: "Стоянка запрещена в зоне инкассации / денежных перевозок",
    cropRegion: { x: 346, y: 590, width: 96, height: 126 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Zona de Caudales - flecha derecha)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Zona de Caudales - flecha izquierda",
    russianTranslation: "Стоянка запрещена в зоне инкассации / денежных перевозок",
    cropRegion: { x: 433, y: 590, width: 96, height: 126 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Zona de Caudales - flecha izquierda)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR NI DETENERSE",
    russianTranslation: "Остановка и стоянка запрещены",
    cropRegion: { x: 518, y: 590, width: 94, height: 88 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR NI DETENERSE"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR NI DETENERSE",
    variant: "Sobre la ciclovía",
    russianTranslation: "Остановка и стоянка на велодорожке запрещены",
    cropRegion: { x: 176, y: 716, width: 96, height: 140 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR NI DETENERSE (Sobre la ciclovía)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CAMBIAR DE CARRIL",
    russianTranslation: "Перестроение запрещено",
    cropRegion: { x: 262, y: 716, width: 86, height: 96 },
    sourceSheetLabelEvidence: "visible source label: NO CAMBIAR DE CARRIL"
  }
];

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

test("regulatory source page 185 visual rows are complete and ordered", () => {
  const inventory = loadInventory();
  const rows = inventory.entries.filter((entry) => entry.sectionId === "app4-signs-regulatory" && entry.sourcePage === 185);

  assert.equal(rows.length, regulatoryPage185Rows.length);
  assert.equal(inventory.summary.entriesBySourcePage["185"], regulatoryPage185Rows.length);
  assert.equal(rows.filter((entry) => entry.entryKind === "category-heading").length, 2);
  assert.equal(rows.filter((entry) => entry.entryKind === "catalog-entry").length, 27);

  rows.forEach((entry, index) => {
    const expected = regulatoryPage185Rows[index];
    assert.equal(entry.sourceOrderWithinPage, index + 1, entry.id);
    assert.equal(entry.entryKind, expected.entryKind, entry.id);
    assert.equal(entry.spanishLabel, expected.spanishLabel, entry.id);
    assert.equal(entry.variant, expected.variant, entry.id);
    assert.equal(entry.russianTranslation, expected.russianTranslation, entry.id);
    assert.deepEqual(entry.cropRegion, expected.cropRegion, entry.id);
    assert.deepEqual(entry.displayRegion, expected.cropRegion, entry.id);
    assert.equal(entry.sourceSheetLabelEvidence, expected.sourceSheetLabelEvidence, entry.id);
    assert.equal(entry.auditStatus, "reconciled-source-visual", entry.id);
    assert.match(entry.sourceRef, /app4-regulatory-page-185-source-card\.visualSourceEntries/u, entry.id);
  });
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
