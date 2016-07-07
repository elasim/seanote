import path from 'path';
import _ from 'lodash';
import webpack from 'webpack';

import AssetsPlugin from 'assets-webpack-plugin';

import precss from 'precss';
import autoprefixer from 'autoprefixer';

import setup from '../config.build';

const CWD = process.cwd();
const SOURCE_DIR = path.join(CWD, setup.build.sources);
const OUTPUT_DIR = path.join(CWD, setup.build['output.development']);

setup.runtime = {
	sourceDir: SOURCE_DIR,
	outputDir: OUTPUT_DIR,
	assetsPath: path.join(
		setup.build['output.development'],
		setup.client.assets
	)
};

const common = {
	context: SOURCE_DIR,
	resolve: {
		root: SOURCE_DIR,
		extensions: ['', '.js', '.jsx', '.json'],
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components|thirds|react-router)/,
				loader: 'babel'
			},
			{
				test: /\.json$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'json'
			},
			{
				test: /\.(html|png|jpeg|gif|jpg)$/,
				loader: 'file?name=[path][name].[ext]'
			},
			{
				test: /\.css$/,
				loaders: [
					'css?modules&localIdentName=[name]__[local]__[hash:base64:5]',
					'postcss',
				],
				exclude: /(node_modules|bower_components|thirds|global\.css)/,
			},
			{
				test: /\.scss$/,
				loaders: [
					'css?modules&localIdentName=[name]__[local]__[hash:base64:5]',
					'postcss',
					'sass',
				],
				exclude: /(node_modules|bower_components)/,
			},
			{
				test: /(global|material\.custom|normalize)\.css$/,
				loader: 'css',
			},
			{
				test:/\.(wav)$/,
				loader: 'url?limit=200',
			}
		]
	}
};

const client = Object.assign(_.cloneDeep(common), {
	entry: [].concat(setup.client.main),
	output: {
		publicPath: '/assets/',
		path: OUTPUT_DIR + '/assets/',
		filename: setup.client.output
	},
	target: 'web',
	cache: true,
	debug: true,
	devtool: '#eval-source-map',
	// devtool: 'cheap-module-eval-source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env.BROWSER': true,
			'process.env.NODE_ENV': JSON.stringify('development')
		}),
		new webpack.optimize.OccurenceOrderPlugin(true),
		new webpack.NoErrorsPlugin(),
		new AssetsPlugin({
			filename: setup.runtime.assetsPath,
			prettyPrint: true,
		}),
		new webpack.NoErrorsPlugin()
	]
});
// inject style-loader for client compiler
client.postcss = function () {
	return {
		plugins: [
			autoprefixer({
				browsers: [
					'> 5%',
					'last 2 versions',
					'ie >= 8'
				]
			}),
			precss(),
		],
		syntax: require('postcss-scss')
	};
};

const server = Object.assign(_.cloneDeep(common), {
	entry: setup.server.main,
	output: {
		filename: setup.server.output,
		path: OUTPUT_DIR,
		libraryTarget: 'commonjs2',
	},
	externals: [
		/^\.\/assets$/,
		/^[@a-z][a-z\/\.\-0-9]*$/i
	],
	devtool: 'source-map',
	debug: true,
	target: 'node',
	plugins: [
		new webpack.DefinePlugin({ 'process.env.BROWSER': false }),
		new webpack.NoErrorsPlugin()
	],
	node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
	}
});

// inject style-loader for browser
client.module.loaders
	.filter(cfg => {
		let loader = cfg.loaders ? cfg.loaders.join('!') : cfg.loader;
		return loader.indexOf('css') !== -1;
	})
	.forEach(cfg => {
		if (cfg.loaders) {
			cfg.loaders.splice(0, 0, 'style');
		} else {
			cfg.loader = 'style!' + cfg.loader;
		}
	});

const cssLoaderReplacer = /^css(?:-loader)?|!css(?:-loader)?/;
server.module.loaders
	.filter(cfg => {
		let loader = cfg.loaders ? cfg.loaders.join('!') : cfg.loader;
		return loader.indexOf('css') !== -1;
	})
	.forEach(cfg => {
		if (cfg.loaders) {
			cfg.loaders = cfg.loaders.map(loader => {
				if (loader.indexOf('css') !== -1) {
					return loader.replace(cssLoaderReplacer, 'css-loader/locals');
				} else {
					return loader;
				}
			});
		} else {
			cfg.loader = cfg.loader.replace(cssLoaderReplacer, 'css-loader/locals');
		}
	});

export default {
	server,
	client,
	setup
};
