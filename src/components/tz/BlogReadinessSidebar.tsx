/**
 * Правая боковая панель таблицы готовности (/tz/blog/overview#readiness).
 * Работает строго в режиме чтения на основе данных из tzBlogOverview.json:
 * 1) Дедлайн — крупная дата сдачи выбранного раздела и автоматический подсчёт оставшихся дней;
 * 2) Прогресс — общее количество работ, взято/не взято и готово.
 */
import type { BlogReadinessWorkItem } from '../../types/project';

/** Входные свойства боковой панели прогресса и дедлайна */
interface BlogReadinessSidebarProps {
  /** Название активного раздела (для заголовков и доступных подписей) */
  sectionLabel: string;
  /** Дата крайнего срока в формате YYYY-MM-DD из JSON */
  deadlineDate: string;
  /** Список работ текущего раздела из JSON */
  works: BlogReadinessWorkItem[];
}

/**
 * Подбирает правильную форму русского слова «день» по числу.
 * @param count Абсолютное целое число дней.
 * @returns Строка «день», «дня» или «дней».
 */
function pluralizeDays(count: number): string {
  const mod100 = Math.abs(count) % 100;
  const mod10 = mod100 % 10;
  if (mod100 >= 11 && mod100 <= 14) {
    return 'дней';
  }
  if (mod10 === 1) {
    return 'день';
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return 'дня';
  }
  return 'дней';
}

/**
 * Форматирует ISO-дату YYYY-MM-DD в читаемый формат ДД.ММ.ГГГГ
 * и вычисляет остаток дней до дедлайна относительно локального начала суток.
 * @param isoDate Строка даты YYYY-MM-DD.
 * @returns Отформатированная дата, подпись остатка и тон индикации.
 */
function getDeadlineInfo(isoDate: string): {
  formattedDate: string;
  countdownText: string;
  tone: 'neutral' | 'soon' | 'overdue' | 'empty';
} {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) {
    return {
      formattedDate: 'НЕ ЗАДАН',
      countdownText: 'Крайний срок не указан',
      tone: 'empty',
    };
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const formattedDate = `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;

  // Сравниваем даты по локальной полуночи, чтобы исключить сдвиги из-за часов и минут
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetMidnight = new Date(year, month - 1, day).getTime();
  const diffDays = Math.round((targetMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    const verb = diffDays % 10 === 1 && diffDays % 100 !== 11 ? 'Остался' : 'Осталось';
    return {
      formattedDate,
      countdownText: `${verb} ${diffDays} ${pluralizeDays(diffDays)} до крайнего срока`,
      tone: diffDays <= 5 ? 'soon' : 'neutral',
    };
  }

  if (diffDays === 0) {
    return {
      formattedDate,
      countdownText: 'Сегодня крайний срок',
      tone: 'soon',
    };
  }

  const overdueDays = Math.abs(diffDays);
  return {
    formattedDate,
    countdownText: `Просрочено на ${overdueDays} ${pluralizeDays(overdueDays)}`,
    tone: 'overdue',
  };
}

/**
 * Рендерит правую панель из двух блоков (Дедлайн + Прогресс работ) в режиме чтения.
 * @param props Данные выбранного раздела из tzBlogOverview.json.
 * @returns JSX-разметка правой колонки таблицы готовности.
 */
export function BlogReadinessSidebar({
  sectionLabel,
  deadlineDate,
  works,
}: BlogReadinessSidebarProps) {
  const deadline = getDeadlineInfo(deadlineDate);

  // Подсчёт показателей строго по массиву работ из JSON
  const totalWorks = works.length;
  const takenWorks = works.filter((work) => work.assignee.trim().length > 0).length;
  const untakenWorks = totalWorks - takenWorks;
  const doneWorks = works.filter((work) => work.status === 'done').length;
  const completionPercent = totalWorks > 0 ? Math.round((doneWorks / totalWorks) * 100) : 0;

  return (
    <aside
      className="blog-readiness-sidebar"
      aria-label={`Дедлайн и прогресс раздела «${sectionLabel}»`}
    >
      {/* Блок 1: Дедлайн */}
      <div className="blog-stat-card">
        <div className="blog-stat-card__head">
          <h3 className="blog-stat-card__title">Дедлайн</h3>
          <span className="blog-stat-card__scope">{sectionLabel}</span>
        </div>

        <p className="blog-deadline-display">{deadline.formattedDate}</p>
        <p className={`blog-deadline-countdown blog-deadline-countdown--${deadline.tone}`}>
          {deadline.countdownText}
        </p>
      </div>

      {/* Блок 2: Прогресс и сводка по работам */}
      <div className="blog-stat-card">
        <div className="blog-stat-card__head">
          <h3 className="blog-stat-card__title">Прогресс</h3>
          <span className="blog-stat-card__percent">{completionPercent}%</span>
        </div>

        <progress
          className={`readiness-progress ${completionPercent === 100 ? 'readiness-progress--done' : ''}`}
          max={100}
          value={completionPercent}
          aria-label={`Готовность раздела «${sectionLabel}»: ${completionPercent}%`}
        />

        <dl className="blog-stat-list">
          <div className="blog-stat-list__row">
            <dt className="blog-stat-list__label">Всего работ</dt>
            <dd className="blog-stat-list__value">{totalWorks}</dd>
          </div>
          <div className="blog-stat-list__row">
            <dt className="blog-stat-list__label">Взято</dt>
            <dd className="blog-stat-list__value blog-stat-list__value--cyan">{takenWorks}</dd>
          </div>
          <div className="blog-stat-list__row">
            <dt className="blog-stat-list__label">Не взято</dt>
            <dd className="blog-stat-list__value blog-stat-list__value--muted">{untakenWorks}</dd>
          </div>
          <div className="blog-stat-list__row">
            <dt className="blog-stat-list__label">Готово</dt>
            <dd className="blog-stat-list__value blog-stat-list__value--amber">{doneWorks}</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}
