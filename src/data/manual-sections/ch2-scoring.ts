import type { ManualGuideSectionContent } from "../manualGuide";

export const ch2ScoringSection: ManualGuideSectionContent = {
  id: "ch2-scoring-content",
  sectionId: "ch2-scoring",
  titleRu: "Система баллов Scoring",
  sourcePages: [55],
  sourceTitleEs: "Sistema de puntos Scoring",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: ["content/validation/manual-guide/ch2-scoring/page-055-scoring-source-crop.jpg"],
    russianScreenshots: [
      "content/validation/manual-guide/ch2-scoring/ch2-scoring-desktop.png",
      "content/validation/manual-guide/ch2-scoring/ch2-scoring-mobile.png"
    ],
    notes: [
      "Scoring starts on source PDF page 55 at page-055-block-08.",
      "Source page 56 is a chapter-closing slogan and is not rendered as Scoring content.",
      "The section is text-only in runtime and uses selectable Russian DOM text."
    ]
  },
  blocks: [
    {
      id: "scoring-definition",
      kind: "lead",
      sourceTextEs:
        "El Sistema de Evaluación Permanente de Conductores o Scoring consiste en la asignación de un puntaje a cada persona con licencia (20 puntos al obtenerla por primera vez)...",
      textRu:
        "Sistema de Evaluación Permanente de Conductores, или Scoring, присваивает каждому человеку с водительским удостоверением баллы. При первом получении лицензии дается 20 баллов; затем из этой базы списываются баллы в зависимости от вида нарушения."
    },
    {
      id: "recover-points",
      kind: "list",
      titleRu: "Повторное присвоение и восстановление баллов",
      sourceTextEs:
        "Reasignación y recupero de puntos...",
      itemsRu: [
        "Если человек не потерял все баллы в течение трех лет с последнего нарушения, списания прекращают действовать.",
        "Если баллы потеряны и водитель хочет добровольно восстановить 4 балла, он может пройти и сдать специализированный курс дорожного образования.",
        "Добровольное восстановление 4 баллов возможно только один раз в год и только если водитель еще не дошел до 0 баллов.",
        "При добровольной оплате нарушений может быть повторно присвоено 50% списанных баллов, если человек проходит и сдает курс дорожного образования для повторного присвоения баллов."
      ]
    },
    {
      id: "zero-points",
      kind: "list",
      titleRu: "Когда достигнуты 0 баллов",
      sourceTextEs:
        "Al llegar a los 0 puntos...",
      itemsRu: [
        "Санкция - запрет управлять транспортом сроком от 60 дней до 5 лет.",
        "Водитель должен посетить и сдать курс дорожного образования и профилактики дорожных инцидентов; это позволяет повторно присвоить 10 баллов.",
        "В некоторых случаях устанавливается прекращение действия лицензии, и нужно начинать новый процесс получения.",
        "Если при проверке на дороге агентами дорожного движения выяснится, что человек достиг 0 баллов, лицензия удерживается.",
        "Вместо лицензии выдается Boleta de Citación, которая разрешает управлять максимум 3 рабочих дня.",
        "После этого человек должен явиться к судье или назначенному должностному лицу для урегулирования ситуации."
      ]
    },
    {
      id: "scoring-footnotes",
      kind: "list",
      titleRu: "Ссылки и исключения",
      sourceTextEs:
        "35/ Para más información... 36/ Para más información... 37/ Las infracciones contempladas...",
      itemsRu: [
        "Информация о нарушениях, за которые списываются баллы: buenosaires.gob.ar/justiciayseguridad/infracciones/sistema-de-evaluacion-permanente-de-conductores.",
        "Информация о курсах и оценках дорожного переобучения: buenosaires.gob.ar/licenciadeconducir/educacion-vial-y-prevencion-de-siniestros-de-transito.",
        "Нарушения, предусмотренные пунктами d) и e) статьи 11.1.4 Código de Tránsito y Transporte, не дают возможности повторно присвоить 50% списанных баллов."
      ]
    }
  ]
};
