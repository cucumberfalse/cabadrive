import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  buildTranslationAlignmentEvidenceEntry,
  validateTranslationAlignment
} from "../scripts/content-translation-alignment.mjs";

const baseQuestion = {
  id: "q1",
  officialTextEs: "¿Qué indica esta seña?",
  answers: [
    { id: "q1-a1", officialTextEs: "Adelantamiento por la derecha." },
    { id: "q1-a2", officialTextEs: "Giro a la derecha." }
  ],
  correctAnswerId: "q1-a2",
  image: {
    sha256: "0".repeat(64)
  }
};

const baseTranslation = {
  questionId: "q1",
  questionTextRu: "Что означает этот жест?",
  answerTranslations: {
    "q1-a1": "Обгон справа.",
    "q1-a2": "Поворот направо."
  }
};

function evidenceFor(question = baseQuestion, translation = baseTranslation) {
  return {
    locale: "ru",
    version: 1,
    entries: [
      buildTranslationAlignmentEvidenceEntry({
        question,
        translation,
        reviewer: "Cabadrive solo self-audit",
        reviewedAt: "2026-05-08",
        notes: "Synthetic test evidence."
      })
    ]
  };
}

function validate({ question = baseQuestion, translation = baseTranslation, evidence = evidenceFor(question, translation) } = {}) {
  return validateTranslationAlignment({
    questions: [question],
    translations: [translation],
    evidence,
    locale: "ru"
  });
}

test("current translation content has approved fresh alignment evidence", () => {
  const questions = JSON.parse(readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"));
  const translations = JSON.parse(readFileSync("content/translations/ru.translations.json", "utf8"));
  const evidence = JSON.parse(readFileSync("content/validation/ru-translation-alignment.evidence.json", "utf8"));
  assert.deepEqual(validateTranslationAlignment({ questions, translations, evidence, locale: "ru" }), []);
});

test("structural translation failures name the affected question", () => {
  const translation = {
    questionId: "q1",
    questionTextRu: " ",
    answerTranslations: {
      "q1-a1": "",
      "q1-extra": "Лишний ответ."
    }
  };
  const errors = validate({ translation });
  assert(errors.includes("q1: questionTextRu must be a non-empty string."));
  assert(errors.includes("q1: missing answer translation for q1-a2."));
  assert(errors.includes("q1: answer translation for q1-a1 must be a non-empty string."));
  assert(errors.includes("q1: extra answer translation for q1-extra."));
});

test("translation referencing a missing question fails validation", () => {
  const errors = validateTranslationAlignment({
    questions: [baseQuestion],
    translations: [{ ...baseTranslation, questionId: "missing-question" }],
    evidence: evidenceFor(),
    locale: "ru"
  });
  assert(errors.includes("missing-question: translation references missing question."));
});

test("missing translation alignment evidence fails validation", () => {
  const errors = validate({ evidence: { locale: "ru", version: 1, entries: [] } });
  assert(errors.includes("q1: missing approved translation alignment evidence."));
});

test("stale source and translation fingerprints fail validation", () => {
  const sourceChanged = { ...baseQuestion, officialTextEs: "Texto cambiado" };
  assert(validate({ question: sourceChanged, evidence: evidenceFor() }).includes("q1: translation alignment source fingerprint mismatch."));

  const translationChanged = { ...baseTranslation, questionTextRu: "Измененный перевод." };
  assert(validate({ translation: translationChanged, evidence: evidenceFor() }).includes("q1: translation alignment translation fingerprint mismatch."));
});

test("duplicate and unsupported evidence entries fail validation", () => {
  const entry = evidenceFor().entries[0];
  const errors = validate({
    evidence: {
      locale: "ru",
      version: 1,
      entries: [{ ...entry, status: "pending" }, entry]
    }
  });
  assert(errors.includes("q1: duplicate translation alignment evidence."));
  assert(errors.includes("q1: translation alignment evidence status must be approved."));
});

test("old b-fallback-001 accident translation fails against current evidence", () => {
  const questions = JSON.parse(readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"));
  const translations = JSON.parse(readFileSync("content/translations/ru.translations.json", "utf8"));
  const evidence = JSON.parse(readFileSync("content/validation/ru-translation-alignment.evidence.json", "utf8"));
  const oldAccidentTranslation = {
    ...translations.find((translation) => translation.questionId === "b-fallback-001"),
    questionTextRu: "Что рекомендуется сделать первым делом, если вы стали участником ДТП?",
    answerTranslations: {
      "b-fallback-001-a1": "Немедленно остановиться и оставаться на месте происшествия.",
      "b-fallback-001-a2": "Доехать до ближайшего полицейского участка.",
      "b-fallback-001-a3": "Позвонить 911 и продолжить поездку."
    }
  };
  const mutatedTranslations = translations.map((translation) =>
    translation.questionId === "b-fallback-001" ? oldAccidentTranslation : translation
  );
  const errors = validateTranslationAlignment({ questions, translations: mutatedTranslations, evidence, locale: "ru" });
  assert(errors.includes("b-fallback-001: translation alignment translation fingerprint mismatch."));
});
