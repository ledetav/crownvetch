/**
 * Секция «Общая информация» внутри отдельной страницы «О блоге» (/tz/blog/overview).
 * Объединяет заголовок со световыми прострелами фотолаборатории, две внутренние
 * якорные микровкладки («Синопсис» и «Таблица готовности») и обе секции ниже.
 */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getTzBlogOverviewDataset } from '../../services/projectDataStore';
import { BlogOverviewSubnav } from './BlogOverviewSubnav';
import { BlogReadinessTable } from './BlogReadinessTable';
import { BlogSynopsisBlock } from './BlogSynopsisBlock';

/**
 * Определяет активную микровкладку по хэшу адресной строки (#synopsis | #readiness).
 * @param hash Текущий хэш URL.
 * @returns Идентификатор активной микровкладки.
 */
function resolveMicroTabFromHash(hash: string): 'synopsis' | 'readiness' {
  return hash === '#readiness' ? 'readiness' : 'synopsis';
}

/**
 * Отрисовывает содержимое вкладки «Общая информация» раздела «О блоге».
 * @returns JSX-разметка страницы /tz/blog/overview.
 */
export function BlogOverviewSection() {
  const { hash } = useLocation();
  const overviewData = getTzBlogOverviewDataset();
  const [activeMicroTab, setActiveMicroTab] = useState<'synopsis' | 'readiness'>(() =>
    resolveMicroTabFromHash(hash),
  );

  useEffect(() => {
    if (hash === '#synopsis' || hash === '#readiness') {
      const targetId = hash.slice(1) as 'synopsis' | 'readiness';
      setActiveMicroTab(targetId);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [hash]);

  return (
    <section
      data-section="blog-overview"
      className="viewfinder-slide viewfinder-slide--active"
      aria-label="О блоге: Общая информация"
    >
      <div className="blog-overview-frame">
        <div className="blog-overview-header">
          <div className="dossier-headline-block">
            <div className="vyazel-wrapper">
              <div className="vyazel-ribbon" aria-hidden="true">
                <span className="vyazel-streak vyazel-streak--1" />
                <span className="vyazel-streak vyazel-streak--2" />
                <span className="vyazel-streak vyazel-streak--3" />
              </div>
              <h1 className="serif-vyazel serif-vyazel--blog">{overviewData.primaryWord}</h1>
            </div>
            <p className="dossier-secondary-word">{overviewData.secondaryWord}</p>
          </div>

          <BlogOverviewSubnav
            tabs={overviewData.microTabs}
            activeId={activeMicroTab}
            onSelect={setActiveMicroTab}
          />
        </div>

        <BlogSynopsisBlock
          heading={overviewData.synopsisHeading}
          lead={overviewData.synopsisLead}
          slots={overviewData.synopsisSlots}
        />

        <BlogReadinessTable
          heading={overviewData.readinessHeading}
          note={overviewData.readinessNote}
          initialActs={overviewData.acts}
        />
      </div>
    </section>
  );
}
