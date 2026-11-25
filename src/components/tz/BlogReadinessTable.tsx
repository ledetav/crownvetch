/**
 * Секция #readiness на странице «О блоге → Общая информация».
 * Отрисовывает данные строго из JSON (без внешнего редактирования):
 * внутреннее меню из 6 разделов («Общее», «Шапка», «Акт I–IV»),
 * панель фильтрации таблицы по тегу («Все», «Арты», «Тексты», «Реплики», «Оформление», «Код», «Другое»),
 * 6-колоночную таблицу работ («Ссылка на ТЗ», «Название работы», «Тег», «Статус»,
 * «Исполнитель», «Ссылка на готовую работу») и правую боковую панель
 * с дедлайном и сводкой прогресса. На узких мобильных экранах строки
 * таблицы перестраиваются в вертикальные карточки через атрибуты data-label.
 */
import { useState } from 'react';
import type {
  BlogReadinessSection,
  BlogReadinessSectionId,
  BlogWorkTag,
} from '../../types/project';
import {
  BLOG_WORK_STATUS_LABELS,
  BLOG_WORK_TAG_LABELS,
  type BlogTagFilterValue,
} from '../../utils/blogReadinessLabels';
import { BlogCompactLink } from './BlogCompactLink';
import { BlogReadinessSidebar } from './BlogReadinessSidebar';
import { BlogReadinessTagFilter } from './BlogReadinessTagFilter';

/** Входные свойства секции таблицы готовности */
interface BlogReadinessTableProps {
  /** Заголовок секции таблицы */
  heading: string;
  /** Краткое пояснение к таблице */
  note: string;
  /** Массив разделов готовности из tzBlogOverview.json */
  sections: BlogReadinessSection[];
}

/**
 * Отрисовывает вкладку «Таблица готовности» в режиме чтения:
 * меню разделов, фильтр по тегу, 6-колоночную таблицу работ и правую панель дедлайна/прогресса.
 * @param props Заголовок, пояснение и список разделов из JSON.
 * @returns JSX-разметка панели #readiness.
 */
export function BlogReadinessTable({ heading, note, sections }: BlogReadinessTableProps) {
  const [activeSectionId, setActiveSectionId] = useState<BlogReadinessSectionId>(
    () => sections[0]?.id ?? 'general',
  );
  const [activeTagFilter, setActiveTagFilter] = useState<BlogTagFilterValue>('all');

  const activeSection =
    sections.find((section) => section.id === activeSectionId) ?? sections[0];

  if (!activeSection) {
    return null;
  }

  // Подсчитываем количество работ каждого тега внутри активного раздела для бейджей фильтра
  const tagCounts: Record<BlogWorkTag, number> = {
    art: 0,
    text: 0,
    dialogue: 0,
    design: 0,
    code: 0,
    other: 0,
  };
  for (const work of activeSection.works) {
    tagCounts[work.tag] += 1;
  }

  const visibleWorks =
    activeTagFilter === 'all'
      ? activeSection.works
      : activeSection.works.filter((work) => work.tag === activeTagFilter);

  return (
    <section
      id="readiness"
      role="tabpanel"
      className="blog-readiness-panel"
      aria-labelledby="blog-readiness-title"
    >
      <div className="blog-readiness-head">
        <div className="blog-panel-head">
          <h2 id="blog-readiness-title" className="dossier-bio__heading">
            {heading}
          </h2>
          <p className="blog-panel-lead">{note}</p>
        </div>
      </div>

      {/* Внутреннее меню разделов над таблицей: Общее, Шапка, Акт I–IV */}
      <div
        className="blog-section-nav"
        role="tablist"
        aria-label="Разделы таблицы готовности"
      >
        {sections.map((section) => {
          const isActive = section.id === activeSection.id;
          return (
            <button
              key={section.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`blog-section-nav__item ${
                isActive ? 'blog-section-nav__item--active' : ''
              }`}
              onClick={() => setActiveSectionId(section.id)}
            >
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Двухколоночная рабочая зона: таблица работ (или плашка «СКОРО») слева, дедлайн и прогресс справа */}
      <div className="blog-readiness-layout">
        <div className="blog-readiness-table-box">
          {activeSection.comingSoon ? (
            <div
              className="blog-coming-soon-plate"
              role="status"
              aria-label={`Раздел «${activeSection.label}»: скоро`}
            >
              <span className="blog-coming-soon-plate__eyebrow">{activeSection.label}</span>
              <strong className="blog-coming-soon-plate__title">СКОРО</strong>
              <p className="blog-coming-soon-plate__note">
                Список работ для этого акта будет добавлен позже.
              </p>
            </div>
          ) : (
            <>
              <BlogReadinessTagFilter
                activeTag={activeTagFilter}
                totalCount={activeSection.works.length}
                tagCounts={tagCounts}
                onSelectTag={setActiveTagFilter}
              />

              <div className="social-table-wrap">
                <table className="social-table blog-readiness-table">
              <thead>
                <tr>
                  <th scope="col">Ссылка на ТЗ</th>
                  <th scope="col">Название работы</th>
                  <th scope="col">Тег</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Исполнитель</th>
                  <th scope="col">Ссылка на готовую работу</th>
                </tr>
              </thead>
              <tbody>
                {visibleWorks.length === 0 ? (
                  <tr className="blog-readiness-table__empty-row">
                    <td colSpan={6} className="blog-readiness-table__empty-cell">
                      <span>
                        В разделе «{activeSection.label}» нет работ с тегом «
                        {BLOG_WORK_TAG_LABELS[activeTagFilter as BlogWorkTag]}».
                      </span>
                      <button
                        type="button"
                        className="blog-tag-filter__reset"
                        onClick={() => setActiveTagFilter('all')}
                      >
                        Показать все
                      </button>
                    </td>
                  </tr>
                ) : (
                  visibleWorks.map((work) => {
                    const assigneeText = work.assignee.trim();

                    return (
                      <tr key={work.id}>
                        <td
                          className="blog-readiness-table__tz-cell"
                          data-label="Ссылка на ТЗ"
                        >
                          <BlogCompactLink
                            url={work.tzUrl}
                            label="ТЗ"
                            titleText={`Открыть ТЗ для «${work.title}»`}
                            emptyAriaLabel="Ссылка на ТЗ не указана"
                            variant="tz"
                          />
                        </td>

                        <td
                          className="blog-readiness-table__title"
                          data-label="Название работы"
                        >
                          {work.title}
                        </td>

                        <td
                          className="blog-readiness-table__tag-cell"
                          data-label="Тег"
                        >
                          <span className={`blog-work-tag blog-work-tag--${work.tag}`}>
                            {BLOG_WORK_TAG_LABELS[work.tag]}
                          </span>
                        </td>

                        <td
                          className="blog-readiness-table__status-cell"
                          data-label="Статус"
                        >
                          <span
                            className={`blog-status-label blog-status-label--${work.status}`}
                          >
                            {BLOG_WORK_STATUS_LABELS[work.status]}
                          </span>
                        </td>

                        <td
                          className="blog-readiness-table__assignee-cell"
                          data-label="Исполнитель"
                        >
                          {assigneeText ? (
                            <span className="blog-assignee-text">{assigneeText}</span>
                          ) : (
                            <span className="blog-assignee-empty">Не назначен</span>
                          )}
                        </td>

                        <td
                          className="blog-readiness-table__result-cell"
                          data-label="Готовая работа"
                        >
                          <BlogCompactLink
                            url={work.resultUrl}
                            label="Работа"
                            titleText={`Открыть готовую работу «${work.title}»`}
                            emptyAriaLabel="Ссылка на готовую работу не указана"
                            variant="result"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
            </>
          )}
        </div>

        <BlogReadinessSidebar
          sectionLabel={activeSection.label}
          deadlineDate={activeSection.deadlineDate}
          works={activeSection.works}
        />
      </div>
    </section>
  );
}
