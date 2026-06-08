import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const repoRoot = process.cwd();
const inventoryPath = "src/data/manual-signs/app4SignEntries.json";
const manualId = "gcba-manual-vehiculo-4-ruedas-2023";
const sourceDocument =
  "content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf";
const renderMode = "source-image-css-clip";
const feature037Id = "037-manual-sign-crop-resolution";
const feature037FinalRowsPath = "specs/037-manual-sign-crop-resolution/evidence/final/manual-sign-crop-resolution-rows.json";
const feature037FinalSummaryPath = "specs/037-manual-sign-crop-resolution/evidence/final/manual-sign-crop-resolution-summary.json";
const feature037SourceManifestPath = "specs/037-manual-sign-crop-resolution/evidence/source-evaluation/source-manifest.json";
const feature037RowSourceMappingPath = "specs/037-manual-sign-crop-resolution/evidence/source-evaluation/row-source-mapping.json";
const scopePages = Array.from({ length: 13 }, (_, index) => 185 + index);
const validSectionPages = new Map([
  ["app4-signs-regulatory", [185, 186]],
  ["app4-signs-warning", [187, 188]],
  ["app4-signs-informational", [189, 190, 191, 192]],
  ["app4-signs-temporary", [193, 194]],
  ["app4-signs-horizontal", [195, 196]],
  ["app4-signs-traffic-lights", [197]]
]);

const sourceSections = [
  {
    sectionId: "app4-signs-regulatory",
    sectionFile: "src/data/manual-sections/app4-signs-regulatory.ts",
    includeCardIds: new Set([
      "app4-regulatory-page-185-source-card",
      "app4-regulatory-page-186-source-card"
    ]),
    sourceSelectionNote:
      "Uses existing official CABA Appendix IV regulatory source-sheet crops with explicit visual-source rows for the current reconciliation slice."
  },
  {
    sectionId: "app4-signs-warning",
    sectionFile: "src/data/manual-sections/app4-signs-warning.ts",
    includeCardIdPattern: /^app4-warning-page-\d+-source-card$/u,
    sourceSelectionNote:
      "Uses existing official CABA Appendix IV warning source-sheet crops with explicit visual-source rows for pages 187-188."
  },
  {
    sectionId: "app4-signs-informational",
    sectionFile: "src/data/manual-sections/app4-signs-informational.ts",
    includeCardIdPattern: /^app4-informational-page-\d+-source-card$/u,
    sourceSelectionNote:
      "Uses existing official CABA Appendix IV source-sheet crops as placeholders until individual informational crops are produced."
  },
  {
    sectionId: "app4-signs-temporary",
    sectionFile: "src/data/manual-sections/app4-signs-temporary.ts",
    includeCardIdPattern: /^app4-temporary-page-\d+-source-card$/u,
    sourceSelectionNote:
      "Uses existing official CABA Appendix IV source-sheet crops as placeholders until individual temporary sign/device crops are produced."
  },
  {
    sectionId: "app4-signs-horizontal",
    sectionFile: "src/data/manual-sections/app4-signs-horizontal.ts",
    includeCardIdPattern: /^app4-horizontal-page-\d+-source-card$/u,
    sourceSelectionNote:
      "Uses existing official CABA Appendix IV road-marking sheet crops with explicit per-term CSS clip regions verified for pages 195-196."
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sectionFile: "src/data/manual-sections/app4-signs-traffic-lights.ts",
    includeCardIdPattern: /^app4-traffic-lights-page-197-source-card$/u,
    sourceSelectionNote:
      "Uses the existing official page 197 traffic-light/signal sheet crop as a placeholder until individual signal crops are produced."
  }
];

const cardGridConfigs = new Map([
  ["app4-regulatory-anexo-panel-01-source-card", { columns: 3, rows: 4, bounds: { x: 62, y: 84, width: 505, height: 642 } }],
  ["app4-regulatory-anexo-panel-02-source-card", { columns: 3, rows: 5, bounds: { x: 76, y: 32, width: 494, height: 690 } }],
  ["app4-regulatory-anexo-panel-03-source-card", { columns: 3, rows: 5, bounds: { x: 76, y: 36, width: 500, height: 695 } }],
  ["app4-regulatory-anexo-panel-04-source-card", { columns: 3, rows: 4, bounds: { x: 76, y: 36, width: 500, height: 642 } }],
  ["app4-warning-page-187-source-card", { columns: 5, rows: 5, bounds: { x: 112, y: 186, width: 522, height: 684 } }],
  ["app4-warning-page-188-source-card", { columns: 5, rows: 4, bounds: { x: 78, y: 124, width: 584, height: 694 } }],
  ["app4-informational-page-189-source-card", { columns: 5, rows: 3, bounds: { x: 110, y: 188, width: 548, height: 668 } }],
  ["app4-informational-page-190-source-card", { columns: 5, rows: 4, bounds: { x: 78, y: 146, width: 584, height: 682 } }],
  ["app4-informational-page-191-source-card", { columns: 5, rows: 5, bounds: { x: 118, y: 144, width: 512, height: 704 } }],
  ["app4-informational-page-192-source-card", { columns: 1, rows: 5, bounds: { x: 78, y: 130, width: 584, height: 720 } }],
  ["app4-temporary-page-193-source-card", { columns: 5, rows: 5, bounds: { x: 130, y: 190, width: 500, height: 610 } }],
  ["app4-temporary-page-194-source-card", { columns: 5, rows: 5, bounds: { x: 98, y: 160, width: 555, height: 688 } }],
  ["app4-horizontal-page-195-source-card", { columns: 2, rows: 8, bounds: { x: 130, y: 184, width: 500, height: 660 } }],
  ["app4-horizontal-page-196-source-card", { columns: 2, rows: 7, bounds: { x: 110, y: 156, width: 518, height: 682 } }],
  ["app4-traffic-lights-page-197-source-card", { columns: 2, rows: 7, bounds: { x: 130, y: 206, width: 520, height: 650 } }]
]);

const manualCropRegionsByCard = new Map([
  [
    "app4-horizontal-page-195-source-card",
    [
      { x: 95, y: 95, width: 220, height: 55 },
      { x: 95, y: 140, width: 260, height: 45 },
      { x: 165, y: 185, width: 190, height: 90 },
      { x: 390, y: 185, width: 205, height: 90 },
      { x: 160, y: 270, width: 205, height: 95 },
      { x: 390, y: 285, width: 205, height: 95 },
      { x: 160, y: 370, width: 205, height: 95 },
      { x: 390, y: 385, width: 210, height: 90 },
      { x: 390, y: 480, width: 210, height: 75 },
      { x: 95, y: 520, width: 280, height: 55 },
      { x: 165, y: 575, width: 180, height: 85 },
      { x: 390, y: 575, width: 210, height: 85 },
      { x: 165, y: 655, width: 190, height: 100 },
      { x: 385, y: 655, width: 220, height: 100 },
      { x: 155, y: 740, width: 220, height: 100 }
    ]
  ],
  [
    "app4-horizontal-page-196-source-card",
    [
      { x: 75, y: 120, width: 250, height: 55 },
      { x: 335, y: 170, width: 230, height: 100 },
      { x: 110, y: 175, width: 240, height: 170 },
      { x: 330, y: 265, width: 235, height: 95 },
      { x: 125, y: 355, width: 205, height: 90 },
      { x: 330, y: 355, width: 235, height: 100 },
      { x: 125, y: 455, width: 205, height: 135 },
      { x: 335, y: 455, width: 225, height: 75 },
      { x: 125, y: 545, width: 225, height: 95 },
      { x: 120, y: 595, width: 235, height: 105 },
      { x: 335, y: 540, width: 235, height: 95 },
      { x: 330, y: 635, width: 240, height: 120 },
      { x: 125, y: 720, width: 240, height: 110 },
      { x: 330, y: 755, width: 240, height: 95 }
    ]
  ]
]);

const visualSourceEntries = [
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "category-heading",
    spanishLabel: "Reglamentarias",
    russianTranslation: "Регулирующие",
    cropRegion: { x: 132, y: 130, width: 245, height: 36 },
    sourceSheetLabelEvidence: "visible source heading: Reglamentarias",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "category-heading",
    spanishLabel: "De prohibición",
    russianTranslation: "Запрещающие",
    cropRegion: { x: 132, y: 170, width: 165, height: 30 },
    sourceSheetLabelEvidence: "visible source heading: De prohibición",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO AVANZAR",
    russianTranslation: "Проезд запрещен",
    cropRegion: { x: 178, y: 215, width: 72, height: 74 },
    sourceSheetLabelEvidence: "visible source label: NO AVANZAR",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CONTRAMANO",
    russianTranslation: "Встречное направление",
    cropRegion: { x: 264, y: 215, width: 74, height: 74 },
    sourceSheetLabelEvidence: "visible source label: CONTRAMANO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Automóvil",
    russianTranslation: "Движение автомобилей запрещено",
    cropRegion: { x: 350, y: 215, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Automóvil)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Moto",
    russianTranslation: "Движение мотоциклов запрещено",
    cropRegion: { x: 436, y: 215, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Moto)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Bicicleta",
    russianTranslation: "Движение велосипедов запрещено",
    cropRegion: { x: 520, y: 215, width: 88, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Bicicleta)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Camión",
    russianTranslation: "Движение грузовиков запрещено",
    cropRegion: { x: 177, y: 302, width: 78, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Camión)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Acoplado",
    russianTranslation: "Движение с прицепом запрещено",
    cropRegion: { x: 262, y: 302, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Acoplado)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Peatón",
    russianTranslation: "Движение пешеходов запрещено",
    cropRegion: { x: 349, y: 302, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Peatón)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Carro de tracción animal",
    russianTranslation: "Движение гужевых повозок запрещено",
    cropRegion: { x: 428, y: 302, width: 108, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Carro de tracción animal)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Jinetes",
    russianTranslation: "Движение всадников запрещено",
    cropRegion: { x: 520, y: 302, width: 88, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Jinetes)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Carro a mano",
    russianTranslation: "Движение ручных тележек запрещено",
    cropRegion: { x: 176, y: 390, width: 84, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Carro a mano)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Tractor agrícola",
    russianTranslation: "Движение сельхозтракторов запрещено",
    cropRegion: { x: 260, y: 390, width: 92, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Tractor agrícola)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO GIRAR",
    variant: "Izquierda",
    russianTranslation: "Поворот налево запрещен",
    cropRegion: { x: 351, y: 390, width: 78, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO GIRAR (Izquierda)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO GIRAR",
    variant: "Derecha",
    russianTranslation: "Поворот направо запрещен",
    cropRegion: { x: 436, y: 390, width: 80, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO GIRAR (Derecha)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO GIRAR EN U",
    russianTranslation: "Разворот запрещен",
    cropRegion: { x: 522, y: 390, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO GIRAR EN U",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO ADELANTAR",
    russianTranslation: "Обгон запрещен",
    cropRegion: { x: 176, y: 477, width: 82, height: 78 },
    sourceSheetLabelEvidence: "visible source label: NO ADELANTAR",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO RUIDOS MOLESTOS",
    russianTranslation: "Раздражающие шумы запрещены",
    cropRegion: { x: 263, y: 477, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO RUIDOS MOLESTOS",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    russianTranslation: "Стоянка запрещена",
    cropRegion: { x: 351, y: 477, width: 78, height: 78 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Acarreo de infractores - placa horaria superior 1",
    russianTranslation: "Стоянка запрещена, эвакуация нарушителей",
    cropRegion: { x: 436, y: 477, width: 88, height: 125 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Acarreo de infractores - placa horaria superior 1)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Acarreo de infractores - placa horaria superior 2",
    russianTranslation: "Стоянка запрещена, эвакуация нарушителей",
    cropRegion: { x: 520, y: 477, width: 92, height: 125 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Acarreo de infractores - placa horaria superior 2)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Entre discos",
    russianTranslation: "Стоянка запрещена между знаками",
    cropRegion: { x: 176, y: 590, width: 88, height: 88 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Entre discos)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Entre aceras",
    russianTranslation: "Стоянка запрещена между тротуарами",
    cropRegion: { x: 262, y: 590, width: 88, height: 88 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Entre aceras)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Zona de Caudales - flecha derecha",
    russianTranslation: "Стоянка запрещена в зоне инкассации / денежных перевозок",
    cropRegion: { x: 346, y: 590, width: 96, height: 126 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Zona de Caudales - flecha derecha)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Zona de Caudales - flecha izquierda",
    russianTranslation: "Стоянка запрещена в зоне инкассации / денежных перевозок",
    cropRegion: { x: 433, y: 590, width: 96, height: 126 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Zona de Caudales - flecha izquierda)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR NI DETENERSE",
    russianTranslation: "Остановка и стоянка запрещены",
    cropRegion: { x: 518, y: 590, width: 94, height: 88 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR NI DETENERSE",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR NI DETENERSE",
    variant: "Sobre la ciclovía",
    russianTranslation: "Остановка и стоянка на велодорожке запрещены",
    cropRegion: { x: 176, y: 716, width: 96, height: 140 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR NI DETENERSE (Sobre la ciclovía)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 185,
    sourceCardId: "app4-regulatory-page-185-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NO CAMBIAR DE CARRIL",
    russianTranslation: "Перестроение запрещено",
    cropRegion: { x: 262, y: 716, width: 86, height: 96 },
    sourceSheetLabelEvidence: "visible source label: NO CAMBIAR DE CARRIL",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "category-heading",
    spanishLabel: "De restricción",
    russianTranslation: "Ограничительные",
    cropRegion: { x: 78, y: 132, width: 180, height: 34 },
    sourceSheetLabelEvidence: "visible source heading: De restricción",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "LIMITACIÓN DE PESO",
    russianTranslation: "Ограничение массы",
    cropRegion: { x: 126, y: 165, width: 66, height: 78 },
    sourceSheetLabelEvidence: "visible source label: LIMITACIÓN DE PESO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "LIMITACIÓN DE PESO POR EJE",
    russianTranslation: "Ограничение нагрузки на ось",
    cropRegion: { x: 210, y: 165, width: 82, height: 78 },
    sourceSheetLabelEvidence: "visible source label: LIMITACIÓN DE PESO POR EJE",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "LIMITACIÓN DE ALTURA",
    russianTranslation: "Ограничение высоты",
    cropRegion: { x: 292, y: 165, width: 86, height: 78 },
    sourceSheetLabelEvidence: "visible source label: LIMITACIÓN DE ALTURA",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "LIMITACIÓN DE ANCHO",
    russianTranslation: "Ограничение ширины",
    cropRegion: { x: 384, y: 165, width: 72, height: 78 },
    sourceSheetLabelEvidence: "visible source label: LIMITACIÓN DE ANCHO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "LIMITACIÓN DE LARGO DE VEHÍCULO",
    russianTranslation: "Ограничение длины транспортного средства",
    cropRegion: { x: 458, y: 165, width: 108, height: 78 },
    sourceSheetLabelEvidence: "visible source label: LIMITACIÓN DE LARGO DE VEHÍCULO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "LÍMITE DE VELOCIDAD MÁXIMA",
    russianTranslation: "Максимальная скорость",
    cropRegion: { x: 112, y: 250, width: 106, height: 86 },
    sourceSheetLabelEvidence: "visible source label: LÍMITE DE VELOCIDAD MÁXIMA",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "LÍMITE DE VELOCIDAD MÍNIMA",
    russianTranslation: "Минимальная скорость",
    cropRegion: { x: 208, y: 250, width: 88, height: 86 },
    sourceSheetLabelEvidence: "visible source label: LÍMITE DE VELOCIDAD MÍNIMA",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ESTACIONAMIENTO EXCLUSIVO",
    russianTranslation: "Зарезервированная стоянка",
    cropRegion: { x: 290, y: 250, width: 90, height: 86 },
    sourceSheetLabelEvidence: "visible source label: ESTACIONAMIENTO EXCLUSIVO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ESTACIONAMIENTO EXCLUSIVO",
    variant: "Cajón azul",
    russianTranslation: "Зарезервированное синее место",
    cropRegion: { x: 372, y: 250, width: 92, height: 150 },
    sourceSheetLabelEvidence: "visible source label: ESTACIONAMIENTO EXCLUSIVO (Cajón azul)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ESTACIONAMIENTO EXCLUSIVO",
    variant: "Discapacitados",
    russianTranslation: "Стоянка для людей с инвалидностью",
    cropRegion: { x: 458, y: 250, width: 104, height: 150 },
    sourceSheetLabelEvidence: "visible source label: ESTACIONAMIENTO EXCLUSIVO (Discapacitados)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CIRCULACIÓN EXCLUSIVA",
    variant: "Transporte público",
    russianTranslation: "Движение только общественного транспорта",
    cropRegion: { x: 112, y: 371, width: 106, height: 104 },
    sourceSheetLabelEvidence: "visible source label: CIRCULACIÓN EXCLUSIVA (Transporte público)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CIRCULACIÓN EXCLUSIVA",
    variant: "Moto",
    russianTranslation: "Движение только мотоциклов",
    cropRegion: { x: 206, y: 371, width: 90, height: 104 },
    sourceSheetLabelEvidence: "visible source label: CIRCULACIÓN EXCLUSIVA (Moto)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CIRCULACIÓN EXCLUSIVA",
    variant: "Bicicleta",
    russianTranslation: "Движение только велосипедов",
    cropRegion: { x: 290, y: 371, width: 92, height: 104 },
    sourceSheetLabelEvidence: "visible source label: CIRCULACIÓN EXCLUSIVA (Bicicleta)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CIRCULACIÓN EXCLUSIVA",
    variant: "Jinetes",
    russianTranslation: "Движение только всадников",
    cropRegion: { x: 376, y: 371, width: 92, height: 104 },
    sourceSheetLabelEvidence: "visible source label: CIRCULACIÓN EXCLUSIVA (Jinetes)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CIRCULACIÓN EXCLUSIVA",
    variant: "Peatones",
    russianTranslation: "Движение только пешеходов",
    cropRegion: { x: 462, y: 371, width: 92, height: 104 },
    sourceSheetLabelEvidence: "visible source label: CIRCULACIÓN EXCLUSIVA (Peatones)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CIRCULACIÓN EXCLUSIVA",
    variant: "Convivencia",
    russianTranslation: "Движение только в зоне совместного пользования",
    cropRegion: { x: 120, y: 478, width: 98, height: 104 },
    sourceSheetLabelEvidence: "visible source label: CIRCULACIÓN EXCLUSIVA (Convivencia)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "USO DE CADENAS PARA NIEVE",
    russianTranslation: "Использование цепей для снега",
    cropRegion: { x: 206, y: 478, width: 94, height: 92 },
    sourceSheetLabelEvidence: "visible source label: USO DE CADENAS PARA NIEVE",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "GIRO OBLIGATORIO",
    variant: "Derecha",
    russianTranslation: "Обязательный поворот направо",
    cropRegion: { x: 292, y: 478, width: 92, height: 92 },
    sourceSheetLabelEvidence: "visible source label: GIRO OBLIGATORIO (Derecha)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "GIRO OBLIGATORIO",
    variant: "Izquierda",
    russianTranslation: "Обязательный поворот налево",
    cropRegion: { x: 382, y: 478, width: 92, height: 92 },
    sourceSheetLabelEvidence: "visible source label: GIRO OBLIGATORIO (Izquierda)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "SENTIDO DE CIRCULACIÓN",
    variant: "Derecha",
    russianTranslation: "Направление движения направо",
    cropRegion: { x: 462, y: 478, width: 102, height: 112 },
    sourceSheetLabelEvidence: "visible source label: SENTIDO DE CIRCULACIÓN (Derecha)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "category-heading",
    spanishLabel: "De prioridad",
    russianTranslation: "Приоритет",
    cropRegion: { x: 78, y: 548, width: 180, height: 34 },
    sourceSheetLabelEvidence: "visible source heading: De prioridad",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PARE",
    russianTranslation: "Стоп",
    cropRegion: { x: 122, y: 590, width: 72, height: 82 },
    sourceSheetLabelEvidence: "visible source label: PARE",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CEDA EL PASO",
    russianTranslation: "Уступите дорогу",
    cropRegion: { x: 208, y: 590, width: 82, height: 78 },
    sourceSheetLabelEvidence: "visible source label: CEDA EL PASO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CEDA EL PASO",
    variant: "A ciclistas y peatones",
    russianTranslation: "Уступите велосипедистам и пешеходам",
    cropRegion: { x: 288, y: 590, width: 102, height: 124 },
    sourceSheetLabelEvidence: "visible source label: CEDA EL PASO (A ciclistas y peatones)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PREFERENCIA DE AVANCE",
    russianTranslation: "Преимущество встречного разъезда",
    cropRegion: { x: 382, y: 590, width: 86, height: 84 },
    sourceSheetLabelEvidence: "visible source label: PREFERENCIA DE AVANCE",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "DESCIENDA DE LA BICICLETA",
    russianTranslation: "Сойдите с велосипеда",
    cropRegion: { x: 462, y: 590, width: 104, height: 118 },
    sourceSheetLabelEvidence: "visible source label: DESCIENDA DE LA BICICLETA",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "BARRERAS FERROVIARIAS",
    russianTranslation: "Железнодорожные шлагбаумы",
    cropRegion: { x: 124, y: 704, width: 96, height: 108 },
    sourceSheetLabelEvidence: "visible source label: BARRERAS FERROVIARIAS",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "category-heading",
    spanishLabel: "De fin de prescripción",
    russianTranslation: "Конец действия предписания",
    cropRegion: { x: 78, y: 782, width: 278, height: 38 },
    sourceSheetLabelEvidence: "visible source heading: De fin de prescripción",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "FIN DE LA PRESCRIPCIÓN",
    variant: "genérico",
    russianTranslation: "Конец действия предписания",
    cropRegion: { x: 124, y: 812, width: 82, height: 100 },
    sourceSheetLabelEvidence: "visible source label: FIN DE LA PRESCRIPCIÓN (genérico)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "FIN DE LA PRESCRIPCIÓN",
    variant: "velocidad mínima 35",
    russianTranslation: "Конец действия предписания",
    cropRegion: { x: 210, y: 812, width: 82, height: 100 },
    sourceSheetLabelEvidence: "visible source label: FIN DE LA PRESCRIPCIÓN (velocidad mínima 35)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "category-heading",
    spanishLabel: "Preventivas",
    russianTranslation: "Предупреждающие",
    cropRegion: { x: 132, y: 132, width: 165, height: 31 },
    sourceSheetLabelEvidence: "visible source heading: Preventivas",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "category-heading",
    spanishLabel: "Advertencias sobre características de la vía",
    russianTranslation: "Предупреждения об особенностях дороги",
    cropRegion: { x: 132, y: 171, width: 500, height: 30 },
    sourceSheetLabelEvidence: "visible source heading: Advertencias sobre características de la vía",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CURVA",
    variant: "Común y pronunciada",
    russianTranslation: "Опасный поворот",
    cropRegion: { x: 176, y: 198, width: 75, height: 88 },
    sourceSheetLabelEvidence: "visible source label: CURVA (Común y pronunciada)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CURVA",
    variant: "Contracurva",
    russianTranslation: "Обратный / следующий поворот",
    cropRegion: { x: 263, y: 198, width: 75, height: 88 },
    sourceSheetLabelEvidence: "visible source label: CURVA (Contracurva)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CURVA",
    variant: "En \"S\"",
    russianTranslation: "S-образный поворот",
    cropRegion: { x: 349, y: 198, width: 75, height: 88 },
    sourceSheetLabelEvidence: "visible source label: CURVA (En \"S\")",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CAMINO SINUOSO",
    russianTranslation: "Извилистая дорога",
    cropRegion: { x: 434, y: 198, width: 75, height: 88 },
    sourceSheetLabelEvidence: "visible source label: CAMINO SINUOSO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PENDIENTE",
    variant: "Descendente",
    russianTranslation: "Спуск",
    cropRegion: { x: 520, y: 198, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: PENDIENTE (Descendente)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PENDIENTE",
    variant: "Ascendente",
    russianTranslation: "Подъем",
    cropRegion: { x: 176, y: 309, width: 78, height: 91 },
    sourceSheetLabelEvidence: "visible source label: PENDIENTE (Ascendente)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ESTRECHAMIENTO",
    variant: "Ambas manos",
    russianTranslation: "Сужение с обеих сторон",
    cropRegion: { x: 263, y: 309, width: 79, height: 92 },
    sourceSheetLabelEvidence: "visible source label: ESTRECHAMIENTO (Ambas manos)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ESTRECHAMIENTO",
    variant: "En una sola mano",
    russianTranslation: "Сужение с одной стороны",
    cropRegion: { x: 349, y: 309, width: 82, height: 92 },
    sourceSheetLabelEvidence: "visible source label: ESTRECHAMIENTO (En una sola mano)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PERFIL IRREGULAR",
    variant: "Irregular",
    russianTranslation: "Неровная дорога",
    cropRegion: { x: 434, y: 309, width: 82, height: 92 },
    sourceSheetLabelEvidence: "visible source label: PERFIL IRREGULAR (Irregular)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PERFIL IRREGULAR",
    variant: "Badén",
    russianTranslation: "Впадина / понижение дороги",
    cropRegion: { x: 520, y: 309, width: 83, height: 92 },
    sourceSheetLabelEvidence: "visible source label: PERFIL IRREGULAR (Badén)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PERFIL IRREGULAR",
    variant: "Lomada",
    russianTranslation: "Возвышение / бугор",
    cropRegion: { x: 176, y: 420, width: 82, height: 87 },
    sourceSheetLabelEvidence: "visible source label: PERFIL IRREGULAR (Lomada)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CALZADA RESBALADIZA",
    russianTranslation: "Скользкая дорога",
    cropRegion: { x: 263, y: 420, width: 78, height: 87 },
    sourceSheetLabelEvidence: "visible source label: CALZADA RESBALADIZA",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PROYECCIÓN DE PIEDRAS",
    russianTranslation: "Выброс камней",
    cropRegion: { x: 349, y: 420, width: 82, height: 87 },
    sourceSheetLabelEvidence: "visible source label: PROYECCIÓN DE PIEDRAS",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "DERRUMBES",
    russianTranslation: "Обвалы",
    cropRegion: { x: 436, y: 420, width: 78, height: 87 },
    sourceSheetLabelEvidence: "visible source label: DERRUMBES",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "TÚNEL",
    russianTranslation: "Туннель",
    cropRegion: { x: 520, y: 420, width: 78, height: 87 },
    sourceSheetLabelEvidence: "visible source label: TÚNEL",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PUENTE ANGOSTO",
    russianTranslation: "Узкий мост",
    cropRegion: { x: 176, y: 528, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: PUENTE ANGOSTO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PUENTE MÓVIL",
    russianTranslation: "Разводной мост",
    cropRegion: { x: 263, y: 528, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: PUENTE MÓVIL",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ALTURA LIMITADA",
    russianTranslation: "Ограничение высоты",
    cropRegion: { x: 350, y: 527, width: 78, height: 89 },
    sourceSheetLabelEvidence: "visible source label: ALTURA LIMITADA",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ANCHO LIMITADO",
    russianTranslation: "Ограничение ширины",
    cropRegion: { x: 436, y: 527, width: 78, height: 89 },
    sourceSheetLabelEvidence: "visible source label: ANCHO LIMITADO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CALZADA DIVIDIDA",
    russianTranslation: "Разделенная проезжая часть",
    cropRegion: { x: 520, y: 527, width: 78, height: 89 },
    sourceSheetLabelEvidence: "visible source label: CALZADA DIVIDIDA",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ROTONDA",
    russianTranslation: "Круговое движение",
    cropRegion: { x: 176, y: 637, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: ROTONDA",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "INCORPORACIÓN DE TRÁNSITO LATERAL",
    russianTranslation: "Въезд транспорта сбоку",
    cropRegion: { x: 263, y: 637, width: 83, height: 88 },
    sourceSheetLabelEvidence: "visible source label: INCORPORACIÓN DE TRÁNSITO LATERAL",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "INICIO DE DOBLE CIRCULACIÓN",
    russianTranslation: "Начало двустороннего движения",
    cropRegion: { x: 349, y: 637, width: 88, height: 90 },
    sourceSheetLabelEvidence: "visible source label: INICIO DE DOBLE CIRCULACIÓN",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ENCRUCIJADA",
    variant: "Cruce",
    russianTranslation: "Перекресток",
    cropRegion: { x: 436, y: 637, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: ENCRUCIJADA (Cruce)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ENCRUCIJADA",
    variant: "Empalme",
    russianTranslation: "Примыкание",
    cropRegion: { x: 522, y: 637, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: ENCRUCIJADA (Empalme)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ENCRUCIJADA",
    variant: "Bifurcación 1",
    russianTranslation: "Развилка",
    cropRegion: { x: 176, y: 748, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: ENCRUCIJADA (Bifurcación 1)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ENCRUCIJADA",
    variant: "Bifurcación 2",
    russianTranslation: "Т-образная развилка",
    cropRegion: { x: 263, y: 748, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: ENCRUCIJADA (Bifurcación 2)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "category-heading",
    spanishLabel: "Posibilidad de riesgo eventual",
    russianTranslation: "Возможная опасность",
    cropRegion: { x: 80, y: 132, width: 330, height: 31 },
    sourceSheetLabelEvidence: "visible source heading: Posibilidad de riesgo eventual",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ESCOLARES",
    russianTranslation: "Школьники",
    cropRegion: { x: 116, y: 157, width: 74, height: 82 },
    sourceSheetLabelEvidence: "visible source label: ESCOLARES",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "NIÑOS",
    russianTranslation: "Дети",
    cropRegion: { x: 202, y: 157, width: 74, height: 82 },
    sourceSheetLabelEvidence: "visible source label: NIÑOS",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CRUCE DE CICLISTAS",
    russianTranslation: "Пересечение с велосипедистами",
    cropRegion: { x: 287, y: 157, width: 94, height: 92 },
    sourceSheetLabelEvidence: "visible source label: CRUCE DE CICLISTAS",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "JINETES",
    russianTranslation: "Всадники",
    cropRegion: { x: 396, y: 157, width: 74, height: 82 },
    sourceSheetLabelEvidence: "visible source label: JINETES",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ANIMALES SUELTOS",
    variant: "Vaca",
    russianTranslation: "Животные на дороге: корова",
    cropRegion: { x: 483, y: 157, width: 86, height: 86 },
    sourceSheetLabelEvidence: "visible source label: ANIMALES SUELTOS (Vaca)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ANIMALES SUELTOS",
    variant: "Ciervo",
    russianTranslation: "Животные на дороге: олень",
    cropRegion: { x: 116, y: 268, width: 88, height: 89 },
    sourceSheetLabelEvidence: "visible source label: ANIMALES SUELTOS (Ciervo)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CORREDOR AÉREO",
    russianTranslation: "Воздушный коридор",
    cropRegion: { x: 203, y: 268, width: 78, height: 84 },
    sourceSheetLabelEvidence: "visible source label: CORREDOR AÉREO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PRESENCIA DE VEHÍCULOS EXTRAÑOS",
    variant: "Tranvía",
    russianTranslation: "Возможное появление трамвая",
    cropRegion: { x: 290, y: 268, width: 94, height: 99 },
    sourceSheetLabelEvidence: "visible source label: PRESENCIA DE VEHÍCULOS EXTRAÑOS (Tranvía)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PRESENCIA DE VEHÍCULOS EXTRAÑOS",
    variant: "Tractor",
    russianTranslation: "Возможное появление трактора",
    cropRegion: { x: 398, y: 268, width: 83, height: 99 },
    sourceSheetLabelEvidence: "visible source label: PRESENCIA DE VEHÍCULOS EXTRAÑOS (Tractor)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PRESENCIA DE VEHÍCULOS EXTRAÑOS",
    variant: "Ambulancia",
    russianTranslation: "Возможное появление скорой помощи",
    cropRegion: { x: 486, y: 268, width: 91, height: 99 },
    sourceSheetLabelEvidence: "visible source label: PRESENCIA DE VEHÍCULOS EXTRAÑOS (Ambulancia)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "category-heading",
    spanishLabel: "Advertencias de máximo peligro",
    russianTranslation: "Предупреждения максимальной опасности",
    cropRegion: { x: 79, y: 394, width: 360, height: 31 },
    sourceSheetLabelEvidence: "visible source heading: Advertencias de máximo peligro",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CRUCE FERROVIARIO",
    russianTranslation: "Железнодорожный переезд",
    cropRegion: { x: 117, y: 419, width: 89, height: 77 },
    sourceSheetLabelEvidence: "visible source label: CRUCE FERROVIARIO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PANELES DE PREVENCIÓN",
    variant: "Aproximación",
    russianTranslation: "Предупредительные панели приближения",
    cropRegion: { x: 219, y: 433, width: 76, height: 66 },
    sourceSheetLabelEvidence: "visible source label: PANELES DE PREVENCIÓN (Aproximación)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PANELES DE PREVENCIÓN",
    variant: "Objeto rígido",
    russianTranslation: "Панель у жесткого препятствия",
    cropRegion: { x: 315, y: 428, width: 75, height: 72 },
    sourceSheetLabelEvidence: "visible source label: PANELES DE PREVENCIÓN (Objeto rígido)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PANELES DE PREVENCIÓN",
    variant: "Curva / Chevron",
    russianTranslation: "Шеврон поворота",
    cropRegion: { x: 403, y: 428, width: 86, height: 74 },
    sourceSheetLabelEvidence: "visible source label: PANELES DE PREVENCIÓN (Curva / Chevron)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CRUZ DE SAN ANDRÉS",
    variant: "Hasta dos vías",
    russianTranslation: "Андреевский крест: до двух путей",
    cropRegion: { x: 486, y: 419, width: 108, height: 83 },
    sourceSheetLabelEvidence: "visible source label: CRUZ DE SAN ANDRÉS (Hasta dos vías)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CRUZ DE SAN ANDRÉS",
    variant: "Más de dos vías",
    russianTranslation: "Андреевский крест: более двух путей",
    cropRegion: { x: 107, y: 522, width: 101, height: 70 },
    sourceSheetLabelEvidence: "visible source label: CRUZ DE SAN ANDRÉS (Más de dos vías)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CURVA CERRADA",
    russianTranslation: "Крутой поворот",
    cropRegion: { x: 224, y: 514, width: 64, height: 80 },
    sourceSheetLabelEvidence: "visible source label: CURVA CERRADA",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CRUCE DE PEATONES",
    russianTranslation: "Пешеходный переход",
    cropRegion: { x: 311, y: 514, width: 64, height: 80 },
    sourceSheetLabelEvidence: "visible source label: CRUCE DE PEATONES",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CRUCE DE PEATONES",
    variant: "Prioridad peatón",
    russianTranslation: "Пешеходы имеют приоритет",
    cropRegion: { x: 396, y: 514, width: 75, height: 101 },
    sourceSheetLabelEvidence: "visible source label: CRUCE DE PEATONES (Prioridad peatón)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ATENCIÓN",
    russianTranslation: "Внимание",
    cropRegion: { x: 483, y: 514, width: 64, height: 80 },
    sourceSheetLabelEvidence: "visible source label: ATENCIÓN",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "category-heading",
    spanishLabel: "Anticipo de otros dispositivos de control del tránsito",
    russianTranslation: "Предупреждение о других устройствах контроля движения",
    cropRegion: { x: 80, y: 640, width: 555, height: 31 },
    sourceSheetLabelEvidence: "visible source heading: Anticipo de otros dispositivos de control del tránsito",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "FLECHA DIRECCIONAL",
    russianTranslation: "Направляющая стрелка",
    cropRegion: { x: 115, y: 676, width: 83, height: 84 },
    sourceSheetLabelEvidence: "visible source label: FLECHA DIRECCIONAL",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PROXIMIDAD DE SEMÁFORO",
    russianTranslation: "Приближение к светофору",
    cropRegion: { x: 206, y: 678, width: 76, height: 87 },
    sourceSheetLabelEvidence: "visible source label: PROXIMIDAD DE SEMÁFORO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PROXIMIDAD DE SEÑAL RESTRICTIVA",
    variant: "Pare",
    russianTranslation: "Приближение к знаку STOP",
    cropRegion: { x: 291, y: 674, width: 88, height: 99 },
    sourceSheetLabelEvidence: "visible source label: PROXIMIDAD DE SEÑAL RESTRICTIVA (Pare)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PROXIMIDAD DE SEÑAL RESTRICTIVA",
    variant: "Paso",
    russianTranslation: "Приближение к знаку уступите дорогу",
    cropRegion: { x: 398, y: 674, width: 88, height: 99 },
    sourceSheetLabelEvidence: "visible source label: PROXIMIDAD DE SEÑAL RESTRICTIVA (Paso)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PROXIMIDAD DE SEÑAL RESTRICTIVA",
    variant: "Otra",
    russianTranslation: "Приближение к другому ограничивающему знаку",
    cropRegion: { x: 485, y: 674, width: 94, height: 99 },
    sourceSheetLabelEvidence: "visible source label: PROXIMIDAD DE SEÑAL RESTRICTIVA (Otra)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "category-heading",
    spanishLabel: "Fin de prevención",
    russianTranslation: "Конец предупреждения",
    cropRegion: { x: 79, y: 785, width: 230, height: 31 },
    sourceSheetLabelEvidence: "visible source heading: Fin de prevención",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Fin de prevención",
    russianTranslation: "Конец зоны предупреждения",
    cropRegion: { x: 122, y: 811, width: 70, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Fin de prevención",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "category-heading",
    spanishLabel: "Informativas",
    russianTranslation: "Информационные",
    cropRegion: { x: 132, y: 131, width: 178, height: 38 },
    sourceSheetLabelEvidence: "visible source heading: Informativas",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "category-heading",
    spanishLabel: "Características de la vía",
    russianTranslation: "Характеристики дороги",
    cropRegion: { x: 132, y: 171, width: 258, height: 30 },
    sourceSheetLabelEvidence: "visible source heading: Características de la vía",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Comienzo de autopista",
    russianTranslation: "начало автомагистрали",
    cropRegion: { x: 172, y: 202, width: 75, height: 97 },
    sourceSheetLabelEvidence: "visible source label: Comienzo de autopista",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Fin de autopista",
    russianTranslation: "конец автомагистрали",
    cropRegion: { x: 257, y: 202, width: 75, height: 97 },
    sourceSheetLabelEvidence: "visible source label: Fin de autopista",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Indicadora de utilización de carriles",
    russianTranslation: "указатель использования полос",
    cropRegion: { x: 343, y: 226, width: 98, height: 83 },
    sourceSheetLabelEvidence: "visible source label: Indicadora de utilización de carriles",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Camino o calle sin salida",
    variant: "traza en T",
    russianTranslation: "тупиковая дорога или улица",
    cropRegion: { x: 448, y: 226, width: 62, height: 83 },
    sourceSheetLabelEvidence: "visible source label: Camino o calle sin salida (traza en T)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Camino o calle sin salida",
    variant: "traza lateral",
    russianTranslation: "тупиковая дорога или улица",
    cropRegion: { x: 536, y: 226, width: 62, height: 83 },
    sourceSheetLabelEvidence: "visible source label: Camino o calle sin salida (traza lateral)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Camino o paso transitable",
    russianTranslation: "проезжий путь / разрешенный проезд",
    cropRegion: { x: 157, y: 318, width: 91, height: 100 },
    sourceSheetLabelEvidence: "visible source label: Camino o paso transitable",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Velocidades máximas permitidas",
    russianTranslation: "разрешенные максимальные скорости",
    cropRegion: { x: 259, y: 318, width: 76, height: 102 },
    sourceSheetLabelEvidence: "visible source label: Velocidades máximas permitidas",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Esquema de recorrido",
    russianTranslation: "схема маршрута",
    cropRegion: { x: 342, y: 316, width: 119, height: 98 },
    sourceSheetLabelEvidence: "visible source label: Esquema de recorrido",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Desvío por cambio de sentido de circulación",
    russianTranslation: "объезд из-за изменения направления движения",
    cropRegion: { x: 471, y: 316, width: 124, height: 103 },
    sourceSheetLabelEvidence: "visible source label: Desvío por cambio de sentido de circulación",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento permitido",
    russianTranslation: "стоянка разрешена",
    cropRegion: { x: 166, y: 455, width: 83, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento permitido",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento permitido",
    variant: "a 45° o 90°",
    russianTranslation: "стоянка под 45° или 90°",
    cropRegion: { x: 250, y: 455, width: 95, height: 93 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento permitido (a 45° o 90°)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento permitido",
    variant: "Motos a 45°",
    russianTranslation: "стоянка мотоциклов под 45°",
    cropRegion: { x: 338, y: 455, width: 95, height: 93 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento permitido (Motos a 45°)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "verde 45°",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 427, y: 455, width: 83, height: 86 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (verde 45°)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "naranja 45°",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 511, y: 455, width: 86, height: 86 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (naranja 45°)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "verde 45° inferior",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 166, y: 565, width: 84, height: 87 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (verde 45° inferior)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "naranja 45° inferior",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 251, y: 565, width: 93, height: 87 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (naranja 45° inferior)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "verde 90°",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 338, y: 565, width: 92, height: 87 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (verde 90°)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "naranja 90°",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 424, y: 565, width: 91, height: 87 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (naranja 90°)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "verde 90° derecha",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 511, y: 565, width: 88, height: 87 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (verde 90° derecha)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "E naranja",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 168, y: 676, width: 83, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (E naranja)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "S verde",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 255, y: 692, width: 89, height: 50 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (S verde)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "P naranja",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 341, y: 692, width: 88, height: 50 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (P naranja)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Permitido girar",
    variant: "Derecha",
    russianTranslation: "поворот направо разрешен",
    cropRegion: { x: 439, y: 676, width: 82, height: 80 },
    sourceSheetLabelEvidence: "visible source label: Permitido girar (Derecha)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Permitido girar",
    variant: "Izquierda",
    russianTranslation: "поворот налево разрешен",
    cropRegion: { x: 523, y: 676, width: 82, height: 80 },
    sourceSheetLabelEvidence: "visible source label: Permitido girar (Izquierda)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Derecha",
    russianTranslation: "разрешенное направление направо",
    cropRegion: { x: 165, y: 784, width: 86, height: 75 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Derecha)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Izquierda",
    russianTranslation: "разрешенное направление налево",
    cropRegion: { x: 250, y: 784, width: 89, height: 75 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Izquierda)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Igual sentido o derecha",
    russianTranslation: "прямо или направо",
    cropRegion: { x: 336, y: 775, width: 92, height: 93 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Igual sentido o derecha)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Igual sentido o izquierda",
    russianTranslation: "прямо или налево",
    cropRegion: { x: 424, y: 775, width: 92, height: 93 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Igual sentido o izquierda)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 189,
    sourceCardId: "app4-informational-page-189-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Ambas direcciones",
    russianTranslation: "оба направления",
    cropRegion: { x: 511, y: 784, width: 91, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Ambas direcciones)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Bifurcación",
    russianTranslation: "разрешенные направления: разветвление",
    cropRegion: { x: 125, y: 147, width: 75, height: 86 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Bifurcación)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Derecha e izquierda",
    russianTranslation: "направо и налево",
    cropRegion: { x: 210, y: 147, width: 84, height: 86 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Derecha e izquierda)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Giro en U",
    russianTranslation: "разворот разрешен",
    cropRegion: { x: 296, y: 147, width: 74, height: 86 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Giro en U)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Cámara de control electrónico",
    russianTranslation: "камера электронного контроля",
    cropRegion: { x: 384, y: 147, width: 70, height: 86 },
    sourceSheetLabelEvidence: "visible source label: Cámara de control electrónico",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Fin de camino peatonal",
    variant: "A 100 m",
    russianTranslation: "конец пешеходного пути через 100 м",
    cropRegion: { x: 476, y: 146, width: 72, height: 104 },
    sourceSheetLabelEvidence: "visible source label: Fin de camino peatonal (A 100 m)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Fin de camino peatonal",
    russianTranslation: "конец пешеходного пути",
    cropRegion: { x: 134, y: 256, width: 67, height: 96 },
    sourceSheetLabelEvidence: "visible source label: Fin de camino peatonal",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Cruce peatonal",
    variant: "Derecha",
    russianTranslation: "пешеходный переход справа",
    cropRegion: { x: 220, y: 256, width: 70, height: 96 },
    sourceSheetLabelEvidence: "visible source label: Cruce peatonal (Derecha)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Cruce peatonal",
    variant: "Izquierda",
    russianTranslation: "пешеходный переход слева",
    cropRegion: { x: 306, y: 256, width: 72, height: 96 },
    sourceSheetLabelEvidence: "visible source label: Cruce peatonal (Izquierda)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Bidireccionales en ciclovía",
    russianTranslation: "двустороннее движение на велодорожке",
    cropRegion: { x: 386, y: 278, width: 90, height: 70 },
    sourceSheetLabelEvidence: "visible source label: Bidireccionales en ciclovía",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Proximidad de ciclovía",
    russianTranslation: "близость велодорожки",
    cropRegion: { x: 487, y: 278, width: 88, height: 70 },
    sourceSheetLabelEvidence: "visible source label: Proximidad de ciclovía",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Descenso de la bicicleta",
    russianTranslation: "сойти с велосипеда",
    cropRegion: { x: 124, y: 366, width: 88, height: 68 },
    sourceSheetLabelEvidence: "visible source label: Descenso de la bicicleta",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Finalización de la ciclovía",
    russianTranslation: "конец велодорожки",
    cropRegion: { x: 210, y: 366, width: 88, height: 68 },
    sourceSheetLabelEvidence: "visible source label: Finalización de la ciclovía",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Advertencia de escuela",
    russianTranslation: "предупреждение о школе",
    cropRegion: { x: 296, y: 366, width: 88, height: 68 },
    sourceSheetLabelEvidence: "visible source label: Advertencia de escuela",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Advertencia general",
    russianTranslation: "общее предупреждение",
    cropRegion: { x: 382, y: 366, width: 88, height: 68 },
    sourceSheetLabelEvidence: "visible source label: Advertencia general",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "category-heading",
    spanishLabel: "Nomenclatura vial y urbana",
    russianTranslation: "дорожная и городская номенклатура",
    cropRegion: { x: 78, y: 455, width: 310, height: 35 },
    sourceSheetLabelEvidence: "visible source heading: Nomenclatura vial y urbana",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Ruta Panamericana",
    russianTranslation: "Панамериканская трасса",
    cropRegion: { x: 118, y: 500, width: 85, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Ruta Panamericana",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Ruta nacional",
    russianTranslation: "национальная трасса",
    cropRegion: { x: 201, y: 508, width: 68, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Ruta nacional",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Ruta provincial",
    russianTranslation: "провинциальная трасса",
    cropRegion: { x: 273, y: 508, width: 72, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Ruta provincial",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Nomenclatura urbana",
    variant: "placa de calle",
    russianTranslation: "городская уличная табличка",
    cropRegion: { x: 342, y: 505, width: 115, height: 85 },
    sourceSheetLabelEvidence: "visible source label: Nomenclatura urbana (placa de calle)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Nomenclatura urbana",
    variant: "flecha urbana",
    russianTranslation: "городская навигация",
    cropRegion: { x: 451, y: 505, width: 138, height: 85 },
    sourceSheetLabelEvidence: "visible source label: Nomenclatura urbana (flecha urbana)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Identificación de región y localidad",
    russianTranslation: "регион и населенный пункт",
    cropRegion: { x: 116, y: 600, width: 95, height: 112 },
    sourceSheetLabelEvidence: "visible source label: Identificación de región y localidad",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Orientación",
    variant: "En caminos principales y secundarios",
    russianTranslation: "ориентация на главных и второстепенных дорогах",
    cropRegion: { x: 232, y: 635, width: 110, height: 94 },
    sourceSheetLabelEvidence: "visible source label: Orientación (En caminos principales y secundarios)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Orientación",
    variant: "En caminos secundarios",
    russianTranslation: "ориентация на второстепенных дорогах",
    cropRegion: { x: 354, y: 638, width: 100, height: 88 },
    sourceSheetLabelEvidence: "visible source label: Orientación (En caminos secundarios)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Comienzo o fin de zona urbana",
    russianTranslation: "начало или конец городской зоны",
    cropRegion: { x: 446, y: 637, width: 98, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Comienzo o fin de zona urbana",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Identificación de jurisdicción o accidente",
    russianTranslation: "обозначение юрисдикции или объекта",
    cropRegion: { x: 103, y: 755, width: 125, height: 74 },
    sourceSheetLabelEvidence: "visible source label: Identificación de jurisdicción o accidente",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Mojón kilométrico",
    russianTranslation: "километровый столб",
    cropRegion: { x: 245, y: 753, width: 83, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Mojón kilométrico",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 190,
    sourceCardId: "app4-informational-page-190-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Nomenclatura de autopista",
    russianTranslation: "обозначение автомагистрали",
    cropRegion: { x: 335, y: 755, width: 126, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Nomenclatura de autopista",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "category-heading",
    spanishLabel: "Información turística y de servicios",
    russianTranslation: "туристическая и сервисная информация",
    cropRegion: { x: 132, y: 130, width: 405, height: 34 },
    sourceSheetLabelEvidence: "visible source heading: Información turística y de servicios",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Puesto sanitario",
    russianTranslation: "медицинский пункт",
    cropRegion: { x: 174, y: 162, width: 72, height: 96 },
    sourceSheetLabelEvidence: "visible source label: Puesto sanitario",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Servicio telefónico",
    russianTranslation: "телефонная связь",
    cropRegion: { x: 257, y: 162, width: 76, height: 96 },
    sourceSheetLabelEvidence: "visible source label: Servicio telefónico",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estación de servicio",
    russianTranslation: "автозаправочная станция",
    cropRegion: { x: 342, y: 162, width: 83, height: 100 },
    sourceSheetLabelEvidence: "visible source label: Estación de servicio",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Teleférico",
    russianTranslation: "канатная дорога",
    cropRegion: { x: 432, y: 162, width: 78, height: 96 },
    sourceSheetLabelEvidence: "visible source label: Teleférico",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Servicio mecánico",
    russianTranslation: "механический сервис",
    cropRegion: { x: 515, y: 162, width: 88, height: 96 },
    sourceSheetLabelEvidence: "visible source label: Servicio mecánico",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Restaurante",
    russianTranslation: "ресторан",
    cropRegion: { x: 174, y: 258, width: 72, height: 90 },
    sourceSheetLabelEvidence: "visible source label: Restaurante",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Aeropuerto",
    russianTranslation: "аэропорт",
    cropRegion: { x: 257, y: 258, width: 76, height: 90 },
    sourceSheetLabelEvidence: "visible source label: Aeropuerto",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Gomería",
    russianTranslation: "шиномонтаж",
    cropRegion: { x: 342, y: 258, width: 83, height: 90 },
    sourceSheetLabelEvidence: "visible source label: Gomería",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento",
    russianTranslation: "стоянка",
    cropRegion: { x: 432, y: 258, width: 78, height: 90 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Punto panorámico",
    russianTranslation: "панорамная точка",
    cropRegion: { x: 515, y: 258, width: 88, height: 95 },
    sourceSheetLabelEvidence: "visible source label: Punto panorámico",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Plaza",
    russianTranslation: "площадь / парк",
    cropRegion: { x: 174, y: 355, width: 72, height: 88 },
    sourceSheetLabelEvidence: "visible source label: Plaza",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Correo",
    russianTranslation: "почта",
    cropRegion: { x: 257, y: 355, width: 76, height: 88 },
    sourceSheetLabelEvidence: "visible source label: Correo",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento de casas rodantes",
    russianTranslation: "стоянка автодомов",
    cropRegion: { x: 337, y: 355, width: 92, height: 96 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento de casas rodantes",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Museo",
    russianTranslation: "музей",
    cropRegion: { x: 432, y: 355, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: Museo",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Policía",
    russianTranslation: "полиция",
    cropRegion: { x: 515, y: 355, width: 88, height: 88 },
    sourceSheetLabelEvidence: "visible source label: Policía",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Zona de detención transporte público de pasajeros",
    russianTranslation: "остановочная зона общественного транспорта",
    cropRegion: { x: 166, y: 451, width: 90, height: 108 },
    sourceSheetLabelEvidence: "visible source label: Zona de detención transporte público de pasajeros",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Taxi",
    russianTranslation: "такси",
    cropRegion: { x: 257, y: 451, width: 76, height: 90 },
    sourceSheetLabelEvidence: "visible source label: Taxi",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Terminal de ómnibus",
    russianTranslation: "автовокзал",
    cropRegion: { x: 337, y: 451, width: 92, height: 96 },
    sourceSheetLabelEvidence: "visible source label: Terminal de ómnibus",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estación de ferrocarril",
    russianTranslation: "железнодорожная станция",
    cropRegion: { x: 432, y: 451, width: 78, height: 96 },
    sourceSheetLabelEvidence: "visible source label: Estación de ferrocarril",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Teatro",
    russianTranslation: "театр",
    cropRegion: { x: 515, y: 451, width: 88, height: 90 },
    sourceSheetLabelEvidence: "visible source label: Teatro",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Turismo",
    russianTranslation: "туризм",
    cropRegion: { x: 178, y: 578, width: 70, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Turismo",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Institución religiosa",
    russianTranslation: "религиозное учреждение",
    cropRegion: { x: 262, y: 548, width: 82, height: 108 },
    sourceSheetLabelEvidence: "visible source label: Institución religiosa",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Escolares",
    variant: "Ascenso y descenso",
    russianTranslation: "школьники: посадка и высадка",
    cropRegion: { x: 348, y: 548, width: 76, height: 100 },
    sourceSheetLabelEvidence: "visible source label: Escolares (Ascenso y descenso)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Escolares",
    variant: "Circular o subir al colectivo",
    russianTranslation: "школьники: движение или посадка в автобус",
    cropRegion: { x: 432, y: 548, width: 92, height: 123 },
    sourceSheetLabelEvidence: "visible source label: Escolares (Circular o subir al colectivo)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Personas con movilidad reducida",
    variant: "Ascenso y descenso",
    russianTranslation: "люди с ограниченной мобильностью",
    cropRegion: { x: 518, y: 548, width: 88, height: 108 },
    sourceSheetLabelEvidence: "visible source label: Personas con movilidad reducida (Ascenso y descenso)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "category-heading",
    spanishLabel: "Educativas y anuncios especiales",
    russianTranslation: "образовательные и специальные объявления",
    cropRegion: { x: 130, y: 684, width: 400, height: 35 },
    sourceSheetLabelEvidence: "visible source heading: Educativas y anuncios especiales",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Evite accidentes estacione lejos de la calzada",
    russianTranslation: "избегайте аварий, стойте вдали от проезжей части",
    cropRegion: { x: 177, y: 719, width: 50, height: 64 },
    sourceSheetLabelEvidence: "visible source label: Evite accidentes estacione lejos de la calzada",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Destruir señales es un delito",
    russianTranslation: "уничтожать знаки - преступление",
    cropRegion: { x: 228, y: 719, width: 50, height: 64 },
    sourceSheetLabelEvidence: "visible source label: Destruir señales es un delito",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Evite encandilar",
    russianTranslation: "не ослепляйте",
    cropRegion: { x: 279, y: 719, width: 50, height: 64 },
    sourceSheetLabelEvidence: "visible source label: Evite encandilar",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "No se adelante sin advertir",
    russianTranslation: "не обгоняйте без предупреждения",
    cropRegion: { x: 330, y: 719, width: 50, height: 64 },
    sourceSheetLabelEvidence: "visible source label: No se adelante sin advertir",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Transite dentro de su carril",
    russianTranslation: "двигайтесь в своей полосе",
    cropRegion: { x: 381, y: 719, width: 50, height: 64 },
    sourceSheetLabelEvidence: "visible source label: Transite dentro de su carril",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "No adelante en curvas y puentes",
    russianTranslation: "не обгоняйте на поворотах и мостах",
    cropRegion: { x: 432, y: 719, width: 50, height: 64 },
    sourceSheetLabelEvidence: "visible source label: No adelante en curvas y puentes",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Adelante por la izquierda",
    russianTranslation: "обгоняйте слева",
    cropRegion: { x: 484, y: 719, width: 50, height: 64 },
    sourceSheetLabelEvidence: "visible source label: Adelante por la izquierda",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Respete las señales",
    russianTranslation: "соблюдайте знаки",
    cropRegion: { x: 537, y: 719, width: 50, height: 64 },
    sourceSheetLabelEvidence: "visible source label: Respete las señales",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 191,
    sourceCardId: "app4-informational-page-191-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "En conmemoración a una víctima de tránsito",
    variant: "Estrella Amarilla",
    russianTranslation: "в память о жертве дорожного движения",
    cropRegion: { x: 175, y: 800, width: 90, height: 86 },
    sourceSheetLabelEvidence: "visible source label: En conmemoración a una víctima de tránsito (Estrella Amarilla)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-informational",
    sourcePage: 192,
    sourceCardId: "app4-informational-page-192-source-card",
    entryKind: "contextual-visual",
    spanishLabel: "En memoria de una víctima de tránsito",
    variant: "Estrella Amarilla photo",
    russianTranslation: "в память о жертве дорожного движения",
    cropRegion: { x: 205, y: 382, width: 235, height: 220 },
    sourceSheetLabelEvidence: "visible source contextual visual: Estrella Amarilla photo",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "category-heading",
    spanishLabel: "Transitorias",
    russianTranslation: "Временные",
    cropRegion: { x: 132, y: 128, width: 180, height: 42 },
    sourceSheetLabelEvidence: "visible source heading: Transitorias",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "category-heading",
    spanishLabel: "Viales",
    russianTranslation: "Дорожные",
    cropRegion: { x: 132, y: 171, width: 80, height: 28 },
    sourceSheetLabelEvidence: "visible source heading: Viales",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "No girar",
    variant: "Izquierda",
    russianTranslation: "поворот налево запрещен",
    cropRegion: { x: 179, y: 206, width: 61, height: 76 },
    sourceSheetLabelEvidence: "visible source label: No girar (Izquierda)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "No girar",
    variant: "Derecha",
    russianTranslation: "поворот направо запрещен",
    cropRegion: { x: 266, y: 206, width: 61, height: 76 },
    sourceSheetLabelEvidence: "visible source label: No girar (Derecha)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Giro anulado",
    variant: "A 100 m",
    russianTranslation: "через 100 м поворот отменен",
    cropRegion: { x: 342, y: 218, width: 77, height: 65 },
    sourceSheetLabelEvidence: "visible source label: Giro anulado (A 100 m)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "No estacionar ni detenerse",
    russianTranslation: "остановка и стоянка запрещены",
    cropRegion: { x: 436, y: 206, width: 62, height: 80 },
    sourceSheetLabelEvidence: "visible source label: No estacionar ni detenerse",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Límite de velocidad máxima",
    variant: "20",
    russianTranslation: "ограничение максимальной скорости 20",
    cropRegion: { x: 523, y: 206, width: 65, height: 81 },
    sourceSheetLabelEvidence: "visible source label: Límite de velocidad máxima (20)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Sentido de circulación",
    variant: "Izquierda",
    russianTranslation: "направление движения налево",
    cropRegion: { x: 181, y: 290, width: 64, height: 76 },
    sourceSheetLabelEvidence: "visible source label: Sentido de circulación (Izquierda)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Sentido de circulación",
    variant: "Derecha",
    russianTranslation: "направление движения направо",
    cropRegion: { x: 267, y: 290, width: 66, height: 76 },
    sourceSheetLabelEvidence: "visible source label: Sentido de circulación (Derecha)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Ambas direcciones",
    russianTranslation: "разрешенные направления: обе стороны",
    cropRegion: { x: 352, y: 291, width: 68, height: 79 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Ambas direcciones)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Estrechamiento",
    variant: "En una sola mano",
    russianTranslation: "сужение на одностороннем участке",
    cropRegion: { x: 437, y: 291, width: 71, height: 75 },
    sourceSheetLabelEvidence: "visible source label: Estrechamiento (En una sola mano)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Reducción de calzada",
    variant: "A 100 m",
    russianTranslation: "через 100 м сужение проезжей части",
    cropRegion: { x: 516, y: 305, width: 88, height: 64 },
    sourceSheetLabelEvidence: "visible source label: Reducción de calzada (A 100 m)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Calzada dividida",
    russianTranslation: "разделенная проезжая часть",
    cropRegion: { x: 181, y: 387, width: 65, height: 66 },
    sourceSheetLabelEvidence: "visible source label: Calzada dividida",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Calzada dividida",
    variant: "A 100 m",
    russianTranslation: "через 100 м разделенная проезжая часть",
    cropRegion: { x: 264, y: 396, width: 78, height: 64 },
    sourceSheetLabelEvidence: "visible source label: Calzada dividida (A 100 m)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Personas trabajando",
    russianTranslation: "люди работают",
    cropRegion: { x: 354, y: 383, width: 67, height: 73 },
    sourceSheetLabelEvidence: "visible source label: Personas trabajando",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Inicio obras",
    russianTranslation: "начало работ",
    cropRegion: { x: 434, y: 396, width: 78, height: 62 },
    sourceSheetLabelEvidence: "visible source label: Inicio obras",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Inicio obras",
    variant: "A X m",
    russianTranslation: "через X м начало работ",
    cropRegion: { x: 521, y: 396, width: 76, height: 62 },
    sourceSheetLabelEvidence: "visible source label: Inicio obras (A X m)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Fin obras",
    russianTranslation: "конец работ",
    cropRegion: { x: 179, y: 474, width: 69, height: 55 },
    sourceSheetLabelEvidence: "visible source label: Fin obras",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Desvío",
    russianTranslation: "объезд",
    cropRegion: { x: 264, y: 474, width: 70, height: 55 },
    sourceSheetLabelEvidence: "visible source label: Desvío",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Desvío",
    variant: "A X m",
    russianTranslation: "через X м объезд",
    cropRegion: { x: 350, y: 474, width: 70, height: 57 },
    sourceSheetLabelEvidence: "visible source label: Desvío (A X m)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Calle cerrada",
    variant: "A X m",
    russianTranslation: "через X м улица закрыта",
    cropRegion: { x: 435, y: 474, width: 72, height: 62 },
    sourceSheetLabelEvidence: "visible source label: Calle cerrada (A X m)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Calle transversal en obra",
    variant: "A X m",
    russianTranslation: "через X м поперечная улица в работах",
    cropRegion: { x: 520, y: 474, width: 80, height: 67 },
    sourceSheetLabelEvidence: "visible source label: Calle transversal en obra (A X m)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Inicio evento",
    russianTranslation: "начало события",
    cropRegion: { x: 179, y: 557, width: 71, height: 55 },
    sourceSheetLabelEvidence: "visible source label: Inicio evento",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Evento",
    variant: "A X m",
    russianTranslation: "через X м событие",
    cropRegion: { x: 264, y: 557, width: 71, height: 56 },
    sourceSheetLabelEvidence: "visible source label: Evento (A X m)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Solo acceso frentistas",
    russianTranslation: "только доступ для жителей прилегающих домов",
    cropRegion: { x: 350, y: 557, width: 72, height: 57 },
    sourceSheetLabelEvidence: "visible source label: Solo acceso frentistas",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "category-heading",
    spanishLabel: "Peatonales y de ciclovías",
    russianTranslation: "пешеходные и велосипедные",
    cropRegion: { x: 132, y: 603, width: 260, height: 31 },
    sourceSheetLabelEvidence: "visible source heading: Peatonales y de ciclovías",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 193,
    sourceCardId: "app4-temporary-page-193-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Desvío",
    variant: "Peatonales y de ciclovías",
    russianTranslation: "объезд / обход для пешеходов и велосипедистов",
    cropRegion: { x: 181, y: 670, width: 55, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Desvío (Peatonales y de ciclovías)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "category-heading",
    spanishLabel: "Peatonales",
    russianTranslation: "пешеходные",
    cropRegion: { x: 80, y: 132, width: 135, height: 27 },
    sourceSheetLabelEvidence: "visible source heading: Peatonales",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Anuncio de obra",
    russianTranslation: "объявление о работах",
    cropRegion: { x: 132, y: 180, width: 66, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Anuncio de obra",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Comienzo de obra",
    russianTranslation: "начало работ",
    cropRegion: { x: 215, y: 180, width: 66, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Comienzo de obra",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Desvío",
    russianTranslation: "обход / объезд",
    cropRegion: { x: 301, y: 180, width: 64, height: 67 },
    sourceSheetLabelEvidence: "visible source label: Desvío",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Anulación temporal de paradas",
    russianTranslation: "временная отмена остановок",
    cropRegion: { x: 386, y: 180, width: 70, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Anulación temporal de paradas",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Acérquese a la parada más cercana",
    russianTranslation: "подойдите к ближайшей остановке",
    cropRegion: { x: 470, y: 180, width: 78, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Acérquese a la parada más cercana",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Anulación de parada",
    russianTranslation: "отмена остановки",
    cropRegion: { x: 132, y: 264, width: 66, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Anulación de parada",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Prohibido el paso",
    russianTranslation: "проход запрещен",
    cropRegion: { x: 215, y: 264, width: 66, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Prohibido el paso",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Senda deshabilitada",
    russianTranslation: "путь / переход закрыт",
    cropRegion: { x: 300, y: 264, width: 70, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Senda deshabilitada",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "category-heading",
    spanishLabel: "De ciclovías",
    russianTranslation: "для велодорожек",
    cropRegion: { x: 80, y: 376, width: 135, height: 28 },
    sourceSheetLabelEvidence: "visible source heading: De ciclovías",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Interrupción de ciclovía",
    variant: "Anticipación",
    russianTranslation: "прерывание велодорожки заранее",
    cropRegion: { x: 128, y: 407, width: 74, height: 88 },
    sourceSheetLabelEvidence: "visible source label: Interrupción de ciclovía (Anticipación)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Interrupción de ciclovía",
    russianTranslation: "прерывание велодорожки",
    cropRegion: { x: 213, y: 407, width: 74, height: 83 },
    sourceSheetLabelEvidence: "visible source label: Interrupción de ciclovía",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Descenso de la bicicleta",
    russianTranslation: "сойти с велосипеда",
    cropRegion: { x: 300, y: 407, width: 72, height: 83 },
    sourceSheetLabelEvidence: "visible source label: Descenso de la bicicleta",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "category-heading",
    spanishLabel: "Otros dispositivos",
    russianTranslation: "другие устройства",
    cropRegion: { x: 80, y: 542, width: 205, height: 30 },
    sourceSheetLabelEvidence: "visible source heading: Otros dispositivos",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Valla barricada",
    russianTranslation: "барьерная ограда",
    cropRegion: { x: 132, y: 581, width: 68, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Valla barricada",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Valla peatonal",
    russianTranslation: "пешеходное ограждение",
    cropRegion: { x: 207, y: 581, width: 86, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Valla peatonal",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Valla de obra",
    russianTranslation: "строительное ограждение",
    cropRegion: { x: 291, y: 581, width: 88, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Valla de obra",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Anuncio de obra",
    variant: "dispositivo",
    russianTranslation: "объявление о работах",
    cropRegion: { x: 387, y: 581, width: 70, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Anuncio de obra (dispositivo)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Conos",
    russianTranslation: "конусы",
    cropRegion: { x: 468, y: 582, width: 76, height: 65 },
    sourceSheetLabelEvidence: "visible source label: Conos",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Tambores",
    russianTranslation: "дорожные бочки",
    cropRegion: { x: 132, y: 663, width: 64, height: 71 },
    sourceSheetLabelEvidence: "visible source label: Tambores",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Delineadores",
    russianTranslation: "направляющие делинеаторы",
    cropRegion: { x: 214, y: 662, width: 66, height: 68 },
    sourceSheetLabelEvidence: "visible source label: Delineadores",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Barandas canalizadoras de tránsito",
    russianTranslation: "направляющие барьеры для движения",
    cropRegion: { x: 292, y: 665, width: 86, height: 76 },
    sourceSheetLabelEvidence: "visible source label: Barandas canalizadoras de tránsito",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Barandas canalizadoras de tránsito",
    variant: "Hormigón",
    russianTranslation: "бетонные направляющие барьеры для движения",
    cropRegion: { x: 382, y: 668, width: 86, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Barandas canalizadoras de tránsito (Hormigón)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Reflector",
    russianTranslation: "отражатель / осветитель",
    cropRegion: { x: 477, y: 663, width: 62, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Reflector",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Baliza delineadora",
    russianTranslation: "направляющий маячок",
    cropRegion: { x: 130, y: 750, width: 68, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Baliza delineadora",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Baliza intermitente",
    russianTranslation: "мигающий маяк",
    cropRegion: { x: 213, y: 750, width: 68, height: 73 },
    sourceSheetLabelEvidence: "visible source label: Baliza intermitente",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Flecha vial intermitente",
    russianTranslation: "мигающая дорожная стрелка",
    cropRegion: { x: 292, y: 750, width: 82, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Flecha vial intermitente",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Semáforo",
    russianTranslation: "светофор",
    cropRegion: { x: 388, y: 747, width: 62, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Semáforo",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-temporary",
    sourcePage: 194,
    sourceCardId: "app4-temporary-page-194-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Paneles",
    russianTranslation: "панели",
    cropRegion: { x: 470, y: 748, width: 64, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Paneles",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "category-heading",
    spanishLabel: "Horizontales",
    russianTranslation: "Горизонтальная разметка",
    cropRegion: { x: 125, y: 120, width: 210, height: 45 },
    sourceSheetLabelEvidence: "visible source heading: Horizontales",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "category-heading",
    spanishLabel: "Marcas longitudinales",
    russianTranslation: "Продольная разметка",
    cropRegion: { x: 124, y: 172, width: 255, height: 32 },
    sourceSheetLabelEvidence: "visible source heading: Marcas longitudinales",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Línea de separación de circulación",
    variant: "No debe ser traspasada ni circular sobre ella",
    russianTranslation: "линия разделения движения; ее нельзя пересекать или ехать по ней",
    cropRegion: { x: 170, y: 210, width: 165, height: 80 },
    sourceSheetLabelEvidence: "visible source label: Línea de separación de circulación (No debe ser traspasada ni circular sobre ella)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Líneas continuas y discontinuas paralelas",
    variant: "Línea discontinua del lado del carril que se circula: traspaso autorizado",
    russianTranslation: "параллельные сплошная и прерывистая линии; пересечение разрешено со стороны прерывистой",
    cropRegion: { x: 390, y: 205, width: 175, height: 86 },
    sourceSheetLabelEvidence:
      "visible source label: Líneas continuas y discontinuas paralelas (Línea discontinua del lado del carril que se circula: traspaso autorizado)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Líneas de separación de sentido de circulación opuesta",
    variant: "No debe ser traspasada ni circular sobre ella",
    russianTranslation: "линии разделения встречных направлений; пересекать нельзя",
    cropRegion: { x: 164, y: 286, width: 178, height: 75 },
    sourceSheetLabelEvidence: "visible source label: Líneas de separación de sentido de circulación opuesta (No debe ser traspasada ni circular sobre ella)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Líneas divisorias de carriles con corrientes de tránsito del mismo sentido",
    russianTranslation: "линии разделения полос попутного движения",
    cropRegion: { x: 397, y: 285, width: 182, height: 75 },
    sourceSheetLabelEvidence: "visible source label: Líneas divisorias de carriles con corrientes de tránsito del mismo sentido",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Línea de separación de sentido de circulación",
    variant: "Indica la posibilidad de ser traspasada",
    russianTranslation: "разделительная линия, которую можно пересекать",
    cropRegion: { x: 152, y: 364, width: 195, height: 70 },
    sourceSheetLabelEvidence: "visible source label: Línea de separación de sentido de circulación (Indica la posibilidad de ser traspasada)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Línea de carril exclusivo y carril preferencial",
    variant: "dos variantes visibles",
    russianTranslation: "линия выделенной или приоритетной полосы",
    cropRegion: { x: 417, y: 363, width: 150, height: 93 },
    sourceSheetLabelEvidence: "visible source label: Línea de carril exclusivo y carril preferencial (dos variantes visibles)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Línea de separación de sentido de circulación, en vías con sentido reversible",
    russianTranslation: "линия разделения на дорогах с реверсивным движением",
    cropRegion: { x: 145, y: 438, width: 210, height: 70 },
    sourceSheetLabelEvidence: "visible source label: Línea de separación de sentido de circulación, en vías con sentido reversible",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Líneas de borde de calzada",
    russianTranslation: "краевые линии проезжей части",
    cropRegion: { x: 421, y: 437, width: 150, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Líneas de borde de calzada",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "category-heading",
    spanishLabel: "Marcas transversales",
    russianTranslation: "Поперечная разметка",
    cropRegion: { x: 124, y: 532, width: 260, height: 38 },
    sourceSheetLabelEvidence: "visible source heading: Marcas transversales",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Línea de detención",
    russianTranslation: "стоп-линия",
    cropRegion: { x: 190, y: 596, width: 135, height: 64 },
    sourceSheetLabelEvidence: "visible source label: Línea de detención",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Senda peatonal o senda para cruce de ciclistas",
    variant: "punteada",
    russianTranslation: "пешеходный переход или пересечение велосипедистов",
    cropRegion: { x: 409, y: 596, width: 165, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Senda peatonal o senda para cruce de ciclistas (punteada)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Senda peatonal",
    variant: "Prohibido detener o estacionar vehículos sobre la misma",
    russianTranslation: "пешеходный переход; остановка и стоянка на нем запрещены",
    cropRegion: { x: 190, y: 670, width: 145, height: 92 },
    sourceSheetLabelEvidence: "visible source label: Senda peatonal (Prohibido detener o estacionar vehículos sobre la misma)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Senda peatonal o senda para cruce de ciclistas",
    variant: "líneas continuas",
    russianTranslation: "пешеходный переход или пересечение велосипедистов",
    cropRegion: { x: 410, y: 670, width: 165, height: 86 },
    sourceSheetLabelEvidence: "visible source label: Senda peatonal o senda para cruce de ciclistas (líneas continuas)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Senda peatonal con línea de frenado previa",
    russianTranslation: "переход с предварительной линией торможения",
    cropRegion: { x: 185, y: 748, width: 150, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Senda peatonal con línea de frenado previa",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 195,
    sourceCardId: "app4-horizontal-page-195-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Líneas auxiliares para reducción de velocidad",
    variant: "Distribución logarítmica",
    russianTranslation: "вспомогательные линии для снижения скорости",
    cropRegion: { x: 407, y: 748, width: 175, height: 90 },
    sourceSheetLabelEvidence: "visible source label: Líneas auxiliares para reducción de velocidad (Distribución logarítmica)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "category-heading",
    spanishLabel: "Marcas especiales",
    russianTranslation: "Специальная разметка",
    cropRegion: { x: 79, y: 132, width: 230, height: 34 },
    sourceSheetLabelEvidence: "visible source heading: Marcas especiales",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Marcas canalizadoras de tránsito e isletas para circulación bidireccional",
    variant: "No se puede circular sobre ellas; dos variantes visibles",
    russianTranslation: "направляющие островки для двустороннего движения; по ним ехать нельзя",
    cropRegion: { x: 100, y: 185, width: 230, height: 78 },
    sourceSheetLabelEvidence:
      "visible source label: Marcas canalizadoras de tránsito e isletas para circulación bidireccional (No se puede circular sobre ellas; dos variantes visibles)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Flechas indicadoras de circulación dentro del carril",
    russianTranslation: "стрелки направления движения в пределах полосы",
    cropRegion: { x: 343, y: 187, width: 165, height: 65 },
    sourceSheetLabelEvidence: "visible source label: Flechas indicadoras de circulación dentro del carril",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Marcas canalizadoras de tránsito e isletas para circulación unidireccional",
    variant: "No se puede circular sobre ellas; dos variantes visibles",
    russianTranslation: "направляющие островки для одностороннего движения; по ним ехать нельзя",
    cropRegion: { x: 100, y: 284, width: 230, height: 80 },
    sourceSheetLabelEvidence:
      "visible source label: Marcas canalizadoras de tránsito e isletas para circulación unidireccional (No se puede circular sobre ellas; dos variantes visibles)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PARE",
    variant: "Obligación de detener totalmente la marcha",
    russianTranslation: "PARE / стоп; обязательная полная остановка",
    cropRegion: { x: 350, y: 283, width: 150, height: 84 },
    sourceSheetLabelEvidence: "visible source label: PARE (Obligación de detener totalmente la marcha)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Espacios destinados a estacionamiento",
    variant: "diagonales",
    russianTranslation: "места, предназначенные для парковки",
    cropRegion: { x: 154, y: 376, width: 130, height: 70 },
    sourceSheetLabelEvidence: "visible source label: Espacios destinados a estacionamiento (diagonales)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Cordones",
    variant: "Amarillo: prohibición de estacionar, pudiendo detenerse",
    russianTranslation: "бордюры; желтый запрещает стоянку, остановка допускается",
    cropRegion: { x: 354, y: 374, width: 145, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Cordones (Amarillo: prohibición de estacionar, pudiendo detenerse)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Espacios destinados a estacionamiento",
    variant: "bicicleta",
    russianTranslation: "места, предназначенные для парковки велосипедов",
    cropRegion: { x: 154, y: 454, width: 130, height: 68 },
    sourceSheetLabelEvidence: "visible source label: Espacios destinados a estacionamiento (bicicleta)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Tachas no reflectivas",
    russianTranslation: "несветоотражающие дорожные кнопки",
    cropRegion: { x: 352, y: 455, width: 150, height: 70 },
    sourceSheetLabelEvidence: "visible source label: Tachas no reflectivas",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Espacios restringidos al estacionamiento",
    russianTranslation: "зоны с ограничением парковки",
    cropRegion: { x: 154, y: 530, width: 130, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Espacios restringidos al estacionamiento",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Tachas reflectivas",
    russianTranslation: "светоотражающие дорожные кнопки",
    cropRegion: { x: 353, y: 531, width: 150, height: 75 },
    sourceSheetLabelEvidence: "visible source label: Tachas reflectivas",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Ceda el paso / Velocidad máxima / Carril exclusivo / Parada",
    variant: "Emergencia",
    russianTranslation: "надписи и символы на покрытии: уступи дорогу, максимальная скорость, выделенная полоса, аварийная остановка",
    cropRegion: { x: 144, y: 606, width: 150, height: 95 },
    sourceSheetLabelEvidence: "visible source label: Ceda el paso / Velocidad máxima / Carril exclusivo / Parada (Emergencia)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Delineadores",
    variant: "Canalizan o guían al tránsito y destacan variaciones en la vía",
    russianTranslation: "делинеаторы; направляют поток и выделяют изменения дороги",
    cropRegion: { x: 350, y: 602, width: 155, height: 110 },
    sourceSheetLabelEvidence: "visible source label: Delineadores (Canalizan o guían al tránsito y destacan variaciones en la vía)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Advertencia de cruce ferroviario",
    russianTranslation: "предупреждение о железнодорожном переезде",
    cropRegion: { x: 151, y: 683, width: 145, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Advertencia de cruce ferroviario",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Para niebla",
    variant: "Si se ve una: máx. 40 km/h, si se ven dos: máx. 60 km/h",
    russianTranslation: "разметка для тумана: одна отметка - максимум 40 км/ч, две - максимум 60 км/ч",
    cropRegion: { x: 354, y: 684, width: 150, height: 95 },
    sourceSheetLabelEvidence: "visible source label: Para niebla (Si se ve una: máx. 40 km/h, si se ven dos: máx. 60 km/h)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-horizontal",
    sourcePage: 196,
    sourceCardId: "app4-horizontal-page-196-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Separadores físicos de tránsito",
    russianTranslation: "физические разделители движения",
    cropRegion: { x: 145, y: 762, width: 165, height: 95 },
    sourceSheetLabelEvidence: "visible source label: Separadores físicos de tránsito",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sourcePage: 197,
    sourceCardId: "app4-traffic-lights-page-197-source-card",
    entryKind: "category-heading",
    spanishLabel: "Señalamiento luminoso",
    russianTranslation: "Световая сигнализация",
    cropRegion: { x: 132, y: 130, width: 350, height: 42 },
    sourceSheetLabelEvidence: "visible source heading: Señalamiento luminoso",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sourcePage: 197,
    sourceCardId: "app4-traffic-lights-page-197-source-card",
    entryKind: "category-heading",
    spanishLabel: "Significado de las luces",
    russianTranslation: "Значение огней",
    cropRegion: { x: 132, y: 171, width: 260, height: 30 },
    sourceSheetLabelEvidence: "visible source heading: Significado de las luces",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sourcePage: 197,
    sourceCardId: "app4-traffic-lights-page-197-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "ROJO / ROJO INTERMITENTE / AMARILLO / AMARILLO INTERMITENTE / VERDE",
    variant: "bloque explicativo",
    russianTranslation: "красный, мигающий красный, желтый, мигающий желтый, зеленый",
    cropRegion: { x: 156, y: 219, width: 306, height: 165 },
    sourceSheetLabelEvidence: "visible source label: ROJO / ROJO INTERMITENTE / AMARILLO / AMARILLO INTERMITENTE / VERDE (bloque explicativo)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sourcePage: 197,
    sourceCardId: "app4-traffic-lights-page-197-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "FLECHAS DIRECCIONALES",
    russianTranslation: "направляющие стрелки",
    cropRegion: { x: 424, y: 211, width: 155, height: 122 },
    sourceSheetLabelEvidence: "visible source label: FLECHAS DIRECCIONALES",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sourcePage: 197,
    sourceCardId: "app4-traffic-lights-page-197-source-card",
    entryKind: "category-heading",
    spanishLabel: "Disposición de unidades ópticas",
    russianTranslation: "Расположение оптических блоков",
    cropRegion: { x: 132, y: 396, width: 336, height: 31 },
    sourceSheetLabelEvidence: "visible source heading: Disposición de unidades ópticas",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sourcePage: 197,
    sourceCardId: "app4-traffic-lights-page-197-source-card",
    entryKind: "contextual-visual",
    spanishLabel: "Disposición de unidades ópticas",
    variant: "vertical",
    russianTranslation: "вертикальное расположение секций",
    cropRegion: { x: 158, y: 438, width: 36, height: 320 },
    sourceSheetLabelEvidence: "visible source contextual visual: Disposición de unidades ópticas (vertical)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sourcePage: 197,
    sourceCardId: "app4-traffic-lights-page-197-source-card",
    entryKind: "contextual-visual",
    spanishLabel: "Disposición de unidades ópticas",
    variant: "horizontal",
    russianTranslation: "горизонтальное расположение секций",
    cropRegion: { x: 248, y: 444, width: 298, height: 32 },
    sourceSheetLabelEvidence: "visible source contextual visual: Disposición de unidades ópticas (horizontal)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sourcePage: 197,
    sourceCardId: "app4-traffic-lights-page-197-source-card",
    entryKind: "category-heading",
    spanishLabel: "Semáforos especiales",
    russianTranslation: "Специальные светофоры",
    cropRegion: { x: 225, y: 518, width: 250, height: 31 },
    sourceSheetLabelEvidence: "visible source heading: Semáforos especiales",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sourcePage: 197,
    sourceCardId: "app4-traffic-lights-page-197-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Esperar",
    variant: "peatones",
    russianTranslation: "ждать",
    cropRegion: { x: 249, y: 572, width: 105, height: 38 },
    sourceSheetLabelEvidence: "visible source label: Esperar (peatones)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sourcePage: 197,
    sourceCardId: "app4-traffic-lights-page-197-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Avanzar",
    variant: "peatones",
    russianTranslation: "идти",
    cropRegion: { x: 249, y: 613, width: 105, height: 38 },
    sourceSheetLabelEvidence: "visible source label: Avanzar (peatones)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sourcePage: 197,
    sourceCardId: "app4-traffic-lights-page-197-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "Prevención de peligro y advertencia de intersecciones",
    variant: "intermitentes",
    russianTranslation: "предупреждение об опасности и перекрестках",
    cropRegion: { x: 443, y: 572, width: 155, height: 74 },
    sourceSheetLabelEvidence: "visible source label: Prevención de peligro y advertencia de intersecciones (intermitentes)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sourcePage: 197,
    sourceCardId: "app4-traffic-lights-page-197-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CRUCE FERROVIAL",
    russianTranslation: "железнодорожный переезд",
    cropRegion: { x: 247, y: 660, width: 142, height: 154 },
    sourceSheetLabelEvidence: "visible source label: CRUCE FERROVIAL",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-traffic-lights",
    sourcePage: 197,
    sourceCardId: "app4-traffic-lights-page-197-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CARRILES REVERSIBLES",
    russianTranslation: "реверсивные полосы",
    cropRegion: { x: 423, y: 698, width: 176, height: 114 },
    sourceSheetLabelEvidence: "visible source label: CARRILES REVERSIBLES",
    auditStatus: "reconciled-source-visual"
  }
];

const visualSourceEntriesByCard = visualSourceEntries.reduce((entriesByCard, entry, sourceEntryIndex) => {
  const entries = entriesByCard.get(entry.sourceCardId) ?? [];
  entries.push({ entry, sourceEntryIndex });
  entriesByCard.set(entry.sourceCardId, entries);
  return entriesByCard;
}, new Map());

const visualSourceEntriesSourcePath = "scripts/manual-sign-inventory.mjs";

const visualSourceSectionIds = new Set(["app4-signs-regulatory", "app4-signs-warning"]);

function isReconciledVisualScope(entry) {
  return (
    visualSourceSectionIds.has(entry.sectionId) ||
    (entry.sectionId === "app4-signs-informational" && [189, 190, 191, 192].includes(entry.sourcePage)) ||
    (entry.sectionId === "app4-signs-temporary" && [193, 194].includes(entry.sourcePage)) ||
    (entry.sectionId === "app4-signs-horizontal" && [195, 196].includes(entry.sourcePage)) ||
    (entry.sectionId === "app4-signs-traffic-lights" && entry.sourcePage === 197)
  );
}

function repoPath(relativePath) {
  return join(repoRoot, relativePath);
}

function readImageDimensions(relativePath) {
  const bytes = readFileSync(repoPath(relativePath));
  if (bytes.length >= 24 && bytes.readUInt32BE(0) === 0x89504e47) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (bytes.length >= 10 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") {
    const chunk = bytes.toString("ascii", 12, 16);
    if (chunk === "VP8X" && bytes.length >= 30) {
      return {
        width: 1 + bytes.readUIntLE(24, 3),
        height: 1 + bytes.readUIntLE(27, 3)
      };
    }
  }
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset < bytes.length) {
      while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
      const marker = bytes[offset];
      offset += 1;
      if (marker === 0xd9 || marker === 0xda) break;
      if (offset + 2 > bytes.length) break;
      const segmentLength = bytes.readUInt16BE(offset);
      if (segmentLength < 2 || offset + segmentLength > bytes.length) break;
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        return {
          width: bytes.readUInt16BE(offset + 5),
          height: bytes.readUInt16BE(offset + 3)
        };
      }
      offset += segmentLength;
    }
  }
  throw new Error(`Unsupported or unreadable image dimensions for ${relativePath}`);
}

function sha256File(relativePath) {
  return createHash("sha256").update(readFileSync(repoPath(relativePath))).digest("hex");
}

function skipQuoted(source, index, quote) {
  for (let cursor = index + 1; cursor < source.length; cursor += 1) {
    if (source[cursor] === "\\") {
      cursor += 1;
      continue;
    }
    if (source[cursor] === quote) return cursor;
  }
  return source.length - 1;
}

function braceStackAt(source, endIndex) {
  const stack = [];
  for (let index = 0; index < endIndex; index += 1) {
    const char = source[index];
    if (char === "\"" || char === "'" || char === "`") {
      index = skipQuoted(source, index, char);
      continue;
    }
    if (char === "{") stack.push(index);
    else if (char === "}") stack.pop();
  }
  return stack;
}

function balancedSourceSlice(source, startIndex, openChar, closeChar) {
  let depth = 0;
  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];
    if (char === "\"" || char === "'" || char === "`") {
      index = skipQuoted(source, index, char);
      continue;
    }
    if (char === openChar) depth += 1;
    else if (char === closeChar) {
      depth -= 1;
      if (depth === 0) return source.slice(startIndex, index + 1);
    }
  }
  return null;
}

function unescapeStringLiteral(value) {
  return JSON.parse(`"${value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}"`);
}

function extractAssetRoot(source, sectionFile) {
  const match = source.match(/const\s+assetRoot\s*=\s*"([^"]+)"/su);
  if (!match) throw new Error(`Could not find assetRoot in ${sectionFile}`);
  return match[1];
}

function extractTerms(cardSource) {
  const termsIndex = cardSource.indexOf("termTranslations:");
  if (termsIndex === -1) return [];
  const arrayStart = cardSource.indexOf("[", termsIndex);
  const arraySource = balancedSourceSlice(cardSource, arrayStart, "[", "]");
  if (!arraySource) return [];
  return [...arraySource.matchAll(/termEs:\s*"((?:\\.|[^"\\])*)"\s*,\s*translationRu:\s*"((?:\\.|[^"\\])*)"/gsu)].map((match) => ({
    termEs: unescapeStringLiteral(match[1]),
    translationRu: unescapeStringLiteral(match[2])
  }));
}

function extractCards(section) {
  const source = readFileSync(repoPath(section.sectionFile), "utf8");
  const assetRoot = extractAssetRoot(source, section.sectionFile);
  const cards = [];
  let cursor = 0;
  while (cursor < source.length) {
    const termTranslationsIndex = source.indexOf("termTranslations:", cursor);
    if (termTranslationsIndex === -1) break;
    const stack = braceStackAt(source, termTranslationsIndex);
    const objectStart = stack.at(-1);
    const cardSource = typeof objectStart === "number" ? balancedSourceSlice(source, objectStart, "{", "}") : null;
    cursor = termTranslationsIndex + "termTranslations:".length;
    if (!cardSource) continue;
    const id = cardSource.match(/\bid:\s*"([^"]+)"/su)?.[1] ?? null;
    const sourcePage = Number(cardSource.match(/\bsourcePage:\s*(\d+)/su)?.[1] ?? NaN);
    const assetTemplate = cardSource.match(/\bassetPath:\s*`([^`]+)`/su)?.[1] ?? cardSource.match(/\bassetPath:\s*"([^"]+)"/su)?.[1] ?? null;
    const assetPath = assetTemplate?.replace("${assetRoot}", assetRoot) ?? null;
    const regionMatch = cardSource.match(
      /\bsourceRegion:\s*\{\s*x:\s*(\d+),\s*y:\s*(\d+),\s*width:\s*(\d+),\s*height:\s*(\d+)\s*\}/su
    );
    if (!id || !Number.isInteger(sourcePage) || !assetPath) continue;
    cards.push({
      id,
      sectionId: section.sectionId,
      sectionFile: section.sectionFile,
      sourcePage,
      sourceRegion: regionMatch
        ? {
            x: Number(regionMatch[1]),
            y: Number(regionMatch[2]),
            width: Number(regionMatch[3]),
            height: Number(regionMatch[4])
          }
        : null,
      assetPath,
      terms: extractTerms(cardSource)
    });
  }
  return cards;
}

function shouldIncludeCard(section, card) {
  if (section.includeCardIds) return section.includeCardIds.has(card.id);
  if (section.includeCardIdPattern) return section.includeCardIdPattern.test(card.id);
  return false;
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "")
    .slice(0, 48) || "entry";
}

function countBy(entries, key) {
  return entries.reduce((counts, entry) => {
    const value = String(entry[key]);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function clampRegionToDimensions(region, dimensions) {
  const x = Math.max(0, Math.min(region.x, dimensions.width - 1));
  const y = Math.max(0, Math.min(region.y, dimensions.height - 1));
  const width = Math.max(1, Math.min(region.width, dimensions.width - x));
  const height = Math.max(1, Math.min(region.height, dimensions.height - y));
  return { x, y, width, height };
}

function regionForGridCell(config, termIndex, termCount, dimensions) {
  const columns = Math.max(1, config?.columns ?? Math.ceil(Math.sqrt(termCount)));
  const rows = Math.max(1, config?.rows ?? Math.ceil(termCount / columns));
  const bounds = clampRegionToDimensions(
    config?.bounds ?? { x: 0, y: 0, width: dimensions.width, height: dimensions.height },
    dimensions
  );
  const column = termIndex % columns;
  const row = Math.floor(termIndex / columns);
  const safeRow = Math.min(row, rows - 1);
  const x1 = Math.round(bounds.x + (bounds.width * column) / columns);
  const y1 = Math.round(bounds.y + (bounds.height * safeRow) / rows);
  const x2 = Math.round(bounds.x + (bounds.width * (column + 1)) / columns);
  const y2 = Math.round(bounds.y + (bounds.height * (safeRow + 1)) / rows);
  return clampRegionToDimensions(
    {
      x: x1,
      y: y1,
      width: Math.max(1, x2 - x1),
      height: Math.max(1, y2 - y1)
    },
    dimensions
  );
}

function cropRegionForEntry(card, termIndex, termCount, dimensions) {
  const explicitRegions = manualCropRegionsByCard.get(card.id);
  if (explicitRegions) {
    if (termIndex >= explicitRegions.length) {
      throw new Error(`${card.id}: missing explicit crop region for term index ${termIndex}`);
    }
    return clampRegionToDimensions(explicitRegions[termIndex], dimensions);
  }
  const config = cardGridConfigs.get(card.id);
  return regionForGridCell(config, termIndex, termCount, dimensions);
}

function buildInventory() {
  const entries = [];
  const pageCounters = new Map();
  const cardInventorySources = [];
  const p198To200Pages = [];

  for (const section of sourceSections) {
    const cards = extractCards(section);
    for (const card of cards) {
      if (card.sectionId === "app4-signs-traffic-lights" && [198, 199, 200].includes(card.sourcePage)) {
        p198To200Pages.push({
          sourcePage: card.sourcePage,
          sourceCardId: card.id,
          sourceAsset: card.assetPath,
          naturalWidth: existsSync(repoPath(card.assetPath)) ? readImageDimensions(card.assetPath).width : null,
          naturalHeight: existsSync(repoPath(card.assetPath)) ? readImageDimensions(card.assetPath).height : null,
          hash: existsSync(repoPath(card.assetPath)) ? sha256File(card.assetPath) : null,
          decision: "excluded-contextual-closing-visual",
          reason:
            "Page is outside the p185-197 individual catalog-entry scope for this feature slice; existing section data treats it as closing message, illustration, or logo material rather than page-197 signal catalog rows."
        });
      }
      if (!shouldIncludeCard(section, card)) continue;
      if (!scopePages.includes(card.sourcePage)) continue;
      const dimensions = readImageDimensions(card.assetPath);
      const hash = sha256File(card.assetPath);
      const visualEntries = visualSourceEntriesByCard.get(card.id);
      if (visualSourceSectionIds.has(section.sectionId) && !visualEntries) {
        throw new Error(`${card.id}: regulatory/warning cards must use explicit visualSourceEntries`);
      }
      const explicitRegions = manualCropRegionsByCard.get(card.id);
      if (explicitRegions && explicitRegions.length !== card.terms.length) {
        throw new Error(`${card.id}: explicit crop region count ${explicitRegions.length} must match term count ${card.terms.length}`);
      }
      cardInventorySources.push({
        sectionId: section.sectionId,
        sourceCardId: card.id,
        sourcePage: card.sourcePage,
        assetPath: card.assetPath,
        termCount: card.terms.length,
        visualSourceEntryCount: visualEntries?.length ?? null,
        sourceSelectionNote: section.sourceSelectionNote
      });
      if (visualEntries) {
        visualEntries.forEach(({ entry: visualEntry, sourceEntryIndex }) => {
          const cropRegion = clampRegionToDimensions(visualEntry.cropRegion, dimensions);
          const sourceOrder = entries.length + 1;
          const pageOrder = (pageCounters.get(card.sourcePage) ?? 0) + 1;
          pageCounters.set(card.sourcePage, pageOrder);
          entries.push({
            id: `${section.sectionId.replace("app4-signs-", "app4")}-p${card.sourcePage}-${String(pageOrder).padStart(3, "0")}-${slugify(`${visualEntry.spanishLabel}-${visualEntry.variant ?? visualEntry.entryKind}`)}`,
            sectionId: section.sectionId,
            sourcePage: card.sourcePage,
            sourceOrder,
            sourceOrderWithinPage: pageOrder,
            entryKind: visualEntry.entryKind,
            spanishLabel: visualEntry.spanishLabel,
            ...(visualEntry.variant ? { variant: visualEntry.variant } : {}),
            russianTranslation: visualEntry.russianTranslation,
            sourceSheetLabelEvidence: visualEntry.sourceSheetLabelEvidence,
            auditStatus: visualEntry.auditStatus,
            sourceRef: `${visualSourceEntriesSourcePath}#visualSourceEntries[${sourceEntryIndex}](${card.id})`,
            sourceAsset: card.assetPath,
            sourceRegion: card.sourceRegion,
            assetPath: card.assetPath,
            naturalWidth: dimensions.width,
            naturalHeight: dimensions.height,
            cropRegion,
            displayRegion: cropRegion,
            cropNaturalWidth: cropRegion.width,
            cropNaturalHeight: cropRegion.height,
            renderMode,
            hash,
            extractionMethod:
              "source-image-css-clip-from-existing-official-source-as-is-asset; no crop file written or re-encoded",
            noUpscale: true,
            preservationNote:
              "Entry uses a CSS-clipped viewport over the unchanged official source-as-is sheet or panel asset. Protected sign, marking, signal, plate/tablet, pictogram, arrow, border, color, and embedded-text pixels are not edited, redrawn, cleaned, translated, or re-encoded."
          });
        });
        continue;
      }
      card.terms.forEach((term, termIndex) => {
        const cropRegion = cropRegionForEntry(card, termIndex, card.terms.length, dimensions);
        const sourceOrder = entries.length + 1;
        const pageOrder = (pageCounters.get(card.sourcePage) ?? 0) + 1;
        pageCounters.set(card.sourcePage, pageOrder);
        entries.push({
          id: `${section.sectionId.replace("app4-signs-", "app4")}-p${card.sourcePage}-${String(pageOrder).padStart(3, "0")}-${slugify(term.termEs)}`,
          sectionId: section.sectionId,
          sourcePage: card.sourcePage,
          sourceOrder,
          sourceOrderWithinPage: pageOrder,
          entryKind: "catalog-entry",
          spanishLabel: term.termEs,
          russianTranslation: term.translationRu,
          sourceSheetLabelEvidence: "pending visual-source reconciliation",
          auditStatus: "pending-reconciliation",
          sourceRef: `${section.sectionFile}#${card.id}.termTranslations[${termIndex}]`,
          sourceAsset: card.assetPath,
          sourceRegion: card.sourceRegion,
          assetPath: card.assetPath,
          naturalWidth: dimensions.width,
          naturalHeight: dimensions.height,
          cropRegion,
          displayRegion: cropRegion,
          cropNaturalWidth: cropRegion.width,
          cropNaturalHeight: cropRegion.height,
          renderMode,
          hash,
          extractionMethod:
            "source-image-css-clip-from-existing-official-source-as-is-asset; no crop file written or re-encoded",
          noUpscale: true,
          preservationNote:
            "Entry uses a CSS-clipped viewport over the unchanged official source-as-is sheet or panel asset. Protected sign, marking, signal, plate/tablet, pictogram, arrow, border, color, and embedded-text pixels are not edited, redrawn, cleaned, translated, or re-encoded."
        });
      });
    }
  }

  const entriesBySection = countBy(entries, "sectionId");
  const entriesBySourcePage = countBy(entries, "sourcePage");
  return {
    schemaVersion: 1,
    featureId: "036-manual-sign-pages",
    manualId,
    inventoryStatus: "individual-source-regions",
    generatedFrom: sourceSections.map(({ sectionId, sectionFile }) => ({ sectionId, sectionFile })),
    scope: {
      includedSourcePages: scopePages,
      excludedSourcePages: [198, 199, 200],
      sourceDocument
    },
    summary: {
      totalEntries: entries.length,
      entriesBySection,
      entriesBySourcePage
    },
    sourceSelection: {
      status: "mixed-visual-source-reconciled-and-pending-reconciliation",
      note:
        "Regulatory, warning, informational source pages 189-191, the page 192 contextual visual, temporary source pages 193-194, horizontal source pages 195-196, and traffic-light/signal source page 197 slice entries are generated from explicit visualSourceEntries. All in-scope source pages now use audited visual source rows, and no generated, redrawn, cleaned, translated, or re-encoded crop files are written.",
      cardInventorySources
    },
    p198To200Disposition: {
      status: "recorded",
      decision: "excluded-from-slice-1-individual-catalog-inventory",
      pages: p198To200Pages.sort((left, right) => left.sourcePage - right.sourcePage),
      evidence:
        "Existing app4-signs-traffic-lights source cards for pages 198-200 were parsed and retained as contextual closing visuals, not source pages inside the p185-197 governed sign-entry inventory."
    },
    entries
  };
}

function isSignLikeEntry(entry) {
  return entry.entryKind === "catalog-entry" || entry.entryKind === "contextual-visual";
}

function isRegulatoryDetachedLabelAttachmentEntry(entry) {
  const searchable = `${entry.id} ${entry.spanishLabel ?? ""} ${entry.variant ?? ""}`.toLowerCase();
  return (
    entry.sectionId === "app4-signs-regulatory" &&
    (entry.baselineCropNaturalHeight >= 110 ||
      /placa|zona-de-caudales|ciclovia|exclusivo|discapacitados|ciclistas|peatones|barreras|ferroviarias|cajon|descienda|convivencia|interrupcion|desvio|obra|parada|evento|frentistas/.test(searchable))
  );
}

function applyFeature037Inventory(baseInventory) {
  if (!existsSync(repoPath(feature037FinalRowsPath))) {
    return baseInventory;
  }
  const finalRowsDocument = JSON.parse(readFileSync(repoPath(feature037FinalRowsPath), "utf8"));
  const finalSummary = JSON.parse(readFileSync(repoPath(feature037FinalSummaryPath), "utf8"));
  const finalRowsById = new Map(finalRowsDocument.rows.map((row) => [row.id, row]));
  const entries = baseInventory.entries.map((entry) => {
    const finalRow = finalRowsById.get(entry.id);
    if (!finalRow) throw new Error(`${entry.id}: missing feature 037 final row evidence`);
    const baselineFields = {
      baselineSourceAsset: finalRow.baselineSourceAsset,
      baselineSourceRegion: finalRow.baselineSourceRegion,
      baselineCropRegion: finalRow.baselineCropRegion,
      baselineCropNaturalWidth: finalRow.baselineCropNaturalWidth,
      baselineCropNaturalHeight: finalRow.baselineCropNaturalHeight,
      baselineRenderMode: finalRow.baselineRenderMode,
      baselineAssetHash: finalRow.baselineAssetHash,
      baselineExtractionMethod: finalRow.baselineExtractionMethod
    };

    if (!isSignLikeEntry(entry)) {
      return {
        ...entry,
        ...baselineFields,
        auditStatus: "category-heading-dom",
        assetPath: null,
        naturalWidth: null,
        naturalHeight: null,
        cropRegion: null,
        displayRegion: null,
        cropNaturalWidth: null,
        cropNaturalHeight: null,
        renderMode: "category-heading-dom",
        hash: null,
        extractionMethod: finalRow.extractionMethod,
        noUpscale: true,
        preservationNote: finalRow.protectedPixelPreservation,
        disposition: finalRow.disposition,
        threeXStatus: finalRow.threeXStatus,
        cropAuditStatus: finalRow.cropAuditStatus,
        noUpscaleProof: finalRow.noUpscaleProof,
        protectedPixelPreservation: finalRow.protectedPixelPreservation
      };
    }

    return {
      ...entry,
      ...baselineFields,
      auditStatus: finalRow.cropAuditStatus,
      sourceAsset: finalRow.finalSourceDocument,
      assetPath: finalRow.finalOutputAssetPath,
      naturalWidth: finalRow.finalOutputNaturalWidth,
      naturalHeight: finalRow.finalOutputNaturalHeight,
      cropRegion: { x: 0, y: 0, width: finalRow.finalOutputNaturalWidth, height: finalRow.finalOutputNaturalHeight },
      displayRegion: { x: 0, y: 0, width: finalRow.finalOutputNaturalWidth, height: finalRow.finalOutputNaturalHeight },
      cropNaturalWidth: finalRow.finalOutputNaturalWidth,
      cropNaturalHeight: finalRow.finalOutputNaturalHeight,
      renderMode: finalRow.renderMode,
      hash: finalRow.finalOutputSha256,
      extractionMethod: finalRow.extractionMethod,
      noUpscale: true,
      preservationNote: finalRow.protectedPixelPreservation,
      disposition: finalRow.disposition,
      sourceEvaluationId: finalRow.sourceEvaluationId,
      chosenSourceId: finalRow.chosenSourceId,
      finalSourceDocument: finalRow.finalSourceDocument,
      finalSourceTrustTier: finalRow.finalSourceTrustTier,
      finalSourcePageOrItem: finalRow.finalSourcePageOrItem,
      finalCandidateRegionAtBaseScale: finalRow.finalCandidateRegionAtBaseScale,
      finalSourceRegionAtBaseScale: finalRow.finalSourceRegionAtBaseScale,
      finalContentTrimBoundsAtCandidateScale: finalRow.finalContentTrimBoundsAtCandidateScale,
      finalTailTrimMode: finalRow.finalTailTrimMode,
      finalOutputAssetPath: finalRow.finalOutputAssetPath,
      finalOutputNaturalWidth: finalRow.finalOutputNaturalWidth,
      finalOutputNaturalHeight: finalRow.finalOutputNaturalHeight,
      finalOutputSha256: finalRow.finalOutputSha256,
      finalOutputComposition: finalRow.finalOutputComposition,
      requiredMinimumWidth: finalRow.requiredMinimumWidth,
      requiredMinimumHeight: finalRow.requiredMinimumHeight,
      outputPixelScaleRatioWidth: finalRow.outputPixelScaleRatioWidth,
      outputPixelScaleRatioHeight: finalRow.outputPixelScaleRatioHeight,
      outputPixelTargetRatioWidth: finalRow.outputPixelTargetRatioWidth,
      outputPixelTargetRatioHeight: finalRow.outputPixelTargetRatioHeight,
      effectiveFinalNaturalWidth: finalRow.effectiveFinalNaturalWidth,
      effectiveFinalNaturalHeight: finalRow.effectiveFinalNaturalHeight,
      sourceNativeWidth: finalRow.sourceNativeWidth,
      sourceNativeHeight: finalRow.sourceNativeHeight,
      qualityScaleRatioWidth: finalRow.qualityScaleRatioWidth,
      qualityScaleRatioHeight: finalRow.qualityScaleRatioHeight,
      threeXStatus: finalRow.threeXStatus,
      sourceLimitedExceptionId: finalRow.sourceLimitedExceptionId,
      sourceLimitedDisposition: finalRow.sourceLimitedDisposition,
      sourceLimitedReason: finalRow.sourceLimitedReason,
      cropAuditStatus: finalRow.cropAuditStatus,
      cropAuditBasis: finalRow.cropAuditBasis,
      cropAuditNote: finalRow.cropAuditNote,
      runtimeDisplayMaxWidth: finalRow.runtimeDisplayMaxWidth,
      runtimeDisplayMaxHeight: finalRow.runtimeDisplayMaxHeight,
      noUpscaleProof: finalRow.noUpscaleProof,
      protectedPixelPreservation: finalRow.protectedPixelPreservation
    };
  });

  return {
    ...baseInventory,
    featureId: feature037Id,
    inventoryStatus: "individual-source-crop-3x-source-limited",
    sourceSelection: {
      ...baseInventory.sourceSelection,
      status: "feature-037-final-source-limited-crops",
      note:
        "Feature 037 replaces learner-facing sign-like CSS sheet clips with committed per-row official-source PNG crops. All sign-like rows are source-limited exceptions under the 2026-06-07T21:36:51Z Architect disposition and must not be described as true native/effective 3x passes."
    },
    feature037Evidence: {
      finalRowsPath: feature037FinalRowsPath,
      finalSummaryPath: feature037FinalSummaryPath,
      sourceManifestPath: feature037SourceManifestPath,
      rowSourceMappingPath: feature037RowSourceMappingPath,
      sourceLimitedDisposition: "best-official-source-3x-output-pixels",
      architectDispositionAcceptedAt: "2026-06-07T21:36:51Z"
    },
    summary: {
      ...baseInventory.summary,
      totalEntries: entries.length,
      entriesBySection: countBy(entries, "sectionId"),
      entriesBySourcePage: countBy(entries, "sourcePage"),
      entriesByKind: countBy(entries, "entryKind"),
      renderModeCounts: countBy(entries, "renderMode"),
      signLikeRows: finalSummary.signLikeRows,
      categoryHeadingRows: finalSummary.categoryHeadingRows,
      outputPixelThreeXRows: finalSummary.outputPixelThreeXRows,
      trueNativeEffectiveThreeXPassRows: finalSummary.trueNativeEffectiveThreeXPassRows,
      sourceLimitedExceptionRows: finalSummary.sourceLimitedExceptionRows,
      sourceLimitedDispositionCounts: finalSummary.sourceLimitedDispositionCounts
    },
    entries
  };
}

function assertCondition(condition, message, errors) {
  if (!condition) errors.push(message);
}

function validateFeature037Inventory(inventory) {
  const errors = [];
  assertCondition(inventory?.schemaVersion === 1, "schemaVersion must be 1.", errors);
  assertCondition(inventory?.featureId === feature037Id, `featureId must be ${feature037Id}.`, errors);
  assertCondition(inventory?.inventoryStatus === "individual-source-crop-3x-source-limited", "inventoryStatus must be individual-source-crop-3x-source-limited.", errors);
  assertCondition(existsSync(repoPath(feature037FinalRowsPath)), `${feature037FinalRowsPath} must exist.`, errors);
  assertCondition(existsSync(repoPath(feature037FinalSummaryPath)), `${feature037FinalSummaryPath} must exist.`, errors);
  assertCondition(existsSync(repoPath(feature037SourceManifestPath)), `${feature037SourceManifestPath} must exist.`, errors);
  assertCondition(existsSync(repoPath(feature037RowSourceMappingPath)), `${feature037RowSourceMappingPath} must exist.`, errors);

  const finalRowsDocument = existsSync(repoPath(feature037FinalRowsPath))
    ? JSON.parse(readFileSync(repoPath(feature037FinalRowsPath), "utf8"))
    : { rows: [] };
  const finalRowsById = new Map((finalRowsDocument.rows ?? []).map((row) => [row.id, row]));
  const entries = inventory?.entries ?? [];
  const seenIds = new Set();
  const pageOrders = new Map();

  entries.forEach((entry, index) => {
    const label = entry?.id ?? `entries[${index}]`;
    const finalRow = finalRowsById.get(entry.id);
    assertCondition(Boolean(finalRow), `${label}: final feature 037 evidence row is required.`, errors);
    assertCondition(typeof entry.id === "string" && entry.id.trim() !== "", `${label}: id is required.`, errors);
    assertCondition(!seenIds.has(entry.id), `${label}: id must be unique.`, errors);
    seenIds.add(entry.id);
    assertCondition(validSectionPages.has(entry.sectionId), `${label}: sectionId is invalid.`, errors);
    assertCondition(Number.isInteger(entry.sourcePage) && scopePages.includes(entry.sourcePage), `${label}: sourcePage must be in 185-197.`, errors);
    assertCondition(entry.sourceOrder === index + 1, `${label}: sourceOrder must be contiguous from 1.`, errors);
    assertCondition(Number.isInteger(entry.sourceOrderWithinPage) && entry.sourceOrderWithinPage > 0, `${label}: sourceOrderWithinPage must be a positive integer.`, errors);
    (pageOrders.get(entry.sourcePage) ?? pageOrders.set(entry.sourcePage, []).get(entry.sourcePage)).push(entry.sourceOrderWithinPage);
    assertCondition(typeof entry.spanishLabel === "string" && entry.spanishLabel.trim() !== "", `${label}: spanishLabel is required.`, errors);
    assertCondition(typeof entry.russianTranslation === "string" && entry.russianTranslation.trim() !== "", `${label}: russianTranslation is required.`, errors);
    assertCondition(entry.noUpscale === true, `${label}: noUpscale must be true.`, errors);
    assertCondition(entry.baselineRenderMode === "source-image-css-clip", `${label}: baselineRenderMode must record source-image-css-clip.`, errors);

    if (!isSignLikeEntry(entry)) {
      assertCondition(entry.renderMode === "category-heading-dom", `${label}: category headings must render as DOM.`, errors);
      assertCondition(entry.assetPath === null, `${label}: category headings must not require final raster assets.`, errors);
      assertCondition(entry.threeXStatus === "not-applicable-category-heading", `${label}: heading threeXStatus must be not-applicable-category-heading.`, errors);
      assertCondition(entry.cropAuditStatus === "category-heading-dom", `${label}: heading cropAuditStatus must be category-heading-dom.`, errors);
      return;
    }

    assertCondition(entry.renderMode === "individual-source-crop-3x", `${label}: sign-like renderMode must be individual-source-crop-3x.`, errors);
    assertCondition(entry.renderMode !== renderMode, `${label}: sign-like entry must not use old ${renderMode}.`, errors);
    assertCondition(typeof entry.assetPath === "string" && entry.assetPath.includes("/individual-3x/"), `${label}: final individual asset path is required.`, errors);
    assertCondition(typeof entry.finalOutputAssetPath === "string" && entry.finalOutputAssetPath === entry.assetPath, `${label}: finalOutputAssetPath must match assetPath.`, errors);
    assertCondition(entry.threeXStatus === "source-limited-exception", `${label}: sign-like row must remain source-limited-exception.`, errors);
    assertCondition(entry.sourceLimitedDisposition === "best-official-source-3x-output-pixels", `${label}: sourceLimitedDisposition is required.`, errors);
    assertCondition(entry.cropAuditStatus === "reviewed-final-correct", `${label}: cropAuditStatus must be reviewed-final-correct.`, errors);
    assertCondition(entry.cropAuditBasis?.passes === true, `${label}: cropAuditBasis.passes must be true.`, errors);
    assertCondition(entry.cropAuditBasis?.outputPixelTargetPass === true, `${label}: cropAuditBasis.outputPixelTargetPass must be true.`, errors);
    assertCondition(entry.cropAuditBasis?.sourceBoundsPass === true, `${label}: cropAuditBasis.sourceBoundsPass must be true.`, errors);
    assertCondition(entry.cropAuditBasis?.edgeContactPass === true, `${label}: cropAuditBasis.edgeContactPass must be true.`, errors);
    assertCondition(entry.cropAuditBasis?.neighborContaminationGuardPass === true, `${label}: cropAuditBasis.neighborContaminationGuardPass must be true.`, errors);
    if (entry.sectionId === "app4-signs-warning") {
      assertCondition(entry.cropAuditBasis?.warningRightEdgeGuardPass === true, `${label}: cropAuditBasis.warningRightEdgeGuardPass must be true.`, errors);
      assertCondition(entry.cropAuditBasis?.warningLeftEdgeGuardPass === true, `${label}: cropAuditBasis.warningLeftEdgeGuardPass must be true.`, errors);
      assertCondition(entry.cropAuditBasis?.edgeContact?.right !== true, `${label}: warning crops must not pass with right-edge contact.`, errors);
    }
    if (isRegulatoryDetachedLabelAttachmentEntry(entry)) {
      assertCondition(entry.cropAuditBasis?.regulatoryDetachedLabelRightEdgeGuardPass === true, `${label}: cropAuditBasis.regulatoryDetachedLabelRightEdgeGuardPass must be true.`, errors);
      assertCondition(entry.cropAuditBasis?.regulatoryDetachedLabelSourceLabelTrimPass === true, `${label}: cropAuditBasis.regulatoryDetachedLabelSourceLabelTrimPass must be true.`, errors);
      assertCondition(entry.finalTailTrimMode === "preserve-colorless-lower-attachment-trim-detached-source-label", `${label}: regulatory attachment crop must use detached-label trim mode.`, errors);
      if (entry.cropAuditBasis?.edgeContact?.right === true) {
        const withinWidthGuard =
          entry.cropAuditBasis.relativeSourceWidthRatio <= entry.cropAuditBasis.regulatoryDetachedLabelRightEdgeMaximumRelativeWidthRatio;
        const withinPixelGuard = entry.cropAuditBasis?.regulatoryDetachedLabelRightEdgePixelGuardPass === true;
        assertCondition(
          withinWidthGuard || withinPixelGuard,
          `${label}: regulatory attachment right-edge contact must stay within the clean attachment width or edge-pixel guard.`,
          errors
        );
      }
      assertCondition(
        entry.cropAuditBasis.relativeSourceHeightRatio <= entry.cropAuditBasis.regulatoryDetachedLabelMaximumRelativeHeightRatio,
        `${label}: regulatory attachment crop must trim detached source captions.`,
        errors
      );
    }
    if (entry.sectionId === "app4-signs-regulatory" && /zona-de-caudales/.test(`${entry.id} ${entry.spanishLabel ?? ""} ${entry.variant ?? ""}`.toLowerCase())) {
      assertCondition(entry.cropAuditBasis?.regulatoryCaudalesRightEdgeGuardPass === true, `${label}: cropAuditBasis.regulatoryCaudalesRightEdgeGuardPass must be true.`, errors);
      assertCondition(entry.cropAuditBasis?.regulatoryCaudalesSourceLabelTrimPass === true, `${label}: cropAuditBasis.regulatoryCaudalesSourceLabelTrimPass must be true.`, errors);
      assertCondition(entry.cropAuditBasis?.edgeContact?.right !== true, `${label}: regulatory caudales crops must not pass with right-edge contact.`, errors);
      assertCondition(entry.finalTailTrimMode === "preserve-colorless-lower-attachment-trim-detached-source-label", `${label}: regulatory caudales crop must use detached-label trim mode.`, errors);
    }
    const regulatoryPage185ParkingText = `${entry.id} ${entry.spanishLabel ?? ""} ${entry.variant ?? ""}`.toLowerCase();
    const regulatoryPage185ParkingRow =
      entry.sectionId === "app4-signs-regulatory" &&
      entry.sourcePage === 185 &&
      /no-estacionar|no estacionar|detenerse/.test(regulatoryPage185ParkingText);
    const regulatoryPage185ParkingAttachmentRow =
      regulatoryPage185ParkingRow && /acarreo|zona-de-caudales|ciclovia/.test(regulatoryPage185ParkingText);
    if (regulatoryPage185ParkingRow) {
      assertCondition(entry.cropAuditBasis?.neighborContaminationGuardPass === true, `${label}: regulatory parking neighbor-contamination guard must pass.`, errors);
      assertCondition(entry.cropAuditBasis?.regulatoryParkingRightEdgeGuardPass === true, `${label}: cropAuditBasis.regulatoryParkingRightEdgeGuardPass must be true for page-185 parking rows.`, errors);
      assertCondition(entry.cropAuditBasis?.regulatoryParkingSourceLabelTrimPass === true, `${label}: cropAuditBasis.regulatoryParkingSourceLabelTrimPass must be true for page-185 parking rows.`, errors);
    }
    if (regulatoryPage185ParkingAttachmentRow) {
      assertCondition(entry.cropAuditBasis?.regulatoryParkingRightEdgeGuardPass === true, `${label}: cropAuditBasis.regulatoryParkingRightEdgeGuardPass must be true.`, errors);
      assertCondition(entry.cropAuditBasis?.regulatoryParkingSourceLabelTrimPass === true, `${label}: cropAuditBasis.regulatoryParkingSourceLabelTrimPass must be true.`, errors);
      if (entry.cropAuditBasis?.edgeContact?.right === true) {
        assertCondition(
          entry.cropAuditBasis.relativeSourceWidthRatio <= entry.cropAuditBasis.regulatoryParkingRightEdgeMaximumRelativeWidthRatio,
          `${label}: regulatory parking right-edge contact must stay within the clean attachment width guard.`,
          errors
        );
      }
      assertCondition(entry.finalTailTrimMode === "preserve-colorless-lower-attachment-trim-detached-source-label", `${label}: regulatory parking attachment crop must use detached-label trim mode.`, errors);
    }
    assertCondition(typeof entry.cropAuditBasis?.relativeSourceWidthRatio === "number", `${label}: cropAuditBasis.relativeSourceWidthRatio is required.`, errors);
    assertCondition(typeof entry.cropAuditBasis?.relativeSourceHeightRatio === "number", `${label}: cropAuditBasis.relativeSourceHeightRatio is required.`, errors);
    assertCondition(entry.noUpscaleProof?.passes === true, `${label}: noUpscaleProof must pass.`, errors);
    assertCondition(entry.finalOutputComposition?.includes("aspect-fit"), `${label}: finalOutputComposition must record aspect-fit output.`, errors);
    assertCondition(entry.protectedPixelPreservation?.includes("without stretching"), `${label}: protectedPixelPreservation must record no stretching.`, errors);
    assertCondition(entry.outputPixelScaleRatioWidth >= 3, `${label}: outputPixelScaleRatioWidth must be at least 3.`, errors);
    assertCondition(entry.outputPixelScaleRatioHeight >= 3, `${label}: outputPixelScaleRatioHeight must be at least 3.`, errors);
    assertCondition(entry.qualityScaleRatioWidth < 1, `${label}: qualityScaleRatioWidth must disclose source limitation.`, errors);
    assertCondition(entry.qualityScaleRatioHeight < 1, `${label}: qualityScaleRatioHeight must disclose source limitation.`, errors);
    assertCondition(entry.trueNativeEffectiveThreeXPass !== true, `${label}: must not claim true native/effective 3x pass.`, errors);
    assertCondition(entry.finalSourceDocument === sourceDocument, `${label}: finalSourceDocument must be the retained CABA manual PDF.`, errors);
    assertCondition(typeof entry.sourceEvaluationId === "string" && entry.sourceEvaluationId.startsWith("source-eval:"), `${label}: sourceEvaluationId is required.`, errors);

    if (entry.assetPath && existsSync(repoPath(entry.assetPath))) {
      const dimensions = readImageDimensions(entry.assetPath);
      const actualHash = sha256File(entry.assetPath);
      assertCondition(entry.naturalWidth === dimensions.width, `${label}: naturalWidth must match final PNG width.`, errors);
      assertCondition(entry.naturalHeight === dimensions.height, `${label}: naturalHeight must match final PNG height.`, errors);
      assertCondition(entry.finalOutputNaturalWidth === dimensions.width, `${label}: finalOutputNaturalWidth must match PNG width.`, errors);
      assertCondition(entry.finalOutputNaturalHeight === dimensions.height, `${label}: finalOutputNaturalHeight must match PNG height.`, errors);
      assertCondition(entry.hash === actualHash, `${label}: hash must match final PNG sha256.`, errors);
      assertCondition(entry.finalOutputSha256 === actualHash, `${label}: finalOutputSha256 must match final PNG sha256.`, errors);
      assertCondition(entry.naturalWidth >= entry.requiredMinimumWidth, `${label}: final PNG width below required output-pixel target.`, errors);
      assertCondition(entry.naturalHeight >= entry.requiredMinimumHeight, `${label}: final PNG height below required output-pixel target.`, errors);
      assertCondition(JSON.stringify(entry.cropRegion) === JSON.stringify({ x: 0, y: 0, width: dimensions.width, height: dimensions.height }), `${label}: final cropRegion must cover the individual PNG.`, errors);
      assertCondition(JSON.stringify(entry.displayRegion) === JSON.stringify(entry.cropRegion), `${label}: displayRegion must match final cropRegion.`, errors);
    } else {
      errors.push(`${label}: final assetPath does not exist: ${entry.assetPath}`);
    }
  });

  for (const page of scopePages) {
    assertCondition(entries.some((entry) => entry.sourcePage === page), `source page ${page} must have at least one inventory entry.`, errors);
  }
  for (const [page, orders] of pageOrders.entries()) {
    const sorted = [...orders].sort((left, right) => left - right);
    sorted.forEach((order, index) => {
      assertCondition(order === index + 1, `source page ${page}: sourceOrderWithinPage must be contiguous.`, errors);
    });
  }

  const signLikeEntries = entries.filter(isSignLikeEntry);
  const categoryEntries = entries.filter((entry) => entry.entryKind === "category-heading");
  assertCondition(entries.length === 316, "feature 037 inventory must retain all 316 baseline rows.", errors);
  assertCondition(signLikeEntries.length === 286, "feature 037 inventory must retain 286 sign-like rows.", errors);
  assertCondition(categoryEntries.length === 30, "feature 037 inventory must retain 30 category-heading rows.", errors);
  assertCondition(inventory.summary?.renderModeCounts?.["individual-source-crop-3x"] === 286, "summary must count 286 individual-source-crop-3x rows.", errors);
  assertCondition(inventory.summary?.renderModeCounts?.["category-heading-dom"] === 30, "summary must count 30 category-heading-dom rows.", errors);
  assertCondition(inventory.summary?.renderModeCounts?.["source-image-css-clip"] == null, "summary must not expose source-image-css-clip render mode.", errors);
  assertCondition(inventory.summary?.trueNativeEffectiveThreeXPassRows === 0, "summary must not count true native/effective 3x passes.", errors);
  assertCondition(inventory.summary?.sourceLimitedExceptionRows === 286, "summary must count 286 source-limited exceptions.", errors);
  return errors;
}

function validateInventory(inventory) {
  if (inventory?.featureId === feature037Id) {
    return validateFeature037Inventory(inventory);
  }
  const errors = [];
  const validEntryKinds = new Set(["catalog-entry", "category-heading", "contextual-visual"]);
  const validAuditStatuses = new Set(["reconciled-source-visual", "pending-reconciliation"]);
  assertCondition(inventory?.schemaVersion === 1, "schemaVersion must be 1.", errors);
  assertCondition(inventory?.featureId === "036-manual-sign-pages", "featureId must be 036-manual-sign-pages.", errors);
  assertCondition(inventory?.inventoryStatus === "individual-source-regions", "inventoryStatus must be individual-source-regions.", errors);
  assertCondition(Array.isArray(inventory?.entries), "entries must be an array.", errors);
  const entries = inventory?.entries ?? [];
  const seenIds = new Set();
  const pageOrders = new Map();

  entries.forEach((entry, index) => {
    const label = entry?.id ?? `entries[${index}]`;
    assertCondition(typeof entry.id === "string" && entry.id.trim() !== "", `${label}: id is required.`, errors);
    assertCondition(!seenIds.has(entry.id), `${label}: id must be unique.`, errors);
    seenIds.add(entry.id);
    assertCondition(validSectionPages.has(entry.sectionId), `${label}: sectionId is invalid.`, errors);
    assertCondition(Number.isInteger(entry.sourcePage) && scopePages.includes(entry.sourcePage), `${label}: sourcePage must be in 185-197.`, errors);
    const validPagesForSection = validSectionPages.get(entry.sectionId) ?? [];
    assertCondition(validPagesForSection.includes(entry.sourcePage), `${label}: sourcePage does not belong to sectionId.`, errors);
    assertCondition(entry.sourceOrder === index + 1, `${label}: sourceOrder must be contiguous from 1.`, errors);
    assertCondition(Number.isInteger(entry.sourceOrderWithinPage) && entry.sourceOrderWithinPage > 0, `${label}: sourceOrderWithinPage must be a positive integer.`, errors);
    (pageOrders.get(entry.sourcePage) ?? pageOrders.set(entry.sourcePage, []).get(entry.sourcePage)).push(entry.sourceOrderWithinPage);
    assertCondition(typeof entry.spanishLabel === "string" && entry.spanishLabel.trim() !== "", `${label}: spanishLabel is required.`, errors);
    assertCondition(typeof entry.russianTranslation === "string" && entry.russianTranslation.trim() !== "", `${label}: russianTranslation is required.`, errors);
    assertCondition(validEntryKinds.has(entry.entryKind), `${label}: entryKind must be catalog-entry, category-heading, or contextual-visual.`, errors);
    assertCondition(validAuditStatuses.has(entry.auditStatus), `${label}: auditStatus is invalid.`, errors);
    assertCondition(
      typeof entry.sourceSheetLabelEvidence === "string" && entry.sourceSheetLabelEvidence.trim() !== "",
      `${label}: sourceSheetLabelEvidence is required.`,
      errors
    );
    if (isReconciledVisualScope(entry)) {
      assertCondition(entry.auditStatus === "reconciled-source-visual", `${label}: reconciled visual-scope entries must be reconciled-source-visual.`, errors);
      assertCondition(
        entry.sourceSheetLabelEvidence !== "pending visual-source reconciliation",
        `${label}: reconciled visual-scope entries must not use pending sourceSheetLabelEvidence.`,
        errors
      );
    } else {
      assertCondition(entry.auditStatus === "pending-reconciliation", `${label}: unreconciled entries must remain pending-reconciliation in this slice.`, errors);
      assertCondition(
        entry.sourceSheetLabelEvidence === "pending visual-source reconciliation",
        `${label}: pending entries must use the pending sourceSheetLabelEvidence marker.`,
        errors
      );
    }
    assertCondition(typeof entry.sourceRef === "string" && entry.sourceRef.trim() !== "", `${label}: sourceRef is required.`, errors);
    assertCondition(typeof entry.sourceAsset === "string" && entry.sourceAsset.trim() !== "", `${label}: sourceAsset is required.`, errors);
    assertCondition(typeof entry.assetPath === "string" && entry.assetPath.trim() !== "", `${label}: assetPath is required.`, errors);
    assertCondition(entry.renderMode === renderMode, `${label}: renderMode must be ${renderMode}.`, errors);
    assertCondition(entry.noUpscale === true, `${label}: noUpscale must be true.`, errors);
    assertCondition(typeof entry.extractionMethod === "string" && entry.extractionMethod.trim() !== "", `${label}: extractionMethod is required.`, errors);
    assertCondition(typeof entry.preservationNote === "string" && entry.preservationNote.trim() !== "", `${label}: preservationNote is required.`, errors);

    if (entry.assetPath && existsSync(repoPath(entry.assetPath))) {
      const dimensions = readImageDimensions(entry.assetPath);
      const actualHash = sha256File(entry.assetPath);
      assertCondition(entry.naturalWidth === dimensions.width, `${label}: naturalWidth must match asset width.`, errors);
      assertCondition(entry.naturalHeight === dimensions.height, `${label}: naturalHeight must match asset height.`, errors);
      assertCondition(entry.hash === actualHash, `${label}: hash must match asset sha256.`, errors);
      validateCropRegion(entry, dimensions, label, errors);
    } else {
      errors.push(`${label}: assetPath does not exist: ${entry.assetPath}`);
    }
  });

  for (const page of scopePages) {
    assertCondition(entries.some((entry) => entry.sourcePage === page), `source page ${page} must have at least one inventory entry.`, errors);
  }

  for (const [page, orders] of pageOrders.entries()) {
    const sorted = [...orders].sort((left, right) => left - right);
    sorted.forEach((order, index) => {
      assertCondition(order === index + 1, `source page ${page}: sourceOrderWithinPage must be contiguous.`, errors);
    });
  }

  const actualBySection = countBy(entries, "sectionId");
  const actualBySourcePage = countBy(entries, "sourcePage");
  assertCondition(inventory.summary?.totalEntries === entries.length, "summary.totalEntries must match entries length.", errors);
  assertCondition(JSON.stringify(inventory.summary?.entriesBySection ?? {}) === JSON.stringify(actualBySection), "summary.entriesBySection must match entries.", errors);
  assertCondition(JSON.stringify(inventory.summary?.entriesBySourcePage ?? {}) === JSON.stringify(actualBySourcePage), "summary.entriesBySourcePage must match entries.", errors);

  const dispositionPages = inventory.p198To200Disposition?.pages;
  assertCondition(inventory.p198To200Disposition?.status === "recorded", "p198To200Disposition.status must be recorded.", errors);
  assertCondition(Array.isArray(dispositionPages), "p198To200Disposition.pages must be an array.", errors);
  for (const page of [198, 199, 200]) {
    const disposition = dispositionPages?.find((entry) => entry.sourcePage === page);
    assertCondition(Boolean(disposition), `p198To200Disposition must include page ${page}.`, errors);
    if (disposition) {
      assertCondition(typeof disposition.decision === "string" && disposition.decision.trim() !== "", `page ${page} disposition decision is required.`, errors);
      assertCondition(typeof disposition.reason === "string" && disposition.reason.trim() !== "", `page ${page} disposition reason is required.`, errors);
      assertCondition(typeof disposition.sourceAsset === "string" && existsSync(repoPath(disposition.sourceAsset)), `page ${page} disposition sourceAsset must exist.`, errors);
      if (disposition.hash) {
        assertCondition(disposition.hash === sha256File(disposition.sourceAsset), `page ${page} disposition hash must match sourceAsset.`, errors);
      }
    }
  }

  return errors;
}

function validateCropRegion(entry, dimensions, label, errors) {
  const region = entry.cropRegion;
  const displayRegion = entry.displayRegion;
  assertCondition(region && typeof region === "object", `${label}: cropRegion is required.`, errors);
  if (!region || typeof region !== "object") return;

  for (const field of ["x", "y", "width", "height"]) {
    assertCondition(Number.isInteger(region[field]), `${label}: cropRegion.${field} must be an integer.`, errors);
  }

  assertCondition(region.x >= 0, `${label}: cropRegion.x must be non-negative.`, errors);
  assertCondition(region.y >= 0, `${label}: cropRegion.y must be non-negative.`, errors);
  assertCondition(region.width > 0, `${label}: cropRegion.width must be positive.`, errors);
  assertCondition(region.height > 0, `${label}: cropRegion.height must be positive.`, errors);
  assertCondition(region.x + region.width <= dimensions.width, `${label}: cropRegion must fit inside source asset width.`, errors);
  assertCondition(region.y + region.height <= dimensions.height, `${label}: cropRegion must fit inside source asset height.`, errors);
  assertCondition(region.width < dimensions.width, `${label}: cropRegion.width must be smaller than source asset width.`, errors);
  assertCondition(region.height < dimensions.height, `${label}: cropRegion.height must be smaller than source asset height.`, errors);
  assertCondition(
    !(region.x === 0 && region.y === 0 && region.width === dimensions.width && region.height === dimensions.height),
    `${label}: cropRegion must not equal the full source asset.`,
    errors
  );
  assertCondition(entry.cropNaturalWidth === region.width, `${label}: cropNaturalWidth must match cropRegion.width.`, errors);
  assertCondition(entry.cropNaturalHeight === region.height, `${label}: cropNaturalHeight must match cropRegion.height.`, errors);
  assertCondition(JSON.stringify(displayRegion) === JSON.stringify(region), `${label}: displayRegion must match cropRegion.`, errors);
}

function main() {
  const shouldWrite = process.argv.includes("--write");
  const inventory = shouldWrite ? applyFeature037Inventory(buildInventory()) : JSON.parse(readFileSync(repoPath(inventoryPath), "utf8"));
  if (shouldWrite) {
    mkdirSync(dirname(repoPath(inventoryPath)), { recursive: true });
    writeFileSync(repoPath(inventoryPath), `${JSON.stringify(inventory, null, 2)}\n`);
  }
  const errors = validateInventory(inventory);
  if (errors.length) {
    console.error(`Manual sign inventory validation failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Manual sign inventory validation passed: ${inventory.entries.length} entries, pages ${scopePages[0]}-${scopePages.at(-1)}, p198-200 disposition recorded.`
  );
}

main();
