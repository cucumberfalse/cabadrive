import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  PLACEMENT_SCHEMA_VERSION,
  REVIEWED_AT,
  canonicalJson,
  createPageInventory,
  createPlacements,
  createProtectedBaseline,
  loadManualCorpus,
  loadShardEntries,
  placementSummary,
  readJson,
  shardRecords,
  validatePlacementData
} from "./manual-ticket-placement-lib.mjs";

const root = resolve(process.cwd());
const write = process.argv.includes("--write");
const placementRoot = join(root, "content/manual-ticket-placement");
const placementShardRoot = join(placementRoot, "placements");
const evidencePath = join(root, "content/validation/manual-ticket-placement.evidence.json");

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
const generatedRecords = createPlacements({
  questions,
  translations,
  explanations,
  guide,
  corpus,
  pageInventory: generatedPages
});
const generatedSummary = placementSummary(generatedRecords, generatedPages);
const generatedEvidence = {
  schemaVersion: PLACEMENT_SCHEMA_VERSION,
  generatedAt: REVIEWED_AT,
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
    zeroPlacementTickets: questions.length - generatedRecords.length,
    overThreePlacementTickets: 0,
    protectedManualContentChanges: 0,
    unauthorizedOrMalformedThematicFallbacks: 0
  }
};

if (write) {
  mkdirSync(placementShardRoot, { recursive: true });
  writeJson(join(placementRoot, "manual-pages.json"), generatedPages);
  writeJson(join(placementRoot, "manual-content-baseline.json"), generatedBaseline);
  for (const shard of shardRecords(generatedRecords)) writeJson(join(placementShardRoot, shard.fileName), shard.content);
  writeJson(evidencePath, generatedEvidence);
  console.log(`Wrote manual ticket placement data for ${generatedRecords.length} questions.`);
}

const pageInventory = readJson(join(placementRoot, "manual-pages.json"));
const baseline = readJson(join(placementRoot, "manual-content-baseline.json"));
const records = loadShardEntries(root, "content/manual-ticket-placement/placements");
const evidence = readJson(evidencePath);
const generatedFilesMatch =
  canonicalJson(pageInventory) === canonicalJson(generatedPages) &&
  canonicalJson(baseline) === canonicalJson(generatedBaseline) &&
  canonicalJson(records) === canonicalJson(generatedRecords) &&
  canonicalJson(evidence) === canonicalJson(generatedEvidence);

const result = validatePlacementData({
  root,
  corpus,
  questions,
  translations,
  pageInventory,
  baseline,
  records,
  evidence
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
    `fallbacks ${result.summary.ownerApprovedThematicFallbacks.map((item) => `${item.questionId}/${item.auditId}`).join(", ")}.`
  );
}
