#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  containsBlockingSeverity,
  extractClaudeOutcome,
  extractMarkerSha,
  isTrustedReviewLogin,
  normalizeLogin
} from "./ai-review-helpers.mjs";
import { findRepoRoot, parseArgs, readConfig } from "./shared.mjs";

const cleanMergeStates = new Set(["CLEAN", "HAS_HOOKS", "UNSTABLE"]);
const conflictMergeStates = new Set(["CONFLICTING", "DIRTY", "UNKNOWN", "DRAFT"]);
const successValues = new Set(["SUCCESS", "success"]);
const pendingValues = new Set([
  "EXPECTED",
  "IN_PROGRESS",
  "PENDING",
  "QUEUED",
  "REQUESTED",
  "WAITING",
  "pending"
]);
const validationCompletedAtMarkers = {
  architect: /Final\s+Architect\s+validation\s+completed\s+at:\s*([^\r\n]+)/ig,
  analyst: /Final\s+Analyst\s+validation\s+completed\s+at:\s*([^\r\n]+)/ig
};
const effectiveContentHeadMarker = /Effective\s+content\s+head:\s*([0-9a-f]{40})/ig;
const guardTextMarker = /current-PR-head|current PR head|head guard/i;
const shaReferenceMarker = /\b[0-9a-f]{12,40}\b/ig;
const allowedEvidenceFilenames = new Set(["feature-request.md", "spec.md", "plan.md", "tasks.md"]);

export function evaluateFinalizationGates(input = {}) {
  const blockers = [];
  const pendingChecks = [];
  const requiredChecks = input.requiredChecks || [];
  const checkMap = new Map((input.checks || []).map((check) => [check.name, check]));
  const pr = input.pr || {};
  const evidence = input.processEvidence || {};

  const block = (code, message) => blockers.push({ code, message });

  if (!pr.number && !input.prIdentifier) {
    block("missing-pr-context", "A pull request context or explicit PR identifier is required.");
  }

  if (input.requireExpectedHead && !input.suppliedHeadSha) {
    block("missing-expected-head", "Mutating finalization requires --expected-head or --head-sha for the reviewed and validated PR head.");
  }

  if (input.suppliedHeadSha && pr.headSha && input.suppliedHeadSha !== pr.headSha) {
    block("stale-head", `Supplied head ${input.suppliedHeadSha} does not match current PR head ${pr.headSha}.`);
  }

  if (!pr.headSha) {
    block("missing-head", "Current PR head SHA could not be verified.");
  }

  if (pr.isDraft) {
    block("draft-pr", "Draft pull requests cannot be finalized.");
  }

  if (pr.mergeable && pr.mergeable !== "MERGEABLE") {
    block("merge-conflict", `GitHub reports PR mergeability as ${pr.mergeable}.`);
  }

  if (conflictMergeStates.has(pr.mergeStateStatus)) {
    block("merge-state", `GitHub merge state is ${pr.mergeStateStatus}.`);
  }

  for (const name of requiredChecks) {
    const check = checkMap.get(name);
    if (!check) {
      block("missing-required-check", `Required check "${name}" is missing on the current head.`);
      continue;
    }
    const state = normalizeCheckState(check);
    if (state === "success") continue;
    if (state === "pending") {
      pendingChecks.push(name);
      continue;
    }
    block("failed-required-check", `Required check "${name}" is ${describeCheck(check)}.`);
  }

  for (const name of pendingChecks) {
    block("pending-required-check", `Required check "${name}" is still pending.`);
  }

  if (pr.mergeStateStatus && !cleanMergeStates.has(pr.mergeStateStatus) && !conflictMergeStates.has(pr.mergeStateStatus)) {
    const mayBePendingProtection = pr.mergeStateStatus === "BLOCKED" && pendingChecks.length > 0 && input.autoMergePending;
    if (!mayBePendingProtection) {
      block("protected-branch-state", `GitHub merge state is ${pr.mergeStateStatus}; protected-branch readiness is not clean.`);
    }
  }

  const unresolvedThreads = (input.reviewThreads || []).filter((thread) => !thread.isResolved);
  if (unresolvedThreads.length > 0) {
    block("unresolved-review-thread", `${unresolvedThreads.length} review thread(s) remain unresolved.`);
  }

  const unresolvedFindings = (input.blockingFindings || []).filter((finding) => !finding.resolved);
  for (const finding of unresolvedFindings) {
    block("blocking-review-finding", finding.message || "A blocking review finding remains unresolved.");
  }

  if (!evidence.finalArchitectValidation) {
    block("missing-architect-validation", "Final Architect validation evidence is missing.");
  }
  if (!evidence.finalAnalystValidation) {
    block("missing-analyst-validation", "Final Analyst validation evidence is missing.");
  }
  if (!evidence.finalValidationOrder) {
    block("missing-validation-order", "Final validation order evidence is missing or stale.");
  }
  if (!evidence.acceptanceEvidence) {
    block("missing-acceptance-evidence", "Acceptance and verification evidence is missing.");
  }
  if (!evidence.currentProcessMemory) {
    block("stale-process-memory", "Process memory is missing or stale.");
  }
  if (!evidence.feedbackDisposition) {
    block("missing-feedback-disposition", "Implementation Agent feedback disposition evidence is missing.");
  }
  if (!evidence.effectiveContentHead) {
    block("missing-effective-content-head", "Effective content head evidence is missing.");
  }
  if (!evidence.currentHeadGuardEvidence) {
    block("missing-current-head-guard", "Current-PR-head guard evidence is missing.");
  }
  if (evidence.effectiveContentHead && pr.headSha && evidence.effectiveContentHead.toLowerCase() !== pr.headSha.toLowerCase()) {
    if (evidence.postEffectiveHeadVerificationError) {
      block(
        "post-effective-head-unverified",
        `Could not verify changes after effective content head ${evidence.effectiveContentHead}: ${evidence.postEffectiveHeadVerificationError}`
      );
    } else if (!evidence.postEffectiveHeadEvidenceOnly) {
      const paths = (evidence.postEffectiveHeadInvalidPaths || []).join(", ") || "unknown paths";
      block(
        "post-effective-head-non-evidence",
        `Current PR head includes non-evidence changes after effective content head ${evidence.effectiveContentHead}: ${paths}.`
      );
    }
  }
  if (evidence.acceptedKnownIssueDecisionPending) {
    block("human-known-issue-decision", "A remaining known issue still needs an explicit owner decision.");
  }

  const nonPendingBlockers = blockers.filter((entry) => entry.code !== "pending-required-check");
  if (pendingChecks.length > 0 && nonPendingBlockers.length === 0 && input.autoMergePending) {
    return {
      ready: false,
      action: "enable-auto-merge",
      blockers: [],
      pendingChecks
    };
  }

  if (blockers.length > 0) {
    return {
      ready: false,
      action: "block",
      blockers,
      pendingChecks
    };
  }

  return {
    ready: true,
    action: "merge",
    blockers: [],
    pendingChecks: []
  };
}

export function normalizeCheckState(check = {}) {
  const conclusion = check.conclusion || check.state;
  const status = check.status || check.state;
  if (successValues.has(conclusion)) return "success";
  if (pendingValues.has(status) || pendingValues.has(conclusion) || conclusion == null) return "pending";
  return "failed";
}

function describeCheck(check = {}) {
  return [
    check.status ? `status ${check.status}` : null,
    check.conclusion ? `conclusion ${check.conclusion}` : null,
    check.state ? `state ${check.state}` : null
  ].filter(Boolean).join(", ") || "not successful";
}

export function normalizeStatusChecks(nodes = []) {
  return nodes.map((node) => {
    if (node.__typename === "StatusContext") {
      return {
        name: node.context,
        state: node.state
      };
    }
    return {
      name: node.name,
      status: node.status,
      conclusion: node.conclusion
    };
  }).filter((check) => check.name);
}

export function collectBlockingFindings({ reviews = [], reviewThreads = [], issueComments = [], headSha, config = {} } = {}) {
  const findings = [];

  for (const thread of reviewThreads) {
    if (thread.isResolved) continue;
    for (const comment of thread.comments || []) {
      const login = normalizeLogin(comment.author?.login || comment.user?.login);
      if (isTrustedReviewLogin(login, "codex", config) && containsBlockingSeverity(comment.body, "codex")) {
        findings.push({ source: "codex-thread", message: "Unresolved Codex P0-P2 review finding remains open." });
      }
      if (isTrustedReviewLogin(login, "gemini", config) && containsBlockingSeverity(comment.body, "gemini")) {
        findings.push({ source: "gemini-thread", message: "Unresolved Gemini critical/high review finding remains open." });
      }
    }
  }

  const latestNativeReviewByReviewer = new Map();
  for (const [index, review] of reviews.entries()) {
    const commitSha = review.commit?.oid || review.commit_id;
    if (commitSha && headSha && commitSha !== headSha) continue;
    const login = normalizeLogin(review.author?.login || review.user?.login);
    const reviewerKey = login || `unknown-reviewer-${index}`;
    const submittedAtTime = Date.parse(review.submittedAt || review.submitted_at || review.createdAt || review.created_at || "");
    const order = Number.isNaN(submittedAtTime) ? index : submittedAtTime;
    const latest = latestNativeReviewByReviewer.get(reviewerKey);
    if (!latest || order >= latest.order) {
      latestNativeReviewByReviewer.set(reviewerKey, { review, order });
    }
    if (isTrustedReviewLogin(login, "codex", config) && containsBlockingSeverity(review.body, "codex")) {
      findings.push({ source: "codex-review", message: "A current-head Codex P0-P2 review finding remains." });
    }
    if (isTrustedReviewLogin(login, "gemini", config) && containsBlockingSeverity(review.body, "gemini")) {
      findings.push({ source: "gemini-review", message: "A current-head Gemini critical/high finding remains." });
    }
  }
  for (const { review } of latestNativeReviewByReviewer.values()) {
    if (review.state === "CHANGES_REQUESTED") {
      findings.push({ source: "native-review", message: "A latest current-head changes-requested review remains." });
    }
  }

  const latestClaudeBySha = new Map();
  for (const comment of issueComments) {
    const body = comment.body || "";
    const sha = extractMarkerSha(body);
    const outcome = extractClaudeOutcome(body);
    const login = normalizeLogin(comment.author?.login || comment.user?.login);
    if (!sha || !outcome || !isTrustedReviewLogin(login, "claude", config)) continue;
    latestClaudeBySha.set(sha, outcome);
  }
  if (headSha && latestClaudeBySha.get(headSha) === "block") {
    findings.push({ source: "claude-comment", message: "Latest current-head Claude review outcome is block." });
  }

  return findings;
}

export function readProcessEvidence(root, featurePath, currentHead = "") {
  const featureRoot = join(root, featurePath || "");
  const read = (name) => {
    const path = join(featureRoot, name);
    return existsSync(path) ? readFileSync(path, "utf8") : "";
  };
  const featureRequest = read("feature-request.md");
  const spec = read("spec.md");
  const plan = read("plan.md");
  const tasks = read("tasks.md");
  const architectMemory = [spec, plan, tasks].join("\n");
  const analystMemory = featureRequest;
  const allMemory = [featureRequest, spec, plan, tasks].join("\n");

  const hasArchitectPass = /Architect validation pass:\s*(pass|passed|yes|true)/i.test(architectMemory);
  const hasAnalystPass = /Analyst validation pass:\s*(pass|passed|yes|true)/i.test(analystMemory);
  const architectCompletedAt = readLatestValidationCompletedAt(architectMemory, "architect");
  const analystCompletedAt = readLatestValidationCompletedAt(analystMemory, "analyst");
  const verificationSection = tasks.match(/## Verification Evidence([\s\S]*?)(?:\n## |\n# |$)/i)?.[1] || "";
  const feedbackSection = tasks.match(/## Implementation Agent Feedback([\s\S]*?)(?:\n## |\n# |$)/i)?.[1] || "";
  const knownIssueSection = tasks.match(/## Known Issues([\s\S]*?)(?:\n## |\n# |$)/i)?.[1] || "";
  const feedbackText = feedbackSection.trim();
  const noFeedbackRecorded = /^(?:[-*]\s*)?(?:None yet|None|No Implementation Agent feedback)\.?\s*$/i.test(feedbackText);
  const feedbackDisposed = /No unresolved|Architect disposition|disposed/i.test(feedbackText);
  const effectiveContentHead = readLatestEffectiveContentHead(allMemory);
  const guardEvidenceText = readCurrentHeadGuardEvidenceText(tasks);

  return {
    finalArchitectValidation: hasArchitectPass,
    finalAnalystValidation: hasAnalystPass,
    finalValidationOrder: hasArchitectPass &&
      hasAnalystPass &&
      Boolean(architectCompletedAt) &&
      Boolean(analystCompletedAt) &&
      architectCompletedAt.getTime() < analystCompletedAt.getTime(),
    acceptanceEvidence: verificationSection.trim().length > 0 && !/Pending implementation/i.test(verificationSection),
    currentProcessMemory: /## Decisions/i.test(tasks) &&
      /## Dead Ends/i.test(tasks) &&
      /## Known Issues/i.test(tasks) &&
      /## Verification Evidence/i.test(tasks),
    feedbackDisposition: noFeedbackRecorded || feedbackDisposed,
    effectiveContentHead,
    currentHeadMatchesEffectiveContentHead: Boolean(currentHead && effectiveContentHead) &&
      currentHead.toLowerCase() === effectiveContentHead.toLowerCase(),
    postEffectiveHeadEvidenceOnly: Boolean(currentHead && effectiveContentHead) &&
      currentHead.toLowerCase() === effectiveContentHead.toLowerCase(),
    currentHeadGuardEvidence: Boolean(effectiveContentHead) &&
      guardEvidenceReferencesEffectiveHead(guardEvidenceText, effectiveContentHead),
    acceptedKnownIssueDecisionPending: /accepted known issue|owner decision|human decision/i.test(knownIssueSection) &&
      !/none|not applicable|no known/i.test(knownIssueSection)
  };
}

function readLatestEffectiveContentHead(memory) {
  effectiveContentHeadMarker.lastIndex = 0;
  let latest = null;
  let match;
  while ((match = effectiveContentHeadMarker.exec(memory)) !== null) {
    latest = match[1].toLowerCase();
  }
  return latest;
}

function readCurrentHeadGuardEvidenceText(tasks) {
  return tasks
    .split(/\r?\n/)
    .filter((line) => guardTextMarker.test(line))
    .join("\n");
}

function guardEvidenceReferencesEffectiveHead(text, effectiveContentHead) {
  if (!text || !effectiveContentHead) return false;
  shaReferenceMarker.lastIndex = 0;
  let match;
  while ((match = shaReferenceMarker.exec(text)) !== null) {
    const candidate = match[0].toLowerCase();
    if (effectiveContentHead.startsWith(candidate)) return true;
  }
  return false;
}

export function evaluatePostEffectiveHeadChangedFiles(changedFiles = [], featurePath = "") {
  const invalidPaths = changedFiles.filter((path) => !isFinalValidationEvidencePath(path, featurePath));
  return {
    postEffectiveHeadEvidenceOnly: invalidPaths.length === 0,
    postEffectiveHeadChangedFiles: changedFiles,
    postEffectiveHeadInvalidPaths: invalidPaths
  };
}

export function isFinalValidationEvidencePath(filePath = "", featurePath = "") {
  const normalizedFilePath = normalizeRepoPath(filePath);
  const normalizedFeaturePath = normalizeRepoPath(featurePath);
  if (!normalizedFilePath || !normalizedFeaturePath) return false;
  const prefix = `${normalizedFeaturePath}/`;
  if (!normalizedFilePath.startsWith(prefix)) return false;
  const relative = normalizedFilePath.slice(prefix.length);
  return allowedEvidenceFilenames.has(relative);
}

function normalizeRepoPath(path = "") {
  return String(path).replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/+$/g, "");
}

export function verifyPostEffectiveHeadChanges(root, featurePath, effectiveContentHead, currentHead) {
  try {
    run("git", ["cat-file", "-e", `${effectiveContentHead}^{commit}`], { cwd: root });
    run("git", ["cat-file", "-e", `${currentHead}^{commit}`], { cwd: root });
    const output = run("git", ["diff", "--name-only", effectiveContentHead, currentHead, "--"], { cwd: root });
    const changedFiles = output ? output.split(/\r?\n/).filter(Boolean) : [];
    return {
      ...evaluatePostEffectiveHeadChangedFiles(changedFiles, featurePath),
      postEffectiveHeadVerificationError: null
    };
  } catch (error) {
    return {
      postEffectiveHeadEvidenceOnly: false,
      postEffectiveHeadChangedFiles: [],
      postEffectiveHeadInvalidPaths: [],
      postEffectiveHeadVerificationError: error.message || String(error)
    };
  }
}

function readLatestValidationCompletedAt(memory, role) {
  const marker = validationCompletedAtMarkers[role];
  marker.lastIndex = 0;
  let latest = null;
  let match;
  while ((match = marker.exec(memory)) !== null) {
    const parsed = parseIsoDate(match[1]);
    if (!parsed) return null;
    latest = parsed;
  }
  return latest;
}

function parseIsoDate(value = "") {
  const candidate = value.trim().replace(/^`|`$/g, "");
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(candidate)) {
    return null;
  }
  const date = new Date(candidate);
  return Number.isNaN(date.getTime()) ? null : date;
}

function run(command, commandArgs, options = {}) {
  return execFileSync(command, commandArgs, {
    cwd: options.cwd,
    encoding: "utf8",
    stdio: options.capture === false ? "inherit" : ["ignore", "pipe", "pipe"]
  })?.trim();
}

function parseJsonOutput(command, commandArgs, options = {}) {
  return JSON.parse(run(command, commandArgs, options));
}

function resolveRepo(root, args) {
  if (args.repo) return args.repo;
  return run("gh", ["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"], { cwd: root });
}

function resolvePrNumber(root, repo, args) {
  const explicit = args.pr || args._?.[0];
  if (explicit) return String(explicit).replace(/^#/, "");
  const branch = run("git", ["branch", "--show-current"], { cwd: root });
  if (!branch) throw new Error("Could not infer PR from a detached HEAD. Pass --pr <number>.");
  const number = run("gh", ["pr", "view", branch, "--repo", repo, "--json", "number", "--jq", ".number"], { cwd: root });
  if (!number) throw new Error("Could not infer PR number. Pass --pr <number>.");
  return number;
}

function inferFeaturePath(root, args) {
  if (args.feature) return args.feature;
  const branch = run("git", ["branch", "--show-current"], { cwd: root });
  const match = branch.match(/(\d{3}-[a-z0-9-]+)/i);
  if (match && existsSync(join(root, "specs", match[1], "tasks.md"))) {
    return `specs/${match[1]}`;
  }
  return null;
}

async function fetchPullRequestState(root, repo, prNumber) {
  const [owner, name] = repo.split("/");
  const query = `
    query($owner: String!, $name: String!, $number: Int!) {
      repository(owner: $owner, name: $name) {
        pullRequest(number: $number) {
          id
          number
          url
          isDraft
          mergeable
          mergeStateStatus
          headRefOid
          headRefName
          baseRefName
          statusCheckRollup {
            contexts(first: 100) {
              pageInfo { hasNextPage }
              nodes {
                __typename
                ... on CheckRun {
                  name
                  status
                  conclusion
                }
                ... on StatusContext {
                  context
                  state
                }
              }
            }
          }
          reviewThreads(first: 100) {
            pageInfo { hasNextPage }
            nodes {
              isResolved
              comments(first: 20) {
                pageInfo { hasNextPage }
                nodes {
                  databaseId
                  body
                  author { login }
                }
              }
            }
          }
          reviews(last: 100) {
            nodes {
              state
              body
              submittedAt
              author { login }
              commit { oid }
            }
          }
          comments(last: 100) {
            nodes {
              body
              createdAt
              author { login }
            }
          }
        }
      }
    }
  `;
  const payload = parseJsonOutput("gh", [
    "api",
    "graphql",
    "-f",
    `query=${query}`,
    "-F",
    `owner=${owner}`,
    "-F",
    `name=${name}`,
    "-F",
    `number=${Number(prNumber)}`
  ], { cwd: root });
  const pull = payload.data.repository.pullRequest;
  const hasTruncatedThreads = pull.reviewThreads.pageInfo.hasNextPage ||
    pull.reviewThreads.nodes.some((thread) => thread.comments.pageInfo.hasNextPage);
  const hasTruncatedChecks = pull.statusCheckRollup?.contexts?.pageInfo?.hasNextPage;
  return {
    pr: {
      number: pull.number,
      url: pull.url,
      isDraft: pull.isDraft,
      mergeable: pull.mergeable,
      mergeStateStatus: pull.mergeStateStatus,
      headSha: pull.headRefOid,
      baseRefName: pull.baseRefName,
      headRefName: pull.headRefName
    },
    checks: normalizeStatusChecks(pull.statusCheckRollup?.contexts?.nodes || []),
    reviewThreads: pull.reviewThreads.nodes.map((thread) => ({
      isResolved: thread.isResolved,
      comments: thread.comments.nodes
    })),
    reviews: pull.reviews.nodes,
    issueComments: pull.comments.nodes,
    truncated: {
      checks: Boolean(hasTruncatedChecks),
      reviewThreads: Boolean(hasTruncatedThreads)
    }
  };
}

async function main() {
  const args = parseArgs();
  const root = findRepoRoot();
  const config = readConfig(root);
  const repo = resolveRepo(root, args);
  const prNumber = resolvePrNumber(root, repo, args);
  const featurePath = inferFeaturePath(root, args);
  const state = await fetchPullRequestState(root, repo, prNumber);
  const processEvidence = featurePath
    ? readProcessEvidence(root, featurePath, state.pr.headSha)
    : {};
  if (
    featurePath &&
    processEvidence.effectiveContentHead &&
    state.pr.headSha &&
    processEvidence.effectiveContentHead.toLowerCase() !== state.pr.headSha.toLowerCase()
  ) {
    Object.assign(
      processEvidence,
      verifyPostEffectiveHeadChanges(root, featurePath, processEvidence.effectiveContentHead, state.pr.headSha)
    );
  }
  const blockingFindings = collectBlockingFindings({
    reviews: state.reviews,
    reviewThreads: state.reviewThreads,
    issueComments: state.issueComments,
    headSha: state.pr.headSha,
    config
  });

  if (state.truncated.checks) {
    blockingFindings.push({ source: "status-pagination", message: "Required check rollup is paginated; refusing to finalize without complete status data." });
  }
  if (state.truncated.reviewThreads) {
    blockingFindings.push({ source: "review-pagination", message: "Review threads are paginated; refusing to finalize without complete thread data." });
  }

  const suppliedHeadSha = args["expected-head"] || args["head-sha"];
  const result = evaluateFinalizationGates({
    prIdentifier: prNumber,
    pr: state.pr,
    suppliedHeadSha,
    requireExpectedHead: !args["dry-run"],
    requiredChecks: config.requiredChecks || [],
    checks: state.checks,
    reviewThreads: state.reviewThreads,
    blockingFindings,
    processEvidence,
    autoMergePending: Boolean(args["auto-merge-pending"])
  });

  if (result.action === "block") {
    console.error(`PR #${prNumber} is not ready to finalize:`);
    for (const blocker of result.blockers) console.error(`- ${blocker.message}`);
    process.exit(1);
  }

  const mergeArgs = [
    "pr",
    "merge",
    prNumber,
    "--repo",
    repo,
    "--squash",
    "--match-head-commit",
    state.pr.headSha
  ];

  if (result.action === "enable-auto-merge") {
    mergeArgs.push("--auto");
  }

  if (args["dry-run"]) {
    console.log(JSON.stringify({
      action: result.action,
      repo,
      pr: Number(prNumber),
      headSha: state.pr.headSha,
      mergeMethod: "squash",
      featurePath: featurePath || null,
      pendingChecks: result.pendingChecks
    }, null, 2));
    return;
  }

  run("gh", mergeArgs, { cwd: root, capture: false });
}

const invokedPath = process.argv[1] ? basename(fileURLToPath(import.meta.url)) === basename(process.argv[1]) : false;
if (invokedPath) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
