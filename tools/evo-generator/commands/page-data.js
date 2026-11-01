// commands/page-data.js

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
const { createServices } = require('./shared/services');

// Шаблоны, специфичные для data-страницы (с сервисами)
const main = require('./templates/page-data/main');

// Общие шаблоны, одинаковые для data и detail
const styles = require('./templates/shared/styles');
const commonDevices = require('./templates/shared/common-devices');
const device = require('./templates/shared/device');

/**
 * Команда генерации «страницы со списком данных».
 *
 * Отличие от page-detail:
 *   - создаёт папку services/ с четырьмя сервисами (request/server/parsed/factory);
 *   - главный компонент имеет доступ к этим сервисам через DI.
 *
 * Вся механика генерации вынесена в buildDevicePage — здесь только:
 *   1) валидация,
 *   2) подготовка путей,
 *   3) передача шаблонов и createServices.
 *
 * @param {string} targetPath  директория, откуда запустили генератор (INIT_CWD)
 * @param {string} _scriptPath путь к самому генератору (не используется)
 * @param {object} options     { name, style, path? }
 */
module.exports = async function (targetPath, _scriptPath, options) {
	const { name: componentName, style: styleType, path: customPath } = options;

	try {
		// 1. Валидация входных данных — до создания любых папок,
		//    чтобы не оставить мусор при ошибке.
		validateComponentName(componentName);
		validateStyleType(styleType);

		// 2. Куда генерировать: --path переопределяет targetPath.
		const componentFolder = path.join(customPath || targetPath, componentName);

		logInfo(` Создание страницы со списком данных: ${componentName}`);

		// 3. Папка страницы должна существовать до вызова ng CLI,
		//    который пишет файлы внутрь неё.
		ensureDirectory(componentFolder);

		// 4. Основной пайплайн — единый для data и detail.
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

			// Ключевое отличие от page-detail:
			// передаём createServices — builder создаст services/ и 4 сервиса.
			createServices,
		});

		logSuccess(` Страница ${componentName} с сервисами успешно создана`);
	} catch (e) {
		logError(e.message);
		throw e;
	}
};
