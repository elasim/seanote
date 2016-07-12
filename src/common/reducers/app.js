import { handleActions } from 'redux-actions';
import { ActionTypes } from '../actions/app';

const DEFAULT_STATE = {
	title: undefined,
	headerVisibility: true,
	contextMenu: undefined,
	locale: 'en',
};

export default handleActions({
	[ActionTypes.setTitle]: setTitle,
	[ActionTypes.setHeaderVisibility]: setHeaderVisibility,
	[ActionTypes.setContextMenu]: setContextMenu,
	[ActionTypes.setLocale]: setLocale,
}, DEFAULT_STATE);

function setTitle(state, action) {
	return {
		...state,
		title: action.payload,
	};
}

function setHeaderVisibility(state, action) {
	return {
		...state,
		headerVisibility: action.payload
	};
}

function setContextMenu(state, action) {
	return {
		...state,
		contextMenu: action.payload,
	};
}

function setLocale(state, action) {
	return {
		...state,
		locale: action.payload,
	};
}
