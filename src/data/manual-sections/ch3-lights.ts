import type { ManualGuideSectionContent } from "../manualGuide";

export const ch3LightsSection: ManualGuideSectionContent = {
  id: "ch3-lights-content",
  sectionId: "ch3-lights",
  titleRu: "Использование света",
  sourcePages: [67, 68],
  sourceTitleEs: "Uso de luces",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch3-lights/page-067-lights-source-crop.jpg",
      "content/validation/manual-guide/ch3-lights/page-068-lights-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch3-lights/ch3-lights-desktop.png",
      "content/validation/manual-guide/ch3-lights/ch3-lights-mobile.png"
    ],
    notes: [
      "Source PDF pages 67-68 are converted as one lights section.",
      "Vehicle-light diagrams with embedded Spanish labels are reference evidence only; runtime meaning is selectable Russian DOM text.",
      "No source vehicle photo or diagram is translated, relabeled, cleaned, masked, or redrawn."
    ]
  },
  blocks: [
    {
      id: "lights-purpose",
      kind: "lead",
      sourceTextEs:
        "Las luces de un vehículo no sólo tienen como finalidad la de iluminar, sino también, la de brindar información...",
      textRu:
        "Световые приборы нужны не только для освещения. Они передают информацию другим водителям и пешеходам, поэтому являются частью коммуникации на дороге."
    },
    {
      id: "lights-modification-ban",
      kind: "callout",
      sourceTextEs:
        "Está prohibido en todos los vehículos modificar el tipo y la potencia de las luces originales de fábrica...",
      textRu:
        "Запрещено менять тип и мощность заводских огней, соответствующих модели, а также добавлять фары или свет, не предусмотренные Código de Tránsito y Transporte de CABA. Допускается только добавление двух противотуманных фар и до двух верхних стоп-сигналов. Изменения могут превратить элемент безопасности в фактор риска, например вызвать ослепление ксеноном."
    },
    {
      id: "front-lights",
      kind: "list",
      titleRu: "Передние огни",
      sourceTextEs:
        "Luces delanteras... Luces altas... Luces de posición... Luces bajas... Intermitentes giro/balizas... Rompeniebla.",
      itemsRu: [
        "Дальний свет нужен для освещения дороги и объектов на большом расстоянии. Его нельзя использовать при встречном транспорте или когда он может ослепить других.",
        "Габаритные/позиционные огни обозначают положение автомобиля и должны быть видны спереди и сзади.",
        "Ближний свет используется как основной режим движения в условиях, где дальний свет неуместен. Он помогает видеть дорогу и делает автомобиль заметным.",
        "Указатели поворота и аварийная сигнализация сообщают о повороте, перестроении, остановке, стоянке или аварийной ситуации.",
        "Противотуманные фары используются при тумане, сильном дожде, пыли или дыме, когда видимость ухудшена."
      ]
    },
    {
      id: "rear-lights",
      kind: "list",
      titleRu: "Задние огни и задний ход",
      sourceTextEs:
        "Luces traseras... además de estas luces, debe adicionarse una alarma sonora al circular marcha atrás.",
      itemsRu: [
        "Задние огни информируют тех, кто находится позади: положение, торможение, поворот, аварийная сигнализация и движение задним ходом.",
        "Если конструкция автомобиля мешает обзору через центральное зеркало заднего вида, при движении задним ходом дополнительно нужна звуковая сигнализация.",
        "Водителям motovehículos (мототранспорта) тоже важно знать функцию этих огней, даже если некоторые из них на таких транспортных средствах не устанавливаются."
      ]
    }
  ]
};
