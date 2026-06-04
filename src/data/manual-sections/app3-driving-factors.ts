import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app3-driving-factors";

export const app3DrivingFactorsSection: ManualGuideSectionContent = {
  id: "app3-driving-factors-content",
  sectionId: "app3-driving-factors",
  titleRu: "Факторы, участвующие в вождении",
  sourcePages: [160, 161],
  sourceTitleEs: "Factores involucrados en la conduccion",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-legal-detail",
    "manual-source-artwork"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/app3-driving-factors/page-160-driving-factors-source-crop.jpg",
      "content/validation/manual-guide/app3-driving-factors/page-161-driving-factors-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app3-driving-factors/app3-driving-factors-desktop.png",
      "content/validation/manual-guide/app3-driving-factors/app3-driving-factors-mobile.png"
    ],
    notes: [
      "Pages 160-161 are implemented as selectable Russian DOM text.",
      "No source images, photos, signs, markings, or diagrams are modified."
    ]
  },
  blocks: [
    {
      id: "food-planning",
      kind: "lead",
      sourceTextEs:
        "Quienes conducen de manera profesional necesitan alimentarse durante su horario laboral; conviene planificar la jornada para que manipulacion e ingesta queden fuera del momento de operar el vehiculo.",
      textRu:
        "Профессиональный водитель часто должен питаться в рабочее время. Источник требует планировать день так, чтобы подготовка и прием пищи не происходили в момент управления транспортным средством."
    },
    {
      id: "somnolence",
      kind: "callout",
      sourceTextEs:
        "Debe considerarse tipo y cantidad de alimentos, ya que la digestion puede inducir somnolencia, mas aun de noche o con fatiga.",
      textRu:
        "Важны тип и количество еды: пищеварение может вызвать сонливость. Риск выше ночью или после многих часов управления, когда уже есть усталость."
    },
    {
      id: "difficult-conditions",
      kind: "paragraph",
      sourceTextEs:
        "Si bien es recomendable evitar conduccion con fuertes lluvias o de noche, conductores profesionales pueden no estar en situacion de definirlas; se requiere respeto riguroso por normas y recomendaciones.",
      textRu:
        "Хотя источник рекомендует избегать управления при сильном дожде, ночью и в других сложных условиях, профессиональный водитель не всегда может сам выбрать обстоятельства работы. Поэтому требуется особенно строго соблюдать нормы и рекомендации безопасности."
    },
    {
      id: "body-posture",
      kind: "list",
      titleRu: "Поза тела и здоровье",
      sourceTextEs:
        "Realizar actividad en una misma posicion durante largo tiempo puede traer lesiones musculares y articulares; buena postura reduce lesiones e incrementa seguridad en caso de siniestro.",
      itemsRu: [
        "Долгая работа в одной позе может привести к мышечным и суставным травмам.",
        "Хорошая посадка уменьшает вероятность таких травм.",
        "Правильная поза также повышает безопасность водителя при дорожном инциденте.",
        "Перерывы с растяжкой помогают предотвратить мышечную боль и улучшить кровообращение, особенно в ногах."
      ]
    },
    {
      id: "body-posture-source-visual",
      kind: "source-image-cards",
      titleRu: "Исходная схема посадки водителя",
      sourceTextEs:
        "Postura corporal: brazos, piernas, cabeza y espalda, el asiento.",
      cards: [
        {
          id: "app3-body-posture-source-card",
          titleRu: "Что означает исходная схема",
          sourcePage: 161,
          sourceRegion: { x: 875, y: 1575, width: 1275, height: 725 },
          assetPath: `${assetRoot}/body-posture-source-as-is.png`,
          altRu:
            "Официальное исходное изображение посадки водителя с испанскими подписями, сохраненное без изменений.",
          visibleSpanish: true,
          sourceImageException: {
            kind: "source-image-original-visible-text",
            visibleSpanishScope: "source-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          },
          bodyRu:
            "Изображение оставлено как источник: не переведено, не перекрашено и не перерисовано. По-русски: руки держат руль на высоте, позволяющей маневрировать с расслабленными плечами; ноги не должны быть полностью прямыми; голова и спина опираются на сиденье; сиденье регулируют так, чтобы корпусу было удобно, а сиденье находилось минимум в 30 cm от пола."
        }
      ],
      visualNotes: [
        "The page 161 body-posture source visual is retained source-as-is; Russian explanation is outside the image as selectable DOM text."
      ]
    },
    {
      id: "stretching",
      kind: "list",
      titleRu: "Упражнения на остановках",
      sourceTextEs:
        "Flexionar pierna 10 segundos, rotar tobillos cinco veces, estirar cuello 10 segundos, rotar brazos cinco veces, caminar.",
      itemsRu: [
        "Стоя согнуть ногу, приблизить пятку к ягодице и удерживать 10 секунд.",
        "Поднять ногу и вращать стопой вокруг голеностопа пять раз в каждую сторону; повторить с каждой стопой.",
        "Медленно наклонить голову к плечу и удерживать 10 секунд, затем повторить с другой стороны.",
        "Обеими руками сзади мягко наклонить голову вперед на 10 секунд, затем выполнить повороты головы.",
        "Повернуть руки одновременно пять раз вперед и пять раз назад.",
        "Положить руку на противоположную лопатку и удерживать растяжку локтя 10 секунд.",
        "Опереться руками о вертикальную поверхность, одну ногу вытянуть назад, другую согнуть и наклониться вперед на 10 секунд.",
        "Ходьба - простое упражнение, которое можно выполнять во время остановок отдыха."
      ]
    }
  ]
};
