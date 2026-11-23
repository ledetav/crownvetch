/**
 * Секция «Акты» внутри отдельной страницы «О блоге» (/tz/blog/acts).
 * Отображает заголовок «АКТЫ» со световыми прострелами, внутреннее меню всех
 * четырёх актов (Акт I, Акт II, Акт III, Акт IV) с синхронизацией якоря URL
 * (#act-1..#act-4 или #act-1-scene-X), общее примечание по работе со сценарием
 * (видно на всех актах) и рабочую область выбранного акта (сценарную схему-цепочку
 * или плашку «СКОРО»).
 */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getTzBlogActsDataset } from '../../services/projectDataStore';
import type { BlogActId, BlogActItem } from '../../types/project';
import { BlogActFlowchart } from './BlogActFlowchart';

/** Результат разбора хэша URL: выбранный акт и необязательная целевая сцена */
interface ResolvedActHashTarget {
  /** Идентификатор акта */
  actId: BlogActId;
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
 * Определяет активный акт и (при наличии) целевую сцену по хэшу адресной строки.
 * Поддерживает как якоря актов (#act-1..#act-4), так и прямые якоря сцен
 * (#act-1-scene-1..#act-1-scene-10) из таблицы готовности.
 * @param hash Текущий хэш URL из React Router.
 * @param acts Доступный список актов из JSON-хранилища.
 * @returns Объект с идентификатором акта и целевой сцены (или null).
 */
function resolveActTargetFromHash(hash: string, acts: BlogActItem[]): ResolvedActHashTarget {
  const cleanHash = hash.replace(/^#/, '');

  if (cleanHash) {
    // 1. Прямое совпадение по якорю акта (#act-1..#act-4)
    const matchedAct = acts.find((act) => act.anchor === hash || act.id === cleanHash);
    if (matchedAct) {
      return { actId: matchedAct.id, sceneId: null };
    }

    // 2. Поиск сцены внутри схем актов (#act-1-scene-6, #act-1-scene-8-1 и т. д.)
    const actWithScene = acts.find((act) => actContainsScene(act, cleanHash));
    if (actWithScene) {
      return { actId: actWithScene.id, sceneId: cleanHash };
    }
  }

  return { actId: acts[0]?.id ?? 'act-1', sceneId: null };
}

/**
 * Отрисовывает страницу «О блоге → Акты» с внутренним меню переключения
 * между четырьмя актами, общим примечанием под меню и панелью содержимого активного акта.
 * @returns JSX-разметка раздела /tz/blog/acts.
 */
export function BlogActsSection() {
  const { hash } = useLocation();
  const actsData = getTzBlogActsDataset();
  const initialTarget = resolveActTargetFromHash(hash, actsData.acts);
  const [activeActId, setActiveActId] = useState<BlogActId>(initialTarget.actId);
  const [focusedSceneId, setFocusedSceneId] = useState<string | null>(initialTarget.sceneId);

  // Синхронизируем активный акт и целевую сцену при переходах по ссылкам с якорем
  useEffect(() => {
    if (!hash) {
      return;
    }
    const target = resolveActTargetFromHash(hash, actsData.acts);
    setActiveActId(target.actId);
    setFocusedSceneId(target.sceneId);
  }, [hash, actsData.acts]);

  /** Переключает выбранный акт, сбрасывает фокус сцены и обновляет хэш URL */
  const handleSelectAct = (act: BlogActItem) => {
    setActiveActId(act.id);
    setFocusedSceneId(null);
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
