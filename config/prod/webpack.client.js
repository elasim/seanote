var webpack = require('webpack');
var path = require('path');

module.exports = {
	context: path.join(__dirname, '../../src'),
	target: 'web',
	resolve: {
		root: path.join(__dirname, '../../src'),
		extensions: ['', '.js', '.jsx', '.json'],
	},
	output: {
		filename: 'client.js',
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
			{
				test: /\.css$/,
				loaders: [
					'style',
					'css?modules&localIdentName=[name]__[local]__[hash:base64:5]',
					'postcss',
				],
				exclude: /(node_modules|bower_components)/,
			},
			{
				test: /\.scss$/,
				loaders: [
					'style',
					'css?modules&localIdentName=[name]__[local]__[hash:base64:5]',
					'postcss',
					'sass',
				],
				exclude: /(node_modules|bower_components)/,
			},
			{
				test: /(normalize)\.css$/,
				loader: 'style!css',
			},
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.BROWSER': true,
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
	postcss: {
		plugins: [
			require('autoprefixer')({
				browsers: [
					'> 5%',
					'last 2 versions',
					'ie >= 8'
				]
			}),
			require('precss')(),
		],
		syntax: require('postcss-scss')
	}
};
