import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const defaultEvidencePath = "content/validation/manual-guide-visual-completeness.evidence.json";
const evidencePath = process.env.MANUAL_GUIDE_VISUAL_COMPLETENESS_EVIDENCE_PATH ?? defaultEvidencePath;
const sectionRoot = process.env.MANUAL_GUIDE_SECTION_ROOT ?? "src/data/manual-sections";
const spaceAssetPath =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-sustainable-mobility/space-comparison-50-people-source.jpg";
const spaceSourceAssetPath =
  "content/validation/manual-guide/ch1-sustainable-mobility/page-023-space-comparison-50-people-source-crop.jpg";
const headrestAssetPath =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-safety-elements/headrest-combined-diagram-source-as-is.jpg";
const headrestSourceAssetPath =
  "content/validation/manual-guide/app2-safety-elements/page-132-headrest-combined-diagram-source-crop.jpg";
const matafuegosAssetPath =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-other-required-safety-elements/matafuegos-source-as-is.jpg";
const matafuegosSourceAssetPath =
  "content/validation/manual-guide/app1-other-required-safety-elements/page-120-matafuegos-source-crop.jpg";
const chalecoAssetPath =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-other-required-safety-elements/chaleco-reflectivo-source-as-is.jpg";
const chalecoSourceAssetPath =
  "content/validation/manual-guide/app1-other-required-safety-elements/page-120-chaleco-reflectivo-source-crop.jpg";
const hospitalMapAssetPath =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-highways-hospitals/hospital-map-source-as-is.png";
const hospitalMapSourceAssetPath =
  "content/validation/manual-guide/app2-highways-hospitals/page-150-hospital-map-source-crop.png";
const hospitalMapCropEvidencePath =
  "content/validation/manual-guide-hospital-map-source-crop.evidence.json";
const noAvanzarAssetPath =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-regulatory/no-avanzar-source-as-is.jpg";
const noAvanzarSourceAssetPath =
  "content/validation/manual-guide/app4-signs-regulatory/page-185-no-avanzar-source-crop.jpg";
const noAvanzarCropEvidencePath =
  "content/validation/manual-guide-no-avanzar-source-crop.evidence.json";
const anexoRegulatoryPanelRecords = [
  {
    panelNumber: 1,
    cardId: "app4-regulatory-anexo-panel-01-source-card",
    sourcePage: 185,
    sourceAssetPath:
      "content/official-documents/originals/decreto-779-1995-anexo-l-senalizacion-vial-uniforme-images/dec196AnexoIII-01.jpg",
    assetPath:
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-regulatory/anexo-regulatory-panel-01-source-as-is.jpg",
    scope: "R.1-R.3(10): prohibition signs and vehicle/user circulation prohibitions."
  },
  {
    panelNumber: 2,
    cardId: "app4-regulatory-anexo-panel-02-source-card",
    sourcePage: 186,
    sourceAssetPath:
      "content/official-documents/originals/decreto-779-1995-anexo-l-senalizacion-vial-uniforme-images/dec196AnexoIII-02.jpg",
    assetPath:
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-regulatory/anexo-regulatory-panel-02-source-as-is.jpg",
    scope: "R.4-R.16: turn, overtaking, parking, weight, dimension, and speed restrictions."
  },
  {
    panelNumber: 3,
    cardId: "app4-regulatory-anexo-panel-03-source-card",
    sourcePage: 186,
    sourceAssetPath:
      "content/official-documents/originals/decreto-779-1995-anexo-l-senalizacion-vial-uniforme-images/dec196AnexoIII-03.jpg",
    assetPath:
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-regulatory/anexo-regulatory-panel-03-source-as-is.jpg",
    scope: "R.17-R.22: exclusive circulation and mandatory-direction signs."
  },
  {
    panelNumber: 4,
    cardId: "app4-regulatory-anexo-panel-04-source-card",
    sourcePage: 186,
    sourceAssetPath:
      "content/official-documents/originals/decreto-779-1995-anexo-l-senalizacion-vial-uniforme-images/dec196AnexoIII-04.jpg",
    assetPath:
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-regulatory/anexo-regulatory-panel-04-source-as-is.jpg",
    scope: "R.23-R.32: priority, control, railway-barrier, and end-of-prescription material."
  }
];
const blindSpotAssetPath =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-safety-elements/blind-spot-source-as-is.jpg";
const blindSpotSourceAssetPath =
  "content/validation/manual-guide/app1-safety-elements/page-108-blind-spot-source-crop.jpg";
const blindSpotCropEvidencePath =
  "content/validation/manual-guide-blind-spot-source-crop.evidence.json";
const tireAssetPath =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-safety-elements/tire-manufacturing-tread-life-source-as-is.jpg";
const tireSourceAssetPath =
  "content/validation/manual-guide/app1-safety-elements/page-108-tire-manufacturing-tread-life-source-crop.jpg";
const tireCropEvidencePath =
  "content/validation/manual-guide-tire-manufacturing-tread-life-source-crop.evidence.json";

const deniedCopyPatterns = [
  {
    id: "source-family-provenance",
    pattern: /(?<![\p{L}\p{N}_])источник\p{Script=Cyrillic}*(?![\p{L}\p{N}_])/iu,
    reason:
      "Learner-facing guide copy should present the rule or learning point directly instead of naming the source/provenance."
  },
  {
    id: "main-source-takeaway",
    pattern: /главн(?:ый|ая|ое)\s+вывод\s+источника/iu,
    reason: "Takeaway labels should read as learning copy, not source commentary."
  },
  {
    id: "source-quote-card-title",
    pattern: /фото\s+и\s+цитата\s+источника/iu,
    reason: "Photo/quote captions should not expose provenance shorthand."
  },
  {
    id: "raw-working-fragment",
    pattern:
      /(?:исходн[а-яё]*|рабоч[а-яё]*)\s+(?:фрагмент|схем|карт|фото|фотограф|пример|визуал|изображ|рисунк)|фотофрагмент|x5-фрагмент/iu,
    reason: "Fragment/source-region implementation wording is internal evidence, not guide copy."
  },
  {
    id: "saved-as-source",
    pattern:
      /(?:(?:оставлен[аоы]?|сохранен[аоы]?|перенесен[аоы]?|показан[ао]?)\s+как\s+(?:официальн(?:ый|ая|ое)\s+)?источник|неизмененн[а-яё]*\s+источник|как\s+в\s+(?:официальном\s+)?источнике|из\s+источника|из\s+x5-фрагмента)/iu,
    reason: "Visible copy should say what the learner sees or needs to remember."
  },
  {
    id: "transferred-visual-meta",
    pattern: /перенес[её]нн[а-яё]*\s+(?:визуал|схем|таблиц|панел)|визуал\s+источника/iu,
    reason: "Learner-facing image copy should name the learning object, not the conversion action."
  }
];

const allowedCopyPatterns = [
  {
    id: "stress-cause-source",
    pattern: /(?<![\p{L}\p{N}_])источник\s+стресса(?![\p{L}\p{N}_])/iu,
    reason: "Genuine semantic Russian use: source/cause of stress, not document provenance."
  }
];

const args = process.argv.slice(2);
const writeMode = args.includes("--write");
const unknownArgs = args.filter((arg) => arg !== "--write");

if (unknownArgs.length > 0) {
  console.error(`Unknown argument(s): ${unknownArgs.join(", ")}`);
  console.error("Usage: node scripts/manual-guide-visual-completeness-audit.mjs [--write]");
  process.exit(1);
}

const userExampleRecords = [
  {
    id: "appendix-iv-regulatory-signs-no-avanzar",
    label: "Appendix IV regulatory signs and NO AVANZAR",
    status: "implemented-regulatory-panels-with-caba-overview",
    sourcePages: [185, 186],
    runtimeTargets: [
      "app4-regulatory-anexo-panel-01-source-card",
      "app4-regulatory-anexo-panel-02-source-card",
      "app4-regulatory-anexo-panel-03-source-card",
      "app4-regulatory-anexo-panel-04-source-card",
      "app4-regulatory-no-avanzar-source-card",
      "app4-regulatory-page-185-source-card",
      "app4-regulatory-page-186-source-card"
    ],
    assetPath: noAvanzarAssetPath,
    sourceAssetPath: noAvanzarSourceAssetPath,
    panelAssetPaths: anexoRegulatoryPanelRecords.map((panel) => panel.assetPath),
    panelSourceAssetPaths: anexoRegulatoryPanelRecords.map((panel) => panel.sourceAssetPath),
    remainingScopeNote:
      "Panels 01-04 cover the broad official Anexo L regulatory sign set for this section. CABA page 185/186 sheets remain as CABA overview/local variants because CABA includes local sheet context not replaced by the Anexo panels.",
    notes:
      "Implemented with four large byte-identical official Anexo L regulatory panels, the focused NO AVANZAR card, and separate Russian DOM translations for catalog captions. The current CABA page sheets remain after the panels as overview/local-variant context."
  },
  {
    id: "app2-hospital-map-source-card",
    label: "Hospital map",
    status: "implemented",
    sourcePages: [150],
    runtimeTargets: ["app2-hospital-map-source-card"],
    assetPath: hospitalMapAssetPath,
    sourceAssetPath: hospitalMapSourceAssetPath,
    notes:
      "Implemented in the hospital-map follow-up: corrected official PDF region crop is shown source-as-is, with map internals unchanged and Russian explanation/list outside the image."
  },
  {
    id: "seatbelt-headrest-copy-problems",
    label: "Seatbelt/headrest learner-facing provenance copy",
    status: "implemented",
    sourcePages: [113, 131, 132],
    runtimeTargets: ["app2-seatbelt-use-source-card", "headrest-position-source-card"],
    notes:
      "The copy guard now scans learner-facing Russian manual-section strings and fails on the provenance/meta phrases named by the user."
  },
  {
    id: "blind-spot-visual",
    label: "Blind-spot visual",
    status: "implemented",
    sourcePages: [108],
    runtimeTargets: ["app1-blind-spot-source-card"],
    assetPath: blindSpotAssetPath,
    sourceAssetPath: blindSpotSourceAssetPath,
    notes:
      "Implemented in the blind-spot focused slice: official page 108 visual is shown source-as-is from a tight direct-PDF crop; Spanish internals are unchanged and Russian explanation/term translations are outside the image."
  },
  {
    id: "tire-manufacturing-tread-life",
    label: "Tire manufacturing/date and tread-life visual",
    status: "implemented-app1-canonical",
    sourcePages: [108],
    runtimeTargets: ["app1-tire-manufacturing-tread-life-source-card"],
    assetPath: tireAssetPath,
    sourceAssetPath: tireSourceAssetPath,
    notes:
      "Implemented for the user-reported App I canonical page-108 tire manufacturing/date and tread-life visual. Related App II/App III tire sections remain separate textual/future visual scope and are not changed by this slice."
  },
  {
    id: "matafuegos-chaleco-reflectivo",
    label: "Matafuegos and Chaleco reflectivo",
    status: "implemented-app1-only",
    sourcePages: [119, 135],
    runtimeTargets: ["app1-matafuegos-source-card", "app1-chaleco-reflectivo-source-card", "app2-safety-elements"],
    assetPaths: [matafuegosAssetPath, chalecoAssetPath],
    sourceAssetPaths: [matafuegosSourceAssetPath, chalecoSourceAssetPath],
    notes:
      "Implemented for app1 only in this narrow batch: official page 120 safety equipment title+icon crops are shown as source pixels with external Russian term translations. App2/app3 equipment visuals remain outside this slice and are not claimed complete here."
  },
  {
    id: "headrest-combined-diagram",
    label: "Headrest combined diagram",
    status: "implemented",
    sourcePages: [113, 132],
    runtimeTargets: ["app2-headrest-combined-source-card"],
    assetPath: headrestAssetPath,
    sourceAssetPath: headrestSourceAssetPath,
    notes:
      "Implemented for app2 only in this narrow batch: page 132 combined Spanish diagram is shown as source pixels with external Russian term glossary. App1 headrest remains outside this slice and is not claimed complete here."
  },
  {
    id: "mobility-space-50-people",
    label: "50-people mobility-space visual",
    status: "implemented",
    sourcePages: [23],
    runtimeTargets: ["city-context-infographic"],
    assetPath: spaceAssetPath,
    sourceAssetPath: spaceSourceAssetPath,
    notes:
      "Implemented in first controlled batch: official Spanish row crop is shown as-is, and Russian mode translations are selectable DOM text below the image."
  },
  {
    id: "whole-guide-source-wording-copy-audit",
    label: "Whole-guide source/provenance wording cleanup guard",
    status: "implemented",
    runtimeTargets: ["src/data/manual-sections/*.ts"],
    notes:
      "Implemented as this audit script and validation command wiring; ordinary legal/source citation context is allowed, while service/provenance visual-card wording fails."
  }
];

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function readImageDimensions(path) {
  const bytes = readFileSync(path);
  if (bytes.length >= 24 && bytes.readUInt32BE(0) === 0x89504e47) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
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
      if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
        return { width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3) };
      }
      offset += segmentLength;
    }
  }
  return null;
}

function sectionFiles() {
  return readdirSync(sectionRoot)
    .filter((fileName) => fileName.endsWith(".ts"))
    .sort()
    .map((fileName) => ({
      path: join(sectionRoot, fileName),
      source: readFileSync(join(sectionRoot, fileName), "utf8")
    }));
}

function lineNumberForIndex(source, index) {
  return source.slice(0, index).split("\n").length;
}

function stringLiterals(source) {
  const literals = [];
  let quote = "";
  let start = -1;
  let escaped = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (!quote) {
      if (char === "\"" || char === "'" || char === "`") {
        quote = char;
        start = index;
      }
      continue;
    }
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === quote) {
      literals.push({
        value: source.slice(start + 1, index),
        start,
        line: lineNumberForIndex(source, start)
      });
      quote = "";
      start = -1;
    }
  }
  return literals;
}

function globalCopyPattern(pattern) {
  return new RegExp(pattern.source, Array.from(new Set(`${pattern.flags}g`.split(""))).join(""));
}

function removeAllowedCopy(value) {
  return allowedCopyPatterns.reduce((current, rule) => current.replace(globalCopyPattern(rule.pattern), " "), value);
}

function auditVisibleCopy() {
  const findings = [];
  const allowlistedOccurrences = [];
  for (const file of sectionFiles()) {
    for (const literal of stringLiterals(file.source)) {
      if (!/[А-Яа-яЁё]/u.test(literal.value)) continue;
      const allowedRules = allowedCopyPatterns.filter((rule) => rule.pattern.test(literal.value));
      for (const allowedRule of allowedRules) {
        allowlistedOccurrences.push({
          ruleId: allowedRule.id,
          file: file.path,
          line: literal.line,
          text: literal.value,
          reason: allowedRule.reason,
          status: "allowed"
        });
      }
      const deniedValue = removeAllowedCopy(literal.value);
      for (const rule of deniedCopyPatterns) {
        if (!rule.pattern.test(deniedValue)) continue;
        findings.push({
          ruleId: rule.id,
          file: file.path,
          line: literal.line,
          text: literal.value,
          reason: rule.reason,
          status: "blocked"
        });
      }
    }
  }
  return {
    status: findings.length === 0 ? "pass" : "fail",
    scannedRoot: sectionRoot,
    deniedPatternIds: deniedCopyPatterns.map((rule) => rule.id),
    allowlistPatternIds: allowedCopyPatterns.map((rule) => rule.id),
    allowedContext:
      "Only genuine non-provenance Russian uses such as 'источник стресса' are allowlisted. Manual guide copy should not describe source/provenance, source fragments, or conversion work.",
    findingCount: findings.length,
    findings,
    allowlistedCount: allowlistedOccurrences.length,
    allowlistedOccurrences
  };
}

function mobilitySpaceRecord() {
  const dimensions = existsSync(spaceAssetPath) ? readImageDimensions(spaceAssetPath) : null;
  const sourceDimensions = existsSync(spaceSourceAssetPath) ? readImageDimensions(spaceSourceAssetPath) : null;
  return {
    id: "mobility-space-50-people",
    status: "implemented",
    sourcePage: 23,
    sourceRegion: {
      coordinateSystem: "content/validation/manual-guide/ch1-sustainable-mobility/page-023-context-infographic-source-crop.jpg pixels",
      x: 20,
      y: 268,
      width: 585,
      height: 125
    },
    extractionMethod:
      "Source-faithful crop from retained official page-23 context infographic source crop using sips cropOffset 268 20, crop 125x585. A direct-PDF region probe was attempted first, but this page helper did not isolate the row cleanly enough for the committed output.",
    assetPath: spaceAssetPath,
    sourceAssetPath: spaceSourceAssetPath,
    dimensions,
    sourceDimensions,
    sha256: existsSync(spaceAssetPath) ? sha256File(spaceAssetPath) : null,
    sourceSha256: existsSync(spaceSourceAssetPath) ? sha256File(spaceSourceAssetPath) : null,
    protectedImagePolicy:
      "Spanish title and mode labels remain inside the official image; Russian translations are rendered below as selectable DOM text.",
    runtimeDisplay: {
      maxDisplayWidthPx: dimensions?.width ?? null,
      noUpscale: true,
      translationDomSelector: ".manual-space-labels"
    },
    terms: [
      { termEs: "En colectivo", translationRu: "На автобусе" },
      { termEs: "A pie", translationRu: "Пешком" },
      { termEs: "En bicicleta", translationRu: "На велосипеде" },
      { termEs: "En auto", translationRu: "На автомобиле" }
    ]
  };
}

function headrestCombinedRecord() {
  const dimensions = existsSync(headrestAssetPath) ? readImageDimensions(headrestAssetPath) : null;
  const sourceDimensions = existsSync(headrestSourceAssetPath) ? readImageDimensions(headrestSourceAssetPath) : null;
  return {
    id: "headrest-combined-diagram",
    status: "implemented-app2-only",
    sourcePage: 132,
    sourceRegion: {
      coordinateSystem: "content/validation/manual-guide/app2-safety-elements/page-132-safety-elements-source-crop.jpg pixels",
      x: 1040,
      y: 2160,
      width: 820,
      height: 600
    },
    extractionMethod:
      "Source-faithful crop from retained official Appendix II page-132 x5 source render using sips cropOffset 2160 1040, crop 600x820. The runtime asset is byte-identical to this validation/source crop.",
    assetPath: headrestAssetPath,
    sourceAssetPath: headrestSourceAssetPath,
    dimensions,
    sourceDimensions,
    sha256: existsSync(headrestAssetPath) ? sha256File(headrestAssetPath) : null,
    sourceSha256: existsSync(headrestSourceAssetPath) ? sha256File(headrestSourceAssetPath) : null,
    protectedImagePolicy:
      "Spanish terms and diagram pixels remain unchanged inside the protected image; Russian translations are rendered below as selectable DOM text.",
    runtimeDisplay: {
      cardId: "app2-headrest-combined-source-card",
      maxDisplayWidthPx: dimensions?.width ?? null,
      noUpscale: true,
      translationDomSelector: ".manual-source-image-term-translations"
    },
    terms: [
      { termEs: "Altura apoyacabeza", translationRu: "Высота подголовника" },
      { termEs: "Distancia del apoyacabeza", translationRu: "Расстояние до подголовника" },
      { termEs: "Bueno", translationRu: "Хорошо" },
      { termEs: "Aceptable", translationRu: "Допустимо" },
      { termEs: "Regular", translationRu: "Средне" },
      { termEs: "Malo", translationRu: "Плохо" },
      { termEs: "Botón de desbloqueo", translationRu: "Кнопка разблокировки" }
    ],
    remainingScopeNote:
      "This record covers only app2 page 132. App1 page 113 headrest visuals remain pending for a separate slice."
  };
}

function safetyEquipmentRecord() {
  const matafuegosDimensions = existsSync(matafuegosAssetPath) ? readImageDimensions(matafuegosAssetPath) : null;
  const matafuegosSourceDimensions = existsSync(matafuegosSourceAssetPath) ? readImageDimensions(matafuegosSourceAssetPath) : null;
  const chalecoDimensions = existsSync(chalecoAssetPath) ? readImageDimensions(chalecoAssetPath) : null;
  const chalecoSourceDimensions = existsSync(chalecoSourceAssetPath) ? readImageDimensions(chalecoSourceAssetPath) : null;
  return {
    id: "matafuegos-chaleco-reflectivo",
    status: "implemented-app1-only",
    sourcePage: 120,
    cards: [
      {
        cardId: "app1-matafuegos-source-card",
        termEs: "Matafuegos",
        translationRu: "Огнетушитель",
        sourceRegion: {
          coordinateSystem:
            "content/validation/manual-guide/app1-other-required-safety-elements/page-120-other-required-safety-elements-source-crop.jpg pixels",
          x: 1060,
          y: 1660,
          width: 340,
          height: 330
        },
        assetPath: matafuegosAssetPath,
        sourceAssetPath: matafuegosSourceAssetPath,
        dimensions: matafuegosDimensions,
        sourceDimensions: matafuegosSourceDimensions,
        sha256: existsSync(matafuegosAssetPath) ? sha256File(matafuegosAssetPath) : null,
        sourceSha256: existsSync(matafuegosSourceAssetPath) ? sha256File(matafuegosSourceAssetPath) : null
      },
      {
        cardId: "app1-chaleco-reflectivo-source-card",
        termEs: "Chaleco reflectivo",
        translationRu: "Световозвращающий жилет",
        sourceRegion: {
          coordinateSystem:
            "content/validation/manual-guide/app1-other-required-safety-elements/page-120-other-required-safety-elements-source-crop.jpg pixels",
          x: 1060,
          y: 1990,
          width: 340,
          height: 340
        },
        assetPath: chalecoAssetPath,
        sourceAssetPath: chalecoSourceAssetPath,
        dimensions: chalecoDimensions,
        sourceDimensions: chalecoSourceDimensions,
        sha256: existsSync(chalecoAssetPath) ? sha256File(chalecoAssetPath) : null,
        sourceSha256: existsSync(chalecoSourceAssetPath) ? sha256File(chalecoSourceAssetPath) : null
      }
    ],
    extractionMethod:
      "Source-faithful tighter crops from retained official Appendix I page-120 x5 source render using sips cropOffset 1660 1060, crop 330x340 for Matafuegos and cropOffset 1990 1060, crop 340x340 for Chaleco reflectivo. Runtime assets are byte-identical to the validation/source crops.",
    protectedImagePolicy:
      "Spanish titles remain unchanged inside the protected images; Russian translations are rendered below as selectable DOM text.",
    runtimeDisplay: {
      maxDisplayWidthPx: 340,
      noUpscale: true,
      translationDomSelector: ".manual-source-image-term-translations",
      visualHeightToBodyLineEstimate: "Matafuegos 330px natural crop height at 340px max display width; no browser pixel upscaling."
    },
    remainingScopeNote:
      "This record covers only app1 page 120. App2/app3 safety equipment visuals remain pending for separate slices."
  };
}

function hospitalMapRecord() {
  const dimensions = existsSync(hospitalMapAssetPath) ? readImageDimensions(hospitalMapAssetPath) : null;
  const sourceDimensions = existsSync(hospitalMapSourceAssetPath) ? readImageDimensions(hospitalMapSourceAssetPath) : null;
  const cropEvidence = existsSync(hospitalMapCropEvidencePath)
    ? JSON.parse(readFileSync(hospitalMapCropEvidencePath, "utf8")).targets.find((entry) => entry.cardId === "app2-hospital-map-source-card")
    : null;
  return {
    id: "app2-hospital-map-source-card",
    status: "implemented",
    sourcePage: 150,
    sourceRegion: cropEvidence?.sourceRegionAtBaseScale ?? {
      x: 1332,
      y: 2050,
      width: 780,
      height: 335
    },
    extractionMethod:
      "Best verified official PDF page-150 region crop rendered through scripts/manual-visual-content-crops.swift at scale 36. The first direct-region attempt using the old retained-page y coordinate produced a blank crop and was rejected before commit; the committed runtime asset is the map-only trim that keeps the colored map and barrio labels while excluding the separate Spanish title/list panel.",
    assetPath: hospitalMapAssetPath,
    sourceAssetPath: hospitalMapSourceAssetPath,
    cropEvidencePath: hospitalMapCropEvidencePath,
    dimensions,
    sourceDimensions,
    sha256: existsSync(hospitalMapAssetPath) ? sha256File(hospitalMapAssetPath) : null,
    sourceSha256: existsSync(hospitalMapSourceAssetPath) ? sha256File(hospitalMapSourceAssetPath) : null,
    usefulContentRatios: cropEvidence
      ? {
          before: cropEvidence.beforeUsefulRatios,
          after: cropEvidence.outputUsefulRatios
        }
      : null,
    selectedRenderScale: cropEvidence?.selectedRenderScale ?? null,
    maximumSuccessfulProbeScale: cropEvidence?.maximumSuccessfulProbeScale ?? null,
    protectedImagePolicy:
      "Spanish barrio labels, H/H1/H2 markers, colors, roads, boundaries, and geometry remain unchanged inside the protected map image; Russian legend/list text is rendered separately below.",
    sourceLimitation:
      "High-scale official PDF probes did not materially increase barrio-label glyph detail beyond the native raster. The runtime fix therefore uses the tightest source-faithful map-only crop, minDisplayWidthPx, and no browser upscaling.",
    runtimeDisplay: {
      cardId: "app2-hospital-map-source-card",
      maxDisplayWidthPx: dimensions?.width ?? null,
      minDisplayWidthPx: dimensions?.width ?? null,
      noUpscale: true,
      mobileContainedScroll: true,
      translationDomSelector: ".manual-source-image-card + .manual-guide-section-block, .manual-source-image-term-translations"
    }
  };
}

function noAvanzarRecord() {
  const dimensions = existsSync(noAvanzarAssetPath) ? readImageDimensions(noAvanzarAssetPath) : null;
  const sourceDimensions = existsSync(noAvanzarSourceAssetPath) ? readImageDimensions(noAvanzarSourceAssetPath) : null;
  const cropEvidence = existsSync(noAvanzarCropEvidencePath)
    ? JSON.parse(readFileSync(noAvanzarCropEvidencePath, "utf8"))
    : null;
  return {
    id: "appendix-iv-regulatory-signs-no-avanzar",
    status: "implemented-regulatory-panels-with-caba-overview",
    sourcePage: 185,
    officialSourceAsset:
      "content/official-documents/originals/decreto-779-1995-anexo-l-senalizacion-vial-uniforme-images/dec196AnexoIII-01.jpg",
    sourceRegion: cropEvidence?.sourceRegion ?? {
      coordinateSystem:
        "content/official-documents/originals/decreto-779-1995-anexo-l-senalizacion-vial-uniforme-images/dec196AnexoIII-01.jpg pixels",
      x: 32,
      y: 85,
      width: 200,
      height: 145
    },
    extractionMethod:
      "Focused source-faithful crop from the retained official Anexo L R.1 sign image using sips cropOffset 85 32, crop 145x200. Direct CABA page-185 PDF probes were also checked and remained source-limited for sign glyph detail, so the retained official Anexo L image is used for the large representative NO AVANZAR card while the CABA sheets remain overview context.",
    assetPath: noAvanzarAssetPath,
    sourceAssetPath: noAvanzarSourceAssetPath,
    cropEvidencePath: noAvanzarCropEvidencePath,
    dimensions,
    sourceDimensions,
    sha256: existsSync(noAvanzarAssetPath) ? sha256File(noAvanzarAssetPath) : null,
    sourceSha256: existsSync(noAvanzarSourceAssetPath) ? sha256File(noAvanzarSourceAssetPath) : null,
    protectedImagePolicy:
      "The R.1 sign body, arrow, red prohibition mark, and Spanish catalog caption remain unchanged inside the protected image. Russian wording is rendered below as selectable DOM text.",
    externalCaptionBoundary:
      "The Spanish NO AVANZAR words are the external catalog caption printed below the R.1 sign in the official Anexo L image; they are not part of the sign body or an official supplementary plate.",
    runtimeDisplay: {
      cardId: "app4-regulatory-no-avanzar-source-card",
      maxDisplayWidthPx: dimensions?.width ?? null,
      minDisplayWidthPx: dimensions?.width ?? null,
      noUpscale: true,
      translationDomSelector: ".manual-source-image-term-translations"
    },
    terms: [{ termEs: "NO AVANZAR", translationRu: "Проезд запрещен" }],
    remainingScopeNote:
      "The focused NO AVANZAR card remains as a large example. Broad regulatory readability is now covered by Anexo L panels 01-04; CABA page 185/186 sheets remain as overview/local variants."
  };
}

function anexoRegulatoryPanelsRecord() {
  return {
    id: "appendix-iv-regulatory-anexo-panels",
    status: "implemented-regulatory-panels-with-caba-overview",
    sourcePages: [185, 186],
    extractionMethod:
      "Byte-identical copies from retained official Decreto 779/1995 Anexo L JPG panels dec196AnexoIII-01 through dec196AnexoIII-04. No crop, resize, cleanup, retouching, relabeling, translation, masking, inpainting, reconstruction, or redraw was applied.",
    panels: anexoRegulatoryPanelRecords.map((panel) => {
      const dimensions = existsSync(panel.assetPath) ? readImageDimensions(panel.assetPath) : null;
      return {
        panelNumber: panel.panelNumber,
        cardId: panel.cardId,
        sourcePage: panel.sourcePage,
        scope: panel.scope,
        assetPath: panel.assetPath,
        sourceAssetPath: panel.sourceAssetPath,
        dimensions,
        sourceDimensions: existsSync(panel.sourceAssetPath) ? readImageDimensions(panel.sourceAssetPath) : null,
        sha256: existsSync(panel.assetPath) ? sha256File(panel.assetPath) : null,
        sourceSha256: existsSync(panel.sourceAssetPath) ? sha256File(panel.sourceAssetPath) : null,
        byteIdenticalToSource: existsSync(panel.assetPath) && existsSync(panel.sourceAssetPath)
          ? sha256File(panel.assetPath) === sha256File(panel.sourceAssetPath)
          : false,
        runtimeDisplay: {
          cardId: panel.cardId,
          maxDisplayWidthPx: dimensions?.width ?? null,
          minDisplayWidthPx: dimensions?.width ?? null,
          noUpscale: true,
          mobileContainedScroll: true,
          translationDomSelector: ".manual-source-image-term-translations"
        }
      };
    }),
    protectedImagePolicy:
      "All sign bodies, plates, tablets, symbols, numbers, Spanish catalog captions, and panel pixels remain unchanged inside the protected images. Russian translations are rendered only as selectable DOM text below the cards.",
    termsCoverage:
      "Runtime data includes separate Russian term translations for all visible catalog captions on panels 01-02 and the major captions on panels 03-04.",
    nonSelectedPanel05Disposition:
      "dec196AnexoIII-05.jpg starts warning-sign P.* material, so it is not needed for the page-186 regulatory end-of-prescription scope.",
    cabaOverviewDisposition:
      "Existing CABA page 185/186 sheet crops are kept after the Anexo panels as overview/local variants; their image pixels and no-upscale caps are unchanged."
  };
}

function blindSpotRecord() {
  const dimensions = existsSync(blindSpotAssetPath) ? readImageDimensions(blindSpotAssetPath) : null;
  const sourceDimensions = existsSync(blindSpotSourceAssetPath) ? readImageDimensions(blindSpotSourceAssetPath) : null;
  const cropEvidence = existsSync(blindSpotCropEvidencePath)
    ? JSON.parse(readFileSync(blindSpotCropEvidencePath, "utf8"))
    : null;
  const target = cropEvidence?.targets?.find((entry) => entry.cardId === "app1-blind-spot-source-card");
  return {
    id: "blind-spot-visual",
    status: "implemented",
    sourcePage: 108,
    pdfPage: target?.pdfPage ?? target?.renderPage ?? 109,
    sourceRegion: target?.sourceRegionAtBaseScale ?? {
      x: 838,
      y: 1100,
      width: 1525,
      height: 1100
    },
    finalTrimBounds: target?.finalTrimBounds ?? {
      x: 363,
      y: 1,
      width: 546,
      height: 440
    },
    extractionMethod:
      "Direct source-faithful PDF region crop from the official GCBA 4-wheel manual using scripts/manual-visual-content-crops.swift at x5. The committed crop preserves the official Spanish heading, definition sentence, diagram labels, and blue conclusion, while excluding only surrounding page whitespace, the unrelated upper tire panel, and the printed page number.",
    assetPath: blindSpotAssetPath,
    sourceAssetPath: blindSpotSourceAssetPath,
    cropEvidencePath: blindSpotCropEvidencePath,
    dimensions,
    sourceDimensions,
    sha256: existsSync(blindSpotAssetPath) ? sha256File(blindSpotAssetPath) : null,
    sourceSha256: existsSync(blindSpotSourceAssetPath) ? sha256File(blindSpotSourceAssetPath) : null,
    usefulContentRatios: target
      ? {
          before: target.beforeUsefulRatios,
          after: target.outputUsefulRatios
        }
      : null,
    sourceQualityDisposition: target?.sourceQualityDisposition ?? null,
    protectedImagePolicy:
      "The Spanish heading, definition sentence, PUNTO CIEGO AUTOS/MOTOS labels, CAMIONES Y COLECTIVOS label, road diagram, and blue sentence remain unchanged inside the protected image. Russian explanation and term translations are selectable DOM text outside the image.",
    runtimeDisplay: {
      cardId: "app1-blind-spot-source-card",
      maxDisplayWidthPx: dimensions?.width ?? null,
      minDisplayWidthPx: dimensions?.width ?? null,
      noUpscale: true,
      mobileContainedScroll: true,
      translationDomSelector: ".manual-source-image-term-translations"
    },
    terms: [
      { termEs: "PUNTO CIEGO AUTOS", translationRu: "Слепая зона автомобилей" },
      { termEs: "PUNTO CIEGO MOTOS", translationRu: "Слепая зона мотоциклов" },
      { termEs: "CAMIONES Y COLECTIVOS", translationRu: "Грузовики и автобусы" },
      {
        termEs: "Cuanto más grande es el vehículo, mayor es el punto ciego.",
        translationRu: "Чем больше транспортное средство, тем больше слепая зона."
      }
    ]
  };
}

function tireManufacturingTreadLifeRecord() {
  const dimensions = existsSync(tireAssetPath) ? readImageDimensions(tireAssetPath) : null;
  const sourceDimensions = existsSync(tireSourceAssetPath) ? readImageDimensions(tireSourceAssetPath) : null;
  const cropEvidence = existsSync(tireCropEvidencePath)
    ? JSON.parse(readFileSync(tireCropEvidencePath, "utf8"))
    : null;
  const target = cropEvidence?.targets?.find((entry) => entry.cardId === "app1-tire-manufacturing-tread-life-source-card");
  return {
    id: "tire-manufacturing-tread-life",
    status: "implemented-app1-canonical",
    sourcePage: 108,
    sourceRegion: target?.sourceRegionAtBaseScale ?? {
      x: 1115,
      y: 1635,
      width: 760,
      height: 995
    },
    extractionMethod:
      "Source-faithful crop from the retained official Appendix I page-108 x5 render using sips cropOffset 1635 1115, crop 995x760. The runtime asset is byte-identical to this validation/source crop.",
    assetPath: tireAssetPath,
    sourceAssetPath: tireSourceAssetPath,
    cropEvidencePath: tireCropEvidencePath,
    dimensions,
    sourceDimensions,
    sha256: existsSync(tireAssetPath) ? sha256File(tireAssetPath) : null,
    sourceSha256: existsSync(tireSourceAssetPath) ? sha256File(tireSourceAssetPath) : null,
    usefulContentRatios: target
      ? {
          before: target.beforeUsefulRatios,
          after: target.outputUsefulRatios
        }
      : null,
    protectedImagePolicy:
      "The Spanish headings Fecha de Fabricación and Vida útil de los Neumáticos, tire date callout, tread-life chart, bullet text, Recomendaciones box, and pressure labels remain unchanged inside the protected image. Russian explanation and term translations are selectable DOM text outside the image.",
    runtimeDisplay: {
      cardId: "app1-tire-manufacturing-tread-life-source-card",
      maxDisplayWidthPx: dimensions?.width ?? null,
      minDisplayWidthPx: dimensions?.width ?? null,
      noUpscale: true,
      mobileContainedScroll: true,
      translationDomSelector: ".manual-source-image-term-translations"
    },
    terms: [
      { termEs: "Fecha de Fabricación", translationRu: "Дата изготовления" },
      { termEs: "Vida útil de los Neumáticos", translationRu: "Срок службы шин" },
      { termEs: "Recomendaciones", translationRu: "Рекомендации" },
      { termEs: "Falta de presión", translationRu: "Недостаточное давление" },
      { termEs: "Presión excesiva", translationRu: "Избыточное давление" },
      { termEs: "Presión adecuada", translationRu: "Правильное давление" }
    ],
    relatedScopeDisposition:
      "This record covers the user-reported App I page-108 visual only. App II/App III tire sections are not silently populated with this App I visual."
  };
}

function isCompleteUserExample(entry) {
  if (entry.status === "implemented-app1-only" || entry.status === "implemented-app2-only") return false;
  if (String(entry.status).endsWith("representative")) return false;
  return (
    entry.status === "implemented" ||
    entry.status === "implemented-app1-canonical" ||
    entry.status === "implemented-regulatory-panels-with-caba-overview"
  );
}

const copyAudit = auditVisibleCopy();
const document = {
  schemaVersion: 1,
  featureId: "034-manual-visual-content-crop",
  generatedBy: "scripts/manual-guide-visual-completeness-audit.mjs",
  generatedAt: new Date(0).toISOString(),
  scopeStatus: "first-controlled-batch-partial",
  userExamples: userExampleRecords,
  copyAudit,
  visualRecords: [
    mobilitySpaceRecord(),
    headrestCombinedRecord(),
    safetyEquipmentRecord(),
    hospitalMapRecord(),
    noAvanzarRecord(),
    anexoRegulatoryPanelsRecord(),
    blindSpotRecord(),
    tireManufacturingTreadLifeRecord()
  ],
  remainingRequiredExamples: userExampleRecords
    .filter((entry) => !isCompleteUserExample(entry))
    .map((entry) => ({
      id: entry.id,
      label: entry.label,
      status: entry.status,
      notes: entry.notes,
      remainingScopeNote: entry.remainingScopeNote
    }))
};

function evidenceString(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function firstDifferentLine(actual, expected) {
  const actualLines = actual.split("\n");
  const expectedLines = expected.split("\n");
  const maxLength = Math.max(actualLines.length, expectedLines.length);
  for (let index = 0; index < maxLength; index += 1) {
    if (actualLines[index] !== expectedLines[index]) {
      return {
        line: index + 1,
        actual: actualLines[index] ?? "<missing>",
        expected: expectedLines[index] ?? "<missing>"
      };
    }
  }
  return null;
}

function reportEvidenceMismatch(reason, detail) {
  console.error(`manual guide visual completeness audit failed: ${reason}`);
  if (detail) console.error(detail);
  console.error(`Expected committed evidence to match ${evidencePath}.`);
  console.error("Run `node scripts/manual-guide-visual-completeness-audit.mjs --write` to intentionally regenerate it.");
}

const expectedEvidence = evidenceString(document);

if (writeMode) {
  writeFileSync(evidencePath, expectedEvidence);
  console.log(`manual guide visual completeness audit wrote ${evidencePath}`);
  if (copyAudit.findings.length > 0) {
    console.error(`manual guide copy audit failed with ${copyAudit.findings.length} finding(s). Evidence: ${evidencePath}`);
    process.exit(1);
  }
  process.exit(0);
}

let failed = false;

if (copyAudit.findings.length > 0) {
  console.error(`manual guide copy audit failed with ${copyAudit.findings.length} finding(s). Evidence: ${evidencePath}`);
  failed = true;
}

if (!existsSync(evidencePath)) {
  reportEvidenceMismatch("committed evidence file is missing");
  failed = true;
} else {
  const committedEvidence = readFileSync(evidencePath, "utf8");
  let malformed = false;
  try {
    JSON.parse(committedEvidence);
  } catch (error) {
    reportEvidenceMismatch("committed evidence file is malformed JSON", error.message);
    malformed = true;
    failed = true;
  }
  if (!malformed && committedEvidence !== expectedEvidence) {
    const difference = firstDifferentLine(committedEvidence, expectedEvidence);
    reportEvidenceMismatch(
      "committed evidence is stale or different",
      difference
        ? `First difference at line ${difference.line}.\nCommitted: ${difference.actual}\nExpected: ${difference.expected}`
        : undefined
    );
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log(`manual guide visual completeness audit checked ${evidencePath}`);
