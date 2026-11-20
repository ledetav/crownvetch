/**
 * Компонент-заглушка для вертикальной (портретной) ориентации экрана
 * на маршруте «О персонаже» (/tz/character).
 * Показывается только когда большая сторона телефона или планшета расположена вертикально,
 * и предлагает повернуть устройство горизонтально либо перейти в разделы,
 * адаптированные под вертикальный экран («О владельце», «О блоге»).
 */
import { Link } from 'react-router-dom';

/**
 * Рендерит оверлей с подсказкой о горизонтальной ориентации экрана для раздела «О персонаже».
 * @returns JSX-разметка перекрывающего окна для портретной ориентации.
 */
export function RotateDeviceOverlay() {
  return (
    <div
      className="rotate-device-overlay"
      role="dialog"
      aria-live="polite"
      aria-label="Поверните устройство горизонтально"
    >
      <div className="rotate-device-card">
        {/* Статичная иконка телефона в вертикальном и горизонтальном положении со скруглёнными стрелками */}
        <svg
          className="rotate-device-icon"
          viewBox="0 0 120 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Горизонтальный контур телефона (пунктирный/полупрозрачный) */}
          <rect
            x="34"
            y="50"
            width="68"
            height="38"
            rx="6"
            stroke="#3bc7d6"
            strokeWidth="2.2"
            strokeDasharray="4 3"
            fill="rgba(59, 199, 214, 0.08)"
          />
          <circle cx="95" cy="69" r="2" fill="#3bc7d6" />

          {/* Вертикальный контур телефона */}
          <rect
            x="24"
            y="20"
            width="38"
            height="68"
            rx="6"
            stroke="#eae2d0"
            strokeWidth="2.4"
            fill="#12181b"
          />
          <line x1="39" y1="26" x2="47" y2="26" stroke="#eae2d0" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="43" cy="81" r="2.2" fill="#e8be67" />

          {/* Верхняя скруглённая стрелка поворота вправо */}
          <path
            d="M70 20 C86 20, 96 30, 96 44"
            stroke="#e8be67"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M90 39 L96 45 L102 39"
            stroke="#e8be67"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Нижняя скруглённая красная стрелка вдоль нижнего левого угла вертикального телефона */}
          <path
            d="M28 118 C17 111, 13 98, 19 84"
            stroke="#d63638"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M12 88 L19 83 L23 91"
            stroke="#d63638"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="rotate-device-title">Поверните устройство горизонтально</p>
        <p className="rotate-device-subtitle">
          Раздел «О персонаже» доступен только в горизонтальном положении экрана. Поверните телефон или планшет горизонтально
        </p>

        {/* Быстрый переход на разделы, доступные в вертикальной мобильной вёрстке */}
        <nav className="rotate-device-links" aria-label="Другие разделы сайта">
          <Link to="/tz/owner" className="rotate-device-link">
            <span>О владельце</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link to="/tz/blog/overview" className="rotate-device-link">
            <span>О блоге</span>
            <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
