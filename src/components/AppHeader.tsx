/**
 * Компонент верхней навигационной шапки приложения crownvetch.
 * Обеспечивает переключение между кастомной страницей ТЗ (/tz)
 * и маршрутом визуальной новеллы и текстового квеста (/game).
 */
import { NavLink } from 'react-router-dom';
import { FileCode2, Gamepad2, Sprout } from 'lucide-react';

/**
 * Отрисовывает фиксированную шапку с брендом проекта и вкладками маршрутов.
 * @returns JSX-разметка навигационной панели.
 */
export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <NavLink to="/tz" className="app-brand" aria-label="На главную страницу ТЗ">
          <Sprout size={18} />
          <span>CROWNVETCH</span>
        </NavLink>

        <nav className="app-nav" aria-label="Основная навигация">
          <NavLink
            to="/tz"
            className={({ isActive }) =>
              `app-nav__link ${isActive ? 'app-nav__link--active' : ''}`
            }
          >
            <FileCode2 size={16} />
            <span>ТЗ проекта</span>
          </NavLink>

          <NavLink
            to="/game"
            className={({ isActive }) =>
              `app-nav__link ${isActive ? 'app-nav__link--active' : ''}`
            }
          >
            <Gamepad2 size={16} />
            <span>Игра (VN / Квест)</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
