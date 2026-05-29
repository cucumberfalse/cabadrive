import type { ManualGuidePageContent } from "../manualGuide";

export const manualPage021: ManualGuidePageContent = {
  id: "manual-page-021-content",
  pageId: "manual-page-021",
  titleRu: "К устойчивой мобильности",
  sourcePage: 21,
  sourceTitleEs: "CAPÍTULO 1: HACIA UNA MOVILIDAD SUSTENTABLE",
  status: "implemented",
  styleTokenFamilies: ["manual-chapter-divider", "manual-prose"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: ["content/validation/manual-guide/page-021/source-panel-region.jpg"],
    russianScreenshots: [
      "content/validation/manual-guide/page-021/manual-page-021-desktop.png",
      "content/validation/manual-guide/page-021/manual-page-021-mobile.png"
    ],
    notes: [
      "Source page 21 is a chapter-divider/title page with one solid light-blue panel and no instructional body prose.",
      "Learner rendering omits book-only page number/footer chrome, uses a cleaned local panel asset with no Spanish text, and renders all Russian title/subtitle text as selectable DOM."
    ]
  },
  blocks: [
    {
      id: "page-021-chapter-divider",
      kind: "chapter-divider",
      eyebrowRu: "Глава 1 - Теоретическое руководство по управлению городскими четырехколесными транспортными средствами",
      titleRu: "К устойчивой мобильности",
      sourceTextEs:
        "HACIA UNA MOVILIDAD SUSTENTABLE\nCapítulo 1 - Manual teórico de conducción de vehículos urbanos de cuatro ruedas",
      panelAssetPath:
        "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/chapter-1/page-021/chapter-divider-panel-clean.svg",
      sourcePage: 21,
      sourceRegion: {
        x: 298,
        y: 421,
        width: 595,
        height: 842
      },
      visibleSpanish: false,
      cleanupStatus:
        "solid source panel color sampled from page 21 (#AADCEB); Spanish text is not retained in the runtime asset; Russian heading and subtitle are DOM text overlays"
    }
  ]
};
