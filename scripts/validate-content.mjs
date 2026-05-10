#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validatePracticeQuestionSourceScope } from "./content-source-scope.mjs";
import { validateCabaExamProcessGuide } from "./content-caba-exam-process.mjs";
import { validateDifficultyContent } from "./content-difficulty.mjs";
import { validateExplanationAlignment } from "./content-explanation-alignment.mjs";
import { validateQuestionImageMetadata } from "./content-image-metadata.mjs";
import { assertGeneratedContentIndexesFresh, combinedContentFromShards } from "./content-shards.mjs";
import { validateTopicGuide } from "./content-topic-guide.mjs";
import { validateTranslationAlignment } from "./content-translation-alignment.mjs";
import { validateOfficialDocumentsManifest } from "./official-documents-validation.mjs";
import { combinePrimarySourceShards, validatePrimarySources } from "./primary-sources-validation.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];
const qualityGate = process.argv.includes("--quality-gate") || process.argv.includes("--final-content");

function path(...parts) {
  return join(root, ...parts);
}

function readJson(relativePath) {
  try {
    return JSON.parse(readFileSync(path(relativePath), "utf8"));
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`);
    return undefined;
  }
}

function sha256(relativePath) {
  return createHash("sha256").update(readFileSync(path(relativePath))).digest("hex");
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim() === "") errors.push(`${label} must be a non-empty string.`);
}

function requireArray(value, label) {
  if (!Array.isArray(value)) errors.push(`${label} must be an array.`);
}

const mode = readJson("content/meta/content-mode.json");
const policy = readJson("content/validation/production-eligibility.policy.json");
const sources = readJson("content/sources/sources.json") || [];
const questions = readJson("content/questions/caba-b.unofficial-fallback.questions.json") || [];
const shardedContent = combinedContentFromShards(root);
errors.push(...shardedContent.errors);
errors.push(...assertGeneratedContentIndexesFresh(root));
if (qualityGate) {
  for (const [kind, shards] of Object.entries(shardedContent.shards || {})) {
    for (const { relativePath, shard } of shards) {
      if (shard.qualityStatus !== "complete") {
        errors.push(`${relativePath}: ${kind} shard qualityStatus must be complete for the full content quality gate.`);
      }
    }
  }
}
const translations = shardedContent.translations || [];
const translationAlignmentEvidence = readJson("content/validation/ru-translation-alignment.evidence.json");
const explanations = shardedContent.explanations || [];
const questionImageMetadata = shardedContent.imageMetadataManifest;
const questionImageMetadataEvidence = readJson("content/validation/question-image-metadata.evidence.json");
const explanationAlignmentEvidence = readJson("content/validation/ru-explanation-alignment.evidence.json");
const vocabulary = readJson("content/vocabulary/ru.vocabulary.json") || [];
const guide = readJson("content/guide/ru.condensed-guide.json") || [];
const cabaExamProcessGuide = readJson("content/guide/caba-exam-process.ru.json");
const topicGuide = readJson("content/guide/topic-study-guide.ru.json");
const topicGuideCoverage = readJson("content/guide/topic-study-guide.coverage.json");
const topicGuideSourceTrace = readJson("content/guide/topic-study-guide.source-trace.json");
const officialDocumentsManifest = readJson("content/official-documents/manifest.json");
const primarySourcesCorpus = readJson("content/primary-sources/primary-sources.ru.json");
const primarySourcesCoverage = readJson("content/primary-sources/primary-sources.coverage.json");
const primarySourcesQa = readJson("content/primary-sources/primary-sources.qa.json");
const primarySourcesSearch = readJson("content/primary-sources/primary-sources.search.json");
const primarySources = combinePrimarySourceShards({
  root,
  corpus: primarySourcesCorpus,
  qa: primarySourcesQa,
  searchIndex: primarySourcesSearch
});
errors.push(...primarySources.errors);
const primarySourcesValidationMode = process.env.PRIMARY_SOURCES_VALIDATION_MODE || "draft";
const exam = readJson("content/config/caba-exam-format.json");
const approvals = readJson("content/validation/validator-approvals.json") || [];
const exceptions = readJson("content/validation/release-exceptions.json") || [];

const allowedModes = new Set(policy?.contentAvailabilityModes || []);
if (!mode || !allowedModes.has(mode.mode)) errors.push(`Unsupported content mode: ${mode?.mode}`);
if (mode?.mode !== "unofficial_b_fallback") errors.push("Current MVP must use unofficial_b_fallback until official B question bank is validated.");
if (!mode?.label?.includes("not an official question bank")) errors.push("Content mode label must block official question-bank claims.");

const sourceById = new Map();
for (const source of sources) {
  requireString(source.id, "source.id");
  if (sourceById.has(source.id)) errors.push(`Duplicate source id: ${source.id}`);
  sourceById.set(source.id, source);
  if (!policy.allowedJurisdictions.includes(source.jurisdiction)) errors.push(`${source.id}: unsupported jurisdiction ${source.jurisdiction}`);
  if (!policy.allowedSourceStatuses.includes(source.status)) errors.push(`${source.id}: unsupported source status ${source.status}`);
  if (source.hashAlgorithm !== "sha256") errors.push(`${source.id}: hashAlgorithm must be sha256`);
  if (policy.requireSourceHash) requireString(source.hash, `${source.id}.hash`);
  if (!source.localPath || !existsSync(path(source.localPath))) errors.push(`${source.id}: localPath is missing on disk`);
  if (source.localPath && existsSync(path(source.localPath)) && source.hash && sha256(source.localPath) !== source.hash) {
    errors.push(`${source.id}: source hash mismatch for ${source.localPath}`);
  }
}

if (!exam) {
  errors.push("Missing exam format config.");
} else {
  if (exam.jurisdiction !== "CABA") errors.push("Exam config jurisdiction must be CABA.");
  const examSource = sourceById.get(exam.sourceId);
  if (!examSource) errors.push(`Exam source not found: ${exam.sourceId}`);
  if (examSource && exam.sourceHash !== examSource.hash) errors.push("Exam sourceHash must match source registry hash.");
  for (const [field, type] of Object.entries({
    questionCount: "number",
    timeLimitMinutes: "number",
    passingScore: "number",
    scoringRule: "string",
    questionOrderRule: "string",
    completionRule: "string",
    status: "string"
  })) {
    if (typeof exam[field] !== type) errors.push(`Exam config ${field} must be ${type}.`);
  }
  if (exam.status === "defined" && (exam.questionCount <= 0 || exam.timeLimitMinutes <= 0 || exam.passingScore <= 0)) {
    errors.push("Defined exam config must include positive numeric parameters.");
  }
}

const activeExceptionSourceIds = new Set();
for (const exception of exceptions) {
  if (exception.status !== "active") continue;
  for (const sourceId of exception.sourceIds || []) activeExceptionSourceIds.add(sourceId);
}

const questionIds = new Set();
let imageCount = 0;
for (const question of questions) {
  requireString(question.id, "question.id");
  if (questionIds.has(question.id)) errors.push(`Duplicate question id: ${question.id}`);
  questionIds.add(question.id);
  if (question.category !== "B") errors.push(`${question.id}: only category B questions are allowed.`);
  const source = sourceById.get(question.sourceId);
  errors.push(...validatePracticeQuestionSourceScope({ question, source, policy }));
  if (!source) errors.push(`${question.id}: source not found: ${question.sourceId}`);
  if (question.contentStatus === "unofficial_fallback") {
    if (!policy.allowUnofficialFallbackPractice) errors.push(`${question.id}: unofficial fallback practice is disabled by policy.`);
    if (!source?.unofficial) errors.push(`${question.id}: fallback questions must use an explicitly unofficial source.`);
    if (question.status !== "needs_review") errors.push(`${question.id}: fallback question status must stay needs_review.`);
    if (policy.requireFallbackPracticeReleaseException && !activeExceptionSourceIds.has(question.sourceId)) {
      errors.push(`${question.id}: fallback source must be covered by an active release exception.`);
    }
  } else if (policy.requireOfficialQuestionApprovalId && !question.validation?.approvalId) {
    errors.push(`${question.id}: official production question requires validation.approvalId.`);
  }
  if (question.jurisdiction !== "CABA") errors.push(`${question.id}: jurisdiction must be CABA.`);
  requireString(question.officialTextEs, `${question.id}.officialTextEs`);
  requireArray(question.answers, `${question.id}.answers`);
  if (!question.answers?.some((answer) => answer.id === question.correctAnswerId)) errors.push(`${question.id}: correctAnswerId must point to an answer.`);
  if (question.image) {
    imageCount += 1;
    if (/^https?:\/\//.test(question.image.localPath)) errors.push(`${question.id}: image.localPath must be local, not remote.`);
    if (!existsSync(path(question.image.localPath))) errors.push(`${question.id}: image file missing: ${question.image.localPath}`);
    if (existsSync(path(question.image.localPath)) && sha256(question.image.localPath) !== question.image.sha256) errors.push(`${question.id}: image hash mismatch.`);
  }
}
if (questions.length < 100) warnings.push("Fallback B question set has fewer than 100 questions.");
if (imageCount < 1) errors.push("Question set must include local images where source questions reference images.");

for (const translation of translations) {
  if (!questionIds.has(translation.questionId)) errors.push(`Translation references missing question ${translation.questionId}`);
  if (!translation.disclaimer?.includes("Неофициальный")) errors.push(`${translation.questionId}: translation disclaimer must mark unofficial status.`);
}
errors.push(
  ...validateTranslationAlignment({
    questions,
    translations,
    evidence: translationAlignmentEvidence,
    locale: "ru",
    requireFullQuality: qualityGate
  })
);
errors.push(
  ...validateQuestionImageMetadata({
    questions,
    manifest: questionImageMetadata,
    evidence: questionImageMetadataEvidence,
    requireFullQuality: qualityGate
  })
);

for (const explanation of explanations) {
  if (!questionIds.has(explanation.questionId)) errors.push(`Explanation references missing question ${explanation.questionId}`);
  if (!explanation.disclaimer?.includes("не является официальной")) errors.push(`${explanation.questionId}: explanation disclaimer is missing official-status language.`);
  for (const sourceId of explanation.relatedSourceIds || []) {
    if (!sourceById.has(sourceId)) errors.push(`${explanation.questionId}: explanation source missing ${sourceId}`);
  }
}
errors.push(
  ...validateExplanationAlignment({
    questions,
    explanations,
    imageMetadataManifest: questionImageMetadata,
    evidence: explanationAlignmentEvidence,
    locale: "ru",
    requireFullQuality: qualityGate
  })
);

for (const term of vocabulary) {
  requireString(term.id, "vocabulary.id");
  for (const questionId of term.sourceQuestionIds || []) {
    if (!questionIds.has(questionId)) errors.push(`${term.id}: vocabulary question missing ${questionId}`);
  }
}

for (const item of guide) {
  requireString(item.id, "guide.id");
  if (!item.disclaimer?.includes("не официальный")) errors.push(`${item.id}: guide disclaimer must mark unofficial status.`);
  for (const sourceId of item.sourceIds || []) {
    if (!sourceById.has(sourceId)) errors.push(`${item.id}: guide source missing ${sourceId}`);
  }
  for (const questionId of item.relatedQuestionIds || []) {
    if (!questionIds.has(questionId)) errors.push(`${item.id}: guide question missing ${questionId}`);
  }
}

errors.push(
  ...validateCabaExamProcessGuide({
    guide: cabaExamProcessGuide,
    fileExists: (relativePath) => existsSync(path(relativePath))
  })
);
errors.push(
  ...validateTopicGuide({
    questions,
    guide: topicGuide,
    coverage: topicGuideCoverage,
    sourceTrace: topicGuideSourceTrace
  })
);
errors.push(
  ...validateOfficialDocumentsManifest({
    manifest: officialDocumentsManifest,
    sourceTrace: topicGuideSourceTrace,
    fileMetadata: (relativePath) => {
      const exists = existsSync(path(relativePath));
      return {
        exists,
        ...(exists ? { sha256: sha256(relativePath) } : {})
      };
    }
  })
);
errors.push(
  ...validatePrimarySources({
    manifest: officialDocumentsManifest,
    corpus: primarySources.corpus,
    coverage: primarySourcesCoverage,
    qa: primarySources.qa,
    searchIndex: primarySources.searchIndex,
    mode: primarySourcesValidationMode,
    root,
    learnerContentPaths: primarySources.learnerContentPaths
  })
);
const difficultyValidation = validateDifficultyContent({ questions, topicGuide });
errors.push(...difficultyValidation.errors);

const exceptionByApproval = new Map();
for (const exception of exceptions) {
  if (exception.status !== "active") continue;
  for (const approvalId of exception.approvalIds || []) exceptionByApproval.set(approvalId, exception);
}
for (const approval of approvals) {
  if (approval.status !== "approved") errors.push(`${approval.id}: approval must be approved.`);
  if (approval.soloSelfAudit && approval.releaseReadiness === "needs_external_review" && !exceptionByApproval.has(approval.id)) {
    errors.push(`${approval.id}: solo self-audit requires an active release exception.`);
  }
  if (!approval.evidenceBundlePath || !existsSync(path(approval.evidenceBundlePath))) errors.push(`${approval.id}: evidence bundle missing.`);
  for (const sourceId of approval.sourceIds || []) {
    const source = sourceById.get(sourceId);
    if (!source) errors.push(`${approval.id}: approval source missing ${sourceId}`);
    if (source && approval.sourceHashes?.[sourceId] !== source.hash) errors.push(`${approval.id}: approval source hash mismatch for ${sourceId}`);
  }
}

if (errors.length) {
  console.error("Content validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

for (const warning of warnings) console.warn(`Warning: ${warning}`);
console.log(`Difficulty labels validated: ${difficultyValidation.questionCount} questions, ${difficultyValidation.topicCount} topics.`);
console.log(
  `Content validation passed: ${questions.length} category B fallback questions, ${imageCount} local image references${
    qualityGate ? ", full content quality gate enabled" : ""
  }.`
);
