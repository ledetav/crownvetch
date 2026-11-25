/**
 * Генератор SVG-геометрии и декоративных массивов для фона сцены видоискателя
 * (DarkroomVisualStage): извивающаяся зигзагом 35-мм фотоплёнка, перфорация,
 * экспозиционные кадры, искры засветки и янтарные световые полосы.
 */

/** Опорная точка вдоль извивающейся ленты фотоплёнки */
interface FilmSamplePoint {
  /** Координата X точки на оси ленты */
  x: number;
  /** Координата Y точки на оси ленты */
  y: number;
  /** Угол поворота касательной в градусах */
  angleDeg: number;
  /** Компонента X единичной нормали к ленте */
  nx: number;
  /** Компонента Y единичной нормали к ленте */
  ny: number;
}

/** Элемент перфорационного окошка вдоль края 35-мм фотоплёнки */
export interface FilmSprocketHole {
  /** Уникальный идентификатор окошка */
  id: string;
  /** Координата центра X */
  x: number;
  /** Координата центра Y */
  y: number;
  /** Угол поворота окошка вдоль изгиба ленты */
  angleDeg: number;
}

/** Внутренний экспозиционный кадр на ленте фотоплёнки */
export interface FilmFrameSlot {
  /** Уникальный идентификатор кадра */
  id: string;
  /** Координата центра X */
  x: number;
  /** Координата центра Y */
  y: number;
  /** Угол поворота кадра вдоль изгиба ленты */
  angleDeg: number;
  /** Тон подложки кадра */
  tone: string;
  /** Цвет акцентной обводки кадра */
  accentStroke: string;
}

/** Геометрия извивающейся зигзагом 35-мм фотоплёнки */
export interface FilmBandGeometry {
  /** Замкнутый SVG-контур ленты (атрибут d элемента path) */
  ribbonPath: string;
  /** Массив перфорационных окошек вдоль обоих краёв */
  sprocketHoles: ReadonlyArray<FilmSprocketHole>;
  /** Массив экспозиционных кадров внутри ленты */
  frames: ReadonlyArray<FilmFrameSlot>;
}

/** Параметры декоративной искры фотозасветки */
export interface DarkroomSpark {
  /** Уникальный идентификатор искры */
  id: string;
  /** Координата центра X */
  cx: number;
  /** Координата центра Y */
  cy: number;
  /** Радиус круга */
  r: number;
  /** Цвет заливки */
  fill: string;
  /** Непрозрачность */
  opacity: number;
}

/** Параметры декоративного луча засветки */
export interface DarkroomAmberStreak {
  /** Уникальный идентификатор луча */
  id: string;
  /** Начальная координата X */
  x1: number;
  /** Начальная координата Y */
  y1: number;
  /** Конечная координата X */
  x2: number;
  /** Конечная координата Y */
  y2: number;
  /** Толщина линии */
  width: number;
  /** Непрозрачность линии */
  opacity: number;
  /** Необязательный паттерн пунктира stroke-dasharray */
  dashed?: string;
}

/** Искры и пылинки фотозасветки вокруг персонажа и плёнки */
export const DARKROOM_SPARKS: ReadonlyArray<DarkroomSpark> = [
  { id: 'sp-1', cx: 146, cy: 112, r: 2.1, fill: '#E8BE67', opacity: 0.85 },
  { id: 'sp-2', cx: 472, cy: 96, r: 2.5, fill: '#F4D078', opacity: 0.9 },
  { id: 'sp-3', cx: 534, cy: 162, r: 1.8, fill: '#E8BE67', opacity: 0.78 },
  { id: 'sp-4', cx: 196, cy: 194, r: 1.5, fill: '#3BC7D6', opacity: 0.7 },
  { id: 'sp-5', cx: 562, cy: 238, r: 2.8, fill: '#E8BE67', opacity: 0.88 },
  { id: 'sp-6', cx: 112, cy: 288, r: 2.3, fill: '#F4D078', opacity: 0.8 },
  { id: 'sp-7', cx: 492, cy: 314, r: 1.7, fill: '#3BC7D6', opacity: 0.72 },
  { id: 'sp-8', cx: 544, cy: 388, r: 3.1, fill: '#E8BE67', opacity: 0.86 },
  { id: 'sp-9', cx: 138, cy: 432, r: 2.4, fill: '#E8BE67', opacity: 0.82 },
  { id: 'sp-10', cx: 518, cy: 472, r: 2.0, fill: '#F4D078', opacity: 0.76 },
  { id: 'sp-11', cx: 176, cy: 544, r: 2.6, fill: '#E8BE67', opacity: 0.84 },
  { id: 'sp-12', cx: 584, cy: 526, r: 1.9, fill: '#3BC7D6', opacity: 0.68 },
  { id: 'sp-13', cx: 248, cy: 76, r: 1.4, fill: '#F4D078', opacity: 0.74 },
  { id: 'sp-14', cx: 446, cy: 572, r: 2.2, fill: '#E8BE67', opacity: 0.8 },
];

/** Параметры декоративных диагональных и продольных жёлтых полос засветки */
export const AMBER_STREAKS: ReadonlyArray<DarkroomAmberStreak> = [
  { id: 'st-1', x1: 68, y1: 144, x2: 632, y2: 68, width: 2.2, opacity: 0.62 },
  { id: 'st-2', x1: 94, y1: 162, x2: 598, y2: 96, width: 1.0, opacity: 0.44, dashed: '18 8 4 8' },
  { id: 'st-3', x1: 42, y1: 318, x2: 646, y2: 244, width: 1.7, opacity: 0.52 },
  { id: 'st-4', x1: 118, y1: 336, x2: 664, y2: 272, width: 0.9, opacity: 0.36 },
  { id: 'st-5', x1: 58, y1: 492, x2: 616, y2: 396, width: 2.0, opacity: 0.56 },
  { id: 'st-6', x1: 98, y1: 516, x2: 654, y2: 434, width: 1.1, opacity: 0.42, dashed: '10 6' },
  { id: 'st-7', x1: 426, y1: 32, x2: 554, y2: 604, width: 1.4, opacity: 0.38 },
  { id: 'st-8', x1: 146, y1: 46, x2: 246, y2: 594, width: 1.0, opacity: 0.3 },
];

/**
 * Рассчитывает координаты кривой, перфорационных окошек и внутренних кадров
 * для извивающейся зигзагом 35-мм фотоплёнки позади персонажа.
 * @returns Готовый SVG-контур ленты и массивы её элементов.
 */
export function buildWindingFilmGeometry(): FilmBandGeometry {
  const sampleCount = 72;
  const startY = 30;
  const endY = 610;
  const halfWidth = 31;
  const centerX = 350;
  const amplitude = 178;
  const angularFreq = 0.0114;

  // Вычисляем опорные точки центральной оси синусоидального зигзага и нормали к нему
  const samples: FilmSamplePoint[] = [];
  for (let i = 0; i <= sampleCount; i += 1) {
    const progress = i / sampleCount;
    const y = startY + (endY - startY) * progress;
    const phase = (y - 50) * angularFreq - 0.55;
    const x = centerX + amplitude * Math.sin(phase);

    // Аналитическая производная dx/dy для точного расчёта касательной на поворотах
    const dxdy = amplitude * angularFreq * Math.cos(phase);
    const tangentLen = Math.hypot(dxdy, 1);
    const tx = dxdy / tangentLen;
    const ty = 1 / tangentLen;

    const nx = -ty;
    const ny = tx;
    const angleDeg = (Math.atan2(ty, tx) * 180) / Math.PI;

    samples.push({ x, y, angleDeg, nx, ny });
  }

  // Формируем замкнутый контур ленты из левого и правого краёв
  const leftEdge = samples.map((pt, index) => {
    const cmd = index === 0 ? 'M' : 'L';
    return `${cmd} ${(pt.x + pt.nx * halfWidth).toFixed(1)} ${(pt.y + pt.ny * halfWidth).toFixed(1)}`;
  });
  const rightEdge = [...samples]
    .reverse()
    .map(
      (pt) =>
        `L ${(pt.x - pt.nx * halfWidth).toFixed(1)} ${(pt.y - pt.ny * halfWidth).toFixed(1)}`,
    );

  const ribbonPath = `${leftEdge.join(' ')} ${rightEdge.join(' ')} Z`;

  // Расставляем окошки перфорации вдоль обоих краёв плёнки
  const sprocketHoles: FilmSprocketHole[] = [];
  const holeOffset = halfWidth * 0.74;
  for (let i = 1; i < samples.length - 1; i += 2) {
    const pt = samples[i];
    sprocketHoles.push(
      {
        id: `hole-l-${i}`,
        x: pt.x + pt.nx * holeOffset,
        y: pt.y + pt.ny * holeOffset,
        angleDeg: pt.angleDeg,
      },
      {
        id: `hole-r-${i}`,
        x: pt.x - pt.nx * holeOffset,
        y: pt.y - pt.ny * holeOffset,
        angleDeg: pt.angleDeg,
      },
    );
  }

  // Внутренние экспозиционные кадры вдоль ленты
  const frameTones = ['#121C23', '#17232B', '#141B22', '#19242C'];
  const frames: FilmFrameSlot[] = [];

  for (let i = 4, idx = 0; i < samples.length - 4; i += 6, idx += 1) {
    const pt = samples[i];
    frames.push({
      id: `frame-${idx}`,
      x: pt.x,
      y: pt.y,
      angleDeg: pt.angleDeg,
      tone: frameTones[idx % frameTones.length],
      accentStroke:
        idx % 3 === 0
          ? 'rgba(232, 190, 103, 0.32)'
          : idx % 3 === 1
            ? 'rgba(59, 199, 214, 0.24)'
            : 'rgba(234, 226, 208, 0.18)',
    });
  }

  return { ribbonPath, sprocketHoles, frames };
}
