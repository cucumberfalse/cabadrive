import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const scriptPath = "scripts/manual-guide-visual-completeness-audit.mjs";

async function runAudit(evidencePath, args = []) {
  return execFileAsync("node", [scriptPath, ...args], {
    env: {
      ...process.env,
      MANUAL_GUIDE_VISUAL_COMPLETENESS_EVIDENCE_PATH: evidencePath
    }
  });
}

async function assertAuditFails(evidencePath, expectedMessage) {
  await assert.rejects(
    () => runAudit(evidencePath),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, expectedMessage);
      assert.match(error.stderr, /--write/u);
      return true;
    }
  );
}

test("manual guide visual completeness audit requires explicit write mode for evidence updates", async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "cabadrive-manual-visual-audit-"));
  const evidencePath = join(tempRoot, "manual-guide-visual-completeness.evidence.json");

  try {
    await assertAuditFails(evidencePath, /committed evidence file is missing/u);
    assert.equal(existsSync(evidencePath), false, "check mode does not create missing evidence");

    const writeResult = await runAudit(evidencePath, ["--write"]);
    assert.match(writeResult.stdout, /manual guide visual completeness audit wrote/u);
    const writtenEvidence = readFileSync(evidencePath, "utf8");

    const checkResult = await runAudit(evidencePath);
    assert.match(checkResult.stdout, /manual guide visual completeness audit checked/u);
    assert.equal(readFileSync(evidencePath, "utf8"), writtenEvidence, "check mode leaves current evidence unchanged");

    const staleEvidence = writtenEvidence.replace('"schemaVersion": 1', '"schemaVersion": 999');
    writeFileSync(evidencePath, staleEvidence);
    await assertAuditFails(evidencePath, /committed evidence is stale or different/u);
    assert.equal(readFileSync(evidencePath, "utf8"), staleEvidence, "check mode does not rewrite stale evidence");

    writeFileSync(evidencePath, "{not-json}\n");
    await assertAuditFails(evidencePath, /committed evidence file is malformed JSON/u);
    assert.equal(readFileSync(evidencePath, "utf8"), "{not-json}\n", "check mode does not rewrite malformed evidence");

    unlinkSync(evidencePath);
    await assertAuditFails(evidencePath, /committed evidence file is missing/u);
    assert.equal(existsSync(evidencePath), false, "check mode still does not create missing evidence");
  } finally {
    rmSync(tempRoot, { force: true, recursive: true });
  }
});
