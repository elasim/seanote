import { handleActions } from 'redux-actions';
import { ActionTypes as List } from '../actions/list';
import { sort, move, copy  } from './lib/sortable';

const initialState = {
	dirty: {},
};

export default handleActions({
	[List.load]: load,
	[List.sort]: (state, action) => sort(state, action),
	[List.copy]: (state, action) => copy(state, action, 'BoardId'),
	[List.move]: (state, action) => move(state, action, 'BoardId'),
}, initialState);

function load(state, { payload }) {
	const { id } = payload;
	const newDirty = { ...state.dirty };
	const items = payload.items.map(item => {
		const data = {
			BoardId: id,
			...item
		};
		delete newDirty[item.id];
		delete data.Cards;
		return data;
	});
	return {
		...state,
		dirty: newDirty,
		[id]: {
			items,
			renumbering: false,
		},
	};
}
