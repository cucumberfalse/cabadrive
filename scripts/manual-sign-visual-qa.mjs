#!/usr/bin/env node

import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const repoRoot = process.cwd();
const inventoryPath = "src/data/manual-signs/app4SignEntries.json";
const evidenceRoot = "specs/037-manual-sign-crop-resolution/evidence";
const contactSheetDir = `${evidenceRoot}/contact-sheets`;
const screenshotDir = `${evidenceRoot}/screenshots`;
const contactSheetHtmlPath = `${contactSheetDir}/manual-sign-contact-sheets.html`;
const visualQaSummaryPath = `${screenshotDir}/visual-qa-summary.json`;
const sections = [
  "app4-signs-regulatory",
  "app4-signs-warning",
  "app4-signs-informational",
  "app4-signs-temporary",
  "app4-signs-horizontal",
  "app4-signs-traffic-lights"
];

function repoPath(path) {
  return join(repoRoot, path);
}

function readJson(path) {
  return JSON.parse(readFileSync(repoPath(path), "utf8"));
}

function htmlEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fileUrl(path) {
  return pathToFileURL(resolve(repoRoot, path)).href;
}

function signLike(entry) {
  return entry.entryKind === "catalog-entry" || entry.entryKind === "contextual-visual";
}

function writeContactSheetHtml(inventory) {
  mkdirSync(repoPath(contactSheetDir), { recursive: true });
  const bySection = new Map(sections.map((sectionId) => [sectionId, inventory.entries.filter((entry) => entry.sectionId === sectionId)]));
  const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>Feature 037 Manual Sign Contact Sheets</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, sans-serif; color: #263532; background: #f6faf9; }
    .section { padding: 24px; break-after: page; }
    h1, h2, h3, p { margin: 0; }
    .section > header { display: grid; gap: 6px; margin-bottom: 18px; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .card { display: grid; gap: 8px; align-content: start; min-width: 0; min-height: 188px; padding: 10px; border: 1px solid #d8e6e6; border-radius: 8px; background: #fff; }
    .heading { min-height: 120px; background: #eef8f7; }
    .imageWrap { display: grid; place-items: center; min-height: 108px; overflow: hidden; background: #fff; }
    img { display: block; max-width: 100%; max-height: 180px; width: auto; height: auto; object-fit: contain; }
    .meta, .caption { display: grid; gap: 3px; min-width: 0; font-size: 11px; line-height: 1.25; overflow-wrap: anywhere; }
    .caption strong { font-size: 12px; }
    .status { color: #1b6680; font-weight: 700; }
  </style>
</head>
<body>
${sections.map((sectionId) => {
  const entries = bySection.get(sectionId) ?? [];
  const signCount = entries.filter(signLike).length;
  const headingCount = entries.length - signCount;
  return `<section class="section" data-section-id="${sectionId}">
  <header>
    <h2>${htmlEscape(sectionId)}</h2>
    <p>${entries.length} rows · ${signCount} sign-like · ${headingCount} DOM headings</p>
  </header>
  <div class="grid">
    ${entries.map((entry) => {
      const caption = entry.variant ? `${entry.spanishLabel} (${entry.variant})` : entry.spanishLabel;
      const image = signLike(entry)
        ? `<div class="imageWrap"><img src="${fileUrl(entry.assetPath)}" alt="${htmlEscape(caption)}" width="${entry.naturalWidth}" height="${entry.naturalHeight}" data-render-mode="${entry.renderMode}" data-no-upscale="true"></div>`
        : `<div class="imageWrap"><strong>DOM heading</strong></div>`;
      return `<article class="card ${entry.renderMode === "category-heading-dom" ? "heading" : ""}" data-entry-id="${entry.id}" data-render-mode="${entry.renderMode}" data-three-x-status="${entry.threeXStatus ?? ""}">
        ${image}
        <div class="caption">
          <strong lang="es">${htmlEscape(caption)}</strong>
          <span lang="ru">${htmlEscape(entry.russianTranslation)}</span>
        </div>
        <div class="meta">
          <span>${htmlEscape(entry.id)}</span>
          <span>p${entry.sourcePage} #${entry.sourceOrderWithinPage}</span>
          <span>${entry.baselineCropNaturalWidth ?? "-"}x${entry.baselineCropNaturalHeight ?? "-"} -> ${entry.naturalWidth ?? "-"}x${entry.naturalHeight ?? "-"}</span>
          <span class="status">${htmlEscape(entry.threeXStatus ?? entry.renderMode)}</span>
          <span>${htmlEscape(entry.cropAuditStatus ?? entry.auditStatus)}</span>
        </div>
      </article>`;
    }).join("\n")}
  </div>
</section>`;
}).join("\n")}
</body>
</html>`;
  writeFileSync(repoPath(contactSheetHtmlPath), html);
}

async function collectQa(page, rootSelector) {
  return page.locator(rootSelector).evaluate((root) => {
    const images = Array.from(root.querySelectorAll("img"));
    const qaImages = images.filter((image) => image.dataset.renderMode || image.closest("[data-entry-id]") || image.closest(".manual-sign-card"));
    const cards = Array.from(root.querySelectorAll("[data-entry-id], .manual-sign-card"));
    const captions = Array.from(root.querySelectorAll(".manual-sign-caption, .caption"));
    return {
      imageCount: qaImages.length,
      unloadedImages: qaImages.filter((image) => !image.complete || image.naturalWidth === 0 || image.naturalHeight === 0).length,
      noUpscaleViolations: qaImages.filter((image) => {
        if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) return false;
        const rect = image.getBoundingClientRect();
        return rect.width > image.naturalWidth + 0.5 || rect.height > image.naturalHeight + 0.5;
      }).length,
      overflowCount: cards.filter((card) => card.scrollWidth > card.clientWidth + 1 || card.scrollHeight > card.clientHeight + 1).length,
      captionGapCount: captions.filter((caption) => !caption.textContent?.trim()).length,
      oldRenderModeCount: cards.filter((card) => card.getAttribute("data-render-mode") === "source-image-css-clip").length
    };
  });
}

async function forceLoadQaImages(locator) {
  await locator.evaluate(async (root) => {
    const images = Array.from(root.querySelectorAll("img")).filter(
      (image) => image.dataset.renderMode || image.closest("[data-entry-id]") || image.closest(".manual-sign-card")
    );
    for (const image of images) {
      image.loading = "eager";
    }
    await Promise.all(
      images.map(
        (image) =>
          image.complete && image.naturalWidth > 0
            ? Promise.resolve()
            : new Promise((resolve) => {
                const done = () => resolve();
                image.addEventListener("load", done, { once: true });
                image.addEventListener("error", done, { once: true });
              })
      )
    );
  });
}

async function screenshotContactSheets(browser, inventory) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(repoPath(contactSheetHtmlPath)).href);
  const results = {};
  for (const sectionId of sections) {
    const locator = page.locator(`[data-section-id="${sectionId}"]`);
    await forceLoadQaImages(locator);
    await locator.screenshot({ path: repoPath(`${contactSheetDir}/${sectionId}.png`) });
    results[sectionId] = {
      expectedRows: inventory.entries.filter((entry) => entry.sectionId === sectionId).length,
      screenshotPath: `${contactSheetDir}/${sectionId}.png`,
      ...(await collectQa(page, `[data-section-id="${sectionId}"]`))
    };
  }
  await page.close();
  return results;
}

async function screenshotRuntime(browser, runtimeUrl) {
  if (!runtimeUrl) return null;
  const results = {};
  for (const viewport of [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "mobile", width: 390, height: 844 }
  ]) {
    results[viewport.name] = {};
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
    await page.goto(runtimeUrl, { waitUntil: "networkidle" });
    await page.getByTestId("pandemia-nav-entry").click();
    for (const sectionId of sections) {
      await page.getByTestId(`manual-guide-pending-section-${sectionId}`).click();
      const section = page.locator(`[data-testid="manual-guide-section"][data-manual-section-id="${sectionId}"]`);
      await section.waitFor({ state: "visible" });
      await forceLoadQaImages(section);
      await section.screenshot({ path: repoPath(`${screenshotDir}/${viewport.name}-${sectionId}.png`) });
      results[viewport.name][sectionId] = {
        screenshotPath: `${screenshotDir}/${viewport.name}-${sectionId}.png`,
        ...(await collectQa(page, `[data-testid="manual-guide-section"][data-manual-section-id="${sectionId}"]`))
      };
    }
    await page.close();
  }
  return results;
}

async function main() {
  const runtimeUrlArgIndex = process.argv.indexOf("--runtime-url");
  const runtimeUrl = runtimeUrlArgIndex >= 0 ? process.argv[runtimeUrlArgIndex + 1] : null;
  const inventory = readJson(inventoryPath);
  mkdirSync(repoPath(contactSheetDir), { recursive: true });
  mkdirSync(repoPath(screenshotDir), { recursive: true });
  writeContactSheetHtml(inventory);

  const browser = await chromium.launch();
  try {
    const contactSheets = await screenshotContactSheets(browser, inventory);
    const runtime = await screenshotRuntime(browser, runtimeUrl);
    const summary = {
      schemaVersion: 1,
      featureId: "037-manual-sign-crop-resolution",
      generatedBy: "scripts/manual-sign-visual-qa.mjs",
      generatedAt: new Date().toISOString(),
      inventoryPath,
      contactSheetHtmlPath,
      sections,
      entryCounts: {
        total: inventory.entries.length,
        signLike: inventory.entries.filter(signLike).length,
        categoryHeading: inventory.entries.filter((entry) => entry.entryKind === "category-heading").length,
        bySection: Object.fromEntries(sections.map((sectionId) => [sectionId, inventory.entries.filter((entry) => entry.sectionId === sectionId).length]))
      },
      contactSheets,
      runtime,
      pendingAuditCount: inventory.entries.filter((entry) => entry.cropAuditStatus !== "reviewed-final-correct" && entry.cropAuditStatus !== "category-heading-dom").length,
      renderModeViolations: inventory.entries.filter((entry) => signLike(entry) && entry.renderMode !== "individual-source-crop-3x").length,
      noUpscaleViolationsInInventory: inventory.entries.filter((entry) => signLike(entry) && entry.noUpscaleProof?.passes !== true).length
    };
    writeFileSync(repoPath(visualQaSummaryPath), `${JSON.stringify(summary, null, 2)}\n`);
    console.log(`manual sign visual QA wrote ${visualQaSummaryPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
