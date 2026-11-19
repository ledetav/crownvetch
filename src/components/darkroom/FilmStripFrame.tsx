/**
 * Компонент каркаса киноплёнки и рамки видоискателя.
 * Отрисовывает повторяющуюся по высоте перфорацию 35-мм плёнки, липкую верхнюю панель
 * (верхние белые уголки камеры, левый слот с индикатором ● REC или кнопкой возврата,
 * а также маршрутную навигацию справа) и нижние уголки рамки у границы контента.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
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
  /** Идентификатор текущего активного пункта меню */
  activeTabId: string;
  /** Необязательный пользовательский слот в левой части верхней панели (по умолчанию ● REC) */
  leftSlot?: ReactNode;
  /** Необязательный обработчик выбора пункта меню */
  onSelectTab?: (tab: HeroNavTab) => void;
  /** Внутреннее содержимое сцены видоискателя */
  children: ReactNode;
}

/**
 * Оборачивает активную страницу в единую рамку киноплёнки с уголками видоискателя,
 * левым индикатором или кнопкой возврата и верхней маршрутной навигацией.
 * @param props Свойства оболочки видоискателя и навигации.
 * @returns JSX-разметка полноэкранного видоискателя с перфорацией.
 */
export function FilmStripFrame({
  sectionId,
  sectionLabel = 'Экран видоискателя',
  navTabs,
  activeTabId,
  leftSlot,
  onSelectTab,
  children,
}: FilmStripFrameProps) {
  /**
   * Сбрасывает вертикальную прокрутку к началу нового маршрута
   * и уведомляет родительский компонент о переключении пункта меню.
   */
  const handleTabSelect = (tab: HeroNavTab) => {
    onSelectTab?.(tab);
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id={sectionId} className="darkroom-hero" aria-label={sectionLabel}>
      <div className="film-rail film-rail--left" aria-hidden="true" />

      <div className="darkroom-stage">
        <div className="viewfinder-shell">
          <div className="viewfinder-sticky-header">
            <span className="viewfinder-corner viewfinder-corner--tl" aria-hidden="true" />
            <span className="viewfinder-corner viewfinder-corner--tr" aria-hidden="true" />

            <header className="darkroom-topbar">
              <div className="darkroom-topbar__left">{leftSlot ?? <RecTimer />}</div>

              <nav className="darkroom-nav" aria-label="Навигация видоискателя">
                {navTabs.map((tab) => {
                  const isHighlighted = tab.id === activeTabId;
                  return (
                    <Link
                      key={tab.id}
                      to={tab.target}
                      className={`darkroom-nav__item ${
                        isHighlighted ? 'darkroom-nav__item--highlighted' : ''
                      }`}
                      aria-current={isHighlighted ? 'page' : undefined}
                      onClick={() => handleTabSelect(tab)}
                    >
                      {tab.label}
                    </Link>
                  );
                })}
              </nav>
            </header>
          </div>

          <span className="viewfinder-corner viewfinder-corner--bl" aria-hidden="true" />
          <span className="viewfinder-corner viewfinder-corner--br" aria-hidden="true" />

          {children}
        </div>
      </div>

      <div className="film-rail film-rail--right" aria-hidden="true" />
    </section>
  );
}
