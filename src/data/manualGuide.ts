import manualGuideChapter12Registry from "../../content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json";
import { ch1CitiesForPeopleSection } from "./manual-sections/ch1-cities-for-people";
import {
  introductionDocumentStyleGuide,
  introductionNavigation,
  type IntroductionRouteId
} from "./pandemiaVialSection";

export type ManualGuideStatus = "pending" | "active";
export type ManualGuideSectionStatus = "pending" | "implemented";

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
  sourcePages: ManualGuideSourcePage[];
  status: ManualGuideSectionStatus;
  parentChapterId: string;
  sectionContentModulePath: string;
  sourceRegionMetadataStatus: "pending_until_section_pr" | "recorded";
  visualEvidenceStatus: "pending_until_section_pr" | "recorded";
  sourceBoundaryEvidence?: ManualGuideSourceBoundaryEvidence;
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
      closingRu: string;
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

export const implementedManualGuideSections: ManualGuideSectionContent[] = [ch1CitiesForPeopleSection];
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
    "Divider-only source PDF pages 21 and 43 and the book-only closing slogan on source PDF page 56 are skipped as standalone learner pages/routes/modules.",
    "Shared source PDF page 55 is split by explicit layout-block ownership: incident obligations before page-055-block-08, Scoring from page-055-block-08 through footnotes.",
    "Generic icons, broad masks, DOM plates, remote assets, full-page raster bases, and side-by-side translation layouts are forbidden."
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
    sourcePage: section.sourcePageRange.start,
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
    id: "chapter-3",
    kind: "group",
    labelRu: "Глава 3. Основные правила вождения",
    sourceTitleEs: "CAPÍTULO 3: NORMAS BÁSICAS DE CONDUCCIÓN",
    sourcePage: 57,
    requiredPrintedPage: 56,
    status: "pending",
    children: [
      pendingTopic("chapter-3-norm-priority", "Приоритет норм", "Prioridad normativa"),
      pendingTopic("chapter-3-way-priority", "Приоритет проезда", "Prioridades de paso"),
      pendingTopic("chapter-3-lights", "Использование фар", "Uso de luces"),
      pendingTopic("chapter-3-speed", "Скорость", "Velocidad"),
      pendingTopic("chapter-3-turns", "Повороты на перекрестках", "Giros en intersecciones"),
      pendingTopic("chapter-3-overtaking", "Обгон и опережение", "Adelantamiento y sobrepaso"),
      pendingTopic("chapter-3-highways", "Движение по автомагистралям и быстрым дорогам", "Conducción en autopistas y otras vías rápidas"),
      pendingTopic("chapter-3-adverse", "Движение в сложных условиях", "Conducción en situaciones adversas"),
      pendingTopic("chapter-3-parking", "Остановка и стоянка", "Detención y estacionamiento")
    ]
  },
  {
    id: "chapter-4",
    kind: "group",
    labelRu: "Глава 4. Физическое состояние водителя",
    sourceTitleEs: "CAPÍTULO 4: CAPACIDAD NATURAL",
    sourcePage: 89,
    requiredPrintedPage: 88,
    status: "pending",
    children: [
      pendingTopic("chapter-4-alcohol-drugs", "Алкоголь и наркотики", "Ingesta de alcohol y drogas"),
      pendingTopic("chapter-4-fatigue", "Сон и усталость", "Sueño y fatiga"),
      pendingTopic("chapter-4-stress", "Стресс", "Estrés"),
      pendingTopic("chapter-4-distractions", "Отвлечения", "Distracciones")
    ]
  },
  {
    id: "chapter-5",
    kind: "group",
    labelRu: "Глава 5. Поведение за рулем",
    sourceTitleEs: "CAPÍTULO 5: ACTITUD AL CONDUCIR",
    sourcePage: 98,
    requiredPrintedPage: 97,
    status: "pending",
    children: [
      pendingTopic("chapter-5-attitudes", "Типы поведения", "Tipos de actitudes"),
      pendingTopic("chapter-5-equality", "К равному обществу", "Hacia una sociedad igualitaria"),
      pendingTopic("chapter-5-gender-violence", "Профилактика и помощь при гендерном насилии", "Prevención y asistencia en situaciones de violencia de género"),
      pendingTopic("chapter-5-preventive-efficient", "Предупредительное и эффективное вождение", "Conducción preventiva y eficiente")
    ]
  },
  {
    id: "annex-1",
    kind: "annex",
    labelRu: "Приложение I. Легковые автомобили",
    sourceTitleEs: "ANEXO I AUTOMÓVILES PARTICULARES",
    sourcePage: 104,
    requiredPrintedPage: 103,
    status: "pending",
    children: [
      pendingTopic("annex-1-safety", "Элементы безопасности", "Elementos de seguridad"),
      pendingTopic("annex-1-required", "Другие обязательные элементы безопасности", "Otros elementos de seguridad obligatorios"),
      pendingTopic("annex-1-recommended", "Рекомендуемые элементы безопасности", "Elementos de seguridad recomendables")
    ]
  },
  {
    id: "annex-2",
    kind: "annex",
    labelRu: "Приложение II. Пассажирский транспорт",
    sourceTitleEs: "ANEXO II TRANSPORTE DE PASAJEROS/AS",
    sourcePage: 123,
    requiredPrintedPage: 122,
    status: "pending",
    children: [
      pendingTopic("annex-2-social", "Социальная ответственность", "Una responsabilidad social"),
      pendingTopic("annex-2-safety", "Элементы безопасности", "Elementos de seguridad"),
      pendingTopic("annex-2-factors", "Факторы вождения", "Factores involucrados en la conducción"),
      pendingTopic("annex-2-safe-driving", "Безопасное вождение", "Conducción segura"),
      pendingTopic("annex-2-highways-hospitals", "Автомагистрали и больницы", "Autopistas y Hospitales")
    ]
  },
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
