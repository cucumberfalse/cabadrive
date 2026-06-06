import type { ManualGuideSectionContent } from "../manualGuide";

export const ch3AdverseConditionsSection: ManualGuideSectionContent = {
  id: "ch3-adverse-conditions-content",
  sectionId: "ch3-adverse-conditions",
  titleRu: "Вождение в неблагоприятных условиях",
  sourcePages: [79, 80, 81, 82],
  sourceTitleEs: "Conduccion en condiciones adversas",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch3-adverse-conditions/page-079-adverse-source-crop.jpg",
      "content/validation/manual-guide/ch3-adverse-conditions/page-080-adverse-source-crop.jpg",
      "content/validation/manual-guide/ch3-adverse-conditions/page-081-adverse-source-crop.jpg",
      "content/validation/manual-guide/ch3-adverse-conditions/page-082-adverse-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch3-adverse-conditions/ch3-adverse-conditions-desktop.png",
      "content/validation/manual-guide/ch3-adverse-conditions/ch3-adverse-conditions-mobile.png"
    ],
    notes: [
      "Source PDF pages 79-82 are converted as the Chapter 3 adverse-conditions section.",
      "Weather diagrams with Spanish labels are x5 reference evidence only; runtime explanation is selectable Russian DOM text.",
      "No photo, road marking, or infographic is cleaned, translated, masked, or redrawn."
    ]
  },
  blocks: [
    {
      id: "adverse-lead",
      kind: "lead",
      sourceTextEs:
        "Las condiciones climáticas varían y por ello se debe tener la preparación suficiente...",
      textRu:
        "Погодные условия меняются, поэтому водитель должен быть готов к туману, дождю, ветру, снегу и жаре. В каждой ситуации главный принцип один: снизить риск до того, как ухудшение видимости или сцепления станет критическим."
    },
    {
      id: "fog",
      kind: "list",
      titleRu: "Туман",
      sourceTextEs: "Conducción en situaciones adversas. Niebla.",
      itemsRu: [
        "Снижать скорость и увеличивать дистанцию, потому что видимость и время на реакцию резко уменьшаются.",
        "Использовать соответствующие огни; дальний свет в тумане может ухудшить видимость из-за отражения.",
        "Не останавливаться на проезжей части, если этого можно избежать; при необходимости остановки сделать автомобиль максимально заметным."
      ]
    },
    {
      id: "rain",
      kind: "list",
      titleRu: "Дождь",
      sourceTextEs: "Lluvia.",
      itemsRu: [
        "Снижать скорость, избегать резких маневров и держать большую дистанцию.",
        "Включать ближний свет и использовать стеклоочистители и обдув, чтобы сохранять обзор.",
        "Следить за состоянием шин: рисунок протектора и давление напрямую влияют на сцепление.",
        "Опасность aquaplaning возникает, когда слой воды отделяет шину от покрытия; в такой ситуации нельзя резко тормозить или дергать рулем.",
        "Состояние покрытия, лужи, масляная пленка и плохой дренаж увеличивают тормозной путь."
      ]
    },
    {
      id: "wind",
      kind: "list",
      titleRu: "Ветер",
      sourceTextEs: "Viento.",
      itemsRu: [
        "Сильный боковой ветер может менять траекторию автомобиля, особенно на открытых участках, мостах и рядом с крупным транспортом.",
        "Нужно крепче держать рулевое колесо, снижать скорость и избегать резких перестроений.",
        "После обгона грузовика или автобуса возможен внезапный порыв, потому что защита от ветра исчезает."
      ]
    },
    {
      id: "snow",
      kind: "list",
      titleRu: "Снег",
      sourceTextEs:
        "Si bien no es una condición climatológica que se presente en CABA... al obtener una licencia nacional...",
      itemsRu: [
        "Хотя снег не характерен для CABA, национальная лицензия позволяет ездить в других регионах Аргентины, где снег бывает часто.",
        "Нужно резко снизить скорость, увеличить дистанцию и избегать резкого торможения, ускорения и поворотов.",
        "Перед поездкой важно проверить состояние шин, видимость, стеклоочистители, отопление и наличие необходимых элементов безопасности."
      ]
    },
    {
      id: "heat",
      kind: "callout",
      sourceTextEs:
        "Cuando hay altas temperaturas, dentro de un vehículo cerrado se produce un efecto invernadero... 24 grados... 50 grados en apenas 10 minutos.",
      textRu:
        "При высокой температуре в закрытом автомобиле возникает эффект теплицы. Пример для запоминания: при 24 градусах снаружи внутри автомобиля может стать 50 градусов примерно за 10 минут."
    }
  ]
};
