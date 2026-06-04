import type { ManualGuideSectionContent } from "../manualGuide";

export const ch5GenderViolencePreventionSection: ManualGuideSectionContent = {
  id: "ch5-gender-violence-prevention-content",
  sectionId: "ch5-gender-violence-prevention",
  titleRu: "Профилактика и помощь в ситуациях гендерного насилия",
  sourcePages: [100, 101],
  sourceTitleEs: "Prevención y asistencia en situaciones de violencia de género",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch5-gender-violence-prevention/page-100-gender-violence-source-crop.jpg",
      "content/validation/manual-guide/ch5-gender-violence-prevention/page-101-gender-violence-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch5-gender-violence-prevention/ch5-gender-violence-prevention-desktop.png",
      "content/validation/manual-guide/ch5-gender-violence-prevention/ch5-gender-violence-prevention-mobile.png"
    ],
    notes: [
      "The section owns source page 100 from Prevención y asistencia en situaciones de violencia de género and the page 101 phone/SMS support block before Conducción preventiva y eficiente.",
      "Emergency, report, containment, 22676 ACOSO, 24/365, and non-911-derivation details are rendered as selectable Russian DOM text.",
      "No source visuals occur in this section."
    ]
  },
  blocks: [
    {
      id: "first-contact-911",
      kind: "lead",
      sourceTextEs:
        "Si se es víctima o testigo de una situación de acoso en el espacio público, en primer lugar contactar al 911.",
      textRu:
        "Если человек стал жертвой или свидетелем домогательства в общественном пространстве, первым действием источник указывает контакт с 911, приоритет - физическая безопасность вовлеченных людей."
    },
    {
      id: "support-line",
      kind: "callout",
      sourceTextEs:
        "Se encuentra disponible la línea de reporte y contención 22676 ACOSO, las 24 hs, los 365 días del año.",
      textRu:
        "Линия сообщения и поддержки: 22676 ACOSO. Она доступна 24 часа в сутки, 365 дней в году."
    },
    {
      id: "sms-support-flow",
      kind: "list",
      titleRu: "Как работает линия сообщения и поддержки",
      sourceTextEs:
        "A través del envío de un SMS al número 22676 (ACOSO)... reciben asesoramiento inmediato por parte del equipo de profesionales.",
      itemsRu: [
        "Через SMS на номер 22676 (ACOSO) люди, пережившие уличное домогательство или ставшие свидетелями такой ситуации, получают немедленную консультацию от команды специалистов.",
        "Команда оценивает ситуацию, чтобы предложить соответствующий подход.",
        "Сообщение можно отправить как reporte - сообщение о ситуации для фиксации факта.",
        "Такая фиксация помогает выявлять и картировать места, с которыми нужно работать: например, остановки автобуса, станции метро или конкретное время.",
        "Сообщение можно отправить как contención/asesoramiento - запрос поддержки и консультации, если человек просит, чтобы операторка перезвонила."
      ]
    },
    {
      id: "active-listening-and-limits",
      kind: "list",
      titleRu: "Что дает консультация и чего линия не делает",
      sourceTextEs:
        "Ofrecen una escucha activa... El número NO funcionará como un centro de derivación de llamados al 911.",
      itemsRu: [
        "Операторки предлагают активное слушание: внимание, доступность, интерес к человеку, психологическую поддержку и эмоциональное сопровождение.",
        "Номер 22676 не работает как центр переадресации вызовов на 911 для немедленной помощи.",
        "В ситуации риска всегда нужно обращаться в 911."
      ]
    }
  ]
};
