import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from '../containers/app';
import Landing from '../containers/landing';

import Home from './home';
import About from './about';
import SignIn from './signin';
import Dashboard from './dashboard';
import Boards from './boards';
import Groups from './groups';
import Messages from './messages';
import Notifications from './notifications';
import Setting from './setting';
import NotFound from './not-found';

// Configure Routes
export function configureRoutes(store, initalState) {
	return (
		<Route path="/" getComponent={getContainer}>
			<IndexRoute getComponent={getIndexComponent} />
			<Route path="about" component={About} />
			<Route path="signin" component={SignIn} onEnter={redirectToDashboard} />
			<Route path="setting" component={Setting} onEnter={redirectToSignIn} />
			<Route path="boards" component={Boards} onEnter={redirectToSignIn} >
				<Route path=":id" onEnter={redirectToSignIn} />
			</Route>
			<Route path="groups" component={Groups} onEnter={redirectToSignIn} >
				<Route path=":id" onEnter={redirectToSignIn} />
			</Route>
			<Route path="messages" component={Messages} onEnter={redirectToSignIn} >
				<Route path=":id" onEnter={redirectToSignIn} />
			</Route>
			<Route path="notifications" component={Notifications} onEnter={redirectToSignIn} />
			<Route path="*" component={NotFound} />
		</Route>
	);
	function getContainer(params, cb) {
		const state = initalState || store.getState();
		cb(null, state.auth.token ? App : Landing);
	}
	function getIndexComponent(params, cb) {
		const state = initalState || store.getState();
		cb(null, state.auth.token ? Dashboard : Home);
	}
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
