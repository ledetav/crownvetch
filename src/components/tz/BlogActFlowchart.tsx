/**
 * Сценарная схема-цепочка для выбранного акта в разделе «О блоге → Акты».
 * Отрисовывает сцены сверху вниз в виде соединённой схемы из свёрнутых по умолчанию
 * блоков-разворотов (аккордеонов), поддерживает закольцованные развилки предметов
 * с возвратом в сцену-хаб или переходом дальше, а также кнопки раскрытия/сворачивания всех сцен.
 */
import { useEffect, useMemo, useState } from 'react';
import type { BlogActFlowNode, BlogActId, BlogActScene, BlogActSceneMode } from '../../types/project';

/** Входные свойства компонента сценарной схемы акта */
interface BlogActFlowchartProps {
  /** Идентификатор активного акта для сброса состояния раскрытия при переключении */
  actId: BlogActId;
  /** Упорядоченный список узлов схемы (линейные сцены и закольцованные развилки) */
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
 * Возвращает подпись формата сцены для бейджа в шапке карточки.
 * @param mode Системный код формата сцены.
 * @returns Строка «Текстовый блок» или «Визуальная новелла».
 */
function formatSceneModeLabel(mode: BlogActSceneMode): string {
  return mode === 'text_quest' ? 'Текстовый блок' : 'Визуальная новелла';
}

/**
 * Собирает плоский список всех идентификаторов сцен из линейных и закольцованных узлов.
 * @param flow Узлы сценарной цепочки акта.
 * @returns Массив идентификаторов всех сцен акта.
 */
function collectAllSceneIds(flow: BlogActFlowNode[]): string[] {
  const ids: string[] = [];
  for (const node of flow) {
    if (node.kind === 'scene') {
      ids.push(node.scene.id);
    } else {
      ids.push(node.hub.id);
      for (const branchScene of node.branches) {
        ids.push(branchScene.id);
      }
    }
  }
  return ids;
}

/**
 * Отрисовывает отдельную сцену сценария в виде сворачиваемого блока-разворота.
 * В шапке отображаются строго название «Сцена Номер» и бейдж формата
 * («Текстовый блок» или «Визуальная новелла»), а внутри — структурированные поля:
 * Катсцена/Фон, Текстовый блок/Мысли и Спрайты (для визуальной новеллы).
 * @param props Данные сцены, состояние раскрытия и обработчик переключения.
 * @returns JSX-разметка карточки сцены.
 */
function ActSceneAccordionCard({ scene, isExpanded, onToggle }: ActSceneAccordionCardProps) {
  const bodyId = `${scene.id}-body`;

  // Для текстовых блоков поле «Спрайты» не выводится
  const visibleBlocks =
    scene.mode === 'visual_novel'
      ? scene.blocks
      : scene.blocks.filter((block) => block.kind !== 'sprites');

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
        <div className="act-scene-card__header-row">
          <div className="act-scene-card__heading-group">
            <h3 className="act-scene-card__title">{scene.title}</h3>
            <span className={`act-scene-card__mode act-scene-card__mode--${scene.mode}`}>
              {formatSceneModeLabel(scene.mode)}
            </span>
          </div>

          <span className="act-scene-card__toggle" aria-hidden="true">
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div id={bodyId} className="act-scene-card__body">
          {visibleBlocks.map((block, index) => (
            <div
              key={`${scene.id}-block-${index}`}
              className={`act-scene-block act-scene-block--${block.kind}`}
            >
              <div className="act-scene-block__label">{block.label}</div>
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
 * закольцованными развилками и управлением разворотом всех сцен.
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

  /** Возвращает фокус и прокрутку к сцене-хабу закольцованной развилки */
  const handleReturnToHub = (hubId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.add(hubId);
      return next;
    });
    const hubElement = document.getElementById(hubId);
    hubElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                <div
                  className="act-flow-loop"
                  aria-label={`Закольцованный переход: ${node.hub.title} и осмотр предметов`}
                >
                  {/* Левая магистраль петли возврата: идёт вверх и стрелкой входит в сцену-хаб */}
                  <div className="act-flow-loop__return-rail" aria-hidden="true">
                    <span className="act-flow-loop__return-top-arrow" />
                  </div>

                  <div className="act-flow-loop__content">
                    {/* Сцена-хаб (например, Сцена 8) */}
                    <ActSceneAccordionCard
                      scene={node.hub}
                      isExpanded={expandedIds.has(node.hub.id)}
                      onToggle={handleToggleScene}
                    />

                    {/* Ветвление вниз от сцены-хаба к параллельным сценам осмотра предметов */}
                    <div className="act-flow-loop__fork-down" aria-hidden="true">
                      <span className="act-flow-loop__stem" />
                      <div className="act-flow-loop__rails act-flow-loop__rails--top">
                        <span className="act-flow-loop__rail-left">
                          <span className="act-flow-loop__down-arrow" />
                        </span>
                        <span className="act-flow-loop__rail-right">
                          <span className="act-flow-loop__down-arrow" />
                        </span>
                      </div>
                    </div>

                    {/* Параллельные сцены осмотра предметов (8.1 и 8.2) */}
                    <div className="act-flow-loop__grid">
                      {node.branches.map((branchScene) => (
                        <div key={branchScene.id} className="act-flow-loop__col">
                          <ActSceneAccordionCard
                            scene={branchScene}
                            isExpanded={expandedIds.has(branchScene.id)}
                            onToggle={handleToggleScene}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Схождение выходов из 8.1 и 8.2 в развилку «возврат к Сцене 8 ИЛИ далее к Сцене 9» */}
                    <div className="act-flow-loop__merge-down" aria-hidden="true">
                      <div className="act-flow-loop__rails act-flow-loop__rails--bottom">
                        <span className="act-flow-loop__rail-left" />
                        <span className="act-flow-loop__rail-right" />
                      </div>
                      <span className="act-flow-loop__stem" />
                    </div>

                    <div className="act-flow-loop__exit-bar">
                      <button
                        type="button"
                        className="act-flow-loop__return-btn"
                        onClick={() => handleReturnToHub(node.hub.id)}
                      >
                        <span aria-hidden="true">↺</span>
                        <span>{node.returnLabel}</span>
                      </button>

                      <span className="act-flow-loop__or" aria-hidden="true">
                        ИЛИ
                      </span>

                      <span className="act-flow-loop__exit-tag">
                        <span aria-hidden="true">↓</span>
                        <span>{node.exitLabel}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!isLast && (
                <div
                  className={`act-flow-connector ${
                    node.kind === 'loop_branch' ? 'act-flow-connector--amber' : ''
                  }`}
                  aria-hidden="true"
                >
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
