/**
 * Переключатель внутренних вкладок на странице «О блоге → Общая информация».
 * Переключает отображение между «Аннотация», «Памятка по работе» и «Таблица готовности»
 * и синхронизирует текущий якорь URL (#annotation | #guide | #readiness).
 */
import type { BlogOverviewMicroTab } from '../../types/project';

/** Входные свойства переключателя внутренних вкладок */
interface BlogOverviewSubnavProps {
  /** Список внутренних вкладок (Аннотация, Памятка по работе, Таблица готовности) */
  tabs: BlogOverviewMicroTab[];
  /** Идентификатор текущей активной вкладки */
  activeId: BlogOverviewMicroTab['id'];
  /** Обработчик переключения активной вкладки */
  onSelect: (id: BlogOverviewMicroTab['id']) => void;
}

/**
 * Отрисовывает переключатель внутренних вкладок («Аннотация», «Памятка по работе», «Таблица готовности»)
 * с обновлением хэша адресной строки.
 * @param props Список вкладок, активный идентификатор и коллбэк выбора.
 * @returns JSX-разметка панели вкладок.
 */
export function BlogOverviewSubnav({ tabs, activeId, onSelect }: BlogOverviewSubnavProps) {
  /** Переключает активную вкладку и обновляет хэш URL */
  const handleSelectTab = (tab: BlogOverviewMicroTab) => {
    onSelect(tab.id);
    window.history.replaceState(null, '', tab.anchor);
  };

  return (
    <div
      className="blog-microtabs"
      role="tablist"
      aria-label="Вкладки общей информации о блоге"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={tab.id}
            className={`blog-microtabs__item ${isActive ? 'blog-microtabs__item--active' : ''}`}
            onClick={() => handleSelectTab(tab)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
