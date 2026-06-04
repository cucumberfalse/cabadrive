import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch5-equal-society";

export const ch5EqualSocietySection: ManualGuideSectionContent = {
  id: "ch5-equal-society-content",
  sectionId: "ch5-equal-society",
  titleRu: "К равноправному обществу",
  sourcePages: [99, 100],
  sourceTitleEs: "Hacia una sociedad igualitaria",
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
      "content/validation/manual-guide/ch5-equal-society/page-099-equal-society-source-crop.jpg",
      "content/validation/manual-guide/ch5-equal-society/page-100-equal-society-source-crop.jpg",
      "content/validation/manual-guide/ch5-equal-society/page-100-mobility-context-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch5-equal-society/ch5-equal-society-desktop.png",
      "content/validation/manual-guide/ch5-equal-society/ch5-equal-society-mobile.png"
    ],
    notes: [
      "The section begins on shared source page 99 at Hacia una sociedad igualitaria and continues through the equality content on source page 100 before the gender-violence support heading.",
      "The page 100 mobility-context infographic is transferred from an x5 crop with Spanish glyph cleanup and selectable Russian overlay labels; source pictograms and numeric values remain source-derived.",
      "No source photo, traffic sign, or road marking is modified."
    ]
  },
  blocks: [
    {
      id: "cities-planned-for-men",
      kind: "lead",
      sourceTextEs:
        "Las ciudades fueron tradicionalmente pensadas, construidas y habitadas en función de las necesidades y roles sociales asignados a los varones.",
      textRu:
        "Источник объясняет, что города традиционно проектировались, строились и использовались вокруг потребностей и социальных ролей, назначенных мужчинам. Женщины, дети, пожилые люди и люди с ограниченной мобильностью долго не учитывались как полноценные участники при планировании общественного пространства и транспорта."
    },
    {
      id: "urban-debate-and-commitment",
      kind: "list",
      titleRu: "Что меняется в подходе к городу",
      sourceTextEs:
        "En los últimos años se generaron debates... teniendo en cuenta género, edad, salud y condición socioeconómica.",
      itemsRu: [
        "Во всем мире обсуждают, как строить городские пространства с учетом пола, возраста, здоровья и социально-экономического положения жителей.",
        "Приверженность гендерному равенству источник называет историческим процессом для Аргентины и мира.",
        "Эти изменения касаются публичной и частной жизни: семейных и эмоциональных связей, труда, политики и общественного пространства."
      ]
    },
    {
      id: "mobility-patterns",
      kind: "list",
      titleRu: "Особенности мобильности, описанные источником",
      sourceTextEs:
        "Mayor cantidad de viajes, aunque más cortos... patrones de movilidad dispersos y no lineales... tareas de cuidado sólo representan el 13% de los viajes que realizan los varones.",
      itemsRu: [
        "Поездок становится больше, но они короче.",
        "Одна поездка часто сочетает разные виды транспорта.",
        "Такие поездки обычно происходят не в часы пик.",
        "Маршруты получаются рассеянными и нелинейными, не как простой путь «дом - работа - дом».",
        "Задачи ухода составляют только 13% поездок, которые совершают мужчины."
      ]
    },
    {
      id: "mobility-context-source-visual",
      kind: "source-image-cards",
      titleRu: "Визуал источника: контекст мобильности в CABA",
      sourceTextEs: "Contexto de Ciudad de Buenos Aires.",
      cards: [
        {
          id: "mobility-context-transferred-card",
          titleRu: "Перенесенный визуал про поездки женщин",
          sourcePage: 100,
          sourceRegion: { x: 900, y: 1830, width: 1220, height: 175 },
          assetPath: `${assetRoot}/mobility-context-transferred-infographic.png`,
          altRu:
            "Перенесенный визуал Contexto de Ciudad de Buenos Aires с исходными пиктограммами, процентами 54, 50 и 30, и русскими подписями.",
          visibleSpanish: false,
          russianOverlayLabels: [
            { id: "public-transport-label", textRu: "общественный транспорт", xPct: 45.5, yPct: 10.5, widthPct: 25, heightPct: 23, tone: "dark-on-light" },
            { id: "work-study-label", textRu: "работа / учеба", xPct: 50.5, yPct: 43, widthPct: 24.5, heightPct: 20, tone: "dark-on-light" },
            { id: "care-tasks-label", textRu: "задачи ухода", xPct: 50.5, yPct: 66, widthPct: 27, heightPct: 23, tone: "dark-on-light" }
          ],
          bodyRu:
            "Официальный визуал перенесен из x5-фрагмента: испанские буквы удалены на уровне отдельных глифов с восстановлением фона, без широких плашек и без перерисовки. Русские подписи наложены поверх очищенных строк как выбираемый текст. Смысл визуала: 54% ежедневных поездок женщин приходится на общественный транспорт, 50% связаны с работой или учебой, а 30% посвящены задачам ухода."
        }
      ],
      visualNotes: [
        "The page 100 infographic is a transferred source image, not a CSS/SVG redraw.",
        "Only Spanish glyph pixels were cleaned; the source map, person pictogram, public-transport icons, and numeric values remain source-derived."
      ]
    },
    {
      id: "right-to-the-city",
      kind: "callout",
      sourceTextEs:
        "El derecho de las mujeres a la Ciudad implica el derecho a vivir libremente, a disfrutar, ocupar y transformar sus espacios.",
      textRu:
        "Право женщин на город означает право жить свободно, пользоваться пространствами, занимать и преобразовывать их, создавать город и участвовать в решении того, каким он будет."
    },
    {
      id: "gender-perspective-planning",
      kind: "paragraph",
      sourceTextEs:
        "La incorporación de una perspectiva de género en el diseño y planificación de las ciudades implica visibilizar las desigualdades...",
      textRu:
        "Гендерная перспектива в дизайне и планировании города делает видимыми неравенства, которые женщины испытывают при пользовании транспортом и общественными пространствами. Поэтому источник подчеркивает необходимость равноправного и доступного города для женщин - от девочек до пожилых женщин."
    }
  ]
};
