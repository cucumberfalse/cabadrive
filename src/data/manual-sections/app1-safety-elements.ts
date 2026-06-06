import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-safety-elements";

export const app1SafetyElementsSection: ManualGuideSectionContent = {
  id: "app1-safety-elements-content",
  sectionId: "app1-safety-elements",
  titleRu: "Элементы безопасности",
  sourcePages: [105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119],
  sourceTitleEs: "Elementos de seguridad",
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
      "content/validation/manual-guide/app1-safety-elements/page-105-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-106-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-107-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-108-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-108-tire-manufacturing-tread-life-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-108-blind-spot-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-109-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-110-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-110-mirror-orientation-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-111-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-112-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-113-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-113-headrest-position-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-114-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-115-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-115-sri-types-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-116-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-117-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-safety-elements/page-118-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-other-required-safety-elements/page-119-other-required-safety-elements-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app1-safety-elements/app1-safety-elements-desktop.png",
      "content/validation/manual-guide/app1-safety-elements/app1-safety-elements-mobile.png"
    ],
    notes: [
      "Source page 104 is the Appendix I divider and is recorded in registry evidence, not as a standalone runtime article.",
      "Pages 105-119 are rendered as selectable Russian learner text while preserving the official safety, legal, maintenance, and numeric details.",
      "Page 119 is shared: the Equipaje paragraphs before the Otros elementos de seguridad obligatorios heading belong to this safety-elements section; the heading and following obligatory equipment content belong to the next section.",
      "The tire manufacturing/date and tread-life visual is restored as a tight source-as-is crop from the official page 108 x5 render; Spanish headings, callouts, chart labels, bullets, and pressure recommendations remain unchanged inside the image, with Russian explanation outside.",
      "The mirror-orientation visual is an x5 source-as-is crop of only the protected mirror photo collage; Spanish body/caption text from the surrounding source page is translated in selectable Russian page text outside the image. The headrest and SRI visuals are transferred from x5 source crops with Spanish text cleaned at glyph level and Russian labels overlaid as selectable page text.",
      "The blind-spot visual is a tight source-as-is direct-PDF region crop from the official page 108 visual; Spanish heading, definition, diagram labels, and blue conclusion remain unchanged inside the image, with Russian explanation outside."
    ]
  },
  blocks: [
    {
      id: "why-vehicle-condition-matters",
      kind: "lead",
      sourceTextEs:
        "El conocimiento práctico de conducir no es suficiente... es necesario conocer el estado del vehículo.",
      textRu:
        "Практического умения водить недостаточно. Водитель должен знать состояние своего автомобиля: безопасность поездки зависит и от поведения человека, и от исправности элементов безопасности."
    },
    {
      id: "appendix-purpose",
      kind: "callout",
      sourceTextEs:
        "En el presente anexo se nombran los elementos de seguridad y se brindan algunas recomendaciones para el mantenimiento y la mecánica ligera.",
      textRu:
        "В Приложении I перечислены элементы безопасности, а также рекомендации по обслуживанию и легкой механике. Износ и срок службы автомобиля повышают риск, в том числе для пешеходов; поэтому важно помнить о периодической VTV как механической проверке."
    },
    {
      id: "active-safety-definition",
      kind: "list",
      titleRu: "Активная безопасность",
      sourceTextEs:
        "La seguridad activa tiende a evitar que se produzca un siniestro vial y mejora la eficiencia y estabilidad.",
      itemsRu: [
        "Активная безопасность помогает не допустить дорожный инцидент.",
        "Она повышает эффективность и устойчивость автомобиля во время движения.",
        "Перед поездкой водитель должен убедиться, что основные системы работают правильно."
      ]
    },
    {
      id: "pre-driving-checks",
      kind: "list",
      titleRu: "Что проверить перед движением",
      sourceTextEs:
        "Antes de iniciar la marcha se debe verificar: aceite, líquido refrigerante, líquido limpiaparabrisas, luces, frenos, neumáticos, batería, documentación...",
      itemsRu: [
        "Масло, охлаждающую жидкость и жидкость стеклоомывателя.",
        "Световые приборы, тормозную жидкость и тормозные колодки.",
        "Состояние шин, глубину рисунка, давление и срок годности.",
        "Аккумулятор и наличие документов.",
        "Подвеску, рулевое управление, развал-схождение и балансировку при периодических проверках.",
        "Утечки и дополнительные элементы безопасности: огнетушитель, аварийные треугольники, световозвращающий жилет, аптечку, запасное колесо, домкрат и баллонный ключ.",
        "Багаж: он должен быть надежно закреплен."
      ]
    },
    {
      id: "maintenance-recommendations",
      kind: "list",
      titleRu: "Рекомендации по обслуживанию",
      sourceTextEs:
        "Amortiguadores en perfecto estado; revisar neumáticos; frenos anualmente; líquido de frenos cada dos años o 50.000 km...",
      itemsRu: [
        "Амортизаторы должны быть в идеальном состоянии: неисправные амортизаторы могут увеличить тормозной путь примерно на 10%.",
        "Нужно следить за давлением и общим состоянием шин.",
        "Тормоза рекомендуется проверять ежегодно.",
        "Тормозную жидкость рекомендуется менять каждые 2 года или каждые 50 000 km.",
        "Тормозные колодки меняют при износе или примерно каждые 25 000 km.",
        "Тормозные диски обычно меняют примерно после четырех замен колодок."
      ]
    },
    {
      id: "steering-suspension-brakes",
      kind: "list",
      titleRu: "Рулевое управление, подвеска и тормоза",
      sourceTextEs:
        "Tipos de dirección: mecánica, hidráulica, electrohidráulica y electromecánica o eléctrica. La suspensión... Los frenos...",
      itemsRu: [
        "Есть четыре типа рулевого управления: механическое, гидравлическое, электрогидравлическое и электромеханическое или электрическое.",
        "Подвеска поддерживает контакт шин с дорогой, поглощает неровности и влияет на устойчивость.",
        "Тормоза являются элементом активной безопасности.",
        "ABS не является обязательным элементом, но помогает при блокировке колес: система ограничивает и отпускает давление только в момент блокировки."
      ]
    },
    {
      id: "tires",
      kind: "list",
      titleRu: "Шины",
      sourceTextEs:
        "Los números y letras en el lateral indican fecha de fabricación, índice de carga y velocidad máxima... profundidad menor a 1,6 mm...",
      itemsRu: [
        "Цифры и буквы на боковине показывают дату изготовления, индекс нагрузки и максимальную скорость.",
        "Шину нужно заменить при вздутиях, разрывах или глубине рисунка меньше 1.6 mm.",
        "Рисунок протектора отводит воду и помогает избежать аквапланирования.",
        "Шины старше 5 лет лучше не использовать.",
        "Давление берется из руководства автомобиля и измеряется на холодных шинах.",
        "Неверное давление снижает сцепление и увеличивает износ."
      ]
    },
    {
      id: "tire-manufacturing-tread-life-source-visual",
      kind: "source-image-cards",
      titleRu: "Дата изготовления, срок службы и давление шин",
      sourceTextEs: "Fecha de Fabricación. Vida útil de los Neumáticos. Recomendaciones.",
      cards: [
        {
          id: "app1-tire-manufacturing-tread-life-source-card",
          titleRu: "Как читать маркировку и износ шин",
          displayMode: "full-width",
          maxDisplayWidthPx: 760,
          minDisplayWidthPx: 760,
          sourcePage: 108,
          sourceRegion: { x: 1115, y: 1635, width: 760, height: 995 },
          assetPath: `${assetRoot}/tire-manufacturing-tread-life-source-as-is.jpg`,
          altRu:
            "Официальный блок про дату изготовления шин, срок службы протектора и рекомендации по давлению.",
          visibleSpanish: true,
          sourceImageException: {
            kind: "source-image-original-visible-text",
            visibleSpanishScope: "source-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          },
          termTranslations: [
            { termEs: "Fecha de Fabricación", translationRu: "Дата изготовления" },
            { termEs: "Vida útil de los Neumáticos", translationRu: "Срок службы шин" },
            { termEs: "Recomendaciones", translationRu: "Рекомендации" },
            { termEs: "Falta de presión", translationRu: "Недостаточное давление" },
            { termEs: "Presión excesiva", translationRu: "Избыточное давление" },
            { termEs: "Presión adecuada", translationRu: "Правильное давление" }
          ],
          bodyRu:
            "На боковине шины нужно искать дату изготовления, индекс нагрузки и скоростной индекс. По протектору ориентируются на глубину рисунка: при 1.6 mm шину заменяют, а шины старше 5 лет лучше не использовать. Давление проверяют на холодных шинах и берут из руководства автомобиля."
        }
      ],
      visualNotes: [
        "The runtime card is byte-identical to the feature 034 validation crop from the official page 108 x5 render.",
        "The crop removes only outer page whitespace around the tire visual; Spanish headings, date callout, tread-life chart, bullets, recommendation box, and pressure labels remain protected image pixels.",
        "Russian explanation and term translations are selectable page text outside the image."
      ]
    },
    {
      id: "tire-blowout",
      kind: "callout",
      sourceTextEs:
        "Pinchaduras. Si esto ocurre mientras se está manejando: no frenar inmediatamente; es aconsejable desacelerar lentamente y sujetar firmemente el volante.",
      textRu:
        "Если во время движения шина лопнула или резко потеряла давление, не тормозите сразу. Нужно крепко держать руль и постепенно снижать скорость, чтобы вернуть контроль над автомобилем."
    },
    {
      id: "mirrors-and-blind-spots",
      kind: "list",
      titleRu: "Зеркала и слепые зоны",
      sourceTextEs:
        "Los espejos retrovisores son tres: izquierdo, central y derecho. La correcta orientación reduce puntos ciegos pero nunca los elimina.",
      itemsRu: [
        "В автомобиле используются три зеркала: левое, центральное и правое.",
        "Правильная ориентация зеркал уменьшает слепые зоны, но не устраняет их полностью.",
        "Слепая зона - это область, которую водитель не видит ни напрямую, ни через зеркала.",
        "Чем больше транспортное средство, тем больше обычно его слепая зона.",
        "Перед маневром нужно снизить скорость, включить указатель, проверить зеркала, наклониться вперед и проверить ситуацию не менее двух раз.",
        "Во время движения используйте периферическое зрение и поворот головы через плечо.",
        "Сертифицированные выпуклые зеркала разрешены, но они делают объекты визуально меньше и дальше."
      ]
    },
    {
      id: "blind-spot-source-visual",
      kind: "source-image-cards",
      titleRu: "Слепая зона на схеме",
      sourceTextEs:
        "¿A qué se denomina punto ciego? Cuanto más grande es el vehículo, mayor es el punto ciego.",
      cards: [
        {
          id: "app1-blind-spot-source-card",
          titleRu: "Как растет слепая зона",
          displayMode: "full-width",
          maxDisplayWidthPx: 546,
          minDisplayWidthPx: 546,
          sourcePage: 108,
          sourceRegion: { x: 838, y: 1100, width: 1525, height: 1100 },
          assetPath: `${assetRoot}/blind-spot-source-as-is.jpg`,
          altRu:
            "Официальная схема слепых зон для автомобилей, мотоциклов, грузовиков и автобусов.",
          visibleSpanish: true,
          sourceImageException: {
            kind: "source-image-original-visible-text",
            visibleSpanishScope: "source-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          },
          termTranslations: [
            { termEs: "PUNTO CIEGO AUTOS", translationRu: "Слепая зона автомобилей" },
            { termEs: "PUNTO CIEGO MOTOS", translationRu: "Слепая зона мотоциклов" },
            { termEs: "CAMIONES Y COLECTIVOS", translationRu: "Грузовики и автобусы" },
            {
              termEs: "Cuanto más grande es el vehículo, mayor es el punto ciego.",
              translationRu: "Чем больше транспортное средство, тем больше слепая зона."
            }
          ],
          bodyRu:
            "На схеме видно главное правило: у более крупного транспорта зоны, которые водитель не видит напрямую или через зеркала, становятся больше. Испанские подписи внутри картинки не переводились, не закрашивались и не перерисовывались."
        }
      ],
      visualNotes: [
        "The runtime card is byte-identical to the feature 034 validation crop from the official PDF region.",
        "The crop removes only surrounding page whitespace, the unrelated upper tire panel, and the printed page number.",
        "The official Spanish heading, definition sentence, visual labels, road diagram, and blue conclusion remain protected image pixels."
      ]
    },
    {
      id: "mirror-orientation-source-visual",
      kind: "source-image-cards",
      titleRu: "Ориентация зеркал",
      sourceTextEs: "Orientación correcta de los espejos retrovisores: máximo 10%.",
      cards: [
        {
          id: "mirror-orientation-source-card",
          titleRu: "Схема ориентации зеркал",
          displayMode: "compact",
          sourcePage: 110,
          sourceRegion: { x: 1570, y: 1008, width: 495, height: 163 },
          assetPath: `${assetRoot}/mirror-orientation-photo-source-as-is.jpg`,
          altRu:
            "Схема правильной ориентации зеркал.",
          visibleSpanish: false,
          bodyRu:
            "Главное правило по фото: в каждом зеркале должно отражаться не больше 10% задней части собственного автомобиля. Дорожная сцена внутри изображения не переводится и не перерисовывается."
        }
      ],
      visualNotes: [
        "The mirror orientation image is byte-identical to the x5 source crop of the protected photo collage only.",
        "Spanish body/caption text around the source photo is excluded from the image and translated in surrounding selectable Russian page text."
      ]
    },
    {
      id: "horn",
      kind: "callout",
      sourceTextEs:
        "La bocina sólo debe utilizarse en una situación potencialmente peligrosa... 90 decibeles contra 65 decibeles aceptables.",
      textRu:
        "Звуковой сигнал используется только в потенциально опасной ситуации, когда другой сигнал невозможен. Сигнал в 90 dB намного громче приемлемых 65 dB, а неправильное использование санкционируется."
    },
    {
      id: "passive-safety-seatbelts",
      kind: "list",
      titleRu: "Пассивная безопасность и ремни",
      sourceTextEs:
        "La seguridad pasiva minimiza las consecuencias. El cinturón sujeta a los ocupantes; luego de una colisión violenta deben reemplazarse sus componentes.",
      itemsRu: [
        "Пассивная безопасность уменьшает последствия, если инцидент уже произошел.",
        "Ремень удерживает людей: после удара автомобиль замедляется, а тело по инерции продолжает движение.",
        "После сильного столкновения компоненты ремня нужно заменить.",
        "Сертифицированные ремни и крепления обязательны.",
        "Водитель отвечает за всех пассажиров.",
        "Количество людей в автомобиле должно соответствовать количеству мест с ремнями.",
        "Ремни используются спереди и сзади, всегда, даже на короткой поездке и при низкой скорости.",
        "Ремень предотвращает выброс из автомобиля, удар о лобовое стекло, детали салона и других пассажиров."
      ]
    },
    {
      id: "seatbelt-exceptions",
      kind: "callout",
      sourceTextEs:
        "Excepciones: médicos o paramédicos que asistan enfermos en la parte trasera de ambulancias y bomberos no ubicados en asiento delantero.",
      textRu:
        "Исключения из использования ремня узкие: врачи или фельдшеры, которые помогают больным в задней части машин скорой помощи, и пожарные, если они не находятся на переднем сиденье пожарных автомобилей."
    },
    {
      id: "pregnancy-and-seatbelt-fit",
      kind: "list",
      titleRu: "Беременность и правильное положение ремня",
      sourceTextEs:
        "Durante el embarazo se debe ubicar volante y asiento para que abdomen y pecho queden a 25 cm; banda sobre clavícula y pelvis.",
      itemsRu: [
        "Во время беременности водительница регулирует сиденье и руль так, чтобы живот и грудь находились примерно в 25 cm от руля.",
        "Регулируемый руль направляют к груди, а не к голове или животу.",
        "Обычно можно водить, если физическое состояние позволяет и нет чрезмерной усталости; с восьмого месяца лучше, чтобы вел другой человек.",
        "Плечевая часть ремня проходит по ключице между плечом и шеей, затем по центру груди.",
        "Нижняя часть ремня лежит на тазе ниже живота.",
        "Ремень должен прилегать, не быть перекрученным; толстая одежда и твердые или хрупкие предметы под ремнем опасны.",
        "Ремень на шее, груди, животе или слишком свободный ремень может вызвать тяжелые травмы."
      ]
    },
    {
      id: "headrest-source-visual",
      kind: "source-image-cards",
      titleRu: "Положение подголовника",
      sourceTextEs: "Altura apoyacabeza y distancia del apoyacabeza.",
      cards: [
        {
          id: "headrest-position-source-card",
          titleRu: "Схема положения подголовника",
          displayMode: "full-width",
          maxDisplayWidthPx: 1190,
          sourcePage: 113,
          sourceRegion: { x: 980, y: 1010, width: 1190, height: 185 },
          assetPath: `${assetRoot}/headrest-position-transferred-infographic.png`,
          altRu:
            "Схема высоты и дистанции подголовника с силуэтами и направляющими.",
          visibleSpanish: false,
          russianOverlayLabels: [
            { id: "headrest-height-title", textRu: "Высота подголовника", xPct: 29.5, yPct: 2, widthPct: 16, heightPct: 13, tone: "dark-on-light" },
            { id: "headrest-distance-title", textRu: "Дистанция подголовника", xPct: 52, yPct: 2, widthPct: 20, heightPct: 13, tone: "dark-on-light" },
            { id: "headrest-good", textRu: "хорошо", xPct: 28.8, yPct: 37, widthPct: 7.5, heightPct: 8, tone: "dark-on-light" },
            { id: "headrest-acceptable", textRu: "допустимо", xPct: 28.8, yPct: 49, widthPct: 8.5, heightPct: 8, tone: "dark-on-light" },
            { id: "headrest-medium", textRu: "средне", xPct: 28.8, yPct: 61, widthPct: 7.5, heightPct: 8, tone: "dark-on-light" },
            { id: "headrest-bad", textRu: "плохо", xPct: 28.8, yPct: 73, widthPct: 7.5, heightPct: 8, tone: "dark-on-light" }
          ],
          bodyRu:
            "Подголовник снижает риск хлыстовой травмы шеи и работает вместе с ремнем. Верх должен быть на уровне верхней части головы, а центр - примерно на линии глаз; плохое положение делает элемент бесполезным или увеличивает травмы."
        }
      ],
      visualNotes: [
        "The headrest visual is transferred from the x5 source crop; Spanish glyphs are cleaned from label regions and Russian labels are selectable DOM overlays.",
        "The silhouettes, dashed guides, pictograms, and spatial relationship are not redrawn."
      ]
    },
    {
      id: "headrest-rule",
      kind: "callout",
      sourceTextEs:
        "El apoyacabeza reduce el latigazo cervical, complementa el cinturón y es obligatorio para todos los ocupantes.",
      textRu:
        "Подголовник обязателен для всех пассажиров. Он может быть встроенным или регулируемым по высоте; при неправильной высоте или дистанции он не защищает от травмы шеи."
    },
    {
      id: "airbag-and-sri-law",
      kind: "list",
      titleRu: "Подушка безопасности и SRI",
      sourceTextEs:
        "El airbag absorbe energía cinética... El SRI es obligatorio para niños desde el nacimiento hasta 12 años si miden menos de 1,50 m o pesan menos de 36 kg.",
      itemsRu: [
        "Подушка безопасности поглощает кинетическую энергию и помогает избежать удара о руль или лобовое стекло.",
        "Он уменьшает риск ранений лица и глаз стеклом, а также движения головы и травм шеи.",
        "Подушка безопасности бывает фронтальной, боковой и шторочной.",
        "Подушка безопасности не обязательна и не заменяет ремень; без ремня она может вызвать тяжелые травмы.",
        "Безопасная дистанция до подушки безопасности - минимум 25 cm.",
        "SRI - это детская удерживающая система: детские кресла и сертифицированные устройства.",
        "По правилу CABA SRI обязателен с рождения до 12 лет, если рост меньше 1.50 m или вес меньше 36 kg; дети в этой группе не едут на переднем сиденье.",
        "Только если ребенок одновременно превышает возрастной, ростовой и весовой пороги, он может занимать любое место с трехточечным ремнем; поясной двухточечный ремень для такого случая запрещен.",
        "Национальное правило аналогично, но действует до 10 лет."
      ]
    },
    {
      id: "sri-source-visual",
      kind: "source-image-cards",
      titleRu: "Виды SRI",
      sourceTextEs: "Tipos de SRI.",
      cards: [
        {
          id: "sri-types-source-card",
          titleRu: "Схема типов SRI",
          displayMode: "full-width",
          maxDisplayWidthPx: 1220,
          sourcePage: 115,
          sourceRegion: { x: 900, y: 1320, width: 1220, height: 260 },
          assetPath: `${assetRoot}/sri-types-transferred-infographic.png`,
          altRu:
            "Схема типов детских удерживающих систем SRI с пиктограммами и номерами групп.",
          visibleSpanish: false,
          russianOverlayLabels: [
            { id: "sri-title", textRu: "Виды SRI", xPct: 28, yPct: 9, widthPct: 13, heightPct: 10, tone: "dark-on-light" },
            { id: "sri-newborns", textRu: "Новорожденные и малыши до 1 года / 10 kg", xPct: 29.2, yPct: 64, widthPct: 8.5, heightPct: 24, tone: "dark-on-light" },
            { id: "sri-group-0-plus", textRu: "1-15 месяцев, 0-13 kg", xPct: 37.4, yPct: 64, widthPct: 8.5, heightPct: 24, tone: "dark-on-light" },
            { id: "sri-group-1", textRu: "9 месяцев - 4 года, 9-18 kg", xPct: 45.4, yPct: 64, widthPct: 8.5, heightPct: 24, tone: "dark-on-light" },
            { id: "sri-group-2", textRu: "4-8 лет, 15-25 kg", xPct: 53.5, yPct: 64, widthPct: 8.5, heightPct: 24, tone: "dark-on-light" },
            { id: "sri-group-3", textRu: "8-12 лет, 22-36 kg", xPct: 61.6, yPct: 64, widthPct: 8.5, heightPct: 24, tone: "dark-on-light" }
          ],
          bodyRu:
            "Схема показывает пиктограммы и синие номера групп; испанские буквы очищены, а русские подписи наложены как текстовые элементы страницы."
        }
      ],
      visualNotes: [
        "The SRI visual is transferred from the x5 source crop.",
        "Source pictograms, blue group numerals, geometry, and spacing are preserved; Spanish glyphs are cleaned from title/card-label regions before Russian DOM overlays are applied."
      ]
    },
    {
      id: "sri-installation",
      kind: "list",
      titleRu: "Почему и как использовать SRI",
      sourceTextEs:
        "Correcta instalación reduce mortalidad 80% en niños y 70% en bebés... leer manual, verificar cinturón, Isofix o Latch.",
      itemsRu: [
        "Правильно установленная SRI снижает смертность примерно на 80% у детей и на 70% у младенцев.",
        "Дети не являются уменьшенной копией взрослых: пропорции тела другие, поэтому обычный ремень не дает такой же защиты.",
        "SRI снижает силу удара.",
        "Устройство должно соответствовать международным стандартам и иметь маркировку.",
        "Нужно читать руководство автомобиля и проверять, используется ли ремень, Isofix или Latch.",
        "Бывшую в употреблении SRI покупать не рекомендуется.",
        "Детские кресла стареют; некоторые производители советуют не использовать их дольше 5 лет.",
        "До примерно 1 года и 10 kg ребенок едет спиной вперед: так лучше защищаются голова, шея и позвоночник.",
        "SRI меняют, когда превышен максимальный вес или голова выходит выше спинки.",
        "Ремни, которыми SRI крепится к автомобилю, должны быть натянуты; их проверяют часто и после длинных поездок.",
        "Ребенок должен быть правильно удержан внутренними ремнями; ремень не проходит по шее.",
        "Теплую верхнюю одежду в SRI использовать не рекомендуется."
      ]
    },
    {
      id: "cabin-passive-safety",
      kind: "list",
      titleRu: "Салон и свободные предметы",
      sourceTextEs:
        "Seguridad del habitáculo: zonas de deformación, habitáculo indeformable, objetos sueltos por energía cinética.",
      itemsRu: [
        "Автомобиль имеет зоны деформации, а салон должен оставаться защитным и недеформируемым.",
        "Свободные предметы опасны: из-за инерции люди и вещи продолжают движение вперед после удара.",
        "При 50 km/h сила удара предмета может увеличиться примерно до 40-кратного веса предмета.",
        "Поэтому вещи в салоне нужно закреплять, а тяжелые предметы размещать безопасно."
      ]
    },
    {
      id: "bumper-glass-pets",
      kind: "list",
      titleRu: "Бампер, стекла и перевозка животных",
      sourceTextEs:
        "Paragolpes delantero y trasero; vidrios laminados o templados; mascotas nunca sueltas.",
      itemsRu: [
        "Передний и задний бампер поглощают часть кинетической энергии и уменьшают ущерб, но не сам удар.",
        "Закон CABA 2148 требует передний и задний бамперы в установленной форме и размерах, а также крылья, соответствующие колесам.",
        "Стекла обеспечивают видимость, аэродинамику и защиту от дождя, ветра, пыли и насекомых.",
        "Стекла могут быть многослойными или закаленными; фрагменты должны быть безопасными.",
        "Все стекла должны гарантировать видимость в обе стороны; при тонировке пассажиры должны различаться на короткой дистанции.",
        "Животных нельзя перевозить без фиксации. Они едут сзади и с соответствующей шлейкой."
      ]
    },
    {
      id: "luggage-safety",
      kind: "list",
      titleRu: "Багаж и максимальная загрузка",
      sourceTextEs:
        "Equipaje. El peso máximo que puede transportar el vehículo se encuentra en el manual... equipaje pesado en el fondo del baúl y cerca del centro.",
      itemsRu: [
        "Максимальная загрузка автомобиля указана в руководстве.",
        "Перегруз усложняет маневры даже для опытного водителя.",
        "Тяжелый багаж размещают глубоко в багажнике и ближе к центру автомобиля: это помогает устойчивости направления и поведению автомобиля в поворотах.",
        "Багажник на крыше должен быть надежно закреплен.",
        "Груз на крыше не должен ухудшать аэродинамику и видимость, закрывать световые приборы или превышать установленные пределы."
      ]
    }
  ]
};
