import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-horizontal";

const sourceImageException = {
  kind: "source-image-original-visible-text",
  visibleSpanishScope: "source-image-only",
  sourceAsIs: true,
  russianExplanationOutsideImage: true
} as const;

export const app4SignsHorizontalSection: ManualGuideSectionContent = {
  id: "app4-signs-horizontal-content",
  sectionId: "app4-signs-horizontal",
  titleRu: "Горизонтальные",
  sourcePages: [195, 196],
  sourceTitleEs: "Horizontales",
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
      "content/validation/manual-guide/app4-signs-horizontal/page-195-horizontal-source-crop.jpg",
      "content/validation/manual-guide/app4-signs-horizontal/page-196-horizontal-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app4-signs-horizontal/app4-signs-horizontal-desktop.png",
      "content/validation/manual-guide/app4-signs-horizontal/app4-signs-horizontal-mobile.png"
    ],
    notes: [
      "Pages 195-196 are implemented with unchanged official road-marking pixels cropped to remove empty outer page margins.",
      "Road-marking images are not translated, relabeled, recolored, cleaned, masked, retouched, reconstructed, or redrawn."
    ]
  },
  blocks: [
    {
      id: "horizontal-role",
      kind: "lead",
      sourceTextEs:
        "Horizontales. Marcas longitudinales, marcas transversales y marcas especiales.",
      textRu:
        "Горизонтальная сигнализация - это дорожная разметка на покрытии. Она направляет поток, разделяет полосы, показывает места остановки, переходы, особые зоны и другие правила движения."
    },
    {
      id: "horizontal-groups",
      kind: "list",
      titleRu: "Виды разметки",
      sourceTextEs:
        "Marcas longitudinales. Marcas transversales. Marcas especiales.",
      itemsRu: [
        "Продольная разметка идет вдоль направления движения: линии полос, разделение потоков, край проезжей части, выделенные полосы и направления.",
        "Поперечная разметка пересекает направление движения: стоп-линии, пешеходные переходы, линии уступания и места остановки.",
        "Специальная разметка сообщает особый режим участка: надписи на покрытии, островки, зоны, стрелки, велосипедные элементы и другие предупреждения."
      ]
    },
    {
      id: "horizontal-source-sheets",
      kind: "source-image-cards",
      titleRu: "Листы дорожной разметки",
      sourceTextEs:
        "Horizontales: marcas longitudinales, marcas transversales, marcas especiales.",
      cards: [
        {
          id: "app4-horizontal-page-195-source-card",
          titleRu: "Страница 195: продольная и поперечная разметка",
          displayMode: "full-width",
          maxDisplayWidthPx: 674,
          minDisplayWidthPx: 674,
          sourcePage: 195,
          sourceRegion: { x: 1110, y: 1602, width: 673, height: 981 },
          assetPath: `${assetRoot}/marking-sheet-195-source-crop-as-is.jpg`,
          altRu:
            "Лист продольной и поперечной дорожной разметки с испанскими подписями.",
          visibleSpanish: true,
          sourceImageException,
          bodyRu:
            "Разметка и испанские подписи остаются внутри листа; русский текст рядом объясняет группы, не меняя изображение."
        },
        {
          id: "app4-horizontal-page-196-source-card",
          titleRu: "Страница 196: специальная разметка",
          displayMode: "full-width",
          maxDisplayWidthPx: 704,
          minDisplayWidthPx: 704,
          sourcePage: 196,
          sourceRegion: { x: 1162, y: 1602, width: 704, height: 981 },
          assetPath: `${assetRoot}/marking-sheet-196-source-crop-as-is.jpg`,
          altRu:
            "Лист специальной дорожной разметки с испанскими подписями.",
          visibleSpanish: true,
          sourceImageException,
          bodyRu:
            "Специальная разметка показана без очистки текста, масок, перекраски или перерисовки. Перевод дается только отдельным текстом рядом."
        }
      ],
      visualNotes: [
        "Both road-marking runtime images are byte-identical to feature 034 official-source crop evidence.",
        "The official PDF source is source-limited for useful marking pixels, so runtime display is capped at each natural crop width.",
        "The cards use contained figure scrolling on narrow screens so source labels stay at natural crop width without browser upscaling.",
        "Visible Spanish remains only inside the protected road-marking images."
      ]
    }
  ]
};
