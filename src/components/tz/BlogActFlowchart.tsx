/**
 * Сценарная схема-цепочка для выбранного акта в разделе «О блоге → Акты».
 * Отрисовывает сцены сверху вниз в виде соединённой схемы из свёрнутых по умолчанию
 * блоков-разворотов (аккордеонов), поддерживает параллельные развилки с условием
 * схождения и кнопки быстрого раскрытия/сворачивания всех сцен акта.
 */
import { useEffect, useMemo, useState } from 'react';
import type { BlogActFlowNode, BlogActId, BlogActScene, BlogActSceneMode } from '../../types/project';

/** Входные свойства компонента сценарной схемы акта */
interface BlogActFlowchartProps {
  /** Идентификатор активного акта для сброса состояния раскрытия при переключении */
  actId: BlogActId;
  /** Упорядоченный список узлов схемы (линейные сцены и развилки) */
  flow: BlogActFlowNode[];
}

/** Входные свойства карточки отдельной сцены-разворота */
interface ActSceneAccordionCardProps {
  /** Данные сцены */
  scene: BlogActScene;
  /** Флаг раскрытого состояния блока */
  isExpanded: boolean;
  /** Обработчик переключения состояния блока */
  onToggle: (sceneId: string) => void;
}

/**
 * Возвращает человекочитаемую подпись игрового формата сцены.
 * @param mode Системный код формата сцены.
 * @returns Русскоязычное название формата для плашки.
 */
function formatSceneModeLabel(mode: BlogActSceneMode): string {
  return mode === 'text_quest' ? 'Текстовый квест' : 'Визуальная новелла';
}

/**
 * Собирает плоский список всех идентификаторов сцен из линейных узлов и развилок.
 * @param flow Узлы сценарной цепочки акта.
 * @returns Массив идентификаторов всех сцен акта.
 */
function collectAllSceneIds(flow: BlogActFlowNode[]): string[] {
  const ids: string[] = [];
  for (const node of flow) {
    if (node.kind === 'scene') {
      ids.push(node.scene.id);
    } else {
      for (const branchScene of node.branches) {
        ids.push(branchScene.id);
      }
    }
  }
  return ids;
}

/**
 * Отрисовывает отдельную сцену сценария в виде сворачиваемого блока-разворота.
 * В свёрнутом виде показывает код, формат, условие (если есть) и название сцены;
 * в развёрнутом — блоки техтребований, текста/мыслей и действий.
 * @param props Данные сцены, состояние раскрытия и обработчик переключения.
 * @returns JSX-разметка карточки сцены.
 */
function ActSceneAccordionCard({ scene, isExpanded, onToggle }: ActSceneAccordionCardProps) {
  const bodyId = `${scene.id}-body`;

  return (
    <article
      id={scene.id}
      className={`act-scene-card ${isExpanded ? 'act-scene-card--expanded' : ''}`}
    >
      <button
        type="button"
        className="act-scene-card__trigger"
        aria-expanded={isExpanded}
        aria-controls={bodyId}
        onClick={() => onToggle(scene.id)}
      >
        <div className="act-scene-card__meta">
          <span className="act-scene-card__code">{scene.code}</span>
          <span
            className={`act-scene-card__mode act-scene-card__mode--${scene.mode}`}
          >
            {formatSceneModeLabel(scene.mode)}
          </span>
          {scene.condition && (
            <span className="act-scene-card__condition">{scene.condition}</span>
          )}
        </div>

        <div className="act-scene-card__title-row">
          <h3 className="act-scene-card__title">{scene.title}</h3>
          <span className="act-scene-card__toggle" aria-hidden="true">
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div id={bodyId} className="act-scene-card__body">
          {scene.blocks.map((block, index) => (
            <div
              key={`${scene.id}-block-${index}`}
              className={`act-scene-block act-scene-block--${block.kind}`}
            >
              <div className="act-scene-block__label">
                {block.kind === 'action' && (
                  <span className="act-scene-block__arrow" aria-hidden="true">
                    →
                  </span>
                )}
                <span>{block.label}</span>
              </div>
              <p className="act-scene-block__text">{block.text}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

/**
 * Отрисовывает вертикальную схему-цепочку сцен выбранного акта с соединителями,
 * развилками и управлением разворотом всех сцен.
 * @param props Идентификатор акта и список узлов схемы.
 * @returns JSX-разметка сценарной цепочки.
 */
export function BlogActFlowchart({ actId, flow }: BlogActFlowchartProps) {
  const allSceneIds = useMemo(() => collectAllSceneIds(flow), [flow]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  // При переключении на другой акт все сцены по умолчанию свёрнуты
  useEffect(() => {
    setExpandedIds(new Set());
  }, [actId]);

  /** Переключает развёрнутое состояние отдельной сцены */
  const handleToggleScene = (sceneId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sceneId)) {
        next.delete(sceneId);
      } else {
        next.add(sceneId);
      }
      return next;
    });
  };

  /** Разворачивает все сцены текущего акта одновременно */
  const handleExpandAll = () => {
    setExpandedIds(new Set(allSceneIds));
  };

  /** Сворачивает все сцены текущего акта */
  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const expandedCount = expandedIds.size;
  const totalCount = allSceneIds.length;
  const allExpanded = totalCount > 0 && expandedCount === totalCount;

  return (
    <div className="act-flowchart">
      <div className="act-flowchart__toolbar">
        <span className="act-flowchart__counter">
          Сцен в цепочке: <strong>{totalCount}</strong>
          {expandedCount > 0 ? ` · открыто ${expandedCount}` : ''}
        </span>

        <div className="act-flowchart__controls">
          <button
            type="button"
            className="act-flowchart__ctrl-btn"
            disabled={allExpanded}
            onClick={handleExpandAll}
          >
            Развернуть все
          </button>
          <button
            type="button"
            className="act-flowchart__ctrl-btn"
            disabled={expandedCount === 0}
            onClick={handleCollapseAll}
          >
            Свернуть все
          </button>
        </div>
      </div>

      <ol className="act-flowchart__chain" aria-label="Сценарная цепочка акта">
        {flow.map((node, index) => {
          const isLast = index === flow.length - 1;

          return (
            <li key={node.id} className="act-flowchart__step">
              {node.kind === 'scene' ? (
                <ActSceneAccordionCard
                  scene={node.scene}
                  isExpanded={expandedIds.has(node.scene.id)}
                  onToggle={handleToggleScene}
                />
              ) : (
                <div className="act-flow-branch" aria-label={node.branchLabel}>
                  <div className="act-flow-branch__header">
                    <span className="act-flow-branch__badge">{node.branchLabel}</span>
                  </div>

                  <div className="act-flow-branch__rails act-flow-branch__rails--top" aria-hidden="true">
                    <span className="act-flow-branch__rail-left" />
                    <span className="act-flow-branch__rail-right" />
                  </div>

                  <div className="act-flow-branch__grid">
                    {node.branches.map((branchScene) => (
                      <div key={branchScene.id} className="act-flow-branch__col">
                        <ActSceneAccordionCard
                          scene={branchScene}
                          isExpanded={expandedIds.has(branchScene.id)}
                          onToggle={handleToggleScene}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="act-flow-branch__rails act-flow-branch__rails--bottom" aria-hidden="true">
                    <span className="act-flow-branch__rail-left" />
                    <span className="act-flow-branch__rail-right" />
                  </div>

                  {node.mergeCondition && (
                    <div className="act-flow-branch__merge">
                      <span className="act-flow-branch__merge-badge">{node.mergeCondition}</span>
                    </div>
                  )}
                </div>
              )}

              {!isLast && (
                <div className="act-flow-connector" aria-hidden="true">
                  <span className="act-flow-connector__line" />
                  <span className="act-flow-connector__arrow" />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
