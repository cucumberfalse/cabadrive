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
  sourceSheetLabelEvidence: string;
  auditStatus: "reconciled-source-visual" | "pending-reconciliation";
  sourceRef: string;
  sourceAsset: string;
  sourceRegion: ManualSignRegion | null;
  assetPath: string;
  naturalWidth: number;
  naturalHeight: number;
  cropRegion: ManualSignRegion;
  displayRegion: ManualSignRegion;
  cropNaturalWidth: number;
  cropNaturalHeight: number;
  renderMode: "source-image-css-clip";
  hash: string;
  extractionMethod: string;
  noUpscale: true;
  preservationNote: string;
};

type ManualSignInventory = {
  inventoryStatus: "individual-source-regions";
  entries: ManualSignEntry[];
};

export const app4ManualSignInventory = app4SignInventory as ManualSignInventory;
export const app4ManualSignEntries = app4ManualSignInventory.entries;

export function manualSignEntriesForSection(sectionId: string) {
  return app4ManualSignEntries.filter((entry) => entry.sectionId === sectionId);
}
