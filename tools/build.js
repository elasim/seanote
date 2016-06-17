import path from 'path';
import webpack from 'webpack';
import './common/setup';

const config = global.config;
const clientCompiler = webpack(config.client);
const serverCompiler = webpack(config.server);

Promise.all([
	runCompiler(clientCompiler),
	runCompiler(serverCompiler)
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
