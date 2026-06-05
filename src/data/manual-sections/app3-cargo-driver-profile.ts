import type { ManualGuideSectionContent } from "../manualGuide";

export const app3CargoDriverProfileSection: ManualGuideSectionContent = {
  id: "app3-cargo-driver-profile-content",
  sectionId: "app3-cargo-driver-profile",
  titleRu: "Профиль перевозчика грузов",
  sourcePages: [153, 154],
  sourceTitleEs: "Perfil del transportista de cargas",
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
      "content/validation/manual-guide/app3-cargo-driver-profile/page-153-cargo-driver-profile-source-crop.jpg",
      "content/validation/manual-guide/app3-cargo-driver-profile/page-154-cargo-driver-profile-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app3-cargo-driver-profile/app3-cargo-driver-profile-desktop.png",
      "content/validation/manual-guide/app3-cargo-driver-profile/app3-cargo-driver-profile-mobile.png"
    ],
    notes: [
      "Pages 153-154 are implemented as selectable Russian DOM text from the official Appendix III cargo-driver source.",
      "The x5 source crops are unchanged reference evidence; no source images or source visual pixels are altered."
    ]
  },
  blocks: [
    {
      id: "appendix-framing",
      kind: "lead",
      sourceTextEs:
        "En este anexo se desarrollaran las particularidades relacionadas con el transporte de cargas y mercaderias, como asi tambien aspectos que hacen a la conduccion de vehiculos de gran porte en general.",
      textRu:
        "Приложение III разбирает особенности перевозки грузов и товаров, а также правила и практику управления крупногабаритными транспортными средствами. Для экзамена важно помнить и нормативные требования, и повседневные задачи профессионального водителя."
    },
    {
      id: "professional-license-context",
      kind: "list",
      titleRu: "Профессиональная лицензия",
      sourceTextEs:
        "Las personas con licencias C, D y E son consideradas conductoras profesionales; edad minima 21 anos, antiguedad mayor a 1 ano en clase B, examen practico para mayores de 65 que desean primera licencia profesional.",
      itemsRu: [
        "Лицензии категорий C, D и E относятся к профессиональному вождению.",
        "Минимальный возраст для получения и подтверждения профессиональной лицензии - 21 год.",
        "Нужен стаж больше 1 года в классе B.",
        "Если заявителю больше 65 лет и он впервые хочет получить профессиональную лицензию, после теоретического экзамена требуется практический экзамен на пригодность к управлению."
      ]
    },
    {
      id: "license-classes",
      kind: "table",
      titleRu: "Классы лицензий для грузового транспорта",
      sourceTextEs:
        "Clase C: camiones sin acoplado ni semiacoplado y casas rodantes motorizadas de mas de 3.500 kg. Clase E.1: camiones articulados con acoplado o semiacoplado. Clase E.2: maquinaria especial no agricola.",
      columnsRu: ["Класс", "Что разрешает"],
      rows: [
        {
          id: "class-c",
          cellsRu: [
            "C",
            "Грузовики без прицепа или полуприцепа и моторизованные дома на колесах массой более 3.500 kg; также включает категорию B1."
          ]
        },
        {
          id: "class-e1",
          cellsRu: [
            "E.1",
            "Сочлененные грузовики, транспорт с прицепом или полуприцепом; включает B1, B2 и C."
          ]
        },
        {
          id: "class-e2",
          cellsRu: [
            "E.2",
            "Специальная несельскохозяйственная техника; в лицензии указывается конкретный тип транспортного средства."
          ]
        }
      ]
    },
    {
      id: "cargo-definitions",
      kind: "list",
      titleRu: "Основные определения",
      sourceTextEs:
        "Camion, carga general, carga indivisible, carga y descarga, contenedor, peso bruto, porte, tara.",
      itemsRu: [
        "Грузовик - автомобиль для перевозки грузов с полной массой более 3.500 kg.",
        "Общий груз - упакованный, связанный, тюковой или насыпной груз, отдельные единицы которого меньше габаритов перевозящего автомобиля.",
        "Неделимый груз - груз, который по своим характеристикам образует единицы, превышающие габариты перевозящего автомобиля.",
        "Погрузка и разгрузка - остановка транспортного средства, с водителем или без него, у бордюра, на тротуаре в обозначенных местах, в коммерческих гаражах или на стоянках только на строго необходимое время.",
        "Контейнер - емкость, подготовленная для удержания или перевозки различных материалов насыпью, партиями или поштучно, обычно из портовых зон или в портовые зоны.",
        "Полная масса - масса транспортного средства вместе с грузом и людьми.",
        "Porte - конкретный объем транспортного средства или автопоезда.",
        "Tara - масса разгруженного транспортного средства."
      ]
    },
    {
      id: "truck-trailer-definitions",
      kind: "list",
      titleRu: "Грузовики и прицепы",
      sourceTextEs:
        "Camion rigido, camion tractor, vehiculo acoplado, semirremolque, bitren y remolque de eje central.",
      itemsRu: [
        "Жесткий грузовик категорий N1, N2 или N3 предназначен и изготовлен для перевозки товаров.",
        "Тягач категорий N1, N2 или N3 предназначен для буксировки прицепа или полуприцепа.",
        "Прицеп - несамоходное транспортное средство для буксировки; как минимум одна ось должна быть управляемой, и его вес не передается другому транспортному средству.",
        "Полуприцеп соединяется с тягачом и передает на него существенную вертикальную нагрузку.",
        "Bitren состоит из одного тягача и двух би-сочлененных полуприцепов.",
        "Прицеп с центральной осью имеет жесткую сцепку и оси около центра тяжести, поэтому передает тягачу небольшую статическую вертикальную нагрузку."
      ]
    },
    {
      id: "vehicle-categories-documents",
      kind: "list",
      titleRu: "Категории N и документы",
      sourceTextEs:
        "N1 hasta 3.500 kg; N2 superior a 3.500 kg e inferior o igual a 12.000 kg; N3 superior a 12.000 kg. Documentacion requerida: licencia, cedula, seguro, RUTA, RTO, LiNTI, remito/carta de porte/guia/factura y documentacion especifica.",
      itemsRu: [
        "N1 - транспорт для перевозки грузов с максимальной массой не более 3.500 kg.",
        "N2 - транспорт для перевозки грузов с массой более 3.500 kg и до 12.000 kg включительно.",
        "N3 - транспорт для перевозки грузов с максимальной массой более 12.000 kg.",
        "Для движения нужны водительская лицензия, идентификационная карточка транспортного средства и подтверждение обязательного страхования гражданской ответственности.",
        "Также нужны RUTA, сертификат RTO, LiNTI при межюрисдикционной перевозке, документ на груз: remito, carta de porte, guia или factura.",
        "Для отдельных видов груза требуется специальная документация: контейнеры, пищевые вещества, неделимые грузы, скот, патологические отходы, химические прекурсоры и другие регулируемые грузы."
      ]
    }
  ]
};
