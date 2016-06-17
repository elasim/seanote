import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
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
				exclude: /(node_modules|bower_components)/,
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
		]
	}
};

const client = Object.assign({}, common, {
	entry: [].concat(setup.client.main),
	output: {
		publicPath: '/assets/',
		path: OUTPUT_DIR + '/assets/',
		filename: setup.client.output
	},
	target: 'web',
	cache: true,
	debug: true,
	devtool: 'cheap-module-eval-source-map',
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

const server = Object.assign({}, common, {
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

export default {
	server,
	client,
	setup
};
