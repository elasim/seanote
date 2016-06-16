import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDev from 'webpack-dev-middleware';
import webpackHot from 'webpack-hot-middleware';
import colors from 'colors';

import LiveCompiler from './lib/live-compiler';
import Server from './lib/server';
import config from './common/webpack.config.dev';

config.client.entry.unshift('webpack-hot-middleware/client?path=/__webpack_hmr');
config.client.plugins.push(new webpack.HotModuleReplacementPlugin());

const clientCompiler = webpack(config.client);
const serverCompiler = new LiveCompiler(config.server);
const server = new Server(config.server);

server.on('error', e => {
	console.error('Server thrown error');
	console.error(e.stack);
});

// run server at first success
serverCompiler.once('success', async (stat) => {
	logBuild(stat);
	try {
		await server.start();
		await initBrowserSync({
			proxy: {
				target: config.live.host + ':' + config.live.port,
				middleware: [
					webpackDev(clientCompiler, {
						noInfo: true,
						publicPath: config.client.output.publicPath
					}),
					webpackHot(clientCompiler, {
						log: console.log,
						path: '/__webpack_hmr',
						heartbeat: 10 * 1000
					})
				]
			}
		});
	} catch (e) {
		return exit(e);
	}
	serverCompiler.on('success', async (stat) => {
		logBuild(stat);
		await server.stop();
		await server.start();
	});
});
serverCompiler.on('failure', logBuild);
serverCompiler.on('error', (e) => {
	console.error('compiler has been throw an error');
	exit(e);
});

serverCompiler.start();

function initBrowserSync(config) {
	const bs = browserSync.create();
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			console.log('BrowserSync Timeout');
			reject();
		}, 5000);
		bs.init(config, e => {
			console.log('BrowserSync init');
			clearTimeout(timeout);
			e ? reject(e) : resolve();
		});
	});
}

function logBuild(stats) {
	console.log('color', stats.toString({
		colors: true
	}));
	const result = stats.toJson();
	console.log(
		'Errors', result.errors.length,
		'Warnings', result.warnings.length
	);
	if (result.errors.length > 0) {
		console.log('build failure');
	} else {
		console.log('build success');
	}
}

async function exit(e = null) {
	if (e) {
		console.error('dev-server exit', e instanceof Error ? e.stack : e);
	}
	await server.stop();
	process.exit(e ? 1 : 0);
}
