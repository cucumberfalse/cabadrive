import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const workflow = readFileSync(new URL("../.github/workflows/ai-review.yml", import.meta.url), "utf8");

test("pull request AI Review runs trigger the selected backend before polling", () => {
  assert.match(workflow, /EVENT_NAME:\s*\$\{\{\s*github\.event_name\s*\}\}/);
  assert.match(
    workflow,
    /if \[ "\$\{EVENT_NAME\}" = "workflow_dispatch" \]; then[\s\S]*trigger_mode="\$\{REQUESTED_TRIGGER_MODE:-skip\}"[\s\S]*else[\s\S]*trigger_mode="comment"[\s\S]*fi/
  );
});
