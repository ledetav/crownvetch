"""
Скрипт автоматического визуального аудита UI для проекта crownvetch.
Проверяет рендер ключевых маршрутов (/tz/character, /tz/owner, /tz/blog/overview и /game)
на десктопе (1440x900) и мобильном экране (390x844), отслеживает горизонтальный скролл,
ошибки консоли и сохраняет PNG-скриншоты вместе с отчётами ci-summary.md и ui-report.json.
"""

import json
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = os.environ.get("AUDIT_BASE_URL", "http://127.0.0.1:4173")
OUTPUT_DIR = Path(os.environ.get("AUDIT_OUTPUT_DIR", "ci-artifacts"))

ROUTES = [
    {"name": "tz", "path": "/tz/character"},
    {"name": "owner", "path": "/tz/owner"},
    {"name": "blog", "path": "/tz/blog/overview"},
    {"name": "game", "path": "/game"},
]

VIEWPORTS = [
    {"name": "desktop", "width": 1440, "height": 900},
    {"name": "mobile", "width": 390, "height": 844},
]


def run_audit() -> int:
    """Выполняет обход маршрутов и вьюпортов, генерируя отчёт и скриншоты."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    report: dict = {
        "baseUrl": BASE_URL,
        "checks": [],
        "passed": True,
    }

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        try:
            for viewport in VIEWPORTS:
                context = browser.new_context(
                    viewport={"width": viewport["width"], "height": viewport["height"]}
                )

                for route in ROUTES:
                    # Открываем изолированную вкладку на каждый маршрут для чистого статуса HTTP 200 и логов
                    page = context.new_page()
                    console_errors: list[str] = []
                    page_errors: list[str] = []

                    page.on(
                        "console",
                        lambda msg: console_errors.append(msg.text)
                        if msg.type == "error"
                        else None,
                    )
                    page.on("pageerror", lambda err: page_errors.append(str(err)))

                    target_url = f"{BASE_URL}{route['path']}"
                    response = page.goto(target_url, wait_until="networkidle")
                    status = response.status if response else 0

                    # Проверяем отсутствие горизонтального переполнения экрана
                    has_horizontal_overflow = page.evaluate(
                        "document.documentElement.scrollWidth > window.innerWidth"
                    )

                    screenshot_name = f"{route['name']}_{viewport['name']}.png"
                    screenshot_path = OUTPUT_DIR / screenshot_name
                    page.screenshot(path=str(screenshot_path), full_page=True)
                    page.close()

                    check_ok = (
                        200 <= status < 400
                        and not has_horizontal_overflow
                        and len(console_errors) == 0
                        and len(page_errors) == 0
                    )
                    if not check_ok:
                        report["passed"] = False

                    report["checks"].append(
                        {
                            "route": route["path"],
                            "viewport": viewport["name"],
                            "dimensions": f"{viewport['width']}x{viewport['height']}",
                            "httpStatus": status,
                            "hasHorizontalOverflow": has_horizontal_overflow,
                            "consoleErrors": console_errors,
                            "pageErrors": page_errors,
                            "screenshot": screenshot_name,
                            "passed": check_ok,
                        }
                    )

                context.close()
        finally:
            browser.close()

    # Сохраняем машиночитаемый JSON-отчёт
    json_path = OUTPUT_DIR / "ui-report.json"
    json_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    # Формируем человекочитаемую Markdown-сводку
    lines = [
        "# UI Visual Audit Summary (`crownvetch`)",
        "",
        f"- **Статус:** {'PASSED' if report['passed'] else 'FAILED'}",
        f"- **Base URL:** `{BASE_URL}`",
        "",
        "| Маршрут | Экран | Разрешение | HTTP | Гориз. скролл | Ошибки | Скриншот |",
        "| :--- | :--- | :--- | :---: | :---: | :---: | :--- |",
    ]
    for item in report["checks"]:
        err_count = len(item["consoleErrors"]) + len(item["pageErrors"])
        lines.append(
            f"| `{item['route']}` | {item['viewport']} | {item['dimensions']} "
            f"| {item['httpStatus']} | `{item['hasHorizontalOverflow']}` "
            f"| {err_count} | `{item['screenshot']}` |"
        )

    summary_path = OUTPUT_DIR / "ci-summary.md"
    summary_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    return 0 if report["passed"] else 1


if __name__ == "__main__":
    sys.exit(run_audit())
