import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-shared-trip";

const sourceImageException = {
  kind: "source-image-original-visible-text",
  visibleSpanishScope: "source-image-only",
  sourceAsIs: true,
  russianExplanationOutsideImage: true
} as const;

export const ch1SharedTripSection: ManualGuideSectionContent = {
  id: "ch1-shared-trip-content",
  sectionId: "ch1-shared-trip",
  titleRu: "Совместная поездка",
  sourcePages: [41, 42],
  sourceTitleEs: "Viaje compartido",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-source-artwork",
    "manual-shared-trip-visuals"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch1-shared-trip/page-041-shared-trip-source-crop.jpg",
      "content/validation/manual-guide/ch1-shared-trip/page-042-shared-trip-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch1-shared-trip/ch1-shared-trip-desktop.png",
      "content/validation/manual-guide/ch1-shared-trip/ch1-shared-trip-mobile.png"
    ],
    notes: [
      "Source PDF pages 41-42 are converted as one source-Indice website section.",
      "Runtime learner content uses Russian DOM text for the shared-trip recommendation, use cases, and benefits.",
      "The carpool diagram and mobility-priority page 42 photo are high-quality original source crops from local PDF renders.",
      "The Spanish quote and shop sign visible in the page 42 photo remain source-as-is inside the image; the Russian quote is outside the image as selectable DOM text."
    ]
  },
  blocks: [
    {
      id: "shared-trip-public-space-context",
      kind: "lead",
      sourceTextEs:
        "La relacion entre el espacio que ocupa un auto y la cantidad de personas que traslada es una cuestion para reflexionar. En tanto sea posible, es recomendable caminar, usar la bicicleta o el transporte publico.",
      textRu:
        "Автомобиль занимает много городского пространства по сравнению с количеством людей, которых перевозит. Поэтому, когда это возможно, лучше использовать общественное пространство иначе: ходить пешком, пользоваться велосипедом или общественным транспортом."
    },
    {
      id: "shared-trip-definition",
      kind: "paragraph",
      sourceTextEs:
        "Ahora bien, si el traslado debe realizarse en auto, es recomendable la practica del carpool o viaje compartido, tanto para viajes regulares como para trayectos ocasionales.",
      textRu:
        "Если поездку все же нужно выполнить на автомобиле, manual рекомендует carpool: совместную поездку для регулярных поездок или отдельных маршрутов. Практическая цель - максимально занять места в машине; эффект \"на четыре автомобиля меньше\" относится к поездке с другими водителями, которые иначе поехали бы за рулем отдельных автомобилей."
    },
    {
      id: "shared-trip-benefits",
      kind: "shared-trip-benefits",
      titleRu: "Преимущества совместной поездки",
      sourceTextEs:
        "Beneficios. Viaje compartido. Reduce la congestion. Brinda mas lugar para estacionar. Cuida el medioambiente. Ahorra costos de combustible, peaje y estacionamiento.",
      sourcePage: 41,
      sourceRegion: {
        x: 375,
        y: 830,
        width: 440,
        height: 185
      },
      assetPath: `${assetRoot}/carpool-diagram-source.jpg`,
      altRu:
        "Исходная схема совместной поездки: несколько автомобилей заменяются одним автомобилем с несколькими пассажирами.",
      visibleSpanish: false,
      introRu:
        "Исходная схема показывает простую логику: когда несколько людей едут вместе, город получает меньше машин в потоке и меньше давления на парковку.",
      benefits: [
        {
          id: "less-congestion",
          titleRu: "Меньше заторов",
          textRu:
            "если объединиться с другими водителями, которые иначе выехали бы отдельно, в потоке может быть на четыре автомобиля меньше."
        },
        {
          id: "more-parking",
          titleRu: "Больше места для стоянки",
          textRu:
            "меньшее число машин оставляет больше доступного пространства для парковки."
        },
        {
          id: "environment",
          titleRu: "Бережет окружающую среду",
          textRu:
            "одна заполненная машина обычно означает меньше лишних поездок и меньше выбросов."
        },
        {
          id: "costs",
          titleRu: "Экономит расходы",
          textRu:
            "участники делят топливо, плату за проезд и стоянку вместо того, чтобы оплачивать все отдельно."
        }
      ],
      visualNotes: [
        "The carpool diagram is a tight original source crop from page 41 with no translated or reconstructed imagery.",
        "Benefit explanations are Russian DOM text outside the source diagram.",
        "The source crop is used as-is and is not recolored, cleaned, or redrawn."
      ]
    },
    {
      id: "shared-trip-mobility-priority",
      kind: "shared-trip-closing",
      titleRu: "Устойчивая мобильность - это забота о людях",
      sourceTextEs:
        "Priorizar una movilidad sustentable es cuidar de las personas y del medio ambiente.",
      sourcePage: 42,
      sourceRegion: {
        x: 292,
        y: 415,
        width: 610,
        height: 850
      },
      assetPath: `${assetRoot}/mobility-priority-photo-source.jpg`,
      altRu:
        "Исходная фотография велосипедистки на городской улице с испанской цитатой из manual.",
      visibleSpanish: true,
      sourceImageException,
      quoteRu:
        "Отдавать приоритет устойчивой мобильности - значит заботиться о людях и окружающей среде.",
      captionRu:
        "Испанская фраза остается внутри оригинальной фотографии; русский смысл вынесен здесь как выбираемый текст.",
      visualNotes: [
        "The page 42 photo is an original source crop and keeps the embedded Spanish quote source-as-is.",
        "Russian explanation and quote text are outside the image.",
        "No embedded sign, label, or source text inside the photo is translated, cleaned, or redrawn."
      ]
    }
  ]
};
