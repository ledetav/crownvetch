/**
 * Компонент живого счётчика записи видоискателя (● REC) с обратным отсчётом петли.
 * Быстро отсчитывает время вниз от 00:12:00 (00:11:59, 00:11:58...) до точки разрыва
 * петли (00:03:04), после чего запускает внезапный VHS-глитч с искажением символов
 * и сбрасывает обратный отсчёт обратно на 00:12:00.
 */
import { useEffect, useState } from 'react';

/** Начальное значение обратного отсчёта: 12 минут 00 секунд (720) */
const LOOP_START_TICKS = 720;

/** Точка срабатывания глитч-сброса: 03 минуты 04 секунды (184) */
const LOOP_GLITCH_TICKS = 184;

/**
 * Форматирует целочисленное значение тиков в строку вида 00:MM:SS.
 * @param ticks Текущее значение таймера в секундах/кадрах (720..184).
 * @returns Строка таймкода в формате 00:MM:SS.
 */
function formatLoopTimecode(ticks: number): string {
  const minutes = Math.floor(ticks / 60);
  const seconds = ticks % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `00:${mm}:${ss}`;
}

/**
 * Рендерит индикатор ● REC с быстрым обратным отсчётом от 00:12:00 и глитчем на 00:03:04.
 * @returns JSX-разметка индикатора записи.
 */
export function RecTimer() {
  const [ticks, setTicks] = useState<number>(LOOP_START_TICKS);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);

  useEffect(() => {
    let resetTimeoutId: number | undefined;

    // Быстрый обратный тик каждые 22 мс (~45 кадров/с), чтобы цикл 12:00 -> 03:04 шёл динамично
    const intervalId = window.setInterval(() => {
      setTicks((prev) => {
        if (prev <= LOOP_GLITCH_TICKS) {
          return prev;
        }
        const next = prev - 1;
        if (next === LOOP_GLITCH_TICKS) {
          setIsGlitching(true);
          resetTimeoutId = window.setTimeout(() => {
            setIsGlitching(false);
            setTicks(LOOP_START_TICKS);
          }, 360);
        }
        return next;
      });
    }, 22);

    return () => {
      window.clearInterval(intervalId);
      if (resetTimeoutId !== undefined) {
        window.clearTimeout(resetTimeoutId);
      }
    };
  }, []);

  const displayTimecode = isGlitching ? '00:03:04 // ERR' : formatLoopTimecode(ticks);

  return (
    <div
      className={`rec-indicator ${isGlitching ? 'rec-indicator--glitch' : ''}`}
      aria-label={`Запись ${formatLoopTimecode(ticks)}`}
    >
      <span className="rec-indicator__dot" aria-hidden="true" />
      <span className="rec-indicator__text" data-text={`REC ${displayTimecode}`}>
        REC {displayTimecode}
      </span>
    </div>
  );
}
