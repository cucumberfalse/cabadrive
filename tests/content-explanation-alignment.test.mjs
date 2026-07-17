import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  buildExplanationAlignmentEvidenceEntry,
  validateExplanationAlignment,
} from "../scripts/content-explanation-alignment.mjs";

const syntheticQuestion = {
  id: "q1",
  officialTextEs: "¿Qué indica esta señal?",
  answers: [
    { id: "q1-a1", officialTextEs: "Opción incorrecta." },
    { id: "q1-a2", officialTextEs: "Opción correcta." },
  ],
  correctAnswerId: "q1-a2",
};

function syntheticExplanation(overrides = {}) {
  return {
    questionId: "q1",
    textRu:
      "Этот билет проверяет конкретное значение дорожного знака. Правильный ответ выбирается по видимому регулирующему признаку, а не по общему предположению о ситуации.",
    correctAnswerId: "q1-a2",
    correctAnswerExplanationRu:
      "Правильный вариант соответствует видимому требованию знака и сохраняет смысл исходного билета без расширения правила за пределы показанной ситуации.",
    wrongAnswerExplanations: {
      "q1-a1":
        "Этот вариант неверен, потому что описывает другое действие и не подтверждается тем визуальным признаком, который проверяет текущий билет.",
    },
    explanationType: "learning_support",
    claimScope: "direct_ticket",
    relatedSourceIds: ["source-1"],
    disclaimer: "Это учебное пояснение не является официальной формулировкой экзамена.",
    ...overrides,
  };
}

function syntheticEvidence(explanation) {
  return {
    locale: "ru",
    version: 1,
    entries: [
      buildExplanationAlignmentEvidenceEntry({
        question: syntheticQuestion,
        explanation,
        reviewer: "Cabadrive solo self-audit",
        reviewedAt: "2026-05-09",
        notes: "Synthetic explanation quality fixture.",
      }),
    ],
  };
}

test("current Russian explanations have full approved alignment evidence", () => {
  const questions = JSON.parse(
    readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"),
  );
  const explanations = JSON.parse(
    readFileSync("content/explanations/ru.explanations.json", "utf8"),
  );
  const imageMetadataManifest = JSON.parse(
    readFileSync("content/image-metadata/question-images.manifest.json", "utf8"),
  );
  const evidence = JSON.parse(
    readFileSync("content/validation/ru-explanation-alignment.evidence.json", "utf8"),
  );
  assert.deepEqual(
    validateExplanationAlignment({
      questions,
      explanations,
      imageMetadataManifest,
      evidence,
      locale: "ru",
    }),
    [],
  );
});

test("old b-fallback-001 visual claim fails against approved metadata", () => {
  const questions = JSON.parse(
    readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"),
  );
  const imageMetadataManifest = JSON.parse(
    readFileSync("content/image-metadata/question-images.manifest.json", "utf8"),
  );
  const currentExplanations = JSON.parse(
    readFileSync("content/explanations/ru.explanations.json", "utf8"),
  );
  const question = questions.find((item) => item.id === "b-fallback-001");
  const usage = imageMetadataManifest.questionUsages.find(
    (item) => item.questionId === question.id,
  );
  const image = imageMetadataManifest.images.find((item) => item.imageId === usage.imageId);
  const oldExplanation = {
    ...currentExplanations.find((item) => item.questionId === "b-fallback-001"),
    textRu:
      "На изображении показан жест рукой для поворота направо: водитель вытягивает левую руку и сгибает ее вверх, показывая направление маневра.",
    visualClaims: [
      {
        objectId: "cyclist-foreground",
        objectType: "driver",
        gestureId: "right-arm-straight-horizontal",
        bodyPart: "left_arm",
        pose: "bent_up",
        actorPerspectiveDirection: "left",
        viewerPerspectiveDirection: "right",
      },
    ],
  };
  const evidence = {
    locale: "ru",
    version: 1,
    entries: [
      buildExplanationAlignmentEvidenceEntry({
        question,
        explanation: oldExplanation,
        image,
        usage,
        reviewer: "Cabadrive solo self-audit",
        reviewedAt: "2026-05-09",
        notes: "Synthetic stale-defect regression fixture.",
      }),
    ],
  };
  const errors = validateExplanationAlignment({
    questions: [question],
    explanations: [oldExplanation],
    imageMetadataManifest,
    evidence,
    locale: "ru",
  });
  assert(
    errors.includes(
      "b-fallback-001: visual claim objectType driver contradicts metadata types cyclist.",
    ),
  );
  assert(
    errors.includes(
      "b-fallback-001: visual claim bodyPart left_arm contradicts metadata bodyPart right_arm.",
    ),
  );
  assert(
    errors.includes(
      "b-fallback-001: visual claim pose bent_up contradicts metadata pose extended_straight_horizontal.",
    ),
  );
});

test("missing wrong-answer rationale fails explanation validation", () => {
  const questions = JSON.parse(
    readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"),
  );
  const imageMetadataManifest = JSON.parse(
    readFileSync("content/image-metadata/question-images.manifest.json", "utf8"),
  );
  const currentExplanations = JSON.parse(
    readFileSync("content/explanations/ru.explanations.json", "utf8"),
  );
  const question = questions.find((item) => item.id === "b-fallback-003");
  const explanation = {
    ...currentExplanations.find((item) => item.questionId === question.id),
    wrongAnswerExplanations: {},
  };
  const evidence = {
    locale: "ru",
    version: 1,
    entries: [
      buildExplanationAlignmentEvidenceEntry({
        question,
        explanation,
        reviewer: "Cabadrive solo self-audit",
        reviewedAt: "2026-05-09",
        notes: "Synthetic missing-rationale regression fixture.",
      }),
    ],
  };
  const errors = validateExplanationAlignment({
    questions: [question],
    explanations: [explanation],
    imageMetadataManifest,
    evidence,
    locale: "ru",
  });
  assert(errors.includes("b-fallback-003: missing wrong-answer rationale for b-fallback-003-a2."));
  assert(errors.includes("b-fallback-003: missing wrong-answer rationale for b-fallback-003-a3."));
});

test("full-quality explanation gate rejects generic filler and Spanish residue", () => {
  const explanation = syntheticExplanation({
    textRu: "Учебное пояснение: cruce de jinetes. Выберите вариант по смыслу билета.",
    correctAnswerExplanationRu: "Правильный вариант - cruce de jinetes.",
    wrongAnswerExplanations: {
      "q1-a1": "Generic placeholder rationale.",
    },
  });
  const errors = validateExplanationAlignment({
    questions: [syntheticQuestion],
    explanations: [explanation],
    imageMetadataManifest: { questionUsages: [], images: [] },
    evidence: syntheticEvidence(explanation),
    locale: "ru",
    requireFullQuality: true,
  });
  assert(
    errors.includes(
      "q1: textRu contains generic filler, untranslated Spanish, transliteration, or unsupported Latin residue.",
    ),
  );
  assert(
    errors.includes(
      "q1: correctAnswerExplanationRu contains generic filler, untranslated Spanish, transliteration, or unsupported Latin residue.",
    ),
  );
  assert(
    errors.includes(
      "q1: wrong-answer rationale for q1-a1 contains generic filler, untranslated Spanish, transliteration, or unsupported Latin residue.",
    ),
  );
});
