import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';

import { engine } from './lib/simple-template';
import routes from './routes';
import assets from './assets';
import config from './config';

import './html/index.html';
import './html/error.html';

const app = express();

app.engine('html', engine);
app.set('views', path.join(__dirname, './html'));
app.set('view engine', 'html');

app.get(assets.main.js, (req, res) => {
	res.sendFile(path.join(__dirname, assets.main.js));
});
app.get('*', (req, res) => {
	match({ routes, location: req.originalUrl }, (e, redirect, props) => {
		if (e) {
			res.status(500).render('error', { error: e.message });
		} else if (redirect) {
			res.redirect(302, redirect.pathname + redirect.search);
		} else if (props) {
			res.status(200).render('index', {
				title: 'App',
				body: renderToString(<RouterContext {...props} />),
				bundle: assets.main.js
			});
		} else {
			res.status(404).render('error', {
				error: 'Not found'
			});
		}
	});
	// res.sendFile(path.join(__dirname, index));
});

const http = app.listen(config.port, config.host, e => {
	if (e) {
		console.error('Binding error', e);
		return;
	}
	const addr = http.address();
	console.log('Server Listening on '+addr.address+':'+addr.port);
});
