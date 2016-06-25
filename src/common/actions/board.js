import { createAction } from 'redux-actions';
import Board from '../models/board';

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

export const moveCardOnState = createAction(
	'BOARD_MOVE_CARD_ON_STATE',
	(src, srcIdx, dst, dstIdx) => ({ src, srcIdx, dst, dstIdx })
);
export const createCardOnState = createAction(
	'BOARD_CREATE_CARD_ON_STATE',
	(id, type, data) => ({ id, type, data })
);
export const moveBoardOnState = createAction(
	'BOARD_MOVE_BOARD_ON_STATE',
	(oldIdx, newIdx) => ({ oldIdx, newIdx })
);
export const setNameOnState = createAction(
	'BOARD_SET_NAME',
	(id, name) => ({ id, name })
);

export function moveCard(src, srcIdx, dst, dstIdx) {
	return (dispatch) => {
		dispatch(moveCardOnState(src, srcIdx, dst, dstIdx));
		// @TODO something here to send sync request
	};
}
export function createCard(id, type, data) {
	return (dispatch) => {
		dispatch(createCardOnState(id, type, data));
		// @TODO something here to send sync request
	};
}
export function moveBoard(oldIdx, newIdx) {
	return (dispatch) => {
		dispatch(moveBoardOnState(oldIdx, newIdx));
	};
}
export function setName(id, name) {
	return (dispatch) => {
		dispatch(setNameOnState(id, name));
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
