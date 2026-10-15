import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import {
  evidenceAddition,
  matchingValidationMarkers,
  requiredSteps,
  validatePriorRun,
} from "../scripts/ci-evidence-route.mjs";

const effectiveSha = "a".repeat(40);
const headSha = "b".repeat(40);
const baseSha = "c".repeat(40);
const featureBefore = "# Request\n\n## Final Analyst Validation Notes\n\nPending validation.\n";
const featureLines = [
  "- Analyst validation pass: passed.",
  "- Final Analyst validation completed at: 2026-10-15T12:01:00Z.",
  `- Analyst validated effective content head: ${effectiveSha}.`,
  "- Analyst return count for this work cycle: 0.",
];
const tasksBefore =
  "# Tasks\n\n### Final Validation Evidence\n\nPending validation.\n\n### Cleanup Evidence\n\nNone.\n";
const taskLines = [
  `- Effective content head: ${effectiveSha}.`,
  "- Architect validation pass: passed.",
  "- Final Architect validation completed at: 2026-10-15T12:00:00Z.",
  `- Architect validated effective content head: ${effectiveSha}.`,
  "- Architect return count for this work cycle: 0.",
];

test("only schema-valid additions at the end of existing final sections qualify", () => {
  const featureAfter = featureBefore + featureLines.join("\n") + "\n";
  const tasksAfter = tasksBefore.replace(
    "### Cleanup Evidence",
    taskLines.join("\n") + "\n### Cleanup Evidence",
  );
  assert.deepEqual(
    evidenceAddition(featureBefore, featureAfter, "feature-request.md", effectiveSha),
    featureLines,
  );
  assert.deepEqual(evidenceAddition(tasksBefore, tasksAfter, "tasks.md", effectiveSha), taskLines);
  assert.equal(matchingValidationMarkers(featureAfter, tasksAfter), effectiveSha);
  for (const bad of [
    featureBefore.replace("Request", "Changed request") + featureLines.join("\n") + "\n",
    featureBefore + "## New heading\n" + featureLines.join("\n") + "\n",
    featureBefore + "- Customer intent: reviewed.\n",
    featureBefore + featureLines.join("\n").replace(effectiveSha, headSha) + "\n",
    featureBefore + featureLines.join("\n").replace("12:01:00Z", "99:99:99Z") + "\n",
  ]) {
    assert.equal(evidenceAddition(featureBefore, bad, "feature-request.md", effectiveSha), null);
  }
  assert.equal(
    evidenceAddition("# No final section\n", featureAfter, "feature-request.md", effectiveSha),
    null,
  );
  assert.equal(evidenceAddition(featureBefore, featureAfter, "spec.md", effectiveSha), null);
  assert.equal(
    matchingValidationMarkers(featureAfter.replace("12:01:00Z", "12:00:00Z"), tasksAfter),
    null,
  );
});

test("full-run proof requires the same PR, base, workflow, jobs, and successful heavy steps", () => {
  const context = {
    repository: "example/cabadrive",
    prNumber: 42,
    headRef: "codex/evidence",
    effectiveSha,
    baseSha,
  };
  const workflowDigest = "d".repeat(64);
  const run = {
    id: 123,
    run_attempt: 1,
    event: "pull_request",
    conclusion: "success",
    status: "completed",
    head_sha: effectiveSha,
    head_branch: context.headRef,
    head_repository: { full_name: context.repository },
    repository: { full_name: context.repository },
    path: ".github/workflows/ci.yml",
    workflow_id: 99,
  };
  const jobs = Object.entries(requiredSteps).map(([name, steps]) => ({
    name,
    status: "completed",
    conclusion: "success",
    steps: steps.map((step) => ({ name: step, conclusion: "success" })),
  }));
  const record = {
    schemaVersion: 1,
    runId: run.id,
    runAttempt: 1,
    prNumber: context.prNumber,
    repository: context.repository,
    headRef: context.headRef,
    effectiveSha,
    baseSha,
    workflowPath: run.path,
    workflowSha256: workflowDigest,
  };
  const artifact = { expired: false, workflow_run: { id: run.id, head_sha: effectiveSha } };
  const valid = { run, jobs, record, artifact, context, workflowDigest };
  assert.ok(validatePriorRun(valid));
  assert.equal(validatePriorRun({ ...valid, record: { ...record, baseSha: headSha } }), null);
  assert.equal(validatePriorRun({ ...valid, record: { ...record, prNumber: 43 } }), null);
  assert.equal(
    validatePriorRun({ ...valid, record: { ...record, workflowSha256: "e".repeat(64) } }),
    null,
  );
  assert.equal(validatePriorRun({ ...valid, run: { ...run, head_branch: "other" } }), null);
  assert.equal(
    validatePriorRun({ ...valid, run: { ...run, head_repository: { full_name: "other/repo" } } }),
    null,
  );
  assert.equal(validatePriorRun({ ...valid, artifact: { ...artifact, expired: true } }), null);
  assert.equal(validatePriorRun({ ...valid, jobs: jobs.slice(0, 1) }), null);
  const skippedJobs = structuredClone(jobs);
  skippedJobs[0].steps.find((step) => step.name === "Run tests if present").conclusion = "skipped";
  assert.equal(validatePriorRun({ ...valid, jobs: skippedJobs }), null);
  const failedJobs = structuredClone(jobs);
  failedJobs[1].steps.find((step) => step.name === "Verify actual Docker teardown").conclusion =
    "failure";
  assert.equal(validatePriorRun({ ...valid, jobs: failedJobs }), null);
});

test("workflow keeps both required jobs and conditions only their heavy steps", () => {
  const workflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
  assert.match(workflow, /baseline-checks:\n\s+name: baseline-checks/);
  assert.match(workflow, /docker-validation:\n\s+name: docker-validation/);
  for (const job of ["baseline-checks", "docker-validation"]) {
    const jobHeader = workflow.split(`  ${job}:\n`)[1]?.split("    steps:\n")[0];
    assert.ok(jobHeader, `${job} has steps`);
    assert.doesNotMatch(jobHeader, /^\s+if:/m, `${job} is never skipped at job level`);
  }
  assert.doesNotMatch(workflow, /continue-on-error:/);
  assert.match(
    workflow,
    /Classify final validation evidence[\s\S]*git show "\$PR_BASE_SHA:scripts\/ci-evidence-route\.mjs"/,
  );
  assert.match(
    workflow,
    /Prove current evidence-only head[\s\S]*?if: steps\.route\.outputs\.route == 'short'/,
  );
  for (const step of Object.values(requiredSteps).flat()) {
    assert.ok(workflow.includes(`- name: ${step}`), `${step} remains in CI`);
  }
  assert.match(
    workflow,
    /name: Run tests if present\n\s+if: steps\.route\.outputs\.route != 'short'/,
  );
  assert.match(
    workflow,
    /name: Observe complete Docker validation and production retry\n\s+if: steps\.route\.outputs\.route != 'short'/,
  );
});

test("complete straight-line Git history accepts only evidence-only commits", () => {
  const directory = mkdtempSync(join(tmpdir(), "cabadrive-route-test-"));
  const moduleUrl = new URL("../scripts/ci-evidence-route.mjs", import.meta.url).href;
  const git = (...args) => execFileSync("git", args, { cwd: directory, encoding: "utf8" }).trim();
  const write = (path, value) => {
    const absolute = join(directory, path);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, value);
  };
  const inspect = (effective, head) => {
    const source = `import { changedEvidenceCommits } from ${JSON.stringify(moduleUrl)}; console.log(JSON.stringify(changedEvidenceCommits(process.argv[1], process.argv[2])));`;
    return JSON.parse(
      execFileSync(process.execPath, ["--input-type=module", "-e", source, effective, head], {
        cwd: directory,
        encoding: "utf8",
      }),
    );
  };
  try {
    git("init", "-q");
    git("config", "user.name", "CI Test");
    git("config", "user.email", "ci@example.invalid");
    const root = "specs/999-ci-fixture/";
    write(root + "feature-request.md", featureBefore);
    write(root + "tasks.md", tasksBefore);
    git("add", ".");
    git("commit", "-qm", "effective content");
    const effective = git("rev-parse", "HEAD");
    const featureEvidence =
      featureBefore + featureLines.join("\n").replaceAll(effectiveSha, effective) + "\n";
    write(root + "feature-request.md", featureEvidence);
    git("add", ".");
    git("commit", "-qm", "analyst evidence");
    const evidenceHead = git("rev-parse", "HEAD");
    assert.deepEqual(inspect(effective, evidenceHead), {
      feature: "999-ci-fixture",
      changedFiles: [root + "feature-request.md"],
    });
    write(
      root + "tasks.md",
      tasksBefore.replace("Pending validation.", "Changed substantive task."),
    );
    git("add", ".");
    git("commit", "-qm", "semantic edit");
    assert.equal(inspect(effective, git("rev-parse", "HEAD")), null);
    write("AGENTS.md", "changed control\n");
    git("add", ".");
    git("commit", "-qm", "control edit");
    assert.equal(inspect(effective, git("rev-parse", "HEAD")), null);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
