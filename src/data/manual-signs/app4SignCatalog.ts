import app4SignInventory from "./app4SignEntries.json";

export type ManualSignRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
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
  auditStatus: "reviewed-final-correct" | "category-heading-dom";
  assetPath: string | null;
  naturalWidth: number | null;
  naturalHeight: number | null;
  renderMode: "individual-source-crop-3x" | "category-heading-dom";
  noUpscale: true;
  finalSourceRegionAtBaseScale?: ManualSignRegion;
  finalOutputNaturalWidth?: number | null;
  finalOutputNaturalHeight?: number | null;
  threeXStatus?: "source-limited-exception" | "not-applicable-category-heading";
  sourceLimitedDisposition?: "best-official-source-3x-output-pixels" | null;
  sourceLimitedReason?: string;
  cropAuditStatus?: "reviewed-final-correct" | "category-heading-dom";
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
