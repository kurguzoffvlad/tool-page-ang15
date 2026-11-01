// commands/page-exchange.js

const path = require('path');
const fs = require('fs');

const {
	toPascalCase,
	ensureDirectory,
	writeFile,
	safeGenerate,
	logSuccess,
	logError,
	logInfo,
	logWarning,
} = require('../utils/helpers');
const {
	validateComponentName,
	validateStyleType,
} = require('../utils/validators');
const { findNgModule, updateNgModule } = require('../utils/ng-module');

// Специфичные шаблоны exchange-компонента (ts + html)
const {
	getTsTemplate,
	getHtmlTemplate,
} = require('./templates/page-exchange/main');

// Общий шаблон стилей — переиспользуем из shared/styles.js,
// чтобы не держать третий дубль :host { ... }
const { getMainStylesTemplate } = require('./templates/shared/styles');

/**
 * Команда генерации exchange-компонента.
 *
 * Это «плоский» компонент (без devices/common-devices):
 *   - наследует ExchangeSubscribeComponent из tool-exchange-ang15;
 *   - получает viewDataFields через @Input;
 *   - регистрируется в ближайшем NgModule.
 *
 * Отличия от page-data/page-detail:
 *   - не использует buildDevicePage — структура совсем другая;
 *   - стили берутся из shared/styles.js (getMainStylesTemplate),
 *     а не дублируются локальной функцией.
 *
 * @param {string} targetPath  директория, откуда запустили генератор (INIT_CWD)
 * @param {string} _scriptPath путь к самому генератору (не используется)
 * @param {object} options     { name, style, path? }
 */
module.exports = async function (targetPath, _scriptPath, options) {
	const { name: componentName, style: styleType, path: customPath } = options;

	try {
		// 1. Валидация — до любых файловых операций.
		validateComponentName(componentName);
		validateStyleType(styleType);

		// 2. Куда генерировать: --path переопределяет targetPath.
		const createPath = customPath || targetPath;
		const componentFolder = path.join(createPath, componentName);
		const componentFile = path.join(componentFolder, `${componentName}.component.ts`);

		// 3. Идемпотентность: если компонент уже есть — выходим без ошибки.
		if (fs.existsSync(componentFile)) {
			logWarning(`Компонент ${componentName} уже существует`);
			return;
		}

		logInfo(`Создание компонента: ${componentName}`);

		// 4. Родительская папка должна существовать до ng CLI.
		ensureDirectory(createPath);

		// 5. Генерация через Angular CLI без --flat:
		//    ng создаст подпапку componentName/ со своими файлами,
		//    которые мы затем перезапишем нашими шаблонами.
		if (!safeGenerate(componentName, createPath, styleType, /* flat */ false)) {
			throw new Error('Не удалось создать компонент через Angular CLI');
		}

		// 6. Перезапись сгенерированных файлов нашими шаблонами.
		const className = toPascalCase(componentName);

		writeFile(componentFile, getTsTemplate(componentName, styleType, className));
		writeFile(
			path.join(componentFolder, `${componentName}.component.html`),
			getHtmlTemplate(componentName),
		);
		writeFile(
			path.join(componentFolder, `${componentName}.component.${styleType}`),
			getMainStylesTemplate(),
		);

		logSuccess(`Компонент ${componentName} создан`);

		// 7. Регистрация в ближайшем NgModule.
		//    updateNgModule сам пропустит standalone-компоненты.
		const modulePath = findNgModule(componentFolder);
		if (modulePath) {
			logInfo(`Регистрация в модуле: ${modulePath}`);
			updateNgModule(componentFile, modulePath);
		} else {
			logWarning('Модуль не найден — пропускаем регистрацию');
		}
	} catch (e) {
		logError(e.message);
		throw e;
	}
};
