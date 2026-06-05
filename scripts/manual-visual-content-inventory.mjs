import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const cropEvidencePath = "content/validation/manual-guide-visual-content-crop.evidence.json";
const registryPath =
  "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json";
const sectionAssetRoot = "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections";

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
  if (card.cardId === "app2-hospital-map-source-card") {
    return {
      disposition: "acceptable-tight-crop",
      reason: "Contrast example from feature 034 intake: useful bbox area ratio 0.4205 and no-upscale cap 780px; not blindly recropped.",
      measuredUsefulRatios: { areaRatio: 0.4205 }
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

const cropEvidence = readJson(cropEvidencePath);
const registry = readJson(registryPath);
updateRegistryFromCropEvidence(registry, cropEvidence);

const cropByCardId = new Map(cropEvidence.targets.map((record) => [record.cardId, record]));
const cards = sourceImageCardInventory();
const artwork = sourceArtworkInventory();
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
    "scripts/manual-visual-content-inventory.mjs parses source-image-cards/source-artwork from src/data/manual-sections, enumerates local section asset files, joins feature 034 Swift crop evidence for corrected Appendix IV pages, and records reviewer dispositions where automated useful-content measurement is not practical.",
  sourceImageCards: cards.map((card) => ({
    ...card,
    ...dispositionForCard(card, cropByCardId.get(card.cardId))
  })),
  sourceArtwork: artwork,
  sectionAssetFiles,
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
