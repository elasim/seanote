import 'normalize.css';
import 'core-js/fn/array/find-index';
import 'core-js/fn/array/fill';
import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import ko from 'react-intl/locale-data/ko';
import { configureStore } from './common/store';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import AsyncProps from 'async-props';
import routes from './common/routes';

addLocaleData([
	...en,
	...ko,
]);


const initialState = {
	app: {
		locale: navigator.languages ? navigator.languages[0] : 'en'
	}
};
if (window.__APP) {
	const { data, time } = window.__APP;
	delete window.__APP;
	// data is usable. it's not too old.
	if (time < Date.now() - (60 * 5)) {
		Object.assign(initialState, data);
	} else {
		console.log('Obsolte');
	}
}
const store = configureStore(initialState);
render(
	<Provider store={store}>
		<Router render={props => <AsyncProps {...props}/>}
			history={browserHistory} >
			{routes}
		</Router>
	</Provider>
	, document.getElementById('app')
);

/// @TODO FIX, HIDE ADDRESS-BAR ON MOBILE BROWSER

