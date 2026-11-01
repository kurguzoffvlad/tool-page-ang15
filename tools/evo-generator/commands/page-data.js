// commands/page-data.js

const path = require('path');
const fs = require('fs');
const {
	toPascalCase,
	ensureDirectory,
	writeFile,
	deleteFile,
	generateComponentViaAngularCLI,
	findNgModule,
	updateNgModule,
	logSuccess,
	logError,
	logInfo,
	logWarning
} = require('../utils/helpers');
const { validateComponentName, validateStyleType } = require('../utils/validators');

// Подключаем шаблоны
// В начале файла заменить импорты на:
const { getMainTemplate, getMainHtmlTemplate } = require('./templates/page-data/main');
const { getCommonDevicesTemplate } = require('./templates/shared/common-devices');
const { getDeviceTemplate, getDeviceHtmlTemplate } = require('./templates/shared/device');
const { getMainStylesTemplate, getDeviceStylesTemplate } = require('./templates/shared/styles');
const {
	getRequestServiceTemplate,
	getServerServiceTemplate,
	getParsedServiceTemplate,
	getFactoryServiceTemplate
} = require('./templates/page-data/services');

const DEVICES = ['phone', 'tablet', 'desktop'];

const SERVICES = [
	{ name: '1-request', getter: getRequestServiceTemplate },
	{ name: '2-server', getter: getServerServiceTemplate },
	{ name: '3-parsed', getter: getParsedServiceTemplate },
	{ name: '4-factory', getter: getFactoryServiceTemplate },
];

async function generateComponentFlat(componentName, targetFolder, styleType) {
	return generateComponentViaAngularCLI(componentName, targetFolder, styleType, true);
}

async function generateComponentWithFolder(componentName, targetFolder, styleType) {
	// targetFolder - это папка devices
	const folder = path.join(targetFolder, componentName);

	// Создаем папку, где будет лежать компонент
	ensureDirectory(folder);

	// Запускаем Angular CLI без --flat, указывая родительскую папку (devices)
	// ng g сам создаст папку componentName внутри devices
	const success = generateComponentViaAngularCLI(componentName, targetFolder, styleType, false);

	return success ? folder : null;
}

function createServices(servicesPath, componentName) {
	const createdServices = [];
	const componentPascal = toPascalCase(componentName);

	for (const service of SERVICES) {
		const serviceFileName = `${componentName}-${service.name}.service.ts`;
		const serviceFilePath = path.join(servicesPath, serviceFileName);
		const serviceClassName = `${componentPascal}${toPascalCase(service.name)}Service`;

		if (!fs.existsSync(serviceFilePath)) {
			let template = service.getter(serviceClassName);
			writeFile(serviceFilePath, template);
			createdServices.push(serviceFilePath);
			logSuccess(`  Сервис ${service.name} создан`);
		} else {
			logWarning(`  Сервис ${service.name} уже существует`);
		}
	}

	return createdServices;
}

module.exports = async function (targetPath, scriptPath, options) {
	const { name: componentName, style: styleType, path: customPath } = options;

	try {
		validateComponentName(componentName);
		validateStyleType(styleType);

		const createPath = customPath || targetPath;
		const componentFolder = path.join(createPath, componentName);
		const devicesPath = path.join(componentFolder, 'devices');
		const servicesPath = path.join(componentFolder, 'services');

		logInfo(` Создание страницы со списком данных: ${componentName}`);

		// 1. Папка страницы
		ensureDirectory(componentFolder);

		// 2. Создание сервисов
		logInfo(`Создание сервисов...`);
		ensureDirectory(servicesPath);
		const createdServices = createServices(servicesPath, componentName);

		// 3. Основной компонент
		const mainFile = path.join(componentFolder, `${componentName}.component.ts`);
		if (!fs.existsSync(mainFile)) {
			const success = await generateComponentFlat(componentName, componentFolder, styleType);
			if (success) {
				const className = toPascalCase(componentName);
				const componentPascal = toPascalCase(componentName);
				writeFile(mainFile, getMainTemplate(componentName, styleType, className, componentPascal));
				writeFile(path.join(componentFolder, `${componentName}.component.html`), getMainHtmlTemplate(componentName));
				writeFile(path.join(componentFolder, `${componentName}.component.${styleType}`), getMainStylesTemplate());
				logSuccess(` Основная страница создана`);
			}
		} else {
			logWarning(` Основная страница уже существует`);
		}

		// 4. Папка devices
		ensureDirectory(devicesPath);

		// 5. Common-devices компонент
		const commonName = `${componentName}-common-devices`;
		const commonFile = path.join(devicesPath, `${commonName}.component.ts`);
		if (!fs.existsSync(commonFile)) {
			const success = await generateComponentFlat(commonName, devicesPath, styleType);
			if (success) {
				const commonClassName = `${toPascalCase(componentName)}CommonDevicesComponent`;
				writeFile(commonFile, getCommonDevicesTemplate(commonName, commonClassName));

				const commonHtmlFile = path.join(devicesPath, `${commonName}.component.html`);
				const commonStylesFile = path.join(devicesPath, `${commonName}.component.${styleType}`);
				if (fs.existsSync(commonHtmlFile)) deleteFile(commonHtmlFile);
				if (fs.existsSync(commonStylesFile)) deleteFile(commonStylesFile);

				logSuccess(` Common-devices компонент создан`);
			}
		}

		// 6. Device компоненты
		const commonClassName = `${toPascalCase(componentName)}CommonDevicesComponent`;
		const commonImport = `../${commonName}.component`;
		const componentFiles = [mainFile, commonFile, ...createdServices];

		for (const device of DEVICES) {
			const deviceName = `${componentName}-${device}`;
			const deviceFolder = await generateComponentWithFolder(deviceName, devicesPath, styleType);

			if (deviceFolder && fs.existsSync(deviceFolder)) {
				const deviceFile = path.join(deviceFolder, `${deviceName}.component.ts`);
				const deviceClassName = `${toPascalCase(deviceName)}Component`;

				writeFile(deviceFile, getDeviceTemplate(deviceName, styleType, commonClassName, commonImport, deviceClassName));
				writeFile(path.join(deviceFolder, `${deviceName}.component.html`), getDeviceHtmlTemplate(deviceName));
				writeFile(path.join(deviceFolder, `${deviceName}.component.${styleType}`), getDeviceStylesTemplate());

				componentFiles.push(deviceFile);
				logSuccess(` Device компонент ${device} создан`);
			}
		}

		// 7. Регистрация в модуле
		const modulePath = findNgModule(componentFolder);
		if (modulePath) {
			logInfo(` Регистрация компонентов в модуле: ${modulePath}`);
			for (const compFile of componentFiles) {
				if (fs.existsSync(compFile) && compFile.endsWith('.ts') && !compFile.includes('.service')) {
					updateNgModule(compFile, modulePath);
				}
			}
		} else {
			logWarning(' Модуль не найден для регистрации компонентов');
		}

		logSuccess(` Страница ${componentName} с сервисами успешно создана`);

	} catch (error) {
		logError(error.message);
		throw error;
	}
};
