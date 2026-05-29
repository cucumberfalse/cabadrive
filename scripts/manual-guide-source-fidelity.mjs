import { existsSync, readFileSync } from "node:fs";

const registryPath = process.env.MANUAL_GUIDE_REGISTRY_PATH ?? "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/page-registry.chapters-1-2.json";
const evidencePath = process.env.MANUAL_GUIDE_EVIDENCE_PATH ?? "content/validation/manual-guide-source-fidelity.evidence.json";
const appPath = "src/App.tsx";
const manualGuidePath = "src/data/manualGuide.ts";
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

function validatePendingRegistry(registry, evidence) {
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
    assertCondition(page.status === evidence.pendingPageExpectations.status, `${id} must stay pending in the shared prerequisite slice`, page);
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
    assertCondition(page.sourceRegionMetadataStatus === evidence.pendingPageExpectations.sourceRegionMetadataStatus, `${id} must not invent source-region metadata before implementation`, page);
    assertCondition(page.visualEvidenceStatus === evidence.pendingPageExpectations.visualEvidenceStatus, `${id} must not invent visual evidence before implementation`, page);
    for (const forbiddenField of ["blocks", "bodyRu", "contentRu", "implementedContentPath", "screenshotPath", "sourceCropPath"]) {
      assertCondition(!(forbiddenField in page), `${id} pending entry must not contain fake implemented content field ${forbiddenField}`, page);
    }
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

  const forbiddenScanTarget = `${manualGuideAppSource}\n${manualGuideStylesSource}`;
  for (const rule of evidence.forbiddenPatterns) {
    for (const pattern of rule.patterns) {
      assertCondition(!forbiddenScanTarget.toLocaleLowerCase("en-US").includes(pattern.toLocaleLowerCase("en-US")), `Forbidden manual guide pattern '${pattern}' from ${rule.id} found in shared prerequisite surface`);
    }
  }
}

function main() {
  const registry = readJson(registryPath);
  const evidence = readJson(evidencePath);
  validatePendingRegistry(registry, evidence);
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
