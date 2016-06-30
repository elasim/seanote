import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './app';
import Home from './home';
import About from './about';
import SignIn from './signin';
import Board from './board';
import BoardDashboard from './board-dashboard';
import BoardDetail from './board-detail';
import NotFound from './not-found';

export default (props) => {
	return (
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path="about" component={About} />
			<Route path="signin" component={SignIn} />
			<Route path="board" component={Board} >
				<IndexRoute component={BoardDashboard} />
				<Route path=":id" component={BoardDetail} />
			</Route>
			<Route path="*" component={NotFound} />
		</Route>
	);
};
		// <Route path="board" component={BoardList} onEnter={fetchBoardList}/>
		// <Route path="board/:id" component={Board} onEnter={fetchBoardList}/>
