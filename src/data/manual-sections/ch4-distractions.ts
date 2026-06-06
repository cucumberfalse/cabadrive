import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch4-distractions";

const sourceImageException = {
  kind: "source-image-original-visible-text",
  visibleSpanishScope: "source-image-only",
  sourceAsIs: true,
  russianExplanationOutsideImage: true
} as const;

export const ch4DistractionsSection: ManualGuideSectionContent = {
  id: "ch4-distractions-content",
  sectionId: "ch4-distractions",
  titleRu: "Отвлечения",
  sourcePages: [95, 96, 97],
  sourceTitleEs: "Distracciones",
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
      "content/validation/manual-guide/ch4-distractions/page-095-distractions-source-crop.jpg",
      "content/validation/manual-guide/ch4-distractions/page-095-distraction-panels-source-crop.jpg",
      "content/validation/manual-guide/ch4-distractions/page-096-distractions-source-crop.jpg",
      "content/validation/manual-guide/ch4-distractions/page-097-distractions-source-crop.jpg",
      "content/validation/manual-guide/ch4-distractions/page-097-attention-photo-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch4-distractions/ch4-distractions-desktop.png",
      "content/validation/manual-guide/ch4-distractions/ch4-distractions-mobile.png"
    ],
    notes: [
      "Direct navigation starts at source page 95 and opens the distractions section.",
      "Source pages 95-97 are converted as ordinary selectable Russian runtime prose, including phone, GPS, passenger, mirror, toll, and 100% attention details.",
      "The page 95 three-panel distraction infographic is transferred from its x5 source crop with Spanish glyph-level cleanup; the page 97 photo/quote remains an x5 source-as-is runtime crop.",
      "No source photo, sign, or marking is translated, relabeled, recolored, cleaned, masked, or replaced; infographic source drawings stay source-derived and are not covered with plate-style edits."
    ]
  },
  blocks: [
    {
      id: "distraction-definition",
      kind: "lead",
      sourceTextEs:
        "Se entiende por distracción a la desviación de la atención por parte de una persona cuando ésta deba atender a algo específico.",
      textRu:
        "Distracción - это отклонение внимания человека от того, чему он должен уделять внимание. В применении к вождению это означает небезопасное и неосторожное (imprudente) управление, потому что вождение требует организации и координации воспринимаемых стимулов и достаточного уровня внимания."
    },
    {
      id: "divided-attention",
      kind: "paragraph",
      sourceTextEs:
        "Si se reparte la atención entre la tarea principal (conducir) y otras secundarias...",
      textRu:
        "Если внимание делится между главной задачей - вождением (conducir) - и вторичными действиями, эффективность главной задачи падает: у водителя нет полной способности реагировать на непредвиденные ситуации (imprevistos), которые могут возникнуть."
    },
    {
      id: "eating-drinking-mate-smoking",
      kind: "list",
      titleRu: "Еда, питье, мате и курение",
      sourceTextEs:
        "Comer, beber, tomar mate y/o fumar demandan atención, cuidado para evitar derrames o ceniza encendida y manipulación.",
      itemsRu: [
        "Еда, питье, мате и/или курение требуют определенного уровня внимания.",
        "К этому добавляется осторожность, чтобы избежать проливания жидкости или падения горящей золы.",
        "Кроме отвлечения, эти действия несут дополнительный риск: они требуют манипуляций руками, поэтому руки не могут уверенно оставаться на руле."
      ]
    },
    {
      id: "eating-distraction-source-visual",
      kind: "source-image-cards",
      titleRu: "Отвлечение едой и мате",
      sourceTextEs: "Comer, beber, tomar mate y/o fumar...",
      cards: [
        {
          id: "distraction-panels-source-card",
          titleRu: "Три панели Distracciones",
          displayMode: "full-width",
          maxDisplayWidthPx: 860,
          sourcePage: 95,
          sourceRegion: { x: 1190, y: 2160, width: 860, height: 260 },
          assetPath: `${assetRoot}/distraction-panels-transferred-infographic.png`,
          altRu: "Трехпанельная схема отвлечений с рисунками.",
          visibleSpanish: false,
          russianOverlayLabels: [
            { id: "distraction-food-label", textRu: "Еда / мате", xPct: 7.2, yPct: 29.4, widthPct: 18.1, heightPct: 12.4, tone: "dark-on-light" },
            { id: "distraction-object-label", textRu: "Предмет", xPct: 25.8, yPct: 29.4, widthPct: 17.9, heightPct: 12.4, tone: "dark-on-light" },
            { id: "distraction-view-label", textRu: "Нет обзора", xPct: 44.4, yPct: 29.4, widthPct: 18.1, heightPct: 12.4, tone: "dark-on-light" }
          ],
          bodyRu:
            "Три панели показывают один и тот же риск: еда, напитки, мате и курение отвлекают внимание и занимают руки. Русские подписи доступны как выбираемый текст."
        }
      ],
      visualNotes: [
        "The distraction panels are transferred from the scale-5 source crop with glyph-level Spanish cleanup.",
        "Russian panel labels are selectable DOM overlays positioned on the cleaned infographic caption bands; learner explanation remains ordinary runtime text outside the image."
      ]
    },
    {
      id: "cell-phone-risk",
      kind: "list",
      titleRu: "Мобильный телефон",
      sourceTextEs:
        "Usar telefonía celular está prohibido ya que disminuye la capacidad de atención y reacción...",
      itemsRu: [
        "Использование мобильного телефона запрещено: телефон снижает внимание и реакцию, увеличивает время реакции на стимул и ограничивает слух и/или зрение.",
        "Во время управления нужно держать обе руки на руле.",
        "Громкая связь (altavoz) или наушники (auriculares) тоже считаются рискованными: даже без рук разговор требует мысленного представления человека, с которым идет диалог."
      ]
    },
    {
      id: "gps-risk",
      kind: "list",
      titleRu: "GPS",
      sourceTextEs:
        "El GPS es una herramienta útil pero puede ser de riesgo si se lo utiliza incorrectamente.",
      itemsRu: [
        "GPS - полезный инструмент, но он опасен при неправильном использовании.",
        "Нельзя настраивать или трогать GPS во время движения.",
        "Маршрут нужно запрограммировать заранее до начала поездки.",
        "Во время движения использовать GPS только чтобы слушать, а не смотреть."
      ]
    },
    {
      id: "phone-recommendations",
      kind: "list",
      titleRu: "Рекомендации по телефону",
      sourceTextEs:
        "Apagar el teléfono, modo avión, guantera o baúl, acompañante atiende, balizas y detenerse en lugar permitido, aplicación de aviso.",
      itemsRu: [
        "Выключить телефон перед началом вождения.",
        "Поставить его в режим полета (modo avión).",
        "Убрать его в бардачок или багажник (guantera или baúl).",
        "Позволить сопровождающему ответить на звонок и сообщить, что водитель свяжется после завершения движения.",
        "Если ожидается важный звонок и другие меры невозможны, включить аварийные огни (balizas) и остановиться в разрешенном месте, чтобы не создавать риска.",
        "Можно установить приложение, которое сообщает звонящему, что человек не может ответить, потому что ведет машину, и даже может передать оставшееся время поездки."
      ]
    },
    {
      id: "other-actions",
      kind: "list",
      titleRu: "Другие действия, которых не должно быть во время движения",
      sourceTextEs:
        "Cambiar de radio o CD, mirar DVD portátil, maquillarse, mirar ocupantes, quitar abrigo, cinturón o espejo, puerta o guantera, dinero antes del peaje.",
      itemsRu: [
        "Менять радио или CD.",
        "Смотреть портативный DVD.",
        "Maquillarse - наносить макияж.",
        "Смотреть на других пассажиров.",
        "Пытаться снять верхнюю одежду.",
        "Пытаться пристегнуть ремень безопасности или отрегулировать зеркало заднего вида; эти действия должны быть сделаны до начала движения.",
        "Тянуться, чтобы закрыть дверь или найти что-то в бардачке.",
        "Искать деньги перед пунктом оплаты проезда."
      ]
    },
    {
      id: "one-hundred-percent-attention",
      kind: "callout",
      sourceTextEs:
        "Conducir, requiere del 100% de atención y coordinación.",
      textRu:
        "Вождение требует 100% внимания и координации."
    },
    {
      id: "attention-source-photo",
      kind: "source-image-cards",
      titleRu: "100% внимания за рулем",
      sourceTextEs: "Conducir, requiere del 100% de atención y coordinación.",
      cards: [
        {
          id: "attention-photo-source-card",
          titleRu: "Фото и цитата",
          displayMode: "full-width",
          maxDisplayWidthPx: 720,
          sourcePage: 97,
          sourceRegion: { x: 1160, y: 1680, width: 720, height: 900 },
          assetPath: `${assetRoot}/attention-photo-source-as-is.jpg`,
          altRu: "Фото с цитатой о 100% внимания и координации.",
          visibleSpanish: true,
          sourceImageException,
          termTranslations: [
            {
              termEs: "Conducir requiere del 100% de atención y coordinación.",
              translationRu: "Вождение требует 100% внимания и координации."
            }
          ],
          bodyRu:
            "Смысл цитаты: управление требует 100% внимания и координации."
        }
      ],
      visualNotes: [
        "The photo/quote is a scale-5 source-as-is crop.",
        "No Spanish text is removed or replaced in the protected photo visual."
      ]
    }
  ]
};
