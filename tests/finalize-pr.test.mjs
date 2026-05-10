import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  collectBlockingFindings,
  collectPaginationFindings,
  evaluatePostEffectiveHeadChangedFiles,
  evaluateFinalizationGates,
  hasImplementationFeedbackDisposition,
  isFinalValidationEvidencePath,
  normalizeCheckState,
  readProcessEvidence,
  readProcessEvidenceFromHead,
  verifyPostEffectiveHeadChanges
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
      effectiveContentHead: "abc123",
      postEffectiveHeadEvidenceOnly: true,
      currentHeadGuardEvidence: true,
      acceptedKnownIssueDecisionPending: false
    },
    ...overrides
  };
}

function git(root, args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function initGitRepo(root) {
  git(root, ["init", "-q"]);
  git(root, ["config", "user.email", "test@example.com"]);
  git(root, ["config", "user.name", "Finalize Test"]);
}

function writeMinimalFeatureMemory(root, featurePath, tasksExtra = "") {
  const featureRoot = join(root, featurePath);
  mkdirSync(featureRoot, { recursive: true });
  writeFileSync(join(featureRoot, "feature-request.md"), `# Feature Request

## Final Analyst Validation Notes
`);
  writeFileSync(join(featureRoot, "spec.md"), `# Specification

## Final Architect Validation Notes
`);
  writeFileSync(join(featureRoot, "plan.md"), `# Plan
`);
  writeFileSync(join(featureRoot, "tasks.md"), `# Tasks

## Task List
- [x] Existing task.

## Decisions
- Existing decision.

## Dead Ends
- None.

## Known Issues
- None.

## Implementation Agent Feedback
- None yet.

## Verification Evidence
- Existing evidence.
${tasksExtra}`);
}

function writeFinalValidationFeatureMemory(root, featurePath, effectiveContentHead, options = {}) {
  const { includeRoleReturnCounts = true, taskOverrides = {} } = options;
  const featureRoot = join(root, featurePath);
  mkdirSync(featureRoot, { recursive: true });
  writeFileSync(join(featureRoot, "feature-request.md"), `# Feature Request

## Final Analyst Validation Notes
- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-10T13:00:01Z
${includeRoleReturnCounts ? "- Analyst return count for this work cycle: 0.\n" : ""}
`);
  writeFileSync(join(featureRoot, "spec.md"), `# Specification

## Final Architect Validation Notes
- Architect validation pass: passed
- Final Architect validation completed at: 2026-05-10T13:00:00Z
${includeRoleReturnCounts ? "- Architect return count for this work cycle: 0.\n" : ""}
`);
  writeFileSync(join(featureRoot, "plan.md"), `# Plan
`);
  writeFileSync(join(featureRoot, "tasks.md"), buildCompleteTasks(effectiveContentHead, taskOverrides));
}

function buildCompleteTasks(effectiveContentHead, overrides = {}) {
  const {
    includeCyclePrSet = true,
    includeArchitectReturnCount = true,
    includeAnalystReturnCount = true,
    includeLimitEscalation = true
  } = overrides;

  return `# Tasks

## Task List
- [x] Existing task.

## Decisions
- Existing decision.
- Effective content head: ${effectiveContentHead}

## Dead Ends
- None.

## Known Issues
- None.

## Implementation Agent Feedback
- None yet.

## Verification Evidence
- Existing evidence.
- current-PR-head guard compared the current PR head with effective content head ${effectiveContentHead.slice(0, 12)} and found only final-validation evidence changes.

${includeCyclePrSet ? `## Cycle PR Set
- Purpose: finalize PR automation; branch: codex/999-finalize-test; PR: #999; head SHA: ${effectiveContentHead}; status: ready for final validation; final-validation inclusion: included.
` : ""}
## Final Validation Evidence
${includeArchitectReturnCount ? "- Architect return count: 0\n" : ""}${includeAnalystReturnCount ? "- Analyst return count: 0\n" : ""}${includeLimitEscalation ? "- Limit escalation: none\n" : ""}`;
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
      effectiveContentHead: null,
      currentHeadGuardEvidence: false,
      acceptedKnownIssueDecisionPending: true
    }
  }));

  assert.ok(result.blockers.some((blocker) => blocker.code === "missing-architect-validation"));
  assert.ok(result.blockers.some((blocker) => blocker.code === "missing-analyst-validation"));
  assert.ok(result.blockers.some((blocker) => blocker.code === "missing-acceptance-evidence"));
  assert.ok(result.blockers.some((blocker) => blocker.code === "missing-effective-content-head"));
  assert.ok(result.blockers.some((blocker) => blocker.code === "human-known-issue-decision"));
});

test("unreadable PR-head process evidence source blocks finalization", () => {
  const result = evaluateFinalizationGates(successfulInput({
    processEvidence: {
      ...successfulInput().processEvidence,
      processEvidenceSourceError: "fatal: bad object abc123"
    }
  }));

  assert.equal(result.action, "block");
  assert.ok(result.blockers.some((blocker) => blocker.code === "unverified-process-evidence"));
});

test("dirty local-only process evidence is ignored when reading from the PR head", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-head-"));
  const featurePath = "specs/999-finalize-test";
  initGitRepo(root);
  writeMinimalFeatureMemory(root, featurePath);
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "pr head without final evidence"]);
  const prHead = git(root, ["rev-parse", "HEAD"]);

  writeFinalValidationFeatureMemory(root, featurePath, prHead);
  const localEvidence = readProcessEvidence(root, featurePath, prHead);
  const headEvidence = readProcessEvidenceFromHead(root, featurePath, prHead);

  assert.equal(localEvidence.finalArchitectValidation, true);
  assert.equal(localEvidence.finalAnalystValidation, true);
  assert.equal(headEvidence.finalArchitectValidation, false);
  assert.equal(headEvidence.finalAnalystValidation, false);

  const result = evaluateFinalizationGates(successfulInput({
    requireExpectedHead: true,
    suppliedHeadSha: prHead,
    pr: {
      number: 12,
      headSha: prHead,
      isDraft: false,
      mergeable: "MERGEABLE",
      mergeStateStatus: "CLEAN"
    },
    processEvidence: headEvidence
  }));

  assert.equal(result.action, "block");
  assert.ok(result.blockers.some((blocker) => blocker.code === "missing-architect-validation"));
  assert.ok(result.blockers.some((blocker) => blocker.code === "missing-analyst-validation"));
});

test("process evidence from a checkout that is not the PR head is ignored", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-head-"));
  const featurePath = "specs/999-finalize-test";
  initGitRepo(root);
  writeMinimalFeatureMemory(root, featurePath);
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "pr head without final evidence"]);
  const prHead = git(root, ["rev-parse", "HEAD"]);

  writeFinalValidationFeatureMemory(root, featurePath, prHead);
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "local checkout evidence"]);
  const localHead = git(root, ["rev-parse", "HEAD"]);
  assert.notEqual(localHead, prHead);

  const localEvidence = readProcessEvidence(root, featurePath, prHead);
  const headEvidence = readProcessEvidenceFromHead(root, featurePath, prHead);

  assert.equal(localEvidence.finalValidationOrder, true);
  assert.equal(headEvidence.finalValidationOrder, false);

  const result = evaluateFinalizationGates(successfulInput({
    requireExpectedHead: true,
    suppliedHeadSha: prHead,
    pr: {
      number: 12,
      headSha: prHead,
      isDraft: false,
      mergeable: "MERGEABLE",
      mergeStateStatus: "CLEAN"
    },
    processEvidence: headEvidence
  }));

  assert.equal(result.action, "block");
  assert.ok(result.blockers.some((blocker) => blocker.code === "missing-validation-order"));
});

test("clean exact PR head process evidence can satisfy merge gates", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-head-"));
  const featurePath = "specs/999-finalize-test";
  initGitRepo(root);
  writeMinimalFeatureMemory(root, featurePath);
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "effective content"]);
  const effectiveContentHead = git(root, ["rev-parse", "HEAD"]);

  writeFinalValidationFeatureMemory(root, featurePath, effectiveContentHead);
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "final validation evidence"]);
  const prHead = git(root, ["rev-parse", "HEAD"]);

  const evidence = {
    ...readProcessEvidenceFromHead(root, featurePath, prHead),
    ...verifyPostEffectiveHeadChanges(root, featurePath, effectiveContentHead, prHead)
  };
  const result = evaluateFinalizationGates(successfulInput({
    requireExpectedHead: true,
    suppliedHeadSha: prHead,
    pr: {
      number: 12,
      headSha: prHead,
      isDraft: false,
      mergeable: "MERGEABLE",
      mergeStateStatus: "CLEAN"
    },
    processEvidence: evidence
  }));

  assert.equal(result.ready, true);
  assert.equal(result.action, "merge");
});

test("post-effective-head non-evidence paths block finalization", () => {
  const effectiveContentHead = "a".repeat(40);
  const currentHead = "b".repeat(40);
  const result = evaluateFinalizationGates(successfulInput({
    pr: {
      number: 12,
      headSha: currentHead,
      isDraft: false,
      mergeable: "MERGEABLE",
      mergeStateStatus: "CLEAN"
    },
    suppliedHeadSha: currentHead,
    processEvidence: {
      ...successfulInput().processEvidence,
      effectiveContentHead,
      currentHeadGuardEvidence: true,
      postEffectiveHeadEvidenceOnly: false,
      postEffectiveHeadInvalidPaths: ["scripts/finalize-pr.mjs"]
    }
  }));

  assert.equal(result.action, "block");
  assert.ok(result.blockers.some((blocker) => blocker.code === "post-effective-head-non-evidence"));
});

test("post-effective-head non-evidence edits inside allowed memory files block finalization", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-git-"));
  const featurePath = "specs/999-finalize-test";
  initGitRepo(root);
  writeMinimalFeatureMemory(root, featurePath);
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "effective content"]);
  const effectiveContentHead = git(root, ["rev-parse", "HEAD"]);

  writeFileSync(join(root, featurePath, "tasks.md"), `# Tasks

## Task List
- [x] Existing task.
- [x] New implementation task after final validation.

## Decisions
- Existing decision.

## Dead Ends
- None.

## Known Issues
- None.

## Implementation Agent Feedback
- None yet.

## Verification Evidence
- Existing evidence.
`);
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "non evidence edit"]);
  const currentHead = git(root, ["rev-parse", "HEAD"]);

  const result = verifyPostEffectiveHeadChanges(root, featurePath, effectiveContentHead, currentHead);

  assert.equal(result.postEffectiveHeadEvidenceOnly, false);
  assert.ok(result.postEffectiveHeadInvalidPaths.some((path) => path.startsWith(`${featurePath}/tasks.md:`)));
});

test("post-effective-head final-validation and guard evidence additions pass", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-git-"));
  const featurePath = "specs/999-finalize-test";
  initGitRepo(root);
  writeMinimalFeatureMemory(root, featurePath);
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "effective content"]);
  const effectiveContentHead = git(root, ["rev-parse", "HEAD"]);

  writeFileSync(join(root, featurePath, "feature-request.md"), `# Feature Request

## Final Analyst Validation Notes
- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-10T13:00:01Z
`);
  writeFileSync(join(root, featurePath, "spec.md"), `# Specification

## Final Architect Validation Notes
- Architect validation pass: passed
- Final Architect validation completed at: 2026-05-10T13:00:00Z
`);
  writeFileSync(join(root, featurePath, "tasks.md"), `# Tasks

## Task List
- [x] Existing task.

## Decisions
- Existing decision.
- Effective content head: ${effectiveContentHead}

## Dead Ends
- None.

## Known Issues
- None.

## Implementation Agent Feedback
- None yet.

## Verification Evidence
- Existing evidence.
- current-PR-head guard compared the current PR head with effective content head ${effectiveContentHead.slice(0, 12)} and found only final-validation evidence changes.
`);
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "final validation evidence"]);
  const currentHead = git(root, ["rev-parse", "HEAD"]);

  const result = verifyPostEffectiveHeadChanges(root, featurePath, effectiveContentHead, currentHead);

  assert.equal(result.postEffectiveHeadEvidenceOnly, true);
  assert.deepEqual(result.postEffectiveHeadInvalidPaths, []);
});

test("post-effective-head template verification evidence additions pass", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-git-"));
  const featurePath = "specs/999-finalize-test";
  const featureRoot = join(root, featurePath);
  initGitRepo(root);
  writeMinimalFeatureMemory(root, featurePath);
  writeFileSync(join(featureRoot, "tasks.md"), `# Tasks

## Task List
- [x] Existing task.

## Process Memory

### Decisions
- Existing decision.

### Dead Ends
- None.

### Known Issues
- None.

### Verification Evidence
- Existing evidence.

### Cycle PR Set
- Existing cycle evidence.
`);
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "effective content"]);
  const effectiveContentHead = git(root, ["rev-parse", "HEAD"]);

  writeFileSync(join(featureRoot, "tasks.md"), `# Tasks

## Task List
- [x] Existing task.

## Process Memory

### Decisions
- Existing decision.
- Effective content head: ${effectiveContentHead}

### Dead Ends
- None.

### Known Issues
- None.

### Verification Evidence
- Existing evidence.
- current-PR-head guard compared the current PR head with effective content head ${effectiveContentHead.slice(0, 12)} and found only final-validation evidence changes.

### Cycle PR Set
- Existing cycle evidence.
`);
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "template verification evidence"]);
  const currentHead = git(root, ["rev-parse", "HEAD"]);

  const result = verifyPostEffectiveHeadChanges(root, featurePath, effectiveContentHead, currentHead);

  assert.equal(result.postEffectiveHeadEvidenceOnly, true);
  assert.deepEqual(result.postEffectiveHeadInvalidPaths, []);
});

test("post-effective-head template peer sections are not verification evidence", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-git-"));
  const featurePath = "specs/999-finalize-test";
  const featureRoot = join(root, featurePath);
  initGitRepo(root);
  writeMinimalFeatureMemory(root, featurePath);
  writeFileSync(join(featureRoot, "tasks.md"), `# Tasks

## Task List
- [x] Existing task.

## Process Memory

### Decisions
- Existing decision.

### Dead Ends
- None.

### Known Issues
- None.

### Verification Evidence
- Existing evidence.

### Cycle PR Set
`);
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "effective content"]);
  const effectiveContentHead = git(root, ["rev-parse", "HEAD"]);

  writeFileSync(join(featureRoot, "tasks.md"), `# Tasks

## Task List
- [x] Existing task.

## Process Memory

### Decisions
- Existing decision.
- Effective content head: ${effectiveContentHead}

### Dead Ends
- None.

### Known Issues
- None.

### Verification Evidence
- Existing evidence.

### Cycle PR Set
- current-PR-head guard compared the current PR head with effective content head ${effectiveContentHead.slice(0, 12)} and found only final-validation evidence changes.
`);
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "template peer section edit"]);
  const currentHead = git(root, ["rev-parse", "HEAD"]);

  const result = verifyPostEffectiveHeadChanges(root, featurePath, effectiveContentHead, currentHead);

  assert.equal(result.postEffectiveHeadEvidenceOnly, false);
  assert.ok(result.postEffectiveHeadInvalidPaths.some((path) => path.startsWith(`${featurePath}/tasks.md:`)));
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

test("older same-reviewer changes-requested review is superseded by approval on the same head", () => {
  const headSha = "abc1234";
  const findings = collectBlockingFindings({
    headSha,
    reviews: [{
      state: "CHANGES_REQUESTED",
      body: "",
      submittedAt: "2026-05-10T13:00:00Z",
      author: { login: "reviewer" },
      commit: { oid: headSha }
    }, {
      state: "APPROVED",
      body: "",
      submittedAt: "2026-05-10T13:01:00Z",
      author: { login: "reviewer" },
      commit: { oid: headSha }
    }]
  });

  assert.equal(findings.some((finding) => finding.source === "native-review"), false);
});

test("later same-reviewer commented review does not clear changes-requested on the same head", () => {
  const headSha = "abc1234";
  const findings = collectBlockingFindings({
    headSha,
    reviews: [{
      state: "CHANGES_REQUESTED",
      body: "",
      submittedAt: "2026-05-10T13:00:00Z",
      author: { login: "reviewer" },
      commit: { oid: headSha }
    }, {
      state: "COMMENTED",
      body: "",
      submittedAt: "2026-05-10T13:01:00Z",
      author: { login: "reviewer" },
      commit: { oid: headSha }
    }]
  });

  assert.equal(findings.filter((finding) => finding.source === "native-review").length, 1);
});

test("dismissed same-reviewer changes-requested review clears the native blocker", () => {
  const headSha = "abc1234";
  const findings = collectBlockingFindings({
    headSha,
    reviews: [{
      state: "CHANGES_REQUESTED",
      body: "",
      submittedAt: "2026-05-10T13:00:00Z",
      author: { login: "reviewer" },
      commit: { oid: headSha }
    }, {
      state: "DISMISSED",
      body: "",
      submittedAt: "2026-05-10T13:01:00Z",
      author: { login: "reviewer" },
      commit: { oid: headSha }
    }]
  });

  assert.equal(findings.some((finding) => finding.source === "native-review"), false);
});

test("latest same-reviewer changes-requested review still blocks on the current head", () => {
  const headSha = "abc1234";
  const findings = collectBlockingFindings({
    headSha,
    reviews: [{
      state: "APPROVED",
      body: "",
      submittedAt: "2026-05-10T13:00:00Z",
      author: { login: "reviewer" },
      commit: { oid: headSha }
    }, {
      state: "CHANGES_REQUESTED",
      body: "",
      submittedAt: "2026-05-10T13:01:00Z",
      author: { login: "reviewer" },
      commit: { oid: headSha }
    }]
  });

  assert.equal(findings.filter((finding) => finding.source === "native-review").length, 1);
});

test("different reviewer latest changes-requested review still blocks current-head finalization", () => {
  const headSha = "abc1234";
  const findings = collectBlockingFindings({
    headSha,
    reviews: [{
      state: "CHANGES_REQUESTED",
      body: "",
      submittedAt: "2026-05-10T13:00:00Z",
      author: { login: "reviewer-a" },
      commit: { oid: headSha }
    }, {
      state: "APPROVED",
      body: "",
      submittedAt: "2026-05-10T13:01:00Z",
      author: { login: "reviewer-a" },
      commit: { oid: headSha }
    }, {
      state: "CHANGES_REQUESTED",
      body: "",
      submittedAt: "2026-05-10T13:02:00Z",
      author: { login: "reviewer-b" },
      commit: { oid: headSha }
    }]
  });

  assert.equal(findings.filter((finding) => finding.source === "native-review").length, 1);
});

test("truncated native review data fails closed before finalization", () => {
  const findings = collectPaginationFindings({ reviews: true });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].source, "review-pagination");

  const result = evaluateFinalizationGates(successfulInput({
    blockingFindings: findings
  }));

  assert.equal(result.action, "block");
  assert.ok(result.blockers.some((blocker) =>
    blocker.code === "blocking-review-finding" &&
    blocker.message.includes("Native PR reviews are paginated")
  ));
});

test("truncated PR conversation comments fail closed before finalization", () => {
  const findings = collectPaginationFindings({ issueComments: true });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].source, "review-pagination");

  const result = evaluateFinalizationGates(successfulInput({
    blockingFindings: findings
  }));

  assert.equal(result.action, "block");
  assert.ok(result.blockers.some((blocker) =>
    blocker.code === "blocking-review-finding" &&
    blocker.message.includes("PR conversation comments are paginated")
  ));
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

test("process evidence rejects generic current-head guard marker without effective head reference", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-"));
  const featurePath = "specs/999-finalize-test";
  const featureRoot = join(root, featurePath);
  mkdirSync(featureRoot, { recursive: true });
  writeFileSync(join(featureRoot, "feature-request.md"), `Analyst validation pass: passed
Final Analyst validation completed at: 2026-05-10T13:00:01Z
Analyst return count: 0
`);
  writeFileSync(join(featureRoot, "spec.md"), `Architect validation pass: passed
Final Architect validation completed at: 2026-05-10T13:00:00Z
Architect return count: 0
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
  const genericEvidence = readProcessEvidence(root, featurePath, "abc123def456");
  assert.equal(genericEvidence.effectiveContentHead, null);
  assert.equal(genericEvidence.feedbackDisposition, true);
  assert.equal(genericEvidence.currentHeadGuardEvidence, false);

  writeFileSync(join(featureRoot, "tasks.md"), `${baseTasks}- None yet.
- Follow-up concern needs Architect review.
${evidenceTasks}`);
  assert.equal(readProcessEvidence(root, featurePath, "abc123def456").feedbackDisposition, false);

  writeFileSync(join(featureRoot, "tasks.md"), `${baseTasks}- Follow-up concern needs Architect review.
- Architect disposition: not needed because covered by existing task.
${evidenceTasks}`);
  assert.equal(readProcessEvidence(root, featurePath, "abc123def456").feedbackDisposition, true);

  writeFileSync(join(featureRoot, "tasks.md"), `${baseTasks}- Follow-up concern needs Architect review.
- Architect disposition: not needed because covered by existing task.
- Second follow-up concern still needs Architect review.
${evidenceTasks}`);
  assert.equal(readProcessEvidence(root, featurePath, "abc123def456").feedbackDisposition, false);

  writeFileSync(join(featureRoot, "tasks.md"), `${baseTasks}- None yet.

## Verification Evidence
- Required checks passed.
`);
  assert.equal(readProcessEvidence(root, featurePath, "abc123def456").currentHeadGuardEvidence, false);
});

test("feedback disposition parsing rejects pending or unresolved disposition wording", () => {
  assert.equal(hasImplementationFeedbackDisposition(`- Follow-up concern needs Architect review.
- Disposition: pending
`), false);

  assert.equal(hasImplementationFeedbackDisposition(`- Follow-up concern needs Architect review.
- Architect disposition: unresolved
`), false);

  assert.equal(hasImplementationFeedbackDisposition(`- Follow-up concern needs Architect review. Disposition: needs review by Architect.
`), false);

  assert.equal(hasImplementationFeedbackDisposition(`- Follow-up concern needs Architect review.
- Architect disposition: open pending review.
`), false);

  assert.equal(hasImplementationFeedbackDisposition(`- Follow-up concern needs Architect review.
- Architect disposition: requires Architect disposition.
`), false);
});

test("feedback disposition parsing accepts final disposition wording", () => {
  assert.equal(hasImplementationFeedbackDisposition(`- Follow-up concern needs Architect review.
- Disposition: not needed because existing tasks cover it.
`), true);

  assert.equal(hasImplementationFeedbackDisposition(`- Follow-up concern needs Architect review. Architect disposition: accepted and addressed in this slice.
`), true);

  assert.equal(hasImplementationFeedbackDisposition(`- Follow-up concern needs Architect review.
- No unresolved Implementation Agent feedback remains.
`), true);

  assert.equal(hasImplementationFeedbackDisposition(`- Follow-up concern needs Architect review.
- Disposition: superseded by the final validation evidence task.
`), true);
});

test("process evidence accepts effective-head marker plus guard reference", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-"));
  const featurePath = "specs/999-finalize-test";
  const featureRoot = join(root, featurePath);
  const effectiveContentHead = "0123456789abcdef0123456789abcdef01234567";
  mkdirSync(featureRoot, { recursive: true });
  writeFileSync(join(featureRoot, "feature-request.md"), `Analyst validation pass: passed
Final Analyst validation completed at: 2026-05-10T13:00:01Z
`);
  writeFileSync(join(featureRoot, "spec.md"), `Architect validation pass: passed
Final Architect validation completed at: 2026-05-10T13:00:00Z
`);
  writeFileSync(join(featureRoot, "plan.md"), "");
  writeFileSync(join(featureRoot, "tasks.md"), `# Tasks

## Decisions
- Effective content head: ${effectiveContentHead}

## Dead Ends
- None.

## Known Issues
- None.

## Implementation Agent Feedback
- None yet.

## Verification Evidence
- current-PR-head guard compared the current PR head with effective content head ${effectiveContentHead.slice(0, 12)} and found only final-validation evidence changes.
`);

  const evidence = readProcessEvidence(root, featurePath, effectiveContentHead);
  assert.equal(evidence.effectiveContentHead, effectiveContentHead);
  assert.equal(evidence.currentHeadGuardEvidence, true);
  assert.equal(evidence.currentHeadMatchesEffectiveContentHead, true);
  assert.equal(evidence.postEffectiveHeadEvidenceOnly, true);
});

test("process evidence blocks when cycle PR set evidence is missing", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-"));
  const featurePath = "specs/999-finalize-test";
  const effectiveContentHead = "0123456789abcdef0123456789abcdef01234567";
  writeFinalValidationFeatureMemory(root, featurePath, effectiveContentHead, {
    taskOverrides: { includeCyclePrSet: false }
  });

  const evidence = readProcessEvidence(root, featurePath, effectiveContentHead);
  assert.equal(evidence.currentProcessMemory, false);

  const result = evaluateFinalizationGates(successfulInput({
    processEvidence: {
      ...successfulInput().processEvidence,
      ...evidence
    }
  }));
  assert.ok(result.blockers.some((blocker) => blocker.code === "stale-process-memory"));
});

test("process evidence blocks when validation return counts are missing", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-"));
  const featurePath = "specs/999-finalize-test";
  const effectiveContentHead = "0123456789abcdef0123456789abcdef01234567";
  writeFinalValidationFeatureMemory(root, featurePath, effectiveContentHead, {
    includeRoleReturnCounts: false,
    taskOverrides: {
      includeArchitectReturnCount: false,
      includeAnalystReturnCount: false
    }
  });

  const evidence = readProcessEvidence(root, featurePath, effectiveContentHead);
  assert.equal(evidence.currentProcessMemory, false);

  const result = evaluateFinalizationGates(successfulInput({
    processEvidence: {
      ...successfulInput().processEvidence,
      ...evidence
    }
  }));
  assert.ok(result.blockers.some((blocker) => blocker.code === "stale-process-memory"));
});

test("process evidence blocks when limit escalation state is missing", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-"));
  const featurePath = "specs/999-finalize-test";
  const effectiveContentHead = "0123456789abcdef0123456789abcdef01234567";
  writeFinalValidationFeatureMemory(root, featurePath, effectiveContentHead, {
    taskOverrides: { includeLimitEscalation: false }
  });

  const evidence = readProcessEvidence(root, featurePath, effectiveContentHead);
  assert.equal(evidence.currentProcessMemory, false);

  const result = evaluateFinalizationGates(successfulInput({
    processEvidence: {
      ...successfulInput().processEvidence,
      ...evidence
    }
  }));
  assert.ok(result.blockers.some((blocker) => blocker.code === "stale-process-memory"));
});

test("process evidence with full workflow markers can satisfy merge gates", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-"));
  const featurePath = "specs/999-finalize-test";
  const effectiveContentHead = "0123456789abcdef0123456789abcdef01234567";
  writeFinalValidationFeatureMemory(root, featurePath, effectiveContentHead);

  const evidence = readProcessEvidence(root, featurePath, effectiveContentHead);
  const result = evaluateFinalizationGates(successfulInput({
    suppliedHeadSha: effectiveContentHead,
    pr: {
      number: 12,
      headSha: effectiveContentHead,
      isDraft: false,
      mergeable: "MERGEABLE",
      mergeStateStatus: "CLEAN"
    },
    processEvidence: evidence
  }));

  assert.equal(evidence.currentProcessMemory, true);
  assert.equal(result.ready, true);
  assert.equal(result.action, "merge");
});

test("process evidence accepts template process-memory heading levels", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-finalize-"));
  const featurePath = "specs/999-finalize-test";
  const featureRoot = join(root, featurePath);
  const effectiveContentHead = "0123456789abcdef0123456789abcdef01234567";
  mkdirSync(featureRoot, { recursive: true });
  writeFileSync(join(featureRoot, "feature-request.md"), `Analyst validation pass: passed
Final Analyst validation completed at: 2026-05-10T13:00:01Z
`);
  writeFileSync(join(featureRoot, "spec.md"), `Architect validation pass: passed
Final Architect validation completed at: 2026-05-10T13:00:00Z
`);
  writeFileSync(join(featureRoot, "plan.md"), "");
  writeFileSync(join(featureRoot, "tasks.md"), `# Tasks

## Process Memory

### Decisions
- Effective content head: ${effectiveContentHead}

### Dead Ends
- None.

### Known Issues
- None.

### Verification Evidence
- Required checks passed.
- current-PR-head guard compared the current PR head with effective content head ${effectiveContentHead.slice(0, 12)} and found only final-validation evidence changes.

### Cycle PR Set
- Purpose: finalize PR automation; branch: codex/999-finalize-test; PR: #999; head SHA: ${effectiveContentHead}; status: ready for final validation; final-validation inclusion: included.

### Final Validation Evidence
- Architect return count: 0
- Analyst return count: 0
- Limit escalation: none

## Implementation Agent Feedback
- None yet.
`);

  const evidence = readProcessEvidence(root, featurePath, effectiveContentHead);
  assert.equal(evidence.acceptanceEvidence, true);
  assert.equal(evidence.currentProcessMemory, true);
  assert.equal(evidence.currentHeadGuardEvidence, true);
});

test("post-effective-head path helper allows only role process evidence files", () => {
  const featurePath = "specs/999-finalize-test";
  const changedFiles = [
    "specs/999-finalize-test/feature-request.md",
    "specs/999-finalize-test/spec.md",
    "specs/999-finalize-test/plan.md",
    "specs/999-finalize-test/tasks.md"
  ];

  assert.equal(isFinalValidationEvidencePath("specs/999-finalize-test/tasks.md", featurePath), true);
  assert.equal(isFinalValidationEvidencePath("specs/999-finalize-test/notes.md", featurePath), false);
  assert.equal(isFinalValidationEvidencePath("scripts/finalize-pr.mjs", featurePath), false);

  const allowed = evaluatePostEffectiveHeadChangedFiles(changedFiles, featurePath);
  assert.equal(allowed.postEffectiveHeadEvidenceOnly, true);

  const blocked = evaluatePostEffectiveHeadChangedFiles([...changedFiles, "scripts/finalize-pr.mjs"], featurePath);
  assert.equal(blocked.postEffectiveHeadEvidenceOnly, false);
  assert.deepEqual(blocked.postEffectiveHeadInvalidPaths, ["scripts/finalize-pr.mjs"]);
});
