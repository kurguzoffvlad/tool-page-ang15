const args = process.argv.slice(2);
const path = require('path');

// Берем текущую директорию ОТКУДА ЗАПУСТИЛИ (до того как npm сменил cwd)
// В Windows process.env.INIT_CWD хранит папку, из которой вызвали npm run!
const targetPath = process.env.INIT_CWD || process.cwd();

const scriptPath = __dirname;
const command = args[0];
const options = parseArgs(args.slice(1));

async function main() {
	console.log(`\n🚀 Generator v2.0`);
	console.log(`📂 Целевая директория: ${targetPath}\n`);

	switch (command) {
		case 'component-exchange':
			const componentExchange = require('./commands/component-exchange');
			await componentExchange(targetPath, scriptPath, options);
			break;
		case 'page-detail':
			const pageDetail = require('./commands/page-detail');
			await pageDetail(targetPath, scriptPath, options);
			break;
		case 'page-data':
			const pageData = require('./commands/page-data');
			await pageData(targetPath, scriptPath, options);
			break;
		default:
			console.log(`Неизвестная команда: ${command}`);
	}
}

function parseArgs(args) {
	const options = { style: 'scss' };
	for (let i = 0; i < args.length; i++) {
		if (args[i] === '--name') options.name = args[++i];
		if (args[i] === '--style') options.style = args[++i];
		if (args[i] === '--path') options.path = args[++i];
	}

	// Если путь передан - делаем его абсолютным относительно INIT_CWD
	if (options.path) {
		options.path = path.resolve(targetPath, options.path);
	}
	return options;
}

main().catch(error => {
	console.error(`❌ Ошибка: ${error.message}`);
	process.exit(1);
});
