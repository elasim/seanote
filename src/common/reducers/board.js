import { handleActions } from 'redux-actions';
import cloneDeep from 'lodash/cloneDeep';
import { ActionTypes } from '../actions/board';
import { mean, isNearlyZero } from './lib/sortable';

const RENUMBER_THRESHOLD = Number.EPSILON * 10E4;

const initialState = {
	list: [],
	dirty: {},
	counts: 0,
	renumbering: false,
	prev: 0,
	next: 0,
};

export default handleActions({
	[ActionTypes.sort]: sort,
	[ActionTypes.receiveServerData]: receiveServerData,
	[ActionTypes.updateSuccess]: updateSuccess,
}, initialState);

function sort(state, action) {
	const { prev, next } = state;
	const { a, b } = action.payload;

	const list = cloneDeep(state.list);
	const oldIndex = list.findIndex(item => item.id === a);
	const newIndex = state.list.findIndex(item => item.id === b);
	const item = list[oldIndex];

	list.splice(oldIndex, 1);
	list.splice(newIndex, 0, item);
	item.priority = mean(list, newIndex, prev, next);

	return {
		...state,
		list,
		dirty: {
			...state.dirty,
			[a]: {
				...state.dirty[a],
				priority: item.priority,
			}
		},
		renumbering: isNearlyZero(item.priority),
	};
}

function updateSuccess(state) {
	return {
		...state,
		dirty: {}
	};
}

function receiveServerData(state, { payload }) {
	const {
		data: {
			items,
			counts,
			prev,
			next,
		},
		renumbered
	} = payload;
	const newDirty = { ...state.dirty };

	const newItems = [];
	const have = Object.assign({}, ...state.list.map(item => ({
		[item.id]: item
	})));

	for (const item of items) {
		if (have[item.id]) {
			if (item.updatedAt >= have[item.id].updatedAt) {
				newItems.push(item);
				delete have[item.id];
				delete newDirty[item.id];
			} else {
				newItems.push(have[item.id]);
				delete have[item.id];
			}
		} else {
			newItems.push(item);
		}
	}
	Object.keys(have).forEach(id => {
		newItems.push(have[id]);
	});

	const sortedList = newItems.sort((lhs, rhs) => lhs.priority - rhs.priority);

	return {
		...state,
		list: sortedList,
		dirty: newDirty,
		counts: counts,
		prev: Math.min(state.prev, prev),
		next: Math.max(state.next, next),
		renumbering: renumbered ? false : state.renumbering,
	};
}
