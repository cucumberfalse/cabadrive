import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  loadManualCorpus,
  loadShardEntries,
  readJson,
  validatePlacementData
} from "../scripts/manual-ticket-placement-lib.mjs";

const root = resolve(".");
const questions = readJson("content/questions/caba-b.unofficial-fallback.questions.json");
const translations = loadShardEntries(root, "content/translations/ru");
const pageInventory = readJson("content/manual-ticket-placement/manual-pages.json");
const baseline = readJson("content/manual-ticket-placement/manual-content-baseline.json");
const records = loadShardEntries(root, "content/manual-ticket-placement/placements");
const evidence = readJson("content/validation/manual-ticket-placement.evidence.json");
const corpus = await loadManualCorpus(root);

function validate(candidateRecords, candidateEvidence = undefined) {
  return validatePlacementData({
    root,
    corpus,
    questions,
    translations,
    pageInventory,
    baseline,
    records: candidateRecords,
    evidence: candidateEvidence
  });
}

test("manual ticket placement covers the canonical bank and reports fallbacks separately", () => {
  const result = validate(records, evidence);
  assert.deepEqual(result.errors, []);
  assert.equal(result.summary.canonicalQuestionCount, 460);
  assert.equal(result.summary.placementRelationCount, 460);
  assert.equal(result.summary.answerBearingPlacementCount, 458);
  assert.deepEqual(
    result.summary.ownerApprovedThematicFallbacks.map(({ questionId, auditId, pageId }) => ({ questionId, auditId, pageId })),
    [
      { questionId: "b-fallback-126", auditId: "F038-IA-002", pageId: "app1-safety-elements" },
      { questionId: "b-fallback-235", auditId: "F038-IA-001", pageId: "ch2-incident-obligations" }
    ]
  );
});

test("validator rejects missing fallback audit and support-page placement", () => {
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

test("validator rejects stale anchors, canonical evidence, and approved fallback drift", () => {
  const staleAnchor = structuredClone(records);
  staleAnchor[0].placements[0].anchor.textFingerprint = "0".repeat(64);
  assert.ok(validate(staleAnchor).errors.some((error) => error.includes("stale anchor fingerprint")));

  const staleCanonical = structuredClone(records);
  staleCanonical[0].canonicalEvidence.questionFingerprint = "0".repeat(64);
  assert.ok(validate(staleCanonical).errors.some((error) => error.includes("stale canonical evidence")));

  const alternateFallback = structuredClone(records);
  const fallback126 = alternateFallback.find((record) => record.questionId === "b-fallback-126");
  fallback126.placements[0].pageId = "ch5-anticipatory-efficient-driving";
  assert.ok(validate(alternateFallback).errors.some((error) => error.includes("malformed or unauthorized thematic fallback")));
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
