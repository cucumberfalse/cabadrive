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
const ch1PublicTransportModulePath = "src/data/manual-sections/ch1-public-transport-system.ts";
const ch1SharedTripModulePath = "src/data/manual-sections/ch1-shared-trip.ts";
const ch2LegalModulePath = "src/data/manual-sections/ch2-legal-responsibility.ts";
const ch2RequiredDocumentsModulePath = "src/data/manual-sections/ch2-required-documents.ts";
const ch2IncidentModulePath = "src/data/manual-sections/ch2-incident-obligations.ts";
const ch2ScoringModulePath = "src/data/manual-sections/ch2-scoring.ts";

const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
const legacyBaselineSectionIds = new Set(["ch1-cities-for-people", "ch1-sustainable-mobility", "ch1-pedestrian-priority", "ch1-bicycle", "ch1-public-transport-system", "ch1-shared-trip"]);
const implementedSectionIds = new Set([
  ...legacyBaselineSectionIds,
  "ch2-legal-responsibility",
  "ch2-required-documents",
  "ch2-incident-obligations",
  "ch2-scoring"
]);
const manualGuideSource = readFileSync(manualGuidePath, "utf8");
const appSource = readFileSync(appPath, "utf8");
const checkerSource = readFileSync(checkerPath, "utf8");
const stylesSource = readFileSync(stylesPath, "utf8");
const ch1CitiesModuleSource = readFileSync(ch1CitiesModulePath, "utf8");
const ch1SustainableModuleSource = readFileSync(ch1SustainableModulePath, "utf8");
const ch1PedestrianPriorityModuleSource = readFileSync(ch1PedestrianPriorityModulePath, "utf8");
const ch1BicycleModuleSource = readFileSync(ch1BicycleModulePath, "utf8");
const ch1PublicTransportModuleSource = readFileSync(ch1PublicTransportModulePath, "utf8");
const ch1SharedTripModuleSource = readFileSync(ch1SharedTripModulePath, "utf8");
const ch2LegalModuleSource = readFileSync(ch2LegalModulePath, "utf8");
const ch2RequiredDocumentsModuleSource = readFileSync(ch2RequiredDocumentsModulePath, "utf8");
const ch2IncidentModuleSource = readFileSync(ch2IncidentModulePath, "utf8");
const ch2ScoringModuleSource = readFileSync(ch2ScoringModulePath, "utf8");
const manualGuideAppSource = appSource.slice(appSource.indexOf("function ManualGuideSectionContentView"), appSource.indexOf("function manualDisplayText"));
const fixtureEvidencePaths = new Map();

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

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256Json(value) {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

function resolveSectionContentModulePath(modulePath, moduleRoot = "src/data/manual-sections") {
  const prefix = "src/data/manual-sections/";
  if (modulePath.startsWith(prefix)) return join(moduleRoot, modulePath.slice(prefix.length));
  return modulePath;
}

function fileSha256IfPresent(path) {
  if (typeof path !== "string" || path.length === 0 || !existsSync(path)) return null;
  return sha256File(path);
}

function visualArtifactHashRecords(value, pathField) {
  const entries = Array.isArray(value) ? value : value && typeof value === "object" ? [value] : [];
  return entries.map((entry, index) => ({
    index,
    path: entry[pathField],
    sha256: fileSha256IfPresent(entry[pathField])
  }));
}

function legacyBaselineStateFingerprint(section, implementedEvidence, moduleRoot = "src/data/manual-sections") {
  const modulePath = resolveSectionContentModulePath(section.sectionContentModulePath, moduleRoot);
  const sectionContentModuleSha256 = fileSha256IfPresent(modulePath);
  const sourceAssetHashes = visualArtifactHashRecords(implementedEvidence.sourceRegionMetadata, "sourceAssetPath");
  const localAssetHashes = visualArtifactHashRecords(implementedEvidence.localAssetMetadata, "assetPath");
  if (sectionContentModuleSha256 === null || [...sourceAssetHashes, ...localAssetHashes].some((entry) => entry.sha256 === null)) return null;
  return sha256Json({
    implementationEvidence: implementedEvidence,
    sectionContentModulePath: section.sectionContentModulePath,
    sectionContentModuleSha256,
    sourceAssetHashes,
    localAssetHashes
  });
}

function writeTempFile(path, contents = "fixture") {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
  return path;
}

function pngBytesWithDimensions(width, height) {
  const bytes = Buffer.alloc(45);
  Buffer.from("89504e470d0a1a0a", "hex").copy(bytes, 0);
  bytes.writeUInt32BE(13, 8);
  bytes.write("IHDR", 12, "ascii");
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  bytes[24] = 8;
  bytes[25] = 6;
  bytes.writeUInt32BE(0, 29);
  bytes.writeUInt32BE(0, 33);
  bytes.write("IEND", 37, "ascii");
  bytes.writeUInt32BE(0, 41);
  return bytes;
}

function writePngFixtureFile(path, width, height) {
  return writeTempFile(path, pngBytesWithDimensions(width, height));
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
        sourceAssetPath: writePngFixtureFile(join(tempDir, "evidence", "source-crop-24.png"), 120, 80),
        cropDimensions: { width: 120, height: 80 },
        cropSha256: "fixture-source-crop-24-sha",
        cleanupScope: "none"
      },
      {
        sourcePage: 29,
        sourceRegion: { x: 10, y: 10, width: 90, height: 60 },
        sourceAssetPath: writePngFixtureFile(join(tempDir, "evidence", "source-crop-29.png"), 90, 60),
        cropDimensions: { width: 90, height: 60 },
        cropSha256: "fixture-source-crop-29-sha",
        cleanupScope: "none"
      }
    ],
    localAssetMetadata: [
      {
        assetPath: writePngFixtureFile(join(tempDir, "assets", "ch1-pedestrian-priority-artwork-1.png"), 120, 80),
        assetKind: "source-artwork",
        width: 120,
        height: 80,
        sha256: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        containsText: false,
        visibleSpanish: false
      },
      {
        assetPath: writePngFixtureFile(join(tempDir, "assets", "ch1-pedestrian-priority-artwork-2.png"), 90, 60),
        assetKind: "source-artwork",
        width: 90,
        height: 60,
        sha256: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
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
  writeTempFile(join(moduleRoot, "ch1-cities-for-people.ts"), ch1CitiesModuleSource);
  writeTempFile(join(moduleRoot, "ch1-sustainable-mobility.ts"), ch1SustainableModuleSource);
  writeTempFile(join(moduleRoot, "ch1-pedestrian-priority.ts"), moduleSource);
  writeTempFile(join(moduleRoot, "ch1-bicycle.ts"), ch1BicycleModuleSource);
  writeTempFile(join(moduleRoot, "ch1-public-transport-system.ts"), ch1PublicTransportModuleSource);
  writeTempFile(join(moduleRoot, "ch1-shared-trip.ts"), ch1SharedTripModuleSource);
  writeTempFile(join(moduleRoot, "ch2-legal-responsibility.ts"), 'export const ch2LegalResponsibilitySection = { sectionId: "ch2-legal-responsibility", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch2-required-documents.ts"), 'export const ch2RequiredDocumentsSection = { sectionId: "ch2-required-documents", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch2-incident-obligations.ts"), 'export const ch2IncidentObligationsSection = { sectionId: "ch2-incident-obligations", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch2-scoring.ts"), 'export const ch2ScoringSection = { sectionId: "ch2-scoring", blocks: [] };\n');
  writeFileSync(implementedRegistryPath, JSON.stringify(implementedRegistry, null, 2));
  const fixtureEvidencePath = join(tempDir, "manual-guide-source-fidelity.fixture.evidence.json");
  const fixtureEvidence = JSON.parse(JSON.stringify(evidence));
  fixtureEvidence.strictVisualRulePolicy.legacyBaselineEvidenceFingerprints = {
    ...fixtureEvidence.strictVisualRulePolicy.legacyBaselineEvidenceFingerprints,
    "ch1-pedestrian-priority": sha256Json(section.implementationEvidence)
  };
  fixtureEvidence.strictVisualRulePolicy.legacyBaselineStateFingerprints = {
    ...fixtureEvidence.strictVisualRulePolicy.legacyBaselineStateFingerprints,
    "ch1-pedestrian-priority": legacyBaselineStateFingerprint(section, section.implementationEvidence, moduleRoot)
  };
  writeFileSync(fixtureEvidencePath, JSON.stringify(fixtureEvidence, null, 2));
  fixtureEvidencePaths.set(implementedRegistryPath, fixtureEvidencePath);
  return { implementedRegistryPath, moduleRoot, fixtureEvidencePath };
}

function runCheckerWithFixture(registryFixturePath, moduleRoot, evidenceFixturePath) {
  const resolvedEvidencePath = evidenceFixturePath ?? fixtureEvidencePaths.get(registryFixturePath) ?? evidencePath;
  return spawnSync(process.execPath, ["scripts/manual-guide-source-fidelity.mjs"], {
    encoding: "utf8",
    env: {
      ...process.env,
      MANUAL_GUIDE_REGISTRY_PATH: registryFixturePath,
      MANUAL_GUIDE_EVIDENCE_PATH: resolvedEvidencePath,
      MANUAL_GUIDE_SECTION_MODULE_ROOT: moduleRoot
    }
  });
}

function addStrictVisualEvidenceFields(implementationEvidence) {
  implementationEvidence.visualEvidenceSchemaVersion = 3;
  implementationEvidence.visualRulePolicyId = "031-strict-source-fidelity";
  implementationEvidence.highResolutionEvidenceStatus = "x5-or-equivalent-no-upscale-recorded";
  for (const sourceRegion of implementationEvidence.sourceRegionMetadata) {
    sourceRegion.cleanupScope = "glyph-level-spanish-cleanup";
    sourceRegion.cropSha256 = sha256File(sourceRegion.sourceAssetPath);
    sourceRegion.extractionScaleEvidence = {
      target: "x5-zoom-source-export",
      method: "fixture x5 zoom/source export",
      outputDimensions: sourceRegion.cropDimensions
    };
  }
  implementationEvidence.localAssetMetadata[0] = {
    ...implementationEvidence.localAssetMetadata[0],
    assetKind: "strict-source-transferred-infographic",
    assetCategory: "source-transferred-infographic",
    cleanupScope: "glyph-level-spanish-cleanup",
    extractionScaleEvidence: {
      target: "x5-zoom-source-export",
      method: "fixture x5 zoom/source export",
      outputDimensions: {
        width: implementationEvidence.localAssetMetadata[0].width,
        height: implementationEvidence.localAssetMetadata[0].height
      }
    },
    runtimeDisplaySize: {
      maxWidthCssPx: 60,
      maxHeightCssPx: 40,
      noUpscale: true
    },
    sha256: sha256File(implementationEvidence.localAssetMetadata[0].assetPath),
    infographicTransfer: {
      sourceImageTransfer: true,
      sourceAssetPath: implementationEvidence.sourceRegionMetadata[0].sourceAssetPath,
      sourceCropSha256: implementationEvidence.sourceRegionMetadata[0].cropSha256,
      sourceCropDimensions: implementationEvidence.sourceRegionMetadata[0].cropDimensions,
      noApproximateRedraw: true,
      broadMaskPlatePatchStatus: "none",
      cleanupMethod: "glyph-letter-level-background-restoration",
      russianOverlayStrategy: "selectable-dom"
    }
  };
  implementationEvidence.localAssetMetadata[1] = {
    ...implementationEvidence.localAssetMetadata[1],
    assetKind: "strict-source-as-is-road-marking",
    assetCategory: "source-as-is-road-marking",
    cleanupScope: "none-source-as-is",
    containsText: true,
    visibleSpanish: true,
    extractionScaleEvidence: {
      target: "source-native-equivalent-or-better",
      method: "fixture source-native crop",
      outputDimensions: {
        width: implementationEvidence.localAssetMetadata[1].width,
        height: implementationEvidence.localAssetMetadata[1].height
      }
    },
    runtimeDisplaySize: {
      maxWidthCssPx: 45,
      maxHeightCssPx: 30,
      noUpscale: true
    },
    sha256: sha256File(implementationEvidence.localAssetMetadata[1].assetPath),
    sourceIntegrity: {
      sourceAsIs: true,
      sourceAssetPath: implementationEvidence.sourceRegionMetadata[1].sourceAssetPath,
      noTranslationOrRelabeling: true,
      noRedrawRecolorCleanupRetouchMaskInpaint: true,
      russianExplanationOutsideImage: true
    },
    sourceImageException: {
      kind: "source-image-original-visible-text",
      visibleSpanishScope: "source-image-only",
      sourceAsIs: true,
      russianExplanationOutsideImage: true
    }
  };
  implementationEvidence.visibleSpanishStatus = {
    status: "source_image_exceptions_only",
    nonSignVisibleSpanishStatus: "source-image-only",
    exceptions: [
      {
        assetPath: implementationEvidence.localAssetMetadata[1].assetPath,
        kind: "source-image-original-visible-text",
        visibleSpanishScope: "source-image-only",
        sourceAsIs: true,
        russianExplanationOutsideImage: true
      }
    ]
  };
}

function writeStrictFutureRegistryFixture(tempDir, mutateEvidence = () => {}) {
  const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
    tempDir,
    'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: [] };\n',
    (implementationEvidence) => {
      addStrictVisualEvidenceFields(implementationEvidence);
      mutateEvidence(implementationEvidence);
    }
  );
  const strictRegistry = JSON.parse(readFileSync(implementedRegistryPath, "utf8"));
  strictRegistry.featureId = "031-manual-document-completion";
  for (const section of strictRegistry.sections) {
    if (section.id === "ch1-pedestrian-priority") continue;
    section.status = "pending";
    section.sourceRegionMetadataStatus = "pending_until_section_pr";
    section.visualEvidenceStatus = "pending_until_section_pr";
    delete section.implementationEvidence;
    delete section.implementedSectionEvidence;
  }
  writeFileSync(implementedRegistryPath, JSON.stringify(strictRegistry, null, 2));

  const strictEvidencePath = join(tempDir, "manual-guide-source-fidelity.strict.evidence.json");
  const strictEvidence = JSON.parse(JSON.stringify(evidence));
  strictEvidence.featureId = "031-manual-document-completion";
  strictEvidence.mode = "strict-visual-rule-fixture-for-future-manual-units";
  writeFileSync(strictEvidencePath, JSON.stringify(strictEvidence, null, 2));
  return { implementedRegistryPath, moduleRoot, strictEvidencePath };
}

function writeChapter2LegalResponsibilityFixture(tempDir, { strict = false, mutateEvidence = () => {} } = {}) {
  const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
    tempDir,
    'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: [] };\n'
  );
  const fixtureRegistry = JSON.parse(readFileSync(implementedRegistryPath, "utf8"));
  const section = fixtureRegistry.sections.find((entry) => entry.id === "ch2-legal-responsibility");
  section.status = "implemented";
  section.sourceRegionMetadataStatus = "recorded";
  section.visualEvidenceStatus = "recorded";
  section.implementationEvidence = {
    sectionId: "ch2-legal-responsibility",
    sourcePages: [44, 45],
    sourceRegionMetadata: [
      {
        sourcePage: 44,
        sourceRegion: { x: 0, y: 0, width: 120, height: 80 },
        sourceAssetPath: writePngFixtureFile(join(tempDir, "evidence", "source-crop-44.png"), 120, 80),
        cropDimensions: { width: 120, height: 80 },
        cropSha256: "fixture-source-crop-44-sha",
        cleanupScope: "reference-only source crop"
      }
    ],
    localAssetMetadata: [
      {
        assetPath: writeTempFile(join(tempDir, "assets", "ch2-legal-responsibility-dom.txt")),
        assetKind: "native-dom-text-only",
        assetCategory: "native-dom-text-only",
        containsText: true,
        visibleSpanish: false
      },
      {
        assetPath: writePngFixtureFile(join(tempDir, "assets", "ch2-legal-responsibility-reference.png"), 120, 80),
        assetKind: "source-transferred-diagram",
        assetCategory: "source-transferred-diagram",
        width: 120,
        height: 80,
        sha256: "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
        containsText: false,
        visibleSpanish: false,
        extractionScaleEvidence: {
          target: "x5-zoom-source-export",
          method: "fixture x5 zoom/source export",
          outputDimensions: {
            width: 120,
            height: 80
          }
        },
        runtimeDisplaySize: {
          maxWidthCssPx: 60,
          maxHeightCssPx: 40,
          noUpscale: true
        }
      }
    ],
    visibleSpanishStatus: "none",
    selectableTextStatus: "pass",
    desktopScreenshot: writeTempFile(join(tempDir, "screenshots", "ch2-legal-responsibility-desktop.png")),
    mobileScreenshot: writeTempFile(join(tempDir, "screenshots", "ch2-legal-responsibility-mobile.png")),
    boundingBoxChecks: [{ id: "fixture", status: "pass" }],
    forbiddenPatternScan: { status: "pass" },
    visualReviewNotes: ["fixture evidence only"],
    checkerResult: "pass"
  };
  if (strict) {
    section.implementationEvidence.visualEvidenceSchemaVersion = 3;
    section.implementationEvidence.visualRulePolicyId = "031-strict-source-fidelity";
    section.implementationEvidence.highResolutionEvidenceStatus = "x5-or-equivalent-no-upscale-recorded";
    section.implementationEvidence.localAssetMetadata[1].cleanupScope = "none-source-as-is";
    section.implementationEvidence.localAssetMetadata[1].sha256 = sha256File(section.implementationEvidence.localAssetMetadata[1].assetPath);
    section.implementationEvidence.localAssetMetadata[1].diagramTransfer = {
      sourceDiagramTransfer: true,
      sourceAssetPath: section.implementationEvidence.sourceRegionMetadata[0].sourceAssetPath,
      sourceCropSha256: sha256File(section.implementationEvidence.sourceRegionMetadata[0].sourceAssetPath),
      sourceCropDimensions: section.implementationEvidence.sourceRegionMetadata[0].cropDimensions,
      noApproximateRedraw: true,
      noReconstruction: true,
      noGenericIconReplacement: true,
      broadMaskPlatePatchStatus: "none"
    };
    for (const sourceRegion of section.implementationEvidence.sourceRegionMetadata) {
      sourceRegion.cleanupScope = "glyph-level-spanish-cleanup";
      sourceRegion.cropSha256 = sha256File(sourceRegion.sourceAssetPath);
      sourceRegion.extractionScaleEvidence = {
        target: "x5-zoom-source-export",
        method: "fixture x5 zoom/source export",
        outputDimensions: sourceRegion.cropDimensions
      };
    }
  }
  mutateEvidence(section.implementationEvidence);
  writeTempFile(join(moduleRoot, "ch2-legal-responsibility.ts"), "export const ch2LegalResponsibilitySection = { sectionId: \"ch2-legal-responsibility\", blocks: [] };\n");
  writeFileSync(implementedRegistryPath, JSON.stringify(fixtureRegistry, null, 2));
  return { implementedRegistryPath, moduleRoot };
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
  assert.equal(registry.chapters[0].status, "active", "Chapter 1 is active after every Chapter 1 section is implemented");
  assert.deepEqual(registry.chapters[1].sectionIds, [
    "ch2-legal-responsibility",
    "ch2-required-documents",
    "ch2-incident-obligations",
    "ch2-scoring"
  ]);
  assert.equal(registry.chapters[1].status, "active", "Chapter 2 is active after every Chapter 2 section is implemented");

  const sectionStatusById = new Map(registry.sections.map((section) => [section.id, section.status]));
  assert.ok(registry.chapters[0].sectionIds.every((sectionId) => sectionStatusById.get(sectionId) === "implemented"), "all Chapter 1 child sections are implemented");
  assert.ok(registry.chapters[1].sectionIds.every((sectionId) => sectionStatusById.get(sectionId) === "implemented"), "all Chapter 2 child sections are implemented");

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

test("Chapter 2 sections retain legal, document, incident, and scoring details", () => {
  for (const sectionId of ["ch2-legal-responsibility", "ch2-required-documents", "ch2-incident-obligations", "ch2-scoring"]) {
    const section = registry.sections.find((entry) => entry.id === sectionId);
    assert.equal(section.status, "implemented", `${sectionId} is implemented in the Chapter 2 PR`);
    assert.equal(section.implementationEvidence.visualEvidenceSchemaVersion, 3, `${sectionId} uses strict visual evidence`);
    assert.equal(section.implementationEvidence.visualRulePolicyId, "031-strict-source-fidelity");
    assert.equal(section.implementationEvidence.highResolutionEvidenceStatus, "x5-or-equivalent-no-upscale-recorded");
  }

  assert.match(ch2LegalModuleSource, /Закон 2148/);
  assert.match(ch2LegalModuleSource, /1,0 г\/л|1,0 грамм/u);
  assert.match(ch2LegalModuleSource, /скрыться после участия в инциденте/);
  assert.match(ch2LegalModuleSource, /Неосторожность/u);
  assert.match(ch2LegalModuleSource, /Неблагоразумие/u);
  assert.match(ch2LegalModuleSource, /Неумение/u);

  assert.match(ch2RequiredDocumentsModuleSource, /DNI/);
  assert.match(ch2RequiredDocumentsModuleSource, /0,0 г\/л/u);
  assert.match(ch2RequiredDocumentsModuleSource, /GNC/);
  assert.match(ch2RequiredDocumentsModuleSource, /VTV/);
  assert.match(ch2RequiredDocumentsModuleSource, /RVA/);
  assert.match(ch2RequiredDocumentsModuleSource, /source-image-cards/);
  assert.match(ch2RequiredDocumentsModuleSource, /source-document-example-original-visible-text/);

  assert.match(ch2IncidentModuleSource, /107/);
  assert.match(ch2IncidentModuleSource, /911/);
  assert.match(ch2IncidentModuleSource, /30 м и 60 м/u);
  assert.match(ch2IncidentModuleSource, /50 м и 100 м/u);
  assert.match(ch2IncidentModuleSource, /односторонним движением/u);
  assert.match(ch2IncidentModuleSource, /двусторонним движением/u);
  assert.match(ch2IncidentModuleSource, /тоннеле/u);
  assert.match(ch2IncidentModuleSource, /габаритные огни/u);
  assert.match(ch2IncidentModuleSource, /AUSA 140/u);
  assert.match(ch2IncidentModuleSource, /AUSOL 0800-999-9999/u);
  assert.match(ch2IncidentModuleSource, /149, опция 2/u);
  assert.match(ch2IncidentModuleSource, /0800-222-3425/);
  assert.match(ch2IncidentModuleSource, /1558125022/);
  assert.match(ch2IncidentModuleSource, /на странице 55 после списка НКО начинается отдельный раздел Scoring/u);

  assert.match(ch2ScoringModuleSource, /20 баллов/);
  assert.match(ch2ScoringModuleSource, /4 балла/);
  assert.match(ch2ScoringModuleSource, /50%/);
  assert.match(ch2ScoringModuleSource, /60 дней до 5 лет/);
  assert.match(ch2ScoringModuleSource, /10 баллов/);
  assert.match(ch2ScoringModuleSource, /3 рабочих дня/);
  assert.match(ch2ScoringModuleSource, /Страница 56 не добавляет правил Scoring/u);
});

test("Chapter 2 document visuals are explicit source-as-is document examples with Russian explanation outside", () => {
  const section = registry.sections.find((entry) => entry.id === "ch2-required-documents");
  const evidenceRecord = section.implementationEvidence;
  const visualAssets = evidenceRecord.localAssetMetadata.filter((asset) => asset.assetCategory === "source-as-is-document-example");
  assert.equal(visualAssets.length, 6);
  assert.equal(evidenceRecord.visibleSpanishStatus.status, "source_image_exceptions_only");
  assert.equal(evidenceRecord.visibleSpanishStatus.exceptions.length, 6);
  assert.equal(evidenceRecord.localAssetMetadata.filter((asset) => asset.assetCategory === "source-as-is-photo" && asset.assetKind.includes("document-image")).length, 0);
  for (const exception of evidenceRecord.visibleSpanishStatus.exceptions) {
    assert.equal(exception.kind, "source-document-example-original-visible-text");
    assert.equal(exception.visibleSpanishScope, "source-document-example-image-only");
  }

  for (const asset of visualAssets) {
    assert.match(asset.assetKind, /^high-resolution-original-source-document-image-/u);
    assert.equal(asset.visibleSpanish, true);
    assert.equal(asset.cleanupScope, "none-source-as-is");
    assert.equal(asset.sourceIntegrity.sourceAsIs, true);
    assert.equal(asset.sourceIntegrity.noTranslationOrRelabeling, true);
    assert.equal(asset.sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint, true);
    assert.equal(asset.sourceIntegrity.russianExplanationOutsideImage, true);
    assert.equal(asset.extractionScaleEvidence.target, "x5-zoom-source-export");
    assert.equal(asset.runtimeDisplaySize.noUpscale, true);
    assert.ok(asset.width >= asset.runtimeDisplaySize.maxWidthCssPx);
    assert.ok(existsSync(asset.assetPath), `${asset.assetPath} exists`);
    assert.ok(existsSync(asset.sourceIntegrity.sourceAssetPath), `${asset.sourceIntegrity.sourceAssetPath} exists`);
    assert.equal(sha256File(asset.assetPath), sha256File(asset.sourceIntegrity.sourceAssetPath), `${asset.assetPath} matches source crop bytes`);
  }

  assert.match(manualGuideAppSource, /SourceImageCardsBlockView/);
  assert.match(appSource, /data-source-image-exception=\{card\.sourceImageException\.kind\}/);
  assert.match(stylesSource, /\.manual-source-image-card-grid/);
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
    "manual-public-transport-visuals",
    "manual-shared-trip-visuals",
    "manual-legal-detail",
    "introductionDocumentStyleGuide.tokens"
  ]) {
    assert.ok(manualGuideSource.includes(requiredToken), `manual guide style token registry includes ${requiredToken}`);
  }

  assert.match(manualGuideSource, /import \{ ch1CitiesForPeopleSection \}/);
  assert.match(manualGuideSource, /import \{ ch1SustainableMobilitySection \}/);
  assert.match(manualGuideSource, /import \{ ch1PedestrianPrioritySection \}/);
  assert.match(manualGuideSource, /import \{ ch1BicycleSection \}/);
  assert.match(manualGuideSource, /import \{ ch1PublicTransportSystemSection \}/);
  assert.match(manualGuideSource, /import \{ ch1SharedTripSection \}/);
  assert.match(manualGuideSource, /import \{ ch2LegalResponsibilitySection \}/);
  assert.match(manualGuideSource, /import \{ ch2RequiredDocumentsSection \}/);
  assert.match(manualGuideSource, /import \{ ch2IncidentObligationsSection \}/);
  assert.match(manualGuideSource, /import \{ ch2ScoringSection \}/);
  assert.match(
    manualGuideSource,
    /implementedManualGuideSections:\s*ManualGuideSectionContent\[\]\s*=\s*\[\s*ch1CitiesForPeopleSection,\s*ch1SustainableMobilitySection,\s*ch1PedestrianPrioritySection,\s*ch1BicycleSection,\s*ch1PublicTransportSystemSection,\s*ch1SharedTripSection,\s*ch2LegalResponsibilitySection,\s*ch2RequiredDocumentsSection,\s*ch2IncidentObligationsSection,\s*ch2ScoringSection\s*\]/
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
      { sha256: "1a888b8936c2ec987f8a4c2fa92bd9f2b07b0a61f9749f69fc9e597af062b33b", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/helmet-fit-source.jpg",
      { sha256: "59b5dde3ced464cf10760d4b7acfff4fcd1345ad49a1ba1424b348544bc07391", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/cyclist-gear-source.jpg",
      { sha256: "872fd40c00cddc2afa9d5489574b87e605802d7e95a582d2922c36a9c3964edd", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/bicycle-signs-source-as-is.jpg",
      {
        sha256: "4dfcbefd5731a4a9677e9b66beab652e7bdb0c8db1fcdc6794d4aa97c0f9ac65",
        visibleSpanish: true,
        assetKind: "official-traffic-sign-source-as-is"
      }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/posture-cyclist-source.jpg",
      { sha256: "3da169144ff919429503b14c7c764e45e663ec76b564d4e39ee7da812533c587", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/safe-distance-source.jpg",
      {
        sha256: "8ad1706e10ffe13e394c113c921cf14735feb0ec0da8ea3e5c69a6a1bf160595",
        visibleSpanish: true,
        assetKind: "high-resolution-original-source-safe-distance-road-panel"
      }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/unsafe-distance-source.jpg",
      {
        sha256: "e219de23c7855483e274057ac9627dcbc0129c90dd83b95786a0a0a06de1c8b9",
        visibleSpanish: true,
        assetKind: "high-resolution-original-source-unsafe-distance-road-panel"
      }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/offtracking-bus-source.jpg",
      { sha256: "98b4e0867f96ed3bb6671c4d0aa5dfde145d43c5bbc42cbc10d798a3f76ffac0", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/hand-signals-source.jpg",
      { sha256: "dcbe4cf381e85536b609bf467cf225d1c77fef6ae16826c1022c583b3a2b4379", visibleSpanish: false }
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
    if (expectation.assetKind === "official-traffic-sign-source-as-is") {
      assert.equal(asset.assetKind, expectation.assetKind, `${assetPath} is the official sign exception asset`);
      assert.equal(asset.officialSignException.kind, "official-traffic-sign-source-as-is");
      assert.equal(asset.officialSignException.visibleSpanishScope, "official-sign-image-only");
      assert.equal(asset.officialSignException.sourceAsIs, true);
    } else if (expectation.visibleSpanish) {
      assert.equal(asset.assetKind, expectation.assetKind, `${assetPath} source-image exception asset kind is stable`);
      assert.equal(asset.sourceImageException.kind, "source-image-original-visible-text");
      assert.equal(asset.sourceImageException.visibleSpanishScope, "source-image-only");
      assert.equal(asset.sourceImageException.sourceAsIs, true);
      assert.equal(asset.sourceImageException.russianExplanationOutsideImage, true);
    }
  }

  assert.equal(section.implementationEvidence.visibleSpanishStatus.status, "source_image_exceptions_only");
  assert.equal(section.implementationEvidence.visibleSpanishStatus.nonSignVisibleSpanishStatus, "source-image-only");
  assert.deepEqual(
    section.implementationEvidence.visibleSpanishStatus.exceptions.map((entry) => entry.assetPath),
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/bicycle-signs-source-as-is.jpg",
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/safe-distance-source.jpg",
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/unsafe-distance-source.jpg"
    ]
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

test("ch1 public transport section covers source pages 39-40 visuals and no unrelated section content", () => {
  const section = registry.sections.find((entry) => entry.id === "ch1-public-transport-system");
  assert.ok(section, "ch1-public-transport-system registry entry exists");
  assert.equal(section.status, "implemented");
  assert.equal(section.sourceRegionMetadataStatus, "recorded");
  assert.equal(section.visualEvidenceStatus, "recorded");
  assert.equal(section.implementationEvidence.checkerResult, "pass");
  assert.deepEqual(section.implementationEvidence.sourcePages, [39, 40]);
  assert.equal(existsSync(section.sectionContentModulePath), true);
  assert.equal(existsSync(section.implementationEvidence.desktopScreenshot), true);
  assert.equal(existsSync(section.implementationEvidence.mobileScreenshot), true);

  for (const sourceRegion of section.implementationEvidence.sourceRegionMetadata) {
    assert.equal(existsSync(sourceRegion.sourceAssetPath), true, `${sourceRegion.sourceAssetPath} exists`);
    assert.ok([39, 40].includes(sourceRegion.sourcePage), `${sourceRegion.sourceAssetPath} belongs to the assigned source range`);
  }

  const expectedAssets = new Map([
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-public-transport-system/avenue-comparison-source.jpg",
      { sha256: "9de57b9a15546910585ff23ec253cf06aa585f53f71c68551cb0508d51e48600", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-public-transport-system/yellow-box-source.jpg",
      { sha256: "235efcd971e7523907d0e90bb5c426f373b148e8dd94684c6ef9af1d49fe21d5", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-public-transport-system/bus-platform-source.jpg",
      { sha256: "9f3b5b111b6bc948e33c60db3d88cac5e641592570ec5a0f7ebd7515aaf77e8d", visibleSpanish: false }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-public-transport-system/exclusive-lane-source.jpg",
      {
        sha256: "12d9b8e69b463b9e7c5e4b5729d8fdc6c3bf44595373d5fbc0b9912f6b513258",
        visibleSpanish: true,
        assetKind: "high-resolution-original-source-exclusive-lane-bus-marking-photo"
      }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-public-transport-system/metrobus-source.jpg",
      {
        sha256: "d54e4519912634abfd34e196bc283e112dbbffa5eaed86d035dc3edf8dbbad85",
        visibleSpanish: true,
        assetKind: "high-resolution-original-source-metrobus-station-photo"
      }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-public-transport-system/transport-center-source.jpg",
      { sha256: "c0eb116ddde111639c4c76bf0f917ce842c956b35e66cc13bc9f2e3ab797c6e1", visibleSpanish: false }
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
      assert.equal(asset.assetKind, expectation.assetKind, `${assetPath} source-image exception asset kind is stable`);
      assert.equal(asset.sourceImageException.kind, "source-image-original-visible-text");
      assert.equal(asset.sourceImageException.visibleSpanishScope, "source-image-only");
      assert.equal(asset.sourceImageException.sourceAsIs, true);
      assert.equal(asset.sourceImageException.russianExplanationOutsideImage, true);
    }
  }

  assert.equal(section.implementationEvidence.visibleSpanishStatus.status, "source_image_exceptions_only");
  assert.equal(section.implementationEvidence.visibleSpanishStatus.nonSignVisibleSpanishStatus, "source-image-only");
  assert.deepEqual(
    section.implementationEvidence.visibleSpanishStatus.exceptions.map((entry) => entry.assetPath),
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-public-transport-system/exclusive-lane-source.jpg",
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-public-transport-system/metrobus-source.jpg"
    ]
  );

  for (const requiredText of [
    "Система общественного транспорта",
    "уменьшить выбросы CO2",
    "40-50",
    "3-4",
    "Желтые боксы",
    "прерывистая желтая разметка",
    "Выступы для ожидания автобусов",
    "параллельно бордюру",
    "Эксклюзивные полосы",
    "бесплатное разрешение",
    "Metrobus de Buenos Aires",
    "красная дорожка",
    "через соответствующий пандус",
    "удержания водительского удостоверения",
    "Пересадочные центры",
    "автобусами, поездами, метро и велосипедами",
    "source-image-original-visible-text",
    "avenue-comparison-source.jpg",
    "exclusive-lane-source.jpg",
    "metrobus-source.jpg"
  ]) {
    assert.ok(ch1PublicTransportModuleSource.includes(requiredText), `missing public transport learner text: ${requiredText}`);
  }

  for (const requiredKind of ["public-transport-comparison", "public-transport-infrastructure"]) {
    assert.match(ch1PublicTransportModuleSource, new RegExp(`kind:\\s*"${requiredKind}"`), `${requiredKind} block is present`);
  }

  assert.match(appSource, /function PublicTransportComparisonBlockView/);
  assert.match(appSource, /function PublicTransportInfrastructureBlockView/);
  assert.match(stylesSource, /\.manual-public-transport-comparison[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-public-transport-infrastructure[\s\S]*?user-select:\s*text/);
  assert.doesNotMatch(ch1PublicTransportModuleSource, /content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/pages\/page-0(?:39|40)\.jpg/u);
  assert.doesNotMatch(ch1PublicTransportModuleSource, /https?:\/\//u);
  assert.doesNotMatch(ch1PublicTransportModuleSource, /Совместная поездка|Юридическая ответственность|Обязательные документы|Scoring/u);

  const orderedBlockIds = [
    "public-transport-intro",
    "public-transport-capacity-comparison",
    "city-supports-public-transport",
    "public-transport-infrastructure"
  ];
  let previousBlockIndex = -1;
  for (const blockId of orderedBlockIds) {
    const blockIndex = ch1PublicTransportModuleSource.indexOf(`id: "${blockId}"`);
    assert.ok(blockIndex > previousBlockIndex, `${blockId} follows source pages 39-40 order`);
    previousBlockIndex = blockIndex;
  }
});

test("ch1 shared trip section covers source pages 41-42 visuals and no Chapter 2 content", () => {
  const section = registry.sections.find((entry) => entry.id === "ch1-shared-trip");
  assert.ok(section, "ch1-shared-trip registry entry exists");
  assert.equal(section.status, "implemented");
  assert.equal(section.sourceRegionMetadataStatus, "recorded");
  assert.equal(section.visualEvidenceStatus, "recorded");
  assert.equal(section.implementationEvidence.checkerResult, "pass");
  assert.deepEqual(section.implementationEvidence.sourcePages, [41, 42]);
  assert.equal(existsSync(section.sectionContentModulePath), true);
  assert.equal(existsSync(section.implementationEvidence.desktopScreenshot), true);
  assert.equal(existsSync(section.implementationEvidence.mobileScreenshot), true);

  for (const sourceRegion of section.implementationEvidence.sourceRegionMetadata) {
    assert.equal(existsSync(sourceRegion.sourceAssetPath), true, `${sourceRegion.sourceAssetPath} exists`);
    assert.ok([41, 42].includes(sourceRegion.sourcePage), `${sourceRegion.sourceAssetPath} belongs to the assigned source range`);
  }

  const expectedAssets = new Map([
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-shared-trip/carpool-diagram-source.jpg",
      {
        sha256: "59fc44938f1ff3adde5fe911cbaf50c27cf7f4231529f64231425a1b42f7b948",
        visibleSpanish: false,
        assetKind: "high-resolution-original-source-carpool-benefit-diagram"
      }
    ],
    [
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-shared-trip/mobility-priority-photo-source.jpg",
      {
        sha256: "1b385683e748596097a5f5e24b886a221daa0377dc675397e70cea9511865725",
        visibleSpanish: true,
        assetKind: "high-resolution-original-source-mobility-priority-photo"
      }
    ]
  ]);

  for (const [assetPath, expectation] of expectedAssets) {
    const asset = section.implementationEvidence.localAssetMetadata.find((entry) => entry.assetPath === assetPath);
    assert.ok(asset, `${assetPath} local asset metadata exists`);
    assert.equal(existsSync(assetPath), true, `${assetPath} exists`);
    assert.equal(asset.assetKind, expectation.assetKind, `${assetPath} asset kind is stable`);
    assert.equal(asset.visibleSpanish, expectation.visibleSpanish, `${assetPath} visible-Spanish evidence matches policy`);
    assert.equal(asset.sha256, expectation.sha256, `${assetPath} registry hash is stable`);
    assert.equal(sha256File(assetPath), expectation.sha256, `${assetPath} bytes match registry hash`);
    if (expectation.visibleSpanish) {
      assert.equal(asset.sourceImageException.kind, "source-image-original-visible-text");
      assert.equal(asset.sourceImageException.visibleSpanishScope, "source-image-only");
      assert.equal(asset.sourceImageException.sourceAsIs, true);
      assert.equal(asset.sourceImageException.russianExplanationOutsideImage, true);
    }
  }

  assert.equal(section.implementationEvidence.visibleSpanishStatus.status, "source_image_exceptions_only");
  assert.equal(section.implementationEvidence.visibleSpanishStatus.nonSignVisibleSpanishStatus, "source-image-only");
  assert.deepEqual(
    section.implementationEvidence.visibleSpanishStatus.exceptions.map((entry) => entry.assetPath),
    ["content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-shared-trip/mobility-priority-photo-source.jpg"]
  );

  for (const requiredText of [
    "Совместная поездка",
    "лучше использовать общественное пространство",
    "ходить пешком",
    "велосипедом или общественным транспортом",
    "регулярных поездок",
    "отдельных маршрутов",
    "максимально занять места",
    "на четыре автомобиля меньше",
    "относится к поездке с другими водителями",
    "иначе поехали бы за рулем отдельных автомобилей",
    "Больше места для стоянки",
    "Бережет окружающую среду",
    "топливо",
    "плату за проезд",
    "Отдавать приоритет устойчивой мобильности",
    "source-image-original-visible-text",
    "carpool-diagram-source.jpg",
    "mobility-priority-photo-source.jpg"
  ]) {
    assert.ok(ch1SharedTripModuleSource.includes(requiredText), `missing shared-trip learner text: ${requiredText}`);
  }

  for (const requiredKind of ["shared-trip-benefits", "shared-trip-closing"]) {
    assert.match(ch1SharedTripModuleSource, new RegExp(`kind:\\s*"${requiredKind}"`), `${requiredKind} block is present`);
  }

  assert.match(appSource, /function SharedTripBenefitsBlockView/);
  assert.match(appSource, /function SharedTripClosingBlockView/);
  assert.match(stylesSource, /\.manual-shared-trip-benefits[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.manual-shared-trip-closing[\s\S]*?user-select:\s*text/);
  assert.doesNotMatch(ch1SharedTripModuleSource, /content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/pages\/page-0(?:41|42)\.jpg/u);
  assert.doesNotMatch(ch1SharedTripModuleSource, /https?:\/\//u);
  assert.doesNotMatch(ch1SharedTripModuleSource, /Юридическая ответственность|Обязательные документы|Scoring|Ответственность/u);

  const orderedBlockIds = [
    "shared-trip-public-space-context",
    "shared-trip-definition",
    "shared-trip-benefits",
    "shared-trip-mobility-priority"
  ];
  let previousBlockIndex = -1;
  for (const blockId of orderedBlockIds) {
    const blockIndex = ch1SharedTripModuleSource.indexOf(`id: "${blockId}"`);
    assert.ok(blockIndex > previousBlockIndex, `${blockId} follows source pages 41-42 order`);
    previousBlockIndex = blockIndex;
  }
});

test("Manual guide source-fidelity checker scans the implemented section renderer", () => {
  assert.match(checkerSource, /sliceSource\(appSource,\s*"function ManualGuideSectionContentView"/);
  assert.match(manualGuideAppSource, /function ManualGuideSectionContentView/);
  assert.match(manualGuideAppSource, /assetUrl\(block\.assetPath\)/);
});

test("Manual guide source-fidelity evidence schema records strict full-manual visual policy", () => {
  assert.equal(evidence.strictVisualRulePolicy.id, "031-strict-source-fidelity");
  assert.equal(evidence.strictVisualRulePolicy.schemaVersion, 3);
  assert.equal(evidence.strictVisualRulePolicy.enforcement, "all-new-manual-units");
  assert.deepEqual(evidence.strictVisualRulePolicy.legacyBaselineFeatureIds, ["030-manual-chapters-1-2"]);
  assert.deepEqual(evidence.strictVisualRulePolicy.legacyBaselineSectionIds, [
    "ch1-cities-for-people",
    "ch1-sustainable-mobility",
    "ch1-pedestrian-priority",
    "ch1-bicycle",
    "ch1-public-transport-system",
    "ch1-shared-trip"
  ]);
  assert.deepEqual(Object.keys(evidence.strictVisualRulePolicy.legacyBaselineEvidenceFingerprints).sort(), [...legacyBaselineSectionIds].sort());
  assert.deepEqual(Object.keys(evidence.strictVisualRulePolicy.legacyBaselineStateFingerprints).sort(), [...legacyBaselineSectionIds].sort());
  for (const id of legacyBaselineSectionIds) {
    const section = registry.sections.find((entry) => entry.id === id);
    const evidenceFingerprint = evidence.strictVisualRulePolicy.legacyBaselineEvidenceFingerprints[id];
    const stateFingerprint = evidence.strictVisualRulePolicy.legacyBaselineStateFingerprints[id];
    assert.match(evidenceFingerprint, /^[a-f0-9]{64}$/u, `${id} legacy baseline evidence fingerprint must be a SHA-256 hash`);
    assert.equal(evidenceFingerprint, sha256Json(section.implementationEvidence), `${id} legacy baseline fingerprint must match current merged evidence`);
    assert.match(stateFingerprint, /^[a-f0-9]{64}$/u, `${id} legacy baseline state fingerprint must be a SHA-256 hash`);
    assert.equal(
      stateFingerprint,
      legacyBaselineStateFingerprint(section, section.implementationEvidence),
      `${id} legacy baseline state fingerprint must match current merged module and visual asset bytes`
    );
  }
  assert.deepEqual(evidence.strictVisualRulePolicy.highResolutionEvidence.allowedTargets, [
    "x5-zoom-source-export",
    "source-native-equivalent-or-better",
    "higher-resolution-direct-export"
  ]);
  for (const requiredCategory of [
    "source-as-is-photo",
    "source-as-is-traffic-sign",
    "source-as-is-road-marking",
    "source-as-is-document-example",
    "source-transferred-infographic",
    "source-transferred-diagram",
    "native-dom-text-only"
  ]) {
    assert.ok(evidence.strictVisualRulePolicy.assetCategories.includes(requiredCategory), `strict schema includes ${requiredCategory}`);
  }
  assert.deepEqual(evidence.strictVisualRulePolicy.protectedSourceAsIsRequiredFields, [
    "sourceIntegrity.sourceAsIs",
    "sourceIntegrity.sourceAssetPath",
    "sourceIntegrity.noTranslationOrRelabeling",
    "sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint",
    "sourceIntegrity.russianExplanationOutsideImage",
    "cleanupScope=none-source-as-is",
    "visibleSpanishStatus.status=source_image_exceptions_only for source-image or mixed source-image/sign exceptions, or official_traffic_sign_exception_only for sign-only exceptions, with exceptions.assetPath matching assetPath when visibleSpanish=true"
  ]);
  assert.deepEqual(evidence.strictVisualRulePolicy.documentExampleSourceAsIsCategories, ["source-as-is-document-example"]);
  assert.deepEqual(evidence.strictVisualRulePolicy.documentExampleSourceAsIsRequiredFields, [
    "assetCategory=source-as-is-document-example",
    "assetKind starts with high-resolution-original-source-document-image-",
    "sourceIntegrity.sourceAsIs",
    "sourceIntegrity.sourceAssetPath",
    "sourceIntegrity.noTranslationOrRelabeling",
    "sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint",
    "sourceIntegrity.russianExplanationOutsideImage",
    "cleanupScope=none-source-as-is",
    "visibleSpanishStatus.status=source_image_exceptions_only with exceptions.kind=source-document-example-original-visible-text and exceptions.assetPath matching assetPath when visibleSpanish=true",
    "Russian explanation remains outside the source-as-is document example image"
  ]);
  assert.deepEqual(evidence.strictVisualRulePolicy.infographicRequiredFields, [
    "assetCategory=source-transferred-infographic",
    "visibleSpanish=false after glyph-level cleanup or selectable Russian overlay",
    "infographicTransfer.sourceImageTransfer",
    "infographicTransfer.sourceAssetPath references sourceRegionMetadata.sourceAssetPath",
    "infographicTransfer.sourceCropSha256 matches sourceRegionMetadata.cropSha256",
    "infographicTransfer.sourceCropDimensions match sourceRegionMetadata.cropDimensions",
    "infographicTransfer.noApproximateRedraw",
    "infographicTransfer.broadMaskPlatePatchStatus=none",
    "cleanupScope=glyph-level-spanish-cleanup or none-source-as-is",
    "infographicTransfer.cleanupMethod=glyph-letter-level-background-restoration when Spanish is removed",
    "infographicTransfer.russianOverlayStrategy=selectable-dom or selectable-svg"
  ]);
  assert.deepEqual(evidence.strictVisualRulePolicy.diagramRequiredFields, [
    "assetCategory=source-transferred-diagram",
    "visibleSpanish=false after glyph-level cleanup or selectable Russian overlay",
    "diagramTransfer.sourceDiagramTransfer",
    "diagramTransfer.sourceAssetPath references sourceRegionMetadata.sourceAssetPath",
    "diagramTransfer.sourceCropSha256 matches sourceRegionMetadata.cropSha256",
    "diagramTransfer.sourceCropDimensions match sourceRegionMetadata.cropDimensions",
    "diagramTransfer.noApproximateRedraw",
    "diagramTransfer.noReconstruction",
    "diagramTransfer.noGenericIconReplacement",
    "diagramTransfer.broadMaskPlatePatchStatus=none",
    "cleanupScope=glyph-level-spanish-cleanup or none-source-as-is",
    "diagramTransfer.cleanupMethod=glyph-letter-level-background-restoration when Spanish is removed"
  ]);
  for (const forbiddenTerm of [
    "approximate-redraw",
    "redrawn-diagram",
    "reconstructed-diagram",
    "generic-icon-replacement",
    "translated-sign",
    "translated-road-marking",
    "retouched-photo",
    "broad-mask",
    "broad-box",
    "square-patch",
    "color-matched-plate",
    "opaque-rectangle",
    "opaque-label-background",
    "backing-rectangle"
  ]) {
    assert.ok(evidence.strictVisualRulePolicy.forbiddenStrictVisualTerms.includes(forbiddenTerm), `strict schema forbids ${forbiddenTerm}`);
  }
  assert.equal(
    evidence.strictVisualRulePolicy.forbiddenStrictVisualTermMatching,
    "case-insensitive canonical term matching across hyphen, space, and underscore separators; semantic kind/category/approach metadata is scanned while path/hash/id fields are excluded"
  );
});

test("Manual guide source-fidelity checker passes the section registry with Chapter 1 and 2 implemented sections", () => {
  assert.equal(evidence.checkerId, "manual-guide-source-fidelity");
  assert.deepEqual(evidence.requiredSourcePageRange, { start: 21, end: 56 });
  assert.deepEqual(evidence.sharedSourcePageOwnership.map((entry) => entry.sourcePage), [55]);
  assert.deepEqual(evidence.sharedPrereqExpectedOutput.skippedSourcePages, [21, 43, 56]);
  assert.deepEqual(evidence.sharedPrereqExpectedOutput.skippedDividerPages, [21, 43]);
  assert.deepEqual(evidence.sharedPrereqExpectedOutput.omittedBookOnlyPages, [56]);
  assert.deepEqual(evidence.sharedPrereqExpectedOutput.sharedSourcePages, [55]);
  assert.equal(evidence.sharedPrereqExpectedOutput.pendingSections, 0);
  assert.equal(evidence.sharedPrereqExpectedOutput.implementedSections, 10);
  const output = execFileSync(process.execPath, ["scripts/manual-guide-source-fidelity.mjs"], { encoding: "utf8" });
  const result = JSON.parse(output);
  assert.equal(result.status, "pass");
  assert.equal(result.pendingSections, 0);
  assert.equal(result.implementedSections, 10);
  assert.deepEqual(result.skippedSourcePages, [21, 43, 56]);
  assert.deepEqual(result.skippedDividerPages, [21, 43]);
  assert.deepEqual(result.omittedBookOnlyPages, [56]);
  assert.deepEqual(result.sharedSourcePages, [55]);
  assert.equal(result.screenshotEvidence, "recorded_for_complete_chapters_1_and_2_sections");
  assert.equal(result.strictVisualRulePolicy, "031-strict-source-fidelity");
});

test("Manual guide source-fidelity checker keeps already-merged Chapter 1 legacy baseline evidence allowed", () => {
  for (const id of legacyBaselineSectionIds) {
    const implementedEvidence = registry.sections.find((entry) => entry.id === id).implementationEvidence;
    assert.equal("visualEvidenceSchemaVersion" in implementedEvidence, false, `${id} baseline evidence remains legacy before planned audit`);
    assert.equal("visualRulePolicyId" in implementedEvidence, false, `${id} baseline evidence remains legacy before planned audit`);
  }
  const output = execFileSync(process.execPath, ["scripts/manual-guide-source-fidelity.mjs"], { encoding: "utf8" });
  const result = JSON.parse(output);
  assert.equal(result.status, "pass");
  assert.equal(result.implementedSections, 10);
});

test("Manual guide source-fidelity checker requires strict visual evidence for future manual units", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-missing-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      delete implementationEvidence.visualEvidenceSchemaVersion;
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when a future manual unit omits strict schema version evidence");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority implementationEvidence.visualEvidenceSchemaVersion must be 3 for new manual units");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects future Chapter 1 legacy-section changes without strict v3 evidence", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-ch1-legacy-reimplementation-"));
  try {
    const implementedRegistryPath = join(tempDir, "section-registry.ch1-legacy-reimplementation.json");
    const changedRegistry = JSON.parse(JSON.stringify(registry));
    const section = changedRegistry.sections.find((entry) => entry.id === "ch1-pedestrian-priority");
    section.implementationEvidence.checkerRunAt = "future-audit-or-correction-without-strict-v3";
    writeFileSync(implementedRegistryPath, JSON.stringify(changedRegistry, null, 2));

    const failure = runCheckerWithFixture(implementedRegistryPath, "src/data/manual-sections");
    assert.notEqual(failure.status, 0, "checker must fail when a legacy Chapter 1 section changes evidence without strict v3 markers");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority implementationEvidence.visualEvidenceSchemaVersion must be 3 for new manual units");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects changed legacy Chapter 1 module bytes without strict v3 evidence", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-ch1-legacy-module-state-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: [] };\n'
    );
    writeFileSync(join(moduleRoot, "ch1-pedestrian-priority.ts"), 'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: ["changed"] };\n');

    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when legacy module bytes change without strict v3 markers");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority implementationEvidence.visualEvidenceSchemaVersion must be 3 for new manual units");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects changed legacy Chapter 1 visual asset bytes without strict v3 evidence", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-ch1-legacy-asset-state-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeImplementedRegistryFixture(
      tempDir,
      'export const ch1PedestrianPriority = { sectionId: "ch1-pedestrian-priority", blocks: [] };\n'
    );
    const fixtureRegistry = JSON.parse(readFileSync(implementedRegistryPath, "utf8"));
    const section = fixtureRegistry.sections.find((entry) => entry.id === "ch1-pedestrian-priority");
    writeFileSync(section.implementationEvidence.localAssetMetadata[0].assetPath, "changed visual asset bytes");

    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when legacy visual asset bytes change without strict v3 markers");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority implementationEvidence.visualEvidenceSchemaVersion must be 3 for new manual units");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker requires strict evidence for newly implemented Chapter 2 sections in the legacy registry", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-ch2-legacy-evidence-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeChapter2LegalResponsibilityFixture(tempDir);
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when a pending Chapter 2 section is newly implemented with legacy evidence");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch2-legal-responsibility implementationEvidence.visualEvidenceSchemaVersion must be 3 for new manual units");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker accepts newly implemented Chapter 2 sections only with strict v3 evidence", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-ch2-strict-evidence-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeChapter2LegalResponsibilityFixture(tempDir, { strict: true });
    const result = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.status, "pass");
    assert.equal(output.implementedSections, 10);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker accepts strict transferred artwork with source-region linkage", () => {
  const infographicTempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-infographic-source-link-pass-"));
  const diagramTempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-diagram-source-link-pass-"));
  try {
    const infographicFixture = writeStrictFutureRegistryFixture(infographicTempDir);
    const infographicResult = runCheckerWithFixture(infographicFixture.implementedRegistryPath, infographicFixture.moduleRoot, infographicFixture.strictEvidencePath);
    assert.equal(infographicResult.status, 0, infographicResult.stderr);
    const diagramFixture = writeChapter2LegalResponsibilityFixture(diagramTempDir, { strict: true });
    const diagramResult = runCheckerWithFixture(diagramFixture.implementedRegistryPath, diagramFixture.moduleRoot);
    assert.equal(diagramResult.status, 0, diagramResult.stderr);
  } finally {
    rmSync(infographicTempDir, { recursive: true, force: true });
    rmSync(diagramTempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict source-transferred diagrams without transfer proof", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-ch2-diagram-missing-transfer-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeChapter2LegalResponsibilityFixture(tempDir, {
      strict: true,
      mutateEvidence: (implementationEvidence) => {
        delete implementationEvidence.localAssetMetadata[1].diagramTransfer;
      }
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when a strict transferred diagram omits source-transfer proof");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch2-legal-responsibility implementationEvidence localAssetMetadata[1].diagramTransfer must be an object");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict transferred artwork without source-region linkage", () => {
  const cases = [
    {
      name: "infographic",
      writeFixture: (tempDir) =>
        writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
          delete implementationEvidence.localAssetMetadata[0].infographicTransfer.sourceAssetPath;
        }),
      expectedMessage: "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0].infographicTransfer is missing sourceAssetPath"
    },
    {
      name: "diagram",
      writeFixture: (tempDir) =>
        writeChapter2LegalResponsibilityFixture(tempDir, {
          strict: true,
          mutateEvidence: (implementationEvidence) => {
            delete implementationEvidence.localAssetMetadata[1].diagramTransfer.sourceAssetPath;
          }
        }),
      expectedMessage: "ch2-legal-responsibility implementationEvidence localAssetMetadata[1].diagramTransfer is missing sourceAssetPath"
    }
  ];

  for (const testCase of cases) {
    const tempDir = mkdtempSync(join(tmpdir(), `manual-guide-strict-${testCase.name}-source-link-missing-`));
    try {
      const { implementedRegistryPath, moduleRoot, strictEvidencePath } = testCase.writeFixture(tempDir);
      const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
      assert.notEqual(failure.status, 0, `checker must fail when strict transferred ${testCase.name} omits source linkage`);
      const result = JSON.parse(failure.stderr);
      assert.equal(result.status, "fail");
      assert.equal(result.message, testCase.expectedMessage);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

test("Manual guide source-fidelity checker rejects self-certified transferred artwork without a source crop", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-transfer-self-certified-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      const transferredAsset = implementationEvidence.localAssetMetadata[0];
      transferredAsset.assetKind = "generated-but-self-certified-infographic";
      transferredAsset.infographicTransfer.sourceAssetPath = transferredAsset.assetPath;
      transferredAsset.infographicTransfer.sourceCropSha256 = transferredAsset.sha256;
      transferredAsset.infographicTransfer.sourceCropDimensions = {
        width: transferredAsset.width,
        height: transferredAsset.height
      };
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when transferred artwork links only to its own generated runtime asset");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0].infographicTransfer.sourceAssetPath must reference sourceRegionMetadata"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict source-transferred diagrams with visible Spanish", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-ch2-diagram-visible-spanish-"));
  try {
    const { implementedRegistryPath, moduleRoot } = writeChapter2LegalResponsibilityFixture(tempDir, {
      strict: true,
      mutateEvidence: (implementationEvidence) => {
        const diagramAsset = implementationEvidence.localAssetMetadata[1];
        diagramAsset.assetKind = "high-resolution-original-source-diagram";
        diagramAsset.containsText = true;
        diagramAsset.visibleSpanish = true;
        diagramAsset.sourceImageException = {
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
              assetPath: diagramAsset.assetPath,
              kind: "source-image-original-visible-text",
              visibleSpanishScope: "source-image-only",
              sourceAsIs: true,
              russianExplanationOutsideImage: true
            }
          ]
        };
      }
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot);
    assert.notEqual(failure.status, 0, "checker must fail when a strict transferred diagram keeps visible Spanish");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch2-legal-responsibility implementationEvidence localAssetMetadata[1].visibleSpanish must be false for transferred diagram artwork"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects future image assets without no-upscale evidence", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-upscale-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.localAssetMetadata[0].runtimeDisplaySize.noUpscale = false;
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when future image metadata allows runtime upscaling");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0].runtimeDisplaySize.noUpscale must be true");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict image assets with bogus sha256 metadata", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-bogus-sha-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.localAssetMetadata[0].sha256 = "fixture-artwork-1-sha";
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when strict image metadata uses a placeholder hash");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0].sha256 must be a SHA-256 hash");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict image assets with stale sha256 metadata", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-stale-sha-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.localAssetMetadata[0].sha256 = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when strict image metadata hash does not match asset bytes");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0].sha256 must match referenced artifact bytes");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict image assets with overclaimed dimensions", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-overclaimed-dimensions-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.localAssetMetadata[0].width += 1;
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when strict image metadata overstates the referenced image width");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0].width must match referenced image width");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict image assets with overclaimed extraction output dimensions", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-overclaimed-extraction-dimensions-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.localAssetMetadata[0].extractionScaleEvidence.outputDimensions = { width: 121, height: 80 };
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when strict extraction metadata overstates referenced image dimensions");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0].extractionScaleEvidence.outputDimensions.width must match referenced image width"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict image assets with non-image bytes", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-non-image-bytes-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      writeFileSync(implementationEvidence.localAssetMetadata[0].assetPath, "not image bytes");
      implementationEvidence.localAssetMetadata[0].sha256 = sha256File(implementationEvidence.localAssetMetadata[0].assetPath);
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when strict image metadata references non-image bytes");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0].assetPath must reference a supported image with readable dimensions"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict source crops with non-image bytes", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-source-crop-non-image-bytes-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      writeFileSync(implementationEvidence.sourceRegionMetadata[0].sourceAssetPath, "not image bytes");
      implementationEvidence.sourceRegionMetadata[0].cropSha256 = sha256File(implementationEvidence.sourceRegionMetadata[0].sourceAssetPath);
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when strict source crop metadata references non-image bytes");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence sourceRegionMetadata[0].sourceAssetPath must reference a supported image with readable dimensions"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict source crops with bogus cropSha256 metadata", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-bogus-crop-sha-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.sourceRegionMetadata[0].cropSha256 = "fixture-source-crop-24-sha";
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when strict source crop metadata uses a placeholder hash");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority implementationEvidence sourceRegionMetadata[0].cropSha256 must be a SHA-256 hash");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict source crops with stale cropSha256 metadata", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-stale-crop-sha-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.sourceRegionMetadata[0].cropSha256 = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when strict crop hash does not match source crop artifact bytes");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority implementationEvidence sourceRegionMetadata[0].cropSha256 must match referenced artifact bytes");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict source crops with mismatched cropDimensions", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-crop-dimensions-mismatch-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.sourceRegionMetadata[0].cropDimensions = { width: 121, height: 80 };
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when strict cropDimensions do not match source crop artifact bytes");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence sourceRegionMetadata[0].cropDimensions.width must match referenced image width"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict source crops with overclaimed extraction output dimensions", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-source-crop-extraction-dimensions-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.sourceRegionMetadata[0].extractionScaleEvidence.outputDimensions = { width: 121, height: 80 };
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when strict source crop extraction dimensions do not match artifact bytes");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence sourceRegionMetadata[0].extractionScaleEvidence.outputDimensions.width must match referenced image width"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker accepts strict non-image asset categories without image sizing metadata", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-non-image-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.localAssetMetadata = [
        {
          assetPath: writeTempFile(join(tempDir, "assets", "native-dom-text-only.txt")),
          assetKind: "native-dom-text-only",
          assetCategory: "native-dom-text-only",
          containsText: true,
          visibleSpanish: false
        },
        {
          assetPath: writeTempFile(join(tempDir, "assets", "reference-only-not-runtime.txt")),
          assetKind: "reference-only-not-runtime",
          assetCategory: "reference-only-not-runtime",
          containsText: false,
          visibleSpanish: false
        }
      ];
      implementationEvidence.visibleSpanishStatus = "none";
    });
    const result = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.status, "pass");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects future source-as-is assets with visual edits", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-source-as-is-edit-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.localAssetMetadata[1].visibleSpanish = false;
      implementationEvidence.visibleSpanishStatus = "none";
      implementationEvidence.localAssetMetadata[1].sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint = false;
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when protected source-as-is photos/signs/markings are edited");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence localAssetMetadata[1].sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint must be true"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker accepts strict source-as-is visible Spanish only with matching exception evidence", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-source-as-is-visible-exception-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir);
    const result = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.status, "pass");
    assert.equal(output.implementedSections, 1);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker accepts explicit source-as-is document examples", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-document-example-visible-exception-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      const documentAsset = implementationEvidence.localAssetMetadata[1];
      documentAsset.assetKind = "high-resolution-original-source-document-image-fixture";
      documentAsset.assetCategory = "source-as-is-document-example";
      implementationEvidence.visibleSpanishStatus = {
        status: "source_image_exceptions_only",
        nonSignVisibleSpanishStatus: "source-image-only",
        exceptions: [
          {
            assetPath: documentAsset.assetPath,
            kind: "source-document-example-original-visible-text",
            visibleSpanishScope: "source-document-example-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          }
        ]
      };
    });
    const result = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.equal(result.status, 0, result.stderr);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects source-as-is document examples with non-document asset kinds", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-document-example-wrong-kind-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      const documentAsset = implementationEvidence.localAssetMetadata[1];
      documentAsset.assetKind = "high-resolution-original-source-wayfinding-photo";
      documentAsset.assetCategory = "source-as-is-document-example";
      implementationEvidence.visibleSpanishStatus = {
        status: "source_image_exceptions_only",
        nonSignVisibleSpanishStatus: "source-image-only",
        exceptions: [
          {
            assetPath: documentAsset.assetPath,
            kind: "source-document-example-original-visible-text",
            visibleSpanishScope: "source-document-example-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          }
        ]
      };
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when document-example category is applied to non-document artwork");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence localAssetMetadata[1].assetKind must identify a high-resolution original source document image"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker accepts strict mixed source-image and sign visible Spanish exceptions", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-mixed-source-sign-visible-exception-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      const signAsset = implementationEvidence.localAssetMetadata[0];
      signAsset.assetKind = "official-traffic-sign-source-as-is";
      signAsset.assetCategory = "source-as-is-traffic-sign";
      signAsset.cleanupScope = "none-source-as-is";
      signAsset.containsText = true;
      signAsset.visibleSpanish = true;
      signAsset.sourceIntegrity = {
        sourceAsIs: true,
        sourceAssetPath: implementationEvidence.sourceRegionMetadata[0].sourceAssetPath,
        noTranslationOrRelabeling: true,
        noRedrawRecolorCleanupRetouchMaskInpaint: true,
        russianExplanationOutsideImage: true
      };
      signAsset.officialSignException = {
        kind: "official-traffic-sign-source-as-is",
        visibleSpanishScope: "official-sign-image-only",
        sourceAsIs: true
      };
      implementationEvidence.visibleSpanishStatus = {
        status: "source_image_exceptions_only",
        nonSignVisibleSpanishStatus: "source-image-only",
        exceptions: [
          {
            assetPath: signAsset.assetPath,
            kind: "official-traffic-sign-source-as-is",
            visibleSpanishScope: "official-sign-image-only",
            sourceAsIs: true
          },
          {
            assetPath: implementationEvidence.localAssetMetadata[1].assetPath,
            kind: "source-image-original-visible-text",
            visibleSpanishScope: "source-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          }
        ]
      };
    });
    const result = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.status, "pass");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict source-as-is visible Spanish hidden by none status", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-source-as-is-visible-none-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.visibleSpanishStatus = "none";
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when a strict source-as-is asset keeps Spanish but top-level status claims none");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence localAssetMetadata[1].visibleSpanish=true must be recorded in visibleSpanishStatus.exceptions"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict source-as-is visible Spanish with none status object", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-source-as-is-visible-none-object-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.visibleSpanishStatus = {
        status: "none",
        exceptions: [
          {
            assetPath: implementationEvidence.localAssetMetadata[1].assetPath,
            kind: "source-image-original-visible-text",
            visibleSpanishScope: "source-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          }
        ]
      };
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when exceptions are paired with a non-exception visible-Spanish status");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence localAssetMetadata[1].visibleSpanish=true must be recorded in visibleSpanishStatus.exceptions"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict source-as-is visible Spanish with mismatched exception path", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-source-as-is-visible-wrong-path-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.visibleSpanishStatus.exceptions[0].assetPath = implementationEvidence.localAssetMetadata[0].assetPath;
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when a strict source-as-is visible-Spanish exception names another asset");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence localAssetMetadata[1].visibleSpanish=true must be recorded in visibleSpanishStatus.exceptions"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict source-as-is assets that do not match source crop bytes", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-source-as-is-byte-mismatch-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      const protectedAsset = implementationEvidence.localAssetMetadata[1];
      writeFileSync(protectedAsset.assetPath, Buffer.concat([pngBytesWithDimensions(protectedAsset.width, protectedAsset.height), Buffer.from("retouched-source-as-is")]));
      protectedAsset.sha256 = sha256File(protectedAsset.assetPath);
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when a strict source-as-is asset differs from its source crop bytes");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence localAssetMetadata[1].sha256 must match source-as-is source crop bytes"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects future infographic broad patch cleanup", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-infographic-patch-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      implementationEvidence.localAssetMetadata[0].infographicTransfer.broadMaskPlatePatchStatus = "large-patch";
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when infographic cleanup uses broad patches");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.match(result.message, /forbidden visual-edit term large-patch|broadMaskPlatePatchStatus must be none/u);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects future infographic transferred artwork with visible Spanish", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-infographic-visible-spanish-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      const infographicAsset = implementationEvidence.localAssetMetadata[0];
      infographicAsset.assetKind = "high-resolution-original-source-infographic";
      infographicAsset.containsText = true;
      infographicAsset.visibleSpanish = true;
      infographicAsset.sourceImageException = {
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
            assetPath: infographicAsset.assetPath,
            kind: "source-image-original-visible-text",
            visibleSpanishScope: "source-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          },
          {
            assetPath: implementationEvidence.localAssetMetadata[1].assetPath,
            kind: "source-image-original-visible-text",
            visibleSpanishScope: "source-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          }
        ]
      };
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when a strict transferred infographic keeps visible Spanish");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0].visibleSpanish must be false for transferred infographic artwork"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects strict non-protected categories using source-image Spanish exceptions", () => {
  const cases = [
    {
      name: "native-dom-text-only",
      assetCategory: "native-dom-text-only",
      assetKind: "high-resolution-original-source-native-dom-text"
    },
    {
      name: "reference-only-not-runtime",
      assetCategory: "reference-only-not-runtime",
      assetKind: "high-resolution-original-source-reference-only"
    }
  ];
  for (const testCase of cases) {
    const tempDir = mkdtempSync(join(tmpdir(), `manual-guide-strict-${testCase.name}-visible-spanish-`));
    try {
      const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
        const nonProtectedAsset = implementationEvidence.localAssetMetadata[0];
        nonProtectedAsset.assetKind = testCase.assetKind;
        nonProtectedAsset.assetCategory = testCase.assetCategory;
        nonProtectedAsset.containsText = true;
        nonProtectedAsset.visibleSpanish = true;
        nonProtectedAsset.sourceImageException = {
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
              assetPath: nonProtectedAsset.assetPath,
              kind: "source-image-original-visible-text",
              visibleSpanishScope: "source-image-only",
              sourceAsIs: true,
              russianExplanationOutsideImage: true
            },
            {
              assetPath: implementationEvidence.localAssetMetadata[1].assetPath,
              kind: "source-image-original-visible-text",
              visibleSpanishScope: "source-image-only",
              sourceAsIs: true,
              russianExplanationOutsideImage: true
            }
          ]
        };
      });
      const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
      assert.notEqual(failure.status, 0, `checker must fail when strict ${testCase.assetCategory} keeps visible Spanish`);
      const result = JSON.parse(failure.stderr);
      assert.equal(result.status, "fail");
      assert.equal(
        result.message,
        "ch1-pedestrian-priority localAssetMetadata[0].visibleSpanish=true requires an explicit source-image-only exception"
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

test("Manual guide source-fidelity checker rejects forbidden strict visual terms with alternate separators", () => {
  const cases = [
    {
      name: "broad-mask-space",
      mutateEvidence: (implementationEvidence) => {
        implementationEvidence.localAssetMetadata[0].infographicTransfer.cleanupMethod = "broad mask over the source background";
      },
      expectedMessage: "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0] must not record forbidden visual-edit term broad-mask"
    },
    {
      name: "approximate-redraw-space",
      mutateEvidence: (implementationEvidence) => {
        implementationEvidence.visualReviewNotes = ["approximate redraw was used for this strict fixture"];
      },
      expectedMessage: "ch1-pedestrian-priority implementationEvidence.visualReviewNotes must not record forbidden visual-edit term approximate-redraw"
    },
    {
      name: "large-patch-underscore",
      mutateEvidence: (implementationEvidence) => {
        implementationEvidence.sourceRegionMetadata[0].cleanupScope = "large_patch cleanup";
      },
      expectedMessage: "ch1-pedestrian-priority implementationEvidence sourceRegionMetadata[0] must not record forbidden visual-edit term large-patch"
    },
    {
      name: "square-patch-space",
      mutateEvidence: (implementationEvidence) => {
        implementationEvidence.localAssetMetadata[0].infographicTransfer.cleanupMethod = "square patch cleanup over Spanish glyphs";
      },
      expectedMessage: "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0] must not record forbidden visual-edit term square-patch"
    },
    {
      name: "color-matched-plate-underscore",
      mutateEvidence: (implementationEvidence) => {
        implementationEvidence.localAssetMetadata[0].infographicTransfer.cleanupMethod = "color_matched_plate cleanup";
      },
      expectedMessage: "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0] must not record forbidden visual-edit term color-matched-plate"
    },
    {
      name: "opaque-rectangle-case",
      mutateEvidence: (implementationEvidence) => {
        implementationEvidence.visualReviewNotes = ["Opaque Rectangle was applied behind labels"];
      },
      expectedMessage: "ch1-pedestrian-priority implementationEvidence.visualReviewNotes must not record forbidden visual-edit term opaque-rectangle"
    },
    {
      name: "broad-box-space",
      mutateEvidence: (implementationEvidence) => {
        implementationEvidence.localAssetMetadata[0].infographicTransfer.cleanupMethod = "broad box behind Russian overlay";
      },
      expectedMessage: "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0] must not record forbidden visual-edit term broad-box"
    }
  ];

  for (const testCase of cases) {
    const tempDir = mkdtempSync(join(tmpdir(), `manual-guide-strict-${testCase.name}-`));
    try {
      const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, testCase.mutateEvidence);
      const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
      assert.notEqual(failure.status, 0, `checker must fail when strict metadata records ${testCase.name}`);
      const result = JSON.parse(failure.stderr);
      assert.equal(result.status, "fail");
      assert.equal(result.message, testCase.expectedMessage);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

test("Manual guide source-fidelity checker rejects forbidden strict assetKind values", () => {
  const cases = [
    {
      name: "generic-icon-replacement-kind",
      mutateEvidence: (implementationEvidence) => {
        implementationEvidence.localAssetMetadata[0].assetKind = "generic-icon-replacement";
      },
      expectedMessage: "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0] must not record forbidden visual-edit term generic-icon-replacement"
    },
    {
      name: "redrawn-diagram-kind",
      mutateEvidence: (implementationEvidence) => {
        implementationEvidence.localAssetMetadata[1].assetKind = "redrawn-diagram";
      },
      expectedMessage: "ch1-pedestrian-priority implementationEvidence localAssetMetadata[1] must not record forbidden visual-edit term redrawn-diagram"
    }
  ];

  for (const testCase of cases) {
    const tempDir = mkdtempSync(join(tmpdir(), `manual-guide-strict-${testCase.name}-`));
    try {
      const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, testCase.mutateEvidence);
      const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
      assert.notEqual(failure.status, 0, `checker must fail when strict assetKind records ${testCase.name}`);
      const result = JSON.parse(failure.stderr);
      assert.equal(result.status, "fail");
      assert.equal(result.message, testCase.expectedMessage);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

test("Manual guide source-fidelity checker accepts future strict visual evidence", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-pass-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir);
    const result = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.status, "pass");
    assert.equal(output.implementedSections, 1);
    assert.equal(output.strictVisualRulePolicy, "031-strict-source-fidelity");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
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
    assert.equal(output.pendingSections, 0);
    assert.equal(output.implementedSections, 10);
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
