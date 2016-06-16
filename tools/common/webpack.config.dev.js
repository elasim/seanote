import path from 'path';
import webpack from 'webpack';

const contextDir = path.resolve(process.cwd(), './src');
const outputPath = path.resolve(process.cwd(), './transpiled/development');
const base = {
	context: contextDir,
	resolve: {
		root: contextDir,
		extensions: ['', '.js', '.jsx', '.json']
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'react-hot!babel'
			}
		]
	}
};
const server = {
	output: {
		path: outputPath,
		filename: 'server.js',
		libraryTarget: 'commonjs2',
	},
	externals: [
		/^\.\/assets$/,
		function filter(context, request, cb) {
			const isExternal =
				request.match(/^[@a-z][a-z\/\.\-0-9]*$/i) &&
				!request.match(/^react-router/) &&
				!context.match(/[\\/]react-router/);
			cb(null, Boolean(isExternal));
		},
	],
	target: 'node',
	node: {
		__dirname: true
	},
	entry: path.join(contextDir, './server.js')
};
const client = {
	entry: [
		'./client.js'
	],
	output: {
		path: outputPath,
		publicPath: '/assets/',
		filename: 'bundle.js'
	},
	target: 'web',
	cache: true,
	debug: true,
	devtool: 'eval-source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env.BROWSER': true
		}),
		new webpack.optimize.OccurenceOrderPlugin(true),
		new webpack.NoErrorsPlugin()
	]
};

export default {
	server: Object.assign({}, base, server),
	client: Object.assign({}, base, client),
	live: {
		host: '0.0.0.0',
		port: 8000
	}
};
