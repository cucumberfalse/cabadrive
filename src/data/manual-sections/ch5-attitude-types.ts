import type { ManualGuideSectionContent } from "../manualGuide";

export const ch5AttitudeTypesSection: ManualGuideSectionContent = {
  id: "ch5-attitude-types-content",
  sectionId: "ch5-attitude-types",
  titleRu: "Типы установок",
  sourcePages: [99],
  sourceTitleEs: "Tipos de actitudes",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: ["content/validation/manual-guide/ch5-attitude-types/page-099-attitude-types-source-crop.jpg"],
    russianScreenshots: [
      "content/validation/manual-guide/ch5-attitude-types/ch5-attitude-types-desktop.png",
      "content/validation/manual-guide/ch5-attitude-types/ch5-attitude-types-mobile.png"
    ],
    notes: [
      "Source page 99 is rendered as selectable Russian runtime text; the chapter divider on source page 98 remains navigation-only.",
      "The section owns the attitude text on shared source page 99 before Hacia una sociedad igualitaria.",
      "No source photos, signs, road markings, or infographics occur in this section."
    ]
  },
  blocks: [
    {
      id: "good-driving-attitude",
      kind: "lead",
      sourceTextEs:
        "Una buena conducción no sólo depende de la aptitud de la persona... Existe un tercer aspecto que interviene: la actitud.",
      textRu:
        "Хорошее вождение зависит не только от пригодности человека: недостаточно иметь знания, навыки и психофизическое состояние, позволяющее управлять. Есть еще третий аспект - actitud, то есть установка или отношение: способ чувствовать и думать, который предрасполагает к положительному или отрицательному поведению."
    },
    {
      id: "positive-attitudes",
      kind: "table",
      titleRu: "Положительные установки",
      sourceTextEs: "Positivas: Tolerante, Solidaria, Comprensiva, Prudente.",
      columnsRu: ["Термин", "Смысл для водителя"],
      rows: [
        {
          id: "positive-tolerante",
          cellsRu: [
            "Tolerante - терпимая",
            "принимает разнообразие других участников движения и их возможные ошибки"
          ]
        },
        {
          id: "positive-solidaria",
          cellsRu: [
            "Solidaria - солидарная",
            "своими маневрами облегчает маневры других людей"
          ]
        },
        {
          id: "positive-comprensiva",
          cellsRu: [
            "Comprensiva - понимающая",
            "ставит себя на место другого человека и действует с учетом этого"
          ]
        },
        {
          id: "positive-prudente",
          cellsRu: ["Prudente - осторожная", "избегает ненужных рисков"]
        }
      ]
    },
    {
      id: "negative-attitudes",
      kind: "table",
      titleRu: "Отрицательные установки",
      sourceTextEs: "Negativas: Prepotente, Desconsiderada, Exhibicionista, Transgresora.",
      columnsRu: ["Термин", "Чем опасна"],
      rows: [
        {
          id: "negative-prepotente",
          cellsRu: [
            "Prepotente - властная",
            "пытается вершить собственную «справедливость», когда другие люди движутся не так, как водитель считает правильным"
          ]
        },
        {
          id: "negative-desconsiderada",
          cellsRu: [
            "Desconsiderada - невнимательная к другим",
            "мешает мобильности остальных и ставит себя выше других участников движения"
          ]
        },
        {
          id: "negative-exhibicionista",
          cellsRu: [
            "Exhibicionista - демонстративная",
            "хочет привлечь внимание и ради этого принимает опасное поведение"
          ]
        },
        {
          id: "negative-transgresora",
          cellsRu: [
            "Transgresora - нарушающая правила",
            "совершает нарушения из-за спешки"
          ]
        }
      ],
      captionRu:
        "Экзаменационный смысл: установка водителя прямо влияет на безопасность, даже когда знания правил и технические навыки уже есть."
    }
  ]
};
