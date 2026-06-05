import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-regulatory";

const officialSignException = {
  kind: "official-traffic-sign-source-as-is",
  visibleSpanishScope: "official-sign-image-only",
  sourceAsIs: true
} as const;

export const app4SignsRegulatorySection: ManualGuideSectionContent = {
  id: "app4-signs-regulatory-content",
  sectionId: "app4-signs-regulatory",
  titleRu: "Предписывающие",
  sourcePages: [185, 186],
  sourceTitleEs: "Reglamentarias",
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
      "content/validation/manual-guide/app4-signs-regulatory/page-185-regulatory-source-crop.jpg",
      "content/validation/manual-guide/app4-signs-regulatory/page-186-regulatory-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app4-signs-regulatory/app4-signs-regulatory-desktop.png",
      "content/validation/manual-guide/app4-signs-regulatory/app4-signs-regulatory-mobile.png"
    ],
    notes: [
      "Pages 185-186 are implemented with source-as-is traffic sign sheet crops extracted from the official PDF source.",
      "No sign pixels are translated, recolored, cleaned, masked, retouched, reconstructed, or redrawn.",
      "Russian explanations are adjacent to and below the images as selectable DOM text."
    ]
  },
  blocks: [
    {
      id: "regulatory-role",
      kind: "lead",
      sourceTextEs: "Reglamentarias. De prohibicion, de restriccion, de prioridad y de fin de prescripcion.",
      textRu:
        "Регулирующие знаки сообщают водителю обязательное правило: запрет, ограничение, приоритет или конец ранее действовавшего предписания. Сами знаки на листах идут на испанском как визуальные образцы."
    },
    {
      id: "regulatory-groups",
      kind: "list",
      titleRu: "Как читать эту группу",
      sourceTextEs:
        "De prohibicion. De restriccion. De prioridad. De fin de prescripcion.",
      itemsRu: [
        "Запрещающие знаки обычно сообщают, какое действие нельзя выполнять: въезд, поворот, обгон, остановку, стоянку или движение определенного типа транспорта.",
        "Ограничивающие знаки задают пределы или условия движения: скорость, массу, высоту, ширину, длину, дистанцию, направление или обязательный режим.",
        "Знаки приоритета показывают, кто должен уступить или кто имеет преимущество на конкретном участке.",
        "Знаки окончания предписания отменяют ранее действовавший запрет или ограничение."
      ]
    },
    {
      id: "regulatory-source-sheets",
      kind: "source-image-cards",
      titleRu: "Листы регулирующих знаков",
      sourceTextEs:
        "Reglamentarias: de prohibicion, de restriccion, de prioridad y de fin de prescripcion.",
      cards: [
        {
          id: "app4-regulatory-page-185-source-card",
          titleRu: "Страница 185: запрещающие",
          displayMode: "full-width",
          maxDisplayWidthPx: 664,
          minDisplayWidthPx: 664,
          sourcePage: 185,
          sourceRegion: { x: 1110, y: 1602, width: 663, height: 981 },
          assetPath: `${assetRoot}/sign-sheet-185-source-crop-as-is.jpg`,
          altRu:
            "Лист запрещающих регулирующих дорожных знаков с испанскими подписями.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Испанские названия внутри изображения не переведены и не закрыты; используйте знаки как визуальный образец, а русскую расшифровку групп читайте рядом."
        },
        {
          id: "app4-regulatory-page-186-source-card",
          titleRu: "Страница 186: ограничения, приоритет и конец предписания",
          displayMode: "full-width",
          maxDisplayWidthPx: 704,
          minDisplayWidthPx: 704,
          sourcePage: 186,
          sourceRegion: { x: 1162, y: 1602, width: 704, height: 981 },
          assetPath: `${assetRoot}/sign-sheet-186-source-crop-as-is.jpg`,
          altRu:
            "Лист регулирующих знаков ограничения, приоритета и окончания предписания с испанскими подписями.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Русский текст дан рядом: он не нанесен поверх знаков, чтобы их внешний вид не менялся."
        }
      ],
      visualNotes: [
        "Both runtime images are byte-identical to their feature 034 official-source crop evidence.",
        "Feature 034 removed only empty outer page margins and caps display at each natural crop width because the official PDF source is source-limited for useful sign pixels.",
        "For text-readability evidence, these source-limited sheets keep their natural crop width on narrow viewports with contained figure scrolling instead of being downscaled to phone width or browser-upscaled.",
        "The visible Spanish text is allowed only inside the official sign sheets.",
        "Russian explanatory text is selectable DOM text outside the protected images."
      ]
    }
  ]
};
