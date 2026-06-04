import type { ManualGuideSectionContent } from "../manualGuide";

export const app2SafeDrivingSection: ManualGuideSectionContent = {
  id: "app2-safe-driving-content",
  sectionId: "app2-safe-driving",
  titleRu: "Безопасное вождение пассажирского транспорта",
  sourcePages: [144, 145, 146, 147, 148],
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
      "content/validation/manual-guide/app2-safe-driving/page-144-safe-driving-source-crop.jpg",
      "content/validation/manual-guide/app2-safe-driving/page-145-safe-driving-source-crop.jpg",
      "content/validation/manual-guide/app2-safe-driving/page-146-safe-driving-source-crop.jpg",
      "content/validation/manual-guide/app2-safe-driving/page-147-safe-driving-source-crop.jpg",
      "content/validation/manual-guide/app2-safe-driving/page-148-safe-driving-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app2-safe-driving/app2-safe-driving-desktop.png",
      "content/validation/manual-guide/app2-safe-driving/app2-safe-driving-mobile.png"
    ],
    notes: [
      "Pages 144-148 are implemented as selectable Russian DOM text.",
      "No source images, photos, traffic signs, or road markings are used at runtime or altered."
    ]
  },
  blocks: [
    {
      id: "limits-and-anticipation",
      kind: "lead",
      sourceTextEs:
        "La conduccion al limite siempre tiene consecuencias negativas; reconocer limites personales, del vehiculo y del entorno es fundamental.",
      textRu:
        "Безопасное управление начинается с признания личных пределов, пределов транспортного средства и окружающей среды. При сомнении источник требует усиливать меры предосторожности и избегать риска, даже если условия кажутся безобидными."
    },
    {
      id: "bad-limit-driving",
      kind: "list",
      titleRu: "Почему нельзя ехать на пределе",
      sourceTextEs:
        "Velocidad excesiva, onda verde por interrumpirse, sobrepasos arriesgados, zigzaguear, disputa agresiva por espacio o cruzar en amarillo aumentan estres y lesiones.",
      itemsRu: [
        "Если ехать слишком быстро или пытаться успеть на зеленую волну, которая вот-вот прервется, будет трудно остановиться перед красным сигналом.",
        "Внезапное торможение может травмировать пассажиров, особенно тех, кто едет стоя.",
        "Рискованные обгоны, слишком близкое прохождение рядом с другими, зигзаги, неподходящая скорость, агрессивная борьба за пространство и проезд на желтый исключают профилактику.",
        "Такие действия повышают стресс, ухудшают физическое и психическое здоровье и увеличивают риск заболеваний.",
        "Предвидение полезно только тогда, когда водитель умеет понимать сигналы окружающей среды."
      ]
    },
    {
      id: "slopes-curves",
      kind: "callout",
      sourceTextEs:
        "Pendientes y curvas ocultan vision hacia adelante y obligan a circular mas lento o mas rapido que seguro; debe circularse lo suficientemente lento para poder detenerse.",
      textRu:
        "На подъемах, спусках и крутых поворотах обзор вперед и возможность быть увиденным ограничены. Нужно двигаться настолько медленно, чтобы можно было остановиться: водитель не знает, что находится с другой стороны."
    },
    {
      id: "vulnerable-users",
      kind: "list",
      titleRu: "Уязвимые участники движения",
      sourceTextEs:
        "Peatones, ciclistas y motociclistas son los mas expuestos; vehiculos de gran porte requieren mas espacio; distancia minima de 1,5 metros respecto de ciclistas.",
      itemsRu: [
        "Пешеходы, велосипедисты и мотоциклисты не защищены кузовом, ремнем или подушкой безопасности.",
        "Профессиональные водители не относятся к уязвимой группе, но часто участвуют в инцидентах, где погибают пешеходы или мотоциклисты.",
        "Крупногабаритные транспортные средства тяжелее и требуют больше пространства для движения и маневра.",
        "Резкий рывок рулем может превратить большой транспорт в препятствие для других участников движения; вернуть маневр назад сложнее и дольше.",
        "При движении рядом с велосипедистом нужно держать безопасную дистанцию минимум 1,5 m.",
        "Это особенно важно для автобусов и грузовиков: при повороте задняя часть может задеть велосипедиста рядом с задними колесами.",
        "Перед поворотом на перекрестке нужно смотреть в обе стороны, особенно там, где пересекаются велодорожки или велосипедные полосы.",
        "С мотоциклистами нужно держать разумную дистанцию с учетом радиуса поворота, воздушных потоков от кузова и большей площади слепой зоны."
      ]
    },
    {
      id: "off-tracking",
      kind: "callout",
      sourceTextEs:
        "Off-tracking: al girar, ruedas traseras tienen arco de menor radio que las delanteras y puede ser peligroso para personas, bicis y motos.",
      textRu:
        "Смещение траекторий колес, то есть off-tracking, особенно опасно у автобусов и грузовиков. При повороте задние колеса идут по дуге меньшего радиуса, чем передние, и боковая часть транспортного средства может неожиданно наехать на пешехода, велосипед или мотоцикл."
    },
    {
      id: "stopping-parking-speed",
      kind: "list",
      titleRu: "Остановки, перекрестки и скорость",
      sourceTextEs:
        "Estacionar o detener en lugares prohibidos implica riesgo; antes de bocacalle asegurar espacio para cruce completo; exceso de velocidad es comportamiento agresivo.",
      itemsRu: [
        "Стоянка или остановка в запрещенных местах даже на короткое время создает потенциальный риск, особенно для уязвимых людей.",
        "В часы интенсивного движения перед въездом к перекрестку нужно убедиться, что есть место полностью пересечь дорогу.",
        "В расчет входит пешеходный переход на следующем квартале.",
        "Пешеходные переходы нельзя блокировать, чтобы люди пешком не были вынуждены идти через опасные зоны.",
        "Пассажиры могут ожидать быстрый путь, но превышение скорости является агрессивным поведением.",
        "Опасность выше в крупногабаритном транспорте: чем больше размер, тем выше вероятность смертельного исхода.",
        "Нужно предлагать пассажирам больше безопасности, а не больше скорости.",
        "Разрешенная максимальная скорость не гарантирует безопасность; ехать нужно с осторожной скоростью и безопасной дистанцией."
      ]
    }
  ]
};
