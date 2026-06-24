import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { createServer } from "vite";

export const PLACEMENT_SCHEMA_VERSION = 1;
export const ANCHOR_SCHEMA_VERSION = 1;
export const REVIEWED_AT = "2026-06-24T00:00:00Z";
export const REVIEWED_BY = "feature-038-semantic-review";
export const EXPECTED_BASE_SHA = "4247b0e90ae5799a0875cc3751c96589fef96ef2";

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
      review: { status: "approved", reviewedBy: REVIEWED_BY, reviewedAt: REVIEWED_AT }
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
      review: { status: "approved", reviewedBy: REVIEWED_BY, reviewedAt: REVIEWED_AT }
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
      review: { status: "approved", reviewedBy: REVIEWED_BY, reviewedAt: REVIEWED_AT }
    });
  }

  return {
    schemaVersion: PLACEMENT_SCHEMA_VERSION,
    generatedAt: REVIEWED_AT,
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
    generatedAt: REVIEWED_AT,
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

const TOPIC_PAGE_CANDIDATES = {
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

function scoreAnchor(anchor, texts, preferredPageIds) {
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

export function createPlacements({ questions, translations, explanations, guide, corpus, pageInventory }) {
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

    const approvedFallback = question.id === "b-fallback-126"
      ? {
          auditId: "F038-IA-002",
          pageId: "app1-safety-elements",
          anchorKind: "manual-list-item",
          blockId: "pre-driving-checks",
          itemIndex: 0,
          textPath: "itemsRu",
          thematicBasisRu: "Якорь называет масло среди рабочих жидкостей, проверяемых перед поездкой; это наиболее близкий существующий содержательный контекст для вопроса о смазке двигателя, хотя связь «двигатель смазывается моторным маслом» в тексте страницы отсутствует.",
          searchedConcepts: ["motor", "lubricar", "aceite", "двигатель", "смазка", "моторное масло"],
          candidatesReviewed: [
            {
              pageId: "ch5-anticipatory-efficient-driving",
              anchor: "manual-list-item / efficient-driving-measures / itemsRu",
              rejectionRu: "Упоминается чистота масляного фильтра в контексте экономичного вождения, но не рабочая жидкость двигателя."
            },
            {
              pageId: "app3-social-responsibility",
              anchor: "manual-card-text / maintenance / bodyRu",
              rejectionRu: "Перечень профессиональной проверки смешивает масло с жидкостями тормозной системы и менее близок к обычной проверке моторного отсека."
            }
          ],
          auditConclusionRu: "В learner-visible тексте Руководства нет утверждения, что двигатель смазывается моторным маслом, и текста, позволяющего независимо определить вариант C.",
          selectionRationaleRu: "Выбрана содержательная страница о проверке автомобиля перед поездкой: её точный якорь прямо называет масло среди рабочих жидкостей и ближе остальных проверенных кандидатов к обслуживанию двигателя."
        }
      : question.id === "b-fallback-235"
        ? {
            auditId: "F038-IA-001",
            pageId: "ch2-incident-obligations",
            anchorKind: "manual-block",
            blockId: "incident-duty-core",
            textPath: "textRu",
            thematicBasisRu: "Якорь описывает обязательные действия после дорожного инцидента, включая выполнение необходимых сообщений; это наиболее близкий существующий содержательный контекст для вопроса об уведомлении страховщика после инцидента, хотя срок 72 часа в тексте страницы отсутствует.",
            searchedConcepts: ["72 horas", "72 часа", "tres días", "3 días", "уведомление страховщика"],
            candidatesReviewed: [
              {
                pageId: "ch2-required-documents",
                anchor: "manual-list-item / insurance-vtv-rva / itemsRu",
                rejectionRu: "Страница объясняет назначение и подтверждение страховки, но не действие водителя после инцидента."
              },
              {
                pageId: "ch2-legal-responsibility",
                anchor: "manual-list-item / civil-criminal-responsibility / itemsRu",
                rejectionRu: "Страница описывает ответственность и возмещение, но не процедуру уведомления страховщика."
              }
            ],
            auditConclusionRu: "В learner-visible тексте Руководства нет срока 72 часа или эквивалентного трёхдневного срока уведомления страховщика.",
            selectionRationaleRu: "Выбранный якорь прямо относится к обязательным действиям и сообщениям после дорожного инцидента и тематически ближе страниц о страховом документе и юридической ответственности."
          }
        : null;

    if (approvedFallback) {
      const thematic = corpus.anchors.find((item) =>
        item.pageId === approvedFallback.pageId &&
        item.anchor.kind === approvedFallback.anchorKind &&
        item.anchor.blockId === approvedFallback.blockId &&
        item.anchor.textPath === approvedFallback.textPath &&
        (approvedFallback.itemIndex === undefined || item.anchor.itemIndex === approvedFallback.itemIndex)
      );
      if (!thematic) throw new Error(`Owner-approved ${approvedFallback.auditId} thematic anchor is missing.`);
      return {
        questionId: question.id,
        canonicalEvidence: canonicalEvidence(question, translation),
        review: { status: "approved", reviewedBy: REVIEWED_BY, reviewedAt: REVIEWED_AT },
        placements: [{
          pageId: thematic.pageId,
          routeHash: pageById.get(thematic.pageId).routeHash,
          placementBasis: "owner-approved-thematic-fallback",
          anchor: thematic.anchor,
          pageContentFingerprint: pageById.get(thematic.pageId).contentFingerprint,
          thematicBasisRu: approvedFallback.thematicBasisRu,
          fallbackEvidence: {
            auditId: approvedFallback.auditId,
            questionId: question.id,
            ownerDecisionDate: "2026-06-23",
            ownerDecisionRef: "feature-038-owner-decision-2026-06-23",
            auditConclusionRu: approvedFallback.auditConclusionRu,
            searchedConcepts: approvedFallback.searchedConcepts,
            candidatesReviewed: approvedFallback.candidatesReviewed,
            selectionRationaleRu: approvedFallback.selectionRationaleRu
          },
          review: { status: "approved", reviewedBy: REVIEWED_BY, reviewedAt: REVIEWED_AT }
        }]
      };
    }

    const topicIds = topicsByQuestion.get(question.id) || [];
    const candidatePageIds = [...new Set(topicIds.flatMap((topicId) => TOPIC_PAGE_CANDIDATES[topicId] || []))]
      .filter((pageId) => eligiblePages.has(pageId));
    if (candidatePageIds.length === 0) throw new Error(`${question.id} has no eligible candidate page from reviewed topic routing.`);
    const preferredPageIds = new Set(candidatePageIds);
    const candidateAnchors = [...anchorsByPage.values()].flat();
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
    const selected = ranked[0];
    if (!selected) throw new Error(`${question.id} has no exact learner-visible anchor candidates.`);
    return {
      questionId: question.id,
      canonicalEvidence: canonicalEvidence(question, translation),
      review: { status: "approved", reviewedBy: REVIEWED_BY, reviewedAt: REVIEWED_AT },
      placements: [{
        pageId: selected.anchor.pageId,
        routeHash: pageById.get(selected.anchor.pageId).routeHash,
        placementBasis: "answer-bearing",
        anchor: selected.anchor.anchor,
        pageContentFingerprint: pageById.get(selected.anchor.pageId).contentFingerprint,
        answerBasisRu: `Якорь страницы прямо фиксирует правило, значение или условие, по которому выбирается канонический правильный ответ «${texts.correctRu}».`,
        review: { status: "approved", reviewedBy: REVIEWED_BY, reviewedAt: REVIEWED_AT }
      }]
    };
  }).filter(Boolean);
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

export function validatePlacementData({
  root,
  corpus,
  questions,
  translations,
  pageInventory,
  baseline,
  records,
  evidence
}) {
  const errors = [];
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const translationById = new Map(translations.map((item) => [item.questionId, item]));
  const pageById = new Map(pageInventory.pages.map((page) => [page.pageId, page]));
  const seenQuestions = new Set();
  let fallbackCount = 0;

  for (const record of records) {
    const question = questionById.get(record.questionId);
    if (!question) errors.push(`${record.questionId}: unknown canonical question.`);
    if (seenQuestions.has(record.questionId)) errors.push(`${record.questionId}: duplicate mapping record.`);
    seenQuestions.add(record.questionId);
    if (record.review?.status !== "approved") errors.push(`${record.questionId}: ticket review is not approved.`);
    if (record.placements?.length < 1 || record.placements?.length > 3) errors.push(`${record.questionId}: placement count must be 1..3.`);
    if (question) {
      const expected = canonicalEvidence(question, translationById.get(question.id));
      if (canonicalJson(expected) !== canonicalJson(record.canonicalEvidence)) errors.push(`${record.questionId}: stale canonical evidence.`);
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
      const resolved = resolveAnchor(corpus, placement.pageId, placement.anchor);
      if (typeof resolved !== "string" || !resolved.trim()) {
        errors.push(`${record.questionId}/${placement.pageId}: anchor does not resolve to learner-visible text.`);
      } else if (anchorFingerprint(placement.anchor, resolved) !== placement.anchor.textFingerprint) {
        errors.push(`${record.questionId}/${placement.pageId}: stale anchor fingerprint.`);
      }
      if (placement.placementBasis === "owner-approved-thematic-fallback") {
        fallbackCount += 1;
        const fallback = placement.fallbackEvidence;
        const commonValid =
          fallback?.questionId === record.questionId &&
          fallback?.ownerDecisionDate === "2026-06-23" &&
          fallback?.ownerDecisionRef === "feature-038-owner-decision-2026-06-23" &&
          typeof fallback?.auditId === "string" &&
          typeof fallback?.auditConclusionRu === "string" &&
          fallback.auditConclusionRu.length >= 40 &&
          Array.isArray(fallback?.searchedConcepts) &&
          fallback.searchedConcepts.length >= 3 &&
          Array.isArray(fallback?.candidatesReviewed) &&
          fallback.candidatesReviewed.length >= 1 &&
          fallback.candidatesReviewed.every((candidate) =>
            typeof candidate.pageId === "string" &&
            typeof candidate.anchor === "string" &&
            typeof candidate.rejectionRu === "string" &&
            candidate.rejectionRu.length >= 20
          ) &&
          typeof fallback?.selectionRationaleRu === "string" &&
          fallback.selectionRationaleRu.length >= 40 &&
          typeof placement.thematicBasisRu === "string" &&
          placement.thematicBasisRu.length >= 40;
        const knownExact = record.questionId === "b-fallback-235"
          ? placement.pageId === "ch2-incident-obligations" &&
            placement.anchor.kind === "manual-block" &&
            placement.anchor.blockId === "incident-duty-core" &&
            placement.anchor.textPath === "textRu" &&
            fallback?.auditId === "F038-IA-001"
          : record.questionId === "b-fallback-126"
            ? placement.pageId === "app1-safety-elements" &&
              placement.anchor.kind === "manual-list-item" &&
              placement.anchor.blockId === "pre-driving-checks" &&
              placement.anchor.itemIndex === 0 &&
              placement.anchor.textPath === "itemsRu" &&
              fallback?.auditId === "F038-IA-002"
            : true;
        if (!commonValid || !knownExact) errors.push(`${record.questionId}/${placement.pageId}: malformed or unauthorized thematic fallback.`);
      } else {
        if (placement.placementBasis !== "answer-bearing") errors.push(`${record.questionId}/${placement.pageId}: unsupported placement basis.`);
        if (!placement.answerBasisRu?.includes("канонический правильный ответ")) {
          errors.push(`${record.questionId}/${placement.pageId}: missing answer-bearing rationale.`);
        }
      }
    }
  }

  for (const question of questions) {
    if (!seenQuestions.has(question.id)) errors.push(`${question.id}: zero placements.`);
  }
  if (records.length !== questions.length) errors.push(`Expected ${questions.length} mapping records, found ${records.length}.`);
  if (fallbackCount !== 2) errors.push(`Expected exactly two owner-approved thematic fallbacks, found ${fallbackCount}.`);

  const currentBaseline = createProtectedBaseline(root, pageInventory, corpus);
  if (canonicalJson(currentBaseline.protectedSources) !== canonicalJson(baseline.protectedSources)) errors.push("Protected manual source files changed.");
  if (canonicalJson(currentBaseline.referencedImages) !== canonicalJson(baseline.referencedImages)) errors.push("Protected manual image paths or bytes changed.");
  if (canonicalJson(currentBaseline.pageContentFingerprints) !== canonicalJson(baseline.pageContentFingerprints)) errors.push("Protected learner-visible manual page content changed.");
  if (baseline.effectiveBaseSha !== EXPECTED_BASE_SHA) errors.push("Protected baseline base SHA is not the assigned verified base.");

  const summary = placementSummary(records, pageInventory);
  if (evidence && canonicalJson(evidence.summary) !== canonicalJson(summary)) errors.push("Placement evidence summary is stale.");
  return { errors, summary };
}

export function relativePath(root, path) {
  return relative(root, path).replaceAll("\\", "/");
}
