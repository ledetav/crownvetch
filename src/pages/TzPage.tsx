/**
 * Страница технического задания (/tz).
 * Отображает полноэкранный видоискатель с перфорацией киноплёнки,
 * анимированной глитч-типографикой и вращающейся орбитой полароидов.
 */
import { useEffect } from 'react';
import { DarkroomViewfinderScreen } from '../components/darkroom/DarkroomViewfinderScreen';

/**
 * Отрисовывает страницу /tz во весь экран без нижних блоков-заглушек.
 * @returns JSX-разметка страницы технического задания.
 */
export function TzPage() {
  useEffect(() => {
    document.title = 'OVERTHINK // VORTEX — Техническое задание';
  }, []);

  return <DarkroomViewfinderScreen initialTabId="archive" />;
}
