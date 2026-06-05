import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch4-alcohol-drugs";

const sourceImageException = {
  kind: "source-image-original-visible-text",
  visibleSpanishScope: "source-image-only",
  sourceAsIs: true,
  russianExplanationOutsideImage: true
} as const;

export const ch4AlcoholDrugsSection: ManualGuideSectionContent = {
  id: "ch4-alcohol-drugs-content",
  sectionId: "ch4-alcohol-drugs",
  titleRu: "Употребление алкоголя и наркотиков",
  sourcePages: [90, 91, 92, 93],
  sourceTitleEs: "Consumo de alcohol y drogas",
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
      "content/validation/manual-guide/ch4-alcohol-drugs/page-090-alcohol-drugs-source-crop.jpg",
      "content/validation/manual-guide/ch4-alcohol-drugs/page-090-drug-test-source-crop.jpg",
      "content/validation/manual-guide/ch4-alcohol-drugs/page-091-alcohol-drugs-source-crop.jpg",
      "content/validation/manual-guide/ch4-alcohol-drugs/page-091-alcohol-limits-source-crop.jpg",
      "content/validation/manual-guide/ch4-alcohol-drugs/page-092-alcohol-drugs-source-crop.jpg",
      "content/validation/manual-guide/ch4-alcohol-drugs/page-093-alcohol-drugs-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch4-alcohol-drugs/ch4-alcohol-drugs-desktop.png",
      "content/validation/manual-guide/ch4-alcohol-drugs/ch4-alcohol-drugs-mobile.png"
    ],
    notes: [
      "Source PDF pages 90-92 plus the alcohol/drugs page 93 topic blocks are converted as ordinary selectable Russian runtime prose.",
      "The page 90 drug-test device/photo is rendered as an x5 source-as-is runtime crop; the page 91 alcohol-limit infographic is transferred from the x5 source crop with Spanish glyph-level cleanup and Russian threshold detail outside the image.",
      "No source photo, sign, or marking is translated, relabeled, recolored, cleaned, masked, or replaced; infographic source pictograms and numeric thresholds stay source-derived and are not covered with plate-style edits.",
      "Medication, drug-detection, alcohol-limit, absorption, elimination, positive-test, refusal procedure, responsible-driver, certified/calibrated instrument, and veisalgia details are retained in runtime text."
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
        "Употребление алкоголя и наркотиков (ingesta de alcohol y drogas).",
        "Сонливость и усталость (sueño y fatiga).",
        "Стрессовое состояние (estrés).",
        "Отвлечения от основной задачи управления (distracciones)."
      ]
    },
    {
      id: "medications-and-sedatives",
      kind: "list",
      titleRu: "Лекарства и проверка на наркотики",
      sourceTextEs:
        "Cierto tipo de medicamentos pueden afectar negativamente la capacidad de conducir... Instrumento para la medición o detección de estupefacientes.",
      itemsRu: [
        "Некоторые лекарства ухудшают способность водить. В источнике отдельно названы препараты по рецепту с седативным эффектом (sedantes), например средства для сна.",
        "Седативный эффект может сохраняться утром, даже если лекарство принято накануне вечером.",
        "Нужно читать листок-вкладыш с объяснениями (prospecto explicativo) и предупреждение о влиянии на управление транспортом, а при сомнениях консультироваться с врачом.",
        "При проверке на наркотические вещества (estupefacientes) крышку устройства снимают, устройство помещают в рот и держат в контакте со слюной; результат считается положительным, если обнаружено наличие таких веществ."
      ]
    },
    {
      id: "drug-test-source-visual",
      kind: "source-image-cards",
      titleRu: "Проверка на наркотические вещества",
      sourceTextEs: "Instrumento para la medición o detección de estupefacientes.",
      cards: [
        {
          id: "drug-test-device-source-card",
          titleRu: "Устройство проверки на estupefacientes",
          displayMode: "full-width",
          maxDisplayWidthPx: 820,
          sourcePage: 90,
          sourceRegion: { x: 1180, y: 2245, width: 820, height: 300 },
          assetPath: `${assetRoot}/drug-test-source-as-is.jpg`,
          altRu: "Визуал устройства проверки на наркотические вещества, сохраненный без изменений.",
          visibleSpanish: true,
          sourceImageException,
          bodyRu:
            "Визуал сохранен без изменений: он показывает устройство и шаг проверки слюны. Русское объяснение процедуры находится рядом обычным русским текстом."
        }
      ],
      visualNotes: [
        "The source image is a scale-5 crop rendered source-as-is.",
        "Spanish text inside the official visual is not translated, cleaned, or relabeled."
      ]
    },
    {
      id: "alcohol-effects",
      kind: "list",
      titleRu: "Что делает алкоголь с водителем",
      sourceTextEs:
        "El alcohol es una droga depresora del sistema nervioso central cuyo consumo produce reducción de reacción, disminución de visión periférica, somnolencia y otros efectos.",
      itemsRu: [
        "Снижает скорость реакции и увеличивает время ответа на стимул.",
        "Сужает периферическое зрение.",
        "Ухудшает устойчивость к ослеплению от яркого света.",
        "Нарушает зрительно-двигательную и двигательную координацию.",
        "Нарушает внимание и связность мышления.",
        "Создает чрезмерную уверенность в себе.",
        "Снижает самоконтроль и вызывает сонливость."
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
      id: "alcohol-limit-source-visual",
      kind: "source-image-cards",
      titleRu: "Límites de alcohol en sangre",
      sourceTextEs: "Límites de alcohol en sangre para conducir.",
      cards: [
        {
          id: "alcohol-limits-source-card",
          titleRu: "Перенесенная визуальная таблица пределов",
          displayMode: "full-width",
          maxDisplayWidthPx: 850,
          sourcePage: 91,
          sourceRegion: { x: 1180, y: 2030, width: 850, height: 430 },
          assetPath: `${assetRoot}/alcohol-limits-transferred-infographic.png`,
          altRu: "Перенесенный визуал пределов alcohol en sangre с сохраненными исходными пиктограммами и числовыми порогами.",
          visibleSpanish: false,
          russianOverlayLabels: [
            { id: "principiantes-label", textRu: "Нович.", xPct: 9.1, yPct: 36.5, widthPct: 10.2, heightPct: 4.4, tone: "light-on-blue" },
            { id: "profesionales-label", textRu: "Проф.", xPct: 19.9, yPct: 36.5, widthPct: 10.4, heightPct: 4.4, tone: "light-on-blue" },
            { id: "motociclistas-label", textRu: "Мото", xPct: 30.7, yPct: 36.5, widthPct: 10.4, heightPct: 4.4, tone: "light-on-blue" },
            { id: "acompanantes-label", textRu: "Пасс. мото", xPct: 41.7, yPct: 36.5, widthPct: 10.3, heightPct: 4.4, tone: "light-on-blue" },
            { id: "particulares-label", textRu: "Частн.", xPct: 52.4, yPct: 36.5, widthPct: 10.3, heightPct: 4.4, tone: "light-on-blue" }
          ],
          bodyRu:
            "Официальный визуал перенесен из x5-фрагмента: испанские буквы очищены на уровне отдельных букв с восстановлением фона, без закрывающих плашек или перерисовки; русские подписи наложены поверх очищенных полос как выбираемый текст. Конкретные пороги из него дублируются ниже в русской текстовой таблице: 0.00 g/l, 0.20 g/l и 0.50 g/l по категориям источника."
        }
      ],
      visualNotes: [
        "The alcohol-limit visual is transferred from the scale-5 source crop with glyph-level Spanish cleanup.",
        "Russian category labels are selectable DOM overlays positioned on the cleaned infographic header bands; threshold rows remain ordinary selectable runtime text below the image."
      ]
    },
    {
      id: "blood-alcohol-limit-table",
      kind: "table",
      titleRu: "Límites de alcohol en sangre para conducir",
      sourceTextEs:
        "Límites de alcohol en sangre para conducir: principiantes, profesionales, motociclistas, acompañantes y particulares. Ley 2148 art. 5.4.5: plaza de acompañante en motovehículos.",
      columnsRu: ["Категория из источника", "Предел", "Как читать для экзамена"],
      rows: [
        {
          id: "limit-principiantes",
          cellsRu: [
            "Principiantes - водители-новички",
            "0.00 g/l",
            "нулевой предел: начинающему водителю нельзя иметь измеряемый алкоголь в крови (alcohol en sangre)"
          ]
        },
        {
          id: "limit-profesionales",
          cellsRu: [
            "Profesionales - профессиональные водители",
            "0.00 g/l",
            "для профессионального водителя источник также указывает нулевой предел"
          ]
        },
        {
          id: "limit-motociclistas",
          cellsRu: [
            "Motociclistas - водители мототранспорта",
            "0.20 g/l",
            "предел ниже общего частного значения; категория не сводится к 0,50"
          ]
        },
        {
          id: "limit-acompanantes",
          cellsRu: [
            "Acompañantes en motovehículos - пассажиры мототранспорта",
            "0.50 g/l",
            "специальный случай Ley 2148: нельзя занимать plaza de acompañante в motovehículo с более чем 0,5 g/l, кроме отдельного внешнего habitáculo; это не общий предел для всех сопровождающих в автомобиле"
          ]
        },
        {
          id: "limit-particulares",
          cellsRu: [
            "Particulares - частные водители",
            "0.50 g/l",
            "это общий предел для частного случая, но он не отменяет более строгие строки выше"
          ]
        }
      ],
      captionRu:
        "Таблица сохраняет конкретные строки источника: principiantes и profesionales - 0.00 g/l, motociclistas - 0.20 g/l, particulares - 0.50 g/l; строка acompañantes читается как acompañantes en motovehículos по Ley 2148 Art. 5.4.5, а не как правило для любого пассажира автомобиля."
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
        "В среднем после прекращения употребления концентрация продолжает расти в течение первого часа, а затем снижается постепенно.",
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
        "При положительной проверке на алкоголь (alcoholemia positiva) применяется административная санкция и, если есть основание, санкция за нарушение (contravencional).",
        "У водителя удерживают водительское удостоверение (retener la licencia de conducir).",
        "Транспорт направляют или эвакуируют (remitir el vehículo), чтобы водитель не продолжал движение.",
        "При отказе от проверки на алкоголь контролирующий орган должен запретить продолжать управление и приказать направить или эвакуировать транспорт (remitir el vehículo), потому что состояние водителя считается положительным (se presume positivo)."
      ]
    },
    {
      id: "responsible-driver",
      kind: "callout",
      sourceTextEs:
        "Designar a una persona que se responsabilice para conducir... comprometerse a no ingerir alcohol y llevar a cada una a su destino.",
      textRu:
        "Рекомендация об ответственном водителе (conductor/a responsable): в группе людей, которым нужно уехать, назначить ответственного водителя. Этот человек обязуется не употреблять алкоголь и довезти каждого до места назначения после встречи, заботясь и о себе, и о других."
    },
    {
      id: "test-instruments-and-hangover",
      kind: "callout",
      sourceTextEs:
        "El control de alcoholemia o toxicológico se realiza utilizando instrumentos... frente a un resultado positivo o la negativa... el procedimiento es el mismo. Resaca o veisalgia.",
      textRu:
        "Контроль алкоголя или токсикологических веществ (alcoholemia или toxicológico) проводится приборами, которые гарантируют качество измерения или выявления, потому что они должным образом сертифицированы и откалиброваны (certificados y calibrados). Источник уточняет: при положительном результате или отказе пройти контроль алкоголя или наркотических веществ (estupefacientes) процедура одинакова. Похмелье (resaca), или медицинским термином veisalgia, опасно для вождения: оно нарушает координацию, внимание и время реакции, поэтому вождение с похмельем (conducir con resaca) приравнивается к управлению в состоянии алкоголизации (alcoholización)."
    }
  ]
};
