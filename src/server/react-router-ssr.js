import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '../common/store';
import configureRoutes from '../common/routes';
import assets from './assets';

// imports required assets to render
require('../views/index.html');
require('../views/error.html');

const routes = configureRoutes({
	fetchBoardList,
	fetchBoardData,
});

export default (req, res) => {
	match({ routes, location: req.originalUrl }, (e, redirect, props) => {
		if (e) {
			res.status(500).render('error', { error: e.message });
		} else if (redirect) {
			res.redirect(302, redirect.pathname + redirect.search);
		} else if (props) {
			renderReact(req, res, props);
		} else {
			res.status(404).render('error', {
				error: 'Not found'
			});
		}
	});
};

function fetchBoardList(nextState, replace, next) {
	console.warn('fetchBoardList not implemented');
	next();
}

function fetchBoardData(nextState, replace, next) {
	console.warn('fetchBoardData not implemented');
	next();
}

function renderReact(req, res, props) {
	let locale = undefined;
	if (req.headers['accept-language']) {
		locale = req.headers['accept-language'].match(/^[^,;]+/)[0];
	}
	const store = configureStore({
		app: { locale }
	});
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
		initialState: JSON.stringify({
			data: store.getState(),
			time: Date.now(),
		}),
	});
}