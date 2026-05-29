import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";

const registryPath = "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/page-registry.chapters-1-2.json";
const evidencePath = "content/validation/manual-guide-source-fidelity.evidence.json";
const manualGuidePath = "src/data/manualGuide.ts";
const appPath = "src/App.tsx";
const checkerPath = "scripts/manual-guide-source-fidelity.mjs";
const stylesPath = "src/styles.css";

const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
const manualGuideSource = readFileSync(manualGuidePath, "utf8");
const appSource = readFileSync(appPath, "utf8");
const checkerSource = readFileSync(checkerPath, "utf8");
const stylesSource = readFileSync(stylesPath, "utf8");
const manualGuideAppSource = appSource.slice(appSource.indexOf("function ManualGuidePageContentView"), appSource.indexOf("function manualDisplayText"));

function pageId(pageNumber) {
  return `manual-page-${String(pageNumber).padStart(3, "0")}`;
}

function writeTempFile(path, contents = "fixture") {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
  return path;
}

function writeImplementedRegistryFixture(tempDir, moduleSource, mutateEvidence = () => {}) {
  const moduleRoot = join(tempDir, "manual-pages");
  const implementedRegistryPath = join(tempDir, "page-registry.implemented.json");
  const implementedRegistry = JSON.parse(JSON.stringify(registry));
  const page = implementedRegistry.pages.find((entry) => entry.id === "manual-page-021");
  page.status = "implemented";
  page.sourceRegionMetadataStatus = "recorded";
  page.visualEvidenceStatus = "recorded";
  page.implementationEvidence = {
    pageId: "manual-page-021",
    sourcePage: 21,
    sourceRegionMetadata: {
      sourcePage: 21,
      sourceRegion: { x: 0, y: 0, width: 120, height: 80 },
      sourceAssetPath: writeTempFile(join(tempDir, "evidence", "source-crop.png")),
      cropDimensions: { width: 120, height: 80 },
      cropSha256: "fixture-source-crop-sha",
      cleanupScope: "none"
    },
    localAssetMetadata: {
      assetPath: writeTempFile(join(tempDir, "assets", "manual-page-021-artwork.png")),
      assetKind: "source-artwork",
      width: 120,
      height: 80,
      sha256: "fixture-artwork-sha",
      containsText: false,
      visibleSpanish: false
    },
    visibleSpanishStatus: "none",
    selectableTextStatus: "pass",
    desktopScreenshot: writeTempFile(join(tempDir, "screenshots", "manual-page-021-desktop.png")),
    mobileScreenshot: writeTempFile(join(tempDir, "screenshots", "manual-page-021-mobile.png")),
    boundingBoxChecks: [{ id: "fixture", status: "pass" }],
    forbiddenPatternScan: { status: "pass" },
    visualReviewNotes: ["fixture evidence only"],
    checkerResult: "pass"
  };
  mutateEvidence(page.implementationEvidence);
  writeTempFile(join(moduleRoot, "manual-page-021.ts"), moduleSource);
  writeFileSync(implementedRegistryPath, JSON.stringify(implementedRegistry, null, 2));
  return { implementedRegistryPath, moduleRoot };
}

function runCheckerWithFixture(registryFixturePath, moduleRoot) {
  return spawnSync(process.execPath, ["scripts/manual-guide-source-fidelity.mjs"], {
    encoding: "utf8",
    env: {
      ...process.env,
      MANUAL_GUIDE_REGISTRY_PATH: registryFixturePath,
      MANUAL_GUIDE_PAGE_MODULE_ROOT: moduleRoot
    }
  });
}

test("Chapter 1 and 2 pending registry contains exactly source pages 21-56", () => {
  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.manualId, "gcba-manual-vehiculo-4-ruedas-2023");
  assert.equal(registry.featureId, "030-manual-chapters-1-2");
  assert.deepEqual(registry.pageRange, { start: 21, end: 56 });

  const ids = registry.pages.map((page) => page.id);
  assert.deepEqual(ids, Array.from({ length: 36 }, (_, index) => pageId(index + 21)));

  for (const page of registry.pages) {
    assert.equal(page.status, "pending", `${page.id} is pending in the shared prerequisite`);
    assert.equal(page.routeHash, `#${page.id}`);
    assert.equal(page.labelRu, `Страница ${page.sourcePage}`);
    assert.equal(page.source.manualManifestPointer, `/pages/${page.sourcePage - 1}`);
    assert.equal(page.source.layoutManifestPointer, `/pages/${page.sourcePage - 1}`);
    assert.equal(page.source.referenceAsset, `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-${String(page.sourcePage).padStart(3, "0")}.jpg`);
    assert.equal(existsSync(page.source.referenceAsset), true, `${page.id} local source render exists`);
    assert.equal(page.pageContentModulePath, `src/data/manual-pages/${page.id}.ts`);
    assert.equal(page.sourceRegionMetadataStatus, "pending_until_page_pr");
    assert.equal(page.visualEvidenceStatus, "pending_until_page_pr");
    for (const forbiddenField of ["blocks", "bodyRu", "contentRu", "implementedContentPath", "screenshotPath", "sourceCropPath"]) {
      assert.equal(Object.hasOwn(page, forbiddenField), false, `${page.id} must not carry fake page content field ${forbiddenField}`);
    }
  }
});

test("Chapter 1 and 2 pages live under source-Índice chapter/topic hierarchy", () => {
  assert.equal(registry.chapters.length, 2);
  assert.deepEqual(
    registry.chapters.map((chapter) => chapter.id),
    ["chapter-1-sustainable-mobility", "chapter-2-responsibility"]
  );
  assert.deepEqual(registry.chapters[0].chapterPageIds, ["manual-page-021"]);
  assert.deepEqual(registry.chapters[1].chapterPageIds, ["manual-page-043"]);

  const topicPages = new Map(registry.chapters.flatMap((chapter) => chapter.topics.map((topic) => [topic.id, topic.pageIds])));
  assert.deepEqual(topicPages.get("ch1-cities-for-people"), ["manual-page-022"]);
  assert.deepEqual(topicPages.get("ch1-sustainable-mobility"), ["manual-page-023"]);
  assert.deepEqual(topicPages.get("ch1-pedestrian-priority"), ["manual-page-024", "manual-page-025", "manual-page-026", "manual-page-027", "manual-page-028", "manual-page-029"]);
  assert.deepEqual(topicPages.get("ch1-bicycle"), ["manual-page-030", "manual-page-031", "manual-page-032", "manual-page-033", "manual-page-034", "manual-page-035", "manual-page-036", "manual-page-037", "manual-page-038"]);
  assert.deepEqual(topicPages.get("ch1-public-transport-system"), ["manual-page-039", "manual-page-040"]);
  assert.deepEqual(topicPages.get("ch1-shared-trip"), ["manual-page-041", "manual-page-042"]);
  assert.deepEqual(topicPages.get("ch2-legal-responsibility"), ["manual-page-044", "manual-page-045"]);
  assert.deepEqual(topicPages.get("ch2-required-documents"), ["manual-page-046", "manual-page-047", "manual-page-048", "manual-page-049", "manual-page-050"]);
  assert.deepEqual(topicPages.get("ch2-incident-obligations"), ["manual-page-051", "manual-page-052", "manual-page-053", "manual-page-054", "manual-page-055"]);
  assert.deepEqual(topicPages.get("ch2-scoring"), ["manual-page-056"]);

  const topicSourceTitles = new Map(registry.chapters.flatMap((chapter) => chapter.topics.map((topic) => [topic.id, topic.sourceTitleEs])));
  const inPageLegalHeading = ["Responsabilidad", "jurídica"].join(" ");
  assert.equal(topicSourceTitles.get("ch2-legal-responsibility"), "Responsabilidades legales");
  assert.equal([...topicSourceTitles.values()].includes(inPageLegalHeading), false);

  const referenced = new Set([
    ...registry.chapters.flatMap((chapter) => chapter.chapterPageIds),
    ...registry.chapters.flatMap((chapter) => chapter.topics.flatMap((topic) => topic.pageIds))
  ]);
  assert.equal(referenced.size, 36);
  for (const page of registry.pages) assert.equal(referenced.has(page.id), true, `${page.id} is reachable from the hierarchy`);
});

test("Manual guide schema prepares page-local implementation and reusable style tokens", () => {
  for (const requiredSymbol of [
    "ManualGuidePageContent",
    "ManualGuideContentBlock",
    "chapter12ManualGuidePages",
    "manualGuidePageByHash",
    "manualGuidePageContentById",
    "implementedManualGuidePages",
    "manualGuideDocumentStyleTokens",
    "manualGuideVisualFidelityEvidenceFormat"
  ]) {
    assert.match(manualGuideSource, new RegExp(requiredSymbol), `manual guide source exposes ${requiredSymbol}`);
  }

  for (const requiredToken of [
    "manual-prose",
    "manual-callout-blue",
    "manual-chapter-divider",
    "manual-source-artwork",
    "manual-legal-detail",
    "introductionDocumentStyleGuide.tokens"
  ]) {
    assert.ok(manualGuideSource.includes(requiredToken), `manual guide style token registry includes ${requiredToken}`);
  }

  assert.match(manualGuideSource, /implementedManualGuidePages:\s*ManualGuidePageContent\[\]\s*=\s*\[\]/);
  assert.match(manualGuideSource, /manualGuidePageContentById = new Map/);
});

test("Manual guide UI renders pending page entries without opening fake content", () => {
  assert.match(manualGuideAppSource, /function ManualGuidePageContentView/);
  assert.match(manualGuideAppSource, /manualGuidePageIsAvailable/);
  assert.match(manualGuideAppSource, /disabled=\{!isAvailable\}/);
  assert.match(manualGuideAppSource, /const pageStatusLabel = isAvailable \? "готово" : "ожидает PR"/);
  assert.match(manualGuideAppSource, /aria-label=\{`\$\{page\.labelRu\}: \$\{pageStatusLabel\}`\}/);
  assert.match(manualGuideAppSource, /<small>\{pageStatusLabel\}<\/small>/);
  assert.match(manualGuideAppSource, /data-testid=\{`manual-guide-pending-\$\{page\.id\}`\}/);
  assert.match(manualGuideAppSource, /data-source-region-metadata-status=\{page\.sourceRegionMetadataStatus\}/);
  assert.match(manualGuideAppSource, /data-visual-evidence-status=\{page\.visualEvidenceStatus\}/);
  assert.doesNotMatch(manualGuideAppSource, /ожидает\s+отдельный\s+PR/);
  assert.match(stylesSource, /\.manual-guide-pages/);
  assert.doesNotMatch(manualGuideAppSource, /page-02[1-9]\.jpg|page-03\d\.jpg|page-04\d\.jpg|page-05[0-6]\.jpg/);
  assert.doesNotMatch(manualGuideAppSource, /placeholder body|coming soon article|fake content|lorem/iu);
});

test("Manual guide source-fidelity checker scans the implemented page renderer", () => {
  assert.match(checkerSource, /sliceSource\(appSource,\s*"function ManualGuidePageContentView"/);
  assert.match(manualGuideAppSource, /function ManualGuidePageContentView/);
  assert.match(manualGuideAppSource, /assetUrl\(block\.assetPath\)/);
});

test("Manual guide source-fidelity checker passes the shared prerequisite registry", () => {
  assert.equal(evidence.checkerId, "manual-guide-source-fidelity");
  assert.deepEqual(evidence.requiredPageRange, { start: 21, end: 56 });
  assert.equal(evidence.sharedPrereqExpectedOutput.pendingPages, 36);
  assert.equal(evidence.sharedPrereqExpectedOutput.implementedPages, 0);
  const output = execFileSync(process.execPath, ["scripts/manual-guide-source-fidelity.mjs"], { encoding: "utf8" });
  const result = JSON.parse(output);
  assert.equal(result.status, "pass");
  assert.equal(result.pendingPages, 36);
  assert.equal(result.implementedPages, 0);
  assert.equal(result.screenshotEvidence, "not_applicable_until_page_pr");
});

test("Manual guide source-fidelity checker rejects duplicate hierarchy page references", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-registry-"));
  try {
    const duplicateRegistryPath = join(tempDir, "page-registry.duplicate.json");
    const duplicateRegistry = JSON.parse(JSON.stringify(registry));
    duplicateRegistry.chapters[1].topics.find((topic) => topic.id === "ch2-scoring").pageIds.push("manual-page-044");
    writeFileSync(duplicateRegistryPath, JSON.stringify(duplicateRegistry, null, 2));

    const failure = spawnSync(process.execPath, ["scripts/manual-guide-source-fidelity.mjs"], {
      encoding: "utf8",
      env: {
        ...process.env,
        MANUAL_GUIDE_REGISTRY_PATH: duplicateRegistryPath
      }
    });

    assert.notEqual(failure.status, 0, "checker must fail when a page is referenced twice in the source hierarchy");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "Chapter/topic hierarchy must not duplicate pending page references");
    assert.deepEqual(result.details.duplicates, [{ id: "manual-page-044", count: 2 }]);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker accepts implemented pages with evidence", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-implemented-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const manualPage021 = { pageId: "manual-page-021", blocks: [] };\n'
    );
    const result = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.status, "pass");
    assert.equal(output.pendingPages, 35);
    assert.equal(output.implementedPages, 1);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects failing implemented evidence statuses", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-failing-evidence-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const manualPage021 = { pageId: "manual-page-021", blocks: [] };\n',
      (implementationEvidence) => {
        implementationEvidence.forbiddenPatternScan = { status: "fail", note: "previous pass" };
        implementationEvidence.selectableTextStatus = "fail";
        implementationEvidence.boundingBoxChecks = [{ id: "fixture", status: "fail" }];
        implementationEvidence.checkerResult = "pass";
      }
    );
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when implemented-page evidence records failing statuses");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "manual-page-021 selectableTextStatus must be pass");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects failing forbidden-pattern scans", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-failing-scan-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const manualPage021 = { pageId: "manual-page-021", blocks: [] };\n',
      (implementationEvidence) => {
        implementationEvidence.forbiddenPatternScan = { status: "fail", note: "previous pass" };
      }
    );
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when forbiddenPatternScan.status is fail despite containing the word pass");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "manual-page-021 forbiddenPatternScan.status must be pass");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker scans page content modules for forbidden assets", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-forbidden-module-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const manualPage021 = { assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-021.jpg" };\n'
    );
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when page content data references a full-page source render");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.match(result.message, /Forbidden manual guide pattern 'page-021\.jpg'/);
    assert.match(result.message, /manual-page-021\.ts/);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});
