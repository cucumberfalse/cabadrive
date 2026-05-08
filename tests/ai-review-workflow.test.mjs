import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const workflow = readFileSync(new URL("../.github/workflows/ai-review.yml", import.meta.url), "utf8");
const gate = readFileSync(new URL("../scripts/ai-review-gate.mjs", import.meta.url), "utf8");

test("same-repository pull request AI Review runs trigger the selected backend before polling", () => {
  assert.match(workflow, /EVENT_NAME:\s*\$\{\{\s*github\.event_name\s*\}\}/);
  assert.match(workflow, /GITHUB_TOKEN:\s*\$\{\{\s*secrets\.AI_REVIEW_GITHUB_TOKEN\s*\|\|\s*github\.token\s*\}\}/);
  assert.match(workflow, /PR_HEAD_REPOSITORY:\s*\$\{\{\s*github\.event\.pull_request\.head\.repo\.full_name\s*\|\|\s*''\s*\}\}/);
  assert.match(
    workflow,
    /if \[ "\$\{EVENT_NAME\}" = "workflow_dispatch" \]; then[\s\S]*trigger_mode="\$\{REQUESTED_TRIGGER_MODE:-skip\}"[\s\S]*elif \[ "\$\{PR_HEAD_REPOSITORY\}" = "\$\{REPOSITORY\}" \]; then[\s\S]*trigger_mode="comment"[\s\S]*else[\s\S]*trigger_mode="skip"[\s\S]*fi/
  );
});

test("AI Review gate handles trigger comment permission denial without a stack trace", () => {
  assert.match(gate, /Could not post AI Review trigger comment/);
  assert.match(gate, /error\.status === 403/);
  assert.match(gate, /waiting for existing or human-triggered review evidence/);
});
