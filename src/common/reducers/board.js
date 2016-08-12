import { handleActions } from 'redux-actions';
import update from 'react/lib/update';
import cloneDeep from 'lodash/cloneDeep';
import { ActionTypes as BoardActions } from '../actions/board';
import { ActionTypes as  PrefetchActions } from '../actions/prefetch';
import { mean, isNearlyZero } from './lib/sortable';

const debug = require('debug')('App.Reducer.Board');

const initialState = {
	list: [],
	dirty: {},
	counts: 0,
	renumbering: false,
	prev: 0,
	next: 0,
};

export default handleActions({
	[BoardActions.sort]: sort,
	[BoardActions.load]: load,
	[BoardActions.rename]: rename,
	[BoardActions.remove]: remove,
	[PrefetchActions.prefetch]: prefetch,
}, initialState);

function sort(state, action) {
	const { prev, next } = state;
	const { a, b } = action.payload;

	const list = cloneDeep(state.list);
	const oldIndex = list.findIndex(item => item.id === a);
	const newIndex = list.findIndex(item => item.id === b);
	const item = list[oldIndex];

	list.splice(oldIndex, 1);
	list.splice(newIndex, 0, item);
	item.priority = mean(list, newIndex, prev, next);

	const nextDirty = makeDirty(state, a, 'priority', item.priority);

	return {
		...state,
		list,
		dirty: nextDirty,
		renumbering: isNearlyZero(item.priority),
	};
}

function load(state, { payload }) {
	const {
		items,
		counts,
		prev,
		next,
	} = payload;
	const nextDirty = { ...state.dirty };

	const newItems = [];
	const have = Object.assign({}, ...state.list.map(item => ({
		[item.id]: item
	})));

	for (const item of items) {
		if (have[item.id]) {
			if (item.updatedAt >= have[item.id].updatedAt) {
				newItems.push(item);
				delete have[item.id];
				delete nextDirty[item.id];
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
		dirty: nextDirty,
		counts: counts,
		prev: Math.min(state.prev, prev),
		next: Math.max(state.next, next),
	};
}

function rename(state, { payload }) {
	const { id, name } = payload;
	const idx = state.list.findIndex(item => item.id === id);
	const nextValue = {
		...state.list[idx],
		name,
	};
	const nextDirty = makeDirty(state, id, 'name', name);
	return update(state, {
		list: {
			[idx]: { $set: nextValue }
		},
		dirty: { $set: nextDirty }
	});
}

function remove(state, { payload }) {
	const id = payload;
	const idx = state.list.findIndex(item => item.id === id);
	if (idx === -1) {
		return state;
	}
	const nextDirty = {
		...state.dirty,
		[id]: { deleted: true }
	};
	return update(state, {
		list: {
			$splice: [
				[idx, 1]
			]
		},
		dirty: { $set: nextDirty }
	});
}

function prefetch(state, { payload }) {
	return load(state, {
		payload: payload.board
	});
}

function makeDirty(state, id, prop, value) {
	return {
		...state.dirty,
		[id]: {
			...state.dirty[id],
			[prop]: value,
		}
	};
}
