import type { ManualGuideSectionContent } from "../manualGuide";

export const ch3OvertakingSection: ManualGuideSectionContent = {
  id: "ch3-overtaking-content",
  sectionId: "ch3-overtaking",
  titleRu: "Обгон и опережение",
  sourcePages: [76, 77],
  sourceTitleEs: "Adelantamiento y sobrepaso",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch3-overtaking/page-076-overtaking-source-crop.jpg",
      "content/validation/manual-guide/ch3-overtaking/page-077-overtaking-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch3-overtaking/ch3-overtaking-desktop.png",
      "content/validation/manual-guide/ch3-overtaking/ch3-overtaking-mobile.png"
    ],
    notes: [
      "Source PDF pages 76-77 are converted as the Chapter 3 overtaking/sobrepaso section.",
      "Source diagrams with embedded Spanish text are preserved as x5 reference evidence only; runtime rules are selectable Russian DOM text.",
      "No road-marking image or diagram is modified, translated, redrawn, masked, or retouched."
    ]
  },
  blocks: [
    {
      id: "definitions",
      kind: "list",
      titleRu: "Различие терминов",
      sourceTextEs:
        "Adelantamiento... Sobrepaso...",
      itemsRu: [
        "Adelantamiento (обгон) - маневр, при котором транспортное средство проходит линию другого движущегося транспортного средства и для этого обычно меняет полосу.",
        "Sobrepaso (опережение) - прохождение мимо другого транспортного средства без необходимости менять полосу, например когда полосы идут в одном направлении.",
        "Использование полосы зависит от ситуации: левая полоса связана с обгоном и более быстрым движением, правая - с обычным движением и подготовкой к поворотам или съездам, если знаки не указывают иное."
      ]
    },
    {
      id: "safe-pass",
      kind: "list",
      titleRu: "Безопасное опережение",
      sourceTextEs:
        "Sobrepaso seguro... siempre se deben tomar precauciones... completa seguridad de que hay suficiente espacio y tiempo.",
      itemsRu: [
        "Даже если впереди идущий транспорт подает сигнал, водитель, выполняющий опережение или обгон, обязан сам убедиться, что есть достаточно места и времени.",
        "Нужно оценить встречное движение, разметку, видимость, скорость своего и других транспортных средств, боковую дистанцию и возможность вернуться в поток без риска.",
        "Нельзя выполнять маневр, если он заставит другой транспорт резко тормозить, менять траекторию или если он создаст риск у перекрестка, железнодорожного переезда, моста, кривой, вершины подъема или другого опасного участка."
      ]
    },
    {
      id: "law-24449",
      kind: "callout",
      sourceTextEs:
        "La ley 24449, en su articulo 42, agrega...",
      textRu:
        "Статья 42 Ley 24449 дополняет правило adelantamiento (обгона): маневр выполняют только там, где он разрешен и безопасен, заранее предупреждают, соблюдают дистанцию и возвращаются вправо без мешающего или опасного движения."
    }
  ]
};
