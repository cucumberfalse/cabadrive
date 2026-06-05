import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-warning";

const officialSignException = {
  kind: "official-traffic-sign-source-as-is",
  visibleSpanishScope: "official-sign-image-only",
  sourceAsIs: true
} as const;

export const app4SignsWarningSection: ManualGuideSectionContent = {
  id: "app4-signs-warning-content",
  sectionId: "app4-signs-warning",
  titleRu: "Предупреждающие",
  sourcePages: [187, 188],
  sourceTitleEs: "Preventivas",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-source-artwork",
    "manual-legal-detail"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/app4-signs-warning/page-187-warning-source-crop.jpg",
      "content/validation/manual-guide/app4-signs-warning/page-188-warning-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app4-signs-warning/app4-signs-warning-desktop.png",
      "content/validation/manual-guide/app4-signs-warning/app4-signs-warning-mobile.png"
    ],
    notes: [
      "Pages 187-188 are implemented with unchanged x5 warning sign sheets.",
      "Russian learner text explains the warning categories outside the protected source images."
    ]
  },
  blocks: [
    {
      id: "warning-role",
      kind: "lead",
      sourceTextEs:
        "Preventivas. Advertencias sobre caracteristicas de la via. Advertencias de maximo peligro. Posibilidad de riesgo eventual. Anticipo de otros dispositivos de control del transito. Fin de prevencion.",
      textRu:
        "Предупреждающие знаки заранее готовят водителя к риску: особенности дороги, место максимальной опасности, возможная временная опасность, приближение другого устройства управления движением или конец предупреждения."
    },
    {
      id: "warning-groups",
      kind: "list",
      titleRu: "Что важно для экзамена",
      sourceTextEs:
        "Advertencias sobre caracteristicas de la via; advertencias de maximo peligro; posibilidad de riesgo eventual; anticipo de otros dispositivos de control del transito; fin de prevencion.",
      itemsRu: [
        "Предупреждение не всегда запрещает действие, но требует заранее снизить риск: уменьшить скорость, увеличить внимание и подготовиться к маневру.",
        "Знаки о характеристиках дороги предупреждают о кривых, уклонах, сужениях, мостах, туннелях, пересечениях и других особенностях траектории.",
        "Знаки максимальной опасности выделяют места, где ошибка особенно критична: железнодорожный переезд, опасный перекресток, дети, пешеходы или животные.",
        "Предупреждения о возможном риске и приближении устройств контроля помогают заранее ожидать светофор, знак, контроль или временное изменение."
      ]
    },
    {
      id: "warning-source-sheets",
      kind: "source-image-cards",
      titleRu: "Официальные листы предупреждающих знаков",
      sourceTextEs:
        "Preventivas: advertencias sobre caracteristicas de la via, maximo peligro, riesgo eventual, anticipo de otros dispositivos y fin de prevencion.",
      cards: [
        {
          id: "app4-warning-page-187-source-card",
          titleRu: "Страница 187: характеристики дороги",
          displayMode: "full-width",
          maxDisplayWidthPx: 2976,
          sourcePage: 187,
          sourceRegion: { x: 0, y: 0, width: 2976, height: 4209 },
          assetPath: `${assetRoot}/sign-sheet-187-source-as-is.jpg`,
          altRu:
            "Официальный лист предупреждающих знаков о характеристиках дороги, сохраненный без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Официальные пиктограммы, подписи и цвета оставлены без изменения. Русское объяснение не заменяет текст внутри листа и не накладывается на знаки."
        },
        {
          id: "app4-warning-page-188-source-card",
          titleRu: "Страница 188: максимальная опасность и другие предупреждения",
          displayMode: "full-width",
          maxDisplayWidthPx: 2976,
          sourcePage: 188,
          sourceRegion: { x: 0, y: 0, width: 2976, height: 4209 },
          assetPath: `${assetRoot}/sign-sheet-188-source-as-is.jpg`,
          altRu:
            "Официальный лист предупреждающих знаков максимальной опасности, возможного риска и окончания предупреждения, сохраненный без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Лист сохранен как источник. Любые испанские подписи остаются только внутри изображения; русская памятка находится в тексте вокруг него."
        }
      ],
      visualNotes: [
        "Warning signs remain source-as-is at x5 dimensions.",
        "No glyph cleanup or Russian overlay is applied to official sign sheets."
      ]
    }
  ]
};
