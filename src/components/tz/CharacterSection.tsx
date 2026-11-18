/**
 * Секция «О персонаже» внутри горизонтального слайдера страницы ТЗ (/tz#character).
 * Представляет базовый кадр видоискателя с глитч-типографикой и орбитой полароидов.
 */
import type { TzHeroDataset } from '../../types/project';
import { GlitchTypography } from '../darkroom/GlitchTypography';
import { PolaroidVortex } from '../darkroom/PolaroidVortex';

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
        <GlitchTypography
          topQuote={heroData.topQuote}
          bottomQuote={heroData.bottomQuote}
          primaryWord={heroData.primaryWord}
          verticalWord={heroData.verticalWord}
          crossWord={heroData.crossWord}
          headingLevel="h1"
        />

        <PolaroidVortex polaroids={heroData.polaroids} />
      </div>
    </section>
  );
}
