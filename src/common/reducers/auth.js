import { handleActions } from 'redux-actions';
import { ActionTypes } from '../actions/auth';

const DEFAULT_STATE = {
	token: null,
	error: null,
};

export default handleActions({
	[ActionTypes.responseToken]: setToken,
	[ActionTypes.tokenFailure]: setError,
}, DEFAULT_STATE);

function setToken(state, action) {
	return { ...state, token: action.payload };
}

function setError(state, action) {
	return {
		...state,
		error: action.payload,
	};
}
