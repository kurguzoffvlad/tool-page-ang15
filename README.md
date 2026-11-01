# ToolPageAng15

Генератор (разработка на NODE v20.19.5) - страниц и компонентов для ОБМЕНА МЕТОДАМИ И СВОЙСТВАМИ между компонентами.

ОБМЕН МЕТОДАМИ И СВОЙСТВАМИ между компонентами происходит через ExchangeSubscribeComponent

## Установка

```bash
npm install tool-page-ang15
```

## Настройка

Добавьте в `package.json`:

```json
"scripts": {
	"create": "node node_modules/tool-page-ang15/tools/evo-generator/index.js"
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
npm run create page-exchange -- --name page-exchange1

# Страница детализации
npm run create page-detail -- --name page-detail1 --style less --path src/app/pages

# Страница списка с сервисами
npm run create page-data -- --name page-data1
```


```bash
ng build tool-page-ang15   # сборка в dist/
```

> Все созданные компоненты автоматически регистрируются в ближайшем `*.module.ts`.
