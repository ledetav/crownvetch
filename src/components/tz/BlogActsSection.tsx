/**
 * Секция «Акты» внутри отдельной страницы «О блоге» (/tz/blog/acts).
 * Отображает заголовок «АКТЫ» со световыми прострелами, внутреннее меню всех
 * четырёх актов (Акт I, Акт II, Акт III, Акт IV) с синхронизацией якоря URL
 * (#act-1..#act-4 или #act-1-scene-X), общее примечание по работе со сценарием
 * (видно на всех актах) и рабочую область выбранного акта с внутренним подменю
 * («Текстовое описание» / «Схема сцен») или плашкой «СКОРО».
 */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getTzBlogActsDataset } from '../../services/projectDataStore';
import type { BlogActId, BlogActItem } from '../../types/project';
import {
  getDefaultActView,
  resolveActTargetFromHash,
  type ActContentView,
} from '../../utils/blogActHash';
import { BlogActDescription } from './BlogActDescription';
import { BlogActFlowchart } from './BlogActFlowchart';

/**
 * Отрисовывает страницу «О блоге → Акты» с внутренним меню переключения
 * между четырьмя актами, общим примечанием под меню и панелью содержимого активного акта
 * (с подменю «Текстовое описание» и «Схема сцен», если доступны оба блока).
 * @returns JSX-разметка раздела /tz/blog/acts.
 */
export function BlogActsSection() {
  const { hash } = useLocation();
  const actsData = getTzBlogActsDataset();
  const initialTarget = resolveActTargetFromHash(hash, actsData.acts);
  const initialAct = actsData.acts.find((act) => act.id === initialTarget.actId) ?? actsData.acts[0];

  const [activeActId, setActiveActId] = useState<BlogActId>(initialTarget.actId);
  const [activeView, setActiveView] = useState<ActContentView>(
    initialTarget.view ?? getDefaultActView(initialAct),
  );
  const [focusedSceneId, setFocusedSceneId] = useState<string | null>(initialTarget.sceneId);

  // Синхронизируем активный акт, внутренний режим и целевую сцену при переходах по ссылкам с якорем
  useEffect(() => {
    if (!hash) {
      return;
    }
    const target = resolveActTargetFromHash(hash, actsData.acts);
    const matchedAct = actsData.acts.find((act) => act.id === target.actId);
    setActiveActId(target.actId);
    setActiveView(target.view ?? getDefaultActView(matchedAct));
    setFocusedSceneId(target.sceneId);
  }, [hash, actsData.acts]);

  /** Переключает выбранный акт, сбрасывает фокус сцены и обновляет хэш URL */
  const handleSelectAct = (act: BlogActItem) => {
    setActiveActId(act.id);
    setActiveView(getDefaultActView(act));
    setFocusedSceneId(null);
    window.history.replaceState(null, '', act.anchor);
  };

  /** Переключает внутреннюю вкладку внутри активного акта («Текстовое описание» / «Схема сцен») */
  const handleSelectView = (view: ActContentView) => {
    setActiveView(view);
    if (view === 'description') {
      setFocusedSceneId(null);
    }
  };

  const activeAct = actsData.acts.find((act) => act.id === activeActId) ?? actsData.acts[0];

  if (!activeAct) {
    return null;
  }

  const hasDescription = Boolean(
    activeAct.descriptionParts && activeAct.descriptionParts.length > 0,
  );
  const hasFlow = Boolean(activeAct.flow && activeAct.flow.length > 0);
  const hasBothViews = hasDescription && hasFlow;

  // Определяем фактический режим показа, если у акта заполнен только один из двух форматов
  const effectiveView: ActContentView = hasBothViews
    ? activeView
    : hasDescription
      ? 'description'
      : 'flow';

  const panelLeadText =
    effectiveView === 'description' && hasDescription
      ? 'Сюжетный пересказ ключевых событий акта по частям.'
      : hasFlow
        ? activeAct.summary
        : null;

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
              {!activeAct.comingSoon && panelLeadText && (
                <p className="blog-panel-lead">{panelLeadText}</p>
              )}
            </div>

            <Link to="/tz/blog/overview#readiness" className="blog-tz-link">
              <span>Таблица готовности</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {/* Внутреннее подменю акта: «Текстовое описание» и «Схема сцен» */}
          {!activeAct.comingSoon && hasBothViews && (
            <div
              className="blog-section-nav blog-act-subnav"
              role="tablist"
              aria-label={`Разделы ${activeAct.heading}`}
            >
              <button
                type="button"
                role="tab"
                aria-selected={effectiveView === 'description'}
                className={`blog-section-nav__item ${
                  effectiveView === 'description' ? 'blog-section-nav__item--active' : ''
                }`}
                onClick={() => handleSelectView('description')}
              >
                Текстовое описание
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={effectiveView === 'flow'}
                className={`blog-section-nav__item ${
                  effectiveView === 'flow' ? 'blog-section-nav__item--active' : ''
                }`}
                onClick={() => handleSelectView('flow')}
              >
                Схема сцен
              </button>
            </div>
          )}

          {activeAct.comingSoon ? (
            <div className="blog-coming-soon-plate" role="status" aria-live="polite">
              <span className="blog-coming-soon-plate__eyebrow">{activeAct.heading}</span>
              <span className="blog-coming-soon-plate__title">СКОРО</span>
              <p className="blog-coming-soon-plate__note">{activeAct.summary}</p>
            </div>
          ) : effectiveView === 'description' && hasDescription && activeAct.descriptionParts ? (
            <BlogActDescription
              parts={activeAct.descriptionParts}
              actHeading={activeAct.heading}
            />
          ) : hasFlow && activeAct.flow ? (
            <BlogActFlowchart
              actId={activeAct.id}
              flow={activeAct.flow}
              focusedSceneId={focusedSceneId}
            />
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

