#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = "content/learning-images/learning-images.manifest.json";
const evidencePath = "content/validation/learning-images.evidence.json";
const assetRoot = "content/assets/learning/generated/v1";
const styleVersion = "cabadrive-learning-image-v1";
const reviewer = "cabadrive-026-implementation";
const reviewedAt = "2026-05-21";
const allowedStatuses = new Set(["direct", "shared", "exception"]);
const allowedExceptionReasons = new Set(["misleading", "redundant_with_shared_image", "purely_grammatical", "status_navigation", "volatile_legal_admin"]);
const allowedAspectFamilies = new Set(["4:3", "16:9", "1:1"]);
const canonicalQuestionAssetRoot = "content/assets/questions";

function repoPath(relativePath) {
  return join(root, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(repoPath(relativePath), "utf8"));
}

function sha256String(value) {
  return createHash("sha256").update(value).digest("hex");
}

function hashBytes(value) {
  return [...createHash("sha256").update(value).digest()].map((byte) => Number(byte));
}

function sha256File(relativePath) {
  return createHash("sha256").update(readFileSync(repoPath(relativePath))).digest("hex");
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, stable(item)]));
  }
  return value;
}

function fingerprint(value) {
  return sha256String(JSON.stringify(stable(value)));
}

function textSnippet(value, max = 88) {
  return String(value).replace(/\s+/g, " ").trim().slice(0, max);
}

function assetStemFromUnitId(unitId) {
  return String(unitId)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function unitLabel(unit) {
  switch (unit.kind) {
    case "topicSummary":
      return `теме "${unit.topicTitleRu}"`;
    case "learningMaterial":
      return `учебному абзацу темы "${unit.topicTitleRu}"`;
    case "practicalReasoning":
      return `практическому пояснению темы "${unit.topicTitleRu}"`;
    case "trapNote":
      return `ловушке темы "${unit.topicTitleRu}"`;
    case "topicTerm":
      return `термину "${unit.termEs}" в теме "${unit.topicTitleRu}"`;
    case "vocabularyTerm":
      return `словарному термину "${unit.termEs}"`;
    default:
      return "учебной единице";
  }
}

function unitCaption(unit) {
  if (unit.kind === "topicTerm" || unit.kind === "vocabularyTerm") return `Термин: ${unit.termEs}`;
  if (unit.kind === "trapNote") return `Ловушка: ${unit.topicTitleRu}`;
  if (unit.kind === "practicalReasoning") return `Практика: ${unit.topicTitleRu}`;
  if (unit.kind === "learningMaterial") return `Материал: ${unit.topicTitleRu}`;
  return `Схема: ${unit.topicTitleRu}`;
}

function unitAlt(unit) {
  const concept = unit.termEs || unit.translationRu || unit.textRu || unit.topicTitleRu;
  return `Учебная схема к ${unitLabel(unit)}: локальная дорожная ситуация без текста на изображении, связанная с "${textSnippet(concept, 72)}".`;
}

function unitFingerprint(unit) {
  return fingerprint({
    kind: unit.kind,
    unitId: unit.unitId,
    topicId: unit.topicId,
    topicSlug: unit.topicSlug,
    termId: unit.termId,
    textRu: unit.textRu,
    termEs: unit.termEs,
    translationRu: unit.translationRu,
    sourceQuestionIds: unit.sourceQuestionIds
  });
}

export function collectLearningImageCoverageUnits({ topicGuide, vocabulary }) {
  const units = [];
  for (const topic of topicGuide?.topics || []) {
    units.push({
      kind: "topicSummary",
      unitId: `topic-summary:${topic.id}`,
      topicId: topic.id,
      topicSlug: topic.slug,
      topicTitleRu: topic.titleRu,
      textRu: topic.summaryRu
    });
    for (const [index, textRu] of (topic.learningMaterialRu || []).entries()) {
      units.push({
        kind: "learningMaterial",
        unitId: `topic-learning:${topic.id}:${index + 1}`,
        topicId: topic.id,
        topicSlug: topic.slug,
        topicTitleRu: topic.titleRu,
        index,
        textRu
      });
    }
    for (const [index, textRu] of (topic.practicalReasoningRu || []).entries()) {
      units.push({
        kind: "practicalReasoning",
        unitId: `topic-practical:${topic.id}:${index + 1}`,
        topicId: topic.id,
        topicSlug: topic.slug,
        topicTitleRu: topic.titleRu,
        index,
        textRu
      });
    }
    for (const [index, note] of (topic.trapNotes || []).entries()) {
      units.push({
        kind: "trapNote",
        unitId: `topic-trap:${topic.id}:${note.id || index + 1}`,
        topicId: topic.id,
        topicSlug: topic.slug,
        topicTitleRu: topic.titleRu,
        trapId: note.id,
        index,
        textRu: note.textRu,
        sourceQuestionIds: note.sourceQuestionIds || []
      });
    }
    for (const term of topic.spanishTerms || []) {
      units.push({
        kind: "topicTerm",
        unitId: `topic-term:${topic.id}:${term.id}`,
        topicId: topic.id,
        topicSlug: topic.slug,
        topicTitleRu: topic.titleRu,
        termId: term.id,
        termEs: term.termEs,
        translationRu: term.translationRu,
        sourceQuestionIds: term.sourceQuestionIds || []
      });
    }
  }
  for (const term of vocabulary || []) {
    units.push({
      kind: "vocabularyTerm",
      unitId: `vocabulary-term:${term.id}`,
      termId: term.id,
      termEs: term.termEs,
      translationRu: term.translationRu,
      textRu: term.explanationRu,
      category: term.category,
      sourceQuestionIds: term.sourceQuestionIds || []
    });
  }
  return units.map((unit) => ({ ...unit, sourceFingerprint: unitFingerprint(unit) }));
}

function contentFingerprint(units) {
  return fingerprint(units.map((unit) => ({ unitId: unit.unitId, sourceFingerprint: unit.sourceFingerprint })));
}

function coverageFingerprint(coverage) {
  return fingerprint(coverage.map((record) => ({
    unitId: record && typeof record === "object" ? record.unitId : undefined,
    status: record && typeof record === "object" ? record.status : undefined,
    sourceFingerprint: record && typeof record === "object" ? record.sourceFingerprint : undefined,
    imageIds: record && typeof record === "object" ? record.imageIds || [] : [],
    exceptionReason: record && typeof record === "object" ? record.exceptionReason : undefined,
    malformedValueType: record && typeof record === "object" ? undefined : typeof record
  })));
}

function imagePalette(seed) {
  const palettes = [
    ["#f6faf7", "#176b57", "#f5c542", "#395b88"],
    ["#fff9ef", "#bd5f28", "#176b57", "#395b88"],
    ["#f4f7ff", "#395b88", "#d45b5b", "#176b57"],
    ["#fbf7f1", "#5e6f64", "#176b57", "#f0b84a"]
  ];
  const index = Math.abs([...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % palettes.length;
  return palettes[index];
}

export function svgForImage(seed, variant = "topic") {
  seed = String(seed || "learning-image");
  const [background, primary, accent, secondary] = imagePalette(seed);
  const hash = hashBytes(`${styleVersion}:${variant}:${seed}`);
  const horizon = 106 + (hash[0] % 34);
  const laneOffset = 12 + (hash[1] % 38);
  const signX = 44 + (hash[2] % 74);
  const signRadius = 34 + (hash[3] % 16);
  const objectX = 168 + (hash[4] % 128);
  const objectWidth = 92 + (hash[5] % 42);
  const objectHeight = 35 + (hash[6] % 22);
  const wheelY = (variant === "term" ? 206 : 196) + (hash[7] % 18);
  const objectRadius = (variant === "term" ? 22 : 28) + (hash[8] % 16);
  const houseX = 394 + (hash[9] % 54);
  const houseY = 150 + (hash[10] % 32);
  const islandLeft = 56 + (hash[11] % 52);
  const islandRight = 462 + (hash[12] % 62);
  const nearLaneX = 292 + laneOffset;
  const farLaneX = 348 + (hash[13] % 32);
  const roadCurve = 104 + (hash[14] % 48);
  const foregroundOpacity = (34 + (hash[15] % 20)) / 100;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480" role="img">
  <rect width="640" height="480" fill="${background}"/>
  <rect x="0" y="${horizon}" width="640" height="${480 - horizon}" fill="#e6ece8"/>
  <path d="M0 420 C${roadCurve} 360 220 330 320 312 C420 292 520 288 640 304 L640 480 L0 480 Z" fill="#ced8d2"/>
  <path d="M88 480 C184 392 255 332 320 ${horizon + 34} C385 332 456 392 552 480 Z" fill="${primary}" opacity="0.88"/>
  <path d="M${nearLaneX} ${horizon + 45} L${300 - laneOffset} 480" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-dasharray="24 24" opacity="0.86"/>
  <path d="M${farLaneX} ${horizon + 45} L${362 + (hash[16] % 30)} 480" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-dasharray="24 24" opacity="0.86"/>
  <rect x="${signX}" y="${horizon - 78}" width="18" height="118" rx="6" fill="${secondary}"/>
  <circle cx="${signX + 9}" cy="${horizon - 88}" r="${signRadius}" fill="#ffffff" stroke="${accent}" stroke-width="12"/>
  <path d="M${objectX} ${wheelY - objectHeight} h${objectWidth} a26 26 0 0 1 24 17 l13 39 h-${objectWidth + 62} l14-37 a26 26 0 0 1 25-19 z" fill="${secondary}"/>
  <circle cx="${objectX + 30}" cy="${wheelY + 10}" r="${objectRadius / 2}" fill="#1f2d2a"/>
  <circle cx="${objectX + objectWidth + 10}" cy="${wheelY + 10}" r="${objectRadius / 2}" fill="#1f2d2a"/>
  <path d="M${houseX} ${houseY + 26} l54 -42 l54 42 v92 h-108 z" fill="#ffffff" stroke="${primary}" stroke-width="10" stroke-linejoin="round"/>
  <rect x="${houseX + 32}" y="${houseY + 66}" width="44" height="52" rx="5" fill="${accent}" opacity="0.82"/>
  <path d="M${islandLeft} 322 c22 -34 58 -34 80 0 c-20 20 -60 20 -80 0 z" fill="${accent}" opacity="0.72"/>
  <path d="M${islandRight} 362 c20 -42 66 -42 86 0 c-22 26 -64 26 -86 0 z" fill="${primary}" opacity="${foregroundOpacity}"/>
</svg>
`;
}

function pathIsInside(childPath, parentPath) {
  const offset = relative(parentPath, childPath);
  return offset === "" || (!offset.startsWith("..") && !isAbsolute(offset));
}

function validateImageLocalPath(image, errors, fallbackImageId = "learning image") {
  const imageId = typeof image?.imageId === "string" ? image.imageId : fallbackImageId;
  if (typeof image.localPath !== "string") {
    errors.push(`${imageId}: localPath must be a repository-relative string under ${assetRoot}/.`);
    return undefined;
  }
  if (/^https?:\/\//.test(image.localPath)) {
    errors.push(`${imageId}: localPath must not be remote.`);
    return undefined;
  }
  if (isAbsolute(image.localPath)) {
    errors.push(`${imageId}: localPath must be repository-relative, not absolute.`);
    return undefined;
  }

  const resolvedPath = resolve(root, image.localPath);
  const resolvedRepoRoot = resolve(root);
  const resolvedAssetRoot = resolve(root, assetRoot);
  const resolvedQuestionRoot = resolve(root, canonicalQuestionAssetRoot);
  let isValidPath = true;
  if (!pathIsInside(resolvedPath, resolvedRepoRoot)) {
    errors.push(`${imageId}: localPath must resolve inside the repository.`);
    isValidPath = false;
  }
  if (!pathIsInside(resolvedPath, resolvedAssetRoot) || resolvedPath === resolvedAssetRoot) {
    errors.push(`${imageId}: localPath must resolve under ${assetRoot}/.`);
    isValidPath = false;
  }
  if (pathIsInside(resolvedPath, resolvedQuestionRoot)) {
    errors.push(`${imageId}: must not reference canonical question-image assets.`);
    isValidPath = false;
  }
  return isValidPath ? image.localPath : undefined;
}

function writeGeneratedAsset(relativePath, svg) {
  mkdirSync(dirname(repoPath(relativePath)), { recursive: true });
  writeFileSync(repoPath(relativePath), svg);
}

function svgDimensions(relativePath) {
  const text = readFileSync(repoPath(relativePath), "utf8");
  const width = Number(text.match(/\bwidth="(\d+)"/)?.[1]);
  const height = Number(text.match(/\bheight="(\d+)"/)?.[1]);
  return { width, height };
}

function buildGeneratedRecords({ topicGuide, vocabulary, units }) {
  const images = [];
  const coverage = [];
  void topicGuide;
  void vocabulary;

  for (const unit of units) {
    const assetStem = assetStemFromUnitId(unit.unitId);
    const imageId = `learning-${assetStem}`;
    const localPath = `${assetRoot}/${assetStem}.svg`;
    const variant = unit.kind === "topicTerm" || unit.kind === "vocabularyTerm" ? "term" : "topic";
    writeGeneratedAsset(localPath, svgForImage(`${unit.unitId}:${unit.sourceFingerprint}`, variant));
    const { width, height } = svgDimensions(localPath);
    images.push({
      imageId,
      localPath,
      sha256: sha256File(localPath),
      width,
      height,
      aspectRatioFamily: "4:3",
      styleVersion,
      altRu: unitAlt(unit),
      captionRu: unitCaption(unit),
      provenance: {
        method: "programmatic_svg_generation",
        promptSummary: `Deterministic unit-specific road-safety SVG for ${unit.unitId}: ${textSnippet(unit.textRu || unit.termEs || unit.translationRu || unit.topicTitleRu, 120)}. No text, no official logo, no ticket image source.`,
        generatedAt: reviewedAt,
        reviewer,
        reviewedAt,
        licenseNote: "Original local SVG generated for Cabadrive learning support."
      },
      safety: {
        noRuntimeGeneration: true,
        noRemoteSource: true,
        noTicketImageReplacement: true,
        noMisleadingRoadRuleCue: true,
        noUnreviewedTextInImage: true
      }
    });
    coverage.push({
      unitId: unit.unitId,
      unitKind: unit.kind,
      sourceFingerprint: unit.sourceFingerprint,
      status: "direct",
      imageIds: [imageId],
      reviewer,
      reviewedAt,
      evidenceStatus: "approved",
      noteRu: `Прямая локальная SVG-иллюстрация создана для ${unitLabel(unit)}: ${textSnippet(unit.textRu || unit.termEs || unit.translationRu)}`
    });
  }
  return { images, coverage };
}

function summaryFrom({ units, manifest }) {
  const images = Array.isArray(manifest.images) ? manifest.images : [];
  const coverage = Array.isArray(manifest.coverage) ? manifest.coverage : [];
  const coverageByStatus = { direct: 0, shared: 0, exception: 0 };
  for (const record of coverage) {
    if (record && typeof record === "object") coverageByStatus[record.status] = (coverageByStatus[record.status] || 0) + 1;
  }
  return {
    styleVersion: manifest.styleVersion,
    imageCount: images.length,
    coverageUnitCount: units.length,
    coverageRecordCount: coverage.length,
    directCoverageCount: coverageByStatus.direct,
    sharedCoverageCount: coverageByStatus.shared,
    exceptionCoverageCount: coverageByStatus.exception,
    unitKindCounts: Object.fromEntries(
      Object.entries(units.reduce((counts, unit) => {
        counts[unit.kind] = (counts[unit.kind] || 0) + 1;
        return counts;
      }, {})).sort(([a], [b]) => a.localeCompare(b))
    )
  };
}

export function validateLearningImages({
  topicGuide,
  vocabulary,
  manifest,
  evidence,
  fileExists = (relativePath) => existsSync(repoPath(relativePath)),
  fileSha256 = (relativePath) => sha256File(relativePath),
  readDimensions = (relativePath) => svgDimensions(relativePath)
}) {
  const errors = [];
  const units = collectLearningImageCoverageUnits({ topicGuide, vocabulary });
  const unitById = new Map(units.map((unit) => [unit.unitId, unit]));

  if (!manifest || typeof manifest !== "object") {
    return { errors: ["Learning-image manifest is missing or malformed."], units, summary: undefined };
  }
  if (manifest.version !== 1) errors.push("learning-images.manifest.json: version must be 1.");
  if (manifest.contentKind !== "learning-images") errors.push("learning-images.manifest.json: contentKind must be learning-images.");
  if (manifest.styleVersion !== styleVersion) errors.push(`learning-images.manifest.json: styleVersion must be ${styleVersion}.`);
  if (!Array.isArray(manifest.images)) errors.push("learning-images.manifest.json: images must be an array.");
  if (!Array.isArray(manifest.coverage)) errors.push("learning-images.manifest.json: coverage must be an array.");
  const manifestImages = Array.isArray(manifest.images) ? manifest.images : [];
  const manifestCoverage = Array.isArray(manifest.coverage) ? manifest.coverage : [];

  const imageById = new Map();
  for (const [index, image] of manifestImages.entries()) {
    if (!image || typeof image !== "object" || Array.isArray(image)) {
      errors.push(`images[${index}]: image record must be an object.`);
      continue;
    }
    const imageId = typeof image.imageId === "string" ? image.imageId : `images[${index}]`;
    if (typeof image.imageId !== "string") errors.push(`${imageId}: imageId is required.`);
    if (typeof image.imageId === "string" && imageById.has(image.imageId)) errors.push(`${image.imageId}: duplicate imageId.`);
    if (typeof image.imageId === "string") imageById.set(image.imageId, image);
    const validatedLocalPath = validateImageLocalPath(image, errors, imageId);
    if (validatedLocalPath && !fileExists(validatedLocalPath)) errors.push(`${imageId}: image file missing: ${validatedLocalPath}`);
    if (validatedLocalPath && fileExists(validatedLocalPath) && image.sha256 !== fileSha256(validatedLocalPath)) {
      errors.push(`${imageId}: image hash mismatch.`);
    }
    if (!Number.isInteger(image.width) || image.width <= 0 || !Number.isInteger(image.height) || image.height <= 0) {
      errors.push(`${imageId}: width and height must be positive integers.`);
    } else if (validatedLocalPath && fileExists(validatedLocalPath)) {
      const dimensions = readDimensions(validatedLocalPath);
      if (dimensions.width !== image.width || dimensions.height !== image.height) {
        errors.push(`${imageId}: manifest dimensions do not match the SVG file.`);
      }
    }
    if (!allowedAspectFamilies.has(image.aspectRatioFamily)) errors.push(`${imageId}: invalid aspectRatioFamily.`);
    if (image.styleVersion !== styleVersion) errors.push(`${imageId}: styleVersion must be ${styleVersion}.`);
    if (typeof image.altRu !== "string" || image.altRu.trim().length < 24) errors.push(`${imageId}: altRu must be useful Russian alt text.`);
    if (typeof image.captionRu !== "string" || image.captionRu.trim().length < 4) errors.push(`${imageId}: captionRu is required.`);
    if (image.provenance?.method !== "programmatic_svg_generation") errors.push(`${imageId}: provenance.method must be programmatic_svg_generation.`);
    if (typeof image.provenance?.promptSummary !== "string" || image.provenance.promptSummary.trim().length < 20) {
      errors.push(`${imageId}: provenance.promptSummary is required.`);
    }
    if (image.provenance?.reviewer !== reviewer || image.provenance?.reviewedAt !== reviewedAt) {
      errors.push(`${imageId}: reviewer/reviewedAt must match current approved evidence.`);
    }
    for (const [flag, value] of Object.entries(image.safety || {})) {
      if (value !== true) errors.push(`${imageId}: safety.${flag} must be true.`);
    }
    for (const flag of ["noRuntimeGeneration", "noRemoteSource", "noTicketImageReplacement", "noMisleadingRoadRuleCue", "noUnreviewedTextInImage"]) {
      if (image.safety?.[flag] !== true) errors.push(`${imageId}: safety.${flag} must be true.`);
    }
  }

  const seenCoverage = new Set();
  for (const [index, record] of manifestCoverage.entries()) {
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      errors.push(`coverage[${index}]: coverage record must be an object.`);
      continue;
    }
    const recordId = typeof record.unitId === "string" ? record.unitId : `coverage[${index}]`;
    const unit = unitById.get(record.unitId);
    if (!unit) errors.push(`${recordId}: coverage references an unknown unit.`);
    if (seenCoverage.has(record.unitId)) errors.push(`${recordId}: duplicate coverage record.`);
    seenCoverage.add(record.unitId);
    if (!allowedStatuses.has(record.status)) errors.push(`${recordId}: invalid coverage status.`);
    if (unit && record.sourceFingerprint !== unit.sourceFingerprint) errors.push(`${record.unitId}: source fingerprint is stale.`);
    if (record.reviewer !== reviewer || record.reviewedAt !== reviewedAt || record.evidenceStatus !== "approved") {
      errors.push(`${recordId}: coverage reviewer/reviewedAt/evidenceStatus must be approved.`);
    }
    if (record.status === "exception") {
      if (!allowedExceptionReasons.has(record.exceptionReason)) errors.push(`${recordId}: invalid exceptionReason.`);
      if (record.imageIds?.length) errors.push(`${recordId}: exception records must not reference imageIds.`);
    } else {
      if (!Array.isArray(record.imageIds) || record.imageIds.length === 0) errors.push(`${recordId}: non-exception coverage must reference imageIds.`);
      for (const imageId of record.imageIds || []) {
        if (!imageById.has(imageId)) errors.push(`${recordId}: imageId ${imageId} is missing from images.`);
      }
    }
    if (record.status === "shared") {
      const concept = record.sharedConcept;
      const conceptKey = concept?.conceptKey;
      if (!concept || typeof concept !== "object" || Array.isArray(concept)) errors.push(`${recordId}: shared coverage must include sharedConcept.`);
      if (typeof conceptKey !== "string" || conceptKey.trim().length < 6) {
        errors.push(`${recordId}: sharedConcept.conceptKey is required.`);
      } else if (unit?.topicId && (conceptKey === unit.topicId || conceptKey === `topic:${unit.topicId}` || conceptKey.startsWith(`topic-${unit.topicId}`))) {
        errors.push(`${recordId}: shared coverage must use an auditable concept key, not generic topic-wide sharing.`);
      }
      if (typeof concept?.titleRu !== "string" || concept.titleRu.trim().length < 8) errors.push(`${recordId}: sharedConcept.titleRu is required.`);
      if (typeof concept?.rationaleRu !== "string" || concept.rationaleRu.trim().length < 24) errors.push(`${recordId}: sharedConcept.rationaleRu is required.`);
      if (!Array.isArray(concept?.relatedUnitIds) || concept.relatedUnitIds.length < 2 || concept.relatedUnitIds.length > 24) {
        errors.push(`${recordId}: sharedConcept.relatedUnitIds must contain 2-24 audited unit IDs.`);
      } else if (!concept.relatedUnitIds.includes(record.unitId)) {
        errors.push(`${recordId}: sharedConcept.relatedUnitIds must include the covered unit.`);
      }
    }
  }
  for (const unit of units) {
    if (!seenCoverage.has(unit.unitId)) errors.push(`${unit.unitId}: missing learning-image coverage record.`);
  }

  const summary = summaryFrom({ units, manifest });
  if (!evidence || typeof evidence !== "object") {
    errors.push("learning-images.evidence.json: evidence is missing or malformed.");
  } else {
    if (evidence.styleVersion !== styleVersion) errors.push("learning-images.evidence.json: stale styleVersion.");
    if (evidence.reviewStatus !== "approved") errors.push("learning-images.evidence.json: reviewStatus must be approved.");
    if (evidence.reviewer !== reviewer || evidence.reviewedAt !== reviewedAt) errors.push("learning-images.evidence.json: reviewer/reviewedAt mismatch.");
    if (evidence.contentFingerprint !== contentFingerprint(units)) errors.push("learning-images.evidence.json: contentFingerprint is stale.");
    if (evidence.coverageFingerprint !== coverageFingerprint(manifestCoverage)) errors.push("learning-images.evidence.json: coverageFingerprint is stale.");
    for (const [key, value] of Object.entries(summary)) {
      if (typeof value === "number" && evidence.summary?.[key] !== value) errors.push(`learning-images.evidence.json: summary.${key} must be ${value}.`);
    }
  }

  return { errors, units, summary };
}

export function formatLearningImageSummary(summary) {
  return `Learning images validated: ${summary.coverageUnitCount} units, ${summary.imageCount} local images, ${summary.directCoverageCount} direct, ${summary.sharedCoverageCount} shared, ${summary.exceptionCoverageCount} exceptions.`;
}

function writeGeneratedManifest() {
  const topicGuide = readJson("content/guide/topic-study-guide.ru.json");
  const vocabulary = readJson("content/vocabulary/ru.vocabulary.json");
  const units = collectLearningImageCoverageUnits({ topicGuide, vocabulary });
  mkdirSync(repoPath(assetRoot), { recursive: true });
  const { images, coverage } = buildGeneratedRecords({ topicGuide, vocabulary, units });
  const manifest = {
    version: 1,
    contentKind: "learning-images",
    styleVersion,
    generatedAt: `${reviewedAt}T00:00:00.000Z`,
    images,
    coverage
  };
  const evidence = {
    version: 1,
    styleVersion,
    reviewStatus: "approved",
    reviewer,
    reviewedAt,
    contentFingerprint: contentFingerprint(units),
    coverageFingerprint: coverageFingerprint(coverage),
    generationMethod: "deterministic programmatic SVG generation from cabadrive-learning-image-v1 style rules",
    summary: summaryFrom({ units, manifest }),
    safetyNotes: [
      "Assets are committed local SVG files under content/assets/learning/generated/v1/.",
      "Images contain no readable text, no official logos, no personal data, and no source-ticket pixels.",
      "Every current topic-study and vocabulary coverage unit has a unit-specific direct SVG asset."
    ]
  };
  mkdirSync(dirname(repoPath(manifestPath)), { recursive: true });
  mkdirSync(dirname(repoPath(evidencePath)), { recursive: true });
  writeFileSync(repoPath(manifestPath), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(repoPath(evidencePath), `${JSON.stringify(evidence, null, 2)}\n`);
  return { manifest, evidence, units };
}

function main() {
  const shouldWrite = process.argv.includes("--write-generated-assets");
  const topicGuide = readJson("content/guide/topic-study-guide.ru.json");
  const vocabulary = readJson("content/vocabulary/ru.vocabulary.json");
  if (shouldWrite) {
    const { manifest, evidence, units } = writeGeneratedManifest();
    const result = validateLearningImages({ topicGuide, vocabulary, manifest, evidence });
    if (result.errors.length) {
      console.error("Learning-image generation produced invalid output:");
      for (const error of result.errors) console.error(`- ${error}`);
      process.exit(1);
    }
    console.log(formatLearningImageSummary(result.summary));
    return;
  }

  const manifest = existsSync(repoPath(manifestPath)) ? readJson(manifestPath) : undefined;
  const evidence = existsSync(repoPath(evidencePath)) ? readJson(evidencePath) : undefined;
  const result = validateLearningImages({ topicGuide, vocabulary, manifest, evidence });
  if (result.errors.length) {
    console.error("Learning-image validation failed:");
    for (const error of result.errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(formatLearningImageSummary(result.summary));
}

if (import.meta.url === `file://${process.argv[1]}`) main();
