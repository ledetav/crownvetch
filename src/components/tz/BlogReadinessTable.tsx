/**
 * Секция #readiness на странице «О блоге → Общая информация».
 * Отрисовывает черновую таблицу готовности по актам с переключением статуса,
 * изменением процента выполнения, редактированием срока дедлайна (ДД)
 * и автоматическим расчётом среднего прогресса (с сохранением в localStorage).
 */
import { useEffect, useState } from 'react';
import type { BlogActReadinessRow, BlogActStatus } from '../../types/project';

const STORAGE_KEY = 'crownvetch:blog-readiness-v1';

const STATUS_LABELS: Record<BlogActStatus, string> = {
  planned: 'В планах',
  in_progress: 'В работе',
  done: 'Готово',
};

const NEXT_STATUS: Record<BlogActStatus, BlogActStatus> = {
  planned: 'in_progress',
  in_progress: 'done',
  done: 'planned',
};

/** Входные свойства таблицы готовности по актам */
interface BlogReadinessTableProps {
  /** Заголовок блока таблицы */
  heading: string;
  /** Краткое пояснение к трекеру */
  note: string;
  /** Стартовые строки актов из tzBlogOverview.json */
  initialActs: BlogActReadinessRow[];
}

/**
 * Безопасно читает сохранённые строки готовности из localStorage,
 * объединяя их со схемой из JSON на случай добавления новых актов.
 * @param defaults Базовый массив актов из JSON.
 * @returns Восстановленный или исходный список актов.
 */
function loadSavedActs(defaults: BlogActReadinessRow[]): BlogActReadinessRow[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaults;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return defaults;
    }

    const byId = new Map<string, Partial<BlogActReadinessRow>>();
    for (const item of parsed) {
      if (item && typeof item === 'object' && 'id' in item && typeof item.id === 'string') {
        byId.set(item.id, item as Partial<BlogActReadinessRow>);
      }
    }

    return defaults.map((baseRow) => {
      const saved = byId.get(baseRow.id);
      if (!saved) {
        return baseRow;
      }

      const validStatus: BlogActStatus =
        saved.status === 'planned' || saved.status === 'in_progress' || saved.status === 'done'
          ? saved.status
          : baseRow.status;

      const validPercent =
        typeof saved.progressPercent === 'number' && Number.isFinite(saved.progressPercent)
          ? Math.max(0, Math.min(100, Math.round(saved.progressPercent)))
          : baseRow.progressPercent;

      return {
        ...baseRow,
        status: validStatus,
        progressPercent: validPercent,
        deadline: typeof saved.deadline === 'string' ? saved.deadline : baseRow.deadline,
      };
    });
  } catch {
    return defaults;
  }
}

/**
 * Отрисовывает интерактивную таблицу готовности по актам с процентами и полями ДД.
 * @param props Заголовок, пояснение и начальный список актов.
 * @returns JSX-разметка секции #readiness.
 */
export function BlogReadinessTable({ heading, note, initialActs }: BlogReadinessTableProps) {
  const [acts, setActs] = useState<BlogActReadinessRow[]>(() => loadSavedActs(initialActs));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(acts));
    } catch {
      // Игнорируем ограничения localStorage в изолированных iframe-окружениях
    }
  }, [acts]);

  // Реальная математика: средний процент по всем актам и количество завершённых актов
  const totalCount = acts.length;
  const completedCount = acts.filter((act) => act.status === 'done').length;
  const averagePercent =
    totalCount > 0
      ? Math.round(acts.reduce((sum, act) => sum + act.progressPercent, 0) / totalCount)
      : 0;

  /** Переключает статус акта по циклу и синхронизирует процент, если нужно */
  const handleCycleStatus = (id: string) => {
    setActs((prev) =>
      prev.map((row) => {
        if (row.id !== id) {
          return row;
        }
        const nextStatus = NEXT_STATUS[row.status];
        let nextPercent = row.progressPercent;
        if (nextStatus === 'done') {
          nextPercent = 100;
        } else if (nextStatus === 'planned') {
          nextPercent = 0;
        } else if (row.progressPercent === 0 || row.progressPercent === 100) {
          nextPercent = 50;
        }
        return { ...row, status: nextStatus, progressPercent: nextPercent };
      }),
    );
  };

  /** Изменяет процент готовности на заданный шаг (-10 / +10) и обновляет статус */
  const handleStepProgress = (id: string, delta: number) => {
    setActs((prev) =>
      prev.map((row) => {
        if (row.id !== id) {
          return row;
        }
        const nextPercent = Math.max(0, Math.min(100, row.progressPercent + delta));
        const nextStatus: BlogActStatus =
          nextPercent === 100 ? 'done' : nextPercent === 0 ? 'planned' : 'in_progress';
        return { ...row, progressPercent: nextPercent, status: nextStatus };
      }),
    );
  };

  /** Обновляет строку дедлайна (ДД) для выбранного акта */
  const handleDeadlineChange = (id: string, value: string) => {
    setActs((prev) =>
      prev.map((row) => (row.id === id ? { ...row, deadline: value } : row)),
    );
  };

  /** Сбрасывает все отметки таблицы к стартовым значениям из JSON */
  const handleReset = () => {
    setActs(initialActs);
  };

  return (
    <section
      id="readiness"
      className="blog-anchor-section blog-readiness-panel"
      aria-labelledby="blog-readiness-title"
    >
      <div className="blog-readiness-head">
        <div className="blog-panel-head">
          <h2 id="blog-readiness-title" className="dossier-bio__heading">
            {heading}
          </h2>
          <p className="blog-panel-lead">{note}</p>
        </div>

        <div className="blog-readiness-summary">
          <div className="blog-readiness-metric">
            <span className="blog-readiness-metric__label">Готово актов:</span>
            <span className="blog-readiness-metric__value">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="blog-readiness-metric">
            <span className="blog-readiness-metric__label">Общий прогресс:</span>
            <span className="blog-readiness-metric__value blog-readiness-metric__value--amber">
              {averagePercent}%
            </span>
          </div>
          <button
            type="button"
            className="blog-reset-btn"
            onClick={handleReset}
            title="Сбросить правки таблицы к стартовым значениям"
          >
            Сбросить
          </button>
        </div>
      </div>

      <div className="social-table-wrap">
        <table className="social-table blog-readiness-table">
          <thead>
            <tr>
              <th scope="col">Акт</th>
              <th scope="col">Этап / фокус</th>
              <th scope="col">Статус</th>
              <th scope="col">Готовность</th>
              <th scope="col">Дедлайн (ДД)</th>
              <th scope="col">Заметка</th>
            </tr>
          </thead>
          <tbody>
            {acts.map((row) => (
              <tr key={row.id}>
                <td className="blog-readiness-table__act">{row.actLabel}</td>
                <td className="blog-readiness-table__focus">{row.focus}</td>
                <td className="blog-readiness-table__status-cell">
                  <button
                    type="button"
                    className={`blog-status-btn blog-status-btn--${row.status}`}
                    onClick={() => handleCycleStatus(row.id)}
                    title="Нажмите для смены статуса акта"
                  >
                    {STATUS_LABELS[row.status]}
                  </button>
                </td>
                <td className="blog-readiness-table__progress-cell">
                  <div className="readiness-control">
                    <button
                      type="button"
                      className="readiness-step-btn"
                      onClick={() => handleStepProgress(row.id, -10)}
                      aria-label={`Уменьшить готовность для «${row.actLabel}» на 10%`}
                      disabled={row.progressPercent <= 0}
                    >
                      −
                    </button>
                    <span className="readiness-percent">{row.progressPercent}%</span>
                    <button
                      type="button"
                      className="readiness-step-btn"
                      onClick={() => handleStepProgress(row.id, 10)}
                      aria-label={`Увеличить готовность для «${row.actLabel}» на 10%`}
                      disabled={row.progressPercent >= 100}
                    >
                      +
                    </button>
                  </div>
                  <progress
                    className={`readiness-progress readiness-progress--${row.status}`}
                    max={100}
                    value={row.progressPercent}
                    aria-label={`Готовность «${row.actLabel}»: ${row.progressPercent}%`}
                  />
                </td>
                <td className="blog-readiness-table__deadline-cell">
                  <input
                    type="text"
                    className="blog-deadline-input"
                    value={row.deadline}
                    placeholder="ДД.ММ.ГГГГ"
                    aria-label={`Дедлайн (ДД) для «${row.actLabel}»`}
                    onChange={(event) => handleDeadlineChange(row.id, event.target.value)}
                  />
                </td>
                <td className="blog-readiness-table__note">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
