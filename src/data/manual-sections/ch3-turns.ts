import type { ManualGuideSectionContent } from "../manualGuide";

export const ch3TurnsSection: ManualGuideSectionContent = {
  id: "ch3-turns-content",
  sectionId: "ch3-turns",
  titleRu: "Повороты на перекрестках",
  sourcePages: [75],
  sourceTitleEs: "Giros en intersecciones",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: ["content/validation/manual-guide/ch3-turns/page-075-turns-source-crop.jpg"],
    russianScreenshots: [
      "content/validation/manual-guide/ch3-turns/ch3-turns-desktop.png",
      "content/validation/manual-guide/ch3-turns/ch3-turns-mobile.png"
    ],
    notes: [
      "Source PDF page 75 is converted as the Chapter 3 turns section.",
      "The section is runtime text-only and uses selectable Russian DOM text.",
      "No source visual is modified or introduced."
    ]
  },
  blocks: [
    {
      id: "turns-core",
      kind: "lead",
      sourceTextEs:
        "Giros en intersecciones. En todos los casos...",
      textRu:
        "Поворот на перекрестке должен быть заранее понятен другим участникам движения и выполняться плавно, без внезапного торможения и без ускоренного входа в боковую улицу."
    },
    {
      id: "turns-rules",
      kind: "list",
      titleRu: "Во всех случаях",
      sourceTextEs:
        "Anticipar la maniobra 30 mts. antes con la luz de giro correspondiente. Reducir la velocidad paulatinamente...",
      itemsRu: [
        "Предупредить о маневре за 30 м соответствующим указателем поворота.",
        "Постепенно снизить скорость до выполнения поворота в bocacalle (зоне перекрестка/угла).",
        "Выполнять маневр на умеренной скорости.",
        "Сохранять внимание к пешеходам, велосипедистам и транспорту, который уже начал пересечение."
      ]
    }
  ]
};
