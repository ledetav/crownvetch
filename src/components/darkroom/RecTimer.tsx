/**
 * Компонент живого счётчика записи видоискателя (● REC) с эффектом временной петли.
 * Быстро отсчитывает время от 00:00:00 вверх до точки разрыва петли (00:03:04),
 * после чего запускает кратковременный VHS-глитч с искажением символов и RGB-вспышкой
 * и сбрасывает отсчёт обратно в 00:00:00.
 */
import { useEffect, useState } from 'react';

/** Порог в условных единицах (минуты:секунды -> 3:04 = 184), на котором срабатывает глитч-сброс */
const LOOP_RESET_TICKS = 184;

/**
 * Форматирует целочисленное значение тиков в строку вида HH:MM:SS (где MM:SS доходит до 03:04).
 * @param ticks Текущий счётчик тиков (0..184).
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
 * Рендерит индикатор ● REC с быстрым счётчиком и внезапным глитчем на 00:03:04.
 * @returns JSX-разметка верхнего левого индикатора записи.
 */
export function RecTimer() {
  const [ticks, setTicks] = useState<number>(0);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);

  useEffect(() => {
    let resetTimeoutId: number | undefined;

    // Быстрый тик каждые 35 мс (~28.5 кадров/с), чтобы цикл до 03:04 занимал ~6.4 секунды
    const intervalId = window.setInterval(() => {
      setTicks((prev) => {
        if (prev >= LOOP_RESET_TICKS) {
          return prev;
        }
        const next = prev + 1;
        if (next === LOOP_RESET_TICKS) {
          setIsGlitching(true);
          resetTimeoutId = window.setTimeout(() => {
            setIsGlitching(false);
            setTicks(0);
          }, 360);
        }
        return next;
      });
    }, 35);

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
