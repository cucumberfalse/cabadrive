import { createHash } from "node:crypto";

const CHECK_FIELDS = ["questionTextAligned", "answerChoicesAligned", "answerIdsAligned"];
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const DRAFT_WRAPPER_PATTERN = /Учебный перевод-смысл:|Смысл варианта:|глоссарн|чернов/i;
const SPANISH_MARKER_PATTERN =
  /[¿¡]|\b(que|qué|indica|señal|senal|veh[ií]culo|vehiculos|vehículos|conductor|conductores|peat[oó]n|peatones|porque|seg[uú]n|para|como|cuando|solo|s[oó]lo|verdadero|falso|prohibido|estacionar|circular|calzada|carril|derecha|izquierda|prioridad|balizas|luces|siniestro|vial)\b/i;
const LATIN_TOKEN_PATTERN = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{3,}/g;
const ALLOWED_LATIN_TOKENS = new Set([
  "abs",
  "airbag",
  "caba",
  "dni",
  "gps",
  "http",
  "https",
  "iso",
  "pdf",
  "url",
  "vtv"
]);

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function latinResidueTokens(value) {
  if (typeof value !== "string") return [];
  return (value.match(LATIN_TOKEN_PATTERN) || [])
    .map((token) => token.toLowerCase())
    .filter((token) => !ALLOWED_LATIN_TOKENS.has(token));
}

function hasTranslationQualityResidue(value) {
  return typeof value === "string" && (DRAFT_WRAPPER_PATTERN.test(value) || SPANISH_MARKER_PATTERN.test(value) || latinResidueTokens(value).length > 0);
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

export function sourceTupleForQuestion(question) {
  return {
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
  };
}

export function translationTupleForQuestion(question, translation) {
  const answerTranslations = isPlainObject(translation.answerTranslations) ? translation.answerTranslations : {};
  return {
    questionId: translation.questionId,
    questionTextRu: translation.questionTextRu,
    answerTranslations: (question.answers || []).map((answer) => ({
      id: answer.id,
      textRu: answerTranslations[answer.id] || ""
    }))
  };
}

export function translationAlignmentFingerprints(question, translation) {
  return {
    sourceTextSha256: sha256Canonical(sourceTupleForQuestion(question)),
    translationTextSha256: sha256Canonical(translationTupleForQuestion(question, translation))
  };
}

export function buildTranslationAlignmentEvidenceEntry({ question, translation, reviewer, reviewedAt, notes }) {
  return {
    questionId: translation.questionId,
    status: "approved",
    reviewer,
    reviewedAt,
    ...translationAlignmentFingerprints(question, translation),
    checks: {
      questionTextAligned: true,
      answerChoicesAligned: true,
      answerIdsAligned: true
    },
    notes
  };
}

export function validateTranslationAlignment({ questions, translations, evidence, locale = "ru", strictCoverage = true, requireFullQuality = false }) {
  const errors = [];
  const questionById = new Map((questions || []).map((question) => [question.id, question]));
  const translationQuestionIds = new Set();
  const translationByQuestionId = new Map();

  if (!evidence || typeof evidence !== "object") {
    errors.push("translation alignment evidence must be an object.");
  } else {
    if (evidence.locale !== locale) errors.push(`translation alignment evidence locale must be ${locale}.`);
    if (evidence.version !== 1) errors.push("translation alignment evidence version must be 1.");
  }

  const evidenceEntries = Array.isArray(evidence?.entries) ? evidence.entries : [];
  if (!Array.isArray(evidence?.entries)) errors.push("translation alignment evidence entries must be an array.");
  const evidenceByQuestionId = new Map();

  for (const entry of evidenceEntries) {
    const label = isNonEmptyString(entry?.questionId) ? entry.questionId : "translation evidence entry";
    if (!isPlainObject(entry)) {
      errors.push("translation evidence entry must be an object.");
      continue;
    }
    if (!isNonEmptyString(entry.questionId)) errors.push(`${label}: evidence questionId must be a non-empty string.`);
    if (evidenceByQuestionId.has(entry.questionId)) errors.push(`${entry.questionId}: duplicate translation alignment evidence.`);
    evidenceByQuestionId.set(entry.questionId, entry);
    if (entry.status !== "approved") errors.push(`${label}: translation alignment evidence status must be approved.`);
    if (!isNonEmptyString(entry.reviewer)) errors.push(`${label}: translation alignment evidence reviewer must be a non-empty string.`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewedAt || "")) {
      errors.push(`${label}: translation alignment evidence reviewedAt must be YYYY-MM-DD.`);
    }
    if (!SHA256_PATTERN.test(entry.sourceTextSha256 || "")) errors.push(`${label}: sourceTextSha256 must be a sha256 hex digest.`);
    if (!SHA256_PATTERN.test(entry.translationTextSha256 || "")) errors.push(`${label}: translationTextSha256 must be a sha256 hex digest.`);
    for (const check of CHECK_FIELDS) {
      if (entry.checks?.[check] !== true) errors.push(`${label}: evidence checks.${check} must be true.`);
    }
  }

  for (const translation of translations || []) {
    if (!isNonEmptyString(translation.questionId)) {
      errors.push("translation questionId must be a non-empty string.");
      continue;
    }
    if (translationByQuestionId.has(translation.questionId)) errors.push(`${translation.questionId}: duplicate translation entry.`);
    translationByQuestionId.set(translation.questionId, translation);
    translationQuestionIds.add(translation.questionId);

    const question = questionById.get(translation.questionId);
    if (!question) {
      errors.push(`${translation.questionId}: translation references missing question.`);
      continue;
    }

    if (!isNonEmptyString(translation.questionTextRu)) errors.push(`${translation.questionId}: questionTextRu must be a non-empty string.`);
    if (requireFullQuality && hasTranslationQualityResidue(translation.questionTextRu)) {
      errors.push(`${translation.questionId}: questionTextRu contains draft-wrapper, untranslated Spanish, transliteration, or unsupported Latin residue.`);
    }
    if (!isPlainObject(translation.answerTranslations)) errors.push(`${translation.questionId}: answerTranslations must be an object.`);

    const answerTranslations = isPlainObject(translation.answerTranslations) ? translation.answerTranslations : {};
    const sourceAnswerIds = new Set((question.answers || []).map((answer) => answer.id));
    const translationAnswerIds = new Set(Object.keys(answerTranslations));

    for (const answerId of sourceAnswerIds) {
      if (!translationAnswerIds.has(answerId)) {
        errors.push(`${translation.questionId}: missing answer translation for ${answerId}.`);
      } else if (!isNonEmptyString(answerTranslations[answerId])) {
        errors.push(`${translation.questionId}: answer translation for ${answerId} must be a non-empty string.`);
      } else if (requireFullQuality && hasTranslationQualityResidue(answerTranslations[answerId])) {
        errors.push(
          `${translation.questionId}: answer translation for ${answerId} contains draft-wrapper, untranslated Spanish, transliteration, or unsupported Latin residue.`
        );
      }
    }

    for (const answerId of translationAnswerIds) {
      if (!sourceAnswerIds.has(answerId)) errors.push(`${translation.questionId}: extra answer translation for ${answerId}.`);
    }

    const entry = evidenceByQuestionId.get(translation.questionId);
    if (!entry) {
      errors.push(`${translation.questionId}: missing approved translation alignment evidence.`);
      continue;
    }

    const fingerprints = translationAlignmentFingerprints(question, translation);
    if (entry.sourceTextSha256 !== fingerprints.sourceTextSha256) {
      errors.push(`${translation.questionId}: translation alignment source fingerprint mismatch.`);
    }
    if (entry.translationTextSha256 !== fingerprints.translationTextSha256) {
      errors.push(`${translation.questionId}: translation alignment translation fingerprint mismatch.`);
    }
  }

  if (strictCoverage) {
    for (const question of questions || []) {
      if (!translationByQuestionId.has(question.id)) errors.push(`${question.id}: missing translation entry.`);
    }
  }

  for (const entry of evidenceEntries) {
    if (isNonEmptyString(entry?.questionId) && !translationQuestionIds.has(entry.questionId)) {
      errors.push(`${entry.questionId}: translation alignment evidence has no matching translation entry.`);
    }
  }

  return errors;
}
