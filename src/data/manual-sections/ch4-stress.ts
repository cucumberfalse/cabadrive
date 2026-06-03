import type { ManualGuideSectionContent } from "../manualGuide";

export const ch4StressSection: ManualGuideSectionContent = {
  id: "ch4-stress-content",
  sectionId: "ch4-stress",
  titleRu: "Стресс",
  sourcePages: [94, 95],
  sourceTitleEs: "Estrés",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch4-stress/page-094-stress-source-crop.jpg",
      "content/validation/manual-guide/ch4-stress/page-095-stress-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch4-stress/ch4-stress-desktop.png",
      "content/validation/manual-guide/ch4-stress/ch4-stress-mobile.png"
    ],
    notes: [
      "Direct navigation starts at source page 94, where the Estrés heading begins.",
      "Stress recommendation bullets continue on source page 95 before the distraction body; page 95 is shared with the distractions section by explicit boundary evidence.",
      "Runtime stress content is selectable Russian DOM text only; no source artwork is modified."
    ]
  },
  blocks: [
    {
      id: "oms-definition",
      kind: "lead",
      sourceTextEs:
        "La OMS lo define como el conjunto de reacciones fisiológicas que preparan al organismo para entrar en acción.",
      textRu:
        "ВОЗ (OMS) определяет стресс как совокупность физиологических реакций, которые готовят организм к действию. Такая реакция нужна для выживания, но при избытке перестает быть адекватной и создает перегрузку напряжения, влияющую на организм."
    },
    {
      id: "modern-demands",
      kind: "paragraph",
      sourceTextEs:
        "En las sociedades actuales, son cada vez mayores las exigencias a las que las personas se ven sometidas...",
      textRu:
        "В современных обществах требования к людям становятся все выше, и водители не находятся вне этих обстоятельств."
    },
    {
      id: "double-driving-relationship",
      kind: "callout",
      sourceTextEs:
        "En la conducción, existe una doble relación con el estrés: esta actividad genera estrés por sí misma y, a su vez, esto provocará que se haga de manera más temeraria y menos segura.",
      textRu:
        "У вождения со стрессом двойная связь: само управление транспортом порождает стресс, а стресс, в свою очередь, делает вождение более temeraria и менее безопасным, увеличивая напряжение в дорожной среде."
    },
    {
      id: "stress-recommendations",
      kind: "list",
      titleRu: "Рекомендации при стрессе",
      sourceTextEs:
        "Recomendaciones: prestar atención al contexto, planificar el viaje, salir con tiempo, regular la temperatura, adoptar actitud tolerante y paciente.",
      itemsRu: [
        "Обращать внимание на дорожный контекст и оставлять в стороне переживания и споры во время вождения, потому что они повышают напряжение и создают высокий риск для seguridad vial.",
        "Planificar el viaje и заранее оценивать альтернативные дороги к привычному маршруту.",
        "Выезжать с достаточным запасом времени, чтобы прибыть к месту назначения.",
        "Регулировать температуру в автомобиле: чрезмерная жара и холод являются стрессовыми стимулами.",
        "В пробках adoptar una actitud tolerante y paciente - сохранять терпеливое и терпимое отношение."
      ]
    }
  ]
};
