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
  latestCodexResult,
  trustedReviewLoginsForAgent,
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
    "abcdef1234567890abcdef1234567890abcdef12",
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
      codex: ["Custom-Codex-Bot"],
    },
  });

  assert.equal(logins.has("chatgpt-codex-connector[bot]"), true);
  assert.equal(logins.has("chatgpt-codex-connector"), true);
  assert.equal(logins.has("team-bot"), true);
  assert.equal(logins.has("custom-codex-bot"), true);
});

test("isTrustedReviewLogin normalizes user login before comparison", () => {
  const config = {
    trustedReviewLogins: ["Trusted-Reviewer"],
  };
  assert.equal(isTrustedReviewLogin("TRUSTED-REVIEWER", "codex", config), true);
  assert.equal(isTrustedReviewLogin("unknown", "codex", config), false);
});

test("agent-specific config can opt the new Codex login into another backend explicitly", () => {
  const config = {
    trustedReviewLoginsByAgent: {
      claude: ["chatgpt-codex-connector"],
    },
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
    created_at: "2026-05-08T15:24:18Z",
  };

  assert.equal(isAcceptableCodexSummaryComment(comment, headSha), true);
});

test("isAcceptableCodexSummaryComment accepts current short head marker from trusted login", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const comment = {
    body: "Codex Review: did not find any major issues in head 83A6736A01.",
    user: { login: "chatgpt-codex-connector[bot]" },
    created_at: "2026-05-08T15:24:18Z",
  };

  assert.equal(isAcceptableCodexSummaryComment(comment, headSha), true);
});

test("isAcceptableCodexSummaryComment accepts 7-character current head prefix", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const comment = {
    body: "Codex Review: did not find any major issues in head 83a6736.",
    user: { login: "chatgpt-codex-connector[bot]" },
    created_at: "2026-05-08T15:24:18Z",
  };

  assert.equal(isAcceptableCodexSummaryComment(comment, headSha), true);
});

test("isAcceptableCodexSummaryComment accepts 9-character current head prefix", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const comment = {
    body: "Codex Review: did not find any major issues in head 83a6736a0.",
    user: { login: "chatgpt-codex-connector" },
    created_at: "2026-05-08T15:24:18Z",
  };

  assert.equal(isAcceptableCodexSummaryComment(comment, headSha), true);
});

test("isAcceptableCodexSummaryComment accepts botless Codex connector login", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const comment = {
    body: `Codex Review: did not find any major issues in head (${headSha}).`,
    user: { login: "chatgpt-codex-connector" },
    created_at: "2026-05-08T15:24:18Z",
  };

  assert.equal(isAcceptableCodexSummaryComment(comment, headSha), true);
});

test("isAcceptableCodexSummaryComment rejects stale SHA marker before timestamp fallback", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const previousSha = "9df31d213419b107ca49797c0357ce8151c8effe";
  const staleComment = {
    body: `Codex Review: did not find any major issues in head (${previousSha}).`,
    user: { login: "chatgpt-codex-connector" },
    created_at: "2026-05-08T15:24:18Z",
  };

  assert.equal(
    isAcceptableCodexSummaryComment(staleComment, headSha, "2026-05-08T15:20:00Z"),
    false,
  );
});

test("isAcceptableCodexSummaryComment rejects non-matching 7-character marker before timestamp fallback", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const staleComment = {
    body: "Codex Review: did not find any major issues in head deadbee.",
    user: { login: "chatgpt-codex-connector" },
    created_at: "2026-05-08T15:24:18Z",
  };

  assert.equal(
    isAcceptableCodexSummaryComment(staleComment, headSha, "2026-05-08T15:20:00Z"),
    false,
  );
});

test("isAcceptableCodexSummaryComment rejects unknown-login evidence", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const unknownComment = {
    body: `Codex Review: did not find any major issues in head (${headSha}).`,
    user: { login: "repo-owner" },
    author_association: "OWNER",
    created_at: "2026-05-08T15:24:18Z",
  };

  assert.equal(isTrustedAssociation(unknownComment.author_association), true);
  assert.equal(isAcceptableCodexSummaryComment(unknownComment, headSha), false);
});

test("isAcceptableCodexSummaryComment rejects no-SHA summary despite fresh timestamp", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const comment = {
    body: "Codex Review: did not find any major issues in current head.",
    user: { login: "chatgpt-codex-connector[bot]" },
    created_at: "2026-05-08T15:24:18Z",
  };

  assert.equal(isAcceptableCodexSummaryComment(comment, headSha, "2026-05-08T15:20:00Z"), false);
  assert.equal(isAcceptableCodexSummaryComment(comment, headSha, "2026-05-08T15:30:00Z"), false);
});

test("isAcceptableCodexSummaryComment rejects hex-like word fragments without explicit commit identity", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const comment = {
    body: "Codex Review: did not find any major issues. Feedback accepted; abc1234z is a label.",
    user: { login: "chatgpt-codex-connector" },
    created_at: "2026-05-08T15:24:18Z",
  };

  assert.equal(isAcceptableCodexSummaryComment(comment, headSha, "2026-05-08T15:20:00Z"), false);
});

test("isAcceptableCodexSummaryComment still accepts standalone current marker with punctuation boundaries", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const comment = {
    body: "Codex Review: did not find any major issues. Reviewed [83a6736].",
    user: { login: "chatgpt-codex-connector" },
    created_at: "2026-05-08T15:24:18Z",
  };

  assert.equal(isAcceptableCodexSummaryComment(comment, headSha), true);
});

test("isAcceptableCodexSummaryComment still rejects standalone non-current marker before fallback", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const comment = {
    body: "Codex Review: did not find any major issues. Feedback checked for [deadbee].",
    user: { login: "chatgpt-codex-connector" },
    created_at: "2026-05-08T15:24:18Z",
  };

  assert.equal(isAcceptableCodexSummaryComment(comment, headSha, "2026-05-08T15:20:00Z"), false);
});

test("isAcceptableCodexSummaryComment still rejects unknown login for no-SHA fallback", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const comment = {
    body: "Codex Review: did not find any major issues. Feedback looks complete.",
    user: { login: "repo-owner" },
    author_association: "OWNER",
    created_at: "2026-05-08T15:24:18Z",
  };

  assert.equal(isTrustedAssociation(comment.author_association), true);
  assert.equal(isAcceptableCodexSummaryComment(comment, headSha, "2026-05-08T15:20:00Z"), false);
});

test("latestCodexNativeReviewResult accepts current-head native review from botless connector", () => {
  const headSha = "83a6736a01246465a46c900ee21926cf594c1825";
  const review = {
    id: 11,
    body: "Codex Review: did not find any major issues.",
    commit_id: headSha,
    state: "APPROVED",
    submitted_at: "2026-05-08T15:24:18Z",
    user: { login: "chatgpt-codex-connector" },
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
    user: { login: "chatgpt-codex-connector" },
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
    author_association: "OWNER",
  };

  assert.equal(isTrustedAssociation(review.author_association), true);
  assert.equal(classifyCodexNativeReview(review, [], headSha), null);
  assert.equal(latestCodexNativeReviewResult([review], [], headSha), null);
});

test("F25 explicit P3-only formal finding is advisory", () => {
  const head = "a".repeat(40);
  const review = {
    id: 1,
    commit_id: head,
    user: { login: "chatgpt-codex-connector[bot]" },
    state: "COMMENTED",
    body: "[P3] Found an issue",
    submitted_at: "2026-10-16T12:00:00Z",
  };
  assert.equal(classifyCodexNativeReview(review, [], head), "pass");
  assert.equal(latestCodexNativeReviewResult([review], [], head), "pass");
});

const p3Head = "a".repeat(40);
const p3Formal = (extra = {}) => ({
  id: 1,
  commit_id: p3Head,
  user: { login: "chatgpt-codex-connector[bot]" },
  state: "COMMENTED",
  body: "[P3] Found an issue",
  submitted_at: "2026-10-16T12:00:00Z",
  ...extra,
});
for (const body of [
  "[P3] Found an issue.",
  "[p3] found 2 findings",
  "  [P3] Found an issue\r\n\r\n[P3] Found a finding!",
  "[P3] Found an issue\n[P3] Found 2 issues.",
])
  test(`F25 bounded P3 advisory units ${JSON.stringify(body)}`, () =>
    assert.equal(classifyCodexNativeReview(p3Formal({ body }), [], p3Head), "pass"));
for (const body of [
  ...["P0", "P1", "P2", "unknown", "P4"].map((p) => `[P3] Found an issue\n[${p}] Found an issue`),
  "[P3] Found an issue\nFound an issue",
  "[P3] Advisory\nFound an issue",
  "Found an issue [P3]",
  "[P3] Found an issue; [unknown] Found an issue",
  "[P3] Found an issue with arbitrary trailing prose",
  "[P3] Advice: Found an issue",
  "[P3] Found an issue\nReview is still running.",
  "[P3] Found an issue\nReview pending.",
  "[P3] Found an issue\nReview incomplete.",
  "[P3] Found an issue\nReview failed.",
  "[P3] Found an issue\nThere are unresolved findings.",
  "[P3] Found an issue\nChanges requested.",
])
  test(`F25 P3 marker cannot hide ${JSON.stringify(body)}`, () =>
    assert.equal(classifyCodexNativeReview(p3Formal({ body }), [], p3Head), "fail"));
for (const extra of [{ state: "CHANGES_REQUESTED" }, { state: "APPROVED" }])
  test(`F25 advisory exception is COMMENTED-only ${extra.state}`, () =>
    assert.equal(classifyCodexNativeReview(p3Formal(extra), [], p3Head), "fail"));
for (const extra of [
  { commit_id: null },
  { commit_id: "b".repeat(40) },
  { user: { login: "human" } },
])
  test(`F25 P3 advisory retains full-head/author trust ${JSON.stringify(extra)}`, () =>
    assert.equal(classifyCodexNativeReview(p3Formal(extra), [], p3Head), null));
test("F25 latest blocking formal, correction and dismissal keep their precedence", () => {
  const advisory = p3Formal();
  const block = p3Formal({ id: 2, submitted_at: "2026-10-16T12:01:00Z", body: "Found an issue" });
  assert.equal(latestCodexNativeReviewResult([advisory, block], [], p3Head), "fail");
  assert.equal(
    latestCodexNativeReviewResult(
      [advisory, { ...block, body: "[P3] Found an issue" }],
      [],
      p3Head,
    ),
    "pass",
  );
  assert.equal(
    latestCodexNativeReviewResult([advisory, { ...block, state: "DISMISSED" }], [], p3Head),
    "pass",
  );
});

const f26Residuals = [
  "Found another issue.",
  "Found a remaining issue.",
  "[Unknown] Found another finding.",
];
const f26Bodies = f26Residuals.flatMap((residual) => [
  `[P3] Found an issue.\n${residual}`,
  `${residual}\n[P3] Found an issue.`,
  `\n[P3] Found an issue.\n\n${residual}\n`,
  `[P3] Found an issue. ${residual}`,
]);
for (const body of f26Bodies) {
  test(`F26 entire original mixed body retains classifier veto ${JSON.stringify(body)}`, () =>
    assert.equal(classifyCodexNativeReview(p3Formal({ body }), [], p3Head), "fail"));
  test(`F26 entire original mixed body retains latest formal veto ${JSON.stringify(body)}`, () =>
    assert.equal(latestCodexNativeReviewResult([p3Formal({ body })], [], p3Head), "fail"));
  test(`F26 newer issue receipt cannot clear residual formal veto ${JSON.stringify(body)}`, () => {
    const receipt = {
      id: 3,
      user: p3Formal().user,
      body: `<!-- codex-review-receipt:v1 -->\n\nCodex Review: Didn't find any major issues.\n\n**Reviewed commit:** \`${p3Head}\``,
      created_at: "2026-10-16T12:02:00Z",
      updated_at: "2026-10-16T12:02:00Z",
    };
    assert.equal(latestCodexResult([p3Formal({ body })], [], [receipt], p3Head).result, "fail");
  });
}

for (const body of [
  "[P3] Found an issue",
  "\n\n [P3] Found an issue.\n\n",
  "\t[p3] found 2 findings! \r\n\r\n[P3] Found a finding.\r\n",
  "[P3] Found an issue\n[P3] Found 2 issues.",
])
  test(`F26 whole-body advisory normalization control ${JSON.stringify(body)}`, () =>
    assert.equal(classifyCodexNativeReview(p3Formal({ body }), [], p3Head), "pass"));
for (const body of [
  "",
  "Non-blocking review.",
  "Found another issue.",
  "Found a remaining issue.",
  "[Unknown] Found another finding.",
])
  test(`F26 unrelated legacy standalone-body behavior unchanged ${JSON.stringify(body)}`, () =>
    assert.equal(classifyCodexNativeReview(p3Formal({ body }), [], p3Head), "pass"));
test("F26 original mixed formal veto clears only on genuine correction or dismissal", () => {
  const old = p3Formal();
  const latest = p3Formal({
    id: 2,
    submitted_at: "2026-10-16T12:01:00Z",
    body: "[P3] Found an issue.\nFound another issue.",
  });
  assert.equal(latestCodexNativeReviewResult([old, latest], [], p3Head), "fail");
  assert.equal(
    latestCodexNativeReviewResult([old, { ...latest, body: "[P3] Found an issue." }], [], p3Head),
    "pass",
  );
  assert.equal(
    latestCodexNativeReviewResult([old, { ...latest, state: "DISMISSED" }], [], p3Head),
    "pass",
  );
});
