import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  createPageInventory,
  createPlacementCandidates,
  loadManualCorpus,
  loadShardEntries,
  readJson,
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
const corpus = await loadManualCorpus(root);

function validate(
  candidateRecords,
  candidateEvidence = undefined,
  candidateManifest = reviewedManifest,
  candidateRoutes = topicRoutes,
  candidateAssignments = ticketTopicAssignments
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
    ticketTopicAssignments: candidateAssignments
  });
}

test("reviewed manual placement covers all tickets through sealed curated topic routes", () => {
  const result = validate(records, evidence);
  assert.deepEqual(result.errors, []);
  assert.equal(result.summary.canonicalQuestionCount, 460);
  assert.equal(result.summary.placementRelationCount, 460);
  assert.deepEqual(result.summary.questionsByPlacementCount, { 1: 460, 2: 0, 3: 0 });
  assert.equal(result.summary.answerBearingPlacementCount, 0);
  assert.equal(result.summary.ownerApprovedThematicFallbacks.length, 460);
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
  unsupportedStrict[0].placements[0].placementBasis = "answer-bearing";
  delete unsupportedStrict[0].placements[0].fallbackEvidence;
  delete unsupportedStrict[0].placements[0].thematicBasisRu;
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

test("validator rejects fallback pages or anchors outside the reviewed route", () => {
  const wrongPage = structuredClone(records);
  const lights = wrongPage.find((record) => record.questionId === "b-fallback-349");
  lights.placements[0].pageId = "app1-safety-elements";
  lights.placements[0].routeHash = "#manual-section-app1-safety-elements";
  assert.ok(validate(wrongPage).errors.some((error) => error.includes("outside its reviewed curated route")));

  const wrongAnchor = structuredClone(records);
  const fatigue = wrongAnchor.find((record) => record.questionId === "b-fallback-404");
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
    "b-fallback-003": ["emergency-response-and-crash-scene", "ch2-incident-obligations"],
    "b-fallback-011": ["warning-signs", "app4-signs-warning"],
    "b-fallback-037": ["bicycles-and-micromobility", "ch1-bicycle"],
    "b-fallback-042": ["public-transport-and-exclusive-lanes", "ch1-public-transport-system"],
    "b-fallback-064": ["mirrors-blind-spots-and-visibility", "app1-safety-elements"],
    "b-fallback-085": ["right-of-way-basic-intersections", "ch3-right-of-way"],
    "b-fallback-096": ["emergency-response-and-crash-scene", "ch2-incident-obligations"],
    "b-fallback-165": ["lane-choice-and-lane-changes", "ch3-highways"],
    "b-fallback-202": ["warning-signs", "app4-signs-warning"],
    "b-fallback-281": ["right-of-way-basic-intersections", "ch3-right-of-way"],
    "b-fallback-323": ["occupant-protection", "app1-safety-elements"],
    "b-fallback-349": ["vehicle-lights-and-signaling", "ch3-lights"],
    "b-fallback-350": ["driver-hand-signals", "ch1-bicycle"],
    "b-fallback-404": ["fatigue-distraction-and-attention", "ch4-sleep-fatigue"],
    "b-fallback-431": ["alcohol-drugs-and-impairment", "ch4-alcohol-drugs"],
    "b-fallback-454": ["occupant-protection", "app1-safety-elements"]
  };
  const assignmentById = new Map(ticketTopicAssignments.entries.map((entry) => [entry.questionId, entry]));
  const recordById = new Map(records.map((record) => [record.questionId, record]));
  for (const [questionId, [topicRouteId, pageId]] of Object.entries(expected)) {
    const record = recordById.get(questionId);
    assert.equal(assignmentById.get(questionId).topicRouteId, topicRouteId);
    assert.equal(record.topicRouteId, topicRouteId);
    assert.equal(record.placements[0].pageId, pageId);
    assert.equal(record.placements[0].placementBasis, "owner-approved-thematic-fallback");
  }
});

test("known false mappings 003, 011, and 042 cannot return", () => {
  const current003 = records.find((record) => record.questionId === "b-fallback-003").placements[0];
  const current011 = records.find((record) => record.questionId === "b-fallback-011").placements[0];
  const current042 = records.find((record) => record.questionId === "b-fallback-042").placements[0];
  assert.equal(current003.pageId, "ch2-incident-obligations");
  assert.equal(current011.pageId, "app4-signs-warning");
  assert.equal(current011.placementBasis, "owner-approved-thematic-fallback");
  assert.equal(current042.pageId, "ch1-public-transport-system");

  const restored = structuredClone(records);
  const record003 = restored.find((record) => record.questionId === "b-fallback-003");
  record003.placements[0].pageId = "app1-other-required-safety-elements";
  record003.placements[0].anchor.blockId = "extinguisher";
  assert.ok(validate(restored).errors.some((error) => error.includes("known false mapping fixture was restored")));
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
  assert.doesNotMatch(runtimeSource, /officialTextEs|questionTextRu|correctAnswerId/u);
});
