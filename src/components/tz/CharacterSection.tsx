/**
 * Секция «О персонаже» внутри горизонтального слайдера страницы ТЗ (/tz#character).
 * Отображает досье персонажа ВЯЗЕЛЬ и центральную композицию тёмной фотолаборатории.
 */
import type { TzHeroDataset } from '../../types/project';
import { CharacterDossier } from '../darkroom/CharacterDossier';
import { DarkroomVisualStage } from '../darkroom/DarkroomVisualStage';

/** Входные свойства слайда секции ТЗ */
export interface TzSectionSlideProps {
  /** Конфигурация контента видоискателя из tzHero.json */
  heroData: TzHeroDataset;
  /** Признак активности текущего слайда в горизонтальной ленте */
  isActive: boolean;
}

/**
 * Рендерит внутреннее содержимое секции «О персонаже» для горизонтального слайдера.
 * @param props Данные секции и флаг активности слайда.
 * @returns JSX-разметка слайда #character.
 */
export function CharacterSection({ heroData, isActive }: TzSectionSlideProps) {
  return (
    <section
      data-section="character"
      className={`viewfinder-slide ${isActive ? 'viewfinder-slide--active' : 'viewfinder-slide--inactive'}`}
      aria-label="Секция: О персонаже"
      aria-hidden={!isActive}
    >
      <div className="viewfinder-frame">
        <CharacterDossier
          primaryWord={heroData.primaryWord}
          secondaryWord={heroData.secondaryWord}
          roleMeta={heroData.roleMeta}
          timecodeTag={heroData.timecodeTag}
          dossierHeading={heroData.dossierHeading}
          dossierBody={heroData.dossierBody}
          dossierQuote={heroData.dossierQuote}
          headingLevel="h1"
        />

        <DarkroomVisualStage />
      </div>
    </section>
  );
}
