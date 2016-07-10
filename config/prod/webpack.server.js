import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import path from 'path';

module.exports = {
	context: path.join(__dirname, '../../src'),
	target: 'node',
	resolve: {
		root: path.join(__dirname, '../../src'),
		extensions: ['', '.js', '.jsx', '.json'],
	},
	output: {
		filename: 'server.js',
		libraryTarget: 'commonjs2',
	},
	externals: [
		nodeExternals(),
	],
	devtool: 'source-map',
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
				test: /\.(html|png|jpeg|gif|jpg|pem|pub|key|crt)$/,
				loader: 'file?name=[path][name].[ext]'
			},
			{
				test: /\.css$/,
				loaders: [
					'css-loader/locals?modules&localIdentName=[name]__[local]__[hash:base64:5]',
					'postcss',
				],
				exclude: /(node_modules|bower_components)/,
			},
			{
				test: /\.scss$/,
				loaders: [
					'css-loader/locals?modules&localIdentName=[name]__[local]__[hash:base64:5]',
					'postcss',
					'sass',
				],
				exclude: /(node_modules|bower_components)/,
			},
			{
				test: /(normalize)\.css$/,
				loader: 'css-loader/locals',
			},
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.BROWSER': false,
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		new webpack.optimize.OccurenceOrderPlugin(true),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				screw_ie8: true,
				warnings: global.VERBOSE,
			},
		}),
		// new webpack.NoErrorsPlugin()
	],
	// node: {
	// 	console: false,
	// 	global: false,
	// 	process: false,
	// 	Buffer: false,
	// 	__filename: false,
	// 	__dirname: false,
	// },
};
