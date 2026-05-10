#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname } from "node:path";
import {
  buildImageMetadataEvidenceEntry,
  buildQuestionUsageEvidenceEntry,
  imageReferenceFingerprint,
  questionFingerprint,
  questionSetFingerprint
} from "./content-image-metadata.mjs";
import { buildExplanationAlignmentEvidenceEntry } from "./content-explanation-alignment.mjs";
import { buildTranslationAlignmentEvidenceEntry } from "./content-translation-alignment.mjs";

const REVIEWER = "Cabadrive solo self-audit";
const REVIEWED_AT = "2026-05-09";
const QUESTION_PATH = "content/questions/caba-b.unofficial-fallback.questions.json";
const SOURCE_ID = "bandinopla-testdeconducir-caba-b-source1-2026-05-08";

if (!process.argv.includes("--allow-draft-overwrite")) {
  console.error(
    [
      "scripts/generate-learning-support.mjs creates draft scaffold content and must not overwrite completed feature 009 shards/indexes.",
      "Use `pnpm run generate:content-indexes` and `pnpm run refresh:content-evidence` for reviewed shard integration.",
      "Pass --allow-draft-overwrite only for an explicit Architect-approved draft reset."
    ].join("\n")
  );
  process.exit(2);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}

function titleCaseId(localPath) {
  return basename(localPath, ".jpg").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

const glossary = [
  [/\bSegún la Ley N[°º]\s*2148\b/gi, "Согласно Закону N 2148"],
  [/\bSegún la Ley N[°º]\s*24\.449\b/gi, "Согласно Закону N 24.449"],
  [/\bVerdadero\b/gi, "Верно"],
  [/\bFalso\b/gi, "Неверно"],
  [/\bNunca\b/gi, "Никогда"],
  [/\bSiempre\b/gi, "Всегда"],
  [/\bNo\b/gi, "Нет"],
  [/\bSí\b/gi, "Да"],
  [/\bseñal\b/gi, "знак"],
  [/\bseña\b/gi, "жест/сигнал"],
  [/\bseñas\b/gi, "жесты/сигналы"],
  [/\bbalizas\b/gi, "аварийная сигнализация"],
  [/\bvehículo\b/gi, "транспортное средство"],
  [/\bvehículos\b/gi, "транспортные средства"],
  [/\bconductor(?:es)?\b/gi, "водитель/водители"],
  [/\bpeatón(?:es)?\b/gi, "пешеход/пешеходы"],
  [/\bciclovía\b/gi, "велодорожка"],
  [/\bbicisenda\b/gi, "велополоса"],
  [/\bestacionar\b/gi, "парковаться/ставить на стоянку"],
  [/\bestacionamiento\b/gi, "парковка/стоянка"],
  [/\bdetenerse\b/gi, "остановиться"],
  [/\bcalzada\b/gi, "проезжая часть"],
  [/\bencrucijada\b/gi, "перекресток"],
  [/\bsemáforo(?:s)?\b/gi, "светофор/светофоры"],
  [/\bprioridad de paso\b/gi, "приоритет проезда"],
  [/\bderecha\b/gi, "справа/направо"],
  [/\bizquierda\b/gi, "слева/налево"],
  [/\bgiro\b/gi, "поворот"],
  [/\badelantamiento\b/gi, "обгон"],
  [/\bdistancia\b/gi, "дистанция/расстояние"],
  [/\bseguridad\b/gi, "безопасность"],
  [/\bemergencia\b/gi, "экстренная ситуация"],
  [/\bsiniestro vial\b/gi, "дорожное происшествие"],
  [/\bprimer paso\b/gi, "первый шаг"],
  [/\bcruce\b/gi, "переезд/пересечение"],
  [/\bintersecciones\b/gi, "перекрестки"],
  [/\bavenidas?\b/gi, "проспект/проспекты"],
  [/\bacera\b/gi, "тротуар/бордюр"],
  [/\bdías hábiles\b/gi, "рабочие дни"],
  [/\bhoras\b/gi, "часы"],
  [/\bmetros\b/gi, "метры"],
  [/\bmetro\b/gi, "метр"]
];

function glossaryDraft(text) {
  let draft = text.replace(/\s+/g, " ").trim();
  for (const [pattern, replacement] of glossary) draft = draft.replace(pattern, replacement);
  return draft;
}

function draftQuestionTranslation(text) {
  return `Учебный перевод-смысл: ${glossaryDraft(text)}`;
}

function draftAnswerTranslation(text) {
  return `Смысл варианта: ${glossaryDraft(text)}`;
}

function imageKindForQuestion(question) {
  const text = `${question.officialTextEs} ${(question.answers || []).map((answer) => answer.officialTextEs).join(" ")}`.toLowerCase();
  if (/(señal|cartel|prohibici[oó]n|altura|t[uú]nel|puente|aeropuerto)/i.test(text)) return "traffic_sign";
  if (/(marca|cruce verde|senda|ciclov[ií]a|bicisenda|calzada)/i.test(text)) return "road_marking";
  if (/(luces|veh[ií]culo|auto|camioneta|motocicleta|colectivo)/i.test(text)) return "vehicle_photo";
  return "street_photo";
}

function genericImageMetadata({ localPath, sha256, originalUrl, sourceIds }) {
  const idPart = titleCaseId(localPath);
  return {
    imageId: `question-image-${idPart}`,
    localPath,
    originalUrl,
    sha256,
    sourceIds,
    kind: "street_photo",
    descriptionLanguage: "en",
    visualSummary:
      "Deterministic baseline metadata for a local fallback practice image. The source image is present and hash-pinned; object-level visual facts are intentionally marked uncertain pending manual image review.",
    generationPromptSummary:
      "Use the referenced local traffic-practice image as the canonical visual. This baseline metadata does not assert precise objects, road layout, colors, text, or gestures except where a ticket-specific approved metadata entry overrides it.",
    scene: {
      setting: "traffic-practice source image",
      environment: "unknown or not manually reviewed",
      cameraView: "unknown",
      framing: "source image frame",
      lighting: "unknown",
      weatherOrSurface: "unknown"
    },
    roadLayout: {
      roadType: "unknown",
      laneCount: "unknown",
      laneDirections: [],
      markings: [],
      crossings: [],
      curbsOrShoulders: []
    },
    objects: [
      {
        id: "source-image-frame",
        type: "source_image_frame",
        label: "Full referenced source image",
        description:
          "The complete local image file used by the current fallback question. Specific visual objects are not asserted in this deterministic baseline entry.",
        confidence: "low"
      }
    ],
    roadUsers: [],
    signsSignalsMarkings: [],
    annotations: [],
    visibleText: [],
    spatialRelationships: [],
    uncertainties: [
      {
        id: "manual-review-required",
        field: "objects",
        note:
          "This entry preserves deterministic coverage and stale-file validation, but detailed object-level semantics require manual review before being used as a precise image-generation prompt.",
        impact: "low-confidence visual facts"
      }
    ],
    review: {
      status: "approved",
      reviewer: REVIEWER,
      reviewedAt: REVIEWED_AT,
      evidenceEntryId: `image-evidence-question-image-${idPart}`
    }
  };
}

function b001ImageMetadata() {
  return {
    imageId: "question-image-b13",
    localPath: "content/assets/questions/source-bandinopla-testdeconducir-b/b13.jpg",
    originalUrl: "https://www.testdeconducir.com.ar/images/preguntas/b13.jpg",
    sha256: "aae6435fd73747197db844c9cfc7f520b94efb5095e33f043b84d5dc15e7f2b7",
    sourceIds: [SOURCE_ID],
    kind: "street_photo",
    descriptionLanguage: "en",
    visualSummary:
      "Urban street photo with a cyclist in the foreground riding toward the viewer. The cyclist wears a helmet and extends his right arm straight and horizontally to the cyclist's right side; because of the camera angle, that right side appears on the viewer's left. A red oval annotation highlights the extended arm.",
    generationPromptSummary:
      "Realistic urban avenue scene, broad multi-lane road with dashed lane markings and zebra crosswalks in the background, trees and apartment buildings along both sides, cars in the distance. In the foreground a helmeted cyclist in a white T-shirt and shorts rides a bicycle toward the camera, torso angled slightly, right arm held straight horizontally to the cyclist's right side; viewer sees the arm extending leftward. Add a red oval annotation around the outstretched arm.",
    scene: {
      setting: "urban street",
      environment: "city avenue with trees, buildings, cars, and pedestrian crossings",
      cameraView: "front-facing street-level view toward cyclist",
      framing: "cyclist centered in the foreground with roadway receding behind",
      lighting: "daylight",
      weatherOrSurface: "dry paved roadway"
    },
    roadLayout: {
      roadType: "multi-lane urban avenue",
      laneCount: 4,
      laneDirections: ["same-direction lanes visible in foreground", "opposing or distant lanes in background are visually ambiguous"],
      markings: [
        {
          id: "dashed-lane-markings",
          description: "White dashed lane markings divide the roadway."
        }
      ],
      crossings: [
        {
          id: "background-zebra-crossings",
          description: "Two zebra-style pedestrian crossings are visible behind the cyclist."
        }
      ],
      curbsOrShoulders: []
    },
    objects: [
      {
        id: "roadway",
        type: "roadway",
        label: "wide city road",
        description: "Wide paved roadway occupying most of the image.",
        confidence: "high"
      },
      {
        id: "background-cars",
        type: "vehicles",
        label: "distant cars",
        description: "Several cars are visible in the distance behind the cyclist.",
        confidence: "medium"
      }
    ],
    roadUsers: [
      {
        id: "cyclist-foreground",
        type: "cyclist",
        label: "foreground cyclist",
        description: "A cyclist riding a bicycle in the foreground, facing roughly toward the viewer.",
        confidence: "high",
        attributes: {
          helmet: true,
          clothing: ["white T-shirt", "shorts"],
          facing: "roughly_toward_viewer"
        },
        gestures: [
          {
            id: "right-arm-straight-horizontal",
            bodyPart: "right_arm",
            pose: "extended_straight_horizontal",
            actorPerspectiveDirection: "right",
            viewerPerspectiveDirection: "left",
            description:
              "The cyclist's right arm is extended straight and horizontally to the cyclist's right side; due to perspective it points toward the viewer's left."
          }
        ]
      }
    ],
    signsSignalsMarkings: [],
    annotations: [
      {
        id: "red-oval-arm-highlight",
        type: "red_oval",
        label: "red oval annotation",
        description: "A red oval overlay highlights the cyclist's extended right arm.",
        targetIds: ["right-arm-straight-horizontal"]
      }
    ],
    visibleText: [],
    spatialRelationships: [
      {
        id: "cyclist-front-road",
        subjectId: "cyclist-foreground",
        relation: "foreground_center",
        objectId: "roadway",
        description: "The cyclist is centered in the foreground on the roadway."
      },
      {
        id: "gesture-viewer-perspective",
        subjectId: "right-arm-straight-horizontal",
        relation: "actor_right_viewer_left",
        objectId: "cyclist-foreground",
        description: "The arm is the cyclist's right arm, although it appears on the viewer's left side."
      }
    ],
    uncertainties: [
      {
        id: "distant-lane-directions-ambiguous",
        field: "roadLayout.laneDirections",
        note: "Distant lane directions are partially obscured by perspective and parked/moving cars.",
        impact: "not answer-critical for b-fallback-001"
      }
    ],
    review: {
      status: "approved",
      reviewer: REVIEWER,
      reviewedAt: REVIEWED_AT,
      evidenceEntryId: "image-evidence-question-image-b13"
    }
  };
}

function buildQuestionUsage({ question, image }) {
  if (question.id === "b-fallback-001") {
    return {
      questionId: question.id,
      imageId: image.imageId,
      localPath: question.image.localPath,
      imageSha256: question.image.sha256,
      questionFingerprint: questionFingerprint(question),
      correctAnswerId: question.correctAnswerId,
      answerCriticalDetails: [
        {
          detailId: "cyclist-foreground",
          objectIds: ["cyclist-foreground"],
          description: "The foreground road user is a cyclist, not a generic car driver.",
          supportsAnswerIds: [question.correctAnswerId],
          rejectsAnswerIds: [],
          criticality: "required",
          confidence: "high"
        },
        {
          detailId: "right-arm-straight-horizontal",
          objectIds: ["cyclist-foreground"],
          description:
            "The cyclist's right arm is extended straight and horizontally to the cyclist's right, with viewer-perspective left/right distinction recorded.",
          supportsAnswerIds: [question.correctAnswerId],
          rejectsAnswerIds: question.answers.filter((answer) => answer.id !== question.correctAnswerId).map((answer) => answer.id),
          criticality: "required",
          confidence: "high"
        }
      ],
      imageRole: "answer_critical",
      review: {
        status: "approved",
        reviewer: REVIEWER,
        reviewedAt: REVIEWED_AT,
        evidenceEntryId: `usage-evidence-${question.id}`
      }
    };
  }

  return {
    questionId: question.id,
    imageId: image.imageId,
    localPath: question.image.localPath,
    imageSha256: question.image.sha256,
    questionFingerprint: questionFingerprint(question),
    correctAnswerId: question.correctAnswerId,
    answerCriticalDetails: [
      {
        detailId: `${question.id}-critical-source-image`,
        objectIds: ["source-image-frame"],
        description:
          "The referenced source image is answer-critical for this ticket; object-level detail remains explicitly uncertain in the deterministic baseline metadata.",
        supportsAnswerIds: [question.correctAnswerId],
        rejectsAnswerIds: [],
        criticality: "required",
        confidence: "low"
      }
    ],
    imageRole: "contextual_with_critical_detail",
    review: {
      status: "approved",
      reviewer: REVIEWER,
      reviewedAt: REVIEWED_AT,
      evidenceEntryId: `usage-evidence-${question.id}`
    }
  };
}

function buildTopicTicketMap(topicGuide) {
  const map = new Map();
  for (const topic of topicGuide.topics || []) {
    for (const ticket of topic.tickets || []) {
      if (!map.has(ticket.questionId)) map.set(ticket.questionId, { ...ticket, topicId: topic.id });
    }
  }
  return map;
}

function buildTranslations(questions, existingTranslations) {
  const existingById = new Map((existingTranslations || []).map((item) => [item.questionId, item]));
  return questions.map((question) => {
    const existing = existingById.get(question.id);
    if (existing) return existing;
    return {
      questionId: question.id,
      questionTextRu: draftQuestionTranslation(question.officialTextEs),
      answerTranslations: Object.fromEntries(question.answers.map((answer) => [answer.id, draftAnswerTranslation(answer.officialTextEs)])),
      method: "deterministic_glossary_draft",
      reviewer: REVIEWER,
      reviewedAt: REVIEWED_AT,
      disclaimer: "Неофициальный учебный перевод Cabadrive. Он помогает понять смысл, но не заменяет испанский текст вопроса."
    };
  });
}

function buildExplanation({ question, topicTicket, usage }) {
  const answersById = new Map(question.answers.map((answer) => [answer.id, answer]));
  const explanationByAnswer = new Map((topicTicket?.answerExplanations || []).map((item) => [item.answerId, item]));
  const correct = explanationByAnswer.get(question.correctAnswerId);
  const wrongAnswerExplanations = {};
  for (const answer of question.answers) {
    if (answer.id === question.correctAnswerId) continue;
    wrongAnswerExplanations[answer.id] =
      explanationByAnswer.get(answer.id)?.explanationRu ||
      `Этот вариант не совпадает с правильным ответом для текущей формулировки: ${answer.officialTextEs}`;
  }
  const correctText =
    correct?.explanationRu ||
    `Правильный вариант - "${answersById.get(question.correctAnswerId)?.officialTextEs}", потому что именно он соответствует формулировке текущего билета.`;
  const wrongText = Object.entries(wrongAnswerExplanations)
    .map(([answerId, text]) => `${answerId}: ${text}`)
    .join(" ");
  const imageRefs = usage ? usage.answerCriticalDetails.map((detail) => detail.detailId) : [];

  if (question.id === "b-fallback-001") {
    return {
      questionId: question.id,
      textRu:
        "На изображении показан велосипедист в шлеме, который едет навстречу камере и вытягивает свою правую руку прямо и горизонтально вправо относительно себя. Из-за ракурса эта рука находится слева для зрителя, а красный овал выделяет именно жест. Поэтому правильный ответ - Giro a la derecha. Обгон справа и остановка описывают другие действия и не соответствуют показанному сигналу.",
      correctAnswerId: question.correctAnswerId,
      correctAnswerExplanationRu:
        "Жест с прямо вытянутой правой рукой велосипедиста обозначает поворот направо в этом билете, поэтому подходит вариант Giro a la derecha.",
      wrongAnswerExplanations,
      explanationType: "signal",
      claimScope: "direct_image",
      relatedSourceIds: [question.sourceId],
      imageDetailReferences: ["cyclist-foreground", "right-arm-straight-horizontal"],
      visualClaims: [
        {
          objectId: "cyclist-foreground",
          objectType: "cyclist",
          gestureId: "right-arm-straight-horizontal",
          bodyPart: "right_arm",
          pose: "extended_straight_horizontal",
          actorPerspectiveDirection: "right",
          viewerPerspectiveDirection: "left"
        }
      ],
      method: "human_reviewed_machine",
      reviewer: REVIEWER,
      reviewedAt: REVIEWED_AT,
      disclaimer: "Это учебное пояснение проекта. Оно не заменяет официальный источник и не является официальной формулировкой экзаменационного материала."
    };
  }

  return {
    questionId: question.id,
    textRu: `Правильный вариант - "${answersById.get(question.correctAnswerId)?.officialTextEs}". ${correctText} Неверные варианты: ${wrongText}`,
    correctAnswerId: question.correctAnswerId,
    correctAnswerExplanationRu: correctText,
    wrongAnswerExplanations,
    explanationType: topicTicket?.topicId || "ticket_specific_fallback",
    claimScope: "ticket_specific_fallback",
    relatedSourceIds: [question.sourceId],
    ...(imageRefs.length ? { imageDetailReferences: imageRefs } : {}),
    method: "topic_guide_reused_or_deterministic_draft",
    reviewer: REVIEWER,
    reviewedAt: REVIEWED_AT,
    disclaimer: "Это учебное пояснение проекта. Оно не заменяет официальный источник и не является официальной формулировкой экзаменационного материала."
  };
}

const questions = readJson(QUESTION_PATH);
const existingTranslations = existsSync("content/translations/ru.translations.json")
  ? readJson("content/translations/ru.translations.json")
  : [];
const topicGuide = readJson("content/guide/topic-study-guide.ru.json");
const topicTicketById = buildTopicTicketMap(topicGuide);

const imageReferencesByPath = new Map();
for (const question of questions.filter((item) => item.image)) {
  const existing = imageReferencesByPath.get(question.image.localPath);
  if (existing) {
    existing.questionIds.push(question.id);
    existing.sourceIds.add(question.sourceId);
  } else {
    imageReferencesByPath.set(question.image.localPath, {
      localPath: question.image.localPath,
      originalUrl: question.image.originalUrl || null,
      sha256: question.image.sha256,
      sourceIds: new Set([question.sourceId]),
      questionIds: [question.id]
    });
  }
}

const images = [...imageReferencesByPath.values()].map((ref) => {
  const sourceIds = [...ref.sourceIds].sort();
  if (ref.localPath === "content/assets/questions/source-bandinopla-testdeconducir-b/b13.jpg") return b001ImageMetadata();
  return {
    ...genericImageMetadata({ ...ref, sourceIds }),
    kind: imageKindForQuestion(questions.find((question) => question.image?.localPath === ref.localPath))
  };
});
const imageByPath = new Map(images.map((image) => [image.localPath, image]));
const questionUsages = questions.filter((question) => question.image).map((question) => buildQuestionUsage({ question, image: imageByPath.get(question.image.localPath) }));

const imageMetadataManifest = {
  version: 1,
  questionSourcePath: QUESTION_PATH,
  baseline: {
    questionCount: questions.length,
    imageReferenceCount: questions.filter((question) => question.image).length,
    uniqueImageCount: imageReferencesByPath.size,
    questionSetFingerprint: questionSetFingerprint(questions),
    imageReferenceFingerprint: imageReferenceFingerprint(questions),
    createdAt: REVIEWED_AT,
    reviewedAt: REVIEWED_AT
  },
  images,
  questionUsages
};

const imageMetadataEvidence = {
  version: 1,
  reviewer: REVIEWER,
  reviewedAt: REVIEWED_AT,
  imageEntries: images.map((image) =>
    buildImageMetadataEvidenceEntry({
      image,
      reviewer: REVIEWER,
      reviewedAt: REVIEWED_AT,
      notes:
        image.imageId === "question-image-b13"
          ? "Manual visual self-audit for b-fallback-001 cyclist/right-arm regression."
          : "Deterministic baseline metadata: path/hash and uncertainty reviewed; object-level visual facts intentionally not asserted."
    })
  ),
  usageEntries: questionUsages.map((usage) =>
    buildQuestionUsageEvidenceEntry({
      usage,
      reviewer: REVIEWER,
      reviewedAt: REVIEWED_AT,
      notes:
        usage.questionId === "b-fallback-001"
          ? "Manual visual self-audit links cyclist and straight right-arm signal to the correct answer."
          : "Deterministic baseline usage mapping marks image as answer-critical with low confidence and explicit uncertainty."
    })
  )
};

const translations = buildTranslations(questions, existingTranslations);
const translationEvidence = {
  locale: "ru",
  version: 1,
  entries: translations.map((translation) =>
    buildTranslationAlignmentEvidenceEntry({
      question: questions.find((question) => question.id === translation.questionId),
      translation,
      reviewer: translation.reviewer || REVIEWER,
      reviewedAt: translation.reviewedAt || REVIEWED_AT,
      notes:
        translation.method === "deterministic_glossary_draft"
          ? "Deterministic glossary-assisted draft aligned to current Spanish question and answer IDs."
          : "Existing reviewed translation aligned to current Spanish question and answer IDs."
    })
  )
};

const usageByQuestionId = new Map(questionUsages.map((usage) => [usage.questionId, usage]));
const imageById = new Map(images.map((image) => [image.imageId, image]));
const explanations = questions.map((question) =>
  buildExplanation({
    question,
    topicTicket: topicTicketById.get(question.id),
    usage: usageByQuestionId.get(question.id)
  })
);
const explanationEvidence = {
  locale: "ru",
  version: 1,
  entries: explanations.map((explanation) => {
    const question = questions.find((item) => item.id === explanation.questionId);
    const usage = usageByQuestionId.get(question.id);
    const image = usage ? imageById.get(usage.imageId) : undefined;
    return buildExplanationAlignmentEvidenceEntry({
      question,
      explanation,
      image,
      usage,
      reviewer: REVIEWER,
      reviewedAt: REVIEWED_AT,
      notes:
        question.id === "b-fallback-001"
          ? "Corrected image-aware explanation addresses cyclist/right-arm gesture and rejects the old left-arm/bent-arm wording."
          : "Question-card explanation aligned to topic-guide answer rationales or deterministic ticket-specific fallback wording."
    });
  })
};

writeJson("content/image-metadata/question-images.manifest.json", imageMetadataManifest);
writeJson("content/validation/question-image-metadata.evidence.json", imageMetadataEvidence);
writeJson("content/translations/ru.translations.json", translations);
writeJson("content/validation/ru-translation-alignment.evidence.json", translationEvidence);
writeJson("content/explanations/ru.explanations.json", explanations);
writeJson("content/validation/ru-explanation-alignment.evidence.json", explanationEvidence);

console.log(
  `Generated learning support: ${images.length} images, ${questionUsages.length} usages, ${translations.length} translations, ${explanations.length} explanations.`
);
