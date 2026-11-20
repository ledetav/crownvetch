/**
 * Утилита форматирования дат и вычисления оставшихся дней до целевой даты.
 * Переиспользуется в общей сводке до дня рождения (BlogGlobalSummary)
 * и в правой карточке дедлайна конкретного раздела (BlogReadinessSidebar).
 */

/** Результат расчёта целевой даты и разницы в календарных днях */
export interface DateCountdownInfo {
  /** Отформатированная дата в формате ДД.ММ.ГГГГ либо «НЕ ЗАДАНА» */
  formattedDate: string;
  /** Разница в календарных днях (target - today), null если дата невалидна */
  diffDays: number | null;
  /** Визуальный тон индикации срока */
  tone: 'neutral' | 'soon' | 'overdue' | 'empty';
}

/**
 * Подбирает правильную форму русского слова «день» по целому числу.
 * @param count Абсолютное целое число дней.
 * @returns Строка «день», «дня» или «дней».
 */
export function pluralizeDays(count: number): string {
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
 * Разбирает ISO-дату YYYY-MM-DD и вычисляет остаток календарных дней
 * относительно локального начала текущих суток.
 * @param isoDate Строка даты формата YYYY-MM-DD.
 * @returns Отформатированная дата, разница в днях и тон индикации.
 */
export function calculateDateCountdown(isoDate: string): DateCountdownInfo {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) {
    return {
      formattedDate: 'НЕ ЗАДАН',
      diffDays: null,
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

  if (diffDays < 0) {
    return { formattedDate, diffDays, tone: 'overdue' };
  }
  if (diffDays <= 5) {
    return { formattedDate, diffDays, tone: 'soon' };
  }
  return { formattedDate, diffDays, tone: 'neutral' };
}
