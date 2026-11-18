/**
 * Компонент центральной визуальной сцены персонажа.
 * Отрисовывает загруженный прозрачный арт кота Вязеля с контурной хроматической обводкой
 * и смещённой тенью-двойником, а также фоновую атмосферу фотолаборатории
 * (свечение, диагональную негативную плёнку и золотистые искры засветки).
 */
import { useState } from 'react';

/** Входные свойства компонента визуальной сцены персонажа */
interface DarkroomVisualStageProps {
  /** Путь к прозрачному изображению персонажа */
  artworkSrc: string;
  /** Альтернативный текст для изображения персонажа */
  altText?: string;
}

/** Список координат декоративных искр фотозасветки за персонажем */
const DARKROOM_SPARKS: ReadonlyArray<{
  id: string;
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}> = [
  { id: 'sp-1', cx: 312, cy: 118, r: 2.2, opacity: 0.9 },
  { id: 'sp-2', cx: 348, cy: 164, r: 1.5, opacity: 0.72 },
  { id: 'sp-3', cx: 294, cy: 214, r: 2.6, opacity: 0.85 },
  { id: 'sp-4', cx: 374, cy: 248, r: 1.8, opacity: 0.68 },
  { id: 'sp-5', cx: 332, cy: 298, r: 3.0, opacity: 0.82 },
  { id: 'sp-6', cx: 98, cy: 342, r: 1.7, opacity: 0.75 },
  { id: 'sp-7', cx: 364, cy: 382, r: 2.3, opacity: 0.78 },
  { id: 'sp-8', cx: 320, cy: 432, r: 1.4, opacity: 0.64 },
  { id: 'sp-9', cx: 128, cy: 414, r: 2.1, opacity: 0.65 },
  { id: 'sp-10', cx: 392, cy: 322, r: 1.9, opacity: 0.6 },
];

/**
 * Отрисовывает центральную сцену с артом Вязеля, обводкой строго по альфа-контуру и тенью.
 * @param props Путь к прозрачному арту персонажа и подпись alt.
 * @returns JSX-разметка центральной визуальной зоны.
 */
export function DarkroomVisualStage({
  artworkSrc,
  altText = 'Вязель — иллюстрация персонажа',
}: DarkroomVisualStageProps) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div className="darkroom-visual-stage">
      {/* Атмосферный задний план фотолаборатории: аура, негативная лента и золотистые искры */}
      <svg
        className="darkroom-backdrop-svg"
        viewBox="0 0 480 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="vyazelAuraGlow" cx="50%" cy="48%" r="48%">
            <stop offset="0%" stopColor="#3BC7D6" stopOpacity="0.24" />
            <stop offset="48%" stopColor="#E8BE67" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#0B1317" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="240" cy="260" r="228" fill="url(#vyazelAuraGlow)" />

        {/* Диагональная плёнка позади персонажа */}
        <g transform="translate(24 218) rotate(-13)" opacity="0.72">
          <rect
            x="0"
            y="0"
            width="420"
            height="102"
            rx="3"
            fill="#0A1014"
            stroke="rgba(234, 226, 208, 0.2)"
            strokeWidth="1.2"
          />
          {Array.from({ length: 14 }).map((_, index) => {
            const holeX = 12 + index * 29;
            return (
              <g key={`perf-${index}`}>
                <rect
                  x={holeX}
                  y="7"
                  width="15"
                  height="8"
                  rx="1.5"
                  fill="#040709"
                  stroke="rgba(234,226,208,0.16)"
                  strokeWidth="0.7"
                />
                <rect
                  x={holeX}
                  y="87"
                  width="15"
                  height="8"
                  rx="1.5"
                  fill="#040709"
                  stroke="rgba(234,226,208,0.16)"
                  strokeWidth="0.7"
                />
              </g>
            );
          })}
          <rect x="16" y="21" width="120" height="60" fill="#131C22" stroke="rgba(234, 226, 208, 0.14)" />
          <rect x="148" y="21" width="120" height="60" fill="#162027" stroke="rgba(234, 226, 208, 0.14)" />
          <rect x="280" y="21" width="120" height="60" fill="#11191F" stroke="rgba(232, 190, 103, 0.18)" />
        </g>

        {/* Тонкие золотистые дуги засветки */}
        <path d="M332 14 C308 178, 336 352, 396 520" stroke="rgba(232, 190, 103, 0.38)" strokeWidth="1.2" />
        <path d="M62 462 C132 498, 290 506, 434 452" stroke="rgba(59, 199, 214, 0.22)" strokeWidth="1" />

        {/* Золотистые искры и осколки */}
        {DARKROOM_SPARKS.map((spark) => (
          <circle key={spark.id} cx={spark.cx} cy={spark.cy} r={spark.r} fill="#E8BE67" opacity={spark.opacity} />
        ))}
        <polygon points="82,438 104,424 94,452" fill="rgba(234, 226, 208, 0.22)" stroke="rgba(59, 199, 214, 0.42)" strokeWidth="0.8" />
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
