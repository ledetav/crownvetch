/**
 * Компонент центральной сцены видоискателя.
 * Рендерит спиральный вихрь портала, фоновый крестик прицела
 * и непрерывно вращающуюся орбиту полароидов.
 */
import type { HeroPolaroidCard } from '../../types/project';

/** Входные свойства компонента PolaroidVortex */
interface PolaroidVortexProps {
  /** Список полароидов на орбите */
  polaroids: HeroPolaroidCard[];
}

/**
 * Рендерит центральный портал и кольцо полароидов.
 * @param props Свойства со списком карточек-полароидов.
 * @returns JSX-разметка центральной сцены.
 */
export function PolaroidVortex({ polaroids }: PolaroidVortexProps) {
  return (
    <div className="vortex-center">
      {/* Фоновый вращающийся спиральный портал */}
      <svg
        className="vortex-portal-svg"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="185" stroke="rgba(59, 199, 214, 0.18)" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="200" cy="200" r="145" stroke="rgba(232, 190, 103, 0.22)" strokeWidth="1" />
        <circle cx="200" cy="200" r="105" stroke="rgba(214, 54, 56, 0.2)" strokeWidth="1" strokeDasharray="4 8" />
        <path
          d="M200 25 C280 25, 375 120, 375 200 C375 280, 280 375, 200 375 C120 375, 25 280, 25 200 C25 120, 120 25, 200 25"
          stroke="rgba(59, 199, 214, 0.35)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M200 65 C250 65, 335 130, 335 200 C335 270, 250 335, 200 335 C150 335, 65 270, 65 200 C65 130, 150 65, 200 65"
          stroke="rgba(232, 190, 103, 0.3)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* Орбита вращающихся полароидов */}
      <div className="polaroid-orbit">
        {polaroids.map((card) => (
          <div
            key={card.id}
            className="polaroid-card-item"
            style={
              {
                '--orbit-angle': `${card.angleDeg}deg`,
                '--card-tilt': `${card.tiltDeg}deg`,
              } as React.CSSProperties
            }
          >
            <div className="polaroid-card-item__inner">
              <div className="polaroid-card-item__photo">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="#141a1d" />
                  <circle cx="50" cy="50" r="28" stroke="#3bc7d6" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M30 70 L50 35 L70 70 Z" stroke="#e8be67" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Центральный значок вихря */}
      <div className="vortex-core-badge" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" stroke="#3bc7d6" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="24" cy="24" r="10" fill="#e8be67" fillOpacity="0.85" />
        </svg>
      </div>

      {/* Перекрестие прицела внизу справа */}
      <svg className="reticle-crosshair" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M20 6 V34 M6 20 H34" stroke="#eae2d0" strokeWidth="1.5" strokeOpacity="0.75" />
        <circle cx="20" cy="20" r="12" stroke="#3bc7d6" strokeWidth="1" strokeOpacity="0.6" />
      </svg>
    </div>
  );
}
