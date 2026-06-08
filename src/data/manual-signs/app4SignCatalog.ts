import app4SignInventory from "./app4SignEntries.json";

export type ManualSignRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ManualSignCropAuditBasis = {
  auditId: string;
  method: string;
  outputPixelTargetPass: boolean;
  sourceBoundsPass: boolean;
  standardSourceBoundsPass: boolean;
  slenderSourceBoundsPass: boolean;
  minimumRelativeSourceWidthRatio: number;
  minimumRelativeSourceHeightRatio: number;
  relativeSourceWidthRatio: number;
  relativeSourceHeightRatio: number;
  hasTrimmedContent: boolean;
  candidateRegionAtBaseScale: ManualSignRegion;
  contentTrimBoundsAtCandidateScale: ManualSignRegion;
  finalSourceRegionAtBaseScale: ManualSignRegion;
  edgeContact: {
    left: boolean;
    top: boolean;
    right: boolean;
    bottom: boolean;
  };
  edgeContactSides: Array<"left" | "top" | "right" | "bottom">;
  edgeContactPolicy: "no-edge-contact" | "allowed-only-when-relative-source-coverage-meets-thresholds";
  edgeContactPass: boolean;
  edgeContactMinimumRelativeWidthRatio: number;
  edgeContactMinimumRelativeHeightRatio: number;
  warningRightEdgeGuardPass: boolean;
  warningLeftEdgeGuardPass: boolean;
  neighborContaminationGuardPass: boolean;
  warningHorizontalEdgeMaximumRelativeWidthRatio: number;
  passes: boolean;
};

export type ManualSignEntry = {
  id: string;
  sectionId: string;
  sourcePage: number;
  sourceOrder: number;
  sourceOrderWithinPage: number;
  entryKind: "catalog-entry" | "category-heading" | "contextual-visual";
  spanishLabel: string;
  variant?: string;
  russianTranslation: string;
  sourceSheetLabelEvidence: string;
  auditStatus: "reconciled-source-visual" | "pending-reconciliation" | "reviewed-final-correct" | "category-heading-dom";
  sourceRef: string;
  sourceAsset: string;
  sourceRegion: ManualSignRegion | null;
  assetPath: string | null;
  naturalWidth: number | null;
  naturalHeight: number | null;
  cropRegion: ManualSignRegion | null;
  displayRegion: ManualSignRegion | null;
  cropNaturalWidth: number | null;
  cropNaturalHeight: number | null;
  renderMode: "individual-source-crop-3x" | "category-heading-dom" | "source-image-css-clip";
  hash: string | null;
  extractionMethod: string;
  noUpscale: true;
  preservationNote: string;
  baselineSourceAsset?: string;
  baselineSourceRegion?: ManualSignRegion;
  baselineCropRegion?: ManualSignRegion;
  baselineCropNaturalWidth?: number;
  baselineCropNaturalHeight?: number;
  baselineRenderMode?: "source-image-css-clip";
  baselineAssetHash?: string;
  baselineExtractionMethod?: string;
  disposition?: string;
  sourceEvaluationId?: string | null;
  chosenSourceId?: string;
  finalSourceDocument?: string;
  finalSourceTrustTier?: string;
  finalSourcePageOrItem?: string;
  finalCandidateRegionAtBaseScale?: ManualSignRegion;
  finalSourceRegionAtBaseScale?: ManualSignRegion;
  finalContentTrimBoundsAtCandidateScale?: ManualSignRegion;
  finalTailTrimMode?: "trim-external-catalog-label" | "preserve-colorless-lower-attachment";
  finalOutputAssetPath?: string | null;
  finalOutputNaturalWidth?: number | null;
  finalOutputNaturalHeight?: number | null;
  finalOutputSha256?: string | null;
  finalOutputComposition?: string;
  requiredMinimumWidth?: number | null;
  requiredMinimumHeight?: number | null;
  outputPixelScaleRatioWidth?: number | null;
  outputPixelScaleRatioHeight?: number | null;
  outputPixelTargetRatioWidth?: number | null;
  outputPixelTargetRatioHeight?: number | null;
  effectiveFinalNaturalWidth?: number | null;
  effectiveFinalNaturalHeight?: number | null;
  sourceNativeWidth?: number | null;
  sourceNativeHeight?: number | null;
  qualityScaleRatioWidth?: number | null;
  qualityScaleRatioHeight?: number | null;
  threeXStatus?: "source-limited-exception" | "not-applicable-category-heading" | "passed";
  sourceLimitedExceptionId?: string;
  sourceLimitedDisposition?: "best-official-source-3x-output-pixels" | null;
  sourceLimitedReason?: string;
  cropAuditStatus?: "reviewed-final-correct" | "pending-crop-audit" | "category-heading-dom";
  cropAuditBasis?: ManualSignCropAuditBasis;
  cropAuditNote?: string;
  runtimeDisplayMaxWidth?: number;
  runtimeDisplayMaxHeight?: number;
  noUpscaleProof?: {
    passes: boolean;
    [key: string]: unknown;
  };
  protectedPixelPreservation?: string;
};

type ManualSignInventory = {
  inventoryStatus: "individual-source-regions" | "individual-source-crop-3x-source-limited";
  entries: ManualSignEntry[];
};

export const app4ManualSignInventory = app4SignInventory as ManualSignInventory;
export const app4ManualSignEntries = app4ManualSignInventory.entries;

export function manualSignEntriesForSection(sectionId: string) {
  return app4ManualSignEntries.filter((entry) => entry.sectionId === sectionId);
}
