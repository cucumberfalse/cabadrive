import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DIFFICULTY_RUBRIC_VERSION,
  buildTopicDifficultyBasis,
  difficultyQuestionFingerprint,
  difficultyTopicFingerprint,
  validateDifficultyContent,
  validateQuestionDifficulty,
  validateTopicDifficulty
} from "../scripts/content-difficulty.mjs";

function question(overrides = {}) {
  const base = {
    id: "q1",
    sourceId: "source-b",
    jurisdiction: "CABA",
    category: "B",
    contentStatus: "unofficial_fallback",
    officialTextEs: "¿Qué indica esta seña?",
    answers: [
      { id: "q1-a1", officialTextEs: "Adelantamiento por la derecha." },
      { id: "q1-a2", officialTextEs: "Giro a la derecha." }
    ],
    correctAnswerId: "q1-a2",
    topics: ["signs"],
    vocabularyTermIds: [],
    flags: { hasImage: true, hasNegationOrException: false },
    status: "needs_review",
    validation: { sourceChecked: true },
    difficulty: "blue"
  };
  const candidate = { ...base, ...overrides };
  return {
    ...candidate,
    difficultyMeta: difficultyMeta(candidate, overrides.difficultyMeta)
  };
}

function difficultyMeta(owner, overrides = {}) {
  return {
    rubricVersion: DIFFICULTY_RUBRIC_VERSION,
    dimensions: ["visual_cue_load"],
    rationaleRu: "Картинка требует распознать жест, но правило остается знакомым опытному водителю.",
    provenance: {
      method: "manual_rubric_review",
      reviewer: "cabadrive-017",
      reviewedAt: "2026-05-10"
    },
    sourceFingerprint: difficultyQuestionFingerprint(owner),
    ...overrides
  };
}

function topic(overrides = {}, questions = [question()]) {
  const base = {
    id: "signals",
    slug: "signals",
    status: "draft",
    titleRu: "Жесты",
    summaryRu: "Короткий блок про жесты.",
    learningMaterialRu: ["Смотрите на слово seña и смысл жеста."],
    practicalReasoningRu: ["Жесты помогают понять намерение водителя."],
    spanishTerms: [
      {
        id: "term-sena",
        termEs: "seña",
        translationRu: "жест",
        sourceQuestionIds: ["q1"]
      }
    ],
    tickets: [
      {
        questionId: "q1",
        answerExplanations: [
          { answerId: "q1-a1", verdict: "incorrect", explanationRu: "Это не тот жест." },
          { answerId: "q1-a2", verdict: "correct", explanationRu: "Жест показывает поворот направо." }
        ]
      }
    ],
    trapNotes: [{ id: "trap-sena", textRu: "Seña здесь означает жест.", sourceQuestionIds: ["q1"] }],
    claims: []
  };
  const candidate = { ...base, ...overrides };
  const questionById = new Map(questions.map((item) => [item.id, item]));
  return {
    ...candidate,
    difficulty: "blue",
    difficultyMeta: {
      rubricVersion: DIFFICULTY_RUBRIC_VERSION,
      dimensions: ["visual_cue_load"],
      rationaleRu: "Тема опирается на визуальные жесты и одно испанское слово, но без сложной правовой логики.",
      provenance: {
        method: "manual_rubric_review",
        reviewer: "cabadrive-017",
        reviewedAt: "2026-05-10"
      },
      sourceFingerprint: difficultyTopicFingerprint(candidate),
      basis: buildTopicDifficultyBasis(candidate, questionById),
      ...overrides.difficultyMeta
    }
  };
}

test("valid question and topic difficulty metadata passes", () => {
  const validQuestion = question();
  const validTopic = topic({}, [validQuestion]);
  assert.deepEqual(validateQuestionDifficulty(validQuestion), []);
  assert.deepEqual(validateTopicDifficulty(validTopic, new Map([[validQuestion.id, validQuestion]])), []);
  assert.deepEqual(
    validateDifficultyContent({
      questions: [validQuestion],
      topicGuide: { topics: [validTopic] }
    }).errors,
    []
  );
});

test("invalid and legacy difficulty enum values fail", () => {
  assert(validateQuestionDifficulty(question({ difficulty: "medium" })).includes("q1: legacy difficulty medium is not allowed; use green, blue, yellow, or red."));
  assert(validateQuestionDifficulty(question({ difficulty: "purple" })).includes("q1: unsupported difficulty purple."));
});

test("missing rationale, provenance, and dimensions fail", () => {
  const invalid = question({
    difficultyMeta: {
      dimensions: [],
      rationaleRu: "",
      provenance: undefined
    }
  });
  const errors = validateQuestionDifficulty(invalid);
  assert(errors.includes("q1: difficultyMeta.dimensions must be a non-empty array."));
  assert(errors.includes("q1: difficultyMeta.rationaleRu must be a non-empty string."));
  assert(errors.includes("q1: difficultyMeta.provenance must be an object."));
});

test("duplicate and unsupported dimensions fail", () => {
  const invalid = question({
    difficultyMeta: {
      dimensions: ["visual_cue_load", "visual_cue_load", "made_up_dimension"]
    }
  });
  const errors = validateQuestionDifficulty(invalid);
  assert(errors.includes("q1: duplicate difficulty dimension visual_cue_load."));
  assert(errors.includes("q1: unsupported difficulty dimension made_up_dimension."));
});

test("stale question source fingerprint fails", () => {
  const valid = question();
  const changed = {
    ...valid,
    officialTextEs: "¿Texto cambiado?"
  };
  assert(validateQuestionDifficulty(changed).includes("q1: difficultyMeta.sourceFingerprint is stale."));
});

test("stale topic basis hash and coverage fail", () => {
  const q1 = question();
  const q2 = question({ id: "q2", difficulty: "red", topics: ["priority"] });
  const validTopic = topic({}, [q1]);
  const mutatedTopic = {
    ...validTopic,
    tickets: [
      ...validTopic.tickets,
      {
        questionId: "q2",
        answerExplanations: [
          { answerId: "q1-a1", verdict: "incorrect", explanationRu: "Synthetic." },
          { answerId: "q1-a2", verdict: "correct", explanationRu: "Synthetic." }
        ]
      }
    ]
  };
  const errors = validateTopicDifficulty(mutatedTopic, new Map([[q1.id, q1], [q2.id, q2]]));
  assert(errors.includes("signals: difficultyMeta.sourceFingerprint is stale."));
  assert(errors.includes("signals: difficultyMeta.basis.questionLevelCounts.red must match current topic tickets."));
  assert(errors.includes("signals: difficultyMeta.basis.ticketQuestionIdsSha256 is stale."));
});

test("stale topic dominant dimensions fail", () => {
  const validQuestion = question();
  const validTopic = topic({}, [validQuestion]);
  const invalidTopic = {
    ...validTopic,
    difficultyMeta: {
      ...validTopic.difficultyMeta,
      basis: {
        ...validTopic.difficultyMeta.basis,
        dominantDimensions: ["trap_negation"]
      }
    }
  };
  const errors = validateTopicDifficulty(invalidTopic, new Map([[validQuestion.id, validQuestion]]));
  assert(errors.includes("signals: difficultyMeta.basis.dominantDimensions must match current topic tickets."));
});
