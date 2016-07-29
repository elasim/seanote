import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import emptyFunction from 'fbjs/lib/emptyFunction';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import appMuiTheme from '../common/themes/mui';

import { configureStore } from '../common/store';
import { configureRoutes } from '../common/routes';
import { configureLocale } from './intl';

const defaultState = {
	app: {
		headerVisibility: true,
		locale: navigator.languages ? navigator.languages[0] : 'en',
		token: null,
	},
};

function configure(state) {
	injectTapEventPlugin();
	configureLocale();
	const store = configureStore(state);
	const routes = configureRoutes(store);
	return { store, routes };
}

window.bootstrap = (serverSentState = {}) => {
	const initialState = getInitialState(serverSentState);

	// DEBUG ONLY
	const Users = require('../common/data/users').default;
	const execute = require('../common/data/execute').default;

	execute(Users.getToken())
		.then(user => {
			initialState.app.token = user.token;
		}, e => {
			console.error(e);
		})
		.then(() => {
			const { store, routes } = configure(initialState);
			const muiTheme = getMuiTheme(appMuiTheme);
			render(
				<Provider store={store}>
					<MuiThemeProvider muiTheme={muiTheme}>
						<Router routes={routes} history={browserHistory} />
					</MuiThemeProvider>
				</Provider>,
				document.getElementById('app')
			);
		});
	delete window.bootstrap;
};

function getInitialState(serverSentState = {}) {
	const { data, time } = serverSentState;
	if (data && time && time + (60 * 1000) >= Date.now()) {
		return { ...defaultState, ...data };
	} else {
		return { ...defaultState };
	}
}
