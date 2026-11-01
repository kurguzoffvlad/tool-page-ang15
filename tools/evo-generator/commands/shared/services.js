// commands/shared/services.js

const path = require('path');
const fs = require('fs');

const {
	toPascalCase,
	writeFile,
	logSuccess,
	logWarning,
} = require('../../utils/helpers');

const {
	getRequestServiceTemplate,
	getServerServiceTemplate,
	getParsedServiceTemplate,
	getFactoryServiceTemplate,
} = require('../templates/page-data/services');

/* ============================================================
 * ОПИСАНИЕ СЕРВИСОВ
 * ============================================================ */

/**
 * Четыре сервиса, из которых состоит data-страница.
 *
 * `key` используется в:
 *   - имени файла:  `<componentName>-<key>.service.ts`
 *   - имени класса: `<PascalComponent><PascalKey>Service`
 *
 * `getter(className)` — возвращает готовый TS-код сервиса.
 *
 * Порядок в массиве соответствует порядку вызовов в рантайме:
 *   request → server → parsed → factory.
 */
const SERVICES = [
	{ key: '1-request', getter: getRequestServiceTemplate },
	{ key: '2-server',  getter: getServerServiceTemplate  },
	{ key: '3-parsed',  getter: getParsedServiceTemplate  },
	{ key: '4-factory', getter: getFactoryServiceTemplate },
];

/* ============================================================
 * ПУБЛИЧНЫЙ API
 * ============================================================ */

/**
 * Создаёт набор data-сервисов для страницы.
 *
 * Поведение:
 *   - если сервис уже существует — пропускает с warning (не перезаписывает);
 *   - если не существует — генерирует из шаблона и возвращает путь.
 *
 * @param {string} servicesPath   абсолютный путь к папке `services/`
 * @param {string} componentName  kebab-case имя страницы (например, 'users-list')
 *
 * @returns {string[]} пути созданных .ts файлов (только реально созданных,
 *                     без уже существующих — их не надо повторно регистрировать).
 */
function createServices(servicesPath, componentName) {
	const created = [];
	const pascal = toPascalCase(componentName);

	for (const { key, getter } of SERVICES) {
		const fileName = `${componentName}-${key}.service.ts`;
		const filePath = path.join(servicesPath, fileName);
		const className = `${pascal}${toPascalCase(key)}Service`;

		// Идемпотентность: не перезаписываем существующий файл — там могут
		// быть ручные правки разработчика.
		if (fs.existsSync(filePath)) {
			logWarning(`  Сервис ${key} уже существует`);
			continue;
		}

		writeFile(filePath, getter(className));
		created.push(filePath);
		logSuccess(`  Сервис ${key} создан`);
	}

	return created;
}

module.exports = {
	createServices,
	SERVICES,
};
