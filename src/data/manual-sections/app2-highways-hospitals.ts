import type { ManualGuideSectionContent } from "../manualGuide";

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
      "Page 150 hospital map is retained as x5 source evidence and represented in runtime as selectable Russian DOM text/list to avoid showing Spanish map labels or using non-compliant broad cleanup.",
      "No source map pixels, photos, signs, or road markings are modified."
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
        "Страница 150 источника содержит карту общих больниц для острых случаев. В русской версии она передана как текстовый список, чтобы не показывать испанские подписи карты и не выполнять недопустимую грубую очистку инфографики.",
        "На карте перечислены Dr. I. Pirovano, A. Zubizarreta, D. Vélez Sarsfield, Dr. T. Álvarez, P. Piñero, J. M. Penna, Dr. C. Argerich, J. M. Ramos Mejía, Dr. E. Tornú, Dr. C. Durand, Dr. J. A. Fernández, B. Rivadavia, Donación F. Santojanni и Cecilia Grierson.",
        "Адреса сохранены как официальные названия улиц источника в доказательственном изображении страницы 150; для обучения важно распознать, что Приложение II отдельно указывает больничную карту как справочную часть пассажирского транспорта."
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
