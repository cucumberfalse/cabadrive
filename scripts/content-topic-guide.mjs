import { createHash } from "node:crypto";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ASSIGNMENT_PHASES = new Set(["planned", "content_ready", "published"]);
const RENDERED_ASSIGNMENT_PHASES = new Set(["content_ready", "published"]);

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

function canonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
    .join(",")}}`;
}

function sha256Canonical(value) {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

function coverageAssignmentPhase(assignment) {
  if (isNonEmptyString(assignment?.phase)) return assignment.phase;
  if (["planned", "content_ready", "published"].includes(assignment?.status)) return assignment.status;
  return "content_ready";
}

function isRenderedAssignmentPhase(phase) {
  return RENDERED_ASSIGNMENT_PHASES.has(phase);
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFC")
    .toLocaleLowerCase("es")
    .replace(/\s+/g, " ")
    .trim();
}

function questionSearchText(question) {
  return normalizeText([
    question?.officialTextEs,
    ...asArray(question?.answers).map((answer) => answer.officialTextEs)
  ].join(" "));
}

export function topicGuideQuestionBaseline(questions) {
  const ids = uniqueSorted(asArray(questions).map((question) => question?.id).filter(isNonEmptyString));
  return {
    expectedQuestionCount: ids.length,
    questionIdsSha256: sha256Canonical(ids)
  };
}

function validateSourceTrace({ sourceTrace, topicIds, requiredClaimRefs, expectedGuideId, expectedStatus }) {
  const errors = [];
  if (!isPlainObject(sourceTrace)) {
    errors.push("topic guide source trace must be an object.");
    return { errors, entryById: new Map() };
  }
  if (sourceTrace.version !== 1) errors.push("topic guide source trace version must be 1.");
  if (!isNonEmptyString(sourceTrace.guideId)) {
    errors.push("topic guide source trace guideId must be a non-empty string.");
  } else if (isNonEmptyString(expectedGuideId) && sourceTrace.guideId !== expectedGuideId) {
    errors.push("topic guide source trace guideId must match topic guide guideId.");
  }
  if (!["draft", "published"].includes(sourceTrace.status)) {
    errors.push("topic guide source trace status must be draft or published.");
  } else if (["draft", "published"].includes(expectedStatus) && sourceTrace.status !== expectedStatus) {
    errors.push("topic guide source trace status must match topic guide and coverage status.");
  }
  if (!Array.isArray(sourceTrace.entries)) errors.push("topic guide source trace entries must be an array.");

  const entryById = new Map();
  for (const entry of asArray(sourceTrace.entries)) {
    const label = isNonEmptyString(entry?.id) ? entry.id : "source trace entry";
    if (!isPlainObject(entry)) {
      errors.push("source trace entry must be an object.");
      continue;
    }
    if (!isNonEmptyString(entry.id)) errors.push(`${label}: source trace id must be a non-empty string.`);
    if (entryById.has(entry.id)) errors.push(`${entry.id}: duplicate source trace entry.`);
    entryById.set(entry.id, entry);
    if (!isNonEmptyString(entry.topicId)) errors.push(`${label}: source trace topicId must be a non-empty string.`);
    if (isNonEmptyString(entry.topicId) && !topicIds.has(entry.topicId)) {
      errors.push(`${label}: source trace references missing topic ${entry.topicId}.`);
    }
    if (!isNonEmptyString(entry.claimId)) errors.push(`${label}: source trace claimId must be a non-empty string.`);
    if (!isNonEmptyString(entry.claimSummaryRu)) errors.push(`${label}: source trace claimSummaryRu must be a non-empty string.`);
    if (!Array.isArray(entry.officialDocumentIds) || entry.officialDocumentIds.length === 0) {
      errors.push(`${label}: source trace officialDocumentIds must be a non-empty array.`);
    } else if (entry.officialDocumentIds.some((id) => !isNonEmptyString(id))) {
      errors.push(`${label}: source trace officialDocumentIds must contain only non-empty strings.`);
    }
    if (!DATE_PATTERN.test(entry.checkedAt || "")) errors.push(`${label}: source trace checkedAt must be YYYY-MM-DD.`);
  }

  for (const ref of requiredClaimRefs) {
    const entry = entryById.get(ref.sourceTraceId);
    if (!entry) {
      errors.push(`${ref.topicId}/${ref.claimId}: missing source trace entry ${ref.sourceTraceId}.`);
      continue;
    }
    if (entry.topicId !== ref.topicId || entry.claimId !== ref.claimId) {
      errors.push(`${ref.topicId}/${ref.claimId}: source trace entry ${ref.sourceTraceId} does not match topic and claim.`);
    }
  }

  return { errors, entryById };
}

export function validateTopicGuide({ questions, guide, coverage, sourceTrace }) {
  const errors = [];
  const questionList = asArray(questions);
  const questionById = new Map();

  for (const question of questionList) {
    if (!isNonEmptyString(question?.id)) {
      errors.push("question.id must be a non-empty string.");
      continue;
    }
    if (questionById.has(question.id)) errors.push(`${question.id}: duplicate question id in question set.`);
    questionById.set(question.id, question);
  }

  if (!isPlainObject(guide)) {
    errors.push("topic guide content must be an object.");
    return errors;
  }
  if (guide.version !== 1) errors.push("topic guide content version must be 1.");
  if (!isNonEmptyString(guide.id)) errors.push("topic guide id must be a non-empty string.");
  if (guide.locale !== "ru") errors.push("topic guide locale must be ru.");
  if (!["draft", "published"].includes(guide.status)) errors.push("topic guide status must be draft or published.");
  if (guide.contentStatus !== "unofficial_learning_aid") {
    errors.push("topic guide contentStatus must be unofficial_learning_aid.");
  }
  if (!isNonEmptyString(guide.disclaimer) || !guide.disclaimer.includes("Неофициаль")) {
    errors.push("topic guide disclaimer must mark Russian guide content as unofficial.");
  }
  if (!Array.isArray(guide.topics)) errors.push("topic guide topics must be an array.");

  if (!isPlainObject(coverage)) {
    errors.push("topic guide coverage manifest must be an object.");
    return errors;
  }
  if (coverage.version !== 1) errors.push("topic guide coverage version must be 1.");
  if (!isNonEmptyString(coverage.guideId)) {
    errors.push("topic guide coverage guideId must be a non-empty string.");
  } else if (isNonEmptyString(guide.id) && coverage.guideId !== guide.id) {
    errors.push("topic guide coverage guideId must match topic guide id.");
  }
  if (!["draft", "published"].includes(coverage.status)) errors.push("topic guide coverage status must be draft or published.");
  if (
    ["draft", "published"].includes(guide.status) &&
    ["draft", "published"].includes(coverage.status) &&
    guide.status !== coverage.status
  ) {
    errors.push("topic guide and coverage statuses must match.");
  }

  const baseline = topicGuideQuestionBaseline(questionList);
  if (!isPlainObject(coverage.baseline)) {
    errors.push("topic guide coverage baseline must be an object.");
  } else {
    if (coverage.baseline.questionFile !== "content/questions/caba-b.unofficial-fallback.questions.json") {
      errors.push("topic guide coverage baseline questionFile must reference the category B fallback question file.");
    }
    if (coverage.baseline.expectedQuestionCount !== baseline.expectedQuestionCount) {
      errors.push(
        `topic guide coverage baseline expectedQuestionCount ${coverage.baseline.expectedQuestionCount} does not match current ${baseline.expectedQuestionCount}.`
      );
    }
    if (coverage.baseline.questionIdsSha256 !== baseline.questionIdsSha256) {
      errors.push("topic guide coverage baseline questionIdsSha256 does not match current question IDs.");
    }
    if (!DATE_PATTERN.test(coverage.baseline.capturedAt || "")) {
      errors.push("topic guide coverage baseline capturedAt must be YYYY-MM-DD.");
    }
  }

  if (!Array.isArray(coverage.topics)) errors.push("topic guide coverage topics must be an array.");
  if (!Array.isArray(coverage.assignments)) errors.push("topic guide coverage assignments must be an array.");

  const topicIds = new Set();
  const contentAssignments = new Map();
  const requiredClaimRefs = [];

  for (const topic of asArray(guide.topics)) {
    const label = isNonEmptyString(topic?.id) ? topic.id : "topic guide topic";
    if (!isPlainObject(topic)) {
      errors.push("topic guide topic must be an object.");
      continue;
    }
    if (!isNonEmptyString(topic.id)) errors.push(`${label}: topic id must be a non-empty string.`);
    if (topicIds.has(topic.id)) errors.push(`${topic.id}: duplicate topic id.`);
    topicIds.add(topic.id);
    if (!isNonEmptyString(topic.titleRu)) errors.push(`${label}: titleRu must be a non-empty string.`);
    if (!isNonEmptyString(topic.summaryRu)) errors.push(`${label}: summaryRu must be a non-empty string.`);
    if (!Array.isArray(topic.learningMaterialRu) || topic.learningMaterialRu.length === 0) {
      errors.push(`${label}: learningMaterialRu must be a non-empty array.`);
    } else if (topic.learningMaterialRu.some((item) => !isNonEmptyString(item))) {
      errors.push(`${label}: learningMaterialRu must contain only non-empty strings.`);
    }
    if (!Array.isArray(topic.spanishTerms) || topic.spanishTerms.length === 0) {
      errors.push(`${label}: spanishTerms must be a non-empty array.`);
    }
    if (!Array.isArray(topic.tickets) || topic.tickets.length === 0) {
      errors.push(`${label}: tickets must be a non-empty array.`);
    }
    if (!Array.isArray(topic.trapNotes) || topic.trapNotes.length === 0) {
      errors.push(`${label}: trapNotes must be a non-empty array.`);
    } else if (topic.trapNotes.some((note) => !isNonEmptyString(note?.textRu))) {
      errors.push(`${label}: trapNotes must include textRu for every note.`);
    }

    const topicQuestionIds = new Set();
    for (const ticket of asArray(topic.tickets)) {
      const ticketLabel = isNonEmptyString(ticket?.questionId) ? `${topic.id}/${ticket.questionId}` : `${label}/ticket`;
      if (!isPlainObject(ticket)) {
        errors.push(`${label}: ticket must be an object.`);
        continue;
      }
      if (!isNonEmptyString(ticket.questionId)) {
        errors.push(`${ticketLabel}: questionId must be a non-empty string.`);
        continue;
      }
      const question = questionById.get(ticket.questionId);
      if (!question) {
        errors.push(`${ticketLabel}: guide ticket references missing question.`);
        continue;
      }
      topicQuestionIds.add(ticket.questionId);
      const assignedTopicIds = contentAssignments.get(ticket.questionId) || [];
      assignedTopicIds.push(topic.id);
      contentAssignments.set(ticket.questionId, assignedTopicIds);

      if (!Array.isArray(ticket.answerExplanations)) {
        errors.push(`${ticketLabel}: answerExplanations must be an array.`);
        continue;
      }
      const explanationByAnswerId = new Map();
      for (const explanation of ticket.answerExplanations) {
        const answerId = explanation?.answerId;
        const explanationLabel = isNonEmptyString(answerId) ? `${ticketLabel}/${answerId}` : `${ticketLabel}/answer explanation`;
        if (!isPlainObject(explanation)) {
          errors.push(`${ticketLabel}: answer explanation must be an object.`);
          continue;
        }
        if (!isNonEmptyString(answerId)) errors.push(`${explanationLabel}: answerId must be a non-empty string.`);
        if (explanationByAnswerId.has(answerId)) errors.push(`${explanationLabel}: duplicate answer explanation.`);
        explanationByAnswerId.set(answerId, explanation);
        if (!["correct", "incorrect"].includes(explanation.verdict)) {
          errors.push(`${explanationLabel}: verdict must be correct or incorrect.`);
        }
        if (!isNonEmptyString(explanation.explanationRu)) {
          errors.push(`${explanationLabel}: explanationRu must be a non-empty string.`);
        }
      }
      for (const answer of asArray(question.answers)) {
        const explanation = explanationByAnswerId.get(answer.id);
        if (!explanation) {
          errors.push(`${ticketLabel}: missing answer explanation for ${answer.id}.`);
          continue;
        }
        const expectedVerdict = answer.id === question.correctAnswerId ? "correct" : "incorrect";
        if (explanation.verdict !== expectedVerdict) {
          errors.push(`${ticketLabel}/${answer.id}: verdict must be ${expectedVerdict}.`);
        }
      }
      for (const answerId of explanationByAnswerId.keys()) {
        if (!asArray(question.answers).some((answer) => answer.id === answerId)) {
          errors.push(`${ticketLabel}: extra answer explanation for ${answerId}.`);
        }
      }
    }

    for (const term of asArray(topic.spanishTerms)) {
      const termLabel = isNonEmptyString(term?.id) ? `${topic.id}/${term.id}` : `${label}/spanish term`;
      if (!isPlainObject(term)) {
        errors.push(`${label}: spanish term must be an object.`);
        continue;
      }
      if (!isNonEmptyString(term.id)) errors.push(`${termLabel}: term id must be a non-empty string.`);
      if (!isNonEmptyString(term.termEs)) errors.push(`${termLabel}: termEs must be a non-empty string.`);
      if (!isNonEmptyString(term.translationRu)) errors.push(`${termLabel}: translationRu must be a non-empty string.`);
      if (!Array.isArray(term.sourceQuestionIds) || term.sourceQuestionIds.length === 0) {
        errors.push(`${termLabel}: sourceQuestionIds must be a non-empty array.`);
        continue;
      }
      for (const questionId of term.sourceQuestionIds) {
        if (!topicQuestionIds.has(questionId)) {
          errors.push(`${termLabel}: source question ${questionId} is not assigned to topic ${topic.id}.`);
          continue;
        }
        const sourceText = questionSearchText(questionById.get(questionId));
        if (!sourceText.includes(normalizeText(term.termEs))) {
          errors.push(`${termLabel}: termEs must come from assigned ticket or answer wording.`);
        }
      }
    }

    for (const claim of asArray(topic.claims)) {
      const claimLabel = isNonEmptyString(claim?.id) ? `${topic.id}/${claim.id}` : `${label}/claim`;
      if (!isPlainObject(claim)) {
        errors.push(`${label}: claim must be an object.`);
        continue;
      }
      if (!isNonEmptyString(claim.id)) errors.push(`${claimLabel}: claim id must be a non-empty string.`);
      if (!isNonEmptyString(claim.textRu)) errors.push(`${claimLabel}: textRu must be a non-empty string.`);
      if (claim.requiresOfficialSource === true) {
        if (!isNonEmptyString(claim.sourceTraceId)) {
          errors.push(`${claimLabel}: requiresOfficialSource claims must define sourceTraceId.`);
        } else {
          requiredClaimRefs.push({ topicId: topic.id, claimId: claim.id, sourceTraceId: claim.sourceTraceId });
        }
      }
    }
  }

  const coverageTopicIds = new Set();
  for (const topic of asArray(coverage.topics)) {
    const topicId = topic?.topicId;
    if (!isNonEmptyString(topicId)) {
      errors.push("topic guide coverage topicId must be a non-empty string.");
      continue;
    }
    if (coverageTopicIds.has(topicId)) errors.push(`${topicId}: duplicate coverage topic id.`);
    coverageTopicIds.add(topicId);
    if (!isNonEmptyString(topic.titleRu)) errors.push(`${topicId}: coverage topic titleRu must be a non-empty string.`);
    if (isRenderedAssignmentPhase(topic.phase) && !topicIds.has(topicId)) {
      errors.push(`${topicId}: rendered coverage topic references missing guide topic.`);
    }
  }
  for (const topicId of topicIds) {
    if (!coverageTopicIds.has(topicId)) errors.push(`${topicId}: guide topic missing from coverage topics.`);
  }

  const coverageAssignments = new Map();
  const renderedCoverageAssignments = new Map();
  for (const assignment of asArray(coverage.assignments)) {
    const questionId = assignment?.questionId;
    const label = isNonEmptyString(questionId) ? questionId : "topic guide coverage assignment";
    if (!isPlainObject(assignment)) {
      errors.push("topic guide coverage assignment must be an object.");
      continue;
    }
    if (!isNonEmptyString(questionId)) {
      errors.push(`${label}: assignment questionId must be a non-empty string.`);
      continue;
    }
    if (!questionById.has(questionId)) errors.push(`${questionId}: coverage assignment references missing question.`);
    if (coverageAssignments.has(questionId)) errors.push(`${questionId}: duplicate coverage assignment.`);
    if (!Array.isArray(assignment.topicIds) || assignment.topicIds.length === 0) {
      errors.push(`${questionId}: assignment topicIds must be a non-empty array.`);
      continue;
    }
    const assignedTopicIds = uniqueSorted(assignment.topicIds);
    if (assignedTopicIds.length !== assignment.topicIds.length) {
      errors.push(`${questionId}: assignment topicIds must not contain duplicates.`);
    }
    if (assignedTopicIds.length > 2) errors.push(`${questionId}: assignment must not reference more than two topics.`);
    const phase = coverageAssignmentPhase(assignment);
    if (!ASSIGNMENT_PHASES.has(phase)) {
      errors.push(`${questionId}: assignment phase must be planned, content_ready, or published.`);
    }
    for (const topicId of assignedTopicIds) {
      if (!coverageTopicIds.has(topicId)) errors.push(`${questionId}: assignment references missing coverage topic ${topicId}.`);
      if (isRenderedAssignmentPhase(phase) && !topicIds.has(topicId)) {
        errors.push(`${questionId}: rendered assignment references missing guide topic ${topicId}.`);
      }
    }
    coverageAssignments.set(questionId, assignedTopicIds);
    if (isRenderedAssignmentPhase(phase)) renderedCoverageAssignments.set(questionId, assignedTopicIds);
  }

  for (const [questionId, topicList] of contentAssignments.entries()) {
    const contentTopicIds = uniqueSorted(topicList);
    if (contentTopicIds.length !== topicList.length) {
      errors.push(`${questionId}: guide content repeats the same topic assignment.`);
    }
    if (contentTopicIds.length > 2) errors.push(`${questionId}: guide content must not assign a ticket to more than two topics.`);
    const coverageTopicIdsForQuestion = renderedCoverageAssignments.get(questionId);
    if (!coverageTopicIdsForQuestion) {
      errors.push(`${questionId}: guide content ticket is missing from content-ready or published coverage assignments.`);
      continue;
    }
    if (coverageTopicIdsForQuestion.join(",") !== contentTopicIds.join(",")) {
      errors.push(`${questionId}: guide content and rendered coverage assignments do not match.`);
    }
  }
  for (const [questionId, topicList] of renderedCoverageAssignments.entries()) {
    const contentTopicIds = uniqueSorted(contentAssignments.get(questionId) || []);
    if (contentTopicIds.join(",") !== topicList.join(",")) {
      errors.push(`${questionId}: content-ready or published coverage assignment is missing from guide content.`);
    }
  }

  const isPublished = [guide.status, coverage.status, sourceTrace?.status].includes("published");
  for (const questionId of questionById.keys()) {
    if (!coverageAssignments.has(questionId)) {
      errors.push(`${questionId}: topic guide must assign every current question.`);
    }
  }
  if (isPublished) {
    for (const assignment of asArray(coverage.assignments)) {
      if (coverageAssignmentPhase(assignment) === "planned" && isNonEmptyString(assignment?.questionId)) {
        errors.push(`${assignment.questionId}: published guide must promote planned assignments before release.`);
      }
    }
  }

  const expectedStatus = guide.status === coverage.status ? guide.status : undefined;
  errors.push(
    ...validateSourceTrace({
      sourceTrace,
      topicIds,
      requiredClaimRefs,
      expectedGuideId: guide.id,
      expectedStatus
    }).errors
  );
  return errors;
}
