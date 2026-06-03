import type { ManualGuideSectionContent } from "../manualGuide";

export const ch2LegalResponsibilitySection: ManualGuideSectionContent = {
  id: "ch2-legal-responsibility-content",
  sectionId: "ch2-legal-responsibility",
  titleRu: "Юридическая ответственность",
  sourcePages: [44, 45],
  sourceTitleEs: "Responsabilidades legales",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch2-legal-responsibility/page-044-legal-source-crop.jpg",
      "content/validation/manual-guide/ch2-legal-responsibility/page-045-legal-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch2-legal-responsibility/ch2-legal-responsibility-desktop.png",
      "content/validation/manual-guide/ch2-legal-responsibility/ch2-legal-responsibility-mobile.png"
    ],
    notes: [
      "Source PDF pages 44-45 are converted as one Chapter 2 legal-responsibility section.",
      "The section is text-only in runtime: Russian legal explanations are selectable DOM text.",
      "No photo, sign, road marking, or infographic is modified or introduced for this source section."
    ]
  },
  blocks: [
    {
      id: "mobility-right-responsibility",
      kind: "lead",
      sourceTextEs:
        "La posibilidad de movilizarse por la Ciudad es un derecho que, como cualquier otro, conlleva responsabilidades.",
      textRu:
        "Передвижение по городу - это право, но вместе с ним идут обязанности. Каждый участник движения своим способом передвижения может создавать либо более безопасную ситуацию, либо риск."
    },
    {
      id: "norms-as-consensus",
      kind: "paragraph",
      sourceTextEs:
        "Para romper con estas pautas de conducta incorporadas, es necesario observarlas desde otro punto de vista: aprender y conocer el sentido de las normas para respetarlas por convicción y no sólo por obligación.",
      textRu:
        "Повторяющиеся привычки закрепляют реакции, но привычное поведение не всегда безопасно. Поэтому правила важно понимать по смыслу: соблюдать их не только из обязанности, а потому что это общий социальный договор для совместной жизни."
    },
    {
      id: "driving-is-higher-risk",
      kind: "callout",
      sourceTextEs:
        "Si se decide movilizarse conduciendo un vehículo, la responsabilidad que se debe asumir es todavía mayor... conducir, es un acto de responsabilidad.",
      textRu:
        "Когда человек выбирает управлять транспортным средством, его ответственность выше: скорость, размер кузова и перевозимый вес увеличивают возможный вред. Поэтому вождение прямо описано как акт ответственности перед всеми, кто делит общественную дорогу."
    },
    {
      id: "administrative-responsibility",
      kind: "list",
      titleRu: "Административная ответственность",
      sourceTextEs:
        "Responsabilidad administrativa. Es aquella en la que no hay daños ni lesiones... multas o faltas de tránsito... unidades fijas.",
      itemsRu: [
        "Применяется, когда нет вреда и травм: речь идет о штрафах или дорожных нарушениях.",
        "Нарушения могут быть легкими или серьезными и измеряются в фиксированных единицах.",
        "Если контролирующий орган составляет акт о нарушении, дело решается в соответствующем офисе Dirección General de Administración de Infracciones.",
        "Стоимость фиксированной единицы устанавливается каждые полгода и привязана к цене половины литра бензина максимального октанового числа."
      ]
    },
    {
      id: "law-2148",
      kind: "callout",
      sourceTextEs:
        "La conducción en la Ciudad Autónoma de Buenos Aires... debe ajustarse a la norma establecida en la Ley 2148.",
      textRu:
        "Ключевой юридический ориентир для CABA - Закон 2148. Поведение при движении по общественной дороге должно соответствовать этой норме; несоблюдение ведет к санкциям, которые определяет компетентный орган с учетом типа ответственности."
    },
    {
      id: "contravention-responsibility",
      kind: "list",
      titleRu: "Контравенционная ответственность",
      sourceTextEs:
        "Responsabilidad contravencional... darse a la fuga... conducir con un nivel de alcohol en sangre igual o superior a un (1.0) gramo... competencias de velocidad o destreza.",
      itemsRu: [
        "Это противоправное поведение, рассматриваемое как квазиделикт.",
        "Примеры из дорожного движения: скрыться после участия в инциденте; управлять с уровнем алкоголя в крови 1,0 г/л или выше; ехать под действием веществ, снижающих способность; участвовать, проводить или организовывать соревнования скорости или мастерства на моторизованных транспортных средствах на общественной дороге.",
        "Скрыться с места дорожного инцидента - контравенция. Если при этом оставлен раненый человек, возможно преследование за преступление оставления человека в опасности.",
        "Санкции могут включать предупреждения, временное лишение права, залог, общественные работы и другое.",
        "Контравенционная санкция не отменяет административную ответственность за тот же факт."
      ]
    },
    {
      id: "civil-criminal-responsibility",
      kind: "list",
      titleRu: "Гражданская и уголовная ответственность",
      sourceTextEs:
        "Responsabilidad civil... Responsabilidad penal... A partir de los 16 años cualquier persona es responsable penal de sus actos.",
      itemsRu: [
        "Гражданская ответственность - обязанность возместить реальный вред деньгами, если поврежденное невозможно вернуть в прежнее состояние.",
        "Для несовершеннолетних младше 18 лет гражданская ответственность переходит к человеку, подписавшему разрешение на получение лицензии: отцу, матери или законному опекуну, а затем к страховщикам.",
        "Уголовная ответственность наступает за преступление из Уголовного кодекса, если оно вызвало травмы, поставило под угрозу физическую целостность людей или причинило материальный вред.",
        "С 16 лет человек несет уголовную ответственность за свои действия; она не передается другому лицу.",
        "Среди возможных уголовных санкций есть лишение свободы."
      ]
    },
    {
      id: "legal-forms",
      kind: "list",
      titleRu: "Формы поведения ответственного водителя",
      sourceTextEs:
        "Conductor/a responsable de un incidente de tránsito: formas jurídicas. Negligencia... Imprudencia... Impericia...",
      itemsRu: [
        "Неосторожность: действовать небрежно или не выполнить правовую обязанность, например двигаться без обязательного элемента безопасности или на автомобиле в плохом состоянии.",
        "Неблагоразумие: не принять меры против риска или действовать поспешно, например превысить лимит скорости, ехать против направления или нарушить сигнал светофора.",
        "Неумение: не дать адекватную реакцию на дорожные обстоятельства из-за недостатка практики управления транспортным средством."
      ]
    }
  ]
};
