import type { ManualGuideSectionContent } from "../manualGuide";

export const ch3HighwaysSection: ManualGuideSectionContent = {
  id: "ch3-highways-content",
  sectionId: "ch3-highways",
  titleRu: "Движение по автомагистралям и другим скоростным дорогам",
  sourcePages: [78],
  sourceTitleEs: "Circulacion por autopistas y otras vias rapidas",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: ["content/validation/manual-guide/ch3-highways/page-078-highways-source-crop.jpg"],
    russianScreenshots: [
      "content/validation/manual-guide/ch3-highways/ch3-highways-desktop.png",
      "content/validation/manual-guide/ch3-highways/ch3-highways-mobile.png"
    ],
    notes: [
      "Source PDF page 78 is converted as the Chapter 3 highways and fast roads section.",
      "The runtime section keeps the page 78 infographic rules as selectable Russian list groups; source visual material is x5 reference evidence.",
      "No highway diagram, sign, or marking image is modified."
    ]
  },
  blocks: [
    {
      id: "highway-lead",
      kind: "lead",
      sourceTextEs:
        "Conducción en autopistas y otras vías rápidas.",
      textRu:
        "Autopistas (автомагистрали) и vías rápidas (скоростные дороги) требуют более строгого планирования: скорость выше, пространство для ошибки меньше, а решения о въезде, выезде, полосе и дистанции нужно принимать заранее."
    },
    {
      id: "highway-entry-rules",
      kind: "list",
      titleRu: "Ingreso: carriles de aceleración (въезд: полосы разгона)",
      sourceTextEs:
        "Ingreso a estas vías. Carriles de aceleración. Espejos retrovisores, luz de giro izquierda, espacio y velocidad adecuada.",
      itemsRu: [
        "Въезд выполняется через carriles de aceleración (полосы разгона): водитель использует их, чтобы набрать скорость до включения в основную calzada (проезжую часть).",
        "Перед включением в поток нужно проверить tránsito de la vía principal (движение по основной дороге) через espejos retrovisores (зеркала заднего вида) и боковой обзор.",
        "Включить luz de giro izquierda (левый указатель поворота), чтобы предупредить об incorporación (включении в поток).",
        "Найти безопасный espacio / gap (свободный промежуток) в потоке и не вынуждать других водителей резко тормозить или менять полосу.",
        "К моменту входа в основную полосу выйти на velocidad adecuada del tramo (подходящую скорость для этого участка), согласованную со скоростью движения на этой autopista (автомагистрали) или vía rápida (скоростной дороге)."
      ]
    },
    {
      id: "highway-circulation-lane-use",
      kind: "list",
      titleRu: "Движение: левая полоса, правая полоса и обочина",
      sourceTextEs:
        "Circulación. Carril izquierdo o de sobrepaso. Carril derecho. Banquina. Carriles de sobrepaso.",
      itemsRu: [
        "Carril izquierdo o de sobrepaso (левая полоса или полоса опережения) используется для sobrepaso/adelantamiento (опережения/обгона) и движения с максимальной допустимой для этой vía (дороги) скоростью при обгоне; не оставаться в нем без необходимости.",
        "Carril derecho (правая полоса) - полоса обычного движения и tránsito lento (медленного движения); по ней должны двигаться грузовые и пассажирские транспортные средства более 3500 кг, кроме момента разрешенного sobrepaso (опережения).",
        "Промежуточные полосы допускаются, когда справа нет другой равно доступной полосы; маневры выполняются с соответствующим указателем поворота.",
        "Banquina (обочина) не является полосой обычного движения, остановки или стоянки. Ее нельзя использовать, чтобы объехать поток или продвинуться быстрее.",
        "Если движение медленное или возник затор, сохранять свою полосу и дистанцию; banquina (обочина) остается пространством безопасности/аварийной зоны."
      ]
    },
    {
      id: "highway-exit-rules",
      kind: "list",
      titleRu: "Выезд: полосы замедления",
      sourceTextEs:
        "Salida de estas vías. Carriles de desaceleración. Está prohibido circular marcha atrás.",
      itemsRu: [
        "Если съезд пропущен, запрещено сдавать назад или circular marcha atrás (двигаться задним ходом); нужно продолжить до следующего разрешенного выхода.",
        "О намерении съехать сигнализировать заранее и заранее переместиться к carril derecho (правой полосе), не делая резких перестроений в последний момент.",
        "Для выхода использовать carril de desaceleración (полосу замедления); снижать скорость уже после ухода с основной полосы.",
        "Если carril de desaceleración (полоса замедления) отсутствует, заранее приблизиться к выходу по carril derecho (правой полосе) и выходить на velocidad adecuada (подходящей скорости)."
      ]
    },
    {
      id: "highway-speed-signage-assistance",
      kind: "list",
      titleRu: "Скорость, знаки и обездвиженный автомобиль",
      sourceTextEs:
        "Velocidad. Señales. Vehículo inmovilizado por accidente, avería, malestar físico u otra emergencia. Auxilio.",
      itemsRu: [
        "Velocidad (скорость) на autopistas (автомагистралях) и otras vías rápidas (других скоростных дорогах) подчиняется установленному máximo (максимуму) и señales viales (дорожным знакам); знак, tramo (участок) и категория транспорта уточняют общее правило.",
        "Нельзя estorbar la fluidez del tránsito (мешать плавности движения): ехать заметно медленнее скорости своего carril (полосы) без причины опасно.",
        "Если vehículo inmovilizado (обездвиженный автомобиль) оказался на autopista/vía rápida (автомагистрали/скоростной дороге) из-за accidente (аварии), avería (поломки), malestar físico (плохого самочувствия) или другой emergency (экстренной ситуации), нужно обозначить опасность balizas/intermitentes (аварийной сигнализацией/мигающими огнями) и запросить auxilio/asistencia (помощь/техническую помощь).",
        "При необходимости помощи использовать teléfono celular (мобильный телефон), postes de auxilio (колонны экстренной помощи) или систему связи/телефонии autopista (автомагистрали), чтобы вызвать auxilio vial (дорожную помощь) и убрать транспорт с calzada (проезжей части) как можно безопаснее.",
        "В ситуациях аварийной остановки сохраняется обязанность использовать chaleco reflectante (световозвращающий жилет) там, где это требуется правилами."
      ]
    },
    {
      id: "highway-towing-guidance",
      kind: "list",
      titleRu: "Буксировка и эвакуация",
      sourceTextEs:
        "En el caso de remolque. Los vehículos remolcados deben abandonar la autopista en la primera salida posible.",
      itemsRu: [
        "В случае remolque/acarreo (буксировки/эвакуации) ориентироваться на vehículo destinado a ese fin (транспорт, предназначенный для этой цели): обычная частная машина не должна импровизированно тянуть аварийный автомобиль на скоростной дороге.",
        "Vehículos remolcados (буксируемые транспортные средства) должны abandonar la autopista en la primera salida posible (покинуть автомагистраль на первом возможном съезде).",
        "Если неисправный или буксируемый транспорт оказался на vía rápida (скоростной дороге), приоритет - безопасно убрать его с дороги и запросить auxilio (помощь), а не продолжать движение с риском для потока."
      ]
    }
  ]
};
