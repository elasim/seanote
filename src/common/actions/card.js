import * as Card from '../data/card';
import execute from '../data/execute';

export default {
	sort,
	copy,
	move,
	load,
};

export const ActionTypes = {
	sort: 'CARD_SORT',
	copy: 'CARD_COPY',
	move: 'CARD_MOVE',
	loadStart: 'CARD_LOAD_START',
	loadSuccess: 'CARD_LOAD_SUCCESS',
	loadFailure: 'CARD_LOAD_FAILURE',
};

export function sort(source, a, b) {
	return async (dispatch, getState) => {
		if (getState().card[source].renumbering) {
			await execute(Card.renumber(source));
			load(source);
		}
		dispatch({
			type: ActionTypes.sort,
			payload: { source, a, b },
		});
	};
}

export function move(source, id, target) {
	return async dispatch => {
		dispatch({
			type: ActionTypes.move,
			payload: { source, id, target },
		});
	};
}

export function copy(source, id, target) {
	const tempId = Date.now();
	return async dispatch => {
		dispatch({
			type: ActionTypes.copy,
			payload: { source, id, target, tempId },
		});
		if (0) {
			try {
				const result = await execute(Card.copy(source, id, target));
				dispatch({
					type: ActionTypes.copySuccess,
					payload: {
						tempId,
						id: result.id,
					},
				});
			} catch (e) {
				dispatch({
					type: ActionTypes.copyFailure,
					payload: {
						tempId,
					},
				});
			}
		}
	};
}

export function load(id) {
	return async dispatch => {
		dispatch(loadStart());
		try {
			const data = await execute(getCard(id));
			dispatch(loadSuccess(data));
		} catch (e) {
			console.error(e);
			dispatch(loadFailure(e));
		}
	};
}

function loadStart() {
	return {
		type: ActionTypes.loadStart,
	};
}

function loadSuccess(data) {
	return {
		type: ActionTypes.loadSuccess,
		payload: data,
	};
}

function loadFailure(error) {
	return {
		type: ActionTypes.loadFailure,
		payload: error,
	};
}
