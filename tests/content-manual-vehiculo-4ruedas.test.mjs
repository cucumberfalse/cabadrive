import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  buildManualManifest,
  formatManualValidationSummary,
  validateManualVehiculo4RuedasRu
} from "../scripts/content-manual-vehiculo-4ruedas.mjs";

const manifest = JSON.parse(readFileSync("content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json", "utf8"));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test("manual 4 ruedas validator passes current manifest and reports complete coverage", async () => {
  const output = execFileSync("node", ["scripts/content-manual-vehiculo-4ruedas.mjs"], { encoding: "utf8" });
  const result = await validateManualVehiculo4RuedasRu();

  assert.deepEqual(result.errors, []);
  assert.equal(output.trim(), formatManualValidationSummary(result.summary));
  assert.deepEqual(result.summary, {
    pages: 200,
    sourcePdfPages: 200,
    reusedApprovedChunkPages: 198,
    manualVisualTextPages: 2,
    localVisualAssets: 200,
    assetDirectory: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages"
  });
});

test("manual 4 ruedas generated manifest is stable against committed assets and translations", () => {
  assert.deepEqual(buildManualManifest(), manifest);
});

test("manual 4 ruedas view lazy-loads the full corpus and computes summary after validation", () => {
  const appSource = readFileSync("src/App.tsx", "utf8");
  const componentStart = appSource.indexOf("function Manual4RuedasView()");
  const topLevelRuntimeManualImport = /^import\s+(?!type\b)[^;]+from\s+["']\.\/data\/manual4Ruedas["'];/mu;
  const dynamicImportIndex = appSource.indexOf('import("./data/manual4Ruedas")', componentStart);
  const validationIndex = appSource.indexOf("assertManualManifestRuntimeShape(manual4RuedasRu)", dynamicImportIndex);
  const summaryIndex = appSource.indexOf("manualManifestSummary(manifest)", validationIndex);
  const loadingIndex = appSource.indexOf('data-testid="manual-loading"', componentStart);

  assert.notEqual(componentStart, -1);
  assert.equal(topLevelRuntimeManualImport.test(appSource), false);
  assert.notEqual(dynamicImportIndex, -1);
  assert.notEqual(validationIndex, -1);
  assert.notEqual(summaryIndex, -1);
  assert.notEqual(loadingIndex, -1);
});

test("manual 4 ruedas view caches normalized page search text outside the filter loop", () => {
  const appSource = readFileSync("src/App.tsx", "utf8");
  const componentStart = appSource.indexOf("function Manual4RuedasView()");
  const componentEnd = appSource.indexOf("function PrimarySourcesView()", componentStart);
  const componentSource = appSource.slice(componentStart, componentEnd);
  const indexStart = componentSource.indexOf("const manualSearchIndex = useMemo<ManualSearchIndexEntry[]>");
  const matchingStart = componentSource.indexOf("const matchingPages = ");
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
