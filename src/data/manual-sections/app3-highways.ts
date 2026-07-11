import type { ManualGuideSectionContent } from "../manualGuide";

export const app3HighwaysSection: ManualGuideSectionContent = {
  id: "app3-highways-content",
  sectionId: "app3-highways",
  titleRu: "Автомагистрали",
  sourcePages: [182, 183],
  sourceTitleEs: "Autopistas",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-legal-detail"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/app3-highways/page-182-highways-source-crop.jpg",
      "content/validation/manual-guide/app3-highways/page-183-highways-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app3-highways/app3-highways-desktop.png",
      "content/validation/manual-guide/app3-highways/app3-highways-mobile.png"
    ],
    notes: [
      "Pages 182-183 are implemented as selectable Russian DOM text.",
      "Page 183 is the Appendix III closing slogan only; Appendix IV page 184 and later are not bundled."
    ]
  },
  blocks: [
    {
      id: "highways-heading",
      kind: "lead",
      sourceTextEs: "Autopistas",
      textRu:
        "Раздел Приложение III (Appendix III) завершает грузовую тему автомагистралями и профессиональной ответственностью перевозчика грузов."
    },
    {
      id: "closing-message",
      kind: "quote",
      sourceTextEs:
        "La profesionalizacion del transporte de cargas y mercaderias, no solo resguarda la carga trasladada, sino tambien la integridad fisica de quien conduce y la de las demas personas.",
      textRu:
        "Профессионализация перевозки грузов и товаров защищает не только перевозимый груз, но и физическую целостность водителя и других людей."
    },
    {
      id: "appendix-boundary",
      kind: "callout",
      sourceTextEs: "Anexo IV comienza despues de la pagina 183.",
      textRu:
        "После этой закрывающей страницы начинается Приложение IV о дорожных знаках. Оно не входит в PR по Приложению III, то есть Appendix III PR (Приложение III в текущей работе), и остается отдельной будущей работой."
    }
  ]
};
