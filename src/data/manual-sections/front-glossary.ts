import type { ManualGuideSectionContent } from "../manualGuide";

export const frontGlossarySection: ManualGuideSectionContent = {
  id: "front-glossary-content",
  sectionId: "front-glossary",
  titleRu: "Глоссарий",
  sourcePages: [5, 6, 7, 8, 9, 10, 11],
  sourceTitleEs: "Glosario",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-legal-detail",
    "manual-front-matter",
    "manual-glossary"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/front-glossary/page-005-glossary-source-crop.jpg",
      "content/validation/manual-guide/front-glossary/page-006-glossary-source-crop.jpg",
      "content/validation/manual-guide/front-glossary/page-007-glossary-source-crop.jpg",
      "content/validation/manual-guide/front-glossary/page-008-glossary-source-crop.jpg",
      "content/validation/manual-guide/front-glossary/page-009-glossary-source-crop.jpg",
      "content/validation/manual-guide/front-glossary/page-010-glossary-source-crop.jpg",
      "content/validation/manual-guide/front-glossary/page-011-glossary-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/front-glossary/front-glossary-desktop.png",
      "content/validation/manual-guide/front-glossary/front-glossary-mobile.png"
    ],
    notes: [
      "Glossary pages 5-11 are implemented as structured selectable DOM rows with Spanish terms, Russian translations in parentheses, and Russian definitions.",
      "No glossary source image is used at runtime; x5 source renders are validation evidence only.",
      "Exam-useful terms preserve legal/numeric road definitions such as avenida widths, stop duration, and fast-road names."
    ]
  },
  blocks: [
    {
      id: "glossary-study-note",
      kind: "lead",
      sourceTextEs: "Glosario",
      textRu:
        "Глоссарий полезен как словарь экзаменационных формулировок: многие вопросы используют не бытовые слова, а юридические определения из руководства."
    },
    {
      id: "glossary-a-b",
      kind: "glossary-list",
      titleRu: "A-B",
      sourceTextEs: "Accidente de transito, Acera, Adelantamiento, Arteria, Arterias multicarriles, Automotor, Automovil, Autopista, Avenida, Baliza, Banquina, Bicicleta.",
      items: [
        {
          id: "glossary-a-b-accidente-de-transito",
          termEs: "Accidente de tránsito",
          translationRu: "дорожное происшествие",
          definitionRu: "в учебном руководстве вместо этого используется термин incidente de tránsito (дорожный инцидент)."
        },
        {
          id: "glossary-a-b-acera",
          termEs: "Acera",
          translationRu: "тротуар",
          definitionRu: "сектор общественной дороги рядом с проезжей частью для движения пешеходов."
        },
        {
          id: "glossary-a-b-adelantamiento",
          termEs: "Adelantamiento",
          translationRu: "опережение",
          definitionRu: "маневр без необходимости менять полосу."
        },
        {
          id: "glossary-a-b-arteria",
          termEs: "Arteria",
          translationRu: "городская дорога",
          definitionRu: "общественная дорога для транспортного и, при необходимости, пешеходного движения."
        },
        {
          id: "glossary-a-b-arterias-multicarriles",
          termEs: "Arterias multicarriles",
          translationRu: "многополосные артерии",
          definitionRu: "проспекты, автомагистрали, полуавтомагистрали и vías rápidas (скоростные дороги)."
        },
        {
          id: "glossary-a-b-automotor",
          termEs: "Automotor",
          translationRu: "моторное транспортное средство",
          definitionRu: "транспортное средство с движущей силой от мотора."
        },
        {
          id: "glossary-a-b-automovil",
          termEs: "Automóvil",
          translationRu: "автомобиль",
          definitionRu: "автомоторное транспортное средство для перевозки людей, кроме водителя не более 8 мест."
        },
        {
          id: "glossary-a-b-autopista",
          termEs: "Autopista",
          translationRu: "автомагистраль",
          definitionRu: "многополосная дорога с физически разделенными направлениями, без пересечений в одном уровне и с контролируемыми въездами."
        },
        {
          id: "glossary-a-b-avenida",
          termEs: "Avenida",
          translationRu: "проспект",
          definitionRu: "артерия с проезжей частью минимум 13 м; также некоторые артерии с расстоянием более 17,32 м между линиями застройки."
        },
        {
          id: "glossary-a-b-baliza",
          termEs: "Baliza",
          translationRu: "аварийный маячок / аварийная сигнализация",
          definitionRu: "предупреждающая метка, опознавательный свет аварийного транспорта или аварийные мигающие огни."
        },
        {
          id: "glossary-a-b-banquina",
          termEs: "Banquina",
          translationRu: "обочина",
          definitionRu: "зона рядом и параллельно проезжей части дорог, автомагистралей или путей для большей безопасности движения."
        },
        {
          id: "glossary-a-b-bicicleta",
          termEs: "Bicicleta",
          translationRu: "велосипед",
          definitionRu: "двухколесное велотранспортное средство."
        }
      ]
    },
    {
      id: "glossary-b-c",
      kind: "glossary-list",
      titleRu: "B-C",
      sourceTextEs: "Bicisenda, Bocacalle, Bolardo, Bolson vehicular o de transito, Cajon azul, Calzada, Calle, Calle de convivencia, Carga y descarga, Carril, Chaleco reflectante, Ciclocarril, Ciclomotor, Ciclorodado, Ciclorodado con pedaleo asistido electricamente, Ciclovia, Circulacion, Colectora, Conductor/a, Cordon, Cuatriciclo motorizado.",
      items: [
        {
          id: "glossary-b-c-bicisenda",
          termEs: "Bicisenda",
          translationRu: "велодорожка вне проезжей части",
          definitionRu: "обозначенный и оборудованный сектор на тротуаре или в зеленой зоне для велотранспортных средств и средств индивидуальной мобильности."
        },
        {
          id: "glossary-b-c-bocacalle",
          termEs: "Bocacalle",
          translationRu: "зона перекрестка",
          definitionRu: "общая поверхность дороги на пересечении двух или более артерий, включая пешеходные переходы."
        },
        {
          id: "glossary-b-c-bolardo",
          termEs: "Bolardo",
          translationRu: "боллард / ограничительный столбик",
          definitionRu: "невысокий вертикальный элемент, ограничивающий проезд или стоянку."
        },
        {
          id: "glossary-b-c-bolson-vehicular-transito",
          termEs: "Bolsón vehicular o de tránsito",
          translationRu: "пешеходный накопитель",
          definitionRu: "пешеходная разметка, не совпадающая с продолжением тротуара и сопровождаемая светофорным регулированием."
        },
        {
          id: "glossary-b-c-cajon-azul",
          termEs: "Cajón azul",
          translationRu: "синий грузовой карман",
          definitionRu: "место на дороге для погрузки и разгрузки транспортных средств, занятых этой деятельностью."
        },
        {
          id: "glossary-b-c-calzada",
          termEs: "Calzada",
          translationRu: "проезжая часть",
          definitionRu: "сектор дороги для движения транспортных средств."
        },
        {
          id: "glossary-b-c-calle",
          termEs: "Calle",
          translationRu: "улица",
          definitionRu: "в частном определении артерия с шириной проезжей части от 5 до 13 м."
        },
        {
          id: "glossary-b-c-calle-de-convivencia",
          termEs: "Calle de convivencia",
          translationRu: "улица совместного пользования",
          definitionRu: "улица с преимущественным пешеходным движением и ограниченным движением транспорта."
        },
        {
          id: "glossary-b-c-carga-y-descarga",
          termEs: "Carga y descarga",
          translationRu: "погрузка и разгрузка",
          definitionRu: "действия только на строго необходимое время и в установленных пределах."
        },
        {
          id: "glossary-b-c-carril",
          termEs: "Carril",
          translationRu: "полоса движения",
          definitionRu: "продольная размеченная полоса для организации движения, обычно для одного ряда транспортных средств."
        },
        {
          id: "glossary-b-c-chaleco-reflectante",
          termEs: "Chaleco reflectante",
          translationRu: "светоотражающий жилет",
          definitionRu: "жилет для видимости человека при плохой видимости."
        },
        {
          id: "glossary-b-c-ciclocarril",
          termEs: "Ciclocarril",
          translationRu: "велополоса",
          definitionRu: "обозначенный сектор проезжей части для преимущественного движения велотранспортных средств и средств индивидуальной мобильности."
        },
        {
          id: "glossary-b-c-ciclomotor",
          termEs: "Ciclomotor",
          translationRu: "мопед",
          definitionRu: "двухколесное транспортное средство до 50 см3 или до 4 кВт, не более 50 км/ч."
        },
        {
          id: "glossary-b-c-ciclorodado",
          termEs: "Ciclorodado",
          translationRu: "велотранспорт",
          definitionRu: "немоторизованное транспортное средство с двумя или более колесами, движимое усилием пользователя."
        },
        {
          id: "glossary-b-c-ciclorodado-pedaleo-asistido-electricamente",
          termEs: "Ciclorodado con pedaleo asistido eléctricamente",
          translationRu: "электровелосипед с педальным ассистом",
          definitionRu: "велотранспортное средство со вспомогательным электрическим мотором."
        },
        {
          id: "glossary-b-c-ciclovia",
          termEs: "Ciclovía",
          translationRu: "выделенная велодорожка",
          definitionRu: "отделенный сектор проезжей части для исключительного движения велотранспортных средств и средств индивидуальной мобильности."
        },
        {
          id: "glossary-b-c-circulacion",
          termEs: "Circulación",
          translationRu: "движение",
          definitionRu: "перемещение пешеходов и транспортных средств."
        },
        {
          id: "glossary-b-c-colectora",
          termEs: "Colectora",
          translationRu: "сервисная боковая дорога",
          definitionRu: "боковая проезжая часть, параллельная центральным полосам автомагистрали или vías rápidas (скоростной дороги)."
        },
        {
          id: "glossary-b-c-conductor",
          termEs: "Conductor/a",
          translationRu: "водитель",
          definitionRu: "лицо, непосредственно управляющее транспортным средством во время движения."
        },
        {
          id: "glossary-b-c-cordon",
          termEs: "Cordón",
          translationRu: "бордюр",
          definitionRu: "элемент, отделяющий проезжую часть от тротуаров, островков или площадок."
        },
        {
          id: "glossary-b-c-cuatriciclo-motorizado",
          termEs: "Cuatriciclo motorizado",
          translationRu: "моторизованный квадрицикл",
          definitionRu: "моторное транспортное средство без кузова с четырьмя колесами не в одну линию."
        }
      ]
    },
    {
      id: "glossary-d-i",
      kind: "glossary-list",
      titleRu: "D-I",
      sourceTextEs: "Darsena de estacionamiento o detencion, Detencion, Dispositivo de movilidad personal, Eje de calzada, Embotellamiento, Encrucijada, Estacionamiento, Giro, Guinada, Incidente de transito o incidente vial, Intervenciones peatonales, Isleta.",
      items: [
        {
          id: "glossary-d-i-darsena-estacionamiento-detencion",
          termEs: "Dársena de estacionamiento o detención",
          translationRu: "карман для стоянки или остановки",
          definitionRu: "защищенное место для стоянки или остановки, обычно шириной минимум 2 м."
        },
        {
          id: "glossary-d-i-detencion",
          termEs: "Detención",
          translationRu: "остановка",
          definitionRu: "неподвижное нахождение у тротуара на строго необходимое время; также до 2 минут, если водитель не покидает транспорт."
        },
        {
          id: "glossary-d-i-dispositivo-movilidad-personal",
          termEs: "Dispositivo de movilidad personal",
          translationRu: "средство индивидуальной мобильности",
          definitionRu: "одноместное электрическое средство с одним или более колесами."
        },
        {
          id: "glossary-d-i-eje-de-calzada",
          termEs: "Eje de calzada",
          translationRu: "ось проезжей части",
          definitionRu: "продольная линия проезжей части, определяющая зоны с противоположными направлениями движения."
        },
        {
          id: "glossary-d-i-embotellamiento-atascamiento-congestion",
          termEs: "Embotellamiento, atascamiento o congestión",
          translationRu: "затор / пробка",
          definitionRu: "скопление транспорта, затрудняющее или блокирующее движение."
        },
        {
          id: "glossary-d-i-encrucijada",
          termEs: "Encrucijada",
          translationRu: "перекресток",
          definitionRu: "перекресточная зона."
        },
        {
          id: "glossary-d-i-estacionamiento",
          termEs: "Estacionamiento",
          translationRu: "стоянка",
          definitionRu: "неподвижное нахождение транспортного средства дольше, чем допускает определение detención (краткой остановки)."
        },
        {
          id: "glossary-d-i-giro",
          termEs: "Giro",
          translationRu: "поворот",
          definitionRu: "маневр изменения направления для перехода на другую артерию."
        },
        {
          id: "glossary-d-i-guinada",
          termEs: "Guiñada",
          translationRu: "мигание дальним светом",
          definitionRu: "быстрое включение и выключение дальнего света как предупреждение."
        },
        {
          id: "glossary-d-i-incidente-transito-vial",
          termEs: "Incidente de tránsito o incidente vial",
          translationRu: "дорожный инцидент",
          definitionRu: "событие с вредом людям или вещам во время движения по общественной дороге."
        },
        {
          id: "glossary-d-i-intervenciones-peatonales",
          termEs: "Intervenciones peatonales",
          translationRu: "пешеходные зоны на проезжей части",
          definitionRu: "размеченные зоны проезжей части исключительно для пешеходного движения, иногда с городской мебелью."
        },
        {
          id: "glossary-d-i-isleta",
          termEs: "Isleta",
          translationRu: "островок",
          definitionRu: "сухая площадка или размеченная зона, направляющая транспортные потоки."
        }
      ]
    },
    {
      id: "glossary-m-p",
      kind: "glossary-list",
      titleRu: "M-P",
      sourceTextEs: "Mano, Mensajeria urbana, Metrobus, Microplataforma de distribucion urbana, Motocicleta, Motofurgon, Motovehiculo, Parada de transporte publico, Pasaje, Paseo del Bajo, Peaton, Puente.",
      items: [
        {
          id: "glossary-m-p-mano",
          termEs: "Mano",
          translationRu: "направление движения",
          definitionRu: "направление, которого должны придерживаться транспортные средства на артерии."
        },
        {
          id: "glossary-m-p-mensajeria-urbana",
          termEs: "Mensajería urbana",
          translationRu: "городская доставка",
          definitionRu: "городская курьерская доставка на мототранспортном или велотранспортном средстве."
        },
        {
          id: "glossary-m-p-metrobus",
          termEs: "Metrobus",
          translationRu: "метробус",
          definitionRu: "массовая дифференцированная сеть автобусного транспорта, облегчающая пересадки."
        },
        {
          id: "glossary-m-p-microplataforma-distribucion-urbana",
          termEs: "Microplataforma de distribución urbana",
          translationRu: "городская микроплатформа распределения",
          definitionRu: "место для разукрупнения грузов, погрузки, разгрузки и временного хранения товаров."
        },
        {
          id: "glossary-m-p-motocicleta",
          termEs: "Motocicleta",
          translationRu: "мотоцикл",
          definitionRu: "двухколесное транспортное средство с мотором более 50 см3 или более 4 кВт, способное ехать быстрее 50 км/ч."
        },
        {
          id: "glossary-m-p-motofurgon",
          termEs: "Motofurgón",
          translationRu: "мотогрузовик",
          definitionRu: "трехколесный или четырехколесный моторный транспорт для перевозки грузов."
        },
        {
          id: "glossary-m-p-motovehiculo",
          termEs: "Motovehículo",
          translationRu: "мототранспортное средство",
          definitionRu: "моторное транспортное средство: мопед, моторизованный трицикл или квадрицикл, мотоцикл либо мотофургон."
        },
        {
          id: "glossary-m-p-parada-transporte-publico",
          termEs: "Parada de transporte público",
          translationRu: "остановка общественного транспорта",
          definitionRu: "вертикальный указатель места посадки и высадки пассажиров."
        },
        {
          id: "glossary-m-p-pasaje",
          termEs: "Pasaje",
          translationRu: "переулок / проезд",
          definitionRu: "артерия с шириной проезжей части меньше 5 м."
        },
        {
          id: "glossary-m-p-paseo-del-bajo",
          termEs: "Paseo del Bajo",
          translationRu: "коридор Пасео-дель-Бахо",
          definitionRu: "коридор между северными и южными автомагистралями, обязательный для тяжелого транспорта и междугородних пассажирских автобусов."
        },
        {
          id: "glossary-m-p-peaton",
          termEs: "Peatón",
          translationRu: "пешеход",
          definitionRu: "лицо, которое движется или находится на дороге без транспортного средства."
        },
        {
          id: "glossary-m-p-puente",
          termEs: "Puente",
          translationRu: "мост",
          definitionRu: "сооружение для прохода людей или проезда транспорта над пересекаемым уровнем."
        }
      ]
    },
    {
      id: "glossary-r-v",
      kind: "glossary-list",
      titleRu: "R-V",
      sourceTextEs: "Reductor de velocidad, Rotonda, Ruptura de carga, Sector de parada, Semaforo, Semiautopista, Senda peatonal, Sobrepaso, Sube y Baja, Trafico, Transito, Triciclo, Triciclo motorizado, Tunel, Vehiculo, Vehiculo abandonado, Via publica, Via rapida.",
      items: [
        {
          id: "glossary-r-v-reductor-de-velocidad",
          termEs: "Reductor de velocidad",
          translationRu: "замедлитель скорости",
          definitionRu: "искусственная неровность или сужающее устройство, заставляющее снизить скорость."
        },
        {
          id: "glossary-r-v-rotonda",
          termEs: "Rotonda",
          translationRu: "круговое пересечение",
          definitionRu: "пересечение для распределения движения между двумя или более артериями."
        },
        {
          id: "glossary-r-v-ruptura-de-carga",
          termEs: "Ruptura de carga",
          translationRu: "разукрупнение груза",
          definitionRu: "прием и разгрузка товаров с перераспределением в другие транспортные средства."
        },
        {
          id: "glossary-r-v-sector-de-parada",
          termEs: "Sector de parada",
          translationRu: "сектор остановки",
          definitionRu: "зона на проезжей части рядом с остановкой пассажирского транспорта."
        },
        {
          id: "glossary-r-v-semaforo",
          termEs: "Semáforo",
          translationRu: "светофор",
          definitionRu: "световое устройство, попеременно предоставляющее право проезда, а в отдельных случаях и прохода пешеходам."
        },
        {
          id: "glossary-r-v-semiautopista",
          termEs: "Semiautopista",
          translationRu: "полуавтомагистраль",
          definitionRu: "многополосная дорога с физически разделенными направлениями, некоторыми пересечениями в одном уровне и ограничением прямого въезда."
        },
        {
          id: "glossary-r-v-senda-peatonal",
          termEs: "Senda peatonal",
          translationRu: "пешеходный переход",
          definitionRu: "сектор проезжей части для перехода пешеходов; если не размечен, совпадает с продолжением тротуара через проезжую часть."
        },
        {
          id: "glossary-r-v-sobrepaso",
          termEs: "Sobrepaso",
          translationRu: "обгон",
          definitionRu: "прохождение линии другого движущегося транспортного средства со сменой полосы."
        },
        {
          id: "glossary-r-v-sube-y-baja",
          termEs: "Sube y Baja",
          translationRu: "школьная посадка и высадка",
          definitionRu: "система организации движения вокруг образовательных учреждений для безопасного входа и выхода учеников."
        },
        {
          id: "glossary-r-v-trafico",
          termEs: "Tráfico",
          translationRu: "трафик",
          definitionRu: "движение вещей или людей."
        },
        {
          id: "glossary-r-v-transito",
          termEs: "Tránsito",
          translationRu: "дорожное движение",
          definitionRu: "перемещение вещей или людей из одного места в другое."
        },
        {
          id: "glossary-r-v-triciclo",
          termEs: "Triciclo",
          translationRu: "трехколесный велосипед",
          definitionRu: "трехколесное велотранспортное средство с колесами не в одну линию."
        },
        {
          id: "glossary-r-v-triciclo-motorizado",
          termEs: "Triciclo motorizado",
          translationRu: "моторизованный трицикл",
          definitionRu: "моторное транспортное средство без кузова с тремя колесами не в одну линию."
        },
        {
          id: "glossary-r-v-tunel",
          termEs: "Túnel",
          translationRu: "туннель",
          definitionRu: "сооружение для прохода людей или проезда транспорта ниже пересекаемого уровня."
        },
        {
          id: "glossary-r-v-vehiculo",
          termEs: "Vehículo",
          translationRu: "транспортное средство",
          definitionRu: "средство, с помощью которого человек или вещь может перевозиться по общественной дороге."
        },
        {
          id: "glossary-r-v-vehiculo-abandonado",
          termEs: "Vehículo abandonado",
          translationRu: "брошенное транспортное средство",
          definitionRu: "транспортное средство или его часть на общественной территории в состоянии ухудшения, неподвижности и/или оставления."
        },
        {
          id: "glossary-r-v-via-publica",
          termEs: "Vía pública",
          translationRu: "дорога общего пользования",
          definitionRu: "тротуар, автомагистраль, полуавтомагистраль, переулок, проход, улица, проспект, переход, площадь, парк или иной общественный дорожный простор."
        },
        {
          id: "glossary-r-v-via-rapida",
          termEs: "Vía rápida",
          translationRu: "скоростная дорога",
          definitionRu: "Av. Intendente Cantilo, Av. Leopoldo Lugones, Av. Tte. Gral. Luis J. Dellepiane, Av. Gral. Paz, AU1, AU6, AU7, 9 de Julio Sur, Illia, R. Balbín, Av. 27 de Febrero и Paseo del Bajo."
        }
      ]
    }
  ]
};
