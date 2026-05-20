import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  topicGuideQuestionBaseline,
  validateTopicGuide
} from "../scripts/content-topic-guide.mjs";

const questions = [
  {
    id: "q1",
    officialTextEs: "¿Qué indica esta seña?",
    answers: [
      { id: "q1-a1", officialTextEs: "Adelantamiento por la derecha." },
      { id: "q1-a2", officialTextEs: "Giro a la derecha." },
      { id: "q1-a3", officialTextEs: "Detenerse." }
    ],
    correctAnswerId: "q1-a2"
  },
  {
    id: "q2",
    officialTextEs: "¿Qué debe hacer ante una señal de pare?",
    answers: [
      { id: "q2-a1", officialTextEs: "Detenerse totalmente." },
      { id: "q2-a2", officialTextEs: "Continuar sin mirar." }
    ],
    correctAnswerId: "q2-a1"
  }
];

function clone(value) {
  return structuredClone(value);
}

function renderedTopicGuideText(topic) {
  return [
    topic.summaryRu,
    ...topic.learningMaterialRu,
    ...(topic.practicalReasoningRu || []),
    ...(topic.spanishTerms || []).map((term) => `${term.termEs} ${term.translationRu}`),
    ...(topic.trapNotes || []).map((note) => note.textRu),
    ...(topic.tickets || []).flatMap((ticket) => ticket.answerExplanations.map((explanation) => explanation.explanationRu))
  ].join("\n");
}

function guide(overrides = {}) {
  return {
    version: 1,
    id: "topic-study-guide",
    locale: "ru",
    status: "draft",
    contentStatus: "unofficial_learning_aid",
    disclaimer: "Неофициальный учебный материал Cabadrive.",
    topics: [
      {
        id: "signals",
        status: "draft",
        titleRu: "Жесты",
        summaryRu: "Короткий блок про жесты.",
        learningMaterialRu: ["Смотрите на слово seña и смысл жеста."],
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
              {
                answerId: "q1-a1",
                verdict: "incorrect",
                explanationRu: "Это обгон справа, а не показанный жест."
              },
              {
                answerId: "q1-a2",
                verdict: "correct",
                explanationRu: "Этот ответ совпадает с жестом поворота направо."
              },
              {
                answerId: "q1-a3",
                verdict: "incorrect",
                explanationRu: "Это остановка, а не показанный жест."
              }
            ]
          }
        ],
        trapNotes: [
          {
            id: "trap-sena",
            textRu: "Seña в этом билете означает жест, а не дорожный знак.",
            sourceQuestionIds: ["q1"]
          }
        ],
        claims: []
      }
    ],
    ...overrides
  };
}

function publishedGuide(overrides = {}) {
  const guideContent = guide({ status: "published", ...overrides });
  for (const topic of guideContent.topics) topic.status = "published";
  return guideContent;
}

function publishedCoverage(overrides = {}) {
  const coverageManifest = coverage({ status: "published", ...overrides });
  for (const topic of coverageManifest.topics) {
    topic.phase = "published";
    topic.status = "published";
  }
  for (const assignment of coverageManifest.assignments) assignment.phase = "published";
  return coverageManifest;
}

function coverage(overrides = {}) {
  return {
    version: 1,
    guideId: "topic-study-guide",
    status: "draft",
    baseline: {
      questionFile: "content/questions/caba-b.unofficial-fallback.questions.json",
      capturedAt: "2026-05-09",
      ...topicGuideQuestionBaseline(questions)
    },
    topics: [
      {
        topicId: "signals",
        phase: "content_ready",
        status: "draft",
        titleRu: "Жесты"
      },
      {
        topicId: "stop-signs",
        phase: "planned",
        status: "draft",
        titleRu: "Знаки остановки и приоритета"
      }
    ],
    assignments: [
      { questionId: "q1", topicIds: ["signals"], phase: "content_ready", ownerSlice: "test" },
      { questionId: "q2", topicIds: ["stop-signs"], phase: "planned", ownerSlice: "test" }
    ],
    ...overrides
  };
}

function sourceTrace(overrides = {}) {
  return {
    version: 1,
    guideId: "topic-study-guide",
    status: "draft",
    entries: [],
    ...overrides
  };
}

function validate({
  guideContent = guide(),
  coverageManifest = coverage(),
  trace = sourceTrace(),
  questionSet = questions
} = {}) {
  return validateTopicGuide({
    questions: questionSet,
    guide: guideContent,
    coverage: coverageManifest,
    sourceTrace: trace
  });
}

function q2Ticket() {
  return {
    questionId: "q2",
    answerExplanations: [
      {
        answerId: "q2-a1",
        verdict: "correct",
        explanationRu: "Pare требует полной остановки."
      },
      {
        answerId: "q2-a2",
        verdict: "incorrect",
        explanationRu: "Продолжать без проверки нельзя."
      }
    ]
  };
}

test("current topic guide and manifests pass published validation", () => {
  const currentQuestions = JSON.parse(readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"));
  const currentGuide = JSON.parse(readFileSync("content/guide/topic-study-guide.ru.json", "utf8"));
  const currentCoverage = JSON.parse(readFileSync("content/guide/topic-study-guide.coverage.json", "utf8"));
  const currentTrace = JSON.parse(readFileSync("content/guide/topic-study-guide.source-trace.json", "utf8"));

  assert.equal(currentGuide.status, "published");
  assert(currentGuide.topics.every((topic) => topic.status === "published"));
  assert.equal(currentCoverage.status, "published");
  assert(currentCoverage.topics.every((topic) => topic.phase === "published" && topic.status === "published"));
  assert(currentCoverage.assignments.every((assignment) => assignment.phase === "published"));
  assert(
    currentCoverage.assignments.every((assignment) =>
      Object.values(assignment.placementPhases || {}).every((phase) => phase === "published")
    )
  );
  assert.equal(currentTrace.status, "published");
  assert.deepEqual(
    validateTopicGuide({
      questions: currentQuestions,
      guide: currentGuide,
      coverage: currentCoverage,
      sourceTrace: currentTrace
    }),
    []
  );
});

test("parking clearance material teaches hospital ten-meter rule, five-meter trap, and institution timing contrast", () => {
  const currentGuide = JSON.parse(readFileSync("content/guide/topic-study-guide.ru.json", "utf8"));
  const parkingTopic = currentGuide.topics.find((topic) => topic.id === "parking-clearances-and-corners");
  assert(parkingTopic, "Expected parking-clearances-and-corners topic to exist.");

  const topicText = renderedTopicGuideText(parkingTopic);

  assert.match(topicText, /hospital\/centro de salud -> 10 metros de cada lado de la entrada|hospital\/centro de salud .*10 metros de cada lado de la entrada/s);
  assert.match(topicText, /5 metros de cada lado de la entrada .*trap|5 metros de cada lado de la entrada .*falso|5 metros de cada lado de la entrada .*wrong/s);
  assert.match(topicText, /en horas de clase/);
  assert.match(topicText, /oficios.*ceremonias|ceremonias.*oficios/s);
  assert.match(topicText, /horario de atención al público/);
});

test("planned full coverage passes without requiring rendered content for planned assignments", () => {
  assert.deepEqual(validate(), []);
});

test("content-ready assignments require rendered guide content", () => {
  const coverageManifest = coverage({
    assignments: [
      { questionId: "q1", topicIds: ["signals"], phase: "content_ready" },
      { questionId: "q2", topicIds: ["stop-signs"], phase: "content_ready" }
    ]
  });
  const errors = validate({ coverageManifest });

  assert(errors.includes("q2: rendered assignment references missing guide topic stop-signs."));
  assert(errors.includes("q2: content-ready or published coverage assignment is missing from guide content."));
});

test("placementPhases allow one rendered topic in a dual-assigned row", () => {
  const guideContent = guide();
  guideContent.topics[0].tickets.push(q2Ticket());
  const coverageManifest = coverage({
    assignments: [
      { questionId: "q1", topicIds: ["signals"], phase: "content_ready" },
      {
        questionId: "q2",
        topicIds: ["signals", "stop-signs"],
        phase: "planned",
        placementPhases: {
          signals: "content_ready",
          "stop-signs": "planned"
        }
      }
    ]
  });

  assert.deepEqual(validate({ guideContent, coverageManifest }), []);
});

test("rejects invalid placementPhases values and keys", () => {
  const invalidValueCoverage = coverage({
    assignments: [
      { questionId: "q1", topicIds: ["signals"], phase: "content_ready" },
      {
        questionId: "q2",
        topicIds: ["signals", "stop-signs"],
        phase: "planned",
        placementPhases: {
          signals: "contentready",
          "stop-signs": "planned"
        }
      }
    ]
  });
  assert(
    validate({ coverageManifest: invalidValueCoverage }).includes(
      "q2/signals: assignment placement phase must be planned, content_ready, or published."
    )
  );

  const extraKeyCoverage = coverage({
    assignments: [
      { questionId: "q1", topicIds: ["signals"], phase: "content_ready" },
      {
        questionId: "q2",
        topicIds: ["signals", "stop-signs"],
        phase: "planned",
        placementPhases: {
          signals: "content_ready",
          "stop-signs": "planned",
          extra: "planned"
        }
      }
    ]
  });
  assert(validate({ coverageManifest: extraKeyCoverage }).includes("q2: assignment placementPhases references topic extra not present in topicIds."));

  const missingKeyCoverage = coverage({
    assignments: [
      { questionId: "q1", topicIds: ["signals"], phase: "content_ready" },
      {
        questionId: "q2",
        topicIds: ["signals", "stop-signs"],
        phase: "planned",
        placementPhases: {
          signals: "content_ready"
        }
      }
    ]
  });
  assert(validate({ coverageManifest: missingKeyCoverage }).includes("q2: assignment placementPhases missing topic stop-signs."));
});

test("published mode rejects planned-only assignments", () => {
  const guideContent = publishedGuide();
  const coverageManifest = publishedCoverage();
  coverageManifest.assignments[1].phase = "planned";
  const errors = validate({
    guideContent,
    coverageManifest,
    trace: sourceTrace({ status: "published" })
  });

  assert(errors.includes("q2: published guide assignment phase must be published."));
  assert(errors.includes("q2: published guide assignment placement phases must be published."));
});

test("published mode rejects planned placements inside a dual-assigned row", () => {
  const guideContent = publishedGuide();
  guideContent.topics[0].tickets.push(q2Ticket());
  const coverageManifest = publishedCoverage({
    assignments: [
      { questionId: "q1", topicIds: ["signals"], phase: "published" },
      {
        questionId: "q2",
        topicIds: ["signals", "stop-signs"],
        phase: "published",
        placementPhases: {
          signals: "published",
          "stop-signs": "planned"
        }
      }
    ]
  });
  const errors = validate({
    guideContent,
    coverageManifest,
    trace: sourceTrace({ status: "published" })
  });

  assert(errors.includes("q2: published guide assignment placement phases must be published."));
});

test("published mode rejects draft topic and coverage states", () => {
  const guideContent = publishedGuide();
  guideContent.topics[0].status = "draft";
  const coverageManifest = publishedCoverage();
  coverageManifest.topics[0].phase = "content_ready";
  coverageManifest.topics[0].status = "draft";

  const errors = validate({
    guideContent,
    coverageManifest,
    trace: sourceTrace({ status: "published" })
  });

  assert(errors.includes("signals: published guide topic status must be published."));
  assert(errors.includes("signals: published guide coverage topic phase must be published."));
  assert(errors.includes("signals: published guide coverage topic status must be published."));
});

test("published mode rejects missing coverage topic status", () => {
  const coverageManifest = publishedCoverage();
  delete coverageManifest.topics[0].status;

  const errors = validate({
    guideContent: publishedGuide(),
    coverageManifest,
    trace: sourceTrace({ status: "published" })
  });

  assert(errors.includes("signals: published guide coverage topic status must be published."));
});

test("published mode rejects English scaffold residue in Russian learner prose", () => {
  const guideContent = publishedGuide();
  guideContent.topics[0].summaryRu = "Короткий current-system scaffold.";
  const errors = validate({
    guideContent,
    coverageManifest: publishedCoverage(),
    trace: sourceTrace({ status: "published" })
  });

  assert(
    errors.includes(
      'topics.0.summaryRu: published topic guide Russian learner prose must not contain English scaffold residue "current-system".'
    )
  );
});

test("published mode rejects English scaffold residue inside Russian prose arrays", () => {
  const guideContent = publishedGuide();
  guideContent.topics[0].learningMaterialRu[0] = "Короткий current-system scaffold внутри массива.";
  const errors = validate({
    guideContent,
    coverageManifest: publishedCoverage(),
    trace: sourceTrace({ status: "published" })
  });

  assert(
    errors.includes(
      'topics.0.learningMaterialRu.0: published topic guide Russian learner prose must not contain English scaffold residue "current-system".'
    )
  );
});

test("published mode rejects review-cited English scaffold classes in Russian learner prose", () => {
  const cases = [
    {
      mutate(topic) {
        topic.learningMaterialRu[0] = "Правильно: lowering speed helps avoid aquaplaning.";
      },
      expected:
        'topics.0.learningMaterialRu.0: published topic guide Russian learner prose must not contain English scaffold residue "lowering".'
    },
    {
      mutate(topic) {
        topic.practicalReasoningRu = ["H.8 isletas: they guide traffic around obstacles."];
      },
      expected:
        'topics.0.practicalReasoningRu.0: published topic guide Russian learner prose must not contain English scaffold residue "they".'
    },
    {
      mutate(topic) {
        topic.summaryRu = "Red cordón; yellow cordón.";
      },
      expected:
        'topics.0.summaryRu: published topic guide Russian learner prose must not contain English scaffold residue "Red cordón".'
    },
    {
      mutate(topic) {
        topic.claims = [
          {
            id: "claim-crosswalk",
            textRu:
              "CABA and Anexo L prohibit estacionar/detenerse on horizontal demarcation of sendas peatonales.",
            requiresOfficialSource: false
          }
        ];
      },
      expected:
        'topics.0.claims.0.textRu: published topic guide Russian learner prose must not contain English scaffold residue "and".'
    },
    {
      mutate(topic) {
        topic.claims = [
          {
            id: "claim-bikes",
            textRu:
              "Ley 2148 поддерживает allowed/forbidden arterias, under-12 и assisted ciclorrodados перед turning automotores.",
            requiresOfficialSource: false
          }
        ];
      },
      expected:
        'topics.0.claims.0.textRu: published topic guide Russian learner prose must not contain English scaffold residue "allowed/forbidden".'
    },
    {
      mutate(topic) {
        topic.learningMaterialRu[0] = "Ориентир ограничен reserved/authorized use в этом билете.";
      },
      expected:
        'topics.0.learningMaterialRu.0: published topic guide Russian learner prose must not contain English scaffold residue "reserved/authorized use".'
    },
    {
      mutate(topic) {
        topic.practicalReasoningRu = ["Используйте acceleration/deceleration/right полосы только по назначению."];
      },
      expected:
        'topics.0.practicalReasoningRu.0: published topic guide Russian learner prose must not contain English scaffold residue "acceleration/deceleration/right".'
    }
  ];

  for (const testCase of cases) {
    const guideContent = publishedGuide();
    testCase.mutate(guideContent.topics[0]);
    const errors = validate({
      guideContent,
      coverageManifest: publishedCoverage(),
      trace: sourceTrace({ status: "published" })
    });
    assert(errors.includes(testCase.expected), `expected error ${testCase.expected}; got ${errors.join("\n")}`);
  }
});

test("rejects missing current question IDs even in draft planned coverage", () => {
  const coverageManifest = coverage({
    topics: [{ topicId: "signals", phase: "content_ready", status: "draft", titleRu: "Жесты" }],
    assignments: [{ questionId: "q1", topicIds: ["signals"], phase: "content_ready" }]
  });

  const errors = validate({ coverageManifest });
  assert(errors.includes("q2: topic guide must assign every current question."));
});

test("rejects duplicate topic IDs", () => {
  const guideContent = guide();
  guideContent.topics.push(clone(guideContent.topics[0]));
  const coverageManifest = coverage({
    topics: [
      { topicId: "signals", phase: "content_ready", status: "draft", titleRu: "Жесты" },
      { topicId: "signals", phase: "content_ready", status: "draft", titleRu: "Жесты снова" }
    ]
  });

  const errors = validate({ guideContent, coverageManifest });
  assert(errors.includes("signals: duplicate topic id."));
  assert(errors.includes("signals: duplicate coverage topic id."));
});

test("rejects invalid coverage topic phase", () => {
  const coverageManifest = coverage();
  coverageManifest.topics[1].phase = "planend";

  const errors = validate({ coverageManifest });
  assert(errors.includes("stop-signs: coverage topic phase must be planned, content_ready, or published."));
});

test("rejects invalid question IDs in guide tickets and coverage", () => {
  const guideContent = guide();
  guideContent.topics[0].tickets[0].questionId = "missing-question";
  const coverageManifest = coverage({
    assignments: [
      { questionId: "missing-question", topicIds: ["signals"], phase: "content_ready" },
      { questionId: "q2", topicIds: ["stop-signs"], phase: "planned" }
    ]
  });

  const errors = validate({ guideContent, coverageManifest });
  assert(errors.includes("signals/missing-question: guide ticket references missing question."));
  assert(errors.includes("missing-question: coverage assignment references missing question."));
});

test("rejects missing required topic sections", () => {
  const guideContent = guide();
  guideContent.topics[0].learningMaterialRu = [];
  guideContent.topics[0].spanishTerms = [];
  guideContent.topics[0].tickets = [];
  guideContent.topics[0].trapNotes = [];

  const errors = validate({ guideContent });
  assert(errors.includes("signals: learningMaterialRu must be a non-empty array."));
  assert(errors.includes("signals: spanishTerms must be a non-empty array."));
  assert(errors.includes("signals: tickets must be a non-empty array."));
  assert(errors.includes("signals: trapNotes must be a non-empty array."));
});

test("rejects missing explanations for correct and incorrect answers", () => {
  const guideContent = guide();
  guideContent.topics[0].tickets[0].answerExplanations = [
    {
      answerId: "q1-a2",
      verdict: "incorrect",
      explanationRu: "Неверный статус для правильного ответа."
    }
  ];

  const errors = validate({ guideContent });
  assert(errors.includes("signals/q1: missing answer explanation for q1-a1."));
  assert(errors.includes("signals/q1/q1-a2: verdict must be correct."));
  assert(errors.includes("signals/q1: missing answer explanation for q1-a3."));
});

test("rejects vocabulary terms not found in assigned ticket wording", () => {
  const guideContent = guide();
  guideContent.topics[0].spanishTerms[0].termEs = "autopista fantasma";

  const errors = validate({ guideContent });
  assert(errors.includes("signals/term-sena: termEs must come from assigned ticket or answer wording."));
});

test("rejects coverage/content assignment mismatch", () => {
  const coverageManifest = coverage({
    topics: [
      { topicId: "signals", phase: "content_ready", status: "draft", titleRu: "Жесты" },
      { topicId: "missing-topic", phase: "content_ready", status: "draft", titleRu: "Несуществующая тема" },
      { topicId: "stop-signs", phase: "planned", status: "draft", titleRu: "Знаки остановки и приоритета" }
    ],
    assignments: [
      { questionId: "q1", topicIds: ["missing-topic"], phase: "content_ready" },
      { questionId: "q2", topicIds: ["stop-signs"], phase: "planned" }
    ]
  });

  const errors = validate({ coverageManifest });
  assert(errors.includes("missing-topic: rendered coverage topic references missing guide topic."));
  assert(errors.includes("q1: rendered assignment references missing guide topic missing-topic."));
  assert(errors.includes("q1: guide content and rendered coverage assignments do not match."));
});

test("rejects stale coverage baseline", () => {
  const coverageManifest = coverage({
    baseline: {
      questionFile: "content/questions/caba-b.unofficial-fallback.questions.json",
      expectedQuestionCount: 999,
      questionIdsSha256: "0".repeat(64),
      capturedAt: "2026-05-09"
    }
  });

  const errors = validate({ coverageManifest });
  assert.match(errors.join("\n"), /expectedQuestionCount 999 does not match current 2/);
  assert(errors.includes("topic guide coverage baseline questionIdsSha256 does not match current question IDs."));
});

test("rejects more than two topic assignments", () => {
  const guideContent = guide();
  for (const topicId of ["rules", "extra"]) {
    guideContent.topics.push({ ...clone(guideContent.topics[0]), id: topicId, titleRu: topicId });
  }
  const coverageManifest = coverage({
    topics: [
      { topicId: "signals", phase: "content_ready", status: "draft", titleRu: "Жесты" },
      { topicId: "rules", phase: "content_ready", status: "draft", titleRu: "Правила" },
      { topicId: "extra", phase: "content_ready", status: "draft", titleRu: "Еще правила" },
      { topicId: "stop-signs", phase: "planned", status: "draft", titleRu: "Знаки остановки и приоритета" }
    ],
    assignments: [
      { questionId: "q1", topicIds: ["signals", "rules", "extra"], phase: "content_ready" },
      { questionId: "q2", topicIds: ["stop-signs"], phase: "planned" }
    ]
  });

  const errors = validate({ guideContent, coverageManifest });
  assert(errors.includes("q1: assignment must not reference more than two topics."));
  assert(errors.includes("q1: guide content must not assign a ticket to more than two topics."));
});

test("requires source trace entries for claims marked as official-source-backed", () => {
  const guideContent = guide();
  guideContent.topics[0].claims = [
    {
      id: "claim-1",
      textRu: "Официально проверяемое утверждение.",
      requiresOfficialSource: true,
      sourceTraceId: "trace-1"
    }
  ];

  const missingTraceErrors = validate({ guideContent });
  assert(missingTraceErrors.includes("signals/claim-1: missing source trace entry trace-1."));

  const emptyDocumentTrace = sourceTrace({
    entries: [
      {
        id: "trace-1",
        topicId: "signals",
        claimId: "claim-1",
        claimSummaryRu: "Проверяемое утверждение.",
        officialDocumentIds: [],
        checkedAt: "2026-05-09"
      }
    ]
  });
  const emptyDocumentErrors = validate({ guideContent, trace: emptyDocumentTrace });
  assert(emptyDocumentErrors.includes("trace-1: source trace officialDocumentIds must be a non-empty array."));

  const trace = sourceTrace({
    entries: [
      {
        id: "trace-1",
        topicId: "signals",
        claimId: "claim-1",
        claimSummaryRu: "Проверяемое утверждение.",
        officialDocumentIds: ["official-doc-1"],
        checkedAt: "2026-05-09"
      }
    ]
  });
  assert.deepEqual(validate({ guideContent, trace }), []);
});

test("rejects source trace entries with blank official document IDs", () => {
  const trace = sourceTrace({
    entries: [
      {
        id: "trace-blank-doc",
        topicId: "signals",
        claimId: "claim-1",
        claimSummaryRu: "Проверяемое утверждение.",
        officialDocumentIds: ["official-doc-1", " "],
        checkedAt: "2026-05-09"
      }
    ]
  });

  const errors = validate({ trace });
  assert(errors.includes("trace-blank-doc: source trace officialDocumentIds must contain only non-empty strings."));
});

test("rejects guideId mismatches across topic guide manifests", () => {
  const coverageManifest = coverage({ guideId: "other-guide" });
  const trace = sourceTrace({ guideId: "other-trace" });

  const errors = validate({ coverageManifest, trace });
  assert(errors.includes("topic guide coverage guideId must match topic guide id."));
  assert(errors.includes("topic guide source trace guideId must match topic guide guideId."));
});

test("rejects manifest status disagreement that could hide strict validation", () => {
  const guideContent = guide({ status: "published" });
  const coverageManifest = coverage({ status: "draft" });
  const trace = sourceTrace({ status: "draft" });

  const guideCoverageErrors = validate({ guideContent, coverageManifest, trace });
  assert(guideCoverageErrors.includes("topic guide and coverage statuses must match."));
  assert(guideCoverageErrors.includes("signals: published guide topic status must be published."));

  const sourceTraceErrors = validate({ trace: sourceTrace({ status: "published" }) });
  assert(sourceTraceErrors.includes("topic guide source trace status must match topic guide and coverage status."));
  assert(sourceTraceErrors.includes("signals: published guide topic status must be published."));
});
