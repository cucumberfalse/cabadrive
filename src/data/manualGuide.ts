import manualGuideChapter12Registry from "../../content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json";
import { app2DrivingFactorsSection } from "./manual-sections/app2-driving-factors";
import { app2HighwaysHospitalsSection } from "./manual-sections/app2-highways-hospitals";
import { app2SafeDrivingSection } from "./manual-sections/app2-safe-driving";
import { app2SafetyElementsSection } from "./manual-sections/app2-safety-elements";
import { app2SocialResponsibilitySection } from "./manual-sections/app2-social-responsibility";
import { app1OtherRequiredSafetyElementsSection } from "./manual-sections/app1-other-required-safety-elements";
import { app1RecommendedSafetyElementsSection } from "./manual-sections/app1-recommended-safety-elements";
import { app1SafetyElementsSection } from "./manual-sections/app1-safety-elements";
import { ch5AnticipatoryEfficientDrivingSection } from "./manual-sections/ch5-anticipatory-efficient-driving";
import { ch5AttitudeTypesSection } from "./manual-sections/ch5-attitude-types";
import { ch5EqualSocietySection } from "./manual-sections/ch5-equal-society";
import { ch5GenderViolencePreventionSection } from "./manual-sections/ch5-gender-violence-prevention";
import { ch4AlcoholDrugsSection } from "./manual-sections/ch4-alcohol-drugs";
import { ch4DistractionsSection } from "./manual-sections/ch4-distractions";
import { ch4SleepFatigueSection } from "./manual-sections/ch4-sleep-fatigue";
import { ch4StressSection } from "./manual-sections/ch4-stress";
import { ch3AdverseConditionsSection } from "./manual-sections/ch3-adverse-conditions";
import { ch3HighwaysSection } from "./manual-sections/ch3-highways";
import { ch3LightsSection } from "./manual-sections/ch3-lights";
import { ch3OvertakingSection } from "./manual-sections/ch3-overtaking";
import { ch3PriorityOfRulesSection } from "./manual-sections/ch3-priority-of-rules";
import { ch3RightOfWaySection } from "./manual-sections/ch3-right-of-way";
import { ch3SpeedSection } from "./manual-sections/ch3-speed";
import { ch3StoppingParkingSection } from "./manual-sections/ch3-stopping-parking";
import { ch3TurnsSection } from "./manual-sections/ch3-turns";
import { ch1BicycleSection } from "./manual-sections/ch1-bicycle";
import { ch1CitiesForPeopleSection } from "./manual-sections/ch1-cities-for-people";
import { ch1PedestrianPrioritySection } from "./manual-sections/ch1-pedestrian-priority";
import { ch1PublicTransportSystemSection } from "./manual-sections/ch1-public-transport-system";
import { ch1SharedTripSection } from "./manual-sections/ch1-shared-trip";
import { ch1SustainableMobilitySection } from "./manual-sections/ch1-sustainable-mobility";
import { ch2IncidentObligationsSection } from "./manual-sections/ch2-incident-obligations";
import { ch2LegalResponsibilitySection } from "./manual-sections/ch2-legal-responsibility";
import { ch2RequiredDocumentsSection } from "./manual-sections/ch2-required-documents";
import { ch2ScoringSection } from "./manual-sections/ch2-scoring";
import {
  introductionDocumentStyleGuide,
  introductionNavigation,
  type IntroductionRouteId
} from "./pandemiaVialSection";

export type ManualGuideStatus = "pending" | "active";
export type ManualGuideSectionStatus = "pending" | "implemented";

type OriginalSourceImageTextException = {
  kind: "source-image-original-visible-text" | "source-document-example-original-visible-text";
  visibleSpanishScope: "source-image-only" | "source-document-example-image-only";
  sourceAsIs: true;
  russianExplanationOutsideImage: true;
};

export type ManualGuideSourcePage = {
  sourcePage: number;
  manualManifestPointer: string;
  layoutManifestPointer: string;
  referenceAsset: string;
};

export type ManualGuideSourceBoundaryEvidence = {
  sharedSourcePage: number;
  ownedRegion: string;
  ownedLayoutBlockIdsOnSharedPage: string[];
  boundaryEvidence: string;
  startsAtLayoutBlockId?: string;
  startsAtSourceTextEs?: string;
  endsBeforeLayoutBlockId?: string;
  excludesSectionId?: string;
  omittedClosingSourcePage?: number;
};

export type ManualGuideSectionEntry = {
  id: string;
  kind: "content-section";
  labelRu: string;
  sourceTitleEs: string;
  routeHash: string;
  sourcePageRange: {
    start: number;
    end: number;
  };
  topicNavigationStartPage?: number;
  sourcePages: ManualGuideSourcePage[];
  status: ManualGuideSectionStatus;
  parentChapterId: string;
  sectionContentModulePath: string;
  sourceRegionMetadataStatus: "pending_until_section_pr" | "recorded";
  visualEvidenceStatus: "pending_until_section_pr" | "recorded";
  sourceBoundaryEvidence?: ManualGuideSourceBoundaryEvidence | ManualGuideSourceBoundaryEvidence[];
  pendingReason?: string;
};

export type ManualGuideNavigationChild = {
  id: string;
  kind: "topic";
  labelRu: string;
  sourceTitleEs: string;
  sourcePage?: number;
  endPage?: number;
  status: ManualGuideStatus;
  routeHash?: string;
  introductionRouteId?: IntroductionRouteId;
  section?: ManualGuideSectionEntry;
};

export type ManualGuideNavigationEntry = {
  id: string;
  kind: "support" | "group" | "annex";
  labelRu: string;
  sourceTitleEs: string;
  sourcePage?: number;
  requiredPrintedPage?: number;
  status: ManualGuideStatus;
  children?: ManualGuideNavigationChild[];
};

type ManualGuideRegistrySection = Omit<ManualGuideSectionEntry, "kind">;
type ManualGuideRegistryChapter = {
  id: string;
  labelRu: string;
  sourceTitleEs: string;
  sourcePageRange: {
    start: number;
    end: number;
  };
  requiredPrintedPage: number;
  status: ManualGuideStatus;
  sectionIds: string[];
};
type ManualGuideChapter12Registry = {
  schemaVersion: 2;
  manualId: string;
  featureId: string;
  registryScope: string;
  sourcePageRange: {
    start: number;
    end: number;
  };
  skippedSourcePages: {
    sourcePage: number;
    reason: string;
    parentChapterId: string;
    sourceTitleEs: string;
    disposition: string;
  }[];
  sharedSourcePageOwnership?: {
    sourcePage: number;
    referenceAsset: string;
    reason: string;
    sourceEvidence: string;
    sectionBoundaries: {
      sectionId: string;
      ownedRegion: string;
      ownedLayoutBlockIdsOnSharedPage: string[];
      startsAtLayoutBlockId?: string;
      startsAtSourceTextEs?: string;
      endsBeforeLayoutBlockId?: string;
      excludesSectionId?: string;
      omittedClosingSourcePage?: number;
    }[];
  }[];
  chapters: ManualGuideRegistryChapter[];
  sections: ManualGuideRegistrySection[];
};

export type ManualGuideContentBlock =
  | {
      id: string;
      kind: "lead" | "paragraph" | "callout" | "quote";
      textRu: string;
      sourceTextEs: string;
    }
  | {
      id: string;
      kind: "list";
      titleRu?: string;
      itemsRu: string[];
      sourceTextEs: string;
    }
  | {
      id: string;
      kind: "table";
      titleRu: string;
      sourceTextEs: string;
      columnsRu: string[];
      rows: {
        id: string;
        cellsRu: string[];
      }[];
      captionRu?: string;
    }
  | {
      id: string;
      kind: "source-artwork";
      titleRu?: string;
      altRu: string;
      assetPath: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      visibleSpanish: false;
      cleanupStatus: string;
      captionRu?: string;
    }
  | {
      id: string;
      kind: "principle-pair";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      leftRu: string;
      rightRu: string;
      closingRu?: string;
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "principle-note";
      textRu: string;
      sourceTextEs: string;
    }
  | {
      id: string;
      kind: "mobility-context";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      cityLabelRu: string;
      cityStats: {
        valueRu: string;
        labelRu: string;
      }[];
      trips: {
        titleRu: string;
        interjurisdictionalRu: string;
        internalRu: string;
        residentShareRu: string;
        inboundShareRu: string;
      };
      space: {
        titleRu: string;
        assetPath: string;
        modes: {
          id: string;
          labelRu: string;
        }[];
      };
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "vulnerability-ranking";
      titleRu: string;
      sourceTextEs: string;
      introRu: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      assetPath: string;
      levels: {
        rankRu: string;
        labelRu: string;
      }[];
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "pedestrian-photo-comparison";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      assetPath: string;
      beforeLabelRu: string;
      afterLabelRu: string;
      captionRu: string;
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "impact-diagram";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      bodyAssetPath: string;
      carAssetPath: string;
      targetAssetPath: string;
      phases: {
        id: string;
        color: "blue" | "yellow" | "dark" | "gray";
        labelRu: string;
        textRu: string;
      }[];
      footnoteRu: string;
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "pedestrian-infrastructure";
      titleRu: string;
      sourceTextEs: string;
      cards: {
        id: string;
        titleRu: string;
        sourcePage: number;
        sourceRegion: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
        assetPath?: string;
        altRu?: string;
        visibleSpanish?: boolean;
        officialSignException?: {
          kind: "official-traffic-sign-source-as-is";
          visibleSpanishScope: "official-sign-image-only";
          sourceAsIs: true;
        };
        sourceImageException?: OriginalSourceImageTextException;
        details: {
          labelRu: string;
          textRu: string;
        }[];
        noteRu?: string;
      }[];
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "priority-area-map";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      assetPath: string;
      visibleSpanish?: boolean;
      sourceImageException?: OriginalSourceImageTextException;
      areasRu: string;
      legend: {
        id: string;
        color: "gray" | "cyan" | "blue";
        labelRu: string;
      }[];
      captionRu: string;
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "transport-mode-icons";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      assetPath: string;
      modes: {
        id: string;
        labelRu: string;
      }[];
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "bicycle-benefits";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      assetPath: string;
      benefits: {
        id: string;
        titleRu: string;
        textRu: string;
      }[];
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "bicycle-helmet-fit";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      assetPath: string;
      guidanceRu: string;
      positions: {
        id: string;
        status: "correct" | "wrong";
        labelRu: string;
      }[];
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "bicycle-gear";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      assetPath: string;
      items: {
        id: string;
        titleRu: string;
        textRu: string;
      }[];
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "bicycle-signage";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      assetPath: string;
      altRu: string;
      visibleSpanish: true;
      officialSignException: {
        kind: "official-traffic-sign-source-as-is";
        visibleSpanishScope: "official-sign-image-only";
        sourceAsIs: true;
      };
      noticeItemsRu: string[];
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "bicycle-posture";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      assetPath: string;
      labels: {
        id: string;
        titleRu: string;
        textRu: string;
      }[];
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "bicycle-distance";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      examples: {
        id: string;
        status: "safe" | "unsafe";
        titleRu: string;
        assetPath: string;
        badgeRu?: string;
        visibleSpanish?: boolean;
        sourceImageException?: OriginalSourceImageTextException;
        textRu: string;
      }[];
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "bicycle-hand-signals";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      assetPath: string;
      signals: {
        id: string;
        titleRu: string;
        textRu: string;
      }[];
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "public-transport-comparison";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      assetPath: string;
      visibleSpanish: boolean;
      facts: {
        id: string;
        valueRu: string;
        labelRu: string;
      }[];
      captionRu: string;
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "public-transport-infrastructure";
      titleRu: string;
      sourceTextEs: string;
      cards: {
        id: string;
        titleRu: string;
        sourcePage: number;
        sourceRegion: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
        assetPath: string;
        altRu: string;
        visibleSpanish: boolean;
        sourceImageException?: OriginalSourceImageTextException;
        details: {
          labelRu: string;
          textRu: string;
        }[];
        noteRu?: string;
      }[];
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "shared-trip-benefits";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      assetPath: string;
      altRu: string;
      visibleSpanish: false;
      introRu: string;
      benefits: {
        id: string;
        titleRu: string;
        textRu: string;
      }[];
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "shared-trip-closing";
      titleRu: string;
      sourceTextEs: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      assetPath: string;
      altRu: string;
      visibleSpanish: true;
      sourceImageException: OriginalSourceImageTextException;
      quoteRu: string;
      captionRu: string;
      visualNotes: string[];
    }
  | {
      id: string;
      kind: "source-image-cards";
      titleRu: string;
      sourceTextEs: string;
      cards: {
        id: string;
        titleRu: string;
        sourcePage: number;
        sourceRegion: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
        assetPath: string;
        altRu: string;
        visibleSpanish: boolean;
        sourceImageException?: OriginalSourceImageTextException;
        russianOverlayLabels?: {
          id: string;
          textRu: string;
          xPct: number;
          yPct: number;
          widthPct: number;
          heightPct: number;
          tone: "light-on-blue" | "dark-on-light";
        }[];
        bodyRu: string;
      }[];
      visualNotes: string[];
    };

export type ManualGuideSectionContent = {
  id: string;
  sectionId: string;
  titleRu: string;
  sourcePages: number[];
  sourceTitleEs: string;
  status: "implemented";
  styleTokenFamilies: string[];
  visualEvidence: {
    checkerStatus: "pending" | "pass" | "fail";
    sourceScreenshots: string[];
    russianScreenshots: string[];
    notes: string[];
  };
  blocks: ManualGuideContentBlock[];
};

const chapter12Registry = manualGuideChapter12Registry as ManualGuideChapter12Registry;

function toManualSectionEntry(section: ManualGuideRegistrySection): ManualGuideSectionEntry {
  return {
    ...section,
    kind: "content-section"
  };
}

export const chapter12ManualGuideSections = chapter12Registry.sections.map(toManualSectionEntry);
export const manualGuideSectionById = new Map(chapter12ManualGuideSections.map((section) => [section.id, section]));
export const manualGuideSectionByHash = new Map(chapter12ManualGuideSections.map((section) => [section.routeHash, section]));

function sectionForId(sectionId: string) {
  const section = manualGuideSectionById.get(sectionId);
  if (!section) throw new Error(`Missing manual guide section registry entry ${sectionId}`);
  return section;
}

function sourcePageLabel(section: ManualGuideSectionEntry) {
  if (section.sourcePageRange.start === section.sourcePageRange.end) return String(section.sourcePageRange.start);
  return `${section.sourcePageRange.start}-${section.sourcePageRange.end}`;
}

export const implementedManualGuideSections: ManualGuideSectionContent[] = [
  ch1CitiesForPeopleSection,
  ch1SustainableMobilitySection,
  ch1PedestrianPrioritySection,
  ch1BicycleSection,
  ch1PublicTransportSystemSection,
  ch1SharedTripSection,
  ch2LegalResponsibilitySection,
  ch2RequiredDocumentsSection,
  ch2IncidentObligationsSection,
  ch2ScoringSection,
  ch3PriorityOfRulesSection,
  ch3RightOfWaySection,
  ch3LightsSection,
  ch3SpeedSection,
  ch3TurnsSection,
  ch3OvertakingSection,
  ch3HighwaysSection,
  ch3AdverseConditionsSection,
  ch3StoppingParkingSection,
  ch4AlcoholDrugsSection,
  ch4SleepFatigueSection,
  ch4StressSection,
  ch4DistractionsSection,
  ch5AttitudeTypesSection,
  ch5EqualSocietySection,
  ch5GenderViolencePreventionSection,
  ch5AnticipatoryEfficientDrivingSection,
  app1SafetyElementsSection,
  app1OtherRequiredSafetyElementsSection,
  app1RecommendedSafetyElementsSection,
  app2SocialResponsibilitySection,
  app2SafetyElementsSection,
  app2DrivingFactorsSection,
  app2SafeDrivingSection,
  app2HighwaysHospitalsSection
];
export const manualGuideSectionContentById = new Map(implementedManualGuideSections.map((section) => [section.sectionId, section]));

export const manualGuideDocumentStyleTokens = {
  id: "manual-guide-document-style-v2",
  inherits: introductionDocumentStyleGuide.id,
  sharedTokens: introductionDocumentStyleGuide.tokens,
  blockFamilies: [
    {
      id: "manual-prose",
      description: "Responsive selectable Russian prose, lists, and headings outside fixed visual scrollers.",
      tokenSource: "introductionDocumentStyleGuide.tokens"
    },
    {
      id: "manual-callout-blue",
      description: "Blue law/recommendation callout family reused from Introduction callouts unless source evidence records a variant.",
      tokenSource: "introductionDocumentStyleGuide.tokens.callout"
    },
    {
      id: "manual-section-heading",
      description: "Native section-opening treatment for source Índice topics; divider-only source pages stay navigation metadata only.",
      tokenSource: "manual-guide-document-style-v2"
    },
    {
      id: "manual-principle-pair",
      description: "Centered teal typographic relationship for paired traffic-system principles such as ПЛАВНОСТЬ / БЕЗОПАСНОСТЬ.",
      tokenSource: "source page 22 Ciudades para las personas"
    },
    {
      id: "manual-source-artwork",
      description: "Source-faithful local crops or visually indistinguishable reconstructions with selectable Russian labels where needed.",
      tokenSource: "manual-guide-source-fidelity"
    },
    {
      id: "manual-mobility-context",
      description: "Page 23 city-context, daily-trip, and modal-space infographic layout using native Russian DOM labels plus source-derived non-text artwork crops.",
      tokenSource: "source page 23 ¿Qué es la movilidad sustentable?"
    },
    {
      id: "manual-vulnerability-order",
      description: "Page 23 vulnerability hierarchy strip preserving source order, ranking numbers, and source-derived vehicle/pedestrian pictograms with Russian DOM labels.",
      tokenSource: "source page 23 Uso de la vía pública de acuerdo a la Vulnerabilidad"
    },
    {
      id: "manual-pedestrian-priority-visuals",
      description: "Pages 24-29 pedestrian-priority photo comparisons, impact diagram, infrastructure cards, priority-area map, restriction signs, and circulation icons with source-derived non-text crops plus Russian DOM labels.",
      tokenSource: "source pages 24-29 Prioridad peatonal"
    },
    {
      id: "manual-bicycle-visuals",
      description: "Pages 30-38 bicycle, helmet, source-as-is official sign sheet, gesture, lane, parking, Ecobici, and scooter visuals using local source crops plus selectable Russian DOM explanation outside sign imagery.",
      tokenSource: "source pages 30-38 Bicicleta"
    },
    {
      id: "manual-public-transport-visuals",
      description: "Pages 39-40 public-transport avenue comparison, yellow boxes, bus platforms, exclusive lanes, Metrobus, and transfer-center visuals using high-quality original source crops plus Russian DOM explanation outside sign-like markings.",
      tokenSource: "source pages 39-40 Sistema de transporte publico"
    },
    {
      id: "manual-shared-trip-visuals",
      description: "Pages 41-42 shared-trip carpool diagram and mobility-priority photo using high-quality original source crops, with embedded source text left source-as-is and Russian explanation outside images.",
      tokenSource: "source pages 41-42 Viaje compartido"
    },
    {
      id: "manual-legal-detail",
      description: "Dense legal/document/responsibility blocks that preserve numbers, document names, obligations, and exceptions.",
      tokenSource: "manual-guide-document-style-v2"
    }
  ],
  rules: [
    "Pending sections expose only disabled navigation metadata and no article body or fake placeholder content.",
    "Implemented sections must provide source-region metadata for each meaningful source page/region, local asset metadata, screenshot evidence, visible-Spanish status, and checker pass/fail output.",
    "Normal prose uses shared Introduction article typography and selectable DOM text.",
    "Fixed infographic blocks may scroll horizontally only inside their own visual frame.",
    "Divider-only source PDF pages 21, 43, 57, 89, and 98 and the book-only closing slogan on source PDF page 56 are skipped as standalone learner pages/routes/modules.",
    "Appendix I divider-only source PDF page 104 is represented by the Appendix I navigation parent, not a standalone learner page/route/module.",
    "Shared source PDF page 55 is split by explicit layout-block ownership: incident obligations before page-055-block-08, Scoring from page-055-block-08 through footnotes.",
    "Shared source PDF page 94 is split between sleep/fatigue and stress; shared source PDF page 95 is split between stress recommendations and distractions.",
    "Shared source PDF pages 99, 100, and 101 preserve Chapter 5 source-topic boundaries across attitude/equality, equality/gender-violence support, and gender-violence/preventive-efficient-driving sections.",
    "Generic icons, broad masks, DOM plates, remote assets, full-page raster bases, side-by-side translation layouts, and translated/reconstructed traffic sign renderings are forbidden."
  ]
} as const;

export const manualGuideVisualFidelityEvidenceFormat = {
  id: "manual-guide-source-fidelity-evidence-v2",
  requiredImplementedSectionFields: [
    "sectionId",
    "sourcePages",
    "sourceRegionMetadata",
    "localAssetMetadata",
    "visibleSpanishStatus",
    "selectableTextStatus",
    "desktopScreenshot",
    "mobileScreenshot",
    "boundingBoxChecks",
    "forbiddenPatternScan",
    "visualReviewNotes",
    "checkerResult"
  ],
  pendingSectionFields: [
    "id",
    "routeHash",
    "sourcePageRange",
    "sourcePages",
    "status",
    "sectionContentModulePath",
    "sourceRegionMetadataStatus",
    "visualEvidenceStatus"
  ],
  sourceRegionMetadataFields: ["sourcePage", "sourceRegion", "sourceAssetPath", "cropDimensions", "cropSha256", "cleanupScope"],
  localAssetMetadataFields: ["assetPath", "assetKind", "width", "height", "sha256", "containsText", "visibleSpanish"],
  forbiddenRuntimePatterns: [
    "runtime PDF viewer",
    "full-page raster base",
    "duplicate Руководство 4R destination",
    "side-by-side Spanish/Russian translation",
    "remote manual assets",
    "broad masks or DOM plates",
    "fake pending-section content",
    "raw source-PDF-page guide route"
  ]
} as const;

function childForSection(section: ManualGuideSectionEntry): ManualGuideNavigationChild {
  return {
    id: section.id,
    kind: "topic",
    labelRu: section.labelRu,
    sourceTitleEs: section.sourceTitleEs,
    sourcePage: section.topicNavigationStartPage ?? section.sourcePageRange.start,
    endPage: section.sourcePageRange.end,
    status: section.status === "implemented" ? "active" : "pending",
    routeHash: section.routeHash,
    section
  };
}

const chapter12NavigationEntries: ManualGuideNavigationEntry[] = chapter12Registry.chapters.map((chapter) => {
  const sections = chapter.sectionIds.map(sectionForId);
  return {
    id: chapter.id,
    kind: "group",
    labelRu: chapter.labelRu,
    sourceTitleEs: chapter.sourceTitleEs,
    sourcePage: chapter.sourcePageRange.start,
    requiredPrintedPage: chapter.requiredPrintedPage,
    status: chapter.status,
    children: sections.map(childForSection)
  };
});

function sourcePageRangeDescription(section: ManualGuideSectionEntry) {
  return `source pages ${sourcePageLabel(section)}`;
}

export const manualGuideChapter12SectionSummary = {
  registryScope: chapter12Registry.registryScope,
  sourcePageRange: chapter12Registry.sourcePageRange,
  skippedSourcePages: chapter12Registry.skippedSourcePages,
  sharedSourcePageOwnership: chapter12Registry.sharedSourcePageOwnership ?? [],
  expectedSectionIds: chapter12ManualGuideSections.map((section) => section.id),
  sourcePageRanges: chapter12ManualGuideSections.map((section) => ({
    sectionId: section.id,
    sourcePages: sourcePageRangeDescription(section)
  }))
} as const;

function pendingTopic(id: string, labelRu: string, sourceTitleEs: string): ManualGuideNavigationChild {
  return {
    id,
    kind: "topic",
    labelRu,
    sourceTitleEs,
    status: "pending"
  };
}

export const manualGuideNavigation: ManualGuideNavigationEntry[] = [
  { id: "presentation", kind: "support", labelRu: "Предисловие", sourceTitleEs: "Presentación", status: "pending" },
  { id: "glossary", kind: "support", labelRu: "Глоссарий", sourceTitleEs: "Glosario", status: "pending" },
  {
    id: "introduction",
    kind: "group",
    labelRu: "Введение",
    sourceTitleEs: "INTRODUCCIÓN",
    sourcePage: 13,
    status: "active",
    children: introductionNavigation.map((entry) => ({
      id: entry.id,
      kind: "topic",
      labelRu: entry.titleRu,
      sourceTitleEs: entry.sourceIndexHeadingEs,
      sourcePage: entry.startPage,
      endPage: entry.endPage,
      status: "active" as const,
      routeHash: entry.routeHash,
      introductionRouteId: entry.id
    }))
  },
  ...chapter12NavigationEntries,
  {
    id: "annex-3",
    kind: "annex",
    labelRu: "Приложение III. Грузовой транспорт и перевозка товаров",
    sourceTitleEs: "ANEXO III TRANSPORTE DE CARGA Y MERCADERÍAS",
    sourcePage: 152,
    requiredPrintedPage: 151,
    status: "pending",
    children: [
      pendingTopic("annex-3-profile", "Профиль грузоперевозчика", "Perfil del transportista de cargas"),
      pendingTopic("annex-3-social", "Социальная ответственность", "Una responsabilidad social"),
      pendingTopic("annex-3-factors", "Факторы вождения", "Factores involucrados en la conducción"),
      pendingTopic("annex-3-safe-driving", "Безопасное вождение", "Conducción segura"),
      pendingTopic("annex-3-safety", "Элементы безопасности", "Elementos de seguridad"),
      pendingTopic("annex-3-highways", "Автомагистрали", "Autopistas")
    ]
  },
  {
    id: "annex-4",
    kind: "annex",
    labelRu: "Приложение IV. Дорожные знаки и разметка",
    sourceTitleEs: "ANEXO IV SEÑALES VIALES",
    sourcePage: 184,
    requiredPrintedPage: 183,
    status: "pending",
    children: [
      pendingTopic("annex-4-regulatory", "Предписывающие", "Reglamentarias"),
      pendingTopic("annex-4-warning", "Предупреждающие", "Preventivas"),
      pendingTopic("annex-4-informational", "Информационные", "Informativas"),
      pendingTopic("annex-4-temporary", "Временные", "Transitorias"),
      pendingTopic("annex-4-horizontal", "Горизонтальная разметка", "Horizontales"),
      pendingTopic("annex-4-light", "Световые сигналы", "Señalamiento luminoso")
    ]
  }
];
