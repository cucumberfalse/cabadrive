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
      "Source pages 95-97 are converted as selectable Russian DOM text, including phone, GPS, passenger, mirror, toll, and 100% attention details.",
      "The page 95 three-panel distraction visual and page 97 photo/quote are rendered as x5 source-as-is runtime crops.",
      "No Chapter 4 phone/GPS/source artwork is translated, relabeled, recolored, cleaned, masked, or redrawn; Russian explanation stays outside images."
    ]
  },
  blocks: [
    {
      id: "distraction-definition",
      kind: "lead",
      sourceTextEs:
        "Se entiende por distracción a la desviación de la atención por parte de una persona cuando ésta deba atender a algo específico.",
      textRu:
        "Distracción - это отклонение внимания человека от того, чему он должен уделять внимание. В применении к вождению это означает небезопасное и imprudente управление, потому что вождение требует организации и координации воспринимаемых стимулов и достаточного уровня внимания."
    },
    {
      id: "divided-attention",
      kind: "paragraph",
      sourceTextEs:
        "Si se reparte la atención entre la tarea principal (conducir) y otras secundarias...",
      textRu:
        "Если внимание делится между главной задачей - conducir - и вторичными действиями, эффективность главной задачи падает: у водителя нет всей способности response frente a imprevistos, которые могут возникнуть."
    },
    {
      id: "eating-drinking-mate-smoking",
      kind: "list",
      titleRu: "Еда, питье, mate и курение",
      sourceTextEs:
        "Comer, beber, tomar mate y/o fumar demandan atención, cuidado para evitar derrames o ceniza encendida y manipulación.",
      itemsRu: [
        "Comer, beber, tomar mate и/или fumar требуют определенного уровня внимания.",
        "К этому добавляется cuidado, чтобы избежать derrames или падения encendida ceniza.",
        "Кроме отвлечения, эти действия несут дополнительный риск: они требуют manipulación, поэтому руки не могут уверенно оставаться на руле."
      ]
    },
    {
      id: "eating-distraction-source-visual",
      kind: "source-image-cards",
      titleRu: "Визуал источника: отвлечение едой и mate",
      sourceTextEs: "Comer, beber, tomar mate y/o fumar...",
      cards: [
        {
          id: "distraction-panels-source-card",
          titleRu: "Три панели Distracciones",
          sourcePage: 95,
          sourceRegion: { x: 1190, y: 2160, width: 860, height: 260 },
          assetPath: `${assetRoot}/distraction-panels-source-as-is.jpg`,
          altRu: "Исходный трехпанельный визуал отвлечений из manual, оставленный без изменений.",
          visibleSpanish: true,
          sourceImageException,
          bodyRu:
            "Официальный визуал сохранен без перевода внутри изображения. Рядом русским selectable text объясняется тот же риск: еда, напитки, mate и курение отвлекают внимание и занимают руки."
        }
      ],
      visualNotes: [
        "The distraction panels are a scale-5 source-as-is crop.",
        "Spanish text inside the visual remains only inside the source image."
      ]
    },
    {
      id: "cell-phone-risk",
      kind: "list",
      titleRu: "Мобильный телефон",
      sourceTextEs:
        "Usar telefonía celular está prohibido ya que disminuye la capacidad de atención y reacción...",
      itemsRu: [
        "Usar telefonía celular запрещено: телефон снижает внимание и реакцию, увеличивает response time на стимул и ограничивает слух и/или зрение.",
        "Во время управления нужно держать обе руки на руле.",
        "Altavoz или auriculares тоже считаются рискованными: даже без рук разговор требует mental representation человека, с которым идет диалог."
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
        "Нельзя manipular GPS во время движения.",
        "Маршрут нужно programar con anterioridad до начала поездки.",
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
        "Поставить его в modo avión.",
        "Убрать его в guantera или baúl.",
        "Позволить сопровождающему ответить на звонок и сообщить, что водитель свяжется после завершения движения.",
        "Если ожидается важный звонок и другие меры невозможны, включить balizas и остановиться в разрешенном месте, чтобы не создавать риска.",
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
        "Менять radio или CD.",
        "Смотреть DVD portátil.",
        "Maquillarse - наносить макияж.",
        "Смотреть на других occupants.",
        "Пытаться снять abrigo.",
        "Пытаться пристегнуть cinturón de seguridad или отрегулировать espejo retrovisor; эти действия должны быть сделаны до начала движения.",
        "Тянуться, чтобы закрыть дверь или найти что-то в guantera.",
        "Искать деньги перед peaje."
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
      titleRu: "Визуал источника: 100% внимания",
      sourceTextEs: "Conducir, requiere del 100% de atención y coordinación.",
      cards: [
        {
          id: "attention-photo-source-card",
          titleRu: "Фото и цитата источника",
          sourcePage: 97,
          sourceRegion: { x: 1160, y: 1680, width: 720, height: 900 },
          assetPath: `${assetRoot}/attention-photo-source-as-is.jpg`,
          altRu: "Исходное фото и цитата о 100% внимания и координации, оставленные без изменений.",
          visibleSpanish: true,
          sourceImageException,
          bodyRu:
            "Фото и цитата оставлены как официальный источник. Русская строка выше передает смысл: управление требует 100% внимания и координации."
        }
      ],
      visualNotes: [
        "The photo/quote is a scale-5 source-as-is crop.",
        "No Spanish text is removed or replaced in the protected photo visual."
      ]
    }
  ]
};
