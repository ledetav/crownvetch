/**
 * Секция «О владельце» на странице технического задания (/tz#owner).
 * На текущем этапе дублирует структуру экрана «О персонаже» для дальнейшего
 * наполнения контентом и точечной доработки дизайна.
 */
import { DarkroomViewfinderScreen } from '../darkroom/DarkroomViewfinderScreen';

/**
 * Рендерит якорную секцию «О владельце» на странице ТЗ.
 * @returns JSX-разметка секции #owner.
 */
export function OwnerSection() {
  return (
    <DarkroomViewfinderScreen
      sectionId="owner"
      sectionLabel="Секция: О владельце"
      initialTabId="owner"
      showOrientationOverlay={false}
      headingLevel="h2"
    />
  );
}
