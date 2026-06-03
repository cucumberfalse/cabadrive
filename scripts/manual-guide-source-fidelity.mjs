import { createHash } from "node:crypto";
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

function isOfficialTrafficSignSourceAsIsException(entry) {
  return (
    entry.visibleSpanish === true &&
    entry.assetKind === "official-traffic-sign-source-as-is" &&
    isObject(entry.officialSignException) &&
    entry.officialSignException.kind === "official-traffic-sign-source-as-is" &&
    entry.officialSignException.visibleSpanishScope === "official-sign-image-only" &&
    entry.officialSignException.sourceAsIs === true
  );
}

function isOriginalSourceImageVisibleTextException(entry) {
  return (
    entry.visibleSpanish === true &&
    typeof entry.assetKind === "string" &&
    entry.assetKind.startsWith("high-resolution-original-source-") &&
    isObject(entry.sourceImageException) &&
    entry.sourceImageException.kind === "source-image-original-visible-text" &&
    entry.sourceImageException.visibleSpanishScope === "source-image-only" &&
    entry.sourceImageException.sourceAsIs === true &&
    entry.sourceImageException.russianExplanationOutsideImage === true
  );
}

function validateVisibleSpanishException(exception, messagePrefix) {
  if (exception.kind === "official-traffic-sign-source-as-is") {
    assertCondition(exception.visibleSpanishScope === "official-sign-image-only", `${messagePrefix}.visibleSpanishScope must be official-sign-image-only`, exception);
    assertCondition(exception.sourceAsIs === true, `${messagePrefix}.sourceAsIs must be true`, exception);
    assertLocalPathExists(exception.assetPath, `${messagePrefix}.assetPath`, exception);
    return;
  }
  if (exception.kind === "source-image-original-visible-text") {
    assertCondition(exception.visibleSpanishScope === "source-image-only", `${messagePrefix}.visibleSpanishScope must be source-image-only`, exception);
    assertCondition(exception.sourceAsIs === true, `${messagePrefix}.sourceAsIs must be true`, exception);
    assertCondition(exception.russianExplanationOutsideImage === true, `${messagePrefix}.russianExplanationOutsideImage must be true`, exception);
    assertLocalPathExists(exception.assetPath, `${messagePrefix}.assetPath`, exception);
    return;
  }
  assertCondition(false, `${messagePrefix}.kind must be an allowed visible-Spanish source-image exception`, exception);
}

function validateOfficialTrafficSignException(exception, messagePrefix) {
  assertCondition(exception.kind === "official-traffic-sign-source-as-is", `${messagePrefix}.kind must be official-traffic-sign-source-as-is`, exception);
  assertCondition(exception.visibleSpanishScope === "official-sign-image-only", `${messagePrefix}.visibleSpanishScope must be official-sign-image-only`, exception);
  assertCondition(exception.sourceAsIs === true, `${messagePrefix}.sourceAsIs must be true`, exception);
  assertLocalPathExists(exception.assetPath, `${messagePrefix}.assetPath`, exception);
}

const legacyVisualEvidenceSectionIds = new Set([
  "ch1-cities-for-people",
  "ch1-sustainable-mobility",
  "ch1-pedestrian-priority",
  "ch1-bicycle",
  "ch1-public-transport-system",
  "ch1-shared-trip"
]);
const strictImageAssetCategories = new Set([
  "source-as-is-photo",
  "source-as-is-traffic-sign",
  "source-as-is-road-marking",
  "source-transferred-infographic",
  "source-transferred-diagram"
]);
const protectedSourceAsIsCategories = new Set(["source-as-is-photo", "source-as-is-traffic-sign", "source-as-is-road-marking"]);
const strictNonImageAssetCategories = new Set(["native-dom-text-only", "reference-only-not-runtime"]);
const highResolutionTargets = new Set(["x5-zoom-source-export", "source-native-equivalent-or-better", "higher-resolution-direct-export"]);
const forbiddenStrictVisualTerms = [
  "approximate-redraw",
  "redrawn-infographic",
  "reconstructed-infographic",
  "redrawn-diagram",
  "reconstructed-diagram",
  "generic-icon-replacement",
  "translated-sign",
  "translated-road-marking",
  "recolored-sign",
  "retouched-photo",
  "masked-photo",
  "inpainted-photo",
  "broad-mask",
  "large-patch",
  "opaque-label-background",
  "dom-plate",
  "backing-rectangle"
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function forbiddenStrictVisualTermPattern(term) {
  return new RegExp(`\\b${term.split("-").map(escapeRegExp).join("[\\s_-]+")}\\b`, "iu");
}

const forbiddenStrictVisualTermPatterns = forbiddenStrictVisualTerms.map((term) => ({
  term,
  pattern: forbiddenStrictVisualTermPattern(term)
}));
const forbiddenStrictVisualTermIgnoredKeys = new Set([
  "assetPath",
  "sourceAssetPath",
  "desktopScreenshot",
  "mobileScreenshot",
  "sha256",
  "cropSha256",
  "id",
  "sectionId"
]);

function isLegacyVisualEvidenceAllowed(section, evidence, implementedEvidence) {
  const policy = evidence.strictVisualRulePolicy;
  if (policy?.legacyBaselineSectionIds?.includes(section.id) !== true || !legacyVisualEvidenceSectionIds.has(section.id)) return false;
  const expectedEvidenceFingerprint = policy.legacyBaselineEvidenceFingerprints?.[section.id];
  const expectedStateFingerprint = policy.legacyBaselineStateFingerprints?.[section.id];
  if (typeof expectedEvidenceFingerprint !== "string" || typeof expectedStateFingerprint !== "string") return false;
  return sha256Json(implementedEvidence) === expectedEvidenceFingerprint && legacyBaselineStateFingerprint(section, implementedEvidence) === expectedStateFingerprint;
}

function isStrictVisualEvidenceRequired(section, evidence, implementedEvidence) {
  return evidence.strictVisualRulePolicy?.enforcement === "all-new-manual-units" && !isLegacyVisualEvidenceAllowed(section, evidence, implementedEvidence);
}

function isStrictVisualEvidenceOptIn(implementedEvidence) {
  return implementedEvidence.visualEvidenceSchemaVersion === 3 || implementedEvidence.visualRulePolicyId === "031-strict-source-fidelity";
}

function isStrictProtectedSourceAsIsException(entry) {
  return (
    entry.visibleSpanish === true &&
    protectedSourceAsIsCategories.has(entry.assetCategory) &&
    isObject(entry.sourceIntegrity) &&
    entry.sourceIntegrity.sourceAsIs === true &&
    entry.sourceIntegrity.noTranslationOrRelabeling === true &&
    entry.sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint === true &&
    entry.sourceIntegrity.russianExplanationOutsideImage === true
  );
}

function visibleSpanishStatusExceptionAssetPaths(value, assetCategory) {
  if (!isObject(value) || !Array.isArray(value.exceptions)) return new Set();
  const isTrafficSign = assetCategory === "source-as-is-traffic-sign";
  const allowedStatuses = isTrafficSign ? new Set(["official_traffic_sign_exception_only", "source_image_exceptions_only"]) : new Set(["source_image_exceptions_only"]);
  if (!allowedStatuses.has(value.status)) return new Set();
  const expectedKind = isTrafficSign ? "official-traffic-sign-source-as-is" : "source-image-original-visible-text";
  return new Set(
    value.exceptions
      .filter((exception) => exception.kind === expectedKind)
      .map((exception) => exception.assetPath)
      .filter((assetPath) => typeof assetPath === "string" && assetPath.length > 0)
  );
}

function collectForbiddenStrictVisualText(value, key = "") {
  if (typeof value === "string") return forbiddenStrictVisualTermIgnoredKeys.has(key) ? [] : [value];
  if (Array.isArray(value)) return value.flatMap((entry) => collectForbiddenStrictVisualText(entry));
  if (isObject(value)) return Object.entries(value).flatMap(([entryKey, entryValue]) => collectForbiddenStrictVisualText(entryValue, entryKey));
  return [];
}

function assertNoForbiddenStrictVisualTerms(value, messagePrefix) {
  const serialized = collectForbiddenStrictVisualText(value).join("\n");
  for (const { term, pattern } of forbiddenStrictVisualTermPatterns) {
    assertCondition(!pattern.test(serialized), `${messagePrefix} must not record forbidden visual-edit term ${term}`, value);
  }
}

function validateSha256(value, messagePrefix) {
  assertCondition(/^[a-f0-9]{64}$/u.test(value), `${messagePrefix} must be a SHA-256 hash`, { value });
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function validateFileSha256(path, expectedSha256, messagePrefix, details = {}) {
  validateSha256(expectedSha256, messagePrefix);
  assertLocalPathExists(path, `${messagePrefix} referenced artifact`, details);
  const actualSha256 = sha256File(path);
  assertCondition(actualSha256 === expectedSha256, `${messagePrefix} must match referenced artifact bytes`, {
    ...details,
    path,
    actualSha256,
    expectedSha256
  });
}

function fileSha256IfPresent(path) {
  if (typeof path !== "string" || path.length === 0 || !existsSync(path)) return null;
  return sha256File(path);
}

function visualArtifactHashRecords(value, pathField) {
  const entries = Array.isArray(value) ? value : isObject(value) ? [value] : [];
  return entries.map((entry, index) => ({
    index,
    path: entry[pathField],
    sha256: fileSha256IfPresent(entry[pathField])
  }));
}

function legacyBaselineStateFingerprint(section, implementedEvidence) {
  const modulePath = resolveSectionContentModulePath(section.sectionContentModulePath);
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

function validateExtractionScaleEvidence(value, messagePrefix) {
  assertRequiredFields(value, ["target", "method", "outputDimensions"], messagePrefix);
  assertCondition(highResolutionTargets.has(value.target), `${messagePrefix}.target must be x5 or equivalent/better`, value);
  assertCondition(typeof value.method === "string" && value.method.length > 0, `${messagePrefix}.method must describe the export method`, value);
  assertRequiredFields(value.outputDimensions, ["width", "height"], `${messagePrefix}.outputDimensions`);
  assertCondition(value.outputDimensions.width > 0 && value.outputDimensions.height > 0, `${messagePrefix}.outputDimensions must be positive`, value);
  if ("sha256" in value) {
    validateSha256(value.sha256, `${messagePrefix}.sha256`);
  }
}

function validateRuntimeDisplaySize(asset, messagePrefix) {
  assertRequiredFields(asset.runtimeDisplaySize, ["maxWidthCssPx", "noUpscale"], `${messagePrefix}.runtimeDisplaySize`);
  assertCondition(asset.runtimeDisplaySize.noUpscale === true, `${messagePrefix}.runtimeDisplaySize.noUpscale must be true`, asset);
  assertCondition(asset.runtimeDisplaySize.maxWidthCssPx > 0, `${messagePrefix}.runtimeDisplaySize.maxWidthCssPx must be positive`, asset);
  assertCondition(asset.width >= asset.runtimeDisplaySize.maxWidthCssPx, `${messagePrefix}.width must be at least runtime max display width`, asset);
  if ("maxHeightCssPx" in asset.runtimeDisplaySize) {
    assertCondition(asset.runtimeDisplaySize.maxHeightCssPx > 0, `${messagePrefix}.runtimeDisplaySize.maxHeightCssPx must be positive`, asset);
    assertCondition(asset.height >= asset.runtimeDisplaySize.maxHeightCssPx, `${messagePrefix}.height must be at least runtime max display height`, asset);
  }
}

function validateProtectedSourceAsIsAsset(asset, messagePrefix) {
  assertRequiredFields(
    asset.sourceIntegrity,
    ["sourceAsIs", "noTranslationOrRelabeling", "noRedrawRecolorCleanupRetouchMaskInpaint", "russianExplanationOutsideImage"],
    `${messagePrefix}.sourceIntegrity`
  );
  assertCondition(asset.sourceIntegrity.sourceAsIs === true, `${messagePrefix}.sourceIntegrity.sourceAsIs must be true`, asset);
  assertCondition(asset.sourceIntegrity.noTranslationOrRelabeling === true, `${messagePrefix}.sourceIntegrity.noTranslationOrRelabeling must be true`, asset);
  assertCondition(
    asset.sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint === true,
    `${messagePrefix}.sourceIntegrity.noRedrawRecolorCleanupRetouchMaskInpaint must be true`,
    asset
  );
  assertCondition(asset.sourceIntegrity.russianExplanationOutsideImage === true, `${messagePrefix}.sourceIntegrity.russianExplanationOutsideImage must be true`, asset);
  assertCondition(asset.cleanupScope === "none-source-as-is", `${messagePrefix}.cleanupScope must be none-source-as-is`, asset);
}

function validateTransferredInfographicAsset(asset, messagePrefix) {
  assertRequiredFields(
    asset.infographicTransfer,
    ["sourceImageTransfer", "noApproximateRedraw", "broadMaskPlatePatchStatus", "russianOverlayStrategy"],
    `${messagePrefix}.infographicTransfer`
  );
  assertCondition(asset.infographicTransfer.sourceImageTransfer === true, `${messagePrefix}.infographicTransfer.sourceImageTransfer must be true`, asset);
  assertCondition(asset.infographicTransfer.noApproximateRedraw === true, `${messagePrefix}.infographicTransfer.noApproximateRedraw must be true`, asset);
  assertCondition(asset.infographicTransfer.broadMaskPlatePatchStatus === "none", `${messagePrefix}.infographicTransfer.broadMaskPlatePatchStatus must be none`, asset);
  assertCondition(
    asset.infographicTransfer.russianOverlayStrategy === "selectable-dom" || asset.infographicTransfer.russianOverlayStrategy === "selectable-svg",
    `${messagePrefix}.infographicTransfer.russianOverlayStrategy must be selectable DOM/SVG`,
    asset
  );
  assertCondition(
    asset.cleanupScope === "glyph-level-spanish-cleanup" || asset.cleanupScope === "none-source-as-is",
    `${messagePrefix}.cleanupScope must be glyph-level-spanish-cleanup or none-source-as-is`,
    asset
  );
  if (asset.cleanupScope === "glyph-level-spanish-cleanup") {
    assertCondition(
      asset.infographicTransfer.cleanupMethod === "glyph-letter-level-background-restoration",
      `${messagePrefix}.infographicTransfer.cleanupMethod must be glyph-letter-level-background-restoration`,
      asset
    );
  }
}

function validateTransferredDiagramAsset(asset, messagePrefix) {
  assertRequiredFields(
    asset.diagramTransfer,
    ["sourceDiagramTransfer", "noApproximateRedraw", "noReconstruction", "noGenericIconReplacement", "broadMaskPlatePatchStatus"],
    `${messagePrefix}.diagramTransfer`
  );
  assertCondition(asset.diagramTransfer.sourceDiagramTransfer === true, `${messagePrefix}.diagramTransfer.sourceDiagramTransfer must be true`, asset);
  assertCondition(asset.diagramTransfer.noApproximateRedraw === true, `${messagePrefix}.diagramTransfer.noApproximateRedraw must be true`, asset);
  assertCondition(asset.diagramTransfer.noReconstruction === true, `${messagePrefix}.diagramTransfer.noReconstruction must be true`, asset);
  assertCondition(asset.diagramTransfer.noGenericIconReplacement === true, `${messagePrefix}.diagramTransfer.noGenericIconReplacement must be true`, asset);
  assertCondition(asset.diagramTransfer.broadMaskPlatePatchStatus === "none", `${messagePrefix}.diagramTransfer.broadMaskPlatePatchStatus must be none`, asset);
  assertCondition(
    asset.cleanupScope === "glyph-level-spanish-cleanup" || asset.cleanupScope === "none-source-as-is",
    `${messagePrefix}.cleanupScope must be glyph-level-spanish-cleanup or none-source-as-is`,
    asset
  );
  if (asset.cleanupScope === "glyph-level-spanish-cleanup") {
    assertCondition(
      asset.diagramTransfer.cleanupMethod === "glyph-letter-level-background-restoration",
      `${messagePrefix}.diagramTransfer.cleanupMethod must be glyph-letter-level-background-restoration`,
      asset
    );
  }
}

function validateStrictVisualEvidence(implementedEvidence, messagePrefix) {
  assertCondition(implementedEvidence.visualEvidenceSchemaVersion === 3, `${messagePrefix}.visualEvidenceSchemaVersion must be 3 for new manual units`, implementedEvidence);
  assertCondition(implementedEvidence.visualRulePolicyId === "031-strict-source-fidelity", `${messagePrefix}.visualRulePolicyId must be 031-strict-source-fidelity`, implementedEvidence);
  assertCondition(
    implementedEvidence.highResolutionEvidenceStatus === "x5-or-equivalent-no-upscale-recorded",
    `${messagePrefix}.highResolutionEvidenceStatus must prove x5/equivalent extraction and no runtime upscaling`,
    implementedEvidence
  );
  assertNoForbiddenStrictVisualTerms(implementedEvidence.visualReviewNotes, `${messagePrefix}.visualReviewNotes`);

  validateObjectOrArray(
    implementedEvidence.sourceRegionMetadata,
    ["sourcePage", "sourceRegion", "sourceAssetPath", "cropDimensions", "cropSha256", "cleanupScope", "extractionScaleEvidence"],
    `${messagePrefix} sourceRegionMetadata`,
    (entry, label) => {
      validateFileSha256(entry.sourceAssetPath, entry.cropSha256, `${label}.cropSha256`, entry);
      validateExtractionScaleEvidence(entry.extractionScaleEvidence, `${label}.extractionScaleEvidence`);
      assertNoForbiddenStrictVisualTerms(entry, label);
    }
  );

  validateObjectOrArray(
    implementedEvidence.localAssetMetadata,
    ["assetPath", "assetKind", "assetCategory", "containsText", "visibleSpanish"],
    `${messagePrefix} localAssetMetadata`,
    (asset, label) => {
      const allowedCategory = strictImageAssetCategories.has(asset.assetCategory) || strictNonImageAssetCategories.has(asset.assetCategory);
      assertCondition(allowedCategory, `${label}.assetCategory must use the strict full-manual visual vocabulary`, asset);
      assertNoForbiddenStrictVisualTerms(asset, label);
      if (strictImageAssetCategories.has(asset.assetCategory)) {
        assertRequiredFields(asset, ["width", "height", "sha256", "runtimeDisplaySize"], label);
        validateFileSha256(asset.assetPath, asset.sha256, `${label}.sha256`, asset);
        validateExtractionScaleEvidence(asset.extractionScaleEvidence, `${label}.extractionScaleEvidence`);
        validateRuntimeDisplaySize(asset, label);
      }
      if (protectedSourceAsIsCategories.has(asset.assetCategory)) {
        validateProtectedSourceAsIsAsset(asset, label);
        if (asset.visibleSpanish === true) {
          const visibleSpanishExceptionAssetPaths = visibleSpanishStatusExceptionAssetPaths(implementedEvidence.visibleSpanishStatus, asset.assetCategory);
          assertCondition(
            visibleSpanishExceptionAssetPaths.has(asset.assetPath),
            `${label}.visibleSpanish=true must be recorded in visibleSpanishStatus.exceptions`,
            asset
          );
        }
      }
      if (asset.assetCategory === "source-transferred-infographic") validateTransferredInfographicAsset(asset, label);
      if (asset.assetCategory === "source-transferred-diagram") validateTransferredDiagramAsset(asset, label);
    }
  );
}

function validateNoVisibleSpanishStatus(value, messagePrefix) {
  const allowedStatuses = new Set(["pass", "none", "no_visible_spanish", "no-visible-spanish"]);
  const status = isObject(value) && "status" in value ? value.status : value;
  if (allowedStatuses.has(status)) return;
  if (status === "official_traffic_sign_exception_only") {
    assertCondition(isObject(value), `${messagePrefix} official traffic sign exception must be an object`, { value });
    assertCondition(value.nonSignVisibleSpanishStatus === "none", `${messagePrefix}.nonSignVisibleSpanishStatus must be none`, { value });
    assertCondition(Array.isArray(value.exceptions) && value.exceptions.length > 0, `${messagePrefix}.exceptions must name the official sign exception`, { value });
    for (const [index, exception] of value.exceptions.entries()) validateOfficialTrafficSignException(exception, `${messagePrefix}.exceptions[${index}]`);
    return;
  }
  if (status === "source_image_exceptions_only") {
    assertCondition(isObject(value), `${messagePrefix} source-image exception must be an object`, { value });
    assertCondition(value.nonSignVisibleSpanishStatus === "source-image-only", `${messagePrefix}.nonSignVisibleSpanishStatus must be source-image-only`, { value });
    assertCondition(Array.isArray(value.exceptions) && value.exceptions.length > 0, `${messagePrefix}.exceptions must name the source-image exceptions`, { value });
    for (const [index, exception] of value.exceptions.entries()) validateVisibleSpanishException(exception, `${messagePrefix}.exceptions[${index}]`);
    return;
  }
  assertCondition(false, `${messagePrefix} must record no visible Spanish text or source-image-only exceptions`, { value });
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

function uniqueInOrder(values) {
  return values.filter((value, index) => values.indexOf(value) === index);
}

function duplicatedValues(values) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value)
    .sort((a, b) => a - b);
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (isObject(value)) {
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

function compareJson(actual, expected, message, details = {}) {
  assertCondition(JSON.stringify(actual) === JSON.stringify(expected), message, { ...details, actual, expected });
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
  const validateStrictEvidence = isStrictVisualEvidenceRequired(section, evidence, implementedEvidence) || isStrictVisualEvidenceOptIn(implementedEvidence);
  assertCondition(implementedEvidence.sectionId === id, `${id} implementationEvidence.sectionId must match the registry entry`, implementedEvidence);
  assertCondition(
    JSON.stringify(implementedEvidence.sourcePages) === JSON.stringify(sectionSourcePages(section)),
    `${id} implementationEvidence.sourcePages must match the registry entry`,
    implementedEvidence
  );
  assertCondition(implementedEvidence.checkerResult === "pass", `${id} implementationEvidence.checkerResult must be pass`, implementedEvidence);
  if (validateStrictEvidence) {
    validateStrictVisualEvidence(implementedEvidence, `${id} implementationEvidence`);
  }

  const allowedSourcePages = new Set(sectionSourcePages(section));
  validateObjectOrArray(implementedEvidence.sourceRegionMetadata, format.sourceRegionMetadataFields, `${id} sourceRegionMetadata`, (entry, label) => {
    assertCondition(allowedSourcePages.has(entry.sourcePage), `${label}.sourcePage must belong to the section source range`, entry);
    assertLocalPathExists(entry.sourceAssetPath, `${label}.sourceAssetPath`, entry);
  });
  const localAssetMetadataFields = validateStrictEvidence
    ? ["assetPath", "assetKind", "assetCategory", "containsText", "visibleSpanish"]
    : format.localAssetMetadataFields;
  validateObjectOrArray(implementedEvidence.localAssetMetadata, localAssetMetadataFields, `${id} localAssetMetadata`, (entry, label) => {
    assertLocalPathExists(entry.assetPath, `${label}.assetPath`, entry);
    if (entry.visibleSpanish === false) return;
    assertCondition(
      isOfficialTrafficSignSourceAsIsException(entry) ||
        isOriginalSourceImageVisibleTextException(entry) ||
        (validateStrictEvidence && isStrictProtectedSourceAsIsException(entry)),
      `${label}.visibleSpanish=true requires an explicit source-image-only exception`,
      entry
    );
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

function validateSharedSourcePageOwnership(registry, evidence, coveredSourcePages) {
  const sharedOwnership = evidence.sharedSourcePageOwnership ?? [];
  const expectedSharedSourcePages = sharedOwnership.map((entry) => entry.sourcePage).sort((a, b) => a - b);
  const duplicateCoveredSourcePages = duplicatedValues(coveredSourcePages);
  compareJson(
    duplicateCoveredSourcePages,
    expectedSharedSourcePages,
    "Duplicate section source pages must be explicitly declared as shared source-page ownership",
    { duplicateCoveredSourcePages }
  );

  for (const sharedEntry of sharedOwnership) {
    assertRequiredFields(sharedEntry, ["sourcePage", "referenceAsset", "reason", "sectionBoundaries"], `sharedSourcePageOwnership ${sharedEntry.sourcePage}`);
    assertLocalPathExists(sharedEntry.referenceAsset, `shared source page ${sharedEntry.sourcePage} referenceAsset`, sharedEntry);
    assertCondition(sharedEntry.reason === "source-page-contains-two-source-index-topics", `shared source page ${sharedEntry.sourcePage} must explain the Índice-topic split`, sharedEntry);
    assertCondition(Array.isArray(sharedEntry.sectionBoundaries) && sharedEntry.sectionBoundaries.length > 1, `shared source page ${sharedEntry.sourcePage} must name all owning sections`, sharedEntry);

    const actualSectionIds = registry.sections
      .filter((section) => sectionSourcePages(section).includes(sharedEntry.sourcePage))
      .map((section) => section.id);
    const expectedSectionIds = sharedEntry.sectionBoundaries.map((boundary) => boundary.sectionId);
    compareJson(actualSectionIds, expectedSectionIds, `shared source page ${sharedEntry.sourcePage} owning sections must match evidence`);

    for (const boundary of sharedEntry.sectionBoundaries) {
      assertRequiredFields(boundary, ["sectionId", "ownedRegion", "ownedLayoutBlockIdsOnSharedPage"], `sharedSourcePageOwnership ${sharedEntry.sourcePage} boundary`);
      assertCondition(Array.isArray(boundary.ownedLayoutBlockIdsOnSharedPage) && boundary.ownedLayoutBlockIdsOnSharedPage.length > 0, `${boundary.sectionId} shared-page boundary must name owned layout blocks`, boundary);

      const section = registry.sections.find((entry) => entry.id === boundary.sectionId);
      assertCondition(Boolean(section), `${boundary.sectionId} shared-page boundary must reference an existing section`, boundary);
      assertCondition(sectionSourcePages(section).includes(sharedEntry.sourcePage), `${boundary.sectionId} must include shared source page ${sharedEntry.sourcePage}`, section);

      const sectionBoundary = section.sourceBoundaryEvidence;
      assertRequiredFields(
        sectionBoundary,
        ["sharedSourcePage", "ownedRegion", "ownedLayoutBlockIdsOnSharedPage", "boundaryEvidence"],
        `${boundary.sectionId} sourceBoundaryEvidence`
      );
      assertCondition(sectionBoundary.sharedSourcePage === sharedEntry.sourcePage, `${boundary.sectionId} sourceBoundaryEvidence.sharedSourcePage must match shared ownership`, sectionBoundary);
      assertCondition(sectionBoundary.ownedRegion === boundary.ownedRegion, `${boundary.sectionId} sourceBoundaryEvidence.ownedRegion must match shared ownership`, sectionBoundary);
      compareJson(
        sectionBoundary.ownedLayoutBlockIdsOnSharedPage,
        boundary.ownedLayoutBlockIdsOnSharedPage,
        `${boundary.sectionId} sourceBoundaryEvidence owned blocks must match shared ownership`
      );
      for (const optionalBoundaryField of ["startsAtLayoutBlockId", "startsAtSourceTextEs", "endsBeforeLayoutBlockId", "excludesSectionId", "omittedClosingSourcePage"]) {
        if (optionalBoundaryField in boundary) {
          assertCondition(
            sectionBoundary[optionalBoundaryField] === boundary[optionalBoundaryField],
            `${boundary.sectionId} sourceBoundaryEvidence.${optionalBoundaryField} must match shared ownership`,
            { sectionBoundary, boundary }
          );
        }
      }
      assertCondition(typeof sectionBoundary.boundaryEvidence === "string" && sectionBoundary.boundaryEvidence.length > 0, `${boundary.sectionId} sourceBoundaryEvidence must include a source-backed note`, sectionBoundary);
    }
  }
}

function validateSectionRegistry(registry, evidence) {
  assertCondition(registry.schemaVersion === 2, "Manual guide section registry schemaVersion must be 2");
  assertCondition(registry.manualId === "gcba-manual-vehiculo-4-ruedas-2023", "Manual guide registry must target the GCBA 4-wheel manual");
  assertCondition(registry.featureId === evidence.featureId, "Manual guide registry and evidence feature ids must match");
  compareJson(registry.sourcePageRange, evidence.requiredSourcePageRange, "Manual guide source page range must match evidence");

  assertCondition(!("pages" in registry), "Manual guide registry must not expose a raw source-PDF-page pages array");
  assertCondition(registry.sections.length === evidence.expectedSectionIds.length, "Manual guide registry must contain exactly one entry per expected source Índice section", {
    expected: evidence.expectedSectionIds.length,
    actual: registry.sections.length
  });

  const skippedSourcePages = new Set(evidence.skippedSourcePages.map((entry) => entry.sourcePage));
  compareJson(
    registry.skippedSourcePages.map((entry) => ({ sourcePage: entry.sourcePage, reason: entry.reason })).sort((a, b) => a.sourcePage - b.sourcePage),
    evidence.skippedSourcePages.map((entry) => ({ sourcePage: entry.sourcePage, reason: entry.reason })).sort((a, b) => a.sourcePage - b.sourcePage),
    "Skipped source pages must match evidence"
  );

  const sectionIds = registry.sections.map((section) => section.id);
  compareJson(sectionIds, evidence.expectedSectionIds, "Manual guide sections must stay in source Índice order");

  const coveredSourcePages = [];
  for (const section of registry.sections) {
    const id = section.id;
    const expectedRange = evidence.expectedSectionRanges[id];
    assertCondition(Boolean(expectedRange), `${id} must be an expected source Índice section`, section);
    compareJson(section.sourcePageRange, expectedRange, `${id} sourcePageRange must match source Índice metadata`);
    assertCondition(section.routeHash === `#manual-section-${id}`, `${id} must reserve a section route hash, not a raw page hash`, section);
    assertCondition(section.sectionContentModulePath === `src/data/manual-sections/${id}.ts`, `${id} must reserve a section-local future content module path`, section);
    assertCondition(!/^manual-page-\d{3}$/u.test(id), `${id} must not use a raw source PDF page id`, section);
    assertCondition(!section.routeHash.startsWith("#manual-page-"), `${id} routeHash must not expose a raw source PDF page route`, section);
    assertCondition(!section.sectionContentModulePath.includes("src/data/manual-pages/"), `${id} module path must not use the page-local module namespace`, section);

    const sourcePages = sourcePagesForRange(section.sourcePageRange.start, section.sourcePageRange.end);
    compareJson(sectionSourcePages(section), sourcePages, `${id} sourcePages must enumerate the full source range`);
    for (const sourcePage of sourcePages) {
      assertCondition(!skippedSourcePages.has(sourcePage), `${id} must not include skipped non-section source page ${sourcePage}`, section);
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
  compareJson(uniqueInOrder(coveredSourcePages), expectedCoveredPages, "Section registry must cover every non-skipped source page in the required range as section source metadata", {
    coveredSourcePages,
    expectedCoveredPages
  });
  validateSharedSourcePageOwnership(registry, evidence, coveredSourcePages);

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
    skippedSourcePages: registry.skippedSourcePages.map((entry) => entry.sourcePage),
    skippedDividerPages: registry.skippedSourcePages.filter((entry) => entry.reason === "chapter-divider-only").map((entry) => entry.sourcePage),
    omittedBookOnlyPages: registry.skippedSourcePages.filter((entry) => entry.reason === "chapter-closing-slogan-only").map((entry) => entry.sourcePage),
    sharedSourcePages: (evidence.sharedSourcePageOwnership ?? []).map((entry) => entry.sourcePage),
    forbiddenPatternRules: evidence.forbiddenPatterns.length,
    screenshotEvidence: evidence.sharedPrereqExpectedOutput.screenshotEvidence,
    sourceCropEvidence: evidence.sharedPrereqExpectedOutput.sourceCropEvidence,
    strictVisualRulePolicy: evidence.strictVisualRulePolicy?.id ?? null
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
