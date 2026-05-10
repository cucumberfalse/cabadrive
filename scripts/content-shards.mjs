#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const QUESTION_SOURCE_PATH = "content/questions/caba-b.unofficial-fallback.questions.json";

export const CONTENT_SHARD_RANGES = [
  { id: "001-092", start: 1, end: 92 },
  { id: "093-184", start: 93, end: 184 },
  { id: "185-276", start: 185, end: 276 },
  { id: "277-368", start: 277, end: 368 },
  { id: "369-460", start: 369, end: 460 }
];

export const CONTENT_SHARD_CONFIG = {
  translations: {
    contentKind: "ru-translations",
    directory: "content/translations/ru",
    generatedPath: "content/translations/ru.translations.json",
    collectionFields: ["entries"]
  },
  explanations: {
    contentKind: "ru-explanations",
    directory: "content/explanations/ru",
    generatedPath: "content/explanations/ru.explanations.json",
    collectionFields: ["entries"]
  },
  imageMetadata: {
    contentKind: "question-image-metadata",
    directory: "content/image-metadata/question-images",
    generatedPath: "content/image-metadata/question-images.manifest.json",
    collectionFields: ["images", "questionUsages"]
  }
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const QUESTION_ID_PATTERN = /^b-fallback-(\d{3})$/;
const QUALITY_STATUSES = new Set(["needs_full_content_review", "in_progress", "complete"]);

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function canonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
    .join(",")}}`;
}

export function sha256Canonical(value) {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

export function questionNumber(questionId) {
  const match = QUESTION_ID_PATTERN.exec(questionId || "");
  return match ? Number(match[1]) : undefined;
}

export function rangeForQuestionId(questionId) {
  const number = questionNumber(questionId);
  return CONTENT_SHARD_RANGES.find((range) => number >= range.start && number <= range.end);
}

function compareQuestionIds(a, b) {
  const aNumber = questionNumber(a.questionId || a.id);
  const bNumber = questionNumber(b.questionId || b.id);
  if (aNumber !== undefined && bNumber !== undefined && aNumber !== bNumber) return aNumber - bNumber;
  return String(a.questionId || a.id).localeCompare(String(b.questionId || b.id));
}

function relativeFilePath(rootPath, relativePath) {
  return join(rootPath, relativePath);
}

function expectedShardPath(config, range) {
  return join(config.directory, `${range.id}.json`);
}

function validateShardEnvelope({ shard, config, range, relativePath }) {
  const errors = [];
  const label = relativePath;
  if (!shard || typeof shard !== "object" || Array.isArray(shard)) {
    return [`${label}: shard must be an object.`];
  }
  if (shard.version !== 1) errors.push(`${label}: version must be 1.`);
  if (shard.contentKind !== config.contentKind) errors.push(`${label}: contentKind must be ${config.contentKind}.`);
  if (shard.sourceQuestionPath !== QUESTION_SOURCE_PATH) {
    errors.push(`${label}: sourceQuestionPath must be ${QUESTION_SOURCE_PATH}.`);
  }
  if (!shard.range || shard.range.id !== range.id || shard.range.start !== range.start || shard.range.end !== range.end) {
    errors.push(`${label}: range must match ${range.id}.`);
  }
  if (!QUALITY_STATUSES.has(shard.qualityStatus)) {
    errors.push(`${label}: qualityStatus must be one of ${[...QUALITY_STATUSES].join(", ")}.`);
  }
  for (const field of config.collectionFields) {
    if (!Array.isArray(shard[field])) errors.push(`${label}: ${field} must be an array.`);
  }
  return errors;
}

export function loadContentShards({ rootPath = root, config }) {
  const errors = [];
  const shards = [];
  for (const range of CONTENT_SHARD_RANGES) {
    const relativePath = expectedShardPath(config, range);
    const absolutePath = relativeFilePath(rootPath, relativePath);
    if (!existsSync(absolutePath)) {
      errors.push(`${relativePath}: missing required content shard.`);
      continue;
    }
    let shard;
    try {
      shard = readJson(absolutePath);
    } catch (error) {
      errors.push(`${relativePath}: ${error.message}`);
      continue;
    }
    errors.push(...validateShardEnvelope({ shard, config, range, relativePath }));
    shards.push({ range, relativePath, shard });
  }

  const extraDirectory = relativeFilePath(rootPath, config.directory);
  if (existsSync(extraDirectory)) {
    const expected = new Set(CONTENT_SHARD_RANGES.map((range) => `${range.id}.json`));
    for (const filename of readdirSync(extraDirectory).filter((name) => name.endsWith(".json"))) {
      if (!expected.has(filename)) errors.push(`${join(config.directory, filename)}: unexpected shard file.`);
    }
  }

  return { shards, errors };
}

function enforceQuestionRange({ questionId, range, label, errors }) {
  const entryRange = rangeForQuestionId(questionId);
  if (!entryRange) {
    errors.push(`${label}: questionId ${questionId} is not a supported fallback question id.`);
  } else if (entryRange.id !== range.id) {
    errors.push(`${label}: questionId ${questionId} belongs in shard ${entryRange.id}, not ${range.id}.`);
  }
}

function combineQuestionEntryShards({ rootPath, config, entryLabel }) {
  const { shards, errors } = loadContentShards({ rootPath, config });
  const entries = [];
  const seen = new Set();
  for (const { range, relativePath, shard } of shards) {
    for (const entry of shard.entries || []) {
      const questionId = entry?.questionId;
      const label = `${relativePath}: ${questionId || entryLabel}`;
      if (typeof questionId !== "string" || questionId.trim() === "") {
        errors.push(`${label}: questionId must be a non-empty string.`);
        continue;
      }
      enforceQuestionRange({ questionId, range, label, errors });
      if (seen.has(questionId)) errors.push(`${label}: duplicate ${entryLabel} entry.`);
      seen.add(questionId);
      entries.push(entry);
    }
  }
  entries.sort(compareQuestionIds);
  return { entries, shards, errors };
}

export function loadTranslationsFromShards(rootPath = root) {
  const result = combineQuestionEntryShards({
    rootPath,
    config: CONTENT_SHARD_CONFIG.translations,
    entryLabel: "translation"
  });
  return { translations: result.entries, shards: result.shards, errors: result.errors };
}

export function loadExplanationsFromShards(rootPath = root) {
  const result = combineQuestionEntryShards({
    rootPath,
    config: CONTENT_SHARD_CONFIG.explanations,
    entryLabel: "explanation"
  });
  return { explanations: result.entries, shards: result.shards, errors: result.errors };
}

export function loadQuestionImageMetadataFromShards(rootPath = root) {
  const config = CONTENT_SHARD_CONFIG.imageMetadata;
  const { shards, errors } = loadContentShards({ rootPath, config });
  const images = [];
  const questionUsages = [];
  const imageById = new Map();
  const imageByPath = new Map();
  const usageByQuestionId = new Map();

  for (const { range, relativePath, shard } of shards) {
    for (const image of shard.images || []) {
      const label = `${relativePath}: ${image?.imageId || "image metadata"}`;
      if (typeof image?.imageId !== "string" || image.imageId.trim() === "") {
        errors.push(`${label}: imageId must be a non-empty string.`);
        continue;
      }
      const existingById = imageById.get(image.imageId);
      if (existingById && sha256Canonical(existingById) !== sha256Canonical(image)) {
        errors.push(`${label}: duplicate imageId has conflicting metadata.`);
      }
      const existingByPath = imageByPath.get(image.localPath);
      if (existingByPath && sha256Canonical(existingByPath) !== sha256Canonical(image)) {
        errors.push(`${label}: duplicate localPath has conflicting metadata.`);
      }
      if (!existingById) {
        imageById.set(image.imageId, image);
        if (image.localPath) imageByPath.set(image.localPath, image);
        images.push(image);
      }
    }

    for (const usage of shard.questionUsages || []) {
      const questionId = usage?.questionId;
      const label = `${relativePath}: ${questionId || "question image usage"}`;
      if (typeof questionId !== "string" || questionId.trim() === "") {
        errors.push(`${label}: questionId must be a non-empty string.`);
        continue;
      }
      enforceQuestionRange({ questionId, range, label, errors });
      if (usageByQuestionId.has(questionId)) errors.push(`${label}: duplicate question image usage.`);
      usageByQuestionId.set(questionId, usage);
      questionUsages.push(usage);
    }
  }

  questionUsages.sort(compareQuestionIds);
  return {
    manifest: {
      version: 1,
      questionSourcePath: QUESTION_SOURCE_PATH,
      baseline: undefined,
      images,
      questionUsages
    },
    shards,
    errors
  };
}

function manifestWithBaseline({ rootPath, manifest }) {
  const questions = readJson(relativeFilePath(rootPath, QUESTION_SOURCE_PATH));
  let existingBaseline = {};
  const existingManifestPath = relativeFilePath(rootPath, CONTENT_SHARD_CONFIG.imageMetadata.generatedPath);
  if (existsSync(existingManifestPath)) {
    existingBaseline = readJson(existingManifestPath).baseline || {};
  }
  const imageBackedQuestions = questions.filter((question) => question.image);
  const uniqueByPath = new Map();
  for (const question of imageBackedQuestions) {
    if (!uniqueByPath.has(question.image.localPath)) uniqueByPath.set(question.image.localPath, question.image);
  }
  return {
    ...manifest,
    baseline: {
      questionCount: questions.length,
      imageReferenceCount: imageBackedQuestions.length,
      uniqueImageCount: uniqueByPath.size,
      questionSetFingerprint: sha256Canonical(
        questions.map((question) => ({
          questionId: question.id,
          officialTextEs: question.officialTextEs,
          answers: (question.answers || []).map((answer) => ({
            id: answer.id,
            officialTextEs: answer.officialTextEs
          })),
          correctAnswerId: question.correctAnswerId,
          image: question.image
            ? {
                localPath: question.image.localPath || null,
                sha256: question.image.sha256
              }
            : null
        }))
      ),
      imageReferenceFingerprint: sha256Canonical(
        imageBackedQuestions.map((question) => ({
          questionId: question.id,
          localPath: question.image.localPath,
          sha256: question.image.sha256,
          originalUrl: question.image.originalUrl || null
        }))
      ),
      ...(typeof existingBaseline.createdAt === "string" ? { createdAt: existingBaseline.createdAt } : {}),
      ...(typeof existingBaseline.reviewedAt === "string" ? { reviewedAt: existingBaseline.reviewedAt } : {})
    }
  };
}

export function combinedContentFromShards(rootPath = root) {
  const translations = loadTranslationsFromShards(rootPath);
  const explanations = loadExplanationsFromShards(rootPath);
  const imageMetadata = loadQuestionImageMetadataFromShards(rootPath);
  const errors = [...translations.errors, ...explanations.errors, ...imageMetadata.errors];
  return {
    translations: translations.translations,
    explanations: explanations.explanations,
    imageMetadataManifest: manifestWithBaseline({ rootPath, manifest: imageMetadata.manifest }),
    shards: {
      translations: translations.shards,
      explanations: explanations.shards,
      imageMetadata: imageMetadata.shards
    },
    errors
  };
}

export function assertGeneratedContentIndexesFresh(rootPath = root) {
  const combined = combinedContentFromShards(rootPath);
  const errors = [...combined.errors];
  for (const [label, config, generated] of [
    ["translations", CONTENT_SHARD_CONFIG.translations, combined.translations],
    ["explanations", CONTENT_SHARD_CONFIG.explanations, combined.explanations],
    ["question image metadata", CONTENT_SHARD_CONFIG.imageMetadata, combined.imageMetadataManifest]
  ]) {
    const existingPath = relativeFilePath(rootPath, config.generatedPath);
    if (!existsSync(existingPath)) {
      errors.push(`${config.generatedPath}: missing generated ${label} index.`);
      continue;
    }
    const existing = readJson(existingPath);
    if (canonicalJson(existing) !== canonicalJson(generated)) {
      errors.push(`${config.generatedPath}: generated ${label} index is stale; run node scripts/content-shards.mjs --write-indexes.`);
    }
  }
  return errors;
}

function writeGeneratedContentIndexes(rootPath = root) {
  const combined = combinedContentFromShards(rootPath);
  if (combined.errors.length) {
    throw new Error(combined.errors.join("\n"));
  }
  writeJson(relativeFilePath(rootPath, CONTENT_SHARD_CONFIG.translations.generatedPath), combined.translations);
  writeJson(relativeFilePath(rootPath, CONTENT_SHARD_CONFIG.explanations.generatedPath), combined.explanations);
  writeJson(relativeFilePath(rootPath, CONTENT_SHARD_CONFIG.imageMetadata.generatedPath), combined.imageMetadataManifest);
}

function rangeShardBase({ contentKind, range }) {
  return {
    version: 1,
    contentKind,
    sourceQuestionPath: QUESTION_SOURCE_PATH,
    range,
    qualityStatus: "needs_full_content_review",
    workerInstructions:
      "This range shard is the source of truth for its ticket range. Content workers may edit only their assigned shard files."
  };
}

function initializeShardsFromCurrent(rootPath = root) {
  const translations = readJson(relativeFilePath(rootPath, CONTENT_SHARD_CONFIG.translations.generatedPath));
  const explanations = readJson(relativeFilePath(rootPath, CONTENT_SHARD_CONFIG.explanations.generatedPath));
  const imageMetadata = readJson(relativeFilePath(rootPath, CONTENT_SHARD_CONFIG.imageMetadata.generatedPath));
  const usageByImageId = new Map();
  for (const usage of imageMetadata.questionUsages || []) {
    const current = usageByImageId.get(usage.imageId) || [];
    current.push(usage);
    usageByImageId.set(usage.imageId, current);
  }

  for (const range of CONTENT_SHARD_RANGES) {
    const translationShard = {
      ...rangeShardBase({ contentKind: CONTENT_SHARD_CONFIG.translations.contentKind, range }),
      locale: "ru",
      entries: translations.filter((entry) => rangeForQuestionId(entry.questionId)?.id === range.id).sort(compareQuestionIds)
    };
    const explanationShard = {
      ...rangeShardBase({ contentKind: CONTENT_SHARD_CONFIG.explanations.contentKind, range }),
      locale: "ru",
      entries: explanations.filter((entry) => rangeForQuestionId(entry.questionId)?.id === range.id).sort(compareQuestionIds)
    };
    const usageShard = (imageMetadata.questionUsages || [])
      .filter((entry) => rangeForQuestionId(entry.questionId)?.id === range.id)
      .sort(compareQuestionIds);
    const ownedImageIds = new Set();
    for (const image of imageMetadata.images || []) {
      const ownerUsage = (usageByImageId.get(image.imageId) || []).sort(compareQuestionIds)[0];
      if (ownerUsage && rangeForQuestionId(ownerUsage.questionId)?.id === range.id) ownedImageIds.add(image.imageId);
    }
    const imageMetadataShard = {
      ...rangeShardBase({ contentKind: CONTENT_SHARD_CONFIG.imageMetadata.contentKind, range }),
      imageOwnership:
        "images contains records owned by the lowest-numbered question usage for that image; questionUsages contains records for this range only.",
      images: (imageMetadata.images || []).filter((image) => ownedImageIds.has(image.imageId)),
      questionUsages: usageShard
    };

    writeJson(relativeFilePath(rootPath, expectedShardPath(CONTENT_SHARD_CONFIG.translations, range)), translationShard);
    writeJson(relativeFilePath(rootPath, expectedShardPath(CONTENT_SHARD_CONFIG.explanations, range)), explanationShard);
    writeJson(relativeFilePath(rootPath, expectedShardPath(CONTENT_SHARD_CONFIG.imageMetadata, range)), imageMetadataShard);
  }
}

function printErrorsAndExit(errors) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const command = process.argv[2];
  if (command === "--init-from-current") {
    initializeShardsFromCurrent(root);
    writeGeneratedContentIndexes(root);
    console.log("Initialized content shards from current generated indexes.");
  } else if (command === "--write-indexes") {
    writeGeneratedContentIndexes(root);
    console.log("Generated content indexes from shards.");
  } else if (command === "--check-indexes") {
    const errors = assertGeneratedContentIndexesFresh(root);
    if (errors.length) printErrorsAndExit(errors);
    console.log("Generated content indexes are fresh.");
  } else {
    console.error("Usage: node scripts/content-shards.mjs --init-from-current | --write-indexes | --check-indexes");
    process.exit(2);
  }
}
