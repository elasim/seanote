import App from './app';
import Cards from '../data/cards';
import { request } from './data';

export default {
	copy,
	sort,
	move,
	load,
	update,
};

export const ActionTypes = {
	sort:		'CARD_SORT',
	copy:		'CARD_COPY',
	move:		'CARD_MOVE',
	update:	'CARD_UPDATE',
	load:		'CARD_LOAD',
};

export function sort(source, a, b) {
	return {
		type: ActionTypes.sort,
		payload: { source, a, b },
	};
}

export function move(source, id, target) {
	return {
		type: ActionTypes.move,
		payload: { source, id, target },
	};
}

export function update(source, id, nextValue) {
	return {
		type: ActionTypes.update,
		payload: { source, id, nextValue }
	};
}

export function copy(source, id, target) {
	const tempId = Date.now();
	return async dispatch => {
		dispatch({
			type: ActionTypes.copy,
			payload: { source, id, target, tempId },
		});
	};
}

export function load(id) {
	return async dispatch => {
		try {
			const data = await request(dispatch, Cards.find({
				ListId: id
			}));
			dispatch({
				type: ActionTypes.load,
				payload: data
			});
		} catch (e) {
			dispatch(App.error(e));
		}
	};
}
