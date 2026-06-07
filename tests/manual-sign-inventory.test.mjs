import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

const inventoryPath = "src/data/manual-signs/app4SignEntries.json";
const scriptPath = "scripts/manual-sign-inventory.mjs";
const appPath = "src/App.tsx";
const sectionPaths = [
  "src/data/manual-sections/app4-signs-regulatory.ts",
  "src/data/manual-sections/app4-signs-warning.ts",
  "src/data/manual-sections/app4-signs-informational.ts",
  "src/data/manual-sections/app4-signs-temporary.ts",
  "src/data/manual-sections/app4-signs-horizontal.ts",
  "src/data/manual-sections/app4-signs-traffic-lights.ts"
];

function loadInventory() {
  return JSON.parse(readFileSync(inventoryPath, "utf8"));
}

const regulatoryPage185Rows = [
  {
    entryKind: "category-heading",
    spanishLabel: "Reglamentarias",
    russianTranslation: "Регулирующие",
    cropRegion: { x: 132, y: 130, width: 245, height: 36 },
    sourceSheetLabelEvidence: "visible source heading: Reglamentarias"
  },
  {
    entryKind: "category-heading",
    spanishLabel: "De prohibición",
    russianTranslation: "Запрещающие",
    cropRegion: { x: 132, y: 170, width: 165, height: 30 },
    sourceSheetLabelEvidence: "visible source heading: De prohibición"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO AVANZAR",
    russianTranslation: "Проезд запрещен",
    cropRegion: { x: 178, y: 215, width: 72, height: 74 },
    sourceSheetLabelEvidence: "visible source label: NO AVANZAR"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CONTRAMANO",
    russianTranslation: "Встречное направление",
    cropRegion: { x: 264, y: 215, width: 74, height: 74 },
    sourceSheetLabelEvidence: "visible source label: CONTRAMANO"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Automóvil",
    russianTranslation: "Движение автомобилей запрещено",
    cropRegion: { x: 350, y: 215, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Automóvil)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Moto",
    russianTranslation: "Движение мотоциклов запрещено",
    cropRegion: { x: 436, y: 215, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Moto)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Bicicleta",
    russianTranslation: "Движение велосипедов запрещено",
    cropRegion: { x: 520, y: 215, width: 88, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Bicicleta)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Camión",
    russianTranslation: "Движение грузовиков запрещено",
    cropRegion: { x: 177, y: 302, width: 78, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Camión)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Acoplado",
    russianTranslation: "Движение с прицепом запрещено",
    cropRegion: { x: 262, y: 302, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Acoplado)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Peatón",
    russianTranslation: "Движение пешеходов запрещено",
    cropRegion: { x: 349, y: 302, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Peatón)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Carro de tracción animal",
    russianTranslation: "Движение гужевых повозок запрещено",
    cropRegion: { x: 428, y: 302, width: 108, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Carro de tracción animal)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Jinetes",
    russianTranslation: "Движение всадников запрещено",
    cropRegion: { x: 520, y: 302, width: 88, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Jinetes)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Carro a mano",
    russianTranslation: "Движение ручных тележек запрещено",
    cropRegion: { x: 176, y: 390, width: 84, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Carro a mano)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CIRCULAR",
    variant: "Tractor agrícola",
    russianTranslation: "Движение сельхозтракторов запрещено",
    cropRegion: { x: 260, y: 390, width: 92, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO CIRCULAR (Tractor agrícola)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO GIRAR",
    variant: "Izquierda",
    russianTranslation: "Поворот налево запрещен",
    cropRegion: { x: 351, y: 390, width: 78, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO GIRAR (Izquierda)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO GIRAR",
    variant: "Derecha",
    russianTranslation: "Поворот направо запрещен",
    cropRegion: { x: 436, y: 390, width: 80, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO GIRAR (Derecha)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO GIRAR EN U",
    russianTranslation: "Разворот запрещен",
    cropRegion: { x: 522, y: 390, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO GIRAR EN U"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ADELANTAR",
    russianTranslation: "Обгон запрещен",
    cropRegion: { x: 176, y: 477, width: 82, height: 78 },
    sourceSheetLabelEvidence: "visible source label: NO ADELANTAR"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO RUIDOS MOLESTOS",
    russianTranslation: "Раздражающие шумы запрещены",
    cropRegion: { x: 263, y: 477, width: 82, height: 84 },
    sourceSheetLabelEvidence: "visible source label: NO RUIDOS MOLESTOS"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    russianTranslation: "Стоянка запрещена",
    cropRegion: { x: 351, y: 477, width: 78, height: 78 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Acarreo de infractores - placa horaria superior 1",
    russianTranslation: "Стоянка запрещена, эвакуация нарушителей",
    cropRegion: { x: 436, y: 477, width: 88, height: 125 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Acarreo de infractores - placa horaria superior 1)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Acarreo de infractores - placa horaria superior 2",
    russianTranslation: "Стоянка запрещена, эвакуация нарушителей",
    cropRegion: { x: 520, y: 477, width: 92, height: 125 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Acarreo de infractores - placa horaria superior 2)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Entre discos",
    russianTranslation: "Стоянка запрещена между знаками",
    cropRegion: { x: 176, y: 590, width: 88, height: 88 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Entre discos)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Entre aceras",
    russianTranslation: "Стоянка запрещена между тротуарами",
    cropRegion: { x: 262, y: 590, width: 88, height: 88 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Entre aceras)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Zona de Caudales - flecha derecha",
    russianTranslation: "Стоянка запрещена в зоне инкассации / денежных перевозок",
    cropRegion: { x: 346, y: 590, width: 96, height: 126 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Zona de Caudales - flecha derecha)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR",
    variant: "Zona de Caudales - flecha izquierda",
    russianTranslation: "Стоянка запрещена в зоне инкассации / денежных перевозок",
    cropRegion: { x: 433, y: 590, width: 96, height: 126 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR (Zona de Caudales - flecha izquierda)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR NI DETENERSE",
    russianTranslation: "Остановка и стоянка запрещены",
    cropRegion: { x: 518, y: 590, width: 94, height: 88 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR NI DETENERSE"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO ESTACIONAR NI DETENERSE",
    variant: "Sobre la ciclovía",
    russianTranslation: "Остановка и стоянка на велодорожке запрещены",
    cropRegion: { x: 176, y: 716, width: 96, height: 140 },
    sourceSheetLabelEvidence: "visible source label: NO ESTACIONAR NI DETENERSE (Sobre la ciclovía)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NO CAMBIAR DE CARRIL",
    russianTranslation: "Перестроение запрещено",
    cropRegion: { x: 262, y: 716, width: 86, height: 96 },
    sourceSheetLabelEvidence: "visible source label: NO CAMBIAR DE CARRIL"
  }
];

const regulatoryPage186Rows = [
  {
    entryKind: "category-heading",
    spanishLabel: "De restricción",
    russianTranslation: "Ограничительные",
    cropRegion: { x: 78, y: 132, width: 180, height: 34 },
    sourceSheetLabelEvidence: "visible source heading: De restricción"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "LIMITACIÓN DE PESO",
    russianTranslation: "Ограничение массы",
    cropRegion: { x: 126, y: 165, width: 66, height: 78 },
    sourceSheetLabelEvidence: "visible source label: LIMITACIÓN DE PESO"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "LIMITACIÓN DE PESO POR EJE",
    russianTranslation: "Ограничение нагрузки на ось",
    cropRegion: { x: 210, y: 165, width: 82, height: 78 },
    sourceSheetLabelEvidence: "visible source label: LIMITACIÓN DE PESO POR EJE"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "LIMITACIÓN DE ALTURA",
    russianTranslation: "Ограничение высоты",
    cropRegion: { x: 292, y: 165, width: 86, height: 78 },
    sourceSheetLabelEvidence: "visible source label: LIMITACIÓN DE ALTURA"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "LIMITACIÓN DE ANCHO",
    russianTranslation: "Ограничение ширины",
    cropRegion: { x: 384, y: 165, width: 72, height: 78 },
    sourceSheetLabelEvidence: "visible source label: LIMITACIÓN DE ANCHO"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "LIMITACIÓN DE LARGO DE VEHÍCULO",
    russianTranslation: "Ограничение длины транспортного средства",
    cropRegion: { x: 458, y: 165, width: 108, height: 78 },
    sourceSheetLabelEvidence: "visible source label: LIMITACIÓN DE LARGO DE VEHÍCULO"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "LÍMITE DE VELOCIDAD MÁXIMA",
    russianTranslation: "Максимальная скорость",
    cropRegion: { x: 112, y: 250, width: 106, height: 86 },
    sourceSheetLabelEvidence: "visible source label: LÍMITE DE VELOCIDAD MÁXIMA"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "LÍMITE DE VELOCIDAD MÍNIMA",
    russianTranslation: "Минимальная скорость",
    cropRegion: { x: 208, y: 250, width: 88, height: 86 },
    sourceSheetLabelEvidence: "visible source label: LÍMITE DE VELOCIDAD MÍNIMA"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ESTACIONAMIENTO EXCLUSIVO",
    russianTranslation: "Зарезервированная стоянка",
    cropRegion: { x: 290, y: 250, width: 90, height: 86 },
    sourceSheetLabelEvidence: "visible source label: ESTACIONAMIENTO EXCLUSIVO"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ESTACIONAMIENTO EXCLUSIVO",
    variant: "Cajón azul",
    russianTranslation: "Зарезервированное синее место",
    cropRegion: { x: 372, y: 250, width: 92, height: 150 },
    sourceSheetLabelEvidence: "visible source label: ESTACIONAMIENTO EXCLUSIVO (Cajón azul)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ESTACIONAMIENTO EXCLUSIVO",
    variant: "Discapacitados",
    russianTranslation: "Стоянка для людей с инвалидностью",
    cropRegion: { x: 458, y: 250, width: 104, height: 150 },
    sourceSheetLabelEvidence: "visible source label: ESTACIONAMIENTO EXCLUSIVO (Discapacitados)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CIRCULACIÓN EXCLUSIVA",
    variant: "Transporte público",
    russianTranslation: "Движение только общественного транспорта",
    cropRegion: { x: 112, y: 371, width: 106, height: 104 },
    sourceSheetLabelEvidence: "visible source label: CIRCULACIÓN EXCLUSIVA (Transporte público)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CIRCULACIÓN EXCLUSIVA",
    variant: "Moto",
    russianTranslation: "Движение только мотоциклов",
    cropRegion: { x: 206, y: 371, width: 90, height: 104 },
    sourceSheetLabelEvidence: "visible source label: CIRCULACIÓN EXCLUSIVA (Moto)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CIRCULACIÓN EXCLUSIVA",
    variant: "Bicicleta",
    russianTranslation: "Движение только велосипедов",
    cropRegion: { x: 290, y: 371, width: 92, height: 104 },
    sourceSheetLabelEvidence: "visible source label: CIRCULACIÓN EXCLUSIVA (Bicicleta)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CIRCULACIÓN EXCLUSIVA",
    variant: "Jinetes",
    russianTranslation: "Движение только всадников",
    cropRegion: { x: 376, y: 371, width: 92, height: 104 },
    sourceSheetLabelEvidence: "visible source label: CIRCULACIÓN EXCLUSIVA (Jinetes)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CIRCULACIÓN EXCLUSIVA",
    variant: "Peatones",
    russianTranslation: "Движение только пешеходов",
    cropRegion: { x: 462, y: 371, width: 92, height: 104 },
    sourceSheetLabelEvidence: "visible source label: CIRCULACIÓN EXCLUSIVA (Peatones)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CIRCULACIÓN EXCLUSIVA",
    variant: "Convivencia",
    russianTranslation: "Движение только в зоне совместного пользования",
    cropRegion: { x: 120, y: 478, width: 98, height: 104 },
    sourceSheetLabelEvidence: "visible source label: CIRCULACIÓN EXCLUSIVA (Convivencia)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "USO DE CADENAS PARA NIEVE",
    russianTranslation: "Использование цепей для снега",
    cropRegion: { x: 206, y: 478, width: 94, height: 92 },
    sourceSheetLabelEvidence: "visible source label: USO DE CADENAS PARA NIEVE"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "GIRO OBLIGATORIO",
    variant: "Derecha",
    russianTranslation: "Обязательный поворот направо",
    cropRegion: { x: 292, y: 478, width: 92, height: 92 },
    sourceSheetLabelEvidence: "visible source label: GIRO OBLIGATORIO (Derecha)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "GIRO OBLIGATORIO",
    variant: "Izquierda",
    russianTranslation: "Обязательный поворот налево",
    cropRegion: { x: 382, y: 478, width: 92, height: 92 },
    sourceSheetLabelEvidence: "visible source label: GIRO OBLIGATORIO (Izquierda)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "SENTIDO DE CIRCULACIÓN",
    variant: "Derecha",
    russianTranslation: "Направление движения направо",
    cropRegion: { x: 462, y: 478, width: 102, height: 112 },
    sourceSheetLabelEvidence: "visible source label: SENTIDO DE CIRCULACIÓN (Derecha)"
  },
  {
    entryKind: "category-heading",
    spanishLabel: "De prioridad",
    russianTranslation: "Приоритет",
    cropRegion: { x: 78, y: 548, width: 180, height: 34 },
    sourceSheetLabelEvidence: "visible source heading: De prioridad"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PARE",
    russianTranslation: "Стоп",
    cropRegion: { x: 122, y: 590, width: 72, height: 82 },
    sourceSheetLabelEvidence: "visible source label: PARE"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CEDA EL PASO",
    russianTranslation: "Уступите дорогу",
    cropRegion: { x: 208, y: 590, width: 82, height: 78 },
    sourceSheetLabelEvidence: "visible source label: CEDA EL PASO"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CEDA EL PASO",
    variant: "A ciclistas y peatones",
    russianTranslation: "Уступите велосипедистам и пешеходам",
    cropRegion: { x: 288, y: 590, width: 102, height: 124 },
    sourceSheetLabelEvidence: "visible source label: CEDA EL PASO (A ciclistas y peatones)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PREFERENCIA DE AVANCE",
    russianTranslation: "Преимущество встречного разъезда",
    cropRegion: { x: 382, y: 590, width: 86, height: 84 },
    sourceSheetLabelEvidence: "visible source label: PREFERENCIA DE AVANCE"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "DESCIENDA DE LA BICICLETA",
    russianTranslation: "Сойдите с велосипеда",
    cropRegion: { x: 462, y: 590, width: 104, height: 118 },
    sourceSheetLabelEvidence: "visible source label: DESCIENDA DE LA BICICLETA"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "BARRERAS FERROVIARIAS",
    russianTranslation: "Железнодорожные шлагбаумы",
    cropRegion: { x: 124, y: 704, width: 96, height: 108 },
    sourceSheetLabelEvidence: "visible source label: BARRERAS FERROVIARIAS"
  },
  {
    entryKind: "category-heading",
    spanishLabel: "De fin de prescripción",
    russianTranslation: "Конец действия предписания",
    cropRegion: { x: 78, y: 782, width: 278, height: 38 },
    sourceSheetLabelEvidence: "visible source heading: De fin de prescripción"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "FIN DE LA PRESCRIPCIÓN",
    variant: "genérico",
    russianTranslation: "Конец действия предписания",
    cropRegion: { x: 124, y: 812, width: 82, height: 100 },
    sourceSheetLabelEvidence: "visible source label: FIN DE LA PRESCRIPCIÓN (genérico)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "FIN DE LA PRESCRIPCIÓN",
    variant: "velocidad mínima 35",
    russianTranslation: "Конец действия предписания",
    cropRegion: { x: 210, y: 812, width: 82, height: 100 },
    sourceSheetLabelEvidence: "visible source label: FIN DE LA PRESCRIPCIÓN (velocidad mínima 35)"
  }
];

const warningPage187Rows = [
  {
    entryKind: "category-heading",
    spanishLabel: "Preventivas",
    russianTranslation: "Предупреждающие",
    cropRegion: { x: 132, y: 132, width: 165, height: 31 },
    sourceSheetLabelEvidence: "visible source heading: Preventivas"
  },
  {
    entryKind: "category-heading",
    spanishLabel: "Advertencias sobre características de la vía",
    russianTranslation: "Предупреждения об особенностях дороги",
    cropRegion: { x: 132, y: 171, width: 500, height: 30 },
    sourceSheetLabelEvidence: "visible source heading: Advertencias sobre características de la vía"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CURVA",
    variant: "Común y pronunciada",
    russianTranslation: "Опасный поворот",
    cropRegion: { x: 176, y: 198, width: 75, height: 88 },
    sourceSheetLabelEvidence: "visible source label: CURVA (Común y pronunciada)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CURVA",
    variant: "Contracurva",
    russianTranslation: "Обратный / следующий поворот",
    cropRegion: { x: 263, y: 198, width: 75, height: 88 },
    sourceSheetLabelEvidence: "visible source label: CURVA (Contracurva)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CURVA",
    variant: "En \"S\"",
    russianTranslation: "S-образный поворот",
    cropRegion: { x: 349, y: 198, width: 75, height: 88 },
    sourceSheetLabelEvidence: "visible source label: CURVA (En \"S\")"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CAMINO SINUOSO",
    russianTranslation: "Извилистая дорога",
    cropRegion: { x: 434, y: 198, width: 75, height: 88 },
    sourceSheetLabelEvidence: "visible source label: CAMINO SINUOSO"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PENDIENTE",
    variant: "Descendente",
    russianTranslation: "Спуск",
    cropRegion: { x: 520, y: 198, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: PENDIENTE (Descendente)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PENDIENTE",
    variant: "Ascendente",
    russianTranslation: "Подъем",
    cropRegion: { x: 176, y: 309, width: 78, height: 91 },
    sourceSheetLabelEvidence: "visible source label: PENDIENTE (Ascendente)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ESTRECHAMIENTO",
    variant: "Ambas manos",
    russianTranslation: "Сужение с обеих сторон",
    cropRegion: { x: 263, y: 309, width: 79, height: 92 },
    sourceSheetLabelEvidence: "visible source label: ESTRECHAMIENTO (Ambas manos)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ESTRECHAMIENTO",
    variant: "En una sola mano",
    russianTranslation: "Сужение с одной стороны",
    cropRegion: { x: 349, y: 309, width: 82, height: 92 },
    sourceSheetLabelEvidence: "visible source label: ESTRECHAMIENTO (En una sola mano)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PERFIL IRREGULAR",
    variant: "Irregular",
    russianTranslation: "Неровная дорога",
    cropRegion: { x: 434, y: 309, width: 82, height: 92 },
    sourceSheetLabelEvidence: "visible source label: PERFIL IRREGULAR (Irregular)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PERFIL IRREGULAR",
    variant: "Badén",
    russianTranslation: "Впадина / понижение дороги",
    cropRegion: { x: 520, y: 309, width: 83, height: 92 },
    sourceSheetLabelEvidence: "visible source label: PERFIL IRREGULAR (Badén)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PERFIL IRREGULAR",
    variant: "Lomada",
    russianTranslation: "Возвышение / бугор",
    cropRegion: { x: 176, y: 420, width: 82, height: 87 },
    sourceSheetLabelEvidence: "visible source label: PERFIL IRREGULAR (Lomada)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CALZADA RESBALADIZA",
    russianTranslation: "Скользкая дорога",
    cropRegion: { x: 263, y: 420, width: 78, height: 87 },
    sourceSheetLabelEvidence: "visible source label: CALZADA RESBALADIZA"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PROYECCIÓN DE PIEDRAS",
    russianTranslation: "Выброс камней",
    cropRegion: { x: 349, y: 420, width: 82, height: 87 },
    sourceSheetLabelEvidence: "visible source label: PROYECCIÓN DE PIEDRAS"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "DERRUMBES",
    russianTranslation: "Обвалы",
    cropRegion: { x: 436, y: 420, width: 78, height: 87 },
    sourceSheetLabelEvidence: "visible source label: DERRUMBES"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "TÚNEL",
    russianTranslation: "Туннель",
    cropRegion: { x: 520, y: 420, width: 78, height: 87 },
    sourceSheetLabelEvidence: "visible source label: TÚNEL"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PUENTE ANGOSTO",
    russianTranslation: "Узкий мост",
    cropRegion: { x: 176, y: 528, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: PUENTE ANGOSTO"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PUENTE MÓVIL",
    russianTranslation: "Разводной мост",
    cropRegion: { x: 263, y: 528, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: PUENTE MÓVIL"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ALTURA LIMITADA",
    russianTranslation: "Ограничение высоты",
    cropRegion: { x: 350, y: 527, width: 78, height: 89 },
    sourceSheetLabelEvidence: "visible source label: ALTURA LIMITADA"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ANCHO LIMITADO",
    russianTranslation: "Ограничение ширины",
    cropRegion: { x: 436, y: 527, width: 78, height: 89 },
    sourceSheetLabelEvidence: "visible source label: ANCHO LIMITADO"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CALZADA DIVIDIDA",
    russianTranslation: "Разделенная проезжая часть",
    cropRegion: { x: 520, y: 527, width: 78, height: 89 },
    sourceSheetLabelEvidence: "visible source label: CALZADA DIVIDIDA"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ROTONDA",
    russianTranslation: "Круговое движение",
    cropRegion: { x: 176, y: 637, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: ROTONDA"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "INCORPORACIÓN DE TRÁNSITO LATERAL",
    russianTranslation: "Въезд транспорта сбоку",
    cropRegion: { x: 263, y: 637, width: 83, height: 88 },
    sourceSheetLabelEvidence: "visible source label: INCORPORACIÓN DE TRÁNSITO LATERAL"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "INICIO DE DOBLE CIRCULACIÓN",
    russianTranslation: "Начало двустороннего движения",
    cropRegion: { x: 349, y: 637, width: 88, height: 90 },
    sourceSheetLabelEvidence: "visible source label: INICIO DE DOBLE CIRCULACIÓN"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ENCRUCIJADA",
    variant: "Cruce",
    russianTranslation: "Перекресток",
    cropRegion: { x: 436, y: 637, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: ENCRUCIJADA (Cruce)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ENCRUCIJADA",
    variant: "Empalme",
    russianTranslation: "Примыкание",
    cropRegion: { x: 522, y: 637, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: ENCRUCIJADA (Empalme)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ENCRUCIJADA",
    variant: "Bifurcación 1",
    russianTranslation: "Развилка",
    cropRegion: { x: 176, y: 748, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: ENCRUCIJADA (Bifurcación 1)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ENCRUCIJADA",
    variant: "Bifurcación 2",
    russianTranslation: "Т-образная развилка",
    cropRegion: { x: 263, y: 748, width: 78, height: 88 },
    sourceSheetLabelEvidence: "visible source label: ENCRUCIJADA (Bifurcación 2)"
  }
];

const warningPage188Rows = [
  {
    entryKind: "category-heading",
    spanishLabel: "Posibilidad de riesgo eventual",
    russianTranslation: "Возможная опасность",
    cropRegion: { x: 80, y: 132, width: 330, height: 31 },
    sourceSheetLabelEvidence: "visible source heading: Posibilidad de riesgo eventual"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ESCOLARES",
    russianTranslation: "Школьники",
    cropRegion: { x: 116, y: 157, width: 74, height: 82 },
    sourceSheetLabelEvidence: "visible source label: ESCOLARES"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "NIÑOS",
    russianTranslation: "Дети",
    cropRegion: { x: 202, y: 157, width: 74, height: 82 },
    sourceSheetLabelEvidence: "visible source label: NIÑOS"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CRUCE DE CICLISTAS",
    russianTranslation: "Пересечение с велосипедистами",
    cropRegion: { x: 287, y: 157, width: 94, height: 92 },
    sourceSheetLabelEvidence: "visible source label: CRUCE DE CICLISTAS"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "JINETES",
    russianTranslation: "Всадники",
    cropRegion: { x: 396, y: 157, width: 74, height: 82 },
    sourceSheetLabelEvidence: "visible source label: JINETES"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ANIMALES SUELTOS",
    variant: "Vaca",
    russianTranslation: "Животные на дороге: корова",
    cropRegion: { x: 483, y: 157, width: 86, height: 86 },
    sourceSheetLabelEvidence: "visible source label: ANIMALES SUELTOS (Vaca)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ANIMALES SUELTOS",
    variant: "Ciervo",
    russianTranslation: "Животные на дороге: олень",
    cropRegion: { x: 116, y: 268, width: 88, height: 89 },
    sourceSheetLabelEvidence: "visible source label: ANIMALES SUELTOS (Ciervo)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CORREDOR AÉREO",
    russianTranslation: "Воздушный коридор",
    cropRegion: { x: 203, y: 268, width: 78, height: 84 },
    sourceSheetLabelEvidence: "visible source label: CORREDOR AÉREO"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PRESENCIA DE VEHÍCULOS EXTRAÑOS",
    variant: "Tranvía",
    russianTranslation: "Возможное появление трамвая",
    cropRegion: { x: 290, y: 268, width: 94, height: 99 },
    sourceSheetLabelEvidence: "visible source label: PRESENCIA DE VEHÍCULOS EXTRAÑOS (Tranvía)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PRESENCIA DE VEHÍCULOS EXTRAÑOS",
    variant: "Tractor",
    russianTranslation: "Возможное появление трактора",
    cropRegion: { x: 398, y: 268, width: 83, height: 99 },
    sourceSheetLabelEvidence: "visible source label: PRESENCIA DE VEHÍCULOS EXTRAÑOS (Tractor)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PRESENCIA DE VEHÍCULOS EXTRAÑOS",
    variant: "Ambulancia",
    russianTranslation: "Возможное появление скорой помощи",
    cropRegion: { x: 486, y: 268, width: 91, height: 99 },
    sourceSheetLabelEvidence: "visible source label: PRESENCIA DE VEHÍCULOS EXTRAÑOS (Ambulancia)"
  },
  {
    entryKind: "category-heading",
    spanishLabel: "Advertencias de máximo peligro",
    russianTranslation: "Предупреждения максимальной опасности",
    cropRegion: { x: 79, y: 394, width: 360, height: 31 },
    sourceSheetLabelEvidence: "visible source heading: Advertencias de máximo peligro"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CRUCE FERROVIARIO",
    russianTranslation: "Железнодорожный переезд",
    cropRegion: { x: 117, y: 419, width: 89, height: 77 },
    sourceSheetLabelEvidence: "visible source label: CRUCE FERROVIARIO"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PANELES DE PREVENCIÓN",
    variant: "Aproximación",
    russianTranslation: "Предупредительные панели приближения",
    cropRegion: { x: 219, y: 433, width: 76, height: 66 },
    sourceSheetLabelEvidence: "visible source label: PANELES DE PREVENCIÓN (Aproximación)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PANELES DE PREVENCIÓN",
    variant: "Objeto rígido",
    russianTranslation: "Панель у жесткого препятствия",
    cropRegion: { x: 315, y: 428, width: 75, height: 72 },
    sourceSheetLabelEvidence: "visible source label: PANELES DE PREVENCIÓN (Objeto rígido)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PANELES DE PREVENCIÓN",
    variant: "Curva / Chevron",
    russianTranslation: "Шеврон поворота",
    cropRegion: { x: 403, y: 428, width: 86, height: 74 },
    sourceSheetLabelEvidence: "visible source label: PANELES DE PREVENCIÓN (Curva / Chevron)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CRUZ DE SAN ANDRÉS",
    variant: "Hasta dos vías",
    russianTranslation: "Андреевский крест: до двух путей",
    cropRegion: { x: 486, y: 419, width: 108, height: 83 },
    sourceSheetLabelEvidence: "visible source label: CRUZ DE SAN ANDRÉS (Hasta dos vías)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CRUZ DE SAN ANDRÉS",
    variant: "Más de dos vías",
    russianTranslation: "Андреевский крест: более двух путей",
    cropRegion: { x: 107, y: 522, width: 101, height: 70 },
    sourceSheetLabelEvidence: "visible source label: CRUZ DE SAN ANDRÉS (Más de dos vías)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CURVA CERRADA",
    russianTranslation: "Крутой поворот",
    cropRegion: { x: 224, y: 514, width: 64, height: 80 },
    sourceSheetLabelEvidence: "visible source label: CURVA CERRADA"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CRUCE DE PEATONES",
    russianTranslation: "Пешеходный переход",
    cropRegion: { x: 311, y: 514, width: 64, height: 80 },
    sourceSheetLabelEvidence: "visible source label: CRUCE DE PEATONES"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "CRUCE DE PEATONES",
    variant: "Prioridad peatón",
    russianTranslation: "Пешеходы имеют приоритет",
    cropRegion: { x: 396, y: 514, width: 75, height: 101 },
    sourceSheetLabelEvidence: "visible source label: CRUCE DE PEATONES (Prioridad peatón)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "ATENCIÓN",
    russianTranslation: "Внимание",
    cropRegion: { x: 483, y: 514, width: 64, height: 80 },
    sourceSheetLabelEvidence: "visible source label: ATENCIÓN"
  },
  {
    entryKind: "category-heading",
    spanishLabel: "Anticipo de otros dispositivos de control del tránsito",
    russianTranslation: "Предупреждение о других устройствах контроля движения",
    cropRegion: { x: 80, y: 640, width: 555, height: 31 },
    sourceSheetLabelEvidence: "visible source heading: Anticipo de otros dispositivos de control del tránsito"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "FLECHA DIRECCIONAL",
    russianTranslation: "Направляющая стрелка",
    cropRegion: { x: 115, y: 676, width: 83, height: 84 },
    sourceSheetLabelEvidence: "visible source label: FLECHA DIRECCIONAL"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PROXIMIDAD DE SEMÁFORO",
    russianTranslation: "Приближение к светофору",
    cropRegion: { x: 206, y: 678, width: 76, height: 87 },
    sourceSheetLabelEvidence: "visible source label: PROXIMIDAD DE SEMÁFORO"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PROXIMIDAD DE SEÑAL RESTRICTIVA",
    variant: "Pare",
    russianTranslation: "Приближение к знаку STOP",
    cropRegion: { x: 291, y: 674, width: 88, height: 99 },
    sourceSheetLabelEvidence: "visible source label: PROXIMIDAD DE SEÑAL RESTRICTIVA (Pare)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PROXIMIDAD DE SEÑAL RESTRICTIVA",
    variant: "Paso",
    russianTranslation: "Приближение к знаку уступите дорогу",
    cropRegion: { x: 398, y: 674, width: 88, height: 99 },
    sourceSheetLabelEvidence: "visible source label: PROXIMIDAD DE SEÑAL RESTRICTIVA (Paso)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "PROXIMIDAD DE SEÑAL RESTRICTIVA",
    variant: "Otra",
    russianTranslation: "Приближение к другому ограничивающему знаку",
    cropRegion: { x: 485, y: 674, width: 94, height: 99 },
    sourceSheetLabelEvidence: "visible source label: PROXIMIDAD DE SEÑAL RESTRICTIVA (Otra)"
  },
  {
    entryKind: "category-heading",
    spanishLabel: "Fin de prevención",
    russianTranslation: "Конец предупреждения",
    cropRegion: { x: 79, y: 785, width: 230, height: 31 },
    sourceSheetLabelEvidence: "visible source heading: Fin de prevención"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Fin de prevención",
    russianTranslation: "Конец зоны предупреждения",
    cropRegion: { x: 122, y: 811, width: 70, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Fin de prevención"
  }
];

const informationalPage189Rows = [
  {
    entryKind: "category-heading",
    spanishLabel: "Informativas",
    russianTranslation: "Информационные",
    cropRegion: { x: 132, y: 131, width: 178, height: 38 },
    sourceSheetLabelEvidence: "visible source heading: Informativas"
  },
  {
    entryKind: "category-heading",
    spanishLabel: "Características de la vía",
    russianTranslation: "Характеристики дороги",
    cropRegion: { x: 132, y: 171, width: 258, height: 30 },
    sourceSheetLabelEvidence: "visible source heading: Características de la vía"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Comienzo de autopista",
    russianTranslation: "начало автомагистрали",
    cropRegion: { x: 172, y: 202, width: 75, height: 97 },
    sourceSheetLabelEvidence: "visible source label: Comienzo de autopista"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Fin de autopista",
    russianTranslation: "конец автомагистрали",
    cropRegion: { x: 257, y: 202, width: 75, height: 97 },
    sourceSheetLabelEvidence: "visible source label: Fin de autopista"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Indicadora de utilización de carriles",
    russianTranslation: "указатель использования полос",
    cropRegion: { x: 343, y: 226, width: 98, height: 83 },
    sourceSheetLabelEvidence: "visible source label: Indicadora de utilización de carriles"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Camino o calle sin salida",
    variant: "traza en T",
    russianTranslation: "тупиковая дорога или улица",
    cropRegion: { x: 448, y: 226, width: 62, height: 83 },
    sourceSheetLabelEvidence: "visible source label: Camino o calle sin salida (traza en T)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Camino o calle sin salida",
    variant: "traza lateral",
    russianTranslation: "тупиковая дорога или улица",
    cropRegion: { x: 536, y: 226, width: 62, height: 83 },
    sourceSheetLabelEvidence: "visible source label: Camino o calle sin salida (traza lateral)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Camino o paso transitable",
    russianTranslation: "проезжий путь / разрешенный проезд",
    cropRegion: { x: 157, y: 318, width: 91, height: 100 },
    sourceSheetLabelEvidence: "visible source label: Camino o paso transitable"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Velocidades máximas permitidas",
    russianTranslation: "разрешенные максимальные скорости",
    cropRegion: { x: 259, y: 318, width: 76, height: 102 },
    sourceSheetLabelEvidence: "visible source label: Velocidades máximas permitidas"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Esquema de recorrido",
    russianTranslation: "схема маршрута",
    cropRegion: { x: 342, y: 316, width: 119, height: 98 },
    sourceSheetLabelEvidence: "visible source label: Esquema de recorrido"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Desvío por cambio de sentido de circulación",
    russianTranslation: "объезд из-за изменения направления движения",
    cropRegion: { x: 471, y: 316, width: 124, height: 103 },
    sourceSheetLabelEvidence: "visible source label: Desvío por cambio de sentido de circulación"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento permitido",
    russianTranslation: "стоянка разрешена",
    cropRegion: { x: 166, y: 455, width: 83, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento permitido"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento permitido",
    variant: "a 45° o 90°",
    russianTranslation: "стоянка под 45° или 90°",
    cropRegion: { x: 250, y: 455, width: 95, height: 93 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento permitido (a 45° o 90°)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento permitido",
    variant: "Motos a 45°",
    russianTranslation: "стоянка мотоциклов под 45°",
    cropRegion: { x: 338, y: 455, width: 95, height: 93 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento permitido (Motos a 45°)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "verde 45°",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 427, y: 455, width: 83, height: 86 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (verde 45°)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "naranja 45°",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 511, y: 455, width: 86, height: 86 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (naranja 45°)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "verde 45° inferior",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 166, y: 565, width: 84, height: 87 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (verde 45° inferior)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "naranja 45° inferior",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 251, y: 565, width: 93, height: 87 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (naranja 45° inferior)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "verde 90°",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 338, y: 565, width: 92, height: 87 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (verde 90°)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "naranja 90°",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 424, y: 565, width: 91, height: 87 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (naranja 90°)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "verde 90° derecha",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 511, y: 565, width: 88, height: 87 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (verde 90° derecha)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "E naranja",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 168, y: 676, width: 83, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (E naranja)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "S verde",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 255, y: 692, width: 89, height: 50 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (S verde)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Estacionamiento ordenado",
    variant: "P naranja",
    russianTranslation: "упорядоченная стоянка",
    cropRegion: { x: 341, y: 692, width: 88, height: 50 },
    sourceSheetLabelEvidence: "visible source label: Estacionamiento ordenado (P naranja)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Permitido girar",
    variant: "Derecha",
    russianTranslation: "поворот направо разрешен",
    cropRegion: { x: 439, y: 676, width: 82, height: 80 },
    sourceSheetLabelEvidence: "visible source label: Permitido girar (Derecha)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Permitido girar",
    variant: "Izquierda",
    russianTranslation: "поворот налево разрешен",
    cropRegion: { x: 523, y: 676, width: 82, height: 80 },
    sourceSheetLabelEvidence: "visible source label: Permitido girar (Izquierda)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Derecha",
    russianTranslation: "разрешенное направление направо",
    cropRegion: { x: 165, y: 784, width: 86, height: 75 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Derecha)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Izquierda",
    russianTranslation: "разрешенное направление налево",
    cropRegion: { x: 250, y: 784, width: 89, height: 75 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Izquierda)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Igual sentido o derecha",
    russianTranslation: "прямо или направо",
    cropRegion: { x: 336, y: 775, width: 92, height: 93 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Igual sentido o derecha)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Igual sentido o izquierda",
    russianTranslation: "прямо или налево",
    cropRegion: { x: 424, y: 775, width: 92, height: 93 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Igual sentido o izquierda)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Ambas direcciones",
    russianTranslation: "оба направления",
    cropRegion: { x: 511, y: 784, width: 91, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Ambas direcciones)"
  }
];

const informationalPage190Rows = [
  {
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Bifurcación",
    russianTranslation: "разрешенные направления: разветвление",
    cropRegion: { x: 125, y: 147, width: 75, height: 86 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Bifurcación)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Derecha e izquierda",
    russianTranslation: "направо и налево",
    cropRegion: { x: 210, y: 147, width: 84, height: 86 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Derecha e izquierda)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Direcciones permitidas",
    variant: "Giro en U",
    russianTranslation: "разворот разрешен",
    cropRegion: { x: 296, y: 147, width: 74, height: 86 },
    sourceSheetLabelEvidence: "visible source label: Direcciones permitidas (Giro en U)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Cámara de control electrónico",
    russianTranslation: "камера электронного контроля",
    cropRegion: { x: 384, y: 147, width: 70, height: 86 },
    sourceSheetLabelEvidence: "visible source label: Cámara de control electrónico"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Fin de camino peatonal",
    variant: "A 100 m",
    russianTranslation: "конец пешеходного пути через 100 м",
    cropRegion: { x: 476, y: 146, width: 72, height: 104 },
    sourceSheetLabelEvidence: "visible source label: Fin de camino peatonal (A 100 m)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Fin de camino peatonal",
    russianTranslation: "конец пешеходного пути",
    cropRegion: { x: 134, y: 256, width: 67, height: 96 },
    sourceSheetLabelEvidence: "visible source label: Fin de camino peatonal"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Cruce peatonal",
    variant: "Derecha",
    russianTranslation: "пешеходный переход справа",
    cropRegion: { x: 220, y: 256, width: 70, height: 96 },
    sourceSheetLabelEvidence: "visible source label: Cruce peatonal (Derecha)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Cruce peatonal",
    variant: "Izquierda",
    russianTranslation: "пешеходный переход слева",
    cropRegion: { x: 306, y: 256, width: 72, height: 96 },
    sourceSheetLabelEvidence: "visible source label: Cruce peatonal (Izquierda)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Bidireccionales en ciclovía",
    russianTranslation: "двустороннее движение на велодорожке",
    cropRegion: { x: 386, y: 278, width: 90, height: 70 },
    sourceSheetLabelEvidence: "visible source label: Bidireccionales en ciclovía"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Proximidad de ciclovía",
    russianTranslation: "близость велодорожки",
    cropRegion: { x: 487, y: 278, width: 88, height: 70 },
    sourceSheetLabelEvidence: "visible source label: Proximidad de ciclovía"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Descenso de la bicicleta",
    russianTranslation: "сойти с велосипеда",
    cropRegion: { x: 124, y: 366, width: 88, height: 68 },
    sourceSheetLabelEvidence: "visible source label: Descenso de la bicicleta"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Finalización de la ciclovía",
    russianTranslation: "конец велодорожки",
    cropRegion: { x: 210, y: 366, width: 88, height: 68 },
    sourceSheetLabelEvidence: "visible source label: Finalización de la ciclovía"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Advertencia de escuela",
    russianTranslation: "предупреждение о школе",
    cropRegion: { x: 296, y: 366, width: 88, height: 68 },
    sourceSheetLabelEvidence: "visible source label: Advertencia de escuela"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Advertencia general",
    russianTranslation: "общее предупреждение",
    cropRegion: { x: 382, y: 366, width: 88, height: 68 },
    sourceSheetLabelEvidence: "visible source label: Advertencia general"
  },
  {
    entryKind: "category-heading",
    spanishLabel: "Nomenclatura vial y urbana",
    russianTranslation: "дорожная и городская номенклатура",
    cropRegion: { x: 78, y: 455, width: 310, height: 35 },
    sourceSheetLabelEvidence: "visible source heading: Nomenclatura vial y urbana"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Ruta Panamericana",
    russianTranslation: "Панамериканская трасса",
    cropRegion: { x: 118, y: 500, width: 85, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Ruta Panamericana"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Ruta nacional",
    russianTranslation: "национальная трасса",
    cropRegion: { x: 201, y: 508, width: 68, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Ruta nacional"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Ruta provincial",
    russianTranslation: "провинциальная трасса",
    cropRegion: { x: 273, y: 508, width: 72, height: 78 },
    sourceSheetLabelEvidence: "visible source label: Ruta provincial"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Nomenclatura urbana",
    variant: "placa de calle",
    russianTranslation: "городская уличная табличка",
    cropRegion: { x: 342, y: 505, width: 115, height: 85 },
    sourceSheetLabelEvidence: "visible source label: Nomenclatura urbana (placa de calle)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Nomenclatura urbana",
    variant: "flecha urbana",
    russianTranslation: "городская навигация",
    cropRegion: { x: 451, y: 505, width: 138, height: 85 },
    sourceSheetLabelEvidence: "visible source label: Nomenclatura urbana (flecha urbana)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Identificación de región y localidad",
    russianTranslation: "регион и населенный пункт",
    cropRegion: { x: 116, y: 600, width: 95, height: 112 },
    sourceSheetLabelEvidence: "visible source label: Identificación de región y localidad"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Orientación",
    variant: "En caminos principales y secundarios",
    russianTranslation: "ориентация на главных и второстепенных дорогах",
    cropRegion: { x: 232, y: 635, width: 110, height: 94 },
    sourceSheetLabelEvidence: "visible source label: Orientación (En caminos principales y secundarios)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Orientación",
    variant: "En caminos secundarios",
    russianTranslation: "ориентация на второстепенных дорогах",
    cropRegion: { x: 354, y: 638, width: 100, height: 88 },
    sourceSheetLabelEvidence: "visible source label: Orientación (En caminos secundarios)"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Comienzo o fin de zona urbana",
    russianTranslation: "начало или конец городской зоны",
    cropRegion: { x: 446, y: 637, width: 98, height: 82 },
    sourceSheetLabelEvidence: "visible source label: Comienzo o fin de zona urbana"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Identificación de jurisdicción o accidente",
    russianTranslation: "обозначение юрисдикции или объекта",
    cropRegion: { x: 103, y: 755, width: 125, height: 74 },
    sourceSheetLabelEvidence: "visible source label: Identificación de jurisdicción o accidente"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Mojón kilométrico",
    russianTranslation: "километровый столб",
    cropRegion: { x: 245, y: 753, width: 83, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Mojón kilométrico"
  },
  {
    entryKind: "catalog-entry",
    spanishLabel: "Nomenclatura de autopista",
    russianTranslation: "обозначение автомагистрали",
    cropRegion: { x: 335, y: 755, width: 126, height: 72 },
    sourceSheetLabelEvidence: "visible source label: Nomenclatura de autopista"
  }
];

test("manual sign inventory validator passes and requires individual CSS-clipped regions", () => {
  const output = execFileSync("node", [scriptPath], { encoding: "utf8" });
  assert.match(output, /Manual sign inventory validation passed: \d+ entries/u);

  const inventory = loadInventory();
  assert.equal(inventory.inventoryStatus, "individual-source-regions");
  assert.equal(inventory.entries.length, inventory.summary.totalEntries);
  assert.ok(inventory.entries.length > 0);

  for (const entry of inventory.entries) {
    assert.equal(entry.renderMode, "source-image-css-clip", entry.id);
    assert.equal(entry.noUpscale, true, entry.id);
    assert.ok(["catalog-entry", "category-heading"].includes(entry.entryKind), `${entry.id} has entryKind`);
    assert.ok(["reconciled-source-visual", "pending-reconciliation"].includes(entry.auditStatus), `${entry.id} has auditStatus`);
    assert.ok(entry.sourceSheetLabelEvidence, `${entry.id} has sourceSheetLabelEvidence`);
    assert.ok(entry.cropRegion, `${entry.id} has cropRegion`);
    assert.ok(entry.cropRegion.width < entry.naturalWidth, `${entry.id} crop width is smaller than source asset`);
    assert.ok(entry.cropRegion.height < entry.naturalHeight, `${entry.id} crop height is smaller than source asset`);
    assert.ok(entry.cropRegion.x + entry.cropRegion.width <= entry.naturalWidth, `${entry.id} crop fits source width`);
    assert.ok(entry.cropRegion.y + entry.cropRegion.height <= entry.naturalHeight, `${entry.id} crop fits source height`);
    assert.deepEqual(entry.displayRegion, entry.cropRegion, `${entry.id} displayRegion matches cropRegion`);
  }
});

test("regulatory source page 185 visual rows are complete and ordered", () => {
  const inventory = loadInventory();
  const rows = inventory.entries.filter((entry) => entry.sectionId === "app4-signs-regulatory" && entry.sourcePage === 185);

  assert.equal(rows.length, regulatoryPage185Rows.length);
  assert.equal(inventory.summary.entriesBySourcePage["185"], regulatoryPage185Rows.length);
  assert.equal(rows.filter((entry) => entry.entryKind === "category-heading").length, 2);
  assert.equal(rows.filter((entry) => entry.entryKind === "catalog-entry").length, 27);

  rows.forEach((entry, index) => {
    const expected = regulatoryPage185Rows[index];
    assert.equal(entry.sourceOrderWithinPage, index + 1, entry.id);
    assert.equal(entry.entryKind, expected.entryKind, entry.id);
    assert.equal(entry.spanishLabel, expected.spanishLabel, entry.id);
    assert.equal(entry.variant, expected.variant, entry.id);
    assert.equal(entry.russianTranslation, expected.russianTranslation, entry.id);
    assert.deepEqual(entry.cropRegion, expected.cropRegion, entry.id);
    assert.deepEqual(entry.displayRegion, expected.cropRegion, entry.id);
    assert.equal(entry.sourceSheetLabelEvidence, expected.sourceSheetLabelEvidence, entry.id);
    assert.equal(entry.auditStatus, "reconciled-source-visual", entry.id);
    assert.match(entry.sourceRef, /app4-regulatory-page-185-source-card\.visualSourceEntries/u, entry.id);
  });
});

test("regulatory source page 186 visual rows are complete and ordered", () => {
  const inventory = loadInventory();
  const rows = inventory.entries.filter((entry) => entry.sectionId === "app4-signs-regulatory" && entry.sourcePage === 186);

  assert.equal(rows.length, regulatoryPage186Rows.length);
  assert.equal(inventory.summary.entriesBySourcePage["186"], regulatoryPage186Rows.length);
  assert.equal(rows.filter((entry) => entry.entryKind === "category-heading").length, 3);
  assert.equal(rows.filter((entry) => entry.entryKind === "catalog-entry").length, 28);

  rows.forEach((entry, index) => {
    const expected = regulatoryPage186Rows[index];
    assert.equal(entry.sourceOrderWithinPage, index + 1, entry.id);
    assert.equal(entry.entryKind, expected.entryKind, entry.id);
    assert.equal(entry.spanishLabel, expected.spanishLabel, entry.id);
    assert.equal(entry.variant, expected.variant, entry.id);
    assert.equal(entry.russianTranslation, expected.russianTranslation, entry.id);
    assert.deepEqual(entry.cropRegion, expected.cropRegion, entry.id);
    assert.deepEqual(entry.displayRegion, expected.cropRegion, entry.id);
    assert.equal(entry.sourceSheetLabelEvidence, expected.sourceSheetLabelEvidence, entry.id);
    assert.equal(entry.auditStatus, "reconciled-source-visual", entry.id);
    assert.match(entry.sourceRef, /app4-regulatory-page-186-source-card\.visualSourceEntries/u, entry.id);
  });
});

test("warning source page 187 visual rows are complete and ordered", () => {
  const inventory = loadInventory();
  const rows = inventory.entries.filter((entry) => entry.sectionId === "app4-signs-warning" && entry.sourcePage === 187);

  assert.equal(rows.length, warningPage187Rows.length);
  assert.equal(inventory.summary.entriesBySourcePage["187"], warningPage187Rows.length);
  assert.equal(rows.filter((entry) => entry.entryKind === "category-heading").length, 2);
  assert.equal(rows.filter((entry) => entry.entryKind === "catalog-entry").length, 27);

  rows.forEach((entry, index) => {
    const expected = warningPage187Rows[index];
    assert.equal(entry.sourceOrderWithinPage, index + 1, entry.id);
    assert.equal(entry.entryKind, expected.entryKind, entry.id);
    assert.equal(entry.spanishLabel, expected.spanishLabel, entry.id);
    assert.equal(entry.variant, expected.variant, entry.id);
    assert.equal(entry.russianTranslation, expected.russianTranslation, entry.id);
    assert.deepEqual(entry.cropRegion, expected.cropRegion, entry.id);
    assert.deepEqual(entry.displayRegion, expected.cropRegion, entry.id);
    assert.equal(entry.sourceSheetLabelEvidence, expected.sourceSheetLabelEvidence, entry.id);
    assert.equal(entry.auditStatus, "reconciled-source-visual", entry.id);
    assert.match(entry.sourceRef, /app4-warning-page-187-source-card\.visualSourceEntries/u, entry.id);
  });
});

test("warning source page 188 visual rows are complete and ordered", () => {
  const inventory = loadInventory();
  const rows = inventory.entries.filter((entry) => entry.sectionId === "app4-signs-warning" && entry.sourcePage === 188);

  assert.equal(rows.length, warningPage188Rows.length);
  assert.equal(inventory.summary.entriesBySourcePage["188"], warningPage188Rows.length);
  assert.equal(rows.filter((entry) => entry.entryKind === "category-heading").length, 4);
  assert.equal(rows.filter((entry) => entry.entryKind === "catalog-entry").length, 26);

  rows.forEach((entry, index) => {
    const expected = warningPage188Rows[index];
    assert.equal(entry.sourceOrderWithinPage, index + 1, entry.id);
    assert.equal(entry.entryKind, expected.entryKind, entry.id);
    assert.equal(entry.spanishLabel, expected.spanishLabel, entry.id);
    assert.equal(entry.variant, expected.variant, entry.id);
    assert.equal(entry.russianTranslation, expected.russianTranslation, entry.id);
    assert.deepEqual(entry.cropRegion, expected.cropRegion, entry.id);
    assert.deepEqual(entry.displayRegion, expected.cropRegion, entry.id);
    assert.equal(entry.sourceSheetLabelEvidence, expected.sourceSheetLabelEvidence, entry.id);
    assert.equal(entry.auditStatus, "reconciled-source-visual", entry.id);
    assert.match(entry.sourceRef, /app4-warning-page-188-source-card\.visualSourceEntries/u, entry.id);
  });
});

test("informational source page 189 visual rows are complete and ordered", () => {
  const inventory = loadInventory();
  const rows = inventory.entries.filter((entry) => entry.sectionId === "app4-signs-informational" && entry.sourcePage === 189);

  assert.equal(rows.length, informationalPage189Rows.length);
  assert.equal(inventory.summary.entriesBySourcePage["189"], informationalPage189Rows.length);
  assert.equal(rows.filter((entry) => entry.entryKind === "category-heading").length, 2);
  assert.equal(rows.filter((entry) => entry.entryKind === "catalog-entry").length, 29);
  assert.equal(rows.filter((entry) => entry.auditStatus === "pending-reconciliation").length, 0);

  rows.forEach((entry, index) => {
    const expected = informationalPage189Rows[index];
    assert.equal(entry.sourceOrderWithinPage, index + 1, entry.id);
    assert.equal(entry.entryKind, expected.entryKind, entry.id);
    assert.equal(entry.spanishLabel, expected.spanishLabel, entry.id);
    assert.equal(entry.variant, expected.variant, entry.id);
    assert.equal(entry.russianTranslation, expected.russianTranslation, entry.id);
    assert.deepEqual(entry.cropRegion, expected.cropRegion, entry.id);
    assert.deepEqual(entry.displayRegion, expected.cropRegion, entry.id);
    assert.equal(entry.sourceSheetLabelEvidence, expected.sourceSheetLabelEvidence, entry.id);
    assert.equal(entry.auditStatus, "reconciled-source-visual", entry.id);
    assert.match(entry.sourceRef, /app4-informational-page-189-source-card\.visualSourceEntries/u, entry.id);
  });
});

test("informational source page 190 visual rows are complete and ordered", () => {
  const inventory = loadInventory();
  const rows = inventory.entries.filter((entry) => entry.sectionId === "app4-signs-informational" && entry.sourcePage === 190);

  assert.equal(rows.length, informationalPage190Rows.length);
  assert.equal(inventory.summary.entriesBySourcePage["190"], informationalPage190Rows.length);
  assert.equal(rows.filter((entry) => entry.entryKind === "category-heading").length, 1);
  assert.equal(rows.filter((entry) => entry.entryKind === "catalog-entry").length, 26);
  assert.equal(rows.filter((entry) => entry.auditStatus === "pending-reconciliation").length, 0);

  rows.forEach((entry, index) => {
    const expected = informationalPage190Rows[index];
    assert.equal(entry.sourceOrderWithinPage, index + 1, entry.id);
    assert.equal(entry.entryKind, expected.entryKind, entry.id);
    assert.equal(entry.spanishLabel, expected.spanishLabel, entry.id);
    assert.equal(entry.variant, expected.variant, entry.id);
    assert.equal(entry.russianTranslation, expected.russianTranslation, entry.id);
    assert.deepEqual(entry.cropRegion, expected.cropRegion, entry.id);
    assert.deepEqual(entry.displayRegion, expected.cropRegion, entry.id);
    assert.equal(entry.sourceSheetLabelEvidence, expected.sourceSheetLabelEvidence, entry.id);
    assert.equal(entry.auditStatus, "reconciled-source-visual", entry.id);
    assert.match(entry.sourceRef, /app4-informational-page-190-source-card\.visualSourceEntries/u, entry.id);
  });
});

test("reconciled visual rows are complete while unreconciled sections stay visibly pending", () => {
  const inventory = loadInventory();
  const isReconciled = (entry) =>
    ["app4-signs-regulatory", "app4-signs-warning"].includes(entry.sectionId) ||
    (entry.sectionId === "app4-signs-informational" && [189, 190].includes(entry.sourcePage));
  const reconciled = inventory.entries.filter(isReconciled);
  const pending = inventory.entries.filter((entry) => !isReconciled(entry));

  assert.ok(reconciled.length > 0, "explicit visual rows exist");
  assert.ok(pending.length > 0, "unreconciled pending rows remain visible");

  for (const entry of reconciled) {
    assert.equal(entry.auditStatus, "reconciled-source-visual", entry.id);
    assert.notEqual(entry.sourceSheetLabelEvidence, "pending visual-source reconciliation", entry.id);
  }

  for (const entry of pending) {
    assert.equal(entry.auditStatus, "pending-reconciliation", entry.id);
    assert.equal(entry.sourceSheetLabelEvidence, "pending visual-source reconciliation", entry.id);
  }
});

test("explicit visual variants required by the rebuild slice exist", () => {
  const inventory = loadInventory();
  const findVariant = (spanishLabel, variant) =>
    inventory.entries.find((entry) => entry.spanishLabel === spanishLabel && entry.variant === variant && entry.auditStatus === "reconciled-source-visual");

  assert.ok(findVariant("CURVA", "En \"S\""), "CURVA (En \"S\") visual variant exists");
  assert.ok(findVariant("PENDIENTE", "Ascendente"), "PENDIENTE (Ascendente) visual variant exists");
  assert.ok(findVariant("ESTRECHAMIENTO", "En una sola mano"), "ESTRECHAMIENTO (En una sola mano) visual variant exists");
  assert.ok(findVariant("CRUZ DE SAN ANDRÉS", "Más de dos vías"), "CRUZ DE SAN ANDRÉS (Más de dos vías) visual variant exists");
  assert.ok(findVariant("PROXIMIDAD DE SEÑAL RESTRICTIVA", "Pare"), "PROXIMIDAD DE SEÑAL RESTRICTIVA (Pare) exists");
  assert.ok(findVariant("PROXIMIDAD DE SEÑAL RESTRICTIVA", "Paso"), "PROXIMIDAD DE SEÑAL RESTRICTIVA (Paso) exists");
  assert.ok(findVariant("PROXIMIDAD DE SEÑAL RESTRICTIVA", "Otra"), "PROXIMIDAD DE SEÑAL RESTRICTIVA (Otra) exists");
});

test("manual sign sections expose individual catalog and NO AVANZAR caption pair", () => {
  const inventory = loadInventory();
  const noAvanzar = inventory.entries.find((entry) => entry.spanishLabel === "NO AVANZAR");
  assert.ok(noAvanzar, "NO AVANZAR entry exists");
  assert.equal(noAvanzar.russianTranslation, "Проезд запрещен");
  assert.equal(noAvanzar.renderMode, "source-image-css-clip");
  assert.equal(noAvanzar.auditStatus, "reconciled-source-visual");

  for (const path of sectionPaths) {
    const source = readFileSync(path, "utf8");
    assert.match(source, /kind:\s*"manual-sign-catalog"/u, `${path} exposes individual catalog block`);
  }

  const appSource = readFileSync(appPath, "utf8");
  assert.match(appSource, /ManualSignCatalogBlockView/u);
  assert.match(appSource, /manualSignEntriesForSection/u);
  assert.match(appSource, /manual-sign-caption/u);
});
