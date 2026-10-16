#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync, appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { isCodexWakeupComment, isTrustedReviewLogin } from "./ai-review-helpers.mjs";
import { assertCurrentPull, createReviewApi } from "./ai-review-api.mjs";
import { readConfig } from "./shared.mjs";
import { evaluateCodexReview } from "./ai-review-gate.mjs";

const checkpointMarker = "<!-- ai-review-wakeup:v1 ";
const historyMarker = "<!-- ai-review-wakeup:v2 ";
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
    issue_comment: ["created", "edited", "deleted"],
    pull_request_review: ["submitted", "edited", "dismissed"],
    pull_request_review_comment: ["created", "edited", "deleted"],
  };
  if (!kinds[eventName]?.includes(event.action)) return null;
  const signal = eventName === "pull_request_review" ? event.review : event.comment;
  if (!isTrustedReviewLogin(signal?.user?.login, "codex", config)) return null;
  if (eventName === "issue_comment")
    return event.issue?.pull_request &&
      (isCodexWakeupComment(signal.body) || isReceiptWithdrawal(event))
      ? event.issue.number
      : null;
  return event.pull_request?.number || null;
}

function isReceiptWithdrawal(event) {
  return (
    (event.action === "edited" && isCodexWakeupComment(event.changes?.body?.from)) ||
    (event.action === "deleted" && isCodexWakeupComment(event.comment?.body))
  );
}
const positiveInteger = (value) => Number.isSafeInteger(value) && value > 0;
const finiteTime = (value) => typeof value === "string" && Number.isFinite(Date.parse(value));
const checkpointBody = (value) =>
  `${value.acceptance ? historyMarker : checkpointMarker}${JSON.stringify(value)} -->`;

function parseCheckpoint(comments) {
  const ledgers = comments.filter(
    (comment) =>
      isWorkflowBot(comment) && String(comment.body || "").startsWith("<!-- ai-review-wakeup:"),
  );
  if (ledgers.length > 1)
    throw new Error("Duplicate trusted wakeup checkpoints; refusing ambiguous scheduling state.");
  if (!ledgers.length) return null;
  const comment = ledgers[0];
  const match = comment.body.match(/^<!-- ai-review-wakeup:v([12]) (\{[^\n]+\}) -->$/);
  if (!match) throw new Error("Malformed trusted wakeup checkpoint.");
  const value = JSON.parse(match[2]);
  const history = match[1] === "2";
  const keys = [
    "head_sha",
    "run_id",
    "source_attempt",
    "signal_hash",
    "signal_updated_at",
    "phase",
  ];
  if (history) keys.push("pr_number", "workflow_id", "agent", "acceptance");
  const proof = value.acceptance;
  if (
    history &&
    (JSON.stringify(value) !== match[2] ||
      !positiveInteger(value.pr_number) ||
      !positiveInteger(value.workflow_id) ||
      value.agent !== "codex" ||
      !proof ||
      Object.keys(proof).sort().join() !==
        ["attempt", "job_id", "started_at", "accepted_at", "sources"].sort().join() ||
      !positiveInteger(proof.attempt) ||
      proof.attempt > value.source_attempt ||
      (value.phase === "observed" && proof.attempt !== value.source_attempt) ||
      !positiveInteger(proof.job_id) ||
      !finiteTime(proof.started_at) ||
      !finiteTime(proof.accepted_at) ||
      Date.parse(proof.accepted_at) < Date.parse(proof.started_at) ||
      Date.parse(proof.accepted_at) > Date.parse(comment.updated_at) ||
      Date.parse(value.signal_updated_at) < Date.parse(proof.accepted_at) ||
      !Array.isArray(proof.sources) ||
      proof.sources.some(
        (source) =>
          !source ||
          Object.keys(source).sort().join() !== "id,login" ||
          !positiveInteger(source.id) ||
          typeof source.login !== "string" ||
          !source.login,
      ) ||
      new Set(proof.sources.map((source) => source.id)).size !== proof.sources.length)
  )
    throw new Error("Invalid trusted acceptance history schema.");
  if (
    Object.keys(value).sort().join() !== keys.sort().join() ||
    !/^[a-f0-9]{40}$/.test(value.head_sha) ||
    !Number.isSafeInteger(value.run_id) ||
    value.run_id <= 0 ||
    !Number.isSafeInteger(value.source_attempt) ||
    value.source_attempt <= 0 ||
    !/^[a-f0-9]{64}$/.test(value.signal_hash) ||
    !(history ? ["observed", "claimed", "posting"] : ["claimed", "posting"]).includes(
      value.phase,
    ) ||
    !Number.isFinite(Date.parse(value.signal_updated_at)) ||
    !Number.isFinite(Date.parse(comment.updated_at))
  )
    throw new Error("Invalid trusted wakeup checkpoint schema.");
  return { comment, value };
}

function confirmsCheckpointAttempt(run, checkpoint, observedAt) {
  const started = Date.parse(run.run_started_at);
  const posted = Date.parse(checkpoint.comment.updated_at);
  const included = Date.parse(checkpoint.value.signal_updated_at);
  return (
    run.run_attempt > checkpoint.value.source_attempt &&
    [started, posted, included, observedAt].every(Number.isFinite) &&
    started <= observedAt &&
    started > posted &&
    started > included
  );
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
    latest: signals.length ? Math.max(...signals.map((signal) => Date.parse(signal.at))) : null,
    sources: signals
      .filter((signal) => signal.type === "comment")
      .map(({ id, login }) => ({ id, login })),
    count: signals.length,
    desired: await evaluateCodexReview(api, reviews, inline, comments, resolved, headSha, config),
  };
}

async function acceptedGateHistory(api, run, headSha, sources, observedAt) {
  try {
    const jobs = await api.list(
      `${api.root}/actions/runs/${run.id}/attempts/${run.run_attempt}/jobs`,
      "jobs",
    );
    const expected = jobs.filter((job) => job.name === "AI Review");
    if (expected.length !== 1) return null;
    const job = expected[0];
    const steps = job.steps?.filter(
      (step) => step.name === "Route and validate selected native review",
    );
    if (
      !positiveInteger(job.id) ||
      job.run_id !== run.id ||
      job.head_sha !== headSha ||
      job.status !== "completed" ||
      job.conclusion !== "success" ||
      steps?.length !== 1 ||
      (job.run_attempt !== undefined && job.run_attempt !== run.run_attempt)
    )
      return null;
    const step = steps[0];
    const times = [
      run.run_started_at,
      job.started_at,
      step.started_at,
      step.completed_at,
      job.completed_at,
    ];
    if (
      step.status !== "completed" ||
      step.conclusion !== "success" ||
      !positiveInteger(step.number) ||
      !times.every(finiteTime)
    )
      return null;
    const chronology = times.map(Date.parse);
    if (
      chronology.some((time, index) => time > observedAt || (index && time < chronology[index - 1]))
    )
      return null;
    const body = await api.readJobLog(job.id);
    if (
      typeof body !== "string" ||
      Buffer.byteLength(body) > 2 * 1024 * 1024 ||
      body.replace(/\r\n/g, "").includes("\r")
    )
      return null;
    const outcomes = body
      .replace(/\r\n/g, "\n")
      .split("\n")
      .filter((line) => /AI Review gate (?:passed|failed)/.test(line));
    if (outcomes.length !== 1) return null;
    const stamped = outcomes[0].match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3,7}Z) (.*)$/);
    if (
      stamped &&
      (!Number.isFinite(Date.parse(stamped[1])) ||
        Date.parse(stamped[1]) < chronology[2] ||
        Date.parse(stamped[1]) > chronology[3])
    )
      return null;
    if ((stamped ? stamped[2] : outcomes[0]) !== `AI Review gate passed for codex on ${headSha}.`)
      return null;
    return {
      attempt: run.run_attempt,
      job_id: job.id,
      started_at: run.run_started_at,
      accepted_at: step.completed_at,
      sources,
    };
  } catch {
    return null;
  }
}

async function associatedRunPull(api, run, repository, { nativeSignal = false } = {}) {
  if (
    !Array.isArray(run.pull_requests) ||
    run.pull_requests.length > 1 ||
    !/^[a-f0-9]{40}$/.test(run.head_sha || "") ||
    !/^[a-z0-9_.-]+\/[a-z0-9_.-]+$/i.test(run.head_repository?.full_name || "") ||
    typeof run.head_branch !== "string" ||
    !run.head_branch
  )
    return null;
  const baseNative = nativeSignal && run.head_repository.full_name === repository;
  const matches = (pull) =>
    pull.state === "open" &&
    Number.isSafeInteger(pull.number) &&
    pull.number > 0 &&
    /^[a-f0-9]{40}$/.test(pull.head?.sha || "") &&
    /^[a-z0-9_.-]+\/[a-z0-9_.-]+$/i.test(pull.head?.repo?.full_name || "") &&
    (baseNative || pull.head.repo.full_name === run.head_repository.full_name) &&
    pull.head?.ref === run.head_branch &&
    (run.head_sha === pull.head.sha || (nativeSignal && run.head_sha === pull.merge_commit_sha));
  let candidates;
  if (run.pull_requests.length === 1) {
    const number = run.pull_requests[0].number;
    if (!Number.isSafeInteger(number) || number <= 0) return null;
    const linked = await api.request(`${api.root}/pulls/${number}`);
    if (linked.number !== number) return null;
    candidates = [linked];
  } else {
    const login = run.head_repository.full_name.split("/")[0];
    candidates = await api.list(
      baseNative
        ? `${api.root}/pulls?state=open`
        : `${api.root}/pulls?state=open&head=${encodeURIComponent(`${login}:${run.head_branch}`)}`,
    );
  }
  // Missing source association cannot choose between drafts or base branches.
  // Determine uniqueness before applying the selected PR's eligibility policy.
  const matching = candidates.filter(matches);
  if (matching.length !== 1) return null;
  const selected = matching[0];
  if (selected.draft || selected.base?.repo?.full_name !== repository) return null;
  const live =
    run.pull_requests.length === 1
      ? selected
      : await api.request(`${api.root}/pulls/${selected.number}`);
  return matches(live) &&
    live.number === selected.number &&
    live.head.sha === selected.head.sha &&
    live.head.repo.full_name === selected.head.repo.full_name &&
    !live.draft &&
    live.base?.repo?.full_name === repository
    ? live
    : null;
}

async function validRun(api, run, number, headSha, repository, workflowId) {
  if (
    !(
      run.workflow_id === workflowId &&
      run.path === workflowPath &&
      run.event === "pull_request" &&
      run.head_sha === headSha &&
      run.repository?.full_name === repository &&
      (run.pull_requests?.length === 0 ||
        (run.pull_requests?.length === 1 && run.pull_requests[0].number === Number(number))) &&
      Number.isSafeInteger(run.run_attempt) &&
      run.run_attempt > 0
    )
  )
    return false;
  const pull = await associatedRunPull(api, run, repository);
  return pull?.number === Number(number) && pull.head.sha === headSha;
}

async function completionContext(api, event, repository, config) {
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
    workflow.name !== source.name ||
    run.id !== source.id ||
    !Number.isSafeInteger(run.run_attempt) ||
    run.run_attempt <= 0
  )
    throw new Error("Untrusted workflow completion identity.");
  if (
    native &&
    (!isTrustedReviewLogin(run.actor?.login, "codex", config) ||
      !isTrustedReviewLogin(run.triggering_actor?.login, "codex", config))
  )
    throw new Error("Untrusted native source actor provenance.");
  const pull = await associatedRunPull(api, run, repository, { nativeSignal: native });
  if (!pull) throw new Error("Completion does not identify one current exact-head PR.");
  const wakeupAt = native ? Date.parse(run.created_at || "") : 0;
  if (native && !Number.isFinite(wakeupAt))
    throw new Error("Missing native signal run creation timestamp.");
  return {
    number: pull.number,
    headSha: pull.head.sha,
    wakeupAt,
    sourceRunId: run.id,
    sourceAttempt: run.run_attempt,
  };
}

async function resolveWakeupContext(api, eventName, event, repository, config = {}) {
  if (eventName === "workflow_run") return completionContext(api, event, repository, config);
  const number = wakeupPrNumber(eventName, event, repository, config);
  if (!number) return null;
  if (eventName === "issue_comment" && isReceiptWithdrawal(event)) {
    const original = event.comment;
    if (
      !positiveInteger(number) ||
      !positiveInteger(original?.id) ||
      original.issue_url !== `https://api.github.com${api.root}/issues/${number}`
    )
      throw new Error("Invalid withdrawal comment identity.");
    let current;
    try {
      current = await api.request(`${api.root}/issues/comments/${original.id}`);
    } catch (error) {
      if (event.action !== "deleted" || error.status !== 404) throw error;
    }
    if (event.action === "deleted" && current) throw new Error("Deleted receipt still exists.");
    if (
      event.action === "edited" &&
      (!current ||
        current.id !== original.id ||
        current.issue_url !== original.issue_url ||
        current.user?.login !== original.user.login ||
        current.body !== original.body ||
        current.updated_at !== original.updated_at ||
        !finiteTime(current.updated_at))
    )
      throw new Error("Withdrawal edit identity or current state changed.");
    const pull = await api.request(`${api.root}/pulls/${number}`);
    await assertCurrentPull(api, number, pull.head?.sha);
    return {
      number,
      headSha: pull.head.sha,
      withdrawal: {
        id: original.id,
        login: original.user.login,
        action: event.action,
        updated_at: current?.updated_at || null,
      },
    };
  }
  return { number, headSha: event.pull_request?.head?.sha || null };
}

export async function resolveWakeupPrNumber(api, eventName, event, repository, config = {}) {
  return (await resolveWakeupContext(api, eventName, event, repository, config))?.number || null;
}

export async function discoverWakeupPulls(api, repository) {
  if (api.root !== `/repos/${repository}`) throw new Error("Foreign discovery repository.");
  const pulls = await api.list(`${api.root}/pulls?state=open`);
  const targets = [];
  for (const pull of pulls) {
    if (pull.state !== "open" || pull.draft || pull.base?.repo?.full_name !== repository) continue;
    if (
      !Number.isSafeInteger(pull.number) ||
      pull.number <= 0 ||
      !/^[a-f0-9]{40}$/.test(pull.head?.sha || "")
    )
      throw new Error("Invalid scheduled PR discovery identity.");
    await assertCurrentPull(api, pull.number, pull.head.sha);
    targets.push({ number: pull.number, head_sha: pull.head.sha });
  }
  if (new Set(targets.map((pull) => pull.number)).size !== targets.length || targets.length > 256)
    throw new Error("Duplicate or oversized scheduled PR matrix.");
  return targets;
}

export async function routeReviewWakeup({
  api,
  eventName,
  event,
  repository,
  agent = "codex",
  config = {},
  scheduledPull = null,
  now = Date.now,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
}) {
  if (agent !== "codex") return "ignored-backend";
  const scheduled = eventName === "schedule";
  const completion = eventName === "workflow_run";
  const withdrawal = eventName === "issue_comment" && isReceiptWithdrawal(event);
  // Copy the context-job pair before API awaits; it also determines the job's lock.
  const pinnedPull =
    scheduled || completion || withdrawal
      ? { number: scheduledPull?.number, headSha: scheduledPull?.head_sha }
      : null;
  if (
    pinnedPull &&
    (event.repository?.full_name !== repository ||
      !Number.isSafeInteger(pinnedPull.number) ||
      pinnedPull.number <= 0 ||
      typeof pinnedPull.headSha !== "string" ||
      !/^[a-f0-9]{40}$/.test(pinnedPull.headSha))
  )
    throw new Error(
      completion
        ? "Invalid pinned workflow completion context."
        : "Invalid pinned scheduled PR context.",
    );
  const context = scheduled
    ? pinnedPull
    : await resolveWakeupContext(api, eventName, event, repository, config);
  if (
    (completion || withdrawal) &&
    (context?.number !== pinnedPull.number || context.headSha !== pinnedPull.headSha)
  )
    throw new Error("Workflow completion or withdrawal does not match the pinned PR/head context.");
  const number = context?.number;
  if (!number) return "ignored-event";
  const assertSourceContext = async () => {
    if (
      !scheduled &&
      JSON.stringify(await resolveWakeupContext(api, eventName, event, repository, config)) !==
        JSON.stringify(context)
    )
      throw new Error("Wakeup source identity or configured trust changed.");
  };
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
  const candidates = await api.list(
    `${api.root}/actions/workflows/${workflow.id}/runs?event=pull_request&head_sha=${headSha}`,
    "workflow_runs",
  );
  const runs = [];
  for (const candidate of candidates)
    if (await validRun(api, candidate, number, headSha, repository, workflow.id))
      runs.push(candidate);
  runs.sort((left, right) => right.id - left.id);
  if (!runs.length) throw new Error("No exact-head pull-request AI Review run to rerun.");
  if (runs.length > 1 && runs[0].id === runs[1].id) throw new Error("Ambiguous AI Review run.");
  let run = await api.request(`${api.root}/actions/runs/${runs[0].id}`);
  if (!(await validRun(api, run, number, headSha, repository, workflow.id)))
    throw new Error("Run identity changed.");
  if (
    eventName === "workflow_run" &&
    event.workflow_run.name === "AI Review" &&
    event.workflow_run.id !== run.id
  )
    return "stale-completion";
  let signal = await snapshot(api, number, headSha, config);
  const applicableCheckpoint =
    signal.checkpoint?.value.head_sha === headSha && signal.checkpoint.value.run_id === run.id;
  if (
    signal.checkpoint?.value.acceptance &&
    (signal.checkpoint.value.pr_number !== number ||
      signal.checkpoint.value.workflow_id !== workflow.id)
  )
    throw new Error("Acceptance history belongs to another PR or workflow.");
  if (applicableCheckpoint && signal.checkpoint.value.source_attempt > run.run_attempt)
    throw new Error("Checkpoint refers to an impossible future run attempt.");
  if (signal.checkpoint?.value.phase === "posting") {
    const prior = signal.checkpoint;
    let settled = false;
    for (let index = 0; index < 4; index += 1) {
      await assertCurrentPull(api, number, headSha);
      const previous = await api.request(`${api.root}/actions/runs/${prior.value.run_id}`);
      if (applicableCheckpoint) {
        if (
          previous.id !== prior.value.run_id ||
          !(await validRun(api, previous, number, headSha, repository, workflow.id))
        )
          throw new Error("Pending rerun identity changed.");
        if (previous.run_attempt < prior.value.source_attempt)
          throw new Error("Checkpoint refers to an impossible future run attempt.");
        run = previous;
      }
      // A historical run cannot match the live head after a push. This read-only
      // proof settles its old POST only; current mutations still use validRun.
      else if (
        previous.id !== prior.value.run_id ||
        previous.workflow_id !== workflow.id ||
        previous.path !== workflowPath ||
        previous.event !== "pull_request" ||
        previous.repository?.full_name !== repository ||
        previous.head_sha !== prior.value.head_sha ||
        previous.head_repository?.full_name !== pull.head?.repo?.full_name ||
        previous.head_branch !== pull.head?.ref ||
        !Array.isArray(previous.pull_requests) ||
        previous.pull_requests.length > 1 ||
        (previous.pull_requests.length === 1 && previous.pull_requests[0].number !== number) ||
        !Number.isSafeInteger(previous.run_attempt) ||
        previous.run_attempt < prior.value.source_attempt
      )
        throw new Error("Prior checkpoint run identity or attempt is invalid.");
      settled = confirmsCheckpointAttempt(previous, prior, now());
      if (settled) break;
      if (index < 3) await sleep(5000 * (index + 1));
    }
    if (!settled)
      throw new Error(
        "Prior rerun acceptance remains uncertain; no overwrite or duplicate POST performed.",
      );
  }
  // Dismissal/deletion can preserve old REST timestamps. The verified native
  // event run creation time is a freshness hint only for the first checkpoint.
  if (!applicableCheckpoint) signal.latest = Math.max(signal.latest, context.wakeupAt || 0);
  const consumed = (state) =>
    state &&
    state.value.head_sha === headSha &&
    state.value.run_id === run.id &&
    state.value.signal_hash === signal.hash &&
    confirmsCheckpointAttempt(run, state, now()) &&
    Date.parse(run.run_started_at) > signal.latest;
  const alreadyConsumed = consumed(signal.checkpoint);
  let acceptance = null;
  // This happens only after any immutable POST has been positively settled.
  // A successful consumed rerun may have accepted transient evidence before the
  // old absent/blocking hash returned. Only that latest attempt's native proof
  // can authorize another evaluation; older history cannot establish convergence.
  if (
    run.status === "completed" &&
    run.conclusion === "success" &&
    (signal.desired !== "fail" || alreadyConsumed)
  ) {
    const existing = applicableCheckpoint ? signal.checkpoint?.value.acceptance : null;
    if (
      existing?.attempt === run.run_attempt &&
      Date.parse(existing.started_at) === Date.parse(run.run_started_at) &&
      Date.parse(existing.accepted_at) <= now()
    )
      acceptance = existing;
    else acceptance = await acceptedGateHistory(api, run, headSha, signal.sources, now());
    if (alreadyConsumed && signal.desired !== "pass" && !acceptance)
      throw new Error("Latest successful native acceptance requires evidence reconciliation.");
    if (acceptance) {
      await assertSourceContext();
      await assertCurrentPull(api, number, headSha);
      const provenRun = await api.request(`${api.root}/actions/runs/${run.id}`);
      if (
        !(await validRun(api, provenRun, number, headSha, repository, workflow.id)) ||
        provenRun.run_attempt !== run.run_attempt ||
        provenRun.status !== run.status ||
        provenRun.conclusion !== run.conclusion ||
        provenRun.run_started_at !== run.run_started_at
      )
        throw new Error("Native acceptance history attempt changed.");
      if (signal.desired === "pass") {
        if (
          signal.checkpoint?.value.phase === "observed" &&
          signal.checkpoint.value.signal_hash === signal.hash &&
          existing === acceptance
        )
          return "already-observed";
        const live = await snapshot(api, number, headSha, config);
        if (
          live.hash !== signal.hash ||
          JSON.stringify(live.checkpoint) !== JSON.stringify(signal.checkpoint)
        )
          throw new Error("Native observation inputs changed.");
        await assertSourceContext();
        await assertCurrentPull(api, number, headSha);
        const finalRun = await api.request(`${api.root}/actions/runs/${run.id}`);
        if (
          !(await validRun(api, finalRun, number, headSha, repository, workflow.id)) ||
          finalRun.run_attempt !== run.run_attempt ||
          finalRun.status !== "completed" ||
          finalRun.conclusion !== "success" ||
          finalRun.run_started_at !== run.run_started_at
        )
          throw new Error("Native observation run changed.");
        const value = {
          head_sha: headSha,
          run_id: run.id,
          source_attempt: run.run_attempt,
          signal_hash: signal.hash,
          signal_updated_at: new Date(
            Math.max(signal.latest || 0, Date.parse(acceptance.accepted_at)),
          ).toISOString(),
          phase: "observed",
          pr_number: number,
          workflow_id: workflow.id,
          agent: "codex",
          acceptance,
        };
        const old = signal.checkpoint;
        const written = await api.request(
          old
            ? `${api.root}/issues/comments/${old.comment.id}`
            : `${api.root}/issues/${number}/comments`,
          {
            method: old ? "PATCH" : "POST",
            body: JSON.stringify({ body: checkpointBody(value) }),
          },
        );
        if (!isWorkflowBot(written))
          throw new Error("Observation must be authored by the workflow bot.");
        return "observed-native-acceptance";
      }
      signal.latest = Math.max(signal.latest || 0, Date.parse(acceptance.accepted_at));
    }
  }
  const invalidatedAcceptance = acceptance && signal.desired !== "pass";
  if (alreadyConsumed && !invalidatedAcceptance) return "already-evaluated";
  // Neutral summaries and an empty snapshot have the same lack of a verdict.
  // Neither delivery type nor an opaque settled claim proves native acceptance.
  if (signal.desired === null && !invalidatedAcceptance)
    return signal.count ? "no-native-outcome" : "no-signal";
  if (!signal.count && !invalidatedAcceptance) return "no-signal";
  if (scheduled && !applicableCheckpoint && !invalidatedAcceptance) {
    if (run.status !== "completed") return "active-no-baseline";
    if (signal.desired === null) return "no-native-outcome";
    const actual =
      run.conclusion === "success" ? "pass" : run.conclusion === "failure" ? "fail" : null;
    if (!actual || actual === signal.desired) return "matching-outcome";
  }
  if (
    !scheduled &&
    !invalidatedAcceptance &&
    !applicableCheckpoint &&
    Math.max(signal.latest, context.wakeupAt || 0) < Date.parse(run.run_started_at)
  )
    return "older-than-attempt";
  if (
    signal.checkpoint?.value.phase === "claimed" &&
    signal.checkpoint.value.head_sha === headSha &&
    signal.checkpoint.value.run_id === run.id &&
    signal.checkpoint.value.signal_hash === signal.hash &&
    run.run_attempt > signal.checkpoint.value.source_attempt
  ) {
    // Only an unposted claim may retry an ambiguous timestamp boundary.
    if (run.status !== "completed") return "active-boundary-attempt";
  }
  const matchesAcceptance = (candidate) =>
    !acceptance ||
    (candidate.run_attempt === acceptance.attempt &&
      candidate.run_started_at === acceptance.started_at &&
      candidate.status === "completed" &&
      candidate.conclusion === "success");
  const old = signal.checkpoint;
  const sameClaim =
    old?.value.phase !== "observed" &&
    old?.value.head_sha === headSha &&
    old.value.run_id === run.id &&
    old.value.source_attempt === run.run_attempt &&
    old.value.signal_hash === signal.hash &&
    (!acceptance || JSON.stringify(old.value.acceptance) === JSON.stringify(acceptance));
  if (!sameClaim) {
    await assertSourceContext();
    await assertCurrentPull(api, number, headSha);
    const liveRun = await api.request(`${api.root}/actions/runs/${run.id}`);
    const liveSignal = await snapshot(api, number, headSha, config);
    if (
      !(await validRun(api, liveRun, number, headSha, repository, workflow.id)) ||
      !matchesAcceptance(liveRun) ||
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
      ...(acceptance
        ? { pr_number: number, workflow_id: workflow.id, agent: "codex", acceptance }
        : {}),
    };
    const path = old
      ? `${api.root}/issues/comments/${old.comment.id}`
      : `${api.root}/issues/${number}/comments`;
    const comment = await api.request(path, {
      method: old ? "PATCH" : "POST",
      body: JSON.stringify({ body: checkpointBody(value) }),
    });
    if (!isWorkflowBot(comment))
      throw new Error("Checkpoint must be authored by github-actions[bot], never a human token.");
    signal = { ...signal, checkpoint: { comment, value } };
  }
  if (run.status !== "completed") return "pending-active-completion";
  await assertCurrentPull(api, number, headSha);
  await assertSourceContext();
  const claimRun = await api.request(`${api.root}/actions/runs/${run.id}`);
  const claimSignal = await snapshot(api, number, headSha, config);
  if (
    !(await validRun(api, claimRun, number, headSha, repository, workflow.id)) ||
    !matchesAcceptance(claimRun) ||
    claimRun.run_attempt !== run.run_attempt ||
    claimRun.status !== "completed" ||
    claimSignal.hash !== signal.hash ||
    JSON.stringify(claimSignal.checkpoint) !== JSON.stringify(signal.checkpoint)
  )
    throw new Error("Scheduling inputs changed before posting claim.");
  const postingValue = { ...signal.checkpoint.value, phase: "posting" };
  const posting = await api.request(`${api.root}/issues/comments/${signal.checkpoint.comment.id}`, {
    method: "PATCH",
    body: JSON.stringify({ body: checkpointBody(postingValue) }),
  });
  if (!isWorkflowBot(posting)) throw new Error("Posting checkpoint author changed.");
  signal = { ...signal, checkpoint: { comment: posting, value: postingValue } };
  // GitHub timestamps have second precision. Start the rerun after both server
  // timestamps, so its attempt can prove that it consumed this immutable claim.
  const boundary = Math.max(Date.parse(signal.checkpoint.comment.updated_at), signal.latest) + 1100;
  if (now() <= boundary) await sleep(boundary - now() + 1);
  await assertSourceContext();
  await assertCurrentPull(api, number, headSha);
  const currentRun = await api.request(`${api.root}/actions/runs/${run.id}`);
  const currentSignal = await snapshot(api, number, headSha, config);
  if (
    !(await validRun(api, currentRun, number, headSha, repository, workflow.id)) ||
    !matchesAcceptance(currentRun) ||
    currentRun.run_attempt !== run.run_attempt ||
    currentRun.status !== "completed" ||
    currentSignal.hash !== signal.hash ||
    JSON.stringify(currentSignal.checkpoint) !== JSON.stringify(signal.checkpoint)
  )
    throw new Error("Scheduling inputs changed before rerun; no mutation performed.");
  // Only this invocation submits the new posting claim. Later deliveries must
  // prove its actual later attempt before replacing it or submitting another POST.
  let postError;
  try {
    await api.request(`${api.root}/actions/runs/${run.id}/rerun`, { method: "POST" });
  } catch (error) {
    postError = error;
  }
  for (let index = 0; index < 4; index += 1) {
    await assertCurrentPull(api, number, headSha);
    run = await api.request(`${api.root}/actions/runs/${run.id}`);
    if (!(await validRun(api, run, number, headSha, repository, workflow.id)))
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
      const context =
        env.GITHUB_EVENT_NAME === "schedule"
          ? null
          : await resolveWakeupContext(
              api,
              env.GITHUB_EVENT_NAME,
              event,
              env.GITHUB_REPOSITORY,
              readConfig(),
            );
      const targets =
        (env.AI_REVIEW_AGENT || "codex").toLowerCase() !== "codex"
          ? []
          : env.GITHUB_EVENT_NAME === "schedule"
            ? await discoverWakeupPulls(api, env.GITHUB_REPOSITORY)
            : context
              ? [{ number: context.number, head_sha: context.headSha || "" }]
              : [];
      if (env.GITHUB_OUTPUT)
        appendFileSync(
          env.GITHUB_OUTPUT,
          `pr_number=${context?.number || ""}\npr_matrix=${JSON.stringify(targets)}\nhas_prs=${targets.length > 0}\n`,
        );
      else console.log(JSON.stringify(targets));
    } else
      console.log(
        await routeReviewWakeup({
          api,
          eventName: env.GITHUB_EVENT_NAME,
          event,
          repository: env.GITHUB_REPOSITORY,
          agent: (env.AI_REVIEW_AGENT || "codex").toLowerCase(),
          config: readConfig(),
          scheduledPull: {
            number: Number(env.AI_REVIEW_PR_NUMBER),
            head_sha: env.AI_REVIEW_HEAD_SHA,
          },
        }),
      );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
