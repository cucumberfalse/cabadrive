import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle";

const originalSourceImageException = {
  kind: "source-image-original-visible-text",
  visibleSpanishScope: "source-image-only",
  sourceAsIs: true,
  russianExplanationOutsideImage: true
} as const;

export const ch1BicycleSection: ManualGuideSectionContent = {
  id: "ch1-bicycle-content",
  sectionId: "ch1-bicycle",
  titleRu: "Велосипед",
  sourcePages: [30, 31, 32, 33, 34, 35, 36, 37, 38],
  sourceTitleEs: "Bicicleta",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-source-artwork",
    "manual-bicycle-visuals"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch1-bicycle/page-030-bicycle-source-crop.jpg",
      "content/validation/manual-guide/ch1-bicycle/page-031-protection-source-crop.jpg",
      "content/validation/manual-guide/ch1-bicycle/page-032-rules-signs-source-crop.jpg",
      "content/validation/manual-guide/ch1-bicycle/page-033-posture-age-source-crop.jpg",
      "content/validation/manual-guide/ch1-bicycle/page-034-distance-source-crop.jpg",
      "content/validation/manual-guide/ch1-bicycle/page-035-hand-signals-source-crop.jpg",
      "content/validation/manual-guide/ch1-bicycle/page-036-lanes-source-crop.jpg",
      "content/validation/manual-guide/ch1-bicycle/page-037-parking-ecobici-source-crop.jpg",
      "content/validation/manual-guide/ch1-bicycle/page-038-scooter-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch1-bicycle/ch1-bicycle-desktop.png",
      "content/validation/manual-guide/ch1-bicycle/ch1-bicycle-mobile.png"
    ],
    notes: [
      "Source PDF pages 30-38 are converted as one source-Indice website section.",
      "Runtime learner content uses Russian DOM text for benefit, helmet, gear, posture, distance, hand-signal, lane, parking, Ecobici, and scooter labels.",
      "The page 32 official traffic sign sheet is inserted source-as-is from a high-quality local crop; Russian explanations sit outside the sign image.",
      "Text-bearing non-sign source diagrams are represented with source-derived non-text crops and selectable Russian labels; Spanish is visible only inside the official sign image exception."
    ]
  },
  blocks: [
    {
      id: "bicycle-intro-growth",
      kind: "lead",
      sourceTextEs:
        "Bicicleta. Las modificaciones en la infraestructura de la Ciudad de Buenos Aires se realizaron para dar respuesta a las necesidades que surgen en una ciudad en continuo crecimiento.",
      textRu:
        "Буэнос-Айрес меняет инфраструктуру под потребности постоянно растущего города. В этой модели велосипед становится не украшением, а полноценным способом передвижения."
    },
    {
      id: "bicycle-new-mobility-style",
      kind: "paragraph",
      sourceTextEs:
        "Tanto el uso del transporte público, como el caminar y andar en bicicleta o monopatín eléctrico, son primordiales en este nuevo estilo de movilidad, ya que ayuda a disminuir la contaminación, beneficiando la circulación.",
      textRu:
        "Общественный транспорт, ходьба, велосипед и электрический самокат - ключевые части нового стиля мобильности: они помогают уменьшать загрязнение и улучшать движение."
    },
    {
      id: "bicycle-benefits-visual",
      kind: "bicycle-benefits",
      titleRu: "Велосипед как фактор устойчивой мобильности",
      sourceTextEs: "La bici como agente de cambio en la Movilidad Sustentable: ecologica, economica, rapida, saludable.",
      sourcePage: 30,
      sourceRegion: {
        x: 330,
        y: 660,
        width: 540,
        height: 320
      },
      assetPath: `${assetRoot}/bicycle-change-cyclists-source.jpg`,
      benefits: [
        {
          id: "ecological",
          titleRu: "Экологично",
          textRu: "не использует загрязняющее топливо."
        },
        {
          id: "economical",
          titleRu: "Экономично",
          textRu: "не требует топлива и крупных расходов на обслуживание."
        },
        {
          id: "fast",
          titleRu: "Быстро",
          textRu: "помогает доехать без ожидания и пробок на коротких городских маршрутах."
        },
        {
          id: "healthy",
          titleRu: "Полезно",
          textRu: "укрепляет здоровье и снижает стресс."
        }
      ],
      visualNotes: [
        "The cyclist/road artwork is source-derived and cropped away from Spanish benefit labels.",
        "Benefit titles and explanations are Russian DOM text placed as source-like callout cards.",
        "The validation crop preserves the full Spanish source region for comparison."
      ]
    },
    {
      id: "bicycle-safety-check",
      kind: "list",
      titleRu: "Перед выездом проверьте велосипед",
      sourceTextEs:
        "Condiciones de seguridad. Se deberia realizar una revision mecanica de forma periodica y, antes de salir, hacer un simple chequeo.",
      itemsRu: [
        "Цепь должна быть натянута и правильно стоять на звездочках и передачах.",
        "Шины должны быть с правильным давлением. Если колесо мягкое при нажатии, его нужно накачать или отремонтировать прокол.",
        "Тормоза проверяют, идя рядом с велосипедом и нажимая тормозные ручки. Если нужно сильно давить, тормоза могут быть изношены.",
        "Все части велосипеда должны быть надежно закреплены."
      ]
    },
    {
      id: "helmet-importance",
      kind: "paragraph",
      sourceTextEs:
        "Al no tener carroceria la bici es un vehiculo vulnerable, por eso el uso del casco es de vital importancia.",
      textRu:
        "У велосипеда нет кузова, поэтому велосипедист уязвим. Шлем имеет жизненно важное значение: он должен быть сертифицированным, действующим, подходить по размеру, быть исправным и не иметь сильных ударов в прошлом."
    },
    {
      id: "helmet-fit",
      kind: "bicycle-helmet-fit",
      titleRu: "Как должен сидеть шлем",
      sourceTextEs:
        "Su correcta ubicacion es de manera horizontal, ni hacia adelante, ni hacia atras; hebilla debajo de la mandibula y correas tensas.",
      sourcePage: 31,
      sourceRegion: {
        x: 345,
        y: 600,
        width: 500,
        height: 330
      },
      assetPath: `${assetRoot}/helmet-fit-source.jpg`,
      guidanceRu:
        "Шлем располагают горизонтально: не сдвигают вперед и не заваливают назад. Пряжка должна быть под нижней челюстью, ремни - натянуты, но рот должен свободно открываться и закрываться.",
      positions: [
        {
          id: "correct",
          status: "correct",
          labelRu: "Правильно"
        },
        {
          id: "too-low",
          status: "wrong",
          labelRu: "Слишком низко"
        },
        {
          id: "too-back",
          status: "wrong",
          labelRu: "Сдвинут назад"
        }
      ],
      visualNotes: [
        "Helmet heads are refreshed from the official source page image and carry no Spanish labels.",
        "Correct/wrong meanings are Russian DOM text; source check/cross geometry remains visible.",
        "The source recommendation paragraph is rendered as selectable Russian text above the image."
      ]
    },
    {
      id: "protection-gear",
      kind: "bicycle-gear",
      titleRu: "Одежда и видимость",
      sourceTextEs: "Vestimenta, elementos reflectantes, luces, lentes, guantes.",
      sourcePage: 31,
      sourceRegion: {
        x: 340,
        y: 945,
        width: 560,
        height: 390
      },
      assetPath: `${assetRoot}/cyclist-gear-source.jpg`,
      items: [
        {
          id: "reflective",
          titleRu: "Светоотражатели",
          textRu: "повышают видимость велосипедиста для других участников движения."
        },
        {
          id: "lights",
          titleRu: "Фары",
          textRu: "передний и задний свет помогают видеть и быть заметным при слабом освещении."
        },
        {
          id: "clothing",
          titleRu: "Одежда",
          textRu: "лучше выбирать яркую или заметную одежду и избегать свободных деталей, которые могут зацепиться."
        },
        {
          id: "lenses",
          titleRu: "Очки",
          textRu: "защищают глаза от ветра, пыли, насекомых и брызг."
        },
        {
          id: "gloves",
          titleRu: "Перчатки",
          textRu: "улучшают хват руля и защищают руки при падении."
        }
      ],
      visualNotes: [
        "The runtime crop keeps source cyclist/bicycle artwork only; Spanish equipment callouts are replaced by Russian DOM cards.",
        "Gear list order follows the source visual callouts.",
        "No generic icon library is used for the equipment explanation."
      ]
    },
    {
      id: "traffic-rules-signs",
      kind: "bicycle-signage",
      titleRu: "Знаки и правила для велосипедиста",
      sourceTextEs:
        "Quien conduce una bicicleta debe respetar las normas de transito. Conocer las senales de transito y cumplirlas ayudan a disminuir los riesgos.",
      sourcePage: 32,
      sourceRegion: {
        x: 330,
        y: 545,
        width: 550,
        height: 220
      },
      assetPath: `${assetRoot}/bicycle-signs-source-as-is.jpg`,
      altRu:
        "Таблица дорожных знаков для велосипедистов: знаки показаны в испанской версии.",
      visibleSpanish: true,
      officialSignException: {
        kind: "official-traffic-sign-source-as-is",
        visibleSpanishScope: "official-sign-image-only",
        sourceAsIs: true
      },
      termTranslations: [
        { termEs: "Circulación exclusiva para bicicletas", translationRu: "Исключительное движение для велосипедов" },
        { termEs: "Vereda de convivencia con peatones", translationRu: "Тротуар совместного движения с пешеходами" },
        { termEs: "Direccionador en ciclovía", translationRu: "Указатель направления на велодорожке" },
        { termEs: "Cruce de ciclistas", translationRu: "Пересечение велосипедистов" },
        { termEs: "Deténgase por completo", translationRu: "Остановитесь полностью" },
        { termEs: "Prohibido circular en bicicleta", translationRu: "Движение на велосипеде запрещено" },
        { termEs: "Finalización de la ciclovía", translationRu: "Конец велодорожки" },
        { termEs: "Descenso de la bicicleta", translationRu: "Сойти с велосипеда" },
        { termEs: "Velocidad máxima 30 km/h", translationRu: "Максимальная скорость 30 км/ч" },
        { termEs: "Comienzo de doble mano", translationRu: "Начало двустороннего движения" },
        {
          termEs: "Prohibido estacionar y detenerse sobre la ciclovía todos los días las 24 horas",
          translationRu: "На велодорожке запрещены остановка и стоянка каждый день 24 часа"
        },
        { termEs: "Cruce de peatones", translationRu: "Пешеходный переход" },
        { termEs: "Ceda el paso", translationRu: "Уступите дорогу" }
      ],
      noticeItemsRu: [
        "Для экзамена ориентируйтесь на внешний вид знаков; русские пояснения идут рядом с таблицей.",
        "В таблице показаны исключительное движение велосипедов, совместное движение с пешеходами, направление велодорожки, пересечение велосипедистов, Полная остановка и Движение на велосипеде запрещено.",
        "Также показаны Конец защищенной велодорожки, Сойти с велосипеда, Максимальная скорость 30 км/ч, Начало двустороннего движения, На защищенных велодорожках запрещены остановка и стоянка каждый день 24 часа; возможна эвакуация, Пешеходный переход и Уступить дорогу."
      ],
      visualNotes: [
        "Official road signs are a source-as-is exception to the no-visible-Spanish artwork policy.",
        "The runtime image is a tight high-quality crop from source page 32 and is not translated, cleaned, recolored, redrawn, or reconstructed.",
        "Russian learner explanation is DOM text outside the sign image."
      ]
    },
    {
      id: "passenger-cargo-rules",
      kind: "list",
      titleRu: "Пассажир и груз",
      sourceTextEs: "Acompanante; Carga.",
      itemsRu: [
        "Пассажира можно перевозить только при наличии дополнительного сиденья, подножек и ручки.",
        "Пассажир должен сидеть позади водителя в той же позиции, не мешая управлению и не ограничивая движения водителя.",
        "Груз или багаж можно перевозить только надежно закрепленным, если он не ухудшает устойчивость и управление.",
        "Груз не должен выступать за края руля или за длину велосипеда. Свободные или висящие на руле предметы ухудшают устойчивость и маневренность."
      ]
    },
    {
      id: "natural-capacity",
      kind: "callout",
      sourceTextEs:
        "Para andar en bici se requiere de un buen estado psicofisico; en 1 segundo en bici se recorren aproximadamente 4,20 mts.",
      textRu:
        "Для езды нужно хорошее психофизическое состояние. Нельзя ехать под действием наркотических веществ или алкоголя: даже в обычных условиях реакция занимает примерно 1 секунду, и за это время велосипед проезжает около 4,20 м - примерно длину автомобиля."
    },
    {
      id: "attention-distraction",
      kind: "paragraph",
      sourceTextEs:
        "Utilizar auriculares y dispositivos electronicos tambien interfieren con la capacidad de atencion del ciclista.",
      textRu:
        "Наушники и электронные устройства мешают вниманию велосипедиста: это фактор отвлечения и разрывает связь с тем, что происходит вокруг."
    },
    {
      id: "body-posture",
      kind: "bicycle-posture",
      titleRu: "Положение тела",
      sourceTextEs: "Postura corporal: espalda, cabeza, manos, piernas, cadera.",
      sourcePage: 33,
      sourceRegion: {
        x: 345,
        y: 500,
        width: 560,
        height: 330
      },
      assetPath: `${assetRoot}/posture-cyclist-source.jpg`,
      labels: [
        {
          id: "back",
          titleRu: "Спина",
          textRu: "держите корпус естественно и устойчиво, без лишнего напряжения."
        },
        {
          id: "head",
          titleRu: "Голова",
          textRu: "смотрите вперед, чтобы вовремя видеть дорогу, знаки и других участников."
        },
        {
          id: "hands",
          titleRu: "Руки",
          textRu: "держите руль так, чтобы сохранять контроль и быстро тормозить."
        },
        {
          id: "legs",
          titleRu: "Ноги",
          textRu: "педалируйте ровно, без движений, которые мешают равновесию."
        },
        {
          id: "hips",
          titleRu: "Таз",
          textRu: "сидите устойчиво на седле и сохраняйте баланс."
        }
      ],
      visualNotes: [
        "The source cyclist crop is used without Spanish callout text.",
        "Body-part labels are Russian DOM cards in the same conceptual positions as the source labels.",
        "The visual remains an artwork block, not a full-page raster."
      ]
    },
    {
      id: "age-and-paths",
      kind: "list",
      titleRu: "Возраст и где можно ехать",
      sourceTextEs: "Edades y vias para circular.",
      itemsRu: [
        "По тротуару могут ехать только дети младше 12 лет, на минимально возможной скорости и с приоритетом пешеходов. Если человеку старше 12 лет нужно попасть на тротуар, он должен слезть с велосипеда.",
        "На велодорожках на тротуаре возрастного ограничения нет.",
        "По проезжей части и защищенным велодорожкам можно ездить с 12 лет. Люди младше 12 лет могут делать это только в сопровождении другого велосипедиста старше 18 лет.",
        "Защищенные велодорожки обязательны на тех участках, где они есть. Если их нет, можно ехать по проезжей части, избегая центральной зоны.",
        "Запрещено ездить по автомагистралям и скоростным дорогам, Av. 9 de Julio и пешеходным артериям.",
        "Велосипед с электрической помощью: с 16 лет, максимум 25 км/ч, вспомогательный мотор до 1500 ватт."
      ]
    },
    {
      id: "coexistence-duty",
      kind: "paragraph",
      sourceTextEs:
        "Moverse en la Ciudad requiere de atencion y compromiso de toda la ciudadania. Mejorar la convivencia implica reconocer los derechos y obligaciones de cada persona.",
      textRu:
        "Движение по городу требует внимания и ответственности всех. Сосуществование на дороге начинается с признания прав и обязанностей каждого, особенно самого уязвимого участника."
    },
    {
      id: "vehicle-holding-prohibition",
      kind: "paragraph",
      sourceTextEs:
        "Esta prohibido circular agarrados a otros vehiculos o enfilados inmediatamente tras otros automotores.",
      textRu:
        "Запрещено ехать на велосипеде, держась за другие транспортные средства, или сразу за моторными транспортными средствами."
    },
    {
      id: "safe-distance",
      kind: "bicycle-distance",
      titleRu: "Безопасная дистанция",
      sourceTextEs: "Distancia de seguridad: mantener 1,5 mts. de vehiculos estacionados; permanecer en el centro de la calzada cuando no hay espacio.",
      sourcePage: 34,
      sourceRegion: {
        x: 340,
        y: 670,
        width: 540,
        height: 300
      },
      examples: [
        {
          id: "safe-doors",
          status: "safe",
          titleRu: "Оставляйте место от дверей",
          assetPath: `${assetRoot}/safe-distance-source.jpg`,
          visibleSpanish: true,
          sourceImageException: originalSourceImageException,
          termTranslations: [
            { termEs: "1,5 mtrs.", translationRu: "1,5 метра" },
            { termEs: "Distancia de vehículos estacionados", translationRu: "Дистанция от припаркованных автомобилей" }
          ],
          textRu: "Рекомендуется держаться на 1,5 м от припаркованных автомобилей, чтобы не попасть под открывающуюся дверь."
        },
        {
          id: "unsafe-line",
          status: "unsafe",
          titleRu: "Не прижимайтесь к краю",
          assetPath: `${assetRoot}/unsafe-distance-source.jpg`,
          visibleSpanish: true,
          sourceImageException: originalSourceImageException,
          termTranslations: [
            {
              termEs: "Prohibido circular agarrados de otros vehículos",
              translationRu: "Запрещено ехать, держась за другие транспортные средства"
            }
          ],
          textRu: "Если ширины дороги не хватает для безопасного обгона, лучше ехать по центру полосы, пока не появится место."
        }
      ],
      visualNotes: [
        "Road/cyclist/car panels are refreshed from the official source page image and kept source-as-is, including original labels inside the image.",
        "Correct/incorrect meaning and learner explanation are selectable Russian text outside the source image panels.",
        "The visible Spanish in these two panels is recorded as a source-image-only exception because the crop itself is the original source visual."
      ]
    },
    {
      id: "overtaking-rules",
      kind: "list",
      titleRu: "Обгон велосипеда",
      sourceTextEs: "Sobrepaso. Para realizarlo de manera segura.",
      itemsRu: [
        "Обгон выполняется слева.",
        "Перед маневром убедитесь, что участок полосы свободен и сзади не приближается другое транспортное средство.",
        "Заранее предупредите о маневре соответствующим сигналом.",
        "Оставьте боковую дистанцию 1,5 м от обгоняемого транспортного средства."
      ]
    },
    {
      id: "offtracking-risk",
      kind: "source-artwork",
      titleRu: "Повороты крупного транспорта и слепая зона",
      altRu: "Автобус поворачивает рядом с велосипедистом: задние колеса проходят ближе к углу, чем передние.",
      assetPath: `${assetRoot}/offtracking-bus-source.jpg`,
      sourcePage: 35,
      sourceRegion: {
        x: 600,
        y: 500,
        width: 260,
        height: 260
      },
      visibleSpanish: false,
      cleanupStatus: "source-derived-nontext-crop",
      captionRu:
        "При повороте крупного транспорта задние колеса идут по меньшей дуге, чем передние. Велосипедист рядом с автобусом или грузовиком может оказаться в слепой зоне и под риском зажатия."
    },
    {
      id: "driver-recommendations",
      kind: "list",
      titleRu: "Рекомендации водителю рядом с велосипедом",
      sourceTextEs: "Recomendaciones.",
      itemsRu: [
        "Велосипед - транспортное средство, и у велосипедиста такое же право на движение, как у остальных. Уважайте его преимущество проезда.",
        "Если едете позади велосипеда, сохраняйте безопасную дистанцию; при обгоне оставляйте 1,5 м сбоку.",
        "Если ширина дороги не позволяет обогнать, нельзя сигналить и ехать опасно. Нужно дождаться, пока у велосипедиста появится достаточно места, чтобы облегчить проезд.",
        "При перестроении или повороте заранее подавайте сигнал и проверяйте, не оказался ли велосипед в слепой зоне.",
        "Перед зеленым переходом снижайте скорость и смотрите в обе стороны: велосипеды и электрические самокаты могут двигаться там в обоих направлениях.",
        "Не занимайте и не паркуйтесь на защищенных велодорожках. Эти «пять минут» могут подвергнуть велосипедистов риску."
      ]
    },
    {
      id: "hand-signals",
      kind: "bicycle-hand-signals",
      titleRu: "Жесты велосипедиста",
      sourceTextEs: "Giro a la izquierda; Detenerse; Giro a la derecha.",
      sourcePage: 35,
      sourceRegion: {
        x: 345,
        y: 930,
        width: 540,
        height: 260
      },
      assetPath: `${assetRoot}/hand-signals-source.jpg`,
      signals: [
        {
          id: "left",
          titleRu: "Поворот налево",
          textRu: "левая рука вытянута."
        },
        {
          id: "stop",
          titleRu: "Остановка",
          textRu: "левая рука поднята."
        },
        {
          id: "right",
          titleRu: "Поворот направо",
          textRu: "правая рука вытянута."
        }
      ],
      visualNotes: [
        "The cyclist backs are source-page crops kept away from Spanish captions.",
        "Russian maneuver labels are DOM text directly below the matching figures.",
        "Signal order matches the source: left, stop, right."
      ]
    },
    {
      id: "lane-network",
      kind: "paragraph",
      sourceTextEs:
        "Se diseno para fomentar el uso de la bicicleta, mejorar la convivencia en el transito y la seguridad de ciclistas.",
      textRu:
        "Сеть велодорожек на тротуарах и защищенных велодорожек создана, чтобы поощрять велосипед, улучшать дорожное сосуществование и безопасность велосипедистов. Она соединяет пересадочные центры, университеты, школы и больницы, а также помогает пересаживаться на другие виды транспорта."
    },
    {
      id: "bike-lane-infrastructure",
      kind: "pedestrian-infrastructure",
      titleRu: "Дорожная инфраструктура для велосипедов",
      sourceTextEs: "Red de bicisendas y ciclovias protegidas. Bicisendas. Ciclovias.",
      cards: [
        {
          id: "bicisenda",
          titleRu: "Велодорожка на тротуаре",
          sourcePage: 36,
          sourceRegion: {
            x: 345,
            y: 610,
            width: 255,
            height: 170
          },
          assetPath: `${assetRoot}/bicisenda-photo-source.jpg`,
          altRu: "Велосипедист едет по велодорожке на тротуаре или в зеленой зоне",
          details: [
            {
              labelRu: "Где",
              textRu: "специально обозначенный и оборудованный сектор на тротуарах и в зеленых пространствах."
            },
            {
              labelRu: "Кто",
              textRu: "велосипеды и электрические самокаты."
            },
            {
              labelRu: "Когда применяют",
              textRu: "если невозможно построить защищенную велодорожку на проезжей части и это не конфликтует с пешеходами."
            }
          ]
        },
        {
          id: "ciclovia",
          titleRu: "Защищенная велодорожка",
          sourcePage: 36,
          sourceRegion: {
            x: 345,
            y: 880,
            width: 255,
            height: 170
          },
          assetPath: `${assetRoot}/ciclovia-photo-source.jpg`,
          altRu: "Велосипедист едет по защищенной велодорожке на проезжей части",
          details: [
            {
              labelRu: "Где",
              textRu: "сектор проезжей части с физическим разделением или горизонтальной разметкой."
            },
            {
              labelRu: "Назначение",
              textRu: "исключительное движение велосипедов и электрических самокатов, защищенное от транспорта."
            },
            {
              labelRu: "Особенности",
              textRu: "обычно у левого края, часто двусторонние, с вертикальной, горизонтальной и тактильной сигнализацией или физическими вмешательствами."
            }
          ],
          noteRu:
            "Перед зеленой разметкой водитель должен снизить скорость и посмотреть в обе стороны: по велодорожке могут ехать велосипеды или самокаты в обоих направлениях."
        }
      ],
      visualNotes: [
        "Photo crops are source-derived and exclude readable Spanish captions.",
        "All lane definitions and warnings are Russian DOM text.",
        "This block remains inside the bicycle section and does not implement the later public-transport section."
      ]
    },
    {
      id: "parking-and-ecobici",
      kind: "pedestrian-infrastructure",
      titleRu: "Стоянка велосипедов и Ecobici",
      sourceTextEs: "Estacionamiento de bicicletas. Sistema de transporte publico en bicicleta.",
      cards: [
        {
          id: "bike-parking",
          titleRu: "Стоянка велосипедов",
          sourcePage: 37,
          sourceRegion: {
            x: 345,
            y: 500,
            width: 255,
            height: 170
          },
          assetPath: `${assetRoot}/bicycle-parking-source.jpg`,
          altRu: "Велосипед закреплен на городской велопарковке",
          details: [
            {
              labelRu: "Гаражи",
              textRu: "коммерческие стоянки или гаражи обязаны иметь места для велосипедов, а тариф должен быть пропорционален размеру транспортного средства."
            },
            {
              labelRu: "Массовые мероприятия",
              textRu: "Закон 4619/13 требует бесплатные и безопасные места для временной стоянки велосипедов."
            },
            {
              labelRu: "Тротуар",
              textRu: "велосипед можно ставить на тротуаре, если он не мешает пешеходам."
            }
          ],
          noteRu:
            "Если есть велопарковка, используйте ее: у метро, общественных зданий, коммун, больниц, школ, университетов, торговых центров, зеленых зон, культурных пространств, в Microcentro и на главных проспектах."
        },
        {
          id: "ecobici",
          titleRu: "Общественная велосипедная система",
          sourcePage: 37,
          sourceRegion: {
            x: 345,
            y: 890,
            width: 255,
            height: 170
          },
          assetPath: `${assetRoot}/ecobici-source.jpg`,
          altRu: "Городская станция Ecobici с оранжевыми велосипедами",
          details: [
            {
              labelRu: "Назначение",
              textRu: "город создал простую автоматическую систему общественных велосипедов, работающую 24 часа в сутки 365 дней в году."
            },
            {
              labelRu: "Как взять",
              textRu: "подойти к станции, сгенерировать код в последней версии приложения BA Ecobici by Tembici и ввести его в крепление велосипеда."
            },
            {
              labelRu: "Как вернуть",
              textRu: "вернуть велосипед можно на любой станции."
            }
          ]
        }
      ],
      visualNotes: [
        "Parking and Ecobici photos are source-derived local crops.",
        "The current service instructions are source-preserved but presented without remote URLs in the learner page.",
        "Legal references Decreto 485/10, Ley 1752/05, and Ley 4619/13 are preserved in Russian text."
      ]
    },
    {
      id: "electric-scooter-photo",
      kind: "source-artwork",
      titleRu: "Электрический самокат",
      altRu: "Человек едет на электрическом самокате по городской улице",
      assetPath: `${assetRoot}/scooter-source.jpg`,
      sourcePage: 38,
      sourceRegion: {
        x: 345,
        y: 520,
        width: 255,
        height: 145
      },
      visibleSpanish: false,
      cleanupStatus: "source-derived-nontext-photo-crop",
      captionRu:
        "Электрический самокат - новая модель транспорта для городской мобильности и коротких пешеходных перемещений, которая должна сосуществовать с традиционным транспортом."
    },
    {
      id: "electric-scooter-requirements",
      kind: "list",
      titleRu: "Самокат: требования для движения по общественной дороге",
      sourceTextEs: "Requisitos para circular en la via publica.",
      itemsRu: [
        "тормозная система, действующая на колеса;",
        "опорная платформа для ног;",
        "звонок или звуковой сигнал для привлечения внимания при среднем движении;",
        "светоотражающие элементы для хорошей видимости;",
        "не менее одного переднего и одного заднего фонаря для слабого освещения;",
        "максимальная мощность мотора - 500 ватт;",
        "общий максимальный предел скорости - 25 км/ч;",
        "минимальный возраст управления - 16 лет;",
        "шлем обязателен;",
        "можно ехать по велодорожкам на тротуаре и по проезжей части; если есть защищенная велодорожка, движение по ней обязательно;",
        "нужно соблюдать правила дорожного движения."
      ]
    },
    {
      id: "electric-scooter-prohibitions",
      kind: "list",
      titleRu: "Самокат: запреты",
      sourceTextEs: "Prohibiciones.",
      itemsRu: [
        "нельзя ездить по тротуарам, автомагистралям и другим скоростным дорогам, Av. 9 de Julio и пешеходным артериям;",
        "нельзя использовать транспортные средства с двигателем внутреннего сгорания: они опаснее и сильнее загрязняют среду;",
        "нельзя перевозить пассажира."
      ]
    }
  ]
};
