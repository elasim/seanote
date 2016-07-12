import { handleActions } from 'redux-actions';
import { ActionTypes } from '../actions/app';

const DEFAULT_STATE = {
	title: undefined,
	headerVisibility: true,
	dim: null,
	locale: 'en',
};

export default handleActions({
	[ActionTypes.setTitle]: setTitle,
	[ActionTypes.setHeaderVisibility]: setHeaderVisibility,
	[ActionTypes.setDim]: setDim,
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

function setDim(state, action) {
	return {
		...state,
		dim: action.payload,
	};
}

function setLocale(state, action) {
	return {
		...state,
		locale: action.payload,
	};
}
