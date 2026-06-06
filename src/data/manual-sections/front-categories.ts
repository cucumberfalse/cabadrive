import type { ManualGuideSectionContent } from "../manualGuide";

export const frontCategoriesSection: ManualGuideSectionContent = {
  id: "front-categories-content",
  sectionId: "front-categories",
  titleRu: "Материал по категориям",
  sourcePages: [3, 4],
  sourceTitleEs: "Material por categorías",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-front-matter"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/front-categories/page-003-categories-source-crop.jpg",
      "content/validation/manual-guide/front-categories/page-004-categories-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/front-categories/front-categories-desktop.png",
      "content/validation/manual-guide/front-categories/front-categories-mobile.png"
    ],
    notes: [
      "Pages 3-4 are implemented as a compact source-scope support note because page 3 names the category B study set.",
      "The section is text-only at runtime; x5 source renders are validation evidence only.",
      "Category F content is retained only as source-scope context and does not add non-B learner material."
    ]
  },
  blocks: [
    {
      id: "category-b-scope",
      kind: "lead",
      sourceTextEs:
        "Categoría B / Automóviles: Introducción, Capítulo 1, Capítulo 2, Capítulo 3, Capítulo 4, Capítulo 5, Anexo I, Anexo IV.",
      textRu:
        "Для категории B / автомобилей учебный набор такой: Введение, главы 1-5, Приложение I для частных автомобилей и Приложение IV с дорожными знаками."
    },
    {
      id: "category-map",
      kind: "table",
      titleRu: "Как читать карту категорий",
      sourceTextEs:
        "Organizado según categorías de licencias: Material a estudiar.",
      columnsRu: ["Категория", "Что добавляется к общим главам"],
      rows: [
        {
          id: "category-b",
          cellsRu: ["B / автомобили", "Приложение I и Приложение IV."]
        },
        {
          id: "category-d",
          cellsRu: ["D / пассажирский транспорт", "Приложение II и Приложение IV."]
        },
        {
          id: "category-c-e",
          cellsRu: ["C / груз; E / грузовики и специальная техника", "Приложение III и Приложение IV."]
        },
        {
          id: "category-f",
          cellsRu: ["F / адаптированные транспортные средства", "Приложение I, II или III в зависимости от основной категории, плюс Приложение IV."]
        }
      ],
      captionRu:
        "Для Cabadrive основной маршрут подготовки остается категорией B; остальные строки помогают понять структуру полного manual."
    },
    {
      id: "category-navigation-note",
      kind: "callout",
      sourceTextEs: "Material a estudiar.",
      textRu:
        "Практический вывод: если вы готовитесь на обычный автомобиль, не смешивайте Appendix II/III с основным маршрутом B. В `Руководстве` они доступны как части полного manual, но для категории B ключевой дополнительный материал - Appendix I и дорожные знаки Appendix IV."
    }
  ]
};
