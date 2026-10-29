# ToolPageAng15

Библиотека Angular 15 для генерации страниц и компонентов через EVO Generator.

## Установка

```bash
npm install tool-page-ang15
```

## Быстрый старт

Добавьте скрипт в `package.json`:

```json
"scripts": {
  "evo": "node node_modules/tool-page-ang15/tools/evo-generator/index.js"
}
```

## Команды

| Команда | Описание |
|---------|----------|
| `component-exchange` | Компонент с `ExchangeSubscribeComponent` |
| `page-detail` | Страница детализации (phone/tablet/desktop) |
| `page-data` | Страница списка + 4 сервиса (request/server/parsed/factory) |

## Параметры

| Параметр | По умолчанию | Пример |
|----------|--------------|--------|
| `--name` (обяз.) | — | `--name user-card` |
| `--style` | `scss` | `--style less` |
| `--path` | текущая папка | `--path src/app/features` |

## Примеры

```bash
# Компонент
npx evo-generator component-exchange -- --name user-card

# Страница детализации
npx evo-generator page-detail -- --name user-profile --style scss --path src/app/pages

# Страница списка с сервисами
npx evo-generator page-data -- --name users-list
```

> `page-data` создаёт: страницу, `devices/` (phone, tablet, desktop, common), `services/` (4 шт.) и регистрирует всё в модуле.

## Разработка

```bash
ng build tool-page-ang15   # сборка в dist/
ng test tool-page-ang15    # тесты
```
