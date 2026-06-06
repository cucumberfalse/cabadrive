import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-safety-elements";

export const app2SafetyElementsSection: ManualGuideSectionContent = {
  id: "app2-safety-elements-content",
  sectionId: "app2-safety-elements",
  titleRu: "Элементы безопасности пассажирского транспорта",
  sourcePages: [125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136],
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
      "content/validation/manual-guide/app2-safety-elements/page-125-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app2-safety-elements/page-126-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app2-safety-elements/page-127-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app2-safety-elements/page-128-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app2-safety-elements/page-129-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app2-safety-elements/page-130-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app2-safety-elements/page-130-mirror-orientation-source-crop.png",
      "content/validation/manual-guide/app2-safety-elements/page-131-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app2-safety-elements/page-131-seatbelt-use-source-crop.png",
      "content/validation/manual-guide/app2-safety-elements/page-132-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app2-safety-elements/page-132-headrest-combined-diagram-source-crop.jpg",
      "content/validation/manual-guide/app2-safety-elements/page-133-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app2-safety-elements/page-134-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app2-safety-elements/page-135-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app2-safety-elements/page-136-safety-elements-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app2-safety-elements/app2-safety-elements-desktop.png",
      "content/validation/manual-guide/app2-safety-elements/app2-safety-elements-mobile.png"
    ],
    notes: [
      "Pages 125-136 are implemented as selectable Russian DOM text with key source visual instructions preserved at runtime.",
      "The mirror and seat-belt visuals are tight x5 source-as-is photo crops with surrounding Spanish caption/body text translated outside the image.",
      "The page 132 headrest-position visual is preserved as one source-as-is combined diagram crop with Spanish labels unchanged inside the image and Russian term translations rendered as selectable DOM text below it."
    ]
  },
  blocks: [
    {
      id: "vehicle-condition-vtv",
      kind: "lead",
      sourceTextEs:
        "Todos los vehiculos tienen vida util; la VTV busca garantizar normas de seguridad vial y prevenir siniestros.",
      textRu:
        "У транспортных средств есть срок службы и естественный износ. Для пассажирского транспорта это особенно важно: постоянная эксплуатация, дождь, ветер, высокие скорости на трассах и больший размер требуют заранее контролировать безопасное состояние машины."
    },
    {
      id: "driver-supervision-duty",
      kind: "callout",
      sourceTextEs:
        "Es obligacion de la persona que conduce supervisar que el vehiculo se encuentre en adecuadas condiciones de seguridad antes de iniciar su marcha.",
      textRu:
        "Перед началом движения водитель обязан убедиться, что транспортное средство находится в надлежащем безопасном состоянии. Опыт должен помогать отвечать на требования профессионального вождения, а не компенсировать нарушения норм или невнимательность."
    },
    {
      id: "active-passive-safety",
      kind: "table",
      titleRu: "Два вида безопасности",
      sourceTextEs:
        "La seguridad activa previene incidentes; la seguridad pasiva reduce consecuencias cuando el incidente ocurre.",
      columnsRu: ["Вид", "Задача"],
      rows: [
        {
          id: "active",
          cellsRu: ["Активная безопасность", "Предотвращать инциденты, повышая эффективность, устойчивость и правильную работу движущегося транспорта."]
        },
        {
          id: "passive",
          cellsRu: ["Пассивная безопасность", "Уменьшать последствия, когда дорожный инцидент уже произошел."]
        }
      ]
    },
    {
      id: "brakes",
      kind: "list",
      titleRu: "Тормоза",
      sourceTextEs:
        "Sistema de frenos: revisar cada 6 meses en vehiculos de uso frecuente; amortiguadores en perfecto estado; estado y presion de neumaticos; pavimento, clima y liquido de frenos o presion de aire.",
      itemsRu: [
        "Тормоза - важнейшая система активной безопасности: они останавливают транспортное средство или уменьшают скорость.",
        "На торможение влияют скорость, состояние дороги, погода и механика транспортного средства.",
        "На часто используемых транспортных средствах тормоза проверяют минимум каждые 6 месяцев.",
        "Амортизаторы должны быть в идеальном состоянии: иначе тормозной путь может увеличиться на 10%.",
        "Состояние и давление шин влияют на эффективность торможения.",
        "Нужно учитывать сцепление асфальта и погоду, а также поддерживать нужный уровень тормозной жидкости или воздушного давления."
      ]
    },
    {
      id: "suspension-tires-steering",
      kind: "list",
      titleRu: "Подвеска, шины и рулевое управление",
      sourceTextEs:
        "Suspension mantiene los neumaticos en contacto con el piso; neumaticos soportan hasta 50 veces su peso; direccion mecanica, hidraulica, electrohidraulica, electromecanica o electrica.",
      itemsRu: [
        "Подвеска удерживает шины в контакте с покрытием, поглощает неровности, влияет на устойчивость и комфорт.",
        "Стабилизаторы соединяют колеса каждой оси и контролируют наклон в поворотах, помогая не съехать с проезжей части.",
        "Шины являются точкой контакта с дорогой и могут выдерживать нагрузку до 50 раз больше собственного веса.",
        "Шины участвуют в устойчивости, подвеске и торможении.",
        "Рулевое управление направляет колеса и на высоких скоростях становится жестче, чтобы помогать устойчивости.",
        "Есть механическое, гидравлическое, электрогидравлическое и электромеханическое или электрическое рулевое управление."
      ]
    },
    {
      id: "tire-condition",
      kind: "list",
      titleRu: "Состояние шин",
      sourceTextEs:
        "Estado del neumatico: profundidad menor a 1,6 mm requiere reemplazo; en vehiculos de gran porte 2 mm es recomendable; evitar neumaticos de mas de 5 anos; prohibidos recapados en ejes delanteros de camiones y omnibus de media y larga distancia.",
      itemsRu: [
        "На боковинах шин указаны дата изготовления, индекс нагрузки, максимальная скорость и другие характеристики.",
        "Если есть вздутия, разрывы или глубина рисунка меньше 1,6 mm, шину нужно заменить.",
        "Для крупногабаритного транспорта замену рекомендуется делать уже при глубине 2 mm.",
        "Рисунок отводит воду на мокром покрытии и помогает избежать гидропланирования или аквапланирования.",
        "Не рекомендуется использовать шины старше 5 лет с даты изготовления независимо от износа.",
        "Восстановленные шины запрещены на передних осях грузовиков и средне- и дальнемагистральных автобусов.",
        "Давление проверяют на холодных шинах; лишнее или недостаточное давление ухудшает сцепление и ускоряет износ."
      ]
    },
    {
      id: "mirrors-and-blind-spots",
      kind: "list",
      titleRu: "Зеркала и слепые зоны",
      sourceTextEs:
        "Espejos retrovisores reducen puntos ciegos pero nunca a cero; en vehiculos de gran porte se pierden aproximadamente 3 metros de vision frontal; solo debe reflejarse como maximo el 10% de la parte trasera.",
      itemsRu: [
        "Зеркала позволяют видеть другие транспортные средства и пешеходов, но слепые зоны никогда не исчезают полностью.",
        "Перед поворотом или перестроением нужно снизить скорость, включить указатель поворота и несколько раз проверить зеркала.",
        "Слепая зона - область вокруг транспорта, которую водитель не видит ни напрямую, ни через зеркала.",
        "Чем больше транспортное средство, тем больше слепая зона.",
        "У крупногабаритного транспорта высокая посадка ухудшает ближний передний обзор: водитель теряет примерно 3 метра перед собой.",
        "Перед маневром немного подайтесь корпусом вперед, используйте периферическое зрение и при необходимости смотрите через плечо.",
        "В зеркале должно отражаться максимум 10% задней части транспортного средства."
      ]
    },
    {
      id: "mirror-orientation-source-visual",
      kind: "source-image-cards",
      titleRu: "Ориентация зеркал",
      sourceTextEs:
        "Sólo debe reflejarse como máximo el 10% de la parte trasera del vehículo.",
      cards: [
        {
          id: "app2-mirror-orientation-source-card",
          titleRu: "Фото положения зеркал",
          displayMode: "full-width",
          maxDisplayWidthPx: 1260,
          minDisplayWidthPx: 760,
          sourcePage: 130,
          sourceRegion: { x: 930, y: 1960, width: 1260, height: 125 },
          assetPath: `${assetRoot}/mirror-orientation-photo-source-as-is.png`,
          altRu:
            "Фото правильной и неправильной ориентации бокового зеркала.",
          visibleSpanish: false,
          bodyRu:
            "Главное правило по фото: в зеркале должно отражаться не больше 10% задней части собственного транспортного средства. Дорожная сцена внутри изображения не переводится и не дорисовывается."
        }
      ],
      visualNotes: [
        "The mirror photos are copied byte-for-byte from the focused x5 source crop.",
        "The Spanish caption under the photos is excluded from the runtime image and translated in selectable Russian text outside it."
      ]
    },
    {
      id: "seat-belts",
      kind: "list",
      titleRu: "Ремни безопасности",
      sourceTextEs:
        "Cinturon: debe pasar por clavicula, centro del pecho y huesos de cadera; conductores son responsables ante autoridad de control; excepciones para medicos o paramedicos en ambulancias y bomberos no delanteros.",
      itemsRu: [
        "Ремень удерживает людей после удара, когда транспорт резко замедляется, а тело продолжает двигаться прежней скоростью.",
        "Характеристики и расположение ремней зависят от количества перевозимых людей, вида транспортного средства и выполняемой деятельности.",
        "Водители отвечают за использование ремней перед контролирующим органом.",
        "Ремень проходит по ключице между плечом и шеей, затем по центру груди.",
        "Нижняя часть должна располагаться на костях таза, всегда ниже живота.",
        "Ремень должен плотно прилегать, не быть перекрученным и не проходить поверх твердых или хрупких предметов.",
        "От обязанности пристегиваться освобождены только врачи или парамедики при помощи больным в задней части скорой помощи и пожарные, которые не едут на переднем сиденье пожарных автомобилей."
      ]
    },
    {
      id: "seatbelt-use-source-visual",
      kind: "source-image-cards",
      titleRu: "Правильное положение ремня",
      sourceTextEs: "Uso correcto del cinturón de seguridad.",
      cards: [
        {
          id: "app2-seatbelt-use-source-card",
          titleRu: "Фото положения ремня",
          displayMode: "full-width",
          maxDisplayWidthPx: 1060,
          sourcePage: 131,
          sourceRegion: { x: 1015, y: 2005, width: 1060, height: 285 },
          assetPath: `${assetRoot}/seatbelt-use-photo-source-as-is.png`,
          altRu:
            "Фото правильного и неправильного положения ремня безопасности.",
          visibleSpanish: false,
          bodyRu:
            "На фотографиях показаны правильное и неправильное положения ремня. Русские правила расположения ремня приведены в тексте рядом; испанские пункты под фото не входят в изображение."
        }
      ],
      visualNotes: [
        "The seat-belt photos are copied byte-for-byte from the focused x5 source crop.",
        "Spanish bullet text below the source photos is excluded from the runtime image and translated in selectable Russian text outside it."
      ]
    },
    {
      id: "pregnancy-headrest-airbag",
      kind: "list",
      titleRu: "Беременность, подголовник и подушка безопасности",
      sourceTextEs:
        "Gestacion: 25 cm entre abdomen o torax y volante; desde octavo mes otra persona conduzca. Apoyacabeza reduce efecto latigo. Airbag complementa cinturon y requiere 25 cm.",
      itemsRu: [
        "Во время беременности нужно менять настройки руля и сиденья так, чтобы между животом или грудью и рулем было минимум 25 cm.",
        "Если руль регулируется по наклону, его направляют к груди, а не к голове или животу.",
        "С восьмого месяца лучше, чтобы вел другой человек.",
        "Подголовник при правильной регулировке уменьшает хлыстовой эффект и дополняет ремень безопасности.",
        "Самая высокая часть подголовника должна быть на уровне верхней части головы, центральная - на уровне линии глаз.",
        "Подушка безопасности дополняет ремень и не заменяет его; без ремня она может причинить тяжелые травмы.",
        "Для безопасного раскрытия подушки нужно минимальное расстояние 25 cm от тела."
      ]
    },
    {
      id: "headrest-position-source-visual",
      kind: "source-image-cards",
      titleRu: "Положение подголовника",
      sourceTextEs:
        "Altura apoyacabeza, distancia del apoyacabeza, Bueno, Aceptable, Regular, Malo y Botón de desbloqueo.",
      cards: [
        {
          id: "app2-headrest-combined-source-card",
          titleRu: "Как выставить подголовник",
          displayMode: "full-width",
          maxDisplayWidthPx: 820,
          sourcePage: 132,
          sourceRegion: { x: 1040, y: 2160, width: 820, height: 600 },
          assetPath: `${assetRoot}/headrest-combined-diagram-source-as-is.jpg`,
          altRu:
            "Цельная испанская схема регулировки подголовника по высоте, расстоянию и кнопке разблокировки.",
          visibleSpanish: true,
          sourceImageException: {
            kind: "source-image-original-visible-text",
            visibleSpanishScope: "source-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          },
          bodyRu:
            "Верх подголовника должен быть примерно на уровне верхней части головы, центр - около линии глаз. По расстоянию лучше, когда подголовник ближе к голове без неудобства: так он эффективнее снижает риск хлыстовой травмы.",
          termTranslations: [
            { termEs: "Altura apoyacabeza", translationRu: "Высота подголовника" },
            { termEs: "Distancia del apoyacabeza", translationRu: "Расстояние до подголовника" },
            { termEs: "Bueno", translationRu: "Хорошо" },
            { termEs: "Aceptable", translationRu: "Допустимо" },
            { termEs: "Regular", translationRu: "Средне" },
            { termEs: "Malo", translationRu: "Плохо" },
            { termEs: "Botón de desbloqueo", translationRu: "Кнопка разблокировки" }
          ]
        }
      ],
      visualNotes: [
        "The headrest visual is a source-as-is crop from the Appendix II page 132 x5 evidence using sips cropOffset 2160 1040 and crop 600x820.",
        "Spanish labels remain unchanged inside the protected image; Russian term translations are rendered as selectable DOM text below the card."
      ]
    },
    {
      id: "cabin-body-and-glass",
      kind: "list",
      titleRu: "Салон, кузовные элементы и стекла",
      sourceTextEs:
        "Paragolpes obligatorios por Ley 2148; cristales templados o laminados; habitaculo indeformable; objetos sueltos a 50 km/h multiplican fuerza hasta 40 veces.",
      itemsRu: [
        "Бампер спереди и сзади смягчает столкновение и уменьшает повреждения, но не устраняет сам удар.",
        "Закон 2148 требует передние и задние бамперы и крылья, соответствующие колесам.",
        "Стекла обеспечивают обзор, аэродинамику и защиту от дождя, ветра, пыли, насекомых и другого; они бывают закаленными или ламинированными.",
        "Салон должен быть как можно более недеформируемым и иметь защитные условия для всех людей внутри.",
        "Люди и незакрепленные предметы продолжают двигаться по инерции; при 50 km/h сила удара предмета может увеличиться до 40 раз относительно его веса.",
        "Личные предметы рабочего дня нужно хранить в безопасном и близком месте, например в перчаточном ящике, а не свободно в салоне.",
        "Если транспорт перевозит грузы вместе с людьми, нужна защита, чтобы груз не мешал и не угрожал пассажирам.",
        "Инвалидные кресла перевозят в багажнике или на багажнике; если это невозможно, нужен другой способ крепления, а транспорт для людей с ограниченной мобильностью должен иметь соответствующие крепления."
      ]
    },
    {
      id: "mandatory-equipment",
      kind: "list",
      titleRu: "Другие обязательные элементы безопасности",
      sourceTextEs:
        "Balizas al menos dos accesibles; matafuego obligatorio con carga periodica y soporte metalico; chaleco reflectivo dentro del habitaculo; cuarta de enganche reglamentaria.",
      itemsRu: [
        "Аварийных знаков должно быть минимум два, и они должны находиться в доступном месте.",
        "Их функция - предупредить других людей об остановленном транспортном средстве, чтобы у них были место и время заметить риск и отреагировать.",
        "Огнетушитель обязателен; его емкость и класс зависят от вида транспортного средства, а зарядку нужно периодически обновлять.",
        "Огнетушитель размещают в салоне в пределах досягаемости водителя, кроме тех, емкость которых больше 1 kg.",
        "Крепление огнетушителя должно быть металлическим; эластичный хомут запрещен.",
        "Светоотражающий жилет обязателен внутри салона. При выходе на проезжую часть его рекомендуется надевать без одежды поверх; при форс-мажоре на автомагистралях и быстрых дорогах его использование обязательно.",
        "Регламентная буксировочная сцепка - жесткая выдвижная штанга; для перевозки школьников и людей с ограниченной мобильностью она обязательна, если применимые нормы требуют это для деятельности."
      ]
    },
    {
      id: "recommended-equipment",
      kind: "list",
      titleRu: "Рекомендуемые элементы безопасности",
      sourceTextEs:
        "Botiquin con gasas, vendas, cinta, agua oxigenada, solucion yodada, alcohol, guantes, crema, antidiarreico, analgesicos, antiinflamatorio, pinzas, tijera y linterna; dispositivo telescopico homologado sustituye cuerdas y cables.",
      itemsRu: [
        "Помимо случаев, когда аптечка обязательна по виду услуги, полезно возить набор для базовой первой помощи до прибытия медицинской помощи.",
        "Аптечку обозначают красным крестом на белой коробке или наоборот и закрепляют в безопасном месте.",
        "В набор входят стерильные гидрофильные марлевые салфетки, бинты и повязки разных размеров, гипоаллергенный пластырь, перекись водорода, йодный раствор, спирт или другое дезинфицирующее средство.",
        "Также перечислены латексные или виниловые перчатки, крем от ожогов, таблетки активированного угля, обезболивающие, противовоспалительное средство, крем от укусов насекомых, пинцет, ножницы и фонарик с запасными батарейками или аккумулятором.",
        "Омологированное телескопическое устройство заменяет веревки, тросы и другие гибкие средства, запрещенные как небезопасные.",
        "В CABA частному транспортному средству запрещено буксировать другое; буксировку выполняет транспорт, уполномоченный для этой цели."
      ]
    }
  ]
};
