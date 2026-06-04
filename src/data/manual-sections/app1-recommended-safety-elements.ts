import type { ManualGuideSectionContent } from "../manualGuide";

export const app1RecommendedSafetyElementsSection: ManualGuideSectionContent = {
  id: "app1-recommended-safety-elements-content",
  sectionId: "app1-recommended-safety-elements",
  titleRu: "Рекомендуемые элементы безопасности",
  sourcePages: [121, 122],
  sourceTitleEs: "Elementos de seguridad recomendables",
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
      "content/validation/manual-guide/app1-recommended-safety-elements/page-121-recommended-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-recommended-safety-elements/page-122-recommended-safety-elements-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app1-recommended-safety-elements/app1-recommended-safety-elements-desktop.png",
      "content/validation/manual-guide/app1-recommended-safety-elements/app1-recommended-safety-elements-mobile.png"
    ],
    notes: [
      "Pages 121-122 are implemented as selectable Russian DOM text.",
      "First-aid kit, tow-bar, and closing safety-condition details are preserved.",
      "No Appendix II, Appendix III, Appendix IV, front-matter, or unrelated corrections are bundled."
    ]
  },
  blocks: [
    {
      id: "first-aid-kit",
      kind: "list",
      titleRu: "Аптечка",
      sourceTextEs:
        "Botiquín de primeros auxilios: identificado con una cruz; gasas, vendas, cinta, agua oxigenada, solución yodada...",
      itemsRu: [
        "Аптечку рекомендуется иметь в автомобиле; она обозначается крестом и хранится в надежно закрепленном месте.",
        "Источник перечисляет стерильную гидрофильную марлю.",
        "Бинты или перевязочные материалы.",
        "Гипоаллергенный пластырь.",
        "Перекись водорода.",
        "Раствор йода.",
        "Спирт или дезинфицирующее средство.",
        "Несколько пар латексных или виниловых перчаток.",
        "Крем от ожогов.",
        "Противодиарейные угольные таблетки.",
        "Анальгетики и противовоспалительные лекарства.",
        "Крем от укусов насекомых.",
        "Пинцет и ножницы.",
        "Фонарик с запасными батарейками или аккумулятором."
      ]
    },
    {
      id: "tow-bar",
      kind: "list",
      titleRu: "Буксировочная штанга",
      sourceTextEs:
        "Barra de remolque homologada, telescópica, reemplaza sogas, cables u otros medios flexibles; no puede usarse dentro de CABA.",
      itemsRu: [
        "Источник рекомендует сертифицированную телескопическую буксировочную штангу.",
        "Она заменяет веревки, тросы и другие гибкие средства, которые источник считает небезопасными и недействительными.",
        "Штанга соединяет заводские точки буксировки двух автомобилей.",
        "В CABA частному автомобилю запрещено буксировать другой частный автомобиль.",
        "Буксировка должна выполняться уполномоченным автомобилем."
      ]
    },
    {
      id: "closing-safety-condition",
      kind: "callout",
      sourceTextEs:
        "La seguridad no sólo depende del comportamiento y responsabilidad, sino también del estado y elementos de seguridad del vehículo.",
      textRu:
        "Итог источника: безопасность зависит не только от поведения и ответственности водителя. Она также зависит от состояния автомобиля и его элементов безопасности."
    }
  ]
};
