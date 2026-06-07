import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const repoRoot = process.cwd();
const inventoryPath = "src/data/manual-signs/app4SignEntries.json";
const manualId = "gcba-manual-vehiculo-4-ruedas-2023";
const sourceDocument =
  "content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf";
const renderMode = "source-image-css-clip";
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
      "Uses existing official CABA Appendix IV source-sheet crops as placeholders until individual warning crops are produced."
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
    russianTranslation: "Ограничивающие",
    cropRegion: { x: 70, y: 95, width: 235, height: 72 },
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
    cropRegion: { x: 115, y: 160, width: 90, height: 105 },
    sourceSheetLabelEvidence: "visible source label: LIMITACIÓN DE PESO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "LIMITACIÓN DE ALTURA",
    russianTranslation: "Ограничение высоты",
    cropRegion: { x: 295, y: 160, width: 95, height: 105 },
    sourceSheetLabelEvidence: "visible source label: LIMITACIÓN DE ALTURA",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-regulatory",
    sourcePage: 186,
    sourceCardId: "app4-regulatory-page-186-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "PARE",
    russianTranslation: "Стоп",
    cropRegion: { x: 115, y: 600, width: 95, height: 105 },
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
    cropRegion: { x: 215, y: 600, width: 95, height: 105 },
    sourceSheetLabelEvidence: "visible source label: CEDA EL PASO",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "category-heading",
    spanishLabel: "Preventivas / Advertencias sobre características de la vía",
    russianTranslation: "Предупреждающие / предупреждения об особенностях дороги",
    cropRegion: { x: 80, y: 80, width: 420, height: 115 },
    sourceSheetLabelEvidence: "visible source headings: Preventivas; Advertencias sobre características de la vía",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 187,
    sourceCardId: "app4-warning-page-187-source-card",
    entryKind: "catalog-entry",
    spanishLabel: "CURVA",
    variant: "En \"S\"",
    russianTranslation: "S-образная кривая",
    cropRegion: { x: 330, y: 195, width: 82, height: 102 },
    sourceSheetLabelEvidence: "visible source label: CURVA (En \"S\")",
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
    cropRegion: { x: 140, y: 305, width: 92, height: 105 },
    sourceSheetLabelEvidence: "visible source label: PENDIENTE (Ascendente)",
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
    cropRegion: { x: 330, y: 305, width: 92, height: 105 },
    sourceSheetLabelEvidence: "visible source label: ESTRECHAMIENTO (En una sola mano)",
    auditStatus: "reconciled-source-visual"
  },
  {
    sectionId: "app4-signs-warning",
    sourcePage: 188,
    sourceCardId: "app4-warning-page-188-source-card",
    entryKind: "category-heading",
    spanishLabel: "Posibilidad de riesgo eventual",
    russianTranslation: "Возможность случайного риска",
    cropRegion: { x: 78, y: 80, width: 360, height: 70 },
    sourceSheetLabelEvidence: "visible source heading: Posibilidad de riesgo eventual",
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
    cropRegion: { x: 260, y: 520, width: 115, height: 110 },
    sourceSheetLabelEvidence: "visible source label: CRUZ DE SAN ANDRÉS (Más de dos vías)",
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
    cropRegion: { x: 230, y: 710, width: 90, height: 105 },
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
    cropRegion: { x: 320, y: 710, width: 90, height: 105 },
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
    cropRegion: { x: 410, y: 710, width: 90, height: 105 },
    sourceSheetLabelEvidence: "visible source label: PROXIMIDAD DE SEÑAL RESTRICTIVA (Otra)",
    auditStatus: "reconciled-source-visual"
  }
];

const visualSourceEntriesByCard = visualSourceEntries.reduce((entriesByCard, entry) => {
  const entries = entriesByCard.get(entry.sourceCardId) ?? [];
  entries.push(entry);
  entriesByCard.set(entry.sourceCardId, entries);
  return entriesByCard;
}, new Map());

const visualSourceSectionIds = new Set(["app4-signs-regulatory", "app4-signs-warning"]);

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
        visualEntries.forEach((visualEntry, visualEntryIndex) => {
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
            sourceRef: `${section.sectionFile}#${card.id}.visualSourceEntries[${visualEntryIndex}]`,
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
        "Regulatory and warning slice entries are generated from explicit visualSourceEntries. Remaining sections still preserve the existing Appendix IV termTranslations order and are marked pending-reconciliation until their visual source rows are audited. No generated, redrawn, cleaned, translated, or re-encoded crop files are written.",
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

function assertCondition(condition, message, errors) {
  if (!condition) errors.push(message);
}

function validateInventory(inventory) {
  const errors = [];
  const validEntryKinds = new Set(["catalog-entry", "category-heading"]);
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
    assertCondition(validEntryKinds.has(entry.entryKind), `${label}: entryKind must be catalog-entry or category-heading.`, errors);
    assertCondition(validAuditStatuses.has(entry.auditStatus), `${label}: auditStatus is invalid.`, errors);
    assertCondition(
      typeof entry.sourceSheetLabelEvidence === "string" && entry.sourceSheetLabelEvidence.trim() !== "",
      `${label}: sourceSheetLabelEvidence is required.`,
      errors
    );
    if (visualSourceSectionIds.has(entry.sectionId)) {
      assertCondition(entry.auditStatus === "reconciled-source-visual", `${label}: regulatory/warning entries must be reconciled-source-visual.`, errors);
      assertCondition(
        entry.sourceSheetLabelEvidence !== "pending visual-source reconciliation",
        `${label}: regulatory/warning entries must not use pending sourceSheetLabelEvidence.`,
        errors
      );
    } else {
      assertCondition(entry.auditStatus === "pending-reconciliation", `${label}: non-regulatory/warning entries must remain pending-reconciliation in this slice.`, errors);
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
  const inventory = shouldWrite ? buildInventory() : JSON.parse(readFileSync(repoPath(inventoryPath), "utf8"));
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
