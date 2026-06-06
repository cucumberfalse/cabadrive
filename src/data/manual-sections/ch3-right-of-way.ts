import type { ManualGuideSectionContent } from "../manualGuide";

export const ch3RightOfWaySection: ManualGuideSectionContent = {
  id: "ch3-right-of-way-content",
  sectionId: "ch3-right-of-way",
  titleRu: "Преимущество проезда",
  sourcePages: [64, 65, 66],
  sourceTitleEs: "Prioridad de paso",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch3-right-of-way/page-064-right-of-way-source-crop.jpg",
      "content/validation/manual-guide/ch3-right-of-way/page-065-right-of-way-source-crop.jpg",
      "content/validation/manual-guide/ch3-right-of-way/page-066-right-of-way-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch3-right-of-way/ch3-right-of-way-desktop.png",
      "content/validation/manual-guide/ch3-right-of-way/ch3-right-of-way-mobile.png"
    ],
    notes: [
      "Source PDF pages 64-66 are converted as the Chapter 3 right-of-way section.",
      "Roundabout and priority diagrams are preserved as x5 reference evidence; runtime rules are selectable Russian DOM text without redrawn source artwork.",
      "No traffic sign, road marking, photo, or infographic is modified in this section."
    ]
  },
  blocks: [
    {
      id: "traffic-light-rules",
      kind: "list",
      titleRu: "На регулируемых перекрестках",
      sourceTextEs:
        "La luz del semáforo ubicado al frente indicará la conducta a seguir: Verde... Amarillo... Rojo...",
      itemsRu: [
        "Зеленый: можно ехать, но нельзя начинать пересечение, если за перекрестком нет места для автомобиля и он перекроет поперечное движение.",
        "Перед началом движения нужно дать закончить переход или проезд тому транспортному средству или пешеходу, кто уже начал пересечение до смены сигнала.",
        "Желтый: остановиться, если пересечение еще не начато.",
        "Мигающий желтый: пересекать с осторожностью.",
        "Красный: остановиться перед пешеходным переходом или линией остановки.",
        "Мигающий красный: остановиться перед перекрестком и продолжить только при уверенности, что пересечение не создает риска."
      ]
    },
    {
      id: "uncontrolled-intersections",
      kind: "list",
      titleRu: "На нерегулируемых перекрестках равной категории",
      sourceTextEs:
        "Cuando el cruce es entre arterias de igual jerarquía, los vehículos que tienen prioridad son los que cruzan por la derecha, excepto que...",
      itemsRu: [
        "Общее правило: преимущество имеет транспортное средство, которое пересекает справа.",
        "Исключение 1: знак Pare или Ceda el Paso отменяет приоритет на перекрестке без светофора. Pare требует снизить скорость и полностью остановиться до нуля перед пешеходным переходом; Ceda el Paso требует уступить, но полная остановка обязательна только если она нужна для движения имеющих преимущество.",
        "Исключение 2: у железнодорожного переезда приоритет у транспортного средства, которое выезжает с paso a nivel.",
        "Исключение 3: на круговом движении приоритет у того, кто уже находится на круговой проезжей части; между въезжающим и выезжающим приоритет у выезжающего.",
        "Исключение 4: тот, кто справа, остановился.",
        "Исключение 5: тот, кто справа, не хочет пересекать, а поворачивает, чтобы въехать на артерию.",
        "Если одновременно действует несколько исключений, приоритет определяется в этом порядке."
      ]
    },
    {
      id: "artery-hierarchy",
      kind: "callout",
      sourceTextEs:
        "Cuando el cruce es entre arterias de distintas categorías... AVENIDA, CALLE, PASAJE.",
      textRu:
        "Если пересекаются дороги разных категорий, преимущество у транспорта на более важной артерии. Иерархия такая: avenida выше calle, calle выше pasaje."
    },
    {
      id: "other-priority-situations",
      kind: "list",
      titleRu: "Другие ситуации преимущества",
      sourceTextEs:
        "En otras situaciones de prioridad de paso... Vehículo estacionado o detenido... En una pendiente... Mano obstruida... Vía de tierra y pavimentada... Prioridad colectivos.",
      itemsRu: [
        "Автомобиль, который стоял или был остановлен и хочет вернуться в поток, имеет приоритет только если движение по какой-то причине прервано.",
        "На уклоне, где ширина дороги не позволяет двум транспортным средствам двигаться одновременно, приоритет у поднимающегося. Исключение: спускающийся сочлененный транспорт, например грузовик с прицепом или автомобиль с trailer. Для спуска рекомендуется низкая передача, первая или вторая.",
        "Если полоса водителя впереди заблокирована, он должен уступить встречному транспорту.",
        "Между грунтовой и асфальтированной дорогой приоритет у того, кто движется по асфальтированной.",
        "Нужно облегчать возвращение colectivos в поток после остановки на соответствующей parada.",
        "Обгоняя остановившийся colectivo, нужно ожидать, что пешеходы могли быть скрыты за ним и могут начать переходить перед ним или за ним."
      ]
    }
  ]
};
