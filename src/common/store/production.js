import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducers';

export default function configureStore(initialState) {
	return createStore(
		reducer,
		initialState,
		// applyMiddleware(
		// 	thunk()
		// )
	);
}
