const fs = require('fs');
const path = require('path');
const { readFile, writeFile } = require('./helpers');

function isStandalone(componentPath) {
	const content = readFile(componentPath) || '';
	return /standalone\s*:\s*true/.test(content);
}

function findNgModule(startPath) {
	let dir = startPath;
	let depth = 0;

	while (depth++ < 10 && dir && dir !== path.parse(dir).root) {
		try {
			const files = fs.readdirSync(dir);
			const moduleFile = files.find(f =>
				f.endsWith('.module.ts') && !f.includes('-routing') && !f.includes('.spec')
			);
			if (moduleFile) return path.join(dir, moduleFile);
		} catch { /* ignore */ }
		dir = path.dirname(dir);
	}
	return null;
}

function getExportedClassName(componentPath) {
	const content = readFile(componentPath) || '';
	const m = content.match(/export\s+class\s+(\w+)/);
	return m ? m[1] : null;
}

function buildImportPath(modulePath, componentPath) {
	const rel = path.relative(path.dirname(modulePath), componentPath)
		.replace(/\\/g, '/')
		.replace(/\.ts$/, '');
	return rel.startsWith('.') ? rel : `./${rel}`;
}

function addImport(content, importStatement) {
	// вставляем после последнего import верхнего уровня
	const lines = content.split('\n');
	let lastImportIdx = -1;
	for (let i = 0; i < lines.length; i++) {
		if (/^\s*import\s.+from\s+['"].+['"];?\s*$/.test(lines[i])) lastImportIdx = i;
	}
	if (lastImportIdx === -1) return importStatement + '\n' + content;
	lines.splice(lastImportIdx + 1, 0, importStatement);
	return lines.join('\n');
}

function addToDeclarations(content, className) {
	// учитываем многострочные declarations
	const regex = /declarations\s*:\s*\[([\s\S]*?)\]/;
	const match = content.match(regex);
	if (!match) return content;
	if (new RegExp(`\\b${className}\\b`).test(match[1])) return content;

	const inner = match[1].trim();
	const next = inner ? `${inner},\n    ${className}` : `    ${className}`;
	return content.replace(regex, `declarations: [${next}]`);
}

function updateNgModule(componentPath, modulePath) {
	if (!modulePath || !fs.existsSync(modulePath)) return false;

	// standalone компоненты не регистрируем в declarations
	if (isStandalone(componentPath)) return false;

	const className = getExportedClassName(componentPath);
	if (!className) return false;

	let content = readFile(modulePath);
	if (new RegExp(`\\b${className}\\b`).test(content)) return false;

	const importPath = buildImportPath(modulePath, componentPath);
	content = addImport(content, `import { ${className} } from '${importPath}';`);
	content = addToDeclarations(content, className);

	writeFile(modulePath, content);
	return true;
}

module.exports = { findNgModule, updateNgModule, isStandalone };
