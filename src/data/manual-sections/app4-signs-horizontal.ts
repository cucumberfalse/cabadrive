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
      id: "horizontal-individual-sign-catalog",
      kind: "manual-sign-catalog",
      titleRu: "Карточки дорожной разметки",
      sourceTextEs: "Horizontales: individual source-region catalog.",
      sectionId: "app4-signs-horizontal",
      visualNotes: [
        "Each entry clips an unchanged official source image region with CSS.",
        "Spanish and Russian captions are selectable text outside the protected source image."
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
          termTranslations: [
            { termEs: "Horizontales", translationRu: "Горизонтальная разметка" },
            { termEs: "Marcas longitudinales", translationRu: "Продольная разметка" },
            { termEs: "Línea de separación de circulación", translationRu: "Линия разделения движения" },
            { termEs: "Líneas continuas y discontinuas paralelas", translationRu: "Параллельные сплошные и прерывистые линии" },
            { termEs: "Líneas de separación de sentido de circulación opuesta", translationRu: "Линии разделения встречных направлений" },
            { termEs: "Líneas divisorias de carriles con corrientes de tránsito del mismo sentido", translationRu: "Линии разделения полос одного направления" },
            { termEs: "Línea de separación de sentido de circulación", translationRu: "Линия разделения направления движения" },
            { termEs: "Línea de carril exclusivo y carril preferencial", translationRu: "Линия выделенной или приоритетной полосы" },
            { termEs: "Líneas de borde de calzada", translationRu: "Краевые линии проезжей части" },
            { termEs: "Marcas transversales", translationRu: "Поперечная разметка" },
            { termEs: "Línea de detención", translationRu: "Стоп-линия" },
            { termEs: "Senda peatonal o senda para cruce de ciclistas", translationRu: "Пешеходный переход или пересечение велосипедистов" },
            { termEs: "Senda peatonal", translationRu: "Пешеходный переход" },
            { termEs: "Senda peatonal con línea de frenado previa", translationRu: "Переход с предварительной линией торможения" },
            { termEs: "Líneas auxiliares para reducción de velocidad", translationRu: "Вспомогательные линии снижения скорости" }
          ],
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
          termTranslations: [
            { termEs: "Marcas especiales", translationRu: "Специальная разметка" },
            { termEs: "Carril exclusivo para transporte público de pasajeros", translationRu: "Выделенная полоса для пассажирского общественного транспорта" },
            { termEs: "Marca de estacionamiento", translationRu: "Разметка места стоянки" },
            { termEs: "Marca de carril exclusivo", translationRu: "Разметка выделенной полосы" },
            { termEs: "Marca de ciclovía", translationRu: "Разметка велодорожки" },
            { termEs: "Isletas canalizadoras de tránsito", translationRu: "Направляющие островки движения" },
            { termEs: "Flechas de dirección", translationRu: "Стрелки направления" },
            { termEs: "Pare", translationRu: "Стоп" },
            { termEs: "Ceda el paso", translationRu: "Уступите дорогу" },
            { termEs: "Velocidad máxima", translationRu: "Максимальная скорость" },
            { termEs: "Escolar", translationRu: "Школьная зона" },
            { termEs: "Cruce ferroviario", translationRu: "Железнодорожный переезд" },
            { termEs: "Cruce de peatones", translationRu: "Пешеходный переход" },
            { termEs: "Cruce de ciclistas", translationRu: "Пересечение велосипедистов" }
          ],
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
