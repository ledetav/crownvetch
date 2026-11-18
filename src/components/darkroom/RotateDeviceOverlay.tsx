/**
 * Компонент-заглушка для узких/портретных экранов мобильных устройств.
 * Перекрывает основной экран видоискателя при ширине вьюпорта <= 768px (в портретной ориентации),
 * отображая иконку смартфона в вертикально-горизонтальном положении со скруглёнными стрелками
 * и просьбу повернуть устройство горизонтально.
 */

/**
 * Рендерит оверлей с подсказкой о горизонтальной ориентации экрана.
 * @returns JSX-разметка перекрывающего окна для узких экранов.
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
        {/* Иконка телефона в вертикальном и горизонтальном положении со скруглёнными стрелками */}
        <svg
          className="rotate-device-icon"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Горизонтальный контур телефона (пунктирный/полупрозрачный) */}
          <rect
            x="34"
            y="54"
            width="68"
            height="38"
            rx="6"
            stroke="#3bc7d6"
            strokeWidth="2.2"
            strokeDasharray="4 3"
            fill="rgba(59, 199, 214, 0.08)"
          />
          <circle cx="95" cy="73" r="2" fill="#3bc7d6" />

          {/* Вертикальный контур телефона */}
          <rect
            x="24"
            y="24"
            width="38"
            height="68"
            rx="6"
            stroke="#eae2d0"
            strokeWidth="2.4"
            fill="#12181b"
          />
          <line x1="39" y1="30" x2="47" y2="30" stroke="#eae2d0" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="43" cy="85" r="2.2" fill="#e8be67" />

          {/* Верхняя скруглённая стрелка поворота вправо */}
          <path
            d="M70 24 C86 24, 96 34, 96 48"
            stroke="#e8be67"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M90 43 L96 49 L102 43"
            stroke="#e8be67"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Нижняя скруглённая стрелка поворота влево */}
          <path
            d="M50 102 C34 102, 24 94, 24 84"
            stroke="#d63638"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M19 89 L24 83 L30 88"
            stroke="#d63638"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="rotate-device-title">Поверните устройство горизонтально</p>
        <p className="rotate-device-subtitle">
          Видоискатель рассчитан на альбомный формат экрана
        </p>
      </div>
    </div>
  );
}
