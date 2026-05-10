#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildImageMetadataEvidenceEntry,
  buildQuestionUsageEvidenceEntry
} from "./content-image-metadata.mjs";
import { buildExplanationAlignmentEvidenceEntry } from "./content-explanation-alignment.mjs";
import { combinedContentFromShards, QUESTION_SOURCE_PATH } from "./content-shards.mjs";
import { buildTranslationAlignmentEvidenceEntry } from "./content-translation-alignment.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(root, relativePath), "utf8"));
}

function writeJson(relativePath, value) {
  const absolutePath = resolve(root, relativePath);
  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, `${JSON.stringify(value, null, 2)}\n`);
}

function reviewerFor(record) {
  return record?.review?.reviewer || record?.reviewer || "Codex content integration";
}

function reviewedAtFor(record) {
  return record?.review?.reviewedAt || record?.reviewedAt || "2026-05-10";
}

function rangeForQuestionId(questionId) {
  const number = Number(/^b-fallback-(\d{3})$/.exec(questionId || "")?.[1]);
  if (!Number.isFinite(number)) return "unknown";
  if (number <= 92) return "001-092";
  if (number <= 184) return "093-184";
  if (number <= 276) return "185-276";
  if (number <= 368) return "277-368";
  return "369-460";
}

const questions = readJson(QUESTION_SOURCE_PATH);
const questionById = new Map(questions.map((question) => [question.id, question]));
const combined = combinedContentFromShards(root);

if (combined.errors.length) {
  for (const error of combined.errors) console.error(`- ${error}`);
  process.exit(1);
}

const imageById = new Map(combined.imageMetadataManifest.images.map((image) => [image.imageId, image]));
const usageByQuestionId = new Map(
  combined.imageMetadataManifest.questionUsages.map((usage) => [usage.questionId, usage])
);

const imageEvidence = {
  version: 1,
  reviewer: "Codex content integration",
  reviewedAt: "2026-05-10",
  imageEntries: combined.imageMetadataManifest.images.map((image) =>
    buildImageMetadataEvidenceEntry({
      image,
      reviewer: reviewerFor(image),
      reviewedAt: reviewedAtFor(image),
      notes: `Evidence refreshed from completed feature 009 shard content for ${image.imageId}.`
    })
  ),
  usageEntries: combined.imageMetadataManifest.questionUsages.map((usage) =>
    buildQuestionUsageEvidenceEntry({
      usage,
      reviewer: reviewerFor(usage),
      reviewedAt: reviewedAtFor(usage),
      notes: `Evidence refreshed from completed feature 009 shard ${rangeForQuestionId(usage.questionId)} for ${usage.questionId}.`
    })
  )
};

const translationEvidence = {
  locale: "ru",
  version: 1,
  generatedAt: "2026-05-10",
  evidenceType: "translation_alignment_fingerprints",
  description: "Deterministic offline evidence that each reviewed Russian translation entry matches the current Spanish question tuple and answer ids.",
  entries: combined.translations.map((translation) =>
    buildTranslationAlignmentEvidenceEntry({
      question: questionById.get(translation.questionId),
      translation,
      reviewer: reviewerFor(translation),
      reviewedAt: reviewedAtFor(translation),
      notes: `Evidence refreshed from completed feature 009 translation shard ${rangeForQuestionId(translation.questionId)}.`
    })
  )
};

const explanationEvidence = {
  locale: "ru",
  version: 1,
  entries: combined.explanations.map((explanation) => {
    const question = questionById.get(explanation.questionId);
    const usage = usageByQuestionId.get(explanation.questionId);
    const image = usage ? imageById.get(usage.imageId) : undefined;
    return buildExplanationAlignmentEvidenceEntry({
      question,
      explanation,
      image,
      usage,
      reviewer: reviewerFor(explanation),
      reviewedAt: reviewedAtFor(explanation),
      notes: `Evidence refreshed from completed feature 009 explanation shard ${rangeForQuestionId(explanation.questionId)}.`
    });
  })
};

writeJson("content/validation/question-image-metadata.evidence.json", imageEvidence);
writeJson("content/validation/ru-translation-alignment.evidence.json", translationEvidence);
writeJson("content/validation/ru-explanation-alignment.evidence.json", explanationEvidence);

console.log(
  `Refreshed learning-support evidence: ${imageEvidence.imageEntries.length} images, ${imageEvidence.usageEntries.length} usages, ${translationEvidence.entries.length} translations, ${explanationEvidence.entries.length} explanations.`
);
