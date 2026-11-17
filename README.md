# crownvetch (`PARADOX // DARKROOM`)

SPA-приложение на **React + TypeScript + Vite** для проектного технического задания (`/tz`) и последующей интеграции визуальной новеллы и текстового квеста (`/game`).

## Маршруты приложения

- `/` — автоматический редирект на `/tz`
- `/tz` — стартовый экран видоискателя `PARADOX // DARKROOM` (перфорация плёнки, глитч-типографика `OVERTHINK / VORTEX`, вращающееся по кругу кольцо полароидов с управлением `PLAY / REVERSE`) и секции ТЗ из JSON-базы
- `/game` — маршрут визуальной новеллы и текстового квеста (сейчас подключена интерактивная заглушка на базе `src/data/quest.json`)

## Структура проекта

```text
├── scripts/
│   └── ui_audit.py              # Playwright-скрипт визуального аудита (1440x900 и 390x844)
├── src/
│   ├── components/
│   │   ├── darkroom/            # Компоненты первого экрана (FilmStripFrame, GlitchTypography, PolaroidVortex, DarkroomTelemetryPanel)
│   │   ├── AppHeader.tsx        # Навигационная шапка для маршрута /game
│   │   └── InteractivePalette.tsx
│   ├── data/                    # JSON-хранилище данных (tzHero.json, palette.json, modules.json, quest.json)
│   ├── pages/                   # Страницы маршрутов (TzPage, GamePlaceholderPage)
│   ├── services/                # Типизированный доступ к JSON-базе (projectDataStore.ts)
│   ├── styles/                  # Дизайн-токены, глобальные стили и стили видоискателя
│   └── types/                   # TypeScript-интерфейсы сущностей проекта (project.ts)
├── DESIGN.md                    # Дизайн-токены, палитра и правила адаптивности
├── GEMINI.md                    # Регламент разработки и работы с JSON-базой
└── vercel.json                  # SPA-rewrites для корректной работы прямых URL
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
