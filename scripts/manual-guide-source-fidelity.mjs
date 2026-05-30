import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const registryPath = process.env.MANUAL_GUIDE_REGISTRY_PATH ?? "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json";
const evidencePath = process.env.MANUAL_GUIDE_EVIDENCE_PATH ?? "content/validation/manual-guide-source-fidelity.evidence.json";
const appPath = "src/App.tsx";
const manualGuidePath = process.env.MANUAL_GUIDE_DATA_PATH ?? "src/data/manualGuide.ts";
const sectionModuleRoot = process.env.MANUAL_GUIDE_SECTION_MODULE_ROOT ?? "src/data/manual-sections";
const stylesPath = "src/styles.css";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function assertCondition(condition, message, details = {}) {
  if (!condition) {
    const error = new Error(message);
    error.details = details;
    throw error;
  }
}

function sourcePagesForRange(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function sourcePageAssetPath(sourcePage) {
  return `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-${String(sourcePage).padStart(3, "0")}.jpg`;
}

function sliceSource(source, startMarker, endMarker, sourcePath) {
  const startIndex = source.indexOf(startMarker);
  const endIndex = source.indexOf(endMarker);
  assertCondition(startIndex >= 0, `${sourcePath} is missing scan start marker ${startMarker}`);
  assertCondition(endIndex > startIndex, `${sourcePath} is missing scan end marker ${endMarker} after ${startMarker}`);
  return source.slice(startIndex, endIndex);
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assertRequiredFields(value, fields, messagePrefix) {
  assertCondition(isObject(value), `${messagePrefix} must be an object`, { value });
  for (const field of fields) {
    assertCondition(field in value, `${messagePrefix} is missing ${field}`, { value });
  }
}

function assertLocalPathExists(path, message, details = {}) {
  assertCondition(typeof path === "string" && path.length > 0, `${message} must be a non-empty path`, details);
  assertCondition(existsSync(path), `${message} must exist locally`, { ...details, path });
}

function validateObjectOrArray(value, fields, messagePrefix, validateEntry = () => {}) {
  if (Array.isArray(value)) {
    assertCondition(value.length > 0, `${messagePrefix} must contain at least one entry`);
    value.forEach((entry, index) => {
      assertRequiredFields(entry, fields, `${messagePrefix}[${index}]`);
      validateEntry(entry, `${messagePrefix}[${index}]`);
    });
    return;
  }
  assertRequiredFields(value, fields, messagePrefix);
  validateEntry(value, messagePrefix);
}

function assertPassStatus(value, message, details = {}) {
  assertCondition(value === "pass" || value === true, `${message} must be pass`, details);
}

function validateStatusObject(value, messagePrefix) {
  if (isObject(value) && "status" in value) {
    assertPassStatus(value.status, `${messagePrefix}.status`, value);
    return;
  }
  assertPassStatus(value, messagePrefix, { value });
}

function validateNoVisibleSpanishStatus(value, messagePrefix) {
  const allowedStatuses = new Set(["pass", "none", "no_visible_spanish", "no-visible-spanish"]);
  const status = isObject(value) && "status" in value ? value.status : value;
  assertCondition(allowedStatuses.has(status), `${messagePrefix} must record no visible Spanish text`, { value });
}

function resolveSectionContentModulePath(modulePath) {
  const prefix = "src/data/manual-sections/";
  if (modulePath.startsWith(prefix)) {
    return join(sectionModuleRoot, modulePath.slice(prefix.length));
  }
  return modulePath;
}

function collectFiles(rootPath) {
  if (!existsSync(rootPath)) return [];
  const stat = statSync(rootPath);
  if (stat.isFile()) return [rootPath];
  return readdirSync(rootPath).flatMap((entry) => collectFiles(join(rootPath, entry)));
}

function assertNoForbiddenPatterns(scanTargets, evidence, extraPatterns = []) {
  const configuredPatterns = evidence.forbiddenPatterns.flatMap((rule) => rule.patterns.map((pattern) => ({ id: rule.id, pattern })));
  const generatedPatterns = extraPatterns.map((pattern) => ({ id: "full-page-raster-base", pattern }));
  for (const { label, source } of scanTargets) {
    const lowerSource = source.toLocaleLowerCase("en-US");
    for (const { id, pattern } of [...configuredPatterns, ...generatedPatterns]) {
      assertCondition(
        !lowerSource.includes(pattern.toLocaleLowerCase("en-US")),
        `Forbidden manual guide pattern '${pattern}' from ${id} found in ${label}`
      );
    }
  }
}

function sectionSourcePages(section) {
  return section.sourcePages.map((entry) => entry.sourcePage);
}

function validatePendingSection(section, evidence, id) {
  assertCondition(section.status === evidence.pendingSectionExpectations.status, `${id} pending entry must keep pending status`, section);
  assertCondition(section.sourceRegionMetadataStatus === evidence.pendingSectionExpectations.sourceRegionMetadataStatus, `${id} must not invent source-region metadata before implementation`, section);
  assertCondition(section.visualEvidenceStatus === evidence.pendingSectionExpectations.visualEvidenceStatus, `${id} must not invent visual evidence before implementation`, section);
  for (const forbiddenField of ["blocks", "bodyRu", "contentRu", "implementedContentPath", "screenshotPath", "sourceCropPath", "implementationEvidence", "implementedSectionEvidence", "implementedPageEvidence"]) {
    assertCondition(!(forbiddenField in section), `${id} pending entry must not contain fake implemented content field ${forbiddenField}`, section);
  }
}

function validateImplementedSection(section, evidence, id) {
  assertCondition(section.sourceRegionMetadataStatus === "recorded", `${id} implemented entry must record source-region metadata`, section);
  assertCondition(section.visualEvidenceStatus === "recorded", `${id} implemented entry must record visual evidence`, section);
  assertLocalPathExists(resolveSectionContentModulePath(section.sectionContentModulePath), `${id} implemented section content module`, section);

  const implementedEvidence = section.implementationEvidence ?? section.implementedSectionEvidence;
  const format = evidence.implementedSectionEvidenceFormat;
  assertRequiredFields(implementedEvidence, format.requiredFields, `${id} implementationEvidence`);
  assertCondition(implementedEvidence.sectionId === id, `${id} implementationEvidence.sectionId must match the registry entry`, implementedEvidence);
  assertCondition(
    JSON.stringify(implementedEvidence.sourcePages) === JSON.stringify(sectionSourcePages(section)),
    `${id} implementationEvidence.sourcePages must match the registry entry`,
    implementedEvidence
  );
  assertCondition(implementedEvidence.checkerResult === "pass", `${id} implementationEvidence.checkerResult must be pass`, implementedEvidence);

  const allowedSourcePages = new Set(sectionSourcePages(section));
  validateObjectOrArray(implementedEvidence.sourceRegionMetadata, format.sourceRegionMetadataFields, `${id} sourceRegionMetadata`, (entry, label) => {
    assertCondition(allowedSourcePages.has(entry.sourcePage), `${label}.sourcePage must belong to the section source range`, entry);
    assertLocalPathExists(entry.sourceAssetPath, `${label}.sourceAssetPath`, entry);
  });
  validateObjectOrArray(implementedEvidence.localAssetMetadata, format.localAssetMetadataFields, `${id} localAssetMetadata`, (entry, label) => {
    assertLocalPathExists(entry.assetPath, `${label}.assetPath`, entry);
    assertCondition(entry.visibleSpanish === false, `${label}.visibleSpanish must be false`, entry);
  });
  assertLocalPathExists(implementedEvidence.desktopScreenshot, `${id} desktopScreenshot`, implementedEvidence);
  assertLocalPathExists(implementedEvidence.mobileScreenshot, `${id} mobileScreenshot`, implementedEvidence);
  validateNoVisibleSpanishStatus(implementedEvidence.visibleSpanishStatus, `${id} visibleSpanishStatus`);
  validateStatusObject(implementedEvidence.selectableTextStatus, `${id} selectableTextStatus`);
  validateObjectOrArray(implementedEvidence.boundingBoxChecks, ["status"], `${id} boundingBoxChecks`, (entry, label) => {
    assertPassStatus(entry.status, `${label}.status`, entry);
  });
  validateStatusObject(implementedEvidence.forbiddenPatternScan, `${id} forbiddenPatternScan`);
}

function validateSectionRegistry(registry, evidence) {
  assertCondition(registry.schemaVersion === 2, "Manual guide section registry schemaVersion must be 2");
  assertCondition(registry.manualId === "gcba-manual-vehiculo-4-ruedas-2023", "Manual guide registry must target the GCBA 4-wheel manual");
  assertCondition(registry.featureId === evidence.featureId, "Manual guide registry and evidence feature ids must match");
  assertCondition(JSON.stringify(registry.sourcePageRange) === JSON.stringify(evidence.requiredSourcePageRange), "Manual guide source page range must match evidence");

  assertCondition(!("pages" in registry), "Manual guide registry must not expose a raw source-PDF-page pages array");
  assertCondition(registry.sections.length === evidence.expectedSectionIds.length, "Manual guide registry must contain exactly one entry per expected source Índice section", {
    expected: evidence.expectedSectionIds.length,
    actual: registry.sections.length
  });

  const skippedSourcePages = new Set(evidence.skippedSourcePages.map((entry) => entry.sourcePage));
  assertCondition(JSON.stringify(registry.skippedSourcePages.map((entry) => entry.sourcePage).sort((a, b) => a - b)) === JSON.stringify([...skippedSourcePages].sort((a, b) => a - b)), "Skipped divider source pages must match evidence");

  const sectionIds = registry.sections.map((section) => section.id);
  assertCondition(JSON.stringify(sectionIds) === JSON.stringify(evidence.expectedSectionIds), "Manual guide sections must stay in source Índice order", { sectionIds });

  const coveredSourcePages = [];
  for (const section of registry.sections) {
    const id = section.id;
    const expectedRange = evidence.expectedSectionRanges[id];
    assertCondition(Boolean(expectedRange), `${id} must be an expected source Índice section`, section);
    assertCondition(JSON.stringify(section.sourcePageRange) === JSON.stringify(expectedRange), `${id} sourcePageRange must match source Índice metadata`, section);
    assertCondition(section.routeHash === `#manual-section-${id}`, `${id} must reserve a section route hash, not a raw page hash`, section);
    assertCondition(section.sectionContentModulePath === `src/data/manual-sections/${id}.ts`, `${id} must reserve a section-local future content module path`, section);
    assertCondition(!/^manual-page-\d{3}$/u.test(id), `${id} must not use a raw source PDF page id`, section);
    assertCondition(!section.routeHash.startsWith("#manual-page-"), `${id} routeHash must not expose a raw source PDF page route`, section);
    assertCondition(!section.sectionContentModulePath.includes("src/data/manual-pages/"), `${id} module path must not use the page-local module namespace`, section);

    const sourcePages = sourcePagesForRange(section.sourcePageRange.start, section.sourcePageRange.end);
    assertCondition(JSON.stringify(sectionSourcePages(section)) === JSON.stringify(sourcePages), `${id} sourcePages must enumerate the full source range`, section);
    for (const sourcePage of sourcePages) {
      assertCondition(!skippedSourcePages.has(sourcePage), `${id} must not include skipped divider-only source page ${sourcePage}`, section);
    }
    section.sourcePages.forEach((sourcePageEntry) => {
      assertCondition(sourcePageEntry.manualManifestPointer === `/pages/${sourcePageEntry.sourcePage - 1}`, `${id} manual manifest pointer must target the source page`, sourcePageEntry);
      assertCondition(sourcePageEntry.layoutManifestPointer === `/pages/${sourcePageEntry.sourcePage - 1}`, `${id} layout manifest pointer must target the source page`, sourcePageEntry);
      assertCondition(sourcePageEntry.referenceAsset === sourcePageAssetPath(sourcePageEntry.sourcePage), `${id} must reference the local source page render only as evidence metadata`, sourcePageEntry);
      assertCondition(existsSync(sourcePageEntry.referenceAsset), `${id} reference asset for source page ${sourcePageEntry.sourcePage} must exist locally`, sourcePageEntry);
      coveredSourcePages.push(sourcePageEntry.sourcePage);
    });

    if (section.status === "pending") validatePendingSection(section, evidence, id);
    else if (section.status === "implemented") validateImplementedSection(section, evidence, id);
    else assertCondition(false, `${id} status must be pending or implemented`, section);
  }

  const duplicateSectionIds = sectionIds.filter((id, index) => sectionIds.indexOf(id) !== index);
  assertCondition(duplicateSectionIds.length === 0, "Manual guide section ids must be unique", { duplicateSectionIds });

  const expectedCoveredPages = sourcePagesForRange(evidence.requiredSourcePageRange.start, evidence.requiredSourcePageRange.end).filter((sourcePage) => !skippedSourcePages.has(sourcePage));
  assertCondition(JSON.stringify(coveredSourcePages) === JSON.stringify(expectedCoveredPages), "Section registry must cover source pages 22-42 and 44-56 exactly once", {
    coveredSourcePages,
    expectedCoveredPages
  });

  const rawReferencedSectionIds = registry.chapters.flatMap((chapter) => {
    assertCondition(!("chapterPageIds" in chapter), `${chapter.id} must not keep raw chapter page ids`, chapter);
    assertCondition(!("topics" in chapter), `${chapter.id} must not keep page-based topic records`, chapter);
    return chapter.sectionIds;
  });
  const sectionReferenceCounts = new Map();
  for (const id of rawReferencedSectionIds) {
    sectionReferenceCounts.set(id, (sectionReferenceCounts.get(id) ?? 0) + 1);
  }
  const duplicateSectionReferences = [...sectionReferenceCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([id, count]) => ({ id, count }));
  assertCondition(duplicateSectionReferences.length === 0, "Chapter hierarchy must not duplicate section references", {
    duplicates: duplicateSectionReferences
  });

  const expectedSectionIdSet = new Set(evidence.expectedSectionIds);
  const unknownSectionIds = [...new Set(rawReferencedSectionIds.filter((id) => !expectedSectionIdSet.has(id)))];
  assertCondition(unknownSectionIds.length === 0, "Chapter hierarchy must not reference unknown sections", { unknownSectionIds });
  const missingSectionIds = evidence.expectedSectionIds.filter((id) => !sectionReferenceCounts.has(id));
  assertCondition(missingSectionIds.length === 0, "Chapter hierarchy must reference every expected section", { missingSectionIds });
}

function validateSourceWiring(registry, evidence) {
  const appSource = readFileSync(appPath, "utf8");
  const manualGuideSource = readFileSync(manualGuidePath, "utf8");
  const stylesSource = readFileSync(stylesPath, "utf8");
  const manualGuideAppSource = sliceSource(appSource, "function ManualGuideSectionContentView", "function manualDisplayText", appPath);
  const manualGuideContentDataSource = sliceSource(manualGuideSource, "export const implementedManualGuideSections", "export const manualGuideDocumentStyleTokens", manualGuidePath);
  const manualGuideStylesSource = sliceSource(stylesSource, ".manual-guide-shell", ".intro-document", stylesPath);

  for (const requiredSymbol of [
    "manualGuideChapter12Registry",
    "chapter12ManualGuideSections",
    "manualGuideSectionByHash",
    "manualGuideSectionContentById",
    "manualGuideChapter12SectionSummary",
    "manualGuideDocumentStyleTokens",
    "manualGuideVisualFidelityEvidenceFormat",
    "implementedManualGuideSections"
  ]) {
    assertCondition(manualGuideSource.includes(requiredSymbol), `manual guide schema/source is missing ${requiredSymbol}`);
  }

  assertCondition(manualGuideAppSource.includes("`manual-guide-pending-section-${section.id}`"), "manual guide renderer must expose pending section test ids");
  assertCondition(manualGuideAppSource.includes("function ManualGuideSectionContentView"), "manual guide forbidden-pattern scan must include the implemented section renderer");
  assertCondition(manualGuideAppSource.includes("disabled={!isAvailable}"), "Pending sections must render as disabled buttons until implemented content exists");
  assertCondition(manualGuideAppSource.includes("assetUrl(block.assetPath)"), "manual guide forbidden-pattern scan must include future section artwork rendering");
  assertCondition(manualGuideAppSource.includes("data-source-region-metadata-status"), "Pending section buttons must expose source-region metadata status");
  assertCondition(manualGuideAppSource.includes("data-visual-evidence-status"), "Pending section buttons must expose visual evidence status");
  assertCondition(manualGuideStylesSource.includes(".manual-guide-children"), "Manual guide pending section list styles must exist");
  assertCondition(!manualGuideStylesSource.includes(".manual-guide-pages"), "Manual guide styles must not keep raw page-list styles for Chapter 1/2 section inventory");
  assertCondition(!manualGuideAppSource.includes("manualGuidePage"), "Manual guide renderer must not keep page-based guide state names");
  assertCondition(!manualGuideSource.includes("chapter12ManualGuidePages"), "Manual guide data must not export Chapter 1/2 page registry concepts");
  assertCondition(!manualGuideSource.includes("src/data/manual-pages/"), "Manual guide data must not reserve page-local module paths for Chapter 1/2");

  const fullPageRasterPatterns = sourcePagesForRange(evidence.requiredSourcePageRange.start, evidence.requiredSourcePageRange.end)
    .map((number) => `page-${String(number).padStart(3, "0")}.jpg`);
  const sectionModulePaths = new Set(collectFiles(sectionModuleRoot).filter((path) => /\.(?:ts|tsx|mjs|js|json)$/u.test(path)));
  for (const section of registry.sections.filter((section) => section.status === "implemented")) {
    sectionModulePaths.add(resolveSectionContentModulePath(section.sectionContentModulePath));
  }
  const sectionModuleScanTargets = [...sectionModulePaths].map((path) => ({
    label: path,
    source: readFileSync(path, "utf8")
  }));
  assertNoForbiddenPatterns(
    [
      { label: `${appPath}:manual guide renderer`, source: manualGuideAppSource },
      { label: `${stylesPath}:manual guide styles`, source: manualGuideStylesSource },
      { label: `${manualGuidePath}:implemented section data`, source: manualGuideContentDataSource },
      ...sectionModuleScanTargets
    ],
    evidence,
    fullPageRasterPatterns
  );
}

function main() {
  const registry = readJson(registryPath);
  const evidence = readJson(evidencePath);
  validateSectionRegistry(registry, evidence);
  validateSourceWiring(registry, evidence);

  const result = {
    checkerId: evidence.checkerId,
    status: "pass",
    mode: evidence.mode,
    sectionsChecked: registry.sections.length,
    pendingSections: registry.sections.filter((section) => section.status === "pending").length,
    implementedSections: registry.sections.filter((section) => section.status === "implemented").length,
    skippedDividerPages: registry.skippedSourcePages.map((entry) => entry.sourcePage),
    forbiddenPatternRules: evidence.forbiddenPatterns.length,
    screenshotEvidence: evidence.sharedPrereqExpectedOutput.screenshotEvidence,
    sourceCropEvidence: evidence.sharedPrereqExpectedOutput.sourceCropEvidence
  };
  console.log(JSON.stringify(result, null, 2));
}

try {
  main();
} catch (error) {
  console.error(
    JSON.stringify(
      {
        checkerId: "manual-guide-source-fidelity",
        status: "fail",
        message: error instanceof Error ? error.message : String(error),
        details: error?.details ?? undefined
      },
      null,
      2
    )
  );
  process.exitCode = 1;
}
