# crownvetch

SPA-приложение на **React + TypeScript + Vite** для проектного технического задания (`/tz`) и последующей интеграции визуальной новеллы и текстового квеста (`/game`).

## Маршруты приложения

- `/` — автоматический редирект на `/tz`
- `/tz` — страница технического задания с кастомным слотом вёрстки, интерактивной палитрой и списком модулей
- `/game` — маршрут визуальной новеллы и текстового квеста (сейчас подключена интерактивная заглушка на базе `src/data/quest.json`)

## Структура проекта

```text
├── .github/workflows/   # Шаблон CI-пайплайна (добавляется при наличии прав workflow)
├── scripts/
│   └── ui_audit.py      # Playwright-скрипт визуального аудита (1440x900 и 390x844)
├── src/
│   ├── components/      # Переиспользуемые UI-компоненты (AppHeader, InteractivePalette)
│   ├── data/            # JSON-хранилище данных (palette.json, modules.json, quest.json)
│   ├── pages/           # Страницы маршрутов (TzPage, GamePlaceholderPage)
│   ├── services/        # Типизированный доступ к JSON-базе (projectDataStore.ts)
│   ├── styles/          # Дизайн-токены и глобальные стили (tokens.css, global.css)
│   └── types/           # TypeScript-интерфейсы сущностей проекта (project.ts)
├── DESIGN.md            # Дизайн-токены, палитра и правила адаптивности
├── GEMINI.md            # Регламент разработки и работы с JSON-базой
└── vercel.json          # SPA-rewrites для корректной работы прямых URL
```

## Локальный запуск

```bash
npm install
npm run dev
```

## Проверка качества и визуальный аудит

```bash
npm run lint
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
python scripts/ui_audit.py
```
