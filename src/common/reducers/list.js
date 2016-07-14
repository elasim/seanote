import { handleActions } from 'redux-actions';
import { ActionTypes } from '../actions/list';

const initialState = {};

export default handleActions({
	[ActionTypes.loadSuccess]: load,
}, initialState);

function load(state, { payload }) {
	return {
		...state,
		[payload.id]: payload
	};
}
