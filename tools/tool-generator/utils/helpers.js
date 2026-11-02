// utils/helpers.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/* ============================================================
 * СТРОКОВЫЕ УТИЛИТЫ
 * ============================================================ */

/**
 * kebab-case / snake_case → PascalCase
 * 'user-profile' → 'UserProfile'
 * 'user_profile' → 'UserProfile'
 * ''             → ''
 */
function toPascalCase(text) {
	if (!text) return '';
	return text
		.split(/[-_]/)
		.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
		.join('');
}

/* ============================================================
 * ФАЙЛОВАЯ СИСТЕМА
 * ============================================================ */

/**
 * Создаёт директорию рекурсивно.
 * @returns {boolean} true — если папка была создана, false — если уже существовала.
 */
function ensureDirectory(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
		return true;
	}
	return false;
}

/**
 * Синхронно пишет файл в utf8.
 * Не создаёт родительские папки — для этого есть ensureDirectory.
 */
function writeFile(filePath, content) {
	fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Читает файл, если он существует.
 * @returns {string|null} содержимое или null, если файла нет.
 */
function readFile(filePath) {
	if (fs.existsSync(filePath)) {
		return fs.readFileSync(filePath, 'utf8');
	}
	return null;
}

/**
 * Удаляет файл, если он существует.
 * @returns {boolean} true — если файл был удалён, false — если его не было.
 */
function deleteFile(filePath) {
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
		return true;
	}
	return false;
}

/**
 * Удаляет папку рекурсивно (аналог rm -rf).
 * @returns {boolean} true — если папка была удалена, false — если её не было.
 */
function deleteFolder(folderPath) {
	if (fs.existsSync(folderPath)) {
		fs.rmSync(folderPath, { recursive: true, force: true });
		return true;
	}
	return false;
}

/* ============================================================
 * ANGULAR CLI ИНТЕГРАЦИЯ
 * ============================================================ */

/**
 * Поднимается по дереву каталогов вверх, пока не найдёт angular.json.
 * @returns {string|null} путь к корню воркспейса или null.
 */
function findWorkspaceRoot(startDir) {
	let dir = startDir;
	while (dir !== path.parse(dir).root) {
		if (fs.existsSync(path.join(dir, 'angular.json'))) return dir;
		dir = path.dirname(dir);
	}
	return null;
}

/**
 * Определяет имя Angular-проекта по пути и angular.json.
 * Логика: ищем проект, чей root включает parentDir; иначе defaultProject; иначе первый.
 * @returns {string} имя проекта.
 */
function detectProject(root, parentDir) {
	const cfg = JSON.parse(fs.readFileSync(path.join(root, 'angular.json'), 'utf8'));
	const projects = cfg.projects || {};

	const found = Object.keys(projects).find(p => {
		const projectRoot = path.join(root, projects[p].root || p);
		return parentDir === projectRoot || parentDir.startsWith(projectRoot + path.sep);
	});

	return found || cfg.defaultProject || Object.keys(projects)[0];
}

/**
 * Запускает `ng g component` из корня воркспейса.
 *
 * @param {string}  componentName  имя компонента (kebab-case)
 * @param {string}  parentDir      родительская папка, куда генерируем
 * @param {string}  style          стиль: css | scss | sass | less | styl
 * @param {boolean} flat           true — создаёт файлы рядом (без папки), false — в подпапке
 * @returns {boolean} успех операции.
 */
function generateComponentViaAngularCLI(componentName, parentDir, style, flat = false) {
	const root = findWorkspaceRoot(parentDir);
	if (!root) {
		console.error('  Не найден angular.json — пропускаем генерацию через CLI');
		return false;
	}

	const project = detectProject(root, parentDir);
	const relPath = path.relative(root, parentDir).replace(/\\/g, '/');
	const flatFlag = flat ? '--flat' : '';

	// --skip-import: не добавляем в модуль автоматически — делаем это сами
	const cmd = [
		'ng g component', componentName,
		`--project=${project}`,
		`--path=${relPath}`,
		'--skip-tests=true',
		`--style=${style}`,
		flatFlag,
		'--skip-import',
	].filter(Boolean).join(' ');

	try {
		execSync(cmd, { stdio: 'pipe', cwd: root });
		return true;
	} catch (e) {
		console.error(`  Ошибка Angular CLI: ${e.message}`);
		return false;
	}
}

/**
 * Безопасная обёртка над generateComponentViaAngularCLI.
 * В отличие от CLI, НЕ создаёт «пустых» папок при провале — возвращает null.
 *
 * @returns {string|null} путь к папке компонента (или к parentDir при flat) либо null.
 */
function safeGenerate(componentName, parentDir, style, flat = false) {
	const ok = generateComponentViaAngularCLI(componentName, parentDir, style, flat);
	if (!ok) return null;
	return flat ? parentDir : path.join(parentDir, componentName);
}

/* ============================================================
 * ЛОГИРОВАНИЕ
 * ============================================================ */

const logSuccess = (msg) => console.log(`✅ ${msg}`);
const logError   = (msg) => console.error(`❌ ${msg}`);
const logInfo    = (msg) => console.log(`📌 ${msg}`);
const logWarning = (msg) => console.log(`⚠️ ${msg}`);

/* ============================================================
 * ЭКСПОРТ
 * ============================================================ */

module.exports = {
	// строки
	toPascalCase,

	// FS
	ensureDirectory,
	writeFile,
	readFile,
	deleteFile,
	deleteFolder,

	// Angular CLI
	findWorkspaceRoot,
	detectProject,
	generateComponentViaAngularCLI,
	safeGenerate,

	// логи
	logSuccess,
	logError,
	logInfo,
	logWarning,
};
