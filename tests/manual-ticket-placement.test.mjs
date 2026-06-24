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
const corpus = await loadManualCorpus(root);

function validate(candidateRecords, candidateEvidence = undefined, candidateManifest = reviewedManifest) {
  return validatePlacementData({
    root,
    corpus,
    questions,
    translations,
    pageInventory,
    baseline,
    records: candidateRecords,
    evidence: candidateEvidence,
    reviewedManifest: candidateManifest
  });
}

test("reviewed manual placement covers all tickets and reports audit-derived fallbacks", () => {
  const result = validate(records, evidence);
  assert.deepEqual(result.errors, []);
  assert.equal(result.summary.canonicalQuestionCount, 460);
  assert.equal(result.summary.placementRelationCount, 460);
  assert.deepEqual(result.summary.questionsByPlacementCount, { 1: 460, 2: 0, 3: 0 });
  assert.equal(result.summary.answerBearingPlacementCount, 71);
  assert.equal(result.summary.ownerApprovedThematicFallbacks.length, 389);
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
  assert.doesNotMatch(serialized, /placementBasis|answerBasisRu|reviewedBy|reviewedAt/u);

  const generatorSource = readFileSync("scripts/content-manual-ticket-placement.mjs", "utf8");
  assert.doesNotMatch(generatorSource, /createPlacements|placementShardRoot|shardRecords/u);
  assert.match(generatorSource, /Candidate-only lexical\/topic aid/u);
});

test("validator rejects missing, stale, or synthetic reviewed-manifest evidence", () => {
  assert.ok(validate(records, undefined, null).errors.some((error) => error.includes("Reviewed manifest is missing")));

  const staleManifest = structuredClone(reviewedManifest);
  staleManifest.records[0].fingerprint = "0".repeat(64);
  assert.ok(validate(records, undefined, staleManifest).errors.some((error) => error.includes("reviewed source differs")));

  const syntheticManifest = structuredClone(reviewedManifest);
  syntheticManifest.sealedBy = "placement-generator";
  assert.ok(validate(records, undefined, syntheticManifest).errors.some((error) => error.includes("reserved or synthetic reviewer")));
});

test("validator rejects generic rationale, synthetic reviewer, and stale exact anchors", () => {
  const generic = structuredClone(records);
  const answerBearing = generic.find((record) => record.placements[0].placementBasis === "answer-bearing");
  answerBearing.placements[0].answerBasisRu =
    "Якорь страницы прямо фиксирует правило, значение или условие, по которому выбирается канонический правильный ответ.";
  assert.ok(validate(generic).errors.some((error) => error.includes("generic or missing answer-bearing rationale")));

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
  delete fallback126.placements[0].fallbackEvidence.candidatesReviewed;
  assert.ok(validate(missingAudit).errors.some((error) => error.includes("malformed or unauthorized thematic fallback")));

  const supportPage = structuredClone(records);
  const fallback235 = supportPage.find((record) => record.questionId === "b-fallback-235");
  fallback235.placements[0].pageId = "front-glossary";
  fallback235.placements[0].routeHash = "#manual-section-front-glossary";
  assert.ok(validate(supportPage).errors.some((error) => error.includes("ineligible destination front-glossary")));
});

test("known false mappings 003, 011, and 042 are corrected and cannot return", () => {
  const current003 = records.find((record) => record.questionId === "b-fallback-003").placements[0];
  const current011 = records.find((record) => record.questionId === "b-fallback-011").placements[0];
  const current042 = records.find((record) => record.questionId === "b-fallback-042").placements[0];
  assert.equal(current003.pageId, "ch2-incident-obligations");
  assert.equal(current011.pageId, "app4-signs-informational");
  assert.equal(current011.placementBasis, "owner-approved-thematic-fallback");
  assert.equal(current042.pageId, "app4-signs-informational");
  assert.equal(current042.anchorTextAtReview, "автовокзал");

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
