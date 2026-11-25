/**
 * Упрощённая верхняя сводка готовности на странице «О блоге → Общая информация».
 * Располагается справа от главного заголовка страницы и агрегирует данные
 * по всем разделам из tzBlogOverview.json в режиме чтения:
 * - строка «До дня рождения N дней» (29 декабря) в одну линию;
 * - крупный плотный прогресс-бар с процентом готовности поверх самой полосы;
 * - текстовая строка «Готово A работ из B, при этом среди них C артов, D текстов,
 *   E элементов оформления, F блоков кода и G других работ» (разбивка от общего числа работ).
 */
import type { BlogReadinessSection } from '../../types/project';
import { calculateDateCountdown, pluralizeDays } from '../../utils/dateCountdown';
import { pluralizeRu } from '../../utils/pluralizeRu';

/** Входные свойства общей сводки готовности блога */
interface BlogGlobalSummaryProps {
  /** Целевая дата дня рождения в формате YYYY-MM-DD из tzBlogOverview.json */
  birthdayDate: string;
  /** Все разделы таблицы готовности из tzBlogOverview.json */
  sections: BlogReadinessSection[];
}

/**
 * Формирует однострочную подпись обратного отсчёта до дня рождения.
 * @param diffDays Количество календарных дней до целевой даты.
 * @returns Читаемая фраза («До дня рождения N дней», «Сегодня день рождения» и т. д.).
 */
function formatBirthdayHeadline(diffDays: number | null): string {
  if (diffDays === null) {
    return 'Дата дня рождения не указана';
  }
  if (diffDays > 0) {
    return `До дня рождения ${diffDays} ${pluralizeDays(diffDays)}`;
  }
  if (diffDays === 0) {
    return 'День рождения сегодня';
  }
  const passed = Math.abs(diffDays);
  return `После дня рождения прошло ${passed} ${pluralizeDays(passed)}`;
}

/**
 * Отрисовывает компактный блок общей готовности блога справа от заголовка страницы.
 * @param props Целевая дата дня рождения и массив всех разделов готовности.
 * @returns JSX-разметка упрощённой сводной карточки /tz/blog/overview.
 */
export function BlogGlobalSummary({ birthdayDate, sections }: BlogGlobalSummaryProps) {
  const countdown = calculateDateCountdown(birthdayDate);
  const allWorks = sections.flatMap((section) => section.works);

  const totalWorks = allWorks.length;
  const doneWorks = allWorks.filter((work) => work.status === 'done').length;
  const completionPercent = totalWorks > 0 ? Math.round((doneWorks / totalWorks) * 100) : 0;

  // Считаем общее количество работ (из всех B) по 5 сводным группам
  const artCount = allWorks.filter((work) => work.tag === 'art').length;
  const textCount = allWorks.filter(
    (work) => work.tag === 'text' || work.tag === 'dialogue',
  ).length;
  const designCount = allWorks.filter((work) => work.tag === 'design').length;
  const codeCount = allWorks.filter((work) => work.tag === 'code').length;
  const otherCount = allWorks.filter((work) => work.tag === 'other').length;

  const isSingleDone = doneWorks % 10 === 1 && doneWorks % 100 !== 11;
  const doneVerb = isSingleDone ? 'Готова' : 'Готово';

  return (
    <aside className="blog-global-summary" aria-label="Общая сводка готовности до дня рождения">
      {/* 1. Однострочный обратный отсчёт до дня рождения */}
      <div className="blog-global-summary__birthday">
        <span
          className={`blog-global-summary__headline blog-global-summary__headline--${countdown.tone}`}
        >
          {formatBirthdayHeadline(countdown.diffDays)}
        </span>
        {countdown.formattedDate && (
          <span className="blog-global-summary__date">{countdown.formattedDate}</span>
        )}
      </div>

      {/* 2. Крупный прогресс-бар с отображением процента прямо поверх полосы */}
      <div
        className={`blog-global-summary__bar ${
          completionPercent === 100 ? 'blog-global-summary__bar--done' : ''
        }`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={completionPercent}
        aria-label={`Общая готовность блога: ${doneWorks} из ${totalWorks} (${completionPercent}%)`}
      >
        <div
          className="blog-global-summary__bar-fill"
          style={{ width: `${completionPercent}%` }}
          aria-hidden="true"
        />
        <span className="blog-global-summary__bar-label">{completionPercent}%</span>
      </div>

      {/* 3. Общая сводка одной фразой: готовые из всех + состав всех работ по тегам */}
      <p className="blog-global-summary__text">
        {doneVerb}{' '}
        <strong className="blog-global-summary__num blog-global-summary__num--amber">
          {doneWorks}
        </strong>{' '}
        {pluralizeRu(doneWorks, 'работа', 'работы', 'работ')} из{' '}
        <strong className="blog-global-summary__num">{totalWorks}</strong>, при этом среди них{' '}
        <strong className="blog-global-summary__num blog-global-summary__num--amber">
          {artCount}
        </strong>{' '}
        {pluralizeRu(artCount, 'арт', 'арта', 'артов')},{' '}
        <strong className="blog-global-summary__num blog-global-summary__num--cyan">
          {textCount}
        </strong>{' '}
        {pluralizeRu(textCount, 'текст', 'текста', 'текстов')} (с репликами),{' '}
        <strong className="blog-global-summary__num">{designCount}</strong>{' '}
        {pluralizeRu(
          designCount,
          'элемент оформления',
          'элемента оформления',
          'элементов оформления',
        )}
        ,{' '}
        <strong className="blog-global-summary__num blog-global-summary__num--red">
          {codeCount}
        </strong>{' '}
        {pluralizeRu(codeCount, 'блок кода', 'блока кода', 'блоков кода')} и{' '}
        <strong className="blog-global-summary__num">{otherCount}</strong>{' '}
        {pluralizeRu(otherCount, 'другая работа', 'другие работы', 'других работ')}.
      </p>
    </aside>
  );
}
