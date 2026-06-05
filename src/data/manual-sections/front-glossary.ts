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
    "manual-front-matter"
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
      "Glossary pages 5-11 are implemented as selectable Russian DOM text with Spanish terms retained where useful.",
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
        "Глоссарий полезен как словарь экзаменационных формулировок: многие вопросы используют не бытовые слова, а юридические определения из source manual."
    },
    {
      id: "glossary-a-b",
      kind: "list",
      titleRu: "A-B",
      sourceTextEs: "Accidente de transito, Acera, Adelantamiento, Arteria, Arterias multicarriles, Automotor, Automovil, Autopista, Avenida, Baliza, Banquina, Bicicleta.",
      itemsRu: [
        "Accidente de tránsito: в источнике заменяется термином incidente de tránsito.",
        "Acera: тротуар, сектор общественной дороги рядом с проезжей частью для движения пешеходов.",
        "Adelantamiento: опережение без необходимости менять полосу.",
        "Arteria: городская общественная дорога для транспортного и, при необходимости, пешеходного движения.",
        "Arterias multicarriles: проспекты, автомагистрали, полуавтомагистрали и vías rápidas.",
        "Automotor: транспортное средство с движущей силой от мотора.",
        "Automóvil: автомоторное транспортное средство для перевозки людей, кроме водителя не более 8 мест.",
        "Autopista: многополосная дорога с физически разделенными направлениями, без пересечений в одном уровне и с контролируемыми въездами.",
        "Avenida: артерия с проезжей частью минимум 13 м; также некоторые артерии с расстоянием более 17,32 м между линиями застройки.",
        "Baliza: предупреждающая метка, опознавательный свет аварийного транспорта или аварийные мигающие огни.",
        "Banquina: зона рядом и параллельно проезжей части дорог, автомагистралей или путей для большей безопасности движения.",
        "Bicicleta: двухколесное велотранспортное средство."
      ]
    },
    {
      id: "glossary-b-c",
      kind: "list",
      titleRu: "B-C",
      sourceTextEs: "Bicisenda, Bocacalle, Bolardo, Bolson vehicular o de transito, Cajon azul, Calzada, Calle, Calle de convivencia, Carga y descarga, Carril, Chaleco reflectante, Ciclocarril, Ciclomotor, Ciclorodado, Ciclorodado con pedaleo asistido electricamente, Ciclovia, Circulacion, Colectora, Conductor/a, Cordon, Cuatriciclo motorizado.",
      itemsRu: [
        "Bicisenda: обозначенный и оборудованный сектор на тротуаре или в зеленой зоне для велотранспортных средств и средств индивидуальной мобильности.",
        "Bocacalle: общая поверхность дороги на пересечении двух или более артерий, включая пешеходные переходы.",
        "Bolardo: невысокий вертикальный элемент, ограничивающий проезд или стоянку.",
        "Bolsón vehicular o de tránsito: пешеходная разметка, не совпадающая с продолжением тротуара и сопровождаемая светофорным регулированием.",
        "Cajón azul: место на дороге для погрузки и разгрузки транспортных средств, занятых этой деятельностью.",
        "Calzada: проезжая часть, сектор дороги для движения транспортных средств.",
        "Calle: улица; в частном определении артерия с шириной проезжей части от 5 до 13 м.",
        "Calle de convivencia: улица совместного пользования с преимущественным пешеходным движением и ограниченным движением транспорта.",
        "Carga y descarga: погрузка и разгрузка только на строго необходимое время и в установленных пределах.",
        "Carril: продольная размеченная полоса для организации движения, обычно для одного ряда транспортных средств.",
        "Chaleco reflectante: светоотражающий жилет для видимости человека при плохой видимости.",
        "Ciclocarril: обозначенный сектор проезжей части для преимущественного движения велотранспортных средств и средств индивидуальной мобильности.",
        "Ciclomotor: двухколесное транспортное средство до 50 см3 или до 4 кВт, не более 50 км/ч.",
        "Ciclorodado: немоторизованное транспортное средство с двумя или более колесами, движимое усилием пользователя.",
        "Ciclorodado con pedaleo asistido eléctricamente: велотранспортное средство со вспомогательным электрическим мотором.",
        "Ciclovía: отделенный сектор проезжей части для исключительного движения велотранспортных средств и средств индивидуальной мобильности.",
        "Circulación: перемещение пешеходов и транспортных средств.",
        "Colectora: боковая проезжая часть, параллельная центральным полосам автомагистрали или vías rápidas.",
        "Conductor/a: лицо, непосредственно управляющее транспортным средством во время движения.",
        "Cordón: бордюр, отделяющий проезжую часть от тротуаров, островков или площадок.",
        "Cuatriciclo motorizado: моторное транспортное средство без кузова с четырьмя колесами не в одну линию."
      ]
    },
    {
      id: "glossary-d-i",
      kind: "list",
      titleRu: "D-I",
      sourceTextEs: "Darsena de estacionamiento o detencion, Detencion, Dispositivo de movilidad personal, Eje de calzada, Embotellamiento, Encrucijada, Estacionamiento, Giro, Guinada, Incidente de transito o incidente vial, Intervenciones peatonales, Isleta.",
      itemsRu: [
        "Dársena de estacionamiento o detención: защищенное место для стоянки или остановки, обычно шириной минимум 2 м.",
        "Detención: неподвижное нахождение у тротуара на строго необходимое время; также до 2 минут, если водитель не покидает транспорт.",
        "Dispositivo de movilidad personal: одноместное электрическое средство индивидуальной мобильности с одним или более колесами.",
        "Eje de calzada: продольная линия проезжей части, определяющая зоны с противоположными направлениями движения.",
        "Embotellamiento, atascamiento o congestión: скопление транспорта, затрудняющее или блокирующее движение.",
        "Encrucijada: перекресточная зона.",
        "Estacionamiento: неподвижное нахождение транспортного средства дольше, чем допускает определение detención.",
        "Giro: маневр изменения направления для перехода на другую артерию.",
        "Guiñada: быстрое включение и выключение дальнего света как предупреждение.",
        "Incidente de tránsito o incidente vial: событие с вредом людям или вещам во время движения по общественной дороге.",
        "Intervenciones peatonales: размеченные зоны проезжей части исключительно для пешеходного движения, иногда с городской мебелью.",
        "Isleta: сухая площадка или размеченная зона, направляющая транспортные потоки."
      ]
    },
    {
      id: "glossary-m-p",
      kind: "list",
      titleRu: "M-P",
      sourceTextEs: "Mano, Mensajeria urbana, Metrobus, Microplataforma de distribucion urbana, Motocicleta, Motofurgon, Motovehiculo, Parada de transporte publico, Pasaje, Paseo del Bajo, Peaton, Puente.",
      itemsRu: [
        "Mano: направление движения, которого должны придерживаться транспортные средства на артерии.",
        "Mensajería urbana: городская курьерская доставка на мототранспортном или велотранспортном средстве.",
        "Metrobus: массовая дифференцированная сеть автобусного транспорта, облегчающая пересадки.",
        "Microplataforma de distribución urbana: место для разукрупнения грузов, погрузки, разгрузки и временного хранения товаров.",
        "Motocicleta: двухколесное транспортное средство с мотором более 50 см3 или более 4 кВт, способное ехать быстрее 50 км/ч.",
        "Motofurgón: трехколесный или четырехколесный моторный транспорт для перевозки грузов.",
        "Motovehículo: моторное транспортное средство: мопед, моторизованный трицикл или квадрицикл, мотоцикл либо мотофургон.",
        "Parada de transporte público: вертикальный указатель места посадки и высадки пассажиров.",
        "Pasaje: артерия с шириной проезжей части меньше 5 м.",
        "Paseo del Bajo: коридор между северными и южными автомагистралями, обязательный для тяжелого транспорта и междугородних пассажирских автобусов.",
        "Peatón: лицо, которое движется или находится на дороге без транспортного средства.",
        "Puente: сооружение для прохода людей или проезда транспорта над пересекаемым уровнем."
      ]
    },
    {
      id: "glossary-r-v",
      kind: "list",
      titleRu: "R-V",
      sourceTextEs: "Reductor de velocidad, Rotonda, Ruptura de carga, Sector de parada, Semaforo, Semiautopista, Senda peatonal, Sobrepaso, Sube y Baja, Trafico, Transito, Triciclo, Triciclo motorizado, Tunel, Vehiculo, Vehiculo abandonado, Via publica, Via rapida.",
      itemsRu: [
        "Reductor de velocidad: искусственная неровность или сужающее устройство, заставляющее снизить скорость.",
        "Rotonda: круговое пересечение для распределения движения между двумя или более артериями.",
        "Ruptura de carga: прием и разгрузка товаров с перераспределением в другие транспортные средства.",
        "Sector de parada: зона на проезжей части рядом с остановкой пассажирского транспорта.",
        "Semáforo: световое устройство, попеременно предоставляющее право проезда, а в отдельных случаях и прохода пешеходам.",
        "Semiautopista: многополосная дорога с физически разделенными направлениями, некоторыми пересечениями в одном уровне и ограничением прямого въезда.",
        "Senda peatonal: сектор проезжей части для перехода пешеходов; если не размечен, совпадает с продолжением тротуара через проезжую часть.",
        "Sobrepaso: прохождение линии другого движущегося транспортного средства со сменой полосы.",
        "Sube y Baja: система организации движения вокруг образовательных учреждений для безопасного входа и выхода учеников.",
        "Tráfico: движение вещей или людей.",
        "Tránsito: перемещение вещей или людей из одного места в другое.",
        "Triciclo: трехколесное велотранспортное средство с колесами не в одну линию.",
        "Triciclo motorizado: моторное транспортное средство без кузова с тремя колесами не в одну линию.",
        "Túnel: сооружение для прохода людей или проезда транспорта ниже пересекаемого уровня.",
        "Vehículo: средство, с помощью которого человек или вещь может перевозиться по общественной дороге.",
        "Vehículo abandonado: транспортное средство или его часть на общественной территории в состоянии ухудшения, неподвижности и/или оставления.",
        "Vía pública: тротуар, автомагистраль, полуавтомагистраль, переулок, проход, улица, проспект, переход, площадь, парк или иной общественный дорожный простор.",
        "Vía rápida: Av. Intendente Cantilo, Av. Leopoldo Lugones, Av. Tte. Gral. Luis J. Dellepiane, Av. Gral. Paz, AU1, AU6, AU7, 9 de Julio Sur, Illia, R. Balbín, Av. 27 de Febrero и Paseo del Bajo."
      ]
    }
  ]
};
