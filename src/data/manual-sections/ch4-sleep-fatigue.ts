import type { ManualGuideSectionContent } from "../manualGuide";

export const ch4SleepFatigueSection: ManualGuideSectionContent = {
  id: "ch4-sleep-fatigue-content",
  sectionId: "ch4-sleep-fatigue",
  titleRu: "Сон и усталость",
  sourcePages: [93, 94],
  sourceTitleEs: "Sueño y fatiga",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch4-sleep-fatigue/page-093-sleep-fatigue-source-crop.jpg",
      "content/validation/manual-guide/ch4-sleep-fatigue/page-094-sleep-fatigue-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch4-sleep-fatigue/ch4-sleep-fatigue-desktop.png",
      "content/validation/manual-guide/ch4-sleep-fatigue/ch4-sleep-fatigue-mobile.png"
    ],
    notes: [
      "Source PDF page 93 is split by topic: sleep/fatigue begins at the Sueño y fatiga heading, while the responsible-driver and alcohol/drugs control blocks belong to alcohol/drugs.",
      "Page 94 is shared: sleep/fatigue owns fatigue symptoms and recommendations through the rest-stop remedies; stress starts at the Estrés heading.",
      "No Chapter 4 source artwork is rendered or modified in runtime."
    ]
  },
  blocks: [
    {
      id: "sleep-biological-need",
      kind: "lead",
      sourceTextEs:
        "El sueño es una parte integral de la vida cotidiana, una necesidad biológica...",
      textRu:
        "Сон - часть повседневной жизни и биологическая потребность, которая восстанавливает физические, психологические и социальные функции человека."
    },
    {
      id: "insufficient-sleep-and-performance",
      kind: "paragraph",
      sourceTextEs:
        "Cuando una persona no duerme lo suficiente... aumento de la necesidad de sueño en los días posteriores y disminución del rendimiento.",
      textRu:
        "Если человек спит недостаточно, организм пытается вернуть равновесие: в последующие дни растет потребность во сне и снижается работоспособность. Источник также предупреждает, что усталость может усиливаться от алкоголя и обильной еды."
    },
    {
      id: "few-hours-sleep-effects",
      kind: "list",
      titleRu: "Если спать мало часов",
      sourceTextEs:
        "Dormir pocas horas reduce la capacidad de reacción, reduce el estado de alerta, predispone a tomar malas decisiones.",
      itemsRu: [
        "Снижается скорость реакции и увеличивается время ответа на стимул.",
        "Падает бдительность: уменьшается интеллектуальная работоспособность, труднее концентрироваться и использовать память.",
        "Возрастает склонность к плохим решениям из-за изменений настроения, тревожности и раздражительности."
      ]
    },
    {
      id: "fatigue-definition",
      kind: "paragraph",
      sourceTextEs:
        "La fatiga es la sensación de falta de energía, agotamiento o cansancio...",
      textRu:
        "Fatiga - ощущение нехватки энергии, истощения или усталости, сопровождаемое отсутствием мотивации. Она может появиться из-за недостаточного сна, чрезмерного усилия или длительного напряжения; бывает временной или хронической."
    },
    {
      id: "physical-fatigue-symptoms",
      kind: "list",
      titleRu: "Физические симптомы усталости",
      sourceTextEs:
        "Síntomas físicos de la fatiga: bostezos, visión borrosa, ojos pesados, lagrimeo, cabeceos, microsueños.",
      itemsRu: [
        "Bostezos - зевота.",
        "Visión borrosa - размытое зрение.",
        "Ощущение тяжелых глаз, рост количества и длительности морганий.",
        "Слезотечение и/или зуд в глазах.",
        "Cabeceos - кивки головой.",
        "Непреднамеренное дремание или засыпание на несколько секунд, microsueños."
      ]
    },
    {
      id: "fatigue-prevention",
      kind: "list",
      titleRu: "Как снижать риск усталости",
      sourceTextEs:
        "Al emprender un viaje largo dormir aproximadamente 8 horas... interrumpir cada 200 kilometros o dos horas... motovehículos cada 100 kilómetros o cada hora.",
      itemsRu: [
        "Перед длинной поездкой спать aproximadamente 8 horas предыдущей ночью.",
        "Прерывать поездку cada 200 kilometros или каждые 2 часа.",
        "Для водителей motovehículos источник рекомендует чаще: cada 100 kilómetros или каждый 1 час.",
        "Поддерживать хорошую ventilación внутри автомобиля.",
        "Часто пить воду и выбирать comidas ligeras.",
        "Избегать вождения al anochecer y al amanecer, потому что слабая видимость усложняет управление.",
        "Профессиональные водители имеют повышенную predisposición a sufrir fatiga из-за длительного времени за рулем, а principiantes - из-за высокой нагрузки задачи и недостатка опыта."
      ]
    },
    {
      id: "seventeen-awake-hours",
      kind: "callout",
      sourceTextEs:
        "Estar 17 horas despierto/a provoca tener el mismo nivel de reacción que una persona con un nivel de alcohol en sangre mayor al permitido por ley.",
      textRu:
        "17 часов бодрствования дают такой же уровень реакции, как у человека с уровнем alcohol en sangre выше разрешенного законом."
    },
    {
      id: "sleep-vs-fatigue-remedies",
      kind: "list",
      titleRu: "Сонливость и усталость похожи по эффекту, но лечатся по-разному",
      sourceTextEs:
        "Los efectos de conducir con fatiga o cansancio son similares... Para combatir el sueño se necesita dormir. Para tratar la fatiga es necesario interrumpir el viaje y hacer una parada de descanso.",
      itemsRu: [
        "При fatigue/cansancio и при недосыпе снижается реакция и растет время ответа на стимул.",
        "Чтобы бороться со sueño, нужно dormir.",
        "Чтобы tratar la fatiga, нужно interrumpir el viaje и сделать parada de descanso."
      ]
    }
  ]
};
