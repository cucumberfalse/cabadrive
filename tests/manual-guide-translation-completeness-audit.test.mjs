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

function runAudit(sectionRoot, evidencePath, args = [], options = {}) {
  return spawnSync(process.execPath, [auditScript, ...args], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      MANUAL_GUIDE_TRANSLATION_COMPLETENESS_SECTION_ROOT: sectionRoot,
      MANUAL_GUIDE_TRANSLATION_COMPLETENESS_EVIDENCE_PATH: evidencePath,
      MANUAL_GUIDE_TRANSLATION_COMPLETENESS_INTRODUCTION_PATH: options.introductionPath ?? "",
      MANUAL_GUIDE_TRANSLATION_COMPLETENESS_MANUAL_SIGN_INVENTORY_PATH: options.manualSignInventoryPath ?? ""
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

function crossRouteSupportedProbeFixture() {
  return supportedProbeFixture()
    .replaceAll("ch3HighwaysSection", "ch3SpeedSection")
    .replaceAll('sectionId: "ch3-highways"', 'sectionId: "ch3-speed"');
}

function supportedManualSignCatalogFixture() {
  return supportedProbeFixture().replace(
    `      assetPath: "content/assets/not-learner-facing-autopista.jpg"\n    },`,
    `      assetPath: "content/assets/not-learner-facing-autopista.jpg"\n    },\n    {\n      id: "fixture-sign-catalog",\n      kind: "manual-sign-catalog",\n      titleRu: "Каталог знаков",\n      sectionId: "fixture-signs"\n    },`
  );
}

function supportedIntroductionFixture(replacementText = "Дорожная культура начинается с уважения к другим участникам движения.") {
  return `
export const pandemiaVialSection = {
  id: "pandemia-vial-section",
  routeHash: "#pandemia-vial",
  titleRu: "Дорожная пандемия",
  titleEs: "Pandemia vial",
  segments: [
    {
      id: "heading",
      role: "heading",
      sourceTextEs: "Pandemia vial",
      textRu: "Дорожная пандемия"
    },
    {
      id: "body",
      role: "body",
      sourceTextEs: "Texto fuente",
      textRu: "Все выводы объяснены по-русски."
    }
  ],
  visualRegions: [
    {
      id: "city-context",
      labelRu: "Контекст города Буэнос-Айрес",
      labelEs: "Contexto Ciudad de Buenos Aires",
      focusDescriptionRu: "Статистика CABA показана как русская подпись."
    }
  ]
} as const;

export const introductionNavigation = [
  {
    id: "intro-road-pandemic",
    routeHash: "#pandemia-vial",
    titleRu: "Дорожная пандемия",
    titleEs: "Pandemia vial",
    sourceIndexHeadingEs: "Pandemia vial",
    startPage: 15,
    endPage: 15,
    renderer: "pandemia"
  },
  {
    id: "intro-ethical-civic-approach",
    routeHash: "#intro-enfoque-etico",
    titleRu: "Этико-гражданский подход в дорожной культуре",
    titleEs: "Enfoque ético - ciudadano en la cultura vial",
    sourceIndexHeadingEs: "Enfoque ético - ciudadano en la cultura vial",
    startPage: 16,
    endPage: 16,
    renderer: "article"
  }
];

export const introductionArticleSections = [
  {
    id: "intro-ethical-civic-approach",
    routeHash: "#intro-enfoque-etico",
    titleRu: "Этико-гражданский подход в дорожной культуре",
    titleEs: "Enfoque ético - ciudadano en la cultura vial",
    sourceIndexHeadingEs: "Enfoque ético - ciudadano en la cultura vial",
    startPage: 16,
    endPage: 16,
    blocks: [
      {
        id: "culture",
        kind: "paragraph",
        sourceTextEs: "Texto fuente",
        textRu: ${JSON.stringify(replacementText)}
      }
    ]
  }
];
`;
}

test("manual guide translation completeness committed evidence covers screenshot probes", () => {
  const evidence = JSON.parse(readFileSync(committedEvidencePath, "utf8"));
  assert.equal(evidence.generatedBy, auditScript);
  assert.equal(evidence.featureId, "041-manual-translation-completion");
  assert.equal(evidence.counts.implementedSections, 50);
  assert.equal(evidence.counts.introductionRoutes, 4);
  assert.equal(evidence.counts.renderedGuideRoutes, 54);
  assert.equal(evidence.routeInventory.counts.manualSectionRoutes, 50);
  assert.equal(evidence.routeInventory.counts.introductionRoutes, 4);
  assert.equal(evidence.routeInventory.counts.renderedGuideRoutes, 54);
  assert.deepEqual(
    evidence.routeInventory.introductionRoutes.map((route) => route.id),
    ["intro-road-pandemic", "intro-ethical-civic-approach", "intro-incident", "intro-road-safety-plan"]
  );
  assert.equal(evidence.counts.unresolvedFindings, 0);
  assert.ok(evidence.reviewedIdentifierPolicies.every((policy) => Array.isArray(policy.identifiers)));
  assert.doesNotMatch(JSON.stringify(evidence.reviewedIdentifierPolicies), /uppercase-acronym|2,8/u);
  assert.doesNotMatch(JSON.stringify(evidence.exceptions), /uppercase acronym or compact official identifier/u);
  assert.equal(evidence.requiredProbeCoverage.length, 11);
  assert.deepEqual(new Set(evidence.requiredProbeCoverage.map((probe) => probe.status)), new Set(["pass"]));
  assert.deepEqual(new Set(evidence.requiredProbeCoverage.map((probe) => probe.sectionId)), new Set(["ch3-highways"]));
  assert.ok(evidence.requiredProbeCoverage.some((probe) => probe.probe === "Ingreso: carriles de aceleración"));
  assert.ok(evidence.requiredProbeCoverage.some((probe) => probe.probe === "vía rápida"));
});

test("manual guide translation completeness audit does not use cross-route support for missing Chapter 3 probes", () => {
  const root = tempRoot("manual-guide-translation-cross-route-probe-");
  const evidencePath = join(root, "evidence.json");
  try {
    writeSection(root, "ch3-speed.ts", crossRouteSupportedProbeFixture());
    const result = runAudit(root, evidencePath, ["--write"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /required-screenshot-probe-missing/);

    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    assert.deepEqual(new Set(evidence.requiredProbeCoverage.map((probe) => probe.sectionId)), new Set(["ch3-highways"]));
    assert.deepEqual(new Set(evidence.requiredProbeCoverage.map((probe) => probe.status)), new Set(["missing"]));
    assert.deepEqual(new Set(evidence.requiredProbeCoverage.map((probe) => probe.fieldPath)), new Set([null]));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("manual guide translation completeness audit includes rendered Introduction routes", () => {
  const root = tempRoot("manual-guide-translation-intro-pass-");
  const evidencePath = join(root, "evidence.json");
  const introductionPath = join(root, "pandemiaVialSection.ts");
  try {
    writeSection(root, "ch3-highways.ts", supportedProbeFixture());
    writeFileSync(introductionPath, supportedIntroductionFixture());
    const write = runAudit(root, evidencePath, ["--write"], { introductionPath });
    assert.equal(write.status, 0, write.stderr);
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    assert.equal(evidence.counts.implementedSections, 1);
    assert.equal(evidence.counts.introductionRoutes, 2);
    assert.equal(evidence.counts.renderedGuideRoutes, 3);
    assert.deepEqual(
      evidence.routeInventory.introductionRoutes.map((route) => route.id),
      ["intro-road-pandemic", "intro-ethical-civic-approach"]
    );
    assert.ok(evidence.residues.some((entry) => entry.sectionId === "intro-road-pandemic"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("manual guide translation completeness audit rejects Introduction route Spanish residue", () => {
  const root = tempRoot("manual-guide-translation-intro-fail-");
  const evidencePath = join(root, "evidence.json");
  const introductionPath = join(root, "pandemiaVialSection.ts");
  try {
    writeSection(root, "ch3-highways.ts", supportedProbeFixture());
    writeFileSync(
      introductionPath,
      supportedIntroductionFixture("Введение оставляет calzada без русского пояснения.")
    );
    const result = runAudit(root, evidencePath, ["--write"], { introductionPath });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /learner-facing-spanish-without-russian-support/);
    assert.match(result.stderr, /intro-ethical-civic-approach/);
    assert.match(result.stderr, /calzada/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
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

test("manual guide translation completeness audit covers rendered manual sign catalog captions", () => {
  const root = tempRoot("manual-guide-translation-sign-catalog-");
  const evidencePath = join(root, "evidence.json");
  const inventoryPath = join(root, "app4SignEntries.json");
  try {
    writeSection(root, "ch3-highways.ts", supportedManualSignCatalogFixture());
    writeFileSync(
      inventoryPath,
      JSON.stringify({
        entries: [
          {
            id: "fixture-sign-entry",
            sectionId: "fixture-signs",
            spanishLabel: "NO AVANZAR",
            variant: "Señal",
            russianTranslation: "Проезд запрещен"
          }
        ]
      })
    );

    const supported = runAudit(root, evidencePath, ["--write"], { manualSignInventoryPath: inventoryPath });
    assert.equal(supported.status, 0, supported.stderr);
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    const catalogResidue = evidence.residues.find(
      (entry) => entry.sourceKind === "manual-sign-catalog" && entry.fieldPath.endsWith(".termEs")
    );
    assert.equal(catalogResidue?.detectedSpanishPhrase, "NO AVANZAR");
    assert.equal(catalogResidue?.disposition, "retained-with-structured-adjacent-translation");

    writeFileSync(
      inventoryPath,
      JSON.stringify({
        entries: [
          {
            id: "fixture-sign-entry",
            sectionId: "fixture-signs",
            spanishLabel: "NO AVANZAR",
            variant: "Señal",
            russianTranslation: "NO AVANZAR"
          }
        ]
      })
    );
    const unsupported = runAudit(root, evidencePath, ["--write"], { manualSignInventoryPath: inventoryPath });
    assert.notEqual(unsupported.status, 0);
    assert.match(unsupported.stderr, /blocks\.1\.entries\.0\.termEs/);
    assert.match(unsupported.stderr, /NO AVANZAR/);
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

test("manual guide translation completeness audit rejects unmatched learner-facing Latin residue beyond dictionary terms", () => {
  const root = tempRoot("manual-guide-translation-unmatched-latin-");
  const evidencePath = join(root, "evidence.json");
  try {
    writeSection(
      root,
      "ch3-highways.ts",
      supportedProbeFixture().replace(
        "espacio / gap (свободный промежуток) нужен перед входом в поток.",
        "Первые 6 месяцев нельзя ездить по arterias."
      )
    );
    const result = runAudit(root, evidencePath, ["--write"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /learner-facing-spanish-without-russian-support/);
    assert.match(result.stderr, /arterias/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("manual guide translation completeness audit rejects document phrases without Russian support", () => {
  const root = tempRoot("manual-guide-translation-document-latin-");
  const evidencePath = join(root, "evidence.json");
  try {
    writeSection(
      root,
      "ch3-highways.ts",
      supportedProbeFixture().replace(
        "espacio / gap (свободный промежуток) нужен перед входом в поток.",
        "Для подтверждения страховки обязательно иметь certificado del seguro de responsabilidad civil."
      )
    );
    const result = runAudit(root, evidencePath, ["--write"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /certificado del seguro de responsabilidad civil/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("manual guide translation completeness audit rejects alcohol-limit Latin residues without support", () => {
  const root = tempRoot("manual-guide-translation-alcohol-latin-");
  const evidencePath = join(root, "evidence.json");
  try {
    writeSection(
      root,
      "ch3-highways.ts",
      supportedProbeFixture().replace(
        "espacio / gap (свободный промежуток) нужен перед входом в поток.",
        "нельзя занимать plaza de acompañante в motovehículo, кроме отдельного habitáculo"
      )
    );
    const result = runAudit(root, evidencePath, ["--write"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /plaza de acompañante/);
    assert.match(result.stderr, /motovehículo/);
    assert.match(result.stderr, /habitáculo/);
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

test("manual guide translation completeness audit requires a direct structural reverse parenthetical pair", () => {
  const root = tempRoot("manual-guide-translation-reverse-pair-");
  const evidencePath = join(root, "evidence.json");
  try {
    const directPair = supportedProbeFixture().replace(
      "espacio / gap (свободный промежуток) нужен перед входом в поток.",
      "espacio / gap (свободный промежуток) нужен перед входом в поток. Линия помощи при домогательствах (ACOSO) доступна круглосуточно."
    );
    writeSection(root, "ch3-highways.ts", directPair);
    const valid = runAudit(root, evidencePath, ["--write"]);
    assert.equal(valid.status, 0, valid.stderr);
    const validEvidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    assert.equal(
      validEvidence.residues.some((entry) =>
        entry.detectedSpanishPhrase === "ACOSO" && entry.disposition === "retained-with-inline-translation"
      ),
      true
    );

    for (const invalidContext of [
      "Линия помощи 22676 (ACOSO) доступна круглосуточно.",
      "Линия помощи SMS (ACOSO) доступна круглосуточно.",
      "Линия помощи доступна круглосуточно. (ACOSO)",
      "Линия помощи / (ACOSO) доступна круглосуточно."
    ]) {
      writeSection(
        root,
        "ch3-highways.ts",
        supportedProbeFixture().replace(
          "espacio / gap (свободный промежуток) нужен перед входом в поток.",
          `espacio / gap (свободный промежуток) нужен перед входом в поток. ${invalidContext}`
        )
      );
      const invalid = runAudit(root, evidencePath, ["--write"]);
      assert.notEqual(invalid.status, 0, invalid.stderr);
      assert.match(invalid.stderr, /ACOSO/);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("manual guide translation completeness audit rejects generic uppercase Spanish but allows reviewed identifiers", () => {
  const root = tempRoot("manual-guide-translation-uppercase-policy-");
  const evidencePath = join(root, "evidence.json");
  try {
    writeSection(
      root,
      "ch3-highways.ts",
      supportedProbeFixture().replace(
        "espacio / gap (свободный промежуток) нужен перед входом в поток.",
        "espacio / gap (свободный промежуток) нужен перед входом в поток. Знак NO AVANZAR остается без перевода."
      )
    );
    const uppercaseSpanish = runAudit(root, evidencePath, ["--write"]);
    assert.notEqual(uppercaseSpanish.status, 0, uppercaseSpanish.stderr);
    assert.match(uppercaseSpanish.stderr, /NO AVANZAR/);

    writeSection(
      root,
      "ch3-highways.ts",
      supportedProbeFixture().replace(
        "espacio / gap (свободный промежуток) нужен перед входом в поток.",
        "espacio / gap (свободный промежуток) нужен перед входом в поток. Перед поездкой можно настроить GPS."
      )
    );
    const reviewedIdentifier = runAudit(root, evidencePath, ["--write"]);
    assert.equal(reviewedIdentifier.status, 0, reviewedIdentifier.stderr);
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    assert.equal(
      evidence.exceptions.some((entry) =>
        entry.detectedSpanishPhrase === "GPS" && entry.note === "reviewed official, technical, or message identifier"
      ),
      true
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("committed evidence records direct Russian support for every Chapter 5 ACOSO occurrence", () => {
  const evidence = JSON.parse(readFileSync(committedEvidencePath, "utf8"));
  const acosoRecords = evidence.residues.filter(
    (entry) => entry.sectionId === "ch5-gender-violence-prevention" && entry.detectedSpanishPhrase === "ACOSO"
  );
  assert.equal(acosoRecords.length, 2);
  assert.deepEqual(
    new Set(acosoRecords.map((entry) => entry.disposition)),
    new Set(["retained-with-inline-translation"])
  );
  assert.ok(acosoRecords.every((entry) => /ACOSO \(линия/u.test(entry.textExcerpt)));
});
