import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch5-anticipatory-efficient-driving";

const sourceImageException = {
  kind: "source-image-original-visible-text",
  visibleSpanishScope: "source-image-only",
  sourceAsIs: true,
  russianExplanationOutsideImage: true
} as const;

export const ch5AnticipatoryEfficientDrivingSection: ManualGuideSectionContent = {
  id: "ch5-anticipatory-efficient-driving-content",
  sectionId: "ch5-anticipatory-efficient-driving",
  titleRu: "Предупредительное и эффективное вождение",
  sourcePages: [101, 102, 103],
  sourceTitleEs: "Conducción preventiva y eficiente",
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
      "content/validation/manual-guide/ch5-anticipatory-efficient-driving/page-101-anticipatory-efficient-source-crop.jpg",
      "content/validation/manual-guide/ch5-anticipatory-efficient-driving/page-102-anticipatory-efficient-source-crop.jpg",
      "content/validation/manual-guide/ch5-anticipatory-efficient-driving/page-103-anticipatory-efficient-source-crop.jpg",
      "content/validation/manual-guide/ch5-anticipatory-efficient-driving/page-103-driving-culture-photo-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch5-anticipatory-efficient-driving/ch5-anticipatory-efficient-driving-desktop.png",
      "content/validation/manual-guide/ch5-anticipatory-efficient-driving/ch5-anticipatory-efficient-driving-mobile.png"
    ],
    notes: [
      "The section owns source page 101 from Conducción preventiva y eficiente onward, after the gender-violence support phone/SMS block, and continues through pages 102-103.",
      "Preventive-driving and efficient-driving details, including all source numeric thresholds, are rendered as selectable Russian DOM text.",
      "The page 103 photo/quote is rendered as an x5 source-as-is crop; Russian explanation is outside the protected image."
    ]
  },
  blocks: [
    {
      id: "two-cross-cutting-concepts",
      kind: "lead",
      sourceTextEs:
        "Estos dos conceptos son transversales y hacen al ejercicio de una buena conducción.",
      textRu:
        "Источник представляет предупредительное и эффективное вождение как два сквозных понятия, которые относятся к практике хорошего вождения."
    },
    {
      id: "preventive-driving",
      kind: "list",
      titleRu: "Предупредительное вождение",
      sourceTextEs:
        "Conductas cautelosas que se adoptan al conducir... basándose en la premisa de anticiparse a todo, esperar todo, suponer todo.",
      itemsRu: [
        "Это осторожное поведение за рулем, которое учитывает ответственность за собственные и чужие действия.",
        "Водитель заранее исходит из того, что любой человек может ошибиться, даже если знает нормы и видел государственные кампании по осведомлению.",
        "При таком вождении человек анализирует, думает и принимает решения, делая поездку приятной и безопасной для себя и других.",
        "Главная формула источника: «предвидеть все, ожидать все, предполагать все»."
      ]
    },
    {
      id: "efficient-driving-benefits",
      kind: "list",
      titleRu: "Что дает эффективное вождение",
      sourceTextEs:
        "Permite reducir los costos, extender la vida útil del vehículo, disminuir el consumo de combustible...",
      itemsRu: [
        "Снижает расходы.",
        "Продлевает срок службы транспортного средства.",
        "Уменьшает расход топлива.",
        "Помогает заботиться об окружающей среде.",
        "Одновременно снижает риски и тяжесть дорожных инцидентов."
      ]
    },
    {
      id: "air-conditioning",
      kind: "callout",
      sourceTextEs:
        "Aire acondicionado: con velocidades hasta los 80 km/h... temperatura entre 19 y 24ºC.",
      textRu:
        "Кондиционер: до 80 km/h источник рекомендует охлаждать салон, опуская окна. На более высокой скорости предлагается использовать кондиционер и держать температуру между 19 и 24 ºC."
    },
    {
      id: "fuel-saving-example",
      kind: "callout",
      sourceTextEs:
        "Para un automóvil que recorre 12.000 km. al año, un ahorro del 20% en consumo de combustible...",
      textRu:
        "Для автомобиля, который проходит 12 000 km в год, экономия 20% расхода топлива может соответствовать стоимости ежегодного обслуживания в механической мастерской."
    },
    {
      id: "efficient-driving-measures",
      kind: "list",
      titleRu: "Простые меры эффективного вождения",
      sourceTextEs:
        "Disminuir la resistencia aerodinámica, planificar el viaje, puesta en marcha, verificar estado mecánico, marchas altas, neumáticos, velocidad constante, vehículo detenido.",
      itemsRu: [
        "Уменьшать аэродинамическое сопротивление: равномерно распределять вес в транспортном средстве и не перегружать его ненужным грузом.",
        "Планировать поездку: до начала движения проверить наиболее полезный маршрут; приложения, связанные с GPS, могут быть очень полезны.",
        "Запуск двигателя: у дизельного двигателя нужно подождать несколько секунд перед началом движения, а у бензинового автомобиля можно начинать сразу.",
        "Работа на холостом ходу никогда не должна превышать 5 минут; после первой передачи нужно сразу перейти на вторую.",
        "Проверять механическое состояние транспортного средства: это снижает вероятность дорожного инцидента.",
        "Проверять состояние тормозов и чистоту воздушного, масляного и топливного фильтров.",
        "Ехать на высоких передачах и низких оборотах, чтобы транспортное средство расходовало меньше топлива.",
        "Проверять шины: давление должно соответствовать загрузке транспортного средства; важны периодические развал-схождение и балансировка.",
        "Двигаться с постоянной и предупредительной скоростью, без резких ускорений и торможений.",
        "Если автомобиль будет стоять более 3 минут, источник рекомендует выключить двигатель."
      ]
    },
    {
      id: "driving-culture-source-photo",
      kind: "source-image-cards",
      titleRu: "Визуал источника: дорожное движение как культура",
      sourceTextEs:
        "El tránsito, al igual que otras construcciones sociales, es una expresión de la cultura ciudadana.",
      cards: [
        {
          id: "driving-culture-photo-source-card",
          titleRu: "Фото и цитата источника",
          displayMode: "full-width",
          maxDisplayWidthPx: 1500,
          sourcePage: 103,
          sourceRegion: { x: 740, y: 1080, width: 1500, height: 2200 },
          assetPath: `${assetRoot}/driving-culture-photo-source-as-is.jpg`,
          altRu:
            "Исходное фото и цитата о дорожном движении как выражении городской культуры, оставленные без изменений.",
          visibleSpanish: true,
          sourceImageException,
          bodyRu:
            "Фото и испанская цитата оставлены как официальный источник без перевода внутри изображения. Смысл цитаты: дорожное движение, как и другие социальные конструкции, является выражением городской культуры."
        }
      ],
      visualNotes: [
        "The page 103 photo/quote crop is rendered source-as-is from the x5 source export.",
        "No Spanish text inside the protected photo/quote image is translated, cleaned, relabeled, recolored, masked, or replaced."
      ]
    }
  ]
};
