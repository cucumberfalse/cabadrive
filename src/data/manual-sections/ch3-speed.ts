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
      "Speed tables and distance diagrams are preserved as x5 source-reference evidence; runtime limits and exceptions are rendered as selectable Russian text and lists.",
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
        "Время реакции - интервал между восприятием стимула и действием. Оно зависит от психофизического состояния водителя; среднее значение в источнике - примерно 1 секунда.",
        "Дистанция безопасности - минимальное разумное расстояние до впереди идущего транспорта, которое дает запас реакции. В общем случае закон указывает минимум 2 секунды.",
        "Дистанция реакции - путь, пройденный за время реакции. Она растет при большем времени реакции и/или большей скорости.",
        "Тормозной путь - расстояние от нажатия на тормоз до полной остановки. На него влияют скорость, состояние шин, подвески и тормозов, груз, состояние покрытия и погода.",
        "Дистанция остановки - сумма дистанции реакции и тормозного пути."
      ]
    },
    {
      id: "max-speed-caba-light-vehicles",
      kind: "list",
      titleRu: "Максимальные скорости в CABA для транспорта до 3500 кг",
      sourceTextEs:
        "Velocidades máximas en CABA. Vehículos hasta 3500 kg de peso.",
      itemsRu: [
        "Пешеходные улицы, vías de convivencia и похожие зоны - 20 км/ч, если специальная сигнализация не устанавливает меньший предел.",
        "Улицы - 40 км/ч.",
        "Avenidas - 60 км/ч.",
        "Autopistas и vías rápidas в CABA - 100 км/ч, с учетом специальных ограничений и знаков.",
        "На отдельных avenidas источник показывает исключения: 40, 60, 70, 80 и 100 км/ч в зависимости от конкретного участка и центральной проезжей части."
      ]
    },
    {
      id: "max-speed-heavy-passenger",
      kind: "list",
      titleRu: "Особые максимумы для пассажирского и грузового транспорта более 3500 кг",
      sourceTextEs:
        "Velocidades máximas especiales en CABA para transporte de pasajeros/as y de carga de más de 3500 kg.",
      itemsRu: [
        "Calles - 30 км/ч.",
        "Avenidas - 40 км/ч.",
        "Autopistas и otras vías rápidas en CABA - 60 км/ч.",
        "Для некоторых видов транспорта и участков источник показывает дополнительные специальные пределы 45, 50 и 60 км/ч; водитель должен соблюдать конкретный знак и категорию транспортного средства."
      ]
    },
    {
      id: "outside-caba-minimums",
      kind: "list",
      titleRu: "За пределами CABA и минимальная скорость",
      sourceTextEs:
        "Velocidades máximas fuera de CABA... Velocidades mínimas... Los límites mínimos de velocidad se establecen a la mitad de los límites máximos.",
      itemsRu: [
        "За пределами CABA лимиты зависят от типа дороги и транспортного средства согласно Ley Nacional de Tránsito N° 24.449.",
        "Слишком медленное движение тоже может вызвать дорожный инцидент.",
        "Минимальные лимиты обычно устанавливаются как половина соответствующих максимальных лимитов для данного типа артерии.",
        "Специальные минимумы нужно соблюдать там, где они обозначены."
      ]
    },
    {
      id: "precautionary-speed",
      kind: "list",
      titleRu: "Precautoria: скорость по обстоятельствам",
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
