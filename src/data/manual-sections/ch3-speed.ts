import type { ManualGuideSectionContent } from "../manualGuide";

export const ch3SpeedSection: ManualGuideSectionContent = {
  id: "ch3-speed-content",
  sectionId: "ch3-speed",
  titleRu: "Скорость",
  sourcePages: [69, 70, 71, 72, 73, 74],
  sourceTitleEs: "Velocidad",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch3-speed/page-069-speed-source-crop.jpg",
      "content/validation/manual-guide/ch3-speed/page-070-speed-source-crop.jpg",
      "content/validation/manual-guide/ch3-speed/page-071-speed-source-crop.jpg",
      "content/validation/manual-guide/ch3-speed/page-072-speed-source-crop.jpg",
      "content/validation/manual-guide/ch3-speed/page-073-speed-source-crop.jpg",
      "content/validation/manual-guide/ch3-speed/page-074-speed-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch3-speed/ch3-speed-desktop.png",
      "content/validation/manual-guide/ch3-speed/ch3-speed-mobile.png"
    ],
    notes: [
      "Source PDF pages 69-74 are converted as the Chapter 3 speed section.",
      "Speed tables and distance diagrams are preserved as x5 source-reference evidence; runtime limits and exceptions are rendered as selectable Russian table/list blocks.",
      "No source infographic is redrawn, relabeled, or masked in runtime."
    ]
  },
  blocks: [
    {
      id: "speed-definition",
      kind: "lead",
      sourceTextEs:
        "Velocidad es una relación distancia/tiempo... suele expresarse en kilómetros por hora.",
      textRu:
        "Скорость - это отношение расстояния ко времени, обычно в километрах в час. Понимание пройденной дистанции за конкретное время дает водителю запас для маневра при неожиданной ситуации."
    },
    {
      id: "speed-risk",
      kind: "callout",
      sourceTextEs:
        "El exceso de velocidad es un factor esencial en la producción de incidentes... A mayor velocidad, menor campo de visión.",
      textRu:
        "Превышение скорости - один из ключевых факторов дорожных инцидентов и тяжелых последствий. Чем выше скорость, тем экспоненциально выше вероятность смерти или тяжелых травм, а поле зрения сужается вплоть до эффекта туннеля."
    },
    {
      id: "reaction-and-stopping",
      kind: "list",
      titleRu: "Реакция, торможение и остановка",
      sourceTextEs:
        "Tiempo de reacción... Distancia de seguridad... Distancia de reacción... Distancia de frenado... Distancia de detención.",
      itemsRu: [
        "Время реакции - интервал между восприятием стимула и действием. Оно зависит от психофизического состояния водителя; среднее учебное значение - примерно 1 секунда.",
        "Дистанция безопасности - минимальное разумное расстояние до впереди идущего транспорта, которое дает запас реакции. В общем случае закон указывает минимум 2 секунды.",
        "Дистанция реакции - путь, пройденный за время реакции. Она растет при большем времени реакции и/или большей скорости.",
        "Тормозной путь - расстояние от нажатия на тормоз до полной остановки. На него влияют скорость, состояние шин, подвески и тормозов, груз, состояние покрытия и погода.",
        "Дистанция остановки - сумма дистанции реакции и тормозного пути."
      ]
    },
    {
      id: "max-speed-caba-light-vehicles",
      kind: "table",
      titleRu: "Максимальные скорости в CABA для транспорта до 3500 кг",
      sourceTextEs:
        "Velocidades máximas en CABA. Vehículos hasta 3500 kg de peso.",
      columnsRu: ["Вид дороги / зона", "Максимум", "Как читать правило"],
      rows: [
        {
          id: "caba-passages-convivencia",
          cellsRu: [
            "Пассажи и улицы совместного пользования",
            "20 км/ч",
            "низкоскоростная совместная среда; если знак ниже, соблюдается знак"
          ]
        },
        {
          id: "caba-streets",
          cellsRu: ["Улицы", "40 км/ч", "обычная городская улица"]
        },
        {
          id: "caba-avenues",
          cellsRu: ["Проспекты", "60 км/ч", "обычный максимум для проспекта, кроме специальных участков и знаков"]
        },
        {
          id: "caba-highways-fast-roads",
          cellsRu: ["Автомагистрали CABA", "100 км/ч", "для автомагистралей CABA; скоростные дороги и знаки могут уточнять предел"]
        }
      ],
      captionRu:
        "Нормативные скорости могут изменяться на отдельных tramos (участках) по соображениям безопасности, и водитель узнает это через señales viales (дорожные знаки)."
    },
    {
      id: "caba-avenue-exception-speed-table",
      kind: "table",
      titleRu: "Исключения на некоторых проспектах и скоростных дорогах CABA",
      sourceTextEs:
        "Excepciones en algunas avenidas: 40, 60, 70, 80 y 100 km/h según arteria o tramo.",
      columnsRu: ["Максимум", "Именованные участки", "Экзаменационная логика"],
      rows: [
        {
          id: "exception-40-corrientes",
          cellsRu: [
            "40 км/ч",
            "Av. Corrientes, участок между улицами Junín и Libertad",
            "не отвечать автоматически 60 км/ч только потому, что это проспект"
          ]
        },
        {
          id: "exception-60-general-paz-heavy",
          cellsRu: [
            "60 км/ч",
            "Av. Gral. Paz на calzadas para tránsito pesado (проезжих частях для тяжелого транспорта), участок между Autopista Ingeniero Pascual Palazzo (Acceso Norte) и Av. del Libertador",
            "конкретный участок и знак важнее общего городского правила"
          ]
        },
        {
          id: "exception-70-avenues",
          cellsRu: [
            "70 км/ч",
            "Av. Figueroa Alcorta, Av. Del Libertador, Av. 27 de Febrero, Av. Brig. Gral. Juan Facundo Quiroga и Av. Costanera Rafael Obligado на указанных участках",
            "именованные проспекты сохраняются как отдельная категория, а не сводятся к 60"
          ]
        },
        {
          id: "exception-80-general-paz",
          cellsRu: [
            "80 км/ч",
            "Av. Gral. Paz, центральные проезжие части между Autopista Ingeniero Pascual Palazzo (Acceso Norte) и Av. 27 de Febrero",
            "соблюдать конкретный предел участка"
          ]
        },
        {
          id: "exception-100-fast-roads",
          cellsRu: [
            "100 км/ч",
            "Av. Intendente Cantilo, Av. Leopoldo Lugones, Av. Tte. Gral. Luis J. Dellepiane, Av. Gral. Paz на центральных проезжих частях между Av. Leopoldo Lugones и Autopista Ingeniero Pascual Palazzo (Acceso Norte), Autopista 25 de Mayo, Autopista Perito Moreno, Autopista Hector J. Campora, Autopista 9 de Julio Sur, Autopista Presidente Arturo U. Illia и Autopista R. Balbin (Bs.As.-La Plata)",
            "vías rápidas/autopistas CABA (скоростные дороги/автомагистрали CABA) проверяются по имени, tramo (участку) и señalización (сигнализации/знакам)"
          ]
        }
      ],
      captionRu:
        "Таблица нужна именно как исключение: водитель сверяет arteria/tramo (дорогу/участок) и знак, а не заменяет все avenidas (проспекты) одним числом."
    },
    {
      id: "max-speed-heavy-passenger",
      kind: "table",
      titleRu: "Особые максимумы для пассажирского и грузового транспорта более 3500 кг",
      sourceTextEs:
        "Velocidades máximas especiales en CABA para transporte de pasajeros/as y de carga de más de 3500 kg.",
      columnsRu: ["Транспорт / категория", "Дорога или участок", "Максимум"],
      rows: [
        {
          id: "special-machinery",
          cellsRu: ["Спецтехника", "Улицы и проспекты", "30 км/ч"]
        },
        {
          id: "special-streets-40",
          cellsRu: [
            "Грузовики, коллективный пассажирский транспорт, школьный транспорт, транспорт для людей с ограниченной мобильностью",
            "Улицы",
            "40 км/ч"
          ]
        },
        {
          id: "special-avenues-45",
          cellsRu: ["Школьный транспорт и транспорт для людей с ограниченной мобильностью", "Проспекты", "45 км/ч"]
        },
        {
          id: "special-avenues-50",
          cellsRu: ["Грузовики и коллективный пассажирский транспорт", "Проспекты", "50 км/ч"]
        },
        {
          id: "special-fast-roads-60",
          cellsRu: [
            "Грузовики, коллективный пассажирский транспорт, школьный транспорт, транспорт для людей с ограниченной мобильностью",
            "Автомагистрали и другие скоростные дороги в CABA",
            "60 км/ч"
          ]
        },
        {
          id: "special-paseo-bajo-60",
          cellsRu: ["Тяжелый транспорт и междугородние автобусы", "Paseo del Bajo", "60 км/ч"]
        }
      ],
      captionRu:
        "Эти значения сохраняют связку «категория транспортного средства + тип дороги/участок»; нельзя заменять их одной общей строкой про 30/40/60."
    },
    {
      id: "outside-caba-maximum-speed-table",
      kind: "table",
      titleRu: "Максимальные скорости вне CABA по типу дороги и транспорта",
      sourceTextEs:
        "Velocidades máximas fuera de CABA de acuerdo al tipo de vía y vehículo.",
      columnsRu: ["Транспорт / дорога", "Максимум", "Логика правила"],
      rows: [
        {
          id: "outside-urban-route",
          cellsRu: ["Все транспортные средства, маршрут через городскую зону", "60 км/ч", "городской tramo (участок) маршрута вне CABA"]
        },
        {
          id: "outside-heavy-hazardous-rv",
          cellsRu: [
            "Грузовики, транспорт опасных веществ, автомобили с жилым прицепом/домом",
            "80 км/ч",
            "национальные дороги, полуавтомагистрали и автомагистрали"
          ]
        },
        {
          id: "outside-passenger-routes-semihighways",
          cellsRu: [
            "Микроавтобусы, автобусы и моторизованные дома на колесах",
            "90 км/ч",
            "дороги и полуавтомагистрали"
          ]
        },
        {
          id: "outside-passenger-national-highways",
          cellsRu: [
            "Микроавтобусы, автобусы и моторизованные дома на колесах",
            "100 км/ч",
            "национальные автомагистрали"
          ]
        },
        {
          id: "outside-cars-motorcycles-route",
          cellsRu: ["Мотоциклы и автомобили", "110 км/ч", "дорога"]
        },
        {
          id: "outside-pickups-network",
          cellsRu: [
            "Пикапы",
            "110 км/ч",
            "дороги, полуавтомагистрали и национальные автомагистрали"
          ]
        },
        {
          id: "outside-cars-motorcycles-semihighway",
          cellsRu: ["Мотоциклы и автомобили", "120 км/ч", "полуавтомагистрали"]
        },
        {
          id: "outside-cars-motorcycles-highway",
          cellsRu: ["Мотоциклы и автомобили", "130 км/ч", "национальные автомагистрали"]
        }
      ],
      captionRu:
        "Страница 73 показывает именно комбинации типа транспорта и дороги; поэтому вне CABA число выбирается по строке таблицы, а не по одному универсальному максимуму."
    },
    {
      id: "outside-caba-minimums",
      kind: "list",
      titleRu: "Минимальная скорость",
      sourceTextEs:
        "Velocidades minimas... Los limites minimos de velocidad se establecen a la mitad de los limites maximos. Limites minimos especiales: semiautopistas y rutas 40 km/h; autopistas 60 km/h.",
      itemsRu: [
        "Слишком медленное движение тоже может вызвать дорожный инцидент.",
        "Минимальные лимиты обычно устанавливаются как половина соответствующих максимальных лимитов для данного типа артерии.",
        "Специальный минимум для semiautopistas y rutas (полуавтомагистралей и дорог) - 40 км/ч.",
        "Специальный минимум для autopistas (автомагистралей) - 60 км/ч."
      ]
    },
    {
      id: "precautionary-speed",
      kind: "list",
      titleRu: "Предосторожная скорость по обстоятельствам",
      sourceTextEs:
        "Velocidad precautoria... tener en cuenta la salud, estado del vehículo y su carga, visibilidad, condiciones de la arteria, calzada, clima y densidad del tránsito.",
      itemsRu: [
        "Скорость должна позволять полностью контролировать автомобиль, не мешать потоку и не создавать опасности себе или другим.",
        "Нужно учитывать состояние водителя, состояние автомобиля и груза, видимость, тип дороги, покрытие, погоду и плотность движения.",
        "Перед поворотом в кривую нужно замедлиться до входа в нее.",
        "Перед знаком железнодорожного переезда нужно снизить скорость и ожидать возможный поезд.",
        "Перед знаком скользкой дороги нужно снижать скорость даже если покрытие кажется нормальным.",
        "Если автомобиль случайно выехал с дороги, нужно сбросить скорость, не тормозить резко и не возвращаться резким рулением.",
        "При животных на проезжей части или обочине нужно снижать скорость, при необходимости остановиться и сообщить властям.",
        "При ямах действовать как при плохой погоде: снизить скорость и увеличить дистанцию до впереди идущего транспорта."
      ]
    }
  ]
};
