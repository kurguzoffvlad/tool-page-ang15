# ToolPageAng15

Генератор (разработка на NODE v20.19.5) - страниц и компонентов для ОБМЕНА МЕТОДАМИ И СВОЙСТВАМИ между компонентами.

ОБМЕН МЕТОДАМИ И СВОЙСТВАМИ между компонентами происходит через ExchangeLighthouse и ExchangeSubscribeComponent.

ExchangeLighthouse - отправляет информацию - что нужно сделать

ExchangeSubscribeComponent - изменяет свойство или запускает метод текущего компонента.

```bash
npm run create <команда> -- --name <имя> [--style <тип>] [--path <путь>]
```

| Параметр  | Обязателен      | По умолчанию  |
|-----------|-----------------|---------------|
| `--name`  | да (kebab-case) | —             |
| `--style` | нет             | `scss`        |
| `--path`  | нет             | текущая папка |

## Примеры

### 1. в начале в терминале нужно указать путь где нужно создать PAGE

```bash
# 1.1. Компонент
npm run create page-exchange -- --name page-exchange1
```

```bash
# 1.2. Страница детализации
npm run create page-detail -- --name page-detail1 --style less --path src/app/pages
```

```bash
# 1.3. Страница списка с сервисами
npm run create page-data -- --name page-data1
```

```bash
ng build tool-page-ang15   # сборка в dist/
```

> Все созданные компоненты автоматически регистрируются в ближайшем `*.module.ts`.

### package.json

```
{
	"dependencies": {
		"@angular/common": "^15.2.0",
		"@angular/core": "^15.2.0",
		"tool-exchange-ang15": "^x.y.z",
		"tool-screen-ang15": "^x.y.z",
		"tslib": "^2.3.0"
	},
	"devDependencies": {
		"tool-page-ang15": "^0.0.23"
	},
	"scripts": {
		"create": "node node_modules/tool-page-ang15/tools/index.js"
	}
}
```
