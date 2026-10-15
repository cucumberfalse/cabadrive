#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync, appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { isCodexWakeupComment, isTrustedReviewLogin } from "./ai-review-helpers.mjs";
import { assertCurrentPull, createReviewApi } from "./ai-review-api.mjs";
import { readConfig } from "./shared.mjs";

const checkpointMarker = "<!-- ai-review-wakeup:v1 ";
const workflowPath = ".github/workflows/ai-review.yml";
const isWorkflowBot = (comment) =>
  comment.user?.login === "github-actions[bot]" && comment.user?.type === "Bot";

export function wakeupPrNumber(eventName, event, repository, config = {}) {
  if (event.repository?.full_name !== repository) return null;
  if (eventName === "workflow_run") {
    const run = event.workflow_run;
    if (
      event.action !== "completed" ||
      run?.name !== "AI Review" ||
      run.event !== "pull_request" ||
      run.repository?.full_name !== repository ||
      run.pull_requests?.length !== 1
    )
      return null;
    return run.pull_requests[0].number;
  }
  const kinds = {
    issue_comment: ["created", "edited"],
    pull_request_review: ["submitted", "edited", "dismissed"],
    pull_request_review_comment: ["created", "edited", "deleted"],
  };
  if (!kinds[eventName]?.includes(event.action)) return null;
  const signal = eventName === "pull_request_review" ? event.review : event.comment;
  if (!isTrustedReviewLogin(signal?.user?.login, "codex", config)) return null;
  if (eventName === "issue_comment")
    return event.issue?.pull_request && isCodexWakeupComment(signal.body)
      ? event.issue.number
      : null;
  return event.pull_request?.number || null;
}

function parseCheckpoint(comments) {
  const ledgers = comments.filter(
    (comment) => isWorkflowBot(comment) && String(comment.body || "").startsWith(checkpointMarker),
  );
  if (ledgers.length > 1)
    throw new Error("Duplicate trusted wakeup checkpoints; refusing ambiguous scheduling state.");
  if (!ledgers.length) return null;
  const comment = ledgers[0];
  const match = comment.body.match(/^<!-- ai-review-wakeup:v1 (\{[^\n]+\}) -->$/);
  if (!match) throw new Error("Malformed trusted wakeup checkpoint.");
  const value = JSON.parse(match[1]);
  const keys = [
    "head_sha",
    "run_id",
    "source_attempt",
    "signal_hash",
    "signal_updated_at",
    "phase",
  ];
  if (
    Object.keys(value).sort().join() !== keys.sort().join() ||
    !/^[a-f0-9]{40}$/.test(value.head_sha) ||
    !Number.isSafeInteger(value.run_id) ||
    value.run_id <= 0 ||
    !Number.isSafeInteger(value.source_attempt) ||
    value.source_attempt <= 0 ||
    !/^[a-f0-9]{64}$/.test(value.signal_hash) ||
    !["claimed", "posting"].includes(value.phase) ||
    !Number.isFinite(Date.parse(value.signal_updated_at)) ||
    !Number.isFinite(Date.parse(comment.updated_at))
  )
    throw new Error("Invalid trusted wakeup checkpoint schema.");
  return { comment, value };
}

async function snapshot(api, number, headSha, config) {
  const [comments, reviews, inline, resolved] = await Promise.all([
    api.list(`${api.root}/issues/${number}/comments`),
    api.list(`${api.root}/pulls/${number}/reviews`),
    api.list(`${api.root}/pulls/${number}/comments`),
    api.resolvedCommentIds(number),
  ]);
  const signals = [
    ...comments
      .filter(
        (comment) =>
          isTrustedReviewLogin(comment.user?.login, "codex", config) &&
          isCodexWakeupComment(comment.body),
      )
      .map((comment) => ({
        type: "comment",
        id: comment.id,
        at: comment.updated_at || comment.created_at,
        body: comment.body,
        login: comment.user.login,
      })),
    ...reviews
      .filter(
        (review) =>
          isTrustedReviewLogin(review.user?.login, "codex", config) && review.commit_id === headSha,
      )
      .map((review) => ({
        type: "review",
        id: review.id,
        at: review.submitted_at,
        body: review.body,
        state: review.state,
        commit: review.commit_id,
        login: review.user.login,
      })),
    ...inline
      .filter((comment) => isTrustedReviewLogin(comment.user?.login, "codex", config))
      .map((comment) => ({
        type: "inline",
        id: comment.id,
        at: comment.updated_at || comment.created_at,
        body: comment.body,
        resolved: resolved.has(comment.in_reply_to_id || comment.id),
        login: comment.user.login,
      })),
  ].sort((left, right) => `${left.type}:${left.id}`.localeCompare(`${right.type}:${right.id}`));
  if (signals.some((signal) => !Number.isFinite(Date.parse(signal.at))))
    throw new Error("Missing trusted signal timestamp.");
  return {
    checkpoint: parseCheckpoint(comments),
    hash: createHash("sha256")
      .update(JSON.stringify({ headSha, agent: "codex", signals }))
      .digest("hex"),
    latest: Math.max(...signals.map((signal) => Date.parse(signal.at))),
    count: signals.length,
  };
}

function validRun(run, number, headSha, repository, workflowId) {
  return (
    run.workflow_id === workflowId &&
    run.path === workflowPath &&
    run.event === "pull_request" &&
    run.head_sha === headSha &&
    run.repository?.full_name === repository &&
    run.pull_requests?.length === 1 &&
    run.pull_requests[0].number === Number(number) &&
    Number.isSafeInteger(run.run_attempt) &&
    run.run_attempt > 0
  );
}

async function completionContext(api, event, repository) {
  const source = event.workflow_run;
  const native = source?.name === "AI Review Native Signal";
  if (
    event.action !== "completed" ||
    (!native && source?.name !== "AI Review") ||
    event.repository?.full_name !== repository ||
    !Number.isSafeInteger(source.id)
  )
    return null;
  const run = await api.request(`${api.root}/actions/runs/${source.id}`);
  const file = native ? "ai-review-native-signal.yml" : "ai-review.yml";
  const workflow = await api.request(`${api.root}/actions/workflows/${file}`);
  const allowedEvents = native
    ? ["pull_request_review", "pull_request_review_comment"]
    : ["pull_request"];
  if (
    run.repository?.full_name !== repository ||
    !allowedEvents.includes(run.event) ||
    run.workflow_id !== workflow.id ||
    run.path !== `.github/workflows/${file}` ||
    workflow.path !== run.path ||
    workflow.name !== source.name
  )
    throw new Error("Untrusted workflow completion identity.");
  let candidates;
  if (run.pull_requests?.length === 1)
    candidates = [await api.request(`${api.root}/pulls/${run.pull_requests[0].number}`)];
  else if (
    run.pull_requests?.length === 0 &&
    native &&
    run.head_repository?.full_name &&
    run.head_branch
  ) {
    const login = run.head_repository.full_name.split("/")[0];
    candidates = await api.list(
      `${api.root}/pulls?state=open&head=${encodeURIComponent(`${login}:${run.head_branch}`)}`,
    );
  } else throw new Error("Completion has no unambiguous PR association.");
  candidates = candidates.filter(
    (pull) =>
      pull.state === "open" &&
      !pull.draft &&
      pull.base?.repo?.full_name === repository &&
      (run.head_sha === pull.head?.sha || (native && run.head_sha === pull.merge_commit_sha)) &&
      (!native ||
        (pull.head?.repo?.full_name === run.head_repository?.full_name &&
          pull.head?.ref === run.head_branch)),
  );
  if (candidates.length !== 1)
    throw new Error("Completion does not identify one current exact-head PR.");
  const wakeupAt = native ? Date.parse(run.created_at || "") : 0;
  if (native && !Number.isFinite(wakeupAt))
    throw new Error("Missing native signal run creation timestamp.");
  return { number: candidates[0].number, headSha: candidates[0].head.sha, wakeupAt };
}

async function resolveWakeupContext(api, eventName, event, repository, config = {}) {
  if (eventName === "workflow_run") return completionContext(api, event, repository);
  const number = wakeupPrNumber(eventName, event, repository, config);
  return number ? { number, headSha: event.pull_request?.head?.sha || null } : null;
}

export async function resolveWakeupPrNumber(api, eventName, event, repository, config = {}) {
  return (await resolveWakeupContext(api, eventName, event, repository, config))?.number || null;
}

export async function routeReviewWakeup({
  api,
  eventName,
  event,
  repository,
  agent = "codex",
  config = {},
  now = Date.now,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
}) {
  if (agent !== "codex") return "ignored-backend";
  const context = await resolveWakeupContext(api, eventName, event, repository, config);
  const number = context?.number;
  if (!number) return "ignored-event";
  const pull = await api.request(`${api.root}/pulls/${number}`);
  const headSha = context.headSha || pull.head?.sha;
  await assertCurrentPull(api, number, headSha);
  if (
    eventName !== "workflow_run" &&
    event.pull_request?.head?.sha &&
    event.pull_request.head.sha !== headSha
  )
    return "stale-event";
  const workflow = await api.request(`${api.root}/actions/workflows/ai-review.yml`);
  if (workflow.path !== workflowPath || workflow.name !== "AI Review")
    throw new Error("Unexpected AI Review workflow identity.");
  const runs = (
    await api.list(
      `${api.root}/actions/workflows/${workflow.id}/runs?event=pull_request&head_sha=${headSha}`,
      "workflow_runs",
    )
  )
    .filter((run) => validRun(run, number, headSha, repository, workflow.id))
    .sort((left, right) => right.id - left.id);
  if (!runs.length) throw new Error("No exact-head pull-request AI Review run to rerun.");
  if (runs.length > 1 && runs[0].id === runs[1].id) throw new Error("Ambiguous AI Review run.");
  let run = await api.request(`${api.root}/actions/runs/${runs[0].id}`);
  if (!validRun(run, number, headSha, repository, workflow.id))
    throw new Error("Run identity changed.");
  if (
    eventName === "workflow_run" &&
    event.workflow_run.name === "AI Review" &&
    event.workflow_run.id !== run.id
  )
    return "stale-completion";
  let signal = await snapshot(api, number, headSha, config);
  if (!signal.count) return "no-signal";
  // Dismissal/deletion can preserve old REST timestamps. The verified native
  // event run creation time is a freshness hint only for the first checkpoint.
  if (!signal.checkpoint) signal.latest = Math.max(signal.latest, context.wakeupAt || 0);
  if (
    signal.checkpoint?.value.head_sha === headSha &&
    signal.checkpoint.value.run_id === run.id &&
    signal.checkpoint.value.source_attempt > run.run_attempt
  )
    throw new Error("Checkpoint refers to an impossible future run attempt.");
  const consumed = (state) =>
    state &&
    state.value.head_sha === headSha &&
    state.value.run_id === run.id &&
    state.value.signal_hash === signal.hash &&
    run.run_attempt > state.value.source_attempt &&
    Date.parse(run.run_started_at) > Date.parse(state.comment.updated_at) &&
    Date.parse(run.run_started_at) > signal.latest;
  if (consumed(signal.checkpoint)) return "already-evaluated";
  if (
    signal.checkpoint?.value.phase === "posting" &&
    signal.checkpoint.value.head_sha === headSha &&
    signal.checkpoint.value.run_id === run.id &&
    run.run_attempt <= signal.checkpoint.value.source_attempt
  ) {
    // Even a newer signal cannot overwrite uncertainty about a previous POST.
    for (let index = 0; index < 4; index += 1) {
      await assertCurrentPull(api, number, headSha);
      run = await api.request(`${api.root}/actions/runs/${run.id}`);
      if (!validRun(run, number, headSha, repository, workflow.id))
        throw new Error("Pending rerun identity changed.");
      if (run.run_attempt > signal.checkpoint.value.source_attempt) break;
      if (index < 3) await sleep(5000 * (index + 1));
    }
    if (run.run_attempt <= signal.checkpoint.value.source_attempt)
      throw new Error(
        "Prior rerun acceptance remains uncertain; authorized API reconciliation is required, no duplicate POST performed.",
      );
    if (consumed(signal.checkpoint)) return "rerun-confirmed";
  }
  if (
    !signal.checkpoint &&
    Math.max(signal.latest, context.wakeupAt || 0) < Date.parse(run.run_started_at)
  )
    return "older-than-attempt";
  if (
    signal.checkpoint?.value.head_sha === headSha &&
    signal.checkpoint.value.run_id === run.id &&
    signal.checkpoint.value.signal_hash === signal.hash &&
    run.run_attempt > signal.checkpoint.value.source_attempt
  ) {
    // Equal-second starts cannot prove ordering. Claim one post-boundary attempt.
    if (run.status !== "completed") return "active-boundary-attempt";
  }
  const old = signal.checkpoint;
  const sameClaim =
    old?.value.head_sha === headSha &&
    old.value.run_id === run.id &&
    old.value.source_attempt === run.run_attempt &&
    old.value.signal_hash === signal.hash;
  if (!sameClaim) {
    await assertCurrentPull(api, number, headSha);
    const liveRun = await api.request(`${api.root}/actions/runs/${run.id}`);
    const liveSignal = await snapshot(api, number, headSha, config);
    if (
      liveRun.run_attempt !== run.run_attempt ||
      liveRun.status !== run.status ||
      liveSignal.hash !== signal.hash ||
      JSON.stringify(liveSignal.checkpoint) !== JSON.stringify(signal.checkpoint)
    )
      throw new Error("Scheduling inputs changed before checkpoint claim; retry the new event.");
    const value = {
      head_sha: headSha,
      run_id: run.id,
      source_attempt: run.run_attempt,
      signal_hash: signal.hash,
      signal_updated_at: new Date(signal.latest).toISOString(),
      phase: "claimed",
    };
    const path = old
      ? `${api.root}/issues/comments/${old.comment.id}`
      : `${api.root}/issues/${number}/comments`;
    const comment = await api.request(path, {
      method: old ? "PATCH" : "POST",
      body: JSON.stringify({ body: `${checkpointMarker}${JSON.stringify(value)} -->` }),
    });
    if (!isWorkflowBot(comment))
      throw new Error("Checkpoint must be authored by github-actions[bot], never a human token.");
    signal = { ...signal, checkpoint: { comment, value } };
  }
  if (run.status !== "completed") return "pending-active-completion";
  if (signal.checkpoint.value.phase === "posting") {
    // A previous POST may have been accepted. Reconcile without another POST.
    for (let index = 0; index < 4; index += 1) {
      await assertCurrentPull(api, number, headSha);
      run = await api.request(`${api.root}/actions/runs/${run.id}`);
      if (!validRun(run, number, headSha, repository, workflow.id))
        throw new Error("Pending rerun identity changed.");
      if (consumed(signal.checkpoint)) return "rerun-confirmed";
      if (index < 3) await sleep(5000 * (index + 1));
    }
    throw new Error(
      "Prior rerun acceptance remains uncertain; authorized API reconciliation is required, no duplicate POST performed.",
    );
  }
  await assertCurrentPull(api, number, headSha);
  const claimRun = await api.request(`${api.root}/actions/runs/${run.id}`);
  const claimSignal = await snapshot(api, number, headSha, config);
  if (
    !validRun(claimRun, number, headSha, repository, workflow.id) ||
    claimRun.run_attempt !== run.run_attempt ||
    claimRun.status !== "completed" ||
    claimSignal.hash !== signal.hash ||
    JSON.stringify(claimSignal.checkpoint) !== JSON.stringify(signal.checkpoint)
  )
    throw new Error("Scheduling inputs changed before posting claim.");
  const postingValue = { ...signal.checkpoint.value, phase: "posting" };
  const posting = await api.request(`${api.root}/issues/comments/${signal.checkpoint.comment.id}`, {
    method: "PATCH",
    body: JSON.stringify({ body: `${checkpointMarker}${JSON.stringify(postingValue)} -->` }),
  });
  if (!isWorkflowBot(posting)) throw new Error("Posting checkpoint author changed.");
  signal = { ...signal, checkpoint: { comment: posting, value: postingValue } };
  // GitHub timestamps have second precision. Start the rerun after both server
  // timestamps, so its attempt can prove that it consumed this immutable claim.
  const boundary = Math.max(Date.parse(signal.checkpoint.comment.updated_at), signal.latest) + 1100;
  if (now() <= boundary) await sleep(boundary - now() + 1);
  await assertCurrentPull(api, number, headSha);
  const currentRun = await api.request(`${api.root}/actions/runs/${run.id}`);
  const currentSignal = await snapshot(api, number, headSha, config);
  if (
    !validRun(currentRun, number, headSha, repository, workflow.id) ||
    currentRun.run_attempt !== run.run_attempt ||
    currentRun.status !== "completed" ||
    currentSignal.hash !== signal.hash ||
    JSON.stringify(currentSignal.checkpoint) !== JSON.stringify(signal.checkpoint)
  )
    throw new Error("Scheduling inputs changed before rerun; no mutation performed.");
  // A prior crash before POST leaves a retryable claim. An uncertain POST is
  // reconciled here and never blindly repeated during the same invocation.
  let postError;
  try {
    await api.request(`${api.root}/actions/runs/${run.id}/rerun`, { method: "POST" });
  } catch (error) {
    postError = error;
  }
  for (let index = 0; index < 4; index += 1) {
    await assertCurrentPull(api, number, headSha);
    run = await api.request(`${api.root}/actions/runs/${run.id}`);
    if (!validRun(run, number, headSha, repository, workflow.id))
      throw new Error("Rerun identity changed.");
    if (consumed(signal.checkpoint)) return "rerun-confirmed";
    if (index < 3) await sleep(5000 * (index + 1));
  }
  throw new Error(
    `Rerun acceptance could not be confirmed; checkpoint remains pending and requires API reconciliation.${postError ? ` ${postError.message}` : ""}`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const env = process.env;
    if (!env.GITHUB_TOKEN || !env.GITHUB_REPOSITORY || !env.GITHUB_EVENT_PATH)
      throw new Error("Missing wakeup environment.");
    const api = createReviewApi(env.GITHUB_TOKEN, env.GITHUB_REPOSITORY);
    const event = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, "utf8"));
    if (process.argv.includes("--resolve-only")) {
      const number = await resolveWakeupPrNumber(
        api,
        env.GITHUB_EVENT_NAME,
        event,
        env.GITHUB_REPOSITORY,
        readConfig(),
      );
      if (env.GITHUB_OUTPUT) appendFileSync(env.GITHUB_OUTPUT, `pr_number=${number || ""}\n`);
      else console.log(number || "");
    } else
      console.log(
        await routeReviewWakeup({
          api,
          eventName: env.GITHUB_EVENT_NAME,
          event,
          repository: env.GITHUB_REPOSITORY,
          agent: (env.AI_REVIEW_AGENT || "codex").toLowerCase(),
          config: readConfig(),
        }),
      );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
