/**
 * Страница игрового маршрута (/game).
 * Содержит копию полноэкранного видоискателя с перфорацией киноплёнки,
 * досье персонажа ВЯЗЕЛЬ и центральной сценой фотолаборатории.
 */
import { useEffect } from 'react';
import { DarkroomViewfinderScreen } from '../components/darkroom/DarkroomViewfinderScreen';

/**
 * Отрисовывает копию основного экрана видоискателя на маршруте /game.
 * @returns JSX-разметка страницы /game.
 */
export function GamePlaceholderPage() {
  useEffect(() => {
    document.title = 'ВЯЗЕЛЬ // ЛИН ВЭЙ — Игра';
  }, []);

  return <DarkroomViewfinderScreen initialTabId="character" />;
}
