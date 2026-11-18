/**
 * Компонент каркаса киноплёнки и рамки видоискателя.
 * Отрисовывает левую и правую перфорацию 35-мм плёнки, белые уголки камеры
 * с равномерными внешними и внутренними отступами, а также пункты навигации
 * в правом верхнем углу с поддержкой якорных переходов внутри ТЗ.
 */
import type { MouseEvent, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { HeroNavTab } from '../../types/project';

/** Входные свойства оболочки видоискателя */
interface FilmStripFrameProps {
  /** Необязательный HTML-идентификатор секции для якорной навигации */
  sectionId?: string;
  /** Доступная подпись секции для скринридеров */
  sectionLabel?: string;
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
 * @param props Свойства оболочки видоискателя и якорной секции.
 * @returns JSX-разметка полноэкранного видоискателя с перфорацией.
 */
export function FilmStripFrame({
  sectionId,
  sectionLabel = 'Экран видоискателя',
  navTabs,
  activeTabId,
  onSelectTab,
  children,
}: FilmStripFrameProps) {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Обрабатывает клик по пункту верхнего меню:
   * - для якорных ссылок (#...) выполняет плавный скролл внутри /tz или переход на /tz#...;
   * - для маршрутов (/...) выполняет переход через React Router.
   */
  const handleTabClick = (event: MouseEvent<HTMLAnchorElement>, tab: HeroNavTab) => {
    event.preventDefault();
    onSelectTab(tab);

    if (tab.target.startsWith('#')) {
      const targetId = tab.target.slice(1);
      if (location.pathname !== '/tz') {
        navigate(`/tz#${targetId}`);
        return;
      }

      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.history.replaceState(null, '', tab.target);
      return;
    }

    if (tab.target.startsWith('/')) {
      navigate(tab.target);
    }
  };

  return (
    <section id={sectionId} className="darkroom-hero" aria-label={sectionLabel}>
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
                const href = tab.target.startsWith('#') ? `/tz${tab.target}` : tab.target;
                return (
                  <a
                    key={tab.id}
                    href={href}
                    className={`darkroom-nav__item ${
                      isHighlighted ? 'darkroom-nav__item--highlighted' : ''
                    }`}
                    onClick={(event) => handleTabClick(event, tab)}
                  >
                    {tab.label}
                  </a>
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
