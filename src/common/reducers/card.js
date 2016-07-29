import { handleActions } from 'redux-actions';
import { ActionTypes as List } from '../actions/list';
import { ActionTypes as Card } from '../actions/card';
import { sort, copy, move, isNearlyZero } from './lib/sortable';

const initialState = {
	dirty: {},
};

export default handleActions({
	[List.load]: loadList,
	[Card.load]: loadCard,
	[Card.sort]: (state, action) => sort(state, action),
	[Card.move]: (state, action) => move(state, action, 'ListId'),
	[Card.copy]: (state, action) => copy(state, action, 'ListId'),
}, initialState);

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
