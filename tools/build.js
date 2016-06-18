import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import webpack from 'webpack';
import mkdirp from 'mkdirp';
import './common/setup';

const config = global.config;
const clientCompiler = webpack(config.client);
const serverCompiler = webpack(config.server);

Promise.all([
	runCompiler(clientCompiler),
	runCompiler(serverCompiler),
	makePackage(),
])
	.then(() => {
		console.log('Build Success');
		console.log('=>', config.server.output.path);
	})
	.catch(e => {
		console.error(e);
	});

function runCompiler(compiler) {
	return new Promise((resolve, reject) => {
		compiler.run((e, stats) => {
			console.log(stats.toString({
				colors: true,
				chunks: global.VERBOSE
			}));
			e ? reject(e) : resolve();
		});
	});
}

function makePackage() {
	const ejectFields = [
		'devDependencies',
		'scripts'
	];
	const overwriteFields = {
		'main': './server.js'
	};
	const inputPath = path.join(process.cwd(), './package.json');
	const outputPath = path.join(config.server.output.path, './package.json');
	let pkg = _.cloneDeep(require(inputPath));
	ejectFields.forEach(field => {
		delete pkg[field];
	});
	Object.assign(pkg, overwriteFields);
	return mkdir(path.dirname(outputPath))
		.then(writeFile(outputPath, JSON.stringify(pkg, null, 4)));
}

function mkdir(dirPath) {
	return new Promise((resolve, reject) => {
		mkdir(dirPath, (e) => e ? reject(e) : resolve());
	});
}

function writeFile(filePath, content) {
	return new Promise((resolve, reject) => {
		fs.writeFile(filePath, content, (e) => e ? reject(e) : resolve());
	});
}
