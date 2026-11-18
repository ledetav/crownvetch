/**
 * Компонент каркаса киноплёнки и неподвижной рамки видоискателя.
 * Отрисовывает левую и правую перфорацию 35-мм плёнки, 4 белых уголка камеры,
 * верхнюю панель с индикатором записи ● REC слева и навигацией справа.
 * Внутренняя сцена передаётся через children и может переключаться горизонтально,
 * не смещая саму оболочку видоискателя.
 */
import type { MouseEvent, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { HeroNavTab } from '../../types/project';
import { RecTimer } from './RecTimer';

/** Входные свойства оболочки видоискателя */
interface FilmStripFrameProps {
  /** Необязательный HTML-идентификатор секции */
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
 * Оборачивает сцену в неподвижную рамку киноплёнки с уголками видоискателя,
 * счётчиком REC и верхней навигацией.
 * @param props Свойства оболочки видоискателя и навигации.
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
   * - для якорных ссылок (#...) переключает активную вкладку и обновляет хэш URL (или переходит на /tz#...);
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
            <RecTimer />

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
                    aria-current={isHighlighted ? 'page' : undefined}
                    onClick={(event) => handleTabClick(event, tab)}
                  >
                    {tab.label}
                  </a>
                );
              })}
            </nav>
          </header>

          {children}
        </div>
      </div>

      <div className="film-rail film-rail--right" aria-hidden="true" />
    </section>
  );
}
