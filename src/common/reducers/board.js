import Rx from 'rx';
import { handleActions } from 'redux-actions';
import update from 'react/lib/update';
import { ActionTypes } from '../actions/board';

const initialState = {
	list: [],
	counts: 0,
	diff: [],
};

export default handleActions({
	[ActionTypes.sort]: sort,
	[ActionTypes.receiveServerData]: receiveServerData,
}, initialState);

function sort(state, action) {
	const { a, b } = action.payload;

	const list = [...state.list];
	const diff = [...state.diff];

	const indexA = list.findIndex(equalWith('id', a));
	const itemA = list[indexA];
	list.splice(indexA, 1);
	const indexB = state.list.findIndex(equalWith('id', b));
	list.splice(indexB, 0, itemA);

	diff.push(
		{ $splice: [indexA, 1] },
		{ $splice: [indexB, 0, itemA] },
	);

	return {
		...state,
		list,
		diff,
	};
}

function receiveServerData(state, action) {
	return {
		...state,
		list: action.payload.items,
		counts: action.payload.counts
	};
}

function equalWith(key, value) {
	return item => item[key] === value;
}
