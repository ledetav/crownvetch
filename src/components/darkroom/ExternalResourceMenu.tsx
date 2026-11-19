/**
 * Компонент вертикального правого меню внешних ресурсов персонажа.
 * Отображает кнопки «Лордок персонажа», «Галерея персонажа» и «Плейлист персонажа»
 * с диагональными стрелками ↗ в верхний правый угол.
 */
import { useState } from 'react';
import type { ExternalResourceLink } from '../../types/project';

/** Входные свойства компонента правого вертикального меню */
interface ExternalResourceMenuProps {
  /** Список пунктов меню внешних ресурсов из tzHero.json */
  links: ExternalResourceLink[];
}

/**
 * Рисует геометрическую стрелку внешнего перехода в верхний правый угол (↗).
 * @returns JSX-иконка диагональной стрелки.
 */
export function ExternalArrowIcon() {
  return (
    <svg
      className="external-menu__arrow"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7M17 7H8.5M17 7V15.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/**
 * Рендерит вертикальное меню внешних ссылок в правой колонке видоискателя.
 * @param props Массив ссылок-заглушек или реальных URL.
 * @returns JSX-разметка вертикального меню со стрелками ↗.
 */
export function ExternalResourceMenu({ links }: ExternalResourceMenuProps) {
  const [selectedStubLabel, setSelectedStubLabel] = useState<string | null>(null);

  return (
    <aside className="external-menu-column" aria-label="Внешние ресурсы персонажа">
      <nav className="external-menu" aria-label="Ссылки на ресурсы персонажа">
        {links.map((item) => {
          const hasUrl = Boolean(item.url.trim());
          const accentClass = `external-menu__item--${item.accent}`;

          if (hasUrl) {
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`external-menu__item ${accentClass}`}
              >
                <span className="external-menu__label-group">
                  <span className="external-menu__index">[{item.indexLabel}]</span>
                  <span className="external-menu__text">{item.label}</span>
                </span>
                <ExternalArrowIcon />
              </a>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className={`external-menu__item ${accentClass}`}
              onClick={() =>
                setSelectedStubLabel((current) => (current === item.label ? null : item.label))
              }
            >
              <span className="external-menu__label-group">
                <span className="external-menu__index">[{item.indexLabel}]</span>
                <span className="external-menu__text">{item.label}</span>
              </span>
              <ExternalArrowIcon />
            </button>
          );
        })}
      </nav>

      {selectedStubLabel ? (
        <p className="external-menu__notice" role="status">
          Внешняя ссылка для раздела «{selectedStubLabel}» будет подключена позже.
        </p>
      ) : null}

      {/* Перекрестие прицела видоискателя в правом нижнем углу */}
      <svg
        className="reticle-crosshair"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M20 6 V34 M6 20 H34" stroke="#eae2d0" strokeWidth="1.5" strokeOpacity="0.72" />
        <circle cx="20" cy="20" r="12" stroke="#3bc7d6" strokeWidth="1" strokeOpacity="0.58" />
      </svg>
    </aside>
  );
}
