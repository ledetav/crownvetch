/**
 * Секция «О владельце» на маршруте /tz/owner.
 * Верхняя часть разделена на две колонки («Предпочтения» слева, «Дополнительно» и плейлисты справа),
 * а внизу во всю ширину расположена горизонтальная таблица «Круг общения» (две группы бок о бок).
 */
import { getTzOwnerDataset } from '../../services/projectDataStore';
import { OwnerExtra } from './OwnerExtra';
import { OwnerPreferences } from './OwnerPreferences';
import { SocialCircleTable } from './SocialCircleTable';

/**
 * Рендерит содержимое маршрута /tz/owner внутри рамки видоискателя.
 * @returns JSX-разметка раздела «О владельце».
 */
export function OwnerSection() {
  const ownerData = getTzOwnerDataset();

  return (
    <section
      data-section="owner"
      className="viewfinder-slide viewfinder-slide--active"
      aria-label="Секция: О владельце"
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
