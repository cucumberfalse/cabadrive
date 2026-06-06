import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const scriptPath = "scripts/manual-guide-visual-completeness-audit.mjs";

async function runAudit(evidencePath, args = [], env = {}) {
  return execFileAsync("node", [scriptPath, ...args], {
    env: {
      ...process.env,
      ...env,
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

test("manual guide visual completeness audit uses Unicode boundaries for Russian source-provenance copy", async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "cabadrive-manual-visual-copy-audit-"));
  const sectionRoot = join(tempRoot, "manual-sections");
  const evidencePath = join(tempRoot, "manual-guide-visual-completeness.evidence.json");
  const env = { MANUAL_GUIDE_SECTION_ROOT: sectionRoot };
  mkdirSync(sectionRoot);

  try {
    const forbiddenFixtureStrings = [
      "Постоянно принимать решения о маневрах, что создает значимый источник стресса и усталости.",
      "Этот источник оставлен для проверки.",
      "Формулировка источника не должна быть learner-facing.",
      "Материал из источника не должен быть видимым ярлыком.",
      "Визуал источника: правильный ремень"
    ];
    writeFileSync(
      join(sectionRoot, "fixture.ts"),
      `export const fixture = ${JSON.stringify(forbiddenFixtureStrings, null, 2)};\n`
    );

    await assert.rejects(
      () => runAudit(evidencePath, ["--write"], env),
      (error) => {
        assert.equal(error.code, 1);
        assert.match(error.stderr, /manual guide copy audit failed with [1-9][0-9]* finding/u);
        return true;
      }
    );

    const failedEvidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    assert.ok(failedEvidence.copyAudit.findingCount >= 4);
    const findingRuleIds = new Set(failedEvidence.copyAudit.findings.map((finding) => finding.ruleId));
    assert.ok(findingRuleIds.has("source-family-provenance"));
    assert.ok(findingRuleIds.has("saved-as-source"));
    assert.ok(findingRuleIds.has("transferred-visual-meta"));
    const findingTexts = new Set(failedEvidence.copyAudit.findings.map((finding) => finding.text));
    assert.ok(findingTexts.has("Этот источник оставлен для проверки."));
    assert.ok(findingTexts.has("Формулировка источника не должна быть learner-facing."));
    assert.ok(findingTexts.has("Материал из источника не должен быть видимым ярлыком."));
    assert.ok(findingTexts.has("Визуал источника: правильный ремень"));
    assert.equal(failedEvidence.copyAudit.allowlistedCount, 1);
    assert.equal(
      failedEvidence.copyAudit.allowlistedOccurrences[0].text,
      "Постоянно принимать решения о маневрах, что создает значимый источник стресса и усталости."
    );

    writeFileSync(
      join(sectionRoot, "fixture.ts"),
      `export const fixture = ${JSON.stringify([forbiddenFixtureStrings[0]], null, 2)};\n`
    );
    const writeResult = await runAudit(evidencePath, ["--write"], env);
    assert.match(writeResult.stdout, /manual guide visual completeness audit wrote/u);
    const passedEvidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    assert.equal(passedEvidence.copyAudit.status, "pass");
    assert.equal(passedEvidence.copyAudit.findingCount, 0);
    assert.equal(passedEvidence.copyAudit.allowlistedCount, 1);
  } finally {
    rmSync(tempRoot, { force: true, recursive: true });
  }
});
