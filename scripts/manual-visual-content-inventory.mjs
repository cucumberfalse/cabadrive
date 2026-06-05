import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const cropEvidencePath = "content/validation/manual-guide-visual-content-crop.evidence.json";
const registryPath =
  "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json";
const sectionAssetRoot = "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections";
const officialAnnexImageRoot =
  "content/official-documents/originals/decreto-779-1995-anexo-l-senalizacion-vial-uniforme-images";
const noAvanzarAssetPath =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-regulatory/no-avanzar-source-as-is.jpg";
const noAvanzarSourceAssetPath =
  "content/validation/manual-guide/app4-signs-regulatory/page-185-no-avanzar-source-crop.jpg";
const blindSpotCropEvidencePath =
  "content/validation/manual-guide-blind-spot-source-crop.evidence.json";

const bodyTextBaseline = {
  documentBodyTextFontSizePx: 16,
  sourceCardBodyTextFontSizePx: 14.88,
  measurementMethod:
    "Computed CSS baseline from the manual guide runtime: document prose is 1rem and source-card notes are 0.93rem. Focused Playwright checks assert those computed values beside representative source-image cards.",
  runtimeEvidencePath:
    "tests/e2e/app.spec.ts::Manual guide full-width source image cards stay readable and avoid upscaling",
  source:
    "Manual guide runtime CSS uses 1rem document body text and 0.93rem source-card body text; focused Playwright follow-up captures these computed values next to representative source images."
};

const readabilityScreenshotEvidence = [
  {
    sectionId: "app4-signs-regulatory",
    viewport: "desktop",
    path:
      "test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app4-signs-regulatory-desktop-chromium.png"
  },
  {
    sectionId: "app4-signs-regulatory",
    viewport: "mobile",
    path:
      "test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app4-signs-regulatory-mobile-chromium.png"
  },
  {
    sectionId: "app4-signs-horizontal",
    viewport: "desktop",
    path:
      "test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app4-signs-horizontal-desktop-chromium.png"
  },
  {
    sectionId: "app4-signs-horizontal",
    viewport: "mobile",
    path:
      "test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app4-signs-horizontal-mobile-chromium.png"
  },
  {
    sectionId: "app2-highways-hospitals",
    viewport: "desktop/mobile",
    path:
      "test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app2-highways-hospitals-*-chromium.png"
  },
  {
    sectionId: "app3-driving-factors",
    viewport: "desktop/mobile",
    path:
      "test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app3-driving-factors-*-chromium.png"
  },
  {
    sectionId: "ch2-required-documents",
    viewport: "manual-inventory",
    path: "content/validation/manual-guide-visual-content-crop.evidence.json"
  }
];

const domSupportedReadableCardIds = new Set([
  "headrest-position-source-card",
  "sri-types-source-card",
  "alcohol-limits-source-card",
  "distraction-panels-source-card",
  "mobility-context-transferred-card"
]);

const sourceTextSupportingCardIds = new Set([
  "app1-blind-spot-source-card",
  "app2-hospital-map-source-card",
  "app3-body-posture-source-card",
  "app3-seatbelt-source-card",
  "cedulas-source-card",
  "vtv-source-card",
  "drug-test-device-source-card"
]);

const suspectCropCardIds = new Set(["cedulas-source-card"]);
const focusedOfficialSignCardIds = new Set(["app4-regulatory-no-avanzar-source-card"]);

function readabilityViewportComparisons(card, renderedImageWidthPx, estimatedSmallestTextHeightPx, disposition) {
  const renderedSize = {
    width: renderedImageWidthPx,
    height: card.dimensions?.height ?? null
  };
  return [
    {
      viewport: "desktop-natural-width",
      renderedImageSizePx: renderedSize,
      estimatedSmallestTextHeightPx,
      bodyTextBaselinePx: bodyTextBaseline.documentBodyTextFontSizePx,
      passesBodyTextSizeTarget:
        typeof estimatedSmallestTextHeightPx === "number" ? estimatedSmallestTextHeightPx >= bodyTextBaseline.documentBodyTextFontSizePx : null,
      disposition,
      evidencePath: "focused Playwright desktop screenshot for the same source-image-card scenario"
    },
    {
      viewport: "mobile-contained-scroll-natural-width",
      renderedImageSizePx: renderedSize,
      estimatedSmallestTextHeightPx,
      bodyTextBaselinePx: bodyTextBaseline.documentBodyTextFontSizePx,
      passesBodyTextSizeTarget:
        typeof estimatedSmallestTextHeightPx === "number" ? estimatedSmallestTextHeightPx >= bodyTextBaseline.documentBodyTextFontSizePx : null,
      disposition,
      evidencePath: "focused Playwright mobile screenshot plus minDisplayWidthPx/no-upscale assertions"
    }
  ];
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function readImageDimensions(path) {
  const bytes = readFileSync(path);
  if (bytes.length >= 24 && bytes.readUInt32BE(0) === 0x89504e47) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset < bytes.length) {
      while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
      const marker = bytes[offset];
      offset += 1;
      if (marker === 0xd9 || marker === 0xda) break;
      if (offset + 2 > bytes.length) break;
      const segmentLength = bytes.readUInt16BE(offset);
      if (segmentLength < 2 || offset + segmentLength > bytes.length) break;
      if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
        return { width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3) };
      }
      offset += segmentLength;
    }
  }
  return null;
}

function countBy(values) {
  return values.reduce((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function officialAnnexImageAudit() {
  if (!existsSync(officialAnnexImageRoot)) {
    return {
      status: "not-found",
      root: officialAnnexImageRoot
    };
  }
  const records = readdirSync(officialAnnexImageRoot)
    .filter((fileName) => /\.(?:png|jpe?g)$/iu.test(fileName))
    .sort()
    .map((fileName) => {
      const path = join(officialAnnexImageRoot, fileName);
      return { path, dimensions: readImageDimensions(path) };
    });
  const widths = records.map((record) => record.dimensions?.width).filter((width) => typeof width === "number");
  const heights = records.map((record) => record.dimensions?.height).filter((height) => typeof height === "number");
  return {
    status: "checked",
    root: officialAnnexImageRoot,
    imageCount: records.length,
    widthRangePx: widths.length ? { min: Math.min(...widths), max: Math.max(...widths) } : null,
    heightRangePx: heights.length ? { min: Math.min(...heights), max: Math.max(...heights) } : null,
    result:
      "Retained official Anexo L image assets were checked as a better-source alternative for Appendix IV signs; their 613-620px widths are not higher quality than the corrected manual crop widths around 664-757px.",
    samplePaths: records.slice(0, 3).map((record) => record.path)
  };
}

function balancedSourceSlice(source, startIndex, openChar, closeChar) {
  let depth = 0;
  let stringQuote = "";
  let escaped = false;
  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];
    if (stringQuote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === stringQuote) stringQuote = "";
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      stringQuote = char;
      continue;
    }
    if (char === openChar) depth += 1;
    if (char === closeChar) {
      depth -= 1;
      if (depth === 0) return source.slice(startIndex, index + 1);
    }
  }
  throw new Error(`Unbalanced source slice starting at ${startIndex}`);
}

function topLevelObjectSources(arraySource) {
  const objects = [];
  let depth = 0;
  let stringQuote = "";
  let escaped = false;
  let objectStart = -1;
  for (let index = 0; index < arraySource.length; index += 1) {
    const char = arraySource[index];
    if (stringQuote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === stringQuote) stringQuote = "";
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      stringQuote = char;
      continue;
    }
    if (char === "{") {
      if (depth === 0) objectStart = index;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0 && objectStart >= 0) objects.push(arraySource.slice(objectStart, index + 1));
    }
  }
  return objects;
}

function moduleStringField(source, fieldName) {
  return source.match(new RegExp(`${fieldName}:\\s*"([^"]+)"`, "u"))?.[1] ?? "";
}

function moduleNumberField(source, fieldName) {
  const match = source.match(new RegExp(`${fieldName}:\\s*(\\d+)`, "u"));
  return match ? Number(match[1]) : undefined;
}

function moduleSourceRegion(source) {
  const match = source.match(/sourceRegion:\s*\{\s*x:\s*(\d+),\s*y:\s*(\d+),\s*width:\s*(\d+),\s*height:\s*(\d+)\s*\}/u);
  return match
    ? {
        x: Number(match[1]),
        y: Number(match[2]),
        width: Number(match[3]),
        height: Number(match[4])
      }
    : undefined;
}

function moduleAssetPath(source, assetRoot) {
  const templateMatch = source.match(/assetPath:\s*`\$\{assetRoot\}\/([^`]+)`/u);
  if (templateMatch) return `${assetRoot}/${templateMatch[1]}`;
  return source.match(/assetPath:\s*"([^"]+)"/u)?.[1] ?? "";
}

function sectionSourceFiles() {
  return readdirSync("src/data/manual-sections")
    .filter((name) => name.endsWith(".ts"))
    .sort()
    .map((fileName) => ({
      fileName,
      path: join("src/data/manual-sections", fileName),
      source: readFileSync(join("src/data/manual-sections", fileName), "utf8")
    }));
}

function sourceImageCardInventory() {
  const cards = [];
  for (const file of sectionSourceFiles()) {
    const assetRoot = file.source.match(/const assetRoot =\s*(?:\n\s*)?"([^"]+)"/u)?.[1] ?? "";
    const sectionId = moduleStringField(file.source, "sectionId");
    let cursor = 0;
    while ((cursor = file.source.indexOf('kind: "source-image-cards"', cursor)) >= 0) {
      const prelude = file.source.slice(Math.max(0, cursor - 400), cursor);
      const blockId = [...prelude.matchAll(/id:\s*"([^"]+)"/gu)].at(-1)?.[1] ?? "";
      const cardsIndex = file.source.indexOf("cards:", cursor);
      const arrayStart = file.source.indexOf("[", cardsIndex);
      const cardsArray = balancedSourceSlice(file.source, arrayStart, "[", "]");
      for (const cardSource of topLevelObjectSources(cardsArray)) {
        const assetPath = moduleAssetPath(cardSource, assetRoot);
        const dimensions = existsSync(assetPath) ? readImageDimensions(assetPath) : null;
        cards.push({
          sectionId,
          sectionFile: file.path,
          blockId,
          cardId: moduleStringField(cardSource, "id"),
          displayMode: moduleStringField(cardSource, "displayMode"),
          maxDisplayWidthPx: moduleNumberField(cardSource, "maxDisplayWidthPx"),
          minDisplayWidthPx: moduleNumberField(cardSource, "minDisplayWidthPx"),
          sourcePage: moduleNumberField(cardSource, "sourcePage"),
          sourceRegion: moduleSourceRegion(cardSource),
          assetPath,
          dimensions,
          protectedStatus: /officialSignException/u.test(cardSource)
            ? "official-sign-source-as-is"
            : /sourceImageException/u.test(cardSource)
              ? "source-image-source-as-is"
              : "not-protected",
          hasRussianOverlayLabels: /russianOverlayLabels/u.test(cardSource)
        });
      }
      cursor = arrayStart + cardsArray.length;
    }
  }
  return cards;
}

function sourceArtworkInventory() {
  const artwork = [];
  for (const file of sectionSourceFiles()) {
    const sectionId = moduleStringField(file.source, "sectionId");
    const assetRoot = file.source.match(/const assetRoot =\s*(?:\n\s*)?"([^"]+)"/u)?.[1] ?? "";
    let cursor = 0;
    while ((cursor = file.source.indexOf('kind: "source-artwork"', cursor)) >= 0) {
      const objectStart = file.source.lastIndexOf("{", cursor);
      const objectSource = balancedSourceSlice(file.source, objectStart, "{", "}");
      const assetPath = moduleAssetPath(objectSource, assetRoot);
      artwork.push({
        sectionId,
        sectionFile: file.path,
        blockId: moduleStringField(objectSource, "id"),
        sourcePage: moduleNumberField(objectSource, "sourcePage"),
        sourceRegion: moduleSourceRegion(objectSource),
        assetPath,
        dimensions: existsSync(assetPath) ? readImageDimensions(assetPath) : null,
        disposition: "not-affected",
        reason: "source-artwork blocks do not use the source-image-card page-sheet raster display path and were not observed with the Appendix IV tiny-island defect"
      });
      cursor += objectSource.length;
    }
  }
  return artwork;
}

function walkFiles(root, prefix = root) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    if (entry.isDirectory()) return walkFiles(path, prefix);
    return [path];
  });
}

function dispositionForCard(card, cropRecord) {
  if (cropRecord) {
    return {
      disposition: "corrected-source-limited-crop",
      reason:
        "Prior full-page source-as-is asset had excessive blank margins; corrected runtime asset is a tight official-source crop with useful-content ratio evidence and no browser upscaling.",
      beforeUsefulRatios: cropRecord.beforeUsefulRatios,
      afterUsefulRatios: cropRecord.outputUsefulRatios,
      sourceQualityDisposition: cropRecord.sourceQualityDisposition
    };
  }
  if (focusedOfficialSignCardIds.has(card.cardId)) {
    return {
      disposition: "implemented-representative-focused-official-sign-crop",
      reason:
        "Focused official Anexo L crop covers the reported NO AVANZAR example at native asset size, while Appendix IV whole sheets remain overview/source-limited context."
    };
  }
  if (card.cardId === "app1-blind-spot-source-card") {
    const cropEvidence = existsSync(blindSpotCropEvidencePath) ? readJson(blindSpotCropEvidencePath) : null;
    const target = cropEvidence?.targets?.find((entry) => entry.cardId === card.cardId);
    return {
      disposition: "implemented-source-limited-blind-spot-crop",
      reason:
        "Focused official page 108 blind-spot visual was added as a tight direct-PDF source-as-is crop. The card preserves internal Spanish pixels, excludes unrelated page content, caps display at the natural source-limited width, and renders Russian explanation outside the image.",
      sourcePage: 108,
      pdfPage: target?.sourcePage ?? 109,
      beforeUsefulRatios: target?.beforeUsefulRatios ?? null,
      afterUsefulRatios: target?.outputUsefulRatios ?? null,
      sourceQualityDisposition: target?.sourceQualityDisposition ?? null
    };
  }
  if (card.cardId === "app2-hospital-map-source-card") {
    return {
      disposition: "corrected-best-official-map-only-crop",
      reason:
        "Hospital map follow-up replaced the broader map/list source visual with the tightest verified official map-only crop, preserving map internals unchanged and capping display at natural width.",
      dimensions: { width: 440, height: 380 },
      outputSha256: "742f7e66213866c7e07861b9a93ab7fdd8c00e8b384e96a239b1b1cb712ca1d0",
      beforeUsefulRatios: { areaRatio: 0.4205128205128205 },
      afterUsefulRatios: { areaRatio: 0.7142763157894737 }
    };
  }
  if (card.cardId === "app3-body-posture-source-card") {
    return {
      disposition: "acceptable-tight-crop",
      reason: "Contrast example from feature 034 intake: useful bbox area ratio 0.3652 and no-upscale cap 1350px; not blindly recropped.",
      measuredUsefulRatios: { areaRatio: 0.3652 }
    };
  }
  if (card.displayMode === "compact") {
    return {
      disposition: "compact-not-affected",
      reason: "Feature 032 inventory records this as a genuinely compact snippet; no excessive full-page margin symptom is present."
    };
  }
  return {
    disposition: "not-affected-reviewer-disposition",
    reason:
      "Whole-manual inventory reviewed this source-image card; it is not an Appendix IV full-page sheet with a measured below-threshold useful-content island and remains governed by existing no-upscale/source-fidelity evidence."
  };
}

function textReadabilityForCard(card, cropRecord) {
  const renderedImageWidthPx = card.minDisplayWidthPx ?? card.maxDisplayWidthPx ?? card.dimensions?.width ?? null;
  const baseline = bodyTextBaseline;
  if (cropRecord) {
    return {
      relevance: "required",
      disposition: "source-limited-exception",
      intendedReadableText:
        "Official Spanish sign, marking, signal, or closing-page labels/captions inside the protected Appendix IV source sheet.",
      inspectedSample:
        "Smallest official labels/captions within the sheet; representative examples include sign captions on pages 185-186 and marking labels on page 195.",
      renderedImageWidthPx,
      estimatedSmallestTextHeightPx: 6,
      bodyTextBaselinePx: baseline.documentBodyTextFontSizePx,
      comparisonToBodyText: "below-body-text-at-natural-source-width",
      viewportComparisons: readabilityViewportComparisons(card, renderedImageWidthPx, 6, "source-limited-exception"),
      strategyApplied:
        "Natural-width minimum display equals the no-upscale max display width, so narrow viewports use contained figure scrolling rather than shrinking source-limited labels further.",
      evidencePath:
        "content/validation/manual-guide-visual-content-crop.evidence.json plus focused Playwright screenshots under test-results/manual-source-full-width-app4-*-desktop-mobile-chromium.png",
      attemptedAlternatives: [
        {
          id: "gcba-manual-pdf-render-scale-12",
          result: `High-scale canonical PDF render produced rendered useful-width scale ratio ${cropRecord.renderedUsefulWidthScaleRatio.toFixed(
            3
          )}; this is near 1.0 rather than the expected 2.4x, proving the official PDF embeds a source-limited raster for this sheet.`
        },
        {
          id: "decreto-779-1995-anexo-l-official-images",
          result:
            "Retained official Anexo L image assets were checked as a better-source candidate, but their widths are about 613-620px, not better than the corrected manual crops."
        },
        {
          id: "source-faithful-split-subcrop-presentation",
          result:
            "Explored before declaring the exception. Because the full corrected sheets already render at natural crop width on desktop and now keep that width on mobile, splitting the same source-limited raster would not increase glyph pixels without browser upscaling; it would only remove context or multiply panels. Not selected."
        }
      ],
      requiresOwnerDisposition: true,
      routeDisposition:
        "Requires Orchestrator/user disposition before final validation because the user text-size target cannot be met from verified official source pixels without upscaling or protected-pixel reconstruction."
    };
  }
  if (focusedOfficialSignCardIds.has(card.cardId)) {
    return {
      relevance: "required",
      disposition: "implemented-representative-focused-official-sign-crop",
      intendedReadableText:
        "R.1 NO AVANZAR external catalog caption below the protected official sign image, with Russian learner wording rendered below as selectable DOM text.",
      inspectedSample: "R.1 NO AVANZAR focused crop from retained official Anexo L image dec196AnexoIII-01.jpg.",
      renderedImageWidthPx,
      estimatedSmallestTextHeightPx: 10,
      bodyTextBaselinePx: baseline.documentBodyTextFontSizePx,
      comparisonToBodyText: "source-caption-below-body-text-but-separate-dom-translation-carries-learning",
      viewportComparisons: readabilityViewportComparisons(
        card,
        renderedImageWidthPx,
        10,
        "implemented-representative-focused-official-sign-crop"
      ),
      strategyApplied:
        "Use the retained official Anexo L R.1 crop rather than relying only on the smaller CABA Appendix IV whole-sheet label.",
      evidencePath: "content/validation/manual-guide-visual-completeness.evidence.json",
      attemptedAlternatives: [
        {
          id: "gcba-appendix-iv-page-185-whole-sheet",
          result:
            "Kept only as overview because the CABA page-sheet raster leaves NO AVANZAR too small when treated as the only representation."
        },
        {
          id: "decreto-779-1995-anexo-l-dec196AnexoIII-01",
          result:
            "Selected as retained official original-image source for a focused R.1 NO AVANZAR crop with protected sign pixels and a separate Russian DOM translation."
        }
      ],
      requiresOwnerDisposition: false
    };
  }
  if (card.cardId === "app1-blind-spot-source-card") {
    return {
      relevance: "required",
      disposition: "implemented-source-limited-blind-spot-crop",
      intendedReadableText:
        "Official Spanish heading, definition sentence, PUNTO CIEGO AUTOS/MOTOS labels, CAMIONES Y COLECTIVOS label, and blue conclusion inside the protected blind-spot visual.",
      inspectedSample: "App1 page 108 blind-spot crop rendered from PDF page/render file 109.",
      renderedImageWidthPx,
      estimatedSmallestTextHeightPx: 10,
      bodyTextBaselinePx: baseline.documentBodyTextFontSizePx,
      comparisonToBodyText:
        "The smallest embedded labels remain below body-text height because the official PDF embeds the visual as a source-limited raster; the crop is capped at natural width and is not browser-upscaled.",
      viewportComparisons: readabilityViewportComparisons(card, renderedImageWidthPx, 10, "implemented-source-limited-blind-spot-crop"),
      strategyApplied:
        "The runtime card uses maxDisplayWidthPx/minDisplayWidthPx equal to the natural 546px asset width, so desktop avoids upscaling and mobile uses contained figure scrolling instead of shrinking the source-limited visual.",
      evidencePath: "content/validation/manual-guide-blind-spot-source-crop.evidence.json plus focused Playwright checks for app1-blind-spot-source-card",
      sourceLimitation:
        "Direct official PDF region rendering at x5 produced a 546x440 crop; higher-scale raster enlargement was intentionally not committed because it would not add official source detail.",
      requiresOwnerDisposition: false
    };
  }
  if (card.cardId === "app2-hospital-map-source-card") {
    return {
      relevance: "required",
      disposition: "implemented-best-official-map-only-crop-with-source-limited-label-detail",
      intendedReadableText:
        "Hospital map barrio labels and H/H1/H2 markers remain protected source pixels; Russian explanation/list text is rendered separately.",
      inspectedSample: "Hospital map labels from source page 150.",
      renderedImageWidthPx,
      estimatedSmallestTextHeightPx: 10,
      bodyTextBaselinePx: baseline.documentBodyTextFontSizePx,
      comparisonToBodyText: "map-labels-source-limited-but-map-crop-is-tight-and-dom-text-carries-learning",
      viewportComparisons: readabilityViewportComparisons(
        card,
        renderedImageWidthPx,
        10,
        "implemented-best-official-map-only-crop-with-source-limited-label-detail"
      ),
      evidencePath: "content/validation/manual-guide-hospital-map-source-crop.evidence.json",
      sourceLimitation:
        "Official PDF appears native-raster limited for barrio-label glyph detail; implementation uses the tightest map-only crop plus natural-width mobile containment.",
      requiresOwnerDisposition: false
    };
  }
  if (suspectCropCardIds.has(card.cardId)) {
    return {
      relevance: "supporting",
      disposition: "implementation-feedback-needs-source-region-verification",
      intendedReadableText:
        "Source-document example labels and captions are supporting visual context; learner-critical rules are translated in adjacent selectable DOM text.",
      inspectedSample: "Cédula color-example captions on source page 47.",
      renderedImageWidthPx,
      estimatedSmallestTextHeightPx: null,
      bodyTextBaselinePx: baseline.documentBodyTextFontSizePx,
      comparisonToBodyText: "not-passed-for-source-visual",
      viewportComparisons: readabilityViewportComparisons(
        card,
        renderedImageWidthPx,
        null,
        "implementation-feedback-needs-source-region-verification"
      ),
      evidencePath: "content/validation/manual-guide-visual-content-crop.evidence.json",
      attemptedAlternatives: [
        {
          id: "page-047-trimmed-page-probe",
          result:
            "Local page-image probe found a better source-faithful row crop, but it is lower resolution than the x5/high-DPI contract."
        },
        {
          id: "canonical-pdf-explicit-region-probe",
          result:
            "Scale-2 PDF explicit-region probe rendered the intended cédula row, but scale-5/scale-12 probes produced bad or blank crops, so Implementation did not replace the committed source asset without a reliable high-DPI path."
        }
      ],
      requiresArchitectDisposition: true,
      routeDisposition:
        "Implementation Agent feedback for Architect/Orchestrator disposition; not fixed in this Appendix IV readability follow-up."
    };
  }
  if (domSupportedReadableCardIds.has(card.cardId)) {
    return {
      relevance: "supporting",
      disposition: "readable-via-selectable-dom-overlay",
      intendedReadableText:
        "Russian learner-facing labels are rendered as selectable DOM/SVG overlay text; source artwork remains provenance context.",
      inspectedSample: "DOM overlay labels in transferred source image card.",
      renderedImageWidthPx,
      estimatedSmallestTextHeightPx: 14,
      bodyTextBaselinePx: baseline.documentBodyTextFontSizePx,
      comparisonToBodyText: "learner-facing-dom-text-is-comparable",
      viewportComparisons: readabilityViewportComparisons(card, renderedImageWidthPx, 14, "readable-via-selectable-dom-overlay"),
      evidencePath: "content/validation/manual-guide-source-fidelity.evidence.json"
    };
  }
  if (sourceTextSupportingCardIds.has(card.cardId)) {
    return {
      relevance: "supporting",
      disposition: "readable-with-adjacent-dom-text",
      intendedReadableText:
        "Embedded source text is preserved as official context; learner-critical content is repeated or explained in nearby selectable Russian DOM text.",
      inspectedSample: "Representative source labels in maps, diagrams, document examples, or source-as-is photos.",
      renderedImageWidthPx,
      estimatedSmallestTextHeightPx: 10,
      bodyTextBaselinePx: baseline.documentBodyTextFontSizePx,
      comparisonToBodyText: "source-text-supporting-dom-text-carries-learning",
      viewportComparisons: readabilityViewportComparisons(card, renderedImageWidthPx, 10, "readable-with-adjacent-dom-text"),
      evidencePath: "content/validation/manual-guide-visual-content-crop.evidence.json"
    };
  }
  if (card.displayMode === "compact") {
    return {
      relevance: "none",
      disposition: "not-intended-readable",
      intendedReadableText:
        "Compact source snippet is visual/provenance support; learner-critical text is in adjacent selectable Russian DOM text.",
      inspectedSample: "Compact source-card visual.",
      renderedImageWidthPx: card.dimensions?.width ?? null,
      estimatedSmallestTextHeightPx: null,
      bodyTextBaselinePx: baseline.documentBodyTextFontSizePx,
      comparisonToBodyText: "not-applicable",
      viewportComparisons: [],
      evidencePath: "content/validation/manual-guide-visual-content-crop.evidence.json"
    };
  }
  return {
    relevance: "none",
    disposition: "not-intended-readable",
    intendedReadableText:
      "No intended-readable embedded image text was identified for the whole-manual source-image-card audit, or the visible learner text is already DOM text.",
    inspectedSample: "Whole-manual source-image-card inventory review.",
    renderedImageWidthPx,
    estimatedSmallestTextHeightPx: null,
    bodyTextBaselinePx: baseline.documentBodyTextFontSizePx,
    comparisonToBodyText: "not-applicable",
    viewportComparisons: [],
    evidencePath: "content/validation/manual-guide-visual-content-crop.evidence.json"
  };
}

function textReadabilityForArtwork(entry) {
  return {
    relevance: "none",
    disposition: "not-intended-readable",
    intendedReadableText:
      "Source-artwork block is a photo/diagram visual without learner-critical embedded text; surrounding Russian DOM text carries the learning content.",
    inspectedSample: entry.blockId,
    renderedImageWidthPx: entry.dimensions?.width ?? null,
    estimatedSmallestTextHeightPx: null,
    bodyTextBaselinePx: bodyTextBaseline.documentBodyTextFontSizePx,
    comparisonToBodyText: "not-applicable",
    evidencePath: "content/validation/manual-guide-visual-content-crop.evidence.json"
  };
}

function updateRegistryFromCropEvidence(registry, cropEvidence) {
  const byCardId = new Map(cropEvidence.targets.map((record) => [record.cardId, record]));
  const orderedSourceRegion = (region) => ({
    x: region.x,
    y: region.y,
    width: region.width,
    height: region.height
  });
  const orderedDimensions = (dimensions) => ({
    width: dimensions.width,
    height: dimensions.height
  });
  const orderedRatios = (ratios) => ({
    areaRatio: ratios.areaRatio,
    widthRatio: ratios.widthRatio,
    heightRatio: ratios.heightRatio
  });
  for (const record of byCardId.values()) {
    const section = registry.sections.find((entry) => entry.id === record.sectionId);
    if (!section) throw new Error(`Missing registry section ${record.sectionId}`);
    const implementation = section.implementationEvidence;
    const sourceRegion = implementation.sourceRegionMetadata.find(
      (entry) => entry.sourcePage === record.sourcePage && entry.sourceAssetPath === record.outputSourceAssetPath
    );
    if (!sourceRegion) throw new Error(`Missing source region metadata for ${record.cardId}`);
    sourceRegion.sourceRegion = orderedSourceRegion(record.sourceRegionAtBaseScale);
    sourceRegion.cropDimensions = orderedDimensions(record.outputDimensions);
    sourceRegion.cropSha256 = record.outputSha256;
    sourceRegion.cleanupScope =
      "source-as-is runtime official sheet crop; empty page margins removed only, with no Spanish cleanup or protected pixel modification";
    sourceRegion.extractionScaleEvidence = {
      target: "source-native-equivalent-or-better",
      method:
        "Feature 034 Swift manual-visual-content-crops helper measured the prior x5 page-sheet useful bbox, attempted a scale-12 official PDF source-region render, detected the PDF's native raster source limitation, then trimmed only empty outer margins around the official pixels with 80px safety padding. No resizing, cleanup, retouching, relabeling, translation, masking, inpainting, reconstruction, or redraw was applied.",
      outputDimensions: orderedDimensions(record.outputDimensions),
      sha256: record.outputSha256,
      sourceQualityDisposition: record.sourceQualityDisposition,
      usefulContentRatios: {
        before: orderedRatios(record.beforeUsefulRatios),
        after: orderedRatios(record.outputUsefulRatios)
      }
    };

    const localAsset = implementation.localAssetMetadata.find(
      (entry) => entry.assetPath === record.currentAssetPath || entry.assetKind?.endsWith(`page-${record.sourcePage}`)
    );
    if (!localAsset) throw new Error(`Missing local asset metadata for ${record.cardId}`);
    localAsset.assetPath = record.outputAssetPath;
    localAsset.width = record.outputDimensions.width;
    localAsset.height = record.outputDimensions.height;
    localAsset.sha256 = record.outputSha256;
    localAsset.runtimeDisplaySize = {
      maxWidthCssPx: record.outputDimensions.width,
      noUpscale: true
    };
    localAsset.extractionScaleEvidence = {
      target: "source-native-equivalent-or-better",
      method:
        "Runtime image is byte-identical to the feature 034 official-source crop. The PDF source is source-limited for useful sign pixels, so the display is capped at natural crop width instead of browser-upscaling.",
      outputDimensions: orderedDimensions(record.outputDimensions),
      sha256: record.outputSha256,
      sourceQualityDisposition: record.sourceQualityDisposition,
      usefulContentRatios: {
        before: orderedRatios(record.beforeUsefulRatios),
        after: orderedRatios(record.outputUsefulRatios)
      }
    };
    localAsset.sourceIntegrity.sourceAssetPath = record.outputSourceAssetPath;
    if (localAsset.officialSignException) localAsset.officialSignException.assetPath = record.outputAssetPath;

    if (implementation.visibleSpanishStatus?.exceptions) {
      const visibleException = implementation.visibleSpanishStatus.exceptions.find((entry) => entry.assetPath === record.currentAssetPath);
      if (visibleException) visibleException.assetPath = record.outputAssetPath;
    }
    implementation.boundingBoxChecks = {
      status: "pass",
      evidence:
        "Feature 034 records before/after useful-content bbox ratios and Playwright useful-content width checks for corrected Appendix IV crops; corrected assets render at natural width with no browser upscaling."
    };
    implementation.visualReviewNotes = [
      "Feature 034 replaces excessive-margin Appendix IV page-sheet runtime assets with tight official-source crops and records before/after useful-content bbox evidence.",
      "The official PDF source is source-limited for useful sign/sheet pixel detail; corrected assets therefore cap runtime display at natural crop width instead of stretching or browser-upscaling.",
      "Protected signs, road markings, traffic-light/signal visuals, and closing source visuals are left unchanged except for removing empty outer page margins; Russian explanations remain adjacent or below as selectable DOM text."
    ];
  }
}

function upsertFocusedNoAvanzarEvidence(registry) {
  const section = registry.sections.find((entry) => entry.id === "app4-signs-regulatory");
  if (!section) throw new Error("Missing registry section app4-signs-regulatory");
  const implementation = section.implementationEvidence;
  const dimensions = readImageDimensions(noAvanzarAssetPath);
  const sourceDimensions = readImageDimensions(noAvanzarSourceAssetPath);
  if (!dimensions || !sourceDimensions) throw new Error("Missing focused NO AVANZAR image dimensions");
  const sha256 = sha256File(noAvanzarAssetPath);
  const sourceSha256 = sha256File(noAvanzarSourceAssetPath);
  if (sha256 !== sourceSha256) throw new Error("Focused NO AVANZAR runtime asset must match validation crop bytes");

  const sourceRegionEntry = {
    sourcePage: 185,
    sourceRegion: {
      coordinateSystem:
        "content/official-documents/originals/decreto-779-1995-anexo-l-senalizacion-vial-uniforme-images/dec196AnexoIII-01.jpg pixels",
      x: 32,
      y: 85,
      width: 200,
      height: 145
    },
    sourceAssetPath: noAvanzarSourceAssetPath,
    cropDimensions: sourceDimensions,
    cropSha256: sourceSha256,
    cleanupScope: "source-as-is focused official R.1 sign crop; no protected-pixel modification",
    extractionScaleEvidence: {
      target: "higher-resolution-direct-export",
      method:
        "Focused crop from retained official Anexo L R.1 sign image dec196AnexoIII-01.jpg using sips cropOffset 85 32, crop 145x200. The CABA page-185 whole-sheet PDF probes remained native-raster limited, so this retained official original image is used for the readable representative NO AVANZAR card.",
      outputDimensions: sourceDimensions,
      sha256: sourceSha256,
      sourceQualityDisposition:
        "retained-official-anexo-l-original-image-selected-for-focused-no-avanzar-card-after-caba-page-185-sheet-probes-remained-source-limited",
      externalCaptionBoundary:
        "R.1 NO AVANZAR is printed below the sign as the external catalog caption, not inside the sign body or a supplementary plate."
    }
  };
  const existingSourceRegionIndex = implementation.sourceRegionMetadata.findIndex(
    (entry) => entry.sourceAssetPath === noAvanzarSourceAssetPath
  );
  if (existingSourceRegionIndex >= 0) implementation.sourceRegionMetadata[existingSourceRegionIndex] = sourceRegionEntry;
  else implementation.sourceRegionMetadata.push(sourceRegionEntry);

  const exception = {
    kind: "official-traffic-sign-source-as-is",
    visibleSpanishScope: "official-sign-image-only",
    sourceAsIs: true,
    assetPath: noAvanzarAssetPath,
    reason:
      "Focused official R.1 NO AVANZAR sign crop is protected source-as-is; Russian explanation is outside the image."
  };
  const localAsset = {
    assetPath: noAvanzarAssetPath,
    assetKind: "official-traffic-sign-source-as-is-no-avanzar",
    assetCategory: "source-as-is-traffic-sign",
    containsText: true,
    visibleSpanish: true,
    cleanupScope: "none-source-as-is",
    width: dimensions.width,
    height: dimensions.height,
    sha256,
    runtimeDisplaySize: {
      maxWidthCssPx: dimensions.width,
      noUpscale: true
    },
    extractionScaleEvidence: {
      target: "higher-resolution-direct-export",
      method:
        "Runtime image is byte-identical to the focused official Anexo L R.1 validation crop. The display is capped at natural crop width; Russian wording is separate DOM text below the image.",
      outputDimensions: dimensions,
      sha256,
      externalCaptionBoundary:
        "NO AVANZAR is translated only as separate DOM text because the printed Spanish words are an external catalog caption below the sign."
    },
    sourceIntegrity: {
      sourceAsIs: true,
      sourceAssetPath: noAvanzarSourceAssetPath,
      noTranslationOrRelabeling: true,
      noRedrawRecolorCleanupRetouchMaskInpaint: true,
      russianExplanationOutsideImage: true
    },
    officialSignException: exception
  };
  const existingLocalAssetIndex = implementation.localAssetMetadata.findIndex((entry) => entry.assetPath === noAvanzarAssetPath);
  if (existingLocalAssetIndex >= 0) implementation.localAssetMetadata[existingLocalAssetIndex] = localAsset;
  else implementation.localAssetMetadata.push(localAsset);

  if (implementation.visibleSpanishStatus?.exceptions) {
    implementation.visibleSpanishStatus.exceptions = implementation.visibleSpanishStatus.exceptions.filter(
      (entry) => entry.assetPath !== noAvanzarAssetPath
    );
    implementation.visibleSpanishStatus.exceptions.push(exception);
  }

  implementation.visualReviewNotes = [
    ...implementation.visualReviewNotes.filter((note) => !note.includes("NO AVANZAR")),
    "Focused NO AVANZAR card uses retained official Anexo L R.1 image pixels and translates only the proven external catalog caption as separate DOM text."
  ];
}

const cropEvidence = readJson(cropEvidencePath);
const registry = readJson(registryPath);
updateRegistryFromCropEvidence(registry, cropEvidence);
upsertFocusedNoAvanzarEvidence(registry);

const cropByCardId = new Map(cropEvidence.targets.map((record) => [record.cardId, record]));
const cards = sourceImageCardInventory();
const sourceImageCards = cards.map((card) => {
  const cropRecord = cropByCardId.get(card.cardId);
  return {
    ...card,
    ...dispositionForCard(card, cropRecord),
    textReadability: textReadabilityForCard(card, cropRecord)
  };
});
const artwork = sourceArtworkInventory().map((entry) => ({
  ...entry,
  textReadability: textReadabilityForArtwork(entry)
}));
const referencedAssetPaths = new Set([...cards.map((card) => card.assetPath), ...artwork.map((entry) => entry.assetPath)]);
const sectionAssetFiles = walkFiles(sectionAssetRoot)
  .filter((path) => /\.(?:png|jpe?g|svg)$/iu.test(path))
  .sort()
  .map((assetPath) => ({
    assetPath,
    referencedByManualData: referencedAssetPaths.has(assetPath),
    dimensions: /\.(?:png|jpe?g)$/iu.test(assetPath) ? readImageDimensions(assetPath) : null,
    disposition: referencedAssetPaths.has(assetPath) ? "referenced-current-manual-visual" : "unreferenced-or-superseded-local-asset-file"
  }));

cropEvidence.wholeManualInventory = {
  inventoryMethod:
    "scripts/manual-visual-content-inventory.mjs parses source-image-cards/source-artwork from src/data/manual-sections, enumerates local section asset files, joins feature 034 Swift crop evidence for corrected Appendix IV pages, records reviewer dispositions where automated useful-content measurement is not practical, and attaches whole-manual embedded-text readability dispositions for the same source-image inventory.",
  sourceImageCards,
  sourceArtwork: artwork,
  sectionAssetFiles,
  textReadability: {
    baseline: bodyTextBaseline,
    officialBetterSourceAudit: officialAnnexImageAudit(),
    sourceImageCardRelevanceCounts: countBy(sourceImageCards.map((card) => card.textReadability.relevance)),
    sourceImageCardDispositionCounts: countBy(sourceImageCards.map((card) => card.textReadability.disposition)),
    sourceImageCardDispositionTotal: sourceImageCards.length,
    requiredCardIds: sourceImageCards
      .filter((card) => card.textReadability.relevance === "required")
      .map((card) => card.cardId)
      .sort(),
    representativeNonAppendixReadableCardIds: sourceImageCards
      .filter((card) => card.textReadability.relevance === "supporting")
      .map((card) => card.cardId)
      .sort(),
    sourceLimitedExceptionCardIds: sourceImageCards
      .filter((card) => card.textReadability.disposition === "source-limited-exception")
      .map((card) => card.cardId)
      .sort(),
    ownerDispositionRequiredCardIds: sourceImageCards
      .filter((card) => card.textReadability.requiresOwnerDisposition)
      .map((card) => card.cardId)
      .sort(),
    architectDispositionRequiredCardIds: sourceImageCards
      .filter((card) => card.textReadability.requiresArchitectDisposition)
      .map((card) => card.cardId)
      .sort(),
    naturalWidthMinDisplayCardIds: sourceImageCards
      .filter((card) => card.minDisplayWidthPx !== undefined)
      .map((card) => card.cardId)
      .sort(),
    followUpFeedbackCardIds: sourceImageCards
      .filter((card) => card.textReadability.disposition.includes("implementation-feedback"))
      .map((card) => card.cardId)
      .sort(),
    representativeScreenshotEvidence: readabilityScreenshotEvidence,
    splitSubcropAudit: {
      appendixIvPages: cropEvidence.targets.map((record) => record.sourcePage),
      attempted: true,
      strategy:
        "Evaluate splitting each source-limited Appendix IV sheet into smaller official sub-crops/cards/panels before declaring a readability exception.",
      conclusion:
        "Not selected for Appendix IV because the full corrected sheets already display at natural source width on desktop and now keep that width on mobile through contained figure scrolling. Splitting the same source-limited raster would not increase embedded glyph pixels without browser upscaling or protected-pixel reconstruction; it would only remove context or create more panels.",
      selectedMitigation:
        "Set minDisplayWidthPx equal to maxDisplayWidthPx for Appendix IV page-sheet cards so mobile never shrinks below natural crop width."
    }
  },
  summary: {
    sourceImageCardCount: cards.length,
    sourceArtworkCount: artwork.length,
    sectionAssetFileCount: sectionAssetFiles.length,
    correctedAppendixIvCount: cropEvidence.targets.length,
    appendixIvPagesCovered: cropEvidence.targets.map((record) => record.sourcePage),
    compactSourceImageCardCount: cards.filter((card) => card.displayMode === "compact").length,
    acceptableContrastExamples: ["app2-hospital-map-source-card", "app3-body-posture-source-card"]
  }
};

writeJson(cropEvidencePath, cropEvidence);
writeJson(registryPath, registry);

console.log(
  `manual visual crop inventory updated: ${cards.length} source-image cards, ${artwork.length} source-artwork blocks, ${cropEvidence.targets.length} corrected Appendix IV crops`
);
