import 'normalize.css';
import 'core-js/fn/array/find-index';
import 'core-js/fn/array/fill';
import './hotfix.css';

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

import routes from './common/routes';
import { configureStore } from './common/store';

import LocaleSelector from './common/components/locale-selector';

const store = configureStore({
	locale: navigator.language || 'en'
});

render(
	<Provider store={store}>
		<LocaleSelector>
			<Router history={browserHistory}>
				{routes}
			</Router>
		</LocaleSelector>
	</Provider>
	, document.getElementById('app')
);

/// @TODO FIX, HIDE ADDRESS-BAR ON MOBILE BROWSER

