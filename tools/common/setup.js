import path from 'path';
import _ from 'lodash';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';


const options = commandLineArgs([
	{
		name: 'verbose',
		alias: 'v',
		type: Boolean,
		defaultValue: false
	},
	{
		name: 'mode',
		type: String,
		defaultOption: true
	},
]);

global.VERBOSE = options.verbose;
global.DEBUG = process.env.NODE_ENV !== 'production';
switch (options.mode) {
	case 'development':
		global.config = require('./webpack.config.dev').default;
		global.mode = options.mode;
		break;
	case 'production':
		global.config = require('./webpack.config.prod').default;
		global.mode = options.mode;
		break;
	default:
		usage();
		process.exit(0);
		break;
}

global.config.user = require(
	path.join(process.cwd(), './src/config.json')
);

function usage() {
	console.log(commandLineUsage([
		{
			header: 'Usage',
			content: '$ npm run <command> --[vary]{ }[-v|--verbose]'
		},
		{
			header: 'Command List',
			content: [
				{
					name: 'start',
					summary: 'shorthand for \'npm run server development\''
				},
				{
					name: 'server <configure>',
					summary: 'Run server'
				},
				{
					name: 'build <configure>',
					summary: 'Build server and client'
				},
				{
					name: '',
					summary: '(configure affects only the result of webpack)'
				},
				{
					name: 'build-tools',
					summary: 'Transpile tool scripts to use without babel'
				}
			]
		},
		{
			header: 'Configure List',
			content: [
				'development',
				'production',
			]
		},
		{
			header: 'When you run with [vary]{NODE_ENV=production}',
			content: [
				'* Browser-Sync and HMR will not work with server command',
				'* Webpack will generate hash filename for assets on production'
			]
		}

	]));
}