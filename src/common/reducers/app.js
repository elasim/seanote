import { handleActions } from 'redux-actions';
import { ActionTypes } from '../actions/app';

const DEFAULT_STATE = {
	title: undefined,
	headerVisibility: true,
	dim: null,
	locale: 'en',
	token: null,
};

export default handleActions({
	[ActionTypes.setTitle]: setTitle,
	[ActionTypes.setHeaderVisibility]: setHeaderVisibility,
	[ActionTypes.setDim]: setDim,
	[ActionTypes.setLocale]: setLocale,
	[ActionTypes.getToken]: getToken,
}, DEFAULT_STATE);

function setTitle(state, { payload }) {
	return {
		...state,
		title: payload,
	};
}

function setHeaderVisibility(state, { payload }) {
	return {
		...state,
		headerVisibility: payload
	};
}

function setDim(state, { payload }) {
	return {
		...state,
		dim: payload,
	};
}

function setLocale(state, { payload }) {
	return {
		...state,
		locale: payload,
	};
}

function getToken(state, { payload }) {
	return {
		...state,
		token: payload
	};
}
