import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from '../reducers';

export default function configureStore(initialState) {
	const middlewares = [thunk];
	if (process.env.BROWSER === true) {
		middlewares.push(logger());
	}
	return createStore(
		reducer,
		initialState,
		applyMiddleware(...middlewares)
	);
}
