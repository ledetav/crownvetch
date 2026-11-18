/**
 * Компонент каркаса киноплёнки и рамки видоискателя.
 * Отрисовывает левую и правую перфорацию 35-мм плёнки, белые уголки камеры
 * с равномерными внешними и внутренними отступами, а также пункты навигации
 * в правом верхнем углу.
 */
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { HeroNavTab } from '../../types/project';

/** Входные свойства оболочки видоискателя */
interface FilmStripFrameProps {
  /** Пункты меню в правом верхнем углу */
  navTabs: HeroNavTab[];
  /** Идентификатор текущего активного таба */
  activeTabId: string;
  /** Обработчик выбора пункта меню */
  onSelectTab: (tab: HeroNavTab) => void;
  /** Внутреннее содержимое сцены видоискателя */
  children: ReactNode;
}

/**
 * Оборачивает полноэкранную сцену в рамку киноплёнки с уголками видоискателя и верхней навигацией.
 * @param props Свойства оболочки видоискателя.
 * @returns JSX-разметка полноэкранного видоискателя с перфорацией.
 */
export function FilmStripFrame({
  navTabs,
  activeTabId,
  onSelectTab,
  children,
}: FilmStripFrameProps) {
  const navigate = useNavigate();

  /**
   * Обрабатывает клик по пункту верхнего меню:
   * при наличии маршрута выполняет переход через React Router.
   */
  const handleTabClick = (tab: HeroNavTab) => {
    onSelectTab(tab);
    if (tab.target.startsWith('/')) {
      navigate(tab.target);
    }
  };

  return (
    <section className="darkroom-hero" aria-label="Экран видоискателя">
      <div className="film-rail film-rail--left" aria-hidden="true" />

      <div className="darkroom-stage">
        <div className="viewfinder-shell">
          <span className="viewfinder-corner viewfinder-corner--tl" aria-hidden="true" />
          <span className="viewfinder-corner viewfinder-corner--tr" aria-hidden="true" />
          <span className="viewfinder-corner viewfinder-corner--bl" aria-hidden="true" />
          <span className="viewfinder-corner viewfinder-corner--br" aria-hidden="true" />

          <header className="darkroom-topbar">
            <nav className="darkroom-nav" aria-label="Навигация видоискателя">
              {navTabs.map((tab) => {
                const isHighlighted = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`darkroom-nav__item ${
                      isHighlighted ? 'darkroom-nav__item--highlighted' : ''
                    }`}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </header>

          <div className="viewfinder-frame">{children}</div>
        </div>
      </div>

      <div className="film-rail film-rail--right" aria-hidden="true" />
    </section>
  );
}
