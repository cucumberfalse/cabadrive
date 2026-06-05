import type { ManualGuideSectionContent } from "../manualGuide";

export const app2SocialResponsibilitySection: ManualGuideSectionContent = {
  id: "app2-social-responsibility-content",
  sectionId: "app2-social-responsibility",
  titleRu: "Социальная ответственность пассажирского транспорта",
  sourcePages: [123, 124],
  sourceTitleEs: "Responsabilidad social",
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
      "content/validation/manual-guide/app2-social-responsibility/page-123-social-responsibility-source-crop.jpg",
      "content/validation/manual-guide/app2-social-responsibility/page-124-social-responsibility-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app2-social-responsibility/app2-social-responsibility-desktop.png",
      "content/validation/manual-guide/app2-social-responsibility/app2-social-responsibility-mobile.png"
    ],
    notes: [
      "Source pages 123-124 are rendered as selectable Russian DOM text covering the Appendix II introduction, professional-driver requirements, and social-responsibility vehicle checks.",
      "No photograph, traffic sign, road marking, or source infographic is altered."
    ]
  },
  blocks: [
    {
      id: "public-transport-role",
      kind: "lead",
      sourceTextEs:
        "La funcion del transporte publico es de gran importancia para el funcionamiento de una sociedad, su mantenimiento y crecimiento.",
      textRu:
        "Общественный транспорт поддерживает почти все повседневные действия общества. Поэтому водитель пассажирского транспорта отвечает не только за перемещение, но и за безопасность людей, которые ежедневно доверяют услуге перевозки."
    },
    {
      id: "sustainable-city-context",
      kind: "paragraph",
      sourceTextEs:
        "La nueva configuracion de la Ciudad favorece modalidades alternativas al automovil particular y promueve el derecho a la movilidad.",
      textRu:
        "В логике устойчивой и безопасной мобильности городская инфраструктура поддерживает альтернативы частному автомобилю. Для хорошего сосуществования в дорожном движении профессиональный водитель должен действовать с максимальной ответственностью и профессионализмом."
    },
    {
      id: "professional-driver-requirements",
      kind: "list",
      titleRu: "Требования к профессиональному водителю",
      sourceTextEs:
        "La ley 2148 considera conductoras profesionales a quienes poseen licencias C, D y E; algunos requisitos son edad minima de 21 anos, experiencia mayor a 1 ano en clase B y examen practico para mayores de 65 anos que obtienen la primera licencia profesional.",
      itemsRu: [
        "Профессиональный водитель - человек, для которого вождение является профессией и средством к существованию.",
        "Закон 2148 относит к профессиональным водителям людей с удостоверениями категорий C, D и E.",
        "Минимальный возраст для получения такой лицензии - 21 год.",
        "Нужен предыдущий опыт вождения: стаж больше 1 года в классе B.",
        "Люди старше 65 лет, которые впервые получают профессиональное удостоверение, кроме курса и теоретического экзамена сдают практический экзамен на пригодность к вождению независимо от подкласса."
      ]
    },
    {
      id: "key-road-role",
      kind: "callout",
      sourceTextEs:
        "La persona que conduce transporte de pasajeros/as cumple un rol clave en la via publica.",
      textRu:
        "Что важно запомнить: водитель пассажирского транспорта играет ключевую роль на общественной дороге, потому что его решения напрямую влияют на безопасность пассажиров и других участников движения."
    }
  ]
};
