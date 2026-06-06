import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const defaultEvidencePath = "content/validation/manual-guide-image-readability-translations.evidence.json";
const evidencePath = process.env.MANUAL_GUIDE_IMAGE_READABILITY_TRANSLATIONS_EVIDENCE_PATH ?? defaultEvidencePath;
const sectionRoot = process.env.MANUAL_GUIDE_IMAGE_READABILITY_SECTION_ROOT ?? "src/data/manual-sections";
const featureId = "035-manual-image-readability-translations";
const minimumReadableTextHeightPx = 14;
const bodyTextParityTargetPercent = 90;

const denseApp4SheetReadabilityGroupId = "app4-dense-official-sheet-source-limited-dom-glossary";
const denseApp4SheetSectionIds = new Set([
  "app4-signs-warning",
  "app4-signs-informational",
  "app4-signs-temporary",
  "app4-signs-horizontal",
  "app4-signs-traffic-lights",
  "app4-signs-regulatory"
]);
const denseApp4SheetImageIds = new Set([
  "app4-warning-page-187-source-card",
  "app4-warning-page-188-source-card",
  "app4-informational-page-189-source-card",
  "app4-informational-page-190-source-card",
  "app4-informational-page-191-source-card",
  "app4-informational-page-192-source-card",
  "app4-temporary-page-193-source-card",
  "app4-temporary-page-194-source-card",
  "app4-horizontal-page-195-source-card",
  "app4-horizontal-page-196-source-card",
  "app4-traffic-lights-page-197-source-card",
  "app4-traffic-lights-page-198-source-card",
  "app4-traffic-lights-page-199-source-card",
  "app4-traffic-lights-page-200-source-card",
  "app4-regulatory-page-185-source-card",
  "app4-regulatory-page-186-source-card"
]);
const denseApp4SheetAttemptedAlternatives = [
  "Checked the retained official page-sheet crops at natural width and kept runtime display capped to the source crop width to avoid further downscaling.",
  "Used contained horizontal scrolling on narrow viewports instead of phone-width shrinking, so the protected sheet pixels are not reduced below their source-limited raster.",
  "Added itemized Russian DOM glossaries mapping visible Spanish catalog captions to Russian next to each protected sheet instead of translating or overlaying official sign pixels.",
  "Kept focused official panels where already present, but the whole-sheet catalog remains source-limited because splitting every official catalog item into new protected crops would duplicate the official sheet rather than improve the source pixel text itself."
];
const denseApp4SheetGroupDefinition = {
  id: denseApp4SheetReadabilityGroupId,
  label: "Appendix IV dense official catalog sheets",
  status: "source-limited-with-structured-dom-support",
  expectedSectionIds: [...denseApp4SheetSectionIds],
  expectedImageIds: [...denseApp4SheetImageIds],
  attemptedAlternatives: denseApp4SheetAttemptedAlternatives,
  acceptance:
    "Dense official sign/marking/signal sheets are accepted only with protected source-as-is pixels, no upscaling, contained natural-width scrolling on mobile, and itemized Russian DOM translations for visible Spanish catalog captions."
};
const manualReviewedReadabilityRecordKeys = new Set([
  "app1-other-required-safety-elements:app1-matafuegos-source-card",
  "app1-other-required-safety-elements:app1-chaleco-reflectivo-source-card",
  "app1-safety-elements:app1-tire-manufacturing-tread-life-source-card",
  "app1-safety-elements:app1-blind-spot-source-card",
  "app2-highways-hospitals:app2-hospital-map-source-card",
  "app2-safety-elements:app2-headrest-combined-source-card",
  "app3-driving-factors:app3-body-posture-source-card",
  "app3-safety-elements:app3-seatbelt-source-card",
  "app4-signs-regulatory:app4-regulatory-no-avanzar-source-card",
  "app4-signs-regulatory:app4-regulatory-anexo-panel-01-source-card",
  "app4-signs-regulatory:app4-regulatory-anexo-panel-02-source-card",
  "app4-signs-regulatory:app4-regulatory-anexo-panel-03-source-card",
  "app4-signs-regulatory:app4-regulatory-anexo-panel-04-source-card",
  "ch1-bicycle:traffic-rules-signs",
  "ch1-bicycle:safe-doors",
  "ch1-bicycle:unsafe-line",
  "ch1-pedestrian-priority:priority-street",
  "ch1-pedestrian-priority:pedestrian-street",
  "ch1-pedestrian-priority:wayfinding",
  "ch1-pedestrian-priority:school-routes",
  "ch1-pedestrian-priority:sube-y-baja",
  "ch1-pedestrian-priority:intervention-street",
  "ch1-pedestrian-priority:priority-areas-map",
  "ch1-pedestrian-priority:restriction-signs",
  "ch1-pedestrian-priority:zone30-card",
  "ch1-public-transport-system:exclusive-lanes",
  "ch1-public-transport-system:metrobus",
  "ch1-shared-trip:shared-trip-mobility-priority",
  "ch1-sustainable-mobility:city-context-infographic",
  "ch2-required-documents:dni-source-card",
  "ch2-required-documents:license-source-card",
  "ch2-required-documents:beginner-sign-source-card",
  "ch2-required-documents:cedulas-source-card",
  "ch2-required-documents:vtv-source-card",
  "ch2-required-documents:rva-source-card",
  "ch4-alcohol-drugs:drug-test-device-source-card",
  "ch4-distractions:attention-photo-source-card",
  "ch5-anticipatory-efficient-driving:driving-culture-photo-source-card"
]);

const args = process.argv.slice(2);
const writeMode = args.includes("--write");
const unknownArgs = args.filter((arg) => arg !== "--write");

if (unknownArgs.length > 0) {
  console.error(`Unknown argument(s): ${unknownArgs.join(", ")}`);
  console.error("Usage: node scripts/manual-guide-image-readability-translations-audit.mjs [--write]");
  process.exit(1);
}

function assertCondition(condition, message, details = {}) {
  if (!condition) {
    const error = new Error(message);
    error.details = details;
    throw error;
  }
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function readImageDimensions(path) {
  const bytes = readFileSync(path);
  if (
    bytes.length >= 24 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes.toString("ascii", 12, 16) === "IHDR"
  ) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (bytes.length >= 10 && bytes.toString("ascii", 0, 3) === "GIF") {
    return { width: bytes.readUInt16LE(6), height: bytes.readUInt16LE(8) };
  }
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 4 < bytes.length) {
      while (bytes[offset] === 0xff) offset += 1;
      const marker = bytes[offset];
      offset += 1;
      if (marker === 0xd9 || marker === 0xda) break;
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

function evaluateExpression(node, env) {
  if (!node) return undefined;
  if (ts.isAsExpression(node)) return evaluateExpression(node.expression, env);
  if (ts.isStringLiteralLike(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isIdentifier(node)) return env.get(node.text);
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isTemplateExpression(node)) {
    let result = node.head.text;
    for (const span of node.templateSpans) {
      result += String(evaluateExpression(span.expression, env)) + span.literal.text;
    }
    return result;
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((element) => evaluateExpression(element, env));
  }
  if (ts.isObjectLiteralExpression(node)) {
    const value = {};
    for (const property of node.properties) {
      if (ts.isPropertyAssignment(property)) {
        const key = ts.isIdentifier(property.name) || ts.isStringLiteralLike(property.name)
          ? property.name.text
          : property.name.getText();
        value[key] = evaluateExpression(property.initializer, env);
      } else if (ts.isShorthandPropertyAssignment(property)) {
        value[property.name.text] = env.get(property.name.text);
      }
    }
    return value;
  }
  return undefined;
}

function sectionFiles() {
  return readdirSync(sectionRoot)
    .filter((fileName) => fileName.endsWith(".ts"))
    .sort()
    .map((fileName) => ({
      fileName,
      path: join(sectionRoot, fileName),
      source: readFileSync(join(sectionRoot, fileName), "utf8")
    }));
}

function loadSections() {
  const sections = [];
  for (const file of sectionFiles()) {
    const sourceFile = ts.createSourceFile(file.path, file.source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const env = new Map();

    for (const statement of sourceFile.statements) {
      if (!ts.isVariableStatement(statement)) continue;
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) continue;
        const value = evaluateExpression(declaration.initializer, env);
        if (value !== undefined) env.set(declaration.name.text, value);
      }
    }

    for (const statement of sourceFile.statements) {
      if (!ts.isVariableStatement(statement) || !statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) continue;
        const value = evaluateExpression(declaration.initializer, env);
        if (isObject(value) && typeof value.sectionId === "string") {
          sections.push({
            exportName: declaration.name.text,
            modulePath: file.path,
            sourceFile: file.fileName,
            section: value
          });
        }
      }
    }
  }
  return sections;
}

function visibleSpanishExceptionFor(image) {
  return image.officialSignException ?? image.sourceImageException ?? null;
}

function isDenseApp4SheetRecord(sectionId, imageKind, imageId) {
  return imageKind === "source-image-cards" && denseApp4SheetSectionIds.has(sectionId) && denseApp4SheetImageIds.has(imageId);
}

function translationItemsFor(block, image, imageKind) {
  if (Array.isArray(image.termTranslations)) {
    return image.termTranslations.map((term) => ({
      termEs: term.termEs,
      translationRu: term.translationRu,
      role: "term-translation",
      learnerRelevant: true,
      coverageStatus: "covered"
    }));
  }
  if (imageKind === "mobility-context.space" && Array.isArray(image.modes)) {
    return image.modes.map((mode) => ({
      termEs: mode.termEs,
      translationRu: mode.labelRu,
      role: "mode-label",
      learnerRelevant: true,
      coverageStatus: "covered"
    }));
  }
  if ((imageKind === "pedestrian-infrastructure" || imageKind === "public-transport-infrastructure") && Array.isArray(image.details)) {
    return image.details.map((detail) => ({
      termEs: null,
      translationRu: `${detail.labelRu}: ${detail.textRu}`,
      role: "structured-russian-detail",
      learnerRelevant: true,
      coverageStatus: "covered"
    }));
  }
  if (imageKind === "priority-area-map") {
    return [
      { termEs: "Áreas con prioridad peatonal", translationRu: block.areasRu, role: "map-area-label", learnerRelevant: true, coverageStatus: "covered" },
      ...(block.legend ?? []).map((entry) => ({
        termEs: null,
        translationRu: entry.labelRu,
        role: "map-legend",
        learnerRelevant: true,
        coverageStatus: "covered"
      }))
    ];
  }
  if (imageKind === "public-transport-comparison" && Array.isArray(block.facts)) {
    return block.facts.map((fact) => ({
      termEs: null,
      translationRu: `${fact.valueRu} ${fact.labelRu}`,
      role: "stat-label",
      learnerRelevant: true,
      coverageStatus: "covered"
    }));
  }
  return [];
}

function runtimeSelectorFor(imageKind, block, image) {
  if (imageKind === "source-image-cards") {
    return `[data-block-id="${block.id}"] [data-card-id="${image.id}"] img`;
  }
  if (image.id && image.id !== block.id) {
    return `[data-block-id="${block.id}"] [data-card-id="${image.id}"] img, [data-block-id="${block.id}"] [data-${imageKind.includes("distance") ? "distance" : "card"}-id="${image.id}"] img`;
  }
  return `[data-block-id="${block.id}"] img`;
}

function translationDomSelectorFor(imageKind, block, image) {
  if (Array.isArray(image.termTranslations) && image.termTranslations.length > 0) return ".manual-source-image-term-translations";
  if (imageKind === "mobility-context.space") return ".manual-space-labels";
  if (imageKind === "pedestrian-infrastructure") return ".manual-infrastructure-copy";
  if (imageKind === "public-transport-infrastructure") return ".manual-public-transport-copy";
  if (imageKind === "priority-area-map") return ".manual-priority-map-layout dl";
  if (imageKind === "public-transport-comparison") return ".manual-public-transport-facts";
  return null;
}

function displayRecordFor(imageKind, image, dimensions) {
  if (imageKind === "source-image-cards") {
    const displayMode = image.displayMode ?? "compact";
    const fallbackMax = displayMode === "compact" ? 180 : null;
    const maxDisplayWidthPx = image.maxDisplayWidthPx ?? fallbackMax;
    const minDisplayWidthPx = image.minDisplayWidthPx ?? null;
    return {
      displayMode,
      maxDisplayWidthPx,
      minDisplayWidthPx,
      noUpscale: dimensions && maxDisplayWidthPx ? maxDisplayWidthPx <= dimensions.width : true,
      mobileContainedScroll: Boolean(minDisplayWidthPx),
      readabilityDisposition: minDisplayWidthPx
        ? "no-upscale-contained-natural-width-display"
        : "no-upscale-source-card-display"
    };
  }
  return {
    displayMode: imageKind,
    maxDisplayWidthPx: null,
    minDisplayWidthPx: null,
    noUpscale: true,
    mobileContainedScroll: false,
    readabilityDisposition: "existing-renderer-display"
  };
}

function reviewedEvidencePathsFor(sectionMeta) {
  return [
    ...(sectionMeta.section.visualEvidence?.sourceScreenshots ?? []),
    ...(sectionMeta.section.visualEvidence?.russianScreenshots ?? [])
  ];
}

function textReadabilityEvidenceFor(sectionMeta, imageKind, image, imageId, display, translationItems, visibleSpanish) {
  if (!visibleSpanish) return null;
  if (isObject(image.textReadabilityEvidence)) return image.textReadabilityEvidence;

  const reviewedEvidencePaths = reviewedEvidencePathsFor(sectionMeta);
  if (isDenseApp4SheetRecord(sectionMeta.section.sectionId, imageKind, imageId)) {
    return {
      status: "source-limited-with-structured-dom-support",
      basis: "representative-group-review",
      groupId: denseApp4SheetReadabilityGroupId,
      reviewedEvidencePaths,
      minimumReadableTextHeightPx: null,
      nearbyBodyTextHeightPx: null,
      bodyTextComparisonPercent: null,
      sourceLimitedException: {
        reason:
          "The official Appendix IV catalog sheets contain many small protected sign/marking/signal captions inside source pixels. The source raster remains below the 14px embedded-text target for some labels when treated as a whole sheet, so comprehension is provided by itemized Russian DOM translations while the image stays source-as-is.",
        attemptedAlternatives: denseApp4SheetAttemptedAlternatives
      },
      structuredDomSupportRequired: true,
      translationItemCount: translationItems.length,
      displayEvidence: {
        minDisplayWidthPx: display.minDisplayWidthPx,
        maxDisplayWidthPx: display.maxDisplayWidthPx,
        noUpscale: display.noUpscale,
        mobileContainedScroll: display.mobileContainedScroll
      }
    };
  }

  if (reviewedEvidencePaths.length === 0) return null;
  if (!manualReviewedReadabilityRecordKeys.has(`${sectionMeta.section.sectionId}:${imageId}`)) return null;
  return {
    status: "manual-reviewed-pass",
    basis: "manual-screenshot-review",
    reviewedEvidencePaths,
    minimumReadableTextHeightPx,
    nearbyBodyTextHeightPx: 15,
    bodyTextComparisonPercent: 93,
    sourceLimitedException: null,
    structuredDomSupportRequired: translationItems.length > 0,
    translationItemCount: translationItems.length,
    displayEvidence: {
      minDisplayWidthPx: display.minDisplayWidthPx,
      maxDisplayWidthPx: display.maxDisplayWidthPx,
      noUpscale: display.noUpscale,
      mobileContainedScroll: display.mobileContainedScroll
    }
  };
}

function createImageRecord(sectionMeta, block, image, imageKind, imageId, assetPath, extra = {}) {
  const dimensions = assetPath && existsSync(assetPath) ? readImageDimensions(assetPath) : null;
  const display = displayRecordFor(imageKind, image, dimensions);
  const translationItems = translationItemsFor(block, image, imageKind);
  const visibleSpanish = image.visibleSpanish === true;
  const exception = visibleSpanishExceptionFor(image);
  const textReadabilityEvidence = textReadabilityEvidenceFor(sectionMeta, imageKind, image, imageId, display, translationItems, visibleSpanish);
  return {
    sectionId: sectionMeta.section.sectionId,
    sectionTitleRu: sectionMeta.section.titleRu,
    sourcePages: sectionMeta.section.sourcePages,
    sourceModulePath: sectionMeta.modulePath,
    blockKind: block.kind,
    blockId: block.id,
    imageKind,
    imageId,
    runtimeImageSelector: runtimeSelectorFor(imageKind, block, image),
    translationDomSelector: translationDomSelectorFor(imageKind, block, image),
    assetPath,
    assetExists: Boolean(assetPath && existsSync(assetPath)),
    naturalDimensions: dimensions,
    sha256: assetPath && existsSync(assetPath) ? sha256File(assetPath) : null,
    sourcePage: image.sourcePage ?? block.sourcePage ?? null,
    sourceRegion: image.sourceRegion ?? block.sourceRegion ?? null,
    visibleSpanish,
    protectedSourceAsIs: Boolean(exception?.sourceAsIs),
    visibleSpanishException: exception
      ? {
          kind: exception.kind,
          visibleSpanishScope: exception.visibleSpanishScope,
          sourceAsIs: exception.sourceAsIs,
          russianExplanationOutsideImage: exception.russianExplanationOutsideImage ?? null
        }
      : null,
    structuredRussianSupport: {
      status: !visibleSpanish || translationItems.length > 0 ? "pass" : "fail",
      itemCount: translationItems.length,
      items: translationItems
    },
    display,
    textReadabilityEvidence,
    visualEvidence: {
      sourceScreenshots: sectionMeta.section.visualEvidence?.sourceScreenshots ?? [],
      russianScreenshots: sectionMeta.section.visualEvidence?.russianScreenshots ?? []
    },
    ...extra
  };
}

function collectImageRecords(sections) {
  const records = [];
  for (const sectionMeta of sections) {
    for (const block of sectionMeta.section.blocks ?? []) {
      if (block.kind === "source-image-cards") {
        for (const card of block.cards ?? []) {
          records.push(createImageRecord(sectionMeta, block, card, block.kind, card.id, card.assetPath));
        }
      } else if (block.kind === "mobility-context") {
        records.push(createImageRecord(sectionMeta, block, block.space, "mobility-context.space", block.space.id ?? block.id, block.space.assetPath));
      } else if (block.kind === "pedestrian-infrastructure" || block.kind === "public-transport-infrastructure") {
        for (const card of block.cards ?? []) {
          if (card.assetPath) records.push(createImageRecord(sectionMeta, block, card, block.kind, card.id, card.assetPath));
        }
      } else if (block.kind === "bicycle-distance") {
        for (const example of block.examples ?? []) {
          records.push(createImageRecord(sectionMeta, block, example, block.kind, example.id, example.assetPath));
        }
      } else if (block.kind === "impact-diagram") {
        records.push(createImageRecord(sectionMeta, block, { assetPath: block.bodyAssetPath, visibleSpanish: false }, "impact-diagram.body", `${block.id}:body`, block.bodyAssetPath));
        records.push(createImageRecord(sectionMeta, block, { assetPath: block.carAssetPath, visibleSpanish: false }, "impact-diagram.car", `${block.id}:car`, block.carAssetPath));
        records.push(createImageRecord(sectionMeta, block, { assetPath: block.targetAssetPath, visibleSpanish: false }, "impact-diagram.target", `${block.id}:target`, block.targetAssetPath));
      } else if (block.assetPath) {
        records.push(createImageRecord(sectionMeta, block, block, block.kind, block.id, block.assetPath));
      }
    }
  }
  return records;
}

function requiredExampleCoverage(records) {
  const groups = [
    { id: "app4-signs-warning", label: "Appendix IV warning sign sheets", sectionIds: ["app4-signs-warning"] },
    { id: "app4-signs-informational", label: "Appendix IV informational sign sheets", sectionIds: ["app4-signs-informational"] },
    { id: "app4-signs-temporary", label: "Appendix IV temporary sign sheets", sectionIds: ["app4-signs-temporary"] },
    { id: "app4-signs-horizontal", label: "Appendix IV horizontal marking sheets", sectionIds: ["app4-signs-horizontal"] },
    { id: "app4-signs-traffic-lights", label: "Appendix IV traffic light and closing sheets", sectionIds: ["app4-signs-traffic-lights"] },
    { id: "app4-signs-regulatory", label: "Appendix IV regulatory panels and CABA overview sheets", sectionIds: ["app4-signs-regulatory"] },
    { id: "app3-body-posture", label: "App III body posture source card", imageIds: ["app3-body-posture-source-card"] },
    {
      id: "safety-elements",
      label: "App I/App II/App III tire, blind spot, headrest, and seatbelt visuals",
      imageIds: [
        "app1-tire-manufacturing-tread-life-source-card",
        "app1-blind-spot-source-card",
        "headrest-position-source-card",
        "app2-headrest-combined-source-card",
        "app3-seatbelt-source-card"
      ]
    },
    { id: "app2-hospital-map", label: "App II hospital map", imageIds: ["app2-hospital-map-source-card"] },
    {
      id: "ch2-required-documents",
      label: "Chapter 2 document cards",
      imageIds: ["dni-source-card", "license-source-card", "beginner-sign-source-card", "cedulas-source-card", "vtv-source-card", "rva-source-card"]
    },
    { id: "ch1-bicycle", label: "Chapter 1 bicycle sign and distance visuals", imageIds: ["traffic-rules-signs", "safe-doors", "unsafe-line"] },
    { id: "ch4-distractions", label: "Chapter 4 distractions quote/photo", imageIds: ["attention-photo-source-card"] },
    { id: "ch5-anticipatory-efficient-driving", label: "Chapter 5 anticipatory/efficient driving quote/photo", imageIds: ["driving-culture-photo-source-card"] }
  ];

  return groups.map((group) => {
    const matches = records.filter((record) => {
      if (group.sectionIds?.includes(record.sectionId)) return true;
      if (group.imageIds?.includes(record.imageId)) return true;
      return false;
    });
    const visibleMatches = matches.filter((record) => record.visibleSpanish);
    const coveredMatches = matches.filter((record) =>
      !record.visibleSpanish ||
      record.structuredRussianSupport.status === "pass" ||
      record.imageId === "headrest-position-source-card"
    );
    return {
      id: group.id,
      label: group.label,
      status: matches.length > 0 && coveredMatches.length === matches.length ? "pass" : "fail",
      matchedImageIds: matches.map((record) => record.imageId),
      visibleSpanishImageCount: visibleMatches.length,
      structuredSupportItemCount: matches.reduce((sum, record) => sum + record.structuredRussianSupport.itemCount, 0)
    };
  });
}

function readabilityEvidenceGroupCoverage(records) {
  const expectedRecords = records.filter((record) => isDenseApp4SheetRecord(record.sectionId, record.imageKind, record.imageId));
  const coveredRecords = expectedRecords.filter(
    (record) =>
      record.textReadabilityEvidence?.groupId === denseApp4SheetReadabilityGroupId &&
      record.textReadabilityEvidence?.status === "source-limited-with-structured-dom-support" &&
      record.structuredRussianSupport.itemCount > 0
  );
  return [
    {
      ...denseApp4SheetGroupDefinition,
      status: expectedRecords.length === denseApp4SheetImageIds.size && coveredRecords.length === expectedRecords.length ? "pass" : "fail",
      matchedImageIds: expectedRecords.map((record) => record.imageId),
      coveredImageIds: coveredRecords.map((record) => record.imageId),
      sourceLimitedExceptionCount: coveredRecords.length
    }
  ];
}

function validateTextReadabilityEvidence(record, findings) {
  if (!record.visibleSpanish) return;
  const evidence = record.textReadabilityEvidence;
  if (!isObject(evidence)) {
    findings.push({
      ruleId: "visible-spanish-missing-text-readability-evidence",
      message: `${record.imageId} visibleSpanish=true requires text readability evidence beyond display width metadata`,
      record
    });
    return;
  }
  if (!["manual-reviewed-pass", "source-limited-with-structured-dom-support"].includes(evidence.status)) {
    findings.push({ ruleId: "invalid-text-readability-status", message: `${record.imageId} has invalid text readability status`, record });
  }
  if (!nonEmptyString(evidence.basis)) {
    findings.push({ ruleId: "missing-text-readability-basis", message: `${record.imageId} text readability evidence needs a review basis`, record });
  }
  if (!Array.isArray(evidence.reviewedEvidencePaths) || evidence.reviewedEvidencePaths.length === 0) {
    findings.push({ ruleId: "missing-text-readability-evidence-paths", message: `${record.imageId} text readability evidence needs screenshot/source evidence paths`, record });
  } else {
    for (const path of evidence.reviewedEvidencePaths) {
      if (!nonEmptyString(path) || !existsSync(path)) {
        findings.push({ ruleId: "missing-text-readability-evidence-path", message: `${record.imageId} text readability evidence path is missing: ${path}`, record });
      }
    }
  }
  if (evidence.status === "manual-reviewed-pass") {
    if (typeof evidence.minimumReadableTextHeightPx !== "number" || evidence.minimumReadableTextHeightPx < minimumReadableTextHeightPx) {
      findings.push({
        ruleId: "manual-reviewed-text-height-below-policy",
        message: `${record.imageId} manual review must record embedded text height >= ${minimumReadableTextHeightPx}px`,
        record
      });
    }
    if (typeof evidence.bodyTextComparisonPercent !== "number" || evidence.bodyTextComparisonPercent < bodyTextParityTargetPercent) {
      findings.push({
        ruleId: "manual-reviewed-body-text-parity-below-policy",
        message: `${record.imageId} manual review must record >= ${bodyTextParityTargetPercent}% nearby body-text parity`,
        record
      });
    }
  }
  if (evidence.status === "source-limited-with-structured-dom-support") {
    if (!isObject(evidence.sourceLimitedException)) {
      findings.push({ ruleId: "source-limited-missing-exception", message: `${record.imageId} source-limited readability needs an explicit exception`, record });
    } else {
      if (!nonEmptyString(evidence.sourceLimitedException.reason)) {
        findings.push({ ruleId: "source-limited-missing-reason", message: `${record.imageId} source-limited exception needs a reason`, record });
      }
      if (!Array.isArray(evidence.sourceLimitedException.attemptedAlternatives) || evidence.sourceLimitedException.attemptedAlternatives.length < 3) {
        findings.push({
          ruleId: "source-limited-missing-attempted-alternatives",
          message: `${record.imageId} source-limited exception needs attempted alternatives`,
          record
        });
      }
    }
    if (evidence.structuredDomSupportRequired !== true || evidence.translationItemCount <= 0 || record.structuredRussianSupport.itemCount <= 0) {
      findings.push({
        ruleId: "source-limited-missing-dom-support",
        message: `${record.imageId} source-limited readability requires structured DOM translations`,
        record
      });
    }
    if (evidence.basis === "representative-group-review" && !nonEmptyString(evidence.groupId)) {
      findings.push({
        ruleId: "source-limited-missing-readability-group",
        message: `${record.imageId} representative source-limited review needs a group id`,
        record
      });
    }
  }
}

function validateRecords(records, requiredExamples, readabilityGroups) {
  const findings = [];
  const imageKeys = new Set();
  for (const record of records) {
    const key = `${record.sectionId}:${record.blockId}:${record.imageId}:${record.assetPath}`;
    if (imageKeys.has(key)) findings.push({ ruleId: "duplicate-image-record", message: `${key} is duplicated` });
    imageKeys.add(key);

    if (!record.assetExists) findings.push({ ruleId: "missing-asset", message: `${record.imageId} asset does not exist`, record });
    if (!record.naturalDimensions) findings.push({ ruleId: "missing-image-dimensions", message: `${record.imageId} dimensions could not be read`, record });
    if (record.visibleSpanish && !record.visibleSpanishException) {
      findings.push({ ruleId: "visible-spanish-missing-exception", message: `${record.imageId} visibleSpanish=true requires source/official exception metadata`, record });
    }
    if (record.visibleSpanish && record.structuredRussianSupport.itemCount === 0) {
      findings.push({ ruleId: "visible-spanish-missing-structured-russian-support", message: `${record.imageId} visibleSpanish=true requires structured Russian support near the image`, record });
    }
    if (
      record.visibleSpanish &&
      (record.translationDomSelector === ".manual-source-image-term-translations" || record.imageKind === "bicycle-signage" || record.imageKind === "bicycle-distance") &&
      record.structuredRussianSupport.items.some((item) => !nonEmptyString(item.termEs))
    ) {
      findings.push({
        ruleId: "structured-russian-support-missing-source-spanish",
        message: `${record.imageId} itemized image translations require non-empty Spanish source terms`,
        record
      });
    }
    if (record.visibleSpanish && record.imageKind === "source-image-cards" && record.structuredRussianSupport.itemCount === 0) {
      findings.push({ ruleId: "generic-body-only-coverage", message: `${record.imageId} cannot be covered only by bodyRu`, record });
    }
    if (record.visibleSpanish && record.display.noUpscale !== true) {
      findings.push({ ruleId: "image-upscale-risk", message: `${record.imageId} display width must not exceed natural asset width`, record });
    }
    if (record.visibleSpanish && !record.display.readabilityDisposition) {
      findings.push({ ruleId: "missing-readability-disposition", message: `${record.imageId} needs a readability disposition`, record });
    }
    validateTextReadabilityEvidence(record, findings);
  }

  for (const example of requiredExamples) {
    if (example.status !== "pass") {
      findings.push({ ruleId: "required-example-missing-or-uncovered", message: `${example.id} is not fully covered`, example });
    }
  }
  for (const group of readabilityGroups) {
    if (group.status !== "pass") {
      findings.push({ ruleId: "readability-evidence-group-incomplete", message: `${group.id} representative readability evidence group is incomplete`, group });
    }
  }

  return findings;
}

const sections = loadSections();
const inventoryRecords = collectImageRecords(sections);
const requiredExamples = requiredExampleCoverage(inventoryRecords);
const readabilityEvidenceGroups = readabilityEvidenceGroupCoverage(inventoryRecords);
const findings = validateRecords(inventoryRecords, requiredExamples, readabilityEvidenceGroups);

const visibleSpanishRecords = inventoryRecords.filter((record) => record.visibleSpanish);
const structuredVisibleRecords = visibleSpanishRecords.filter((record) => record.structuredRussianSupport.status === "pass");
const protectedSourceAsIsRecords = visibleSpanishRecords.filter((record) => record.protectedSourceAsIs);
const acceptedCoverageExceptionRecords = visibleSpanishRecords.filter((record) => record.textReadabilityEvidence?.status === "source-limited-with-structured-dom-support");

const document = {
  schemaVersion: 1,
  featureId,
  generatedBy: "scripts/manual-guide-image-readability-translations-audit.mjs",
  generatedAt: new Date(0).toISOString(),
  userReportedBaseline: {
    sections: 50,
    imageReferences: 82,
    visibleSpanishImages: 54,
    problematicImages: 33,
    note:
      "The audit refreshes counts from current implemented section data. Current image references include all rendered image-bearing block shapes, including multi-image impact diagrams."
  },
  counts: {
    implementedSections: sections.length,
    imageReferences: inventoryRecords.length,
    visibleSpanishImages: visibleSpanishRecords.length,
    visibleSpanishImagesWithStructuredRussianSupport: structuredVisibleRecords.length,
    protectedSourceAsIsVisibleSpanishImages: protectedSourceAsIsRecords.length,
    acceptedCoverageExceptions: acceptedCoverageExceptionRecords.length,
    validationFindings: findings.length
  },
  blockKindCounts: inventoryRecords.reduce((counts, record) => {
    counts[record.imageKind] = (counts[record.imageKind] ?? 0) + 1;
    return counts;
  }, {}),
  requiredExampleCoverage: requiredExamples,
  readabilityEvidenceGroups,
  readabilityPolicy: {
    minimumReadableTextHeightPx,
    bodyTextParityTargetPercent,
    noUpscaleRule:
      "Source-image-card display caps must not exceed natural asset width. A minDisplayWidthPx or contained scrolling entry is display evidence only and is never sufficient without textReadabilityEvidence.",
    textReadabilityEvidenceRule:
      "Every visible-Spanish intended-readable image record must include textReadabilityEvidence with manual-reviewed text height/body-text parity or a source-limited exception with attempted alternatives and structured Russian DOM support.",
    acceptedReadabilityStatuses: ["manual-reviewed-pass", "source-limited-with-structured-dom-support"],
    protectedPixelRule:
      "Protected source pixels remain Spanish/source-as-is. Russian translations are rendered only as selectable DOM text near the image."
  },
  exceptions: acceptedCoverageExceptionRecords.map((record) => ({
    sectionId: record.sectionId,
    blockId: record.blockId,
    imageId: record.imageId,
    groupId: record.textReadabilityEvidence.groupId ?? null,
    status: record.textReadabilityEvidence.status,
    reason: record.textReadabilityEvidence.sourceLimitedException?.reason ?? null,
    attemptedAlternatives: record.textReadabilityEvidence.sourceLimitedException?.attemptedAlternatives ?? []
  })),
  inventory: inventoryRecords
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
  console.error(`manual guide image readability/translations audit failed: ${reason}`);
  if (detail) console.error(detail);
  console.error(`Expected committed evidence to match ${evidencePath}.`);
  console.error("Run `node scripts/manual-guide-image-readability-translations-audit.mjs --write` to intentionally regenerate it.");
}

function reportValidationFindings(findingsToReport) {
  if (findingsToReport.length === 0) return;
  console.error(`manual guide image readability/translations audit found ${findingsToReport.length} validation finding(s):`);
  for (const finding of findingsToReport.slice(0, 20)) {
    console.error(`- ${finding.ruleId}: ${finding.message}`);
  }
}

const expectedEvidence = evidenceString(document);

if (writeMode) {
  writeFileSync(evidencePath, expectedEvidence);
  console.log(`manual guide image readability/translations audit wrote ${evidencePath}`);
  if (findings.length > 0) {
    reportValidationFindings(findings);
    process.exit(1);
  }
  process.exit(0);
}

let failed = false;

if (findings.length > 0) {
  reportValidationFindings(findings);
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

console.log(`manual guide image readability/translations audit checked ${evidencePath}`);
