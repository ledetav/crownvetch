/**
 * Карточка отдельной сцены-разворота в сценарной схеме раздела «О блоге → Акты».
 * Отрисовывает компактную кнопку с названием «Сцена Номер» и бейджем формата
 * («Текстовый блок» или «Визуальная новелла»), а при раскрытии — панель со
 * структурированными полями Катсцена/Фон, Текстовый блок/Мысли и Спрайты.
 */
import type { BlogActScene, BlogActSceneMode } from '../../types/project';

/** Входные свойства карточки отдельной сцены-разворота */
interface BlogActSceneCardProps {
  /** Данные сцены */
  scene: BlogActScene;
  /** Флаг раскрытого состояния блока */
  isExpanded: boolean;
  /** Флаг визуального акцента при переходе по прямой ссылке из таблицы готовности */
  isFocused: boolean;
  /** Обработчик переключения состояния блока */
  onToggle: (sceneId: string) => void;
}

/**
 * Возвращает подпись формата сцены для бейджа в шапке карточки.
 * @param mode Системный код формата сцены.
 * @returns Строка «Текстовый блок» или «Визуальная новелла».
 */
function formatSceneModeLabel(mode: BlogActSceneMode): string {
  return mode === 'text_quest' ? 'Текстовый блок' : 'Визуальная новелла';
}

/**
 * Отрисовывает отдельную сцену сценария как компактную кнопку по центру схемы
 * и текстовую панель-разворот под ней при нажатии.
 * @param props Данные сцены, состояния раскрытия/фокуса и обработчик переключения.
 * @returns JSX-разметка узла сцены.
 */
export function BlogActSceneCard({
  scene,
  isExpanded,
  isFocused,
  onToggle,
}: BlogActSceneCardProps) {
  const bodyId = `${scene.id}-body`;
  const triggerId = `${scene.id}-trigger`;

  // Для текстовых блоков поле «Спрайты» не выводится
  const visibleBlocks =
    scene.mode === 'visual_novel'
      ? scene.blocks
      : scene.blocks.filter((block) => block.kind !== 'sprites');

  return (
    <article
      id={scene.id}
      className={`act-scene-node ${isExpanded ? 'act-scene-node--expanded' : ''} ${
        isFocused ? 'act-scene-node--focused' : ''
      }`}
    >
      <button
        id={triggerId}
        type="button"
        className="act-scene-node__btn"
        aria-expanded={isExpanded}
        aria-controls={bodyId}
        onClick={() => onToggle(scene.id)}
      >
        <h3 className="act-scene-node__title">{scene.title}</h3>
        <span className={`act-scene-card__mode act-scene-card__mode--${scene.mode}`}>
          {formatSceneModeLabel(scene.mode)}
        </span>
        <span className="act-scene-node__toggle" aria-hidden="true">
          {isExpanded ? '−' : '+'}
        </span>
      </button>

      {isExpanded && (
        <>
          <span className="act-scene-node__stem" aria-hidden="true" />
          <div id={bodyId} className="act-scene-node__panel">
            {visibleBlocks.map((block, index) => (
              <div
                key={`${scene.id}-block-${index}`}
                className={`act-scene-block act-scene-block--${block.kind}`}
              >
                <div className="act-scene-block__label">{block.label}</div>
                <p className="act-scene-block__text">{block.text}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
