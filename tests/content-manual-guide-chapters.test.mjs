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
const frontPresentationModulePath = "src/data/manual-sections/front-presentation.ts";
const frontCategoriesModulePath = "src/data/manual-sections/front-categories.ts";
const frontGlossaryModulePath = "src/data/manual-sections/front-glossary.ts";
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
const ch3PriorityModulePath = "src/data/manual-sections/ch3-priority-of-rules.ts";
const ch3RightOfWayModulePath = "src/data/manual-sections/ch3-right-of-way.ts";
const ch3LightsModulePath = "src/data/manual-sections/ch3-lights.ts";
const ch3SpeedModulePath = "src/data/manual-sections/ch3-speed.ts";
const ch3TurnsModulePath = "src/data/manual-sections/ch3-turns.ts";
const ch3OvertakingModulePath = "src/data/manual-sections/ch3-overtaking.ts";
const ch3HighwaysModulePath = "src/data/manual-sections/ch3-highways.ts";
const ch3AdverseModulePath = "src/data/manual-sections/ch3-adverse-conditions.ts";
const ch3StoppingParkingModulePath = "src/data/manual-sections/ch3-stopping-parking.ts";
const ch4AlcoholDrugsModulePath = "src/data/manual-sections/ch4-alcohol-drugs.ts";
const ch4SleepFatigueModulePath = "src/data/manual-sections/ch4-sleep-fatigue.ts";
const ch4StressModulePath = "src/data/manual-sections/ch4-stress.ts";
const ch4DistractionsModulePath = "src/data/manual-sections/ch4-distractions.ts";
const ch5AttitudeTypesModulePath = "src/data/manual-sections/ch5-attitude-types.ts";
const ch5EqualSocietyModulePath = "src/data/manual-sections/ch5-equal-society.ts";
const ch5GenderViolencePreventionModulePath = "src/data/manual-sections/ch5-gender-violence-prevention.ts";
const ch5AnticipatoryEfficientDrivingModulePath = "src/data/manual-sections/ch5-anticipatory-efficient-driving.ts";
const app1SafetyElementsModulePath = "src/data/manual-sections/app1-safety-elements.ts";
const app1OtherRequiredSafetyElementsModulePath = "src/data/manual-sections/app1-other-required-safety-elements.ts";
const app1RecommendedSafetyElementsModulePath = "src/data/manual-sections/app1-recommended-safety-elements.ts";
const app2SocialResponsibilityModulePath = "src/data/manual-sections/app2-social-responsibility.ts";
const app2SafetyElementsModulePath = "src/data/manual-sections/app2-safety-elements.ts";
const app2DrivingFactorsModulePath = "src/data/manual-sections/app2-driving-factors.ts";
const app2SafeDrivingModulePath = "src/data/manual-sections/app2-safe-driving.ts";
const app2HighwaysHospitalsModulePath = "src/data/manual-sections/app2-highways-hospitals.ts";
const app3CargoDriverProfileModulePath = "src/data/manual-sections/app3-cargo-driver-profile.ts";
const app3SocialResponsibilityModulePath = "src/data/manual-sections/app3-social-responsibility.ts";
const app3DrivingFactorsModulePath = "src/data/manual-sections/app3-driving-factors.ts";
const app3SafeDrivingModulePath = "src/data/manual-sections/app3-safe-driving.ts";
const app3SafetyElementsModulePath = "src/data/manual-sections/app3-safety-elements.ts";
const app3HighwaysModulePath = "src/data/manual-sections/app3-highways.ts";
const app4SignsRegulatoryModulePath = "src/data/manual-sections/app4-signs-regulatory.ts";
const app4SignsWarningModulePath = "src/data/manual-sections/app4-signs-warning.ts";
const app4SignsInformationalModulePath = "src/data/manual-sections/app4-signs-informational.ts";
const app4SignsTemporaryModulePath = "src/data/manual-sections/app4-signs-temporary.ts";
const app4SignsHorizontalModulePath = "src/data/manual-sections/app4-signs-horizontal.ts";
const app4SignsTrafficLightsModulePath = "src/data/manual-sections/app4-signs-traffic-lights.ts";

const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
const legacyBaselineSectionIds = new Set(["ch1-cities-for-people", "ch1-sustainable-mobility", "ch1-pedestrian-priority", "ch1-bicycle", "ch1-public-transport-system", "ch1-shared-trip"]);
const implementedSectionIds = new Set([
  "front-presentation",
  "front-categories",
  "front-glossary",
  ...legacyBaselineSectionIds,
  "ch2-legal-responsibility",
  "ch2-required-documents",
  "ch2-incident-obligations",
  "ch2-scoring",
  "ch3-priority-of-rules",
  "ch3-right-of-way",
  "ch3-lights",
  "ch3-speed",
  "ch3-turns",
  "ch3-overtaking",
  "ch3-highways",
  "ch3-adverse-conditions",
  "ch3-stopping-parking",
  "ch4-alcohol-drugs",
  "ch4-sleep-fatigue",
  "ch4-stress",
  "ch4-distractions",
  "ch5-attitude-types",
  "ch5-equal-society",
  "ch5-gender-violence-prevention",
  "ch5-anticipatory-efficient-driving",
  "app1-safety-elements",
  "app1-other-required-safety-elements",
  "app1-recommended-safety-elements",
  "app2-social-responsibility",
  "app2-safety-elements",
  "app2-driving-factors",
  "app2-safe-driving",
  "app2-highways-hospitals",
  "app3-cargo-driver-profile",
  "app3-social-responsibility",
  "app3-driving-factors",
  "app3-safe-driving",
  "app3-safety-elements",
  "app3-highways",
  "app4-signs-regulatory",
  "app4-signs-warning",
  "app4-signs-informational",
  "app4-signs-temporary",
  "app4-signs-horizontal",
  "app4-signs-traffic-lights"
]);
const manualGuideSource = readFileSync(manualGuidePath, "utf8");
const appSource = readFileSync(appPath, "utf8");
const checkerSource = readFileSync(checkerPath, "utf8");
const stylesSource = readFileSync(stylesPath, "utf8");
const frontPresentationModuleSource = readFileSync(frontPresentationModulePath, "utf8");
const frontCategoriesModuleSource = readFileSync(frontCategoriesModulePath, "utf8");
const frontGlossaryModuleSource = readFileSync(frontGlossaryModulePath, "utf8");
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
const ch3PriorityModuleSource = readFileSync(ch3PriorityModulePath, "utf8");
const ch3RightOfWayModuleSource = readFileSync(ch3RightOfWayModulePath, "utf8");
const ch3LightsModuleSource = readFileSync(ch3LightsModulePath, "utf8");
const ch3SpeedModuleSource = readFileSync(ch3SpeedModulePath, "utf8");
const ch3TurnsModuleSource = readFileSync(ch3TurnsModulePath, "utf8");
const ch3OvertakingModuleSource = readFileSync(ch3OvertakingModulePath, "utf8");
const ch3HighwaysModuleSource = readFileSync(ch3HighwaysModulePath, "utf8");
const ch3AdverseModuleSource = readFileSync(ch3AdverseModulePath, "utf8");
const ch3StoppingParkingModuleSource = readFileSync(ch3StoppingParkingModulePath, "utf8");
const ch4AlcoholDrugsModuleSource = readFileSync(ch4AlcoholDrugsModulePath, "utf8");
const ch4SleepFatigueModuleSource = readFileSync(ch4SleepFatigueModulePath, "utf8");
const ch4StressModuleSource = readFileSync(ch4StressModulePath, "utf8");
const ch4DistractionsModuleSource = readFileSync(ch4DistractionsModulePath, "utf8");
const ch5AttitudeTypesModuleSource = readFileSync(ch5AttitudeTypesModulePath, "utf8");
const ch5EqualSocietyModuleSource = readFileSync(ch5EqualSocietyModulePath, "utf8");
const ch5GenderViolencePreventionModuleSource = readFileSync(ch5GenderViolencePreventionModulePath, "utf8");
const ch5AnticipatoryEfficientDrivingModuleSource = readFileSync(ch5AnticipatoryEfficientDrivingModulePath, "utf8");
const app1SafetyElementsModuleSource = readFileSync(app1SafetyElementsModulePath, "utf8");
const app1OtherRequiredSafetyElementsModuleSource = readFileSync(app1OtherRequiredSafetyElementsModulePath, "utf8");
const app1RecommendedSafetyElementsModuleSource = readFileSync(app1RecommendedSafetyElementsModulePath, "utf8");
const app2SocialResponsibilityModuleSource = readFileSync(app2SocialResponsibilityModulePath, "utf8");
const app2SafetyElementsModuleSource = readFileSync(app2SafetyElementsModulePath, "utf8");
const app2DrivingFactorsModuleSource = readFileSync(app2DrivingFactorsModulePath, "utf8");
const app2SafeDrivingModuleSource = readFileSync(app2SafeDrivingModulePath, "utf8");
const app2HighwaysHospitalsModuleSource = readFileSync(app2HighwaysHospitalsModulePath, "utf8");
const app3CargoDriverProfileModuleSource = readFileSync(app3CargoDriverProfileModulePath, "utf8");
const app3SocialResponsibilityModuleSource = readFileSync(app3SocialResponsibilityModulePath, "utf8");
const app3DrivingFactorsModuleSource = readFileSync(app3DrivingFactorsModulePath, "utf8");
const app3SafeDrivingModuleSource = readFileSync(app3SafeDrivingModulePath, "utf8");
const app3SafetyElementsModuleSource = readFileSync(app3SafetyElementsModulePath, "utf8");
const app3HighwaysModuleSource = readFileSync(app3HighwaysModulePath, "utf8");
const app4SignsRegulatoryModuleSource = readFileSync(app4SignsRegulatoryModulePath, "utf8");
const app4SignsWarningModuleSource = readFileSync(app4SignsWarningModulePath, "utf8");
const app4SignsInformationalModuleSource = readFileSync(app4SignsInformationalModulePath, "utf8");
const app4SignsTemporaryModuleSource = readFileSync(app4SignsTemporaryModulePath, "utf8");
const app4SignsHorizontalModuleSource = readFileSync(app4SignsHorizontalModulePath, "utf8");
const app4SignsTrafficLightsModuleSource = readFileSync(app4SignsTrafficLightsModulePath, "utf8");
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

function itemsRuSourceForBlock(moduleSource, blockId) {
  const blockMatch = moduleSource.match(new RegExp(`id:\\s*"${blockId}"[\\s\\S]*?itemsRu:\\s*\\[([\\s\\S]*?)\\]`, "u"));
  assert.ok(blockMatch, `${blockId} itemsRu block found`);
  return blockMatch[1];
}

function sourceBoundaryEvidenceFor(section, sourcePage) {
  if (Array.isArray(section.sourceBoundaryEvidence)) {
    return section.sourceBoundaryEvidence.find((entry) => entry.sharedSourcePage === sourcePage);
  }
  return section.sourceBoundaryEvidence?.sharedSourcePage === sourcePage ? section.sourceBoundaryEvidence : undefined;
}

function sourcePageAssetPath(sourcePage) {
  return `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-${String(sourcePage).padStart(3, "0")}.jpg`;
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function sectionById(sectionId) {
  return registry.sections.find((entry) => entry.id === sectionId);
}

function localAssetByPath(section, assetPath) {
  const asset = section.implementationEvidence.localAssetMetadata.find((entry) => entry.assetPath === assetPath);
  assert.ok(asset, `${section.id} records ${assetPath} in localAssetMetadata`);
  return asset;
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
  writeTempFile(join(moduleRoot, "front-presentation.ts"), frontPresentationModuleSource);
  writeTempFile(join(moduleRoot, "front-categories.ts"), frontCategoriesModuleSource);
  writeTempFile(join(moduleRoot, "front-glossary.ts"), frontGlossaryModuleSource);
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
  writeTempFile(join(moduleRoot, "ch3-priority-of-rules.ts"), 'export const ch3PriorityOfRulesSection = { sectionId: "ch3-priority-of-rules", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch3-right-of-way.ts"), 'export const ch3RightOfWaySection = { sectionId: "ch3-right-of-way", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch3-lights.ts"), 'export const ch3LightsSection = { sectionId: "ch3-lights", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch3-speed.ts"), 'export const ch3SpeedSection = { sectionId: "ch3-speed", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch3-turns.ts"), 'export const ch3TurnsSection = { sectionId: "ch3-turns", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch3-overtaking.ts"), 'export const ch3OvertakingSection = { sectionId: "ch3-overtaking", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch3-highways.ts"), 'export const ch3HighwaysSection = { sectionId: "ch3-highways", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch3-adverse-conditions.ts"), 'export const ch3AdverseConditionsSection = { sectionId: "ch3-adverse-conditions", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch3-stopping-parking.ts"), 'export const ch3StoppingParkingSection = { sectionId: "ch3-stopping-parking", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch4-alcohol-drugs.ts"), 'export const ch4AlcoholDrugsSection = { sectionId: "ch4-alcohol-drugs", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch4-sleep-fatigue.ts"), 'export const ch4SleepFatigueSection = { sectionId: "ch4-sleep-fatigue", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch4-stress.ts"), 'export const ch4StressSection = { sectionId: "ch4-stress", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch4-distractions.ts"), 'export const ch4DistractionsSection = { sectionId: "ch4-distractions", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch5-attitude-types.ts"), 'export const ch5AttitudeTypesSection = { sectionId: "ch5-attitude-types", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch5-equal-society.ts"), 'export const ch5EqualSocietySection = { sectionId: "ch5-equal-society", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch5-gender-violence-prevention.ts"), 'export const ch5GenderViolencePreventionSection = { sectionId: "ch5-gender-violence-prevention", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "ch5-anticipatory-efficient-driving.ts"), 'export const ch5AnticipatoryEfficientDrivingSection = { sectionId: "ch5-anticipatory-efficient-driving", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app1-safety-elements.ts"), 'export const app1SafetyElementsSection = { sectionId: "app1-safety-elements", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app1-other-required-safety-elements.ts"), 'export const app1OtherRequiredSafetyElementsSection = { sectionId: "app1-other-required-safety-elements", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app1-recommended-safety-elements.ts"), 'export const app1RecommendedSafetyElementsSection = { sectionId: "app1-recommended-safety-elements", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app2-social-responsibility.ts"), 'export const app2SocialResponsibilitySection = { sectionId: "app2-social-responsibility", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app2-safety-elements.ts"), 'export const app2SafetyElementsSection = { sectionId: "app2-safety-elements", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app2-driving-factors.ts"), 'export const app2DrivingFactorsSection = { sectionId: "app2-driving-factors", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app2-safe-driving.ts"), 'export const app2SafeDrivingSection = { sectionId: "app2-safe-driving", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app2-highways-hospitals.ts"), 'export const app2HighwaysHospitalsSection = { sectionId: "app2-highways-hospitals", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app3-cargo-driver-profile.ts"), 'export const app3CargoDriverProfileSection = { sectionId: "app3-cargo-driver-profile", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app3-social-responsibility.ts"), 'export const app3SocialResponsibilitySection = { sectionId: "app3-social-responsibility", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app3-driving-factors.ts"), 'export const app3DrivingFactorsSection = { sectionId: "app3-driving-factors", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app3-safe-driving.ts"), 'export const app3SafeDrivingSection = { sectionId: "app3-safe-driving", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app3-safety-elements.ts"), 'export const app3SafetyElementsSection = { sectionId: "app3-safety-elements", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app3-highways.ts"), 'export const app3HighwaysSection = { sectionId: "app3-highways", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app4-signs-regulatory.ts"), 'export const app4SignsRegulatorySection = { sectionId: "app4-signs-regulatory", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app4-signs-warning.ts"), 'export const app4SignsWarningSection = { sectionId: "app4-signs-warning", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app4-signs-informational.ts"), 'export const app4SignsInformationalSection = { sectionId: "app4-signs-informational", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app4-signs-temporary.ts"), 'export const app4SignsTemporarySection = { sectionId: "app4-signs-temporary", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app4-signs-horizontal.ts"), 'export const app4SignsHorizontalSection = { sectionId: "app4-signs-horizontal", blocks: [] };\n');
  writeTempFile(join(moduleRoot, "app4-signs-traffic-lights.ts"), 'export const app4SignsTrafficLightsSection = { sectionId: "app4-signs-traffic-lights", blocks: [] };\n');
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
      russianOverlayStrategy: "selectable-dom",
      overlayTextSelectability: "selectable-dom-text",
      russianOverlayLabels: [
        {
          id: "fixture-russian-label",
          textRu: "Русская подпись",
          xPct: 10,
          yPct: 12,
          widthPct: 40,
          heightPct: 12
        }
      ]
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

test("Front matter, Chapter 1, 2, 3, 4, 5, Appendix I, Appendix II, Appendix III, and Appendix IV registry contains source Índice sections and skipped divider metadata", () => {
  assert.equal(existsSync(oldPageRegistryPath), false, "page-based Chapter 1/2 registry was removed");
  assert.equal(registry.schemaVersion, 2);
  assert.equal(registry.manualId, "gcba-manual-vehiculo-4-ruedas-2023");
  assert.equal(registry.featureId, "031-manual-document-completion");
  assert.deepEqual(registry.sourcePageRange, { start: 1, end: 200 });
  assert.equal(Object.hasOwn(registry, "pages"), false, "registry must not expose raw PDF page entries");
  assert.deepEqual(registry.skippedSourcePages.map((entry) => entry.sourcePage), [1, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 43, 56, 57, 89, 98, 104, 152, 184]);
  assert.deepEqual(registry.skippedSourcePages.map((entry) => entry.reason), [
    "front-title-navigation-only",
    "front-index-navigation-only",
    "front-index-navigation-only",
    "introduction-owned-by-existing-runtime",
    "introduction-owned-by-existing-runtime",
    "introduction-owned-by-existing-runtime",
    "introduction-owned-by-existing-runtime",
    "introduction-owned-by-existing-runtime",
    "introduction-owned-by-existing-runtime",
    "introduction-owned-by-existing-runtime",
    "chapter-divider-only",
    "chapter-divider-only",
    "chapter-closing-slogan-only",
    "chapter-divider-only",
    "chapter-divider-only",
    "chapter-divider-only",
    "chapter-divider-only",
    "chapter-divider-only",
    "chapter-divider-only"
  ]);

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
    assert.equal(sourcePages.includes(1), false, `${section.id} does not include title-only front-matter page 1`);
    assert.equal(sourcePages.includes(12), false, `${section.id} does not include source-index page 12`);
    assert.equal(sourcePages.includes(13), false, `${section.id} does not include source-index page 13`);
    assert.equal(sourcePages.includes(21), false, `${section.id} does not include divider page 21`);
    assert.equal(sourcePages.includes(43), false, `${section.id} does not include divider page 43`);
    assert.equal(sourcePages.includes(56), false, `${section.id} does not include page 56 closing slogan as section content`);
    assert.equal(sourcePages.includes(57), false, `${section.id} does not include divider page 57`);
    assert.equal(sourcePages.includes(89), false, `${section.id} does not include divider page 89`);
    assert.equal(sourcePages.includes(98), false, `${section.id} does not include divider page 98`);
    assert.equal(sourcePages.includes(104), false, `${section.id} does not include Appendix I divider page 104`);
    assert.equal(sourcePages.includes(152), false, `${section.id} does not include Appendix III divider page 152`);
    assert.equal(sourcePages.includes(184), false, `${section.id} does not include Appendix IV divider page 184`);
    if (section.id === "app2-social-responsibility") {
      assert.equal(sourcePages.includes(123), true, "app2-social-responsibility owns Appendix II page 123 content");
    } else {
      assert.equal(sourcePages.includes(123), false, `${section.id} does not include Appendix II page 123 content`);
    }
    if (Object.hasOwn(section, "topicNavigationStartPage")) {
      assert.ok(
        section.topicNavigationStartPage >= section.sourcePageRange.start && section.topicNavigationStartPage <= section.sourcePageRange.end,
        `${section.id} topic navigation start override stays inside its source range`
      );
    }

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

test("Front matter, Chapter 1, 2, 3, 4, 5, Appendix I, Appendix II, Appendix III, and Appendix IV hierarchy references source Índice sections, not raw PDF pages", () => {
  assert.equal(registry.chapters.length, 10);
  assert.deepEqual(
    registry.chapters.map((chapter) => chapter.id),
    [
      "front-matter",
      "chapter-1-sustainable-mobility",
      "chapter-2-responsibility",
      "chapter-3-driving-rules",
      "chapter-4-natural-capacity",
      "chapter-5-driving-behavior",
      "appendix-1-private-cars",
      "appendix-2-passenger-transport",
      "appendix-3-cargo",
      "appendix-4-road-signs"
    ]
  );
  assert.deepEqual(registry.chapters[0].sectionIds, [
    "front-presentation",
    "front-categories",
    "front-glossary"
  ]);
  assert.equal(registry.chapters[0].status, "active", "Front matter is active after learner-useful support sections are implemented");
  assert.deepEqual(registry.chapters[1].sectionIds, [
    "ch1-cities-for-people",
    "ch1-sustainable-mobility",
    "ch1-pedestrian-priority",
    "ch1-bicycle",
    "ch1-public-transport-system",
    "ch1-shared-trip"
  ]);
  assert.equal(registry.chapters[1].status, "active", "Chapter 1 is active after every Chapter 1 section is implemented");
  assert.deepEqual(registry.chapters[2].sectionIds, [
    "ch2-legal-responsibility",
    "ch2-required-documents",
    "ch2-incident-obligations",
    "ch2-scoring"
  ]);
  assert.equal(registry.chapters[2].status, "active", "Chapter 2 is active after every Chapter 2 section is implemented");
  assert.deepEqual(registry.chapters[3].sectionIds, [
    "ch3-priority-of-rules",
    "ch3-right-of-way",
    "ch3-lights",
    "ch3-speed",
    "ch3-turns",
    "ch3-overtaking",
    "ch3-highways",
    "ch3-adverse-conditions",
    "ch3-stopping-parking"
  ]);
  assert.equal(registry.chapters[3].status, "active", "Chapter 3 is active after every Chapter 3 section is implemented");
  assert.deepEqual(registry.chapters[4].sectionIds, [
    "ch4-alcohol-drugs",
    "ch4-sleep-fatigue",
    "ch4-stress",
    "ch4-distractions"
  ]);
  assert.equal(registry.chapters[4].status, "active", "Chapter 4 is active after every Chapter 4 section is implemented");
  assert.deepEqual(registry.chapters[5].sectionIds, [
    "ch5-attitude-types",
    "ch5-equal-society",
    "ch5-gender-violence-prevention",
    "ch5-anticipatory-efficient-driving"
  ]);
  assert.equal(registry.chapters[5].status, "active", "Chapter 5 is active after every Chapter 5 section is implemented");
  assert.deepEqual(registry.chapters[6].sectionIds, [
    "app1-safety-elements",
    "app1-other-required-safety-elements",
    "app1-recommended-safety-elements"
  ]);
  assert.equal(registry.chapters[6].status, "active", "Appendix I is active after every Appendix I section is implemented");
  assert.deepEqual(registry.chapters[7].sectionIds, [
    "app2-social-responsibility",
    "app2-safety-elements",
    "app2-driving-factors",
    "app2-safe-driving",
    "app2-highways-hospitals"
  ]);
  assert.equal(registry.chapters[7].status, "active", "Appendix II is active after every Appendix II section is implemented");
  assert.deepEqual(registry.chapters[8].sectionIds, [
    "app3-cargo-driver-profile",
    "app3-social-responsibility",
    "app3-driving-factors",
    "app3-safe-driving",
    "app3-safety-elements",
    "app3-highways"
  ]);
  assert.equal(registry.chapters[8].status, "active", "Appendix III is active after every Appendix III section is implemented");
  assert.deepEqual(registry.chapters[9].sectionIds, [
    "app4-signs-regulatory",
    "app4-signs-warning",
    "app4-signs-informational",
    "app4-signs-temporary",
    "app4-signs-horizontal",
    "app4-signs-traffic-lights"
  ]);
  assert.equal(registry.chapters[9].status, "active", "Appendix IV is active after every Appendix IV section is implemented");

  const sectionStatusById = new Map(registry.sections.map((section) => [section.id, section.status]));
  assert.ok(registry.chapters[0].sectionIds.every((sectionId) => sectionStatusById.get(sectionId) === "implemented"), "all front-matter support child sections are implemented");
  assert.ok(registry.chapters[1].sectionIds.every((sectionId) => sectionStatusById.get(sectionId) === "implemented"), "all Chapter 1 child sections are implemented");
  assert.ok(registry.chapters[2].sectionIds.every((sectionId) => sectionStatusById.get(sectionId) === "implemented"), "all Chapter 2 child sections are implemented");
  assert.ok(registry.chapters[3].sectionIds.every((sectionId) => sectionStatusById.get(sectionId) === "implemented"), "all Chapter 3 child sections are implemented");
  assert.ok(registry.chapters[4].sectionIds.every((sectionId) => sectionStatusById.get(sectionId) === "implemented"), "all Chapter 4 child sections are implemented");
  assert.ok(registry.chapters[5].sectionIds.every((sectionId) => sectionStatusById.get(sectionId) === "implemented"), "all Chapter 5 child sections are implemented");
  assert.ok(registry.chapters[6].sectionIds.every((sectionId) => sectionStatusById.get(sectionId) === "implemented"), "all Appendix I child sections are implemented");
  assert.ok(registry.chapters[7].sectionIds.every((sectionId) => sectionStatusById.get(sectionId) === "implemented"), "all Appendix II child sections are implemented");
  assert.ok(registry.chapters[8].sectionIds.every((sectionId) => sectionStatusById.get(sectionId) === "implemented"), "all Appendix III child sections are implemented");
  assert.ok(registry.chapters[9].sectionIds.every((sectionId) => sectionStatusById.get(sectionId) === "implemented"), "all Appendix IV child sections are implemented");

  for (const chapter of registry.chapters) {
    assert.equal(Object.hasOwn(chapter, "chapterPageIds"), false, `${chapter.id} skips divider-only page ids`);
    assert.equal(Object.hasOwn(chapter, "topics"), false, `${chapter.id} no longer stores page-based topic records`);
  }

  const topicSourceTitles = new Map(registry.sections.map((section) => [section.id, section.sourceTitleEs]));
  assert.equal(topicSourceTitles.get("front-presentation"), "Presentación");
  assert.equal(topicSourceTitles.get("front-categories"), "Material por categorías");
  assert.equal(topicSourceTitles.get("front-glossary"), "Glosario");
  const inPageLegalHeading = ["Responsabilidad", "jurídica"].join(" ");
  assert.equal(topicSourceTitles.get("ch2-legal-responsibility"), "Responsabilidades legales");
  assert.equal(topicSourceTitles.get("app1-recommended-safety-elements"), "Elementos de seguridad recomendables");
  assert.equal(topicSourceTitles.get("app2-driving-factors"), "Factores que intervienen en la conduccion");
  assert.equal(topicSourceTitles.get("app2-safe-driving"), "Conduccion segura");
  assert.equal([...topicSourceTitles.values()].includes("Presentacion"), false);
  assert.equal([...topicSourceTitles.values()].includes("Material por categorias"), false);
  assert.equal([...topicSourceTitles.values()].includes("Elementos de seguridad recomendados"), false);
  assert.equal([...topicSourceTitles.values()].includes(inPageLegalHeading), false);

  const coveredSourcePages = registry.sections.flatMap((section) => section.sourcePages.map((entry) => entry.sourcePage));
  assert.deepEqual(
    uniqueInOrder(coveredSourcePages),
    sourcePagesForRange(2, 11).concat(
      sourcePagesForRange(22, 42),
      sourcePagesForRange(44, 55),
      sourcePagesForRange(58, 88),
      sourcePagesForRange(90, 97),
      sourcePagesForRange(99, 103),
      sourcePagesForRange(105, 122),
      sourcePagesForRange(123, 151),
      sourcePagesForRange(153, 183),
      sourcePagesForRange(185, 200)
    )
  );
  assert.deepEqual(duplicatedValues(coveredSourcePages), [55, 93, 94, 95, 99, 100, 101, 119]);
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
  assert.doesNotMatch(ch2ScoringModuleSource, /page-56-disposition/);
  assert.doesNotMatch(ch2ScoringModuleSource, /Respetar las normas de tránsito implica salvar vidas/u);
  assert.doesNotMatch(ch2ScoringModuleSource, /Соблюдать правила дорожного движения означает спасать жизни/u);

  const closing = registry.skippedSourcePages.find((entry) => entry.sourcePage === 56);
  assert.equal(closing?.reason, "chapter-closing-slogan-only");
  assert.match(closing?.disposition ?? "", /not Scoring content/);

  assert.deepEqual(
    registry.sharedSourcePageOwnership.map((entry) => entry.sourcePage),
    [55, 93, 94, 95, 99, 100, 101, 119],
    "source pages 55, 93, 94, 95, 99, 100, 101, and 119 are intentionally shared between section topics"
  );
  const sharedPage55 = registry.sharedSourcePageOwnership.find((entry) => entry.sourcePage === 55);
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
  assert.match(ch2RequiredDocumentsModuleSource, /60 000 км/u);
  assert.match(ch2RequiredDocumentsModuleSource, /8 лет/u);
  assert.match(ch2RequiredDocumentsModuleSource, /80 000 км/u);
  assert.match(ch2RequiredDocumentsModuleSource, /допуск 4 000 км/u);
  assert.doesNotMatch(ch2RequiredDocumentsModuleSource, /После первого прохождения срок становится ежегодным/u);
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
  assert.doesNotMatch(ch2ScoringModuleSource, /Страница 56 не добавляет правил Scoring/u);
});

test("Chapter 3 sections retain priority, speed, adverse-condition, and parking details", () => {
  for (const sectionId of [
    "ch3-priority-of-rules",
    "ch3-right-of-way",
    "ch3-lights",
    "ch3-speed",
    "ch3-turns",
    "ch3-overtaking",
    "ch3-highways",
    "ch3-adverse-conditions",
    "ch3-stopping-parking"
  ]) {
    const section = registry.sections.find((entry) => entry.id === sectionId);
    assert.equal(section.status, "implemented", `${sectionId} is implemented in the Chapter 3 PR`);
    assert.equal(section.implementationEvidence.visualEvidenceSchemaVersion, 3, `${sectionId} uses strict visual evidence`);
    assert.equal(section.implementationEvidence.visualRulePolicyId, "031-strict-source-fidelity");
    assert.equal(section.implementationEvidence.highResolutionEvidenceStatus, "x5-or-equivalent-no-upscale-recorded");
    assert.equal(section.implementationEvidence.localAssetMetadata[0].assetCategory, "native-dom-text-only");
  }

  assert.match(ch3PriorityModuleSource, /Сигналы и распоряжения контролирующего органа/u);
  assert.match(ch3PriorityModuleSource, /Временная сигнализация/u);
  assert.match(ch3PriorityModuleSource, /светофор/ui);
  assert.match(ch3PriorityModuleSource, /Закон 2148/u);
  assert.match(ch3PriorityModuleSource, /экстренных служб/u);

  assert.match(ch3RightOfWayModuleSource, /Мигающий красный/u);
  assert.match(ch3RightOfWayModuleSource, /Pare/u);
  assert.match(ch3RightOfWayModuleSource, /Ceda el Paso/u);
  assert.match(ch3RightOfWayModuleSource, /rotonda|круговом движении/u);
  assert.match(ch3RightOfWayModuleSource, /avenida выше calle/u);

  assert.match(ch3LightsModuleSource, /Запрещено менять тип и мощность заводских огней/u);
  assert.match(ch3LightsModuleSource, /противотуманные/ui);
  assert.match(ch3LightsModuleSource, /звуковая сигнализация/u);

  assert.match(ch3SpeedModuleSource, /эффекта туннеля/u);
  assert.match(ch3SpeedModuleSource, /примерно 1 секунда/u);
  assert.match(ch3SpeedModuleSource, /минимум 2 секунды/u);
  assert.match(ch3SpeedModuleSource, /kind:\s*"table"/);
  assert.match(ch3SpeedModuleSource, /Pasajes y calles de convivencia[\s\S]*20 км\/ч/u);
  assert.match(ch3SpeedModuleSource, /Calles[\s\S]*40 км\/ч/u);
  assert.match(ch3SpeedModuleSource, /Avenidas[\s\S]*60 км\/ч/u);
  assert.match(ch3SpeedModuleSource, /Autopistas CABA[\s\S]*100 км\/ч/u);
  assert.match(ch3SpeedModuleSource, /Исключения в некоторых avenidas/u);
  assert.match(ch3SpeedModuleSource, /40 км\/ч[\s\S]*Av\. Corrientes[\s\S]*Junín y Libertad/u);
  assert.match(ch3SpeedModuleSource, /60 км\/ч[\s\S]*Av\. Gral\. Paz[\s\S]*calzadas para tránsito pesado[\s\S]*Autopista Ingeniero Pascual Palazzo[\s\S]*Av\. del Libertador/u);
  assert.match(ch3SpeedModuleSource, /Av\. Figueroa Alcorta/u);
  assert.match(ch3SpeedModuleSource, /Av\. Del Libertador/u);
  assert.match(ch3SpeedModuleSource, /Av\. 27 de Febrero/u);
  assert.match(ch3SpeedModuleSource, /Av\. Costanera Rafael Obligado/u);
  assert.match(ch3SpeedModuleSource, /80 км\/ч[\s\S]*Av\. Gral\. Paz[\s\S]*Autopista Ingeniero Pascual Palazzo[\s\S]*Av\. 27 de Febrero/u);
  assert.match(ch3SpeedModuleSource, /Av\. Intendente Cantilo/u);
  assert.match(ch3SpeedModuleSource, /Av\. Leopoldo Lugones/u);
  assert.match(ch3SpeedModuleSource, /Av\. Tte\. Gral\. Luis J\. Dellepiane/u);
  assert.match(ch3SpeedModuleSource, /100 км\/ч[\s\S]*Av\. Gral\. Paz en calzadas centrales[\s\S]*Av\. Leopoldo Lugones[\s\S]*Autopista Ingeniero Pascual Palazzo/u);
  assert.match(ch3SpeedModuleSource, /Autopista Presidente Arturo U\. Illia/u);
  assert.match(ch3SpeedModuleSource, /Maquinaria especial[\s\S]*Calles y avenidas[\s\S]*30 км\/ч/u);
  assert.match(ch3SpeedModuleSource, /Camiones[\s\S]*transporte colectivo de pasajeros\/as[\s\S]*Calles[\s\S]*40 км\/ч/u);
  assert.match(ch3SpeedModuleSource, /Escolares y movilidad reducida[\s\S]*Avenidas[\s\S]*45 км\/ч/u);
  assert.match(ch3SpeedModuleSource, /Camiones y transporte colectivo de pasajeros\/as[\s\S]*Avenidas[\s\S]*50 км\/ч/u);
  assert.match(ch3SpeedModuleSource, /Autopistas y otras vias rapidas en CABA[\s\S]*60 км\/ч/u);
  assert.match(ch3SpeedModuleSource, /Paseo del Bajo[\s\S]*60 км\/ч/u);
  assert.match(ch3SpeedModuleSource, /Todos los vehiculos[\s\S]*60 км\/ч/u);
  assert.match(ch3SpeedModuleSource, /cellsRu:\s*\[\s*"Camiones, transporte de sustancias peligrosas, automotores con casa rodante",\s*"80 км\/ч",\s*"rutas, semiautopistas y autopistas nacionales"\s*\]/u);
  assert.match(ch3SpeedModuleSource, /cellsRu:\s*\[\s*"Microbuses, omnibus y casas rodantes motorizadas",\s*"90 км\/ч",\s*"rutas y semiautopistas"\s*\]/u);
  assert.match(ch3SpeedModuleSource, /cellsRu:\s*\[\s*"Microbuses, omnibus y casas rodantes motorizadas",\s*"100 км\/ч",\s*"autopistas nacionales"\s*\]/u);
  assert.match(ch3SpeedModuleSource, /cellsRu:\s*\["Motocicletas y automoviles",\s*"110 км\/ч",\s*"ruta"\]/u);
  assert.match(ch3SpeedModuleSource, /cellsRu:\s*\[\s*"Camionetas",\s*"110 км\/ч",\s*"rutas, semiautopistas y autopistas nacionales"\s*\]/u);
  assert.match(ch3SpeedModuleSource, /cellsRu:\s*\["Motocicletas y automoviles",\s*"120 км\/ч",\s*"semiautopistas"\]/u);
  assert.match(ch3SpeedModuleSource, /cellsRu:\s*\["Motocicletas y automoviles",\s*"130 км\/ч",\s*"autopistas nacionales"\]/u);
  assert.doesNotMatch(ch3SpeedModuleSource, /Camionetas, casas rodantes motorizadas, motocicletas/u);
  assert.doesNotMatch(ch3SpeedModuleSource, /Camiones, casas rodantes motorizadas, motocicletas/u);
  assert.doesNotMatch(ch3SpeedModuleSource, /Camionetas y transporte de pasajeros\/as/u);
  assert.match(ch3SpeedModuleSource, /половина соответствующих максимальных лимитов/u);
  assert.match(ch3SpeedModuleSource, /semiautopistas y rutas - 40 км\/ч/u);
  assert.match(ch3SpeedModuleSource, /autopistas - 60 км\/ч/u);
  assert.doesNotMatch(ch3SpeedModuleSource, /На отдельных avenidas источник показывает исключения/u);
  assert.doesNotMatch(ch3SpeedModuleSource, /Для некоторых видов транспорта и участков источник показывает дополнительные специальные пределы/u);

  assert.match(ch3TurnsModuleSource, /за 30 м/u);
  assert.match(ch3OvertakingModuleSource, /Adelantamiento/u);
  assert.match(ch3OvertakingModuleSource, /Sobrepaso/u);
  assert.match(ch3OvertakingModuleSource, /Ley 24449/u);
  assert.match(ch3HighwaysModuleSource, /carriles de aceleración/u);
  assert.match(ch3HighwaysModuleSource, /espejos retrovisores/u);
  assert.match(ch3HighwaysModuleSource, /luz de giro izquierda/u);
  assert.match(ch3HighwaysModuleSource, /espacio \/ gap/u);
  assert.match(ch3HighwaysModuleSource, /velocidad adecuada del tramo/u);
  assert.match(ch3HighwaysModuleSource, /Carril izquierdo o de sobrepaso/u);
  assert.match(ch3HighwaysModuleSource, /Carril derecho/u);
  assert.match(ch3HighwaysModuleSource, /транспортные средства более 3500 кг/u);
  assert.match(ch3HighwaysModuleSource, /Banquina не является полосой обычного движения, остановки или стоянки/u);
  assert.match(ch3HighwaysModuleSource, /carril de desaceleración/u);
  assert.match(ch3HighwaysModuleSource, /circular marcha atrás/u);
  assert.match(ch3HighwaysModuleSource, /следующего разрешенного выхода/u);
  assert.match(ch3HighwaysModuleSource, /señales viales/u);
  assert.match(ch3HighwaysModuleSource, /vehículo inmovilizado/u);
  assert.match(ch3HighwaysModuleSource, /balizas\/intermitentes/u);
  assert.match(ch3HighwaysModuleSource, /auxilio\/asistencia/u);
  assert.match(ch3HighwaysModuleSource, /postes de auxilio/u);
  assert.match(ch3HighwaysModuleSource, /auxilio vial/u);
  assert.match(ch3HighwaysModuleSource, /vehículo destinado a ese fin/u);
  assert.match(ch3HighwaysModuleSource, /abandonar la autopista en la primera salida posible/u);
  assert.doesNotMatch(ch3HighwaysModuleSource, /Практика движения на скоростных дорогах/u);

  assert.match(ch3AdverseModuleSource, /aquaplaning/u);
  assert.match(ch3AdverseModuleSource, /50 градусов примерно за 10 минут/u);
  assert.match(ch3AdverseModuleSource, /снег не характерен для CABA/u);

  assert.match(ch3StoppingParkingModuleSource, /не более 2 минут/u);
  assert.match(ch3StoppingParkingModuleSource, /Av\. Cantilo/u);
  assert.match(ch3StoppingParkingModuleSource, /5 м/u);
  assert.match(ch3StoppingParkingModuleSource, /4,5 м/u);
  assert.match(ch3StoppingParkingModuleSource, /Macrocentro/u);
  assert.match(ch3StoppingParkingModuleSource, /50 м/u);
  assert.match(ch3StoppingParkingModuleSource, /Cajones azules/u);
  assert.match(ch3StoppingParkingModuleSource, /30 минут/u);
  assert.match(ch3StoppingParkingModuleSource, /Símbolo Internacional de Acceso/u);
});

test("Chapter 4 divider, page 93 alcohol/sleep split, page 94 stress boundary, and page 95 direct distractions boundary are explicit", () => {
  const divider = registry.skippedSourcePages.find((entry) => entry.sourcePage === 89);
  assert.equal(divider?.reason, "chapter-divider-only");
  assert.match(divider?.disposition ?? "", /navigation only/);

  const alcoholDrugs = registry.sections.find((section) => section.id === "ch4-alcohol-drugs");
  const sleepFatigue = registry.sections.find((section) => section.id === "ch4-sleep-fatigue");
  const stress = registry.sections.find((section) => section.id === "ch4-stress");
  const distractions = registry.sections.find((section) => section.id === "ch4-distractions");
  assert.ok(alcoholDrugs, "alcohol/drugs section exists");
  assert.ok(sleepFatigue, "sleep/fatigue section exists");
  assert.ok(stress, "stress section exists");
  assert.ok(distractions, "distractions section exists");

  assert.deepEqual(alcoholDrugs.sourcePageRange, { start: 90, end: 93 });
  assert.deepEqual(sleepFatigue.sourcePageRange, { start: 93, end: 94 });
  assert.deepEqual(stress.sourcePageRange, { start: 94, end: 95 });
  assert.deepEqual(distractions.sourcePageRange, { start: 95, end: 97 });
  assert.equal(stress.routeHash, "#manual-section-ch4-stress");
  assert.equal(distractions.routeHash, "#manual-section-ch4-distractions");
  assert.equal(stress.sourcePages[0].sourcePage, 94, "direct stress navigation opens at source page 94");
  assert.equal(distractions.sourcePages[0].sourcePage, 95, "direct distractions navigation opens at source page 95");

  assert.deepEqual(
    registry.sharedSourcePageOwnership.map((entry) => entry.sourcePage),
    [55, 93, 94, 95, 99, 100, 101, 119]
  );
  const sharedPage93 = registry.sharedSourcePageOwnership.find((entry) => entry.sourcePage === 93);
  const sharedPage94 = registry.sharedSourcePageOwnership.find((entry) => entry.sourcePage === 94);
  const sharedPage95 = registry.sharedSourcePageOwnership.find((entry) => entry.sourcePage === 95);
  assert.deepEqual(sharedPage93.sectionBoundaries.map((boundary) => boundary.sectionId), ["ch4-alcohol-drugs", "ch4-sleep-fatigue"]);
  assert.deepEqual(sharedPage94.sectionBoundaries.map((boundary) => boundary.sectionId), ["ch4-sleep-fatigue", "ch4-stress"]);
  assert.deepEqual(sharedPage95.sectionBoundaries.map((boundary) => boundary.sectionId), ["ch4-stress", "ch4-distractions"]);

  const alcoholPage93Boundary = sourceBoundaryEvidenceFor(alcoholDrugs, 93);
  const sleepPage93Boundary = sourceBoundaryEvidenceFor(sleepFatigue, 93);
  const sleepBoundary = sourceBoundaryEvidenceFor(sleepFatigue, 94);
  const stressPage94Boundary = sourceBoundaryEvidenceFor(stress, 94);
  const stressPage95Boundary = sourceBoundaryEvidenceFor(stress, 95);
  const distractionsBoundary = sourceBoundaryEvidenceFor(distractions, 95);
  assert.equal(alcoholPage93Boundary.ownedRegion, "responsible-driver-and-alcoholemia-toxicology-hangover");
  assert.equal(alcoholPage93Boundary.ownedLayoutBlockIdsOnSharedPage.includes("page-093-source-line-mask-03"), true);
  assert.equal(alcoholPage93Boundary.ownedLayoutBlockIdsOnSharedPage.includes("page-093-source-line-mask-16"), true);
  assert.equal(alcoholPage93Boundary.ownedLayoutBlockIdsOnSharedPage.includes("page-093-source-line-mask-23"), true);
  assert.equal(sleepPage93Boundary.startsAtLayoutBlockId, "page-093-source-line-mask-02");
  assert.match(sleepPage93Boundary.startsAtSourceTextEs, /Sueño y fatiga/u);
  assert.equal(sleepPage93Boundary.ownedLayoutBlockIdsOnSharedPage.includes("page-093-source-line-mask-10"), true);
  assert.equal(sleepPage93Boundary.ownedLayoutBlockIdsOnSharedPage.includes("page-093-source-line-mask-24"), true);
  assert.equal(sleepBoundary.endsBeforeLayoutBlockId, "page-094-source-line-mask-31");
  assert.equal(stressPage94Boundary.startsAtLayoutBlockId, "page-094-source-line-mask-31");
  assert.match(stressPage94Boundary.startsAtSourceTextEs, /Estrés/u);
  assert.equal(stressPage95Boundary.startsAtLayoutBlockId, "page-095-source-line-mask-08");
  assert.match(stressPage95Boundary.startsAtSourceTextEs, /Prestar atención al contexto/u);
  assert.equal(distractionsBoundary.startsAtLayoutBlockId, "page-095-source-line-mask-02");
  assert.match(distractionsBoundary.startsAtSourceTextEs, /Distracciones/u);
  assert.equal(stressPage95Boundary.ownedLayoutBlockIdsOnSharedPage.includes("page-095-source-line-mask-14"), true);
  assert.equal(distractionsBoundary.ownedLayoutBlockIdsOnSharedPage.includes("page-095-source-line-mask-15"), true);
});

test("Chapter 5 divider and page 99, 100, and 101 source-topic boundaries are explicit", () => {
  const divider = registry.skippedSourcePages.find((entry) => entry.sourcePage === 98);
  assert.equal(divider?.reason, "chapter-divider-only");
  assert.match(divider?.sourceTitleEs ?? "", /ACTITUD AL CONDUCIR/u);
  assert.match(divider?.disposition ?? "", /navigation only/);

  const attitudeTypes = registry.sections.find((section) => section.id === "ch5-attitude-types");
  const equalSociety = registry.sections.find((section) => section.id === "ch5-equal-society");
  const genderViolence = registry.sections.find((section) => section.id === "ch5-gender-violence-prevention");
  const anticipatoryEfficient = registry.sections.find((section) => section.id === "ch5-anticipatory-efficient-driving");
  assert.ok(attitudeTypes, "attitude types section exists");
  assert.ok(equalSociety, "equal society section exists");
  assert.ok(genderViolence, "gender violence support section exists");
  assert.ok(anticipatoryEfficient, "anticipatory efficient driving section exists");

  assert.deepEqual(attitudeTypes.sourcePageRange, { start: 99, end: 99 });
  assert.deepEqual(equalSociety.sourcePageRange, { start: 99, end: 100 });
  assert.deepEqual(genderViolence.sourcePageRange, { start: 100, end: 101 });
  assert.deepEqual(anticipatoryEfficient.sourcePageRange, { start: 101, end: 103 });
  assert.equal(equalSociety.routeHash, "#manual-section-ch5-equal-society");
  assert.equal(genderViolence.routeHash, "#manual-section-ch5-gender-violence-prevention");
  assert.equal(anticipatoryEfficient.routeHash, "#manual-section-ch5-anticipatory-efficient-driving");

  const sharedPage99 = registry.sharedSourcePageOwnership.find((entry) => entry.sourcePage === 99);
  const sharedPage100 = registry.sharedSourcePageOwnership.find((entry) => entry.sourcePage === 100);
  const sharedPage101 = registry.sharedSourcePageOwnership.find((entry) => entry.sourcePage === 101);
  assert.deepEqual(sharedPage99.sectionBoundaries.map((boundary) => boundary.sectionId), ["ch5-attitude-types", "ch5-equal-society"]);
  assert.deepEqual(sharedPage100.sectionBoundaries.map((boundary) => boundary.sectionId), ["ch5-equal-society", "ch5-gender-violence-prevention"]);
  assert.deepEqual(sharedPage101.sectionBoundaries.map((boundary) => boundary.sectionId), ["ch5-gender-violence-prevention", "ch5-anticipatory-efficient-driving"]);

  const attitudePage99Boundary = sourceBoundaryEvidenceFor(attitudeTypes, 99);
  const equalityPage99Boundary = sourceBoundaryEvidenceFor(equalSociety, 99);
  const equalityPage100Boundary = sourceBoundaryEvidenceFor(equalSociety, 100);
  const genderPage100Boundary = sourceBoundaryEvidenceFor(genderViolence, 100);
  const genderPage101Boundary = sourceBoundaryEvidenceFor(genderViolence, 101);
  const anticipatoryPage101Boundary = sourceBoundaryEvidenceFor(anticipatoryEfficient, 101);
  assert.equal(attitudePage99Boundary.endsBeforeLayoutBlockId, "page-099-source-line-mask-17");
  assert.equal(attitudePage99Boundary.ownedLayoutBlockIdsOnSharedPage.includes("page-099-source-line-mask-29"), true);
  assert.equal(equalityPage99Boundary.startsAtLayoutBlockId, "page-099-source-line-mask-17");
  assert.match(equalityPage99Boundary.startsAtSourceTextEs, /Hacia una sociedad igualitaria/u);
  assert.equal(equalityPage100Boundary.endsBeforeLayoutBlockId, "page-100-source-line-mask-19");
  assert.equal(equalityPage100Boundary.ownedLayoutBlockIdsOnSharedPage.includes("page-100-source-line-mask-17"), true);
  assert.equal(genderPage100Boundary.startsAtLayoutBlockId, "page-100-source-line-mask-19");
  assert.match(genderPage100Boundary.startsAtSourceTextEs, /Prevenci[oó]n y asistencia/u);
  assert.equal(genderPage101Boundary.endsBeforeLayoutBlockId, undefined);
  assert.equal(genderPage101Boundary.ownedLayoutBlockIdsOnSharedPage.includes("page-101-source-line-mask-11"), true);
  assert.equal(genderPage101Boundary.ownedLayoutBlockIdsOnSharedPage.includes("page-101-source-line-mask-24"), true);
  assert.equal(genderPage101Boundary.ownedLayoutBlockIdsOnSharedPage.includes("page-101-source-line-mask-25"), true);
  assert.match(genderPage101Boundary.boundaryEvidence, /continues the gender-violence support[\s\S]*masks 11-25/u);
  assert.equal(genderPage101Boundary.excludesSectionId, "ch5-anticipatory-efficient-driving");
  assert.equal(anticipatoryPage101Boundary.startsAtLayoutBlockId, "page-101-source-line-mask-09");
  assert.match(anticipatoryPage101Boundary.startsAtSourceTextEs, /Conducci[oó]n preventiva y eficiente/u);
  assert.equal(anticipatoryPage101Boundary.ownedLayoutBlockIdsOnSharedPage.includes("page-101-source-line-mask-34"), true);
});

test("Chapter 4 sections retain alcohol, sleep, stress, and distraction details", () => {
  for (const sectionId of ["ch4-alcohol-drugs", "ch4-sleep-fatigue", "ch4-stress", "ch4-distractions"]) {
    const section = registry.sections.find((entry) => entry.id === sectionId);
    assert.equal(section.status, "implemented", `${sectionId} is implemented in the Chapter 4 PR`);
    assert.equal(section.implementationEvidence.visualEvidenceSchemaVersion, 3, `${sectionId} uses strict visual evidence`);
    assert.equal(section.implementationEvidence.visualRulePolicyId, "031-strict-source-fidelity");
    assert.equal(section.implementationEvidence.highResolutionEvidenceStatus, "x5-or-equivalent-no-upscale-recorded");
    assert.equal(section.implementationEvidence.localAssetMetadata[0].assetCategory, "native-dom-text-only");
  }

  assert.match(ch4AlcoholDrugsModuleSource, /центральной нервной системы/u);
  assert.match(ch4AlcoholDrugsModuleSource, /психофизическим examen psicofísico/u);
  assert.match(ch4AlcoholDrugsModuleSource, /Sueño y fatiga|Сонливость и усталость/u);
  assert.match(ch4AlcoholDrugsModuleSource, /medicamentos/u);
  assert.match(ch4AlcoholDrugsModuleSource, /седативным эффектом[\s\S]*sedantes/u);
  assert.match(ch4AlcoholDrugsModuleSource, /контакте со слюной/u);
  const alcoholImpairingFactorsItemsRu = itemsRuSourceForBlock(ch4AlcoholDrugsModuleSource, "factors-that-impair-driving");
  assert.match(alcoholImpairingFactorsItemsRu, /Употребление алкоголя и наркотиков/u);
  assert.match(alcoholImpairingFactorsItemsRu, /Сонливость и усталость/u);
  assert.doesNotMatch(alcoholImpairingFactorsItemsRu, /^\s*"Ingesta de alcohol y drogas|^\s*"Sueño y fatiga|^\s*"Estrés|^\s*"Distracciones/um);
  const medicationsItemsRu = itemsRuSourceForBlock(ch4AlcoholDrugsModuleSource, "medications-and-sedatives");
  assert.match(medicationsItemsRu, /листок-вкладыш[\s\S]*prospecto explicativo/u);
  assert.match(medicationsItemsRu, /наркотические вещества[\s\S]*estupefacientes/u);
  assert.doesNotMatch(medicationsItemsRu, /читать prospecto explicativo|проверке на estupefacientes/u);
  const alcoholEffectsItemsRu = itemsRuSourceForBlock(ch4AlcoholDrugsModuleSource, "alcohol-effects");
  assert.match(alcoholEffectsItemsRu, /скорость реакции/u);
  assert.match(alcoholEffectsItemsRu, /периферическое зрение/u);
  assert.match(alcoholEffectsItemsRu, /устойчивость к ослеплению/u);
  assert.match(alcoholEffectsItemsRu, /зрительно-двигательную/u);
  assert.match(alcoholEffectsItemsRu, /связность мышления/u);
  assert.doesNotMatch(
    alcoholEffectsItemsRu,
    /capacidad de reacción|visión periférica|resistencia al deslumbramiento|viso-motor coordination|motor coordination|asociación de ideas|exceso de confianza en uno mismo|inhibition|somnolencia/u
  );
  assert.match(ch4AlcoholDrugsModuleSource, /Ley 2148/u);
  assert.match(ch4AlcoholDrugsModuleSource, /0,5 gramos/u);
  assert.match(ch4AlcoholDrugsModuleSource, /Principiantes[\s\S]*0\.00 g\/l/u);
  assert.match(ch4AlcoholDrugsModuleSource, /Profesionales[\s\S]*0\.00 g\/l/u);
  assert.match(ch4AlcoholDrugsModuleSource, /Motociclistas[\s\S]*0\.20 g\/l/u);
  assert.match(ch4AlcoholDrugsModuleSource, /Acompañantes en motovehículos[\s\S]*0\.50 g\/l/u);
  assert.match(ch4AlcoholDrugsModuleSource, /plaza de acompañante en motovehículos/u);
  assert.match(ch4AlcoholDrugsModuleSource, /это не общий предел для всех сопровождающих в автомобиле/u);
  assert.doesNotMatch(ch4AlcoholDrugsModuleSource, /Acompañantes - сопровождающие/u);
  assert.doesNotMatch(ch4AlcoholDrugsModuleSource, /эта категория из таблицы источника сохраняется отдельно/u);
  assert.match(ch4AlcoholDrugsModuleSource, /Particulares[\s\S]*0\.50 g\/l/u);
  assert.match(ch4AlcoholDrugsModuleSource, /Tipo de bebida|Тип напитка/u);
  assert.match(ch4AlcoholDrugsModuleSource, /Funcionamiento hepático|Работа печени/u);
  assert.match(ch4AlcoholDrugsModuleSource, /Si tomaste alcohol, no manejes|Если пил алкоголь/u);
  const alcoholMetabolismItemsRu = itemsRuSourceForBlock(ch4AlcoholDrugsModuleSource, "metabolism-and-next-day-risk");
  assert.match(alcoholMetabolismItemsRu, /в течение первого часа/u);
  assert.doesNotMatch(alcoholMetabolismItemsRu, /durante la primera hora/u);
  const positiveAndRefusalItemsRu = itemsRuSourceForBlock(ch4AlcoholDrugsModuleSource, "positive-and-refusal-procedure");
  assert.match(positiveAndRefusalItemsRu, /удерживают водительское удостоверение/u);
  assert.doesNotMatch(positiveAndRefusalItemsRu, /contravencional sanction|retenеr la licencia|autoridad de control должна/u);
  assert.match(ch4AlcoholDrugsModuleSource, /remitir el vehículo[\s\S]*(направить|эвакуировать)/u);
  assert.match(ch4AlcoholDrugsModuleSource, /se presume positivo|считается положительным/u);
  assert.doesNotMatch(ch4AlcoholDrugsModuleSource, /removal of vehicle|presumed positive/u);
  assert.match(ch4AlcoholDrugsModuleSource, /id:\s*"responsible-driver"/u);
  assert.match(ch4AlcoholDrugsModuleSource, /conductor\/a responsable|ответственного водителя/u);
  assert.match(ch4AlcoholDrugsModuleSource, /id:\s*"test-instruments-and-hangover"/u);
  assert.match(ch4AlcoholDrugsModuleSource, /сертифицированы и откалиброваны[\s\S]*certificados y calibrados/u);
  assert.doesNotMatch(ch4AlcoholDrugsModuleSource, /должным образом certificados y calibrados/u);
  assert.match(ch4AlcoholDrugsModuleSource, /veisalgia/u);
  assert.match(ch4AlcoholDrugsModuleSource, /обычным русским текстом/u);
  assert.match(ch4AlcoholDrugsModuleSource, /русской текстовой таблице/u);
  assert.doesNotMatch(ch4AlcoholDrugsModuleSource, /selectable DOM text|selectable Russian table/u);

  assert.doesNotMatch(ch4SleepFatigueModuleSource, /id:\s*"responsible-driver"/u);
  assert.doesNotMatch(ch4SleepFatigueModuleSource, /conductor\/a responsable|ответственного водителя/u);
  assert.doesNotMatch(ch4SleepFatigueModuleSource, /id:\s*"test-instruments-and-hangover"/u);
  assert.doesNotMatch(ch4SleepFatigueModuleSource, /certificados y calibrados|сертифицированными и калиброванными/u);
  assert.doesNotMatch(ch4SleepFatigueModuleSource, /veisalgia/u);
  assert.match(ch4SleepFatigueModuleSource, /биологическая потребность/u);
  assert.doesNotMatch(ch4SleepFatigueModuleSource, /biological need/u);
  assert.match(ch4SleepFatigueModuleSource, /время ответа/u);
  const fewHoursSleepItemsRu = itemsRuSourceForBlock(ch4SleepFatigueModuleSource, "few-hours-sleep-effects");
  assert.match(fewHoursSleepItemsRu, /скорость реакции/u);
  assert.match(fewHoursSleepItemsRu, /бдительность/u);
  assert.doesNotMatch(fewHoursSleepItemsRu, /capacidad de reacción|estado de alerta/u);
  assert.match(ch4SleepFatigueModuleSource, /работоспособность/u);
  assert.match(ch4SleepFatigueModuleSource, /усталость может усиливаться/u);
  assert.doesNotMatch(ch4SleepFatigueModuleSource, /снижается rendimiento|cansancio может усиливаться/u);
  assert.match(ch4SleepFatigueModuleSource, /microsueños - микросон/u);
  const fatiguePreventionItemsRu = itemsRuSourceForBlock(ch4SleepFatigueModuleSource, "fatigue-prevention");
  assert.match(fatiguePreventionItemsRu, /примерно 8 часов/u);
  assert.match(fatiguePreventionItemsRu, /каждые 200 км/u);
  assert.match(fatiguePreventionItemsRu, /каждые 2 часа/u);
  assert.match(fatiguePreventionItemsRu, /каждые 100 км/u);
  assert.match(fatiguePreventionItemsRu, /каждый 1 час/u);
  assert.match(fatiguePreventionItemsRu, /хорошую вентиляцию/u);
  assert.match(fatiguePreventionItemsRu, /легкую пищу/u);
  assert.match(fatiguePreventionItemsRu, /в сумерках и на рассвете/u);
  assert.match(fatiguePreventionItemsRu, /профессиональных водителей/u);
  assert.match(fatiguePreventionItemsRu, /новичков[\s\S]*principiantes/u);
  assert.doesNotMatch(
    fatiguePreventionItemsRu,
    /aproximadamente 8 horas|cada 200 kilometros|cada 100 kilómetros|ventilación|comidas ligeras|al anochecer y al amanecer|predisposición a sufrir fatiga/u
  );
  assert.match(ch4SleepFatigueModuleSource, /17 часов/u);
  const sleepVsFatigueRemediesItemsRu = itemsRuSourceForBlock(ch4SleepFatigueModuleSource, "sleep-vs-fatigue-remedies");
  assert.match(sleepVsFatigueRemediesItemsRu, /усталости и недосыпе/u);
  assert.match(sleepVsFatigueRemediesItemsRu, /сонливостью[\s\S]*поспать/u);
  assert.match(sleepVsFatigueRemediesItemsRu, /прервать поездку[\s\S]*остановку для отдыха/u);
  assert.doesNotMatch(
    sleepVsFatigueRemediesItemsRu,
    /fatigue\/cansancio|sueño|dormir|tratar la fatiga|interrumpir el viaje|parada de descanso/u
  );

  assert.match(ch4StressModuleSource, /ВОЗ \(OMS\) определяет/u);
  assert.match(ch4StressModuleSource, /физиологических реакций/u);
  assert.match(ch4StressModuleSource, /двойная связь/u);
  assert.match(ch4StressModuleSource, /безрассудным[\s\S]*temeraria/u);
  assert.match(ch4StressModuleSource, /Prestar atención al contexto|Обращать внимание на дорожный контекст/u);
  assert.match(ch4StressModuleSource, /переживания и споры/u);
  const stressRecommendationsItemsRu = itemsRuSourceForBlock(ch4StressModuleSource, "stress-recommendations");
  assert.match(stressRecommendationsItemsRu, /Планировать поездку/u);
  assert.match(ch4StressModuleSource, /достаточным запасом времени/u);
  assert.match(ch4StressModuleSource, /чрезмерная жара и холод/u);
  assert.match(stressRecommendationsItemsRu, /терпеливое и терпимое отношение[\s\S]*actitud tolerante y paciente/u);
  assert.doesNotMatch(ch4StressModuleSource, /worries and discussions|adopting an/u);
  assert.doesNotMatch(stressRecommendationsItemsRu, /Planificar el viaje|adoptar una actitud tolerante y paciente/u);

  assert.match(ch4DistractionsModuleSource, /Distracción/u);
  assert.match(ch4DistractionsModuleSource, /conducir/u);
  assert.match(ch4DistractionsModuleSource, /Еда, питье, мате/u);
  const eatingDistractionItemsRu = itemsRuSourceForBlock(ch4DistractionsModuleSource, "eating-drinking-mate-smoking");
  assert.match(eatingDistractionItemsRu, /проливания жидкости/u);
  assert.match(eatingDistractionItemsRu, /горящей золы/u);
  assert.match(eatingDistractionItemsRu, /манипуляций руками/u);
  assert.match(eatingDistractionItemsRu, /руки не могут уверенно оставаться на руле/u);
  assert.doesNotMatch(eatingDistractionItemsRu, /Comer, beber, tomar mate|fumar|cuidado|derrames|encendida ceniza|manipulación/u);
  const cellPhoneRiskItemsRu = itemsRuSourceForBlock(ch4DistractionsModuleSource, "cell-phone-risk");
  assert.match(cellPhoneRiskItemsRu, /Использование мобильного телефона запрещено/u);
  assert.match(cellPhoneRiskItemsRu, /Громкая связь[\s\S]*altavoz/u);
  assert.match(cellPhoneRiskItemsRu, /наушники[\s\S]*auriculares/u);
  assert.doesNotMatch(cellPhoneRiskItemsRu, /Usar telefonía celular|Altavoz или auriculares/u);
  assert.match(ch4DistractionsModuleSource, /время реакции на стимул/u);
  assert.match(ch4DistractionsModuleSource, /мысленного представления/u);
  assert.doesNotMatch(ch4DistractionsModuleSource, /selectable text|response time|mental representation/u);
  assert.match(ch4DistractionsModuleSource, /GPS/u);
  const gpsRiskItemsRu = itemsRuSourceForBlock(ch4DistractionsModuleSource, "gps-risk");
  assert.match(gpsRiskItemsRu, /настраивать или трогать GPS/u);
  assert.match(gpsRiskItemsRu, /запрограммировать заранее/u);
  assert.doesNotMatch(gpsRiskItemsRu, /manipular GPS|programar con anterioridad/u);
  const phoneRecommendationsItemsRu = itemsRuSourceForBlock(ch4DistractionsModuleSource, "phone-recommendations");
  assert.match(phoneRecommendationsItemsRu, /режим полета[\s\S]*modo avión/u);
  assert.match(phoneRecommendationsItemsRu, /бардачок или багажник[\s\S]*guantera или baúl/u);
  assert.match(phoneRecommendationsItemsRu, /аварийные огни[\s\S]*balizas/u);
  assert.doesNotMatch(phoneRecommendationsItemsRu, /Поставить его в modo avión|Убрать его в guantera|включить balizas/u);
  const otherActionsItemsRu = itemsRuSourceForBlock(ch4DistractionsModuleSource, "other-actions");
  assert.match(otherActionsItemsRu, /радио или CD/u);
  assert.match(otherActionsItemsRu, /портативный DVD/u);
  assert.match(otherActionsItemsRu, /пассажиров/u);
  assert.match(otherActionsItemsRu, /верхнюю одежду/u);
  assert.match(otherActionsItemsRu, /зеркало заднего вида/u);
  assert.match(otherActionsItemsRu, /пунктом оплаты проезда/u);
  assert.doesNotMatch(otherActionsItemsRu, /radio или CD|DVD portátil|occupants|abrigo|cinturón de seguridad|espejo retrovisor|peaje/u);
  assert.match(ch4DistractionsModuleSource, /100% внимания/u);
});

test("Chapter 5 sections retain attitude, equality, support-line, and efficient-driving details", () => {
  for (const sectionId of [
    "ch5-attitude-types",
    "ch5-equal-society",
    "ch5-gender-violence-prevention",
    "ch5-anticipatory-efficient-driving"
  ]) {
    const section = registry.sections.find((entry) => entry.id === sectionId);
    assert.equal(section.status, "implemented", `${sectionId} is implemented in the Chapter 5 PR`);
    assert.equal(section.implementationEvidence.visualEvidenceSchemaVersion, 3, `${sectionId} uses strict visual evidence`);
    assert.equal(section.implementationEvidence.visualRulePolicyId, "031-strict-source-fidelity");
    assert.equal(section.implementationEvidence.highResolutionEvidenceStatus, "x5-or-equivalent-no-upscale-recorded");
    assert.equal(section.implementationEvidence.localAssetMetadata[0].assetCategory, "native-dom-text-only");
  }

  assert.match(ch5AttitudeTypesModuleSource, /actitud[\s\S]*установку или отношение/u);
  assert.match(ch5AttitudeTypesModuleSource, /Tolerante[\s\S]*терпимая/u);
  assert.match(ch5AttitudeTypesModuleSource, /Solidaria[\s\S]*солидарная/u);
  assert.match(ch5AttitudeTypesModuleSource, /Comprensiva[\s\S]*понимающая/u);
  assert.match(ch5AttitudeTypesModuleSource, /Prudente[\s\S]*осторожная/u);
  assert.match(ch5AttitudeTypesModuleSource, /Prepotente[\s\S]*властная/u);
  assert.match(ch5AttitudeTypesModuleSource, /Desconsiderada[\s\S]*невнимательная/u);
  assert.match(ch5AttitudeTypesModuleSource, /Exhibicionista[\s\S]*демонстративная/u);
  assert.match(ch5AttitudeTypesModuleSource, /Transgresora[\s\S]*нарушающая правила/u);

  assert.match(ch5EqualSocietyModuleSource, /общественного пространства и транспорта/u);
  assert.match(ch5EqualSocietyModuleSource, /пола, возраста, здоровья/u);
  assert.match(ch5EqualSocietyModuleSource, /13% поездок/u);
  assert.match(ch5EqualSocietyModuleSource, /54%[\s\S]*общественный транспорт/u);
  assert.match(ch5EqualSocietyModuleSource, /50%[\s\S]*работой или учебой/u);
  assert.match(ch5EqualSocietyModuleSource, /30%[\s\S]*задачам ухода/u);
  assert.match(ch5EqualSocietyModuleSource, /право жить свободно/u);
  assert.match(ch5EqualSocietyModuleSource, /от девочек до пожилых женщин/u);
  assert.match(ch5EqualSocietyModuleSource, /russianOverlayLabels[\s\S]*общественный транспорт[\s\S]*работа \/ учеба[\s\S]*задачи ухода/u);
  const mobilityPatternsItemsRu = itemsRuSourceForBlock(ch5EqualSocietyModuleSource, "mobility-patterns");
  assert.doesNotMatch(mobilityPatternsItemsRu, /son en transporte publico|por trabajo\/estudio|tareas de cuidado/u);

  assert.match(ch5GenderViolencePreventionModuleSource, /911/u);
  assert.match(ch5GenderViolencePreventionModuleSource, /22676 ACOSO/u);
  assert.match(ch5GenderViolencePreventionModuleSource, /24 часа[\s\S]*365 дней/u);
  assert.match(ch5GenderViolencePreventionModuleSource, /SMS[\s\S]*22676/u);
  assert.match(ch5GenderViolencePreventionModuleSource, /reporte - сообщение/u);
  assert.match(ch5GenderViolencePreventionModuleSource, /contención\/asesoramiento - запрос поддержки/u);
  assert.match(ch5GenderViolencePreventionModuleSource, /не работает как центр переадресации вызовов на 911/u);
  const smsSupportItemsRu = itemsRuSourceForBlock(ch5GenderViolencePreventionModuleSource, "sms-support-flow");
  const activeListeningItemsRu = itemsRuSourceForBlock(ch5GenderViolencePreventionModuleSource, "active-listening-and-limits");
  assert.doesNotMatch(smsSupportItemsRu, /paradas de colectivo|estaciones de subte/u);
  assert.doesNotMatch(activeListeningItemsRu, /escucha activa/u);

  assert.match(ch5AnticipatoryEfficientDrivingModuleSource, /titleRu: "Предупредительное вождение"/u);
  assert.doesNotMatch(ch5AnticipatoryEfficientDrivingModuleSource, /anticipada-вождение|Предупредительное или anticipada/u);
  assert.match(ch5AnticipatoryEfficientDrivingModuleSource, /предвидеть все, ожидать все, предполагать все/u);
  assert.match(ch5AnticipatoryEfficientDrivingModuleSource, /80 km\/h/u);
  assert.match(ch5AnticipatoryEfficientDrivingModuleSource, /19 и 24 ºC/u);
  assert.match(ch5AnticipatoryEfficientDrivingModuleSource, /12 000 km/u);
  assert.match(ch5AnticipatoryEfficientDrivingModuleSource, /20% расхода топлива/u);
  assert.match(ch5AnticipatoryEfficientDrivingModuleSource, /5 минут/u);
  assert.match(ch5AnticipatoryEfficientDrivingModuleSource, /тормозов[\s\S]*воздушного, масляного и топливного фильтров/u);
  assert.match(ch5AnticipatoryEfficientDrivingModuleSource, /давление должно соответствовать загрузке/u);
  assert.match(ch5AnticipatoryEfficientDrivingModuleSource, /более 3 минут/u);
  assert.match(ch5AnticipatoryEfficientDrivingModuleSource, /дорожное движение[\s\S]*городской культуры/u);
  const efficientMeasuresItemsRu = itemsRuSourceForBlock(ch5AnticipatoryEfficientDrivingModuleSource, "efficient-driving-measures");
  assert.doesNotMatch(efficientMeasuresItemsRu, /ralenti|baja revoluciones|velocidad constante|vehículo detenido/u);
});

test("Appendix I divider and private-car safety section boundaries are explicit", () => {
  const divider = registry.skippedSourcePages.find((entry) => entry.sourcePage === 104);
  assert.equal(divider?.reason, "chapter-divider-only");
  assert.equal(divider?.parentChapterId, "appendix-1-private-cars");
  assert.match(divider?.disposition ?? "", /navigation parent/u);

  const appendix = registry.chapters.find((chapter) => chapter.id === "appendix-1-private-cars");
  assert.ok(appendix, "Appendix I parent exists");
  assert.deepEqual(appendix.sourcePageRange, { start: 104, end: 122 });
  assert.equal(appendix.requiredPrintedPage, 103);
  assert.deepEqual(appendix.sectionIds, [
    "app1-safety-elements",
    "app1-other-required-safety-elements",
    "app1-recommended-safety-elements"
  ]);

  const safety = sectionById("app1-safety-elements");
  const otherRequired = sectionById("app1-other-required-safety-elements");
  const recommended = sectionById("app1-recommended-safety-elements");
  assert.deepEqual(safety.sourcePageRange, { start: 105, end: 119 });
  assert.deepEqual(otherRequired.sourcePageRange, { start: 119, end: 120 });
  assert.deepEqual(recommended.sourcePageRange, { start: 121, end: 122 });
  assert.equal(safety.sourceBoundaryEvidence.sharedSourcePage, 119);
  assert.equal(safety.sourceBoundaryEvidence.endsBeforeLayoutBlockId, "page-119-source-line-mask-10");
  assert.match(safety.sourceBoundaryEvidence.boundaryEvidence, /Equipaje[\s\S]*Otros elementos de seguridad obligatorios/u);
  assert.equal(otherRequired.sourceBoundaryEvidence.sharedSourcePage, 119);
  assert.equal(otherRequired.sourceBoundaryEvidence.startsAtLayoutBlockId, "page-119-source-line-mask-10");
  assert.equal(otherRequired.sourceBoundaryEvidence.startsAtSourceTextEs, "Otros elementos de seguridad obligatorios");
  assert.match(otherRequired.sourceBoundaryEvidence.boundaryEvidence, /preceding Equipaje/u);
  const sharedPage119 = registry.sharedSourcePageOwnership.find((entry) => entry.sourcePage === 119);
  assert.ok(sharedPage119, "page 119 is declared in top-level shared source-page ownership");
  assert.equal(sharedPage119.referenceAsset, sourcePageAssetPath(119));
  assert.deepEqual(sharedPage119.sectionBoundaries.map((boundary) => boundary.sectionId), [
    "app1-safety-elements",
    "app1-other-required-safety-elements"
  ]);
  assert.deepEqual(sharedPage119.sectionBoundaries[0].ownedLayoutBlockIdsOnSharedPage, [
    "page-119-source-line-mask-02",
    "page-119-source-line-mask-03",
    "page-119-source-line-mask-04",
    "page-119-source-line-mask-05",
    "page-119-source-line-mask-06",
    "page-119-source-line-mask-07",
    "page-119-source-line-mask-08",
    "page-119-source-line-mask-09"
  ]);
  assert.equal(sharedPage119.sectionBoundaries[0].endsBeforeLayoutBlockId, "page-119-source-line-mask-10");
  assert.deepEqual(sharedPage119.sectionBoundaries[1].ownedLayoutBlockIdsOnSharedPage, [
    "page-119-source-line-mask-10",
    "page-119-source-line-mask-11",
    "page-119-source-line-mask-12",
    "page-119-source-line-mask-13",
    "page-119-source-line-mask-14",
    "page-119-source-line-mask-15",
    "page-119-source-line-mask-16"
  ]);
  assert.equal(sharedPage119.sectionBoundaries[1].startsAtLayoutBlockId, "page-119-source-line-mask-10");
  assert.equal(registry.sections.some((section) => section.sourcePages.some((page) => page.sourcePage === 104)), false);
  assert.doesNotMatch(manualGuideSource, /annex-1-safety|annex-1-required|annex-1-recommended/u);
});

test("Appendix II divider and passenger-transport section boundaries are explicit", () => {
  const appendix = registry.chapters.find((chapter) => chapter.id === "appendix-2-passenger-transport");
  assert.ok(appendix, "Appendix II parent exists");
  assert.deepEqual(appendix.sourcePageRange, { start: 123, end: 151 });
  assert.equal(appendix.requiredPrintedPage, 122);
  assert.deepEqual(appendix.sectionIds, [
    "app2-social-responsibility",
    "app2-safety-elements",
    "app2-driving-factors",
    "app2-safe-driving",
    "app2-highways-hospitals"
  ]);

  assert.equal(registry.skippedSourcePages.some((entry) => entry.sourcePage === 123), false);

  const socialResponsibility = sectionById("app2-social-responsibility");
  assert.deepEqual(socialResponsibility.sourcePageRange, { start: 123, end: 124 });
  assert.deepEqual(socialResponsibility.sourcePages.map((entry) => entry.sourcePage), [123, 124]);
  assert.equal(socialResponsibility.topicNavigationStartPage, 124);
  assert.equal(
    socialResponsibility.topicNavigationStartPage ?? socialResponsibility.sourcePageRange.start,
    124,
    "derived manualGuideNavigation child sourcePage/display start is page 124"
  );
  assert.match(manualGuideSource, /sourcePage:\s*section\.topicNavigationStartPage\s*\?\?\s*section\.sourcePageRange\.start/u);
  assert.deepEqual(sectionById("app2-safety-elements").sourcePageRange, { start: 125, end: 136 });
  assert.deepEqual(sectionById("app2-driving-factors").sourcePageRange, { start: 137, end: 143 });
  const safeDriving = sectionById("app2-safe-driving");
  const highwaysHospitals = sectionById("app2-highways-hospitals");
  assert.deepEqual(safeDriving.sourcePageRange, { start: 144, end: 148 });
  assert.deepEqual(safeDriving.sourcePages.map((entry) => entry.sourcePage), [144, 145, 146, 147, 148]);
  assert.deepEqual(safeDriving.implementationEvidence.sourcePages, [144, 145, 146, 147, 148]);
  assert.deepEqual(highwaysHospitals.sourcePageRange, { start: 149, end: 151 });
  assert.deepEqual(highwaysHospitals.sourcePages.map((entry) => entry.sourcePage), [149, 150, 151]);
  assert.deepEqual(highwaysHospitals.implementationEvidence.sourcePages, [149, 150, 151]);
  assert.equal(highwaysHospitals.topicNavigationStartPage ?? highwaysHospitals.sourcePageRange.start, 149);
  assert.equal(
    safeDriving.implementationEvidence.sourceRegionMetadata.some(
      (entry) =>
        entry.sourcePage === 148 &&
        entry.sourceAssetPath ===
          "content/validation/manual-guide/app2-safe-driving/page-148-safe-driving-source-crop.jpg" &&
        entry.cropSha256 === "e1fe1bce0876304faf48e99cd8b44c0aa2a6017fc4a9e7d74039985945fde2a4"
    ),
    true,
    "page 148 source crop provenance belongs to app2-safe-driving under local sourcePage convention"
  );
  assert.equal(
    highwaysHospitals.implementationEvidence.sourceRegionMetadata.some((entry) => entry.sourcePage === 148),
    false,
    "page 148 source crop provenance no longer belongs to app2-highways-hospitals"
  );
  assert.equal(
    sha256File("content/validation/manual-guide/app2-safe-driving/page-148-safe-driving-source-crop.jpg"),
    "e1fe1bce0876304faf48e99cd8b44c0aa2a6017fc4a9e7d74039985945fde2a4",
    "restored page 148 x5 source crop bytes are preserved"
  );
  assert.equal(
    registry.sections.filter((section) => section.sourcePages.some((page) => page.sourcePage === 123)).map((section) => section.id).join(","),
    "app2-social-responsibility"
  );
  assert.equal(
    registry.sections.filter((section) => section.sourcePages.some((page) => page.sourcePage === 148)).map((section) => section.id).join(","),
    "app2-safe-driving"
  );
});

test("Appendix III divider and cargo section boundaries are explicit", () => {
  const appendix = registry.chapters.find((chapter) => chapter.id === "appendix-3-cargo");
  assert.ok(appendix, "Appendix III parent exists");
  assert.deepEqual(appendix.sourcePageRange, { start: 152, end: 183 });
  assert.equal(appendix.requiredPrintedPage, 151);
  assert.deepEqual(appendix.sectionIds, [
    "app3-cargo-driver-profile",
    "app3-social-responsibility",
    "app3-driving-factors",
    "app3-safe-driving",
    "app3-safety-elements",
    "app3-highways"
  ]);

  const divider = registry.skippedSourcePages.find((entry) => entry.sourcePage === 152);
  assert.ok(divider, "Appendix III divider page is explicitly skipped");
  assert.equal(divider.reason, "chapter-divider-only");
  assert.equal(divider.parentChapterId, "appendix-3-cargo");
  assert.equal(registry.sections.some((section) => section.sourcePages.some((page) => page.sourcePage === 152)), false);

  assert.deepEqual(sectionById("app3-cargo-driver-profile").sourcePageRange, { start: 153, end: 154 });
  assert.deepEqual(sectionById("app3-social-responsibility").sourcePageRange, { start: 155, end: 159 });
  assert.deepEqual(sectionById("app3-driving-factors").sourcePageRange, { start: 160, end: 161 });
  assert.deepEqual(sectionById("app3-safe-driving").sourcePageRange, { start: 162, end: 168 });
  assert.deepEqual(sectionById("app3-safety-elements").sourcePageRange, { start: 169, end: 181 });
  assert.deepEqual(sectionById("app3-highways").sourcePageRange, { start: 182, end: 183 });
  assert.equal(registry.sections.some((section) => /^app4-/u.test(section.id)), true, "Appendix IV content is implemented in its own PR");
});

test("Appendix III sections retain cargo-driver legal, safety, equipment, and highway details", () => {
  for (const sectionId of [
    "app3-cargo-driver-profile",
    "app3-social-responsibility",
    "app3-driving-factors",
    "app3-safe-driving",
    "app3-safety-elements",
    "app3-highways"
  ]) {
    const section = sectionById(sectionId);
    assert.equal(section.status, "implemented", `${sectionId} is implemented in the Appendix III PR`);
    assert.equal(section.implementationEvidence.visualEvidenceSchemaVersion, 3, `${sectionId} uses strict visual evidence`);
    assert.equal(section.implementationEvidence.visualRulePolicyId, "031-strict-source-fidelity");
    assert.equal(section.implementationEvidence.highResolutionEvidenceStatus, "x5-or-equivalent-no-upscale-recorded");
    assert.equal(section.implementationEvidence.localAssetMetadata[0].assetCategory, "native-dom-text-only");
  }

  assert.match(app3CargoDriverProfileModuleSource, /категорий C, D и E/u);
  assert.match(app3CargoDriverProfileModuleSource, /21 год/u);
  assert.match(app3CargoDriverProfileModuleSource, /стаж больше 1 года в классе B/u);
  assert.match(app3CargoDriverProfileModuleSource, /N1[\s\S]*3\.500 kg/u);
  assert.match(app3CargoDriverProfileModuleSource, /N2[\s\S]*12\.000 kg/u);
  assert.match(app3CargoDriverProfileModuleSource, /RUTA[\s\S]*RTO[\s\S]*LiNTI/u);
  assert.match(app3SocialResponsibilityModuleSource, /три точки опоры/u);
  assert.match(app3SocialResponsibilityModuleSource, /Питание должно планироваться/u);
  assert.match(app3DrivingFactorsModuleSource, /body-posture-source-as-is\.png/u);
  assert.match(app3DrivingFactorsModuleSource, /source-image-original-visible-text/u);
  assert.match(app3DrivingFactorsModuleSource, /не переведено, не перекрашено и не перерисовано/u);
  assert.match(app3SafeDrivingModuleSource, /1,5 m/u);
  assert.match(app3SafeDrivingModuleSource, /более 12 t/u);
  assert.match(app3SafeDrivingModuleSource, /205 km[\s\S]*95 улиц[\s\S]*39 из 48 районов/u);
  assert.match(app3SafeDrivingModuleSource, /грузовиков и прицепов[\s\S]*индивидуальной массой 12 t[\s\S]*междугородних пассажирских автобусов[\s\S]*19 мест/u);
  assert.match(app3SafeDrivingModuleSource, /Paseo del Bajo[\s\S]*60 km\/h/u);
  assert.match(app3SafeDrivingModuleSource, /Велосипеды, мотоциклы, автомобили, такси/u);
  assert.match(app3SafetyElementsModuleSource, /1,6 mm/u);
  assert.match(app3SafetyElementsModuleSource, /2 mm/u);
  assert.match(app3SafetyElementsModuleSource, /10% задней части/u);
  assert.match(app3SafetyElementsModuleSource, /25 cm/u);
  assert.match(app3SafetyElementsModuleSource, /Av\. Paseo Colon[\s\S]*Av\. San Juan/u);
  assert.match(app3SafetyElementsModuleSource, /Av\. Elvira Rawson de Dellepiane[\s\S]*Av\. Ing\. Huergo/u);
  assert.match(app3SafetyElementsModuleSource, /seatbelt-source-as-is\.png/u);
  assert.match(app3SafetyElementsModuleSource, /Фото и подписи оставлены без изменения/u);
  assert.match(app3SafetyElementsModuleSource, /больше 1 kg/u);
  assert.match(app3HighwaysModuleSource, /Профессионализация перевозки грузов и товаров/u);
  assert.doesNotMatch(app3HighwaysModuleSource, /ANEXO IV|SEÑALES VIALES|appendix-4/u);
});

test("Appendix IV divider and traffic-sign section boundaries are explicit", () => {
  const appendix = registry.chapters.find((chapter) => chapter.id === "appendix-4-road-signs");
  assert.ok(appendix, "Appendix IV parent exists");
  assert.equal(appendix.sourceTitleEs, "ANEXO IV SEÑALES VIALES");
  assert.deepEqual(appendix.sourcePageRange, { start: 184, end: 200 });
  assert.equal(appendix.requiredPrintedPage, 183);
  assert.deepEqual(appendix.sectionIds, [
    "app4-signs-regulatory",
    "app4-signs-warning",
    "app4-signs-informational",
    "app4-signs-temporary",
    "app4-signs-horizontal",
    "app4-signs-traffic-lights"
  ]);

  const divider = registry.skippedSourcePages.find((entry) => entry.sourcePage === 184);
  assert.ok(divider, "Appendix IV divider page is explicitly skipped");
  assert.equal(divider.reason, "chapter-divider-only");
  assert.equal(divider.parentChapterId, "appendix-4-road-signs");
  assert.equal(registry.sections.some((section) => section.sourcePages.some((page) => page.sourcePage === 184)), false);

  assert.deepEqual(sectionById("app4-signs-regulatory").sourcePageRange, { start: 185, end: 186 });
  assert.deepEqual(sectionById("app4-signs-warning").sourcePageRange, { start: 187, end: 188 });
  assert.deepEqual(sectionById("app4-signs-informational").sourcePageRange, { start: 189, end: 192 });
  assert.deepEqual(sectionById("app4-signs-temporary").sourcePageRange, { start: 193, end: 194 });
  assert.deepEqual(sectionById("app4-signs-horizontal").sourcePageRange, { start: 195, end: 196 });
  assert.deepEqual(sectionById("app4-signs-traffic-lights").sourcePageRange, { start: 197, end: 200 });
});

test("Appendix IV keeps protected signs, markings, and signals source-as-is with Russian explanations outside images", () => {
  for (const sectionId of [
    "app4-signs-regulatory",
    "app4-signs-warning",
    "app4-signs-informational",
    "app4-signs-temporary",
    "app4-signs-horizontal",
    "app4-signs-traffic-lights"
  ]) {
    const section = sectionById(sectionId);
    assert.equal(section.status, "implemented", `${sectionId} is implemented in the Appendix IV PR`);
    assert.equal(section.implementationEvidence.visualEvidenceSchemaVersion, 3, `${sectionId} uses strict visual evidence`);
    assert.equal(section.implementationEvidence.visualRulePolicyId, "031-strict-source-fidelity");
    assert.equal(section.implementationEvidence.highResolutionEvidenceStatus, "x5-or-equivalent-no-upscale-recorded");
    assert.equal(section.implementationEvidence.localAssetMetadata[0].assetCategory, "native-dom-text-only");
    assert.equal(section.implementationEvidence.sourceRegionMetadata.every((entry) => entry.cropDimensions.width === 2976 && entry.cropDimensions.height === 4209), true);
  }

  for (const sectionId of [
    "app4-signs-regulatory",
    "app4-signs-warning",
    "app4-signs-informational",
    "app4-signs-temporary",
    "app4-signs-traffic-lights"
  ]) {
    const section = sectionById(sectionId);
    const imageAssets = section.implementationEvidence.localAssetMetadata.filter((entry) => entry.assetCategory === "source-as-is-traffic-sign");
    assert.ok(imageAssets.length > 0, `${sectionId} records source-as-is traffic sign/signal assets`);
    for (const asset of imageAssets) {
      assert.equal(asset.cleanupScope, "none-source-as-is");
      assert.equal(asset.sourceIntegrity.noTranslationOrRelabeling, true);
      assert.equal(asset.sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint, true);
      assert.equal(asset.sourceIntegrity.russianExplanationOutsideImage, true);
      assert.equal(asset.width, 2976);
      assert.equal(asset.height, 4209);
      assert.equal(sha256File(asset.assetPath), asset.sha256);
      assert.equal(sha256File(asset.sourceIntegrity.sourceAssetPath), asset.sha256);
    }
  }

  const horizontal = sectionById("app4-signs-horizontal");
  const markingAssets = horizontal.implementationEvidence.localAssetMetadata.filter((entry) => entry.assetCategory === "source-as-is-road-marking");
  assert.equal(markingAssets.length, 2);
  assert.equal(horizontal.implementationEvidence.visibleSpanishStatus.status, "source_image_exceptions_only");
  for (const asset of markingAssets) {
    assert.equal(asset.cleanupScope, "none-source-as-is");
    assert.equal(asset.sourceIntegrity.noTranslationOrRelabeling, true);
    assert.equal(asset.sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint, true);
    assert.equal(sha256File(asset.sourceIntegrity.sourceAssetPath), asset.sha256);
  }

  assert.match(app4SignsRegulatoryModuleSource, /Запрещающие[\s\S]*Ограничивающие[\s\S]*приоритет/u);
  assert.match(app4SignsWarningModuleSource, /Предупреждение не всегда запрещает действие/u);
  assert.match(app4SignsInformationalModuleSource, /Желтая звезда[\s\S]*estrellasamarillas@buenosaires\.gob\.ar/u);
  assert.match(app4SignsTemporaryModuleSource, /Временные дорожные знаки имеют приоритет/u);
  assert.match(app4SignsHorizontalModuleSource, /Продольная разметка[\s\S]*Поперечная разметка[\s\S]*Специальная разметка/u);
  assert.match(app4SignsTrafficLightsModuleSource, /Значение огней[\s\S]*Расположение оптических блоков[\s\S]*Специальные светофоры/u);
  assert.match(app4SignsTrafficLightsModuleSource, /цвет, размер и положение/u);
});

test("Appendix III keeps Paseo del Bajo page 169 carryover in the page-169 owner", () => {
  const safeDriving = sectionById("app3-safe-driving");
  const safetyElements = sectionById("app3-safety-elements");

  assert.deepEqual(safeDriving.sourcePageRange, { start: 162, end: 168 });
  assert.deepEqual(safeDriving.sourcePages.map((page) => page.sourcePage), [162, 163, 164, 165, 166, 167, 168]);
  assert.deepEqual(safetyElements.sourcePageRange, { start: 169, end: 181 });
  assert.equal(safetyElements.sourcePages.some((page) => page.sourcePage === 169), true);

  assert.match(app3SafeDrivingModuleSource, /Red de transito pesado[\s\S]*205 km[\s\S]*95 улиц[\s\S]*39 из 48 районов/u);
  assert.match(app3SafeDrivingModuleSource, /грузовиков и прицепов[\s\S]*индивидуальной массой 12 t[\s\S]*междугородних пассажирских автобусов[\s\S]*19 мест/u);
  assert.match(app3SafeDrivingModuleSource, /Paseo del Bajo[\s\S]*60 km\/h/u);
  assert.match(app3SafeDrivingModuleSource, /Велосипеды, мотоциклы, автомобили, такси/u);
  assert.match(app3SafeDrivingModuleSource, /Экстренные транспортные средства[\s\S]*Autopistas Urbanas S\.A\./u);
  assert.match(app3SafeDrivingModuleSource, /Исключительные и неделимые грузы[\s\S]*разрешение у компетентного органа/u);

  assert.match(app3SafetyElementsModuleSource, /paseo-del-bajo-page-169-carryover/u);
  assert.match(app3SafetyElementsModuleSource, /Av\. Paseo Colon[\s\S]*Av\. San Juan/u);
  assert.match(app3SafetyElementsModuleSource, /дорожная непредвиденная ситуация[\s\S]*полностью исключает движение через Paseo del Bajo/u);
  assert.match(app3SafetyElementsModuleSource, /Av\. Elvira Rawson de Dellepiane[\s\S]*Av\. Ing\. Huergo/u);

  assert.doesNotMatch(
    app3SafeDrivingModuleSource,
    /Av\. Paseo Colon|Av\. San Juan|обозначенную центральную зону|дорожная ситуация полностью блокирует Paseo del Bajo|исключительные альтернативные маршруты|permisos para area delimitada|contingencias/u
  );
});

test("Appendix II sections retain passenger-transport legal, safety, health, and route details", () => {
  for (const sectionId of [
    "app2-social-responsibility",
    "app2-safety-elements",
    "app2-driving-factors",
    "app2-safe-driving",
    "app2-highways-hospitals"
  ]) {
    const section = sectionById(sectionId);
    assert.equal(section.status, "implemented", `${sectionId} is implemented in the Appendix II PR`);
    assert.equal(section.implementationEvidence.visualEvidenceSchemaVersion, 3, `${sectionId} uses strict visual evidence`);
    assert.equal(section.implementationEvidence.visualRulePolicyId, "031-strict-source-fidelity");
    assert.equal(section.implementationEvidence.highResolutionEvidenceStatus, "x5-or-equivalent-no-upscale-recorded");
    assert.equal(section.implementationEvidence.localAssetMetadata[0].assetCategory, "native-dom-text-only");
    if (sectionId === "app2-highways-hospitals") {
      assert.deepEqual(section.implementationEvidence.visibleSpanishStatus, {
        status: "source_image_exceptions_only",
        nonSignVisibleSpanishStatus: "source-image-only",
        exceptions: [
          {
            assetPath:
              "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-highways-hospitals/hospital-map-source-as-is.png",
            kind: "source-image-original-visible-text",
            visibleSpanishScope: "source-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true,
            ownerDecisionDate: "2026-06-04",
            scope: "page-150-hospital-map-only"
          }
        ]
      });
    } else {
      assert.equal(section.implementationEvidence.visibleSpanishStatus, "none");
    }
  }

  assert.match(app2SocialResponsibilityModuleSource, /Минимальный возраст[\s\S]*21 год/u);
  assert.match(app2SocialResponsibilityModuleSource, /Общественный транспорт поддерживает почти все повседневные действия общества/u);
  assert.match(app2SocialResponsibilityModuleSource, /устойчивой и безопасной мобильности[\s\S]*право на мобильность|устойчивой и безопасной мобильности[\s\S]*альтернативы частному автомобилю/u);
  assert.match(app2SocialResponsibilityModuleSource, /Профессиональный водитель[\s\S]*вождение является профессией/u);
  assert.match(app2SocialResponsibilityModuleSource, /категорий C, D и E/u);
  assert.match(app2SocialResponsibilityModuleSource, /стаж больше 1 года в классе B/u);
  assert.match(app2SocialResponsibilityModuleSource, /старше 65 лет[\s\S]*практический экзамен/u);
  assert.match(app2SocialResponsibilityModuleSource, /ключевую роль на общественной дороге/u);
  assert.match(app2SafetyElementsModuleSource, /VTV/u);
  assert.match(app2SafetyElementsModuleSource, /каждые 6 месяцев/u);
  assert.match(app2SafetyElementsModuleSource, /тормозной путь может увеличиться на 10%/u);
  assert.match(app2SafetyElementsModuleSource, /2 mm/u);
  assert.match(app2SafetyElementsModuleSource, /[Вв]осстановленные шины запрещены на передних осях/u);
  assert.match(app2SafetyElementsModuleSource, /примерно 3 метра/u);
  assert.match(app2SafetyElementsModuleSource, /максимум 10% задней части/u);
  assert.match(app2SafetyElementsModuleSource, /врачи или парамедики[\s\S]*пожарные/u);
  assert.match(app2SafetyElementsModuleSource, /25 cm/u);
  assert.match(app2SafetyElementsModuleSource, /50 km\/h[\s\S]*до 40 раз/u);
  assert.match(app2SafetyElementsModuleSource, /[Ии]нвалидные кресла[\s\S]*соответствующие крепления/u);
  assert.match(app2SafetyElementsModuleSource, /минимум два/u);
  assert.match(app2SafetyElementsModuleSource, /эластичный хомут запрещен/u);
  assert.match(app2SafetyElementsModuleSource, /форс-мажоре на автомагистралях/u);
  assert.match(app2SafetyElementsModuleSource, /[Сс]терильные гидрофильн/u);
  assert.match(app2DrivingFactorsModuleSource, /Сидячий образ жизни[\s\S]*дефициту витамина D/u);
  assert.match(app2DrivingFactorsModuleSource, /SUBE неисправен[\s\S]*пассажиров нужно пропустить/u);
  assert.match(app2DrivingFactorsModuleSource, /22:00 до 6:00/u);
  assert.match(app2DrivingFactorsModuleSource, /вместимости больше 15 мест/u);
  assert.match(app2DrivingFactorsModuleSource, /ремни на всех сиденьях[\s\S]*крепления инвалидных кресел/u);
  assert.match(app2SafeDrivingModuleSource, /1,5 m/u);
  assert.match(app2SafeDrivingModuleSource, /off-tracking/u);
  assert.match(app2SafeDrivingModuleSource, /задние колеса идут по дуге меньшего радиуса/u);
  assert.match(app2HighwaysHospitalsModuleSource, /12 t/u);
  assert.match(app2HighwaysHospitalsModuleSource, /больше 19 мест/u);
  assert.match(app2HighwaysHospitalsModuleSource, /Paseo del Bajo[\s\S]*исключительным и обязательным[\s\S]*не просто предпочтительным/u);
  assert.match(app2HighwaysHospitalsModuleSource, /исключительным и обязательным[\s\S]*грузовиков и прицепов[\s\S]*12 t/u);
  assert.match(app2HighwaysHospitalsModuleSource, /исключительным и обязательным[\s\S]*междугородних пассажирских автобусов[\s\S]*больше 19 мест[\s\S]*с пассажирами или без них/u);
  assert.match(app2HighwaysHospitalsModuleSource, /60 km\/h/u);
  assert.match(app2HighwaysHospitalsModuleSource, /AUSA/u);
  assert.match(app2HighwaysHospitalsModuleSource, /Карта больниц/u);
  assert.match(app2HighwaysHospitalsModuleSource, /kind:\s*"source-image-cards"/u);
  assert.match(app2HighwaysHospitalsModuleSource, /hospital-map-source-as-is\.png/u);
  assert.match(app2HighwaysHospitalsModuleSource, /sourceImageException[\s\S]*source-image-original-visible-text/u);
  assert.doesNotMatch(app2HighwaysHospitalsModuleSource, /hospital-map-transferred-infographic\.png|russianOverlayLabels/u);
  assert.match(app2HighwaysHospitalsModuleSource, /Доктор И\. Пировано[\s\S]*Сесилия Гриерсон/u);
  assert.match(app2HighwaysHospitalsModuleSource, /[Ии]спанские подписи остаются только внутри самой карты/u);
  assert.doesNotMatch(app2HighwaysHospitalsModuleSource, /удалены на уровне букв|glyph-local|inpainting|source evidence only/u);
  assert.doesNotMatch(app2HighwaysHospitalsModuleSource, /assetPath:\s*"content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/pages\/page-150\.jpg/u);
});

test("Appendix II hospital map renders as an owner-approved source-as-is map with Russian text outside the image", () => {
  const highwaysHospitals = sectionById("app2-highways-hospitals");
  const safetyElements = sectionById("app2-safety-elements");
  const sourceCropPath = "content/validation/manual-guide/app2-highways-hospitals/page-150-hospital-map-source-crop.png";
  const textCleanupMaskPath = "content/validation/manual-guide/app2-highways-hospitals/page-150-hospital-map-text-cleanup-mask.png";
  const runtimeAssetPath = "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-highways-hospitals/hospital-map-source-as-is.png";
  const oldTransferredAssetPath =
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-highways-hospitals/hospital-map-transferred-infographic.png";
  const sourceCropSha256 = "ee73e1266080824b0f1d2c9176b4e120e733db5f4a48440cbbdc974fab8af526";

  assert.equal(sha256File(sourceCropPath), sourceCropSha256);
  assert.equal(sha256File(runtimeAssetPath), sourceCropSha256);
  assert.equal(sha256File(runtimeAssetPath), sha256File(sourceCropPath));
  assert.equal(existsSync(textCleanupMaskPath), false);
  assert.equal(existsSync(oldTransferredAssetPath), false);
  assert.equal(
    highwaysHospitals.implementationEvidence.localAssetMetadata[0].assetKind,
    "selectable-russian-dom-text-and-source-as-is-hospital-map-explanation"
  );
  assert.doesNotMatch(
    JSON.stringify([highwaysHospitals.implementationEvidence, safetyElements.implementationEvidence]),
    /hospital map transfer|hospital-map-transfer|glyph-level Spanish cleanup|selectable Russian DOM overlay labels|text-cleanup mask/u
  );
  assert.match(
    JSON.stringify(safetyElements.implementationEvidence.visualReviewNotes),
    /owner-approved source-as-is visible-Spanish exception[\s\S]*reused byte-identically[\s\S]*Russian title\/list translations/u
  );

  assert.ok(
    highwaysHospitals.implementationEvidence.sourceRegionMetadata.some((entry) =>
      entry.sourceAssetPath === sourceCropPath &&
      entry.cleanupScope === "source-as-is runtime hospital map; no Spanish cleanup or pixel modification" &&
      entry.cropSha256 === sourceCropSha256 &&
      entry.sourceRegion.x === 1332 &&
      entry.sourceRegion.y === 1854 &&
      entry.cropDimensions.width === 780 &&
      entry.cropDimensions.height === 335
    ),
    "hospital map x5 source crop provenance is recorded"
  );

  const asset = localAssetByPath(highwaysHospitals, runtimeAssetPath);
  assert.equal(asset.assetCategory, "source-as-is-map");
  assert.equal(asset.assetKind, "high-resolution-original-source-hospital-map-page-150");
  assert.equal(asset.containsText, true);
  assert.equal(asset.visibleSpanish, true);
  assert.equal(asset.cleanupScope, "none-source-as-is");
  assert.equal(asset.width, 780);
  assert.equal(asset.height, 335);
  assert.equal(asset.sha256, sourceCropSha256);
  assert.equal(asset.runtimeDisplaySize.maxWidthCssPx, 680);
  assert.equal(asset.runtimeDisplaySize.noUpscale, true);
  assert.equal(asset.sourceIntegrity.sourceAsIs, true);
  assert.equal(asset.sourceIntegrity.sourceAssetPath, sourceCropPath);
  assert.equal(asset.sourceIntegrity.noTranslationOrRelabeling, true);
  assert.equal(asset.sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint, true);
  assert.equal(asset.sourceIntegrity.russianExplanationOutsideImage, true);
  assert.equal(asset.sourceImageException.kind, "source-image-original-visible-text");
  assert.equal(asset.sourceImageException.visibleSpanishScope, "source-image-only");
  assert.equal(asset.sourceImageException.sourceAsIs, true);
  assert.equal(asset.sourceImageException.russianExplanationOutsideImage, true);
  assert.equal(asset.sourceImageException.ownerDecisionDate, "2026-06-04");
  assert.equal(asset.sourceImageException.scope, "page-150-hospital-map-only");
  assert.equal(asset.infographicTransfer, undefined);
  assert.deepEqual(highwaysHospitals.implementationEvidence.visibleSpanishStatus, {
    status: "source_image_exceptions_only",
    nonSignVisibleSpanishStatus: "source-image-only",
    exceptions: [
      {
        assetPath: runtimeAssetPath,
        kind: "source-image-original-visible-text",
        visibleSpanishScope: "source-image-only",
        sourceAsIs: true,
        russianExplanationOutsideImage: true,
        ownerDecisionDate: "2026-06-04",
        scope: "page-150-hospital-map-only"
      }
    ]
  });
});

test("Appendix II safety visuals render as preserved source images with provenance evidence", () => {
  const safety = sectionById("app2-safety-elements");
  const sourceAsIs = [
    {
      assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-safety-elements/mirror-orientation-photo-source-as-is.png",
      sourceAssetPath: "content/validation/manual-guide/app2-safety-elements/page-130-mirror-orientation-source-crop.png",
      assetKind: "high-resolution-original-source-photo-app2-mirror-orientation",
      width: 1260,
      height: 125,
      sha256: "d9ca7e643deb5f90a0e3f2f292f3782fa9beea7ddd1cf389052350cb53150787"
    },
    {
      assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-safety-elements/seatbelt-use-photo-source-as-is.png",
      sourceAssetPath: "content/validation/manual-guide/app2-safety-elements/page-131-seatbelt-use-source-crop.png",
      assetKind: "high-resolution-original-source-photo-app2-seatbelt-use",
      width: 1060,
      height: 285,
      sha256: "4646bf488a80173353615c03fab752b18ec992a2a505e7e12d214dbcf44be203"
    }
  ];
  const headrestDiagrams = [
    {
      assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-safety-elements/headrest-height-diagram-source-as-is.png",
      sourceAssetPath: "content/validation/manual-guide/app2-safety-elements/page-132-headrest-height-diagram-source-crop.png",
      assetKind: "high-resolution-source-diagram-app2-headrest-height",
      width: 185,
      height: 105,
      sha256: "f6f79de779ab29b417ff92104ad9603cf0eab15294c942c37c59313e66e8516b"
    },
    {
      assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-safety-elements/headrest-distance-diagram-source-as-is.png",
      sourceAssetPath: "content/validation/manual-guide/app2-safety-elements/page-132-headrest-distance-diagram-source-crop.png",
      assetKind: "high-resolution-source-diagram-app2-headrest-distance",
      width: 260,
      height: 95,
      sha256: "d13071592dc7609e0e0353544e870ccf7eaba10e35204aeef7eb5232362a3ead"
    }
  ];

  assert.match(app2SafetyElementsModuleSource, /kind:\s*"source-image-cards"/u);
  assert.match(app2SafetyElementsModuleSource, /mirror-orientation-photo-source-as-is\.png/u);
  assert.match(app2SafetyElementsModuleSource, /seatbelt-use-photo-source-as-is\.png/u);
  assert.match(app2SafetyElementsModuleSource, /headrest-height-diagram-source-as-is\.png/u);
  assert.match(app2SafetyElementsModuleSource, /headrest-distance-diagram-source-as-is\.png/u);
  assert.doesNotMatch(app2SafetyElementsModuleSource, /headrest-position-transferred-infographic\.png/u);
  assert.match(app2SafetyElementsModuleSource, /manual-source-artwork/u);
  assert.doesNotMatch(app2SafetyElementsModuleSource, /safety, mirror, seat belt, headrest, and equipment visuals are retained as x5 source evidence only/u);
  assert.doesNotMatch(app2SafetyElementsModuleSource, /source-as-is изображ|runtime-crop/u);
  assert.match(stylesSource, /\.manual-source-image-card\[data-card-id="app2-mirror-orientation-source-card"\][\s\S]*grid-column:\s*1 \/ -1/u);
  assert.match(stylesSource, /\.manual-source-image-card\[data-card-id="app2-mirror-orientation-source-card"\] figure[\s\S]*max-width:\s*760px[\s\S]*overflow-x:\s*auto/u);
  assert.match(stylesSource, /\.manual-source-image-card\[data-card-id="app2-mirror-orientation-source-card"\] img[\s\S]*width:\s*760px[\s\S]*max-width:\s*none/u);

  for (const expectation of sourceAsIs) {
    const asset = localAssetByPath(safety, expectation.assetPath);
    assert.equal(asset.assetCategory, "source-as-is-photo");
    assert.equal(asset.assetKind, expectation.assetKind);
    assert.equal(asset.containsText, false);
    assert.equal(asset.visibleSpanish, false);
    assert.equal(asset.cleanupScope, "none-source-as-is");
    assert.equal(asset.width, expectation.width);
    assert.equal(asset.height, expectation.height);
    assert.equal(asset.sha256, expectation.sha256);
    assert.equal(asset.runtimeDisplaySize.noUpscale, true);
    if (expectation.assetPath.includes("mirror-orientation")) {
      assert.equal(asset.runtimeDisplaySize.maxWidthCssPx, 760);
      assert.ok(asset.width > asset.runtimeDisplaySize.maxWidthCssPx);
    }
    assert.equal(asset.sourceIntegrity.sourceAsIs, true);
    assert.equal(asset.sourceIntegrity.sourceAssetPath, expectation.sourceAssetPath);
    assert.equal(asset.sourceIntegrity.noTranslationOrRelabeling, true);
    assert.equal(asset.sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint, true);
    assert.equal(asset.sourceIntegrity.russianExplanationOutsideImage, true);
    assert.equal(sha256File(asset.assetPath), expectation.sha256);
    assert.equal(sha256File(expectation.sourceAssetPath), expectation.sha256);
  }

  for (const expectation of headrestDiagrams) {
    const asset = localAssetByPath(safety, expectation.assetPath);
    assert.equal(asset.assetCategory, "source-transferred-diagram");
    assert.equal(asset.assetKind, expectation.assetKind);
    assert.equal(asset.containsText, false);
    assert.equal(asset.visibleSpanish, false);
    assert.equal(asset.cleanupScope, "none-source-as-is");
    assert.equal(asset.width, expectation.width);
    assert.equal(asset.height, expectation.height);
    assert.equal(asset.sha256, expectation.sha256);
    assert.equal(asset.runtimeDisplaySize.noUpscale, true);
    assert.equal(asset.diagramTransfer.sourceDiagramTransfer, true);
    assert.equal(asset.diagramTransfer.sourceAssetPath, expectation.sourceAssetPath);
    assert.equal(asset.diagramTransfer.sourceCropSha256, expectation.sha256);
    assert.deepEqual(asset.diagramTransfer.sourceCropDimensions, { width: expectation.width, height: expectation.height });
    assert.equal(asset.diagramTransfer.noApproximateRedraw, true);
    assert.equal(asset.diagramTransfer.noReconstruction, true);
    assert.equal(asset.diagramTransfer.noGenericIconReplacement, true);
    assert.equal(asset.diagramTransfer.broadMaskPlatePatchStatus, "none");
    assert.equal(sha256File(asset.assetPath), expectation.sha256);
    assert.equal(sha256File(expectation.sourceAssetPath), expectation.sha256);
  }

  for (const sourceAssetPath of [...sourceAsIs.map((entry) => entry.sourceAssetPath), ...headrestDiagrams.map((entry) => entry.sourceAssetPath)]) {
    assert.ok(
      safety.implementationEvidence.sourceRegionMetadata.some((entry) => entry.sourceAssetPath === sourceAssetPath),
      `${sourceAssetPath} is recorded in Appendix II safety sourceRegionMetadata`
    );
  }
});

test("Appendix I sections retain private-car safety details", () => {
  for (const sectionId of [
    "app1-safety-elements",
    "app1-other-required-safety-elements",
    "app1-recommended-safety-elements"
  ]) {
    const section = sectionById(sectionId);
    assert.equal(section.status, "implemented", `${sectionId} is implemented in the Appendix I PR`);
    assert.equal(section.implementationEvidence.visualEvidenceSchemaVersion, 3, `${sectionId} uses strict visual evidence`);
    assert.equal(section.implementationEvidence.visualRulePolicyId, "031-strict-source-fidelity");
    assert.equal(section.implementationEvidence.highResolutionEvidenceStatus, "x5-or-equivalent-no-upscale-recorded");
    assert.equal(section.implementationEvidence.localAssetMetadata[0].assetCategory, "native-dom-text-only");
  }

  assert.match(app1SafetyElementsModuleSource, /периодической VTV/u);
  assert.match(app1SafetyElementsModuleSource, /Амортизаторы[\s\S]*10%/u);
  assert.match(app1SafetyElementsModuleSource, /50 000 km/u);
  assert.match(app1SafetyElementsModuleSource, /25 000 km/u);
  assert.match(app1SafetyElementsModuleSource, /mecánica[\s\S]*hidráulica[\s\S]*electrohidráulica/u);
  assert.match(app1SafetyElementsModuleSource, /ABS[\s\S]*блокировке колес/u);
  assert.match(app1SafetyElementsModuleSource, /1\.6 mm/u);
  assert.match(app1SafetyElementsModuleSource, /аквапланирования/u);
  assert.match(app1SafetyElementsModuleSource, /не использовать шины старше 5 лет/u);
  assert.match(app1SafetyElementsModuleSource, /Если во время движения шина лопнула/u);
  assert.match(app1SafetyElementsModuleSource, /не тормозить сразу[\s\S]*постепенно снижать скорость/u);
  assert.match(app1SafetyElementsModuleSource, /Pinchaduras[\s\S]*no frenar inmediatamente[\s\S]*desacelerar lentamente/u);
  assert.match(app1SafetyElementsModuleSource, /не больше 10% задней части/u);
  assert.match(app1SafetyElementsModuleSource, /сигнал в 90 dB[\s\S]*65 dB/u);
  assert.match(app1SafetyElementsModuleSource, /врачи или фельдшеры[\s\S]*пожарные/u);
  assert.match(app1SafetyElementsModuleSource, /25 cm/u);
  assert.match(app1SafetyElementsModuleSource, /Подголовник[\s\S]*хлыстовой травмы/u);
  assert.match(app1SafetyElementsModuleSource, /1\.50 m[\s\S]*36 kg/u);
  assert.match(app1SafetyElementsModuleSource, /Только если ребенок одновременно превышает возрастной, ростовой и весовой пороги/u);
  assert.doesNotMatch(app1SafetyElementsModuleSource, /Если ребенок превышает возраст, рост или вес/u);
  assert.match(app1SafetyElementsModuleSource, /80%[\s\S]*70%/u);
  assert.match(app1SafetyElementsModuleSource, /Isofix или Latch/u);
  assert.match(app1SafetyElementsModuleSource, /50 km\/h[\s\S]*40-кратного веса/u);
  assert.match(app1SafetyElementsModuleSource, /Закон CABA 2148[\s\S]*бамперы/u);
  assert.match(app1SafetyElementsModuleSource, /Животных нельзя перевозить без фиксации/u);
  assert.match(app1SafetyElementsModuleSource, /Максимальная загрузка/u);
  assert.match(app1SafetyElementsModuleSource, /Багажник на крыше/u);
  assert.match(app1SafetyElementsModuleSource, /устойчивости направления[\s\S]*поворотах/u);
  assert.doesNotMatch(app1SafetyElementsModuleSource, /periodic VTV|warning triangles, reflective vest|wheel wrench|hydroplaning или aquaplaning|peripheral vision|Homologated convex mirrors разрешены|90 dB horn|удар о windshield|врачи или paramedics|abdomen и chest|excessive fatigue|clavicle|pelvis ниже abdomen|риск whiplash|occupants|integrated или height adjustable|Airbag поглощает|Airbag бывает|curtain|child seats и homologated devices|abdominal two-point belt|DOM text|babies|international standards и иметь label|читать manual автомобиля|used SRI|rear-facing|head, neck and spine|maximum weight|должны быть tight|удержан harness|deformation zones|cabin должна|protective и undeformable|из-за inertia|40 times|bumper поглощает|уменьшает damage|сам impact|Ley 2148[\s\S]*bumpers|fenders|visibility, aerodynamics|rain, wind, dust and insects|laminated или tempered|occupants должны различаться на short distance|Pets нельзя перевозить loose|appropriate harness/u);
  assert.doesNotMatch(app1SafetyElementsModuleSource, /Appendix II|Appendix III|Appendix IV|TRANSPORTE DE PASAJEROS|TRANSPORTE DE CARGA|SEÑALES VIALES/u);

  assert.doesNotMatch(app1OtherRequiredSafetyElementsModuleSource, /Максимальная загрузка|Багажник на крыше|устойчивости направления/u);
  assert.match(app1OtherRequiredSafetyElementsModuleSource, /минимум два аварийных треугольника/u);
  assert.match(app1OtherRequiredSafetyElementsModuleSource, /огнетушитель 1 kg типа ABC/u);
  assert.match(app1OtherRequiredSafetyElementsModuleSource, /эластичный зажим источник запрещает/u);
  assert.match(app1OtherRequiredSafetyElementsModuleSource, /Световозвращающий жилет/u);
  assert.match(app1OtherRequiredSafetyElementsModuleSource, /вынужденной остановки[\s\S]*автомагистралях и скоростных дорогах/u);
  assert.doesNotMatch(app1OtherRequiredSafetyElementsModuleSource, /указана в manual|в trunk|Roof rack должен|aerodynamics, visibility|закрывать lights|установленные limits|hazard triangles|accessible|stopped vehicle|открытии valve|через hose|base of fire|extinguisher 1 kg|wood, plastics and rubber|petroleum|flammable liquids|electric risk|motors and panels|within driver's reach|metal securing system|elastic clamp|collision or rollover|Reflective vest|внутри cabin|roadway|force majeure|highways и fast roads/u);

  assert.match(app1RecommendedSafetyElementsModuleSource, /стерильную гидрофильную марлю/u);
  assert.match(app1RecommendedSafetyElementsModuleSource, /Перекись водорода/u);
  assert.match(app1RecommendedSafetyElementsModuleSource, /Фонарик с запасными батарейками/u);
  assert.match(app1RecommendedSafetyElementsModuleSource, /сертифицированную телескопическую буксировочную штангу/u);
  assert.match(app1RecommendedSafetyElementsModuleSource, /В CABA частному автомобилю запрещено буксировать/u);
  assert.match(app1RecommendedSafetyElementsModuleSource, /уполномоченным автомобилем/u);
  assert.match(app1RecommendedSafetyElementsModuleSource, /состояния автомобиля и его элементов безопасности/u);
  assert.doesNotMatch(app1RecommendedSafetyElementsModuleSource, /обозначается cross|secure fixed place|sterile hydrophilic gauze|Bandages or dressings|Hypoallergenic tape|Hydrogen peroxide|Iodine solution|latex or vinyl gloves|Burn cream|Antidiarrheal charcoal tablets|Analgesics and anti-inflammatory medicine|Insect-bite cream|Tweezers and scissors|Flashlight with spare batteries|homologated telescopic tow bar|ropes, cables and other flexible means|factory towing points|private vehicle|authorized vehicle/u);
});

test("Appendix I visuals render source-as-is and transferred infographics with provenance evidence", () => {
  const safety = sectionById("app1-safety-elements");
  const sourceAsIsMirror = {
    assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-safety-elements/mirror-orientation-photo-source-as-is.jpg",
    sourceAssetPath: "content/validation/manual-guide/app1-safety-elements/page-110-mirror-orientation-source-crop.jpg",
    assetKind: "high-resolution-original-source-photo-mirror-orientation",
    width: 495,
    height: 163,
    sha256: "97482f9f579ce4a8e0fede2789a20466319adaf7004680497c58411d995bee48"
  };
  const transferred = [
    {
      assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-safety-elements/headrest-position-transferred-infographic.png",
      sourceAssetPath: "content/validation/manual-guide/app1-safety-elements/page-113-headrest-position-source-crop.jpg",
      assetKind: "high-resolution-transferred-source-infographic-headrest-position",
      width: 1190,
      height: 185,
      sha256: "e1d0495817ba757b9d4f5acd1862ddb911170ee0094859f19548910e61edf066",
      sourceSha256: "837206121af108c0ca93ae8d4730b1c7a15270e51eab162eafde8bf19ceb6aaf",
      expectedLabels: ["Высота подголовника", "Дистанция подголовника", "хорошо", "допустимо", "средне", "плохо"]
    },
    {
      assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-safety-elements/sri-types-transferred-infographic.png",
      sourceAssetPath: "content/validation/manual-guide/app1-safety-elements/page-115-sri-types-source-crop.jpg",
      assetKind: "high-resolution-transferred-source-infographic-sri-types",
      width: 1220,
      height: 260,
      sha256: "9df0c6892d1b78aa14bc04915125070b4679c93885fc09194f4476ee751d087b",
      sourceSha256: "5d28a11f1a15db90531119cdde12980929dfd36dd82917d150a82fe27525d9a6",
      expectedLabels: ["Виды SRI", "Новорожденные и малыши до 1 года / 10 kg", "1-15 месяцев, 0-13 kg", "9 месяцев - 4 года, 9-18 kg", "4-8 лет, 15-25 kg", "8-12 лет, 22-36 kg"]
    }
  ];

  assert.match(app1SafetyElementsModuleSource, /mirror-orientation-photo-source-as-is\.jpg/u);
  assert.doesNotMatch(app1SafetyElementsModuleSource, /source-image-original-visible-text/u);
  assert.doesNotMatch(app1SafetyElementsModuleSource, /испанские подписи внутри изображения не переводятся/u);
  assert.match(app1SafetyElementsModuleSource, /headrest-position-transferred-infographic\.png/u);
  assert.match(app1SafetyElementsModuleSource, /sri-types-transferred-infographic\.png/u);
  assert.doesNotMatch(app1SafetyElementsModuleSource, /1 год, 10-18 kg/u);
  assert.doesNotMatch(app1SafetyElementsModuleSource, /sri-group-0-plus[\s\S]*1-4 года, 10-18 kg/u);
  assert.match(app1SafetyElementsModuleSource, /russianOverlayLabels[\s\S]*Высота подголовника[\s\S]*Виды SRI/u);

  const exceptionPaths = safety.implementationEvidence.visibleSpanishStatus.exceptions?.map((entry) => entry.assetPath) ?? [];
  const mirrorAsset = localAssetByPath(safety, sourceAsIsMirror.assetPath);
  assert.equal(exceptionPaths.includes(sourceAsIsMirror.assetPath), false);
  assert.equal(mirrorAsset.assetCategory, "source-as-is-photo");
  assert.equal(mirrorAsset.assetKind, sourceAsIsMirror.assetKind);
  assert.equal(mirrorAsset.containsText, false);
  assert.equal(mirrorAsset.visibleSpanish, false);
  assert.equal(mirrorAsset.sourceImageException, undefined);
  assert.equal(mirrorAsset.cleanupScope, "none-source-as-is");
  assert.equal(mirrorAsset.width, sourceAsIsMirror.width);
  assert.equal(mirrorAsset.height, sourceAsIsMirror.height);
  assert.equal(mirrorAsset.sha256, sourceAsIsMirror.sha256);
  assert.equal(mirrorAsset.sourceIntegrity.sourceAsIs, true);
  assert.equal(mirrorAsset.sourceIntegrity.sourceAssetPath, sourceAsIsMirror.sourceAssetPath);
  assert.equal(mirrorAsset.sourceIntegrity.noTranslationOrRelabeling, true);
  assert.equal(mirrorAsset.sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint, true);
  assert.equal(mirrorAsset.sourceIntegrity.surroundingSpanishCaptionAndBodyTextExcluded, true);
  assert.equal(sha256File(mirrorAsset.assetPath), sourceAsIsMirror.sha256);
  assert.equal(sha256File(sourceAsIsMirror.sourceAssetPath), sourceAsIsMirror.sha256);

  for (const expectation of transferred) {
    const asset = localAssetByPath(safety, expectation.assetPath);
    assert.equal(exceptionPaths.includes(expectation.assetPath), false);
    assert.equal(asset.assetCategory, "source-transferred-infographic");
    assert.equal(asset.assetKind, expectation.assetKind);
    assert.equal(asset.visibleSpanish, false);
    assert.equal(asset.cleanupScope, "glyph-level-spanish-cleanup");
    assert.equal(asset.width, expectation.width);
    assert.equal(asset.height, expectation.height);
    assert.equal(asset.sha256, expectation.sha256);
    assert.equal(asset.runtimeDisplaySize.noUpscale, true);
    assert.equal(asset.infographicTransfer.sourceImageTransfer, true);
    assert.equal(asset.infographicTransfer.sourceAssetPath, expectation.sourceAssetPath);
    assert.equal(asset.infographicTransfer.sourceCropSha256, expectation.sourceSha256);
    assert.deepEqual(asset.infographicTransfer.sourceCropDimensions, { width: expectation.width, height: expectation.height });
    assert.equal(asset.infographicTransfer.noApproximateRedraw, true);
    assert.equal(asset.infographicTransfer.broadMaskPlatePatchStatus, "none");
    assert.equal(asset.infographicTransfer.cleanupMethod, "glyph-letter-level-background-restoration");
    assert.equal(asset.infographicTransfer.russianOverlayStrategy, "selectable-dom");
    assert.equal(asset.infographicTransfer.overlayTextSelectability, "selectable-dom-text");
    assert.deepEqual(asset.infographicTransfer.russianOverlayLabels.map((label) => label.textRu), expectation.expectedLabels);
    assert.equal(sha256File(asset.assetPath), expectation.sha256);
    assert.equal(sha256File(expectation.sourceAssetPath), expectation.sourceSha256);
    assert.notEqual(sha256File(asset.assetPath), sha256File(expectation.sourceAssetPath));
  }
});

test("Chapter 4 runtime renders protected photos and transferred infographics with provenance evidence", () => {
  const sourceAsIsExpectations = [
    {
      sectionId: "ch4-alcohol-drugs",
      moduleSource: ch4AlcoholDrugsModuleSource,
      assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch4-alcohol-drugs/drug-test-source-as-is.jpg",
      sourceAssetPath: "content/validation/manual-guide/ch4-alcohol-drugs/page-090-drug-test-source-crop.jpg",
      assetCategory: "source-as-is-photo",
      assetKind: "high-resolution-original-source-photo-drug-test-device",
      width: 820,
      height: 300,
      sha256: "a0ea059e6819b48027877b2ff349c77589878f5b912bd77e4e220e579a4e27a3"
    },
    {
      sectionId: "ch4-distractions",
      moduleSource: ch4DistractionsModuleSource,
      assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch4-distractions/attention-photo-source-as-is.jpg",
      sourceAssetPath: "content/validation/manual-guide/ch4-distractions/page-097-attention-photo-source-crop.jpg",
      assetCategory: "source-as-is-photo",
      assetKind: "high-resolution-original-source-photo-attention-quote",
      width: 720,
      height: 900,
      sha256: "91389610896484f41ba060c8b531077031f9e849b2087c4a21fa7f389fb08338"
    }
  ];
  const transferredInfographicExpectations = [
    {
      sectionId: "ch4-alcohol-drugs",
      moduleSource: ch4AlcoholDrugsModuleSource,
      assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch4-alcohol-drugs/alcohol-limits-transferred-infographic.png",
      removedAssetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch4-alcohol-drugs/alcohol-limits-source-as-is.jpg",
      sourceAssetPath: "content/validation/manual-guide/ch4-alcohol-drugs/page-091-alcohol-limits-source-crop.jpg",
      assetKind: "high-resolution-transferred-source-infographic-alcohol-limits",
      width: 850,
      height: 430,
      sha256: "012e5486c56a8b25174019e53d4fab66599adf58cc920136fd9f447e0e8b3251",
      sourceSha256: "1793e4e77b2549c5b7e6aed931bc0c606b6ae7bc34eec4a2fd5d22e11a49c613",
      expectedLabels: ["Нович.", "Проф.", "Мото", "Пасс. мото", "Частн."]
    },
    {
      sectionId: "ch4-distractions",
      moduleSource: ch4DistractionsModuleSource,
      assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch4-distractions/distraction-panels-transferred-infographic.png",
      removedAssetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch4-distractions/distraction-panels-source-as-is.jpg",
      sourceAssetPath: "content/validation/manual-guide/ch4-distractions/page-095-distraction-panels-source-crop.jpg",
      assetKind: "high-resolution-transferred-source-infographic-distraction-panels",
      width: 860,
      height: 260,
      sha256: "878c270c90a550c3ee6c45d6d13f28592dc05338599029046ab1c5d193fc502c",
      sourceSha256: "1723e149dfbbf839bdf9674183e0feec53693f574899a2f7cd039d7e46dac354",
      expectedLabels: ["Еда / мате", "Предмет", "Нет обзора"]
    }
  ];

  assert.match(ch4AlcoholDrugsModuleSource, /kind:\s*"source-image-cards"/u);
  assert.match(ch4AlcoholDrugsModuleSource, /drug-test-source-as-is\.jpg/u);
  assert.match(ch4AlcoholDrugsModuleSource, /alcohol-limits-transferred-infographic\.png/u);
  assert.match(ch4AlcoholDrugsModuleSource, /russianOverlayLabels[\s\S]*Пасс\. мото/u);
  assert.doesNotMatch(ch4AlcoholDrugsModuleSource, /alcohol-limits-source-as-is\.jpg/u);
  assert.match(ch4AlcoholDrugsModuleSource, /source-image-original-visible-text/u);
  assert.match(ch4AlcoholDrugsModuleSource, /Principiantes[\s\S]*0\.00 g\/l/u);
  assert.match(ch4AlcoholDrugsModuleSource, /Motociclistas[\s\S]*0\.20 g\/l/u);
  assert.match(ch4AlcoholDrugsModuleSource, /Particulares[\s\S]*0\.50 g\/l/u);
  assert.match(ch4DistractionsModuleSource, /kind:\s*"source-image-cards"/u);
  assert.match(ch4DistractionsModuleSource, /distraction-panels-transferred-infographic\.png/u);
  assert.match(ch4DistractionsModuleSource, /russianOverlayLabels[\s\S]*Нет обзора/u);
  assert.doesNotMatch(ch4DistractionsModuleSource, /distraction-panels-source-as-is\.jpg/u);
  assert.match(ch4DistractionsModuleSource, /attention-photo-source-as-is\.jpg/u);
  assert.match(ch4SleepFatigueModuleSource, /биологическая потребность/u);
  assert.doesNotMatch(ch4SleepFatigueModuleSource, /biological need/u);
  assert.doesNotMatch(checkerSource, /source-as-is-infographic/u);
  assert.equal(existsSync(transferredInfographicExpectations[0].removedAssetPath), false);
  assert.equal(existsSync(transferredInfographicExpectations[1].removedAssetPath), false);

  for (const expectation of sourceAsIsExpectations) {
    const section = sectionById(expectation.sectionId);
    assert.ok(section, `${expectation.sectionId} exists`);
    const asset = localAssetByPath(section, expectation.assetPath);
    const exceptionPaths = section.implementationEvidence.visibleSpanishStatus.exceptions.map((entry) => entry.assetPath);
    assert.equal(section.implementationEvidence.visibleSpanishStatus.status, "source_image_exceptions_only");
    assert.equal(section.implementationEvidence.visibleSpanishStatus.nonSignVisibleSpanishStatus, "source-image-only");
    assert.equal(exceptionPaths.includes(expectation.assetPath), true, `${expectation.assetPath} has visible-Spanish exception evidence`);
    assert.equal(asset.assetCategory, expectation.assetCategory);
    assert.equal(asset.assetKind, expectation.assetKind);
    assert.equal(asset.visibleSpanish, true);
    assert.equal(asset.cleanupScope, "none-source-as-is");
    assert.equal(asset.width, expectation.width);
    assert.equal(asset.height, expectation.height);
    assert.equal(asset.sha256, expectation.sha256);
    assert.equal(asset.runtimeDisplaySize.noUpscale, true);
    assert.equal(asset.sourceIntegrity.sourceAsIs, true);
    assert.equal(asset.sourceIntegrity.sourceAssetPath, expectation.sourceAssetPath);
    assert.equal(asset.sourceIntegrity.noTranslationOrRelabeling, true);
    assert.equal(asset.sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint, true);
    assert.equal(asset.sourceIntegrity.russianExplanationOutsideImage, true);
    assert.equal(sha256File(asset.assetPath), expectation.sha256);
    assert.equal(sha256File(expectation.sourceAssetPath), expectation.sha256);
    assert.equal(sha256File(asset.assetPath), sha256File(expectation.sourceAssetPath));
  }

  for (const expectation of transferredInfographicExpectations) {
    const section = sectionById(expectation.sectionId);
    assert.ok(section, `${expectation.sectionId} exists`);
    const asset = localAssetByPath(section, expectation.assetPath);
    const exceptionPaths = section.implementationEvidence.visibleSpanishStatus.exceptions.map((entry) => entry.assetPath);
    assert.equal(exceptionPaths.includes(expectation.assetPath), false, `${expectation.assetPath} must not use a visible-Spanish source-as-is exception`);
    assert.equal(asset.assetCategory, "source-transferred-infographic");
    assert.equal(asset.assetKind, expectation.assetKind);
    assert.equal(asset.visibleSpanish, false);
    assert.equal(asset.cleanupScope, "glyph-level-spanish-cleanup");
    assert.equal(asset.width, expectation.width);
    assert.equal(asset.height, expectation.height);
    assert.equal(asset.sha256, expectation.sha256);
    assert.equal(asset.runtimeDisplaySize.noUpscale, true);
    assert.equal(asset.infographicTransfer.sourceImageTransfer, true);
    assert.equal(asset.infographicTransfer.sourceAssetPath, expectation.sourceAssetPath);
    assert.equal(asset.infographicTransfer.sourceCropSha256, expectation.sourceSha256);
    assert.deepEqual(asset.infographicTransfer.sourceCropDimensions, {
      width: expectation.width,
      height: expectation.height
    });
    assert.equal(asset.infographicTransfer.noApproximateRedraw, true);
    assert.equal(asset.infographicTransfer.broadMaskPlatePatchStatus, "none");
    assert.equal(asset.infographicTransfer.cleanupMethod, "glyph-letter-level-background-restoration");
    assert.equal(asset.infographicTransfer.russianOverlayStrategy, "selectable-dom");
    assert.equal(asset.infographicTransfer.overlayTextSelectability, "selectable-dom-text");
    assert.deepEqual(asset.infographicTransfer.russianOverlayLabels.map((label) => label.textRu), expectation.expectedLabels);
    for (const label of asset.infographicTransfer.russianOverlayLabels) {
      assert.match(label.textRu, /[А-Яа-яЁё]/u);
      assert.equal(label.xPct + label.widthPct <= 100, true);
      assert.equal(label.yPct + label.heightPct <= 100, true);
    }
    assert.equal(sha256File(asset.assetPath), expectation.sha256);
    assert.equal(sha256File(expectation.sourceAssetPath), expectation.sourceSha256);
    assert.notEqual(sha256File(asset.assetPath), sha256File(expectation.sourceAssetPath));
  }
});

test("Chapter 5 runtime renders transferred infographic and protected photo with provenance evidence", () => {
  const transferredInfographicExpectation = {
    sectionId: "ch5-equal-society",
    moduleSource: ch5EqualSocietyModuleSource,
    assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch5-equal-society/mobility-context-transferred-infographic.png",
    sourceAssetPath: "content/validation/manual-guide/ch5-equal-society/page-100-mobility-context-source-crop.jpg",
    assetKind: "high-resolution-transferred-source-infographic-mobility-context",
    width: 1220,
    height: 175,
    sha256: "78f0e1d73d8db71e71c4b553ff9b91ece6fbfaeeed052df66f2854d793fb2846",
    sourceSha256: "d4c13162206fbaa15881b98eafc527985717ac1cabc98201c7834d530c719633",
    expectedLabels: ["общественный транспорт", "работа / учеба", "задачи ухода"]
  };
  const sourceAsIsPhotoExpectation = {
    sectionId: "ch5-anticipatory-efficient-driving",
    moduleSource: ch5AnticipatoryEfficientDrivingModuleSource,
    assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch5-anticipatory-efficient-driving/driving-culture-photo-source-as-is.jpg",
    sourceAssetPath: "content/validation/manual-guide/ch5-anticipatory-efficient-driving/page-103-driving-culture-photo-source-crop.jpg",
    assetCategory: "source-as-is-photo",
    assetKind: "high-resolution-original-source-photo-driving-culture-quote",
    width: 1500,
    height: 2200,
    sha256: "e0d17ff71479ddf0042720439bf4ff6c21ea156a71b561e5a59a4efa9baee4d6"
  };

  assert.match(ch5EqualSocietyModuleSource, /kind:\s*"source-image-cards"/u);
  assert.match(ch5EqualSocietyModuleSource, /mobility-context-transferred-infographic\.png/u);
  assert.match(ch5EqualSocietyModuleSource, /russianOverlayLabels[\s\S]*общественный транспорт[\s\S]*работа \/ учеба[\s\S]*задачи ухода/u);
  assert.doesNotMatch(ch5EqualSocietyModuleSource, /source-as-is-infographic/u);
  assert.match(ch5AnticipatoryEfficientDrivingModuleSource, /driving-culture-photo-source-as-is\.jpg/u);
  assert.match(ch5AnticipatoryEfficientDrivingModuleSource, /source-image-original-visible-text/u);

  const infographicSection = sectionById(transferredInfographicExpectation.sectionId);
  const infographicAsset = localAssetByPath(infographicSection, transferredInfographicExpectation.assetPath);
  assert.equal(infographicSection.implementationEvidence.visibleSpanishStatus, "none");
  assert.equal(infographicAsset.assetCategory, "source-transferred-infographic");
  assert.equal(infographicAsset.assetKind, transferredInfographicExpectation.assetKind);
  assert.equal(infographicAsset.visibleSpanish, false);
  assert.equal(infographicAsset.cleanupScope, "glyph-level-spanish-cleanup");
  assert.equal(infographicAsset.width, transferredInfographicExpectation.width);
  assert.equal(infographicAsset.height, transferredInfographicExpectation.height);
  assert.equal(infographicAsset.sha256, transferredInfographicExpectation.sha256);
  assert.equal(infographicAsset.runtimeDisplaySize.noUpscale, true);
  assert.equal(infographicAsset.infographicTransfer.sourceImageTransfer, true);
  assert.equal(infographicAsset.infographicTransfer.sourceAssetPath, transferredInfographicExpectation.sourceAssetPath);
  assert.equal(infographicAsset.infographicTransfer.sourceCropSha256, transferredInfographicExpectation.sourceSha256);
  assert.deepEqual(infographicAsset.infographicTransfer.sourceCropDimensions, {
    width: transferredInfographicExpectation.width,
    height: transferredInfographicExpectation.height
  });
  assert.equal(infographicAsset.infographicTransfer.noApproximateRedraw, true);
  assert.equal(infographicAsset.infographicTransfer.broadMaskPlatePatchStatus, "none");
  assert.equal(infographicAsset.infographicTransfer.cleanupMethod, "glyph-letter-level-background-restoration");
  assert.equal(infographicAsset.infographicTransfer.russianOverlayStrategy, "selectable-dom");
  assert.equal(infographicAsset.infographicTransfer.overlayTextSelectability, "selectable-dom-text");
  assert.deepEqual(infographicAsset.infographicTransfer.russianOverlayLabels.map((label) => label.textRu), transferredInfographicExpectation.expectedLabels);
  assert.equal(sha256File(infographicAsset.assetPath), transferredInfographicExpectation.sha256);
  assert.equal(sha256File(transferredInfographicExpectation.sourceAssetPath), transferredInfographicExpectation.sourceSha256);
  assert.notEqual(sha256File(infographicAsset.assetPath), sha256File(transferredInfographicExpectation.sourceAssetPath));

  const photoSection = sectionById(sourceAsIsPhotoExpectation.sectionId);
  const photoAsset = localAssetByPath(photoSection, sourceAsIsPhotoExpectation.assetPath);
  const exceptionPaths = photoSection.implementationEvidence.visibleSpanishStatus.exceptions.map((entry) => entry.assetPath);
  assert.equal(photoSection.implementationEvidence.visibleSpanishStatus.status, "source_image_exceptions_only");
  assert.equal(photoSection.implementationEvidence.visibleSpanishStatus.nonSignVisibleSpanishStatus, "source-image-only");
  assert.equal(exceptionPaths.includes(sourceAsIsPhotoExpectation.assetPath), true);
  assert.equal(photoAsset.assetCategory, sourceAsIsPhotoExpectation.assetCategory);
  assert.equal(photoAsset.assetKind, sourceAsIsPhotoExpectation.assetKind);
  assert.equal(photoAsset.visibleSpanish, true);
  assert.equal(photoAsset.cleanupScope, "none-source-as-is");
  assert.equal(photoAsset.width, sourceAsIsPhotoExpectation.width);
  assert.equal(photoAsset.height, sourceAsIsPhotoExpectation.height);
  assert.equal(photoAsset.sha256, sourceAsIsPhotoExpectation.sha256);
  assert.equal(photoAsset.runtimeDisplaySize.noUpscale, true);
  assert.equal(photoAsset.sourceIntegrity.sourceAsIs, true);
  assert.equal(photoAsset.sourceIntegrity.sourceAssetPath, sourceAsIsPhotoExpectation.sourceAssetPath);
  assert.equal(photoAsset.sourceIntegrity.noTranslationOrRelabeling, true);
  assert.equal(photoAsset.sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint, true);
  assert.equal(photoAsset.sourceIntegrity.russianExplanationOutsideImage, true);
  assert.equal(sha256File(photoAsset.assetPath), sourceAsIsPhotoExpectation.sha256);
  assert.equal(sha256File(sourceAsIsPhotoExpectation.sourceAssetPath), sourceAsIsPhotoExpectation.sha256);
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
  assert.match(appSource, /data-official-sign-exception=\{officialSignException\?\.kind\}/);
  assert.match(appSource, /data-source-image-exception=\{sourceImageException\?\.kind\}/);
  assert.match(appSource, /data-russian-overlay-strategy=\{card\.russianOverlayLabels \? "selectable-dom" : undefined\}/);
  assert.match(stylesSource, /\.manual-source-image-card-grid/);
  assert.match(stylesSource, /\.manual-source-image-overlay-label/);
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
    "manual-front-matter",
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

  assert.match(manualGuideSource, /import \{ frontPresentationSection \}/);
  assert.match(manualGuideSource, /import \{ frontCategoriesSection \}/);
  assert.match(manualGuideSource, /import \{ frontGlossarySection \}/);
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
  assert.match(manualGuideSource, /import \{ ch3PriorityOfRulesSection \}/);
  assert.match(manualGuideSource, /import \{ ch3RightOfWaySection \}/);
  assert.match(manualGuideSource, /import \{ ch3LightsSection \}/);
  assert.match(manualGuideSource, /import \{ ch3SpeedSection \}/);
  assert.match(manualGuideSource, /import \{ ch3TurnsSection \}/);
  assert.match(manualGuideSource, /import \{ ch3OvertakingSection \}/);
  assert.match(manualGuideSource, /import \{ ch3HighwaysSection \}/);
  assert.match(manualGuideSource, /import \{ ch3AdverseConditionsSection \}/);
  assert.match(manualGuideSource, /import \{ ch3StoppingParkingSection \}/);
  assert.match(manualGuideSource, /import \{ ch4AlcoholDrugsSection \}/);
  assert.match(manualGuideSource, /import \{ ch4SleepFatigueSection \}/);
  assert.match(manualGuideSource, /import \{ ch4StressSection \}/);
  assert.match(manualGuideSource, /import \{ ch4DistractionsSection \}/);
  assert.match(manualGuideSource, /import \{ ch5AttitudeTypesSection \}/);
  assert.match(manualGuideSource, /import \{ ch5EqualSocietySection \}/);
  assert.match(manualGuideSource, /import \{ ch5GenderViolencePreventionSection \}/);
  assert.match(manualGuideSource, /import \{ ch5AnticipatoryEfficientDrivingSection \}/);
  assert.match(manualGuideSource, /import \{ app1SafetyElementsSection \}/);
  assert.match(manualGuideSource, /import \{ app1OtherRequiredSafetyElementsSection \}/);
  assert.match(manualGuideSource, /import \{ app1RecommendedSafetyElementsSection \}/);
  assert.match(manualGuideSource, /import \{ app2SocialResponsibilitySection \}/);
  assert.match(manualGuideSource, /import \{ app2SafetyElementsSection \}/);
  assert.match(manualGuideSource, /import \{ app2DrivingFactorsSection \}/);
  assert.match(manualGuideSource, /import \{ app2SafeDrivingSection \}/);
  assert.match(manualGuideSource, /import \{ app2HighwaysHospitalsSection \}/);
  assert.match(manualGuideSource, /import \{ app3CargoDriverProfileSection \}/);
  assert.match(manualGuideSource, /import \{ app3SocialResponsibilitySection \}/);
  assert.match(manualGuideSource, /import \{ app3DrivingFactorsSection \}/);
  assert.match(manualGuideSource, /import \{ app3SafeDrivingSection \}/);
  assert.match(manualGuideSource, /import \{ app3SafetyElementsSection \}/);
  assert.match(manualGuideSource, /import \{ app3HighwaysSection \}/);
  assert.match(manualGuideSource, /import \{ app4SignsRegulatorySection \}/);
  assert.match(manualGuideSource, /import \{ app4SignsWarningSection \}/);
  assert.match(manualGuideSource, /import \{ app4SignsInformationalSection \}/);
  assert.match(manualGuideSource, /import \{ app4SignsTemporarySection \}/);
  assert.match(manualGuideSource, /import \{ app4SignsHorizontalSection \}/);
  assert.match(manualGuideSource, /import \{ app4SignsTrafficLightsSection \}/);
  assert.match(
    manualGuideSource,
    /implementedManualGuideSections:\s*ManualGuideSectionContent\[\]\s*=\s*\[\s*frontPresentationSection,\s*frontCategoriesSection,\s*frontGlossarySection,\s*ch1CitiesForPeopleSection,\s*ch1SustainableMobilitySection,\s*ch1PedestrianPrioritySection,\s*ch1BicycleSection,\s*ch1PublicTransportSystemSection,\s*ch1SharedTripSection,\s*ch2LegalResponsibilitySection,\s*ch2RequiredDocumentsSection,\s*ch2IncidentObligationsSection,\s*ch2ScoringSection,\s*ch3PriorityOfRulesSection,\s*ch3RightOfWaySection,\s*ch3LightsSection,\s*ch3SpeedSection,\s*ch3TurnsSection,\s*ch3OvertakingSection,\s*ch3HighwaysSection,\s*ch3AdverseConditionsSection,\s*ch3StoppingParkingSection,\s*ch4AlcoholDrugsSection,\s*ch4SleepFatigueSection,\s*ch4StressSection,\s*ch4DistractionsSection,\s*ch5AttitudeTypesSection,\s*ch5EqualSocietySection,\s*ch5GenderViolencePreventionSection,\s*ch5AnticipatoryEfficientDrivingSection,\s*app1SafetyElementsSection,\s*app1OtherRequiredSafetyElementsSection,\s*app1RecommendedSafetyElementsSection,\s*app2SocialResponsibilitySection,\s*app2SafetyElementsSection,\s*app2DrivingFactorsSection,\s*app2SafeDrivingSection,\s*app2HighwaysHospitalsSection,\s*app3CargoDriverProfileSection,\s*app3SocialResponsibilitySection,\s*app3DrivingFactorsSection,\s*app3SafeDrivingSection,\s*app3SafetyElementsSection,\s*app3HighwaysSection,\s*app4SignsRegulatorySection,\s*app4SignsWarningSection,\s*app4SignsInformationalSection,\s*app4SignsTemporarySection,\s*app4SignsHorizontalSection,\s*app4SignsTrafficLightsSection\s*\]/
  );
  assert.match(manualGuideSource, /manualGuideSectionContentById = new Map/);
  assert.match(manualGuideSource, /kind:\s*"table"/);
  assert.match(appSource, /manual-guide-table-scroll/);
  assert.match(stylesSource, /\.manual-guide-table-block/);
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
    "source-as-is-map",
    "source-as-is-document-example",
    "source-transferred-infographic",
    "source-transferred-diagram",
    "native-dom-text-only"
  ]) {
    assert.ok(evidence.strictVisualRulePolicy.assetCategories.includes(requiredCategory), `strict schema includes ${requiredCategory}`);
  }
  assert.equal(evidence.strictVisualRulePolicy.assetCategories.includes("source-as-is-infographic"), false);
  assert.deepEqual(evidence.strictVisualRulePolicy.protectedSourceAsIsCategories, [
    "source-as-is-photo",
    "source-as-is-traffic-sign",
    "source-as-is-road-marking"
  ]);
  assert.deepEqual(evidence.strictVisualRulePolicy.scopedSourceAsIsMapExceptions, [
    {
      sectionId: "app2-highways-hospitals",
      sourcePage: 150,
      assetPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-highways-hospitals/hospital-map-source-as-is.png",
      sourceAssetPath: "content/validation/manual-guide/app2-highways-hospitals/page-150-hospital-map-source-crop.png",
      ownerDecisionDate: "2026-06-04",
      scope: "page-150-hospital-map-only"
    }
  ]);
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
    "cleanupScope=glyph-level-spanish-cleanup",
    "infographicTransfer.cleanupMethod=glyph-letter-level-background-restoration when Spanish is removed",
    "infographicTransfer.russianOverlayStrategy=selectable-dom or selectable-svg",
    "infographicTransfer.russianOverlayLabels nonempty with percentage placement over cleaned infographic surface",
    "infographicTransfer.overlayTextSelectability=selectable-dom-text or selectable-svg-text"
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

test("Manual guide source-fidelity checker passes the section registry with front matter, Chapter 1, 2, 3, 4, 5, Appendix I, Appendix II, Appendix III, and Appendix IV implemented sections", () => {
  assert.equal(evidence.checkerId, "manual-guide-source-fidelity");
  assert.deepEqual(evidence.requiredSourcePageRange, { start: 1, end: 200 });
  assert.deepEqual(evidence.sharedSourcePageOwnership.map((entry) => entry.sourcePage), [55, 93, 94, 95, 99, 100, 101, 119]);
  assert.deepEqual(evidence.sharedPrereqExpectedOutput.skippedSourcePages, [1, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 43, 56, 57, 89, 98, 104, 152, 184]);
  assert.deepEqual(evidence.sharedPrereqExpectedOutput.skippedDividerPages, [21, 43, 57, 89, 98, 104, 152, 184]);
  assert.deepEqual(evidence.sharedPrereqExpectedOutput.omittedBookOnlyPages, [56]);
  assert.deepEqual(evidence.sharedPrereqExpectedOutput.sharedSourcePages, [55, 93, 94, 95, 99, 100, 101, 119]);
  assert.equal(evidence.sharedPrereqExpectedOutput.pendingSections, 0);
  assert.equal(evidence.sharedPrereqExpectedOutput.implementedSections, 50);
  const output = execFileSync(process.execPath, ["scripts/manual-guide-source-fidelity.mjs"], { encoding: "utf8" });
  const result = JSON.parse(output);
  assert.equal(result.status, "pass");
  assert.equal(result.pendingSections, 0);
  assert.deepEqual(result.sharedSourcePages, [55, 93, 94, 95, 99, 100, 101, 119]);
  assert.equal(result.implementedSections, 50);
  assert.deepEqual(result.skippedSourcePages, [1, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 43, 56, 57, 89, 98, 104, 152, 184]);
  assert.deepEqual(result.skippedDividerPages, [21, 43, 57, 89, 98, 104, 152, 184]);
  assert.deepEqual(result.omittedBookOnlyPages, [56]);
  assert.deepEqual(result.sharedSourcePages, [55, 93, 94, 95, 99, 100, 101, 119]);
  assert.equal(result.screenshotEvidence, "recorded_for_complete_front_matter_chapters_1_through_5_and_appendices_1_through_4_sections");
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
  assert.equal(result.implementedSections, 50);
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
    assert.equal(output.implementedSections, 50);
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

test("Manual guide source-fidelity checker rejects transferred infographics without Russian overlay labels", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-infographic-missing-russian-overlay-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      delete implementationEvidence.localAssetMetadata[0].infographicTransfer.russianOverlayLabels;
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when a strict transferred infographic omits Russian overlay labels");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(result.message, "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0].infographicTransfer is missing russianOverlayLabels");
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

test("Manual guide source-fidelity checker rejects source-as-is infographic as a strict category", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-strict-source-as-is-infographic-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      const infographicAsset = implementationEvidence.localAssetMetadata[0];
      infographicAsset.assetKind = "high-resolution-original-source-infographic";
      infographicAsset.assetCategory = "source-as-is-infographic";
      infographicAsset.visibleSpanish = true;
      infographicAsset.cleanupScope = "none-source-as-is";
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when an infographic tries to use a source-as-is category");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence localAssetMetadata[0].assetCategory must use the strict full-manual visual vocabulary"
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
    assert.equal(output.implementedSections, 50);
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

test("Manual guide source-fidelity checker rejects unapproved source-as-is map Spanish exceptions", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "manual-guide-unapproved-source-map-exception-"));
  try {
    const { implementedRegistryPath, moduleRoot, strictEvidencePath } = writeStrictFutureRegistryFixture(tempDir, (implementationEvidence) => {
      const mapAsset = implementationEvidence.localAssetMetadata[1];
      mapAsset.assetKind = "high-resolution-original-source-future-map";
      mapAsset.assetCategory = "source-as-is-map";
      mapAsset.sourceImageException = {
        kind: "source-image-original-visible-text",
        visibleSpanishScope: "source-image-only",
        sourceAsIs: true,
        russianExplanationOutsideImage: true,
        ownerDecisionDate: "2026-06-04",
        scope: "page-150-hospital-map-only"
      };
      implementationEvidence.visibleSpanishStatus.exceptions = [
        {
          assetPath: mapAsset.assetPath,
          kind: "source-image-original-visible-text",
          visibleSpanishScope: "source-image-only",
          sourceAsIs: true,
          russianExplanationOutsideImage: true,
          ownerDecisionDate: "2026-06-04",
          scope: "page-150-hospital-map-only"
        }
      ];
    });
    const failure = runCheckerWithFixture(implementedRegistryPath, moduleRoot, strictEvidencePath);
    assert.notEqual(failure.status, 0, "checker must fail when an unrelated map self-certifies the page-150 exception");
    const result = JSON.parse(failure.stderr);
    assert.equal(result.status, "fail");
    assert.equal(
      result.message,
      "ch1-pedestrian-priority implementationEvidence localAssetMetadata[1].assetPath must match an approved source-as-is map exception"
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("Manual guide source-fidelity checker rejects approved source-as-is map evidence with mismatched page or scope", () => {
  const cases = [
    {
      name: "page",
      mutate: (implementationEvidence) => {
        const sourceRegion = implementationEvidence.sourceRegionMetadata.find((entry) =>
          entry.sourceAssetPath === "content/validation/manual-guide/app2-highways-hospitals/page-150-hospital-map-source-crop.png"
        );
        sourceRegion.sourcePage = 149;
      },
      expectedMessage:
        "app2-highways-hospitals implementationEvidence localAssetMetadata[1].sourceRegionMetadata.sourcePage must match approved source-as-is map page"
    },
    {
      name: "scope",
      mutate: (implementationEvidence) => {
        const mapAsset = implementationEvidence.localAssetMetadata.find((entry) => entry.assetCategory === "source-as-is-map");
        mapAsset.sourceImageException.scope = "future-map-self-certified";
      },
      expectedMessage:
        "app2-highways-hospitals implementationEvidence localAssetMetadata[1].sourceImageException.scope must match approved source-as-is map scope"
    }
  ];

  for (const testCase of cases) {
    const tempDir = mkdtempSync(join(tmpdir(), `manual-guide-approved-source-map-${testCase.name}-mismatch-`));
    try {
      const registryFixture = JSON.parse(JSON.stringify(registry));
      const app2HighwaysHospitals = registryFixture.sections.find((entry) => entry.id === "app2-highways-hospitals");
      testCase.mutate(app2HighwaysHospitals.implementationEvidence);
      const implementedRegistryPath = join(tempDir, "section-registry.map-scope-fixture.json");
      writeFileSync(implementedRegistryPath, JSON.stringify(registryFixture, null, 2));
      const failure = runCheckerWithFixture(implementedRegistryPath, "src/data/manual-sections");
      assert.notEqual(failure.status, 0, `checker must fail when approved map ${testCase.name} evidence mismatches`);
      const result = JSON.parse(failure.stderr);
      assert.equal(result.status, "fail");
      assert.equal(result.message, testCase.expectedMessage);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
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
