import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-public-transport-system";

const sourceImageException = {
  kind: "source-image-original-visible-text",
  visibleSpanishScope: "source-image-only",
  sourceAsIs: true,
  russianExplanationOutsideImage: true
} as const;

export const ch1PublicTransportSystemSection: ManualGuideSectionContent = {
  id: "ch1-public-transport-system-content",
  sectionId: "ch1-public-transport-system",
  titleRu: "Система общественного транспорта",
  sourcePages: [39, 40],
  sourceTitleEs: "Sistema de transporte publico",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-source-artwork",
    "manual-public-transport-visuals"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch1-public-transport-system/page-039-public-transport-source-crop.jpg",
      "content/validation/manual-guide/ch1-public-transport-system/page-040-public-transport-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch1-public-transport-system/ch1-public-transport-system-desktop.png",
      "content/validation/manual-guide/ch1-public-transport-system/ch1-public-transport-system-mobile.png"
    ],
    notes: [
      "Source PDF pages 39-40 are converted as one source-Indice website section.",
      "Runtime learner content uses Russian DOM text for CO2, occupancy, infrastructure, and circulation details.",
      "All bus, yellow-box, platform, exclusive-lane, Metrobus, and transport-center visuals are high-quality original source crops from the local PDF renders.",
      "Spanish text or sign-like markings remain only inside source-as-is image crops; Russian explanations sit outside the images."
    ]
  },
  blocks: [
    {
      id: "public-transport-intro",
      kind: "lead",
      sourceTextEs:
        "Al elegir el transporte publico como alternativa de movilidad, no solo se contribuye a disminuir las emisiones de CO2, sino tambien se colabora con una circulacion mas fluida y saludable.",
      textRu:
        "Общественный транспорт в CABA рассматривается как практический способ уменьшить выбросы CO2 и сделать движение более плавным и здоровым."
    },
    {
      id: "public-transport-capacity-comparison",
      kind: "public-transport-comparison",
      titleRu: "Почему автобус эффективнее того же пространства дороги",
      sourceTextEs:
        "Un colectivo transporta 40-50 personas; en ese mismo espacio, dos automoviles solo llevan 3-4 personas cada uno.",
      sourcePage: 39,
      sourceRegion: {
        x: 345,
        y: 520,
        width: 510,
        height: 255
      },
      assetPath: `${assetRoot}/avenue-comparison-source.jpg`,
      visibleSpanish: false,
      facts: [
        {
          id: "co2",
          valueRu: "меньше CO2",
          labelRu: "выбор общественного транспорта снижает вклад в загрязнение воздуха"
        },
        {
          id: "bus-capacity",
          valueRu: "40-50",
          labelRu: "пассажиров перевозит один автобус"
        },
        {
          id: "car-space",
          valueRu: "3-4",
          labelRu: "человека в каждом из двух автомобилей на том же пространстве"
        }
      ],
      captionRu:
        "На фотографиях виден контраст между обычным потоком на широкой авениде и коридором общественного транспорта. Числа из текста помогают понять, почему город поддерживает такой выбор.",
      visualNotes: [
        "The two avenue photos are a tight original crop from source page 39 with no translated or reconstructed imagery.",
        "CO2 and occupancy comparison labels are Russian DOM text outside the image.",
        "The source crop is used as-is and is not recolored, cleaned, or redrawn."
      ]
    },
    {
      id: "city-supports-public-transport",
      kind: "paragraph",
      sourceTextEs: "Para colaborar con esta eleccion, la Ciudad de Buenos Aires implemento algunos cambios.",
      textRu:
        "Чтобы поддержать такой выбор, город изменяет дорожную инфраструктуру: выделяет места остановки, делает посадку удобнее и отделяет общественный транспорт от общего потока."
    },
    {
      id: "public-transport-infrastructure",
      kind: "public-transport-infrastructure",
      titleRu: "Дорожная инфраструктура для общественного транспорта",
      sourceTextEs: "Infraestructura vial: Cajones amarillos, Bulbos para la espera de colectivos, Carriles exclusivos, Metrobus de Buenos Aires, Centros de transbordo.",
      cards: [
        {
          id: "yellow-boxes",
          titleRu: "Желтые боксы",
          sourcePage: 39,
          sourceRegion: {
            x: 348,
            y: 932,
            width: 245,
            height: 126
          },
          assetPath: `${assetRoot}/yellow-box-source.jpg`,
          altRu:
            "Фотография желтой дорожной разметки зоны остановки автобуса.",
          visibleSpanish: false,
          details: [
            {
              labelRu: "Что это",
              textRu:
                "прерывистая желтая разметка на проезжей части, зарезервированной для остановки пассажирского общественного транспорта."
            },
            {
              labelRu: "Зачем",
              textRu:
                "в центре указывается соответствующая линия, а для остальных транспортных средств усиливается запрет стоянки и остановки."
            }
          ]
        },
        {
          id: "bus-platforms",
          titleRu: "Выступы для ожидания автобусов",
          sourcePage: 39,
          sourceRegion: {
            x: 348,
            y: 1085,
            width: 245,
            height: 130
          },
          assetPath: `${assetRoot}/bus-platform-source.jpg`,
          altRu:
            "Фотография приподнятой платформы остановки автобуса.",
          visibleSpanish: false,
          details: [
            {
              labelRu: "Как работают",
              textRu:
                "приподнятые платформы убирают лишний въезд и выезд автобуса из полосы при посадке и пересадке пассажиров."
            },
            {
              labelRu: "Результат",
              textRu:
                "остановка выполняется параллельно бордюру; сервис становится быстрее и плавнее, а пешеходы заметнее в защищенном пространстве."
            }
          ]
        },
        {
          id: "exclusive-lanes",
          titleRu: "Эксклюзивные полосы",
          sourcePage: 40,
          sourceRegion: {
            x: 350,
            y: 493,
            width: 245,
            height: 126
          },
          assetPath: `${assetRoot}/exclusive-lane-source.jpg`,
          altRu:
            "Фотография эксклюзивной полосы с дорожной надписью BUS (автобусная полоса).",
          visibleSpanish: true,
          sourceImageException,
          termTranslations: [
            { termEs: "BUS", translationRu: "Автобусная полоса" },
            { termEs: "Carriles exclusivos", translationRu: "Эксклюзивные полосы" },
            { termEs: "Transporte público", translationRu: "Общественный транспорт" },
            { termEs: "Permiso de ingreso y egreso", translationRu: "Разрешение на въезд и выезд" }
          ],
          details: [
            {
              labelRu: "Разметка",
              textRu:
                "это продольные полосы на проезжей части, обозначенные ромбом и типом транспорта, которому разрешено движение."
            },
            {
              labelRu: "Смысл",
              textRu:
                "они отделяют общественный транспорт от общего потока, улучшают его движение по авенидам и направляют частные автомобили, мотоциклы и велосипеды на соседние улицы."
            },
            {
              labelRu: "Важная сноска",
              textRu:
                "авениды лучше подходят для общественного транспорта: шум, газы и частицы там рассеиваются быстрее, чем на боковых улицах."
            }
          ],
          noteRu:
            "Если частный автомобиль въезжает в гараж через такую полосу, нужно бесплатное разрешение: въезд выполняют на ближайшем предыдущем перекрестке, выезд - только до ближайшего перекрестка, где полосу нужно покинуть. Вне часов ограничения другие транспортные средства могут ехать свободно."
        },
        {
          id: "metrobus",
          titleRu: "Metrobus de Buenos Aires (MBA)",
          sourcePage: 40,
          sourceRegion: {
            x: 350,
            y: 774,
            width: 245,
            height: 126
          },
          assetPath: `${assetRoot}/metrobus-source.jpg`,
          altRu:
            "Фотография коридора Metrobus с остановкой и автобусами.",
          visibleSpanish: true,
          sourceImageException,
          termTranslations: [
            { termEs: "Metrobus de Buenos Aires", translationRu: "метробус Буэнос-Айреса" },
            { termEs: "MBA", translationRu: "метробус Буэнос-Айреса" },
            { termEs: "Senda peatonal", translationRu: "Пешеходный переход" },
            { termEs: "Carriles exclusivos", translationRu: "Эксклюзивные полосы" },
            { termEs: "Solo líneas autorizadas", translationRu: "Только разрешенные линии" }
          ],
          details: [
            {
              labelRu: "Система",
              textRu:
                "Metrobus сочетает сочлененные и обычные автобусы с эксклюзивными полосами в центре проезжей части или рядом с бордюром."
            },
            {
              labelRu: "Красная senda (полоса)",
              textRu:
                "если перед перекрестком видна красная дорожка, там находится пересечение Metrobus."
            },
            {
              labelRu: "Пешеходы",
              textRu:
                "вход на станции выполняется через соответствующий пандус, а не в середине квартала."
            },
            {
              labelRu: "Кто может ехать",
              textRu:
                "по полосам едут только определенные автобусные линии и экстренные службы при исполнении функций; велосипеды, частные автомобили, такси, ремисы, combis (микроавтобусы) и другие исключены."
            }
          ],
          noteRu:
            "Временное или постоянное движение неразрешенного транспорта по таким полосам считается нарушением и основанием для удержания водительского удостоверения."
        },
        {
          id: "transport-centers",
          titleRu: "Пересадочные центры",
          sourcePage: 40,
          sourceRegion: {
            x: 350,
            y: 1062,
            width: 245,
            height: 100
          },
          assetPath: `${assetRoot}/transport-center-source.jpg`,
          altRu:
            "Фотография пересадочного центра с автобусами, железнодорожными платформами и крытым павильоном.",
          visibleSpanish: false,
          details: [
            {
              labelRu: "Интермодальность",
              textRu:
                "они упрощают пересадки между автобусами, поездами, метро и велосипедами."
            },
            {
              labelRu: "Безопасность",
              textRu:
                "создаются более комфортные и безопасные зоны ожидания, особенно для пешеходов, потому что переходы становятся короче благодаря промежуточным пешеходным островкам."
            }
          ]
        }
      ],
      visualNotes: [
        "Every card uses an original source crop from pages 39-40.",
        "BUS road marking and Metrobus source signage remain inside source-as-is images, with Russian explanation outside.",
        "The section does not translate, redraw, reconstruct, recolor, or clean traffic markings/sign-like source material."
      ]
    }
  ]
};
