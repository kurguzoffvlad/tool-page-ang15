// commands/shared/page-builder.js

const fs = require('fs');
const path = require('path');

const {
	toPascalCase,
	ensureDirectory,
	writeFile,
	deleteFile,
	safeGenerate,
	logSuccess,
	logInfo,
	logWarning,
} = require('../../utils/helpers');
const { findNgModule, updateNgModule } = require('../../utils/ng-module');

/**
 * Список device-компонентов, которые создаются для каждой страницы.
 * Порядок важен только для логов.
 */
const DEVICES = ['phone', 'tablet', 'desktop'];

/* ============================================================
 * ВНУТРЕННИЕ ШАГИ ПАЙПЛАЙНА
 * ============================================================ */

/**
 * Шаг 1: создаёт главный компонент страницы (flat-структура, без подпапки).
 * Если файл уже существует — не перегенерирует, но добавляет в список для регистрации.
 *
 * @returns {string[]} массив путей созданных/существующих .ts файлов главного компонента.
 */
function buildMainComponent({ componentName, styleType, componentFolder, templates, sharedTemplates }) {
	const mainFile = path.join(componentFolder, `${componentName}.component.ts`);
	const pascal = toPascalCase(componentName);

	// Идемпотентность: если главный файл уже есть — не трогаем его,
	// но возвращаем, чтобы попытаться зарегистрировать в модуле.
	if (fs.existsSync(mainFile)) {
		logWarning(' Основная страница уже существует');
		return [mainFile];
	}

	// safeGenerate вернёт null при провале CLI — тогда не пишем свои шаблоны поверх пустоты
	if (!safeGenerate(componentName, componentFolder, styleType, /* flat */ true)) {
		return [];
	}

	writeFile(mainFile, templates.getMainTemplate(componentName, styleType, pascal));
	writeFile(
		path.join(componentFolder, `${componentName}.component.html`),
		templates.getMainHtmlTemplate(componentName),
	);
	writeFile(
		path.join(componentFolder, `${componentName}.component.${styleType}`),
		sharedTemplates.styles.getMainStylesTemplate(),
	);

	logSuccess(' Основная страница создана');
	return [mainFile];
}

/**
 * Шаг 2: common-devices — «обёртка» вокруг device-компонентов.
 * Особенность: у него нет отдельного html/scss — всё в inline-template внутри .ts.
 * Поэтому после ng CLI удаляем сгенерированные html/scss, а .ts перезаписываем.
 *
 * @returns {string[]} массив путей созданных/существующих .ts файлов.
 */
function buildCommonDevices({ componentName, styleType, devicesPath, sharedTemplates }) {
	const commonName = `${componentName}-common-devices`;
	const commonClassName = `${toPascalCase(componentName)}CommonDevicesComponent`;
	const commonFile = path.join(devicesPath, `${commonName}.component.ts`);

	if (fs.existsSync(commonFile)) {
		return [commonFile];
	}

	if (!safeGenerate(commonName, devicesPath, styleType, /* flat */ true)) {
		return [];
	}

	writeFile(commonFile, sharedTemplates.commonDevices(commonName, commonClassName));

	// Удаляем лишние файлы, которые сгенерировал ng g (нам они не нужны —
	// шаблон и стили у common-devices инлайн в .ts).
	deleteFile(path.join(devicesPath, `${commonName}.component.html`));
	deleteFile(path.join(devicesPath, `${commonName}.component.${styleType}`));

	logSuccess(' Common-devices компонент создан');
	return [commonFile];
}

/**
 * Шаг 3: три device-компонента (phone/tablet/desktop).
 * Каждый наследуется от common-devices, получает собственный html/scss.
 *
 * @returns {string[]} массив путей созданных .ts файлов.
 */
function buildDeviceComponents({ componentName, styleType, devicesPath, sharedTemplates }) {
	const commonName = `${componentName}-common-devices`;
	const commonClassName = `${toPascalCase(componentName)}CommonDevicesComponent`;
	const commonImport = `../${commonName}.component`;

	const created = [];

	for (const device of DEVICES) {
		const deviceName = `${componentName}-${device}`;

		// flat=false — Angular CLI создаст подпапку `devices/<deviceName>/`
		const deviceFolder = safeGenerate(deviceName, devicesPath, styleType, /* flat */ false);
		if (!deviceFolder) {
			logWarning(` Не удалось создать device-компонент: ${device}`);
			continue;
		}

		const deviceFile = path.join(deviceFolder, `${deviceName}.component.ts`);
		const deviceClassName = `${toPascalCase(deviceName)}Component`;

		writeFile(
			deviceFile,
			sharedTemplates.device.getDeviceTemplate(
				deviceName,
				styleType,
				commonClassName,
				commonImport,
				deviceClassName,
			),
		);
		writeFile(
			path.join(deviceFolder, `${deviceName}.component.html`),
			sharedTemplates.device.getDeviceHtmlTemplate(deviceName),
		);
		writeFile(
			path.join(deviceFolder, `${deviceName}.component.${styleType}`),
			sharedTemplates.styles.getDeviceStylesTemplate(),
		);

		created.push(deviceFile);
		logSuccess(` Device компонент ${device} создан`);
	}

	return created;
}

/**
 * Шаг 4: регистрация всех компонентов страницы в ближайшем NgModule.
 * - standalone-компоненты пропускаются (это внутри updateNgModule).
 * - если модуль не найден — просто warning, пайплайн не падает.
 */
function registerInModule({ componentFolder, componentFiles }) {
	const modulePath = findNgModule(componentFolder);
	if (!modulePath) {
		logWarning(' Модуль не найден — пропускаем регистрацию');
		return;
	}

	logInfo(` Регистрация в модуле: ${modulePath}`);

	for (const file of componentFiles) {
		if (fs.existsSync(file)) {
			updateNgModule(file, modulePath);
		}
	}
}

/* ============================================================
 * ПУБЛИЧНЫЙ API
 * ============================================================ */

/**
 * Универсальный пайплайн построения «страницы с устройствами».
 *
 * Используется командами page-data и page-detail.
 * Разница между ними — только `templates` (main-шаблон) и опциональные `createServices`.
 *
 * @param {object}   opts
 * @param {string}   opts.componentName     kebab-case имя страницы
 * @param {string}   opts.styleType         css | scss | sass | less | styl
 * @param {string}   opts.componentFolder   абсолютный путь к папке страницы (уже создан)
 *
 * @param {object}   opts.templates
 * @param {Function} opts.templates.getMainTemplate     (name, style, pascal) => string
 * @param {Function} opts.templates.getMainHtmlTemplate (name) => string
 *
 * @param {object}   opts.sharedTemplates
 * @param {object}   opts.sharedTemplates.styles              { getMainStylesTemplate, getDeviceStylesTemplate }
 * @param {Function} opts.sharedTemplates.commonDevices       (name, className) => string
 * @param {object}   opts.sharedTemplates.device              { getDeviceTemplate, getDeviceHtmlTemplate }
 *
 * @param {Function|null} [opts.createServices]
 *        (servicesPath, componentName) => string[] — если передан, создаёт services/.
 *        Передаётся только из page-data.
 *
 * @returns {Promise<void>}
 */
async function buildDevicePage(opts) {
	const {
		componentName,
		styleType,
		componentFolder,
		templates,
		sharedTemplates,
		createServices = null,
	} = opts;

	const devicesPath = path.join(componentFolder, 'devices');
	const servicesPath = path.join(componentFolder, 'services');

	// Собираем все созданные .ts — их потом отдадим в registerInModule.
	const componentFiles = [];

	// 1. Главный компонент страницы
	componentFiles.push(
		...buildMainComponent({ componentName, styleType, componentFolder, templates, sharedTemplates }),
	);

	// 2. Сервисы (только для page-data)
	if (createServices) {
		ensureDirectory(servicesPath);
		componentFiles.push(...createServices(servicesPath, componentName));
	}

	// 3. Папка devices
	ensureDirectory(devicesPath);

	// 4. common-devices
	componentFiles.push(
		...buildCommonDevices({ componentName, styleType, devicesPath, sharedTemplates }),
	);

	// 5. device-компоненты
	componentFiles.push(
		...buildDeviceComponents({ componentName, styleType, devicesPath, sharedTemplates }),
	);

	// 6. Регистрация в NgModule
	registerInModule({ componentFolder, componentFiles });
}

module.exports = {
	buildDevicePage,
	DEVICES,
};
