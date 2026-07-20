import manualRuJson from "../../content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json";
import manualLayoutRuJson from "../../content/manuals/gcba-manual-vehiculo-4-ruedas-2023/layout.ru.json";
import manualNavigationRuJson from "../../content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json";

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

export type ManualPageBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ManualLayoutBlockType =
  | "heading"
  | "body"
  | "list"
  | "tableCell"
  | "caption"
  | "callout"
  | "footnote"
  | "pageNumber"
  | "label";

export type ManualLayoutBlock = {
  id: string;
  type: ManualLayoutBlockType;
  order: number;
  textRu: string;
  bounds: ManualPageBounds;
  typography: {
    role: "prominent" | "flow";
    fit: "absolute-fit";
    fontScale: number;
    lineHeight: number;
    maxLines: number;
  };
  provenance: {
    translationManifestPath: string;
    translationJsonPointer: string;
    sourceChunkId?: string;
    sourceEvidence: "approved_primary_source_chunk" | "manual_visual_label_translation";
  };
};

export type ManualPageLayout = {
  pageNumber: number;
  sourcePageNumber: number;
  layoutKind: "section-divider" | "visual-heavy" | "index" | "front-matter" | "text";
  canvas: {
    width: number;
    height: number;
    unit: "px";
    aspectRatio: number;
  };
  visualBase: ManualVisualAsset & {
    strategy: "page_faithful_pdf_render_under_russian_text_layer";
  };
  masks: Array<{
    id: string;
    purpose: "replace_visible_source_text_with_russian_layout";
    role?: string;
    sourceGeometry?:
      | "source_page_text_region"
      | "source_page_caption_region"
      | "source_page_label_region";
    bounds: ManualPageBounds;
    fill: string;
    opacity: number;
    sourceTextEs?: string;
    provenance?: {
      method: string;
      sourcePageNumber?: number;
      visualAssetPath?: string;
      sourceTextPointer?: string;
      sourceLineStart?: number;
      sourceLineEnd?: number;
      sourceTextSha256?: string;
      sourceChunkId?: string;
    };
  }>;
  textRegions: Array<{
    id: string;
    bounds: ManualPageBounds;
    fit: "absolute-positioned-blocks";
    fontScale: number;
  }>;
  visualRegions: Array<{
    id: string;
    type: string;
    bounds: ManualPageBounds;
    preservedFrom: string;
  }>;
  blocks: ManualLayoutBlock[];
  coverage: {
    translationSource: string;
    blockCount: number;
    normalizedTranslationSha256: string;
    normalizedBlocksSha256: string;
    reconstruction: string;
  };
};

export type ManualLayoutManifest = {
  schema: "cabadrive-manual-layout-ru.v1";
  version: number;
  manualId: string;
  locale: "ru";
  strategy: "html_css_russian_text_layer_over_local_page_visual";
  source: {
    manualManifestPath: string;
    manualManifestVersion: number;
    translationFingerprint: string;
    visualAssetDirectory: string;
    canvasWidth: number;
    canvasHeight: number;
  };
  coverage: {
    requiredPages: number;
    pages: number;
    blockTypes: Record<ManualLayoutBlockType, number>;
  };
  pages: ManualPageLayout[];
};

export type ManualNavigationLevel = "frontMatter" | "chapter" | "appendix" | "topic";

export type ManualNavigationEntry = {
  id: string;
  titleRu: string;
  titleEs?: string;
  level: ManualNavigationLevel;
  startPage: number;
  endPage: number;
  sourceEvidence: "index_pages_11_12" | "page_heading" | "curated_manual_review";
  requiredPrintedPage?: number;
  children?: ManualNavigationEntry[];
};

export type ManualNavigationManifest = {
  schema: "cabadrive-manual-navigation-ru.v1";
  version: number;
  manualId: string;
  locale: "ru";
  source: {
    manualManifestPath: string;
    indexPdfPages: number[];
    indexPrintedPages: number[];
    indexTextSha256: string;
    printedToPdfPageMapping: string;
  };
  pageCount: number;
  entries: ManualNavigationEntry[];
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
export const manual4RuedasLayoutRu = manualLayoutRuJson as ManualLayoutManifest;
export const manual4RuedasNavigationRu = manualNavigationRuJson as ManualNavigationManifest;

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
    localAssets: manifest.pages.filter((page) =>
      page.visualAsset.localPath.startsWith("content/assets/"),
    ).length,
    reusedTranslations: manifest.pages.filter(
      (page) => page.translation.status === "reused_primary_source_chunk",
    ).length,
    visualTextTranslations: manifest.pages.filter(
      (page) => page.translation.status === "manual_visual_text",
    ).length,
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
      throw new Error(
        `Manual page ${expectedPageNumber} visual asset is not a local content asset.`,
      );
    }
    if (!page.translation.fullTranslationRu.trim()) {
      throw new Error(`Manual page ${expectedPageNumber} Russian translation is missing.`);
    }
  });
  return manifest;
}

export function assertManualLayoutRuntimeShape(
  manifest: ManualRuManifest = manual4RuedasRu,
  layout: ManualLayoutManifest = manual4RuedasLayoutRu,
  navigation: ManualNavigationManifest = manual4RuedasNavigationRu,
) {
  assertManualManifestRuntimeShape(manifest);
  if (layout.schema !== "cabadrive-manual-layout-ru.v1" || layout.locale !== "ru") {
    throw new Error("Manual layout manifest schema is invalid.");
  }
  if (layout.pages.length !== manifest.pages.length) {
    throw new Error("Manual layout page count is incomplete.");
  }
  if (navigation.schema !== "cabadrive-manual-navigation-ru.v1" || navigation.locale !== "ru") {
    throw new Error("Manual navigation manifest schema is invalid.");
  }
  if (navigation.pageCount !== manifest.source.pageCount || navigation.entries.length < 1) {
    throw new Error("Manual navigation manifest is incomplete.");
  }
  layout.pages.forEach((pageLayout, index) => {
    const page = manifest.pages[index];
    const expectedPageNumber = index + 1;
    if (pageLayout.pageNumber !== expectedPageNumber) {
      throw new Error(`Manual layout page ${expectedPageNumber} is out of order.`);
    }
    if (pageLayout.visualBase.localPath !== page.visualAsset.localPath) {
      throw new Error(`Manual layout page ${expectedPageNumber} visual base is stale.`);
    }
    if (!pageLayout.blocks.length) {
      throw new Error(`Manual layout page ${expectedPageNumber} has no Russian layout blocks.`);
    }
  });
  return { manifest, layout, navigation };
}
