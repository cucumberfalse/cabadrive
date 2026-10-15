#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import {
  codexCommentMarkers,
  isAcceptableClaudeComment,
  isAcceptableNativeReview,
  latestCodexResult,
} from "./ai-review-helpers.mjs";
import { assertCurrentPull, createReviewApi } from "./ai-review-api.mjs";
import { readConfig } from "./shared.mjs";

export async function runReviewGate({
  api,
  number,
  headSha,
  agent = "codex",
  triggerMode = "skip",
  config = {},
  maxWaitMs = 900000,
  initialPollMs = 15000,
  maxPollMs = 120000,
  now = Date.now,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  log = console,
}) {
  if (!/^[a-f0-9]{40}$/i.test(headSha || ""))
    throw new Error("An immutable full head SHA is required.");
  if (!new Set(["codex", "claude", "gemini"]).has(agent))
    throw new Error(`Unsupported AI_REVIEW_AGENT value: ${agent}`);
  if (!new Set(["skip", "comment"]).has(triggerMode))
    throw new Error(`Unsupported AI_REVIEW_TRIGGER_MODE value: ${triggerMode}`);
  const commentPath = `${api.root}/issues/${number}/comments`;
  const createComment = (body) =>
    api.request(commentPath, { method: "POST", body: JSON.stringify({ body }) });
  await assertCurrentPull(api, number, headSha);
  if (triggerMode === "comment") {
    const triggers = {
      codex: `@codex review ${headSha}`,
      claude: "@claude review once",
      gemini: "/gemini review",
    };
    // Revalidate at the mutation boundary; never request a review for a later push.
    await assertCurrentPull(api, number, headSha);
    try {
      await createComment(
        `${triggers[agent]}\n\n_Administrative AI Review trigger for ${headSha}. Prefer a trusted human-authored trigger if the native backend ignores bot comments._`,
      );
    } catch (error) {
      if (error.status !== 403) throw error;
      log.warn(
        `Could not post AI Review trigger comment: ${error.message}; waiting for existing or human-triggered review evidence instead.`,
      );
    }
  }
  const started = now();
  let pollMs = initialPollMs;
  let lastError;
  do {
    // Supersession is fatal and is deliberately outside the API retry handler.
    await assertCurrentPull(api, number, headSha);
    try {
      let accepted = false;
      if (agent === "claude") {
        accepted = (await api.list(commentPath)).some((comment) =>
          isAcceptableClaudeComment(comment, headSha, config),
        );
      } else {
        const reviews = await api.list(`${api.root}/pulls/${number}/reviews`);
        if (agent === "codex") {
          const [allComments, resolvedIds, comments] = await Promise.all([
            api.list(`${api.root}/pulls/${number}/comments`),
            api.resolvedCommentIds(number),
            api.list(commentPath),
          ]);
          const unresolved = allComments.filter(
            (comment) => !comment.in_reply_to_id && !resolvedIds.has(comment.id),
          );
          const evidence = latestCodexResult(reviews, unresolved, comments, headSha, config);
          accepted = evidence.result === "pass";
          if (accepted && evidence.comment) {
            // GitHub resolves abbreviated object IDs; ambiguous prefixes fail closed.
            for (const marker of codexCommentMarkers(evidence.comment.body)) {
              if (marker.length < 40) {
                const commit = await api.request(`${api.root}/commits/${marker}`);
                if (commit.sha !== headSha) accepted = false;
              }
            }
          }
        } else {
          accepted = reviews.some((review) =>
            isAcceptableNativeReview(review, agent, headSha, config),
          );
        }
      }
      if (accepted) {
        await assertCurrentPull(api, number, headSha);
        log.log(`AI Review gate passed for ${agent} on ${headSha}.`);
        return true;
      }
    } catch (error) {
      lastError = error;
    }
    const remaining = maxWaitMs - (now() - started);
    if (remaining <= 0) break;
    await sleep(Math.min(pollMs, remaining));
    pollMs = Math.min(pollMs * 2, maxPollMs);
  } while (now() - started <= maxWaitMs);
  // Do not post stale failure comments following supersession either.
  await assertCurrentPull(api, number, headSha);
  const detail = lastError ? ` Last API error: ${lastError.message}` : "";
  try {
    await createComment(
      `AI Review gate failed.\n\n- agent: ${agent}\n- head SHA: ${headSha}\n- expected: genuine native current-head review with no unresolved findings.${detail}`,
    );
  } catch (error) {
    log.warn(`Could not post AI Review gate failure comment: ${error.message}`);
  }
  log.error(`AI Review gate failed for ${agent} on ${headSha}.${detail}`);
  return false;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const env = process.env;
  try {
    if (!env.GITHUB_TOKEN || !env.GITHUB_REPOSITORY || !env.AI_REVIEW_PR_NUMBER)
      throw new Error(
        "GITHUB_TOKEN, GITHUB_REPOSITORY, AI_REVIEW_PR_NUMBER, and AI_REVIEW_HEAD_SHA are required.",
      );
    const accepted = await runReviewGate({
      api: createReviewApi(env.GITHUB_TOKEN, env.GITHUB_REPOSITORY),
      number: env.AI_REVIEW_PR_NUMBER,
      headSha: env.AI_REVIEW_HEAD_SHA,
      agent: (env.AI_REVIEW_AGENT || "codex").trim().toLowerCase(),
      triggerMode: (env.AI_REVIEW_TRIGGER_MODE || "skip").trim().toLowerCase(),
      config: readConfig(),
      maxWaitMs: Number(env.AI_REVIEW_WAIT_MS || 900000),
      initialPollMs: Number(env.AI_REVIEW_POLL_MS || 15000),
      maxPollMs: Number(env.AI_REVIEW_MAX_POLL_MS || 120000),
    });
    process.exitCode = accepted ? 0 : 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
