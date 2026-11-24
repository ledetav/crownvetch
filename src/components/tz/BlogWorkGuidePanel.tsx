/**
 * Секция #guide («Памятка по работе») на странице «О блоге → Общая информация».
 * Содержит внутреннее меню из трёх подразделов («О спрайтах», «О фонах», «О катсценах»),
 * отображает маркированный список требований, примечания, галерею референсов с увеличением
 * по клику и переходы к связанным разделам ТЗ строго из JSON.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { BlogWorkGuideData, BlogWorkGuideSectionId } from '../../types/project';
import { BlogReferenceGallery } from './BlogReferenceGallery';

/** Входные свойства панели памятки по работе */
interface BlogWorkGuidePanelProps {
  /** Конфигурация памятки из tzBlogOverview.json */
  guide: BlogWorkGuideData;
}

/**
 * Отрисовывает вкладку «Памятка по работе» с внутренним меню переключения разделов
 * («О спрайтах», «О фонах», «О катсценах») и просмотром референсов в увеличенном виде.
 * @param props Объект с заголовком, пояснением и списком подразделов памятки.
 * @returns JSX-разметка панели #guide.
 */
export function BlogWorkGuidePanel({ guide }: BlogWorkGuidePanelProps) {
  const [activeSectionId, setActiveSectionId] = useState<BlogWorkGuideSectionId>(
    () => guide.sections[0]?.id ?? 'sprites',
  );

  const activeSection =
    guide.sections.find((section) => section.id === activeSectionId) ?? guide.sections[0];

  if (!activeSection) {
    return null;
  }

  return (
    <section
      id="guide"
      role="tabpanel"
      className="blog-readiness-panel blog-guide-panel"
      aria-labelledby="blog-guide-title"
    >
      <div className="blog-readiness-head">
        <div className="blog-panel-head">
          <h2 id="blog-guide-title" className="dossier-bio__heading">
            {guide.heading}
          </h2>
          <p className="blog-panel-lead">{guide.lead}</p>
        </div>
      </div>

      {/* Внутреннее меню памятки: О спрайтах, О фонах, О катсценах */}
      <div
        className="blog-section-nav blog-guide-nav"
        role="tablist"
        aria-label="Разделы памятки по работе"
      >
        {guide.sections.map((section) => {
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

      {/* Карточка требований выбранного подраздела памятки */}
      <article className="blog-guide-card" aria-labelledby="blog-guide-section-heading">
        <h3 id="blog-guide-section-heading" className="blog-guide-card__title">
          {activeSection.heading}
        </h3>

        {/* Маркированный список требований */}
        <ul className="blog-guide-list">
          {activeSection.points.map((point, index) => (
            <li key={`${activeSection.id}-point-${index}`} className="blog-guide-list__item">
              {point}
            </li>
          ))}
        </ul>

        {/* Дополнительное примечание (например, про мягкий светлый карандашный лайн) */}
        {activeSection.note && <p className="blog-guide-note">{activeSection.note}</p>}

        {/* Галерея визуальных референсов (переиспользуемый блок с лайтбоксом) */}
        {activeSection.references && activeSection.references.length > 0 && (
          <BlogReferenceGallery
            title="Референсы"
            hint="Нажмите на кадр, чтобы рассмотреть детали"
            ariaLabel="Референсы стиля"
            items={activeSection.references}
            aspect="landscape"
          />
        )}

        {/* Быстрый переход к связанной вкладке ТЗ (например, «Персонажи») */}
        {activeSection.relatedLink && (
          <div className="blog-guide-actions">
            <Link to={activeSection.relatedLink.target} className="blog-tz-link">
              <span>{activeSection.relatedLink.label}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
      </article>
    </section>
  );
}
