import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const evidencePath = "content/validation/manual-guide-visual-completeness.evidence.json";
const sectionRoot = "src/data/manual-sections";
const spaceAssetPath =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-sustainable-mobility/space-comparison-50-people-source.jpg";
const spaceSourceAssetPath =
  "content/validation/manual-guide/ch1-sustainable-mobility/page-023-space-comparison-50-people-source-crop.jpg";
const headrestAssetPath =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-safety-elements/headrest-combined-diagram-source-as-is.jpg";
const headrestSourceAssetPath =
  "content/validation/manual-guide/app2-safety-elements/page-132-headrest-combined-diagram-source-crop.jpg";

const deniedCopyPatterns = [
  {
    id: "visual-source-label",
    pattern: /визуал\s+источника/iu,
    reason: "Learner-facing card titles should name the learning object directly."
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
    pattern: /(?:исходн[а-яё]*|рабоч[а-яё]*)\s+(?:фрагмент|схем|карт|фото|фотограф|пример|визуал|изображ|рисунк)/iu,
    reason: "Fragment/source-region implementation wording is internal evidence, not guide copy."
  },
  {
    id: "saved-as-source",
    pattern: /(?:(?:оставлен[ао]?|сохранен[ао]?|перенесен[ао]?|показан[ао]?)\s+как\s+(?:официальн(?:ый|ая|ое)\s+)?источник|неизмененн[а-яё]*\s+источник)/iu,
    reason: "Visible copy should say what the learner sees or needs to remember."
  }
];

const userExampleRecords = [
  {
    id: "appendix-iv-regulatory-signs-no-avanzar",
    label: "Appendix IV regulatory signs and NO AVANZAR",
    status: "needs-implementation",
    sourcePages: [185, 186],
    runtimeTargets: ["app4-regulatory-page-185-source-card", "app4-regulatory-page-186-source-card"],
    notes:
      "Pending later batch: large source-faithful individual signs/rows/panels and external-caption translation boundaries."
  },
  {
    id: "app2-hospital-map-source-card",
    label: "Hospital map",
    status: "needs-implementation",
    sourcePages: [150],
    runtimeTargets: ["app2-hospital-map-source-card"],
    notes: "Pending later batch: best official-original extraction and body-text-scale label readability evidence."
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
    status: "needs-implementation",
    sourcePages: [108, 128],
    runtimeTargets: ["app1-safety-elements", "app2-safety-elements"],
    notes: "Pending later batch: official full-width blind-spot visual as-is."
  },
  {
    id: "tire-manufacturing-tread-life",
    label: "Tire manufacturing/date and tread-life visual",
    status: "needs-implementation",
    sourcePages: [108, 128],
    runtimeTargets: ["app1-safety-elements", "app2-safety-elements"],
    notes: "Pending later batch: official tire visual export and runtime insertion."
  },
  {
    id: "matafuegos-chaleco-reflectivo",
    label: "Matafuegos and Chaleco reflectivo",
    status: "needs-implementation",
    sourcePages: [119, 135],
    runtimeTargets: ["app1-other-required-safety-elements", "app2-safety-elements"],
    notes: "Pending later batch: official safety equipment visuals at normal manual scale."
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

function auditVisibleCopy() {
  const findings = [];
  for (const file of sectionFiles()) {
    for (const literal of stringLiterals(file.source)) {
      if (!/[А-Яа-яЁё]/u.test(literal.value)) continue;
      for (const rule of deniedCopyPatterns) {
        if (!rule.pattern.test(literal.value)) continue;
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
    allowedContext:
      "Ordinary learner-visible legal/source citation wording such as 'source recommends' remains allowed in this first guard; visual-card provenance/service wording is denied.",
    findingCount: findings.length,
    findings
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

const copyAudit = auditVisibleCopy();
const document = {
  schemaVersion: 1,
  featureId: "034-manual-visual-content-crop",
  generatedBy: "scripts/manual-guide-visual-completeness-audit.mjs",
  generatedAt: new Date(0).toISOString(),
  scopeStatus: "first-controlled-batch-partial",
  userExamples: userExampleRecords,
  copyAudit,
  visualRecords: [mobilitySpaceRecord(), headrestCombinedRecord()],
  remainingRequiredExamples: userExampleRecords
    .filter((entry) => entry.status !== "implemented")
    .map((entry) => ({ id: entry.id, label: entry.label, status: entry.status, notes: entry.notes }))
};

writeFileSync(evidencePath, `${JSON.stringify(document, null, 2)}\n`);

if (copyAudit.findings.length > 0) {
  console.error(`manual guide copy audit failed with ${copyAudit.findings.length} finding(s). Evidence: ${evidencePath}`);
  process.exit(1);
}

console.log(`manual guide visual completeness audit wrote ${evidencePath}`);
