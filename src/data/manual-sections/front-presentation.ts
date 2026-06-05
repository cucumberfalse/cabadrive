import type { ManualGuideSectionContent } from "../manualGuide";

export const frontPresentationSection: ManualGuideSectionContent = {
  id: "front-presentation-content",
  sectionId: "front-presentation",
  titleRu: "Презентация",
  sourcePages: [2],
  sourceTitleEs: "Presentacion",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-front-matter"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/front-presentation/page-002-presentation-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/front-presentation/front-presentation-desktop.png",
      "content/validation/manual-guide/front-presentation/front-presentation-mobile.png"
    ],
    notes: [
      "Front-matter presentation is implemented as selectable Russian DOM text.",
      "No front-matter source image is used at runtime; x5 source render is validation evidence only.",
      "The section preserves the source goal: responsible, respectful driving and shared road safety."
    ]
  },
  blocks: [
    {
      id: "presentation-purpose",
      kind: "lead",
      sourceTextEs:
        "Este manual fue diseñado con una perspectiva facilitadora del proceso formativo para la ciudadanía próxima a obtener la licencia de conducir, promoviendo el ejercicio de la movilidad como derecho universal.",
      textRu:
        "Это руководство задумано как учебный материал для людей, которые готовятся получить водительское удостоверение. Его рамка важна для экзамена: мобильность рассматривается как общее право, а водитель обязан пользоваться дорогой ответственно и уважительно."
    },
    {
      id: "presentation-road-safety",
      kind: "paragraph",
      sourceTextEs:
        "Mejorar la seguridad vial implica un trabajo colectivo de toda la sociedad.",
      textRu:
        "Повышение дорожной безопасности источник описывает как совместную работу всего общества: безопасное поведение продвигает государство, но соблюдать его должны все, кто передвигается по городу."
    },
    {
      id: "presentation-learning-frame",
      kind: "list",
      titleRu: "Что забрать из вступления для учебы",
      sourceTextEs:
        "saber algunos datos estadísticos... incorporar actitudes que promuevan la concientización y sensibilización necesaria para conducir vehículos de manera responsable y respetuosa",
      itemsRu: [
        "Статистика нужна не ради цифр: она помогает понять масштаб дорожной проблемы и почему экзамен спрашивает про безопасные привычки.",
        "Правильный ответ в билетах часто строится вокруг осознанности, уважения и снижения риска для всех участников движения.",
        "Общественная дорога в источнике названа пространством совместной жизни; поэтому водитель должен думать не только о своем маневре, но и о безопасности окружающих."
      ]
    }
  ]
};
