/**
 * Страница игрового маршрута (/game).
 * Содержит полную копию полноэкранного видоискателя с перфорацией киноплёнки,
 * анимированной глитч-типографикой и вращающейся орбитой полароидов.
 */
import { useEffect } from 'react';
import { DarkroomViewfinderScreen } from '../components/darkroom/DarkroomViewfinderScreen';

/**
 * Отрисовывает копию основного экрана видоискателя на маршруте /game.
 * @returns JSX-разметка страницы /game.
 */
export function GamePlaceholderPage() {
  useEffect(() => {
    document.title = 'OVERTHINK // VORTEX — Игра';
  }, []);

  return <DarkroomViewfinderScreen initialTabId="character" />;
}
