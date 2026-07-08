import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-other-required-safety-elements";

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
      "Pages 119-120 are implemented as selectable Russian DOM text with the official Matafuegos and Chaleco reflectivo source crops restored as protected source-as-is images.",
      "Page 119 is shared: this section starts at the official Otros elementos de seguridad obligatorios heading; the preceding Equipaje paragraphs are owned by app1-safety-elements.",
      "Spanish labels inside the official source crops are not translated or modified; Russian translations are rendered below the images as selectable DOM text."
    ]
  },
  blocks: [
    {
      id: "warning-triangles",
      kind: "callout",
      sourceTextEs:
        "Señales triangulares normalizadas: se deben llevar al menos dos, estar accesibles y advertir a otras personas.",
      textRu:
        "В автомобиле должно быть минимум два аварийных треугольника. Они должны быть доступны и предупреждать других людей об остановленном автомобиле, давая им пространство и время воспринять риск и отреагировать."
    },
    {
      id: "mandatory-equipment-source-visuals",
      kind: "source-image-cards",
      titleRu: "Огнетушитель и световозвращающий жилет",
      sourceTextEs: "Matafuegos. Chaleco reflectivo.",
      cards: [
        {
          id: "app1-matafuegos-source-card",
          titleRu: "Огнетушитель",
          displayMode: "full-width",
          maxDisplayWidthPx: 340,
          sourcePage: 120,
          sourceRegion: { x: 1060, y: 1660, width: 340, height: 330 },
          assetPath: `${assetRoot}/matafuegos-source-as-is.jpg`,
          altRu: "Официальная испанская иллюстрация обязательного огнетушителя Matafuegos (огнетушители).",
          visibleSpanish: true,
          sourceImageException: {
            kind: "source-image-original-visible-text",
            visibleSpanishScope: "source-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          },
          bodyRu:
            "Огнетушитель входит в обязательное оснащение автомобиля и должен быть закреплен безопасно, в пределах досягаемости водителя, с учетом требований к емкости.",
          termTranslations: [{ termEs: "Matafuegos", translationRu: "Огнетушитель" }]
        },
        {
          id: "app1-chaleco-reflectivo-source-card",
          titleRu: "Световозвращающий жилет",
          displayMode: "full-width",
          maxDisplayWidthPx: 340,
          sourcePage: 120,
          sourceRegion: { x: 1060, y: 1990, width: 340, height: 340 },
          assetPath: `${assetRoot}/chaleco-reflectivo-source-as-is.jpg`,
          altRu: "Официальная испанская иллюстрация обязательного световозвращающего жилета Chaleco reflectivo (световозвращающий жилет).",
          visibleSpanish: true,
          sourceImageException: {
            kind: "source-image-original-visible-text",
            visibleSpanishScope: "source-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          },
          bodyRu:
            "Жилет должен быть внутри салона и доступен при вынужденном выходе на проезжую часть, особенно на автомагистралях и скоростных дорогах.",
          termTranslations: [{ termEs: "Chaleco reflectivo", translationRu: "Световозвращающий жилет" }]
        }
      ],
      visualNotes: [
        "Both equipment visuals are source-faithful crops from the retained Appendix I page 120 x5 render.",
        "Spanish titles remain inside the protected images; Russian term translations are selectable DOM text below each image."
      ]
    },
    {
      id: "extinguisher",
      kind: "list",
      titleRu: "Огнетушитель",
      sourceTextEs:
        "Extintor de 1 kg tipo ABC; al abrir la válvula se libera bajo presión por la manguera hacia la base del fuego.",
      itemsRu: [
        "При открытии клапана состав выходит под давлением через шланг; направлять его нужно к основанию огня.",
        "Обязателен огнетушитель 1 kg типа ABC.",
        "A - твердые материалы, например дерево, пластик и резина.",
        "B - жидкости, например нефтепродукты, спирт и легковоспламеняющиеся жидкости.",
        "C - электрический риск, например двигатели и панели.",
        "Огнетушитель должен быть в пределах досягаемости водителя внутри салона.",
        "Крепление ставят в безопасном месте, указанном в руководстве.",
        "Нужна металлическая система крепления; эластичный зажим не допускается.",
        "Огнетушитель должен оставаться на месте при столкновении или опрокидывании и при этом легко освобождаться."
      ]
    },
    {
      id: "reflective-vest",
      kind: "callout",
      sourceTextEs:
        "Chaleco reflectivo: obligatorio dentro del habitáculo; recomendado al descender a la calzada; obligatorio por fuerza mayor en autopistas y vías rápidas.",
      textRu:
        "Световозвращающий жилет должен находиться внутри салона. При выходе на проезжую часть его следует надеть и не закрывать другой одеждой. Обязательным при выходе он становится в случае вынужденной остановки на автомагистралях и скоростных дорогах."
    }
  ]
};
