import { createHash } from "node:crypto";

export const DIFFICULTY_RUBRIC_VERSION = "cabadrive-difficulty-v1";
export const DIFFICULTY_PROVENANCE_METHOD = "manual_rubric_review";

export const DIFFICULTY_LEVELS = ["green", "blue", "yellow", "red"];
export const LEGACY_DIFFICULTY_LEVELS = ["low", "medium", "high"];
export const DIFFICULTY_DIMENSIONS = [
  "simple_common_spanish",
  "spanish_lexical_load",
  "legal_admin_terms",
  "caba_rf_divergence",
  "rule_complexity",
  "numbers_thresholds",
  "trap_negation",
  "visual_cue_load",
  "cross_topic_dependence"
];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const LEVEL_SET = new Set(DIFFICULTY_LEVELS);
const LEGACY_LEVEL_SET = new Set(LEGACY_DIFFICULTY_LEVELS);
const DIMENSION_SET = new Set(DIFFICULTY_DIMENSIONS);

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function uniqueSorted(values) {
  return [...new Set(values)].sort();
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

function questionDifficultySource(question) {
  return {
    id: question?.id,
    sourceId: question?.sourceId,
    jurisdiction: question?.jurisdiction,
    category: question?.category,
    contentStatus: question?.contentStatus,
    officialTextEs: question?.officialTextEs,
    answers: asArray(question?.answers).map((answer) => ({
      id: answer?.id,
      officialTextEs: answer?.officialTextEs
    })),
    correctAnswerId: question?.correctAnswerId,
    image: question?.image
      ? {
          localPath: question.image.localPath,
          sha256: question.image.sha256,
          altEs: question.image.altEs
        }
      : undefined,
    topics: asArray(question?.topics),
    vocabularyTermIds: asArray(question?.vocabularyTermIds),
    flags: question?.flags,
    status: question?.status,
    validation: question?.validation
  };
}

function topicDifficultySource(topic) {
  return {
    id: topic?.id,
    slug: topic?.slug,
    status: topic?.status,
    titleRu: topic?.titleRu,
    summaryRu: topic?.summaryRu,
    learningMaterialRu: asArray(topic?.learningMaterialRu),
    practicalReasoningRu: asArray(topic?.practicalReasoningRu),
    spanishTerms: asArray(topic?.spanishTerms).map((term) => ({
      id: term?.id,
      termEs: term?.termEs,
      translationRu: term?.translationRu,
      sourceQuestionIds: asArray(term?.sourceQuestionIds)
    })),
    tickets: asArray(topic?.tickets).map((ticket) => ({
      questionId: ticket?.questionId,
      imageLocalPath: ticket?.imageLocalPath,
      sourceConflictNoteRu: ticket?.sourceConflictNoteRu,
      answerExplanations: asArray(ticket?.answerExplanations).map((explanation) => ({
        answerId: explanation?.answerId,
        verdict: explanation?.verdict,
        explanationRu: explanation?.explanationRu
      }))
    })),
    trapNotes: asArray(topic?.trapNotes).map((note) => ({
      id: note?.id,
      textRu: note?.textRu,
      sourceQuestionIds: asArray(note?.sourceQuestionIds)
    })),
    claims: asArray(topic?.claims).map((claim) => ({
      id: claim?.id,
      textRu: claim?.textRu,
      requiresOfficialSource: claim?.requiresOfficialSource,
      sourceTraceId: claim?.sourceTraceId
    }))
  };
}

export function difficultyQuestionFingerprint(question) {
  return sha256Canonical(questionDifficultySource(question));
}

export function difficultyTopicFingerprint(topic) {
  return sha256Canonical(topicDifficultySource(topic));
}

export function ticketQuestionIdsSha256(topic) {
  return sha256Canonical(uniqueSorted(asArray(topic?.tickets).map((ticket) => ticket?.questionId).filter(isNonEmptyString)));
}

export function buildTopicDifficultyBasis(topic, questionById) {
  const questionLevelCounts = Object.fromEntries(DIFFICULTY_LEVELS.map((level) => [level, 0]));
  const dimensionCounts = new Map();

  for (const ticket of asArray(topic?.tickets)) {
    const question = questionById.get(ticket?.questionId);
    if (question && LEVEL_SET.has(question.difficulty)) questionLevelCounts[question.difficulty] += 1;
    for (const dimension of asArray(question?.difficultyMeta?.dimensions)) {
      if (!DIMENSION_SET.has(dimension)) continue;
      dimensionCounts.set(dimension, (dimensionCounts.get(dimension) || 0) + 1);
    }
  }

  const dominantDimensions = [...dimensionCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 4)
    .map(([dimension]) => dimension);

  return {
    questionLevelCounts,
    ticketQuestionIdsSha256: ticketQuestionIdsSha256(topic),
    dominantDimensions
  };
}

function validateDifficultyCore({ owner, value, meta, expectedFingerprint, errors, requireBasis = false }) {
  if (!isNonEmptyString(value)) {
    errors.push(`${owner}: difficulty must be one of ${DIFFICULTY_LEVELS.join(", ")}.`);
  } else if (LEGACY_LEVEL_SET.has(value)) {
    errors.push(`${owner}: legacy difficulty ${value} is not allowed; use green, blue, yellow, or red.`);
  } else if (!LEVEL_SET.has(value)) {
    errors.push(`${owner}: unsupported difficulty ${value}.`);
  }

  if (!isPlainObject(meta)) {
    errors.push(`${owner}: difficultyMeta must be an object.`);
    return;
  }
  if (Object.hasOwn(meta, "level")) errors.push(`${owner}: difficultyMeta must not duplicate the difficulty level.`);
  if (meta.rubricVersion !== DIFFICULTY_RUBRIC_VERSION) {
    errors.push(`${owner}: difficultyMeta.rubricVersion must be ${DIFFICULTY_RUBRIC_VERSION}.`);
  }
  if (!Array.isArray(meta.dimensions) || meta.dimensions.length === 0) {
    errors.push(`${owner}: difficultyMeta.dimensions must be a non-empty array.`);
  } else {
    const seen = new Set();
    for (const dimension of meta.dimensions) {
      if (!DIMENSION_SET.has(dimension)) errors.push(`${owner}: unsupported difficulty dimension ${dimension}.`);
      if (seen.has(dimension)) errors.push(`${owner}: duplicate difficulty dimension ${dimension}.`);
      seen.add(dimension);
    }
  }
  if (!isNonEmptyString(meta.rationaleRu)) errors.push(`${owner}: difficultyMeta.rationaleRu must be a non-empty string.`);
  if (!isPlainObject(meta.provenance)) {
    errors.push(`${owner}: difficultyMeta.provenance must be an object.`);
  } else {
    if (meta.provenance.method !== DIFFICULTY_PROVENANCE_METHOD) {
      errors.push(`${owner}: difficultyMeta.provenance.method must be ${DIFFICULTY_PROVENANCE_METHOD}.`);
    }
    if (!isNonEmptyString(meta.provenance.reviewer)) errors.push(`${owner}: difficultyMeta.provenance.reviewer must be a non-empty string.`);
    if (!DATE_PATTERN.test(meta.provenance.reviewedAt || "")) {
      errors.push(`${owner}: difficultyMeta.provenance.reviewedAt must be YYYY-MM-DD.`);
    }
  }
  if (!SHA256_PATTERN.test(meta.sourceFingerprint || "")) {
    errors.push(`${owner}: difficultyMeta.sourceFingerprint must be a sha256 hex string.`);
  } else if (meta.sourceFingerprint !== expectedFingerprint) {
    errors.push(`${owner}: difficultyMeta.sourceFingerprint is stale.`);
  }
  if (requireBasis && !isPlainObject(meta.basis)) {
    errors.push(`${owner}: difficultyMeta.basis must be an object.`);
  }
}

export function validateQuestionDifficulty(question) {
  const errors = [];
  const owner = isNonEmptyString(question?.id) ? question.id : "question";
  validateDifficultyCore({
    owner,
    value: question?.difficulty,
    meta: question?.difficultyMeta,
    expectedFingerprint: difficultyQuestionFingerprint(question),
    errors
  });
  return errors;
}

export function validateTopicDifficulty(topic, questionById) {
  const errors = [];
  const owner = isNonEmptyString(topic?.id) ? topic.id : "topic guide topic";
  validateDifficultyCore({
    owner,
    value: topic?.difficulty,
    meta: topic?.difficultyMeta,
    expectedFingerprint: difficultyTopicFingerprint(topic),
    errors,
    requireBasis: true
  });

  const basis = topic?.difficultyMeta?.basis;
  if (isPlainObject(basis)) {
    const expectedBasis = buildTopicDifficultyBasis(topic, questionById);
    if (!isPlainObject(basis.questionLevelCounts)) {
      errors.push(`${owner}: difficultyMeta.basis.questionLevelCounts must be an object.`);
    } else {
      for (const level of DIFFICULTY_LEVELS) {
        if (basis.questionLevelCounts[level] !== expectedBasis.questionLevelCounts[level]) {
          errors.push(`${owner}: difficultyMeta.basis.questionLevelCounts.${level} must match current topic tickets.`);
        }
      }
      for (const level of Object.keys(basis.questionLevelCounts)) {
        if (!LEVEL_SET.has(level)) errors.push(`${owner}: difficultyMeta.basis.questionLevelCounts has unsupported level ${level}.`);
      }
    }

    if (basis.ticketQuestionIdsSha256 !== expectedBasis.ticketQuestionIdsSha256) {
      errors.push(`${owner}: difficultyMeta.basis.ticketQuestionIdsSha256 is stale.`);
    }

    if (!Array.isArray(basis.dominantDimensions) || basis.dominantDimensions.length === 0) {
      errors.push(`${owner}: difficultyMeta.basis.dominantDimensions must be a non-empty array.`);
    } else {
      const seen = new Set();
      for (const dimension of basis.dominantDimensions) {
        if (!DIMENSION_SET.has(dimension)) errors.push(`${owner}: unsupported basis dominant dimension ${dimension}.`);
        if (seen.has(dimension)) errors.push(`${owner}: duplicate basis dominant dimension ${dimension}.`);
        seen.add(dimension);
      }
      if (basis.dominantDimensions.join(",") !== expectedBasis.dominantDimensions.join(",")) {
        errors.push(`${owner}: difficultyMeta.basis.dominantDimensions must match current topic tickets.`);
      }
    }
  }

  return errors;
}

export function validateDifficultyContent({ questions, topicGuide }) {
  const errors = [];
  const questionList = asArray(questions);
  const topicList = asArray(topicGuide?.topics);
  const questionById = new Map();

  for (const question of questionList) {
    if (isNonEmptyString(question?.id)) questionById.set(question.id, question);
    errors.push(...validateQuestionDifficulty(question));
  }

  if (!isPlainObject(topicGuide)) {
    errors.push("topic guide content must be an object before difficulty validation.");
  } else {
    for (const topic of topicList) errors.push(...validateTopicDifficulty(topic, questionById));
  }

  return {
    errors,
    questionCount: questionList.length,
    topicCount: topicList.length
  };
}
