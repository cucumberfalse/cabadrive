import type { ManualGuideSectionContent } from "../manualGuide";

export const ch1CitiesForPeopleSection: ManualGuideSectionContent = {
  id: "ch1-cities-for-people-content",
  sectionId: "ch1-cities-for-people",
  titleRu: "Города для людей",
  sourcePages: [22],
  sourceTitleEs: "Ciudades para las personas",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-principle-pair"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch1-cities-for-people/page-022-cities-for-people-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch1-cities-for-people/ch1-cities-for-people-desktop.png",
      "content/validation/manual-guide/ch1-cities-for-people/ch1-cities-for-people-mobile.png"
    ],
    notes: [
      "Source PDF page 22 is converted as one source-Índice website section.",
      "The source typographic relationship between fluidez and seguridad is recreated as selectable Russian DOM text.",
      "No source page raster, visible Spanish text, page marker, or divider-only page 21 content is rendered."
    ]
  },
  blocks: [
    {
      id: "shared-public-space",
      kind: "lead",
      sourceTextEs:
        "Por la Ciudad circulan peatones, ciclistas y conductores/as... Los espacios públicos son lugares de encuentro... espacios de convivencia.",
      textRu:
        "По городу одновременно движутся пешеходы, велосипедисты и водители: на мототранспорте, общественном транспорте, грузовиках, личных и арендованных автомобилях. Общественное пространство - это место встречи людей и соседей, то есть пространство совместной жизни."
    },
    {
      id: "safe-arrival",
      kind: "paragraph",
      sourceTextEs:
        "Cuando se dirige hacia un lugar, normalmente se desea llegar lo antes posible, sanos y salvos, y sin lastimar a otra persona.",
      textRu:
        "Когда человек куда-то едет или идет, он обычно хочет добраться быстрее, целым и невредимым, и не причинить вреда другому."
    },
    {
      id: "traffic-system-principles",
      kind: "principle-pair",
      sourceTextEs: "Principios básicos del sistema de tránsito mundial: FLUIDEZ SEGURIDAD",
      titleRu: "Основные принципы мировой системы движения:",
      sourcePage: 22,
      sourceRegion: {
        x: 403,
        y: 645,
        width: 390,
        height: 92
      },
      leftRu: "ПЛАВНОСТЬ",
      rightRu: "БЕЗОПАСНОСТЬ",
      closingRu:
        "Чем больше моторизованных транспортных средств, тем выше вероятность дорожных инцидентов.",
      visualNotes: [
        "Centered teal source heading and two balanced terms preserved as text.",
        "Russian labels remain selectable DOM text, not an image crop.",
        "Closing crash-likelihood idea keeps the source blue emphasis without visible Spanish."
      ]
    },
    {
      id: "solidarity-law-respect",
      kind: "paragraph",
      sourceTextEs:
        "La fluidez y la seguridad en la vía pública son posibles únicamente si existe solidaridad en el tránsito. Se trata de respetar un código -una ley- y... a otra persona.",
      textRu:
        "Плавность и безопасность на дороге возможны только тогда, когда участники движения действуют солидарно. Соблюдать правила и закон здесь означает уважать другого человека."
    },
    {
      id: "stronger-road-user-care",
      kind: "callout",
      sourceTextEs:
        "Un antiguo principio legal indica que se le debe pedir más cuidado al más fuerte... a quien conduce. Por eso, este manual está destinado a aquellas personas que aspiran a obtener su licencia de conducir: para que tomen conciencia de la peligrosidad que implica conducir un vehículo y de la especial responsabilidad que ello conlleva.",
      textRu:
        "С более сильного участника дороги требуют больше осторожности. В этой теме таким участником чаще всего становится водитель. Поэтому руководство обращено к тем, кто стремится получить водительское удостоверение: оно должно помочь заранее осознать опасность управления транспортным средством и особую ответственность, которая из этого следует."
    },
    {
      id: "nine-million-trips",
      kind: "paragraph",
      sourceTextEs:
        "Uno de los principales desafíos... se realizan a diario más de nueve millones de viajes.",
      textRu:
        "Для CABA одна из главных задач в организации движения и дорожной безопасности - огромный ежедневный поток: на территории города совершается больше девяти миллионов поездок в день."
    },
    {
      id: "streets-as-shared-space",
      kind: "paragraph",
      sourceTextEs:
        "La función de las calles debería dejar de ser la de una red de vías rápidas destinadas a los autos... espacio compartido de convivencia saludable.",
      textRu:
        "Поэтому улицы не должны быть только сетью быстрых дорог для автомобилей. Их задача - становиться общим пространством здорового сосуществования."
    },
    {
      id: "connectivity-sustainable-mobility",
      kind: "paragraph",
      sourceTextEs:
        "En la Ciudad de Buenos Aires, se desarrollan obras de conectividad... promueven una movilidad sustentable.",
      textRu:
        "В Буэнос-Айресе для этого развивают крупные проекты связности: они помогают движению быть более гибким и поддерживают устойчивую мобильность."
    }
  ]
};
