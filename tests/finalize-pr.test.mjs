import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  collectBlockingFindings,
  evaluateFinalizationGates,
  normalizeCheckState,
  readProcessEvidence
} from "../scripts/finalize-pr.mjs";

const requiredChecks = JSON.parse(readFileSync(".unicorn-hub/config.json", "utf8")).requiredChecks;

function successfulInput(overrides = {}) {
  return {
    prIdentifier: "12",
    pr: {
      number: 12,
      headSha: "abc123",
      isDraft: false,
      mergeable: "MERGEABLE",
      mergeStateStatus: "CLEAN"
    },
    requiredChecks,
    checks: requiredChecks.map((name) => ({ name, status: "COMPLETED", conclusion: "SUCCESS" })),
    reviewThreads: [],
    blockingFindings: [],
    processEvidence: {
      finalArchitectValidation: true,
      finalAnalystValidation: true,
      finalValidationOrder: true,
      acceptanceEvidence: true,
      currentProcessMemory: true,
      feedbackDisposition: true,
      currentHeadGuardEvidence: true,
      acceptedKnownIssueDecisionPending: false
    },
    ...overrides
  };
}

test("finalization gate passes only with current head, green required checks, and process evidence", () => {
  const result = evaluateFinalizationGates(successfulInput({ suppliedHeadSha: "abc123" }));

  assert.equal(result.ready, true);
  assert.equal(result.action, "merge");
  assert.deepEqual(result.blockers, []);
});

test("required checks are sourced from .unicorn-hub config and missing checks block", () => {
  const checks = requiredChecks
    .filter((name) => name !== "AI Review")
    .map((name) => ({ name, status: "COMPLETED", conclusion: "SUCCESS" }));

  const result = evaluateFinalizationGates(successfulInput({ checks }));

  assert.equal(result.action, "block");
  assert.ok(result.blockers.some((blocker) =>
    blocker.code === "missing-required-check" &&
    blocker.message.includes("AI Review")
  ));
});

test("stale head, draft PRs, and conflicts block finalization", () => {
  const result = evaluateFinalizationGates(successfulInput({
    suppliedHeadSha: "oldsha",
    pr: {
      number: 12,
      headSha: "abc123",
      isDraft: true,
      mergeable: "CONFLICTING",
      mergeStateStatus: "DIRTY"
    }
  }));

  assert.ok(result.blockers.some((blocker) => blocker.code === "stale-head"));
  assert.ok(result.blockers.some((blocker) => blocker.code === "draft-pr"));
  assert.ok(result.blockers.some((blocker) => blocker.code === "merge-conflict"));
  assert.ok(result.blockers.some((blocker) => blocker.code === "merge-state"));
});

test("mutating finalization requires an explicit expected head", () => {
  const missingExpectedHead = evaluateFinalizationGates(successfulInput({
    requireExpectedHead: true
  }));
  assert.equal(missingExpectedHead.action, "block");
  assert.ok(missingExpectedHead.blockers.some((blocker) => blocker.code === "missing-expected-head"));

  const suppliedExpectedHead = evaluateFinalizationGates(successfulInput({
    requireExpectedHead: true,
    suppliedHeadSha: "abc123"
  }));
  assert.equal(suppliedExpectedHead.ready, true);
  assert.equal(suppliedExpectedHead.action, "merge");
});

test("pending required checks block by default", () => {
  const checks = requiredChecks.map((name) => ({
    name,
    status: name === "guard" ? "IN_PROGRESS" : "COMPLETED",
    conclusion: name === "guard" ? null : "SUCCESS"
  }));

  const result = evaluateFinalizationGates(successfulInput({ checks }));

  assert.equal(result.action, "block");
  assert.deepEqual(result.pendingChecks, ["guard"]);
  assert.ok(result.blockers.some((blocker) => blocker.code === "pending-required-check"));
});

test("pending required checks may enable protected auto-merge only with explicit flag", () => {
  const checks = requiredChecks.map((name) => ({
    name,
    status: name === "guard" ? "QUEUED" : "COMPLETED",
    conclusion: name === "guard" ? null : "SUCCESS"
  }));

  const result = evaluateFinalizationGates(successfulInput({
    autoMergePending: true,
    checks,
    pr: {
      number: 12,
      headSha: "abc123",
      isDraft: false,
      mergeable: "MERGEABLE",
      mergeStateStatus: "BLOCKED"
    }
  }));

  assert.equal(result.ready, false);
  assert.equal(result.action, "enable-auto-merge");
  assert.deepEqual(result.blockers, []);
  assert.deepEqual(result.pendingChecks, ["guard"]);
});

test("unresolved review state and blocking findings block finalization", () => {
  const result = evaluateFinalizationGates(successfulInput({
    reviewThreads: [{ isResolved: false, comments: [] }],
    blockingFindings: [{ message: "Unresolved Codex P1 finding remains." }]
  }));

  assert.ok(result.blockers.some((blocker) => blocker.code === "unresolved-review-thread"));
  assert.ok(result.blockers.some((blocker) => blocker.code === "blocking-review-finding"));
});

test("missing final validation and process evidence block finalization", () => {
  const result = evaluateFinalizationGates(successfulInput({
    processEvidence: {
      finalArchitectValidation: false,
      finalAnalystValidation: false,
      finalValidationOrder: false,
      acceptanceEvidence: false,
      currentProcessMemory: false,
      feedbackDisposition: false,
      currentHeadGuardEvidence: false,
      acceptedKnownIssueDecisionPending: true
    }
  }));

  assert.ok(result.blockers.some((blocker) => blocker.code === "missing-architect-validation"));
  assert.ok(result.blockers.some((blocker) => blocker.code === "missing-analyst-validation"));
  assert.ok(result.blockers.some((blocker) => blocker.code === "missing-acceptance-evidence"));
  assert.ok(result.blockers.some((blocker) => blocker.code === "human-known-issue-decision"));
});

test("blocking review finding collection detects current-head blocker signals", () => {
  const headSha = "abc1234";
  const findings = collectBlockingFindings({
    headSha,
    config: { trustedReviewLoginsByAgent: { codex: ["codex-bot"], claude: ["claude-bot"] } },
    reviewThreads: [{
      isResolved: false,
      comments: [{ body: "[P2] Fix this before merge", author: { login: "codex-bot" } }]
    }],
    reviews: [{
      state: "CHANGES_REQUESTED",
      body: "",
      author: { login: "reviewer" },
      commit: { oid: headSha }
    }],
    issueComments: [{
      body: `AI_REVIEW_AGENT: claude\nAI_REVIEW_SHA: ${headSha}\nAI_REVIEW_OUTCOME: block`,
      author: { login: "claude-bot" }
    }]
  });

  assert.equal(findings.length, 3);
});

test("skipped or neutral required checks are not treated as green", () => {
  assert.equal(normalizeCheckState({ status: "COMPLETED", conclusion: "SUCCESS" }), "success");
  assert.equal(normalizeCheckState({ status: "IN_PROGRESS", conclusion: null }), "pending");
  assert.equal(normalizeCheckState({ status: "COMPLETED", conclusion: "ACTION_REQUIRED" }), "failed");
  assert.equal(normalizeCheckState({ status: "COMPLETED", conclusion: "SKIPPED" }), "failed");
  assert.equal(normalizeCheckState({ state: "NEUTRAL" }), "failed");
});

test("process evidence orders final validation by explicit role-owned timestamps", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-"));
  const featurePath = "specs/999-finalize-test";
  const featureRoot = join(root, featurePath);
  mkdirSync(featureRoot, { recursive: true });

  const tasks = `# Tasks

## Decisions
- Decision recorded.

## Dead Ends
- None.

## Known Issues
- None.

## Implementation Agent Feedback
- None yet.

## Verification Evidence
- current-PR-head guard evidence recorded by the helper's match-head-commit check.
`;

  writeFileSync(join(featureRoot, "feature-request.md"), `# Feature Request

## Final Analyst Validation Notes
- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-10T13:00:01Z
`);
  writeFileSync(join(featureRoot, "spec.md"), `# Specification

## Final Architect Validation Notes
- Architect validation pass: passed
- Final Architect validation completed at: 2026-05-10T13:00:00Z
`);
  writeFileSync(join(featureRoot, "plan.md"), "");
  writeFileSync(join(featureRoot, "tasks.md"), tasks);

  const ordered = readProcessEvidence(root, featurePath, "abc123def456");
  assert.equal(ordered.finalArchitectValidation, true);
  assert.equal(ordered.finalAnalystValidation, true);
  assert.equal(ordered.finalValidationOrder, true);

  writeFileSync(join(featureRoot, "spec.md"), `# Specification

## Final Architect Validation Notes
- Architect validation pass: passed
- Final Architect validation completed at: 2026-05-10T13:00:02Z
`);
  assert.equal(readProcessEvidence(root, featurePath, "abc123def456").finalValidationOrder, false);

  writeFileSync(join(featureRoot, "feature-request.md"), `# Feature Request

## Final Analyst Validation Notes
- Analyst validation pass: passed
`);
  writeFileSync(join(featureRoot, "spec.md"), `# Specification

## Final Architect Validation Notes
- Architect validation pass: passed
`);
  const missingMarkers = readProcessEvidence(root, featurePath, "abc123def456");
  assert.equal(missingMarkers.finalArchitectValidation, true);
  assert.equal(missingMarkers.finalAnalystValidation, true);
  assert.equal(missingMarkers.finalValidationOrder, false);
});

test("process evidence accepts current-head guard marker without head SHA", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-"));
  const featurePath = "specs/999-finalize-test";
  const featureRoot = join(root, featurePath);
  mkdirSync(featureRoot, { recursive: true });
  writeFileSync(join(featureRoot, "feature-request.md"), `Analyst validation pass: passed
Final Analyst validation completed at: 2026-05-10T13:00:01Z
`);
  writeFileSync(join(featureRoot, "spec.md"), `Architect validation pass: passed
Final Architect validation completed at: 2026-05-10T13:00:00Z
`);
  writeFileSync(join(featureRoot, "plan.md"), "");

  const baseTasks = `# Tasks

## Decisions
- Decision recorded.

## Dead Ends
- None.

## Known Issues
- None.

## Implementation Agent Feedback
`;
  const evidenceTasks = `
## Verification Evidence
- current-PR-head guard evidence recorded by the helper's match-head-commit check.
`;

  writeFileSync(join(featureRoot, "tasks.md"), `${baseTasks}- None yet.\n${evidenceTasks}`);
  const evidenceWithoutHeadSha = readProcessEvidence(root, featurePath, "abc123def456");
  assert.equal(evidenceWithoutHeadSha.feedbackDisposition, true);
  assert.equal(evidenceWithoutHeadSha.currentHeadGuardEvidence, true);

  writeFileSync(join(featureRoot, "tasks.md"), `${baseTasks}- None yet.
- Follow-up concern needs Architect review.
${evidenceTasks}`);
  assert.equal(readProcessEvidence(root, featurePath, "abc123def456").feedbackDisposition, false);

  writeFileSync(join(featureRoot, "tasks.md"), `${baseTasks}- Follow-up concern needs Architect review.
- Architect disposition: not needed because covered by existing task.
${evidenceTasks}`);
  assert.equal(readProcessEvidence(root, featurePath, "abc123def456").feedbackDisposition, true);

  writeFileSync(join(featureRoot, "tasks.md"), `${baseTasks}- None yet.

## Verification Evidence
- Required checks passed.
`);
  assert.equal(readProcessEvidence(root, featurePath, "abc123def456").currentHeadGuardEvidence, false);
});
