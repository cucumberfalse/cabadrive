import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";

const registryPath = "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json";
const oldPageRegistryPath = "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/page-registry.chapters-1-2.json";
const evidencePath = "content/validation/manual-guide-source-fidelity.evidence.json";
const manualGuidePath = "src/data/manualGuide.ts";
const appPath = "src/App.tsx";
const checkerPath = "scripts/manual-guide-source-fidelity.mjs";
const stylesPath = "src/styles.css";
const ch1CitiesModulePath = "src/data/manual-sections/ch1-cities-for-people.ts";
const ch1SustainableModulePath = "src/data/manual-sections/ch1-sustainable-mobility.ts";
const ch1PedestrianPriorityModulePath = "src/data/manual-sections/ch1-pedestrian-priority.ts";
const ch1BicycleModulePath = "src/data/manual-sections/ch1-bicycle.ts";

const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
const implementedSectionIds = new Set(["ch1-cities-for-people", "ch1-sustainable-mobility", "ch1-pedestrian-priority", "ch1-bicycle"]);
const manualGuideSource = readFileSync(manualGuidePath, "utf8");
const appSource = readFileSync(appPath, "utf8");
const checkerSource = readFileSync(checkerPath, "utf8");
const stylesSource = readFileSync(stylesPath, "utf8");
const ch1CitiesModuleSource = readFileSync(ch1CitiesModulePath, "utf8");
const ch1SustainableModuleSource = readFileSync(ch1SustainableModulePath, "utf8");
const ch1PedestrianPriorityModuleSource = readFileSync(ch1PedestrianPriorityModulePath, "utf8");
const ch1BicycleModuleSource = readFileSync(ch1BicycleModulePath, "utf8");
const manualGuideAppSource = appSource.slice(appSource.indexOf("function ManualGuideSectionContentView"), appSource.indexOf("function manualDisplayText"));

function sourcePagesForRange(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function uniqueInOrder(values) {
  return values.filter((value, index) => values.indexOf(value) === index);
}

function duplicatedValues(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value)
    .sort((a, b) => a - b);
}

function sourcePageAssetPath(sourcePage) {
  return `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-${String(sourcePage).padStart(3, "0")}.jpg`;
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function writeTempFile(path, contents = "fixture") {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
  return path;
}

function writeImplementedRegistryFixture(tempDir, moduleSource, mutateEvidence = () => {}) {
  const moduleRoot = join(tempDir, "manual-sections");
  const implementedRegistryPath = join(tempDir, "section-registry.implemented.json");
  const implementedRegistry = JSON.parse(JSON.stringify(registry));
  const section = implementedRegistry.sections.find((entry) => entry.id === "ch1-pedestrian-priority");
  section.status = "implemented";
  section.sourceRegionMetadataStatus = "recorded";
  section.visualEvidenceStatus = "recorded";
  section.implementationEvidence = {
    sectionId: "ch1-pedestrian-priority",
    sourcePages: [24, 25, 26, 27, 28, 29],
    sourceRegionMetadata: [
      {
        sourcePage: 24,
        sourceRegion: { x: 0, y: 0, width: 120, height: 80 },
        sourceAssetPath: writeTempFile(join(tempDir, "evidence", "source-crop-24.png")),
        cropDimensions: { width: 120, height: 80 },
        cropSha256: "fixture-source-crop-24-sha",
        cleanupScope: "none"
      },
      {
        sourcePage: 29,
        sourceRegion: { x: 10, y: 10, width: 90, height: 60 },
        sourceAssetPath: writeTempFile(join(tempDir, "evidence", "source-crop-29.png")),
        cropDimensions: { width: 90, height: 60 },
        cropSha256: "fixture-source-crop-29-sha",
        cleanupScope: "none"
      }
    ],
    localAssetMetadata: [
      {
        assetPath: writeTempFile(join(tempDir, "assets", "ch1-pedestrian-priority-artwork-1.png")),
        assetKind: "source-artwork",
        width: 120,
        height: 80,
        sha256: "fixture-artwork-1-sha",
        containsText: false,
        visibleSpanish: false
      },
      {
        assetPath: writeTempFile(join(tempDir, "assets", "ch1-pedestrian-priority-artwork-2.png")),
        assetKind: "source-artwork",
        width: 90,
        height: 60,
        sha256: "fixture-artwork-2-sha",
        containsText: false,
        visibleSpanish: false
      }
    ],
    visibleSpanishStatus: "none",
    selectableTextStatus: "pass",
    desktopScreenshot: writeTempFile(join(tempDir, "screenshots", "ch1-pedestrian-priority-desktop.png")),
    mobileScreenshot: writeTempFile(join(tempDir, "screenshots", "ch1-pedestrian-priority-mobile.png")),
    boundingBoxChecks: [{ id: "fixture", status: "pass" }],
    forbiddenPatternScan: { status: "pass" },
    visualReviewNotes: ["fixture evidence only"],
    checkerResult: "pass"
  };
  mutateEvidence(section.implementationEvidence);
  writeTempFile(join(moduleRoot, "ch1-cities-for-people.ts"), "export const ch1CitiesForPeopleSection = { sectionId: \"ch1-cities-for-people\" };\n");
  writeTempFile(join(moduleRoot, "ch1-sustainable-mobility.ts"), "export const ch1SustainableMobilitySection = { sectionId: \"ch1-sustainable-mobility\" };\n");
  writeTempFile(join(moduleRoot, "ch1-pedestrian-priority.ts"), moduleSource);
  writeTempFile(join(moduleRoot, "ch1-bicycle.ts"), "export const ch1BicycleSection = { sectionId: \"ch1-bicycle\", blocks: [] };\n");
  writeFileSync(implementedRegistryPath, JSON.stringify(implementedRegistry, null, 2));
  return { implementedRegistryPath, moduleRoot };
}

function runCheckerWithFixture(registryFixturePath, moduleRoot) {
  return spawnSync(process.execPath, ["scripts/manual-guide-source-fidelity.mjs"], {
    encoding: "utf8",
    env: {
      ...process.env,
      MANUAL_GUIDE_REGISTRY_PATH: registryFixturePath,
      MANUAL_GUIDE_SECTION_MODULE_ROOT: moduleRoot
    }
  });
}

test("Chapter 1 and 2 registry contains exactly ten source Índice sections and skipped divider metadata", () => {
  assert.equal(existsSync(oldPageRegistryPath), false, "page-based Chapter 1/2 registry was removed");
  assert.equal(registry.schemaVersion, 2);
  assert.equal(registry.manualId, "gcba-manual-vehiculo-4-ruedas-2023");
  assert.equal(registry.featureId, "030-manual-chapters-1-2");
  assert.deepEqual(registry.sourcePageRange, { start: 21, end: 56 });
  assert.equal(Object.hasOwn(registry, "pages"), false, "registry must not expose raw PDF page entries");
  assert.deepEqual(registry.skippedSourcePages.map((entry) => entry.sourcePage), [21, 43, 56]);
  assert.deepEqual(registry.skippedSourcePages.map((entry) => entry.reason), ["chapter-divider-only", "chapter-divider-only", "chapter-closing-slogan-only"]);

  assert.deepEqual(registry.sections.map((section) => section.id), evidence.expectedSectionIds);
  for (const section of registry.sections) {
    const expectedRange = evidence.expectedSectionRanges[section.id];
    const sourcePages = sourcePagesForRange(expectedRange.start, expectedRange.end);
    assert.deepEqual(section.sourcePageRange, expectedRange, `${section.id} source range follows source Índice`);
    assert.equal(section.routeHash, `#manual-section-${section.id}`);
    assert.equal(section.sectionContentModulePath, `src/data/manual-sections/${section.id}.ts`);
    if (implementedSectionIds.has(section.id)) {
      assert.equal(section.status, "implemented", `${section.id} is implemented in its section PR`);
      assert.equal(section.sourceRegionMetadataStatus, "recorded");
      assert.equal(section.visualEvidenceStatus, "recorded");
      assert.equal(section.implementationEvidence.sectionId, section.id);
      assert.deepEqual(section.implementationEvidence.sourcePages, sourcePages);
      assert.equal(existsSync(section.sectionContentModulePath), true, `${section.id} section module exists`);
    } else {
      assert.equal(section.status, "pending", `${section.id} remains pending for a later section PR`);
      assert.equal(section.sourceRegionMetadataStatus, "pending_until_section_pr");
      assert.equal(section.visualEvidenceStatus, "pending_until_section_pr");
    }
    assert.doesNotMatch(section.id, /^manual-page-\d{3}$/u);
    assert.doesNotMatch(section.routeHash, /^#manual-page-/u);
    assert.doesNotMatch(section.sectionContentModulePath, /src\/data\/manual-pages\//u);

    assert.deepEqual(section.sourcePages.map((entry) => entry.sourcePage), sourcePages);
    assert.equal(sourcePages.includes(21), false, `${section.id} does not include divider page 21`);
    assert.equal(sourcePages.includes(43), false, `${section.id} does not include divider page 43`);
    assert.equal(sourcePages.includes(56), false, `${section.id} does not include page 56 closing slogan as section content`);

    for (const sourcePageEntry of section.sourcePages) {
      assert.equal(sourcePageEntry.manualManifestPointer, `/pages/${sourcePageEntry.sourcePage - 1}`);
      assert.equal(sourcePageEntry.layoutManifestPointer, `/pages/${sourcePageEntry.sourcePage - 1}`);
      assert.equal(sourcePageEntry.referenceAsset, sourcePageAssetPath(sourcePageEntry.sourcePage));
      assert.equal(existsSync(sourcePageEntry.referenceAsset), true, `${section.id} local source render exists for ${sourcePageEntry.sourcePage}`);
    }

    for (const forbiddenField of ["blocks", "bodyRu", "contentRu", "implementedContentPath", "screenshotPath", "sourceCropPath"]) {
      assert.equal(Object.hasOwn(section, forbiddenField), false, `${section.id} must not carry fake section content field ${forbiddenField}`);
    }
  }
});

test("Chapter 1 and 2 hierarchy references source Índice sections, not raw PDF pages", () => {
  assert.equal(registry.chapters.length, 2);
  assert.deepEqual(
    registry.chapters.map((chapter) => chapter.id),
    ["chapter-1-sustainable-mobility", "chapter-2-responsibility"]
  );
  assert.deepEqual(registry.chapters[0].sectionIds, [
    "ch1-cities-for-people",
    "ch1-sustainable-mobility",
    "ch1-pedestrian-priority",
    "ch1-bicycle",
    "ch1-public-transport-system",
    "ch1-shared-trip"
  ]);
  assert.deepEqual(registry.chapters[1].sectionIds, [
    "ch2-legal-responsibility",
    "ch2-required-documents",
    "ch2-incident-obligations",
    "ch2-scoring"
  ]);

  for (const chapter of registry.chapters) {
    assert.equal(Object.hasOwn(chapter, "chapterPageIds"), false, `${chapter.id} skips divider-only page ids`);
    assert.equal(Object.hasOwn(chapter, "topics"), false, `${chapter.id} no longer stores page-based topic records`);
  }

  const topicSourceTitles = new Map(registry.sections.map((section) => [section.id, section.sourceTitleEs]));
  const inPageLegalHeading = ["Responsabilidad", "jurídica"].join(" ");
  assert.equal(topicSourceTitles.get("ch2-legal-responsibility"), "Responsabilidades legales");
  assert.equal([...topicSourceTitles.values()].includes(inPageLegalHeading), false);

  const coveredSourcePages = registry.sections.flatMap((section) => section.sourcePages.map((entry) => entry.sourcePage));
  assert.deepEqual(uniqueInOrder(coveredSourcePages), sourcePagesForRange(22, 42).concat(sourcePagesForRange(44, 55)));
  assert.deepEqual(duplicatedValues(coveredSourcePages), [55]);
});

test("Chapter 2 page 55 sharing is explicit and page 56 is book-only closing material", () => {
  const incident = registry.sections.find((section) => section.id === "ch2-incident-obligations");
  const scoring = registry.sections.find((section) => section.id === "ch2-scoring");
  assert.ok(incident, "incident obligations section exists");
  assert.ok(scoring, "scoring section exists");

  assert.deepEqual(incident.sourcePageRange, { start: 51, end: 55 });
  assert.deepEqual(scoring.sourcePageRange, { start: 55, end: 55 });
  assert.deepEqual(scoring.sourcePages.map((entry) => entry.sourcePage), [55]);
  assert.equal(scoring.sourcePages[0].referenceAsset, sourcePageAssetPath(55));
  assert.equal(registry.sections.flatMap((section) => section.sourcePages.map((entry) => entry.sourcePage)).includes(56), false);

  const closing = registry.skippedSourcePages.find((entry) => entry.sourcePage === 56);
  assert.equal(closing?.reason, "chapter-closing-slogan-only");
  assert.match(closing?.disposition ?? "", /not Scoring content/);

  assert.deepEqual(
    registry.sharedSourcePageOwnership.map((entry) => entry.sourcePage),
    [55],
    "only source page 55 is intentionally shared between section topics"
  );
  const sharedPage55 = registry.sharedSourcePageOwnership[0];
  assert.equal(sharedPage55.referenceAsset, sourcePageAssetPath(55));
  assert.deepEqual(sharedPage55.sectionBoundaries.map((boundary) => boundary.sectionId), ["ch2-incident-obligations", "ch2-scoring"]);

  assert.deepEqual(incident.sourceBoundaryEvidence.ownedLayoutBlockIdsOnSharedPage, [
    "page-055-block-02",
    "page-055-block-03",
    "page-055-block-04",
    "page-055-block-05",
    "page-055-block-06",
    "page-055-block-07"
  ]);
  assert.equal(incident.sourceBoundaryEvidence.endsBeforeLayoutBlockId, "page-055-block-08");
  assert.equal(incident.sourceBoundaryEvidence.excludesSectionId, "ch2-scoring");

  assert.equal(scoring.sourceBoundaryEvidence.startsAtLayoutBlockId, "page-055-block-08");
  assert.match(scoring.sourceBoundaryEvidence.startsAtSourceTextEs, /Sistema de Evaluación Permanente de Conductores o Scoring/);
  assert.equal(scoring.sourceBoundaryEvidence.omittedClosingSourcePage, 56);
  assert.deepEqual(scoring.sourceBoundaryEvidence.ownedLayoutBlockIdsOnSharedPage.slice(0, 2), ["page-055-block-08", "page-055-block-09"]);
});

test("Manual guide schema prepares section-local implementation and reusable style tokens", () => {
  for (const requiredSymbol of [
    "ManualGuideSectionContent",
    "ManualGuideContentBlock",
    "chapter12ManualGuideSections",
    "manualGuideSectionByHash",
    "manualGuideSectionContentById",
    "implementedManualGuideSections",
    "manualGuideChapter12SectionSummary",
    "manualGuideDocumentStyleTokens",
    "manualGuideVisualFidelityEvidenceFormat"
  ]) {
    assert.match(manualGuideSource, new RegExp(requiredSymbol), `manual guide source exposes ${requiredSymbol}`);
  }

  for (const requiredToken of [
    "manual-prose",
    "manual-callout-blue",
    "manual-section-heading",
    "manual-principle-pair",
    "manual-source-artwork",
    "manual-mobility-context",
    "manual-vulnerability-order",
    "manual-pedestrian-priority-visuals",
    "manual-bicycle-visuals",
    "manual-legal-detail",
    "introductionDocumentStyleGuide.tokens"
  ]) {
    assert.ok(manualGuideSource.includes(requiredToken), `manual guide style token registry includes ${requiredToken}`);
  }

  assert.match(manualGuideSource, /import \{ ch1CitiesForPeopleSection \}/);
  assert.match(manualGuideSource, /import \{ ch1SustainableMobilitySection \}/);
  assert.match(manualGuideSource, /import \{ ch1PedestrianPrioritySection \}/);
  assert.match(manualGuideSource, /import \{ ch1BicycleSection \}/);
  assert.match(
    manualGuideSource,
    /implementedManualGuideSections:\s*ManualGuideSectionContent\[\]\s*=\s*\[\s*ch1CitiesForPeopleSection,\s*ch1SustainableMobilitySection,\s*ch1PedestrianPrioritySection,\s*ch1BicycleSection\s*\]/
  );
  assert.match(manualGuideSource, /manualGuideSectionContentById = new Map/);
  assert.doesNotMatch(manualGuideSource, /chapter12ManualGuidePages|manualGuidePageByHash|manualGuidePageContentById|implementedManualGuidePages/);
});

test("Manual guide UI renders pending section entries without opening fake content", () => {
  assert.match(manualGuideAppSource, /function ManualGuideSectionContentView/);
  assert.match(manualGuideAppSource, /manualGuideSectionIsAvailable/);
  assert.match(manualGuideAppSource, /function manualGuideActiveGroupId/);
  assert.match(manualGuideAppSource, /const activeGroupId = manualGuideActiveGroupId\(selectedEntry, selectedManualSection\)/);
  const sectionGroupPrecedenceIndex = manualGuideAppSource.indexOf("child.section?.id === selectedManualSection.id");
  const introductionGroupFallbackIndex = manualGuideAppSource.indexOf("child.introductionRouteId === selectedEntry.id");
  assert.notEqual(sectionGroupPrecedenceIndex, -1, "active group lookup includes selected manual section");
  assert.notEqual(introductionGroupFallbackIndex, -1, "active group lookup includes introduction fallback");
  assert.ok(sectionGroupPrecedenceIndex < introductionGroupFallbackIndex, "selected manual section takes precedence over stale selected introduction entry");
  assert.match(manualGuideAppSource, /disabled=\{!isAvailable\}/);
  assert.match(manualGuideAppSource, /const sectionStatusLabel = isAvailable \? "готово" : "ожидает PR"/);
  assert.match(manualGuideAppSource, /aria-label=\{`\$\{section\.labelRu\}: \$\{sectionStatusLabel\}`\}/);
  assert.match(manualGuideAppSource, /<small>\{sectionStatusLabel\}<\/small>/);
  assert.match(manualGuideAppSource, /data-testid=\{`manual-guide-pending-section-\$\{section\.id\}`\}/);
  assert.match(manualGuideAppSource, /data-source-region-metadata-status=\{section\.sourceRegionMetadataStatus\}/);
  assert.match(manualGuideAppSource, /data-visual-evidence-status=\{section\.visualEvidenceStatus\}/);
  assert.doesNotMatch(manualGuideAppSource, /manual-guide-pending-manual-page-0\d{2}|manualGuidePage|ManualGuidePage/);
  assert.doesNotMatch(manualGuideAppSource, /#manual-page-0\d{2}|src\/data\/manual-pages\//);
  assert.doesNotMatch(stylesSource, /\.manual-guide-pages/);
  assert.doesNotMatch(manualGuideAppSource, /page-02[1-9]\.jpg|page-03\d\.jpg|page-04\d\.jpg|page-05[0-6]\.jpg/);
  assert.doesNotMatch(manualGuideAppSource, /placeholder body|coming soon article|fake content|lorem/iu);
});

test("ch1 cities section content covers source page 22 and no unrelated section content", () => {
  const section = registry.sections.find((entry) => entry.id === "ch1-cities-for-people");
  assert.ok(section, "ch1-cities-for-people registry entry exists");
  assert.equal(section.status, "implemented");
  assert.equal(section.sourceRegionMetadataStatus, "recorded");
  assert.equal(section.visualEvidenceStatus, "recorded");
  assert.equal(section.implementationEvidence.checkerResult, "pass");
  assert.equal(existsSync(section.implementationEvidence.sourceRegionMetadata[0].sourceAssetPath), true);
  assert.equal(existsSync(section.implementationEvidence.desktopScreenshot), true);
  assert.equal(existsSync(section.implementationEvidence.mobileScreenshot), true);

  for (const requiredText of [
    "Города для людей",
    "пешеходы, велосипедисты и водители",
    "пространство совместной жизни",
    "добраться быстрее, целым и невредимым",
    "ПЛАВНОСТЬ",
    "БЕЗОПАСНОСТЬ",
    "Соблюдать правила и закон здесь означает уважать другого человека",
    "С более сильного участника дороги требуют больше осторожности",
    "стремится получить водительское удостоверение",
    "осознать опасность управления транспортным средством",
    "Чем больше моторизованных транспортных средств",
    "больше девяти миллионов поездок в день",
    "общим пространством здорового сосуществования",
    "поддерживают устойчивую мобильность"
  ]) {
    assert.ok(ch1CitiesModuleSource.includes(requiredText), `missing page 22 learner text: ${requiredText}`);
  }

  assert.match(ch1CitiesModuleSource, /kind:\s*"principle-pair"/);
  assert.match(manualGuideAppSource, /data-testid="manual-principle-terms"/);
  assert.match(stylesSource, /\.manual-principle-pair[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-principle-terms[\s\S]*?grid-template-columns:\s*repeat\(2/);
  assert.match(manualGuideAppSource, /block\.kind === "principle-note"/);
  assert.match(stylesSource, /\.manual-principle-note[\s\S]*?color:\s*#1b6680/);
  const orderedBlockIds = [
    "shared-public-space",
    "safe-arrival",
    "traffic-system-principles",
    "solidarity-law-respect",
    "stronger-road-user-care",
    "motorized-crash-likelihood",
    "nine-million-trips",
    "streets-as-shared-space",
    "connectivity-sustainable-mobility"
  ];
  let previousBlockIndex = -1;
  for (const blockId of orderedBlockIds) {
    const blockIndex = ch1CitiesModuleSource.indexOf(`id: "${blockId}"`);
    assert.ok(blockIndex > previousBlockIndex, `${blockId} follows source page 22 order`);
    previousBlockIndex = blockIndex;
  }
  assert.doesNotMatch(ch1CitiesModuleSource, /Что такое устойчивая мобильность|Пешеходный приоритет|Велосипед|Система общественного транспорта|Совместная поездка/u);
  assert.doesNotMatch(ch1CitiesModuleSource, /page-021|page-022\.jpg|manual-page-021|#manual-page/u);
});

test("ch1 sustainable mobility section covers source page 23 infographics and no unrelated section content", () => {
  const section = registry.sections.find((entry) => entry.id === "ch1-sustainable-mobility");
  assert.ok(section, "ch1-sustainable-mobility registry entry exists");
  assert.equal(section.status, "implemented");
  assert.equal(section.sourceRegionMetadataStatus, "recorded");
  assert.equal(section.visualEvidenceStatus, "recorded");
  assert.equal(section.implementationEvidence.checkerResult, "pass");
  assert.equal(existsSync(section.sectionContentModulePath), true);
  assert.equal(existsSync(section.implementationEvidence.desktopScreenshot), true);
  assert.equal(existsSync(section.implementationEvidence.mobileScreenshot), true);
  for (const sourceRegion of section.implementationEvidence.sourceRegionMetadata) {
    assert.equal(existsSync(sourceRegion.sourceAssetPath), true, `${sourceRegion.sourceAssetPath} exists`);
  }
  for (const asset of section.implementationEvidence.localAssetMetadata) {
    assert.equal(existsSync(asset.assetPath), true, `${asset.assetPath} exists`);
    assert.equal(asset.visibleSpanish, false, `${asset.assetPath} records no visible Spanish`);
  }
  const spaceAsset = section.implementationEvidence.localAssetMetadata.find((asset) => asset.assetKind === "source-derived-nontext-50-person-space-comparison-row");
  const vulnerabilityAsset = section.implementationEvidence.localAssetMetadata.find((asset) => asset.assetKind === "source-derived-nontext-vulnerability-pictogram-row");
  assert.ok(spaceAsset, "space comparison runtime crop metadata exists");
  assert.ok(vulnerabilityAsset, "vulnerability runtime crop metadata exists");
  assert.equal(spaceAsset.assetPath, "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-sustainable-mobility/space-comparison-50-people-source.jpg");
  assert.equal(spaceAsset.width, 585);
  assert.equal(spaceAsset.height, 78);
  assert.equal(spaceAsset.sha256, "baab91b6701ae95b1cde574f3c172ca6b2335e1cb0f84a3905e4021664135b2b");
  assert.equal(sha256File(spaceAsset.assetPath), spaceAsset.sha256, "space comparison crop bytes match the recorded 50-person row hash");
  assert.equal(vulnerabilityAsset.assetPath, "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-sustainable-mobility/vulnerability-icons-source.jpg");
  assert.equal(vulnerabilityAsset.width, 590);
  assert.equal(vulnerabilityAsset.height, 115);
  assert.equal(vulnerabilityAsset.sha256, "016d48984bc5b463de8539e63f7608b0b6d227997d3aca84ee17da2f3edb91c5");
  assert.equal(sha256File(vulnerabilityAsset.assetPath), vulnerabilityAsset.sha256, "vulnerability strip bytes match its recorded hash");
  assert.notEqual(spaceAsset.sha256, vulnerabilityAsset.sha256, "space comparison must not reuse the vulnerability strip asset");

  for (const requiredText of [
    "Что такое устойчивая мобильность?",
    "Контекст города Буэнос-Айрес",
    "3 млн",
    "1,8 млн",
    "9 млн поездок в день",
    "3,5 млн межюрисдикционных поездок",
    "5,5 млн внутренних поездок",
    "84% - поездки жителей внутри города",
    "16% - поездки людей, въезжающих в город",
    "Сколько места нужно 50 людям",
    "Устойчивая мобильность - это способ передвигаться плавно",
    "качество городской среды",
    "Мобильность - это право",
    "зависит от личного выбора",
    "интермодальности",
    "снижать скорость движения",
    "отдавать приоритет людям",
    "Использование дороги с учетом уязвимости",
    "Пешеходы",
    "Велосипедисты",
    "Такси / автомобиль",
    "Грузовик"
  ]) {
    assert.ok(ch1SustainableModuleSource.includes(requiredText), `missing page 23 learner text: ${requiredText}`);
  }

  assert.match(ch1SustainableModuleSource, /kind:\s*"mobility-context"/);
  assert.match(ch1SustainableModuleSource, /kind:\s*"vulnerability-ranking"/);
  assert.match(appSource, /function MobilityContextBlockView/);
  assert.match(appSource, /function VulnerabilityRankingBlockView/);
  assert.match(stylesSource, /\.manual-mobility-context[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-source-row-scroll[\s\S]*?overflow-x:\s*auto/);
  assert.match(ch1SustainableModuleSource, /space-comparison-50-people-source\.jpg/);
  assert.doesNotMatch(ch1SustainableModuleSource, /space-comparison-icons-source\.jpg/);
  assert.match(ch1SustainableModuleSource, /vulnerability-icons-source\.jpg/);
  assert.doesNotMatch(ch1SustainableModuleSource, /content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/pages\/page-023\.jpg/u);
  for (const outOfScopeText of ["Пешеходный приоритет", "Система общественного транспорта", "Совместная поездка"]) {
    assert.equal(ch1SustainableModuleSource.includes(outOfScopeText), false, `${outOfScopeText} stays out of the page 23 section slice`);
  }

  const orderedBlockIds = [
    "city-context-infographic",
    "definition",
    "mobility-right-and-limits",
    "individual-choice",
    "intermodality-vulnerable-groups",
    "vulnerability-order"
  ];
  let previousBlockIndex = -1;
  for (const blockId of orderedBlockIds) {
    const blockIndex = ch1SustainableModuleSource.indexOf(`id: "${blockId}"`);
    assert.ok(blockIndex > previousBlockIndex, `${blockId} follows source page 23 section order`);
    previousBlockIndex = blockIndex;
  }
});

test("ch1 pedestrian priority section covers source pages 24-29 visuals and no unrelated section content", () => {
  const section = registry.sections.find((entry) => entry.id === "ch1-pedestrian-priority");
  assert.ok(section, "ch1-pedestrian-priority registry entry exists");
  assert.equal(section.status, "implemented");
  assert.equal(section.sourceRegionMetadataStatus, "recorded");
  assert.equal(section.visualEvidenceStatus, "recorded");
  assert.equal(section.implementationEvidence.checkerResult, "pass");
  assert.deepEqual(section.implementationEvidence.sourcePages, [24, 25, 26, 27, 28, 29]);
  assert.equal(existsSync(section.sectionContentModulePath), true);
  assert.equal(existsSync(section.implementationEvidence.desktopScreenshot), true);
  assert.equal(existsSync(section.implementationEvidence.mobileScreenshot), true);

  for (const sourceRegion of section.implementationEvidence.sourceRegionMetadata) {
    assert.equal(existsSync(sourceRegion.sourceAssetPath), true, `${sourceRegion.sourceAssetPath} exists`);
    assert.ok([24, 25, 26, 27, 28, 29].includes(sourceRegion.sourcePage), `${sourceRegion.sourceAssetPath} belongs to the assigned source range`);
  }

  const expectedAssets = new Map([
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/before-after-photos-source.jpg",
      { sha256: "21ad238fb1622c84899a7c0b65b2f24487c8a0a516bb66d637620d60d283d02a", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/impact-body-source.jpg",
      { sha256: "42c864bfc9df2b2d824165a8127ef3c1a4b407fe2109314b4b171790407eb101", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/impact-car-source.jpg",
      { sha256: "6741d5921e347984d56b08b38ac147e4d8a365328363edf313db83a9b1deef8c", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/impact-target-source.jpg",
      { sha256: "4f46f2a52c919015cb6b258a21563ae0e4f02f8a58e37fc0541b800fe31da1d4", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/priority-street-source.jpg",
      { sha256: "508dec0e2948e13aacd9980dc51946a8af79aad03f5ca1c3ca9bc40161782cc9", visibleSpanish: true, assetKind: "high-resolution-original-source-priority-street-photo" }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/pedestrian-street-source.jpg",
      { sha256: "8113005c51dd845f4b42ba6621fea12b5d900548774dc2130d3811fa3908ea9f", visibleSpanish: true, assetKind: "high-resolution-original-source-pedestrian-street-photo" }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/wayfinding-source.jpg",
      { sha256: "c708f1d34803a7b2d905998d90f97334aba498f893c295300a907333fd5da732", visibleSpanish: true, assetKind: "high-resolution-original-source-wayfinding-photo" }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/school-routes-source.jpg",
      { sha256: "829a25bda728e6352c363c81c126915d015bf91621c64e8ed7cc8dad38c8a7bb", visibleSpanish: true, assetKind: "high-resolution-original-source-school-route-photo" }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/sube-y-baja-source.jpg",
      { sha256: "9173c0d979968dc60b661cb5d796f5f75d7d02b76c1031828639d0cad28211e1", visibleSpanish: true, assetKind: "high-resolution-original-source-sube-y-baja-road-marking" }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/intervention-street-source.jpg",
      { sha256: "c3012aca894e6d05b4ec0f94030291e653befe7da9bdd6c21ae1bd3212dd6146", visibleSpanish: true, assetKind: "high-resolution-original-source-pedestrian-intervention-photo" }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/priority-area-map-source.jpg",
      { sha256: "d88ecd0fc39dac7f9c0227894794ef648cb7327b1ff229508787ce1f5222056b", visibleSpanish: true, assetKind: "high-resolution-original-source-priority-area-map" }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/zone30-photo-source.jpg",
      { sha256: "8035cdc4f94cdf7f92560e84ce9f0fa6828c56af250a6feb5130c710290e8e93", visibleSpanish: true, assetKind: "high-resolution-original-source-zone30-photo" }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/circulation-icons-source.jpg",
      { sha256: "bed15de5034b89eb332f64e937cb90024304cfdda9d7a2f6952dcbd7c286e2a1", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/restriction-signs-source-as-is.png",
      {
        sha256: "03c8354fc44acff48de3fb0d40aa49757254f047b44de79179ec7f3b168e3f71",
        visibleSpanish: true,
        assetKind: "official-traffic-sign-source-as-is"
      }
    ]
  ]);

  for (const [assetPath, expectation] of expectedAssets) {
    const asset = section.implementationEvidence.localAssetMetadata.find((entry) => entry.assetPath === assetPath);
    assert.ok(asset, `${assetPath} local asset metadata exists`);
    assert.equal(existsSync(assetPath), true, `${assetPath} exists`);
    assert.equal(asset.visibleSpanish, expectation.visibleSpanish, `${assetPath} visible-Spanish evidence matches policy`);
    assert.equal(asset.sha256, expectation.sha256, `${assetPath} registry hash is stable`);
    assert.equal(sha256File(assetPath), expectation.sha256, `${assetPath} bytes match registry hash`);
    if (expectation.visibleSpanish) {
      assert.equal(asset.assetKind, expectation.assetKind, `${assetPath} exception asset kind is stable`);
      if (expectation.assetKind === "official-traffic-sign-source-as-is") {
        assert.equal(asset.officialSignException.kind, "official-traffic-sign-source-as-is");
        assert.equal(asset.officialSignException.visibleSpanishScope, "official-sign-image-only");
        assert.equal(asset.officialSignException.sourceAsIs, true);
      } else {
        assert.equal(asset.sourceImageException.kind, "source-image-original-visible-text");
        assert.equal(asset.sourceImageException.visibleSpanishScope, "source-image-only");
        assert.equal(asset.sourceImageException.sourceAsIs, true);
        assert.equal(asset.sourceImageException.russianExplanationOutsideImage, true);
      }
    }
  }

  assert.equal(section.implementationEvidence.visibleSpanishStatus.status, "source_image_exceptions_only");
  assert.equal(section.implementationEvidence.visibleSpanishStatus.nonSignVisibleSpanishStatus, "source-image-only");
  assert.deepEqual(
    section.implementationEvidence.visibleSpanishStatus.exceptions.map((entry) => entry.assetPath),
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/priority-street-source.jpg",
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/pedestrian-street-source.jpg",
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/wayfinding-source.jpg",
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/school-routes-source.jpg",
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/sube-y-baja-source.jpg",
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/intervention-street-source.jpg",
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/priority-area-map-source.jpg",
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/restriction-signs-source-as-is.png",
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/zone30-photo-source.jpg"
    ]
  );

  for (const requiredText of [
    "Пешеходный приоритет",
    "каждый человек является пешеходом",
    "Av. Julio Argentino Roca",
    "Фазы удара при наезде",
    "40 км/ч",
    "RACE и GOODYEAR",
    "Переходить нужно по пешеходному переходу",
    "мигает оранжевым",
    "выставляйте ее на проезжую часть",
    "электрических самокатов",
    "Улица с пешеходным приоритетом",
    "Максимальная скорость",
    "10 км/ч",
    "20 км/ч",
    "Пешеходные указатели",
    "Школьные маршруты",
    "ближе 10 метров",
    "Пешеходные вмешательства",
    "Tribunales, Retiro, Casco Histórico, Once, Microcentro и Corrientes",
    "рабочие дни с 11:00 до 16:00",
    "с 7 до 21 часов",
    "19:00 до 02:00",
    "24 часа",
    "телефон 147",
    "электронный контроль",
    "изображение знаков оставлено без изменений",
    "Свободное движение в зоне",
    "Общественный транспорт",
    "Зона 30",
    "5% может уменьшить количество погибших",
    "30%",
    "Ramón Lista, Nogoyá, Juan E. Martínez и Irigoyen"
  ]) {
    assert.ok(ch1PedestrianPriorityModuleSource.includes(requiredText), `missing pedestrian-priority learner text: ${requiredText}`);
  }

  for (const requiredKind of [
    "pedestrian-photo-comparison",
    "impact-diagram",
    "pedestrian-infrastructure",
    "priority-area-map",
    "transport-mode-icons"
  ]) {
    assert.match(ch1PedestrianPriorityModuleSource, new RegExp(`kind:\\s*"${requiredKind}"`), `${requiredKind} block is present`);
  }

  assert.match(appSource, /function PedestrianPhotoComparisonBlockView/);
  assert.match(appSource, /function ImpactDiagramBlockView/);
  assert.match(appSource, /function PedestrianInfrastructureBlockView/);
  assert.match(appSource, /function PriorityAreaMapBlockView/);
  assert.match(appSource, /function TransportModeIconsBlockView/);
  assert.match(stylesSource, /\.manual-pedestrian-comparison[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-impact-diagram[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-pedestrian-infrastructure[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-priority-map[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-transport-icons[\s\S]*?user-select:\s*text/);
  assert.match(ch1PedestrianPriorityModuleSource, /before-after-photos-source\.jpg/);
  assert.match(ch1PedestrianPriorityModuleSource, /impact-body-source\.jpg/);
  assert.match(ch1PedestrianPriorityModuleSource, /wayfinding-source\.jpg/);
  assert.match(ch1PedestrianPriorityModuleSource, /sube-y-baja-source\.jpg/);
  assert.match(ch1PedestrianPriorityModuleSource, /priority-area-map-source\.jpg/);
  assert.match(ch1PedestrianPriorityModuleSource, /restriction-signs-source-as-is\.png/);
  assert.doesNotMatch(ch1PedestrianPriorityModuleSource, /visualKind:\s*"wayfinding-sign"|visualKind:\s*"school-road-marking"/);
  assert.doesNotMatch(appSource, /manual-wayfinding-sign|manual-school-road-marking/);
  assert.match(ch1PedestrianPriorityModuleSource, /official-traffic-sign-source-as-is/);
  assert.match(ch1PedestrianPriorityModuleSource, /circulation-icons-source\.jpg/);
  assert.doesNotMatch(ch1PedestrianPriorityModuleSource, /content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/pages\/page-02[4-9]\.jpg/u);
  assert.doesNotMatch(ch1PedestrianPriorityModuleSource, /https?:\/\//u);
  assert.doesNotMatch(ch1PedestrianPriorityModuleSource, /Bicicleta|Sistema de transporte público|Viaje compartido|Юридическая ответственность|Обязательные документы/u);

  const orderedBlockIds = [
    "pedestrian-priority-intro",
    "julio-roca-before-after",
    "road-coexistence",
    "impact-phases",
    "pedestrian-crossing-rules",
    "driver-duties-list",
    "pedestrian-street-types",
    "school-and-wayfinding",
    "pedestrian-interventions",
    "priority-areas-map",
    "priority-area-restrictions",
    "priority-area-circulation",
    "zone-30"
  ];
  let previousBlockIndex = -1;
  for (const blockId of orderedBlockIds) {
    const blockIndex = ch1PedestrianPriorityModuleSource.indexOf(`id: "${blockId}"`);
    assert.ok(blockIndex > previousBlockIndex, `${blockId} follows source pages 24-29 order`);
    previousBlockIndex = blockIndex;
  }
});

test("ch1 bicycle section covers source pages 30-38 visuals and no unrelated section content", () => {
  const section = registry.sections.find((entry) => entry.id === "ch1-bicycle");
  assert.ok(section, "ch1-bicycle registry entry exists");
  assert.equal(section.status, "implemented");
  assert.equal(section.sourceRegionMetadataStatus, "recorded");
  assert.equal(section.visualEvidenceStatus, "recorded");
  assert.equal(section.implementationEvidence.checkerResult, "pass");
  assert.deepEqual(section.implementationEvidence.sourcePages, [30, 31, 32, 33, 34, 35, 36, 37, 38]);
  assert.equal(existsSync(section.sectionContentModulePath), true);
  assert.equal(existsSync(section.implementationEvidence.desktopScreenshot), true);
  assert.equal(existsSync(section.implementationEvidence.mobileScreenshot), true);

  for (const sourceRegion of section.implementationEvidence.sourceRegionMetadata) {
    assert.equal(existsSync(sourceRegion.sourceAssetPath), true, `${sourceRegion.sourceAssetPath} exists`);
    assert.ok([30, 31, 32, 33, 34, 35, 36, 37, 38].includes(sourceRegion.sourcePage), `${sourceRegion.sourceAssetPath} belongs to the assigned source range`);
  }

  const expectedAssets = new Map([
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/bicycle-change-cyclists-source.jpg",
      { sha256: "5c697766892f93f1b949f0ce76703cbf45a1ab49ead3b6b2e66b75e51e58bed6", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/helmet-fit-source.jpg",
      { sha256: "70764bbe42ca073982123631cb0fa5b7b9a22df0ded2245f7ea152bef7a96d28", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/cyclist-gear-source.jpg",
      { sha256: "c125dc93e50b35809e96c578f4ac6474d610f5150d1770b6c48b9ba23da4f5fc", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/bicycle-signs-source-as-is.jpg",
      {
        sha256: "80b7c1b231745dbe9a35feb1ffb528f3d95db33cb87935acf75ac7889c11a334",
        visibleSpanish: true,
        assetKind: "official-traffic-sign-source-as-is"
      }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/posture-cyclist-source.jpg",
      { sha256: "bf97f2471ac9ac8cdeb84b7fcc6be20ab62526f9ad5f56c9e8f942fe586cb3e8", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/safe-distance-source.jpg",
      { sha256: "cea31134292919fbf322b6ba19cfd91fdb4714760b7557a7850b414ccc7349d9", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/unsafe-distance-source.jpg",
      { sha256: "7a1124f7c1fb3fcf578f4f51a5611b4867d0537e2fee5b2c1933870b4260eb5d", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/offtracking-bus-source.jpg",
      { sha256: "99acb609f2b4eca7f3c292b77d92d7197bf914789f44ef05a76d6eccff170f0d", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/hand-signals-source.jpg",
      { sha256: "81588b672bcc377b2babb69f41a184007ee90b20d1bbdd30d397c6ac9f8ce7d3", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/bicisenda-photo-source.jpg",
      { sha256: "d0719bf65fb4d5b2df0f695879b5793046750d443c465e9daa73fa96a98d6d6f", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/ciclovia-photo-source.jpg",
      { sha256: "7b2e404dd7365ffe41a0c559a9accb1fa13f74c378174ac13feef3717f1aeb8d", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/bicycle-parking-source.jpg",
      { sha256: "91a078759ad9d42691029fb7b379b09120351b4bb48cf20c0ddf98ac33145a7d", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/ecobici-source.jpg",
      { sha256: "8e361a5e391e5de186247a3164fe1ad76f42ef2cd6917a9a30b9e14ba8647781", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/scooter-source.jpg",
      { sha256: "a8983da5902a66d9ed54252087f7228242a43f243775a1453770d1b53bc56962", visibleSpanish: false }
    ]
  ]);

  for (const [assetPath, expectation] of expectedAssets) {
    const asset = section.implementationEvidence.localAssetMetadata.find((entry) => entry.assetPath === assetPath);
    assert.ok(asset, `${assetPath} local asset metadata exists`);
    assert.equal(existsSync(assetPath), true, `${assetPath} exists`);
    assert.equal(asset.visibleSpanish, expectation.visibleSpanish, `${assetPath} visible-Spanish evidence matches policy`);
    assert.equal(asset.sha256, expectation.sha256, `${assetPath} registry hash is stable`);
    assert.equal(sha256File(assetPath), expectation.sha256, `${assetPath} bytes match registry hash`);
    if (expectation.visibleSpanish) {
      assert.equal(asset.assetKind, expectation.assetKind, `${assetPath} is the official sign exception asset`);
      assert.equal(asset.officialSignException.kind, "official-traffic-sign-source-as-is");
      assert.equal(asset.officialSignException.visibleSpanishScope, "official-sign-image-only");
      assert.equal(asset.officialSignException.sourceAsIs, true);
    }
  }

  assert.equal(section.implementationEvidence.visibleSpanishStatus.status, "official_traffic_sign_exception_only");
  assert.equal(section.implementationEvidence.visibleSpanishStatus.nonSignVisibleSpanishStatus, "none");
  assert.deepEqual(
    section.implementationEvidence.visibleSpanishStatus.exceptions.map((entry) => entry.assetPath),
    ["content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/bicycle-signs-source-as-is.jpg"]
  );

  for (const requiredText of [
    "Велосипед",
    "Общественный транспорт, ходьба, велосипед и электрический самокат",
    "Цепь должна быть натянута",
    "Шины должны быть",
    "Тормоза",
    "сертифицированным",
    "Правильно",
    "Слишком низко",
    "Сдвинут назад",
    "Светоотражатели",
    "Знаки и правила",
    "bicycle-signs-source-as-is.jpg",
    "official-traffic-sign-source-as-is",
    "Знаки на изображении оставлены как в официальном источнике",
    "Полная остановка",
    "Конец защищенной велодорожки",
    "Сойти с велосипеда",
    "Максимальная скорость 30 км/ч",
    "На защищенных велодорожках запрещены остановка и стоянка каждый день 24 часа",
    "возможна эвакуация",
    "Пассажира можно перевозить",
    "дополнительного сиденья, подножек и ручки",
    "4,20 м",
    "Наушники",
    "По тротуару могут ехать только дети младше 12 лет",
    "старше 18 лет",
    "1500 ватт",
    "Запрещено ехать на велосипеде, держась за другие транспортные средства",
    "сразу за моторными транспортными средствами",
    "1,5 м",
    "Обгон выполняется слева",
    "Повороты крупного транспорта",
    "Поворот налево",
    "Остановка",
    "Поворот направо",
    "пересадочные центры, университеты, школы и больницы",
    "Защищенная велодорожка",
    "Закон 4619/13",
    "BA Ecobici by Tembici",
    "24 часа в сутки 365 дней",
    "500 ватт",
    "25 км/ч",
    "16 лет",
    "Av. 9 de Julio",
    "нельзя перевозить пассажира"
  ]) {
    assert.ok(ch1BicycleModuleSource.includes(requiredText), `missing bicycle learner text: ${requiredText}`);
  }

  for (const requiredKind of [
    "bicycle-benefits",
    "bicycle-helmet-fit",
    "bicycle-gear",
    "bicycle-signage",
    "bicycle-posture",
    "bicycle-distance",
    "bicycle-hand-signals",
    "pedestrian-infrastructure",
    "source-artwork"
  ]) {
    assert.match(ch1BicycleModuleSource, new RegExp(`kind:\\s*"${requiredKind}"`), `${requiredKind} block is present`);
  }

  assert.match(appSource, /function BicycleBenefitsBlockView/);
  assert.match(appSource, /function BicycleHelmetFitBlockView/);
  assert.match(appSource, /function BicycleGearBlockView/);
  assert.match(appSource, /function BicycleSignageBlockView/);
  assert.match(appSource, /function BicyclePostureBlockView/);
  assert.match(appSource, /function BicycleDistanceBlockView/);
  assert.match(appSource, /function BicycleHandSignalsBlockView/);
  assert.match(stylesSource, /\.manual-bicycle-benefits[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-bicycle-helmet[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-bicycle-gear[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-bicycle-signage[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-bicycle-posture[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-bicycle-distance[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-bicycle-signals[\s\S]*?user-select:\s*text/);

  for (const assetFilename of [
    "bicycle-change-cyclists-source.jpg",
    "helmet-fit-source.jpg",
    "cyclist-gear-source.jpg",
    "bicycle-signs-source-as-is.jpg",
    "posture-cyclist-source.jpg",
    "safe-distance-source.jpg",
    "unsafe-distance-source.jpg",
    "offtracking-bus-source.jpg",
    "hand-signals-source.jpg",
    "bicisenda-photo-source.jpg",
    "ciclovia-photo-source.jpg",
    "bicycle-parking-source.jpg",
    "ecobici-source.jpg",
    "scooter-source.jpg"
  ]) {
    assert.match(ch1BicycleModuleSource, new RegExp(assetFilename.replaceAll(".", "\\.")), `${assetFilename} is used by the bicycle module`);
  }

  assert.doesNotMatch(ch1BicycleModuleSource, /content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/pages\/page-03[0-8]\.jpg/u);
  assert.doesNotMatch(ch1BicycleModuleSource, /https?:\/\//u);
  assert.doesNotMatch(ch1BicycleModuleSource, /Система общественного транспорта|Совместная поездка|Юридическая ответственность|Обязательные документы/u);
  assert.doesNotMatch(ch1BicycleModuleSource, /bike-station|Стоянка или станция велосипедов|markerRu|manual-bicycle-sign-grid|manual-bicycle-sign-marker/u);
  assert.doesNotMatch(appSource, /manual-bicycle-sign-grid|manual-bicycle-sign-marker|data-sign-kind/u);
  assert.doesNotMatch(stylesSource, /manual-bicycle-sign-grid|manual-bicycle-sign-marker|data-sign-kind/u);

  const orderedBlockIds = [
    "bicycle-intro-growth",
    "bicycle-new-mobility-style",
    "bicycle-benefits-visual",
    "bicycle-safety-check",
    "helmet-importance",
    "helmet-fit",
    "protection-gear",
    "traffic-rules-signs",
    "passenger-cargo-rules",
    "natural-capacity",
    "attention-distraction",
    "body-posture",
    "age-and-paths",
    "coexistence-duty",
    "vehicle-holding-prohibition",
    "safe-distance",
    "overtaking-rules",
    "offtracking-risk",
    "driver-recommendations",
    "hand-signals",
    "lane-network",
    "bike-lane-infrastructure",
    "parking-and-ecobici",
    "electric-scooter-photo",
    "electric-scooter-requirements",
    "electric-scooter-prohibitions"
  ];
  let previousBlockIndex = -1;
  for (const blockId of orderedBlockIds) {
    const blockIndex = ch1BicycleModuleSource.indexOf(`id: "${blockId}"`);
    assert.ok(blockIndex > previousBlockIndex, `${blockId} follows source pages 30-38 order`);
    previousBlockIndex = blockIndex;
  }
});

test("Manual guide source-fidelity checker scans the implemented section renderer", () => {
  assert.match(checkerSource, /sliceSource\(appSource,\s*"function ManualGuideSectionContentView"/);
  assert.match(manualGuideAppSource, /function ManualGuideSectionContentView/);
  assert.match(manualGuideAppSource, /assetUrl\(block\.assetPath\)/);
});

test("Manual guide source-fidelity checker passes the section registry with Chapter 1 implemented sections", () => {
  assert.equal(evidence.checkerId, "manual-guide-source-fidelity");
  assert.deepEqual(evidence.requiredSourcePageRange, { start: 21, end: 56 });
  assert.deepEqual(evidence.sharedSourcePageOwnership.map((entry) => entry.sourcePage), [55]);
  assert.deepEqual(evidence.sharedPrereqExpectedOutput.skippedSourcePages, [21, 43, 56]);
  assert.deepEqual(evidence.sharedPrereqExpectedOutput.skippedDividerPages, [21, 43]);
  assert.deepEqual(evidence.sharedPrereqExpectedOutput.omittedBookOnlyPages, [56]);
  assert.deepEqual(evidence.sharedPrereqExpectedOutput.sharedSourcePages, [55]);
  assert.equal(evidence.sharedPrereqExpectedOutput.pendingSections, 6);
  assert.equal(evidence.sharedPrereqExpectedOutput.implementedSections, 4);
  const output = execFileSync(process.execPath, ["scripts/manual-guide-source-fidelity.mjs"], { encoding: "utf8" });
  const result = JSON.parse(output);
  assert.equal(result.status, "pass");
  assert.equal(result.pendingSections, 6);
  assert.equal(result.implementedSections, 4);
  assert.deepEqual(result.skippedSourcePages, [21, 43, 56]);
  assert.deepEqual(result.skippedDividerPages, [21, 43]);
  assert.deepEqual(result.omittedBookOnlyPages, [56]);
  assert.deepEqual(result.sharedSourcePages, [55]);
  assert.equal(result.screenshotEvidence, "recorded_for_ch1-cities-for-people_ch1-sustainable-mobility_ch1-pedestrian-priority_and_ch1-bicycle");
});

test("Manual guide source-fidelity checker rejects duplicate hierarchy section references", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-registry-"));
  try {
    const duplicateRegistryPath = join(tempDir, "section-registry.duplicate.json");
    const duplicateRegistry = JSON.parse(JSON.stringify(registry));
    duplicateRegistry.chapters[1].sectionIds.push("ch1-cities-for-people");
    writeFileSync(duplicateRegistryPath, JSON.stringify(duplicateRegistry, null, 2));

    const failure = spawnSync(process.execPath, ["scripts/manual-guide-source-fidelity.mjs"], {
      encoding: "utf8",
      env: {
        ...process.env,
        MANUAL_GUIDE_REGISTRY_PATH: duplicateRegistryPath
      }
    });

    assert.notEqual(failure.status, 0, "checker must fail when a section is referenced twice in the source hierarchy");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "Chapter hierarchy must not duplicate section references");
    assert.deepEqual(result.details.duplicates, [{ id: "ch1-cities-for-people", count: 2 }]);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects skipped divider pages inside sections", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-skipped-divider-"));
  try {
    const badRegistryPath = join(tempDir, "section-registry.bad-divider.json");
    const badRegistry = JSON.parse(JSON.stringify(registry));
    const section = badRegistry.sections.find((entry) => entry.id === "ch1-cities-for-people");
    section.sourcePageRange = { start: 21, end: 22 };
    section.sourcePages.unshift({
      sourcePage: 21,
      manualManifestPointer: "/pages/20",
      layoutManifestPointer: "/pages/20",
      referenceAsset: sourcePageAssetPath(21)
    });
    writeFileSync(badRegistryPath, JSON.stringify(badRegistry, null, 2));

    const failure = spawnSync(process.execPath, ["scripts/manual-guide-source-fidelity.mjs"], {
      encoding: "utf8",
      env: {
        ...process.env,
        MANUAL_GUIDE_REGISTRY_PATH: badRegistryPath
      }
    });

    assert.notEqual(failure.status, 0, "checker must fail when divider-only page 21 becomes section content");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.match(result.message, /ch1-cities-for-people sourcePageRange must match source Índice metadata|must not include skipped non-section source page 21/u);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects accidental shared page duplicates without boundary evidence", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-shared-boundary-"));
  try {
    const badRegistryPath = join(tempDir, "section-registry.bad-shared-page.json");
    const badRegistry = JSON.parse(JSON.stringify(registry));
    const scoring = badRegistry.sections.find((entry) => entry.id === "ch2-scoring");
    delete scoring.sourceBoundaryEvidence;
    writeFileSync(badRegistryPath, JSON.stringify(badRegistry, null, 2));

    const failure = spawnSync(process.execPath, ["scripts/manual-guide-source-fidelity.mjs"], {
      encoding: "utf8",
      env: {
        ...process.env,
        MANUAL_GUIDE_REGISTRY_PATH: badRegistryPath
      }
    });

    assert.notEqual(failure.status, 0, "checker must fail when shared page 55 lacks section boundary evidence");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch2-scoring sourceBoundaryEvidence must be an object");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker accepts implemented sections with multi-page evidence", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-implemented-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: [] };\n'
    );
    const result = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.status, "pass");
    assert.equal(output.pendingSections, 6);
    assert.equal(output.implementedSections, 4);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects failing implemented evidence statuses", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-failing-evidence-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: [] };\n',
      (implementationEvidence) => {
        implementationEvidence.forbiddenPatternScan = { status: "fail", note: "previous pass" };
        implementationEvidence.selectableTextStatus = "fail";
        implementationEvidence.boundingBoxChecks = [{ id: "fixture", status: "fail" }];
        implementationEvidence.checkerResult = "pass";
      }
    );
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when implemented-section evidence records failing statuses");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority selectableTextStatus must be pass");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects failing forbidden-pattern scans", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-failing-scan-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: [] };\n',
      (implementationEvidence) => {
        implementationEvidence.forbiddenPatternScan = { status: "fail", note: "previous pass" };
      }
    );
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when forbiddenPatternScan.status is fail despite containing the word pass");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority forbiddenPatternScan.status must be pass");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects visible Spanish status failures", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-visible-spanish-status-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: [] };\n',
      (implementationEvidence) => {
        implementationEvidence.visibleSpanishStatus = "fail";
      }
    );
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when visibleSpanishStatus records a failure");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority visibleSpanishStatus must record no visible Spanish text or source-image-only exceptions");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects local assets with visible Spanish", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-visible-spanish-asset-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: [] };\n',
      (implementationEvidence) => {
        implementationEvidence.localAssetMetadata[0].visibleSpanish = true;
      }
    );
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when local asset evidence keeps visible Spanish text");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority localAssetMetadata[0].visibleSpanish=true requires an explicit source-image-only exception");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker allows only explicit official traffic sign Spanish exceptions", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-official-sign-exception-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: [] };\n',
      (implementationEvidence) => {
        const signAsset = implementationEvidence.localAssetMetadata[0];
        signAsset.assetKind = "official-traffic-sign-source-as-is";
        signAsset.containsText = true;
        signAsset.visibleSpanish = true;
        signAsset.officialSignException = {
          kind: "official-traffic-sign-source-as-is",
          visibleSpanishScope: "official-sign-image-only",
          sourceAsIs: true
        };
        implementationEvidence.visibleSpanishStatus = {
          status: "official_traffic_sign_exception_only",
          nonSignVisibleSpanishStatus: "none",
          exceptions: [
            {
              assetPath: signAsset.assetPath,
              kind: "official-traffic-sign-source-as-is",
              visibleSpanishScope: "official-sign-image-only",
              sourceAsIs: true
            }
          ]
        };
      }
    );
    const result = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.equal(result.status, 0, result.stderr);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects source-image exceptions under official traffic sign status", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-official-sign-status-source-image-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: [] };\n',
      (implementationEvidence) => {
        const signAsset = implementationEvidence.localAssetMetadata[0];
        signAsset.assetKind = "official-traffic-sign-source-as-is";
        signAsset.containsText = true;
        signAsset.visibleSpanish = true;
        signAsset.officialSignException = {
          kind: "official-traffic-sign-source-as-is",
          visibleSpanishScope: "official-sign-image-only",
          sourceAsIs: true
        };
        implementationEvidence.visibleSpanishStatus = {
          status: "official_traffic_sign_exception_only",
          nonSignVisibleSpanishStatus: "none",
          exceptions: [
            {
              assetPath: signAsset.assetPath,
              kind: "source-image-original-visible-text",
              visibleSpanishScope: "source-image-only",
              sourceAsIs: true,
              russianExplanationOutsideImage: true
            }
          ]
        };
      }
    );
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when official-sign-only status lists a source-image exception");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority visibleSpanishStatus.exceptions[0].kind must be official-traffic-sign-source-as-is"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker allows explicit original source-image Spanish exceptions", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-source-image-exception-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: [] };\n',
      (implementationEvidence) => {
        const sourceImageAsset = implementationEvidence.localAssetMetadata[0];
        sourceImageAsset.assetKind = "high-resolution-original-source-wayfinding-photo";
        sourceImageAsset.containsText = true;
        sourceImageAsset.visibleSpanish = true;
        sourceImageAsset.sourceImageException = {
          kind: "source-image-original-visible-text",
          visibleSpanishScope: "source-image-only",
          sourceAsIs: true,
          russianExplanationOutsideImage: true
        };
        implementationEvidence.visibleSpanishStatus = {
          status: "source_image_exceptions_only",
          nonSignVisibleSpanishStatus: "source-image-only",
          exceptions: [
            {
              assetPath: sourceImageAsset.assetPath,
              kind: "source-image-original-visible-text",
              visibleSpanishScope: "source-image-only",
              sourceAsIs: true,
              russianExplanationOutsideImage: true
            }
          ]
        };
      }
    );
    const result = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.equal(result.status, 0, result.stderr);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects reconstructed source-image Spanish exceptions", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-reconstructed-source-image-exception-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: [] };\n',
      (implementationEvidence) => {
        const sourceImageAsset = implementationEvidence.localAssetMetadata[0];
        sourceImageAsset.assetKind = "generated-reconstructed-wayfinding-photo";
        sourceImageAsset.containsText = true;
        sourceImageAsset.visibleSpanish = true;
        sourceImageAsset.sourceImageException = {
          kind: "source-image-original-visible-text",
          visibleSpanishScope: "source-image-only",
          sourceAsIs: true,
          russianExplanationOutsideImage: true
        };
        implementationEvidence.visibleSpanishStatus = {
          status: "source_image_exceptions_only",
          nonSignVisibleSpanishStatus: "source-image-only",
          exceptions: [
            {
              assetPath: sourceImageAsset.assetPath,
              kind: "source-image-original-visible-text",
              visibleSpanishScope: "source-image-only",
              sourceAsIs: true,
              russianExplanationOutsideImage: true
            }
          ]
        };
      }
    );
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when a source-image exception lacks original-source provenance");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority localAssetMetadata[0].visibleSpanish=true requires an explicit source-image-only exception");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker scans section content modules for forbidden full-page assets", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-forbidden-module-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const ch1PedestrianPriority = { assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-024.jpg" };\n'
    );
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when section content data references a full-page source render");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.match(result.message, /Forbidden manual guide pattern 'page-024\.jpg'/);
    assert.match(result.message, /ch1-pedestrian-priority\.ts/);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});
