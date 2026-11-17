/**
 * Компонент центрального вихря с осколками и вращающимися по кругу полароидами.
 * Поддерживает плавное орбитальное вращение карточек, паузу и реверс направления,
 * а также отображение встроенных векторных миниатюр или кастомных изображений из JSON.
 */
import type { CSSProperties } from 'react';
import type { HeroPolaroidCard, PolaroidArtworkKind } from '../../types/project';

/** Входные свойства компонента центрального вихря */
interface PolaroidVortexProps {
  /** Массив полароидов, вращающихся по орбите */
  polaroids: HeroPolaroidCard[];
  /** Флаг активного воспроизведения анимации вращения */
  isPlaying: boolean;
  /** Флаг обратного направления вращения (REVERSE) */
  isReversed: boolean;
}

/**
 * Генерирует тематическую SVG-миниатюру для карточки полароида,
 * пока не подключены финальные растровые иллюстрации через imageUrl.
 * @param kind Тип сюжета карточки.
 * @returns Векторная иллюстрация внутри кадра полароида.
 */
function renderPolaroidArtwork(kind: PolaroidArtworkKind) {
  switch (kind) {
    case 'darkroom-monitor':
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <rect width="100" height="100" fill="#132229" />
          <rect x="14" y="18" width="44" height="32" rx="2" fill="#2b4c59" stroke="#78b7c9" strokeWidth="2" />
          <rect x="64" y="26" width="22" height="40" fill="#1f353d" />
          <path d="M10 82 L45 58 L90 85 Z" fill="#0b1317" />
        </svg>
      );
    case 'silhouette-hand':
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <linearGradient id="skySilhouette" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d9e8ec" />
              <stop offset="100%" stopColor="#6a8d9b" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#skySilhouette)" />
          <circle cx="58" cy="36" r="14" fill="#13191d" />
          <path d="M22 92 C24 62, 42 52, 58 52 C74 52, 84 66, 86 92 Z" fill="#13191d" />
          <path d="M24 66 L14 38 L23 35 L33 60 Z" fill="#13191d" />
        </svg>
      );
    case 'antique-clock':
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <rect width="100" height="100" fill="#2b241d" />
          <circle cx="50" cy="50" r="38" fill="#d9ccb8" stroke="#8a6c46" strokeWidth="5" />
          <circle cx="50" cy="50" r="31" fill="none" stroke="#4a3925" strokeWidth="1.5" strokeDasharray="3 4" />
          <line x1="50" y1="50" x2="50" y2="25" stroke="#241a10" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="50" x2="69" y2="57" stroke="#241a10" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'sunset-figure':
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <linearGradient id="amberHorizon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8c6747" />
              <stop offset="65%" stopColor="#e2b47c" />
              <stop offset="100%" stopColor="#261b14" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#amberHorizon)" />
          <circle cx="50" cy="48" r="7" fill="#1c140f" />
          <path d="M36 86 L44 56 L56 56 L64 86 Z" fill="#1c140f" />
        </svg>
      );
    case 'dark-dial':
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <rect width="100" height="100" fill="#111618" />
          <circle cx="50" cy="50" r="36" fill="#1c2427" stroke="#b99c6b" strokeWidth="4" />
          <line x1="50" y1="50" x2="36" y2="30" stroke="#e5cfa5" strokeWidth="2.5" />
          <line x1="50" y1="50" x2="72" y2="44" stroke="#e5cfa5" strokeWidth="2" />
        </svg>
      );
    case 'hourglass':
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <rect width="100" height="100" fill="#17232b" />
          <path d="M28 18 H72 L54 50 L72 82 H28 L46 50 Z" fill="none" stroke="#d9c39e" strokeWidth="3" />
          <polygon points="36,78 64,78 50,58" fill="#e5b973" />
          <line x1="50" y1="50" x2="50" y2="75" stroke="#e5b973" strokeWidth="2" />
        </svg>
      );
    case 'pocket-watch':
    default:
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <rect width="100" height="100" fill="#1a2124" />
          <circle cx="50" cy="54" r="33" fill="#cfc3ae" stroke="#7d6442" strokeWidth="4" />
          <circle cx="50" cy="15" r="6" fill="none" stroke="#b59463" strokeWidth="2.5" />
          <line x1="50" y1="54" x2="64" y2="38" stroke="#221911" strokeWidth="2.5" />
          <line x1="50" y1="54" x2="40" y2="66" stroke="#221911" strokeWidth="2" />
        </svg>
      );
  }
}

/**
 * Отрисовывает центральный вихрь с осколками стекла и вращающейся орбитой снимков.
 * @param props Список карточек полароидов и состояние воспроизведения/реверса.
 * @returns JSX-разметка центральной композиции.
 */
export function PolaroidVortex({
  polaroids,
  isPlaying,
  isReversed,
}: PolaroidVortexProps) {
  const orbitClasses = [
    'polaroid-orbit',
    isReversed ? 'polaroid-orbit--reverse' : '',
    !isPlaying ? 'polaroid-orbit--paused' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const portalSvgClasses = [
    'vortex-portal-svg',
    isReversed ? 'vortex-portal-svg--reverse' : '',
    !isPlaying ? 'vortex-portal-svg--paused' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="vortex-center" aria-label="Спиральный вихрь снимков">
      {/* Спиральные ленты и осколки стекла вокруг портала */}
      <svg className={portalSvgClasses} viewBox="0 0 500 500" aria-hidden="true">
        <defs>
          <radialGradient id="vortexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38e8ff" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#6c8fa1" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#0a0f12" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="250" cy="250" r="230" fill="url(#vortexGlow)" />
        <circle
          cx="250"
          cy="250"
          r="195"
          fill="none"
          stroke="rgba(210, 232, 240, 0.22)"
          strokeWidth="1.5"
          strokeDasharray="34 18 8 18"
        />
        <circle
          cx="250"
          cy="250"
          r="150"
          fill="none"
          stroke="rgba(168, 213, 186, 0.28)"
          strokeWidth="2"
          strokeDasharray="52 24"
        />
        <circle
          cx="250"
          cy="250"
          r="112"
          fill="none"
          stroke="rgba(56, 232, 255, 0.28)"
          strokeWidth="1.5"
          strokeDasharray="22 14"
        />
        {/* Стилизованные осколки стекла по спирали */}
        <polygon points="82,118 118,96 108,136" fill="rgba(180,215,228,0.22)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
        <polygon points="396,128 432,148 404,172" fill="rgba(180,215,228,0.18)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <polygon points="374,368 416,352 396,396" fill="rgba(180,215,228,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <polygon points="98,354 134,382 94,394" fill="rgba(180,215,228,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      </svg>

      {/* Вращающееся по кругу кольцо полароидов */}
      <div className={orbitClasses}>
        {polaroids.map((card) => {
          const itemStyle = {
            '--orbit-angle': `${card.angleDeg}deg`,
            '--card-tilt': `${card.tiltDeg}deg`,
          } as CSSProperties;

          return (
            <div
              key={card.id}
              className="polaroid-card-item"
              style={itemStyle}
              title={card.caption}
            >
              <div
                className={`polaroid-card-item__inner ${
                  !isPlaying ? 'polaroid-card-item__inner--paused' : ''
                }`}
              >
                <div className="polaroid-card-item__photo">
                  {card.imageUrl ? (
                    <img src={card.imageUrl} alt={card.caption} />
                  ) : (
                    renderPolaroidArtwork(card.artworkKind)
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Центральный портал с двумя силуэтами внутри временной воронки */}
      <div className="vortex-core-badge" aria-hidden="true">
        <svg viewBox="0 0 140 140" width="126" height="126">
          <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(236,234,228,0.24)" strokeWidth="1.5" />
          <circle cx="70" cy="70" r="38" fill="none" stroke="rgba(56,232,255,0.34)" strokeWidth="1.2" strokeDasharray="10 6" />
          {/* Левый силуэт в тёмном плаще */}
          <circle cx="48" cy="54" r="5" fill="#101518" stroke="#8fb8c9" strokeWidth="1" />
          <path d="M40 82 L45 61 L53 62 L56 80 L48 88 Z" fill="#12181c" stroke="#8fb8c9" strokeWidth="1" />
          {/* Правый силуэт в светлой куртке */}
          <circle cx="92" cy="52" r="5" fill="#e6ecf0" />
          <path d="M84 80 L88 59 L97 59 L101 79 L91 86 Z" fill="#dce5ea" />
          {/* Линия связи между ними */}
          <path d="M55 64 Q70 58 85 63" fill="none" stroke="#f2c879" strokeWidth="1.2" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* Перекрестие прицела в правом нижнем секторе */}
      <svg className="reticle-crosshair" viewBox="0 0 40 40" aria-hidden="true">
        <line x1="20" y1="2" x2="20" y2="14" stroke="#38e8ff" strokeWidth="2" />
        <line x1="20" y1="26" x2="20" y2="38" stroke="#38e8ff" strokeWidth="2" />
        <line x1="2" y1="20" x2="14" y2="20" stroke="#f2c879" strokeWidth="2" />
        <line x1="26" y1="20" x2="38" y2="20" stroke="#f2c879" strokeWidth="2" />
      </svg>
    </div>
  );
}
