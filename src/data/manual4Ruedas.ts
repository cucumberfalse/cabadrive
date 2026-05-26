import manualRuJson from "../../content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json";

export type ManualTranslationStatus = "reused_primary_source_chunk" | "manual_visual_text";
export type ManualSourceTextCoverage = "pdf_extracted_visible_text" | "visual_label_text";

export type ManualVisualAsset = {
  localPath: string;
  format: "jpeg";
  width: number;
  height: number;
  sha256: string;
};

export type ManualChunkProvenance = {
  chunkId: string;
  order: number;
  sourceSpan?: {
    startLine: number;
    endLine: number;
  };
  sourceTextSha256?: string;
  sourceFingerprint?: string;
  shardPath?: string;
  qaShardPath?: string;
  translationQaStatus?: string;
  translationQaCheckedAt?: string;
  simplificationQaStatus?: string;
};

export type ManualVisualTextTranslationProvenance = {
  featureId: "027-manual-vehiculo-4ruedas-ru";
  method: string;
  reviewedAt: string;
};

export type ManualPageTranslation = {
  status: ManualTranslationStatus;
  sourceTextCoverage: ManualSourceTextCoverage;
  exactCoverage: boolean;
  sourceTextEs: string;
  fullTranslationRu: string;
  headingRu: string;
  headingPathEs: string[];
  officialLabel: string;
  chunkProvenance?: ManualChunkProvenance;
  visualTextTranslationProvenance?: ManualVisualTextTranslationProvenance;
};

export type ManualPage = {
  pageNumber: number;
  sourcePageNumber: number;
  sourceTrace: {
    officialDocumentId: string;
    rawOriginalPath: string;
    rawOriginalSha256: string;
  };
  visualAsset: ManualVisualAsset;
  translation: ManualPageTranslation;
};

export type ManualRuManifest = {
  schema: "cabadrive-manual-ru.v1";
  version: number;
  id: string;
  locale: "ru";
  contentStatus: "unofficial_exact_translation";
  titleRu: string;
  titleEs: string;
  source: {
    officialDocumentId: string;
    rawOriginalPath: string;
    rawOriginalSha256: string;
    archiveMarkdownPath: string;
    sourceUrl: string;
    pageCount: number;
  };
  visualAssetSet: {
    strategy: "page_faithful_pdf_render";
    generator: string;
    generatedFromPdfSha256: string;
    renderScale: number;
    format: "jpeg";
    compressionQuality: number;
    assetDirectory: string;
  };
  translationCoverage: {
    strategy: "approved_primary_source_chunks_plus_manual_visual_label_pages";
    requiredPages: number;
    reusedApprovedChunkPages: number;
    manualVisualTextPages: number;
    omittedPages: number;
    chunkShardPaths: string[];
    qaShardPaths: string[];
  };
  pages: ManualPage[];
};

export const manual4RuedasRu = manualRuJson as ManualRuManifest;

export function manualPageByNumber(pageNumber: number) {
  return manual4RuedasRu.pages.find((page) => page.pageNumber === pageNumber);
}

export function manualPageCount() {
  return manual4RuedasRu.pages.length;
}

export function manualManifestSummary(manifest: ManualRuManifest = manual4RuedasRu) {
  return {
    pages: manifest.pages.length,
    expectedPages: manifest.source.pageCount,
    localAssets: manifest.pages.filter((page) => page.visualAsset.localPath.startsWith("content/assets/")).length,
    reusedTranslations: manifest.pages.filter((page) => page.translation.status === "reused_primary_source_chunk").length,
    visualTextTranslations: manifest.pages.filter((page) => page.translation.status === "manual_visual_text").length
  };
}

export function assertManualManifestRuntimeShape(manifest: ManualRuManifest = manual4RuedasRu) {
  if (manifest.schema !== "cabadrive-manual-ru.v1") {
    throw new Error("Manual manifest schema is invalid.");
  }
  if (manifest.locale !== "ru") {
    throw new Error("Manual manifest locale must be ru.");
  }
  if (manifest.pages.length !== manifest.source.pageCount) {
    throw new Error("Manual manifest page count is incomplete.");
  }
  manifest.pages.forEach((page, index) => {
    const expectedPageNumber = index + 1;
    if (page.pageNumber !== expectedPageNumber) {
      throw new Error(`Manual page ${expectedPageNumber} is out of order.`);
    }
    if (!page.visualAsset.localPath.startsWith("content/assets/")) {
      throw new Error(`Manual page ${expectedPageNumber} visual asset is not a local content asset.`);
    }
    if (!page.translation.fullTranslationRu.trim()) {
      throw new Error(`Manual page ${expectedPageNumber} Russian translation is missing.`);
    }
  });
  return manifest;
}
