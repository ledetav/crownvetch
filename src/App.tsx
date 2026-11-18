/**
 * Корневой компонент маршрутизации SPA-приложения crownvetch.
 * Настраивает полноэкранное отображение маршрутов /tz и /game без лишней
 * верхней панели и автоматический редирект с '/' на '/tz'.
 */
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { GamePlaceholderPage } from './pages/GamePlaceholderPage';
import { TzPage } from './pages/TzPage';

/**
 * Определяет корневой роутер приложения crownvetch.
 * @returns Корневое дерево маршрутизации React.
 */
export function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <main className="app-content">
          <Routes>
            {/* Корневой адрес временно перенаправляет на страницу ТЗ */}
            <Route path="/" element={<Navigate to="/tz" replace />} />
            <Route path="/tz" element={<TzPage />} />
            <Route path="/game" element={<GamePlaceholderPage />} />
            {/* Любые неизвестные маршруты также ведут на ТЗ */}
            <Route path="*" element={<Navigate to="/tz" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
