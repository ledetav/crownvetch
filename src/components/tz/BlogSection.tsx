/**
 * Секция «О блоге» на странице технического задания (/tz#blog).
 * На текущем этапе дублирует структуру экрана «О персонаже» для дальнейшего
 * наполнения контентом и точечной доработки дизайна.
 */
import { DarkroomViewfinderScreen } from '../darkroom/DarkroomViewfinderScreen';

/**
 * Рендерит якорную секцию «О блоге» на странице ТЗ.
 * @returns JSX-разметка секции #blog.
 */
export function BlogSection() {
  return (
    <DarkroomViewfinderScreen
      sectionId="blog"
      sectionLabel="Секция: О блоге"
      initialTabId="blog"
      showOrientationOverlay={false}
      headingLevel="h2"
    />
  );
}
