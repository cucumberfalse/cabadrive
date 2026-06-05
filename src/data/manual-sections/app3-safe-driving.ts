import type { ManualGuideSectionContent } from "../manualGuide";

export const app3SafeDrivingSection: ManualGuideSectionContent = {
  id: "app3-safe-driving-content",
  sectionId: "app3-safe-driving",
  titleRu: "Безопасное вождение",
  sourcePages: [162, 163, 164, 165, 166, 167, 168],
  sourceTitleEs: "Conduccion segura",
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
      "content/validation/manual-guide/app3-safe-driving/page-162-safe-driving-source-crop.jpg",
      "content/validation/manual-guide/app3-safe-driving/page-163-safe-driving-source-crop.jpg",
      "content/validation/manual-guide/app3-safe-driving/page-164-safe-driving-source-crop.jpg",
      "content/validation/manual-guide/app3-safe-driving/page-165-safe-driving-source-crop.jpg",
      "content/validation/manual-guide/app3-safe-driving/page-166-safe-driving-source-crop.jpg",
      "content/validation/manual-guide/app3-safe-driving/page-167-safe-driving-source-crop.jpg",
      "content/validation/manual-guide/app3-safe-driving/page-168-safe-driving-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app3-safe-driving/app3-safe-driving-desktop.png",
      "content/validation/manual-guide/app3-safe-driving/app3-safe-driving-mobile.png"
    ],
    notes: [
      "Pages 162-168 are implemented as selectable Russian DOM text.",
      "Source truck/road imagery and the Paseo del Bajo source photo remain unchanged in x5 evidence and are not translated, retouched, or redrawn."
    ]
  },
  blocks: [
    {
      id: "drive-within-limits",
      kind: "lead",
      sourceTextEs:
        "La conduccion al limite siempre tiene consecuencias negativas; reconocimiento de limites personales, del vehiculo y el entorno es fundamental.",
      textRu:
        "Безопасное управление грузовым транспортом требует признавать личные пределы, пределы транспортного средства и окружающей среды. Езда на пределе всегда имеет негативные последствия."
    },
    {
      id: "unsafe-limit-actions",
      kind: "list",
      titleRu: "Что относится к управлению на пределе",
      sourceTextEs:
        "Velocidad excesiva, continuar onda verde, sobrepasos arriesgados, pasar cerca, zigzaguear, velocidades inadecuadas, disputa agresiva por espacio, cruzar en amarillo.",
      itemsRu: [
        "Слишком высокая скорость или попытка успеть на зеленую волну, которая прерывается.",
        "Рискованные обгоны и движение слишком близко к другим транспортным средствам.",
        "Зигзаги, неподходящая скорость и агрессивная борьба за дорожное пространство.",
        "Проезд на желтый сигнал.",
        "Такие действия повышают стресс, ухудшают физическое и психическое здоровье и увеличивают риск заболеваний."
      ]
    },
    {
      id: "slopes-curves",
      kind: "callout",
      sourceTextEs:
        "Pendientes y curvas bloquean vision y pueden mover vehiculos mas lenta o rapidamente que lo seguro; debe conducirse lo suficientemente lento para detenerse.",
      textRu:
        "На спусках, подъемах и крутых поворотах обзор вперед ограничен, а скорость транспортного средства может стать небезопасной. Нужно ехать настолько медленно, чтобы можно было остановиться, потому что водитель не знает, что находится с другой стороны."
    },
    {
      id: "vulnerable-users",
      kind: "list",
      titleRu: "Уязвимые участники и крупный транспорт",
      sourceTextEs:
        "Peatones, ciclistas y motociclistas son vulnerables; vehiculos de gran porte son pesados, requieren mayor espacio y pueden encerrar otros vehiculos.",
      itemsRu: [
        "Пешеходы, велосипедисты и мотоциклисты не защищены кузовом, ремнем безопасности или подушками безопасности.",
        "Профессиональные водители не относятся к уязвимой группе, но имеют высокое участие в инцидентах с погибшими пешеходами или мотоциклистами.",
        "Крупногабаритный транспорт тяжелее и требует больше места для движения и маневров.",
        "Резкий поворот руля может внезапно превратить грузовик в большое препятствие для других участников движения, а восстановить траекторию сложнее и дольше."
      ]
    },
    {
      id: "cyclists-motorcyclists-offtracking",
      kind: "list",
      titleRu: "Велосипедисты, мотоциклисты и off-tracking",
      sourceTextEs:
        "Mantener distancia de seguridad de 1,5 metros respecto de ciclistas; en giros de camiones/colectivos hay off tracking; ruedas traseras siguen arco de menor radio.",
      itemsRu: [
        "Рядом с велосипедистом нужно сохранять безопасную дистанцию 1,5 m.",
        "Для грузовика или автобуса повороты опаснее из-за off-tracking: задние колеса идут по дуге меньшего радиуса, чем передние.",
        "При таком маневре задняя часть может задеть велосипедиста, пешехода или мотоцикл рядом с задними колесами.",
        "Перед поворотом на перекрестке нужно смотреть в обе стороны, особенно там, где есть пересечение велодорожек или велосипедных полос.",
        "С мотоциклистами нужно держать разумную дистанцию с учетом радиуса поворота, воздушных потоков от кузова и увеличенной площади слепых зон."
      ]
    },
    {
      id: "stopping-loading-and-speed",
      kind: "list",
      titleRu: "Остановки, груз и скорость",
      sourceTextEs:
        "Estacionar o detener en lugares prohibidos implica riesgo; carga no debe obstaculizar paso o visibilidad; carga y descarga debe respetar lugares y horarios; exceso de velocidad es comportamiento agresivo.",
      itemsRu: [
        "Остановка или стоянка в запрещенных местах даже на короткое время всегда создает риск, особенно для уязвимых людей.",
        "Груз нельзя размещать на дороге так, чтобы он мешал проходу или видимости других участников движения; запрещено оставлять товары, мебель или предметы на проезжей части.",
        "Погрузка и разгрузка должны выполняться строго в местах и в часы, установленные правилами стоянки, кроме зон с отдельной разметкой или знаками.",
        "Перед въездом к перекрестку в часы интенсивного движения нужно убедиться, что есть место полностью пересечь проезжую часть, включая следующий пешеходный переход.",
        "Превышение скорости - форма агрессивного поведения; в крупном транспорте риск смертельного исхода возрастает с размером транспортного средства."
      ]
    },
    {
      id: "lane-use",
      kind: "list",
      titleRu: "Движение по полосам",
      sourceTextEs:
        "En autopistas y vias rapidas, vehiculos de carga circulan unicamente por carril derecho excepto sobrepaso; en arterias de mas de dos carriles por mano usan segundo y tercer carril adyacentes a acera derecha.",
      itemsRu: [
        "На автомагистралях и других скоростных дорогах грузовой транспорт должен двигаться только по правой полосе, кроме обгона.",
        "На дорогах с более чем двумя полосами в одном направлении, кроме автомагистралей и скоростных дорог, грузовики, дома на колесах и транспорт с прицепами или полуприцепами должны двигаться по второй и третьей полосам, прилегающим к правому краю.",
        "Покинуть эти полосы можно заблаговременно только для обгона или для выезда с дороги.",
        "На иных дорогах без специальных знаков или линий все транспортные средства должны двигаться по правой части проезжей части, соблюдая исключительные или предпочтительные полосы и их часы.",
        "Левые полосы предназначены для обгона более медленных транспортных средств с соблюдением разрешенной максимальной скорости."
      ]
    },
    {
      id: "heavy-traffic-network",
      kind: "list",
      titleRu: "Red de transito pesado и Paseo del Bajo",
      sourceTextEs:
        "Red de transito pesado permite vehiculos de peso total bruto superior a 12 toneladas; comprende 205 km, 95 calles y avenidas, 39 barrios; Paseo del Bajo es corredor preferencial para transito pesado y omnibus larga distancia, 60 km/h.",
      itemsRu: [
        "Red de transito pesado - сеть улиц и проспектов, по которым могут двигаться транспортные средства с полной массой более 12 t.",
        "Сеть включает 205 km, 95 улиц и проспектов и 39 из 48 районов города; больше всего километров приходится на Комуну 4 - 35,5 km, а по районам на Barracas - 20,9 km.",
        "Самая длинная артерия сети - Avenida Juan B. Justo, 12,0 km.",
        "Paseo del Bajo - первый предпочтительный коридор для тяжелого транспорта: грузовиков и прицепов с индивидуальной массой 12 t или больше, а также междугородних пассажирских автобусов больше чем на 19 мест, допущенных к туризму, с пассажирами или без них.",
        "Коридор соединяет Autopista Illia с Autopista Buenos Aires-La Plata и Autopista 25 de Mayo, разделяя этот поток с пешеходами, частными автомобилями и городскими автобусами по разным уровням.",
        "Максимальная скорость на разных уровнях Paseo del Bajo - 60 km/h."
      ]
    },
    {
      id: "paseo-rules",
      kind: "list",
      titleRu: "Правила Paseo del Bajo",
      sourceTextEs:
        "Prohibida circulacion de vehiculos no permitidos; prohibido estacionamiento y detencion 24 horas; aviso a AUSA por inconvenientes, emergencias, sustancias peligrosas, cargas excepcionales e indivisibles.",
      itemsRu: [
        "Велосипеды, мотоциклы, автомобили, такси, remises, городские автобусные линии и любой неразрешенный транспорт там запрещены.",
        "Стоянка и остановка запрещены 24 часа на обеих проезжих частях.",
        "Если транспорт не может продолжить нормальное движение, нужно уведомить AUSA, которая организует буксировку и удаление.",
        "Экстренные транспортные средства и автомобили сопровождения тяжелого транспорта могут двигаться исключительным образом при обязательном предварительном уведомлении Autopistas Urbanas S.A.",
        "Транспорт с опасными веществами должен предварительно уведомить Autopistas Urbanas S.A.",
        "Исключительные и неделимые грузы со специальными габаритами должны заранее оформить разрешение у компетентного органа."
      ]
    }
  ]
};
