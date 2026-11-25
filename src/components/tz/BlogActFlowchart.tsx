/**
 * Сценарная схема-цепочка для выбранного акта в разделе «О блоге → Акты».
 * Отрисовывает сцены сверху вниз в виде соединённой схемы из свёрнутых по умолчанию
 * блоков-разворотов (аккордеонов), выносит действия в нераскрывающиеся блоки-мостики
 * между сценами, поддерживает сходящиеся ветки (8.1 / 8.2 → 9) и автофокус
 * с автоматическим раскрытием сцены при переходе по якорной ссылке из таблицы готовности.
 */
import { useEffect, useMemo, useState } from 'react';
import type { BlogActFlowNode, BlogActId } from '../../types/project';
import { BlogActActionBridge } from './BlogActActionBridge';
import { BlogActSceneCard } from './BlogActSceneCard';

/** Входные свойства компонента сценарной схемы акта */
interface BlogActFlowchartProps {
  /** Идентификатор активного акта для сброса состояния раскрытия при переключении */
  actId: BlogActId;
  /** Упорядоченный список узлов схемы (сцены, мостики-действия и ветвления) */
  flow: BlogActFlowNode[];
  /** Идентификатор целевой сцены из якоря URL для автофокуса и раскрытия */
  focusedSceneId?: string | null;
}

/**
 * Собирает плоский список всех идентификаторов сцен из линейных узлов и веток.
 * @param flow Узлы сценарной цепочки акта.
 * @returns Массив идентификаторов всех сцен акта.
 */
function collectAllSceneIds(flow: BlogActFlowNode[]): string[] {
  const ids: string[] = [];
  for (const node of flow) {
    if (node.kind === 'scene') {
      ids.push(node.scene.id);
    } else if (node.kind === 'branch') {
      for (const column of node.columns) {
        ids.push(column.scene.id);
      }
    }
  }
  return ids;
}

/**
 * Отрисовывает вертикальную схему-цепочку сцен выбранного акта с мостиками-действиями,
 * сходящимися ветками и автоматическим раскрытием/фокусировкой сцены по якорной ссылке.
 * @param props Идентификатор акта, узлы схемы и необязательный ID целевой сцены.
 * @returns JSX-разметка сценарной цепочки.
 */
export function BlogActFlowchart({ actId, flow, focusedSceneId = null }: BlogActFlowchartProps) {
  const allSceneIds = useMemo(() => collectAllSceneIds(flow), [flow]);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() =>
    focusedSceneId && allSceneIds.includes(focusedSceneId)
      ? new Set([focusedSceneId])
      : new Set(),
  );

  // При переключении акта сбрасываем открытые сцены, но сразу раскрываем целевую сцену из якоря
  useEffect(() => {
    if (focusedSceneId && allSceneIds.includes(focusedSceneId)) {
      setExpandedIds(new Set([focusedSceneId]));
      return;
    }
    setExpandedIds(new Set());
  }, [actId, focusedSceneId, allSceneIds]);

  // После раскрытия целевой сцены плавно прокручиваем страницу к ней и переводим клавиатурный фокус
  useEffect(() => {
    if (!focusedSceneId || !allSceneIds.includes(focusedSceneId)) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const cardEl = document.getElementById(focusedSceneId);
      const triggerEl = document.getElementById(`${focusedSceneId}-trigger`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (triggerEl instanceof HTMLElement) {
        triggerEl.focus({ preventScroll: true });
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [focusedSceneId, allSceneIds]);

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
          const nextNode = flow[index + 1];
          // Перед ветвлением стрелка рисуется самим узлом ветвления (вилка вниз в две колонки)
          const showConnectorAfter = !isLast && nextNode?.kind !== 'branch';

          return (
            <li key={node.id} className="act-flowchart__step">
              {node.kind === 'scene' && (
                <BlogActSceneCard
                  scene={node.scene}
                  isExpanded={expandedIds.has(node.scene.id)}
                  isFocused={focusedSceneId === node.scene.id}
                  onToggle={handleToggleScene}
                />
              )}

              {node.kind === 'action' && <BlogActActionBridge action={node.action} />}

              {node.kind === 'branch' && (
                <div className="act-flow-branch">
                  {/* Разветвление сверху вниз в две параллельные сцены */}
                  <div className="act-flow-branch__fork" aria-hidden="true">
                    <span className="act-flow-branch__stem" />
                    <div className="act-flow-branch__rails act-flow-branch__rails--top">
                      <span className="act-flow-branch__rail-left">
                        <span className="act-flow-branch__down-arrow" />
                      </span>
                      <span className="act-flow-branch__rail-right">
                        <span className="act-flow-branch__down-arrow" />
                      </span>
                    </div>
                  </div>

                  {/* Две параллельные колонки: сцена + закрывающее действие под ней */}
                  <div className="act-flow-branch__grid">
                    {node.columns.map((column) => (
                      <div key={column.scene.id} className="act-flow-branch__col">
                        <BlogActSceneCard
                          scene={column.scene}
                          isExpanded={expandedIds.has(column.scene.id)}
                          isFocused={focusedSceneId === column.scene.id}
                          onToggle={handleToggleScene}
                        />
                        {column.afterAction && (
                          <>
                            <div
                              className="act-flow-connector act-flow-connector--compact"
                              aria-hidden="true"
                            >
                              <span className="act-flow-connector__line" />
                              <span className="act-flow-connector__arrow" />
                            </div>
                            <BlogActActionBridge action={column.afterAction} compact />
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Схождение двух веток в одну линию перед стрелкой к следующей сцене (Сцена 9) */}
                  <div className="act-flow-branch__merge" aria-hidden="true">
                    <div className="act-flow-branch__rails act-flow-branch__rails--bottom">
                      <span className="act-flow-branch__rail-left" />
                      <span className="act-flow-branch__rail-right" />
                    </div>
                  </div>
                </div>
              )}

              {showConnectorAfter && (
                <div
                  className={`act-flow-connector ${
                    node.kind === 'action' ? 'act-flow-connector--amber' : ''
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
