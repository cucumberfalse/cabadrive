import test from "node:test";
import assert from "node:assert/strict";

import {
  classifyCodexNativeReview,
  containsBlockingSeverity,
  extractClaudeOutcome,
  extractCodexPriority,
  extractMarkerSha,
  isAcceptableCodexSummaryComment,
  isTrustedAssociation,
  isTrustedReviewLogin,
  latestCodexNativeReviewResult,
  trustedReviewLoginsForAgent
} from "../scripts/ai-review-helpers.mjs";

test("extractClaudeOutcome parses accepted values case-insensitively", () => {
  assert.equal(extractClaudeOutcome("AI_REVIEW_OUTCOME: PASS"), "pass");
  assert.equal(extractClaudeOutcome("AI_REVIEW_OUTCOME: advisory"), "advisory");
  assert.equal(extractClaudeOutcome("AI_REVIEW_OUTCOME: block"), "block");
  assert.equal(extractClaudeOutcome("outcome: pass"), null);
});

test("extractMarkerSha accepts 7..40 hex chars and rejects invalid lines", () => {
  assert.equal(extractMarkerSha("AI_REVIEW_SHA: abcdef1"), "abcdef1");
  assert.equal(extractMarkerSha("AI_REVIEW_SHA: ABCDEF1"), "abcdef1");
  assert.equal(
    extractMarkerSha("AI_REVIEW_SHA: abcdef1234567890abcdef1234567890abcdef12"),
    "abcdef1234567890abcdef1234567890abcdef12"
  );
  assert.equal(extractMarkerSha("AI_REVIEW_SHA: not-a-sha"), null);
  assert.equal(extractMarkerSha("SHA: abcdef1"), null);
});

test("trusted associations are evaluated case-insensitively", () => {
  assert.equal(isTrustedAssociation("owner"), true);
  assert.equal(isTrustedAssociation("MEMBER"), true);
  assert.equal(isTrustedAssociation("contributor"), false);
});

test("both Codex connector login forms are trusted only for codex by default", () => {
  assert.equal(isTrustedReviewLogin("chatgpt-codex-connector[bot]", "codex"), true);
  assert.equal(isTrustedReviewLogin("chatgpt-codex-connector", "codex"), true);
  assert.equal(isTrustedReviewLogin("chatgpt-codex-connector", "claude"), false);
  assert.equal(isTrustedReviewLogin("chatgpt-codex-connector", "gemini"), false);
});

test("trustedReviewLoginsForAgent merges defaults and config overrides", () => {
  const logins = trustedReviewLoginsForAgent("codex", {
    trustedReviewLogins: ["Team-Bot"],
    trustedReviewLoginsByAgent: {
      codex: ["Custom-Codex-Bot"]
    }
  });

  assert.equal(logins.has("chatgpt-codex-connector[bot]"), true);
  assert.equal(logins.has("chatgpt-codex-connector"), true);
  assert.equal(logins.has("team-bot"), true);
  assert.equal(logins.has("custom-codex-bot"), true);
});

test("isTrustedReviewLogin normalizes user login before comparison", () => {
  const config = {
    trustedReviewLogins: ["Trusted-Reviewer"]
  };
  assert.equal(isTrustedReviewLogin("TRUSTED-REVIEWER", "codex", config), true);
  assert.equal(isTrustedReviewLogin("unknown", "codex", config), false);
});

test("agent-specific config can opt the new Codex login into another backend explicitly", () => {
  const config = {
    trustedReviewLoginsByAgent: {
      claude: ["chatgpt-codex-connector"]
    }
  };

  assert.equal(isTrustedReviewLogin("chatgpt-codex-connector", "claude", config), true);
  assert.equal(isTrustedReviewLogin("chatgpt-codex-connector", "gemini", config), false);
});

test("containsBlockingSeverity catches codex P0-P2 and ignores P3", () => {
  assert.equal(containsBlockingSeverity("Findings: P0 crash risk", "codex"), true);
  assert.equal(containsBlockingSeverity("Findings: P2 regression", "codex"), true);
  assert.equal(containsBlockingSeverity("Findings: P3 minor note", "codex"), false);
});

test("extractCodexPriority returns numeric P-level or null", () => {
  assert.equal(extractCodexPriority("[P1] issue"), 1);
  assert.equal(extractCodexPriority("p3 nit"), 3);
  assert.equal(extractCodexPriority("no priority"), null);
});

test("isAcceptableCodexSummaryComment accepts head SHA marker from trusted login", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const comment = {
    body: `Codex Review: did not find any major issues in head (${headSha}).`,
    user: { login: "chatgpt-codex-connector[bot]" },
    created_at: "2026-05-08T15:24:18Z"
  };

  assert.equal(isAcceptableCodexSummaryComment(comment, headSha), true);
});

test("isAcceptableCodexSummaryComment accepts botless Codex connector login", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const comment = {
    body: `Codex Review: did not find any major issues in head (${headSha}).`,
    user: { login: "chatgpt-codex-connector" },
    created_at: "2026-05-08T15:24:18Z"
  };

  assert.equal(isAcceptableCodexSummaryComment(comment, headSha), true);
});

test("isAcceptableCodexSummaryComment rejects stale and unknown-login evidence", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const previousSha = "9df31d213419b107ca49797c0357ce8151c8effe";
  const staleComment = {
    body: `Codex Review: did not find any major issues in head (${previousSha}).`,
    user: { login: "chatgpt-codex-connector" },
    created_at: "2026-05-08T15:24:18Z"
  };
  const unknownComment = {
    body: `Codex Review: did not find any major issues in head (${headSha}).`,
    user: { login: "repo-owner" },
    author_association: "OWNER",
    created_at: "2026-05-08T15:24:18Z"
  };

  assert.equal(isAcceptableCodexSummaryComment(staleComment, headSha), false);
  assert.equal(isTrustedAssociation(unknownComment.author_association), true);
  assert.equal(isAcceptableCodexSummaryComment(unknownComment, headSha), false);
});

test("isAcceptableCodexSummaryComment accepts fresh summary by timestamp fallback", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const comment = {
    body: "Codex Review: did not find any major issues in current head.",
    user: { login: "chatgpt-codex-connector[bot]" },
    created_at: "2026-05-08T15:24:18Z"
  };

  assert.equal(
    isAcceptableCodexSummaryComment(comment, headSha, "2026-05-08T15:20:00Z"),
    true
  );
  assert.equal(
    isAcceptableCodexSummaryComment(comment, headSha, "2026-05-08T15:30:00Z"),
    false
  );
});

test("latestCodexNativeReviewResult accepts current-head native review from botless connector", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const review = {
    id: 11,
    body: "Codex Review: did not find any major issues.",
    commit_id: headSha,
    state: "APPROVED",
    submitted_at: "2026-05-08T15:24:18Z",
    user: { login: "chatgpt-codex-connector" }
  };

  assert.equal(classifyCodexNativeReview(review, [], headSha), "pass");
  assert.equal(latestCodexNativeReviewResult([review], [], headSha), "pass");
});

test("latestCodexNativeReviewResult rejects stale native Codex reviews", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const staleReview = {
    id: 11,
    body: "Codex Review: did not find any major issues.",
    commit_id: "9df31d213419b107ca49797c0357ce8151c8effe",
    state: "APPROVED",
    submitted_at: "2026-05-08T15:24:18Z",
    user: { login: "chatgpt-codex-connector" }
  };

  assert.equal(classifyCodexNativeReview(staleReview, [], headSha), null);
  assert.equal(latestCodexNativeReviewResult([staleReview], [], headSha), null);
});

test("latestCodexNativeReviewResult rejects unknown login even with trusted association", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const review = {
    id: 11,
    body: "Codex Review: did not find any major issues.",
    commit_id: headSha,
    state: "APPROVED",
    submitted_at: "2026-05-08T15:24:18Z",
    user: { login: "repo-owner" },
    author_association: "OWNER"
  };

  assert.equal(isTrustedAssociation(review.author_association), true);
  assert.equal(classifyCodexNativeReview(review, [], headSha), null);
  assert.equal(latestCodexNativeReviewResult([review], [], headSha), null);
});
