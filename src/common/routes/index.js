import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './app';
import Home from './home';
import About from './about';
import SignIn from './signin';

import Board from './board';
import Boards from './boards';

import NotFound from './not-found';

export default (
	<Route path="/" component={App}>
		<IndexRoute component={Home} />
		<Route path="about" component={About} />
		<Route path="signin" component={SignIn} />
		<Route path="board" component={Boards} />
		<Route path="board/:id" component={Board} />
		<Route path="*" component={NotFound} />
	</Route>
);
