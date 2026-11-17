/**
 * Компонент каркаса киноплёнки и верхней панели видоискателя (PARADOX // DARKROOM).
 * Отрисовывает левую и правую перфорацию плёнки, логотип, пункты навигации
 * (ARCHIVE, DIVE IN, GLITCH PLAYERS, ABOUT) и белые уголки рамки камеры.
 */
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { HeroNavTab } from '../../types/project';

/** Входные свойства оболочки видоискателя */
interface FilmStripFrameProps {
  /** Заголовок бренда в левом верхнем углу */
  brandTitle: string;
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
 * Оборачивает первый экран в рамку киноплёнки с перфорацией и верхней навигацией.
 * @param props Свойства оболочки видоискателя.
 * @returns JSX-разметка первого экрана с перфорацией.
 */
export function FilmStripFrame({
  brandTitle,
  navTabs,
  activeTabId,
  onSelectTab,
  children,
}: FilmStripFrameProps) {
  const navigate = useNavigate();

  /**
   * Обрабатывает клик по пункту верхнего меню:
   * если цель начинается с '/', выполняет переход по маршруту React Router,
   * иначе прокручивает страницу к соответствующей секции ТЗ.
   */
  const handleTabClick = (tab: HeroNavTab) => {
    onSelectTab(tab);
    if (tab.target.startsWith('/')) {
      navigate(tab.target);
      return;
    }

    const sectionEl = document.querySelector(tab.target);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Разделяем заголовок по '//' для подсветки двойного слэша акцентом
  const [brandLeft, brandRight] = brandTitle.split('//').map((part) => part.trim());

  return (
    <section className="darkroom-hero" aria-label="Стартовый экран видоискателя">
      <div className="film-rail film-rail--left" aria-hidden="true" />

      <div className="darkroom-stage">
        <header className="darkroom-topbar">
          <div className="darkroom-brand">
            <span>{brandLeft}</span>
            {brandRight && (
              <>
                <span className="darkroom-brand__slash">//</span>
                <span>{brandRight}</span>
              </>
            )}
          </div>

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

        <div className="viewfinder-frame">
          <span className="viewfinder-corner viewfinder-corner--tl" aria-hidden="true" />
          <span className="viewfinder-corner viewfinder-corner--tr" aria-hidden="true" />
          <span className="viewfinder-corner viewfinder-corner--bl" aria-hidden="true" />
          <span className="viewfinder-corner viewfinder-corner--br" aria-hidden="true" />
          {children}
        </div>
      </div>

      <div className="film-rail film-rail--right" aria-hidden="true" />
    </section>
  );
}
