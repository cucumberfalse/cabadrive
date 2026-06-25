import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "vite";
import {
  F038_RA004_LEXICAL_BASELINE_IDS,
  F038_RA004_SEMANTIC_EQUIVALENCE_IDS,
  buildManualTicketRuntimeProjection,
  createPageInventory,
  createPlacementCandidates,
  detectRejectedCandidateAnswerOverlap,
  loadManualCorpus,
  loadShardEntries,
  readJson,
  validateManualTicketRuntimeProjection,
  validatePlacementData
} from "../scripts/manual-ticket-placement-lib.mjs";

const root = resolve(".");
const questions = readJson("content/questions/caba-b.unofficial-fallback.questions.json");
const translations = loadShardEntries(root, "content/translations/ru");
const explanations = loadShardEntries(root, "content/explanations/ru");
const guide = readJson("content/guide/topic-study-guide.ru.json");
const pageInventory = readJson("content/manual-ticket-placement/manual-pages.json");
const baseline = readJson("content/manual-ticket-placement/manual-content-baseline.json");
const records = loadShardEntries(root, "content/manual-ticket-placement/placements");
const evidence = readJson("content/validation/manual-ticket-placement.evidence.json");
const reviewedManifest = readJson("content/manual-ticket-placement/reviewed-manifest.json");
const topicRoutes = readJson("content/manual-ticket-placement/topic-routes.json");
const ticketTopicAssignments = readJson("content/manual-ticket-placement/ticket-topic-assignments.json");
const runtimeProjection = readJson("content/manual-ticket-placement/manual-ticket-placement.runtime.json");
const corpus = await loadManualCorpus(root);

function validate(
  candidateRecords,
  candidateEvidence = undefined,
  candidateManifest = reviewedManifest,
  candidateRoutes = topicRoutes,
  candidateAssignments = ticketTopicAssignments,
  candidateRuntimeProjection = runtimeProjection
) {
  return validatePlacementData({
    root,
    corpus,
    questions,
    translations,
    pageInventory,
    baseline,
    records: candidateRecords,
    evidence: candidateEvidence,
    reviewedManifest: candidateManifest,
    topicRoutes: candidateRoutes,
    ticketTopicAssignments: candidateAssignments,
    runtimeProjection: candidateRuntimeProjection
  });
}

test("reviewed manual placement covers all tickets through sealed curated topic routes", () => {
  const result = validate(records, evidence);
  assert.deepEqual(result.errors, []);
  assert.equal(result.summary.canonicalQuestionCount, 460);
  assert.equal(result.summary.placementRelationCount, 460);
  assert.deepEqual(result.summary.questionsByPlacementCount, { 1: 460, 2: 0, 3: 0 });
  assert.equal(result.summary.answerBearingPlacementCount, 85);
  assert.equal(result.summary.ownerApprovedThematicFallbacks.length, 375);
  assert.equal(result.contradictionAudit.architectLexicalBaselineCount, 39);
  assert.equal(result.contradictionAudit.reviewedSemanticEquivalenceCount, 65);
  assert.equal(result.contradictionAudit.screenedQuestionCount, 104);
  assert.equal(result.contradictionAudit.reclassifiedAnswerBearingIds.length, 85);
  assert.equal(result.contradictionAudit.retainedFallbackIds.length, 19);
  assert.deepEqual(result.contradictionAudit.unresolvedIds, []);
  assert.equal(topicRoutes.routes.length, 38);
  assert.equal(ticketTopicAssignments.entries.length, 460);
  assert.ok(result.summary.ownerApprovedThematicFallbacks.some(({ questionId }) => questionId === "b-fallback-011"));
  assert.ok(result.summary.ownerApprovedThematicFallbacks.some(({ questionId }) => questionId === "b-fallback-126"));
  assert.ok(result.summary.ownerApprovedThematicFallbacks.some(({ questionId }) => questionId === "b-fallback-235"));
});

test("candidate ranking has no approval authority or committed write fields", () => {
  const candidates = createPlacementCandidates({
    questions: questions.slice(0, 3),
    translations,
    explanations,
    guide,
    corpus,
    pageInventory: createPageInventory(corpus)
  });
  const serialized = JSON.stringify(candidates);
  assert.doesNotMatch(serialized, /"status":"approved"/u);
  assert.doesNotMatch(serialized, /placementBasis|answerBasisRu|topicRouteId|reviewedBy|reviewedAt/u);

  const generatorSource = readFileSync("scripts/content-manual-ticket-placement.mjs", "utf8");
  assert.doesNotMatch(generatorSource, /createPlacements|placementShardRoot|shardRecords/u);
  assert.doesNotMatch(generatorSource, /writeJson\(topicRoutesPath|writeJson\(ticketTopicAssignmentsPath/u);
  assert.match(generatorSource, /Candidate-only lexical\/topic aid/u);
});

test("validator rejects missing, stale, or synthetic reviewed-manifest evidence", () => {
  assert.ok(validate(records, undefined, null).errors.some((error) => error.includes("Reviewed manifest is missing")));

  const staleManifest = structuredClone(reviewedManifest);
  staleManifest.records[0].fingerprint = "0".repeat(64);
  assert.ok(validate(records, undefined, staleManifest).errors.some((error) => error.includes("reviewed source differs")));

  const staleRouteManifest = structuredClone(reviewedManifest);
  staleRouteManifest.topicRoutesFingerprint = "0".repeat(64);
  assert.ok(validate(records, undefined, staleRouteManifest).errors.some((error) => error.includes("topic-routing source differs")));

  const syntheticManifest = structuredClone(reviewedManifest);
  syntheticManifest.sealedBy = "placement-generator";
  assert.ok(validate(records, undefined, syntheticManifest).errors.some((error) => error.includes("reserved or synthetic reviewer")));
});

test("validator rejects strict records without direct-answer evidence, synthetic reviewers, and stale exact anchors", () => {
  const unsupportedStrict = structuredClone(records);
  delete unsupportedStrict[0].placements[0].directAnswerAssertionRu;
  assert.ok(validate(unsupportedStrict).errors.some((error) => error.includes("strict placement lacks direct-answer evidence")));

  const syntheticReviewer = structuredClone(records);
  syntheticReviewer[0].review.reviewedBy = "feature-038-semantic-review";
  assert.ok(validate(syntheticReviewer).errors.some((error) => error.includes("reserved or synthetic reviewer identity")));

  const staleAnchor = structuredClone(records);
  staleAnchor[0].placements[0].anchorTextAtReview = "changed";
  assert.ok(validate(staleAnchor).errors.some((error) => error.includes("exact reviewed anchor text is stale")));
});

test("validator rejects malformed fallbacks and support-page destinations", () => {
  const missingAudit = structuredClone(records);
  const fallback126 = missingAudit.find((record) => record.questionId === "b-fallback-126");
  delete fallback126.placements[0].fallbackEvidence.topicRouteId;
  assert.ok(validate(missingAudit).errors.some((error) => error.includes("outside its reviewed curated route")));

  const supportPage = structuredClone(records);
  const fallback235 = supportPage.find((record) => record.questionId === "b-fallback-235");
  fallback235.placements[0].pageId = "front-glossary";
  fallback235.placements[0].routeHash = "#manual-section-front-glossary";
  assert.ok(validate(supportPage).errors.some((error) => error.includes("ineligible destination front-glossary")));
});

test("validator requires complete ticket-specific fallback ledgers", () => {
  const missingConcepts = structuredClone(records);
  const missingConceptsFallback = missingConcepts.find((record) => record.questionId === "b-fallback-126").placements[0].fallbackEvidence;
  delete missingConceptsFallback.searchedConcepts;
  assert.ok(validate(missingConcepts).errors.some((error) => error.includes("two distinct searched concepts")));

  const duplicatedConcepts = structuredClone(records);
  const duplicatedFallback = duplicatedConcepts.find((record) => record.questionId === "b-fallback-126").placements[0].fallbackEvidence;
  duplicatedFallback.searchedConcepts = [duplicatedFallback.searchedConcepts[0], duplicatedFallback.searchedConcepts[0]];
  assert.ok(validate(duplicatedConcepts).errors.some((error) => error.includes("two distinct searched concepts")));

  const noRejectedCandidate = structuredClone(records);
  const noRejectedFallback = noRejectedCandidate.find((record) => record.questionId === "b-fallback-126").placements[0].fallbackEvidence;
  noRejectedFallback.candidatesReviewed =
    noRejectedFallback.candidatesReviewed.filter(
      (candidate) => candidate.outcome !== "rejected"
    );
  assert.ok(validate(noRejectedCandidate).errors.some((error) => error.includes("one selected and at least one rejected")));

  const staleCandidate = structuredClone(records);
  staleCandidate.find((record) => record.questionId === "b-fallback-126")
    .placements[0].fallbackEvidence.candidatesReviewed[1].anchorTextAtReview = "stale";
  assert.ok(validate(staleCandidate).errors.some((error) => error.includes("stale exact-anchor evidence")));

  const mismatchedSelected = structuredClone(records);
  mismatchedSelected.find((record) => record.questionId === "b-fallback-126")
    .placements[0].fallbackEvidence.candidatesReviewed[0].pageId = "ch3-speed";
  assert.ok(validate(mismatchedSelected).errors.some((error) => error.includes("differs from the committed placement")));

  const genericConclusion = structuredClone(records);
  genericConclusion.find((record) => record.questionId === "b-fallback-126")
    .placements[0].fallbackEvidence.auditConclusionRu =
    "Общий вывод без идентификатора и формулировки конкретного билета.";
  assert.ok(validate(genericConclusion).errors.some((error) => error.includes("generic")));
});

test("validator rejects fallback pages or anchors outside the reviewed route", () => {
  const wrongPage = structuredClone(records);
  const lights = wrongPage.find((record) => record.questionId === "b-fallback-349");
  lights.placements[0].pageId = "app1-safety-elements";
  lights.placements[0].routeHash = "#manual-section-app1-safety-elements";
  assert.ok(validate(wrongPage).errors.some((error) => error.includes("outside its reviewed curated route")));

  const wrongAnchor = structuredClone(records);
  const fatigue = wrongAnchor.find((record) => record.questionId === "b-fallback-349");
  fatigue.placements[0].anchor = structuredClone(records[0].placements[0].anchor);
  assert.ok(validate(wrongAnchor).errors.some((error) => error.includes("outside its reviewed curated route")));

  const missingAssignment = structuredClone(ticketTopicAssignments);
  missingAssignment.entries = missingAssignment.entries.filter((entry) => entry.questionId !== "b-fallback-431");
  assert.ok(validate(records, undefined, reviewedManifest, topicRoutes, missingAssignment).errors.some(
    (error) => error.includes("missing reviewed topic-route assignment") || error.includes("assignment count is stale")
  ));
});

test("fresh and prior review regression tickets use conservative classifications and closest curated routes", () => {
  const expected = {
    "b-fallback-003": ["emergency-response-and-crash-scene", "ch2-incident-obligations", "answer-bearing"],
    "b-fallback-011": ["warning-signs", "app4-signs-warning", "owner-approved-thematic-fallback"],
    "b-fallback-037": ["bicycles-and-micromobility", "ch1-bicycle", "owner-approved-thematic-fallback"],
    "b-fallback-042": ["information-signs", "app4-signs-informational", "answer-bearing"],
    "b-fallback-064": ["mirrors-blind-spots-and-visibility", "app1-safety-elements", "owner-approved-thematic-fallback"],
    "b-fallback-085": ["right-of-way-basic-intersections", "ch3-right-of-way", "owner-approved-thematic-fallback"],
    "b-fallback-096": ["emergency-response-and-crash-scene", "ch2-incident-obligations", "owner-approved-thematic-fallback"],
    "b-fallback-165": ["lane-choice-and-lane-changes", "ch3-highways", "owner-approved-thematic-fallback"],
    "b-fallback-202": ["warning-signs", "app4-signs-warning", "owner-approved-thematic-fallback"],
    "b-fallback-281": ["right-of-way-basic-intersections", "ch3-right-of-way", "owner-approved-thematic-fallback"],
    "b-fallback-323": ["occupant-protection", "app1-safety-elements", "owner-approved-thematic-fallback"],
    "b-fallback-349": ["vehicle-lights-and-signaling", "ch3-lights", "owner-approved-thematic-fallback"],
    "b-fallback-350": ["driver-hand-signals", "ch1-bicycle", "answer-bearing"],
    "b-fallback-404": ["fatigue-distraction-and-attention", "ch4-sleep-fatigue", "answer-bearing"],
    "b-fallback-431": ["alcohol-drugs-and-impairment", "ch4-alcohol-drugs", "answer-bearing"],
    "b-fallback-454": ["occupant-protection", "app1-safety-elements", "owner-approved-thematic-fallback"]
  };
  const assignmentById = new Map(ticketTopicAssignments.entries.map((entry) => [entry.questionId, entry]));
  const recordById = new Map(records.map((record) => [record.questionId, record]));
  for (const [questionId, [topicRouteId, pageId, placementBasis]] of Object.entries(expected)) {
    const record = recordById.get(questionId);
    assert.equal(assignmentById.get(questionId).topicRouteId, topicRouteId);
    assert.equal(record.topicRouteId, topicRouteId);
    assert.equal(record.placements[0].pageId, pageId);
    assert.equal(record.placements[0].placementBasis, placementBasis);
  }
});

test("known false mappings 003, 011, and 042 cannot return", () => {
  const current003 = records.find((record) => record.questionId === "b-fallback-003").placements[0];
  const current011 = records.find((record) => record.questionId === "b-fallback-011").placements[0];
  const current042 = records.find((record) => record.questionId === "b-fallback-042").placements[0];
  assert.equal(current003.pageId, "ch2-incident-obligations");
  assert.equal(current011.pageId, "app4-signs-warning");
  assert.equal(current011.placementBasis, "owner-approved-thematic-fallback");
  assert.equal(current042.pageId, "app4-signs-informational");
  assert.equal(current042.anchor.entryId, "app4informational-p191-019-terminal-de-omnibus-catalog-entry");

  const restored = structuredClone(records);
  const record003 = restored.find((record) => record.questionId === "b-fallback-003");
  record003.placements[0].pageId = "app1-other-required-safety-elements";
  record003.placements[0].anchor.blockId = "extinguisher";
  assert.ok(validate(restored).errors.some((error) => error.includes("known false mapping fixture was restored")));
});

test("tickets 042 and 126 preserve their exact approved anchors and comparison ledgers", () => {
  const record042 = records.find((record) => record.questionId === "b-fallback-042");
  assert.equal(record042.topicRouteId, "information-signs");
  assert.equal(record042.placements[0].placementBasis, "answer-bearing");
  assert.equal(record042.placements[0].anchorTextAtReview, "автовокзал");
  assert.equal(record042.placements[0].fallbackEvidence, undefined);

  const record126 = records.find((record) => record.questionId === "b-fallback-126");
  assert.equal(record126.placements[0].anchor.kind, "manual-list-item");
  assert.equal(record126.placements[0].anchor.blockId, "pre-driving-checks");
  assert.equal(record126.placements[0].anchor.itemIndex, 0);
  assert.ok(record126.placements[0].fallbackEvidence.candidatesReviewed.some((candidate) =>
    candidate.outcome === "rejected" &&
    candidate.pageId === "ch5-anticipatory-efficient-driving" &&
    candidate.anchor.blockId === "efficient-driving-measures"
  ));
  assert.ok(record126.placements[0].fallbackEvidence.candidatesReviewed.some((candidate) =>
    candidate.outcome === "rejected" &&
    candidate.pageId === "app3-social-responsibility" &&
    candidate.anchor.blockId === "vehicle-precheck"
  ));

  const alternate042 = structuredClone(records);
  const placement042 = alternate042.find((record) => record.questionId === "b-fallback-042").placements[0];
  placement042.pageId = "ch1-public-transport-system";
  assert.ok(validate(alternate042).errors.some((error) => error.includes("bus-terminal invariant")));

  const alternate126 = structuredClone(records);
  const placement126 = alternate126.find((record) => record.questionId === "b-fallback-126").placements[0];
  placement126.anchor = structuredClone(records[0].placements[0].anchor);
  assert.ok(validate(alternate126).errors.some((error) => error.includes("oil-check invariant")));
});

test("F038-RA-004 rejects undisposed overlaps and seals lexical plus semantic review outcomes", () => {
  assert.equal(F038_RA004_LEXICAL_BASELINE_IDS.length, 39);
  assert.equal(F038_RA004_SEMANTIC_EQUIVALENCE_IDS.length, 65);

  for (const questionId of ["b-fallback-001", "b-fallback-065", "b-fallback-086"]) {
    const fixture = structuredClone(records);
    const record = fixture.find((entry) => entry.questionId === questionId);
    const fallbackTemplate = structuredClone(
      fixture.find((entry) => entry.questionId === "b-fallback-026").placements[0]
    );
    record.placements[0].placementBasis = "owner-approved-thematic-fallback";
    record.placements[0].fallbackEvidence = fallbackTemplate.fallbackEvidence;
    record.placements[0].thematicBasisRu = fallbackTemplate.thematicBasisRu;
    delete record.placements[0].contradictionReview;
    assert.ok(validate(fixture).errors.some((error) => error.includes("exact self-sufficient answer-bearing candidate remains rejected")));
  }

  const fallback026 = records.find((record) => record.questionId === "b-fallback-026");
  const candidate026 = fallback026.placements[0].fallbackEvidence.candidatesReviewed.find((candidate) => candidate.outcome === "rejected");
  const question026 = questions.find((question) => question.id === "b-fallback-026");
  const translation026 = translations.find((translation) => translation.questionId === "b-fallback-026");
  assert.ok(detectRejectedCandidateAnswerOverlap(candidate026, question026, translation026).length > 0);
  assert.equal(candidate026.answerOverlapDisposition.limitationClass, "negated-or-warning");

  const fallback202 = records.find((record) => record.questionId === "b-fallback-202");
  const candidate202 = fallback202.placements[0].fallbackEvidence.candidatesReviewed.find((candidate) => candidate.outcome === "rejected");
  assert.equal(candidate202.answerOverlapDisposition.limitationClass, "incomplete-proposition");
  assert.match(candidate202.answerOverlapDisposition.limitationRu, /более чем двумя путями/u);

  const undisposed = structuredClone(records);
  const undisposedCandidate = undisposed.find((record) => record.questionId === "b-fallback-026")
    .placements[0].fallbackEvidence.candidatesReviewed.find((candidate) => candidate.outcome === "rejected");
  delete undisposedCandidate.answerOverlapDisposition;
  assert.ok(validate(undisposed).errors.some((error) => error.includes("lacks a reviewed not-self-sufficient disposition")));

  const staleEvidence = structuredClone(evidence);
  staleEvidence.contradictionAudit.reclassifiedAnswerBearingIds = [];
  assert.ok(validate(records, staleEvidence).errors.some((error) => error.includes("contradiction-audit evidence is stale")));
});

test("F038-RA-005 seals exact answer-bearing anchors for tickets 390, 422, and 430", () => {
  const expected = {
    "b-fallback-390": {
      topicRouteId: "adverse-weather-and-visibility",
      pageId: "ch3-adverse-conditions",
      anchorText: "Включать ближний свет и использовать стеклоочистители и обдув, чтобы сохранять обзор."
    },
    "b-fallback-422": {
      topicRouteId: "occupant-protection",
      pageId: "app3-safety-elements",
      anchorText: "Нижняя лямка должна лежать на костях таза, ниже живота."
    },
    "b-fallback-430": {
      topicRouteId: "right-of-way-special-situations",
      pageId: "ch3-right-of-way",
      anchorText: "На уклоне, где ширина дороги не позволяет двум транспортным средствам двигаться одновременно, приоритет у поднимающегося. Исключение: спускающийся сочлененный транспорт, например грузовик с прицепом или автомобиль с trailer. Для спуска рекомендуется низкая передача, первая или вторая."
    }
  };

  for (const [questionId, fixture] of Object.entries(expected)) {
    const record = records.find((entry) => entry.questionId === questionId);
    assert.equal(record.topicRouteId, fixture.topicRouteId);
    assert.equal(record.placements[0].pageId, fixture.pageId);
    assert.equal(record.placements[0].placementBasis, "answer-bearing");
    assert.equal(record.placements[0].anchorTextAtReview, fixture.anchorText);
    assert.equal(record.placements[0].contradictionReview.auditId, `F038-RA-005-${questionId}`);
  }

  for (const [questionId, wrongAnchor] of [
    ["b-fallback-390", records.find((entry) => entry.questionId === "b-fallback-349").placements[0].anchor],
    ["b-fallback-422", {
      kind: "manual-term-translation",
      blockId: "seatbelt-source-visual",
      termEs: "Si se coloca sobre el abdomen",
      textPath: "cards.0.termTranslations.4.translationRu",
      textFingerprint: "327817b11ee61306339f9ae413b7cf0789c0a0efec9796ec80d76980815723b7"
    }],
    ["b-fallback-430", {
      kind: "manual-list-item",
      blockId: "uncontrolled-intersections",
      itemIndex: 2,
      textPath: "itemsRu",
      textFingerprint: "1146ef8cd25e8399c58458782941208f9594babb8aef2a0a10962a811035c709"
    }]
  ]) {
    const fixture = structuredClone(records);
    fixture.find((entry) => entry.questionId === questionId).placements[0].anchor = structuredClone(wrongAnchor);
    assert.ok(validate(fixture).errors.some((error) =>
      error.includes("F038-RA-005 exact semantic anchor invariant failed")
    ));
  }
});

test("lean runtime projection is exact, minimal, ordered, and behaviorally equal to reviewed shards", () => {
  assert.deepEqual(runtimeProjection, buildManualTicketRuntimeProjection(records));
  assert.deepEqual(validateManualTicketRuntimeProjection(records, runtimeProjection), []);

  const reviewedLookup = new Map();
  for (const record of records) {
    for (const placement of record.placements) {
      const questionIds = reviewedLookup.get(placement.pageId) ?? [];
      questionIds.push(record.questionId);
      reviewedLookup.set(placement.pageId, questionIds);
    }
  }
  for (const questionIds of reviewedLookup.values()) questionIds.sort();

  const runtimeLookup = new Map();
  for (const record of runtimeProjection.records) {
    for (const pageId of record.pageIds) {
      const questionIds = runtimeLookup.get(pageId) ?? [];
      questionIds.push(record.questionId);
      runtimeLookup.set(pageId, questionIds);
    }
  }
  for (const questionIds of runtimeLookup.values()) questionIds.sort();
  assert.deepEqual(runtimeLookup, reviewedLookup);
});

test("validator rejects stale, reordered, duplicate, incomplete, and governance-heavy runtime projections", () => {
  const missing = structuredClone(runtimeProjection);
  missing.records.pop();
  assert.ok(validate(records, undefined, reviewedManifest, topicRoutes, ticketTopicAssignments, missing).errors.some(
    (error) => error.includes("runtime projection is stale")
  ));

  const reordered = structuredClone(runtimeProjection);
  reordered.records.reverse();
  assert.ok(validate(records, undefined, reviewedManifest, topicRoutes, ticketTopicAssignments, reordered).errors.some(
    (error) => error.includes("runtime projection is stale")
  ));

  const duplicate = structuredClone(runtimeProjection);
  duplicate.records[0].pageIds.push(duplicate.records[0].pageIds[0]);
  assert.ok(validate(records, undefined, reviewedManifest, topicRoutes, ticketTopicAssignments, duplicate).errors.some(
    (error) => error.includes("sorted and duplicate-free")
  ));

  const extra = structuredClone(runtimeProjection);
  extra.records[0].review = { status: "approved" };
  assert.ok(validate(records, undefined, reviewedManifest, topicRoutes, ticketTopicAssignments, extra).errors.some(
    (error) => error.includes("non-allowlisted fields")
  ));
});

test("runtime source appends tickets after existing page flows and keeps canonical joins", () => {
  const appSource = readFileSync("src/App.tsx", "utf8");
  const runtimeSource = readFileSync("src/data/manualTicketPlacement.ts", "utf8");
  assert.match(appSource, /<CanonicalStudyTicketBlock questionId=\{ticket\.questionId\} topicTicket=\{ticket\} testIdPrefix="materials-ticket"/u);
  assert.match(appSource, /<ManualTicketAppendix pageId="intro-road-pandemic" \/>/u);
  assert.match(appSource, /<ManualTicketAppendix pageId=\{section\.id\} \/>/u);
  assert.match(appSource, /<ManualTicketAppendix pageId=\{content\.sectionId\} \/>/u);
  assert.match(appSource, /expanded && <div className="manual-ticket-list">/u);
  assert.match(runtimeSource, /questionIds\.sort\(\(left, right\) => left\.localeCompare\(right\)\)/u);
  assert.match(runtimeSource, /manual-ticket-placement\.runtime\.json/u);
  assert.doesNotMatch(runtimeSource, /manual-ticket-placement\/placements\//u);
  assert.doesNotMatch(runtimeSource, /officialTextEs|questionTextRu|correctAnswerId/u);
});

test("clean production bundle excludes manual-placement review and audit markers", async () => {
  const outDir = mkdtempSync(join(tmpdir(), "cabadrive-manual-ticket-runtime-"));
  try {
    await build({
      root,
      logLevel: "silent",
      build: {
        outDir,
        emptyOutDir: true
      }
    });
    const entryChunks = readdirSync(join(outDir, "assets"))
      .filter((name) => /^index-.*\.js$/u.test(name))
      .map((name) => readFileSync(join(outDir, "assets", name), "utf8"))
      .join("\n");
    for (const marker of [
      "auditConclusionRu",
      "selectionRationaleRu",
      "searchedConcepts",
      "candidatesReviewed",
      "contradictionReview"
    ]) {
      assert.doesNotMatch(entryChunks, new RegExp(marker, "u"));
    }
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});
