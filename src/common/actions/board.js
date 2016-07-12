
export default {
	create,
	rename,
	moveTrash,
	update,
};

export const ActionTypes = {
	create: 'BOARD_CREATE',
	rename: 'BOARD_RENAME',
	moveTrash: 'BOARD_MOVE_TRASH',
	update: 'BOARD_UPDATE',
};

export function create() {
	return {
		type: ActionTypes.create,
	};
}

export function rename() {
	return {
		type: ActionTypes.rename,
	};
}

export function moveTrash() {
	return {
		type: ActionTypes.moveTrash,
	};
}

export function update(data) {
	return {
		type: ActionTypes.update,
		payload: data,
	};
}
