import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  PLACEMENT_SCHEMA_VERSION,
  GENERATED_AT,
  canonicalJson,
  createPageInventory,
  createPlacementCandidates,
  createProtectedBaseline,
  loadManualCorpus,
  loadShardEntries,
  placementSummary,
  readJson,
  validatePlacementData
} from "./manual-ticket-placement-lib.mjs";

const root = resolve(process.cwd());
const write = process.argv.includes("--write");
const candidatesOnly = process.argv.includes("--candidates");
const placementRoot = join(root, "content/manual-ticket-placement");
const evidencePath = join(root, "content/validation/manual-ticket-placement.evidence.json");
const reviewedManifestPath = join(placementRoot, "reviewed-manifest.json");
const topicRoutesPath = join(placementRoot, "topic-routes.json");
const ticketTopicAssignmentsPath = join(placementRoot, "ticket-topic-assignments.json");

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

const questions = readJson(join(root, "content/questions/caba-b.unofficial-fallback.questions.json"));
const translations = loadShardEntries(root, "content/translations/ru");
const explanations = loadShardEntries(root, "content/explanations/ru");
const guide = readJson(join(root, "content/guide/topic-study-guide.ru.json"));
const corpus = await loadManualCorpus(root);
const generatedPages = createPageInventory(corpus);
const generatedBaseline = createProtectedBaseline(root, generatedPages, corpus);
if (candidatesOnly) {
  const candidates = createPlacementCandidates({
    questions,
    translations,
    explanations,
    guide,
    corpus,
    pageInventory: generatedPages
  });
  console.log(JSON.stringify({
    warning: "Candidate-only lexical/topic aid. It has no approval authority and is never committed as reviewed placement source.",
    candidates
  }, null, 2));
  process.exit(0);
}

const records = loadShardEntries(root, "content/manual-ticket-placement/placements");
const topicRoutes = readJson(topicRoutesPath);
const ticketTopicAssignments = readJson(ticketTopicAssignmentsPath);
const generatedSummary = placementSummary(records, generatedPages);
const generatedEvidence = {
  schemaVersion: PLACEMENT_SCHEMA_VERSION,
  generatedAt: GENERATED_AT,
  summary: generatedSummary,
  counters: {
    unknownTickets: 0,
    unknownPages: 0,
    routeMismatches: 0,
    ineligiblePlacements: 0,
    missingOrAmbiguousAnchors: 0,
    staleCanonicalFingerprints: 0,
    staleAnchorOrPageFingerprints: 0,
    duplicateSamePagePlacements: 0,
    unreviewedRecords: 0,
    zeroPlacementTickets: questions.length - records.length,
    overThreePlacementTickets: 0,
    protectedManualContentChanges: 0,
    unauthorizedOrMalformedThematicFallbacks: 0,
    missingOrStaleTopicRoutes: 0,
    missingOrStaleTicketTopicAssignments: 0,
    strictWithoutDirectAnswerEvidence: 0,
    fallbackOutsideCuratedRoute: 0,
    unreviewedTicketOverrides: 0,
    incompleteFallbackLedgers: 0,
    staleFallbackCandidateEvidence: 0,
    selectedCandidateMismatches: 0,
    ticketSpecificInvariantFailures: 0
  }
};

if (write) {
  writeJson(join(placementRoot, "manual-pages.json"), generatedPages);
  writeJson(join(placementRoot, "manual-content-baseline.json"), generatedBaseline);
  writeJson(evidencePath, generatedEvidence);
  console.log(`Refreshed derived manual ticket placement data for ${records.length} immutable reviewed records.`);
}

const pageInventory = readJson(join(placementRoot, "manual-pages.json"));
const baseline = readJson(join(placementRoot, "manual-content-baseline.json"));
const evidence = readJson(evidencePath);
const reviewedManifest = readJson(reviewedManifestPath);
const generatedFilesMatch =
  canonicalJson(pageInventory) === canonicalJson(generatedPages) &&
  canonicalJson(baseline) === canonicalJson(generatedBaseline) &&
  canonicalJson(evidence) === canonicalJson(generatedEvidence);

const result = validatePlacementData({
  root,
  corpus,
  questions,
  translations,
  pageInventory,
  baseline,
  records,
  evidence,
  reviewedManifest,
  topicRoutes,
  ticketTopicAssignments
});
if (!generatedFilesMatch) result.errors.push("Generated manual ticket placement files are stale; run pnpm run generate:manual-ticket-placement.");

if (result.errors.length > 0) {
  console.error(result.errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Manual ticket placement valid: ${result.summary.canonicalQuestionCount} questions, ` +
    `${result.summary.placementRelationCount} placements, ${result.summary.destinationRouteCount} destination routes, ` +
    `density ${result.summary.density.minimum}/${result.summary.density.median}/${result.summary.density.maximum}, ` +
    `answer-bearing ${result.summary.answerBearingPlacementCount}, ` +
    `fallbacks ${result.summary.ownerApprovedThematicFallbacks.length} ` +
    `(IDs in content/validation/manual-ticket-placement.evidence.json).`
  );
}
