import { handleActions } from 'redux-actions';
import cloneDeep from 'lodash/cloneDeep';
import { ActionTypes } from '../actions/list';

const RENUMBER_THRESHOLD = Number.EPSILON * 10E4;

const initialState = {};

export default handleActions({
	[ActionTypes.loadSuccess]: load,
	[ActionTypes.sort]: sort,
}, initialState);

function load(state, { payload }) {
	return {
		...state,
		[payload.id]: {
			lists: payload.items,
			dirty: [],
			renumbering: false,
		},
	};
}

function sort(state, { payload: { board, a, b } }) {
	if (!state[board]) {
		return;
	}
	const { dirty, lists } = state[board];
	const newLists = cloneDeep(lists);
	let renumbering = false;

	const indexA = newLists.findIndex(list => list.id === a);
	const indexB = lists.findIndex(list => list.id === b);
	const itemA = newLists[indexA];
	newLists.splice(indexA, 1);
	newLists.splice(indexB, 0, itemA);

	let prevPriority = (indexB - 1 >= 0)
		? newLists[indexB - 1].priority : 0;

	let nextPrioirty = (indexB + 1 < newLists.length)
		? newLists[indexB + 1].priority : newLists.length + 1;

	const newPriority = (nextPrioirty + prevPriority) / 2;
	
	if (!Number.isInteger(newPriority)) {
		const check = Math.abs(Math.round(newPriority) - newPriority);
		console.log(check);

		if (check <= RENUMBER_THRESHOLD) {
			renumbering = true;
			console.log('Renumbering');
		}
	}

	itemA.priority = newPriority;
	const newDirty = { ...dirty };
	if (!newDirty[a]) {
		newDirty[a] = {};
	}
	newDirty[a] = {
		...newDirty[a],
		priority: newPriority
	};

	return {
		...state,
		[board]: {
			lists: newLists,
			dirty: newDirty,
			renumbering,
		},
	};
}
