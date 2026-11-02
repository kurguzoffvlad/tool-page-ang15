// commands/page-detail.js

const path = require('path');

const {
	ensureDirectory,
	logInfo,
	logSuccess,
	logError,
} = require('../utils/helpers');
const {
	validateComponentName,
	validateStyleType,
} = require('../utils/validators');

const { buildDevicePage } = require('./shared/page-builder');

// Шаблоны, специфичные для detail-страницы (без сервисов)
const main = require('./templates/page-detail/main');

// Общие шаблоны, одинаковые для data и detail
const styles = require('./templates/shared/styles');
const commonDevices = require('./templates/shared/common-devices');
const device = require('./templates/shared/device');

/**
 * Команда генерации «страницы детализации».
 *
 * Отличие от page-data:
 *   - не создаёт services/ (нет createServices в вызове builder-а);
 *   - главный компонент не наследует ExchangeSubscribeComponent и не инжектит сервисы —
 *     это видно по шаблону templates/page-detail/main.
 *
 * Всё остальное (главный компонент, devices/, common-devices, регистрация в NgModule)
 * идентично data-странице и вынесено в buildDevicePage.
 *
 * @param {string} targetPath  директория, откуда запустили генератор (INIT_CWD)
 * @param {string} _scriptPath путь к самому генератору (не используется)
 * @param {object} options     { name, style, path? }
 */
module.exports = async function (targetPath, _scriptPath, options) {
	const { name: componentName, style: styleType, path: customPath } = options;

	try {
		// 1. Валидация — до создания папок, чтобы не оставлять мусор при ошибке.
		validateComponentName(componentName);
		validateStyleType(styleType);

		// 2. Целевая папка: --path переопределяет targetPath.
		const componentFolder = path.join(customPath || targetPath, componentName);

		logInfo(` Создание страницы детализации: ${componentName}`);

		// 3. Папка страницы должна существовать до вызова ng CLI.
		ensureDirectory(componentFolder);

		// 4. Основной пайплайн — тот же, что у page-data,
		//    но без createServices (сервисы не нужны на detail).
		await buildDevicePage({
			componentName,
			styleType,
			componentFolder,

			// Шаблоны главного компонента и его html
			templates: {
				getMainTemplate: main.getMainTemplate,
				getMainHtmlTemplate: main.getMainHtmlTemplate,
			},

			// Общие шаблоны для devices/common-devices/styles
			sharedTemplates: {
				styles,
				commonDevices: commonDevices.getCommonDevicesTemplate,
				device,
			},

			// createServices НЕ передаём — это единственное отличие от page-data.
		});

		logSuccess(` Страница ${componentName} успешно создана`);
	} catch (e) {
		logError(e.message);
		throw e;
	}
};
