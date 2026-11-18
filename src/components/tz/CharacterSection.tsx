/**
 * Секция «О персонаже» на странице технического задания (/tz#character).
 * Представляет базовый полноэкранный видоискатель, выступающий основой для
 * визуального описания персонажа и якорного перехода по меню.
 */
import { DarkroomViewfinderScreen } from '../darkroom/DarkroomViewfinderScreen';

/**
 * Рендерит якорную секцию «О персонаже» на странице ТЗ.
 * @returns JSX-разметка секции #character.
 */
export function CharacterSection() {
  return (
    <DarkroomViewfinderScreen
      sectionId="character"
      sectionLabel="Секция: О персонаже"
      initialTabId="character"
      showOrientationOverlay
      headingLevel="h1"
    />
  );
}
