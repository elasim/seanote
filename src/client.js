import 'normalize.css';
import 'core-js/fn/array/find-index';
import 'core-js/fn/array/fill';

import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import es from 'react-intl/locale-data/es';
import ko from 'react-intl/locale-data/ko';
addLocaleData([...en, ...fr, ...es, ...ko]);

import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import AppContext from './context';
import routes from './common/routes';
import { configureStore } from './common/store';

import LocaleSelector from './common/components/locale-selector';

const store = configureStore({
	locale: navigator.language || 'en'
});

const context = {
	getTitle() {
		return document.title;
	},
	setTitle(value) {
		document.title = value;
	}
};

render(
	<Provider store={store}>
		<LocaleSelector>
			<AppContext context={context}>
				<Router history={browserHistory}>
					{routes}
				</Router>
			</AppContext>
		</LocaleSelector>
	</Provider>
	, document.getElementById('app')
);

/// @TODO FIX, HIDE ADDRESS-BAR ON MOBILE BROWSER

