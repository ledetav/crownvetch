/**
 * Панель фильтрации строк таблицы готовности блога по тегу работы
 * («Все», «Арты», «Тексты», «Реплики», «Оформление», «Код», «Другое»).
 */
import type { BlogWorkTag } from '../../types/project';
import {
  BLOG_TAG_FILTER_OPTIONS,
  type BlogTagFilterValue,
} from '../../utils/blogReadinessLabels';

/** Входные свойства панели фильтрации по тегу */
interface BlogReadinessTagFilterProps {
  /** Текущий активный тег фильтрации */
  activeTag: BlogTagFilterValue;
  /** Общее количество работ в активном разделе */
  totalCount: number;
  /** Счётчики количества работ для каждого тега */
  tagCounts: Record<BlogWorkTag, number>;
  /** Обработчик смены активного тега */
  onSelectTag: (tag: BlogTagFilterValue) => void;
}

/**
 * Отрисовывает панель кнопок фильтрации таблицы готовности по тегам с бейджами количества работ.
 * @param props Активный тег, счётчики работ и колбэк переключения фильтра.
 * @returns JSX-разметка панели фильтрации по тегам.
 */
export function BlogReadinessTagFilter({
  activeTag,
  totalCount,
  tagCounts,
  onSelectTag,
}: BlogReadinessTagFilterProps) {
  return (
    <div className="blog-tag-filter" role="group" aria-label="Фильтр работ по тегу">
      <span className="blog-tag-filter__label">Тег:</span>
      <div className="blog-tag-filter__list">
        {BLOG_TAG_FILTER_OPTIONS.map((option) => {
          const count = option.id === 'all' ? totalCount : tagCounts[option.id];
          const isActive = activeTag === option.id;
          const isEmpty = option.id !== 'all' && count === 0;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              className={`blog-tag-filter__btn blog-tag-filter__btn--${option.id} ${
                isActive ? 'blog-tag-filter__btn--active' : ''
              } ${isEmpty ? 'blog-tag-filter__btn--empty' : ''}`}
              onClick={() => onSelectTag(option.id)}
            >
              <span>{option.label}</span>
              <span className="blog-tag-filter__count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
