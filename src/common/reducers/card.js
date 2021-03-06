import { handleActions } from 'redux-actions';
import immutableUpdate from 'react/lib/update';
import { ActionTypes as List } from '../actions/list';
import { ActionTypes as Card } from '../actions/card';
import { sort, copy, move, isNearlyZero } from './lib/sortable';

/*
Card = {
	id,
	ListId,
	priority,
	updatedAt,
	createdAt,
	value: { ... }
};
state = {
	[LIST_ID]: {
		items: Card[],
		renumbering: Boolean
	},
	dirty: {},
}
*/
const initialState = {
	dirty: {},
};

export default handleActions({
	[List.load]: loadList,
	[Card.load]: loadCard,
	[Card.sort]: (state, action) => sort(state, action),
	[Card.move]: (state, action) => move(state, action, 'ListId'),
	[Card.copy]: (state, action) => copy(state, action, 'ListId'),
	[Card.update]: (state, action) => update(state, action),
}, initialState);

function update(state, { payload }) {
	const { source, id, nextValue } = payload;
	const idx = state[source].items.findIndex(item => item.id === id);

	const nextDirty = {
		...state.dirty,
		[id]: {
			...state.dirty[id],
			value: nextValue,
		},
	};

	return immutableUpdate(state, {
		[source]: {
			items: {
				[idx]: {
					value: {
						$set: nextValue
					}
				}
			},
		},
		dirty: {
			$set: nextDirty
		}
	});
}

function loadList(state, { payload }) {
	const dirty = { ...state.dirty };
	const lists = {};
	payload.items.forEach(list => {
		let renumbering = false;
		const items = list.Cards.map(card => {
			if (!renumbering) {
				renumbering = isNearlyZero(card.priority);
			}
			return {
				...card,
				ListId: list.id
			};
		});
		lists[list.id] = {
			items,
			renumbering,
		};
	});

	return {
		...state,
		...lists,
		dirty,
	};
}

function loadCard(state, { payload }) {
	return state;
}
