export type PandemiaVialGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type IntroductionRouteId =
  | "intro-road-pandemic"
  | "intro-ethical-civic-approach"
  | "intro-incident"
  | "intro-road-safety-plan";

export type IntroductionNavigationEntry = {
  id: IntroductionRouteId;
  routeHash: string;
  titleRu: string;
  titleEs: string;
  sourceIndexHeadingEs: string;
  startPage: number;
  endPage: number;
  renderer: "pandemia" | "article";
};

export type IntroductionStyleGuide = {
  id: string;
  tokens: {
    typographyStack: string;
    bodyFontSize: string;
    bodyLineHeight: number;
    calloutBackground: string;
    calloutAccent: string;
    calloutPadding: string;
    calloutTextAlign: "left";
    calloutFontWeight: number;
    calloutLineHeight: number;
    panelRadius: string;
    panelBorderWidth: string;
  };
  rules: string[];
};

export type IntroductionSourceArtworkAsset = {
  id: string;
  localPath: string;
  sourcePage: number;
  sourceRegion: PandemiaVialGeometry;
  sourceRegionUnit?: string;
  sourceRenderScale?: number;
  containsText: boolean;
  visibleSpanish: false;
  cleanupStatus: string;
  fidelityRole: string;
};

export type IntroductionArticleBlock =
  | {
      id: string;
      kind: "paragraph" | "callout" | "quote" | "lead";
      textRu: string;
      sourceTextEs: string;
    }
  | {
      id: string;
      kind: "list";
      titleRu?: string;
      sourceTextEs: string;
      itemsRu: string[];
    }
  | {
      id: string;
      kind: "risk-factors";
      headingRu: string;
      sourceTextEs: string;
      factors: Array<{
        id: string;
        titleRu: string;
        textRu: string;
        sourceTitleEs: string;
        iconAssetId: string;
        emphasis?: "warning";
      }>;
      recommendationRu: string;
      artworkAssets: IntroductionSourceArtworkAsset[];
    }
  | {
      id: string;
      kind: "consequence-diagram";
      headingRu: string;
      sourceTextEs: string;
      backgroundAsset: IntroductionSourceArtworkAsset & {
        intrinsicSize: {
          width: number;
          height: number;
        };
      };
      centerRu: string;
      groups: Array<{
        id: string;
        titleRu: string;
        itemsRu: string[];
        tone: "gray" | "dark";
        iconAssetId: string;
      }>;
      artworkAssets: IntroductionSourceArtworkAsset[];
    }
  | {
      id: string;
      kind: "work-axes";
      headingRu: string;
      sourceTextEs: string;
      axes: Array<{
        id: string;
        titleRu: string;
        textRu: string;
        iconAssetId: string;
      }>;
      artworkAssets: IntroductionSourceArtworkAsset[];
    }
  | {
      id: string;
      kind: "photo-quote";
      sourceTextEs: string;
      image: {
        localPath: string;
        altRu: string;
        cleanupStatus: string;
      };
      quoteRu: string;
    };

export type IntroductionArticleSection = {
  id: Exclude<IntroductionRouteId, "intro-road-pandemic">;
  routeHash: string;
  titleRu: string;
  titleEs: string;
  sourceIndexHeadingEs: string;
  startPage: number;
  endPage: number;
  sourceEvidence: {
    navigationManifestPath: string;
    manualManifestPath: string;
    layoutManifestPath: string;
    referenceAssets: string[];
    omittedArtifacts: string[];
  };
  layoutNotes: string[];
  blocks: IntroductionArticleBlock[];
  knownIssues: string[];
};

export type PandemiaVialSegmentRole =
  | "heading"
  | "intro"
  | "context-label"
  | "stat-strip"
  | "stat-card"
  | "city-stat"
  | "body";

export type PandemiaVialSegment = {
  id: string;
  role: PandemiaVialSegmentRole;
  sourceTextEs: string;
  textRu: string;
  geometry: PandemiaVialGeometry;
  layoutRole: string;
  sourceReference: string;
  fitNote?: string;
  rendering: "html-text";
};

export type PandemiaVialRegion = {
  id: "global-context" | "city-context";
  labelRu: string;
  labelEs: string;
  geometry: PandemiaVialGeometry;
  rendering: "native-html-css-svg";
  sourceEvidence: string;
  focusDescriptionRu: string;
};

export type PandemiaVialAsset = {
  id: string;
  kind: "cleaned-source-crop";
  localPath: string;
  altRu: string;
  geometry: PandemiaVialGeometry;
  sourceRegion: PandemiaVialGeometry;
  sourceRegionUnit: "pdf-render-scale-4";
  containsText: false;
  cleanupStatus: string;
  derivation: string;
  extractionSource: string;
  sourceArtworkMode: "original-crop" | "cleaned-original";
  fidelityEvidence: string;
  pictogramSemantics?: {
    totalCount: number;
    maleCount: number;
    femaleCount: number;
    maleSignature: string;
    femaleSignature: string;
    malePictogramsIdentical: true;
  };
};

export const pandemiaVialSection = {
  id: "pandemia-vial-section",
  routeHash: "#pandemia-vial",
  titleRu: "Дорожная пандемия",
  titleEs: "Pandemia vial",
  source: {
    manualId: "gcba-manual-vehiculo-4-ruedas-2023",
    sourceDocumentId: "gcba-manual-vehiculo-4-ruedas-2023",
    navigationEntryId: "intro-road-pandemic",
    pageNumber: 15,
    sourcePageNumber: 15,
    sourcePageMarker: "14",
    manualManifestPath: "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json",
    navigationManifestPath: "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json",
    translationJsonPointer: "/pages/14/translation",
    referenceAsset: {
      localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-015.jpg",
      purpose: "reference-only layout evidence, not rendered by the prototype",
      format: "jpeg",
      width: 1191,
      height: 1684,
      sha256: "9e25a91abe857426dfcc978e361a2511a6ab7a0c144ccc97f757c72ffe4b1496"
    },
    chunkId: "gcba-manual-vehiculo-4-ruedas-2023--14-015",
    chunkSourceSpan: {
      startLine: 411,
      endLine: 429
    },
    translationStatus: "unofficial Russian learning support derived from official Spanish GCBA source"
  },
  canvas: {
    width: 1191,
    height: 1684,
    unit: "px"
  },
  contentFrame: {
    x: 318,
    y: 452,
    width: 638,
    height: 890,
    unit: "page-015.jpg px",
    sourceRegion: "meaningful Pandemia vial content block: heading, intro, global and city infographics, and learning conclusion; excludes PDF page whitespace, book corner motif, footnote, and page marker",
    firstMeaningfulContentOffset: { x: 30, y: 20 },
    bottomContentMargin: 38
  },
  nativeLayoutNotes: [
    "The rendered prototype is a native content-frame page with CSS infographic primitives and local source-derived icon crops; the full page reference render is not mounted in the DOM.",
    "Statistic bands, gray panels, and circular statistic backgrounds are CSS shapes; the book-only upper-left corner motif is intentionally omitted from the visible learning document. Participant/vehicle icons use cleaned original artwork crops from a high-resolution local PDF render.",
    "Russian text uses semantic DOM in the same layout roles as the source fragment, enlarged to ordinary Cabadrive study-material scale instead of PDF microtype.",
    "Ordinary paragraph segments use adaptive DOM wrapping without forced PDF line breaks; pinned infographic labels may keep explicit line breaks."
  ],
  assets: [
    {
      id: "airplane-icon",
      kind: "cleaned-source-crop",
      localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/pandemia-vial/icon-airplane-source.png",
      altRu: "иконка самолета",
      geometry: { x: 450, y: 608, width: 78, height: 60 },
      sourceRegion: { x: 664, y: 866, width: 250, height: 170 },
      sourceRegionUnit: "pdf-render-scale-4",
      containsText: false,
      cleanupStatus: "tight crop around original icon circle; no Spanish text included",
      derivation: "cropped from local bundled PDF-renderer/canvas render of PDF page 15 at scale 4, then resized with sharp",
      extractionSource: "content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf page 15 rendered locally to /tmp/cabadrive-page-015-scale4.png",
      sourceArtworkMode: "original-crop",
      fidelityEvidence: "preserves the original airplane circle artwork from the PDF render; crop excludes Spanish label text"
    },
    {
      id: "stadium-icon",
      kind: "cleaned-source-crop",
      localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/pandemia-vial/icon-stadium-source.png",
      altRu: "иконка стадиона",
      geometry: { x: 682, y: 608, width: 78, height: 60 },
      sourceRegion: { x: 1466, y: 866, width: 250, height: 170 },
      sourceRegionUnit: "pdf-render-scale-4",
      containsText: false,
      cleanupStatus: "tight crop around original icon circle; no Spanish text included",
      derivation: "cropped from local bundled PDF-renderer/canvas render of PDF page 15 at scale 4, then resized with sharp",
      extractionSource: "content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf page 15 rendered locally to /tmp/cabadrive-page-015-scale4.png",
      sourceArtworkMode: "original-crop",
      fidelityEvidence: "preserves the original stadium circle artwork from the PDF render; crop excludes Spanish label text"
    },
    {
      id: "motorcyclist-icon",
      kind: "cleaned-source-crop",
      localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/pandemia-vial/icon-motorcyclist-source.png",
      altRu: "иконка мотоциклиста",
      geometry: { x: 445, y: 942, width: 58, height: 64 },
      sourceRegion: { x: 590, y: 2004, width: 140, height: 140 },
      sourceRegionUnit: "pdf-render-scale-4",
      containsText: false,
      cleanupStatus: "cleaned original silhouette crop; Spanish circle label excluded before transparency cleanup",
      derivation: "source silhouette cropped from local high-resolution PDF render and light circle/text pixels made transparent with sharp",
      extractionSource: "content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf page 15 rendered locally to /tmp/cabadrive-page-015-scale4.png",
      sourceArtworkMode: "cleaned-original",
      fidelityEvidence: "uses the original helmet/person silhouette from the PDF render instead of a redrawn vector"
    },
    {
      id: "pedestrian-icon",
      kind: "cleaned-source-crop",
      localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/pandemia-vial/icon-pedestrian-source.png",
      altRu: "иконка пешехода",
      geometry: { x: 550, y: 950, width: 96, height: 48 },
      sourceRegion: { x: 990, y: 2008, width: 270, height: 136 },
      sourceRegionUnit: "pdf-render-scale-4",
      containsText: false,
      cleanupStatus: "cleaned original silhouette crop; Spanish circle label excluded before transparency cleanup",
      derivation: "source pedestrian/crosswalk silhouette cropped from local high-resolution PDF render and light circle/text pixels made transparent with sharp",
      extractionSource: "content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf page 15 rendered locally to /tmp/cabadrive-page-015-scale4.png",
      sourceArtworkMode: "cleaned-original",
      fidelityEvidence: "uses the original pedestrian and crosswalk silhouette from the PDF render instead of a redrawn vector"
    },
    {
      id: "car-icon",
      kind: "cleaned-source-crop",
      localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/pandemia-vial/icon-car-source.png",
      altRu: "иконка автомобиля",
      geometry: { x: 672, y: 952, width: 92, height: 48 },
      sourceRegion: { x: 1442, y: 2038, width: 238, height: 110 },
      sourceRegionUnit: "pdf-render-scale-4",
      containsText: false,
      cleanupStatus: "cleaned original silhouette crop; Spanish circle label excluded before transparency cleanup",
      derivation: "source car silhouette cropped from local high-resolution PDF render and light circle/text pixels made transparent with sharp",
      extractionSource: "content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf page 15 rendered locally to /tmp/cabadrive-page-015-scale4.png",
      sourceArtworkMode: "cleaned-original",
      fidelityEvidence: "uses the original vehicle silhouette from the PDF render instead of a redrawn vector"
    },
    {
      id: "people-grid-icon",
      kind: "cleaned-source-crop",
      localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/pandemia-vial/icon-people-grid-source.png",
      altRu: "8 одинаковых мужских пиктограмм и 2 женские пиктограммы",
      geometry: { x: 424, y: 1020, width: 104, height: 58 },
      sourceRegion: { x: 538, y: 2208, width: 322, height: 246 },
      sourceRegionUnit: "pdf-render-scale-4",
      containsText: false,
      cleanupStatus: "cleaned original pictogram crop; no Spanish text present in crop",
      derivation: "source people-grid silhouettes cropped from local high-resolution PDF render and light background pixels made transparent with sharp",
      extractionSource: "content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf page 15 rendered locally to /tmp/cabadrive-page-015-scale4.png",
      sourceArtworkMode: "cleaned-original",
      fidelityEvidence: "uses the original PDF pictogram silhouettes while preserving 8 male plus 2 female semantics",
      pictogramSemantics: {
        totalCount: 10,
        maleCount: 8,
        femaleCount: 2,
        maleSignature: "source-pdf-male-silhouette",
        femaleSignature: "source-pdf-female-silhouette",
        malePictogramsIdentical: true
      }
    },
    {
      id: "people-pair-icon",
      kind: "cleaned-source-crop",
      localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/pandemia-vial/icon-people-pair-source.png",
      altRu: "иконка двух людей",
      geometry: { x: 452, y: 1110, width: 72, height: 56 },
      sourceRegion: { x: 666, y: 2506, width: 170, height: 170 },
      sourceRegionUnit: "pdf-render-scale-4",
      containsText: false,
      cleanupStatus: "cleaned original silhouette crop; no Spanish text included",
      derivation: "source two-person silhouette cropped from local high-resolution PDF render and light background pixels made transparent with sharp",
      extractionSource: "content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf page 15 rendered locally to /tmp/cabadrive-page-015-scale4.png",
      sourceArtworkMode: "cleaned-original",
      fidelityEvidence: "preserves the original two-person silhouette style from the PDF render"
    }
  ] satisfies PandemiaVialAsset[],
  segments: [
    {
      id: "heading",
      role: "heading",
      sourceTextEs: "Pandemia vial",
      textRu: "Дорожная пандемия",
      geometry: { x: 351, y: 474, width: 388, height: 44 },
      layoutRole: "large bold section heading in the native site composition",
      sourceReference: "manual.ru.json#/pages/14/translation/fullTranslationRu",
      fitNote: "Russian heading is wider than Spanish; same visual role is preserved with a slightly smaller font.",
      rendering: "html-text"
    },
    {
      id: "intro",
      role: "intro",
      sourceTextEs: "El tránsito es uno de los sistemas más complejos que las personas construyen de manera cotidiana. Debido a la gran cantidad de muertes que se generan por siniestros viales en todo el mundo, la Organización Mundial de la Salud (OMS) categorizó a esta problemática como una “pandemia”.",
      textRu: "Дорожное движение - одна из самых сложных систем, которые люди создают каждый день. Во всем мире в дорожных авариях погибает так много людей, что Всемирная организация здравоохранения (ВОЗ) назвала эту проблему \"пандемией\".",
      geometry: { x: 348, y: 520, width: 590, height: 106 },
      layoutRole: "adaptive intro paragraph under the heading without forced PDF line breaks",
      sourceReference: "manual.ru.json#/pages/14/translation/fullTranslationRu",
      fitNote: "Russian wraps naturally by container width instead of manual PDF-style line breaks.",
      rendering: "html-text"
    },
    {
      id: "global-label",
      role: "context-label",
      sourceTextEs: "Contexto Mundial",
      textRu: "В мире",
      geometry: { x: 348, y: 628, width: 104, height: 62 },
      layoutRole: "left label for the top infographic row",
      sourceReference: "manual.ru.json#/pages/14/translation/fullTranslationRu",
      rendering: "html-text"
    },
    {
      id: "airplane-strip",
      role: "stat-strip",
      sourceTextEs: "= 4700 AVIONES LLENOS",
      textRu: "= 4700 полных самолетов",
      geometry: { x: 394, y: 688, width: 206, height: 14 },
      layoutRole: "left blue strip above global statistic with a safe center gap from the stadium strip",
      sourceReference: "page-015.jpg visual text",
      fitNote: "Russian label is slightly tighter to fit the source strip.",
      rendering: "html-text"
    },
    {
      id: "airplane-card",
      role: "stat-card",
      sourceTextEs: "1,4 MILLONES VICTIMAS FATALES AL AÑO",
      textRu: "1,4 МИЛЛИОНА\nпогибших в год",
      geometry: { x: 398, y: 718, width: 190, height: 38 },
      layoutRole: "gray card below airplane icon",
      sourceReference: "page-015.jpg visual text",
      rendering: "html-text"
    },
    {
      id: "stadium-strip",
      role: "stat-strip",
      sourceTextEs: "= 715 ESTADIOS LLENOS",
      textRu: "= 715 полных стадионов",
      geometry: { x: 628, y: 688, width: 206, height: 14 },
      layoutRole: "right blue strip above global statistic with a safe center gap from the airplane strip",
      sourceReference: "page-015.jpg visual text",
      rendering: "html-text"
    },
    {
      id: "stadium-card",
      role: "stat-card",
      sourceTextEs: "50 MILLONES PERSONAS LESIONADAS CADA AÑO A CAUSA DE LOS SINIESTROS POR EL TRÁNSITO",
      textRu: "50 МИЛЛИОНОВ\nлюдей ранены за год\nиз-за дорожных аварий",
      geometry: { x: 630, y: 712, width: 194, height: 50 },
      layoutRole: "gray card below stadium icon",
      sourceReference: "page-015.jpg visual text",
      fitNote: "The explanatory Russian text is condensed to keep the original card height.",
      rendering: "html-text"
    },
    {
      id: "city-label",
      role: "context-label",
      sourceTextEs: "Contexto Ciudad de Buenos Aires",
      textRu: "В городе\nБуэнос-Айрес",
      geometry: { x: 348, y: 826, width: 160, height: 90 },
      layoutRole: "left label for Buenos Aires context infographic",
      sourceReference: "manual.ru.json#/pages/14/translation/fullTranslationRu",
      fitNote: "Russian city name uses three lines to preserve the source label column.",
      rendering: "html-text"
    },
    {
      id: "fatalities-96",
      role: "city-stat",
      sourceTextEs: "96 VICTIMAS FATALES",
      textRu: "96\nпогибших",
      geometry: { x: 540, y: 840, width: 178, height: 42 },
      layoutRole: "wide gray row aligned right of city label",
      sourceReference: "page-015.jpg visual text",
      rendering: "html-text"
    },
    {
      id: "motorcyclists",
      role: "city-stat",
      sourceTextEs: "48% MOTOCICLISTAS",
      textRu: "48%\nна мото",
      geometry: { x: 427, y: 898, width: 92, height: 40 },
      layoutRole: "left circular indicator; percent and label stay in the upper circle zone above the icon crop",
      sourceReference: "page-015.jpg visual text",
      rendering: "html-text"
    },
    {
      id: "pedestrians",
      role: "city-stat",
      sourceTextEs: "34% PEATONES",
      textRu: "34%\nпешком",
      geometry: { x: 557, y: 898, width: 76, height: 40 },
      layoutRole: "middle circular indicator; percent and label stay in the upper circle zone above the icon crop",
      sourceReference: "page-015.jpg visual text",
      rendering: "html-text"
    },
    {
      id: "car-occupants",
      role: "city-stat",
      sourceTextEs: "11% OCUPANTES DE AUTOMÓVIL",
      textRu: "11%\nв авто",
      geometry: { x: 682, y: 898, width: 70, height: 40 },
      layoutRole: "right circular indicator; percent and label stay in the upper circle zone above the icon crop",
      sourceReference: "page-015.jpg visual text",
      fitNote: "Shortened learner-facing noun phrase keeps the category meaning inside the original small circle.",
      rendering: "html-text"
    },
    {
      id: "male-victims",
      role: "city-stat",
      sourceTextEs: "8 DE CADA 10 VICTIMAS FATALES FUERON DE SEXO MASCULINO",
      textRu: "8 из 10\nпогибших - мужчины",
      geometry: { x: 570, y: 1026, width: 198, height: 46 },
      layoutRole: "gray gender row beside the people icons, with source-like horizontal gap and vertical padding inside the panel",
      sourceReference: "page-015.jpg visual text",
      rendering: "html-text"
    },
    {
      id: "age-range",
      role: "city-stat",
      sourceTextEs: "49% 25 A 54 AÑOS DE EDAD",
      textRu: "49%\nот 25 до 54 лет",
      geometry: { x: 572, y: 1116, width: 190, height: 42 },
      layoutRole: "gray age row beside the two-person icon, with source-like horizontal gap and vertical padding inside the panel",
      sourceReference: "page-015.jpg visual text",
      rendering: "html-text"
    },
    {
      id: "body",
      role: "body",
      sourceTextEs: "Estos datos surgen del informe estadístico sobre las víctimas fatales a causa de siniestros viales en la Ciudad de Buenos Aires, producido por el Observatorio de Seguridad Vial del GCBA (OSV) en mayo de 2022. Esto demuestra que es necesario mejorar la seguridad vial mediante el trabajo en conjunto de toda la sociedad.",
      textRu: "Это показывает: чтобы дороги стали безопаснее, работать над этим нужно всему обществу вместе.",
      geometry: { x: 348, y: 1250, width: 550, height: 54 },
      layoutRole: "bottom learning conclusion without source-attribution sentences",
      sourceReference: "manual.ru.json#/pages/14/translation/fullTranslationRu",
      rendering: "html-text"
    }
  ] satisfies PandemiaVialSegment[],
  visualRegions: [
    {
      id: "global-context",
      labelRu: "Мировой контекст",
      labelEs: "Contexto Mundial",
      geometry: { x: 346, y: 602, width: 438, height: 176 },
      rendering: "native-html-css-svg",
      sourceEvidence: "page-015.jpg reference: top infographic row with airplane/stadium icons and two statistic panels",
      focusDescriptionRu: "Глобальная статистика: погибшие и раненые в дорожных авариях по данным источника."
    },
    {
      id: "city-context",
      labelRu: "Контекст города Буэнос-Айрес",
      labelEs: "Contexto Ciudad de Buenos Aires",
      geometry: { x: 346, y: 827, width: 438, height: 289 },
      rendering: "native-html-css-svg",
      sourceEvidence: "page-015.jpg reference: lower infographic region with city fatality, user-type, gender, and age indicators",
      focusDescriptionRu: "Статистика CABA: 96 погибших, типы участников, пол и возрастные группы."
    }
  ] satisfies PandemiaVialRegion[],
  fittingDeviations: [
    "Heading: Russian phrase is wider; font size is slightly reduced while retaining the source visual role.",
    "The visible learning document omits book-only page marker, footnote, upper-left corner motif, and source-attribution sentences that do not help solve tickets.",
    "Ordinary paragraph segments use adaptive DOM wrapping without forced line breaks; only pinned infographic labels keep manual line breaks.",
    "The web page is reframed to the meaningful content block instead of the full PDF page canvas, so desktop and mobile start on real section content rather than blank page margins.",
    "Small infographic indicators use separated zones: Russian percent/label text sits above cleaned original source artwork crops, and lower gray rows are top-aligned with their corresponding left pictogram crops.",
    "The gender pictogram asset is a cleaned original PDF-render crop with explicit 8 male / 2 female metadata and identical male pictogram signatures."
  ]
} as const;

export type PandemiaVialSection = typeof pandemiaVialSection;

export const introductionNavigation = [
  {
    id: "intro-road-pandemic",
    routeHash: "#pandemia-vial",
    titleRu: "Дорожная пандемия",
    titleEs: "Pandemia vial",
    sourceIndexHeadingEs: "Pandemia vial",
    startPage: 15,
    endPage: 15,
    renderer: "pandemia"
  },
  {
    id: "intro-ethical-civic-approach",
    routeHash: "#intro-enfoque-etico",
    titleRu: "Этико-гражданский подход в дорожной культуре",
    titleEs: "Enfoque ético - ciudadano en la cultura vial",
    sourceIndexHeadingEs: "Enfoque ético - ciudadano en la cultura vial",
    startPage: 16,
    endPage: 16,
    renderer: "article"
  },
  {
    id: "intro-incident",
    routeHash: "#intro-accidente-incidente",
    titleRu: "Авария или дорожный инцидент?",
    titleEs: "¿Accidente o incidente de tránsito?",
    sourceIndexHeadingEs: "¿Accidente o incidente de tránsito?",
    startPage: 17,
    endPage: 17,
    renderer: "article"
  },
  {
    id: "intro-road-safety-plan",
    routeHash: "#intro-plan-seguridad-vial",
    titleRu: "План дорожной безопасности города Буэнос-Айрес",
    titleEs: "Plan de seguridad vial de la Ciudad de Buenos Aires",
    sourceIndexHeadingEs: "Plan de seguridad vial de la Ciudad de Buenos Aires",
    startPage: 18,
    endPage: 20,
    renderer: "article"
  }
] satisfies IntroductionNavigationEntry[];

export const introductionDocumentStyleGuide = {
  id: "gcba-introduction-document-style-v1",
  tokens: {
    typographyStack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif',
    bodyFontSize: "1rem",
    bodyLineHeight: 1.62,
    calloutBackground: "#e9f5f8",
    calloutAccent: "#2787a6",
    calloutPadding: "16px 18px",
    calloutTextAlign: "left",
    calloutFontWeight: 750,
    calloutLineHeight: 1.34,
    panelRadius: "8px",
    panelBorderWidth: "2px"
  },
  rules: [
    "Repeated law/callout blocks use the same blue background, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence unless source metadata records a variant.",
    "Infographic artwork uses source-derived component crops or source-faithful geometry; generic avatar/card/icon substitutions are rejected.",
    "Russian prose and meaningful labels remain selectable DOM text, with horizontal scrolling limited to fixed infographic compositions.",
    "Navigation is a full-document Indice tree inside Руководство; Introduction children are active entries and future chapters/annexes are pending placeholders."
  ]
} satisfies IntroductionStyleGuide;

export const introductionArticleSections = [
  {
    id: "intro-ethical-civic-approach",
    routeHash: "#intro-enfoque-etico",
    titleRu: "Этико-гражданский подход в дорожной культуре",
    titleEs: "Enfoque ético - ciudadano en la cultura vial",
    sourceIndexHeadingEs: "Enfoque ético - ciudadano en la cultura vial",
    startPage: 16,
    endPage: 16,
    sourceEvidence: {
      navigationManifestPath: "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json",
      manualManifestPath: "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json",
      layoutManifestPath: "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/layout.ru.json",
      referenceAssets: ["content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-016.jpg"],
      omittedArtifacts: ["source footnote 2 URL", "PDF page marker 15", "upper-right book corner motif"]
    },
    layoutNotes: [
      "Page 16 is reconstructed as responsive native prose with two blue emphasis callouts matching the source hierarchy.",
      "The law citation and public-road duty quote are retained as learner-relevant DOM text; the source URL footnote is internal only."
    ],
    blocks: [
      {
        id: "conflicts",
        kind: "paragraph",
        sourceTextEs: "Los conflictos, las disputas, los desacuerdos y las contradicciones son naturales a la condicion humana...",
        textRu:
          "Конфликты, споры, несогласия и противоречия естественны: люди разные, с разными интересами и реакциями. Поэтому главное - как их решать: мирно и уважительно либо с насилием и неуважением."
      },
      {
        id: "laws-boundary",
        kind: "paragraph",
        sourceTextEs: "Las leyes existen para posibilitar la convivencia pacifica entre la ciudadania...",
        textRu:
          "Законы нужны, чтобы люди могли мирно жить вместе. Они задают границу между людьми. Проблемы начинаются, когда кто-то эту границу нарушает и тем самым в большей или меньшей степени вредно действует по отношению к сообществу."
      },
      {
        id: "law-2148",
        kind: "callout",
        sourceTextEs: "En CABA rige Ley 2148 Codigo de Transito y Transporte.",
        textRu: "В CABA действует Закон 2148 - Кодекс дорожного движения и транспорта."
      },
      {
        id: "law-not-enough",
        kind: "paragraph",
        sourceTextEs: "Sin embargo, las estadisticas de siniestros viales revelan que no alcanza con que las leyes existan...",
        textRu:
          "Но статистика дорожных инцидентов показывает: одного существования законов недостаточно, если граждане не берут на себя обязанность их соблюдать."
      },
      {
        id: "culture",
        kind: "paragraph",
        sourceTextEs: "Las leyes ofrecen el marco regulatorio necesario para la convivencia... cultura es el conjunto de modos de vida...",
        textRu:
          "Законы дают необходимую рамку для совместной жизни, но отношения между людьми зависят не только от законов. Они происходят в конкретной культуре: в привычках, знаниях и способах действия, которые есть у социальной группы в определенное время."
      },
      {
        id: "road-culture",
        kind: "paragraph",
        sourceTextEs: "En este sentido, el transito es una expresion de una cultura ciudadana...",
        textRu:
          "В этом смысле дорожное движение - часть гражданской культуры. Поэтому говорят о дорожной культуре: закон в ней важен, но он не является всем целым."
      },
      {
        id: "public-road-duty",
        kind: "quote",
        sourceTextEs:
          "Como usuarios de la via publica estamos obligados a no entorpecer injustamente la circulacion y a no causar peligro, perjuicios o molestias innecesarias...",
        textRu:
          "Как пользователи общественной дороги мы обязаны без достаточной причины не мешать движению и не создавать опасность, вред или лишние неудобства людям либо ущерб имуществу."
      },
      {
        id: "everyone-responsible",
        kind: "paragraph",
        sourceTextEs: "Cada persona que hace uso de la via publica es responsable de una parte del transito...",
        textRu:
          "Каждый, кто пользуется общественной дорогой, отвечает за часть дорожного движения независимо от способа передвижения."
      },
      {
        id: "rights-duties",
        kind: "paragraph",
        sourceTextEs: "La totalidad - peatones, ciclistas, motociclistas, automovilistas y conductores/as profesionales...",
        textRu:
          "Все - пешеходы, велосипедисты, мотоциклисты, автомобилисты и профессиональные водители - имеют права и обязанности на дороге. Они определены законом, хотя обычно его изучают только перед первым получением водительского удостоверения."
      },
      {
        id: "learned-system",
        kind: "paragraph",
        sourceTextEs: "Si no se estudia la ley, como se conoce la manera de moverse por la Ciudad?...",
        textRu:
          "Если закон не изучают, как люди узнают, как передвигаться по городу? Дорожное движение строят все граждане, и оно усваивается с раннего возраста. Поэтому правила совместной жизни работают по-настоящему тогда, когда люди принимают их как свои."
      }
    ],
    knownIssues: []
  },
  {
    id: "intro-incident",
    routeHash: "#intro-accidente-incidente",
    titleRu: "Авария или дорожный инцидент?",
    titleEs: "¿Accidente o incidente de tránsito?",
    sourceIndexHeadingEs: "¿Accidente o incidente de tránsito?",
    startPage: 17,
    endPage: 17,
    sourceEvidence: {
      navigationManifestPath: "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json",
      manualManifestPath: "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json",
      layoutManifestPath: "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/layout.ru.json",
      referenceAssets: ["content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-017.jpg"],
      omittedArtifacts: ["PDF page marker 16", "upper-left book corner motif"]
    },
    layoutNotes: [
      "The risk-factor and recommendation structures preserve the source gray/yellow panel geometry, blue recommendation label, border, and spacing with selectable Russian text.",
      "The three risk pictograms are local source-derived component crops from page 17; the renderer does not use generic avatar/card icons."
    ],
    blocks: [
      {
        id: "definition",
        kind: "paragraph",
        sourceTextEs: "La Ley 3072 de la Ciudad Autonoma de Buenos Aires define al incidente de transito o incidente vial...",
        textRu:
          "Закон 3072 Автономного города Буэнос-Айрес определяет дорожный инцидент как событие, при котором человеку или вещи причиняется вред в связи с движением по общественной дороге."
      },
      {
        id: "why-not-accident",
        kind: "paragraph",
        sourceTextEs: "Es importante saber por que no es correcto denominarlos como accidentes...",
        textRu:
          "Важно понимать, почему неправильно называть такие события авариями. Слово авария звучит как непредсказуемое и неизбежное событие, которое нельзя контролировать. Но даже если дорожные события неожиданны и внезапны, это не значит, что их нельзя предотвратить: подавляющее большинство происходит из-за человеческих ошибок."
      },
      {
        id: "responsibility",
        kind: "paragraph",
        sourceTextEs: "Si se tiene la idea de que este tipo de hechos son inevitables...",
        textRu:
          "Если считать такие события неизбежными, почти ничего нельзя сделать. Когда мы называем их инцидентами, ответственность человеческого поведения не исчезает: можно анализировать причины и работать с ними, чтобы они не повторялись."
      },
      {
        id: "avoidable",
        kind: "callout",
        sourceTextEs: "Si se puede evitar, no es un accidente.",
        textRu: "Если этого можно избежать, это не авария."
      },
      {
        id: "attention",
        kind: "paragraph",
        sourceTextEs: "Al circular se debera poner atencion a las condiciones en que se encuentran el vehiculo...",
        textRu:
          "При движении нужно обращать внимание на состояние транспортного средства, дорожной инфраструктуры, погоду и состояние водителя."
      },
      {
        id: "risk-factors",
        kind: "risk-factors",
        headingRu: "Факторы риска",
        sourceTextEs: "Factores de Riesgo: Ambiental, Vehicular, Humano. Recomendaciones...",
        factors: [
          {
            id: "ambiental",
            titleRu: "Среда",
            sourceTitleEs: "Ambiental",
            iconAssetId: "risk-ambiental",
            textRu: "Связана с условиями вокруг движения: инфраструктурой и погодой."
          },
          {
            id: "vehicular",
            titleRu: "Транспортное средство",
            sourceTitleEs: "Vehicular",
            iconAssetId: "risk-vehicular",
            textRu: "Связана с наличием автомобиля, его неисправностями или отсутствием обслуживания."
          },
          {
            id: "humano",
            titleRu: "Человек",
            sourceTitleEs: "Humano",
            iconAssetId: "risk-humano",
            textRu: "Включает решения, эмоции, отношения и поведение людей. Это главный фактор риска.",
            emphasis: "warning"
          }
        ],
        recommendationRu:
          "Во время движения нужно учитывать состояние автомобиля, дорожной инфраструктуры, погоду и состояние человека, который ведет.",
        artworkAssets: [
          {
            id: "risk-ambiental",
            localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-incident/icon-risk-ambiental-source.png",
            sourcePage: 17,
            sourceRegion: { x: 382, y: 858, width: 68, height: 70 },
            containsText: false,
            visibleSpanish: false,
            sourceRegionUnit: "legacy page JPG coordinate frame; regenerated from high-DPI PDF render scale 6",
            sourceRenderScale: 6,
            cleanupStatus:
              "transparent 512x512 padded high-DPI PDF source crop of original wind/tree artwork; original pictogram pixels preserved, no Spanish label text, no browser upscaling, no clipped or tight crop box",
            fidelityRole: "page 17 Factores de Riesgo Ambiental pictogram"
          },
          {
            id: "risk-vehicular",
            localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-incident/icon-risk-vehicular-source.png",
            sourcePage: 17,
            sourceRegion: { x: 382, y: 948, width: 70, height: 68 },
            containsText: false,
            visibleSpanish: false,
            sourceRegionUnit: "legacy page JPG coordinate frame; regenerated from high-DPI PDF render scale 6",
            sourceRenderScale: 6,
            cleanupStatus:
              "transparent 512x512 padded high-DPI PDF source crop of original car artwork; original pictogram pixels preserved, no Spanish label text, no browser upscaling, no clipped or tight crop box",
            fidelityRole: "page 17 Factores de Riesgo Vehicular pictogram"
          },
          {
            id: "risk-humano",
            localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-incident/icon-risk-humano-source.png",
            sourcePage: 17,
            sourceRegion: { x: 380, y: 1028, width: 70, height: 72 },
            containsText: false,
            visibleSpanish: false,
            sourceRegionUnit: "legacy page JPG coordinate frame; regenerated from high-DPI PDF render scale 6",
            sourceRenderScale: 6,
            cleanupStatus:
              "transparent 512x512 padded high-DPI PDF source crop of original two-person artwork; original pictogram pixels preserved, no Spanish label text, no browser upscaling, no clipped or tight crop box",
            fidelityRole: "page 17 Factores de Riesgo Humano pictogram"
          }
        ]
      }
    ],
    knownIssues: []
  },
  {
    id: "intro-road-safety-plan",
    routeHash: "#intro-plan-seguridad-vial",
    titleRu: "План дорожной безопасности города Буэнос-Айрес",
    titleEs: "Plan de seguridad vial de la Ciudad de Buenos Aires",
    sourceIndexHeadingEs: "Plan de seguridad vial de la Ciudad de Buenos Aires",
    startPage: 18,
    endPage: 20,
    sourceEvidence: {
      navigationManifestPath: "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json",
      manualManifestPath: "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json",
      layoutManifestPath: "content/manuals/gcba-manual-vehiculo-4-ruedas-2023/layout.ru.json",
      referenceAssets: [
        "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-018.jpg",
        "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-019.jpg",
        "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-020.jpg"
      ],
      omittedArtifacts: ["source footnote 3 URL", "PDF page markers 17-19", "book corner motifs", "Spanish quote baked into page 20 photo"]
    },
    layoutNotes: [
      "Pages 18-20 stay one route because the source Index heading spans all three pages.",
      "The consequences diagram uses one complete text-cleaned source crop with selectable Russian labels; the runtime does not redraw or reassemble the gauge geometry.",
      "The page 19 work axes preserve the four gray circular fields, source pictograms, two-column spacing, blue title role, and selectable Russian text.",
      "The page 20 photo is cropped from the source render above the Spanish quote; the Russian quote is rendered separately as selectable DOM text."
    ],
    blocks: [
      {
        id: "plan-lead",
        kind: "paragraph",
        sourceTextEs: "La seguridad vial es un asunto de responsabilidad compartida en todo el mundo...",
        textRu:
          "Безопасность на дорогах - общее дело во всем мире. Поэтому Буэнос-Айрес берет за основу принципы тех городов и стран, где уже добились лучших результатов."
      },
      {
        id: "vision-zero",
        kind: "paragraph",
        sourceTextEs: "El Programa Vision Cero, cuyo principio etico establece que nadie deberia morir...",
        textRu:
          "Идея Vision Zero (нулевая смертность и отсутствие тяжелых травм) простая и этическая: никто не должен погибать или получать постоянные травмы в дорожных инцидентах. Подход появился в Швеции в 1997 году; эта страна уже больше трех десятилетий считается ориентиром в дорожной безопасности. Поэтому транспортную систему нужно проектировать так, чтобы она сдерживала и уменьшала последствия человеческих ошибок и сама помогала делать движение безопасным."
      },
      {
        id: "principles",
        kind: "list",
        titleRu: "Основные принципы",
        sourceTextEs: "Esto implica que: No es aceptable ninguna persona fallecida ni herida grave...",
        itemsRu: [
          "Ни один погибший и ни один тяжело раненый в дорожных инцидентах не являются приемлемыми.",
          "Люди ошибаются даже тогда, когда знают нормы и официальные программы осведомления.",
          "Инфраструктура мобильности должна учитывать человеческие ошибки, чтобы они не приводили к погибшим.",
          "При проектировании системы мобильности нужно учитывать хрупкость человеческого тела."
        ]
      },
      {
        id: "consequences",
        kind: "consequence-diagram",
        headingRu: "Последствия дорожных инцидентов",
        sourceTextEs: "Consecuencias de los incidentes de transito: Familia y economia, Salud, Instituciones, Victimas fatales, Siniestro vial.",
        backgroundAsset: {
          id: "consequence-diagram-background",
          localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-018/diagram-consequences-clean-source.png",
          sourcePage: 18,
          sourceRegion: { x: 280, y: 560, width: 620, height: 260 },
          sourceRegionUnit: "approved 1x composition frame regenerated from high-DPI PDF render scale 6",
          sourceRenderScale: 6,
          intrinsicSize: { width: 3720, height: 1560 },
          containsText: false,
          visibleSpanish: false,
          cleanupStatus:
            "high-DPI PDF source crop from page 18 approved composition frame x=280 y=560 width=620 height=260 rendered at scale 6 to intrinsic 3720x1560; Spanish/source text cleanup is limited to the original text-bearing regions with local background restoration; category labels retain source-shaped text-free label backings from the asset, and the center circle uses circular local-field cleanup inside the original circle, not rectangular/block cover-up; rectangular cover-up masks are forbidden even when color-matched to the background; no white rectangular mask remnants at category label corners, no masks cutting connector lines, no white marks on the black fatal-victims label or wedge, no non-source beige horizontal bars below the diagram or under the institutions block, no non-source black horizontal protrusion to the right of the fatal-victims wedge, and no hard-edged center ring/circle patch seam; original arcs, pointer, sectors, label boxes, connector lines, icons, black wedge, center ring, proportions, and composition retained as source pixels outside the text-cleaned regions; no redrawn geometry and no native/CSS/SVG reconstruction",
          fidelityRole: "page 18 complete original consequences gauge high-DPI PDF source crop with local source-text cleanup"
        },
        centerRu: "Дорожный инцидент",
        groups: [
          {
            id: "family-economy",
            titleRu: "Семья и экономика",
            tone: "gray",
            iconAssetId: "consequence-family-economy",
            itemsRu: ["Семейные отношения", "Трудовые последствия"]
          },
          {
            id: "health",
            titleRu: "Здоровье",
            tone: "gray",
            iconAssetId: "consequence-health",
            itemsRu: ["Психологические последствия", "Последствия тяжелых или легких травм, постоянные или временные"]
          },
          {
            id: "institutions",
            titleRu: "Институции",
            tone: "gray",
            iconAssetId: "consequence-institutions",
            itemsRu: ["Государственное управление", "Судебные службы", "Силы безопасности"]
          },
          {
            id: "fatalities",
            titleRu: "Погибшие",
            tone: "dark",
            iconAssetId: "consequence-fatalities",
            itemsRu: ["Самое тяжелое последствие дорожного инцидента"]
          }
        ],
        artworkAssets: []
      },
      {
        id: "objectives",
        kind: "lead",
        sourceTextEs: "Objetivos. En el mediano y largo plazo...",
        textRu:
          "Цель в среднесрочной и долгосрочной перспективе - максимально снизить аварийность на общественной дороге и уменьшить человеческие и материальные последствия дорожных инцидентов."
      },
      {
        id: "work-axes",
        kind: "work-axes",
        headingRu: "Направления работы",
        sourceTextEs: "Ejes de trabajo: Infraestructura segura, Comunicacion educacion y concientizacion, Control y legislacion, Compromiso y participacion ciudadana.",
        axes: [
          {
            id: "safe-infrastructure",
            titleRu: "Безопасная инфраструктура",
            iconAssetId: "axis-infrastructure",
            textRu: "Действия, связанные с проектированием общественного пространства."
          },
          {
            id: "education",
            titleRu: "Коммуникация, обучение и осведомление",
            iconAssetId: "axis-education",
            textRu: "Обучающие программы и кампании, которые улучшают сосуществование и дорожную безопасность."
          },
          {
            id: "control-legislation",
            titleRu: "Контроль и законодательство",
            iconAssetId: "axis-control",
            textRu: "Координация контроля и норм, чтобы система транспорта работала безопаснее."
          },
          {
            id: "citizen-participation",
            titleRu: "Обязательство и участие граждан",
            iconAssetId: "axis-participation",
            textRu: "Совместные действия государства, организаций, компаний и граждан."
          }
        ],
        artworkAssets: [
          {
            id: "axis-infrastructure",
            localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-019/icon-axis-infrastructure-source.png",
            sourcePage: 19,
            sourceRegion: { x: 438, y: 672, width: 72, height: 56 },
            sourceRegionUnit: "legacy page JPG coordinate frame; regenerated from high-DPI PDF render scale 6",
            sourceRenderScale: 6,
            containsText: false,
            visibleSpanish: false,
            cleanupStatus: "transparent 192x192 padded high-DPI PDF source pictogram from the original page 19 gray circle; full walking/pedestrian extents are centered with alpha padding, no browser upscaling, and no tight crop box",
            fidelityRole: "page 19 safe infrastructure pictogram"
          },
          {
            id: "axis-education",
            localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-019/icon-axis-education-source.png",
            sourcePage: 19,
            sourceRegion: { x: 676, y: 672, width: 90, height: 56 },
            sourceRegionUnit: "legacy page JPG coordinate frame; regenerated from high-DPI PDF render scale 6",
            sourceRenderScale: 6,
            containsText: false,
            visibleSpanish: false,
            cleanupStatus: "transparent 192x192 padded high-DPI PDF source pictogram from the original page 19 gray circle; full megaphone extents are centered with alpha padding, no browser upscaling, and no tight crop box",
            fidelityRole: "page 19 communication/education pictogram"
          },
          {
            id: "axis-control",
            localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-019/icon-axis-control-source.png",
            sourcePage: 19,
            sourceRegion: { x: 438, y: 798, width: 86, height: 66 },
            sourceRegionUnit: "legacy page JPG coordinate frame; regenerated from high-DPI PDF render scale 6",
            sourceRenderScale: 6,
            containsText: false,
            visibleSpanish: false,
            cleanupStatus: "transparent 192x192 padded high-DPI PDF source pictogram from the original page 19 gray circle; full officer/police extents are centered with alpha padding, no browser upscaling, and no tight crop box",
            fidelityRole: "page 19 control and legislation pictogram"
          },
          {
            id: "axis-participation",
            localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-019/icon-axis-participation-source.png",
            sourcePage: 19,
            sourceRegion: { x: 672, y: 800, width: 108, height: 58 },
            sourceRegionUnit: "legacy page JPG coordinate frame; regenerated from high-DPI PDF render scale 6",
            sourceRenderScale: 6,
            containsText: false,
            visibleSpanish: false,
            cleanupStatus: "transparent 192x192 padded high-DPI PDF source pictogram from the original page 19 gray circle; full group/people extents are centered with alpha padding, no browser upscaling, and no tight crop box",
            fidelityRole: "page 19 citizen participation pictogram"
          }
        ]
      },
      {
        id: "final-photo-quote",
        kind: "photo-quote",
        sourceTextEs: "El transito es un sistema que se construye entre toda la ciudadania y que se interioriza desde edades tempranas.",
        image: {
          localPath: "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/child-seat-photo-source.jpg",
          altRu: "взрослый помогает ребенку в детском автокресле",
          cleanupStatus: "source photo crop excludes the Spanish quote; Russian quote is DOM text"
        },
        quoteRu: "Дорожное движение - это система, которую строят все граждане и которая усваивается с раннего возраста."
      }
    ],
    knownIssues: []
  }
] satisfies IntroductionArticleSection[];
