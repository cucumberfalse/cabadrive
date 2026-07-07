import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";

const auditScript = "scripts/manual-guide-translation-completeness-audit.mjs";
const committedEvidencePath = "content/validation/manual-guide-translation-completeness.evidence.json";

function tempRoot(prefix) {
  return mkdtempSync(join(tmpdir(), prefix));
}

function runAudit(sectionRoot, evidencePath, args = []) {
  return spawnSync(process.execPath, [auditScript, ...args], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      MANUAL_GUIDE_TRANSLATION_COMPLETENESS_SECTION_ROOT: sectionRoot,
      MANUAL_GUIDE_TRANSLATION_COMPLETENESS_EVIDENCE_PATH: evidencePath
    },
    encoding: "utf8"
  });
}

function writeSection(root, fileName, body) {
  mkdirSync(root, { recursive: true });
  writeFileSync(join(root, fileName), body);
}

function supportedProbeFixture() {
  return `
import type { ManualGuideSectionContent } from "../manualGuide";

export const ch3HighwaysSection: ManualGuideSectionContent = {
  id: "fixture-content",
  sectionId: "ch3-highways",
  titleRu: "Движение по автомагистралям",
  sourcePages: [78],
  sourceTitleEs: "Circulacion por autopistas y otras vias rapidas",
  status: "implemented",
  styleTokenFamilies: [],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [],
    russianScreenshots: [],
    notes: ["sourceTextEs and asset paths are validation metadata, not learner text."]
  },
  blocks: [
    {
      id: "probe-list",
      kind: "list",
      titleRu: "Ingreso: carriles de aceleración (въезд: полосы разгона)",
      sourceTextEs: "Ingreso a estas vias. Autopista source text remains here.",
      itemsRu: [
        "carriles de aceleración (полосы разгона) ведут к calzada (проезжей части).",
        "Проверить tránsito de la vía principal (движение по основной дороге) через espejos retrovisores (зеркала заднего вида).",
        "luz de giro izquierda (левый указатель поворота) предупреждает об incorporación (включении в поток).",
        "espacio / gap (свободный промежуток) нужен перед входом в поток.",
        "velocidad adecuada del tramo (подходящая скорость для участка) должна соответствовать autopista (автомагистрали) или vía rápida (скоростной дороге)."
      ],
      assetPath: "content/assets/not-learner-facing-autopista.jpg"
    },
    {
      id: "structured-pair",
      kind: "source-image-cards",
      titleRu: "Термины",
      sourceTextEs: "Image Spanish is protected source evidence.",
      cards: [
        {
          id: "card",
          titleRu: "Карточка",
          assetPath: "content/assets/source-calzada.jpg",
          altRu: "Схема с русским описанием.",
          visibleSpanish: true,
          termTranslations: [
            { termEs: "Banquina", translationRu: "Обочина" }
          ],
          bodyRu: "Защищенные пиксели не проверяются этим текстовым аудитом."
        }
      ]
    }
  ]
};
`;
}

test("manual guide translation completeness committed evidence covers screenshot probes", () => {
  const evidence = JSON.parse(readFileSync(committedEvidencePath, "utf8"));
  assert.equal(evidence.generatedBy, auditScript);
  assert.equal(evidence.featureId, "041-manual-translation-completion");
  assert.equal(evidence.counts.implementedSections, 50);
  assert.equal(evidence.counts.unresolvedFindings, 0);
  assert.equal(evidence.requiredProbeCoverage.length, 11);
  assert.deepEqual(new Set(evidence.requiredProbeCoverage.map((probe) => probe.status)), new Set(["pass"]));
  assert.ok(evidence.requiredProbeCoverage.some((probe) => probe.probe === "Ingreso: carriles de aceleración"));
  assert.ok(evidence.requiredProbeCoverage.some((probe) => probe.probe === "vía rápida"));
});

test("manual guide translation completeness audit writes evidence and accepts fresh check mode", () => {
  const root = tempRoot("manual-guide-translation-pass-");
  const evidencePath = join(root, "evidence.json");
  try {
    writeSection(root, "ch3-highways.ts", supportedProbeFixture());
    const write = runAudit(root, evidencePath, ["--write"]);
    assert.equal(write.status, 0, write.stderr);
    assert.ok(existsSync(evidencePath));

    const check = runAudit(root, evidencePath);
    assert.equal(check.status, 0, check.stderr);
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    assert.equal(evidence.counts.implementedSections, 1);
    assert.equal(evidence.counts.unresolvedFindings, 0);
    assert.equal(evidence.residues.some((entry) => entry.disposition === "retained-with-inline-translation"), true);
    assert.equal(evidence.residues.some((entry) => entry.disposition === "retained-with-structured-adjacent-translation"), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("manual guide translation completeness audit rejects stale and malformed evidence", () => {
  const root = tempRoot("manual-guide-translation-stale-");
  const evidencePath = join(root, "evidence.json");
  try {
    writeSection(root, "ch3-highways.ts", supportedProbeFixture());
    assert.equal(runAudit(root, evidencePath, ["--write"]).status, 0);

    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    evidence.counts.inspectedStrings += 1;
    writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
    const stale = runAudit(root, evidencePath);
    assert.notEqual(stale.status, 0);
    assert.match(stale.stderr, /committed evidence is stale/);

    writeFileSync(evidencePath, "{ nope");
    const malformed = runAudit(root, evidencePath);
    assert.notEqual(malformed.status, 0);
    assert.match(malformed.stderr, /committed evidence is malformed/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("manual guide translation completeness audit ignores source fields but rejects learner-facing residue", () => {
  const root = tempRoot("manual-guide-translation-fail-");
  const evidencePath = join(root, "evidence.json");
  try {
    writeSection(
      root,
      "ch3-highways.ts",
      supportedProbeFixture().replace(
        "carriles de aceleración (полосы разгона) ведут к calzada (проезжей части).",
        "carriles de aceleración ведут к calzada."
      )
    );
    const result = runAudit(root, evidencePath, ["--write"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /learner-facing-spanish-without-russian-support/);
    assert.match(result.stderr, /blocks\.0\.itemsRu\.0/);
    assert.doesNotMatch(result.stderr, /sourceTextEs/);
    assert.doesNotMatch(result.stderr, /assetPath/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("manual guide translation completeness audit rejects generic traffic term exceptions", () => {
  const root = tempRoot("manual-guide-translation-exception-");
  const evidencePath = join(root, "evidence.json");
  try {
    writeSection(root, "ch3-highways.ts", supportedProbeFixture());
    assert.equal(runAudit(root, evidencePath, ["--write"]).status, 0);
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    evidence.exceptions.push({
      sectionId: "ch3-highways",
      fieldPath: "blocks.0.itemsRu.0",
      detectedSpanishPhrase: "calzada",
      disposition: "allowed-narrow-exception"
    });
    writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);

    const result = runAudit(root, evidencePath);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /generic traffic terms cannot be allowlisted as exceptions/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
