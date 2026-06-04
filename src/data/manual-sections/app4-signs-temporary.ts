import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-temporary";

const officialSignException = {
  kind: "official-traffic-sign-source-as-is",
  visibleSpanishScope: "official-sign-image-only",
  sourceAsIs: true
} as const;

export const app4SignsTemporarySection: ManualGuideSectionContent = {
  id: "app4-signs-temporary-content",
  sectionId: "app4-signs-temporary",
  titleRu: "Временные",
  sourcePages: [193, 194],
  sourceTitleEs: "Transitorias",
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
      "content/validation/manual-guide/app4-signs-temporary/page-193-temporary-source-crop.jpg",
      "content/validation/manual-guide/app4-signs-temporary/page-194-temporary-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app4-signs-temporary/app4-signs-temporary-desktop.png",
      "content/validation/manual-guide/app4-signs-temporary/app4-signs-temporary-mobile.png"
    ],
    notes: [
      "Pages 193-194 are implemented with unchanged x5 temporary sign sheets.",
      "Russian explanations for temporary-road, pedestrian, cycleway, and other-device categories are outside the images."
    ]
  },
  blocks: [
    {
      id: "temporary-role",
      kind: "lead",
      sourceTextEs:
        "Transitorias. Viales. Peatonales y de ciclovias. Peatonales. De ciclovias. Otros dispositivos.",
      textRu:
        "Временные знаки и устройства меняют обычный режим движения на время работ, перекрытий, объездов, временной организации пешеходного или велосипедного движения и других дорожных ситуаций."
    },
    {
      id: "temporary-groups",
      kind: "list",
      titleRu: "Как использовать временную сигнализацию",
      sourceTextEs:
        "Transitorias: viales, peatonales y de ciclovias, peatonales, de ciclovias y otros dispositivos.",
      itemsRu: [
        "Временные дорожные знаки имеют приоритет как актуальная организация движения в конкретном месте.",
        "Пешеходные временные устройства направляют людей по безопасному временному пути и отделяют их от зоны риска.",
        "Временные элементы для велодорожек показывают перенос, закрытие или особый режим велосипедного маршрута.",
        "Другие устройства могут физически направлять или ограничивать движение: конусы, ограждения, панели, маяки и разметочные элементы."
      ]
    },
    {
      id: "temporary-source-sheets",
      kind: "source-image-cards",
      titleRu: "Официальные листы временных знаков и устройств",
      sourceTextEs:
        "Transitorias: viales, peatonales y de ciclovias, peatonales, de ciclovias, otros dispositivos.",
      cards: [
        {
          id: "app4-temporary-page-193-source-card",
          titleRu: "Страница 193: дорожные, пешеходные и велосипедные временные знаки",
          sourcePage: 193,
          sourceRegion: { x: 0, y: 0, width: 2976, height: 4209 },
          assetPath: `${assetRoot}/sign-sheet-193-source-as-is.jpg`,
          altRu:
            "Официальный лист временных дорожных, пешеходных и велосипедных знаков, сохраненный без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Лист сохранен без изменений. Русские пояснения рядом не заменяют официальные испанские подписи внутри изображения."
        },
        {
          id: "app4-temporary-page-194-source-card",
          titleRu: "Страница 194: пешеходные, велосипедные и другие временные устройства",
          sourcePage: 194,
          sourceRegion: { x: 0, y: 0, width: 2976, height: 4209 },
          assetPath: `${assetRoot}/sign-sheet-194-source-as-is.jpg`,
          altRu:
            "Официальный лист временных пешеходных, велосипедных и других устройств, сохраненный без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Пиктограммы, цвета, подписи и форма устройств не переведены, не ретушированы и не перерисованы."
        }
      ],
      visualNotes: [
        "Temporary signs and devices are treated as protected official source visuals.",
        "No Spanish cleanup or Russian overlay is applied to the images."
      ]
    }
  ]
};
