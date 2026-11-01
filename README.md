# ToolPageAng15

Генератор Angular-страниц и компонентов (EVO).

## Установка

```bash
npm install tool-page-ang15
```

## Настройка

Добавьте в `package.json`:

```json
"scripts": {
"evo": "node node_modules/tool-page-ang15/tools/evo-generator/index.js"
}
```

## Команды

| Команда         | Что создаёт                                         |
|-----------------|-----------------------------------------------------|
| `page-exchange` | Компонент на `ExchangeSubscribeComponent`           |
| `page-detail`   | Страница + `devices/` (phone/tablet/desktop/common) |
| `page-data`     | Страница + `devices/` + `services/` (4 шт.)         |

## Использование

```bash
npm run evo <команда> -- --name <имя> [--style <тип>] [--path <путь>]
```

| Параметр  | Обязателен      | По умолчанию  |
|-----------|-----------------|---------------|
| `--name`  | да (kebab-case) | —             |
| `--style` | нет             | `scss`        |
| `--path`  | нет             | текущая папка |

## Примеры

```bash
# Компонент
npm run evo page-exchange -- --name user-card

# Страница детализации
npm run evo page-detail -- --name user-profile --style less --path src/app/pages

# Страница списка с сервисами
npm run evo page-data -- --name users-list
```

> Все созданные компоненты автоматически регистрируются в ближайшем `*.module.ts`.
