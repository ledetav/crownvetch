/**
 * Секция «О владельце» внутри горизонтального слайдера страницы ТЗ (/tz#owner).
 * На текущем этапе копирует внутреннее наполнение секции «О персонаже»
 * для последующей кастомизации контента.
 */
import { CharacterDossier } from '../darkroom/CharacterDossier';
import { DarkroomVisualStage } from '../darkroom/DarkroomVisualStage';
import { ExternalResourceMenu } from '../darkroom/ExternalResourceMenu';
import type { TzSectionSlideProps } from './CharacterSection';

/**
 * Рендерит внутреннее содержимое секции «О владельце» для горизонтального слайдера.
 * @param props Данные секции и флаг активности слайда.
 * @returns JSX-разметка слайда #owner.
 */
export function OwnerSection({ heroData, isActive }: TzSectionSlideProps) {
  return (
    <section
      data-section="owner"
      className={`viewfinder-slide ${isActive ? 'viewfinder-slide--active' : 'viewfinder-slide--inactive'}`}
      aria-label="Секция: О владельце"
      aria-hidden={!isActive}
    >
      <div className="viewfinder-frame">
        <CharacterDossier
          primaryWord={heroData.primaryWord}
          secondaryWord={heroData.secondaryWord}
          dossierHeading={heroData.dossierHeading}
          dossierBody={heroData.dossierBody}
          headingLevel="h2"
        />

        <DarkroomVisualStage
          artworkSrc={heroData.characterArtworkSrc}
          altText={`${heroData.primaryWord} (${heroData.secondaryWord}) — персонаж`}
        />

        <ExternalResourceMenu links={heroData.externalLinks} />
      </div>
    </section>
  );
}
