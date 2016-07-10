import path from 'path';
import gulp from 'gulp';
import del from 'del';
import nodemon from 'gulp-nodemon';
import plumber from 'gulp-plumber';
import webpackModule from 'webpack';
import webpack from 'webpack-stream';

process.on('exit', code => {
	console.log(code, 'exit');
});

const buildConfigure = {
	dev: {
		client: {
			webpack: require('./config/dev/webpack.client'),
			output: './lib/dev/assets',
		},
		server: {
			webpack: require('./config/dev/webpack.server'),
			output: './lib/dev',
		},
	},
	prod: {
		client: {
			webpack: require('./config/prod/webpack.client'),
			output: './lib/prod/assets',
		},
		server: {
			webpack: require('./config/prod/webpack.server'),
			output: './lib/prod',
		},
	},
};

//
// BUild : Development
//---------------------------------------------------------
gulp.task('dev:client', () => {
	const cfg = buildConfigure.dev.client;
	return gulp.src('./src/client/index.js')
		.pipe(plumber())
		.pipe(webpack(cfg.webpack, webpackModule))
		.pipe(gulp.dest(cfg.output));
});
gulp.task('dev:server', () => {
	const cfg = buildConfigure.dev.server;
	return gulp.src('./src/server/index.js')
		.pipe(plumber())
		.pipe(webpack(cfg.webpack, webpackModule))
		.pipe(gulp.dest(cfg.output));
});
gulp.task('dev', ['dev:client', 'dev:server']);

//
// Build : Production
//---------------------------------------------------------
gulp.task('prod:client',() => {
	const cfg = buildConfigure.prod.client;
	return gulp.src('./src/client/index.js')
		.pipe(plumber())
		.pipe(webpack(cfg.webpack, webpackModule))
		.pipe(gulp.dest(cfg.output));
});
gulp.task('prod:server', () => {
	const cfg = buildConfigure.prod.server;
	return gulp.src('./src/server/index.js')
		.pipe(plumber())
		.pipe(webpack(cfg.webpack, webpackModule))
		.pipe(gulp.dest(cfg.output));
});
gulp.task('prod', ['prod:client', 'prod:server']);

//
// Clean
//---------------------------------------------------------
gulp.task('clean:dev', () => {
	const { client, server } = buildConfigure.dev;
	return del([
		path.join(client.output, './**/*'),
		path.join(server.output, './**/*'),
	]);
});
gulp.task('clean:prod', () => {
	const { client, server } = buildConfigure.prod;
	return del([
		path.join(client.output, './**/*'),
		path.join(server.output, './**/*'),
	]);
});
gulp.task('clean', ['clean:dev', 'clean:prod']);

//
// Run webpack-dev-server with BrowserSync
//---------------------------------------------------------
gulp.task('dev-server', ['clean:dev'], () => {
	const { client, server } = buildConfigure.dev;
	let daemon;
	let browserSync;

	return gulp.src('./src/server/index.js')
		.pipe(plumber())
		.pipe(webpack({
			...server.webpack,
			watch: true,
			noInfo: true,
		}, webpackModule, runBrowserSync))
		.pipe(gulp.dest(server.output));

	function runBrowserSync(e, stat) {
		if (e) return console.error(e);
		if (daemon) {
			daemon.emit('restart');
		}
		console.log(stat.toString());
		if (browserSync) return;

		const webpack = require('webpack');
		const clientConfigure = {
			...client.webpack,
			cache: true,
			entry: [
				'webpack-hot-middleware/client?path=__webpack-hmr&timeout=10000&overlay=true&reload=true',
				'./client/index.js'
			]
		};
		clientConfigure.plugins.splice(1, 0, (
			new webpack.HotModuleReplacementPlugin(),
		));
		const compiler = webpack(clientConfigure);

		browserSync = require('browser-sync').create();
		browserSync.init({
			proxy: {
				target: 'https://localhost:8443',
				ws: true,
				middleware: [
					require('webpack-dev-middleware')(compiler, {
						noInfo: true,
						publicPath: '/assets/'
					}),
					require('webpack-hot-middleware')(compiler, {
						path: '/__webpack-hmr',
						heartbeat: 10 * 1000
					})
				]
			},
			open: false,
		}, runDaemon);
	}
	function runDaemon(err) {
		if (err) return console.error(err);
		if (daemon) return;

		const { output, webpack: { output: { filename }} } = server;
		daemon = nodemon({
			script: path.join(output, filename),
			ignore: ['**/*'],
			delay: 500,
			verbose: true,
		});
	}
});
