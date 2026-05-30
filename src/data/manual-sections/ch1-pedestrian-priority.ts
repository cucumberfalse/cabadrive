import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority";

export const ch1PedestrianPrioritySection: ManualGuideSectionContent = {
  id: "ch1-pedestrian-priority-content",
  sectionId: "ch1-pedestrian-priority",
  titleRu: "Пешеходный приоритет",
  sourcePages: [24, 25, 26, 27, 28, 29],
  sourceTitleEs: "Prioridad peatonal",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-source-artwork",
    "manual-pedestrian-priority-visuals"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch1-pedestrian-priority/page-024-pedestrian-priority-source-crop.jpg",
      "content/validation/manual-guide/ch1-pedestrian-priority/page-024-before-after-source-crop.jpg",
      "content/validation/manual-guide/ch1-pedestrian-priority/page-025-impact-source-crop.jpg",
      "content/validation/manual-guide/ch1-pedestrian-priority/page-026-infrastructure-source-crop.jpg",
      "content/validation/manual-guide/ch1-pedestrian-priority/page-027-school-routes-source-crop.jpg",
      "content/validation/manual-guide/ch1-pedestrian-priority/page-028-priority-areas-source-crop.jpg",
      "content/validation/manual-guide/ch1-pedestrian-priority/page-029-zone30-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch1-pedestrian-priority/ch1-pedestrian-priority-desktop.png",
      "content/validation/manual-guide/ch1-pedestrian-priority/ch1-pedestrian-priority-mobile.png"
    ],
    notes: [
      "Source PDF pages 24-29 are converted as one source-Índice website section.",
      "Runtime learner content uses Russian DOM text for labels, lists, signs, map legend, and impact phases.",
      "Spanish source crops remain validation evidence only; runtime source-derived assets are cropped to non-text photos, icons, body/car artwork, or map/street-name context."
    ]
  },
  blocks: [
    {
      id: "pedestrian-priority-intro",
      kind: "lead",
      sourceTextEs:
        "Es una de las prioridades del Gobierno de la Ciudad en materia de tránsito y transporte. Todas las personas son peatones.",
      textRu:
        "Пешеходный приоритет - одна из главных задач города в сфере движения и транспорта. Все люди в какой-то момент становятся пешеходами: даже водитель или пассажир становится пешеходом, когда выходит из транспортного средства."
    },
    {
      id: "mobility-values",
      kind: "paragraph",
      sourceTextEs:
        "Para garantizar una movilidad sustentable hay que reconocer ciertos valores: equidad, eficiencia, seguridad, salud y participación ciudadana.",
      textRu:
        "Чтобы поддерживать устойчивую мобильность, нужно учитывать равенство, эффективность, безопасность, здоровье и участие граждан. Безопасная ходьба требует ответственности и государства, и всех участников города."
    },
    {
      id: "everyone-is-pedestrian",
      kind: "callout",
      sourceTextEs: "En algún momento del día todas las personas son peatones.",
      textRu: "В какой-то момент дня каждый человек является пешеходом."
    },
    {
      id: "human-scale-city",
      kind: "paragraph",
      sourceTextEs:
        "La Ciudad de Buenos Aires se propone pasar de ser una ciudad diseñada para los autos a una ciudad a escala humana.",
      textRu:
        "Буэнос-Айрес стремится перейти от города, спроектированного для автомобилей, к городу человеческого масштаба: к общественной дороге как безопасному и здоровому месту встречи."
    },
    {
      id: "julio-roca-before-after",
      kind: "pedestrian-photo-comparison",
      titleRu: "Пешеходные изменения на Av. Julio Argentino Roca",
      sourceTextEs: "Intervenciones peatonales en Av. Julio Argentino Roca. ANTES / DESPUÉS.",
      sourcePage: 24,
      sourceRegion: {
        x: 340,
        y: 815,
        width: 520,
        height: 260
      },
      assetPath: `${assetRoot}/before-after-photos-source.jpg`,
      beforeLabelRu: "До",
      afterLabelRu: "После",
      captionRu:
        "Источник показывает ту же площадь до и после вмешательства: короче переход, больше пешеходного пространства и лучше заметны люди.",
      visualNotes: [
        "The runtime crop excludes the Spanish source title and ANTES/DESPUÉS labels.",
        "Russian before/after labels are selectable DOM text placed with the two photo halves.",
        "The full Spanish source crop is retained only as validation evidence."
      ]
    },
    {
      id: "road-coexistence",
      kind: "paragraph",
      sourceTextEs:
        "El cuerpo humano es frágil frente al impacto de un vehículo. Por eso, es tan importante cumplir con las normas de seguridad y convivencia vial.",
      textRu:
        "Тело человека хрупко при ударе транспортного средства. Поэтому правила безопасности и дорожного сосуществования защищают прежде всего право на жизнь."
    },
    {
      id: "impact-phases",
      kind: "impact-diagram",
      titleRu: "Фазы удара при наезде",
      sourceTextEs: "Fases del Impacto: contacto, volteo, proyección, arrastre.",
      sourcePage: 25,
      sourceRegion: {
        x: 345,
        y: 580,
        width: 510,
        height: 310
      },
      bodyAssetPath: `${assetRoot}/impact-body-source.jpg`,
      carAssetPath: `${assetRoot}/impact-car-source.jpg`,
      targetAssetPath: `${assetRoot}/impact-target-source.jpg`,
      phases: [
        {
          id: "contact",
          color: "blue",
          labelRu: "Контакт",
          textRu: "первый удар обычно приходится на нижние конечности."
        },
        {
          id: "rollover",
          color: "yellow",
          labelRu: "Поворот тела",
          textRu: "из-за центра тяжести корпус ударяется о капот."
        },
        {
          id: "projection",
          color: "dark",
          labelRu: "Отбрасывание",
          textRu: "человек может удариться о ветровое стекло или улететь вперед."
        },
        {
          id: "drag",
          color: "gray",
          labelRu: "Скольжение",
          textRu: "после падения тело движется по поверхности дороги."
        }
      ],
      footnoteRu:
        "График основан на воссоздании типичного городского наезда на скорости 40 км/ч, подготовленном RACE и GOODYEAR в 2015 году.",
      visualNotes: [
        "The body, target, and car are source-derived crops without Spanish learner labels.",
        "Impact phase labels are Russian DOM text, preserving the source order and color coding.",
        "The Spanish source legend remains only in the internal validation crop."
      ]
    },
    {
      id: "pedestrian-crossing-rules",
      kind: "list",
      titleRu: "Переход пешеходов",
      sourceTextEs: "Cruce de peatones: senda peatonal, semáforo anaranjado titilante, contacto visual, vereda, atención al contexto vial.",
      itemsRu: [
        "Переходить нужно по пешеходному переходу. Если его нет - на углах: там человек заметнее, и именно там водители ожидают его появления.",
        "Не начинайте переход, когда пешеходный светофор мигает оранжевым: времени закончить переход может не хватить. Если мигание началось уже во время перехода, завершайте его очень осторожно.",
        "Перед переходом смотрите в обе стороны и устанавливайте зрительный контакт с водителями первых транспортных средств, чтобы убедиться, что вас видят.",
        "Ждите на тротуаре. Если с вами детская коляска, не выставляйте ее на проезжую часть.",
        "Следите за дорожной обстановкой. Не используйте наушники и мобильный телефон: это одни из главных факторов отвлечения."
      ]
    },
    {
      id: "driver-duties-list",
      kind: "list",
      titleRu: "При управлении транспортным средством",
      sourceTextEs:
        "Al conducir: luz verde y giro, cruce a mitad de calle, garaje, terminar el cruce, calles sin semáforo, motos y monopatines en vereda.",
      itemsRu: [
        "Если у транспортного средства зеленый сигнал и оно поворачивает на другую дорогу, водитель обязан затормозить и уступить, если пешеходы переходят.",
        "Если человек переходит посередине улицы и даже нарушает правила, водитель все равно должен поставить на первое место его физическую целостность.",
        "При въезде в гараж или выезде из него всегда отдавайте приоритет пешеходам. Когда возможно, двигайтесь вперед, а не задним ходом, чтобы лучше видеть.",
        "Остановитесь, чтобы люди закончили переход, и перед началом движения установите зрительный контакт с теми, кто еще не начал переход, даже если на короткое время будет перекрыт угол перекрестка.",
        "На улицах без светофора всегда уступайте пешеходам, когда они хотят перейти.",
        "Мотоциклам запрещено ехать по тротуару даже медленно. Чтобы подняться на тротуар, нужно выключить двигатель и слезть с мотоцикла. Этот запрет действует и для электрических самокатов."
      ]
    },
    {
      id: "pedestrian-street-types",
      kind: "pedestrian-infrastructure",
      titleRu: "Дорожная инфраструктура",
      sourceTextEs: "Infraestructura vial: Calle prioridad peatón; Calle peatonal.",
      cards: [
        {
          id: "priority-street",
          titleRu: "Улица с пешеходным приоритетом",
          sourcePage: 26,
          sourceRegion: {
            x: 423,
            y: 815,
            width: 170,
            height: 150
          },
          assetPath: `${assetRoot}/priority-street-source.jpg`,
          altRu: "Фрагмент улицы совместного движения с боллардами и пешеходами",
          details: [
            {
              labelRu: "Характеристики",
              textRu: "проезжая часть и тротуар находятся на одном уровне и отделяются боллардами."
            },
            {
              labelRu: "Применение",
              textRu: "улицы совместного пользования внутри макрокварталов, где разрешены только определенные транспортные средства."
            },
            {
              labelRu: "Движение",
              textRu: "общий запрет, кроме аварийных служб и жителей или пользователей прилегающих участков."
            },
            {
              labelRu: "Максимальная скорость",
              textRu: "10 км/ч."
            }
          ],
          noteRu:
            "В обычных «улицах совместного пользования» допускается ограниченное движение до 20 км/ч, но в Centro Peatonal из-за большого пешеходного потока скорость снижена знаками до 10 км/ч."
        },
        {
          id: "pedestrian-street",
          titleRu: "Пешеходная улица",
          sourcePage: 26,
          sourceRegion: {
            x: 348,
            y: 1020,
            width: 245,
            height: 150
          },
          assetPath: `${assetRoot}/pedestrian-street-source.jpg`,
          altRu: "Фрагмент пешеходной улицы с кашпо и людьми",
          details: [
            {
              labelRu: "Характеристики",
              textRu: "городское пространство предназначено только для движения пешеходов."
            },
            {
              labelRu: "Применение",
              textRu: "улицы с высокой торговой или административной активностью."
            },
            {
              labelRu: "Движение",
              textRu: "транспортные средства допускаются только в исключительных случаях."
            }
          ]
        }
      ],
      visualNotes: [
        "Photo crops are source-derived and exclude readable Spanish labels where possible.",
        "All section labels and details are Russian DOM text.",
        "The no-entry street sign text from the source is not used as learner text."
      ]
    },
    {
      id: "school-and-wayfinding",
      kind: "pedestrian-infrastructure",
      titleRu: "Пешеходные указатели и школьная среда",
      sourceTextEs: "Direccionadores peatonales; Senderos escolares; Sube y Baja.",
      cards: [
        {
          id: "wayfinding",
          titleRu: "Пешеходные указатели",
          sourcePage: 27,
          sourceRegion: {
            x: 348,
            y: 495,
            width: 245,
            height: 145
          },
          visualKind: "wayfinding-sign",
          details: [
            {
              labelRu: "Характеристики",
              textRu: "вертикальные информационные знаки помогают понять расстояние, примерное время, направление возможных пунктов назначения и пересадки на другие виды транспорта."
            },
            {
              labelRu: "Применение",
              textRu: "места с интенсивным пешеходным потоком."
            }
          ]
        },
        {
          id: "school-routes",
          titleRu: "Школьные маршруты",
          sourcePage: 27,
          sourceRegion: {
            x: 348,
            y: 700,
            width: 245,
            height: 145
          },
          assetPath: `${assetRoot}/school-routes-source.jpg`,
          altRu: "Пешеходный переход рядом со школой с желто-белой разметкой",
          details: [
            {
              labelRu: "Характеристики",
              textRu: "пешеходные переходы выделяются желтой и белой светоотражающей краской."
            },
            {
              labelRu: "Применение",
              textRu: "вокруг школ, чтобы предупредить водителей о необходимости максимальной осторожности."
            }
          ],
          noteRu:
            "Школьные маршруты охраняют городские агенты профилактики, дорожные контролеры, полиция, школьные смотрители и участвующие местные магазины, где дети могут укрыться при необходимости."
        },
        {
          id: "sube-y-baja",
          titleRu: "Sube y Baja",
          sourcePage: 27,
          sourceRegion: {
            x: 348,
            y: 895,
            width: 245,
            height: 145
          },
          visualKind: "school-road-marking",
          details: [
            {
              labelRu: "Характеристики",
              textRu: "желтая горизонтальная разметка ограничивает полосу остановки для безопасной посадки и высадки школьников."
            },
            {
              labelRu: "Применение",
              textRu: "у входа в школы; это часть программы Sube y Baja."
            },
            {
              labelRu: "Движение",
              textRu: "усиливает запрет стоянки ближе 10 метров с каждой стороны входа в образовательное учреждение в школьное время."
            }
          ],
          noteRu:
            "Цель - лучше организовать движение и повысить безопасность учащихся и соседей района."
        }
      ],
      visualNotes: [
        "The runtime wayfinding and Sube y Baja visuals are localized DOM/CSS reconstructions because the source photos carry readable Spanish signage or road text.",
        "The school-route photo crop has no learner-facing Spanish text.",
        "Program names remain as named entities in Russian DOM text."
      ]
    },
    {
      id: "pedestrian-interventions",
      kind: "pedestrian-infrastructure",
      titleRu: "Пешеходные вмешательства",
      sourceTextEs: "Intervenciones peatonales: características, aplicación.",
      cards: [
        {
          id: "intervention-street",
          titleRu: "Укороченные переходы и расширенные углы",
          sourcePage: 28,
          sourceRegion: {
            x: 348,
            y: 500,
            width: 245,
            height: 120
          },
          assetPath: `${assetRoot}/intervention-street-source.jpg`,
          altRu: "Улица с песочной разметкой и расширенным пешеходным пространством",
          details: [
            {
              labelRu: "Характеристики",
              textRu: "улицы размечаются светоотражающей краской песочного цвета в центре и двойной белой линией по краям; пространство может включать кашпо, столы и стулья."
            },
            {
              labelRu: "Применение",
              textRu: "углы с повышенным пешеходным риском, где тротуары расширяются, переходы становятся короче, а люди заметнее в движении."
            },
            {
              labelRu: "Движение",
              textRu: "водителей побуждают снижать скорость и радиус поворота."
            }
          ]
        }
      ],
      visualNotes: [
        "The source photo crop is used without the Spanish paragraph text that surrounds it.",
        "Feature labels and conditions are rendered as Russian DOM text."
      ]
    },
    {
      id: "priority-areas-map",
      kind: "priority-area-map",
      titleRu: "Зоны с пешеходным приоритетом",
      sourceTextEs: "Áreas con prioridad peatonal: Tribunales, Retiro, Casco Histórico, Once, Microcentro y Corrientes.",
      sourcePage: 28,
      sourceRegion: {
        x: 350,
        y: 790,
        width: 410,
        height: 390
      },
      assetPath: `${assetRoot}/priority-area-map-source.jpg`,
      areasRu: "Tribunales, Retiro, Casco Histórico, Once, Microcentro и Corrientes",
      legend: [
        {
          id: "tribunales",
          color: "gray",
          labelRu: "Tribunales Peatonal"
        },
        {
          id: "centro",
          color: "cyan",
          labelRu: "Centro Peatonal"
        },
        {
          id: "excepted",
          color: "blue",
          labelRu: "исключенные артерии"
        }
      ],
      captionRu:
        "В этих районах пешеходный поток настолько велик, что зоны с приоритетом создаются для качества жизни, сосуществования, движения, дорожной безопасности и окружающей среды.",
      visualNotes: [
        "The runtime map crop excludes the Spanish source legend and footer URL.",
        "The Russian legend is selectable DOM text; street names remain part of the map context.",
        "The full source region is retained as validation evidence."
      ]
    },
    {
      id: "priority-area-restrictions",
      kind: "pedestrian-infrastructure",
      titleRu: "Ограничения для частных транспортных средств",
      sourceTextEs: "Restricción vehículos particulares; estacionamiento; circulación; infraestructura; carriles.",
      cards: [
        {
          id: "restriction-signs",
          titleRu: "Въезд и контроль",
          sourcePage: 29,
          sourceRegion: {
            x: 440,
            y: 640,
            width: 220,
            height: 70
          },
          visualKind: "restriction-signs",
          details: [
            {
              labelRu: "Разрешение",
              textRu: "в период ограничения могут ехать только те, у кого есть действующее разрешение на въезд в Centro Peatonal или Tribunales Peatonal."
            },
            {
              labelRu: "Условие",
              textRu: "для запроса разрешения нужно подтвердить наличие гаража для хранения транспортного средства."
            },
            {
              labelRu: "Стоянка",
              textRu: "запрещена с 7 до 21 часов."
            }
          ],
          noteRu: "Разрешение оформляется онлайн; для дополнительной информации источник указывает телефон 147."
        },
        {
          id: "area-infrastructure",
          titleRu: "Инфраструктура и полосы",
          sourcePage: 29,
          sourceRegion: {
            x: 350,
            y: 430,
            width: 500,
            height: 210
          },
          details: [
            {
              labelRu: "Инфраструктура",
              textRu: "выравнивание проезжей части, восстановление тротуаров, лучшее освещение, велосипедные парковки, автобусные остановки, новые цветники, скамейки и светильники."
            },
            {
              labelRu: "Av. Corrientes",
              textRu: "от Callao до Cerrito создан центральный цветник: слева две полосы ночью с 19:00 до 02:00 становятся пешеходной зоной, справа две полосы 24 часа остаются эксклюзивными для такси и автобусов."
            }
          ]
        }
      ],
      visualNotes: [
        "The source restriction signs contain Spanish text, so runtime signs are localized DOM/CSS visuals.",
        "The time windows 7-21 and 19:00-02:00, the 24-hour exclusive lanes, permit condition, and phone 147 are preserved as Russian DOM text."
      ]
    },
    {
      id: "priority-area-circulation",
      kind: "transport-mode-icons",
      titleRu: "Свободное движение в зоне",
      sourceTextEs: "Circulación: se permite libre circulación. A pie, bici, transporte público, taxi.",
      sourcePage: 29,
      sourceRegion: {
        x: 342,
        y: 810,
        width: 470,
        height: 58
      },
      assetPath: `${assetRoot}/circulation-icons-source.jpg`,
      modes: [
        {
          id: "walking",
          labelRu: "Пешком"
        },
        {
          id: "bicycle",
          labelRu: "На велосипеде"
        },
        {
          id: "public-transport",
          labelRu: "Общественный транспорт"
        },
        {
          id: "taxi",
          labelRu: "Такси"
        }
      ],
      visualNotes: [
        "The source icon crop excludes Spanish mode labels.",
        "Russian mode labels are rendered as selectable DOM text.",
        "The icon order follows the source: walking, bicycle, public transport, taxi."
      ]
    },
    {
      id: "zone-30",
      kind: "pedestrian-infrastructure",
      titleRu: "Зона 30",
      sourceTextEs: "Zona 30: características, objetivos, velocidad y siniestros viales, aplicación.",
      cards: [
        {
          id: "zone30-card",
          titleRu: "Район Villa Real",
          sourcePage: 29,
          sourceRegion: {
            x: 348,
            y: 960,
            width: 245,
            height: 125
          },
          assetPath: `${assetRoot}/zone30-photo-source.jpg`,
          altRu: "Въезд в зону 30 с красно-белым пешеходным переходом",
          details: [
            {
              labelRu: "Характеристики",
              textRu: "въезды обозначены красно-белым пешеходным переходом, вертикальными предупреждающими знаками и горизонтальной разметкой «Максимум 30»."
            },
            {
              labelRu: "Цели",
              textRu: "снизить число инцидентов между транспортными средствами и пешеходами, упорядочить движение и дать приоритет ходьбе и велосипеду."
            },
            {
              labelRu: "Скорость",
              textRu: "исследования показывают: снижение средней скорости на 5% может уменьшить количество погибших в дорожных инцидентах на 30%."
            },
            {
              labelRu: "Применение",
              textRu: "Villa Real в периметре улиц Ramón Lista, Nogoyá, Juan E. Martínez и Irigoyen."
            }
          ]
        }
      ],
      visualNotes: [
        "The source photo crop keeps the red-white crossing and vertical sign context without using Spanish label crops as learner text.",
        "The 30 km/h concept and numeric safety relationship are Russian DOM text."
      ]
    }
  ]
};
