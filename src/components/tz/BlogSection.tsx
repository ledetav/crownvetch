/**
 * Секция «О блоге» внутри горизонтального слайдера страницы ТЗ (/tz#blog).
 * На текущем этапе копирует внутреннее наполнение секции «О персонаже»
 * для последующей кастомизации контента.
 */
import { CharacterDossier } from '../darkroom/CharacterDossier';
import { DarkroomVisualStage } from '../darkroom/DarkroomVisualStage';
import type { TzSectionSlideProps } from './CharacterSection';

/**
 * Рендерит внутреннее содержимое секции «О блоге» для горизонтального слайдера.
 * @param props Данные секции и флаг активности слайда.
 * @returns JSX-разметка слайда #blog.
 */
export function BlogSection({ heroData, isActive }: TzSectionSlideProps) {
  return (
    <section
      data-section="blog"
      className={`viewfinder-slide ${isActive ? 'viewfinder-slide--active' : 'viewfinder-slide--inactive'}`}
      aria-label="Секция: О блоге"
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
          headingLevel="h2"
        />

        <DarkroomVisualStage />
      </div>
    </section>
  );
}
