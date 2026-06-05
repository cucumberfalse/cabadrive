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
        "Autopistas и другие vías rápidas требуют более строгого планирования: скорость выше, пространство для ошибки меньше, а решения о въезде, выезде, полосе и дистанции нужно принимать заранее."
    },
    {
      id: "highway-entry-rules",
      kind: "list",
      titleRu: "Ingreso: carriles de aceleración",
      sourceTextEs:
        "Ingreso a estas vías. Carriles de aceleración. Espejos retrovisores, luz de giro izquierda, espacio y velocidad adecuada.",
      itemsRu: [
        "Въезд выполняется через carriles de aceleración: водитель использует полосу разгона, чтобы набрать скорость до включения в основную calzada.",
        "Перед включением в поток нужно проверить tránsito de la vía principal через espejos retrovisores и боковой обзор.",
        "Включить luz de giro izquierda / левый указатель поворота, чтобы предупредить о incorporación.",
        "Найти безопасный espacio / gap в потоке и не вынуждать других водителей резко тормозить или менять полосу.",
        "К моменту входа в основную полосу выйти на velocidad adecuada del tramo, согласованную со скоростью движения на этой autopista или vía rápida."
      ]
    },
    {
      id: "highway-circulation-lane-use",
      kind: "list",
      titleRu: "Circulación: carril izquierdo, carril derecho и banquina",
      sourceTextEs:
        "Circulación. Carril izquierdo o de sobrepaso. Carril derecho. Banquina. Carriles de sobrepaso.",
      itemsRu: [
        "Carril izquierdo o de sobrepaso используется для sobrepaso/adelantamiento и движения с максимальной допустимой для этой vía скоростью при обгоне; не оставаться в нем без необходимости.",
        "Carril derecho - полоса обычного/default движения и tránsito lento; по ней должны двигаться грузовые и пассажирские транспортные средства более 3500 кг, кроме момента разрешенного sobrepaso.",
        "Carriles intermedios допускаются, когда справа нет другого igualmente disponible carril; маневры выполняются с luz de giro correspondiente.",
        "Banquina не является полосой обычного движения, остановки или стоянки. Ее нельзя использовать, чтобы объехать поток или продвинуться быстрее.",
        "Если движение медленное или возник затор, сохранять свою полосу и дистанцию; banquina остается пространством безопасности/аварийной зоны."
      ]
    },
    {
      id: "highway-exit-rules",
      kind: "list",
      titleRu: "Salida: carriles de desaceleración",
      sourceTextEs:
        "Salida de estas vías. Carriles de desaceleración. Está prohibido circular marcha atrás.",
      itemsRu: [
        "Если съезд пропущен, запрещено сдавать назад или circular marcha atrás; нужно продолжить до следующего разрешенного выхода.",
        "О намерении съехать сигнализировать заранее и заранее переместиться к carril derecho, не делая резких перестроений в последний момент.",
        "Для выхода использовать carril de desaceleración correspondiente; снижать скорость уже после ухода с основной полосы.",
        "Если carril de desaceleración отсутствует, заранее aproximarse a la salida por el carril derecho и выходить на velocidad adecuada."
      ]
    },
    {
      id: "highway-speed-signage-assistance",
      kind: "list",
      titleRu: "Velocidad, señales и vehículo inmovilizado",
      sourceTextEs:
        "Velocidad. Señales. Vehículo inmovilizado por accidente, avería, malestar físico u otra emergencia. Auxilio.",
      itemsRu: [
        "Velocidad на autopistas и otras vías rápidas подчиняется установленному máximo и señales viales; знак, tramo и категория транспорта уточняют общее правило.",
        "Нельзя estorbar la fluidez del tránsito: ехать заметно медленнее скорости своего carril без причины опасно.",
        "Если vehículo inmovilizado оказался на autopista/vía rápida из-за accidente, avería, malestar físico или другой emergency, нужно обозначить опасность balizas/intermitentes и запросить auxilio/asistencia.",
        "При необходимости помощи использовать teléfono celular, postes de auxilio или систему связи/телефонии autopista, чтобы вызвать auxilio vial и убрать транспорт с calzada как можно безопаснее.",
        "В ситуациях аварийной остановки сохраняется обязанность использовать chaleco reflectante там, где это требуется правилами."
      ]
    },
    {
      id: "highway-towing-guidance",
      kind: "list",
      titleRu: "Remolque / acarreo",
      sourceTextEs:
        "En el caso de remolque. Los vehículos remolcados deben abandonar la autopista en la primera salida posible.",
      itemsRu: [
        "В случае remolque/acarreo ориентироваться на vehículo destinado a ese fin: обычная частная машина не должна импровизированно тянуть аварийный автомобиль на скоростной дороге.",
        "Vehículos remolcados должны abandonar la autopista en la primera salida posible.",
        "Если неисправный или буксируемый транспорт оказался на vía rápida, приоритет - безопасно убрать его с дороги и запросить auxilio, а не продолжать движение с риском для потока."
      ]
    }
  ]
};
