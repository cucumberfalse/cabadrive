import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const defaultEvidencePath = "content/validation/manual-guide-translation-completeness.evidence.json";
const defaultSectionRoot = "src/data/manual-sections";
const defaultIntroductionPath = "src/data/pandemiaVialSection.ts";
const evidencePath = process.env.MANUAL_GUIDE_TRANSLATION_COMPLETENESS_EVIDENCE_PATH ?? defaultEvidencePath;
const sectionRoot = process.env.MANUAL_GUIDE_TRANSLATION_COMPLETENESS_SECTION_ROOT ?? defaultSectionRoot;
const introductionPathValue = process.env.MANUAL_GUIDE_TRANSLATION_COMPLETENESS_INTRODUCTION_PATH;
const introductionPath = introductionPathValue === ""
  ? null
  : introductionPathValue ?? (sectionRoot === defaultSectionRoot ? defaultIntroductionPath : null);
const featureId = "041-manual-translation-completion";

const args = process.argv.slice(2);
const writeMode = args.includes("--write");
const unknownArgs = args.filter((arg) => arg !== "--write");

if (unknownArgs.length > 0) {
  console.error(`Unknown argument(s): ${unknownArgs.join(", ")}`);
  console.error("Usage: node scripts/manual-guide-translation-completeness-audit.mjs [--write]");
  process.exit(1);
}

const requiredProbeTerms = [
  "Ingreso: carriles de aceleración",
  "carriles de aceleración",
  "calzada",
  "tránsito de la vía principal",
  "espejos retrovisores",
  "incorporación",
  "luz de giro izquierda",
  "espacio / gap",
  "velocidad adecuada del tramo",
  "autopista",
  "vía rápida"
];

const terminologyDecisions = [
  { termEs: "carriles de aceleración", translationRu: "полосы разгона" },
  { termEs: "carril de desaceleración", translationRu: "полоса замедления" },
  { termEs: "carriles de desaceleración", translationRu: "полосы замедления" },
  { termEs: "calzada", translationRu: "проезжая часть" },
  { termEs: "tránsito de la vía principal", translationRu: "движение по основной дороге" },
  { termEs: "espejos retrovisores", translationRu: "зеркала заднего вида" },
  { termEs: "incorporación", translationRu: "включение в поток" },
  { termEs: "luz de giro izquierda", translationRu: "левый указатель поворота" },
  { termEs: "espacio / gap", translationRu: "свободный промежуток" },
  { termEs: "velocidad adecuada del tramo", translationRu: "подходящая скорость для этого участка" },
  { termEs: "autopista", translationRu: "автомагистраль" },
  { termEs: "autopistas", translationRu: "автомагистрали" },
  { termEs: "vía rápida", translationRu: "скоростная дорога" },
  { termEs: "vías rápidas", translationRu: "скоростные дороги" },
  { termEs: "banquina", translationRu: "обочина" },
  { termEs: "carril izquierdo", translationRu: "левая полоса" },
  { termEs: "carril derecho", translationRu: "правая полоса" },
  { termEs: "carril", translationRu: "полоса движения" },
  { termEs: "carriles", translationRu: "полосы движения" },
  { termEs: "sobrepaso", translationRu: "опережение" },
  { termEs: "adelantamiento", translationRu: "обгон" },
  { termEs: "balizas", translationRu: "аварийная сигнализация" },
  { termEs: "intermitentes", translationRu: "аварийные мигающие огни" },
  { termEs: "auxilio", translationRu: "помощь" },
  { termEs: "asistencia", translationRu: "техническая помощь" },
  { termEs: "remolque", translationRu: "буксировка" },
  { termEs: "acarreo", translationRu: "эвакуация" },
  { termEs: "vehículo", translationRu: "транспортное средство" },
  { termEs: "vehículos", translationRu: "транспортные средства" },
  { termEs: "avería", translationRu: "поломка" },
  { termEs: "malestar físico", translationRu: "плохое самочувствие" },
  { termEs: "señales", translationRu: "знаки" },
  { termEs: "señales viales", translationRu: "дорожные знаки" },
  { termEs: "velocidad", translationRu: "скорость" },
  { termEs: "tramo", translationRu: "участок" },
  { termEs: "ingreso", translationRu: "въезд" },
  { termEs: "salida", translationRu: "выезд" },
  { termEs: "marcha atrás", translationRu: "движение задним ходом" },
  { termEs: "teléfono celular", translationRu: "мобильный телефон" },
  { termEs: "postes de auxilio", translationRu: "колонны экстренной помощи" },
  { termEs: "auxilio vial", translationRu: "дорожная помощь" },
  { termEs: "chaleco reflectante", translationRu: "световозвращающий жилет" },
  { termEs: "vía", translationRu: "дорога" },
  { termEs: "vías", translationRu: "дороги" },
  { termEs: "tránsito", translationRu: "движение" },
  { termEs: "accidente", translationRu: "авария" },
  { termEs: "emergency", translationRu: "экстренная ситуация" },
  { termEs: "gap", translationRu: "свободный промежуток" },
  { termEs: "cédula", translationRu: "регистрационная карточка" },
  { termEs: "cédulas", translationRu: "регистрационные карточки" },
  { termEs: "cédula de identificación", translationRu: "идентификационная карточка" },
  { termEs: "renovación", translationRu: "продление" },
  { termEs: "otorgamiento", translationRu: "первичная выдача" },
  { termEs: "detención", translationRu: "остановка" },
  { termEs: "motovehículos", translationRu: "мототранспорт" },
  { termEs: "ciclovías", translationRu: "велодорожки" }
];

const spanishDetectorTerms = [
  ...new Set([
    ...requiredProbeTerms,
    ...terminologyDecisions.map((entry) => entry.termEs),
    "otras vías rápidas",
    "vehículo inmovilizado",
    "primera salida posible",
    "abandonar la autopista",
    "está prohibido",
    "circular marcha atrás",
    "la autopista",
    "la primera salida",
    "de la vía",
    "de sobrepaso",
    "del tramo",
    "lento",
    "máximo",
    "aproximarse",
    "correspondiente",
    "inmovilizado",
    "fluidez",
    "transporte",
    "cédula",
    "cédulas",
    "cédula de identificación",
    "renovación",
    "otorgamiento",
    "detención",
    "motovehículos",
    "ciclovías"
  ])
].sort((left, right) => right.length - left.length);

const genericTrafficTerms = new Set(
  terminologyDecisions
    .map((entry) => normalizeText(entry.termEs))
    .filter((term) => term.length > 0)
);

const reviewedIdentifierPolicies = [
  {
    id: "reviewed-official-system-identifiers",
    identifiers: [
      "ABC",
      "ABS",
      "ANSV",
      "AU",
      "AUSA",
      "AUSOL",
      "AYUDA",
      "BUI",
      "CABA",
      "CABA SRI",
      "CAJ",
      "CO",
      "DNI",
      "DNRPA",
      "GCBA",
      "GNC",
      "GPS",
      "LiNTI",
      "MBA",
      "OFAVYT",
      "PR",
      "QR",
      "RTO",
      "RUTA",
      "RVA",
      "SMS",
      "SRI",
      "SUBE",
      "VTV"
    ],
    reason: "reviewed official, technical, or message identifier"
  },
  {
    id: "reviewed-organization-or-brand-identifiers",
    identifiers: ["GOODYEAR", "RACE"],
    reason: "reviewed organization or brand identifier"
  }
];

const acceptedExceptionPatterns = [
  {
    id: "measurement-unit",
    pattern: /^(?:km|km\/h|cm|m|kg|t|g\/l|dB|ºC|H\/H)$/iu,
    reason: "measurement unit"
  },
  {
    id: "address-abbreviation",
    pattern: /^(?:Av|Pte|Nº|As|Bs)$/u,
    reason: "address abbreviation"
  },
  {
    id: "official-product-or-service-name",
    pattern: /^(?:MiBA|Boti|WhatsApp|Ecobici|Metrobus|Metrobús|BA Ecobici by Tembici|Sube y Baja|Metrobus de Buenos Aires|Scoring|Cabadrive|Bitren|Isofix|Latch)$/u,
    reason: "official product, service, or system name"
  },
  {
    id: "alphabetic-range-label",
    pattern: /^[A-Z](?:-[A-Z])+$/u,
    reason: "alphabetic glossary range label"
  },
  {
    id: "legal-code-or-road-name",
    pattern: /^(?:Ley|Decreto|Anexo|Autopista|Avenida|Calle|Paseo|Buenos Aires|Ciudad Autonoma de Buenos Aires|Ciudad Autónoma de Buenos Aires)(?:\b|$)/u,
    reason: "official legal title, road name, or place name"
  },
  {
    id: "road-place-or-person-name",
    pattern: /^(?:Acceso Norte|Alem|La Plata|Leandro N|San Martin|Mariquita Sanchez de Thompson|Barracas|Uruguay|Callao|Cerrito|Nogoyá|Villa Real|Ramón Lista|Juan E\. Martínez|Irigoyen|Ema Cibotti-Lischinsky|Norma Bonelli|Viviam Perrone|Patricia Pistarini|Teresa Mellano|Cinthya Toledo|Familias Por La Vida ONG|Junín|Libertad|Gral|Paz|Sáenz|Macrocentro|Balbín|Illia|de Julio Sur)$/u,
    reason: "official road, place, program contact, or proper name"
  }
];

const ignoredContextPatterns = [
  /\bhttps?:\/\/\S+/giu,
  /\b(?:www\.)?\S+\.(?:gob\.ar|com\.ar|org\.ar|gov\.ar|ar|com|org)\S*/giu,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu,
  /\bAutopistas?\s+Urbanas\s+S\.?A\.?/giu,
  /\bAutopista\s+(?:Illia|Buenos Aires-La Plata|25 de Mayo|Dellepiane|Perito Moreno|Riccheri|9 de Julio Sur|Ingeniero Pascual Palazzo|Hector J\. Campora|Presidente Arturo U\. Illia|R\. Balbin)\b/giu,
  /\bAv\.\s+\d+(?:\s+(?:de|del|la|las|los|y|e|[A-ZÁÉÍÓÚÑÜ][\p{Script=Latin}\p{Mark}.]*))*\b/giu,
  /\bAv\.\s+[A-ZÁÉÍÓÚÑÜ][\p{Script=Latin}\p{Mark}.]*(?:\s+(?:de|del|la|las|los|y|e|[A-ZÁÉÍÓÚÑÜ][\p{Script=Latin}\p{Mark}.]*))*\b/giu,
  /\b(?:Calle|Avenida|Paseo)\s+[A-ZÁÉÍÓÚÑÜ][\p{Script=Latin}\p{Mark}.]*(?:\s+(?:de|del|la|las|los|y|e|[A-ZÁÉÍÓÚÑÜ][\p{Script=Latin}\p{Mark}.]*))*\b/giu,
  /\b(?:Ministerio|Agencia|Dirección|Registro|Sistema|Código|Centro|Centros|Oficina|Unidades|Asociación|Palacio)\s+[A-ZÁÉÍÓÚÑÜa-záéíóúñü][\p{Script=Latin}\p{Mark}.]*(?:\s+(?:de|del|la|las|los|y|e|a|por|para|Civil|Público|Fiscal|Nacional|General|Permanente|Profesional|Justicia|Transporte|Tránsito|Víctima|Víctimas|Conductores|Infracciones|Autopartes|Formación|Familiares|Siniestros|Viales|Nación|CABA|DDHH|[A-ZÁÉÍÓÚÑÜ][\p{Script=Latin}\p{Mark}.]*))*\b/giu,
  /\b(?:Tribunales|Retiro|Casco Histórico|Once|Microcentro|Corrientes|Villa Real|San Martín|Calabria|Cecilia Grierson|Irigoyen|Beruti|Talcahuano|Perón|Ramón Lista|Ramón S\. Castillo|Nogoyá|Juan E\. Martínez|Mariquita Sánchez de Thompson|Hernán M\. Giralt|Antártida Argentina|Elvira Rawson de Dellepiane|Eduardo Madero|Ing\. Huergo)\b/giu
];

const learnerFacingKeys = new Set([
  "labelRu",
  "titleRu",
  "textRu",
  "itemsRu",
  "captionRu",
  "altRu",
  "columnsRu",
  "cellsRu",
  "bodyRu",
  "noticeItemsRu",
  "closingRu",
  "leftRu",
  "rightRu",
  "definitionRu",
  "translationRu",
  "termEs",
  "termTranslations",
  "label",
  "headlineRu",
  "summaryRu",
  "detailsRu",
  "descriptionRu"
]);

const ignoredKeys = new Set([
  "id",
  "kind",
  "sectionId",
  "sourcePages",
  "sourcePage",
  "sourceTitleEs",
  "sourceTextEs",
  "sourceScreenshots",
  "russianScreenshots",
  "sourceRegion",
  "sourceRegionMetadata",
  "assetPath",
  "sourceAssetPath",
  "referenceAsset",
  "routeHash",
  "manualManifestPointer",
  "layoutManifestPointer",
  "checkerStatus",
  "status",
  "styleTokenFamilies",
  "visualEvidence",
  "notes",
  "cleanupStatus",
  "visibleSpanish",
  "sourceImageException",
  "officialSignException",
  "sourceAsIs",
  "visualNotes",
  "display",
  "textReadabilityEvidence",
  "implementationEvidence"
]);

function assertCondition(condition, message, details = {}) {
  if (!condition) {
    const error = new Error(message);
    error.details = details;
    throw error;
  }
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/ё/gu, "е")
    .replace(/[–—]/gu, "-")
    .replace(/\s+/gu, " ")
    .trim();
}

function textWithoutIgnoredContexts(value) {
  return ignoredContextPatterns.reduce((current, pattern) => current.replace(pattern, " "), value);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function sha256Text(value) {
  return createHash("sha256").update(value).digest("hex");
}

function evaluateExpression(node, env) {
  if (!node) return undefined;
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) return evaluateExpression(node.expression, env);
  if (ts.isStringLiteralLike(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isIdentifier(node)) return env.get(node.text);
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isTemplateExpression(node)) {
    let result = node.head.text;
    for (const span of node.templateSpans) {
      result += String(evaluateExpression(span.expression, env)) + span.literal.text;
    }
    return result;
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((element) => evaluateExpression(element, env));
  }
  if (ts.isObjectLiteralExpression(node)) {
    const value = {};
    for (const property of node.properties) {
      if (ts.isPropertyAssignment(property)) {
        const key = ts.isIdentifier(property.name) || ts.isStringLiteralLike(property.name)
          ? property.name.text
          : property.name.getText();
        value[key] = evaluateExpression(property.initializer, env);
      } else if (ts.isShorthandPropertyAssignment(property)) {
        value[property.name.text] = env.get(property.name.text);
      }
    }
    return value;
  }
  return undefined;
}

function sectionFiles() {
  return readdirSync(sectionRoot)
    .filter((fileName) => fileName.endsWith(".ts"))
    .sort()
    .map((fileName) => ({
      fileName,
      path: join(sectionRoot, fileName),
      source: readFileSync(join(sectionRoot, fileName), "utf8")
    }));
}

function evaluateModuleExports(filePath) {
  const source = readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const env = new Map();
  const exports = new Map();

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue;
      const value = evaluateExpression(declaration.initializer, env);
      if (value !== undefined) env.set(declaration.name.text, value);
    }
  }

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement) || !statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue;
      exports.set(declaration.name.text, evaluateExpression(declaration.initializer, env));
    }
  }

  return exports;
}

function loadManualSections() {
  const sections = [];
  for (const file of sectionFiles()) {
    const exports = evaluateModuleExports(file.path);
    for (const [exportName, value] of exports) {
      if (isObject(value) && typeof value.sectionId === "string" && Array.isArray(value.blocks)) {
        sections.push({
          exportName,
          sourceKind: "manual-section",
          modulePath: file.path,
          sourceFile: file.fileName,
          routeHash: value.routeHash ?? null,
          section: value
        });
      }
    }
  }
  return sections;
}

function synthesizeIntroductionSections(modulePath, exports) {
  const navigation = exports.get("introductionNavigation");
  const pandemia = exports.get("pandemiaVialSection");
  const articles = exports.get("introductionArticleSections");

  assertCondition(Array.isArray(navigation), "introductionNavigation must be exported as an array", { modulePath });
  assertCondition(isObject(pandemia), "pandemiaVialSection must be exported as an object", { modulePath });
  assertCondition(Array.isArray(articles), "introductionArticleSections must be exported as an array", { modulePath });

  const articleById = new Map(articles.filter(isObject).map((section) => [section.id, section]));
  return navigation.map((entry) => {
    assertCondition(isObject(entry) && typeof entry.id === "string", "introductionNavigation entry must have an id", { modulePath, entry });
    const article = articleById.get(entry.id);
    const isPandemiaRoute = entry.renderer === "pandemia";
    if (!isPandemiaRoute) {
      assertCondition(isObject(article), "article introduction route must have matching introductionArticleSections data", { modulePath, entry });
    }
    const blocks = isPandemiaRoute
      ? [
          {
            id: pandemia.id ?? entry.id,
            kind: "pandemia-vial",
            titleRu: pandemia.titleRu ?? entry.titleRu,
            segments: pandemia.segments ?? [],
            visualRegions: pandemia.visualRegions ?? []
          }
        ]
      : article.blocks;

    return {
      exportName: isPandemiaRoute ? "pandemiaVialSection" : "introductionArticleSections",
      sourceKind: "introduction-route",
      modulePath,
      sourceFile: modulePath.split(/[\\/]/u).at(-1),
      routeHash: entry.routeHash ?? article?.routeHash ?? null,
      navigationTitleRu: entry.titleRu,
      section: {
        sectionId: entry.id,
        titleRu: entry.titleRu,
        routeHash: entry.routeHash ?? article?.routeHash ?? null,
        sourceTitleEs: entry.sourceIndexHeadingEs ?? entry.titleEs,
        status: "implemented",
        blocks
      }
    };
  });
}

function loadIntroductionSections() {
  if (!introductionPath) return [];
  assertCondition(existsSync(introductionPath), "introduction data source is missing", { introductionPath });
  return synthesizeIntroductionSections(introductionPath, evaluateModuleExports(introductionPath));
}

function shouldInspectPath(path, key, value, parent) {
  if (typeof value !== "string") return false;
  if (ignoredKeys.has(key)) return false;
  if (key.endsWith("Es") && key !== "termEs") return false;
  if (key.endsWith("Path") || key.endsWith("Hash") || key.endsWith("Sha256")) return false;
  if (learnerFacingKeys.has(key)) return true;
  if (path.some((part) => learnerFacingKeys.has(part))) return true;
  if (parent && Array.isArray(parent.termTranslations) && (key === "termEs" || key === "translationRu")) return true;
  return key.endsWith("Ru");
}

function collectLearnerStrings(sectionMeta) {
  const records = [];
  function visit(value, path, parent = null) {
    if (typeof value === "string") {
      const key = path[path.length - 1] ?? "";
      if (shouldInspectPath(path, key, value, parent)) {
        records.push({
          sectionId: sectionMeta.section.sectionId,
          sourceKind: sectionMeta.sourceKind,
          modulePath: sectionMeta.modulePath,
          blockId: path.includes("blocks") ? blockIdForPath(sectionMeta.section, path) : null,
          blockKind: path.includes("blocks") ? blockKindForPath(sectionMeta.section, path) : null,
          fieldPath: path.join("."),
          key,
          text: value
        });
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry, index) => visit(entry, [...path, String(index)], parent));
      return;
    }
    if (isObject(value)) {
      for (const [key, entry] of Object.entries(value)) {
        if (ignoredKeys.has(key) && key !== "termTranslations") continue;
        visit(entry, [...path, key], value);
      }
    }
  }
  visit(sectionMeta.section, []);
  return records;
}

function blockIdForPath(section, path) {
  const blockIndex = path[path.indexOf("blocks") + 1];
  const block = section.blocks?.[Number(blockIndex)];
  return block?.id ?? null;
}

function blockKindForPath(section, path) {
  const blockIndex = path[path.indexOf("blocks") + 1];
  const block = section.blocks?.[Number(blockIndex)];
  return block?.kind ?? null;
}

function isStructuredPair(record) {
  if (record.key !== "termEs") return false;
  const translationPath = record.fieldPath.replace(/\.termEs$/u, ".translationRu");
  const labelPath = record.fieldPath.replace(/\.termEs$/u, ".labelRu");
  return record.sectionStrings?.some((candidate) =>
    (candidate.fieldPath === translationPath || candidate.fieldPath === labelPath) && /\p{Script=Cyrillic}/u.test(candidate.text)
  ) === true;
}

function isAcceptedException(segment) {
  const trimmed = segment.trim();
  if (genericTrafficTerms.has(normalizeText(trimmed))) return null;
  for (const policy of reviewedIdentifierPolicies) {
    if (policy.identifiers.includes(trimmed)) {
      return { id: policy.id, reason: policy.reason };
    }
  }
  return acceptedExceptionPatterns.find((entry) => entry.pattern.test(trimmed)) ?? null;
}

function phraseHasInlineRussianSupport(text, phrase) {
  const pattern = new RegExp(`${escapeRegExp(phrase)}[»”"']?\\s*\\([^)]*\\p{Script=Cyrillic}[^)]*\\)`, "iu");
  if (pattern.test(text)) return true;
  const immediatePairPattern = new RegExp(`${escapeRegExp(phrase)}[»”"']?\\s*(?:[-:–—]|=)\\s*\\p{Script=Cyrillic}`, "iu");
  if (immediatePairPattern.test(text)) return true;
  if (phraseHasStructuralReverseParentheticalSupport(text, phrase)) return true;
  const combinedSpanPattern = new RegExp(
    `[\\p{Script=Latin}\\p{Mark} /'’.:-]*${escapeRegExp(phrase)}[\\p{Script=Latin}\\p{Mark} /'’.:-]*[»”"']?\\s*\\([^)]*\\p{Script=Cyrillic}[^)]*\\)`,
    "iu"
  );
  return combinedSpanPattern.test(text);
}

function phraseHasStructuralReverseParentheticalSupport(text, phrase) {
  const parentheticalPattern = new RegExp(`\\(\\s*[^)]*${escapeRegExp(phrase)}[^)]*\\)`, "giu");
  for (const match of text.matchAll(parentheticalPattern)) {
    const openingParenthesisIndex = match.index;
    const precedingText = text.slice(0, openingParenthesisIndex);
    const label = precedingText.split(/[.!?;:()]/u).at(-1)?.trim() ?? "";
    if (label.length === 0 || !/\p{Script=Cyrillic}/u.test(label)) continue;

    const withoutRomanNumerals = label.replace(/\b[IVXLCDM]+\b/giu, "");
    if (/\p{Script=Latin}/u.test(withoutRomanNumerals)) continue;
    if (!/(?:\p{Script=Cyrillic}|[IVXLCDM])$/iu.test(label)) continue;
    return true;
  }
  return false;
}

function phraseHasAdjacentRussianSupport(record, phrase) {
  if (record.key === "termEs") {
    const translationPath = record.fieldPath.replace(/\.termEs$/u, ".translationRu");
    const labelPath = record.fieldPath.replace(/\.termEs$/u, ".labelRu");
    return record.sectionStrings?.some((candidate) =>
      (candidate.fieldPath === translationPath || candidate.fieldPath === labelPath) && /\p{Script=Cyrillic}/u.test(candidate.text)
    ) === true;
  }
  if (phraseHasInlineRussianSupport(record.text, phrase)) return true;
  return false;
}

function detectedSpanishPhrases(text) {
  const normalized = normalizeText(textWithoutIgnoredContexts(text));
  const phrases = [];
  for (const phrase of spanishDetectorTerms) {
    const normalizedPhrase = normalizeText(phrase);
    if (!normalizedPhrase) continue;
    const boundaryPattern = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(normalizedPhrase)}([^\\p{L}\\p{N}]|$)`, "iu");
    if (boundaryPattern.test(normalized)) phrases.push(phrase);
  }
  const unique = [...new Set(phrases)];
  return unique.filter((phrase) => {
    const normalizedPhrase = normalizeText(phrase);
    return !unique.some((other) => {
      const normalizedOther = normalizeText(other);
      return normalizedOther !== normalizedPhrase && normalizedOther.length > normalizedPhrase.length && normalizedOther.includes(normalizedPhrase);
    });
  });
}

function latinSegments(text) {
  const matches = text.match(/[\p{Script=Latin}\p{Mark}]+(?:[ /'’-]+[\p{Script=Latin}\p{Mark}]+)*/gu) ?? [];
  return matches.map((value) => value.trim()).filter(Boolean);
}

function isIgnoredLatinSegment(segment) {
  const normalized = normalizeText(segment);
  if (normalized.length <= 1) return true;
  if (/^[ivxlcdm]+$/iu.test(segment)) return true;
  if (/^(?:a|y|e|o|u|de|del|la|las|los|el|en|por|para|con)$/iu.test(segment)) return true;
  return false;
}

function candidateRecords(records) {
  const candidates = [];
  for (const record of records) {
    const phrases = detectedSpanishPhrases(record.text);
    const segments = latinSegments(textWithoutIgnoredContexts(record.text));
    const explicitSegments = segments.filter((segment) => !isIgnoredLatinSegment(segment));
    const detected = [...new Set([...phrases, ...explicitSegments])];
    for (const phrase of detected) {
      const exception = isAcceptedException(phrase);
      const structuredPair = isStructuredPair(record);
      const adjacentSupport = phraseHasAdjacentRussianSupport(record, phrase);
      let disposition = "unresolved";
      let note = "Learner-facing Spanish residue lacks immediate Russian support.";
      if (structuredPair || (record.key === "termEs" && adjacentSupport)) {
        disposition = "retained-with-structured-adjacent-translation";
        note = "Spanish term is paired with a Russian translation in the same structured record.";
      } else if (adjacentSupport) {
        disposition = "retained-with-inline-translation";
        note = "Spanish phrase has immediate parenthesized Russian translation in the same string.";
      } else if (exception) {
        disposition = "allowed-narrow-exception";
        note = exception.reason;
      }
      candidates.push({
        sectionId: record.sectionId,
        sourceKind: record.sourceKind,
        modulePath: record.modulePath,
        blockId: record.blockId,
        blockKind: record.blockKind,
        fieldPath: record.fieldPath,
        textExcerpt: record.text.length > 240 ? `${record.text.slice(0, 237)}...` : record.text,
        detectedSpanishPhrase: phrase,
        disposition,
        note
      });
    }
  }
  return candidates;
}

function requiredProbeCoverage(candidates, records) {
  return requiredProbeTerms.map((probe) => {
    const normalizedProbe = normalizeText(probe);
    const candidate = candidates.find(
      (entry) => entry.sectionId === "ch3-highways" && normalizeText(entry.detectedSpanishPhrase) === normalizedProbe
    );
    const coveredText = records.find(
      (record) => record.sectionId === "ch3-highways" && normalizeText(record.text).includes(normalizedProbe)
    );
    return {
      probe,
      status: candidate && candidate.disposition !== "unresolved" ? "pass" : "missing",
      sectionId: candidate?.sectionId ?? coveredText?.sectionId ?? "ch3-highways",
      fieldPath: candidate?.fieldPath ?? coveredText?.fieldPath ?? null,
      disposition: candidate?.disposition ?? null,
      textExcerpt: candidate?.textExcerpt ?? coveredText?.text ?? null
    };
  });
}

function validateEvidenceShape(value) {
  assertCondition(isObject(value), "evidence must be a JSON object");
  assertCondition(value.schemaVersion === 1, "evidence.schemaVersion must be 1");
  assertCondition(value.featureId === featureId, `evidence.featureId must be ${featureId}`);
  assertCondition(value.generatedBy === "scripts/manual-guide-translation-completeness-audit.mjs", "evidence.generatedBy mismatch");
  assertCondition(isObject(value.counts), "evidence.counts must be an object");
  assertCondition(Array.isArray(value.residues), "evidence.residues must be an array");
  assertCondition(Array.isArray(value.requiredProbeCoverage), "evidence.requiredProbeCoverage must be an array");
  assertCondition(Array.isArray(value.exceptions), "evidence.exceptions must be an array");
  assertCondition(Array.isArray(value.reviewedIdentifierPolicies), "evidence.reviewedIdentifierPolicies must be an array");
  assertCondition(isObject(value.routeInventory), "evidence.routeInventory must be an object");
  assertCondition(isObject(value.routeInventory.counts), "evidence.routeInventory.counts must be an object");
  assertCondition(
    value.routeInventory.counts.renderedGuideRoutes === value.counts.renderedGuideRoutes,
    "route inventory rendered route count must match evidence counts"
  );
  for (const exception of value.exceptions) {
    assertCondition(exception.disposition === "allowed-narrow-exception", "exceptions must use allowed-narrow-exception disposition", exception);
    assertCondition(!genericTrafficTerms.has(normalizeText(exception.detectedSpanishPhrase)), "generic traffic terms cannot be allowlisted as exceptions", exception);
    assertCondition(exception.note !== "uppercase acronym or compact official identifier", "generic uppercase exceptions are forbidden", exception);
  }
}

function evidenceString(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function firstDifferentLine(actual, expected) {
  const actualLines = actual.split("\n");
  const expectedLines = expected.split("\n");
  const maxLength = Math.max(actualLines.length, expectedLines.length);
  for (let index = 0; index < maxLength; index += 1) {
    if (actualLines[index] !== expectedLines[index]) {
      return {
        line: index + 1,
        actual: actualLines[index] ?? "<missing>",
        expected: expectedLines[index] ?? "<missing>"
      };
    }
  }
  return null;
}

function reportEvidenceMismatch(reason, detail) {
  console.error(`manual guide translation completeness audit failed: ${reason}`);
  if (detail) console.error(detail);
  console.error(`Expected committed evidence to match ${evidencePath}.`);
  console.error("Run `node scripts/manual-guide-translation-completeness-audit.mjs --write` to intentionally regenerate it.");
}

function reportValidationFindings(findings) {
  if (findings.length === 0) return;
  console.error(`manual guide translation completeness audit found ${findings.length} validation finding(s):`);
  for (const finding of findings.slice(0, 30)) {
    console.error(`- ${finding.ruleId}: ${finding.message}`);
  }
}

const manualSections = loadManualSections();
const introductionSections = loadIntroductionSections();
const sections = [...manualSections, ...introductionSections];
const stringsBySection = new Map();
const learnerStrings = [];
for (const section of sections) {
  const sectionStrings = collectLearnerStrings(section);
  stringsBySection.set(section.section.sectionId, sectionStrings);
  learnerStrings.push(...sectionStrings);
}
for (const record of learnerStrings) {
  record.sectionStrings = stringsBySection.get(record.sectionId) ?? [];
}

const residues = candidateRecords(learnerStrings).sort((left, right) => {
  const leftKey = `${left.sectionId}:${left.fieldPath}:${left.detectedSpanishPhrase}`;
  const rightKey = `${right.sectionId}:${right.fieldPath}:${right.detectedSpanishPhrase}`;
  return leftKey.localeCompare(rightKey);
});
const findings = residues
  .filter((entry) => entry.disposition === "unresolved")
  .map((entry) => ({
    ruleId: "learner-facing-spanish-without-russian-support",
    message: `${entry.sectionId} ${entry.fieldPath} retains "${entry.detectedSpanishPhrase}" without adjacent Russian support`,
    entry
  }));

const probes = requiredProbeCoverage(residues, learnerStrings);
for (const probe of probes) {
  if (probe.status !== "pass") {
    findings.push({
      ruleId: "required-screenshot-probe-missing",
      message: `required screenshot probe "${probe.probe}" is not represented with passing support evidence`,
      probe
    });
  }
}

const exceptions = residues.filter((entry) => entry.disposition === "allowed-narrow-exception");
const broadExceptions = exceptions.filter((entry) => genericTrafficTerms.has(normalizeText(entry.detectedSpanishPhrase)));
for (const exception of broadExceptions) {
  findings.push({
    ruleId: "generic-traffic-term-exception-forbidden",
    message: `${exception.detectedSpanishPhrase} cannot be accepted as an untranslated exception`,
    exception
  });
}

const routeInventory = {
  appSurface: "Руководство",
  inventoryRule:
    "Rendered guide routes are the active Introduction routes from introductionNavigation plus implemented manual sections from implementedManualGuideSections/manual section modules.",
  counts: {
    introductionRoutes: introductionSections.length,
    manualSectionRoutes: manualSections.length,
    renderedGuideRoutes: introductionSections.length + manualSections.length
  },
  introductionRoutes: introductionSections.map((entry) => ({
    id: entry.section.sectionId,
    routeHash: entry.routeHash,
    titleRu: entry.navigationTitleRu ?? entry.section.titleRu,
    sourceModule: entry.modulePath
  })),
  manualSectionRoutes: manualSections.map((entry) => ({
    id: entry.section.sectionId,
    routeHash: entry.routeHash ?? entry.section.routeHash ?? null,
    titleRu: entry.section.titleRu,
    sourceModule: entry.modulePath
  }))
};

const document = {
  schemaVersion: 1,
  featureId,
  generatedBy: "scripts/manual-guide-translation-completeness-audit.mjs",
  generatedAt: new Date(0).toISOString(),
  contentFingerprint: sha256Text(
    sections
      .map((section) => `${section.modulePath}\n${JSON.stringify(section.section)}`)
      .join("\n---manual-section---\n")
  ),
  counts: {
    implementedSections: manualSections.length,
    introductionRoutes: introductionSections.length,
    renderedGuideRoutes: routeInventory.counts.renderedGuideRoutes,
    inspectedStrings: learnerStrings.length,
    candidateResidues: residues.length,
    translatedOrRetainedWithSupport: residues.filter((entry) => entry.disposition !== "unresolved" && entry.disposition !== "allowed-narrow-exception").length,
    acceptedExceptions: exceptions.length,
    unresolvedFindings: findings.length
  },
  routeInventory,
  inspectedFieldPolicy: {
    inspected:
      "Learner-facing Russian/manual fields such as titleRu, textRu, itemsRu, columnsRu, cellsRu, captionRu, altRu, card/body/label fields, structured termTranslations, and Introduction route learner text rendered under Руководство.",
    ignored:
      "sourceTextEs, sourceTitleEs, source/provenance notes, route hashes, asset paths, URLs, hashes, selectors, source regions, screenshot paths, validation metadata, and protected image pixels.",
    protectedImagePixels:
      "Out of scope for this text-surface audit; visible Spanish inside protected source images remains governed by image-readability translation evidence."
  },
  terminologyDecisions,
  reviewedIdentifierPolicies,
  requiredProbeCoverage: probes,
  exceptions,
  residues
};

const expectedEvidence = evidenceString(document);

if (writeMode) {
  writeFileSync(evidencePath, expectedEvidence);
  console.log(`manual guide translation completeness audit wrote ${evidencePath}`);
  reportValidationFindings(findings);
  process.exit(findings.length > 0 ? 1 : 0);
}

let failed = false;

if (findings.length > 0) {
  reportValidationFindings(findings);
  failed = true;
}

if (!existsSync(evidencePath)) {
  reportEvidenceMismatch("committed evidence file is missing");
  failed = true;
} else {
  const committedEvidence = readFileSync(evidencePath, "utf8");
  let malformed = false;
  try {
    validateEvidenceShape(JSON.parse(committedEvidence));
  } catch (error) {
    console.error(`manual guide translation completeness audit failed: committed evidence is malformed: ${error.message}`);
    malformed = true;
    failed = true;
  }
  if (!malformed && committedEvidence !== expectedEvidence) {
    const diff = firstDifferentLine(committedEvidence, expectedEvidence);
    reportEvidenceMismatch("committed evidence is stale", diff ? `First difference at line ${diff.line}\nactual: ${diff.actual}\nexpected: ${diff.expected}` : undefined);
    failed = true;
  }
}

if (failed) process.exit(1);

console.log(
  `manual guide translation completeness audit passed: ${manualSections.length} manual sections, ${introductionSections.length} introduction route(s), ${learnerStrings.length} strings, ${residues.length} residue record(s), ${exceptions.length} exception(s)`
);
