import type { ManualGuideSectionContent } from "../manualGuide";

export const ch4AlcoholDrugsSection: ManualGuideSectionContent = {
  id: "ch4-alcohol-drugs-content",
  sectionId: "ch4-alcohol-drugs",
  titleRu: "Употребление алкоголя и наркотиков",
  sourcePages: [90, 91, 92],
  sourceTitleEs: "Consumo de alcohol y drogas",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch4-alcohol-drugs/page-090-alcohol-drugs-source-crop.jpg",
      "content/validation/manual-guide/ch4-alcohol-drugs/page-091-alcohol-drugs-source-crop.jpg",
      "content/validation/manual-guide/ch4-alcohol-drugs/page-092-alcohol-drugs-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch4-alcohol-drugs/ch4-alcohol-drugs-desktop.png",
      "content/validation/manual-guide/ch4-alcohol-drugs/ch4-alcohol-drugs-mobile.png"
    ],
    notes: [
      "Source PDF pages 90-92 are converted as selectable Russian DOM text.",
      "Chapter 4 alcohol/drug pages use x5 full-page source-reference evidence only; no source image, sign, marking, photo, or infographic is modified.",
      "Medication, drug-detection, alcohol-limit, absorption, elimination, positive-test, and refusal procedure details are retained in runtime text."
    ]
  },
  blocks: [
    {
      id: "drug-definition",
      kind: "lead",
      sourceTextEs:
        "Droga es toda sustancia que, introducida en el organismo... produce una alteración del natural funcionamiento del sistema nervioso central.",
      textRu:
        "По классическому определению droga - это любое вещество, которое попадает в организм любым способом, изменяет естественную работу центральной нервной системы и может вызывать психологическую, физическую или смешанную зависимость."
    },
    {
      id: "legal-and-illegal-substances",
      kind: "paragraph",
      sourceTextEs:
        "No sólo se trata del consumo de drogas ilegales sino también de las legales, como el alcohol y algunos medicamentos.",
      textRu:
        "Источник говорит не только о нелегальных наркотиках. К рискам относятся и легальные вещества, например alcohol и некоторые лекарства: человек под их воздействием теряет часть способности управлять безопасно и подвергает риску себя и окружающих."
    },
    {
      id: "health-and-aptitude",
      kind: "callout",
      sourceTextEs:
        "La salud influye en la conducción... La aptitud para conducir se considera disminuida cuando existe una alteración de la coordinación motora, la atención, la percepción sensorial o el juicio crítico.",
      textRu:
        "Здоровье влияет на вождение. Болезни, временные состояния и настроение могут ухудшать безопасность. Aptitud para conducir считается сниженной, если нарушены моторная координация, внимание, сенсорное восприятие или критическое суждение; поэтому перед выдачей лицензии государство проверяет кандидата психофизическим examen psicofísico."
    },
    {
      id: "factors-that-impair-driving",
      kind: "list",
      titleRu: "Факторы, которые мешают хорошему вождению",
      sourceTextEs:
        "Factores que impiden o disminuyen el buen ejercicio de conducir: ingesta de alcohol y drogas, sueño y fatiga, estrés, distracciones.",
      itemsRu: [
        "Ingesta de alcohol y drogas - употребление алкоголя и наркотиков.",
        "Sueño y fatiga - сонливость и усталость.",
        "Estrés - стрессовое состояние.",
        "Distracciones - отвлечения от основной задачи управления."
      ]
    },
    {
      id: "medications-and-sedatives",
      kind: "list",
      titleRu: "Лекарства и проверка на наркотики",
      sourceTextEs:
        "Cierto tipo de medicamentos pueden afectar negativamente la capacidad de conducir... Instrumento para la medición o detección de estupefacientes.",
      itemsRu: [
        "Некоторые лекарства ухудшают способность водить. В источнике отдельно названы препараты по рецепту с sedantes, например средства для сна.",
        "Седативный эффект может сохраняться утром, даже если лекарство принято накануне вечером.",
        "Нужно читать prospecto explicativo и предупреждение о влиянии на управление транспортом, а при сомнениях консультироваться с врачом.",
        "При проверке на estupefacientes крышку устройства снимают, устройство помещают в рот и держат в контакте со слюной; результат считается положительным, если обнаружено наличие наркотических веществ."
      ]
    },
    {
      id: "alcohol-effects",
      kind: "list",
      titleRu: "Что делает алкоголь с водителем",
      sourceTextEs:
        "El alcohol es una droga depresora del sistema nervioso central cuyo consumo produce reducción de reacción, disminución de visión periférica, somnolencia y otros efectos.",
      itemsRu: [
        "Снижает capacidad de reacción и увеличивает время ответа на стимул.",
        "Уменьшает visión periférica.",
        "Ухудшает resistencia al deslumbramiento - устойчивость к ослеплению.",
        "Нарушает viso-motor coordination и motor coordination.",
        "Нарушает внимание и asociación de ideas.",
        "Создает exceso de confianza en uno mismo.",
        "Снижает inhibition и вызывает somnolencia."
      ]
    },
    {
      id: "caba-legal-limit",
      kind: "callout",
      sourceTextEs:
        "La Ley 2148 determina los valores límite... Está prohibido conducir cualquier tipo de vehículo con más de 0,5 gramos de alcohol por litro de sangre.",
      textRu:
        "Ley 2148 устанавливает пределы концентрации алкоголя в крови для вождения в Ciudad de Buenos Aires. Общее правило источника: запрещено управлять любым транспортом при более чем 0,5 gramos de alcohol por litro de sangre; к нему применяются дополнительные ограничения по конкретному случаю. В остальной части страны нужно знать местный límite de alcoholemia, потому что провинции и муниципалитеты имеют собственную нормативную автономию."
    },
    {
      id: "absorption-factors",
      kind: "list",
      titleRu: "От чего зависит степень алкоголизации",
      sourceTextEs:
        "El grado de alcoholización depende de tipo de bebida, cantidad, presencia de alimentos, peso corporal, cantidad de sangre, grasa corporal, funcionamiento hepático.",
      itemsRu: [
        "Тип напитка.",
        "Количество выпитого алкоголя.",
        "Наличие пищи в желудке.",
        "Масса тела.",
        "Количество крови.",
        "Количество жира в организме.",
        "Работа печени."
      ]
    },
    {
      id: "no-safe-known-amount",
      kind: "callout",
      sourceTextEs:
        "No es posible saber qué cantidad de alcohol puede ingerirse... Si tomaste alcohol, no manejes.",
      textRu:
        "Нельзя заранее надежно знать, какое количество алкоголя даст конкретную концентрацию в крови: у каждого организма и в каждой ситуации результат разный. Если пил алкоголь, не садись за руль."
    },
    {
      id: "metabolism-and-next-day-risk",
      kind: "list",
      titleRu: "Метаболизм и риск на следующий день",
      sourceTextEs:
        "Eliminación del alcohol del organismo... concentración continúa subiendo durante la primera hora y luego comienza a descender paulatinamente.",
      itemsRu: [
        "Алкоголь выводится главным образом через печень, почки и легкие.",
        "Процесс занимает индивидуальное время; концентрация не падает мгновенно до нуля.",
        "В среднем после прекращения употребления концентрация продолжает расти durante la primera hora, а затем снижается постепенно.",
        "Вождение на следующий день после ночи чрезмерного употребления тоже рискованно: эффект не заканчивается вместе с последним напитком, а длится до полного выведения следов из организма."
      ]
    },
    {
      id: "positive-and-refusal-procedure",
      kind: "list",
      titleRu: "Alcoholemia positiva и отказ от проверки",
      sourceTextEs:
        "Procedimiento en caso de alcoholemia positiva... Negativa a realizar una prueba de alcoholemia.",
      itemsRu: [
        "При положительной alcoholemia применяется административная санкция и, если есть основание, contravencional sanction.",
        "У водителя retenеr la licencia de conducir - удерживают водительское удостоверение.",
        "Транспорт remitir el vehículo - отправляют/эвакуируют так, чтобы водитель не продолжал движение.",
        "При отказе от alcoholemia autoridad de control должна запретить продолжать управление и приказать removal of vehicle, потому что состояние presumed positive."
      ]
    }
  ]
};
