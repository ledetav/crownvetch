# crownvetch

SPA-приложение на **React + TypeScript + Vite** для проектного технического задания (`/tz`) и визуальной новеллы / текстового квеста (`/game`).

## Маршруты приложения

- `/` — автоматический редирект на `/tz`
- `/tz` — полноэкранный видоискатель (`100vh`) с прямоугольной перфорацией киноплёнки, глитч-типографикой `OVERTHINK / VORTEX`, вращающимся по кругу кольцом полароидов с управлением `PLAY / REVERSE` и оверлеем поворота устройства для узких экранов
- `/game` — полная копия основного полноэкранного видоискателя (заготовка для последующей интеграции игрового движка)

## Структура проекта

```text
├── scripts/
│   └── ui_audit.py              # Playwright-скрипт визуального аудита (1440x900 и 390x844)
├── src/
│   ├── components/
│   │   ├── darkroom/            # Компоненты видоискателя (DarkroomViewfinderScreen, FilmStripFrame, GlitchTypography, PolaroidVortex, DarkroomTelemetryPanel, RotateDeviceOverlay)
│   │   ├── AppHeader.tsx
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
