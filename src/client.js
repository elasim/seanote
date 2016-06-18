import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './common/routes';

render(
	(
		<Router history={browserHistory}>
			{routes}
		</Router>
	),
	document.getElementById('app')
);
