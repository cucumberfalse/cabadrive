import type { ManualGuideSectionContent } from "../manualGuide";

export const app2DrivingFactorsSection: ManualGuideSectionContent = {
  id: "app2-driving-factors-content",
  sectionId: "app2-driving-factors",
  titleRu: "Факторы, влияющие на профессиональное вождение",
  sourcePages: [137, 138, 139, 140, 141, 142, 143],
  sourceTitleEs: "Factores que intervienen en la conduccion",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-legal-detail"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/app2-driving-factors/page-137-driving-factors-source-crop.jpg",
      "content/validation/manual-guide/app2-driving-factors/page-138-driving-factors-source-crop.jpg",
      "content/validation/manual-guide/app2-driving-factors/page-139-driving-factors-source-crop.jpg",
      "content/validation/manual-guide/app2-driving-factors/page-140-driving-factors-source-crop.jpg",
      "content/validation/manual-guide/app2-driving-factors/page-141-driving-factors-source-crop.jpg",
      "content/validation/manual-guide/app2-driving-factors/page-142-driving-factors-source-crop.jpg",
      "content/validation/manual-guide/app2-driving-factors/page-143-driving-factors-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app2-driving-factors/app2-driving-factors-desktop.png",
      "content/validation/manual-guide/app2-driving-factors/app2-driving-factors-mobile.png"
    ],
    notes: [
      "Pages 137-143 are implemented as selectable Russian DOM text with passenger-service duties preserved.",
      "No source visual pixels are used at runtime or altered."
    ]
  },
  blocks: [
    {
      id: "overconfidence-fatigue",
      kind: "lead",
      sourceTextEs:
        "El exceso de confianza, sumado a extensas jornadas laborales, requiere una conduccion preventiva.",
      textRu:
        "Повторяя один и тот же маршрут каждый день, профессиональный водитель может почувствовать, что все под контролем. Источник предупреждает: дорожные ситуации не одинаковы, а излишняя уверенность вместе с длинной сменой требует предупредительного вождения."
    },
    {
      id: "professional-tasks",
      kind: "list",
      titleRu: "Постоянные задачи водителя",
      sourceTextEs:
        "La conduccion incluye interactuar con pasajeros, regular tiempos de viaje, velar por seguridad integral, calcular distancias y mantener higiene.",
      itemsRu: [
        "Взаимодействовать с пассажирами.",
        "Регулировать время поездки.",
        "Заботиться о комплексной безопасности.",
        "Рассчитывать дистанции.",
        "Поддерживать чистоту.",
        "Постоянно принимать решения о маневрах, что создает значимый источник стресса и усталости."
      ]
    },
    {
      id: "rest-stops",
      kind: "list",
      titleRu: "Остановки отдыха",
      sourceTextEs:
        "Paradas de descanso permiten recuperar atencion, resolver tareas y hacer ejercicios de elongacion.",
      itemsRu: [
        "Остановки отдыха нужно планировать так, чтобы умственное внимание восстанавливалось в краткосрочной перспективе, а организм сохранялся в долгосрочной.",
        "Некоторые остановки можно использовать для других задач, чтобы не думать о них во время управления.",
        "Растяжка помогает предотвращать мышечные боли и улучшает кровоснабжение, особенно в нижних конечностях.",
        "Источник рекомендует упражнения для ног, стоп, шеи, рук, спины и обычную ходьбу во время остановок."
      ]
    },
    {
      id: "food-posture-health",
      kind: "list",
      titleRu: "Питание, поза и здоровье",
      sourceTextEs:
        "No manipular ni ingerir alimentos mientras se opera el vehiculo; buena postura reduce lesiones; mala alimentacion, sedentarismo y poco descanso afectan la conduccion.",
      itemsRu: [
        "При управлении транспортом нельзя обрабатывать или есть пищу: это отвлекает и может привести к инциденту.",
        "Водителям автобусов запрещено покидать место управления во время оказания услуги, поэтому рабочий день нужно планировать заранее.",
        "Долгое пребывание в одной позе может приводить к мышечным и суставным травмам; хорошая поза снижает риск травм и повышает безопасность при инциденте.",
        "Нужно учитывать вид и количество пищи: пищеварение может вызывать сонливость, особенно ночью или после нескольких часов управления.",
        "Рекомендации источника: здоровый завтрак, меньше сахара, меньше жирной и переработанной еды, больше фруктов, овощей, бобовых, цельных злаков и орехов, разнообразное питание, не переедать, пить воду и заниматься физической активностью.",
        "Сидячий образ жизни, плохое питание и недостаток отдыха могут вести к сердечно-сосудистым болезням, мочевому недержанию, одышке, апноэ, диабету, ожирению, головокружениям, аритмиям, сердечной недостаточности, проблемам пищеварения и дефициту витамина D."
      ]
    },
    {
      id: "passenger-accessibility",
      kind: "list",
      titleRu: "Взаимодействие с пассажирами и доступность",
      sourceTextEs:
        "Hablar directamente a personas con discapacidad; para discapacidad auditiva hablar de frente y despacio; para discapacidad intelectual hablar con sencillez sin infantilizar.",
      itemsRu: [
        "Пассажирский транспорт требует ответственности за людей, которых перевозят, и за качество самой поездки.",
        "С людьми с инвалидностью важно пытаться поставить себя на их место и при необходимости спросить, как помочь.",
        "Говорить нужно напрямую с человеком, а не с сопровождающими.",
        "Если человеку трудно выражаться, нужно терпение и время.",
        "С человеком с нарушением слуха лучше говорить лицом к лицу, медленно и с понятными жестами без преувеличения.",
        "С человеком с интеллектуальной инвалидностью источник советует говорить просто, но не инфантилизировать разговор; если не поняли, сказать то же другими словами."
      ]
    },
    {
      id: "taxi-rules",
      kind: "list",
      titleRu: "Такси",
      sourceTextEs:
        "Taxi: responsable por normativa; no detener en lugares prohibidos; puede negar servicio por inconducta, higiene o equipaje; camino mas corto salvo indicacion; perros guia sin adicional; sillas de ruedas obligatorias.",
      itemsRu: [
        "Водитель отвечает за действия по нормам Кодекса дорожного движения и транспорта CABA, даже если пассажир просит ехать быстрее или остановиться где угодно.",
        "Остановка для посадки и высадки не выполняется в запрещенных местах.",
        "В услуге можно отказать из-за очевидного недостойного поведения пассажира, отсутствия гигиены или багажа, который может причинить вред.",
        "Маршрут выбирается по кратчайшему пути, если пассажир не указывает другой.",
        "Поездка с домашним животным не обязательна, кроме собак-проводников для людей с инвалидностью; доплата за такую услугу запрещена.",
        "Животные не должны ехать свободно: их перевозят на задних сиденьях со шлейкой или удерживающей системой.",
        "Обязательно перевозить инвалидные кресла и другие средства передвижения без доплаты и помогать людям с инвалидностью или ограниченной мобильностью при посадке и высадке.",
        "Аудиосистема и кондиционер используются по предварительной договоренности с пассажирами; курение запрещено и для водителя, и для пассажира."
      ]
    },
    {
      id: "bus-rules",
      kind: "list",
      titleRu: "Автобусы",
      sourceTextEs:
        "Colectivos: no detener fuera de paradas salvo discapacidad, lluvia o noche de 22 a 6; paradas paralelas a vereda; menores de 12 no en primeros asientos; SUBE averiada deja pasar.",
      itemsRu: [
        "Автобус не должен останавливаться вне разрешенных остановок, кроме пассажиров с инвалидностью, дождливых дней или ночного времени с 22:00 до 6:00 по просьбе пользователей.",
        "Остановка выполняется параллельно тротуару и рядом с ним, чтобы не мешать движению и не провоцировать обгон справа мотоциклами или велосипедами.",
        "Если остановки не обозначены, посадка и высадка выполняется на правой стороне перед перекрестком.",
        "Запрещено курить, высовывать руки или части тела из окон и ехать с открытыми дверями.",
        "Пожилые люди, беременные и люди с ограниченной мобильностью имеют приоритет на одно из двух зарезервированных мест.",
        "Люди с инвалидностью могут ехать с собакой-проводником или своим средством помощи.",
        "Дети младше 12 лет не могут сидеть на первых сиденьях.",
        "Дети младше 2 лет не занимают отдельное место и не оплачивают проезд.",
        "Если аппарат SUBE неисправен или не может списать оплату, пассажиров нужно пропустить, гарантируя выполнение услуги."
      ]
    },
    {
      id: "school-and-reduced-mobility",
      kind: "list",
      titleRu: "Школьная перевозка и люди с ограниченной мобильностью",
      sourceTextEs:
        "Transporte de escolares: acompanante habilitado si capacidad mayor a 15 plazas; no trasladar de pie; cinturones en todas las plazas; menores de 12 no adelante salvo protesis. Movilidad reducida: conductor y acompanante, primeros auxilios, anclajes, rampas o plataforma.",
      itemsRu: [
        "В школьной перевозке при вместимости больше 15 мест нужен сопровождающий, допущенный органом применения, чтобы наблюдать за детьми и помогать при посадке и высадке.",
        "Для поездок образовательных учреждений, лагерей или организаций сопровождающим может быть взрослый старше 21 года, который подтверждает ответственность за детей.",
        "Нельзя перевозить людей стоя; все места должны иметь ремни, и движение нельзя начинать, пока не подтверждено, что все пристегнуты.",
        "Детей младше 12 лет нельзя перевозить на передних сиденьях, кроме случаев специального протеза или приспособления, не позволяющего разместить их сзади.",
        "Школьный транспорт должен иметь две передние двери, по одной с каждой стороны, которые дети не могут открыть без взрослого, аварийный выход и светозвуковую индикацию открытых дверей.",
        "Перевозка людей с ограниченной мобильностью обязательно выполняется водителем и сопровождающим; сопровождающий подтверждает знания первой помощи.",
        "Нужны ремни на всех сиденьях, крепления инвалидных кресел, периметральные поручни с обеих сторон и нескользкие, легко очищаемые, огнестойкие полы без щелей.",
        "Для посадки и высадки нужна минимум одна рампа или подъемная платформа; если она ручная, помогает сопровождающий.",
        "Остановка выполняется параллельно бордюру, кроме размеченных угловых мест; если нельзя пройти с рампы на тротуар напрямую, сопровождающий помогает и следит за безопасностью."
      ]
    },
    {
      id: "conflict-and-stress",
      kind: "callout",
      sourceTextEs:
        "Comunicar normas ayuda a sortear conflictos; trato cordial; recursos contra estres: respiracion, relajacion, deporte, naturaleza, companeros y pensar en una persona querida.",
      textRu:
        "Когда пассажир просит нарушить правило, полезно спокойно объяснить требование закона: водитель не решает произвольно, а отвечает перед нормой. Вежливое обращение, дыхательные и расслабляющие техники, спорт, контакт с природой, поддержка коллег и мысль о близком человеке помогают снижать стресс."
    }
  ]
};
