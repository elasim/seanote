
export default {
	create,
	rename,
	moveTrash,
	receiveServerData,
};

export const ActionTypes = {
	create: 'BOARD_CREATE',
	rename: 'BOARD_RENAME',
	sort: 'BOARD_SORT',
	moveTrash: 'BOARD_MOVE_TRASH',
	receiveServerData: 'BOARD_RECEIVE_SERVER_DATA',
};

// create new board
export function create(name) {
	return {
		type: ActionTypes.create,
	};
}

// rename a board
export function rename(id, name) {
	return {
		type: ActionTypes.rename,
	};
}

// swap a & b
export function sort(a, b) {
	return {
		type: ActionTypes.sort,
		payload: { a, b },
	};
}

// move a board to trash
export function moveTrash() {
	return {
		type: ActionTypes.moveTrash,
	};
}

// receive board data from server
export function receiveServerData(data) {
	return {
		type: ActionTypes.receiveServerData,
		payload: data,
	};
}
