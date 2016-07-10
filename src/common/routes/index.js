import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from '../containers/app';
import Landing from '../containers/landing';

import Home from './home';
import About from './about';
import SignIn from './signin';
import Dashboard from './dashboard';
import Boards from './boards';
import BoardView from './board-view';
import Setting from './setting';
import NotFound from './not-found';

// Configure Routes
export function configureRoutes(store, initalState) {
	return (
		<Route path="/" getComponent={(params, cb) => {
			const state = initalState || store.getState();
			cb(null, state.auth.token ? App : Landing);
		}}>
			<IndexRoute getComponent={(params, cb) => {
				const state = initalState || store.getState();
				cb(null, state.auth.token ? Dashboard : Home);
			}} />
			<Route path="about" component={About} />
			<Route path="signin" component={SignIn} onEnter={redirectToDashboard} />
			<Route path="setting" component={Setting} onEnter={redirectToSignIn} />
			<Route path="boards" component={Boards} onEnter={redirectToSignIn} >
				<Route path=":id" component={BoardView} onEnter={redirectToSignIn} />
			</Route>
			<Route path="*" component={NotFound} />
		</Route>
	);
//		<Route path="/pages/:id" component={Board} onEnter={redirectToSignIn} />
	function redirectToDashboard(params, replace) {
		const state = initalState || store.getState();
		if (state.auth.token) {
			return replace('/');
		}
	}
	function redirectToSignIn(params, replace) {
		const state = initalState || store.getState();
		if (!state.auth.token) {
			replace('/signin');
		}
	}
}
