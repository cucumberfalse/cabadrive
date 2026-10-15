import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
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
import {
  evaluateFinalizationGates,
  evaluatePostEffectiveHeadDiff,
  readProcessEvidence,
  verifyPostEffectiveHeadChanges,
} from "../scripts/finalize-pr.mjs";

const effectiveSha = "a".repeat(40);
const headSha = "b".repeat(40);
const baseSha = "c".repeat(40);
const featureBefore = "# Request\n\n## Final Analyst Validation Notes\n\nPending validation.\n";
const featureLines = [
  "- Analyst validation pass: passed.",
  "- Final Analyst validation completed at: 2026-10-15T12:01:00Z",
  `- Analyst validated effective content head: ${effectiveSha}.`,
  "- Analyst return count for this work cycle: 0.",
];
const tasksBefore =
  "# Tasks\n\n## Process Memory\n\n### Dead Ends\n\n- None.\n\n### Decisions\n\n- Existing decision.\n\n### Known Issues\n\n- None.\n\n### Verification Evidence\n\n- node --test passed.\n\n### Cycle PR Set\n\n- PR #42; branch: codex/evidence; head SHA: cccccccccccccccccccccccccccccccccccccccc; status: open; final-validation inclusion: planned.\n\n### Final Validation Evidence\n\n- Limit escalation: none.\n\n### Cleanup Evidence\n\n- None.\n\n## Implementation Agent Feedback\n\n- None.\n\n## Final Architect Validation Notes\n\nPending Architect validation.\n";
const taskLines = [
  `- Effective content head: ${effectiveSha}.`,
  "- Architect validation pass: passed.",
  "- Final Architect validation completed at: 2026-10-15T12:00:00Z",
  `- Architect validated effective content head: ${effectiveSha}.`,
  "- Architect return count for this work cycle: 0.",
];
const diffDigest = "d".repeat(64);
const cycleLine = `- PR #42; branch: codex/evidence; observed head SHA: ${headSha}; effective content head: ${effectiveSha}; status: final validation passed; observed at: 2026-10-15T12:02:00Z; final-validation inclusion: included.`;
const guardLine = `- Current-PR-head read-only guard: checked head ${headSha} against effective content head ${effectiveSha} at 2026-10-15T12:02:00Z; evidence-only changes confirmed; proof: git-diff-sha256:${diffDigest}.`;
const addCycleAndGuard = (tasks, cycle = cycleLine, guard = guardLine) =>
  tasks
    .replace("### Final Validation Evidence", `${cycle}\n### Final Validation Evidence`)
    .replace("### Cleanup Evidence", `${guard}\n### Cleanup Evidence`);

test("only schema-valid additions at the end of existing final sections qualify", () => {
  const featureAfter = featureBefore + featureLines.join("\n") + "\n";
  const tasksAfter = tasksBefore + taskLines.join("\n") + "\n";
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
    featureBefore + featureLines.join("\n").replace("12:01:00Z", "12:01:00Z.") + "\n",
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

test("short route requires one bounded return count in each role-owned section", () => {
  const feature = featureBefore + featureLines.join("\n") + "\n";
  const tasks = tasksBefore + taskLines.join("\n") + "\n";
  for (const invalid of [
    tasks.replace("- Architect return count for this work cycle: 0.\n", ""),
    tasks.replace(
      "- Architect return count for this work cycle: 0.",
      "- Architect return count for this work cycle: 11.",
    ),
    tasks + "- Architect return count for this work cycle: 1.\n",
    tasks.replace("## Final Architect Validation Notes", "## Other Notes"),
    tasks
      .replace("- Architect return count for this work cycle: 0.", "")
      .replace(
        "### Cleanup Evidence",
        "- Architect return count for this work cycle: 0.\n### Cleanup Evidence",
      ),
  ]) {
    assert.equal(matchingValidationMarkers(feature, invalid), null);
  }
  for (const invalid of [
    feature.replace("- Analyst return count for this work cycle: 0.\n", ""),
    feature.replace(
      "- Analyst return count for this work cycle: 0.",
      "- Analyst return count for this work cycle: 6.",
    ),
    feature + "- Analyst return count for this work cycle: 1.\n",
    feature.replace("## Final Analyst Validation Notes", "## Other Notes"),
  ]) {
    assert.equal(matchingValidationMarkers(invalid, tasks), null);
  }
  assert.equal(matchingValidationMarkers(feature, tasks), effectiveSha);
  assert.equal(
    matchingValidationMarkers(
      feature.replace(
        "return count for this work cycle: 0.",
        "return count for this work cycle: 5.",
      ),
      tasks.replace(
        "return count for this work cycle: 0.",
        "return count for this work cycle: 10.",
      ),
    ),
    effectiveSha,
  );
});

test("finalizer and CI classifier accept the same append-only role validation schema", () => {
  const featurePath = "specs/999-ci-fixture";
  const featureFile = `${featurePath}/feature-request.md`;
  const tasksFile = `${featurePath}/tasks.md`;
  const featureAfter = featureBefore + featureLines.join("\n") + "\n";
  const tasksAfter = tasksBefore + taskLines.join("\n") + "\n";
  const additionDiff = (path, before, lines) => {
    const oldCount = before.trimEnd().split("\n").length;
    return `diff --git a/${path} b/${path}\n--- a/${path}\n+++ b/${path}\n@@ -${oldCount},0 +${oldCount + 1},${lines.length} @@\n${lines.map((line) => `+${line}`).join("\n")}\n`;
  };
  const diff =
    additionDiff(featureFile, featureBefore, featureLines) +
    additionDiff(tasksFile, tasksBefore, taskLines);
  const currentFiles = { [featureFile]: featureAfter, [tasksFile]: tasksAfter };

  assert.deepEqual(
    evidenceAddition(featureBefore, featureAfter, "feature-request.md", effectiveSha),
    featureLines,
  );
  assert.deepEqual(evidenceAddition(tasksBefore, tasksAfter, "tasks.md", effectiveSha), taskLines);
  assert.equal(matchingValidationMarkers(featureAfter, tasksAfter), effectiveSha);
  assert.deepEqual(evaluatePostEffectiveHeadDiff(diff, currentFiles, featurePath, effectiveSha), {
    postEffectiveHeadEvidenceOnly: true,
    postEffectiveHeadInvalidChanges: [],
  });

  const oldTasksAfter = tasksBefore.replace(
    "### Cleanup Evidence",
    taskLines.join("\n") + "\n### Cleanup Evidence",
  );
  assert.equal(evidenceAddition(tasksBefore, oldTasksAfter, "tasks.md", effectiveSha), null);
  const oldLocation = oldTasksAfter.split("\n").indexOf(taskLines[0]) + 1;
  const oldDiff = `diff --git a/${tasksFile} b/${tasksFile}\n--- a/${tasksFile}\n+++ b/${tasksFile}\n@@ -${oldLocation - 1},0 +${oldLocation},${taskLines.length} @@\n${taskLines.map((line) => `+${line}`).join("\n")}\n`;
  assert.equal(
    evaluatePostEffectiveHeadDiff(
      oldDiff,
      { [tasksFile]: oldTasksAfter },
      featurePath,
      effectiveSha,
    ).postEffectiveHeadEvidenceOnly,
    false,
  );
});

test("only a bound cycle result and checked-parent guard may extend final process sections", () => {
  const tasksWithRoles = tasksBefore + taskLines.join("\n") + "\n";
  const context = { prNumber: 42, headRef: "codex/evidence", parentSha: headSha, diffDigest };
  const withProcess = addCycleAndGuard(tasksWithRoles);
  assert.deepEqual(
    evidenceAddition(tasksWithRoles, withProcess, "tasks.md", effectiveSha, context),
    [cycleLine, guardLine],
  );
  for (const invalid of [
    addCycleAndGuard(tasksWithRoles, cycleLine.replace("#42", "#43")),
    addCycleAndGuard(tasksWithRoles, cycleLine.replace("codex/evidence", "codex/other")),
    addCycleAndGuard(tasksWithRoles, cycleLine.replace(effectiveSha, baseSha)),
    addCycleAndGuard(tasksWithRoles, cycleLine.replace(headSha, baseSha)),
    addCycleAndGuard(tasksWithRoles, cycleLine.replace("12:02:00Z", "99:99:99Z")),
    addCycleAndGuard(tasksWithRoles, cycleLine.replace("final validation passed", "pending")),
    addCycleAndGuard(tasksWithRoles, cycleLine, guardLine.replace(headSha, baseSha)),
    addCycleAndGuard(tasksWithRoles, cycleLine, guardLine.replace(effectiveSha, baseSha)),
    addCycleAndGuard(tasksWithRoles, cycleLine, guardLine.replace("12:02:00Z", "99:99:99Z")),
    addCycleAndGuard(tasksWithRoles, cycleLine, guardLine.replace(diffDigest, baseSha)),
    withProcess.replace("- node --test passed.", "- Changed task semantics."),
    withProcess.replace("### Cleanup Evidence", "### New process heading\n### Cleanup Evidence"),
    tasksWithRoles.replace("### Cleanup Evidence", `${cycleLine}\n### Cleanup Evidence`),
  ]) {
    assert.equal(
      evidenceAddition(tasksWithRoles, invalid, "tasks.md", effectiveSha, context),
      null,
    );
  }
  const path = "specs/999-ci-fixture/tasks.md";
  const featurePath = "specs/999-ci-fixture";
  for (const line of [cycleLine, guardLine]) {
    const current =
      line === cycleLine
        ? tasksWithRoles.replace(
            "### Final Validation Evidence",
            `${line}\n### Final Validation Evidence`,
          )
        : tasksWithRoles.replace("### Cleanup Evidence", `${line}\n### Cleanup Evidence`);
    const location = current.split("\n").indexOf(line) + 1;
    const diff = `diff --git a/${path} b/${path}\n--- a/${path}\n+++ b/${path}\n@@ -${location - 1},0 +${location},1 @@\n+${line}\n`;
    assert.equal(
      evaluatePostEffectiveHeadDiff(diff, { [path]: current }, featurePath, effectiveSha)
        .postEffectiveHeadEvidenceOnly,
      true,
    );
  }
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
  for (const path of [
    ".github/workflows/ci.yml@main",
    ".github/workflows/ci.yml@codex/evidence",
    ".github/workflows/ci.yml@refs/pull/42/merge",
  ]) {
    assert.ok(validatePriorRun({ ...valid, run: { ...run, path } }));
  }
  for (const path of [
    ".github/workflows/ci.yml.evil@main",
    ".github/workflows/other.yml@main",
    ".github/workflows/ci.yml@",
    ".github/workflows/ci.yml@main@other",
    ".github/workflows/ci.yml@main other",
  ]) {
    assert.equal(validatePriorRun({ ...valid, run: { ...run, path } }), null);
  }
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
    const source = `import { changedEvidenceCommits } from ${JSON.stringify(moduleUrl)}; console.log(JSON.stringify(changedEvidenceCommits(process.argv[1], process.argv[2], { prNumber: 42, headRef: "codex/evidence" })));`;
    return JSON.parse(
      execFileSync(process.execPath, ["--input-type=module", "-e", source, effective, head], {
        cwd: directory,
        encoding: "utf8",
      }),
    );
  };
  const inspectControl = (base, head) => {
    const source = `import { controlUnchanged } from ${JSON.stringify(moduleUrl)}; console.log(controlUnchanged(process.argv[1], process.argv[2]));`;
    return (
      execFileSync(process.execPath, ["--input-type=module", "-e", source, base, head], {
        cwd: directory,
        encoding: "utf8",
      }).trim() === "true"
    );
  };
  const proofDigest = (effective, checked) =>
    createHash("sha256")
      .update(
        execFileSync(
          "git",
          [
            "diff",
            "--binary",
            "--no-ext-diff",
            "--no-textconv",
            "--no-color",
            "--no-renames",
            "--full-index",
            effective,
            checked,
            "--",
          ],
          { cwd: directory },
        ),
      )
      .digest("hex");
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
    const architectEvidence =
      tasksBefore + taskLines.join("\n").replaceAll(effectiveSha, effective) + "\n";
    const featureEvidence =
      featureBefore + featureLines.join("\n").replaceAll(effectiveSha, effective) + "\n";
    write(root + "feature-request.md", featureEvidence);
    git("add", ".");
    git("commit", "-qm", "premature analyst evidence");
    assert.equal(inspect(effective, git("rev-parse", "HEAD")), null);
    write(root + "tasks.md", architectEvidence);
    git("add", ".");
    git("commit", "-qm", "architect after analyst");
    assert.equal(matchingValidationMarkers(featureEvidence, architectEvidence), effective);
    assert.equal(inspect(effective, git("rev-parse", "HEAD")), null);
    git("reset", "--hard", effective);
    write(root + "tasks.md", architectEvidence);
    write(root + "feature-request.md", featureEvidence);
    git("add", ".");
    git("commit", "-qm", "simultaneous role evidence");
    assert.equal(inspect(effective, git("rev-parse", "HEAD")), null);
    git("reset", "--hard", effective);
    write(root + "tasks.md", architectEvidence);
    git("add", ".");
    git("commit", "-qm", "architect evidence");
    const architectHead = git("rev-parse", "HEAD");
    assert.deepEqual(inspect(effective, architectHead), {
      feature: "999-ci-fixture",
      changedFiles: [root + "tasks.md"],
    });
    write(
      root + "tasks.md",
      addCycleAndGuard(
        architectEvidence,
        cycleLine.replace(headSha, architectHead).replace(effectiveSha, effective),
        guardLine
          .replace(headSha, architectHead)
          .replace(effectiveSha, effective)
          .replace(diffDigest, proofDigest(effective, architectHead)),
      ),
    );
    git("add", ".");
    git("commit", "-qm", "premature process evidence");
    assert.equal(inspect(effective, git("rev-parse", "HEAD")), null);
    git("reset", "--hard", architectHead);
    write(root + "feature-request.md", featureEvidence);
    git("add", ".");
    git("commit", "-qm", "analyst evidence");
    const evidenceHead = git("rev-parse", "HEAD");
    assert.deepEqual(inspect(effective, evidenceHead), {
      feature: "999-ci-fixture",
      changedFiles: [root + "feature-request.md", root + "tasks.md"],
    });
    const rolesHead = evidenceHead;
    const processEvidence = addCycleAndGuard(
      architectEvidence,
      cycleLine.replace(headSha, rolesHead).replace(effectiveSha, effective),
      guardLine
        .replace(headSha, rolesHead)
        .replace(effectiveSha, effective)
        .replace(diffDigest, proofDigest(effective, rolesHead)),
    );
    write(root + "tasks.md", processEvidence);
    git("add", ".");
    git("commit", "-qm", "guard and cycle evidence");
    const processHead = git("rev-parse", "HEAD");
    assert.deepEqual(inspect(effective, processHead), {
      feature: "999-ci-fixture",
      changedFiles: [root + "feature-request.md", root + "tasks.md"],
    });
    const process = readProcessEvidence(directory, "specs/999-ci-fixture", processHead);
    assert.equal(process.finalArchitectValidation, true);
    assert.equal(process.finalAnalystValidation, true);
    assert.equal(process.finalValidationOrder, true);
    assert.equal(process.acceptanceEvidence, true);
    assert.equal(process.currentProcessMemory, true);
    assert.equal(process.feedbackDisposition, true);
    assert.equal(process.effectiveContentHead, effective);
    assert.equal(process.effectiveContentHeadValidation, true);
    assert.equal(process.architectValidatedEffectiveContentHead, effective);
    assert.equal(process.analystValidatedEffectiveContentHead, effective);
    assert.equal(process.currentHeadGuardEvidence, true);
    assert.equal(process.acceptedKnownIssueDecisionPending, false);
    assert.equal(process.processEvidenceSourceError, undefined);
    const postHead = verifyPostEffectiveHeadChanges(
      directory,
      "specs/999-ci-fixture",
      effective,
      processHead,
    );
    assert.equal(postHead.postEffectiveHeadEvidenceOnly, true);
    assert.equal(postHead.postEffectiveHeadVerificationError, null);
    assert.deepEqual(postHead.postEffectiveHeadInvalidPaths, []);
    const requiredChecks = JSON.parse(
      readFileSync(new URL("../.unicorn-hub/config.json", import.meta.url), "utf8"),
    ).requiredChecks;
    const finalization = evaluateFinalizationGates({
      suppliedHeadSha: processHead,
      requireExpectedHead: true,
      pr: {
        number: 42,
        headSha: processHead,
        isDraft: false,
        mergeable: "MERGEABLE",
        mergeStateStatus: "CLEAN",
      },
      requiredChecks,
      checks: requiredChecks.map((name) => ({ name, status: "COMPLETED", conclusion: "SUCCESS" })),
      reviewThreads: [],
      blockingFindings: [],
      processEvidence: { ...process, ...postHead },
    });
    assert.equal(finalization.ready, true);
    assert.deepEqual(finalization.blockers, []);
    const repeatedGuard = guardLine
      .replace(headSha, processHead)
      .replace(effectiveSha, effective)
      .replace(diffDigest, proofDigest(effective, processHead));
    write(
      root + "tasks.md",
      processEvidence.replace("### Cleanup Evidence", `${repeatedGuard}\n### Cleanup Evidence`),
    );
    git("add", ".");
    git("commit", "-qm", "duplicate guard evidence");
    assert.equal(inspect(effective, git("rev-parse", "HEAD")), null);
    git("reset", "--hard", processHead);
    write(
      root + "tasks.md",
      processEvidence.replace("Pending Architect validation.", "Changed substantive task."),
    );
    git("add", ".");
    git("commit", "-qm", "semantic edit");
    assert.equal(inspect(effective, git("rev-parse", "HEAD")), null);
    for (const controlPath of [
      "AGENTS.md",
      ".unicorn-hub/config.json",
      "scripts/apply-branch-protection.mjs",
      "scripts/finalize-pr.mjs",
      "scripts/ai-review-gate.mjs",
      "scripts/ai-review-helpers.mjs",
      "scripts/resolve-pr-context.mjs",
      "scripts/shared.mjs",
    ]) {
      git("reset", "--hard", processHead);
      write(controlPath, "changed control\n");
      git("add", ".");
      git("commit", "-qm", `control edit ${controlPath}`);
      assert.equal(inspectControl(effective, git("rev-parse", "HEAD")), false);
      assert.equal(inspect(effective, git("rev-parse", "HEAD")), null);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
