import Rx from 'rx';
import { getList, renumber, update } from '../data/board';
import execute, { bulkExecute } from '../data/execute';

export default {
	create,
	rename,
	sort,
	moveTrash,
	load,
	receiveServerData,
};

export const ActionTypes = {
	create: 'BOARD_CREATE',
	rename: 'BOARD_RENAME',
	sort: 'BOARD_SORT',
	moveTrash: 'BOARD_MOVE_TRASH',
	receiveServerData: 'BOARD_RECEIVE_SERVER_DATA',
	updateSuccess: 'BOARD_UPDATE_SUCCESS',
	updateFailure: 'BOARD_UPDATE_FAILURE',
};

// create new board
export function create(name) {
	return applyChanges({
		type: ActionTypes.create,
		payload: name,
	});
}

// rename a board
export function rename(id, name) {
	return applyChanges({
		type: ActionTypes.rename,
		payload: {
			id,
			name,
		},
	});
}

// swap a & b
export function sort(a, b) {
	return async (dispatch, getState) => {
		const { renumbering,  list } = getState().board;
		if (renumbering) {
			try {
				await execute(renumber());
				const newList = await execute(getList(0, list.length));
				dispatch(receiveServerData(newList, true));
			} catch (e) {
				// dispatch()
				console.error(e);
				return;
			}
		}
		dispatch(applyChanges({
			type: ActionTypes.sort,
			payload: { a, b },
		}));
	};
}

export function load(offset = 0, limit = 10) {
	return async dispatch => {
		try {
			dispatch(receiveServerData(await execute(getList(offset, limit))));
		} catch (e) {
			console.error(e);
		}
	};
}

// move a board to trash
export function moveTrash(id) {
	return applyChanges({
		type: ActionTypes.moveTrash,
		payload: id,
	});
}

// receive board data from server
export function receiveServerData(data, renumbered = false) {
	return {
		type: ActionTypes.receiveServerData,
		payload: {
			data,
			renumbered
		}
	};
}

function updateSuccess(timestamp) {
	return {
		type: ActionTypes.updateSuccess,
		payload: timestamp,
	};
}

function updateFailure(e) {
	return {
		type: ActionTypes.updateFailure,
		payload: e,
	};
}

const updateControl = new Rx.Subject();

updateControl.debounce(1000).subscribe(({ dispatch, getState }) => {
	const { dirty } = getState().board;

	const updates = Object.keys(dirty).map(id => update(id, dirty[id]));

	bulkExecute(updates)
		.then(async res => {
			const result = await res.json();
			if (res.status >= 200 && res.status < 300) {
				dispatch(updateSuccess());
			} else {
				throw new Error(result.error || 'unknown server error');
			}
		})
		.catch(e => {
			dispatch(updateFailure(e));
		});
});

function applyChanges(action) {
	return (dispatch, getState) => {
		updateControl.onNext({ dispatch, getState });
		dispatch(action);
	};
}
