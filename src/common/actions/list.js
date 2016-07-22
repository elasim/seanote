import { getList } from '../data/list';
import execute from '../data/execute';

export default {
	load,
	sort,
};

export const ActionTypes = {
	create: 'LIST_CREATE',
	rename: 'LIST_RENAME',
	sort: 'LIST_SORT',
	moveTrash: 'LIST_MOVE_TRASH',

	receiveServerData: 'LIST_RECEIVE_SERVER_DATA',
	loadStart: 'LIST_LOAD_START',
	loadSuccess: 'LIST_LOAD_SUCCESS',
	loadFailure: 'LIST_LOAD_FAILURE',
};

export function sort(source, a, b) {
	return async (dispatch, getState) => {
		if (getState().list[source].renumbering) {
			// await execute(renumber());
			load(source);
		}
		dispatch(applyChanges({
			type: ActionTypes.sort,
			payload: { source, a, b },
		}));
	};
}

function applyChanges(action) {
	return action;
}

export function load(id) {
	return async dispatch => {
		dispatch(loadStart());
		try {
			const data = await execute(getList(id));
			dispatch(loadSuccess(data));
		} catch (e) {
			console.error(e);
			dispatch(loadFailure(e));
		}
	};
}

function loadStart() {
	return {
		type: ActionTypes.loadStart
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
