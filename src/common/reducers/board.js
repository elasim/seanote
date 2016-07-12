import { handleActions } from 'redux-actions';
import { ActionTypes } from '../actions/board';

const initialState = {
	list: [],
	counts: 0,
};

export default handleActions({
	[ActionTypes.update]: updateList,
}, initialState);

function updateList(state, action) {
	return {
		...state,
		list: action.payload.items.map(item => {
			//item.updatedAt = new Date(item.updatedAt);
			return item;
		}),
		counts: action.payload.counts
	};
}
