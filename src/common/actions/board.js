import { createAction } from 'redux-actions';
import emptyFunction from 'fbjs/lib/emptyFunction';
import Board from '../data/board';

export default {
	setName,
	moveBoard,
	moveBoardToTrash,
	createCard,
	updateCard,
	moveCard,
	moveCardToTrash,
	fetchData,
};

export const ActionTypes = {
	setName: 'BOARD_SET_NAME',
	moveBoard: 'BOARD_MOVE_BOARD',
	updateCard: 'BOARD_UPDATE_CARD',
	moveBoardToTrash: 'BOARD_MOVE_BOARD_TO_TRASH',
	createCard: 'BOARD_CREATE_CARD',
	moveCard: 'BOARD_MOVE_CARD',
	moveCardToTrash: 'BOARD_MOVE_CARD_TO_TRASH',
	fetchDataReceived: 'BOARD_DATA_RECEIVED',
};

const $moveCard = createAction(
	ActionTypes.moveCard,
	(src, srcIdx, dst, dstIdx) => ({ src, srcIdx, dst, dstIdx })
);
const $moveCardToTrash = createAction(
	ActionTypes.moveCardToTrash,
	(id, idx) => ({ id, idx })
);
const $createCard = createAction(
	ActionTypes.createCard,
	(id, type, data) => ({ id, type, data })
);
const $moveBoard = createAction(
	ActionTypes.moveBoard,
	(oldIdx, newIdx) => ({ oldIdx, newIdx })
);
const $moveBoardToTrash = createAction(
	ActionTypes.moveBoardToTrash,
	(idx) => idx
);
const $setName = createAction(
	ActionTypes.setName,
	(id, name) => ({ id, name })
);
const $updateCard = createAction(
	ActionTypes.updateCard,
	(id, cardId, detail ) => ({ id, cardId, detail })
);

function moveCard(src, srcIdx, dst, dstIdx) {
	return (dispatch) => {
		dispatch($moveCard(src, srcIdx, dst, dstIdx));
		// @TODO something here to send sync request
	};
}
function moveCardToTrash(id, idx) {
	return (dispatch) => {
		dispatch($moveCardToTrash(id, idx));
	};
}
function createCard(id, type, data) {
	return (dispatch) => {
		dispatch($createCard(id, type, data));
		// @TODO something here to send sync request
	};
}
function moveBoard(oldIdx, newIdx) {
	return (dispatch) => {
		dispatch($moveBoard(oldIdx, newIdx));
	};
}
function moveBoardToTrash(idx) {
	return (dispatch) => {
		dispatch($moveBoardToTrash(idx));
	};
}
function setName(id, name) {
	return (dispatch) => {
		dispatch($setName(id, name));
	};
}
function updateCard(id, cardId, detail) {
	return (dispatch) => {
		dispatch($updateCard(id, cardId, detail));
	};
}

function fetchData(callback = emptyFunction){
	return dispatch => {
		Board.all()
			.then(data => {
				dispatch({
					type: ActionTypes.fetchDataReceived,
					payload: data
				});
				callback();
			})
			.catch(e => callback(e));
	};
}
