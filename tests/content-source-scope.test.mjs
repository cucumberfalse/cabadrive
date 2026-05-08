import assert from "node:assert/strict";
import { test } from "node:test";
import { validatePracticeQuestionSourceScope } from "../scripts/content-source-scope.mjs";

const policy = {
  allowedPracticeQuestionScopeKinds: ["category_b_practice_source"],
  allowedPracticeQuestionCategories: ["B"],
  allowedPracticeQuestionTopicMentionsPolicies: ["cross_category_road_user_mentions_allowed"],
  requiredExcludedCategorySpecificSources: ["A", "A4", "motorcycle"]
};

function question(overrides = {}) {
  return {
    id: "q-b",
    sourceId: "source-b",
    category: "B",
    officialTextEs: "Como debe convivir con motocicletas en una avenida?",
    answers: [{ id: "a", officialTextEs: "Ceder cuando corresponda." }],
    ...overrides
  };
}

function source(overrides = {}) {
  return {
    id: "source-b",
    title: "Category B practice source with motorcycle shared-road topics",
    retrievalNote: "Includes questions about motos as road users, not as category A license practice.",
    practiceQuestionScope: {
      scopeKind: "category_b_practice_source",
      eligibleCategories: ["B"],
      excludedCategorySpecificSources: ["A", "A4", "motorcycle"],
      topicMentionsPolicy: "cross_category_road_user_mentions_allowed"
    },
    ...overrides
  };
}

test("accepts category B practice source even when metadata and question text mention motorcycles", () => {
  const errors = validatePracticeQuestionSourceScope({ question: question(), source: source(), policy });
  assert.deepEqual(errors, []);
});

test("rejects practice question sources without structured scope", () => {
  const errors = validatePracticeQuestionSourceScope({
    question: question(),
    source: source({ practiceQuestionScope: undefined }),
    policy
  });

  assert.match(errors.join("\n"), /must define practiceQuestionScope/);
});

test("rejects category A, A4, and motorcycle-specific practice source scopes", () => {
  const invalidScopes = [
    { scopeKind: "category_a_practice_source", eligibleCategories: ["A"] },
    { scopeKind: "category_a4_practice_source", eligibleCategories: ["A4"] },
    { scopeKind: "motorcycle_practice_source", eligibleCategories: ["A"] }
  ];

  for (const practiceQuestionScope of invalidScopes) {
    const errors = validatePracticeQuestionSourceScope({
      question: question(),
      source: source({
        practiceQuestionScope: {
          ...practiceQuestionScope,
          excludedCategorySpecificSources: ["B"],
          topicMentionsPolicy: "cross_category_road_user_mentions_allowed"
        }
      }),
      policy
    });

    assert.match(errors.join("\n"), /unsupported practiceQuestionScope\.scopeKind|unsupported practice category|does not allow question category B/);
  }
});

test("rejects unknown source scope kinds even when category B is listed", () => {
  const errors = validatePracticeQuestionSourceScope({
    question: question(),
    source: source({
      practiceQuestionScope: {
        scopeKind: "generic_practice_source",
        eligibleCategories: ["B"],
        excludedCategorySpecificSources: ["A", "A4", "motorcycle"],
        topicMentionsPolicy: "cross_category_road_user_mentions_allowed"
      }
    }),
    policy
  });

  assert.match(errors.join("\n"), /unsupported practiceQuestionScope\.scopeKind generic_practice_source/);
});

test("rejects category mismatch between question and otherwise allowed source scope", () => {
  const errors = validatePracticeQuestionSourceScope({
    question: question({ category: "C" }),
    source: source(),
    policy
  });

  assert.match(errors.join("\n"), /does not allow question category C/);
});
