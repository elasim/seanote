import cloneDeep from 'lodash/cloneDeep';

const POINT_THRESHOLD = Number.EPSILON * 10E4;

export function isNearlyZero(value) {
	if (!Number.isInteger(value)) {
		const check = Math.abs(Math.round(value) - value);
		return check <= POINT_THRESHOLD;
	}
	return false;
}

export function mean(list, mid, head, tail) {
	const a = mid - 1 >= 0 ? list[mid - 1].priority : head;
	const b = mid + 1 < list.length ? list[mid + 1].priority : tail;
	return (a + b) / 2;
}

export function sort(state, { payload: { source, a, b } }) {
	if (!state[source]) {
		return state;
	}
	const items = cloneDeep(state[source].items);
	const dirty = { ...state.dirty };

	const oldIndex = items.findIndex(item => item.id === a);
	const newIndex = items.findIndex(item => item.id === b);
	const item = items[oldIndex];
	items.splice(oldIndex, 1);
	items.splice(newIndex, 0, item);

	item.priority = mean(items, newIndex, 0, items.length + 1);

	dirty[a] = {
		...dirty[a],
		priority: item.priority,
	};

	return {
		...state,
		dirty,
		[source]: {
			...state[source],
			items: items,
			renumbering: isNearlyZero(item.priority),
		},
	};
}

export function copy(state, { payload }, refName) {
	const { source, id, target, tempId } = payload;

	// don't allow copy from self
	if (source === target) return state;

	const idx = state[source].items.findIndex(item => item.id === id);
	const item = cloneDeep(state[source].items[idx]);

	item.id = tempId;
	item.updatedAt = new Date();
	item.priority = state[target].items.length + 1;
	item[refName] = target;

	const items = [...state[target].items];
	items.push(item);

	const dirty = { ...state.dirty };
	dirty[tempId] = {
		...item,
		created: true
	};

	return {
		...state,
		dirty,
		[target]: {
			...state[target],
			items,
		}
	};
}

export function move(state, { payload }, refName) {
	const { source, id, target } = payload;
	if (source === target) return state;

	const idx = state[source].items.findIndex(item => item.id === id);
	const item = cloneDeep(state[source].items[idx]);
	item.ListId = target;

	const sourceItems = [...state[source].items];
	const targetItems = [...state[target].items];
	const dirty = { ...state.dirty };

	sourceItems.splice(idx, 1);
	targetItems.push(item);
	dirty[id] = {
		...dirty[id],
		[refName]: target,
	};

	return {
		...state,
		[source]: {
			...state[source],
			items: sourceItems,
		},
		[target]: {
			...state[target],
			items: targetItems,
		},
		dirty: dirty,
	};
}