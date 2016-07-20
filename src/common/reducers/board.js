import { handleActions } from 'redux-actions';
import cloneDeep from 'lodash/cloneDeep';
import { ActionTypes } from '../actions/board';

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
	const { prev, next, dirty } = state;
	const { a, b } = action.payload;

	let renumbering = false;
	const list = cloneDeep(state.list);

	const indexA = list.findIndex(item => item.id === a);
	const indexB = state.list.findIndex(item => item.id === b);
	const itemA = list[indexA];
	list.splice(indexA, 1);
	list.splice(indexB, 0, itemA);

	let prevPriority = (indexB - 1 >= 0)
		? list[indexB - 1].priority : prev;

	let nextPrioirty = (indexB + 1 < list.length)
		? list[indexB + 1].priority : next;

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
		list,
		dirty: newDirty,
		renumbering
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
