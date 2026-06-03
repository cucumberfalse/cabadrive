import type { ManualGuideSectionContent } from "../manualGuide";

export const ch3HighwaysSection: ManualGuideSectionContent = {
  id: "ch3-highways-content",
  sectionId: "ch3-highways",
  titleRu: "Движение по автомагистралям и другим скоростным дорогам",
  sourcePages: [78],
  sourceTitleEs: "Circulacion por autopistas y otras vias rapidas",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: ["content/validation/manual-guide/ch3-highways/page-078-highways-source-crop.jpg"],
    russianScreenshots: [
      "content/validation/manual-guide/ch3-highways/ch3-highways-desktop.png",
      "content/validation/manual-guide/ch3-highways/ch3-highways-mobile.png"
    ],
    notes: [
      "Source PDF page 78 is converted as the Chapter 3 highways and fast roads section.",
      "The runtime section is text-only/selectable; source visual material is x5 reference evidence.",
      "No highway diagram, sign, or marking image is modified."
    ]
  },
  blocks: [
    {
      id: "highway-lead",
      kind: "lead",
      sourceTextEs:
        "Conducción en autopistas y otras vías rápidas.",
      textRu:
        "Autopistas и другие vías rápidas требуют более строгого планирования: скорость выше, пространство для ошибки меньше, а решения о въезде, выезде, полосе и дистанции нужно принимать заранее."
    },
    {
      id: "highway-rules",
      kind: "list",
      titleRu: "Практика движения на скоростных дорогах",
      sourceTextEs:
        "Conducción en autopistas y otras vías rápidas.",
      itemsRu: [
        "Въезжать нужно через полосу разгона, набирая скорость так, чтобы встроиться в поток без вынуждения других резко тормозить.",
        "Держать дистанцию безопасности и учитывать, что при высокой скорости дистанция реакции и торможения существенно растет.",
        "Пользоваться полосами по назначению: не занимать левую полосу без необходимости, заранее готовиться к съезду и не делать резких перестроений.",
        "Съезжать нужно через полосу замедления, снижая скорость уже после ухода с основной полосы.",
        "Остановка на скоростной дороге допустима только при необходимости и с максимальным использованием безопасной зоны, аварийной сигнализации и предупреждения остальных участников."
      ]
    }
  ]
};
