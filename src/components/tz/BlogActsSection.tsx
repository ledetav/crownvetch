/**
 * Секция «Акты» внутри отдельной страницы «О блоге» (/tz/blog/acts).
 * Отображает заголовок «АКТЫ» со световыми прострелами, внутреннее меню всех
 * четырёх актов (Акт I, Акт II, Акт III, Акт IV) с синхронизацией якоря URL
 * (#act-1..#act-4), общее примечание по работе со сценарием (видно на всех актах)
 * и рабочую область выбранного акта (сценарную схему-цепочку или плашку «СКОРО»).
 */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getTzBlogActsDataset } from '../../services/projectDataStore';
import type { BlogActId, BlogActItem } from '../../types/project';
import { BlogActFlowchart } from './BlogActFlowchart';

/**
 * Определяет идентификатор активного акта по хэшу адресной строки (#act-1..#act-4).
 * Если хэш пустой или не соответствует ни одному акту, возвращает первый акт.
 * @param hash Текущий хэш URL из React Router.
 * @param acts Доступный список актов из JSON-хранилища.
 * @returns Идентификатор выбранного акта.
 */
function resolveActIdFromHash(hash: string, acts: BlogActItem[]): BlogActId {
  const matched = acts.find((act) => act.anchor === hash);
  return matched?.id ?? acts[0]?.id ?? 'act-1';
}

/**
 * Отрисовывает страницу «О блоге → Акты» с внутренним меню переключения
 * между четырьмя актами, общим примечанием под меню и панелью содержимого активного акта.
 * @returns JSX-разметка раздела /tz/blog/acts.
 */
export function BlogActsSection() {
  const { hash } = useLocation();
  const actsData = getTzBlogActsDataset();
  const [activeActId, setActiveActId] = useState<BlogActId>(() =>
    resolveActIdFromHash(hash, actsData.acts),
  );

  // Синхронизируем активный акт при переходах по прямым якорным ссылкам
  useEffect(() => {
    const matched = actsData.acts.find((act) => act.anchor === hash);
    if (matched) {
      setActiveActId(matched.id);
    }
  }, [hash, actsData.acts]);

  /** Переключает выбранный акт и обновляет хэш URL без перезагрузки страницы */
  const handleSelectAct = (act: BlogActItem) => {
    setActiveActId(act.id);
    window.history.replaceState(null, '', act.anchor);
  };

  const activeAct = actsData.acts.find((act) => act.id === activeActId) ?? actsData.acts[0];

  if (!activeAct) {
    return null;
  }

  const hasFlow = Boolean(activeAct.flow && activeAct.flow.length > 0);

  return (
    <section
      data-section="blog-acts"
      className="viewfinder-slide viewfinder-slide--active"
      aria-label="О блоге: Акты"
    >
      <div className="blog-overview-frame">
        <div className="blog-acts-header">
          <div className="dossier-headline-block">
            <div className="vyazel-wrapper">
              <div className="vyazel-ribbon" aria-hidden="true">
                <span className="vyazel-streak vyazel-streak--1" />
                <span className="vyazel-streak vyazel-streak--2" />
                <span className="vyazel-streak vyazel-streak--3" />
              </div>
              <h1 className="serif-vyazel serif-vyazel--blog">{actsData.primaryWord}</h1>
            </div>
            <p className="dossier-secondary-word">{actsData.secondaryWord}</p>
          </div>

          {/* Внутреннее меню переключения всех четырёх актов */}
          <div
            className="blog-microtabs blog-acts-nav"
            role="tablist"
            aria-label="Внутреннее меню актов"
          >
            {actsData.acts.map((act) => {
              const isActive = act.id === activeAct.id;
              return (
                <button
                  key={act.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={act.id}
                  className={`blog-microtabs__item ${
                    isActive ? 'blog-microtabs__item--active' : ''
                  }`}
                  onClick={() => handleSelectAct(act)}
                >
                  {act.label}
                </button>
              );
            })}
          </div>

          {/* Общая памятка редакции сценария — отображается на всех актах под меню */}
          <aside className="blog-acts-editorial-note" aria-label={actsData.editorialNote.label}>
            <span className="blog-acts-editorial-note__label">{actsData.editorialNote.label}</span>
            <p className="blog-acts-editorial-note__text">{actsData.editorialNote.text}</p>
          </aside>
        </div>

        {/* Содержимое активного акта */}
        <section
          id={activeAct.id}
          role="tabpanel"
          className="blog-readiness-panel blog-act-panel"
          aria-labelledby="blog-act-heading"
        >
          <div className="blog-readiness-head">
            <div className="blog-panel-head">
              <h2 id="blog-act-heading" className="dossier-bio__heading">
                {activeAct.heading}
              </h2>
              {hasFlow && <p className="blog-panel-lead">{activeAct.summary}</p>}
            </div>

            <Link to="/tz/blog/overview#readiness" className="blog-tz-link">
              <span>Таблица готовности</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {activeAct.comingSoon ? (
            <div className="blog-coming-soon-plate" role="status" aria-live="polite">
              <span className="blog-coming-soon-plate__eyebrow">{activeAct.heading}</span>
              <span className="blog-coming-soon-plate__title">СКОРО</span>
              <p className="blog-coming-soon-plate__note">{activeAct.summary}</p>
            </div>
          ) : hasFlow && activeAct.flow ? (
            <BlogActFlowchart actId={activeAct.id} flow={activeAct.flow} />
          ) : (
            <div className="blog-act-placeholder">
              <p className="blog-act-placeholder__text">{activeAct.summary}</p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
