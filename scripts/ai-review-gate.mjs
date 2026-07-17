#!/usr/bin/env node
import {
  isAcceptableClaudeComment,
  isAcceptableCodexSummaryComment,
  isAcceptableNativeReview,
  latestCodexNativeReviewResult,
} from "./ai-review-helpers.mjs";
import { readConfig } from "./shared.mjs";

const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const prNumber = process.env.AI_REVIEW_PR_NUMBER;
const headSha = process.env.AI_REVIEW_HEAD_SHA;
const selectedAgent = (process.env.AI_REVIEW_AGENT || "codex").trim().toLowerCase();
const triggerMode = (process.env.AI_REVIEW_TRIGGER_MODE || "skip").trim().toLowerCase();
const maxWaitMs = Number(process.env.AI_REVIEW_WAIT_MS || 900000);
const initialPollMs = Number(process.env.AI_REVIEW_POLL_MS || 15000);
const maxPollMs = Number(process.env.AI_REVIEW_MAX_POLL_MS || 120000);
const config = readConfig();

if (!token || !repository || !prNumber || !headSha) {
  console.error(
    "GITHUB_TOKEN, GITHUB_REPOSITORY, AI_REVIEW_PR_NUMBER, and AI_REVIEW_HEAD_SHA are required.",
  );
  process.exit(1);
}

if (!new Set(["codex", "claude", "gemini"]).has(selectedAgent)) {
  console.error(`Unsupported AI_REVIEW_AGENT value: ${selectedAgent}`);
  process.exit(1);
}

if (!new Set(["skip", "comment"]).has(triggerMode)) {
  console.error(`Unsupported AI_REVIEW_TRIGGER_MODE value: ${triggerMode}`);
  process.exit(1);
}

const [owner, repo] = repository.split("/");

async function request(path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const error = new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return null;
  return response.json();
}

async function graphqlRequest(query, variables = {}) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) {
    const error = new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
    error.status = response.status;
    throw error;
  }
  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(`GraphQL error: ${payload.errors.map((error) => error.message).join("; ")}`);
  }
  return payload.data;
}

async function listPaginated(path) {
  const items = [];
  const separator = path.includes("?") ? "&" : "?";
  for (let page = 1; ; page += 1) {
    const batch = await request(`${path}${separator}per_page=100&page=${page}`);
    items.push(...batch);
    if (batch.length < 100) return items;
  }
}

async function fetchResolvedCodexReviewCommentIds() {
  const ids = new Set();
  let cursor = null;
  do {
    const data = await graphqlRequest(
      `
      query($owner: String!, $repo: String!, $number: Int!, $cursor: String) {
        repository(owner: $owner, name: $repo) {
          pullRequest(number: $number) {
            reviewThreads(first: 100, after: $cursor) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                isResolved
                comments(first: 100) {
                  nodes {
                    databaseId
                  }
                }
              }
            }
          }
        }
      }
    `,
      { owner, repo, number: Number(prNumber), cursor },
    );
    const threads = data.repository.pullRequest.reviewThreads;
    for (const thread of threads.nodes) {
      if (!thread.isResolved) continue;
      for (const comment of thread.comments.nodes) {
        if (comment.databaseId) ids.add(comment.databaseId);
      }
    }
    cursor = threads.pageInfo.hasNextPage ? threads.pageInfo.endCursor : null;
  } while (cursor);
  return ids;
}

async function createComment(body) {
  await request(`/repos/${owner}/${repo}/issues/${prNumber}/comments`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ body }),
  });
}

async function maybePostTriggerComment() {
  if (triggerMode !== "comment") return;
  const triggers = {
    codex: "@codex review",
    claude: "@claude review once",
    gemini: "/gemini review",
  };
  try {
    await createComment(
      [
        triggers[selectedAgent],
        "",
        "_Administrative trigger posted by the AI Review workflow. Prefer a trusted human-authored trigger if the native backend ignores bot comments._",
      ].join("\n"),
    );
    console.log(`Posted AI Review trigger comment for ${selectedAgent}.`);
  } catch (error) {
    if (error.status === 403) {
      console.warn(`Could not post AI Review trigger comment: ${error.message}`);
      console.warn(
        "GitHub denied issue-comment write access for this workflow token; waiting for existing or human-triggered review evidence instead.",
      );
      return;
    }
    throw error;
  }
}

async function fetchHeadCommittedAt() {
  const commit = await request(`/repos/${owner}/${repo}/commits/${headSha}`);
  return commit?.commit?.committer?.date || null;
}

async function fetchEvidence() {
  if (selectedAgent === "claude") {
    const comments = await listPaginated(`/repos/${owner}/${repo}/issues/${prNumber}/comments`);
    return comments.some((comment) => isAcceptableClaudeComment(comment, headSha, config));
  }

  const reviews = await listPaginated(`/repos/${owner}/${repo}/pulls/${prNumber}/reviews`);
  if (selectedAgent === "codex") {
    const [allReviewComments, resolvedCommentIds] = await Promise.all([
      listPaginated(`/repos/${owner}/${repo}/pulls/${prNumber}/comments`),
      fetchResolvedCodexReviewCommentIds(),
    ]);
    const reviewComments = allReviewComments.filter(
      (comment) => !resolvedCommentIds.has(comment.id),
    );
    const latestCodexResult = latestCodexNativeReviewResult(
      reviews,
      reviewComments,
      headSha,
      config,
    );
    if (latestCodexResult === "pass") return true;
    if (latestCodexResult === "fail") return false;
  }

  if (reviews.some((review) => isAcceptableNativeReview(review, selectedAgent, headSha, config))) {
    return true;
  }

  if (selectedAgent !== "codex") return false;

  const headCommittedAt = await fetchHeadCommittedAt();
  const comments = await listPaginated(`/repos/${owner}/${repo}/issues/${prNumber}/comments`);
  return comments.some((comment) =>
    isAcceptableCodexSummaryComment(comment, headSha, headCommittedAt, config),
  );
}

await maybePostTriggerComment();

const started = Date.now();
let accepted = false;
let lastError = null;
let pollMs = initialPollMs;

while (Date.now() - started <= maxWaitMs) {
  try {
    accepted = await fetchEvidence();
    if (accepted) break;
  } catch (error) {
    lastError = error;
  }
  const elapsed = Date.now() - started;
  const remaining = maxWaitMs - elapsed;
  if (remaining <= 0) break;
  await new Promise((resolve) => setTimeout(resolve, Math.min(pollMs, remaining)));
  pollMs = Math.min(pollMs * 2, maxPollMs);
}

if (accepted) {
  console.log(`AI Review gate passed for ${selectedAgent} on ${headSha}.`);
  process.exit(0);
}

const detail = lastError ? ` Last API error: ${lastError.message}` : "";
const reviewHint =
  selectedAgent === "claude"
    ? "Claude must post AI_REVIEW_OUTCOME: pass for the current head SHA."
    : selectedAgent === "codex"
      ? "Codex must provide an acceptable native review for the current head SHA or a fresh no-findings Codex Review summary comment."
      : `${selectedAgent} must provide an acceptable native review for the current head SHA.`;

const failureComment = [
  "AI Review gate failed.",
  "",
  `- agent: ${selectedAgent}`,
  `- head SHA: ${headSha}`,
  `- expected: ${reviewHint}`,
  detail ? `- detail: ${detail}` : "",
]
  .filter(Boolean)
  .join("\n");

try {
  await createComment(failureComment);
} catch (error) {
  console.warn(`Could not post AI Review gate failure comment: ${error.message}`);
}

console.error(`AI Review gate failed for ${selectedAgent} on ${headSha}.${detail}`);
process.exit(1);
