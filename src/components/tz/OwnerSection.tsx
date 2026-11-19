/**
 * Секция «О владельце» внутри горизонтального слайдера страницы ТЗ (/tz#owner).
 * Верхняя часть разделена на две колонки («Предпочтения» слева, «Дополнительно» и плейлисты справа),
 * а внизу во всю ширину расположена горизонтальная таблица «Круг общения» (две группы бок о бок).
 */
import { getTzOwnerDataset } from '../../services/projectDataStore';
import type { TzSectionSlideProps } from './CharacterSection';
import { OwnerExtra } from './OwnerExtra';
import { OwnerPreferences } from './OwnerPreferences';
import { SocialCircleTable } from './SocialCircleTable';

/**
 * Рендерит внутреннее содержимое секции «О владельце» для горизонтального слайдера.
 * @param props Флаг активности слайда в горизонтальной ленте.
 * @returns JSX-разметка слайда #owner.
 */
export function OwnerSection({ isActive }: TzSectionSlideProps) {
  const ownerData = getTzOwnerDataset();

  return (
    <section
      data-section="owner"
      className={`viewfinder-slide ${isActive ? 'viewfinder-slide--active' : 'viewfinder-slide--inactive'}`}
      aria-label="Секция: О владельце"
      aria-hidden={!isActive}
    >
      <div className="owner-viewfinder-frame">
        <div className="owner-top-grid">
          <OwnerPreferences
            primaryWord={ownerData.primaryWord}
            secondaryWord={ownerData.secondaryWord}
            subtitleLink={ownerData.subtitleLink}
            preferencesHeading={ownerData.preferencesHeading}
            preferencesBody={ownerData.preferencesBody}
          />

          <OwnerExtra
            extraHeading={ownerData.extraHeading}
            extraBody={ownerData.extraBody}
            playlistsHeading={ownerData.playlistsHeading}
            playlists={ownerData.playlists}
          />
        </div>

        <SocialCircleTable
          heading={ownerData.socialCircleHeading}
          groups={ownerData.contactGroups}
          closingComment={ownerData.closingComment}
        />
      </div>
    </section>
  );
}
