import App from './app';
import Boards from '../data/boards';
import { request } from './request';

export default {
	create,
	rename,
	remove,
	sort,
	load,
};

export const ActionTypes = {
	create: 'BOARD_CREATE',
	rename: 'BOARD_RENAME',
	remove: 'BOARD_REMOVE',
	sort: 'BOARD_SORT',
	copy: 'BOARD_COPY',
	share: 'BOARD_SHARE',
	load: 'BOARD_LOAD',
};

export function create(name, isPublic) {
	return async (dispatch, getState) => {
		const token = getState().app.token;
		const result = await request(dispatch, Boards.create(token, {
			name,
			isPublic
		}));
		try {
			dispatch({
				type: ActionTypes.create,
				payload: {
					id: result.id,
					name,
				},
			});
		} catch (e) {
			dispatch(App.error(e));
		}
	};
}

export function remove(id) {
	return async (dispatch, getState) => {
		const token = getState().app.token;
		try {
			await request(dispatch, Boards.remove(token, id));
			dispatch({
				type: ActionTypes.remove,
				payload: id,
			});
		} catch (e) {
			dispatch(App.error(e));
		}
	};
}

export function rename(id, name) {
	return async (dispatch, getState) => {
		const token = getState().app.token;
		try {
			await request(dispatch, Boards.update(token, id, { name }));
			dispatch({
				type: ActionTypes.rename,
				payload: { id, name }
			});
		} catch (e) {
			dispatch(App.error(e));
		}
	};
}

export function sort(a, b) {
	return async (dispatch, getState) => {
		dispatch({
			type: ActionTypes.sort,
			payload: { a, b },
		});
		const state = getState();
		const token = state.app.token;
		const priority = state.board.dirty[a].priority;
		try {
			await request(dispatch, Boards.sort(a, priority, token));
		} catch (e) {
			dispatch(App.error(e));
		}
	};
}

export function load(offset = 0, limit = 10) {
	return async (dispatch, getState) => {
		const token = getState().app.token;
		try {
			const result = await request(dispatch, Boards.all(token, {
				offset,
				limit
			}));
			dispatch({
				type: ActionTypes.load,
				payload: result
			});
		} catch (e) {
			dispatch(App.error(e));
		}
	};
}
