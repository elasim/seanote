import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
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
	const pkg = require(path.join(process.cwd(), './package.json'));
	return new Promise((resolve, reject) => {
		fs.writeFile(
			path.join(config.server.output.path, './package.json'),
			JSON.stringify(pkg, (key, val) => {
				return key === 'devDependencies' ? undefined : val;
			}, 4),
			(e) => e ? reject(e) : resolve());
	});
}
