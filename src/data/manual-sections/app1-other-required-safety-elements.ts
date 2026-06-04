import type { ManualGuideSectionContent } from "../manualGuide";

export const app1OtherRequiredSafetyElementsSection: ManualGuideSectionContent = {
  id: "app1-other-required-safety-elements-content",
  sectionId: "app1-other-required-safety-elements",
  titleRu: "Другие обязательные элементы безопасности",
  sourcePages: [119, 120],
  sourceTitleEs: "Otros elementos de seguridad obligatorios",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-legal-detail"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/app1-other-required-safety-elements/page-119-other-required-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app1-other-required-safety-elements/page-120-other-required-safety-elements-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app1-other-required-safety-elements/app1-other-required-safety-elements-desktop.png",
      "content/validation/manual-guide/app1-other-required-safety-elements/app1-other-required-safety-elements-mobile.png"
    ],
    notes: [
      "Pages 119-120 are implemented as selectable Russian DOM text.",
      "The page 119 luggage guidance is preserved with the source section boundary because the Índice assigns page 119 to this Appendix I topic.",
      "No source image, sign, or road marking is translated or modified in this section."
    ]
  },
  blocks: [
    {
      id: "luggage-safety",
      kind: "list",
      titleRu: "Багаж и максимальная загрузка",
      sourceTextEs:
        "El peso máximo que puede transportar el vehículo se encuentra en el manual... equipaje pesado en el fondo del baúl y cerca del centro.",
      itemsRu: [
        "Максимальная загрузка автомобиля указана в manual.",
        "Перегруз усложняет маневры.",
        "Тяжелый багаж размещают глубоко в trunk и ближе к центру автомобиля.",
        "Roof rack должен быть надежно закреплен.",
        "Груз на крыше не должен ухудшать aerodynamics, visibility, закрывать lights или превышать установленные limits."
      ]
    },
    {
      id: "warning-triangles",
      kind: "callout",
      sourceTextEs:
        "Señales triangulares normalizadas: se deben llevar al menos dos, estar accesibles y advertir a otras personas.",
      textRu:
        "В автомобиле должно быть минимум два hazard triangles. Они должны быть accessible и предупреждать других людей о stopped vehicle, давая им пространство и время воспринять риск и отреагировать."
    },
    {
      id: "extinguisher",
      kind: "list",
      titleRu: "Огнетушитель",
      sourceTextEs:
        "Extintor de 1 kg tipo ABC; al abrir la válvula se libera bajo presión por la manguera hacia la base del fuego.",
      itemsRu: [
        "При открытии valve состав выходит под давлением через hose; направлять его нужно к base of fire.",
        "Обязателен extinguisher 1 kg типа ABC.",
        "A - твердые материалы, например wood, plastics and rubber.",
        "B - жидкости, например petroleum, alcohol and flammable liquids.",
        "C - electric risk, например motors and panels.",
        "Огнетушитель должен быть within driver's reach inside cabin.",
        "Крепление ставят в безопасном месте, указанном в manual.",
        "Нужна metal securing system; elastic clamp источник запрещает.",
        "Огнетушитель должен оставаться на месте при collision or rollover и при этом легко освобождаться."
      ]
    },
    {
      id: "reflective-vest",
      kind: "callout",
      sourceTextEs:
        "Chaleco reflectivo: obligatorio dentro del habitáculo; recomendado al descender a la calzada; obligatorio por fuerza mayor en autopistas y vías rápidas.",
      textRu:
        "Reflective vest должен находиться внутри cabin. Источник рекомендует надевать его при выходе на roadway и не закрывать другой одеждой. Обязательным при выходе он становится в случае force majeure на highways и fast roads."
    }
  ]
};
