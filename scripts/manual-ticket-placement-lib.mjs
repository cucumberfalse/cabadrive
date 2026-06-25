import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { createServer } from "vite";

export const PLACEMENT_SCHEMA_VERSION = 2;
export const ANCHOR_SCHEMA_VERSION = 1;
export const REVIEWED_MANIFEST_SCHEMA_VERSION = 2;
export const GENERATED_AT = "2026-06-24T15:00:00Z";
export const EXPECTED_BASE_SHA = "4247b0e90ae5799a0875cc3751c96589fef96ef2";
export const RESERVED_REVIEWER_PATTERNS = [
  /^feature-\d+-semantic-review$/u,
  /generator/iu,
  /scorer/iu,
  /candidate/iu,
  /automatic/iu,
  /synthetic/iu
];
export const F038_RA004_LEXICAL_BASELINE_IDS = [
  "b-fallback-001", "b-fallback-026", "b-fallback-032", "b-fallback-046", "b-fallback-049",
  "b-fallback-065", "b-fallback-086", "b-fallback-110", "b-fallback-120", "b-fallback-123",
  "b-fallback-124", "b-fallback-125", "b-fallback-144", "b-fallback-159", "b-fallback-202",
  "b-fallback-203", "b-fallback-236", "b-fallback-251", "b-fallback-254", "b-fallback-262",
  "b-fallback-267", "b-fallback-273", "b-fallback-287", "b-fallback-289", "b-fallback-295",
  "b-fallback-300", "b-fallback-314", "b-fallback-324", "b-fallback-345", "b-fallback-350",
  "b-fallback-377", "b-fallback-380", "b-fallback-391", "b-fallback-398", "b-fallback-401",
  "b-fallback-420", "b-fallback-425", "b-fallback-449", "b-fallback-456"
];
export const F038_RA004_SEMANTIC_EQUIVALENCE_IDS = [
  "b-fallback-003", "b-fallback-007", "b-fallback-009", "b-fallback-023", "b-fallback-028",
  "b-fallback-031", "b-fallback-041", "b-fallback-042", "b-fallback-051", "b-fallback-063",
  "b-fallback-072", "b-fallback-081", "b-fallback-097", "b-fallback-115", "b-fallback-128",
  "b-fallback-133", "b-fallback-152", "b-fallback-154", "b-fallback-173", "b-fallback-174",
  "b-fallback-177", "b-fallback-178", "b-fallback-180", "b-fallback-204", "b-fallback-205",
  "b-fallback-211", "b-fallback-215", "b-fallback-218", "b-fallback-224", "b-fallback-228",
  "b-fallback-230", "b-fallback-241", "b-fallback-243", "b-fallback-248", "b-fallback-260",
  "b-fallback-271", "b-fallback-288", "b-fallback-301", "b-fallback-309", "b-fallback-316",
  "b-fallback-318", "b-fallback-327", "b-fallback-355", "b-fallback-360", "b-fallback-366",
  "b-fallback-367", "b-fallback-371", "b-fallback-379", "b-fallback-382", "b-fallback-390",
  "b-fallback-402", "b-fallback-404", "b-fallback-405", "b-fallback-410", "b-fallback-421",
  "b-fallback-422", "b-fallback-423", "b-fallback-430", "b-fallback-431", "b-fallback-435",
  "b-fallback-437", "b-fallback-447", "b-fallback-451", "b-fallback-457", "b-fallback-459"
];

export function canonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
    .join(",")}}`;
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function fingerprint(value) {
  return sha256(canonicalJson(value));
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function loadShardEntries(root, directory) {
  return readdirSync(join(root, directory))
    .filter((name) => /^\d{3}-\d{3}\.json$/u.test(name))
    .sort()
    .flatMap((name) => readJson(join(root, directory, name)).entries);
}

function normalizeText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("ru")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
}

function containsNormalizedPhrase(value, expected) {
  const normalizedValue = normalizeText(value);
  const normalizedExpected = normalizeText(expected);
  if (normalizedExpected.length < 4) return false;
  return normalizedValue === normalizedExpected ||
    ` ${normalizedValue} `.includes(` ${normalizedExpected} `);
}

function numericUnitSignature(value) {
  const normalized = normalizeText(value);
  const numbers = normalized.match(/\d+(?:[.,]\d+)?/gu) || [];
  const units = normalized.match(/\b(?:км ч|km h|грамм(?:а|ов)?|gramos?|литр(?:а|ов)?|litros?|секунд(?:а|ы)?|segundos?|час(?:а|ов)?|horas?)\b/gu) || [];
  if (numbers.length === 0 || units.length === 0) return null;
  return `${numbers.join("|")}::${units.join("|")}`;
}

export function detectRejectedCandidateAnswerOverlap(candidate, question, translation) {
  const correctAnswer = question?.answers?.find((answer) => answer.id === question.correctAnswerId);
  const answerForms = [
    correctAnswer?.officialTextEs,
    translation?.answerTranslations?.[question?.correctAnswerId]
  ].filter(Boolean);
  const matchKinds = new Set();
  for (const answer of answerForms) {
    const anchorNormalized = normalizeText(candidate?.anchorTextAtReview);
    const answerNormalized = normalizeText(answer);
    if (anchorNormalized === answerNormalized && answerNormalized.length >= 4) {
      matchKinds.add("normalized-equality");
    } else {
      if (containsNormalizedPhrase(candidate?.anchorTextAtReview, answer)) {
        matchKinds.add("anchor-contains-canonical-answer");
      }
      if (containsNormalizedPhrase(answer, candidate?.anchorTextAtReview)) {
        matchKinds.add("canonical-answer-contains-anchor");
      }
    }
    const anchorNumeric = numericUnitSignature(candidate?.anchorTextAtReview);
    const answerNumeric = numericUnitSignature(answer);
    if (anchorNumeric && answerNumeric && anchorNumeric === answerNumeric) {
      matchKinds.add("numeric-unit-equivalence");
    }
  }
  if (candidate?.answerOverlapDisposition?.matchKinds?.includes("reviewed-semantic-equivalence")) {
    matchKinds.add("reviewed-semantic-equivalence");
  }
  return [...matchKinds].sort();
}

function contradictionAuditSummary(records, questions, translations) {
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const translationById = new Map(translations.map((translation) => [translation.questionId, translation]));
  const reclassified = [];
  const retained = [];
  const unresolved = [];
  for (const record of records) {
    const placement = record.placements?.[0];
    if (placement?.placementBasis === "answer-bearing" && placement.contradictionReview?.outcome === "supplies-canonical-answer") {
      reclassified.push(record.questionId);
      continue;
    }
    for (const candidate of placement?.fallbackEvidence?.candidatesReviewed || []) {
      if (candidate.outcome !== "rejected") continue;
      const matchKinds = detectRejectedCandidateAnswerOverlap(
        candidate,
        questionById.get(record.questionId),
        translationById.get(record.questionId)
      );
      if (matchKinds.length === 0) continue;
      if (candidate.answerOverlapDisposition?.outcome === "not-self-sufficient") retained.push(record.questionId);
      else unresolved.push(record.questionId);
    }
  }
  const distinct = (values) => [...new Set(values)].sort();
  return {
    architectLexicalBaselineCount: F038_RA004_LEXICAL_BASELINE_IDS.length,
    architectLexicalBaselineIds: F038_RA004_LEXICAL_BASELINE_IDS,
    reviewedSemanticEquivalenceCount: F038_RA004_SEMANTIC_EQUIVALENCE_IDS.length,
    reviewedSemanticEquivalenceIds: F038_RA004_SEMANTIC_EQUIVALENCE_IDS,
    screenedQuestionCount: new Set([
      ...F038_RA004_LEXICAL_BASELINE_IDS,
      ...F038_RA004_SEMANTIC_EQUIVALENCE_IDS
    ]).size,
    reclassifiedAnswerBearingIds: distinct(reclassified),
    retainedFallbackIds: distinct(retained),
    unresolvedIds: distinct(unresolved),
    rejectedSelfSufficientAnswerBearingCount: unresolved.length
  };
}

function pathValue(root, path) {
  return path.reduce((value, part) => value?.[part], root);
}

function pathString(path) {
  return path.join(".");
}

function parsePath(value) {
  if (!value) return [];
  return value.split(".").map((part) => (/^\d+$/u.test(part) ? Number(part) : part));
}

function nearestStableId(root, path) {
  for (let length = path.length - 1; length >= 0; length -= 1) {
    const candidate = pathValue(root, path.slice(0, length));
    if (candidate && typeof candidate === "object" && typeof candidate.id === "string") return candidate.id;
  }
  return undefined;
}

const RUSSIAN_VISIBLE_KEYS = new Set([
  "areasRu",
  "beforeLabelRu",
  "bodyRu",
  "captionRu",
  "centerRu",
  "cityLabelRu",
  "closingRu",
  "definitionRu",
  "footnoteRu",
  "guidanceRu",
  "headingRu",
  "introRu",
  "labelRu",
  "leftRu",
  "noteRu",
  "quoteRu",
  "recommendationRu",
  "residentShareRu",
  "rightRu",
  "textRu",
  "titleRu",
  "translationRu",
  "valueRu",
  "rankRu",
  "interjurisdictionalRu",
  "internalRu",
  "inboundShareRu"
]);

const RUSSIAN_VISIBLE_ARRAY_KEYS = new Set(["cellsRu", "columnsRu", "itemsRu", "noticeItemsRu"]);

function visibleTextLeaves(value, path = [], leaves = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => visibleTextLeaves(item, [...path, index], leaves));
    return leaves;
  }
  if (!value || typeof value !== "object") return leaves;
  for (const [key, nested] of Object.entries(value)) {
    const nextPath = [...path, key];
    if (RUSSIAN_VISIBLE_KEYS.has(key) && typeof nested === "string" && nested.trim()) {
      leaves.push({ path: nextPath, text: nested });
      continue;
    }
    if (RUSSIAN_VISIBLE_ARRAY_KEYS.has(key) && Array.isArray(nested)) {
      nested.forEach((item, index) => {
        if (typeof item === "string" && item.trim()) leaves.push({ path: [...nextPath, index], text: item });
      });
      continue;
    }
    visibleTextLeaves(nested, nextPath, leaves);
  }
  return leaves;
}

function imagePaths(value, paths = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => imagePaths(item, paths));
    return paths;
  }
  if (!value || typeof value !== "object") return paths;
  for (const [key, nested] of Object.entries(value)) {
    if (
      typeof nested === "string" &&
      (key === "assetPath" || key === "localPath" || key === "bodyAssetPath" || key === "carAssetPath" || key === "targetAssetPath") &&
      nested.startsWith("content/assets/manuals/")
    ) {
      paths.add(nested);
    } else {
      imagePaths(nested, paths);
    }
  }
  return paths;
}

function locatorWithoutFingerprint(anchor) {
  const { textFingerprint: _ignored, ...locator } = anchor;
  return locator;
}

export function anchorFingerprint(anchor, text) {
  return fingerprint({
    schemaVersion: ANCHOR_SCHEMA_VERSION,
    locator: locatorWithoutFingerprint(anchor),
    normalizedText: normalizeText(text)
  });
}

function createAnchor(pageId, anchor, text) {
  const complete = {
    ...anchor,
    textFingerprint: anchorFingerprint(anchor, text)
  };
  return {
    pageId,
    anchor: complete,
    text,
    normalizedText: normalizeText(text),
    key: canonicalJson(locatorWithoutFingerprint(complete))
  };
}

function introductionAnchors(pandemiaVialSection, introductionArticleSections) {
  const anchors = [];
  for (const segment of pandemiaVialSection.segments) {
    if (!segment.textRu?.trim()) continue;
    anchors.push(createAnchor("intro-road-pandemic", {
      kind: "introduction-segment",
      segmentId: segment.id,
      textPath: "textRu"
    }, segment.textRu));
  }
  for (const section of introductionArticleSections) {
    for (const block of section.blocks) {
      for (const leaf of visibleTextLeaves(block)) {
        const childId = nearestStableId(block, leaf.path);
        anchors.push(createAnchor(section.id, {
          kind: "introduction-block",
          blockId: block.id,
          ...(childId && childId !== block.id ? { childId } : {}),
          textPath: pathString(leaf.path)
        }, leaf.text));
      }
    }
  }
  return anchors;
}

function manualSectionAnchors(sections, signEntries) {
  const anchors = [];
  for (const section of sections) {
    for (const block of section.blocks) {
      if (block.kind === "manual-sign-catalog") {
        for (const entry of signEntries.filter((item) => item.sectionId === block.sectionId)) {
          if (!entry.russianTranslation?.trim()) continue;
          anchors.push(createAnchor(section.sectionId, {
            kind: "manual-sign-entry",
            blockId: block.id,
            entryId: entry.id,
            textPath: "russianTranslation"
          }, entry.russianTranslation));
        }
        continue;
      }
      if (block.kind === "list") {
        block.itemsRu.forEach((text, itemIndex) => {
          anchors.push(createAnchor(section.sectionId, {
            kind: "manual-list-item",
            blockId: block.id,
            itemIndex,
            textPath: "itemsRu"
          }, text));
        });
        if (block.titleRu) {
          anchors.push(createAnchor(section.sectionId, {
            kind: "manual-block",
            blockId: block.id,
            textPath: "titleRu"
          }, block.titleRu));
        }
        continue;
      }
      if (block.kind === "table") {
        block.rows.forEach((row) => row.cellsRu.forEach((text, cellIndex) => {
          anchors.push(createAnchor(section.sectionId, {
            kind: "manual-table-cell",
            blockId: block.id,
            rowId: row.id,
            cellIndex,
            textPath: "cellsRu"
          }, text));
        }));
        for (const field of ["titleRu", "captionRu"]) {
          if (!block[field]) continue;
          anchors.push(createAnchor(section.sectionId, {
            kind: "manual-block",
            blockId: block.id,
            textPath: field
          }, block[field]));
        }
        continue;
      }
      for (const leaf of visibleTextLeaves(block)) {
        const termMatch = leaf.path.length >= 2 && leaf.path.at(-1) === "translationRu";
        const termParent = termMatch ? pathValue(block, leaf.path.slice(0, -1)) : undefined;
        if (termParent?.termEs) {
          anchors.push(createAnchor(section.sectionId, {
            kind: "manual-term-translation",
            blockId: block.id,
            termEs: termParent.termEs,
            textPath: pathString(leaf.path)
          }, leaf.text));
          continue;
        }
        const simpleBlockField = leaf.path.length === 1;
        anchors.push(createAnchor(section.sectionId, {
          kind: simpleBlockField ? "manual-block" : "manual-card-text",
          blockId: block.id,
          ...(simpleBlockField ? {} : { childId: nearestStableId(block, leaf.path) || block.id }),
          textPath: pathString(leaf.path)
        }, leaf.text));
      }
    }
  }
  return anchors;
}

function pageContentFingerprint(pageId, anchors, images) {
  return fingerprint({
    schemaVersion: PLACEMENT_SCHEMA_VERSION,
    pageId,
    learnerVisibleText: anchors
      .filter((item) => item.pageId === pageId)
      .map((item) => ({ locator: locatorWithoutFingerprint(item.anchor), text: item.text }))
      .sort((a, b) => canonicalJson(a.locator).localeCompare(canonicalJson(b.locator))),
    imagePaths: [...images].sort()
  });
}

export async function loadManualCorpus(root) {
  const server = await createServer({
    root,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "silent"
  });
  try {
    const [manual, introduction, signs] = await Promise.all([
      server.ssrLoadModule("/src/data/manualGuide.ts"),
      server.ssrLoadModule("/src/data/pandemiaVialSection.ts"),
      server.ssrLoadModule("/src/data/manual-signs/app4SignCatalog.ts")
    ]);
    return {
      manual,
      introduction,
      signs,
      anchors: [
        ...introductionAnchors(introduction.pandemiaVialSection, introduction.introductionArticleSections),
        ...manualSectionAnchors(manual.implementedManualGuideSections, signs.app4ManualSignEntries)
      ]
    };
  } finally {
    await server.close();
  }
}

export function createPageInventory(corpus) {
  const { manual, introduction, anchors } = corpus;
  const contentImagesByPage = new Map();
  contentImagesByPage.set("intro-road-pandemic", imagePaths(introduction.pandemiaVialSection));
  for (const section of introduction.introductionArticleSections) contentImagesByPage.set(section.id, imagePaths(section));
  for (const section of manual.implementedManualGuideSections) contentImagesByPage.set(section.sectionId, imagePaths(section));

  const pages = [];
  for (const entry of introduction.introductionNavigation) {
    pages.push({
      pageId: entry.id,
      routeHash: entry.routeHash,
      surfaceKind: "introduction",
      implementationStatus: "implemented",
      eligibility: "eligible",
      eligibilityReasonRu: "Содержит содержательный учебный текст введения.",
      contentSourceIds: [entry.id === "intro-road-pandemic" ? introduction.pandemiaVialSection.id : entry.id],
      contentFingerprint: pageContentFingerprint(entry.id, anchors, contentImagesByPage.get(entry.id) || new Set()),
      review: { status: "derived", generatedAt: GENERATED_AT }
    });
  }

  const sectionEntryById = new Map();
  for (const group of manual.manualGuideNavigation) {
    for (const child of group.children || []) {
      if (child.section) sectionEntryById.set(child.section.id, child.section);
    }
  }

  const ineligibleImplemented = new Map([
    ["front-presentation", "Титульно-презентационная страница без самостоятельного ответа на билеты."],
    ["front-categories", "Справочный перечень категорий, исключённый решением feature 038."],
    ["front-glossary", "Глоссарий прямо запрещён как место размещения билетов."]
  ]);

  for (const section of manual.implementedManualGuideSections) {
    const entry = sectionEntryById.get(section.sectionId);
    if (!entry) throw new Error(`Implemented manual section ${section.sectionId} is absent from navigation.`);
    const excludedReason = ineligibleImplemented.get(section.sectionId);
    pages.push({
      pageId: section.sectionId,
      routeHash: entry.routeHash,
      surfaceKind: "manual-section",
      implementationStatus: "implemented",
      eligibility: excludedReason ? "ineligible" : "eligible",
      eligibilityReasonRu: excludedReason || "Содержит содержательные правила, определения, числовые значения или пояснения.",
      contentSourceIds: [section.id],
      contentFingerprint: pageContentFingerprint(section.sectionId, anchors, contentImagesByPage.get(section.sectionId) || new Set()),
      review: { status: "derived", generatedAt: GENERATED_AT }
    });
  }

  for (const group of manual.manualGuideNavigation) {
    pages.push({
      pageId: `navigation:${group.id}`,
      routeHash: null,
      surfaceKind: "navigation-support",
      implementationStatus: "navigation-only",
      eligibility: "ineligible",
      eligibilityReasonRu: "Навигационная группа не является содержательной страницей Руководства.",
      contentSourceIds: [group.id],
      contentFingerprint: fingerprint({ schemaVersion: PLACEMENT_SCHEMA_VERSION, navigationId: group.id, labelRu: group.labelRu }),
      review: { status: "derived", generatedAt: GENERATED_AT }
    });
  }

  return {
    schemaVersion: PLACEMENT_SCHEMA_VERSION,
    generatedAt: GENERATED_AT,
    pages: pages.sort((a, b) => a.pageId.localeCompare(b.pageId))
  };
}

function resolveIntroductionAnchor(corpus, pageId, anchor) {
  if (anchor.kind === "introduction-segment") {
    const segment = corpus.introduction.pandemiaVialSection.segments.find((item) => item.id === anchor.segmentId);
    return pathValue(segment, parsePath(anchor.textPath));
  }
  const section = corpus.introduction.introductionArticleSections.find((item) => item.id === pageId);
  const block = section?.blocks.find((item) => item.id === anchor.blockId);
  return pathValue(block, parsePath(anchor.textPath));
}

function resolveManualAnchor(corpus, pageId, anchor) {
  const section = corpus.manual.implementedManualGuideSections.find((item) => item.sectionId === pageId);
  const block = section?.blocks.find((item) => item.id === anchor.blockId);
  if (!block) return undefined;
  if (anchor.kind === "manual-sign-entry") {
    return corpus.signs.app4ManualSignEntries.find((item) => item.id === anchor.entryId && item.sectionId === pageId)?.russianTranslation;
  }
  if (anchor.kind === "manual-list-item") return block.itemsRu?.[anchor.itemIndex];
  if (anchor.kind === "manual-table-cell") {
    return block.rows?.find((row) => row.id === anchor.rowId)?.cellsRu?.[anchor.cellIndex];
  }
  return pathValue(block, parsePath(anchor.textPath));
}

export function resolveAnchor(corpus, pageId, anchor) {
  if (anchor.kind.startsWith("introduction-")) return resolveIntroductionAnchor(corpus, pageId, anchor);
  return resolveManualAnchor(corpus, pageId, anchor);
}

export function canonicalEvidence(question, translation) {
  const correctAnswer = question.answers.find((answer) => answer.id === question.correctAnswerId);
  const imageFingerprint = question.image
    ? fingerprint({ localPath: question.image.localPath, sha256: question.image.sha256 })
    : null;
  return {
    questionFingerprint: fingerprint({
      schemaVersion: PLACEMENT_SCHEMA_VERSION,
      id: question.id,
      sourceId: question.sourceId,
      category: question.category,
      jurisdiction: question.jurisdiction,
      contentStatus: question.contentStatus,
      officialTextEs: question.officialTextEs,
      answers: question.answers.map((answer) => ({ id: answer.id, officialTextEs: answer.officialTextEs })),
      correctAnswerId: question.correctAnswerId,
      image: question.image ? {
        localPath: question.image.localPath,
        sha256: question.image.sha256
      } : null
    }),
    translationFingerprint: fingerprint({
      schemaVersion: PLACEMENT_SCHEMA_VERSION,
      questionId: question.id,
      questionTextRu: translation?.questionTextRu,
      answerTranslations: translation?.answerTranslations
    }),
    correctAnswerIdAtReview: question.correctAnswerId,
    correctAnswerFingerprint: fingerprint({
      schemaVersion: PLACEMENT_SCHEMA_VERSION,
      correctAnswerId: question.correctAnswerId,
      officialTextEs: correctAnswer?.officialTextEs,
      translationRu: translation?.answerTranslations?.[question.correctAnswerId]
    }),
    imageFingerprint
  };
}

export function protectedSourcePaths(root) {
  const sectionFiles = readdirSync(join(root, "src/data/manual-sections"))
    .filter((name) => name.endsWith(".ts"))
    .map((name) => `src/data/manual-sections/${name}`);
  return [
    "src/data/pandemiaVialSection.ts",
    "src/data/manualGuide.ts",
    "src/data/manual-signs/app4SignEntries.json",
    "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json",
    ...sectionFiles
  ].sort();
}

export function createProtectedBaseline(root, pageInventory, corpus) {
  const sources = protectedSourcePaths(root).map((path) => ({
    path,
    sha256: sha256(readFileSync(join(root, path)))
  }));
  const referencedImages = new Set();
  imagePaths(corpus.introduction.pandemiaVialSection, referencedImages);
  corpus.introduction.introductionArticleSections.forEach((section) => imagePaths(section, referencedImages));
  corpus.manual.implementedManualGuideSections.forEach((section) => imagePaths(section, referencedImages));
  corpus.signs.app4ManualSignEntries.forEach((entry) => {
    if (entry.assetPath) referencedImages.add(entry.assetPath);
  });
  const images = [...referencedImages].sort().map((path) => {
    if (!existsSync(join(root, path))) throw new Error(`Referenced protected manual image is missing: ${path}`);
    return { path, sha256: sha256(readFileSync(join(root, path))) };
  });
  return {
    schemaVersion: PLACEMENT_SCHEMA_VERSION,
    generatedAt: GENERATED_AT,
    effectiveBaseSha: EXPECTED_BASE_SHA,
    protectedSources: sources,
    referencedImages: images,
    pageContentFingerprints: pageInventory.pages
      .filter((page) => page.surfaceKind !== "navigation-support")
      .map((page) => ({ pageId: page.pageId, contentFingerprint: page.contentFingerprint }))
      .sort((a, b) => a.pageId.localeCompare(b.pageId)),
    aggregateSourceFingerprint: fingerprint(sources),
    aggregateImageFingerprint: fingerprint(images)
  };
}

export const TOPIC_PAGE_CANDIDATES = {
  "parking-clearances-and-corners": ["ch3-stopping-parking"],
  "parking-prohibitions-and-signed-zones": ["ch3-stopping-parking", "app4-signs-regulatory"],
  "driver-hand-signals": ["ch3-turns", "ch1-bicycle"],
  "vehicle-lights-and-signaling": ["ch3-lights"],
  "vehicle-condition-maintenance-loads": ["app1-safety-elements", "app1-other-required-safety-elements", "app1-recommended-safety-elements", "app2-safety-elements", "app3-safety-elements"],
  "pedestrian-and-school-road-markings": ["app4-signs-horizontal", "ch1-pedestrian-priority"],
  "pedestrian-school-zones-and-markings": ["ch1-pedestrian-priority", "app4-signs-horizontal"],
  "speed-limits": ["ch3-speed"],
  "safe-distance-and-braking": ["app2-safe-driving", "app3-safe-driving", "ch3-speed"],
  "alcohol-drugs-and-impairment": ["ch4-alcohol-drugs"],
  "adverse-weather-and-visibility": ["ch3-adverse-conditions"],
  "fatigue-distraction-and-attention": ["ch4-sleep-fatigue", "ch4-stress", "ch4-distractions"],
  "road-types-highways-and-routes": ["ch3-highways", "app2-highways-hospitals", "app3-highways"],
  "regulatory-signs": ["app4-signs-regulatory"],
  "warning-signs": ["app4-signs-warning"],
  "information-signs": ["app4-signs-informational"],
  "traffic-lights-and-rail-crossings": ["app4-signs-traffic-lights", "app4-signs-warning", "app4-signs-regulatory"],
  "right-of-way-signals-and-rail-crossings": ["ch3-right-of-way", "app4-signs-regulatory", "app4-signs-warning"],
  "right-of-way-basic-intersections": ["ch3-right-of-way"],
  "right-of-way-special-situations": ["ch3-right-of-way"],
  "documents-licenses-and-insurance": ["ch2-required-documents"],
  "authorities-controls-and-sanctions": ["ch2-scoring", "ch3-priority-of-rules"],
  "safety-principles-and-risk": ["app2-safe-driving", "app3-safe-driving", "ch5-anticipatory-efficient-driving", "intro-incident"],
  "stopping-vs-parking-maneuvers": ["ch3-stopping-parking"],
  "center-lines-and-crossing-rules": ["app4-signs-horizontal"],
  "lane-and-channelization-markings": ["app4-signs-horizontal"],
  "lane-choice-and-lane-changes": ["ch3-highways", "ch3-turns"],
  "public-transport-and-exclusive-lanes": ["ch1-public-transport-system"],
  "sustainable-mobility-and-vulnerable-users": ["ch1-sustainable-mobility", "ch1-cities-for-people"],
  "vulnerable-users-and-shared-spaces": ["ch1-pedestrian-priority", "ch1-cities-for-people"],
  "bicycles-and-micromobility": ["ch1-bicycle"],
  "mirrors-blind-spots-and-visibility": ["app1-recommended-safety-elements", "app2-safe-driving", "app3-safe-driving"],
  "occupant-protection": ["app1-safety-elements", "app2-safety-elements", "app3-safety-elements"],
  "emergency-response-and-crash-scene": ["ch2-incident-obligations"],
  "crash-liability-and-legal-duties": ["ch2-legal-responsibility", "ch2-incident-obligations"],
  "pedestrian-crossings-and-priority": ["ch1-pedestrian-priority", "ch3-right-of-way"],
  "turns-direction-and-reversing": ["ch3-turns"],
  "overtaking-and-passing": ["ch3-overtaking"]
};

const STOP_TOKENS = new Set([
  "para", "por", "que", "con", "una", "uno", "unos", "unas", "del", "las", "los", "esta", "este", "como", "debe",
  "это", "как", "для", "или", "при", "что", "если", "также", "нужно", "может", "должен", "должна", "будет", "этот", "эта"
]);

function tokens(value) {
  return normalizeText(value).split(" ").filter((token) => token.length >= 3 && !STOP_TOKENS.has(token));
}

const GENERIC_CORRECT_ANSWERS = new Set([
  "verdadero",
  "falso",
  "correcto",
  "incorrecto",
  "si",
  "no",
  "верно",
  "неверно",
  "да",
  "нет"
]);

export function scoreAnchor(anchor, texts, preferredPageIds) {
  const anchorTokens = new Set(tokens(anchor.text));
  const correctEs = normalizeText(texts.correctEs);
  const correctRu = normalizeText(texts.correctRu);
  let score = 0;
  if (correctEs.length >= 4 && !GENERIC_CORRECT_ANSWERS.has(correctEs) && anchor.normalizedText.includes(correctEs)) score += 160;
  if (correctRu.length >= 4 && !GENERIC_CORRECT_ANSWERS.has(correctRu) && anchor.normalizedText.includes(correctRu)) score += 180;
  const weighted = [
    [texts.correctEs, 8],
    [texts.correctRu, 10],
    [texts.correctExplanationRu, 3],
    [texts.questionEs, 1],
    [texts.questionRu, 1]
  ];
  for (const [text, weight] of weighted) {
    for (const token of tokens(text)) {
      if (anchorTokens.has(token)) score += weight + Math.min(token.length, 10) / 10;
    }
  }
  const expectedNumbers = new Set(`${texts.correctEs} ${texts.correctRu} ${texts.correctExplanationRu}`.match(/\d+(?:[.,]\d+)?/gu) || []);
  const anchorNumbers = new Set(anchor.text.match(/\d+(?:[.,]\d+)?/gu) || []);
  for (const number of expectedNumbers) {
    if (anchorNumbers.has(number)) score += 45;
  }
  if (preferredPageIds.has(anchor.pageId)) score += 8;
  if (anchor.anchor.kind === "manual-sign-entry") score += 4;
  if (anchor.text.length < 8) score -= 8;
  return score;
}

export function createPlacementCandidates({ questions, translations, explanations, guide, corpus, pageInventory }) {
  const translationsById = new Map(translations.map((item) => [item.questionId, item]));
  const explanationsById = new Map(explanations.map((item) => [item.questionId, item]));
  const topicsByQuestion = new Map();
  for (const topic of guide.topics) {
    for (const ticket of topic.tickets) {
      const current = topicsByQuestion.get(ticket.questionId) || [];
      current.push(topic.id);
      topicsByQuestion.set(ticket.questionId, current);
    }
  }
  const eligiblePages = new Set(pageInventory.pages.filter((page) => page.eligibility === "eligible").map((page) => page.pageId));
  const pageById = new Map(pageInventory.pages.map((page) => [page.pageId, page]));
  const anchorsByPage = new Map();
  for (const anchor of corpus.anchors) {
    if (!eligiblePages.has(anchor.pageId)) continue;
    const current = anchorsByPage.get(anchor.pageId) || [];
    current.push(anchor);
    anchorsByPage.set(anchor.pageId, current);
  }

  return questions.map((question) => {
    const translation = translationsById.get(question.id);
    const explanation = explanationsById.get(question.id);
    const correctAnswer = question.answers.find((answer) => answer.id === question.correctAnswerId);
    if (!translation || !explanation || !correctAnswer) throw new Error(`Canonical support is incomplete for ${question.id}.`);

    const topicIds = topicsByQuestion.get(question.id) || [];
    const candidatePageIds = [...new Set(topicIds.flatMap((topicId) => TOPIC_PAGE_CANDIDATES[topicId] || []))]
      .filter((pageId) => eligiblePages.has(pageId));
    if (candidatePageIds.length === 0) throw new Error(`${question.id} has no eligible candidate page from reviewed topic routing.`);
    const preferredPageIds = new Set(candidatePageIds);
    const candidateAnchors = candidatePageIds.flatMap((pageId) => anchorsByPage.get(pageId) || []);
    const texts = {
      questionEs: question.officialTextEs,
      questionRu: translation.questionTextRu,
      correctEs: correctAnswer.officialTextEs,
      correctRu: translation.answerTranslations[question.correctAnswerId],
      correctExplanationRu: explanation.correctAnswerExplanationRu
    };
    const ranked = candidateAnchors
      .map((anchor) => ({ anchor, score: scoreAnchor(anchor, texts, preferredPageIds) }))
      .sort((a, b) => b.score - a.score || a.anchor.pageId.localeCompare(b.anchor.pageId) || a.anchor.key.localeCompare(b.anchor.key));
    return {
      questionId: question.id,
      topicIds,
      questionRu: translation.questionTextRu,
      correctAnswerRu: translation.answerTranslations[question.correctAnswerId],
      correctAnswerExplanationRu: explanation.correctAnswerExplanationRu,
      candidates: ranked.slice(0, 8).map(({ anchor, score }) => ({
        pageId: anchor.pageId,
        routeHash: pageById.get(anchor.pageId).routeHash,
        anchor: anchor.anchor,
        anchorText: anchor.text,
        score
      }))
    };
  });
}

export function placementSummary(records, pageInventory) {
  const placements = records.flatMap((record) => record.placements.map((placement) => ({ questionId: record.questionId, ...placement })));
  const density = new Map();
  for (const placement of placements) density.set(placement.pageId, (density.get(placement.pageId) || 0) + 1);
  const densityValues = [...density.values()].sort((a, b) => a - b);
  const median = densityValues.length === 0 ? 0 : densityValues[Math.floor((densityValues.length - 1) / 2)];
  const maximum = densityValues.at(-1) || 0;
  const minimum = densityValues[0] || 0;
  return {
    canonicalQuestionCount: records.length,
    placementRelationCount: placements.length,
    questionsByPlacementCount: {
      1: records.filter((record) => record.placements.length === 1).length,
      2: records.filter((record) => record.placements.length === 2).length,
      3: records.filter((record) => record.placements.length === 3).length
    },
    eligibleRouteCount: pageInventory.pages.filter((page) => page.eligibility === "eligible").length,
    ineligibleRouteCount: pageInventory.pages.filter((page) => page.eligibility === "ineligible").length,
    destinationRouteCount: density.size,
    density: {
      minimum,
      median,
      maximum,
      densePageIds: [...density.entries()].filter(([, count]) => count >= 20).map(([pageId]) => pageId).sort(),
      byPageId: Object.fromEntries([...density.entries()].sort(([a], [b]) => a.localeCompare(b)))
    },
    answerBearingPlacementCount: placements.filter((placement) => placement.placementBasis === "answer-bearing").length,
    ownerApprovedThematicFallbacks: placements
      .filter((placement) => placement.placementBasis === "owner-approved-thematic-fallback")
      .map((placement) => ({
        questionId: placement.questionId,
        auditId: placement.fallbackEvidence.auditId,
        pageId: placement.pageId
      }))
  };
}

export function shardRecords(records) {
  const ranges = [[1, 92], [93, 184], [185, 276], [277, 368], [369, 460]];
  return ranges.map(([start, end]) => ({
    fileName: `${String(start).padStart(3, "0")}-${String(end).padStart(3, "0")}.json`,
    content: {
      schemaVersion: PLACEMENT_SCHEMA_VERSION,
      range: { start, end },
      entries: records.slice(start - 1, end)
    }
  }));
}

export function reviewedRecordFingerprint(record) {
  return fingerprint({
    schemaVersion: REVIEWED_MANIFEST_SCHEMA_VERSION,
    questionId: record.questionId,
    canonicalEvidence: record.canonicalEvidence,
    review: record.review,
    placements: record.placements
  });
}

export function reviewedTopicRouteFingerprint(topicRoutes) {
  return fingerprint({
    schemaVersion: REVIEWED_MANIFEST_SCHEMA_VERSION,
    topicRoutes
  });
}

export function reviewedTicketTopicAssignmentFingerprint(ticketTopicAssignments) {
  return fingerprint({
    schemaVersion: REVIEWED_MANIFEST_SCHEMA_VERSION,
    ticketTopicAssignments
  });
}

export function createReviewedManifest(
  records,
  shardPayloads,
  topicRoutes,
  ticketTopicAssignments,
  sealedAt,
  sealedBy
) {
  const manifestCore = {
    schemaVersion: REVIEWED_MANIFEST_SCHEMA_VERSION,
    sealedAt,
    sealedBy,
    recordCount: records.length,
    topicRouteCount: topicRoutes.routes.length,
    ticketTopicAssignmentCount: ticketTopicAssignments.entries.length,
    topicRoutesFingerprint: reviewedTopicRouteFingerprint(topicRoutes),
    ticketTopicAssignmentsFingerprint: reviewedTicketTopicAssignmentFingerprint(ticketTopicAssignments),
    records: records.map((record) => ({
      questionId: record.questionId,
      fingerprint: reviewedRecordFingerprint(record)
    })),
    shards: shardPayloads.map(({ fileName, content }) => ({
      fileName,
      fingerprint: fingerprint(content)
    }))
  };
  return {
    ...manifestCore,
    aggregateFingerprint: fingerprint(manifestCore)
  };
}

function reviewerIsReserved(reviewedBy) {
  return typeof reviewedBy !== "string" ||
    reviewedBy.length < 8 ||
    RESERVED_REVIEWER_PATTERNS.some((pattern) => pattern.test(reviewedBy));
}

function rationaleIsGeneric(value) {
  if (typeof value !== "string" || value.length < 80) return true;
  const normalized = normalizeText(value);
  return normalized.includes("каноническии правильныи ответ") ||
    normalized.includes("якорь страницы прямо фиксирует правило значение или условие") ||
    normalized.includes("выбран потому что относится к теме вопроса");
}

function distinctNormalizedStrings(values) {
  return new Set((values || []).map((value) => normalizeText(value)).filter(Boolean));
}

function candidateKey(candidate) {
  return canonicalJson({
    pageId: candidate?.pageId,
    anchor: candidate?.anchor ? locatorWithoutFingerprint(candidate.anchor) : null
  });
}

function textContains(value, expected) {
  const normalizedValue = normalizeText(value);
  const normalizedExpected = normalizeText(expected);
  return normalizedExpected.length >= 4 && normalizedValue.includes(normalizedExpected);
}

function validateReviewedManifest(records, manifest, topicRoutes, ticketTopicAssignments) {
  const errors = [];
  if (!manifest || manifest.schemaVersion !== REVIEWED_MANIFEST_SCHEMA_VERSION) {
    return ["Reviewed manifest is missing or has an unsupported schema version."];
  }
  if (reviewerIsReserved(manifest.sealedBy)) errors.push("Reviewed manifest uses a reserved or synthetic reviewer identity.");
  if (manifest.recordCount !== records.length) errors.push("Reviewed manifest record count is stale.");
  if (manifest.topicRouteCount !== topicRoutes?.routes?.length) errors.push("Reviewed manifest topic-route count is stale.");
  if (manifest.ticketTopicAssignmentCount !== ticketTopicAssignments?.entries?.length) {
    errors.push("Reviewed manifest ticket-topic assignment count is stale.");
  }
  if (manifest.topicRoutesFingerprint !== reviewedTopicRouteFingerprint(topicRoutes)) {
    errors.push("Reviewed topic-routing source differs from immutable manifest.");
  }
  if (manifest.ticketTopicAssignmentsFingerprint !== reviewedTicketTopicAssignmentFingerprint(ticketTopicAssignments)) {
    errors.push("Reviewed ticket-topic assignment source differs from immutable manifest.");
  }
  const manifestEntries = manifest.records || [];
  const manifestByQuestion = new Map(manifestEntries.map((entry) => [entry.questionId, entry]));
  for (const record of records) {
    const entry = manifestByQuestion.get(record.questionId);
    if (!entry) {
      errors.push(`${record.questionId}: missing immutable reviewed-manifest entry.`);
    } else if (entry.fingerprint !== reviewedRecordFingerprint(record)) {
      errors.push(`${record.questionId}: reviewed source differs from immutable manifest.`);
    }
  }
  if (manifestEntries.length !== records.length || manifestByQuestion.size !== manifestEntries.length) {
    errors.push("Reviewed manifest has duplicate or extra record entries.");
  }
  const shardPayloads = shardRecords(records);
  const shardByName = new Map((manifest.shards || []).map((entry) => [entry.fileName, entry]));
  for (const shard of shardPayloads) {
    const entry = shardByName.get(shard.fileName);
    if (!entry || entry.fingerprint !== fingerprint(shard.content)) {
      errors.push(`${shard.fileName}: reviewed shard differs from immutable manifest.`);
    }
  }
  const { aggregateFingerprint, ...manifestCore } = manifest;
  if (aggregateFingerprint !== fingerprint(manifestCore)) errors.push("Reviewed manifest aggregate fingerprint is stale.");
  return errors;
}

function isKnownFalseFixture(questionId, placement) {
  if (questionId === "b-fallback-003") {
    return placement.pageId === "app1-other-required-safety-elements" &&
      placement.anchor?.blockId === "extinguisher";
  }
  if (questionId === "b-fallback-011") {
    return placement.pageId === "intro-road-pandemic" &&
      placement.anchor?.segmentId === "airplane-strip";
  }
  if (questionId === "b-fallback-042") {
    return placement.pageId === "app1-safety-elements" &&
      placement.anchor?.blockId === "steering-suspension-brakes";
  }
  return false;
}

export function validatePlacementData({
  root,
  corpus,
  questions,
  translations,
  pageInventory,
  baseline,
  records,
  evidence,
  reviewedManifest,
  topicRoutes,
  ticketTopicAssignments
}) {
  const errors = validateReviewedManifest(records, reviewedManifest, topicRoutes, ticketTopicAssignments);
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const translationById = new Map(translations.map((item) => [item.questionId, item]));
  const pageById = new Map(pageInventory.pages.map((page) => [page.pageId, page]));
  const routeById = new Map((topicRoutes?.routes || []).map((route) => [route.topicRouteId, route]));
  const assignmentByQuestion = new Map(
    (ticketTopicAssignments?.entries || []).map((assignment) => [assignment.questionId, assignment])
  );
  const seenQuestions = new Set();
  const searchedConceptSignatures = new Map();
  const auditConclusionSignatures = new Map();
  const selectionRationaleSignatures = new Map();
  const contradictionAudit = contradictionAuditSummary(records, questions, translations);
  const contradictionAuditIds = new Set([
    ...contradictionAudit.reclassifiedAnswerBearingIds,
    ...contradictionAudit.retainedFallbackIds
  ]);

  if (routeById.size !== (topicRoutes?.routes || []).length) errors.push("Topic-routing source has duplicate route IDs.");
  if (assignmentByQuestion.size !== (ticketTopicAssignments?.entries || []).length) {
    errors.push("Ticket-topic assignment source has duplicate question IDs.");
  }

  for (const route of topicRoutes?.routes || []) {
    if (route.review?.status !== "approved" || reviewerIsReserved(route.review?.reviewedBy)) {
      errors.push(`${route.topicRouteId}: topic route is not independently reviewed.`);
    }
    if (!Array.isArray(route.pages) || route.pages.length < 1 || route.pages.length > 3) {
      errors.push(`${route.topicRouteId}: topic route must contain 1..3 ordered pages.`);
      continue;
    }
    for (const routePage of route.pages) {
      const page = pageById.get(routePage.pageId);
      if (page?.eligibility !== "eligible" || page?.implementationStatus !== "implemented") {
        errors.push(`${route.topicRouteId}: route page ${routePage.pageId} is not substantive and eligible.`);
      }
      if (page && routePage.pageContentFingerprint !== page.contentFingerprint) {
        errors.push(`${route.topicRouteId}/${routePage.pageId}: stale curated page fingerprint.`);
      }
      if (!Array.isArray(routePage.anchors) || routePage.anchors.length < 1) {
        errors.push(`${route.topicRouteId}/${routePage.pageId}: curated route has no thematic anchors.`);
      }
      for (const curated of routePage.anchors || []) {
        const resolved = resolveAnchor(corpus, routePage.pageId, curated.anchor);
        if (resolved !== curated.anchorTextAtReview ||
            anchorFingerprint(curated.anchor, resolved || "") !== curated.anchor?.textFingerprint) {
          errors.push(`${route.topicRouteId}/${routePage.pageId}: stale curated thematic anchor.`);
        }
      }
    }
  }

  for (const assignment of ticketTopicAssignments?.entries || []) {
    if (!questionById.has(assignment.questionId)) errors.push(`${assignment.questionId}: assignment references unknown ticket.`);
    if (!routeById.has(assignment.topicRouteId)) {
      errors.push(`${assignment.questionId}: assignment references unknown topic route ${assignment.topicRouteId}.`);
    }
    if (assignment.review?.status !== "approved" || reviewerIsReserved(assignment.review?.reviewedBy)) {
      errors.push(`${assignment.questionId}: ticket-topic assignment is not independently reviewed.`);
    }
    if (typeof assignment.reviewerRationaleRu !== "string" || assignment.reviewerRationaleRu.length < 40) {
      errors.push(`${assignment.questionId}: ticket-topic assignment lacks review rationale.`);
    }
  }

  for (const record of records) {
    const question = questionById.get(record.questionId);
    if (!question) errors.push(`${record.questionId}: unknown canonical question.`);
    if (seenQuestions.has(record.questionId)) errors.push(`${record.questionId}: duplicate mapping record.`);
    seenQuestions.add(record.questionId);
    if (record.review?.status !== "approved") errors.push(`${record.questionId}: ticket review is not approved.`);
    if (reviewerIsReserved(record.review?.reviewedBy)) errors.push(`${record.questionId}: ticket review uses a reserved or synthetic reviewer identity.`);
    if (record.placements?.length < 1 || record.placements?.length > 3) errors.push(`${record.questionId}: placement count must be 1..3.`);
    if (question) {
      const expected = canonicalEvidence(question, translationById.get(question.id));
      if (canonicalJson(expected) !== canonicalJson(record.canonicalEvidence)) errors.push(`${record.questionId}: stale canonical evidence.`);
    }
    const assignment = assignmentByQuestion.get(record.questionId);
    if (!assignment) errors.push(`${record.questionId}: missing reviewed topic-route assignment.`);
    if (record.topicRouteId !== assignment?.topicRouteId) {
      errors.push(`${record.questionId}: placement record differs from reviewed topic-route assignment.`);
    }
    const seenPages = new Set();
    for (const placement of record.placements || []) {
      const page = pageById.get(placement.pageId);
      if (!page) errors.push(`${record.questionId}: unknown page ${placement.pageId}.`);
      if (page?.routeHash !== placement.routeHash) errors.push(`${record.questionId}: route hash mismatch for ${placement.pageId}.`);
      if (page?.eligibility !== "eligible" || page?.implementationStatus !== "implemented") {
        errors.push(`${record.questionId}: ineligible destination ${placement.pageId}.`);
      }
      if (page && placement.pageContentFingerprint !== page.contentFingerprint) {
        errors.push(`${record.questionId}/${placement.pageId}: stale page content fingerprint.`);
      }
      if (seenPages.has(placement.pageId)) errors.push(`${record.questionId}: duplicate destination ${placement.pageId}.`);
      seenPages.add(placement.pageId);
      if (placement.review?.status !== "approved") errors.push(`${record.questionId}/${placement.pageId}: placement review is not approved.`);
      if (reviewerIsReserved(placement.review?.reviewedBy)) {
        errors.push(`${record.questionId}/${placement.pageId}: placement review uses a reserved or synthetic reviewer identity.`);
      }
      if (isKnownFalseFixture(record.questionId, placement)) {
        errors.push(`${record.questionId}/${placement.pageId}: known false mapping fixture was restored.`);
      }
      const resolved = resolveAnchor(corpus, placement.pageId, placement.anchor);
      if (typeof resolved !== "string" || !resolved.trim()) {
        errors.push(`${record.questionId}/${placement.pageId}: anchor does not resolve to learner-visible text.`);
      } else if (anchorFingerprint(placement.anchor, resolved) !== placement.anchor.textFingerprint) {
        errors.push(`${record.questionId}/${placement.pageId}: stale anchor fingerprint.`);
      } else if (placement.anchorTextAtReview !== resolved) {
        errors.push(`${record.questionId}/${placement.pageId}: exact reviewed anchor text is stale.`);
      }
      if (placement.placementBasis === "owner-approved-thematic-fallback") {
        const fallback = placement.fallbackEvidence;
        const route = routeById.get(assignment?.topicRouteId);
        const routePage = route?.pages?.find((candidate) => candidate.pageId === placement.pageId);
        const curatedAnchor = routePage?.anchors?.find(
          (candidate) => canonicalJson(candidate.anchor) === canonicalJson(placement.anchor)
        );
        const commonValid =
          fallback?.questionId === record.questionId &&
          fallback?.ownerDecisionDate === "2026-06-23" &&
          fallback?.ownerDecisionRef === "feature-038-owner-decision-2026-06-23" &&
          fallback?.topicRouteId === assignment?.topicRouteId &&
          typeof fallback?.auditId === "string" &&
          typeof fallback?.auditConclusionRu === "string" &&
          fallback.auditConclusionRu.length >= 40 &&
          typeof fallback?.selectionRationaleRu === "string" &&
          fallback.selectionRationaleRu.length >= 40 &&
          typeof placement.thematicBasisRu === "string" &&
          placement.thematicBasisRu.length >= 40;
        if (!commonValid || !routePage || !curatedAnchor) {
          errors.push(`${record.questionId}/${placement.pageId}: fallback is outside its reviewed curated route.`);
        }

        const searchedConcepts = fallback?.searchedConcepts;
        const normalizedConcepts = distinctNormalizedStrings(searchedConcepts);
        const ticketSearchCorpus = [
          question?.officialTextEs,
          translationById.get(record.questionId)?.questionTextRu,
          question?.answers?.find((answer) => answer.id === question.correctAnswerId)?.officialTextEs,
          translationById.get(record.questionId)?.answerTranslations?.[question?.correctAnswerId]
        ].filter(Boolean);
        if (!Array.isArray(searchedConcepts) || searchedConcepts.length < 2 || normalizedConcepts.size < 2) {
          errors.push(`${record.questionId}/${placement.pageId}: fallback lacks two distinct searched concepts.`);
        } else if (searchedConcepts.some((concept) => !ticketSearchCorpus.some((source) =>
          textContains(source, concept) || textContains(concept, source)
        ))) {
          errors.push(`${record.questionId}/${placement.pageId}: fallback searched concepts are not ticket-specific.`);
        }

        const conceptSignature = [...normalizedConcepts].sort().join("|");
        const priorConceptQuestion = searchedConceptSignatures.get(conceptSignature);
        if (conceptSignature && priorConceptQuestion && priorConceptQuestion !== record.questionId) {
          errors.push(`${record.questionId}/${placement.pageId}: fallback reuses another ticket's searched-concept ledger.`);
        } else if (conceptSignature) {
          searchedConceptSignatures.set(conceptSignature, record.questionId);
        }

        const candidates = fallback?.candidatesReviewed;
        const candidateKeys = new Set((candidates || []).map(candidateKey));
        const selectedCandidates = (candidates || []).filter((candidate) => candidate.outcome === "selected-closest-topic");
        const rejectedCandidates = (candidates || []).filter((candidate) => candidate.outcome === "rejected");
        if (!Array.isArray(candidates) || candidates.length < 2 || candidateKeys.size !== candidates.length) {
          errors.push(`${record.questionId}/${placement.pageId}: fallback lacks two distinct exact candidates.`);
        }
        if (selectedCandidates.length !== 1 || rejectedCandidates.length < 1) {
          errors.push(`${record.questionId}/${placement.pageId}: fallback must have one selected and at least one rejected candidate.`);
        }

        for (const candidate of candidates || []) {
          const candidatePage = pageById.get(candidate.pageId);
          const candidateText = resolveAnchor(corpus, candidate.pageId, candidate.anchor);
          if (!candidatePage || candidatePage.eligibility !== "eligible" || candidatePage.implementationStatus !== "implemented") {
            errors.push(`${record.questionId}/${placement.pageId}: fallback candidate ${candidate.pageId} is not substantive and eligible.`);
          }
          if (candidatePage && candidate.pageContentFingerprint !== candidatePage.contentFingerprint) {
            errors.push(`${record.questionId}/${placement.pageId}: fallback candidate ${candidate.pageId} has a stale page fingerprint.`);
          }
          if (typeof candidateText !== "string" || !candidateText.trim()) {
            errors.push(`${record.questionId}/${placement.pageId}: fallback candidate ${candidate.pageId} does not resolve.`);
          } else if (
            candidate.anchorTextAtReview !== candidateText ||
            anchorFingerprint(candidate.anchor, candidateText) !== candidate.anchor?.textFingerprint
          ) {
            errors.push(`${record.questionId}/${placement.pageId}: fallback candidate ${candidate.pageId} has stale exact-anchor evidence.`);
          }
          if (candidate.outcome === "rejected" && (
            typeof candidate.rejectionRu !== "string" ||
            candidate.rejectionRu.length < 80 ||
            !candidate.rejectionRu.includes(record.questionId) ||
            !candidate.rejectionRu.includes(placement.pageId)
          )) {
            errors.push(`${record.questionId}/${placement.pageId}: fallback rejection is not ticket-specific and comparative.`);
          }
          if (candidate.outcome === "rejected") {
            const matchKinds = detectRejectedCandidateAnswerOverlap(
              candidate,
              question,
              translationById.get(record.questionId)
            );
            if (matchKinds.length > 0) {
              const disposition = candidate.answerOverlapDisposition;
              const validClasses = new Set([
                "negated-or-warning",
                "incomplete-proposition",
                "wrong-scope-or-condition",
                "ambiguous-without-context"
              ]);
              if (
                disposition?.outcome !== "not-self-sufficient" ||
                !validClasses.has(disposition?.limitationClass) ||
                typeof disposition?.limitationRu !== "string" ||
                disposition.limitationRu.length < 100 ||
                !disposition.limitationRu.includes(record.questionId) ||
                reviewerIsReserved(disposition?.reviewedBy) ||
                !Array.isArray(disposition?.matchKinds) ||
                !matchKinds.every((kind) => disposition.matchKinds.includes(kind))
              ) {
                errors.push(`${record.questionId}/${placement.pageId}: rejected canonical-answer overlap lacks a reviewed not-self-sufficient disposition.`);
              }
            }
          }
        }

        const selectedCandidate = selectedCandidates[0];
        if (selectedCandidate && (
          selectedCandidate.pageId !== placement.pageId ||
          canonicalJson(selectedCandidate.anchor) !== canonicalJson(placement.anchor) ||
          selectedCandidate.anchorTextAtReview !== placement.anchorTextAtReview ||
          selectedCandidate.pageContentFingerprint !== placement.pageContentFingerprint
        )) {
          errors.push(`${record.questionId}/${placement.pageId}: selected fallback candidate differs from the committed placement.`);
        }

        const rejectedPageIds = rejectedCandidates.map((candidate) => candidate.pageId);
        if (
          !fallback?.auditConclusionRu?.includes(record.questionId) ||
          !textContains(fallback.auditConclusionRu, translationById.get(record.questionId)?.questionTextRu || question?.officialTextEs) ||
          !fallback?.selectionRationaleRu?.includes(placement.pageId) ||
          !rejectedPageIds.some((pageId) => fallback.selectionRationaleRu.includes(pageId))
        ) {
          errors.push(`${record.questionId}/${placement.pageId}: fallback audit conclusion or selection rationale is generic.`);
        }

        for (const [value, signatures, label] of [
          [fallback?.auditConclusionRu, auditConclusionSignatures, "audit conclusion"],
          [fallback?.selectionRationaleRu, selectionRationaleSignatures, "selection rationale"]
        ]) {
          const signature = normalizeText(value);
          const priorQuestion = signatures.get(signature);
          if (signature && priorQuestion && priorQuestion !== record.questionId) {
            errors.push(`${record.questionId}/${placement.pageId}: fallback reuses another ticket's ${label}.`);
          } else if (signature) {
            signatures.set(signature, record.questionId);
          }
        }
      } else {
        if (placement.placementBasis !== "answer-bearing") errors.push(`${record.questionId}/${placement.pageId}: unsupported placement basis.`);
        if (typeof placement.directAnswerAssertionRu !== "string" ||
            placement.directAnswerAssertionRu.length < 40 ||
            rationaleIsGeneric(placement.reviewerRationaleRu)) {
          errors.push(`${record.questionId}/${placement.pageId}: strict placement lacks direct-answer evidence.`);
        }
        const contradictionReview = placement.contradictionReview;
        if (
          contradictionReview?.outcome !== "supplies-canonical-answer" ||
          !["lexical-containment", "reviewed-semantic-equivalence"].includes(contradictionReview?.screeningSource) ||
          !Array.isArray(contradictionReview?.matchKinds) ||
          contradictionReview.matchKinds.length < 1 ||
          reviewerIsReserved(contradictionReview?.reviewedBy)
        ) {
          errors.push(`${record.questionId}/${placement.pageId}: answer-bearing remediation lacks reviewed contradiction evidence.`);
        }
        if (placement.fallbackEvidence || placement.thematicBasisRu) {
          errors.push(`${record.questionId}/${placement.pageId}: answer-bearing placement retains fallback-only evidence.`);
        }
      }
    }
  }

  const record042 = records.find((record) => record.questionId === "b-fallback-042");
  const placement042 = record042?.placements?.[0];
  if (
    record042?.topicRouteId !== "information-signs" ||
    assignmentByQuestion.get("b-fallback-042")?.topicRouteId !== "information-signs" ||
    placement042?.pageId !== "app4-signs-informational" ||
    placement042?.anchor?.kind !== "manual-sign-entry" ||
    placement042?.anchor?.entryId !== "app4informational-p191-019-terminal-de-omnibus-catalog-entry" ||
    resolveAnchor(corpus, placement042?.pageId, placement042?.anchor) !== "автовокзал"
  ) {
    errors.push("b-fallback-042: exact informational-sign bus-terminal invariant failed.");
  }

  const record126 = records.find((record) => record.questionId === "b-fallback-126");
  const placement126 = record126?.placements?.[0];
  const candidates126 = placement126?.fallbackEvidence?.candidatesReviewed || [];
  if (
    record126?.topicRouteId !== "vehicle-condition-maintenance-loads" ||
    placement126?.pageId !== "app1-safety-elements" ||
    placement126?.anchor?.kind !== "manual-list-item" ||
    placement126?.anchor?.blockId !== "pre-driving-checks" ||
    placement126?.anchor?.itemIndex !== 0 ||
    placement126?.anchor?.textPath !== "itemsRu" ||
    !candidates126.some((candidate) =>
      candidate.pageId === "ch5-anticipatory-efficient-driving" &&
      candidate.anchor?.blockId === "efficient-driving-measures" &&
      candidate.anchor?.itemIndex === 5 &&
      candidate.outcome === "rejected"
    ) ||
    !candidates126.some((candidate) =>
      candidate.pageId === "app3-social-responsibility" &&
      candidate.anchor?.blockId === "vehicle-precheck" &&
      candidate.anchor?.itemIndex === 2 &&
      candidate.outcome === "rejected"
    )
  ) {
    errors.push("b-fallback-126: exact pre-driving oil-check invariant or comparison ledger failed.");
  }

  for (const fixtureId of ["b-fallback-001", "b-fallback-065", "b-fallback-086"]) {
    const fixturePlacement = records.find((record) => record.questionId === fixtureId)?.placements?.[0];
    if (fixturePlacement?.placementBasis !== "answer-bearing") {
      errors.push(`${fixtureId}: exact self-sufficient answer-bearing candidate remains rejected.`);
    }
  }
  const fallback026 = records.find((record) => record.questionId === "b-fallback-026")?.placements?.[0];
  const disposition026 = fallback026?.fallbackEvidence?.candidatesReviewed
    ?.find((candidate) => candidate.outcome === "rejected")?.answerOverlapDisposition;
  if (fallback026?.placementBasis !== "owner-approved-thematic-fallback" ||
      disposition026?.limitationClass !== "negated-or-warning") {
    errors.push("b-fallback-026: negated speed-warning fallback disposition failed.");
  }
  const fallback202 = records.find((record) => record.questionId === "b-fallback-202")?.placements?.[0];
  const disposition202 = fallback202?.fallbackEvidence?.candidatesReviewed
    ?.find((candidate) => candidate.outcome === "rejected")?.answerOverlapDisposition;
  if (fallback202?.placementBasis !== "owner-approved-thematic-fallback" ||
      disposition202?.limitationClass !== "incomplete-proposition" ||
      !disposition202?.limitationRu?.includes("более чем двумя путями")) {
    errors.push("b-fallback-202: partial railway-crossing fallback disposition failed.");
  }
  for (const questionId of [
    ...F038_RA004_LEXICAL_BASELINE_IDS,
    ...F038_RA004_SEMANTIC_EQUIVALENCE_IDS
  ]) {
    if (!contradictionAuditIds.has(questionId)) {
      errors.push(`${questionId}: F038-RA-004 contradiction audit has no reviewed disposition.`);
    }
  }
  if (contradictionAudit.unresolvedIds.length > 0) {
    errors.push(`F038-RA-004 has unresolved answer-overlap contradictions: ${contradictionAudit.unresolvedIds.join(", ")}.`);
  }

  for (const question of questions) {
    if (!seenQuestions.has(question.id)) errors.push(`${question.id}: zero placements.`);
    if (!assignmentByQuestion.has(question.id)) errors.push(`${question.id}: zero reviewed topic assignments.`);
  }
  if (records.length !== questions.length) errors.push(`Expected ${questions.length} mapping records, found ${records.length}.`);
  const currentBaseline = createProtectedBaseline(root, pageInventory, corpus);
  if (canonicalJson(currentBaseline.protectedSources) !== canonicalJson(baseline.protectedSources)) errors.push("Protected manual source files changed.");
  if (canonicalJson(currentBaseline.referencedImages) !== canonicalJson(baseline.referencedImages)) errors.push("Protected manual image paths or bytes changed.");
  if (canonicalJson(currentBaseline.pageContentFingerprints) !== canonicalJson(baseline.pageContentFingerprints)) errors.push("Protected learner-visible manual page content changed.");
  if (baseline.effectiveBaseSha !== EXPECTED_BASE_SHA) errors.push("Protected baseline base SHA is not the assigned verified base.");

  const summary = placementSummary(records, pageInventory);
  if (evidence && canonicalJson(evidence.summary) !== canonicalJson(summary)) errors.push("Placement evidence summary is stale.");
  if (evidence && canonicalJson(evidence.contradictionAudit) !== canonicalJson(contradictionAudit)) {
    errors.push("Placement contradiction-audit evidence is stale.");
  }
  return { errors, summary, contradictionAudit };
}

export function relativePath(root, path) {
  return relative(root, path).replaceAll("\\", "/");
}
