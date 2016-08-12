import App from './app';
import Lists from '../data/lists';
import Boards from '../data/boards';
import { ActionTypes as BoardAction } from './board';
import { request } from './request';

export default {
	create,
	load,
	sort,
};

export const ActionTypes = {
	create: 'LIST_CREATE',
	load: 'LIST_LOAD',
	sort: 'LIST_SORT',
};

export function create(board) {
	return async (dispatch, getState) => {
		const state = getState();
		const token = state.app.token;
		try {
			const command = Lists.create(token, board);
			const list = await request(dispatch, command);
			dispatch({
				type: ActionTypes.create,
				payload: list,
			});
		} catch (e) {
			dispatch(App.error(e));
		}
	};
}

export function createWithBoard() {
	return async (dispatch, getState) => {
		const state = getState();
		const token = state.app.token;
		try {
			const board = await request(dispatch, Boards.create(token));
			dispatch({
				type: BoardAction.create,
				payload: board,
			});
			const list = await request(dispatch, Lists.create(token, board.id));
			dispatch({
				type: ActionTypes.create,
				payload: list,
			});
		} catch (e) {
			dispatch(App.error(e));
		}
	};
}

export function sort(source, a, b) {
	return async (dispatch, getState) => {
		dispatch({
			type: ActionTypes.sort,
			payload: { source, a, b },
		});
		const state = getState();
		const token = state.app.token;
		const priority = state.list.dirty[a].priority;
		const command = Lists.sort(token, source, a, {
			value: priority
		});
		try {
			await request(dispatch, command);
		} catch (e) {
			dispatch(App.error(e));
		}
	};
}

export function load(id) {
	return async (dispatch, getState) => {
		try {
			const token = getState().app.token;
			const data = await request(dispatch, Lists.all(token,  id));
			dispatch({
				type: ActionTypes.load,
				payload: data
			});
		} catch (e) {
			dispatch(App.error(e));
		}
	};
}
