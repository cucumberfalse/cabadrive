import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-highways-hospitals";

export const app2HighwaysHospitalsSection: ManualGuideSectionContent = {
  id: "app2-highways-hospitals-content",
  sectionId: "app2-highways-hospitals",
  titleRu: "Автомагистрали и больницы",
  sourcePages: [149, 150, 151],
  sourceTitleEs: "Autopistas y hospitales",
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
      "content/validation/manual-guide/app2-highways-hospitals/page-149-highways-hospitals-source-crop.jpg",
      "content/validation/manual-guide/app2-highways-hospitals/page-150-highways-hospitals-source-crop.jpg",
      "content/validation/manual-guide/app2-highways-hospitals/page-151-highways-hospitals-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app2-highways-hospitals/app2-highways-hospitals-desktop.png",
      "content/validation/manual-guide/app2-highways-hospitals/app2-highways-hospitals-mobile.png"
    ],
    notes: [
      "Page 150 hospital map is rendered at runtime as an unchanged source-as-is x5 crop after owner decision on 2026-06-04.",
      "Spanish map labels remain only inside the source image; Russian legend and full hospital-name translations are selectable DOM text below the image.",
      "Yellow H/H1/H2 hospital markers, colored regions, boundaries, roads/lines, icons, layout, and colors remain byte-identical to the source crop."
    ]
  },
  blocks: [
    {
      id: "paseo-del-bajo-role",
      kind: "lead",
      sourceTextEs:
        "Paseo del Bajo es corredor vial preferencial para transito pesado y omnibus de larga distancia con mas de 19 asientos.",
      textRu:
        "Paseo del Bajo - предпочтительный дорожный коридор для тяжелого транспорта и междугородних пассажирских автобусов. Он отделяет такие потоки от пешеходов, частных автомобилей и городских автобусов, потому что они движутся на другом уровне."
    },
    {
      id: "paseo-del-bajo-allowed",
      kind: "list",
      titleRu: "Кто и как движется по Paseo del Bajo",
      sourceTextEs:
        "Camiones y acoplados de 12 toneladas o mas y omnibus de larga distancia con capacidad mayor de 19 asientos habilitados para turismo; velocidad maxima 60 km/h.",
      itemsRu: [
        "Коридор предназначен для грузовиков и прицепов с индивидуальной массой 12 t или больше.",
        "Также он предназначен для междугородних пассажирских автобусов с вместимостью больше 19 мест, допущенных для туристической деятельности, с пассажирами или без них.",
        "Он соединяет Autopista Illia, Autopista Buenos Aires-La Plata и Autopista 25 de Mayo.",
        "Максимальная скорость на разных уровнях - 60 km/h."
      ]
    },
    {
      id: "paseo-del-bajo-prohibitions",
      kind: "list",
      titleRu: "Запреты и неисправности",
      sourceTextEs:
        "Prohibida circulacion de ciclorodados, motovehiculos, automoviles, taxis, remises, lineas de colectivos y vehiculos no permitidos; prohibido estacionamiento y detencion 24 horas; avisar a AUSA ante imposibilidad de continuar.",
      itemsRu: [
        "Запрещено движение велосипедных транспортных средств, мототранспорта, автомобилей, такси, ремисов и линий общественного пассажирского автотранспорта.",
        "Запрещен любой транспорт, не разрешенный в соответствующем пункте источника.",
        "Стоянка и остановка запрещены 24 часа в сутки на обеих проезжих частях.",
        "Если транспорт не может продолжать нормальное движение, нужно уведомить AUSA; она отбуксирует и уберет транспорт."
      ]
    },
    {
      id: "paseo-del-bajo-exceptions",
      kind: "list",
      titleRu: "Исключительные маршруты при полной блокировке",
      sourceTextEs:
        "Solo ante contingencia vial que imposibilite totalmente la circulacion, transito pesado y omnibus de larga distancia circularan por arterias norte-sur y sur-norte indicadas.",
      itemsRu: [
        "Исключение действует только при дорожной непредвиденной ситуации, полностью блокирующей движение через Paseo del Bajo.",
        "Юг - север: от своего маршрута к Av. Elvira Rawson de Dellepiane, Calabria, Av. de los Italianos, Mariquita Sánchez de Thompson, Av. Int. Hernán M. Giralt, Cecilia Grierson, Av. Antártida Argentina, Av. Ramón S. Castillo, затем свой маршрут.",
        "Север - юг: от своего маршрута к Av. Ramón S. Castillo, Av. Antártida Argentina, San Martín, Av. Eduardo Madero, Av. Ing. Huergo, затем свой маршрут."
      ]
    },
    {
      id: "hospital-map-disposition",
      kind: "list",
      titleRu: "Карта больниц на странице источника",
      sourceTextEs:
        "Mapa de Hospitales Generales de Agudos: Dr. I. Pirovano, A. Zubizarreta, D. Velez Sarsfield, Dr. T. Alvarez, P. Pinero, J. M. Penna, Dr. C. Argerich, J. M. Ramos Mejia, Dr. E. Tornu, Dr. C. Durand, Dr. J. A. Fernandez, B. Rivadavia, Donacion F. Santojanni, Cecilia Grierson.",
      itemsRu: [
        "По решению владельца от 2026-06-04 карта на странице 150 показана как неизмененное исходное изображение высокого разрешения.",
        "Испанские подписи остаются только внутри самой карты; перевод, легенда и список больниц даны рядом и ниже обычным выбираемым русским текстом.",
        "Маркеры H/H1/H2, цвета районов, границы, дороги, линии, иконки и вся геометрия карты сохранены без очистки, дорисовки или ретуши."
      ]
    },
    {
      id: "hospital-map-source-visual",
      kind: "source-image-cards",
      titleRu: "Исходная карта больниц",
      sourceTextEs:
        "Mapa de Hospitales Generales de Agudos.",
      cards: [
        {
          id: "app2-hospital-map-source-card",
          titleRu: "Карта больниц CABA",
          sourcePage: 150,
          sourceRegion: { x: 1332, y: 1854, width: 780, height: 335 },
          assetPath: `${assetRoot}/hospital-map-source-as-is.png`,
          altRu:
            "Исходная карта общих больниц CABA с сохраненными испанскими подписями и маркерами H/H1/H2.",
          visibleSpanish: true,
          sourceImageException: {
            kind: "source-image-original-visible-text",
            visibleSpanishScope: "source-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          },
          bodyRu:
            "Карта показана без изменений из x5-фрагмента страницы 150. Испанские подписи не очищены и не переведены внутри изображения; русская легенда и полный список больниц приведены ниже."
        }
      ],
      visualNotes: [
        "The runtime map is byte-identical to the x5 page 150 source crop, not a redraw.",
        "Spanish map labels remain inside the source image under the owner-approved page-150 source-as-is exception.",
        "Russian legend and full hospital names are selectable DOM text below the unchanged image."
      ]
    },
    {
      id: "hospital-map-full-list",
      kind: "list",
      titleRu: "Полный список больниц с карты",
      sourceTextEs:
        "Dr. I. Pirovano, A. Zubizarreta, D. Velez Sarsfield, Dr. T. Alvarez, P. Pinero, J. M. Penna, Dr. C. Argerich, J. M. Ramos Mejia, Dr. E. Tornu, Dr. C. Durand, Dr. J. A. Fernandez, B. Rivadavia, Donacion F. Santojanni, Cecilia Grierson.",
      itemsRu: [
        "Доктор И. Пировано.",
        "А. Субисаррета.",
        "Д. Велес Сарсфилд.",
        "Доктор Т. Альварес.",
        "П. Пиньеро.",
        "Х. М. Пенна.",
        "Доктор К. Аргерич.",
        "Х. М. Рамос Мехия.",
        "Доктор Э. Торну.",
        "Доктор К. Дуранд.",
        "Доктор Х. А. Фернандес.",
        "Б. Ривадавия.",
        "Донасьон Ф. Сантоханни.",
        "Сесилия Гриерсон."
      ]
    },
    {
      id: "closing-public-transport",
      kind: "quote",
      sourceTextEs:
        "El transporte publico es de gran importancia para el funcionamiento, mantenimiento y crecimiento de una sociedad.",
      textRu:
        "Общественный транспорт имеет большое значение для функционирования, поддержания и развития общества."
    }
  ]
};
