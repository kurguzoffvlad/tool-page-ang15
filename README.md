# ToolPageAng15

Генератор (разработка на NODE v20.19.5) - страниц и компонентов для ОБМЕНА МЕТОДАМИ И СВОЙСТВАМИ между компонентами.

ОБМЕН МЕТОДАМИ И СВОЙСТВАМИ между компонентами происходит через ExchangeLighthouse и ExchangeSubscribeComponent.

ExchangeLighthouse - отправляет информацию - что нужно сделать

ExchangeSubscribeComponent - изменяет свойство или запускает метод текущего компонента.

```bash
npm run CREATE:page <команда> -- --name <имя> [--style <тип>] [--path <путь>]
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
npm run CREATE:page page-exchange -- --name page-exchange1
```

```bash
# 1.2. Страница детализации
npm run CREATE:page page-detail -- --name page-detail1 --style less --path src/app/pages
```

```bash
# 1.3. Страница списка с сервисами
npm run CREATE:page page-data -- --name page-data1
```

```bash
ng build tool-page-ang15   # сборка в dist/
```

> Все созданные компоненты автоматически регистрируются в ближайшем `*.module.ts`.

### package.json

```jsonc
{
	"dependencies": {
		"@angular/common": "^15.2.0",
		"@angular/core": "^15.2.0",
		"tslib": "^2.3.0"
		// ⬇️ эти пакеты — для разработки
		"tool-exchange-ang15": "^x.y.z",
		"tool-screen-ang15": "^x.y.z",
	},
```

```jsonc
	"devDependencies": {
		// ⬇️ эти пакеты — только для разработки
		"tool-page-ang15": "^x.y.z",
		"tool-snippets": "^x.y.z"
	}
```

```jsonc
	"scripts": {
		"CREATE:page": "node dist/tool-page-ang15/tools/tool-generator/index.js",
		"SNIPPETS:webstorm": "node ./dist/tool-snippets/webstorm/install-snippets.js",
		"SNIPPETS:vscode": "node ./dist/tool-snippets/vscode/install-snippets.js",
	}
}
```
