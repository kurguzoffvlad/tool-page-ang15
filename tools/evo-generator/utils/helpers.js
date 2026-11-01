// evo-front-lib\projects\evo-lib\tools\evo-generator\utils\helpers.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function toPascalCase(text) {
	if (!text) return '';
	return text
		.split(/[-_]/)
		.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
		.join('');
}

function toCamelCase(text) {
	const pascal = toPascalCase(text);
	if (!pascal) return '';
	return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function ensureDirectory(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
		return true;
	}
	return false;
}

function writeFile(filePath, content) {
	fs.writeFileSync(filePath, content, 'utf8');
}

function readFile(filePath) {
	if (fs.existsSync(filePath)) {
		return fs.readFileSync(filePath, 'utf8');
	}
	return null;
}

function deleteFile(filePath) {
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
		return true;
	}
	return false;
}

function deleteFolder(folderPath) {
	if (fs.existsSync(folderPath)) {
		fs.rmSync(folderPath, { recursive: true, force: true });
		return true;
	}
	return false;
}

function findWorkspaceRoot(startDir) {
	let dir = startDir;
	while (dir !== path.parse(dir).root) {
		if (fs.existsSync(path.join(dir, 'angular.json'))) return dir;
		dir = path.dirname(dir);
	}
	return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function detectProject(root, targetPath) {
	const rel = path.relative(root, targetPath).replace(/\\/g, '/');
	const m = rel.match(/^projects\/([^/]+)/);
	if (m) return m[1];
	const cfg = JSON.parse(fs.readFileSync(path.join(root, 'angular.json'), 'utf8'));
	return cfg.defaultProject || Object.keys(cfg.projects)[0];
}

function generateComponentViaAngularCLI(componentName, parentDir, style, flat = false) {
	const root = findWorkspaceRoot(parentDir);
	if (!root) return false;

	const cfg = JSON.parse(fs.readFileSync(path.join(root, 'angular.json'), 'utf8'));
	// Ищем проект (shell)
	const project = Object.keys(cfg.projects).find(p => parentDir.includes(cfg.projects[p].root || p)) || cfg.defaultProject || Object.keys(cfg.projects)[0];

	const relPath = path.relative(root, parentDir).replace(/\\/g, '/');
	const flatFlag = flat ? '--flat' : '';
	const cmd = `ng g component ${componentName} --project=${project} --path=${relPath} --skip-tests=true --style=${style} ${flatFlag} --skip-import`;

	try {
		// Запускаем из корня!
		execSync(cmd, { stdio: 'pipe', cwd: root });
		return true;
	} catch (e) {
		console.error(`  Ошибка Angular CLI: ${e.message}`);
		return false;
	}
}

function findNgModule(startPath) {
	let currentPath = startPath;
	let depth = 0;
	const maxDepth = 10;

	while (depth < maxDepth && currentPath && currentPath !== path.parse(currentPath).root) {
		try {
			const files = fs.readdirSync(currentPath);

			// 1. Сначала ищем основной модуль (page.module.ts)
			// Исключаем роутинг (page-routing.module.ts)
			const moduleFile = files.find(f =>
				f.endsWith('.module.ts') &&
				!f.includes('-routing') &&
				!f.includes('.spec')
			);

			if (moduleFile) {
				console.log(`  Найден модуль: ${path.join(currentPath, moduleFile)}`);
				return path.join(currentPath, moduleFile);
			}

			// 2. Если основного нет, ищем любой другой (кроме роутинга)
			const fallbackModule = files.find(f => f.endsWith('.module.ts') && !f.includes('-routing'));
			if (fallbackModule) {
				console.log(`  Найден fallback-модуль: ${path.join(currentPath, fallbackModule)}`);
				return path.join(currentPath, fallbackModule);
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			// игнорируем ошибки доступа
		}

		const parentPath = path.dirname(currentPath);
		if (parentPath === currentPath) break;
		currentPath = parentPath;
		depth++;
	}

	console.log(`  Модуль не найден, начиная с: ${startPath}`);
	return null;
}

function updateNgModule(componentPath, modulePath) {
	if (!modulePath || !fs.existsSync(modulePath)) {
		return false;
	}

	// Получаем имя класса из файла компонента
	const componentContent = readFile(componentPath);
	const classNameMatch = componentContent.match(/export class (\w+)/);
	if (!classNameMatch) return false;

	const className = classNameMatch[1];

	let moduleContent = readFile(modulePath);
	if (moduleContent.includes(className)) return false;

	// Вычисляем относительный путь для импорта
	const moduleDir = path.dirname(modulePath);
	let relativePath = path.relative(moduleDir, componentPath);
	relativePath = relativePath.replace(/\\/g, '/').replace(/\.ts$/, '');
	if (!relativePath.startsWith('.')) {
		relativePath = './' + relativePath;
	}

	const newImport = `import { ${className} } from '${relativePath}';`;

	// Добавляем импорт после последнего import
	const importRegex = /(import .*;\s*)+/;
	const importMatch = moduleContent.match(importRegex);
	if (importMatch) {
		const lastImportIndex = importMatch[0].lastIndexOf(';');
		moduleContent = moduleContent.slice(0, lastImportIndex + 1) +
			'\n' + newImport +
			moduleContent.slice(lastImportIndex + 1);
	}

	// Добавляем в declarations
	const declarationsRegex = /declarations:\s*\[([^\]]*)\]/;
	const declarationsMatch = moduleContent.match(declarationsRegex);
	if (declarationsMatch && !declarationsMatch[1].includes(className)) {
		const declarations = declarationsMatch[1].trim();
		const newDeclarations = declarations ?
			`${declarations},\n    ${className}` :
			`    ${className}`;
		moduleContent = moduleContent.replace(declarationsRegex, `declarations: [${newDeclarations}]`);
	}

	writeFile(modulePath, moduleContent);
	console.log(`  ✓ Модуль обновлен: ${modulePath}`);
	return true;
}

function logSuccess(message) {
	console.log(`✅ ${message}`);
}

function logError(message) {
	console.error(`❌ ${message}`);
}

function logInfo(message) {
	console.log(`📌 ${message}`);
}

function logWarning(message) {
	console.log(`⚠️ ${message}`);
}

module.exports = {
	toPascalCase,
	toCamelCase,
	ensureDirectory,
	writeFile,
	readFile,
	deleteFile,
	deleteFolder,
	generateComponentViaAngularCLI,
	findNgModule,
	updateNgModule,
	logSuccess,
	logError,
	logInfo,
	logWarning
};
