#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const shaPattern = /^[0-9a-f]{40}$/;
const isoPattern = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/;
const featurePathPattern = /^specs\/(\d{3}-[a-z0-9-]+)\/(feature-request|tasks)\.md$/;
const workflowPath = ".github/workflows/ci.yml";
const policyVersion = 1;
export const requiredSteps = {
  "baseline-checks": [
    "Install pinned image QA compiler",
    "Setup pinned native image QA tools",
    "Audit native image QA dependency locks",
    "Run repository baseline",
    "Run typecheck and lint with budget",
    "Run format check",
    "Run negative quality contracts",
    "Run tests if present",
    "Run build if present",
    "Install Playwright browser",
    "Run browser smoke tests if present",
    "Record full CI provenance",
    "Upload full CI provenance",
  ],
  "docker-validation": [
    "Observe complete Docker validation and production retry",
    "Verify actual Docker teardown",
    "Upload bounded Docker production and resource proof",
  ],
};

const evidenceSchemas = {
  "feature-request.md": [
    {
      heading: "## Final Analyst Validation Notes",
      lines: [
        /^- Analyst validation pass: passed\.$/,
        /^- Final Analyst validation completed at: (\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z)$/,
        /^- Analyst validated effective content head: ([0-9a-f]{40})\.$/,
        /^- Analyst return count for this work cycle: ([0-5])\.$/,
      ],
    },
  ],
  "tasks.md": [
    {
      heading: "### Cycle PR Set",
      lines: [
        /^- PR #(\d+); branch: ([A-Za-z0-9._/-]+); observed head SHA: ([0-9a-f]{40}); effective content head: ([0-9a-f]{40}); status: final validation passed; observed at: (\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z); final-validation inclusion: included\.$/,
      ],
    },
    {
      heading: "### Final Validation Evidence",
      lines: [
        /^- Current-PR-head read-only guard: checked head ([0-9a-f]{40}) against effective content head ([0-9a-f]{40}) at (\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z); evidence-only changes confirmed; proof: git-diff-sha256:([0-9a-f]{64})\.$/,
      ],
    },
    {
      heading: "## Final Architect Validation Notes",
      lines: [
        /^- Effective content head: ([0-9a-f]{40})\.$/,
        /^- Architect validation pass: passed\.$/,
        /^- Final Architect validation completed at: (\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z)$/,
        /^- Architect validated effective content head: ([0-9a-f]{40})\.$/,
        /^- Architect return count for this work cycle: (10|[0-9])\.$/,
      ],
    },
  ],
};

function validIso(value) {
  if (!isoPattern.test(value) || Number.isNaN(Date.parse(value))) return false;
  const canonical = new Date(value).toISOString();
  return canonical === value || canonical.replace(/\.000Z$/, "Z") === value;
}

export function validEvidenceLine(filename, heading, line, effectiveSha, context = {}) {
  const schema = evidenceSchemas[filename]?.find((section) => section.heading === heading);
  if (!schema || !line.startsWith("- ")) return false;
  for (const pattern of schema.lines) {
    const match = line.match(pattern);
    if (!match) continue;
    if (heading === "### Cycle PR Set") {
      return (
        match[1] === String(context.prNumber) &&
        match[2] === context.headRef &&
        match[3] === context.parentSha &&
        match[4] === effectiveSha &&
        validIso(match[5])
      );
    }
    if (heading === "### Final Validation Evidence") {
      return (
        match[1] === context.parentSha &&
        match[2] === effectiveSha &&
        validIso(match[3]) &&
        match[4] === context.diffDigest
      );
    }
    if (line.includes("completed at:")) return validIso(match[1]);
    if (line.includes("effective content head:")) return match[1] === effectiveSha;
    return true;
  }
  return false;
}

function markdownChunks(content) {
  const headings = [...content.matchAll(/^#{1,6} .+$/gm)];
  return [
    { heading: null, text: content.slice(0, headings[0]?.index ?? content.length) },
    ...headings.map((match, index) => ({
      heading: match[0],
      text: content.slice(match.index, headings[index + 1]?.index ?? content.length),
    })),
  ];
}

export function evidenceAddition(before, after, filename, effectiveSha, context = {}) {
  const schemas = evidenceSchemas[filename];
  if (!schemas || !shaPattern.test(effectiveSha)) return null;
  const oldChunks = markdownChunks(before);
  const newChunks = markdownChunks(after);
  if (oldChunks.length !== newChunks.length) return null;
  for (const schema of schemas) {
    if (oldChunks.filter((chunk) => chunk.heading === schema.heading).length !== 1) return null;
  }
  const additions = [];
  for (let index = 0; index < oldChunks.length; index += 1) {
    const oldChunk = oldChunks[index];
    const newChunk = newChunks[index];
    if (oldChunk.heading !== newChunk.heading) return null;
    const schema = schemas.find((section) => section.heading === oldChunk.heading);
    if (!schema) {
      if (oldChunk.text !== newChunk.text) return null;
      continue;
    }
    if (!newChunk.text.startsWith(oldChunk.text)) return null;
    const added = newChunk.text.slice(oldChunk.text.length);
    if (!added) continue;
    if (!added.endsWith("\n") || added.includes("\r")) return null;
    const lines = added.trimEnd().split("\n");
    if (lines.length > schema.lines.length || lines.some((line) => !line)) return null;
    if (
      !lines.every((line) =>
        validEvidenceLine(filename, schema.heading, line, effectiveSha, context),
      )
    )
      return null;
    additions.push(...lines);
  }
  return additions.length ? additions : null;
}

function uniqueMarker(content, label) {
  const pattern = new RegExp(`^\\- ${label}: ([0-9a-f]{40})\\.$`, "gm");
  const values = [...content.matchAll(pattern)].map((match) => match[1]);
  return values.length === 1 ? values[0] : null;
}

function uniqueReturnCount(content, role, heading, limit) {
  const sections = markdownChunks(content).filter((chunk) => chunk.heading === heading);
  if (sections.length !== 1) return null;
  const pattern = new RegExp(
    `^- ${role} return count(?: for this work cycle)?: ([^\\r\\n]+)$`,
    "gm",
  );
  const all = [...content.matchAll(pattern)];
  const inSection = [...sections[0].text.matchAll(pattern)];
  if (all.length !== 1 || inSection.length !== 1) return null;
  const value = inSection[0][1];
  if (!/^(?:0|[1-9]\d*)\.$/.test(value)) return null;
  const count = Number(value.slice(0, -1));
  return Number.isSafeInteger(count) && count <= limit ? count : null;
}

function architectValidationMarkers(tasks, effectiveSha) {
  const section = markdownChunks(tasks).filter(
    (chunk) => chunk.heading === "## Final Architect Validation Notes",
  );
  if (section.length !== 1) return false;
  const content = section[0].text;
  const architectTime = [
    ...content.matchAll(/^- Final Architect validation completed at: (.+)$/gm),
  ];
  return (
    uniqueMarker(tasks, "Effective content head") === effectiveSha &&
    uniqueMarker(tasks, "Architect validated effective content head") === effectiveSha &&
    [...content.matchAll(/^- Architect validation pass: passed\.$/gm)].length === 1 &&
    architectTime.length === 1 &&
    validIso(architectTime[0][1]) &&
    uniqueReturnCount(tasks, "Architect", "## Final Architect Validation Notes", 10) !== null
  );
}

export function matchingValidationMarkers(featureRequest, tasks) {
  const effectiveSha = uniqueMarker(tasks, "Effective content head");
  const architectSha = uniqueMarker(tasks, "Architect validated effective content head");
  const analystSha = uniqueMarker(featureRequest, "Analyst validated effective content head");
  if (!effectiveSha || effectiveSha !== architectSha || effectiveSha !== analystSha) return null;
  if ([...tasks.matchAll(/^- Architect validation pass: passed\.$/gm)].length !== 1) return null;
  if ([...featureRequest.matchAll(/^- Analyst validation pass: passed\.$/gm)].length !== 1)
    return null;
  const architectTimes = [...tasks.matchAll(/^- Final Architect validation completed at: (.+)$/gm)];
  const analystTimes = [
    ...featureRequest.matchAll(/^- Final Analyst validation completed at: (.+)$/gm),
  ];
  if (architectTimes.length !== 1 || analystTimes.length !== 1) return null;
  const architectTime = architectTimes[0][1];
  const analystTime = analystTimes[0][1];
  if (!architectTime || !analystTime || !validIso(architectTime) || !validIso(analystTime))
    return null;
  if (Date.parse(architectTime) >= Date.parse(analystTime)) return null;
  if (uniqueReturnCount(tasks, "Architect", "## Final Architect Validation Notes", 10) === null)
    return null;
  if (uniqueReturnCount(featureRequest, "Analyst", "## Final Analyst Validation Notes", 5) === null)
    return null;
  return effectiveSha;
}

export function validatePriorRun({ run, jobs, record, artifact, context, workflowDigest }) {
  if (!run || !record || !artifact || !context) return null;
  if (run.event !== "pull_request" || run.conclusion !== "success" || run.status !== "completed")
    return null;
  if (run.head_sha !== context.effectiveSha || run.head_branch !== context.headRef) return null;
  if (
    run.head_repository?.full_name !== context.repository ||
    run.repository?.full_name !== context.repository
  )
    return null;
  if (run.path !== workflowPath || !Number.isInteger(run.workflow_id)) return null;
  if (
    artifact.expired ||
    artifact.workflow_run?.id !== run.id ||
    artifact.workflow_run?.head_sha !== context.effectiveSha
  )
    return null;
  if (
    record.schemaVersion !== policyVersion ||
    record.runId !== run.id ||
    record.runAttempt !== run.run_attempt
  )
    return null;
  if (
    record.prNumber !== context.prNumber ||
    record.repository !== context.repository ||
    record.headRef !== context.headRef
  )
    return null;
  if (record.effectiveSha !== context.effectiveSha || record.baseSha !== context.baseSha)
    return null;
  if (record.workflowPath !== workflowPath || record.workflowSha256 !== workflowDigest) return null;
  if (!Array.isArray(jobs) || jobs.length >= 100) return null;
  const stepResults = {};
  for (const [name, stepNames] of Object.entries(requiredSteps)) {
    const matches = jobs.filter((job) => job.name === name);
    if (
      matches.length !== 1 ||
      matches[0].conclusion !== "success" ||
      matches[0].status !== "completed"
    )
      return null;
    const actual = matches[0].steps || [];
    const result = {};
    for (const stepName of stepNames) {
      const stepMatches = actual.filter((step) => step.name === stepName);
      if (stepMatches.length !== 1 || stepMatches[0].conclusion !== "success") return null;
      result[stepName] = "success";
    }
    stepResults[name] = result;
  }
  return stepResults;
}

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8", maxBuffer: 4 * 1024 * 1024 }).trimEnd();
}

function gitFile(sha, path) {
  return execFileSync("git", ["show", `${sha}:${path}`], {
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
}

function gitEvidenceDigest(effectiveSha, checkedSha) {
  const diff = execFileSync(
    "git",
    [
      "diff",
      "--binary",
      "--no-ext-diff",
      "--no-textconv",
      "--no-color",
      "--no-renames",
      "--full-index",
      effectiveSha,
      checkedSha,
      "--",
    ],
    { maxBuffer: 4 * 1024 * 1024 },
  );
  return createHash("sha256").update(diff).digest("hex");
}

function safeContext() {
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  const pr = event.pull_request;
  if (process.env.GITHUB_EVENT_NAME !== "pull_request" || !pr) return null;
  const repository = process.env.GITHUB_REPOSITORY;
  const prNumber = Number(pr.number);
  const effectiveSha = pr.head.sha;
  const baseSha = pr.base.sha;
  const headRef = pr.head.ref;
  if (
    !shaPattern.test(effectiveSha) ||
    !shaPattern.test(baseSha) ||
    !Number.isInteger(prNumber) ||
    prNumber < 1
  )
    return null;
  if (
    pr.head.repo?.full_name !== repository ||
    pr.base.repo?.full_name !== repository ||
    pr.base.ref !== "main"
  )
    return null;
  return { repository, prNumber, headRef, headSha: effectiveSha, baseSha };
}

export function controlUnchanged(baseSha, headSha) {
  const paths = [
    ".github/workflows",
    "AGENTS.md",
    "CLAUDE.md",
    ".specify/templates",
    ".unicorn-hub/config.json",
    "scripts/apply-branch-protection.mjs",
    "scripts/finalize-pr.mjs",
    "scripts/ai-review-gate.mjs",
    "scripts/ai-review-helpers.mjs",
    "scripts/resolve-pr-context.mjs",
    "scripts/shared.mjs",
    "scripts/ci-evidence-route.mjs",
    "docs_project/project/devops/ai-pr-workflow.md",
  ];
  return git("diff", "--name-only", baseSha, headSha, "--", ...paths) === "";
}

export function changedEvidenceCommits(effectiveSha, headSha, context = {}) {
  const lineage = git("rev-list", "--reverse", "--parents", `${effectiveSha}..${headSha}`)
    .split("\n")
    .filter(Boolean);
  if (lineage.length < 1 || lineage.length > 20) return null;
  let parent = effectiveSha;
  let feature = null;
  let guardCount = 0;
  let cycleCount = 0;
  const changedFiles = new Set();
  for (const row of lineage) {
    const [sha, ...parents] = row.split(" ");
    if (parents.length !== 1 || parents[0] !== parent) return null;
    const fileRows = git("diff", "--name-status", "--no-renames", parent, sha)
      .split("\n")
      .filter(Boolean);
    if (fileRows.length < 1 || fileRows.length > 2) return null;
    for (const fileRow of fileRows) {
      const [status, path] = fileRow.split("\t");
      const match = path?.match(featurePathPattern);
      if (status !== "M" || !match) return null;
      if (feature && feature !== match[1]) return null;
      feature = match[1];
      const before = gitFile(parent, path);
      const after = gitFile(sha, path);
      if (
        match[2] === "feature-request" &&
        !architectValidationMarkers(gitFile(parent, `specs/${feature}/tasks.md`), effectiveSha)
      )
        return null;
      const additions = evidenceAddition(before, after, match[2] + ".md", effectiveSha, {
        ...context,
        parentSha: parent,
        diffDigest: gitEvidenceDigest(effectiveSha, parent),
      });
      if (!additions) return null;
      guardCount += additions.filter((line) =>
        line.startsWith("- Current-PR-head read-only guard:"),
      ).length;
      cycleCount += additions.filter((line) => /^- PR #\d+; branch:/.test(line)).length;
      if (guardCount > 1 || cycleCount > 1) return null;
      if (
        additions.some((line) =>
          /^- (?:Current-PR-head read-only guard|PR #\d+; branch:)/.test(line),
        ) &&
        matchingValidationMarkers(
          gitFile(parent, `specs/${feature}/feature-request.md`),
          gitFile(parent, `specs/${feature}/tasks.md`),
        ) !== effectiveSha
      )
        return null;
      changedFiles.add(path);
    }
    parent = sha;
  }
  return { feature, changedFiles: [...changedFiles].sort() };
}

async function api(path, token, binary = false) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "cabadrive-ci-evidence-route",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status}`);
  return binary ? Buffer.from(await response.arrayBuffer()) : response.json();
}

async function priorProof(context, workflowDigest) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  const repo = `/repos/${context.repository}`;
  const found = await api(
    `${repo}/actions/workflows/ci.yml/runs?event=pull_request&head_sha=${context.effectiveSha}&per_page=100`,
    token,
  );
  if (!Array.isArray(found.workflow_runs) || found.workflow_runs.length !== 1) return null;
  const run = found.workflow_runs[0];
  const jobsResponse = await api(
    `${repo}/actions/runs/${run.id}/attempts/${run.run_attempt}/jobs?per_page=100`,
    token,
  );
  if (!Array.isArray(jobsResponse.jobs) || jobsResponse.total_count !== jobsResponse.jobs.length)
    return null;
  const artifacts = await api(`${repo}/actions/runs/${run.id}/artifacts?per_page=100`, token);
  if (!Array.isArray(artifacts.artifacts) || artifacts.total_count !== artifacts.artifacts.length)
    return null;
  const name = `ci-full-proof-${run.id}-${run.run_attempt}`;
  const matches = artifacts.artifacts.filter((artifact) => artifact.name === name);
  if (matches.length !== 1) return null;
  const artifact = matches[0];
  const zip = await api(`${repo}/actions/artifacts/${artifact.id}/zip`, token, true);
  const directory = mkdtempSync(join(tmpdir(), "cabadrive-ci-proof-"));
  let record;
  try {
    const path = join(directory, "proof.zip");
    writeFileSync(path, zip, { mode: 0o600 });
    record = JSON.parse(
      execFileSync("unzip", ["-p", path, "full-run.json"], { encoding: "utf8", maxBuffer: 16384 }),
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
  const stepResults = validatePriorRun({
    run,
    jobs: jobsResponse.jobs,
    record,
    artifact,
    context,
    workflowDigest,
  });
  return stepResults ? { runId: run.id, runAttempt: run.run_attempt, stepResults } : null;
}

function outputDecision(decision) {
  const json = JSON.stringify(decision);
  console.log(json);
  if (process.env.GITHUB_OUTPUT)
    writeFileSync(process.env.GITHUB_OUTPUT, `route=${decision.route}\n`, { flag: "a" });
  if (process.env.CI_ROUTE_FILE) {
    mkdirSync(dirname(process.env.CI_ROUTE_FILE), { recursive: true });
    writeFileSync(process.env.CI_ROUTE_FILE, json + "\n");
  }
}

async function decide() {
  const full = (reason) => outputDecision({ schemaVersion: policyVersion, route: "full", reason });
  try {
    const context = safeContext();
    if (!context) return full("event-or-repository-not-eligible");
    if (git("rev-parse", "--is-shallow-repository") === "true")
      git("fetch", "--no-tags", "--unshallow", "origin");
    git(
      "fetch",
      "--no-tags",
      "origin",
      `+refs/pull/${context.prNumber}/head:refs/remotes/origin/ci-route-head`,
    );
    if (git("rev-parse", "refs/remotes/origin/ci-route-head") !== context.headSha)
      return full("head-changed");
    if (!controlUnchanged(context.baseSha, context.headSha))
      return full("control-changed-from-base");
    const paths = git("diff", "--name-only", context.baseSha, context.headSha)
      .split("\n")
      .filter(Boolean);
    const featurePaths = paths.filter((path) => featurePathPattern.test(path));
    const features = new Set(featurePaths.map((path) => path.match(featurePathPattern)[1]));
    if (features.size !== 1) return full("no-unique-feature");
    const feature = [...features][0];
    const featureRequest = gitFile(context.headSha, `specs/${feature}/feature-request.md`);
    const tasks = gitFile(context.headSha, `specs/${feature}/tasks.md`);
    const effectiveSha = matchingValidationMarkers(featureRequest, tasks);
    if (!effectiveSha || effectiveSha === context.headSha)
      return full("missing-effective-head-proof");
    if (git("merge-base", "--is-ancestor", effectiveSha, context.headSha) !== "")
      return full("effective-head-not-ancestor");
    if (git("rev-parse", "--is-shallow-repository") !== "false") return full("incomplete-history");
    const changed = changedEvidenceCommits(effectiveSha, context.headSha, context);
    if (!changed || changed.feature !== feature)
      return full("non-evidence-change-after-effective-head");
    context.effectiveSha = effectiveSha;
    const workflowDigest = createHash("sha256")
      .update(gitFile(context.headSha, workflowPath))
      .digest("hex");
    const proof = await priorProof(context, workflowDigest);
    if (!proof) return full("missing-prior-full-run-proof");
    outputDecision({
      schemaVersion: policyVersion,
      route: "short",
      headSha: context.headSha,
      effectiveSha,
      baseSha: context.baseSha,
      prNumber: context.prNumber,
      repository: context.repository,
      workflowSha256: workflowDigest,
      changedFiles: changed.changedFiles,
      ...proof,
    });
  } catch (error) {
    full(`proof-unavailable:${error.message}`);
  }
}

function record() {
  const context = safeContext();
  if (!context || !process.env.CI_PROOF_DIR)
    throw new Error("Full-run provenance requires a same-repository PR context.");
  const record = {
    schemaVersion: policyVersion,
    repository: context.repository,
    prNumber: context.prNumber,
    headRef: context.headRef,
    effectiveSha: context.headSha,
    baseSha: context.baseSha,
    workflowPath,
    workflowSha256: createHash("sha256").update(readFileSync(workflowPath)).digest("hex"),
    runId: Number(process.env.GITHUB_RUN_ID),
    runAttempt: Number(process.env.GITHUB_RUN_ATTEMPT),
  };
  if (!Number.isInteger(record.runId) || !Number.isInteger(record.runAttempt))
    throw new Error("Invalid run identity.");
  mkdirSync(process.env.CI_PROOF_DIR, { recursive: true });
  writeFileSync(join(process.env.CI_PROOF_DIR, "full-run.json"), JSON.stringify(record) + "\n");
  console.log(JSON.stringify(record));
}

function assertShort() {
  const decision = JSON.parse(readFileSync(process.env.CI_ROUTE_FILE, "utf8"));
  const context = safeContext();
  if (
    decision.route !== "short" ||
    !context ||
    decision.headSha !== context.headSha ||
    decision.baseSha !== context.baseSha ||
    decision.prNumber !== context.prNumber ||
    decision.repository !== context.repository
  ) {
    throw new Error("Short-path proof does not match this PR head.");
  }
  console.log(JSON.stringify(decision));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const mode = process.argv[2];
  if (mode === "--decide") await decide();
  else if (mode === "--record") record();
  else if (mode === "--assert-short") assertShort();
  else throw new Error(`Unknown mode: ${mode}`);
}
