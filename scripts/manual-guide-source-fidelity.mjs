import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const registryPath = process.env.MANUAL_GUIDE_REGISTRY_PATH ?? "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/page-registry.chapters-1-2.json";
const evidencePath = process.env.MANUAL_GUIDE_EVIDENCE_PATH ?? "content/validation/manual-guide-source-fidelity.evidence.json";
const appPath = "src/App.tsx";
const manualGuidePath = process.env.MANUAL_GUIDE_DATA_PATH ?? "src/data/manualGuide.ts";
const pageModuleRoot = process.env.MANUAL_GUIDE_PAGE_MODULE_ROOT ?? "src/data/manual-pages";
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

function pageId(pageNumber) {
  return `manual-page-${String(pageNumber).padStart(3, "0")}`;
}

function sliceSource(source, startMarker, endMarker, sourcePath) {
  const startIndex = source.indexOf(startMarker);
  const endIndex = source.indexOf(endMarker);
  assertCondition(startIndex >= 0, `${sourcePath} is missing scan start marker ${startMarker}`);
  assertCondition(endIndex > startIndex, `${sourcePath} is missing scan end marker ${endMarker} after ${startMarker}`);
  return source.slice(startIndex, endIndex);
}

function expectedPages(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
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

function resolvePageContentModulePath(modulePath) {
  const prefix = "src/data/manual-pages/";
  if (modulePath.startsWith(prefix)) {
    return join(pageModuleRoot, modulePath.slice(prefix.length));
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

function validatePendingPage(page, evidence, id) {
  assertCondition(page.status === evidence.pendingPageExpectations.status, `${id} pending entry must keep pending status`, page);
  assertCondition(page.sourceRegionMetadataStatus === evidence.pendingPageExpectations.sourceRegionMetadataStatus, `${id} must not invent source-region metadata before implementation`, page);
  assertCondition(page.visualEvidenceStatus === evidence.pendingPageExpectations.visualEvidenceStatus, `${id} must not invent visual evidence before implementation`, page);
  for (const forbiddenField of ["blocks", "bodyRu", "contentRu", "implementedContentPath", "screenshotPath", "sourceCropPath", "implementationEvidence", "implementedPageEvidence"]) {
    assertCondition(!(forbiddenField in page), `${id} pending entry must not contain fake implemented content field ${forbiddenField}`, page);
  }
}

function validateImplementedPage(page, evidence, id) {
  assertCondition(page.sourceRegionMetadataStatus === "recorded", `${id} implemented entry must record source-region metadata`, page);
  assertCondition(page.visualEvidenceStatus === "recorded", `${id} implemented entry must record visual evidence`, page);
  assertLocalPathExists(resolvePageContentModulePath(page.pageContentModulePath), `${id} implemented page content module`, page);

  const implementedEvidence = page.implementationEvidence ?? page.implementedPageEvidence;
  const format = evidence.implementedPageEvidenceFormat;
  assertRequiredFields(implementedEvidence, format.requiredFields, `${id} implementationEvidence`);
  assertCondition(implementedEvidence.pageId === id, `${id} implementationEvidence.pageId must match the registry entry`, implementedEvidence);
  assertCondition(implementedEvidence.sourcePage === page.sourcePage, `${id} implementationEvidence.sourcePage must match the registry entry`, implementedEvidence);
  assertCondition(implementedEvidence.checkerResult === "pass", `${id} implementationEvidence.checkerResult must be pass`, implementedEvidence);

  validateObjectOrArray(implementedEvidence.sourceRegionMetadata, format.sourceRegionMetadataFields, `${id} sourceRegionMetadata`, (entry, label) => {
    assertCondition(entry.sourcePage === page.sourcePage, `${label}.sourcePage must match the registry entry`, entry);
    assertLocalPathExists(entry.sourceAssetPath, `${label}.sourceAssetPath`, entry);
  });
  validateObjectOrArray(implementedEvidence.localAssetMetadata, format.localAssetMetadataFields, `${id} localAssetMetadata`, (entry, label) => {
    assertLocalPathExists(entry.assetPath, `${label}.assetPath`, entry);
  });
  assertLocalPathExists(implementedEvidence.desktopScreenshot, `${id} desktopScreenshot`, implementedEvidence);
  assertLocalPathExists(implementedEvidence.mobileScreenshot, `${id} mobileScreenshot`, implementedEvidence);
  validateStatusObject(implementedEvidence.selectableTextStatus, `${id} selectableTextStatus`);
  validateObjectOrArray(implementedEvidence.boundingBoxChecks, ["status"], `${id} boundingBoxChecks`, (entry, label) => {
    assertPassStatus(entry.status, `${label}.status`, entry);
  });
  validateStatusObject(implementedEvidence.forbiddenPatternScan, `${id} forbiddenPatternScan`);
}

function validatePageRegistry(registry, evidence) {
  assertCondition(registry.schemaVersion === 1, "Manual guide page registry schemaVersion must be 1");
  assertCondition(registry.manualId === "gcba-manual-vehiculo-4-ruedas-2023", "Manual guide registry must target the GCBA 4-wheel manual");
  assertCondition(registry.featureId === evidence.featureId, "Manual guide registry and evidence feature ids must match");

  const expected = expectedPages(evidence.requiredPageRange.start, evidence.requiredPageRange.end);
  assertCondition(registry.pages.length === expected.length, "Manual guide registry must contain exactly one entry per required page", {
    expected: expected.length,
    actual: registry.pages.length
  });

  const pagesById = new Map(registry.pages.map((page) => [page.id, page]));
  for (const number of expected) {
    const id = pageId(number);
    const page = pagesById.get(id);
    assertCondition(Boolean(page), `Missing pending manual page registry entry ${id}`);
    assertCondition(page.sourcePage === number, `${id} sourcePage must match its id`, page);
    assertCondition(page.routeHash === `#${id}`, `${id} must reserve a stable route hash`, page);
    assertCondition(page.source.manualManifestPointer === `/pages/${number - 1}`, `${id} manual manifest pointer must target the source page`, page);
    assertCondition(page.source.layoutManifestPointer === `/pages/${number - 1}`, `${id} layout manifest pointer must target the source page`, page);
    assertCondition(
      page.source.referenceAsset === `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-${String(number).padStart(3, "0")}.jpg`,
      `${id} must reference the local source page render only as evidence`,
      page
    );
    assertCondition(existsSync(page.source.referenceAsset), `${id} reference asset must exist locally`, page);
    assertCondition(page.pageContentModulePath === `src/data/manual-pages/${id}.ts`, `${id} must reserve a page-local future content module path`, page);
    if (page.status === "pending") validatePendingPage(page, evidence, id);
    else if (page.status === "implemented") validateImplementedPage(page, evidence, id);
    else assertCondition(false, `${id} status must be pending or implemented`, page);
  }

  const rawReferencedPageIds = [
    ...registry.chapters.flatMap((chapter) => chapter.chapterPageIds),
    ...registry.chapters.flatMap((chapter) => chapter.topics.flatMap((topic) => topic.pageIds))
  ];
  const expectedPageIds = expected.map(pageId);
  const expectedPageIdSet = new Set(expectedPageIds);
  const pageReferenceCounts = new Map();
  for (const id of rawReferencedPageIds) {
    pageReferenceCounts.set(id, (pageReferenceCounts.get(id) ?? 0) + 1);
  }

  const duplicatePageReferences = [...pageReferenceCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([id, count]) => ({ id, count }));
  assertCondition(duplicatePageReferences.length === 0, "Chapter/topic hierarchy must not duplicate pending page references", {
    duplicates: duplicatePageReferences
  });

  const unknownPageIds = [...new Set(rawReferencedPageIds.filter((id) => !expectedPageIdSet.has(id)))];
  assertCondition(unknownPageIds.length === 0, "Chapter/topic hierarchy must not reference pages outside the required pending range", {
    unknownPageIds
  });

  const missingPageIds = expectedPageIds.filter((id) => !pageReferenceCounts.has(id));
  assertCondition(missingPageIds.length === 0, "Chapter/topic hierarchy must reference every pending page", {
    missingPageIds
  });

  assertCondition(rawReferencedPageIds.length === expected.length, "Chapter/topic hierarchy must contain exactly one raw reference per pending page", {
    referenced: rawReferencedPageIds.length,
    expected: expected.length
  });

  const referencedPageIds = new Set(rawReferencedPageIds);
  assertCondition(referencedPageIds.size === expected.length, "Chapter/topic hierarchy must reference every pending page exactly once", {
    referenced: referencedPageIds.size,
    expected: expected.length
  });
  for (const number of expected) {
    assertCondition(referencedPageIds.has(pageId(number)), `Chapter/topic hierarchy does not reference ${pageId(number)}`);
  }
}

function validateSourceWiring(registry, evidence) {
  const appSource = readFileSync(appPath, "utf8");
  const manualGuideSource = readFileSync(manualGuidePath, "utf8");
  const stylesSource = readFileSync(stylesPath, "utf8");
  const manualGuideAppSource = sliceSource(appSource, "function ManualGuidePageContentView", "function manualDisplayText", appPath);
  const manualGuideContentDataSource = sliceSource(manualGuideSource, "export const implementedManualGuidePages", "export const manualGuideDocumentStyleTokens", manualGuidePath);
  const manualGuideStylesSource = sliceSource(stylesSource, ".manual-guide-shell", ".intro-document", stylesPath);

  for (const requiredSymbol of [
    "manualGuideChapter12Registry",
    "chapter12ManualGuidePages",
    "manualGuidePageByHash",
    "manualGuidePageContentById",
    "manualGuideDocumentStyleTokens",
    "manualGuideVisualFidelityEvidenceFormat",
    "implementedManualGuidePages"
  ]) {
    assertCondition(manualGuideSource.includes(requiredSymbol), `manual guide schema/source is missing ${requiredSymbol}`);
  }

  assertCondition(manualGuideAppSource.includes("`manual-guide-pending-${page.id}`"), "manual guide renderer must expose pending page test ids");
  assertCondition(manualGuideAppSource.includes("function ManualGuidePageContentView"), "manual guide forbidden-pattern scan must include the implemented page renderer");
  assertCondition(manualGuideAppSource.includes("disabled={!isAvailable}"), "Pending pages must render as disabled buttons until implemented content exists");
  assertCondition(manualGuideAppSource.includes("assetUrl(block.assetPath)"), "manual guide forbidden-pattern scan must include future page artwork rendering");
  assertCondition(manualGuideAppSource.includes("data-source-region-metadata-status"), "Pending page buttons must expose source-region metadata status");
  assertCondition(manualGuideAppSource.includes("data-visual-evidence-status"), "Pending page buttons must expose visual evidence status");
  assertCondition(manualGuideStylesSource.includes(".manual-guide-pages"), "Manual guide pending page list styles must exist");

  const fullPageRasterPatterns = expectedPages(evidence.requiredPageRange.start, evidence.requiredPageRange.end).map((number) => `page-${String(number).padStart(3, "0")}.jpg`);
  const pageModulePaths = new Set(collectFiles(pageModuleRoot).filter((path) => /\.(?:ts|tsx|mjs|js|json)$/u.test(path)));
  for (const page of registry.pages.filter((page) => page.status === "implemented")) {
    pageModulePaths.add(resolvePageContentModulePath(page.pageContentModulePath));
  }
  const pageModuleScanTargets = [...pageModulePaths].map((path) => ({
    label: path,
    source: readFileSync(path, "utf8")
  }));
  assertNoForbiddenPatterns(
    [
      { label: `${appPath}:manual guide renderer`, source: manualGuideAppSource },
      { label: `${stylesPath}:manual guide styles`, source: manualGuideStylesSource },
      { label: `${manualGuidePath}:implemented page data`, source: manualGuideContentDataSource },
      ...pageModuleScanTargets
    ],
    evidence,
    fullPageRasterPatterns
  );
}

function main() {
  const registry = readJson(registryPath);
  const evidence = readJson(evidencePath);
  validatePageRegistry(registry, evidence);
  validateSourceWiring(registry, evidence);

  const result = {
    checkerId: evidence.checkerId,
    status: "pass",
    mode: evidence.mode,
    pagesChecked: registry.pages.length,
    pendingPages: registry.pages.filter((page) => page.status === "pending").length,
    implementedPages: registry.pages.filter((page) => page.status === "implemented").length,
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
