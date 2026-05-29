import manualGuideChapter12Registry from "../../content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/page-registry.chapters-1-2.json";
import { manualPage021 } from "./manual-pages/manual-page-021";
import {
  introductionDocumentStyleGuide,
  introductionNavigation,
  type IntroductionRouteId
} from "./pandemiaVialSection";

export type ManualGuideStatus = "pending" | "active";
export type ManualGuidePageStatus = "pending" | "implemented";

export type ManualGuidePageEntry = {
  id: string;
  kind: "content-page";
  labelRu: string;
  routeHash: string;
  sourcePage: number;
  status: ManualGuidePageStatus;
  parentChapterId: string;
  parentTopicId: string | null;
  placement: "chapter-divider" | "topic-page";
  source: {
    manualManifestPointer: string;
    layoutManifestPointer: string;
    referenceAsset: string;
  };
  pageContentModulePath: string;
  sourceRegionMetadataStatus: "pending_until_page_pr" | "recorded";
  visualEvidenceStatus: "pending_until_page_pr" | "recorded";
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
  pages?: ManualGuidePageEntry[];
};

export type ManualGuideNavigationEntry = {
  id: string;
  kind: "support" | "group" | "annex";
  labelRu: string;
  sourceTitleEs: string;
  sourcePage?: number;
  requiredPrintedPage?: number;
  status: ManualGuideStatus;
  pages?: ManualGuidePageEntry[];
  children?: ManualGuideNavigationChild[];
};

type ManualGuideRegistryPage = Omit<ManualGuidePageEntry, "kind">;
type ManualGuideRegistryTopic = {
  id: string;
  labelRu: string;
  sourceTitleEs: string;
  sourcePage: number;
  endPage: number;
  status: ManualGuideStatus;
  pageIds: string[];
};
type ManualGuideRegistryChapter = {
  id: string;
  labelRu: string;
  sourceTitleEs: string;
  sourcePage: number;
  requiredPrintedPage: number;
  status: ManualGuideStatus;
  chapterPageIds: string[];
  topics: ManualGuideRegistryTopic[];
};
type ManualGuideChapter12Registry = {
  schemaVersion: 1;
  manualId: string;
  featureId: string;
  registryScope: string;
  pageRange: {
    start: number;
    end: number;
  };
  chapters: ManualGuideRegistryChapter[];
  pages: ManualGuideRegistryPage[];
};

export type ManualGuideContentBlock =
  | {
      id: string;
      kind: "chapter-divider";
      eyebrowRu: string;
      titleRu: string;
      subtitleRu?: string;
      sourceTextEs: string;
      panelAssetPath: string;
      sourcePage: number;
      sourceRegion: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      visibleSpanish: false;
      cleanupStatus: string;
    }
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
    };

export type ManualGuidePageContent = {
  id: string;
  pageId: string;
  titleRu: string;
  sourcePage: number;
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

function toManualPageEntry(page: ManualGuideRegistryPage): ManualGuidePageEntry {
  return {
    ...page,
    kind: "content-page"
  };
}

export const chapter12ManualGuidePages = chapter12Registry.pages.map(toManualPageEntry);
export const manualGuidePageById = new Map(chapter12ManualGuidePages.map((page) => [page.id, page]));
export const manualGuidePageByHash = new Map(chapter12ManualGuidePages.map((page) => [page.routeHash, page]));

function pagesForIds(pageIds: string[]) {
  return pageIds.map((pageId) => {
    const page = manualGuidePageById.get(pageId);
    if (!page) throw new Error(`Missing manual guide page registry entry ${pageId}`);
    return page;
  });
}

export const implementedManualGuidePages: ManualGuidePageContent[] = [manualPage021];
export const manualGuidePageContentById = new Map(implementedManualGuidePages.map((page) => [page.pageId, page]));

export const manualGuideDocumentStyleTokens = {
  id: "manual-guide-document-style-v1",
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
      id: "manual-chapter-divider",
      description: "Native chapter-opening page treatment for source divider pages such as manual-page-021 and manual-page-043.",
      tokenSource: "manual-guide-document-style-v1"
    },
    {
      id: "manual-source-artwork",
      description: "Source-faithful local crops or visually indistinguishable reconstructions with selectable Russian labels where needed.",
      tokenSource: "manual-guide-source-fidelity"
    },
    {
      id: "manual-legal-detail",
      description: "Dense legal/document/responsibility blocks that preserve numbers, document names, obligations, and exceptions.",
      tokenSource: "manual-guide-document-style-v1"
    }
  ],
  rules: [
    "Pending pages expose only disabled navigation metadata and no article body or fake placeholder content.",
    "Implemented pages must provide source-region metadata, local asset metadata, screenshot evidence, visible-Spanish status, and checker pass/fail output.",
    "Normal prose uses shared Introduction article typography and selectable DOM text.",
    "Fixed infographic blocks may scroll horizontally only inside their own visual frame.",
    "Generic icons, broad masks, DOM plates, remote assets, full-page raster bases, and side-by-side translation layouts are forbidden."
  ]
} as const;

export const manualGuideVisualFidelityEvidenceFormat = {
  id: "manual-guide-source-fidelity-evidence-v1",
  requiredImplementedPageFields: [
    "pageId",
    "sourcePage",
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
  pendingPageFields: [
    "id",
    "routeHash",
    "sourcePage",
    "status",
    "source.manualManifestPointer",
    "source.layoutManifestPointer",
    "source.referenceAsset",
    "sourceRegionMetadataStatus",
    "visualEvidenceStatus"
  ],
  forbiddenRuntimePatterns: [
    "runtime PDF viewer",
    "full-page raster base",
    "duplicate Руководство 4R destination",
    "side-by-side Spanish/Russian translation",
    "remote manual assets",
    "broad masks or DOM plates",
    "fake pending-page content"
  ]
} as const;

const chapter12NavigationEntries: ManualGuideNavigationEntry[] = chapter12Registry.chapters.map((chapter) => ({
  id: chapter.id,
  kind: "group",
  labelRu: chapter.labelRu,
  sourceTitleEs: chapter.sourceTitleEs,
  sourcePage: chapter.sourcePage,
  requiredPrintedPage: chapter.requiredPrintedPage,
  status: chapter.status,
  pages: pagesForIds(chapter.chapterPageIds),
  children: chapter.topics.map((topic) => ({
    id: topic.id,
    kind: "topic",
    labelRu: topic.labelRu,
    sourceTitleEs: topic.sourceTitleEs,
    sourcePage: topic.sourcePage,
    endPage: topic.endPage,
    status: topic.status,
    pages: pagesForIds(topic.pageIds)
  }))
}));

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
