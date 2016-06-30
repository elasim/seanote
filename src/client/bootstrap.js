import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import { Provider } from 'react-redux';
import { match, Router, browserHistory as history } from 'react-router';

import { configureStore } from '../common/store';
import configureRoutes from '../common/routes';

addLocaleData([
	...require('react-intl/locale-data/en'),
	...require('react-intl/locale-data/ko'),
]);
const store = configureStore(getInitialState());
const routes = configureRoutes({
	fetchBoardData,
	fetchBoardList,
});

match({ history, routes }, (error, redirect, renderProps) => {
	const container = (
		<Provider store={store}>
			<Router {...renderProps} />
		</Provider>
	);
	render(container, document.getElementById('app'));
});
/// @TODO FIX, HIDE ADDRESS-BAR ON MOBILE BROWSER

function fetchBoardList(nextState, replace, next) {
	next();
}

function fetchBoardData(nextState, replace, next) {
	next();
}

function getInitialState() {
	const initialState = {
		app: { locale: navigator.languages ? navigator.languages[0] : 'en' }
	};
	if (window.__APP) {
		const { data, time } = window.__APP;
		delete window.__APP;
		// data is usable. it's not too old.
		if (time < Date.now() - (60 * 5)) {
			Object.assign(initialState, data);
		}
	}
	return initialState;
}
