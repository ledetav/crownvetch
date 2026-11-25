/**
 * Нераскрывающийся блок-мостик с действием между сценами в сценарной схеме акта.
 * Используется в линейной цепочке и внутри колонок параллельного ветвления
 * компонента BlogActFlowchart.
 */
import type { BlogActActionBridge as BlogActActionBridgeData } from '../../types/project';

/** Входные свойства нераскрывающегося мостика-действия между сценами */
interface BlogActActionBridgeProps {
  /** Данные мостика-действия */
  action: BlogActActionBridgeData;
  /** Компактный режим для действий внутри колонок ветвления */
  compact?: boolean;
}

/**
 * Отрисовывает нераскрывающийся блок-мостик с действием между сценами.
 * @param props Данные действия и необязательный флаг компактного вида.
 * @returns JSX-разметка мостика-действия.
 */
export function BlogActActionBridge({ action, compact = false }: BlogActActionBridgeProps) {
  return (
    <div
      id={action.id}
      className={`act-action-bridge ${compact ? 'act-action-bridge--compact' : ''}`}
    >
      <div className="act-action-bridge__head">
        <span className="act-action-bridge__arrow" aria-hidden="true">
          →
        </span>
        <span className="act-action-bridge__label">{action.label}</span>
      </div>
      {action.description && <p className="act-action-bridge__desc">{action.description}</p>}
    </div>
  );
}
