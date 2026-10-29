// commands/component-exchange.js

const path = require('path');
const fs = require('fs');
const {
	toPascalCase,
	ensureDirectory,
	writeFile,
	generateComponentViaAngularCLI,
	findNgModule,
	updateNgModule,
	logSuccess,
	logError,
	logInfo,
	logWarning
} = require('../utils/helpers');
const { validateComponentName, validateStyleType } = require('../utils/validators');

// Шаблон TypeScript
const getTsTemplate = (componentName, styleType, className) => `
import { Input, Component, OnInit, OnDestroy } from '@angular/core';

import {ExchangeSubscribeComponent, ExchangeLighthouse} from 'tool-exchange-ang15';

@Component({
    selector: 'exch-${componentName}',
    templateUrl: './${componentName}.component.html',
    styleUrls: ['./${componentName}.component.${styleType}']
})
export class ${className}Component extends ExchangeSubscribeComponent implements OnInit, OnDestroy {
    private static readonly extendsClassName = '${className}Component';

    @Input() public viewDataFields: any = {};

    public constructor(
    	public override exchange: ExchangeLighthouse) {
        super(${className}Component.extendsClassName, exchange);
    }

    public ngOnInit(): void { }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
`;

// Шаблон HTML
const getHtmlTemplate = (componentName) => `<div class="${componentName}-container">
    <p>${componentName} works!</p>
    <p>ExchangeSubscribeComponent - communication-center-for-components-and-services!!!</p>
</div>`;

// Шаблон стилей
const getStylesTemplate = () => `:host {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    box-sizing: border-box;
    overflow: hidden;
}`;

module.exports = async function(targetPath, scriptPath, options) {
	const { name: componentName, style: styleType, path: customPath } = options;

	try {
		// Валидация
		validateComponentName(componentName);
		validateStyleType(styleType);

		// Определяем родительскую папку (ng g сам создаст папку компонента внутри)
		const createPath = customPath || targetPath;

		const componentFolder = path.join(createPath, componentName);
		const componentFile = path.join(componentFolder, `${componentName}.component.ts`);

		// Проверка на существование
		if (fs.existsSync(componentFile)) {
			logWarning(`Компонент ${componentName} уже существует`);
			return;
		}

		logInfo(`Создание компонента: ${componentName}`);

		// Гарантируем наличие родительской папки
		ensureDirectory(createPath);

		// Генерируем через Angular CLI (без --flat, ng g создаст папку user-card/)
		const success = generateComponentViaAngularCLI(componentName, createPath, styleType, false);

		if (!success) {
			throw new Error('Не удалось создать компонент через Angular CLI');
		}

		// Перезаписываем файлы своими шаблонами
		const className = toPascalCase(componentName);

		// TypeScript файл
		writeFile(componentFile, getTsTemplate(componentName, styleType, className));

		// HTML файл
		const htmlFile = path.join(componentFolder, `${componentName}.component.html`);
		writeFile(htmlFile, getHtmlTemplate(componentName));

		// Styles файл
		const stylesFile = path.join(componentFolder, `${componentName}.component.${styleType}`);
		writeFile(stylesFile, getStylesTemplate());

		logSuccess(`Компонент ${componentName} создан`);

		// Регистрация в модуле
		const modulePath = findNgModule(componentFolder);
		if (modulePath) {
			logInfo(`Регистрация в модуле: ${modulePath}`);
			updateNgModule(componentFile, modulePath);
		} else {
			logWarning('Модуль не найден для регистрации компонента');
		}

	} catch (error) {
		logError(error.message);
		throw error;
	}
};
