/**
 * Секция #readiness на странице «О блоге → Общая информация».
 * Отрисовывает данные строго из JSON (без внешнего редактирования):
 * внутреннее меню из 6 разделов («Общее», «Шапка», «Акт I–IV»),
 * 6-колоночную таблицу работ («Ссылка на ТЗ», «Название работы», «Тег», «Статус»,
 * «Исполнитель», «Ссылка на готовую работу») и правую боковую панель
 * с дедлайном и сводкой прогресса. На узких мобильных экранах строки
 * таблицы перестраиваются в вертикальные карточки через атрибуты data-label.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type {
  BlogReadinessSection,
  BlogReadinessSectionId,
  BlogWorkStatus,
  BlogWorkTag,
} from '../../types/project';
import { BlogReadinessSidebar } from './BlogReadinessSidebar';

const STATUS_LABELS: Record<BlogWorkStatus, string> = {
  done: 'Готово',
  in_progress: 'В процессе',
  planned: 'В планах',
};

const TAG_LABELS: Record<BlogWorkTag, string> = {
  art: 'Арты',
  text: 'Тексты',
  dialogue: 'Реплики',
  design: 'Оформление',
  code: 'Код',
  other: 'Другое',
};

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
 * Рендерит компактную ссылку на ТЗ или на готовую работу (внутреннюю или внешнюю),
 * либо прочерк «—», если ссылка в JSON не указана.
 * @param url Целевой URL из JSON.
 * @param label Короткая подпись на кнопке-ссылке.
 * @param titleText Подсказка для атрибута title.
 * @param emptyAriaLabel Доступная подпись при отсутствии ссылки.
 * @param variant Визуальный вариант ссылки ('tz' | 'result').
 * @returns JSX-разметка ссылки или заглушки «—».
 */
function renderCompactLink(
  url: string | undefined,
  label: string,
  titleText: string,
  emptyAriaLabel: string,
  variant: 'tz' | 'result',
) {
  const trimmedUrl = url?.trim() ?? '';
  if (!trimmedUrl) {
    return (
      <span className="blog-tz-empty" aria-label={emptyAriaLabel}>
        —
      </span>
    );
  }

  const linkClass = variant === 'result' ? 'blog-tz-link blog-tz-link--result' : 'blog-tz-link';
  const isInternalRoute = trimmedUrl.startsWith('/');

  if (isInternalRoute) {
    return (
      <Link to={trimmedUrl} className={linkClass} title={titleText}>
        <span>{label}</span>
        <span aria-hidden="true">↗</span>
      </Link>
    );
  }

  return (
    <a
      href={trimmedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
      title={titleText}
    >
      <span>{label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

/**
 * Отрисовывает вкладку «Таблица готовности» в режиме чтения:
 * меню разделов, 6-колоночную таблицу работ с тегами и правую панель дедлайна/прогресса.
 * @param props Заголовок, пояснение и список разделов из JSON.
 * @returns JSX-разметка панели #readiness.
 */
export function BlogReadinessTable({ heading, note, sections }: BlogReadinessTableProps) {
  const [activeSectionId, setActiveSectionId] = useState<BlogReadinessSectionId>(
    () => sections[0]?.id ?? 'general',
  );

  const activeSection =
    sections.find((section) => section.id === activeSectionId) ?? sections[0];

  if (!activeSection) {
    return null;
  }

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

      {/* Двухколоночная рабочая зона: таблица работ слева, дедлайн и прогресс справа */}
      <div className="blog-readiness-layout">
        <div className="blog-readiness-table-box">
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
                {activeSection.works.map((work) => {
                  const assigneeText = work.assignee.trim();

                  return (
                    <tr key={work.id}>
                      <td
                        className="blog-readiness-table__tz-cell"
                        data-label="Ссылка на ТЗ"
                      >
                        {renderCompactLink(
                          work.tzUrl,
                          'ТЗ',
                          `Открыть ТЗ для «${work.title}»`,
                          'Ссылка на ТЗ не указана',
                          'tz',
                        )}
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
                          {TAG_LABELS[work.tag]}
                        </span>
                      </td>

                      <td
                        className="blog-readiness-table__status-cell"
                        data-label="Статус"
                      >
                        <span className={`blog-status-label blog-status-label--${work.status}`}>
                          {STATUS_LABELS[work.status]}
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
                        {renderCompactLink(
                          work.resultUrl,
                          'Работа',
                          `Открыть готовую работу «${work.title}»`,
                          'Ссылка на готовую работу не указана',
                          'result',
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
