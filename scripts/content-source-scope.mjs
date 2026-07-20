function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function list(value) {
  return asArray(value).join(", ");
}

export function validatePracticeQuestionSourceScope({ question, source, policy }) {
  const errors = [];
  if (!source) return errors;

  const sourceId = source.id || question.sourceId || "unknown-source";
  const scope = source.practiceQuestionScope;
  const allowedScopeKinds = new Set(asArray(policy?.allowedPracticeQuestionScopeKinds));
  const allowedCategories = new Set(asArray(policy?.allowedPracticeQuestionCategories));
  const allowedTopicPolicies = new Set(
    asArray(policy?.allowedPracticeQuestionTopicMentionsPolicies),
  );
  const requiredExclusions = asArray(policy?.requiredExcludedCategorySpecificSources);

  if (!scope || typeof scope !== "object" || Array.isArray(scope)) {
    errors.push(
      `${question.id}: source ${sourceId} must define practiceQuestionScope for practice questions.`,
    );
    return errors;
  }

  if (typeof scope.scopeKind !== "string" || !allowedScopeKinds.has(scope.scopeKind)) {
    errors.push(
      `${question.id}: source ${sourceId} has unsupported practiceQuestionScope.scopeKind ${scope.scopeKind ?? "<missing>"}.`,
    );
  }

  if (!Array.isArray(scope.eligibleCategories) || scope.eligibleCategories.length === 0) {
    errors.push(
      `${question.id}: source ${sourceId} must define non-empty practiceQuestionScope.eligibleCategories.`,
    );
  } else {
    for (const category of scope.eligibleCategories) {
      if (!allowedCategories.has(category)) {
        errors.push(
          `${question.id}: source ${sourceId} includes unsupported practice category ${category}.`,
        );
      }
    }
    if (!scope.eligibleCategories.includes(question.category)) {
      errors.push(
        `${question.id}: source ${sourceId} does not allow question category ${question.category}.`,
      );
    }
  }

  if (
    typeof scope.topicMentionsPolicy !== "string" ||
    !allowedTopicPolicies.has(scope.topicMentionsPolicy)
  ) {
    errors.push(
      `${question.id}: source ${sourceId} has unsupported practiceQuestionScope.topicMentionsPolicy ${scope.topicMentionsPolicy ?? "<missing>"}.`,
    );
  }

  if (!Array.isArray(scope.excludedCategorySpecificSources)) {
    errors.push(
      `${question.id}: source ${sourceId} must define practiceQuestionScope.excludedCategorySpecificSources.`,
    );
  } else {
    const missingExclusions = requiredExclusions.filter(
      (exclusion) => !scope.excludedCategorySpecificSources.includes(exclusion),
    );
    if (missingExclusions.length > 0) {
      errors.push(
        `${question.id}: source ${sourceId} must document excluded category-specific sources: ${list(missingExclusions)}.`,
      );
    }
  }

  return errors;
}
