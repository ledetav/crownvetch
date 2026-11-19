/**
 * Панель внутренних якорных микровкладок на странице «О блоге → Общая информация».
 * Позволяет быстро переключаться и прокручивать страницу к секциям #synopsis и #readiness.
 */
import type { MouseEvent } from 'react';
import type { BlogOverviewMicroTab } from '../../types/project';

/** Входные свойства панели якорных микровкладок */
interface BlogOverviewSubnavProps {
  /** Список якорных микровкладок (Синопсис, Таблица готовности) */
  tabs: BlogOverviewMicroTab[];
  /** Идентификатор текущей выбранной микровкладки */
  activeId: BlogOverviewMicroTab['id'];
  /** Обработчик переключения активной микровкладки */
  onSelect: (id: BlogOverviewMicroTab['id']) => void;
}

/**
 * Отрисовывает две якорные микровкладки («Синопсис» и «Таблица готовности»)
 * с обновлением хэша URL и плавной прокруткой к целевой секции.
 * @param props Список вкладок, активный идентификатор и коллбэк выбора.
 * @returns JSX-разметка панели микровкладок.
 */
export function BlogOverviewSubnav({ tabs, activeId, onSelect }: BlogOverviewSubnavProps) {
  /**
   * Перехватывает переход по якорю, активирует вкладку, обновляет хэш адресной строки
   * и плавно прокручивает экран к соответствующему разделу.
   */
  const handleMicroTabClick = (
    event: MouseEvent<HTMLAnchorElement>,
    tab: BlogOverviewMicroTab,
  ) => {
    event.preventDefault();
    onSelect(tab.id);

    // Обновляем якорь в URL без добавления лишних записей в историю навигации
    window.history.replaceState(null, '', tab.anchor);

    const targetEl = document.getElementById(tab.id);
    if (targetEl) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      targetEl.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <nav className="blog-microtabs" aria-label="Разделы общей информации о блоге">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <a
            key={tab.id}
            href={tab.anchor}
            className={`blog-microtabs__item ${isActive ? 'blog-microtabs__item--active' : ''}`}
            aria-current={isActive ? 'true' : undefined}
            onClick={(event) => handleMicroTabClick(event, tab)}
          >
            {tab.label}
          </a>
        );
      })}
    </nav>
  );
}
