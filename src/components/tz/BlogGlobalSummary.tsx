/**
 * Верхняя общая сводная таблица на странице «О блоге → Общая информация».
 * Располагается справа от главного заголовка страницы и агрегирует данные
 * по всем разделам из tzBlogOverview.json в режиме чтения:
 * - обратный отсчёт дней до дня рождения (29 декабря);
 * - общий прогресс-бар, всего работ и количество готовых;
 * - разбивку по категориям: Арты (фоны, катсцены, спрайты),
 *   Тексты (тексты и реплики), Оформление и Код.
 */
import type { BlogReadinessSection, BlogWorkTag } from '../../types/project';
import { calculateDateCountdown, pluralizeDays } from '../../utils/dateCountdown';

/** Входные свойства общей сводной таблицы блога */
interface BlogGlobalSummaryProps {
  /** Целевая дата дня рождения в формате YYYY-MM-DD из tzBlogOverview.json */
  birthdayDate: string;
  /** Все разделы таблицы готовности из tzBlogOverview.json */
  sections: BlogReadinessSection[];
}

/** Сводка счётчиков для одной укрупнённой категории работ */
interface CategorySummaryRow {
  /** Системный ключ категории */
  id: string;
  /** Название категории */
  label: string;
  /** Краткое пояснение состава категории */
  hint: string;
  /** Общее количество работ в категории */
  total: number;
  /** Количество выполненных работ в категории */
  done: number;
  /** Цветовой модификатор числа */
  accent: 'cyan' | 'amber' | 'neutral';
}

const ART_TAGS: ReadonlySet<BlogWorkTag> = new Set(['cutscene', 'background', 'sprite']);
const TEXT_TAGS: ReadonlySet<BlogWorkTag> = new Set(['text', 'dialogue']);

/**
 * Формирует читаемую подпись обратного отсчёта до дня рождения.
 * @param diffDays Количество календарных дней до даты.
 * @returns Строка для отображения в шапке сводки.
 */
function formatBirthdayCountdown(diffDays: number | null): string {
  if (diffDays === null) {
    return 'Дата не указана';
  }
  if (diffDays > 0) {
    return `${diffDays} ${pluralizeDays(diffDays)}`;
  }
  if (diffDays === 0) {
    return 'Сегодня';
  }
  const passed = Math.abs(diffDays);
  return `Прошло ${passed} ${pluralizeDays(passed)}`;
}

/**
 * Отрисовывает общую сводную таблицу прогресса и обратного отсчёта до дня рождения.
 * @param props Целевая дата дня рождения и массив всех разделов готовности.
 * @returns JSX-разметка сводной карточки в правой части шапки /tz/blog/overview.
 */
export function BlogGlobalSummary({ birthdayDate, sections }: BlogGlobalSummaryProps) {
  const countdown = calculateDateCountdown(birthdayDate);
  const allWorks = sections.flatMap((section) => section.works);

  const totalWorks = allWorks.length;
  const doneWorks = allWorks.filter((work) => work.status === 'done').length;
  const completionPercent = totalWorks > 0 ? Math.round((doneWorks / totalWorks) * 100) : 0;

  // Группируем все задачи по 4 сводным категориям без дублирования и пропусков
  const artWorks = allWorks.filter((work) => ART_TAGS.has(work.tag));
  const textWorks = allWorks.filter((work) => TEXT_TAGS.has(work.tag));
  const designWorks = allWorks.filter((work) => work.tag === 'design');
  const codeWorks = allWorks.filter((work) => work.tag === 'code');

  const categories: CategorySummaryRow[] = [
    {
      id: 'arts',
      label: 'Арты',
      hint: 'фоны, катсцены, спрайты',
      total: artWorks.length,
      done: artWorks.filter((work) => work.status === 'done').length,
      accent: 'amber',
    },
    {
      id: 'texts',
      label: 'Тексты',
      hint: 'тексты, реплики',
      total: textWorks.length,
      done: textWorks.filter((work) => work.status === 'done').length,
      accent: 'cyan',
    },
    {
      id: 'design',
      label: 'Оформление',
      hint: 'элементы оформления',
      total: designWorks.length,
      done: designWorks.filter((work) => work.status === 'done').length,
      accent: 'neutral',
    },
    {
      id: 'code',
      label: 'Код',
      hint: 'блоки кода',
      total: codeWorks.length,
      done: codeWorks.filter((work) => work.status === 'done').length,
      accent: 'cyan',
    },
  ];

  return (
    <aside className="blog-global-summary" aria-label="Общая сводка готовности до дня рождения">
      {/* Верхняя строка: обратный отсчёт до дня рождения (29 декабря) */}
      <div className="blog-global-summary__birthday">
        <div className="blog-global-summary__birthday-meta">
          <span className="blog-global-summary__kicker">До дня рождения</span>
          <span className="blog-global-summary__date">{countdown.formattedDate}</span>
        </div>
        <strong
          className={`blog-global-summary__days blog-global-summary__days--${countdown.tone}`}
        >
          {formatBirthdayCountdown(countdown.diffDays)}
        </strong>
      </div>

      {/* Общий прогресс по всем работам */}
      <div className="blog-global-summary__progress">
        <div className="blog-global-summary__progress-meta">
          <span className="blog-global-summary__totals">
            Готово <strong>{doneWorks}</strong> из <strong>{totalWorks}</strong> работ
          </span>
          <span className="blog-stat-card__percent">{completionPercent}%</span>
        </div>

        <progress
          className={`readiness-progress ${completionPercent === 100 ? 'readiness-progress--done' : ''}`}
          max={100}
          value={completionPercent}
          aria-label={`Общая готовность блога: ${doneWorks} из ${totalWorks} работ (${completionPercent}%)`}
        />
      </div>

      {/* Компактная таблица разбивки по 4 категориям */}
      <table className="blog-global-summary__table">
        <thead>
          <tr>
            <th scope="col">Категория</th>
            <th scope="col" className="blog-global-summary__num-col">
              Всего
            </th>
            <th scope="col" className="blog-global-summary__num-col">
              Готово
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                <span className="blog-global-summary__cat-name">{category.label}</span>
                <span className="blog-global-summary__cat-hint">{category.hint}</span>
              </td>
              <td
                className={`blog-global-summary__num-col blog-global-summary__num--${category.accent}`}
              >
                {category.total}
              </td>
              <td className="blog-global-summary__num-col blog-global-summary__num--done">
                {category.done}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
}
