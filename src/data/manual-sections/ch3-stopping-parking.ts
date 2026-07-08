import type { ManualGuideSectionContent } from "../manualGuide";

export const ch3StoppingParkingSection: ManualGuideSectionContent = {
  id: "ch3-stopping-parking-content",
  sectionId: "ch3-stopping-parking",
  titleRu: "Остановка и стоянка",
  sourcePages: [83, 84, 85, 86, 87, 88],
  sourceTitleEs: "Detencion y estacionamiento",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch3-stopping-parking/page-083-stopping-parking-source-crop.jpg",
      "content/validation/manual-guide/ch3-stopping-parking/page-084-stopping-parking-source-crop.jpg",
      "content/validation/manual-guide/ch3-stopping-parking/page-085-stopping-parking-source-crop.jpg",
      "content/validation/manual-guide/ch3-stopping-parking/page-086-stopping-parking-source-crop.jpg",
      "content/validation/manual-guide/ch3-stopping-parking/page-087-stopping-parking-source-crop.jpg",
      "content/validation/manual-guide/ch3-stopping-parking/page-088-stopping-parking-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch3-stopping-parking/ch3-stopping-parking-desktop.png",
      "content/validation/manual-guide/ch3-stopping-parking/ch3-stopping-parking-mobile.png"
    ],
    notes: [
      "Source PDF pages 83-88 are converted as the Chapter 3 stopping and parking section.",
      "Parking photos and diagrams are retained as x5 reference evidence only; runtime restrictions are selectable Russian DOM text.",
      "No source photo, sign, road marking, or diagram is modified, translated, relabeled, cleaned, or masked."
    ]
  },
  blocks: [
    {
      id: "detention-definition",
      kind: "lead",
      sourceTextEs:
        "Permanencia sin movimiento de un vehículo junto a la acera, por un tiempo estrictamente necesario...",
      textRu:
        "Detención (краткая остановка) - это пребывание автомобиля без движения у бордюра только на строго необходимое время: контроль движения компетентным органом, посадка или высадка пассажиров, погрузка или разгрузка. При другой причине это считается detención (остановкой), если длится не более 2 минут и водитель не покидает автомобиль."
    },
    {
      id: "detention-method",
      kind: "list",
      titleRu: "Как выполнять detención (краткую остановку)",
      sourceTextEs:
        "Se realiza siempre con balizas intermitentes encendidas, situando el vehículo lo más cerca posible de la acera...",
      itemsRu: [
        "Всегда с включенными balizas intermitentes (аварийными мигающими огнями).",
        "Поставить автомобиль как можно ближе к acera (тротуару/бордюру).",
        "Принять меры, чтобы не мешать движению.",
        "Остановка из-за светофора, пробки, дорожной ситуации или fuerza mayor (непреодолимой силы) не считается detención (остановкой) или estacionamiento (стоянкой/парковкой)."
      ]
    },
    {
      id: "detention-prohibitions",
      kind: "list",
      titleRu: "Где запрещена detención (остановка)",
      sourceTextEs:
        "Está prohibido detenerse en... también aplica a los vehículos con emblema internacional de discapacidad.",
      itemsRu: [
        "В секторах остановки colectivos (автобусов) и taxis (такси).",
        "Перед comisarías (полицейскими участками), пожарными частями и банками, кроме транспорта, который обслуживает эти учреждения.",
        "На ciclovías (велодорожках).",
        "На vías rápidas (скоростных дорогах): Av. Cantilo, Av. Lugones, центральные проезжие части Gral. Paz и autopistas (автомагистралях).",
        "Во второй ряд, кроме краткой остановки прямо перед маневром парковки.",
        "На углах.",
        "На пешеходных переходах или линиях Pare (стоп).",
        "На въезде, внутри и выезде из тоннелей, pasos bajo nivel (подземных проездах/проездах под уровнем) и мостов.",
        "На железнодорожных рельсах. Если переезд без барьеров, минимальная дистанция от рельсов - 5 м."
      ]
    },
    {
      id: "parking-definition",
      kind: "paragraph",
      sourceTextEs:
        "Estacionamiento: permanencia sin movimiento de un vehículo en la vía pública... por más tiempo del necesario para ser considerada como detención.",
      textRu:
        "Estacionamiento (стоянка/парковка) - это пребывание автомобиля без движения на общественной дороге дольше времени, нужного для detención (краткой остановки), то есть больше 2 минут. Неважно, есть ли водитель, работает ли двигатель, включены ли balizas (аварийные огни) и находятся ли люди внутри."
    },
    {
      id: "general-parking-prohibited",
      kind: "list",
      titleRu: "Общие запреты парковки в CABA, если знак не говорит иное",
      sourceTextEs:
        "PROHIBIDO... En avenidas... En Metrobús... En ciclovías... pasajes... calles de convivencia.",
      itemsRu: [
        "На avenidas (проспектах) у обеих aceras (тротуаров/бордюров) в рабочие дни с 7 до 21 часа.",
        "В Metrobús (метробусе) у обеих aceras (тротуаров/бордюров) каждый день 24 часа.",
        "На ciclovías (велодорожках) со стороны затронутой полосы каждый день 24 часа.",
        "В pasajes (пассажах/узких проездах) с шириной проезжей части не более 4,5 м.",
        "На calles de convivencia (улицах совместного пользования) по всей длине у обеих aceras (тротуаров/бордюров).",
        "Рабочими считаются понедельник-пятница, если это не праздники."
      ]
    },
    {
      id: "parking-exceptions-and-allowed",
      kind: "list",
      titleRu: "Исключения и разрешенные общие случаи",
      sourceTextEs:
        "Excepciones... avenidas de doble sentido... Macrocentro... PERMITIDO...",
      itemsRu: [
        "На двусторонних avenidas (проспектах) Av. 9 de Julio, Av. Perito Moreno и центральных проезжих частях Av. Leandro N. Alem, Paseo Colón и Sáenz запрет действует 24 часа.",
        "В Macrocentro (центральной зоне) запрет парковки у обеих aceras (тротуаров/бордюров) действует для любой arteria (дороги/артерии) в рабочие дни с 7 до 21 часа.",
        "На calles (улицах) парковка у обеих aceras (тротуаров/бордюров) разрешена каждый день 24 часа, если знак не указывает другое.",
        "На avenidas (проспектах) парковка разрешена с 21 до 7 часов у обеих сторон в рабочие дни, а также 24 часа в выходные и праздники, если знак не указывает другое."
      ]
    },
    {
      id: "correct-parking-forms",
      kind: "list",
      titleRu: "Правильные формы парковки",
      sourceTextEs:
        "Formas correctas de estacionar. Automóviles... Motovehículos...",
      itemsRu: [
        "Автомобили: параллельно бордюру примерно в 20 см от него и с достаточной дистанцией до автомобилей спереди и сзади.",
        "Автомобили: под 45 градусов к бордюру только в размеченных секторах.",
        "Автомобили: под 90 градусов к бордюру только в размеченных секторах.",
        "Motovehículos (мототранспорт): на тротуаре и проезжей части только в специально размеченных секторах.",
        "Если специальной разметки нет, motovehículos (мототранспорт) ставятся задней частью к бордюру под 45-90 градусов и соблюдают те же нормы, что остальные транспортные средства."
      ]
    },
    {
      id: "special-parking-prohibitions",
      kind: "list",
      titleRu: "Специальные запреты estacionamiento (парковки)",
      sourceTextEs:
        "Prohibiciones especiales... deben respetarse haya o no una señal.",
      itemsRu: [
        "В местах, где уже запрещена detención (остановка).",
        "В pasajes (пассажах/узких проездах) шириной не более 4,5 м и на calles de convivencia (улицах совместного пользования) у обеих aceras (тротуаров/бордюров).",
        "Ближе 50 м с каждой стороны от железнодорожного переезда на уровне.",
        "В секторах въезда и выезда автомобилей на дорогу, то есть у garajes (гаражей).",
        "Перед rampas (пандусами) для людей с инвалидностью.",
        "Перед входами в subterráneos (метро).",
        "Перед входами в места публичных зрелищ в часы функций.",
        "Перед входом в salas velatorias (похоронные залы) с 8 до 22 часов.",
        "Там, где есть carriles exclusivos (выделенные полосы) для определенного транспорта в часы их действия.",
        "Ближе 10 м с каждой стороны от входа в больницы, школы во время занятий, храмы во время служб, банки в часы работы, почтовые компании в часы работы и учреждения для людей с инвалидностью.",
        "В официально обозначенных секторах: carga y descarga (погрузка и разгрузка), hoteles (отели), ferias barriales (районные ярмарки), резерв парковки, запрет парковки и подобные случаи.",
        "Автобусы, микроавтобусы, грузовики, дома на колесах, полуприцепы и спецтехника (Ómnibus, micros, camiones, casas rodantes, semiacoplados и maquinaria especial) не могут парковаться на общественной дороге 24 часа."
      ]
    },
    {
      id: "incorrect-and-maneuver",
      kind: "list",
      titleRu: "Неправильная парковка и маневр",
      sourceTextEs:
        "Formas incorrectas de estacionar... Maniobra de estacionamiento...",
      itemsRu: [
        "Никогда нельзя парковать автомобиль на тротуаре, даже если это дом водителя или владельца.",
        "Это относится и к motovehículos (мототранспорту) независимо от ширины тротуара или механической неисправности.",
        "Маневр можно дополнительно подкрепить ручным сигналом, подняв руку из окна.",
        "При параллельной парковке краткая остановка во второй ряд допустима только непосредственно перед движением назад.",
        "Движение задним ходом в городе запрещено, кроме парковки, въезда и выезда из гаража или объезда препятствия. Назад можно сдавать только минимально необходимую дистанцию.",
        "При задней передаче включаются огни заднего хода; если обзор через центральное зеркало конструктивно закрыт, должна включаться звуковая сигнализация.",
        "О намерении остановиться, припарковаться или въехать в гараж нужно заранее сообщать balizas (аварийными огнями), маневрировать без толкания других автомобилей, без заезда на acera (тротуар) и с контролем через зеркала."
      ]
    },
    {
      id: "slopes-loading-disability",
      kind: "list",
      titleRu: "Уклон, carga y descarga (погрузка/разгрузка) и franquicia (льгота)",
      sourceTextEs:
        "Estacionamiento en vías con pendiente... Carga y descarga... Franquicia para personas con discapacidad.",
      itemsRu: [
        "На уклоне нужно заглушить двигатель и поставить стояночный тормоз.",
        "На подъеме повернуть колеса к центру проезжей части и оставить первую передачу или режим parking (парковки) для автоматической коробки.",
        "На спуске повернуть колеса к бордюру и оставить заднюю передачу или режим parking (парковки).",
        "Грузовые автомобили дополнительно используют cuñas (клинья) или calzas (противооткатные упоры) и после использования убирают их с общественной дороги.",
        "Carga y descarga (погрузка и разгрузка) выполняется с включенными balizas (аварийными огнями), строго в местах и в часы, которые устанавливают правила парковки, если специальные сектора не указывают другое.",
        "Cajones azules (синие грузовые карманы) обозначены синей или сине-белой линией и предназначены только для погрузки/разгрузки. Максимум - 30 минут, если знак не указывает другое; частные автомобили там не паркуются.",
        "Símbolo Internacional de Acceso (международный символ доступности) идентифицирует любой автомобиль, перевозящий человека с инвалидностью. В CABA franquicia (льгота) позволяет парковаться у обеих aceras (тротуаров/бордюров) улиц и avenidas (проспектов) в общем случае, но не отменяет специальные запреты и не разрешает мешать движению или безопасности."
      ]
    },
    {
      id: "chapter-closing",
      kind: "quote",
      sourceTextEs:
        "Mejorar la formación teórica y práctica de quienes conducen ayuda a construir hábitos seguros.",
      textRu:
        "Улучшение теоретической и практической подготовки водителей помогает формировать безопасные привычки."
    }
  ]
};
