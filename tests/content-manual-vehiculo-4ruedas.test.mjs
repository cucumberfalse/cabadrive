import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  buildManualLayoutManifest,
  buildManualManifest,
  buildManualNavigationManifest,
  formatManualValidationSummary,
  validateManualVehiculo4RuedasRu
} from "../scripts/content-manual-vehiculo-4ruedas.mjs";

const manifest = JSON.parse(readFileSync("content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json", "utf8"));
const layout = JSON.parse(readFileSync("content/manuals/gcba-manual-vehiculo-4-ruedas-2023/layout.ru.json", "utf8"));
const navigation = JSON.parse(readFileSync("content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json", "utf8"));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isFullPageBounds(bounds) {
  return bounds.x <= 0.01 && bounds.y <= 0.01 && bounds.x + bounds.width >= 0.99 && bounds.y + bounds.height >= 0.99;
}

test("manual 4 ruedas validator passes current manifest and reports complete coverage", async () => {
  const output = execFileSync("node", ["scripts/content-manual-vehiculo-4ruedas.mjs"], { encoding: "utf8" });
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
    assetDirectory: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages"
  });
});

test("manual 4 ruedas generated manifest is stable against committed assets and translations", () => {
  assert.deepEqual(buildManualManifest(), manifest);
  assert.deepEqual(buildManualLayoutManifest(manifest), layout);
  assert.deepEqual(buildManualNavigationManifest(manifest), navigation);
});

test("manual 4 ruedas view lazy-loads the full layout corpus and computes summary after validation", () => {
  const appSource = readFileSync("src/App.tsx", "utf8");
  const componentStart = appSource.indexOf("function Manual4RuedasView()");
  const topLevelRuntimeManualImport = /^import\s+(?!type\b)[^;]+from\s+["']\.\/data\/manual4Ruedas["'];/mu;
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
});

test("manual 4 ruedas view caches normalized page search text outside the filter loop", () => {
  const appSource = readFileSync("src/App.tsx", "utf8");
  const componentStart = appSource.indexOf("function Manual4RuedasView()");
  const componentEnd = appSource.indexOf("function PrimarySourcesView()", componentStart);
  const componentSource = appSource.slice(componentStart, componentEnd);
  const indexStart = componentSource.indexOf("const manualSearchIndex = useMemo<ManualSearchIndexEntry[]>");
  const matchingStart = componentSource.indexOf("const matchingEntries = ");
  const matchingStatement = componentSource.slice(matchingStart, componentSource.indexOf(";", matchingStart) + 1);

  assert.notEqual(componentStart, -1);
  assert.notEqual(componentEnd, -1);
  assert.notEqual(indexStart, -1);
  assert.match(componentSource.slice(indexStart, matchingStart), /manualPageSearchText\(page\)/);
  assert.match(matchingStatement, /manualSearchIndex\.filter/);
  assert.equal(matchingStatement.includes("manualPageSearchText("), false);
});

test("manual 4 ruedas manifest records complete local source, asset, and translation coverage", () => {
  assert.equal(manifest.schema, "cabadrive-manual-ru.v1");
  assert.equal(manifest.source.rawOriginalSha256, "69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e");
  assert.equal(manifest.source.pageCount, 200);
  assert.equal(manifest.pages.length, 200);
  assert.equal(manifest.translationCoverage.omittedPages, 0);
  assert.equal(manifest.pages.filter((page) => page.translation.status === "reused_primary_source_chunk").length, 198);
  assert.equal(manifest.pages.filter((page) => page.translation.status === "manual_visual_text").length, 2);

  for (const [index, page] of manifest.pages.entries()) {
    const pageNumber = index + 1;
    assert.equal(page.pageNumber, pageNumber);
    assert.equal(page.sourcePageNumber, pageNumber);
    assert.match(page.visualAsset.localPath, /^content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/pages\/page-\d{3}\.jpg$/);
    assert.equal(page.visualAsset.width, 1191);
    assert.equal(page.visualAsset.height, 1684);
    assert.match(page.visualAsset.sha256, /^[a-f0-9]{64}$/);
    assert.equal(page.translation.exactCoverage, true);
    assert.ok(page.translation.sourceTextEs.trim(), `page ${pageNumber} source text is present`);
    assert.ok(page.translation.fullTranslationRu.trim(), `page ${pageNumber} Russian translation is present`);
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
  assert.equal(page14.blocks.every((block) => block.typography.fit === "absolute-fit"), true);
  assert.equal(page14.textRegions.every((region) => region.fit === "absolute-positioned-blocks"), true);
  assert.equal(page14.visualRegions.some((region) => isFullPageBounds(region.bounds)), false);

  const page114 = layout.pages[113];
  assert.ok(page114.blocks.length > 20);
  assert.ok(page114.masks.length >= page114.blocks.length);
  assert.ok(page114.blocks.some((block) => block.bounds.x > 0.5), "page 114 uses a second column instead of one transcript rail");
  assert.ok(new Set(page114.blocks.map((block) => `${block.bounds.x}:${block.bounds.y}:${block.bounds.width}:${block.bounds.height}`)).size > page114.blocks.length * 0.8);
  assert.equal(page114.visualRegions.some((region) => isFullPageBounds(region.bounds)), false);

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
    "appendix-4-road-signs"
  ]);
  assert.equal(navigation.entries.find((entry) => entry.id === "appendix-2-passenger-transport").startPage, 123);
  assert.ok(navigation.entries.flatMap((entry) => entry.children ?? []).some((entry) => entry.id === "app4-signs-regulatory"));
});

test("manual 4 ruedas validator rejects remote assets, omitted translations, and stale counters", async () => {
  const badManifest = clone(manifest);
  badManifest.pages[0].visualAsset.localPath = "https://example.test/page-001.jpg";
  badManifest.pages[1].translation.fullTranslationRu = "TODO";
  badManifest.translationCoverage.omittedPages = 1;

  const result = await validateManualVehiculo4RuedasRu({ manifest: badManifest });

  assert.ok(result.errors.some((error) => error.includes("Manual page 1: visualAsset.localPath must be")));
  assert.ok(result.errors.some((error) => error.includes("Manual page 1: visualAsset.localPath must be local.")));
  assert.ok(result.errors.some((error) => error.includes("Manual page 2: fullTranslationRu must not contain placeholder text.")));
  assert.ok(result.errors.includes("Manual translationCoverage.omittedPages must be 0."));
});

test("manual 4 ruedas validator rejects missing layout coverage, text drift, and stale navigation", async () => {
  const badLayout = clone(layout);
  badLayout.pages[0].blocks = [];
  badLayout.pages[1].blocks[0].textRu = "Черновик";
  const badNavigation = clone(navigation);
  badNavigation.entries = badNavigation.entries.filter((entry) => entry.id !== "appendix-4-road-signs");

  const result = await validateManualVehiculo4RuedasRu({ manifest, layout: badLayout, navigation: badNavigation });

  assert.ok(result.errors.some((error) => error.includes("page 1 must include ordered Russian layout blocks")));
  assert.ok(result.errors.some((error) => error.includes("page 2 ordered Russian blocks do not reconstruct fullTranslationRu")));
  assert.ok(result.errors.some((error) => error.includes("top-level navigation entry count is stale")));
  assert.ok(result.errors.some((error) => error.includes("required source-index topic app4-signs-regulatory is missing")));
});

test("manual 4 ruedas validator rejects generic flow geometry and full-page visual catch-all", async () => {
  const badLayout = clone(layout);
  const page = badLayout.pages[113];
  const flowRegion = { x: 0.25, y: 0.22, width: 0.56, height: 0.58 };
  const slot = flowRegion.height / page.blocks.length;
  page.textRegions = [{ id: "page-114-russian-flow", bounds: flowRegion, fit: "scale-and-scroll-if-needed", fontScale: 0.68 }];
  page.masks = [
    {
      id: "page-114-source-text-mask",
      purpose: "replace_visible_source_text_with_russian_layout",
      bounds: flowRegion,
      fill: "#fffdf8",
      opacity: 0.985
    }
  ];
  page.visualRegions = [
    {
      id: "page-114-visual-context",
      type: "page-composition",
      bounds: { x: 0, y: 0, width: 1, height: 1 },
      preservedFrom: page.visualBase.localPath
    }
  ];
  page.blocks = page.blocks.map((block, index) => ({
    ...block,
    bounds: {
      x: flowRegion.x,
      y: Number((flowRegion.y + slot * index).toFixed(4)),
      width: flowRegion.width,
      height: Number((slot * 0.92).toFixed(4))
    },
    typography: { ...block.typography, fit: "flow-scale" }
  }));

  const result = await validateManualVehiculo4RuedasRu({ manifest, layout: badLayout, navigation });

  assert.ok(result.errors.some((error) => error.includes("uniform synthetic flow geometry")));
  assert.ok(result.errors.some((error) => error.includes("single generic scrolling flow region")));
  assert.ok(result.errors.some((error) => error.includes("one broad source-text mask")));
  assert.ok(result.errors.some((error) => error.includes("one full-page catch-all region")));
  assert.ok(result.errors.some((error) => error.includes("typography.fit must be absolute-fit")));
});
