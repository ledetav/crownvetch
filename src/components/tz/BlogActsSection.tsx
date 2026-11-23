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
import { BlogActDescription } from './BlogActDescription';
import { BlogActFlowchart } from './BlogActFlowchart';

/** Режим отображения содержимого внутри выбранного акта */
type ActContentView = 'description' | 'flow';

/** Результат разбора хэша URL: выбранный акт, режим и необязательная целевая сцена */
interface ResolvedActHashTarget {
  /** Идентификатор акта */
  actId: BlogActId;
  /** Целевой режим внутри акта (если задан якорь сцены, принудительно открывается схема) */
  view: ActContentView | null;
  /** Идентификатор целевой сцены для раскрытия и фокуса (если передан якорь сцены) */
  sceneId: string | null;
}

/**
 * Проверяет, содержит ли сценарная цепочка акта сцену с указанным идентификатором.
 * @param act Описание акта.
 * @param sceneId Искомый идентификатор сцены.
 * @returns true, если сцена принадлежит этому акту.
 */
function actContainsScene(act: BlogActItem, sceneId: string): boolean {
  if (!act.flow) {
    return false;
  }
  return act.flow.some((node) => {
    if (node.kind === 'scene') {
      return node.scene.id === sceneId;
    }
    if (node.kind === 'branch') {
      return node.columns.some((column) => column.scene.id === sceneId);
    }
    return false;
  });
}

/**
 * Возвращает стартовый режим отображения для указанного акта с учётом доступных данных.
 * @param act Описание акта.
 * @returns 'description', если у акта есть текстовое описание, иначе 'flow'.
 */
function getDefaultActView(act: BlogActItem | undefined): ActContentView {
  if (act?.descriptionParts && act.descriptionParts.length > 0) {
    return 'description';
  }
  return 'flow';
}

/**
 * Определяет активный акт, внутренний режим и (при наличии) целевую сцену по хэшу URL.
 * Поддерживает якоря актов (#act-1..#act-4), якорь описания (#act-1-description)
 * и прямые якоря сцен (#act-1-scene-1..#act-1-scene-10) из таблицы готовности.
 * @param hash Текущий хэш URL из React Router.
 * @param acts Доступный список актов из JSON-хранилища.
 * @returns Объект с идентификатором акта, режимом просмотра и целевой сценой (или null).
 */
function resolveActTargetFromHash(hash: string, acts: BlogActItem[]): ResolvedActHashTarget {
  const cleanHash = hash.replace(/^#/, '');

  if (cleanHash) {
    // 1. Прямое совпадение по якорю акта (#act-1..#act-4)
    const matchedAct = acts.find((act) => act.anchor === hash || act.id === cleanHash);
    if (matchedAct) {
      return { actId: matchedAct.id, view: null, sceneId: null };
    }

    // 2. Прямой переход к текстовому описанию акта (#act-1-description)
    const descriptionAct = acts.find((act) => cleanHash === `${act.id}-description`);
    if (descriptionAct) {
      return { actId: descriptionAct.id, view: 'description', sceneId: null };
    }

    // 3. Поиск сцены внутри схем актов (#act-1-scene-6-1, #act-1-scene-8-1 и т. д.)
    const actWithScene = acts.find((act) => actContainsScene(act, cleanHash));
    if (actWithScene) {
      return { actId: actWithScene.id, view: 'flow', sceneId: cleanHash };
    }
  }

  return { actId: acts[0]?.id ?? 'act-1', view: null, sceneId: null };
}

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

