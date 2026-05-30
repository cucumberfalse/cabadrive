import type { ManualGuideSectionContent } from "../manualGuide";

export const ch1SustainableMobilitySection: ManualGuideSectionContent = {
  id: "ch1-sustainable-mobility-content",
  sectionId: "ch1-sustainable-mobility",
  titleRu: "Что такое устойчивая мобильность?",
  sourcePages: [23],
  sourceTitleEs: "¿Qué es la movilidad sustentable?",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-mobility-context",
    "manual-vulnerability-order",
    "manual-source-artwork"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch1-sustainable-mobility/page-023-sustainable-mobility-source-crop.jpg",
      "content/validation/manual-guide/ch1-sustainable-mobility/page-023-context-infographic-source-crop.jpg",
      "content/validation/manual-guide/ch1-sustainable-mobility/page-023-vulnerability-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch1-sustainable-mobility/ch1-sustainable-mobility-desktop.png",
      "content/validation/manual-guide/ch1-sustainable-mobility/ch1-sustainable-mobility-mobile.png"
    ],
    notes: [
      "Source PDF page 23 is converted as one source-Índice website section.",
      "The city-context and vulnerability-order infographics are rendered as native Russian DOM labels with local source-derived non-text pictogram crops.",
      "Spanish source crops are retained only under validation evidence; runtime learner content renders no Spanish crop or full source page raster."
    ]
  },
  blocks: [
    {
      id: "city-context-infographic",
      kind: "mobility-context",
      titleRu: "Контекст города Буэнос-Айрес",
      sourceTextEs:
        "Contexto Ciudad de Buenos Aires; 9 millones de viajes por día; ¿Cuánto espacio necesitan 50 personas para movilizarse?",
      sourcePage: 23,
      sourceRegion: {
        x: 280,
        y: 430,
        width: 620,
        height: 420
      },
      cityLabelRu: "Город Буэнос-Айрес",
      cityStats: [
        {
          valueRu: "3 млн",
          labelRu: "жителей"
        },
        {
          valueRu: "1,8 млн",
          labelRu: "ежедневно въезжают в город"
        }
      ],
      trips: {
        titleRu: "9 млн поездок в день",
        interjurisdictionalRu: "3,5 млн межюрисдикционных поездок",
        internalRu: "5,5 млн внутренних поездок",
        residentShareRu: "84% - поездки жителей внутри города",
        inboundShareRu: "16% - поездки людей, въезжающих в город"
      },
      space: {
        titleRu: "Сколько места нужно 50 людям, чтобы передвигаться?",
        assetPath:
          "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-sustainable-mobility/space-comparison-50-people-source.jpg",
        modes: [
          {
            id: "bus",
            labelRu: "На автобусе"
          },
          {
            id: "walking",
            labelRu: "Пешком"
          },
          {
            id: "bicycle",
            labelRu: "На велосипеде"
          },
          {
            id: "car",
            labelRu: "На автомобиле"
          }
        ]
      },
      visualNotes: [
        "Map/stat/trip/space composition follows the source order from top to bottom.",
        "The modal-space pictogram row is a local source-derived crop with Spanish labels excluded.",
        "All labels and statistics visible to learners are Russian DOM text."
      ]
    },
    {
      id: "definition",
      kind: "lead",
      sourceTextEs:
        "Es una forma de trasladarse de manera fluida, segura y ordenada haciendo hincapié en quienes van a pie y en bici, contribuyendo a una mejor calidad ambiental.",
      textRu:
        "Устойчивая мобильность - это способ передвигаться плавно, безопасно и организованно, особенно учитывая тех, кто идет пешком или едет на велосипеде. Такой подход помогает улучшать качество городской среды."
    },
    {
      id: "mobility-right-and-limits",
      kind: "paragraph",
      sourceTextEs:
        "La movilidad es un derecho que, como cualquier otro, está sujeto a ciertos límites. En este caso, tienen que ver con los impactos asociados a cada medio y sistema de transporte.",
      textRu:
        "Мобильность - это право. Но, как и любое право, оно имеет пределы: здесь они связаны с тем, какое воздействие оказывает каждый вид транспорта и вся транспортная система."
    },
    {
      id: "individual-choice",
      kind: "paragraph",
      sourceTextEs:
        "La movilidad, también implica una decisión individual, ya que cada persona tiene la opción de escoger un medio u otro según el desplazamiento que deba realizar.",
      textRu:
        "Мобильность также зависит от личного выбора: человек может выбрать один способ передвижения или другой в зависимости от конкретной поездки."
    },
    {
      id: "intermodality-vulnerable-groups",
      kind: "paragraph",
      sourceTextEs:
        "Hoy, la Ciudad, cuenta con diversas opciones que hacen a la intermodalidad, como la combinación de la caminata con el uso de la bicicleta y el del transporte público. De este modo, se pone foco en los grupos vulnerables, interviniendo zonas donde se debe reducir la velocidad de circulación y se da prioridad a las personas.",
      textRu:
        "Сегодня в городе есть разные варианты интермодальности: можно сочетать ходьбу, велосипед и общественный транспорт. Поэтому внимание переносится на уязвимые группы: город меняет зоны, где нужно снижать скорость движения и отдавать приоритет людям."
    },
    {
      id: "vulnerability-order",
      kind: "vulnerability-ranking",
      titleRu: "Использование дороги с учетом уязвимости",
      sourceTextEs:
        "Uso de la vía pública de acuerdo a la Vulnerabilidad. Esta asignación se realiza teniendo en cuenta si tienen o no carrocería, el tamaño de esta y la posibilidad de protección frente a un impacto, la cantidad de personas y el modo en el que son transportadas.",
      introRu:
        "Порядок учитывает, есть ли у участника кузов, насколько он защищает при ударе, сколько людей перевозится и каким способом они перемещаются.",
      sourcePage: 23,
      sourceRegion: {
        x: 270,
        y: 1115,
        width: 650,
        height: 270
      },
      assetPath:
        "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-sustainable-mobility/vulnerability-icons-source.jpg",
      levels: [
        {
          rankRu: "1-е",
          labelRu: "Пешеходы"
        },
        {
          rankRu: "2-е",
          labelRu: "Велосипедисты"
        },
        {
          rankRu: "3-е",
          labelRu: "Мото"
        },
        {
          rankRu: "4-е",
          labelRu: "Автобус"
        },
        {
          rankRu: "5-е",
          labelRu: "Такси / автомобиль"
        },
        {
          rankRu: "6-е",
          labelRu: "Грузовик"
        }
      ],
      visualNotes: [
        "Ranking order and mode set match the source vulnerability strip.",
        "The pictogram row is a local source crop with Spanish labels cropped out.",
        "Russian ranks and labels are DOM text aligned above the source-derived icon row."
      ]
    }
  ]
};
