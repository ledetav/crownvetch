/**
 * Словари человекочитаемых подписей тегов и статусов работ для таблицы готовности
 * в разделе «О блоге → Общая информация» (#readiness).
 */
import type { BlogWorkStatus, BlogWorkTag } from '../types/project';

/** Возможные значения фильтра таблицы готовности по тегу */
export type BlogTagFilterValue = BlogWorkTag | 'all';

/** Человекочитаемые подписи статусов работ в таблице готовности */
export const BLOG_WORK_STATUS_LABELS: Record<BlogWorkStatus, string> = {
  done: 'Готово',
  in_progress: 'В процессе',
  planned: 'В планах',
};

/** Человекочитаемые подписи тегов работ в таблице готовности */
export const BLOG_WORK_TAG_LABELS: Record<BlogWorkTag, string> = {
  art: 'Арты',
  text: 'Тексты',
  dialogue: 'Реплики',
  design: 'Оформление',
  code: 'Код',
  other: 'Другое',
};

/** Упорядоченный список опций панели фильтрации таблицы готовности по тегу */
export const BLOG_TAG_FILTER_OPTIONS: ReadonlyArray<{ id: BlogTagFilterValue; label: string }> = [
  { id: 'all', label: 'Все' },
  { id: 'art', label: BLOG_WORK_TAG_LABELS.art },
  { id: 'text', label: BLOG_WORK_TAG_LABELS.text },
  { id: 'dialogue', label: BLOG_WORK_TAG_LABELS.dialogue },
  { id: 'design', label: BLOG_WORK_TAG_LABELS.design },
  { id: 'code', label: BLOG_WORK_TAG_LABELS.code },
  { id: 'other', label: BLOG_WORK_TAG_LABELS.other },
];
