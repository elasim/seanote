import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import { Provider } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { configureStore } from '../common/store';
import { configureRoutes } from '../common/routes';
import assets from './assets';

// imports required assets to render
require('../views/index.html');
require('../views/error.html');

export default (req, res) => {
	const routes = configureRoutes(null, {
		auth: {
			token: !!req.user
		}
	});
	match({ routes, location: req.originalUrl }, (e, redirect, renderProps) => {
		if (e) {
			res.status(500).render('error', { error: e.message });
		} else if (redirect) {
			res.redirect(302, redirect.pathname + redirect.search);
		} else if (renderProps) {
			render(req, res, renderProps);
		} else {
			res.status(404).render('error', {
				error: 'Not found'
			});
		}
	});
};

function render(req, res, renderProps) {
	let locale = undefined;
	if (req.headers['accept-language']) {
		locale = req.headers['accept-language'].match(/^[^,;]+/)[0];
	}
	const store = configureStore({
		app: { locale },
		auth: { token: req.user ? req.session.passport.user.token : null },
	});

	const dispatching = findPreDispatches(renderProps.components)
		.map(preDispatch => preDispatch(store.dispatch));
	
	if (dispatching.length > 0) {
		Promise.all(dispatching)
			.then(finishRender)
			.catch(errorRender);
	} else {
		finishRender();
	}

	function finishRender() {
		const MUI_THEME = getMuiTheme({
			userAgent: req.headers['user-agent'],
		});
		const body = renderToString(
			<Provider store={store}>
				<MuiThemeProvider muiTheme={MUI_THEME}>
					<RouterContext {...renderProps} />
				</MuiThemeProvider>
			</Provider>
		);
		const state = store.getState();
		res.status(200).render('index', {
			title: state.app.title,
			body,
			bundle: assets.main.js,
			initialState: JSON.stringify({
				data: state,
				time: Date.now(),
			}),
		});
	}

	function errorRender(e) {
		res.status(500).render('error', {
			error: e.message,
			detail: process.env.NODE_ENV !== 'production' ? e.stack : null
		});
	}
}

function findPreDispatches(components) {
	const flatten = [].concat(components);
	const preDispatches = [];

	while (flatten.length > 0) {
		const current = flatten.shift();
		if (typeof current === 'function') {
			if (current.preDispatch) {
				preDispatches.push(current.preDispatch);
			}
			const more = Object.getOwnPropertyNames(current)
				.map(prop => current[prop])
				.filter(child => typeof child === 'function');
			if (more.length > 0) {
				flatten.unshift(...more);
			}
		}
	}
	return preDispatches;
}
