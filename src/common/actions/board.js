import { createAction } from 'redux-actions';
import Board from '../data/board';

// Notify fetch request Sent
export const fetchRequest = createAction(
	'BOARD_FETCH_REQUEST'
);
// Notify fetch request Succeed
export const fetchSucceed = createAction(
	'BOARD_FETCH_SUCCEED',
	data => data
);
// Notify fetch request Failure
export const fetchFailure = createAction(
	'BOARD_FETCH_FAILURE',
	error => error
);

// Sync data with server if it available or necessary
/*
export function sync(opt = { force: false }) {
	return async (dispatch, getState) => {
		const currentState = getState();
		if (!opt.force) {
			const { board: { lastSync, dirty } } = currentState;
			// don't allow to send sync request too often
			if (lastSync > Date.now() - 10 * 1000) {
				return;
			}
			// data not changed, don't need to sync
			if (!dirty) {
				return;
			}
		}
		console.log('Sync Sent');
		try {
			await Board.sync();
			Board.all();
			dispatch(fetchSucceed());
		} catch (e) {
			dispatch(fetchFailure(e));
		}
		return;

		const { lastUpdated } = currentState;
		dispatch()
		const serverData = Board.fetch();
	};
}
*/

export const $moveCard = createAction(
	'BOARD_MOVE_CARD',
	(src, srcIdx, dst, dstIdx) => ({ src, srcIdx, dst, dstIdx })
);
export const $moveCardToTrash = createAction(
	'BOARD_MOVE_CARD_TO_TRASH',
	(id, idx) => ({ id, idx })
);
export const $createCard = createAction(
	'BOARD_CREATE_CARD',
	(id, type, data) => ({ id, type, data })
);
export const $moveBoard = createAction(
	'BOARD_MOVE_BOARD',
	(oldIdx, newIdx) => ({ oldIdx, newIdx })
);
export const $moveBoardToTrash = createAction(
	'BOARD_MOVE_BOARD_TO_TRASH',
	(idx) => idx
);
export const $setName = createAction(
	'BOARD_SET_NAME',
	(id, name) => ({ id, name })
);
export const $updateCard = createAction(
	'BOARD_UPDATE_CARD',
	(id, cardId, detail ) => ({ id, cardId, detail })
);

export function moveCard(src, srcIdx, dst, dstIdx) {
	return (dispatch) => {
		dispatch($moveCard(src, srcIdx, dst, dstIdx));
		// @TODO something here to send sync request
	};
}
export function moveCardToTrash(id, idx) {
	return (dispatch) => {
		dispatch($moveCardToTrash(id, idx));
	};
}
export function createCard(id, type, data) {
	return (dispatch) => {
		dispatch($createCard(id, type, data));
		// @TODO something here to send sync request
	};
}
export function moveBoard(oldIdx, newIdx) {
	return (dispatch) => {
		dispatch($moveBoard(oldIdx, newIdx));
	};
}
export function moveBoardToTrash(idx) {
	return (dispatch) => {
		dispatch($moveBoardToTrash(idx));
	};
}
export function setName(id, name) {
	return (dispatch) => {
		dispatch($setName(id, name));
	};
}
export function updateCard(id, cardId, detail) {
	return (dispatch) => {
		dispatch($updateCard(id, cardId, detail));
	};
}

// Action: Request /board/get/?all
export function getData(){
	return async (dispatch, getState) => {
		if (getState().board.lastUpdate > Date.now() - 60 * 1000) {
			return;
		}
		dispatch(fetchRequest());
		try {
			dispatch(fetchSucceed(await Board.all()));
		} catch (e) {
			dispatch(fetchFailure(e));
		}
	};
}
