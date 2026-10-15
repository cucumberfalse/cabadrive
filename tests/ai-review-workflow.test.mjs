import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const workflow = readFileSync(
  new URL("../.github/workflows/ai-review.yml", import.meta.url),
  "utf8",
);
const gate = readFileSync(new URL("../scripts/ai-review-gate.mjs", import.meta.url), "utf8");

test("actual workflow policy keeps initial triggers and makes every rerun evaluation-only", () => {
  const policy = workflow
    .match(/name: Resolve selected review policy[\s\S]*?run: \|\n([\s\S]*?)\n {6}- name:/)[1]
    .replace(/^ {10}/gm, "");
  const dir = mkdtempSync(join(tmpdir(), "ai-review-policy-"));
  try {
    for (const EVENT_NAME of ["pull_request", "workflow_dispatch"])
      for (const attempt of ["1", "2", "10", "0", "invalid"]) {
        const output = join(dir, `${EVENT_NAME}-${attempt}`);
        const result = spawnSync("bash", ["-c", policy], {
          encoding: "utf8",
          env: {
            ...process.env,
            SELECTED_AGENT: "codex",
            REQUESTED_TRIGGER_MODE: "comment",
            EVENT_NAME,
            PR_HEAD_REPOSITORY: "owner/repo",
            REPOSITORY: "owner/repo",
            HAS_AI_REVIEW_GITHUB_TOKEN: "true",
            GITHUB_RUN_ATTEMPT: attempt,
            GITHUB_OUTPUT: output,
          },
        });
        if (attempt === "0" || attempt === "invalid") assert.notEqual(result.status, 0);
        else {
          assert.equal(result.status, 0, result.stderr);
          assert.match(
            readFileSync(output, "utf8"),
            new RegExp(`trigger_mode=${attempt === "1" ? "comment" : "skip"}`),
          );
        }
      }
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test("same-repository pull request AI Review runs trigger the selected backend before polling", () => {
  assert.match(workflow, /ref:\s*\$\{\{\s*github\.event\.repository\.default_branch\s*\}\}/);
  assert.match(workflow, /EVENT_NAME:\s*\$\{\{\s*github\.event_name\s*\}\}/);
  assert.match(
    workflow,
    /GITHUB_TOKEN:\s*\$\{\{\s*secrets\.AI_REVIEW_GITHUB_TOKEN\s*\|\|\s*github\.token\s*\}\}/,
  );
  assert.match(
    workflow,
    /HAS_AI_REVIEW_GITHUB_TOKEN:\s*\$\{\{\s*secrets\.AI_REVIEW_GITHUB_TOKEN != ''\s*\}\}/,
  );
  assert.match(
    workflow,
    /PR_HEAD_REPOSITORY:\s*\$\{\{\s*github\.event\.pull_request\.head\.repo\.full_name\s*\|\|\s*''\s*\}\}/,
  );
  assert.match(
    workflow,
    /elif \[ "\$\{EVENT_NAME\}" = "workflow_dispatch" \]; then[\s\S]*trigger_mode="\$\{REQUESTED_TRIGGER_MODE:-skip\}"[\s\S]*elif \[ "\$\{PR_HEAD_REPOSITORY\}" = "\$\{REPOSITORY\}" \] && \[ "\$\{HAS_AI_REVIEW_GITHUB_TOKEN\}" = "true" \]; then[\s\S]*trigger_mode="comment"[\s\S]*else[\s\S]*trigger_mode="skip"[\s\S]*fi/,
  );
});

test("AI Review gate handles trigger comment permission denial without a stack trace", () => {
  assert.match(gate, /Could not post AI Review trigger comment/);
  assert.match(gate, /error\.status !== 403/);
  assert.match(gate, /waiting for existing or human-triggered review evidence/);
  assert.match(gate, /throw error/);
});

test("AI Review gate ignores resolved Codex root findings without filtering by request or head", () => {
  assert.match(gate, /api.resolvedCommentIds\(number\)/);
  assert.match(gate, /!comment.in_reply_to_id && !resolvedIds.has\(comment.id\)/);
});

const wakeup = readFileSync(
  new URL("../.github/workflows/ai-review-wakeup.yml", import.meta.url),
  "utf8",
);
const signalWorkflow = readFileSync(
  new URL("../.github/workflows/ai-review-native-signal.yml", import.meta.url),
  "utf8",
);
const condition = wakeup.match(/ {4}if: \|\n([\s\S]*?) {4}runs-on:/)[1].trim();
function workflowAllows(eventName, event) {
  const github = {
    event_name: eventName,
    event: {
      comment: { user: { login: "" }, body: "" },
      review: { user: { login: "" } },
      issue: {},
      ...event,
    },
  };
  return Boolean(
    Function(
      "github",
      "contains",
      `return (${condition});`,
    )(github, (body, marker) => String(body).toLowerCase().includes(marker.toLowerCase())),
  );
}

test("actual wakeup workflow filter admits created/edited receipt, summary, and whitespace legacy", () => {
  assert.match(wakeup, /issue_comment:\s*types: \[created, edited\]/);
  for (const action of ["created", "edited"])
    for (const body of [
      "Codex Review: clean",
      " \nCodex Review: clean",
      "<!-- codex-review-receipt:v1 -->",
      "<!-- codex-pull-request-review-summary -->",
      "<!-- codex-review-state:v1 {} -->",
    ]) {
      assert.equal(
        workflowAllows("issue_comment", {
          action,
          issue: { pull_request: {} },
          comment: { body, user: { login: "chatgpt-codex-connector[bot]" } },
        }),
        true,
      );
    }
  assert.equal(
    workflowAllows("issue_comment", {
      issue: { pull_request: {} },
      comment: { body: "Codex Review:", user: { login: "owner" } },
    }),
    true,
  );
  assert.equal(
    workflowAllows("issue_comment", {
      comment: { body: "Codex Review:", user: { login: "chatgpt-codex-connector[bot]" } },
    }),
    false,
  );
});
test("coarse workflow routing admits configured identities and keeps unrelated text out", () => {
  for (const action of ["created", "edited"])
    for (const login of ["custom-codex", "CUSTOM-CODEX", "unknown"])
      for (const body of [
        "<!-- codex-review-receipt:v1 -->",
        "<!-- codex-pull-request-review-summary -->",
      ])
        assert.equal(
          workflowAllows("issue_comment", {
            action,
            issue: { pull_request: {} },
            comment: { body, user: { login } },
          }),
          true,
        );
  assert.equal(
    workflowAllows("issue_comment", {
      issue: { pull_request: {} },
      comment: { body: "unrelated", user: { login: "custom-codex" } },
    }),
    false,
  );
});
test("resolution schedules discover pinned PRs read-only and share direct-event per-PR serialization", () => {
  assert.match(wakeup, /schedule:\s*- cron: ["']\*\/15 \* \* \* \*["']/);
  assert.match(wakeup, /matrix:[\s\S]*fromJSON\(needs.context.outputs.pr_matrix\)/);
  assert.match(wakeup, /group: ai-review-wakeup-\$\{\{ matrix.pull.number \}\}/);
  assert.match(wakeup, /AI_REVIEW_HEAD_SHA: \$\{\{ matrix.pull.head_sha \}\}/);
  assert.match(wakeup, /github.event_name == 'schedule'/);
  assert.doesNotMatch(wakeup, /pull_request_review_thread/);
});

test("wakeup uses trusted default scripts and bot token with shared serialized completion backstop", () => {
  assert.match(
    wakeup,
    /workflow_run:\s*workflows: \[AI Review, AI Review Native Signal\]\s*types: \[completed\]/,
  );
  assert.match(signalWorkflow, /pull_request_review:\s*types: \[submitted, edited, dismissed\]/);
  assert.match(
    signalWorkflow,
    /pull_request_review_comment:\s*types: \[created, edited, deleted\]/,
  );
  assert.match(wakeup, /run: node scripts\/ai-review-wakeup\.mjs/);
  assert.match(wakeup, /ref: \$\{\{ github\.event\.repository\.default_branch \}\}/);
  assert.match(wakeup, /GITHUB_TOKEN: \$\{\{ github\.token \}\}/);
  assert.match(wakeup, /needs\.context\.outputs\.pr_matrix/);
  assert.match(wakeup, /cancel-in-progress: false/);
  assert.doesNotMatch(
    wakeup,
    /workflow_dispatch|pull_request\.head\.ref|AI_REVIEW_GITHUB_TOKEN|actions\/github-script/,
  );
});

test("fork native signal bridge has no privileged execution or credentials", () => {
  assert.match(signalWorkflow, /permissions: \{\}/);
  assert.doesNotMatch(signalWorkflow, /uses:|checkout|secrets|GITHUB_TOKEN|node scripts/);
  assert.doesNotMatch(wakeup, /^ {2}pull_request_review(?:_comment)?:/m);
  assert.match(wakeup, /run: node scripts\/ai-review-wakeup\.mjs --resolve-only/);
  assert.match(wakeup, /group: ai-review-wakeup-\$\{\{ matrix.pull.number \}\}/);
});
