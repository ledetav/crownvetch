/**
 * Страница-заглушка для визуальной новеллы и текстового квеста (/game).
 * Демонстрирует чтение стартового графа сцен из src/data/quest.json
 * и списка активных модулей из src/data/modules.json до реализации полного движка.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { getEnabledModules, getQuestDataset } from '../services/projectDataStore';

/**
 * Отрисовывает интерактивную заглушку маршрута /game.
 * Позволяет проверить переходы между узлами JSON-сценария.
 * @returns JSX-разметка страницы /game.
 */
export function GamePlaceholderPage() {
  const quest = getQuestDataset();
  const enabledModules = getEnabledModules();
  const [currentSceneId, setCurrentSceneId] = useState<string>(quest.startSceneId);

  useEffect(() => {
    document.title = 'CROWNVETCH // Игра (в разработке)';
  }, []);

  // Получаем текущую сцену по ID или откатываемся к стартовой, если ID не найден
  const activeScene =
    quest.scenes[currentSceneId] ?? quest.scenes[quest.startSceneId];

  return (
    <div className="app-main">
      <section className="page-hero">
        <div className="page-hero__eyebrow">
          <Sparkles size={14} />
          <span>Маршрут игры · /game (заглушка)</span>
        </div>
        <h1 className="page-hero__title">{quest.projectTitle}</h1>
        <p className="page-hero__subtitle">
          Здесь разместится экран визуальной новеллы и текстового квеста. Сейчас
          подключён тестовый граф сцен из <code>src/data/quest.json</code> и
          активные модули из <code>src/data/modules.json</code>.
        </p>
      </section>

      <section className="game-stub" aria-label="Предпросмотр сцены квеста">
        <div className="section-block__header">
          <strong>{activeScene.chapter}</strong>
          <span className="section-block__hint">
            Активных модулей: {enabledModules.length}
          </span>
        </div>

        <div className="game-stub__scene">
          <div className="game-stub__speaker">{activeScene.speaker}</div>
          <div>{activeScene.text}</div>
        </div>

        <div className="game-stub__actions">
          {activeScene.choices.map((choice) => (
            <button
              key={`${activeScene.id}-${choice.nextSceneId}`}
              type="button"
              className="btn-primary"
              onClick={() => setCurrentSceneId(choice.nextSceneId)}
            >
              {choice.label}
            </button>
          ))}
        </div>

        <div>
          <Link to="/tz" className="app-nav__link">
            <ArrowLeft size={16} />
            <span>Вернуться к ТЗ (/tz)</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
