import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

test("Linux CI resource predicates and actual own interrupt/drain/finally regressions", () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const out = execFileSync("python3", ["tests/ci-docker-resources-cases.py"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 1024 ** 2,
  });
  assert.match(out, /LINUX_RESOURCE_REGRESSIONS_PASS/u);
});
