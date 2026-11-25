/**
 * Секция «Персонажи» внутри отдельной страницы «О блоге» (/tz/blog/characters).
 * Отображает заголовок «ПЕРСОНАЖИ» со световыми прострелами, верхнее внутреннее меню
 * четырёх героев (Лин Вэй (Вязель), Предок Вязеля, Лу Гуан, Чэн Сяоши) и внутри каждого —
 * второе подменю («Спрайты» и «Дизайн и референсы») с поддержкой глубоких URL-якорей
 * (#vyazel, #vyazel-sprites, #vyazel-design и аналогично для остальных персонажей).
 */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getTzBlogCharactersDataset } from '../../services/projectDataStore';
import type {
  BlogCharacterId,
  BlogCharacterProfile,
  BlogCharacterSubTabId,
} from '../../types/project';
import { resolveAssetUrl } from '../../utils/assetUrl';
import {
  CHARACTER_SUBTAB_ORDER,
  resolveCharacterTargetFromHash,
} from '../../utils/blogCharacterHash';
import { BlogCharacterDesignPanel } from './BlogCharacterDesignPanel';
import { BlogCharacterSpritesList } from './BlogCharacterSpritesList';

/**
 * Отрисовывает раздел «О блоге → Персонажи» с двухуровневой навигацией:
 * выбор персонажа и переключение между заготовками вкладок «Спрайты» и «Дизайн и референсы».
 * @returns JSX-разметка страницы /tz/blog/characters.
 */
export function BlogCharactersSection() {
  const { hash } = useLocation();
  const charactersData = getTzBlogCharactersDataset();
  const initialTarget = resolveCharacterTargetFromHash(hash, charactersData.characters);

  const [activeCharacterId, setActiveCharacterId] = useState<BlogCharacterId>(
    initialTarget.characterId,
  );
  const [activeSubTabId, setActiveSubTabId] = useState<BlogCharacterSubTabId>(
    initialTarget.subTabId,
  );

  // Синхронизируем выбранного персонажа и подвкладку при переходах по ссылкам из Шапки и таблицы готовности
  useEffect(() => {
    if (!hash) {
      return;
    }
    const target = resolveCharacterTargetFromHash(hash, charactersData.characters);
    setActiveCharacterId(target.characterId);
    setActiveSubTabId(target.subTabId);
  }, [hash, charactersData.characters]);

  // Предзагружаем скетчи примерных образов персонажей, чтобы переключение между героями было мгновенным
  useEffect(() => {
    charactersData.characters.forEach((character) => {
      const sketchSrc = character.tabs.design.design?.sketch?.src;
      if (!sketchSrc) {
        return;
      }
      const preloadImg = new window.Image();
      preloadImg.src = resolveAssetUrl(sketchSrc);
    });
  }, [charactersData.characters]);

  const activeCharacter =
    charactersData.characters.find((item) => item.id === activeCharacterId) ??
    charactersData.characters[0];

  if (!activeCharacter) {
    return null;
  }

  /** Переключает выбранного персонажа, сохраняя текущую внутреннюю вкладку в якоре URL */
  const handleSelectCharacter = (character: BlogCharacterProfile) => {
    setActiveCharacterId(character.id);
    window.history.replaceState(null, '', `#${character.id}-${activeSubTabId}`);
  };

  /** Переключает внутреннюю вкладку («Спрайты» / «Дизайн и референсы») и синхронизирует якорь URL */
  const handleSelectSubTab = (subTabId: BlogCharacterSubTabId) => {
    setActiveSubTabId(subTabId);
    window.history.replaceState(null, '', `#${activeCharacter.id}-${subTabId}`);
  };

  const activeSubTab = activeCharacter.tabs[activeSubTabId];
  const hasSprites = Boolean(activeSubTab.sprites && activeSubTab.sprites.length > 0);
  const hasDesignMaterials = Boolean(
    activeSubTab.design &&
      (activeSubTab.design.sketch?.src ||
        (activeSubTab.design.references && activeSubTab.design.references.length > 0)),
  );

  return (
    <section
      data-section="blog-characters"
      className="viewfinder-slide viewfinder-slide--active"
      aria-label="О блоге: Персонажи"
    >
      <div className="blog-overview-frame">
        <div className="blog-acts-header">
          <div className="dossier-headline-block">
            <div className="vyazel-wrapper">
              <div className="vyazel-ribbon" aria-hidden="true">
                <span className="vyazel-streak vyazel-streak--1" />
                <span className="vyazel-streak vyazel-streak--2" />
                <span className="vyazel-streak vyazel-streak--3" />
              </div>
              <h1 className="serif-vyazel serif-vyazel--blog">{charactersData.primaryWord}</h1>
            </div>
            <p className="dossier-secondary-word">{charactersData.secondaryWord}</p>
          </div>

          {/* Верхнее внутреннее меню четырёх персонажей */}
          <div
            className="blog-microtabs blog-acts-nav blog-characters-nav"
            role="tablist"
            aria-label="Внутреннее меню персонажей"
          >
            {charactersData.characters.map((character) => {
              const isActive = character.id === activeCharacter.id;
              return (
                <button
                  key={character.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`character-panel-${character.id}`}
                  className={`blog-microtabs__item ${
                    isActive ? 'blog-microtabs__item--active' : ''
                  }`}
                  onClick={() => handleSelectCharacter(character)}
                >
                  {character.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Рабочая панель выбранного персонажа с внутренним подменю «Спрайты / Дизайн и референсы» */}
        <section
          id={`character-panel-${activeCharacter.id}`}
          role="tabpanel"
          className="blog-readiness-panel blog-character-panel"
          aria-labelledby="blog-character-heading"
        >
          <div className="blog-readiness-head blog-character-head">
            <h2 id="blog-character-heading" className="dossier-bio__heading">
              {activeCharacter.heading}
            </h2>

            <Link to="/tz/blog/overview#readiness" className="blog-tz-link">
              <span>Таблица готовности</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {/* Второе внутреннее меню персонажа: Спрайты | Дизайн и референсы */}
          <div
            className="blog-section-nav blog-act-subnav blog-character-subnav"
            role="tablist"
            aria-label={`Разделы персонажа ${activeCharacter.heading}`}
          >
            {CHARACTER_SUBTAB_ORDER.map((subTabId) => {
              const tab = activeCharacter.tabs[subTabId];
              const isSelected = subTabId === activeSubTabId;
              return (
                <button
                  key={subTabId}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`${activeCharacter.id}-${subTabId}`}
                  className={`blog-section-nav__item ${
                    isSelected ? 'blog-section-nav__item--active' : ''
                  }`}
                  onClick={() => handleSelectSubTab(subTabId)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Рабочее содержимое выбранной вкладки персонажа */}
          <div id={`${activeCharacter.id}-${activeSubTabId}`} role="tabpanel">
            {hasSprites && activeSubTab.sprites ? (
              <BlogCharacterSpritesList
                key={`${activeCharacter.id}-${activeSubTabId}`}
                heading={activeSubTab.heading}
                note={activeSubTab.note}
                sprites={activeSubTab.sprites}
              />
            ) : hasDesignMaterials && activeSubTab.design ? (
              <BlogCharacterDesignPanel
                key={`${activeCharacter.id}-${activeSubTabId}`}
                heading={activeSubTab.heading}
                note={activeSubTab.note}
                design={activeSubTab.design}
              />
            ) : (
              <article
                className="blog-character-stub"
                aria-labelledby="blog-character-subtab-heading"
              >
                <h3 id="blog-character-subtab-heading" className="blog-character-stub__heading">
                  {activeSubTab.heading}
                </h3>
                <p className="blog-character-stub__text">{activeSubTab.placeholder}</p>
              </article>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
