/**
 * Компонент центральной визуальной сцены персонажа.
 * Отрисовывает увеличенный прозрачный арт кота Вязеля с контурной хроматической обводкой
 * и смещённой тенью-двойником, а также расширенный фон фотолаборатории:
 * извивающуюся зигзагом 35-мм фотоплёнку с перфорацией, жёлто-золотые световые полосы,
 * штрихи засветки, осколки негатива и видоискательные метки.
 */
import { useMemo, useState } from 'react';

/** Входные свойства компонента визуальной сцены персонажа */
interface DarkroomVisualStageProps {
  /** Путь к прозрачному изображению персонажа */
  artworkSrc: string;
  /** Альтернативный текст для изображения персонажа */
  altText?: string;
}

/** Опорная точка вдоль извивающейся ленты фотоплёнки */
interface FilmSamplePoint {
  x: number;
  y: number;
  angleDeg: number;
  nx: number;
  ny: number;
}

/** Оформленный элемент фоновой перфорации или кадра вдоль изгиба плёнки */
interface FilmBandGeometry {
  ribbonPath: string;
  sprocketHoles: ReadonlyArray<{
    id: string;
    x: number;
    y: number;
    angleDeg: number;
  }>;
  frames: ReadonlyArray<{
    id: string;
    x: number;
    y: number;
    angleDeg: number;
    tone: string;
    accentStroke: string;
  }>;
}

/**
 * Рассчитывает координаты кривой, перфорационных окошек и внутренних кадров
 * для извивающейся зигзагом 35-мм фотоплёнки позади персонажа.
 * @returns Готовый SVG-контур ленты и массивы её элементов.
 */
function buildWindingFilmGeometry(): FilmBandGeometry {
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

    // Аналитическая производная dx/dy для точного расчёта касательной без артефактов на поворотах
    const dxdy = amplitude * angularFreq * Math.cos(phase);
    const tangentLen = Math.hypot(dxdy, 1);
    const tx = dxdy / tangentLen;
    const ty = 1 / tangentLen;

    // Единичный вектор нормали перпендикулярно ходу плёнки
    const nx = -ty;
    const ny = tx;
    const angleDeg = (Math.atan2(ty, tx) * 180) / Math.PI;

    samples.push({ x, y, angleDeg, nx, ny });
  }

  // Формируем замкнутый контур ленты из левого и правого краёв с шагом halfWidth
  const leftEdge = samples.map((pt, index) => {
    const cmd = index === 0 ? 'M' : 'L';
    return `${cmd} ${(pt.x + pt.nx * halfWidth).toFixed(1)} ${(pt.y + pt.ny * halfWidth).toFixed(1)}`;
  });
  const rightEdge = [...samples]
    .reverse()
    .map((pt) => `L ${(pt.x - pt.nx * halfWidth).toFixed(1)} ${(pt.y - pt.ny * halfWidth).toFixed(1)}`);

  const ribbonPath = `${leftEdge.join(' ')} ${rightEdge.join(' ')} Z`;

  // Расставляем окошки перфорации вдоль обоих краёв плёнки
  const sprocketHoles: Array<{ id: string; x: number; y: number; angleDeg: number }> = [];
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
  const frames: Array<{
    id: string;
    x: number;
    y: number;
    angleDeg: number;
    tone: string;
    accentStroke: string;
  }> = [];

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

/** Искры и пылинки фотозасветки вокруг персонажа и плёнки */
const DARKROOM_SPARKS: ReadonlyArray<{
  id: string;
  cx: number;
  cy: number;
  r: number;
  fill: string;
  opacity: number;
}> = [
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
const AMBER_STREAKS: ReadonlyArray<{
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  opacity: number;
  dashed?: string;
}> = [
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
 * Отрисовывает центральную сцену с увеличенным артом Вязеля, контурной обводкой,
 * тенью-двойником и декоративной зигзагообразной фотоплёнкой позади персонажа.
 * @param props Путь к прозрачному арту персонажа и подпись alt.
 * @returns JSX-разметка центральной визуальной зоны.
 */
export function DarkroomVisualStage({
  artworkSrc,
  altText = 'Вязель — иллюстрация персонажа',
}: DarkroomVisualStageProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const filmBand = useMemo(() => buildWindingFilmGeometry(), []);

  return (
    <div className="darkroom-visual-stage">
      {/* Расширенный задний план: извивающаяся зигзагом плёнка, жёлтые полосы и оформительские штрихи */}
      <svg
        className="darkroom-backdrop-svg"
        viewBox="0 0 700 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="vyazelAuraGlow" cx="55%" cy="46%" r="50%">
            <stop offset="0%" stopColor="#3BC7D6" stopOpacity="0.34" />
            <stop offset="48%" stopColor="#E8BE67" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#0B1317" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="amberStreakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8BE67" stopOpacity="0" />
            <stop offset="22%" stopColor="#F4D078" stopOpacity="0.95" />
            <stop offset="76%" stopColor="#E8BE67" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#3BC7D6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Мягкое контровое свечение за фигурой и тенью */}
        <circle cx="358" cy="306" r="296" fill="url(#vyazelAuraGlow)" />

        {/* Жёлтые и бирюзовые дуги световой засветки позади композиции */}
        <path
          d="M524 18 C430 164, 594 344, 488 614"
          stroke="rgba(232, 190, 103, 0.52)"
          strokeWidth="1.6"
        />
        <path
          d="M168 42 C244 218, 92 404, 214 606"
          stroke="rgba(232, 190, 103, 0.36)"
          strokeWidth="1.2"
          strokeDasharray="16 8"
        />
        <path
          d="M78 552 C210 606, 474 602, 628 524"
          stroke="rgba(59, 199, 214, 0.3)"
          strokeWidth="1.2"
        />

        {/* Извивающаяся зигзагом 35-мм фотоплёнка */}
        <g opacity="0.86">
          <path
            d={filmBand.ribbonPath}
            fill="#0A1014"
            stroke="rgba(234, 226, 208, 0.28)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Перфорация вдоль обоих краёв извивающейся ленты */}
          {filmBand.sprocketHoles.map((hole) => (
            <rect
              key={hole.id}
              x={hole.x - 5.2}
              y={hole.y - 3.1}
              width="10.4"
              height="6.2"
              rx="1.4"
              fill="#040709"
              stroke="rgba(232, 190, 103, 0.24)"
              strokeWidth="0.7"
              transform={`rotate(${hole.angleDeg.toFixed(1)} ${hole.x.toFixed(1)} ${hole.y.toFixed(1)})`}
            />
          ))}

          {/* Кадровые окна вдоль изгиба плёнки */}
          {filmBand.frames.map((frame) => (
            <rect
              key={frame.id}
              x={frame.x - 16}
              y={frame.y - 14}
              width="32"
              height="28"
              rx="1.5"
              fill={frame.tone}
              stroke={frame.accentStroke}
              strokeWidth="0.9"
              transform={`rotate(${frame.angleDeg.toFixed(1)} ${frame.x.toFixed(1)} ${frame.y.toFixed(1)})`}
            />
          ))}
        </g>

        {/* Множественные жёлтые полоски и лучи засветки разной толщины */}
        {AMBER_STREAKS.map((streak) => (
          <line
            key={streak.id}
            x1={streak.x1}
            y1={streak.y1}
            x2={streak.x2}
            y2={streak.y2}
            stroke="url(#amberStreakGrad)"
            strokeWidth={streak.width}
            strokeOpacity={streak.opacity}
            strokeDasharray={streak.dashed}
          />
        ))}

        {/* Оформляшки: технические метки экспозиции, уголки кадра, крестики и осколки */}
        <g stroke="#E8BE67" strokeOpacity="0.62" strokeWidth="1.2">
          <path d="M98 76 H124 M111 63 V89" />
          <path d="M584 562 H610 M597 549 V575" />
          <path d="M558 76 H584 V102" />
          <path d="M88 566 H114 V540" />
          <circle cx="592" cy="198" r="11" strokeOpacity="0.46" strokeDasharray="4 3" />
          <circle cx="114" cy="398" r="9" stroke="#3BC7D6" strokeOpacity="0.44" />
        </g>

        {/* Короткие жёлтые штрих-шкалы у краёв сцены */}
        <g stroke="rgba(232, 190, 103, 0.56)" strokeWidth="1.2">
          <path d="M58 214 H82 M64 222 H82 M58 230 H82 M68 238 H82" />
          <path d="M608 332 H634 M616 340 H634 M608 348 H634 M618 356 H634" />
        </g>

        {/* Золотистые и бирюзовые осколки негатива */}
        <polygon
          points="104,492 132,474 118,510"
          fill="rgba(232, 190, 103, 0.2)"
          stroke="rgba(232, 190, 103, 0.62)"
          strokeWidth="1"
        />
        <polygon
          points="562,126 588,118 574,146"
          fill="rgba(59, 199, 214, 0.18)"
          stroke="rgba(59, 199, 214, 0.54)"
          strokeWidth="1"
        />
        <polygon
          points="514,552 532,542 526,564"
          fill="rgba(234, 226, 208, 0.18)"
          stroke="rgba(232, 190, 103, 0.52)"
          strokeWidth="0.9"
        />

        {/* Искры и золотистые пылинки */}
        {DARKROOM_SPARKS.map((spark) => (
          <circle
            key={spark.id}
            cx={spark.cx}
            cy={spark.cy}
            r={spark.r}
            fill={spark.fill}
            opacity={spark.opacity}
          />
        ))}
      </svg>

      {!hasImageError ? (
        <div className="darkroom-character-figure">
          {/* Смещённый силуэт-тень позади кота по альфа-маске того же PNG */}
          <img
            src={artworkSrc}
            alt=""
            aria-hidden="true"
            className="darkroom-character-shadow"
            referrerPolicy="no-referrer"
          />

          {/* Основной арт персонажа с хроматической контурной обводкой (бирюза + янтарь) */}
          <img
            src={artworkSrc}
            alt={altText}
            className="darkroom-character-art"
            referrerPolicy="no-referrer"
            onError={() => setHasImageError(true)}
          />
        </div>
      ) : (
        /* Стилизованный резервный блок на случай недоступности файла изображения */
        <div className="darkroom-character-fallback" role="img" aria-label={altText}>
          <span>ВЯЗЕЛЬ</span>
        </div>
      )}
    </div>
  );
}
