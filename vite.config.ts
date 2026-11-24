import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Определяет базовый путь сборки в зависимости от целевой площадки деплоя.
 * Локальный запуск и деплой на Vercel используют корень `/`, а сборка для GitHub Pages — `/crownvetch/`.
 */
function resolveBasePath(): string {
  // Флаг GITHUB_PAGES задаётся workflow GitHub Actions при публикации на GitHub Pages
  if (process.env.GITHUB_PAGES === 'true') {
    return '/crownvetch/';
  }

  return '/';
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: resolveBasePath(),
})
