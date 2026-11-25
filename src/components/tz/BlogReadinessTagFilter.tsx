/**
 * Панель фильтрации строк таблицы готовности блога по тегу работы
 * («Все», «Арты», «Тексты», «Реплики», «Оформление», «Код», «Другое»).
 * Также экспортирует словарь отображаемых названий тегов BLOG_WORK_TAG_LABELS.
 */
import type { BlogWorkTag } from '../../types/project';

/** Возможные значения фильтра таблицы готовности по тегу */
export type BlogTagFilterValue = BlogWorkTag | 'all';

/** Человекочитаемые подписи тегов работ в таблице готовности */
export const BLOG_WORK_TAG_LABELS: Record<BlogWorkTag, string> = {
  art: 'Арты',
  text: 'Тексты',
  dialogue: 'Реплики',
  design: 'Оформление',
  code: 'Код',
  other: 'Другое',
};

/** Упорядоченный список кнопок фильтра по тегам */
const TAG_FILTER_OPTIONS: ReadonlyArray<{ id: BlogTagFilterValue; label: string }> = [
  { id: 'all', label: 'Все' },
  { id: 'art', label: BLOG_WORK_TAG_LABELS.art },
  { id: 'text', label: BLOG_WORK_TAG_LABELS.text },
  { id: 'dialogue', label: BLOG_WORK_TAG_LABELS.dialogue },
  { id: 'design', label: BLOG_WORK_TAG_LABELS.design },
  { id: 'code', label: BLOG_WORK_TAG_LABELS.code },
  { id: 'other', label: BLOG_WORK_TAG_LABELS.other },
];

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
        {TAG_FILTER_OPTIONS.map((option) => {
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
