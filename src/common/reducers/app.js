import { handleActions } from 'redux-actions';
import * as App from '../actions/app';

const initialState = {
	title: undefined,
	contextMenu: undefined,
	locale: 'en',
};

export default handleActions({
	[App.setTitle]: (state, action) => ({
		...state,
		title: action.payload
	}),
	[App.setContextMenu]: (state, action) => ({
		...state,
		contextMenu: action.payload,
	}),
	[App.setLocale]: (state, action) => ({
		...state,
		locale: action.payload
	}),
}, initialState);
