import fs from 'fs';
import path from 'path';

import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDev from 'webpack-dev-middleware';
import webpackHot from 'webpack-hot-middleware';
import { open } from 'openurl';

import LiveCompiler from './lib/live-compiler';
import Server from './lib/server';

import './common/setup.js';

const config = global.config;

// inject HMR on development
if (global.DEBUG) {
	const loader = 'react-hot!babel';
	const hmrEntry = 'webpack-hot-middleware/client?path=/'
		+ config.setup.debug.hmrPath;
	const babel = config.client.module.loaders
		.filter(loader => loader.loader === 'babel');
	if (babel.length > 0) {
		babel[0].loader = babel[0].loader.replace(/babel/, loader);
	} else {
		console.warn('babel-loader not found, will be added');
		config.client.module.loaders.push({
			test: /\.jsx?$/,
			exclude: /(node_modules|bower_components)/,
			loader: loader
		});
	}

	// disable hash name for asset to prevent file creation
	const regHashName = /\[hash:\d+\]/g;
	config.client.module.loaders
		.filter(loader => regHashName.test(loader.loader))
		.forEach(cfg => {
			cfg.loader = cfg.loader.replace(regHashName, '[name]');
		});

	config.client.entry.unshift(hmrEntry);
	config.client.plugins.push(new webpack.HotModuleReplacementPlugin());
	console.log('HMR feature enabled');
}

const clientCompiler = webpack(config.client);
const serverCompiler = new LiveCompiler(config.server);
const server = new Server(config.server);

server.on('error', e => {
	console.error('Server thrown error');
	console.error(e.stack);
});

// run server at first success
serverCompiler.once('success', startServer);
serverCompiler.on('failure', logBuild);
serverCompiler.on('error', (e) => {
	console.error('compiler has been throw an error');
	exit(e);
});

serverCompiler.start();

let bs;
async function startServer(stat) {
	logBuild(stat);
	try {
		// delete old assets.json whatever it exists or not
		fs.unlink(config.setup.runtime.assetsPath, () => {});
		// inject browser-sync on development
		if (global.DEBUG) {
			bs = await initBrowserSync({
				proxy: {
					target: config.user.host + ':' + config.user.port,
					middleware: [
						webpackDev(clientCompiler, {
							noInfo: !global.VERBOSE,
							publicPath: config.client.output.publicPath
						}),
						webpackHot(clientCompiler, {
							log: global.VERBOSE ? console.log : null,
							path: '/' + config.setup.debug.hmrPath,
							heartbeat: 10 * 1000
						})
					]
				},
				open: false
			});
		} else {
			console.log('You are running dev-server in production mode');
			console.log('HMR not working, You have to refresh yourself');
			clientCompiler.watch({
				poll: true,
				aggregateTimeout: 300
			}, (e, stats) => {
				// don't handle webpack error, leave it throw
				if (e) {
					console.error(e);
					throw e;
				}
				logBuild(stats);
			});
		}
		// wait for until assets.json created
		await waitForFileExists(config.setup.runtime.assetsPath);
		console.log(config.setup.runtime.assetsPath, 'prepared');
		await server.start();
		if (bs) {
			open('http://localhost:3000');
		}
	} catch (e) {
		return exit(e);
	}
	serverCompiler.on('success', async (stat) => {
		logBuild(stat);
		await server.stop();
		await server.start();
		if (bs) {
			bs.reload();
		}
	});
}

function initBrowserSync(config) {
	const bs = browserSync.create();
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			console.log('browser-sync initialization timeout');
			reject();
		}, 5000);
		bs.init(config, e => {
			clearTimeout(timeout);
			e ? reject(e) : resolve(bs);
		});
	});
}

function waitForFileExists(filePath, opts) {
	return new Promise((resolve, reject) => {
		fs.access(filePath, fs.R_OK, (accessError) => {
			if (!accessError) return resolve();
			const dir = path.dirname(filePath);
			// maybe, file not exists. wait until creation
			// but, we don't want to hang
			let timeout;
			opts = Object.assign({
				timeout: false
			}, opts);
			if (opts.timeout) {
				timeout = setTimeout(() => {
					reject(new Error('Timeout'));
				}, opts.timeout);
			}
			const base = path.basename(filePath);
			const watcher = fs.watch(dir, (event, fileName) => {
				if (base === fileName) {
					clearTimeout(timeout);
					watcher.close();
					resolve();
				}
			});
		});
	});
}

function logBuild(stats) {
	console.log('color', stats.toString({
		colors: true,
		chunks: global.VERBOSE,
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
