export default {
	debug: {
		hmrPath: '__webpack_hmr'
	},
	build: {
		sources: './src',
		'output.development': './build/development',
		'output.production': './build/production'
	},
	client: {
		main: [
			'./client.js'
		],
		output: 'bundle.js',
		assets: 'assets.json'
	},
	server: {
		main: './server.js',
		output: 'server.js'
	}
};
