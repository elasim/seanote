import https from 'https';
import http from 'http';
import path from 'path';
import fs from 'fs';
import express from 'express';
import helmet from 'helmet';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';

import { engine } from './server/lib/simple-template';

import assets from './assets';
import config from './config';

// Copy required assets
require('./views/index.html');
require('./views/error.html');

const app = express();

/// @TODO FIX IT LATER for more specific rules
app.use(helmet());
app.engine('html', engine);
app.set('view engine', 'html');

app.get(assets.main.js, (req, res) => {
	res.sendFile(path.join(__dirname, assets.main.js));
});
app.use('/api', require('./server/routes/api').default);

if (0) {
	const routes = require('./common/routes').default;
	const { Provider } = require('react-redux');
	const { configureStore } = require('./common/store');

	app.get('*', (req, res) => {
		let locale = undefined;
		if (req.headers['accept-language']) {
			locale = req.headers['accept-language'].match(/^[^,;]+/)[0];
		}
		match({ routes, location: req.originalUrl }, (e, redirect, props) => {
			if (e) {
				res.status(500).render('error', { error: e.message });
			} else if (redirect) {
				res.redirect(302, redirect.pathname + redirect.search);
			} else if (props) {
				const store = configureStore({
					locale
				});
				// it must be called to get app state
				const body = renderToString(
					<Provider store={store}>
						<RouterContext {...props} />
					</Provider>
				);
				const state = store.getState();
				res.status(200).render('index', {
					title: state.app.title,
					body,
					bundle: assets.main.js,
					initialState: {
						data: JSON.stringify(store),
						time: Date.now(),
					},
				});
			} else {
				res.status(404).render('error', {
					error: 'Not found'
				});
			}
		});
	});
} else {
	const debugView = require('./views/without-template.html');
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, debugView));
	});
}

const tlsServer = https.createServer({
	key: fs.readFileSync(path.join(process.cwd(), './test.key')),
	cert: fs.readFileSync(path.join(process.cwd(), './test.crt')),
}, app);
const plainServer = http.createServer(app);

plainServer.listen(config.port, config.host, e => {
	if (e) {
		console.error('Binding error', e);
		return;
	}
	const addr = plainServer.address();
	console.log('HTTP Listening on '+addr.address+':'+addr.port);
});

tlsServer.listen(8443, e=> {
	if (e) {
		console.eror('Binding error for TLS Server', e);
		return;
	}
	const addr = tlsServer.address();
	console.log('HTTPS Listening on '+addr.address+':'+addr.port);
});
