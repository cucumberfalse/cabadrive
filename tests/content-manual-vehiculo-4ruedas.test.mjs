import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  buildManualLayoutManifest,
  buildManualManifest,
  buildManualNavigationManifest,
  formatManualValidationSummary,
  validateManualVehiculo4RuedasRu,
} from "../scripts/content-manual-vehiculo-4ruedas.mjs";

const manifest = JSON.parse(
  readFileSync("content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json", "utf8"),
);
const layout = JSON.parse(
  readFileSync("content/manuals/gcba-manual-vehiculo-4-ruedas-2023/layout.ru.json", "utf8"),
);
const navigation = JSON.parse(
  readFileSync("content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json", "utf8"),
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isFullPageBounds(bounds) {
  return (
    bounds.x <= 0.01 &&
    bounds.y <= 0.01 &&
    bounds.x + bounds.width >= 0.99 &&
    bounds.y + bounds.height >= 0.99
  );
}

function exactStartEntryForPage(entries, pageNumber) {
  for (const entry of entries) {
    if (pageNumber < entry.startPage || pageNumber > entry.endPage) continue;
    const childExactStart = exactStartEntryForPage(entry.children ?? [], pageNumber);
    if (childExactStart) return childExactStart;
    if (entry.startPage === pageNumber) return entry;
  }
  return undefined;
}

function findNavigationEntryById(entries, entryId) {
  for (const entry of entries) {
    if (entry.id === entryId) return entry;
    const child = findNavigationEntryById(entry.children ?? [], entryId);
    if (child) return child;
  }
  return undefined;
}

function pickRange(entry) {
  assert.ok(entry, "navigation entry exists");
  return { startPage: entry.startPage, endPage: entry.endPage };
}

function flattenNavigationEntries(entries) {
  return entries.flatMap((entry) => [entry, ...flattenNavigationEntries(entry.children ?? [])]);
}

function normalizeSearchText(value) {
  return value
    .toLocaleLowerCase("ru")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function manualPageSearchText(page) {
  return normalizeSearchText(
    [
      page.pageNumber,
      page.translation.headingRu,
      page.translation.officialLabel,
      page.translation.fullTranslationRu,
      page.translation.sourceTextEs,
      page.translation.headingPathEs.join(" "),
      page.translation.chunkProvenance?.chunkId ?? "",
      page.sourceTrace.officialDocumentId,
    ].join(" "),
  );
}

function buildManualSearchIndexEntries() {
  const navigationEntries = flattenNavigationEntries(navigation.entries);
  const semanticEntriesByStartPage = new Map();
  for (const entry of navigationEntries) {
    if (entry.level !== "topic") continue;
    semanticEntriesByStartPage.set(entry.startPage, [
      ...(semanticEntriesByStartPage.get(entry.startPage) ?? []),
      entry,
    ]);
  }

  return manifest.pages.flatMap((page) => {
    const exactStartEntries = semanticEntriesByStartPage.get(page.pageNumber) ?? [];
    const semanticResults = exactStartEntries.map((section) => ({
      page,
      section,
      resultId: `section-${section.id}`,
      searchText: normalizeSearchText(
        [manualPageSearchText(page), section.id, section.titleRu, section.titleEs ?? ""].join(" "),
      ),
    }));
    if (semanticResults.length) return semanticResults;
    return {
      page,
      resultId: `page-${page.pageNumber}`,
      searchText: manualPageSearchText(page),
    };
  });
}

function uniqueManualMatchingPages(entries) {
  const seenPageNumbers = new Set();
  return entries.flatMap((entry) => {
    if (seenPageNumbers.has(entry.page.pageNumber)) return [];
    seenPageNumbers.add(entry.page.pageNumber);
    return [entry.page];
  });
}

function destinationEntryForPage(entries, pageNumber, { requestedEntry, currentEntry } = {}) {
  if (requestedEntry && pageNumberIsCoveredByEntry(pageNumber, requestedEntry))
    return requestedEntry;

  const exactStartEntry = exactStartEntryForPage(entries, pageNumber);
  if (currentEntry && pageNumberIsCoveredByEntry(pageNumber, currentEntry)) {
    return currentEntry.startPage === pageNumber ? currentEntry : (exactStartEntry ?? currentEntry);
  }

  return exactStartEntry ?? entries.find((entry) => pageNumberIsCoveredByEntry(pageNumber, entry));
}

test("manual 4 ruedas validator passes current manifest and reports complete coverage", async () => {
  const output = execFileSync("node", ["scripts/content-manual-vehiculo-4ruedas.mjs"], {
    encoding: "utf8",
  });
  const result = await validateManualVehiculo4RuedasRu();

  assert.deepEqual(result.errors, []);
  assert.equal(output.trim(), formatManualValidationSummary(result.summary));
  assert.deepEqual(result.summary, {
    pages: 200,
    sourcePdfPages: 200,
    layoutPages: 200,
    navigationEntries: 11,
    navigationTopics: 56,
    reusedApprovedChunkPages: 198,
    manualVisualTextPages: 2,
    localVisualAssets: 200,
    assetDirectory: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages",
  });
});

test("manual 4 ruedas generated manifest is stable against committed assets and translations", () => {
  assert.deepEqual(buildManualManifest(), manifest);
  assert.deepEqual(buildManualLayoutManifest(manifest), layout);
  assert.deepEqual(buildManualNavigationManifest(manifest), navigation);
});

test("manual 4 ruedas front-matter navigation keeps source-backed page ranges", () => {
  const expectedFrontMatterRanges = new Map([
    ["front-title", { startPage: 1, endPage: 1 }],
    ["front-presentation", { startPage: 2, endPage: 2 }],
    ["front-categories", { startPage: 3, endPage: 4 }],
    ["front-glossary", { startPage: 5, endPage: 11 }],
    ["front-index", { startPage: 12, endPage: 13 }],
  ]);
  const generatedNavigation = buildManualNavigationManifest(manifest);

  for (const [entryId, expectedRange] of expectedFrontMatterRanges) {
    assert.deepEqual(
      pickRange(findNavigationEntryById(generatedNavigation.entries, entryId)),
      expectedRange,
      `generated ${entryId} range follows front-matter source evidence`,
    );
    assert.deepEqual(
      pickRange(findNavigationEntryById(navigation.entries, entryId)),
      expectedRange,
      `committed ${entryId} range follows front-matter source evidence`,
    );
  }
});

test("manual 4 ruedas view lazy-loads the full layout corpus and computes summary after validation", () => {
  const appSource = readFileSync("src/App.tsx", "utf8");
  const componentStart = appSource.indexOf("function Manual4RuedasView()");
  const topLevelRuntimeManualImport =
    /^import\s+(?!type\b)[^;]+from\s+["']\.\/data\/manual4Ruedas["'];/mu;
  const dynamicImportIndex = appSource.indexOf('import("./data/manual4Ruedas")', componentStart);
  const validationIndex = appSource.indexOf("assertManualLayoutRuntimeShape(", dynamicImportIndex);
  const summaryIndex = appSource.indexOf("manualManifestSummary(manifest)", validationIndex);
  const loadingIndex = appSource.indexOf('data-testid="manual-loading"', componentStart);

  assert.notEqual(componentStart, -1);
  assert.equal(topLevelRuntimeManualImport.test(appSource), false);
  assert.notEqual(dynamicImportIndex, -1);
  assert.notEqual(validationIndex, -1);
  assert.notEqual(summaryIndex, -1);
  assert.notEqual(loadingIndex, -1);
  assert.equal(appSource.includes("manual-russian-page-flow"), false);
  assert.ok(appSource.includes("manualBoundsStyle(block.bounds)"));
  assert.ok(appSource.includes('data-testid="manual-layout-block"'));
  assert.ok(appSource.includes("selectedNavigationEntryId"));
  assert.ok(appSource.includes("manualNavigationEntryCoversPage"));
  assert.ok(appSource.includes("selectManualPage(entry.startPage, { entryId: entry.id })"));
});

test("manual 4 ruedas view caches normalized page search text outside the filter loop", () => {
  const appSource = readFileSync("src/App.tsx", "utf8");
  const componentStart = appSource.indexOf("function Manual4RuedasView()");
  const componentEnd = appSource.indexOf("function PrimarySourcesView()", componentStart);
  const componentSource = appSource.slice(componentStart, componentEnd);
  const indexStart = componentSource.indexOf(
    "const manualSearchIndex = useMemo<ManualSearchIndexEntry[]>",
  );
  const matchingStart = componentSource.indexOf("const matchingEntries = ");
  const matchingStatement = componentSource.slice(
    matchingStart,
    componentSource.indexOf(";", matchingStart) + 1,
  );

  assert.notEqual(componentStart, -1);
  assert.notEqual(componentEnd, -1);
  assert.notEqual(indexStart, -1);
  assert.match(componentSource.slice(indexStart, matchingStart), /manualPageSearchText\(page\)/);
  assert.match(matchingStatement, /manualSearchIndex\.filter/);
  assert.equal(matchingStatement.includes("manualPageSearchText("), false);
});

test("manual 4 ruedas search index preserves same-page semantic entry identity", () => {
  const appSource = readFileSync("src/App.tsx", "utf8");
  const componentStart = appSource.indexOf("function Manual4RuedasView()");
  const componentEnd = appSource.indexOf("function PrimarySourcesView()", componentStart);
  const componentSource = appSource.slice(componentStart, componentEnd);
  const navigationEntries = flattenNavigationEntries(navigation.entries);
  const page100 = manifest.pages.find((page) => page.pageNumber === 100);
  const samePageTopics = navigationEntries.filter(
    (entry) => entry.level === "topic" && entry.startPage === 100,
  );
  const searchIndexEntries = samePageTopics.map((section) => ({
    page: page100,
    section,
    resultId: `section-${section.id}`,
    searchText: normalizeSearchText(
      [manualPageSearchText(page100), section.id, section.titleRu, section.titleEs ?? ""].join(" "),
    ),
  }));
  const genderResult = searchIndexEntries.filter((entry) =>
    entry.searchText.includes(normalizeSearchText("ch5-gender-violence-prevention")),
  );

  assert.deepEqual(
    samePageTopics.map((entry) => entry.id),
    ["ch5-equal-society", "ch5-gender-violence-prevention"],
  );
  assert.equal(genderResult.length, 1);
  assert.equal(genderResult[0].page.pageNumber, 100);
  assert.equal(genderResult[0].section.id, "ch5-gender-violence-prevention");
  assert.notEqual(genderResult[0].section.id, "ch5-equal-society");
  assert.match(componentSource, /semanticEntriesByStartPage/);
  assert.match(componentSource, /section\.id/);
  assert.match(
    componentSource,
    /selectManualPage\(page\.pageNumber, \{ entryId: section\?\.id \}\)/,
  );
  assert.match(componentSource, /data-result-entry-id=\{section\?\.id \?\? ""\}/);
  assert.match(componentSource, /data-search-result-id=\{resultId\}/);
});

test("manual 4 ruedas page-number search deduplicates matching pages while preserving same-page topic rows", () => {
  const appSource = readFileSync("src/App.tsx", "utf8");
  const componentStart = appSource.indexOf("function Manual4RuedasView()");
  const componentEnd = appSource.indexOf("function PrimarySourcesView()", componentStart);
  const componentSource = appSource.slice(componentStart, componentEnd);
  const searchIndexEntries = buildManualSearchIndexEntries();
  const query = normalizeSearchText("100");
  const queryPageNumber = /^\d+$/u.test(query) ? Number(query) : undefined;
  const matchingEntries = searchIndexEntries.filter((entry) =>
    queryPageNumber === undefined
      ? entry.searchText.includes(query)
      : entry.page.pageNumber === queryPageNumber,
  );
  const matchingPages = uniqueManualMatchingPages(matchingEntries);
  const selectedPageIndex = matchingPages.findIndex((page) => page.pageNumber === 100);

  assert.equal(queryPageNumber, 100);
  assert.deepEqual(
    matchingEntries.map((entry) => entry.section?.id),
    ["ch5-equal-society", "ch5-gender-violence-prevention"],
  );
  assert.deepEqual(
    matchingEntries.map((entry) => entry.resultId),
    ["section-ch5-equal-society", "section-ch5-gender-violence-prevention"],
  );
  assert.equal(matchingPages.length, 1);
  assert.equal(matchingPages[0].pageNumber, 100);
  assert.equal(selectedPageIndex, 0);
  assert.equal(matchingPages[selectedPageIndex - 1], undefined);
  assert.equal(matchingPages[selectedPageIndex + 1], undefined);
  assert.match(
    componentSource,
    /const queryPageNumber = query \? manualQueryPageNumber\(query\) : undefined/,
  );
  assert.match(componentSource, /uniqueManualMatchingPages\(matchingEntries\)/);
  assert.doesNotMatch(componentSource, /matchingEntries\.map\(\(entry\) => entry\.page\)/);
});

test("manual 4 ruedas page-only semantic lookup prefers exact topic starts before covering ranges", () => {
  const appSource = readFileSync("src/App.tsx", "utf8");
  const lookupStart = appSource.indexOf("function manualNavigationEntryForPage");
  const lookupEnd = appSource.indexOf("function manualNavigationEntryCoversPage", lookupStart);
  const lookupSource = appSource.slice(lookupStart, lookupEnd);
  const exactStartIndex = lookupSource.indexOf(
    "manualExactStartNavigationEntryForPage(entries, pageNumber)",
  );
  const coveringFallbackIndex = lookupSource.indexOf("for (const entry of entries)");
  const chapter4Topics = navigation.entries.find(
    (entry) => entry.id === "chapter-4-natural-capacity",
  ).children;

  assert.notEqual(lookupStart, -1);
  assert.notEqual(lookupEnd, -1);
  assert.notEqual(exactStartIndex, -1);
  assert.notEqual(coveringFallbackIndex, -1);
  assert.ok(exactStartIndex < coveringFallbackIndex);
  assert.equal(
    chapter4Topics.find((entry) => pageNumberIsCoveredByEntry(94, entry)).id,
    "ch4-sleep-fatigue",
  );
  assert.equal(exactStartEntryForPage(navigation.entries, 94).id, "ch4-stress");
});

test("manual 4 ruedas previous-next transition prefers exact-start destination before preserving covering entry", () => {
  const appSource = readFileSync("src/App.tsx", "utf8");
  const resolverStart = appSource.indexOf("function manualNavigationEntryForDestinationPage");
  const resolverEnd = appSource.indexOf("function manualBoundsStyle", resolverStart);
  const resolverSource = appSource.slice(resolverStart, resolverEnd);
  const exactStartIndex = resolverSource.indexOf(
    "manualExactStartNavigationEntryForPage(entries, pageNumber)",
  );
  const currentCoverIndex = resolverSource.indexOf(
    "manualNavigationEntryCoversPage(options.currentEntry, pageNumber)",
  );
  const selectStart = appSource.indexOf("function selectManualPage");
  const selectEnd = appSource.indexOf("function selectManualEntry", selectStart);
  const selectSource = appSource.slice(selectStart, selectEnd);
  const sleepFatigue = findNavigationEntryById(navigation.entries, "ch4-sleep-fatigue");
  const stress = findNavigationEntryById(navigation.entries, "ch4-stress");
  const nextDestination = destinationEntryForPage(navigation.entries, 94, {
    currentEntry: sleepFatigue,
  });

  assert.notEqual(resolverStart, -1);
  assert.notEqual(resolverEnd, -1);
  assert.notEqual(exactStartIndex, -1);
  assert.notEqual(currentCoverIndex, -1);
  assert.ok(exactStartIndex < currentCoverIndex);
  assert.match(
    selectSource,
    /manualNavigationEntryForDestinationPage\(\s*manualNavigation\.entries,\s*pageNumber,\s*\{\s*requestedEntry,\s*currentEntry\s*\},?\s*\)/,
  );
  assert.equal(pageNumberIsCoveredByEntry(93, sleepFatigue), true);
  assert.equal(pageNumberIsCoveredByEntry(94, sleepFatigue), true);
  assert.equal(sleepFatigue.startPage, 93);
  assert.equal(stress.startPage, 94);
  assert.equal(nextDestination.id, "ch4-stress");
});

function pageNumberIsCoveredByEntry(pageNumber, entry) {
  return pageNumber >= entry.startPage && pageNumber <= entry.endPage;
}

test("manual 4 ruedas manifest records complete local source, asset, and translation coverage", () => {
  assert.equal(manifest.schema, "cabadrive-manual-ru.v1");
  assert.equal(
    manifest.source.rawOriginalSha256,
    "69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e",
  );
  assert.equal(manifest.source.pageCount, 200);
  assert.equal(manifest.pages.length, 200);
  assert.equal(manifest.translationCoverage.omittedPages, 0);
  assert.equal(
    manifest.pages.filter((page) => page.translation.status === "reused_primary_source_chunk")
      .length,
    198,
  );
  assert.equal(
    manifest.pages.filter((page) => page.translation.status === "manual_visual_text").length,
    2,
  );

  for (const [index, page] of manifest.pages.entries()) {
    const pageNumber = index + 1;
    assert.equal(page.pageNumber, pageNumber);
    assert.equal(page.sourcePageNumber, pageNumber);
    assert.match(
      page.visualAsset.localPath,
      /^content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/pages\/page-\d{3}\.jpg$/,
    );
    assert.equal(page.visualAsset.width, 1191);
    assert.equal(page.visualAsset.height, 1684);
    assert.match(page.visualAsset.sha256, /^[a-f0-9]{64}$/);
    assert.equal(page.translation.exactCoverage, true);
    assert.ok(page.translation.sourceTextEs.trim(), `page ${pageNumber} source text is present`);
    assert.ok(
      page.translation.fullTranslationRu.trim(),
      `page ${pageNumber} Russian translation is present`,
    );
  }
});

test("manual 4 ruedas layout and navigation cover all pages and source-derived sections", () => {
  assert.equal(layout.schema, "cabadrive-manual-layout-ru.v1");
  assert.equal(layout.pages.length, 200);
  assert.equal(layout.coverage.pages, 200);
  assert.ok(layout.coverage.blockTypes.heading > 0);
  assert.ok(layout.coverage.blockTypes.body > 0);
  assert.ok(layout.coverage.blockTypes.label > 0);
  assert.ok(layout.coverage.blockTypes.footnote > 0);
  const page14 = layout.pages[13];
  assert.equal(
    page14.blocks.every((block) => block.typography.fit === "absolute-fit"),
    true,
  );
  assert.equal(
    page14.textRegions.every((region) => region.fit === "absolute-positioned-blocks"),
    true,
  );
  assert.equal(
    page14.visualRegions.some((region) => isFullPageBounds(region.bounds)),
    false,
  );
  assert.ok(page14.masks.every((mask) => mask.sourceGeometry === "source_page_text_region"));
  assert.ok(
    page14.masks.every((mask) => mask.provenance?.method === "structured_source_text_region"),
  );

  const page114 = layout.pages[113];
  assert.ok(page114.blocks.length > 20);
  assert.ok(page114.masks.length >= page114.blocks.length);
  assert.ok(
    page114.blocks.some((block) => block.bounds.x > 0.5),
    "page 114 uses a second column instead of one transcript rail",
  );
  assert.ok(
    new Set(
      page114.blocks.map(
        (block) =>
          `${block.bounds.x}:${block.bounds.y}:${block.bounds.width}:${block.bounds.height}`,
      ),
    ).size >
      page114.blocks.length * 0.8,
  );
  assert.equal(
    page114.visualRegions.some((region) => isFullPageBounds(region.bounds)),
    false,
  );
  assert.ok(page114.masks.some((mask) => mask.role === "source-list"));
  assert.ok(page114.masks.some((mask) => mask.role === "source-footnote"));
  assert.ok(page114.masks.every((mask) => mask.sourceGeometry === "source_page_text_region"));
  assert.ok(
    page114.masks.every((mask) => mask.provenance?.method === "structured_source_text_region"),
  );
  assert.ok(page114.masks.every((mask) => typeof mask.provenance?.sourceLineStart === "number"));
  assert.ok(page114.masks.every((mask) => typeof mask.provenance?.sourceTextSha256 === "string"));
  assert.ok(page114.masks.some((mask) => mask.sourceTextEs.includes("Airbag")));

  for (const pageNumber of [24, 75, 82, 125, 144]) {
    const nonAppendixPage = layout.pages[pageNumber - 1];
    assert.ok(
      nonAppendixPage.masks.every((mask) => mask.sourceGeometry?.startsWith("source_page_")),
      `page ${pageNumber} masks use source geometry`,
    );
    assert.ok(
      nonAppendixPage.masks.every(
        (mask) => mask.provenance?.method === "structured_source_text_region",
      ),
      `page ${pageNumber} masks record structured source provenance`,
    );
    assert.ok(
      nonAppendixPage.masks.every((mask) => typeof mask.provenance?.sourceLineStart === "number"),
      `page ${pageNumber} masks record source lines`,
    );
  }

  const page185 = layout.pages[184];
  assert.ok(
    page185.masks.some(
      (mask) => mask.role === "source-heading" && mask.sourceTextEs === "Reglamentarias",
    ),
  );
  assert.ok(
    page185.masks.some(
      (mask) => mask.role === "source-heading" && mask.sourceTextEs === "De prohibición",
    ),
  );
  assert.ok(page185.masks.filter((mask) => mask.role === "sign-caption").length >= 5);
  assert.ok(
    page185.masks.every(
      (mask) =>
        mask.sourceGeometry === "source_page_text_region" ||
        mask.sourceGeometry === "source_page_caption_region",
    ),
  );
  assert.ok(
    page185.masks.some(
      (mask) => mask.role === "sign-caption" && mask.bounds.y > 0.35 && mask.bounds.y < 0.39,
    ),
  );
  assert.ok(
    page185.masks.some(
      (mask) => mask.role === "sign-caption" && mask.bounds.y > 0.52 && mask.bounds.y < 0.55,
    ),
  );
  assert.ok(
    page185.masks.some(
      (mask) => mask.role === "sign-caption" && mask.bounds.y > 0.67 && mask.bounds.y < 0.7,
    ),
  );
  assert.equal(page185.blocks.find((block) => block.textRu === "Регулирующие").bounds.y, 0.279);
  assert.equal(page185.blocks.find((block) => block.textRu === "Запрещающие").bounds.y, 0.31);

  for (const pageNumber of [186, 187, 193, 197]) {
    const appendixPage = layout.pages[pageNumber - 1];
    assert.ok(
      appendixPage.masks.some((mask) => mask.role === "source-heading"),
      `page ${pageNumber} masks source headings`,
    );
    assert.ok(
      appendixPage.masks.some(
        (mask) => mask.role === "sign-caption" || mask.role === "instructional-text",
      ),
      `page ${pageNumber} masks source captions/instructional labels`,
    );
    assert.ok(
      appendixPage.masks.every(
        (mask) => mask.provenance?.method === "curated_source_page_geometry",
      ),
      `page ${pageNumber} masks record curated source geometry provenance`,
    );
  }

  assert.equal(navigation.schema, "cabadrive-manual-navigation-ru.v1");
  assert.equal(navigation.entries.length, 11);
  assert.equal(navigation.entries[0].startPage, 1);
  assert.equal(navigation.entries.at(-1).endPage, 200);

  const topLevelIds = navigation.entries.map((entry) => entry.id);
  assert.deepEqual(topLevelIds, [
    "front-matter",
    "introduction",
    "chapter-1-sustainable-mobility",
    "chapter-2-responsibility",
    "chapter-3-driving-rules",
    "chapter-4-natural-capacity",
    "chapter-5-driving-behavior",
    "appendix-1-private-cars",
    "appendix-2-passenger-transport",
    "appendix-3-cargo",
    "appendix-4-road-signs",
  ]);
  assert.equal(
    navigation.entries.find((entry) => entry.id === "appendix-2-passenger-transport").startPage,
    123,
  );
  assert.equal(
    navigation.entries
      .find((entry) => entry.id === "appendix-2-passenger-transport")
      .children.find((entry) => entry.id === "app2-social-responsibility").startPage,
    124,
  );
  const appendix2Topics = navigation.entries.find(
    (entry) => entry.id === "appendix-2-passenger-transport",
  ).children;
  assert.equal(appendix2Topics.find((entry) => entry.id === "app2-safe-driving").endPage, 148);
  assert.equal(
    appendix2Topics.find((entry) => entry.id === "app2-highways-hospitals").startPage,
    149,
  );
  assert.ok(
    navigation.entries
      .flatMap((entry) => entry.children ?? [])
      .some((entry) => entry.id === "app4-signs-regulatory"),
  );
  const chapter4Topics = navigation.entries.find(
    (entry) => entry.id === "chapter-4-natural-capacity",
  ).children;
  assert.equal(chapter4Topics.find((entry) => entry.id === "ch4-sleep-fatigue").endPage, 94);
  assert.equal(chapter4Topics.find((entry) => entry.id === "ch4-stress").startPage, 94);
  assert.equal(chapter4Topics.find((entry) => entry.id === "ch4-stress").endPage, 94);
  assert.equal(
    chapter4Topics.find((entry) => entry.id === "ch4-stress").sourceEvidence,
    "page_heading",
  );
  assert.equal(chapter4Topics.find((entry) => entry.id === "ch4-distractions").startPage, 95);
  assert.equal(
    chapter4Topics.find((entry) => entry.id === "ch4-distractions").sourceEvidence,
    "page_heading",
  );
  assert.ok(manifest.pages[93].translation.fullTranslationRu.includes("Стресс"));
  assert.ok(manifest.pages[93].translation.fullTranslationRu.includes("ВОЗ определяет"));
  assert.ok(manifest.pages[94].translation.fullTranslationRu.includes("Отвлечения"));
  assert.ok(
    manifest.pages[94].translation.fullTranslationRu.includes("Под отвлечением понимается"),
  );

  const chapter5Topics = navigation.entries.find(
    (entry) => entry.id === "chapter-5-driving-behavior",
  ).children;
  assert.equal(chapter5Topics.find((entry) => entry.id === "ch5-equal-society").startPage, 100);
  assert.equal(
    chapter5Topics.find((entry) => entry.id === "ch5-gender-violence-prevention").startPage,
    100,
  );
});

test("manual 4 ruedas validator rejects remote assets, omitted translations, and stale counters", async () => {
  const badManifest = clone(manifest);
  badManifest.pages[0].visualAsset.localPath = "https://example.test/page-001.jpg";
  badManifest.pages[1].translation.fullTranslationRu = "TODO";
  badManifest.translationCoverage.omittedPages = 1;

  const result = await validateManualVehiculo4RuedasRu({ manifest: badManifest });

  assert.ok(
    result.errors.some((error) => error.includes("Manual page 1: visualAsset.localPath must be")),
  );
  assert.ok(
    result.errors.some((error) =>
      error.includes("Manual page 1: visualAsset.localPath must be local."),
    ),
  );
  assert.ok(
    result.errors.some((error) =>
      error.includes("Manual page 2: fullTranslationRu must not contain placeholder text."),
    ),
  );
  assert.ok(result.errors.includes("Manual translationCoverage.omittedPages must be 0."));
});

test("manual 4 ruedas validator rejects missing layout coverage, text drift, and stale navigation", async () => {
  const badLayout = clone(layout);
  badLayout.pages[0].blocks = [];
  badLayout.pages[1].blocks[0].textRu = "Черновик";
  const badNavigation = clone(navigation);
  badNavigation.entries = badNavigation.entries.filter(
    (entry) => entry.id !== "appendix-4-road-signs",
  );

  const result = await validateManualVehiculo4RuedasRu({
    manifest,
    layout: badLayout,
    navigation: badNavigation,
  });

  assert.ok(
    result.errors.some((error) =>
      error.includes("page 1 must include ordered Russian layout blocks"),
    ),
  );
  assert.ok(
    result.errors.some((error) =>
      error.includes("page 2 ordered Russian blocks do not reconstruct fullTranslationRu"),
    ),
  );
  assert.ok(
    result.errors.some((error) => error.includes("top-level navigation entry count is stale")),
  );
  assert.ok(
    result.errors.some((error) =>
      error.includes("required source-index topic app4-signs-regulatory is missing"),
    ),
  );
});

test("manual 4 ruedas validator rejects stale Chapter 4 Stress and Distractions topic starts", async () => {
  const badNavigation = clone(navigation);
  const chapter4Topics = badNavigation.entries.find(
    (entry) => entry.id === "chapter-4-natural-capacity",
  ).children;
  chapter4Topics.find((entry) => entry.id === "ch4-stress").startPage = 95;
  chapter4Topics.find((entry) => entry.id === "ch4-stress").endPage = 97;
  chapter4Topics.find((entry) => entry.id === "ch4-distractions").startPage = 94;

  const result = await validateManualVehiculo4RuedasRu({
    manifest,
    layout,
    navigation: badNavigation,
  });

  assert.ok(
    result.errors.some((error) =>
      error.includes(
        "child ch4-stress must start on page 94 based on page-heading/content evidence",
      ),
    ),
  );
  assert.ok(
    result.errors.some((error) =>
      error.includes(
        'child ch4-stress start page 95 does not contain required evidence text "Стресс"',
      ),
    ),
  );
  assert.ok(
    result.errors.some((error) =>
      error.includes(
        "child ch4-distractions must start on page 95 based on page-heading/content evidence",
      ),
    ),
  );
  assert.ok(
    result.errors.some((error) =>
      error.includes(
        'child ch4-distractions start page 94 does not contain required evidence text "Отвлечения"',
      ),
    ),
  );
});

test("manual 4 ruedas validator rejects generic flow geometry and full-page visual catch-all", async () => {
  const badLayout = clone(layout);
  const page = badLayout.pages[113];
  const flowRegion = { x: 0.25, y: 0.22, width: 0.56, height: 0.58 };
  const slot = flowRegion.height / page.blocks.length;
  page.textRegions = [
    {
      id: "page-114-russian-flow",
      bounds: flowRegion,
      fit: "scale-and-scroll-if-needed",
      fontScale: 0.68,
    },
  ];
  page.masks = [
    {
      id: "page-114-source-text-mask",
      purpose: "replace_visible_source_text_with_russian_layout",
      bounds: flowRegion,
      fill: "#fffdf8",
      opacity: 0.985,
    },
  ];
  page.visualRegions = [
    {
      id: "page-114-visual-context",
      type: "page-composition",
      bounds: { x: 0, y: 0, width: 1, height: 1 },
      preservedFrom: page.visualBase.localPath,
    },
  ];
  page.blocks = page.blocks.map((block, index) => ({
    ...block,
    bounds: {
      x: flowRegion.x,
      y: Number((flowRegion.y + slot * index).toFixed(4)),
      width: flowRegion.width,
      height: Number((slot * 0.92).toFixed(4)),
    },
    typography: { ...block.typography, fit: "flow-scale" },
  }));

  const result = await validateManualVehiculo4RuedasRu({ manifest, layout: badLayout, navigation });

  assert.ok(result.errors.some((error) => error.includes("uniform synthetic flow geometry")));
  assert.ok(result.errors.some((error) => error.includes("single generic scrolling flow region")));
  assert.ok(result.errors.some((error) => error.includes("one broad source-text mask")));
  assert.ok(result.errors.some((error) => error.includes("one full-page catch-all region")));
  assert.ok(result.errors.some((error) => error.includes("typography.fit must be absolute-fit")));
});

test("manual 4 ruedas validator rejects Appendix IV masks derived from Russian destination blocks", async () => {
  const badLayout = clone(layout);
  const page = badLayout.pages[184];
  page.masks = page.blocks.map((block) => ({
    id: `bad-mask-${block.order}`,
    purpose: "replace_visible_source_text_with_russian_layout",
    role: "russian-block-replacement",
    sourceGeometry: "russian_block_replacement_region",
    bounds: block.bounds,
    fill: "#fffdf8",
    opacity: 0.985,
  }));

  const result = await validateManualVehiculo4RuedasRu({ manifest, layout: badLayout, navigation });

  assert.ok(
    result.errors.some((error) =>
      error.includes("Appendix IV masks must be based on source text/caption geometry"),
    ),
  );
  assert.ok(
    result.errors.some((error) =>
      error.includes("missing source-heading mask over source Reglamentarias heading"),
    ),
  );
  assert.ok(
    result.errors.some((error) =>
      error.includes("missing sign-caption mask over source first-row sign caption"),
    ),
  );
});

test("manual 4 ruedas validator rejects non-Appendix masks without source provenance", async () => {
  const badLayout = clone(layout);
  const page = badLayout.pages[113];
  page.masks = page.blocks.map((block) => ({
    id: `bad-non-appendix-mask-${block.order}`,
    purpose: "replace_visible_source_text_with_russian_layout",
    role: "russian-block-replacement",
    sourceGeometry: "russian_block_replacement_region",
    bounds: block.bounds,
    fill: "#fffdf8",
    opacity: 0.985,
    sourceTextEs: block.textRu,
    provenance: {
      method: "destination_russian_block_geometry",
      sourcePageNumber: page.sourcePageNumber,
      visualAssetPath: page.visualBase.localPath,
    },
  }));

  const result = await validateManualVehiculo4RuedasRu({ manifest, layout: badLayout, navigation });

  assert.ok(
    result.errors.some((error) =>
      error.includes(
        "page 114: mask bad-non-appendix-mask-1 must use source text/caption/label geometry",
      ),
    ),
  );
  assert.ok(
    result.errors.some((error) =>
      error.includes(
        "page 114: mask bad-non-appendix-mask-1 must record structured or curated source-region provenance",
      ),
    ),
  );
  assert.ok(
    result.errors.some((error) =>
      error.includes(
        "page 114: mask bad-non-appendix-mask-1 must not be derived from destination Russian block placement",
      ),
    ),
  );
  assert.ok(
    result.errors.some((error) =>
      error.includes(
        "page 114: mask bad-non-appendix-mask-1 bounds match a destination Russian block",
      ),
    ),
  );
});
