import _ from 'lodash';
import { handleActions } from 'redux-actions';
import update from 'react/lib/update';
import * as Board from '../actions/board';

const initialState = {
	items: [],
	lastUpdate: 0, // never updated
	dirty: true,
	fetch: false,
	error: null,
};
const byId = id => item => item.id === id;

export default handleActions({
	[Board.setNameOnState](state, action) {
		const { id, name } = action.payload;
		const boardIdx = state.items.findIndex(byId(id));
		if (boardIdx === -1) {
			return state;
		}
		return update(state, {
			items: {
				[boardIdx]: {
					name: {
						$set: name
					}
				}
			}
		});
	},
	[Board.moveBoardOnState](state, action) {
		const { oldIdx, newIdx } = action.payload;
		const boardData = state.items[oldIdx];
		if (!boardData) {
			return;
		}
		return update(state, {
			items: {
				$splice: [
					[oldIdx, 1],
					[newIdx, 0, boardData]
				]
			}
		});
	},
	[Board.createCardOnState](state, action) {
		const { id, type, data } = action.payload;
		const boardIdx = state.items.findIndex(byId(id));
		if (boardIdx === -1) {
			return state;
		}
		return update(state, {
			items: {
				[boardIdx]: {
					items: {
						$push: [{
							id: 'newCard#'+Date.now(),
							type,
							detail: data,
						}]
					}
				}
			}
		});
	},
	[Board.moveCardOnState](state, action) {
		const { src, srcIdx, dst, dstIdx } = action.payload;
		const { items } = state;
		const srcBoardIdx = items.findIndex(byId(src));
		const dstBoardIdx = items.findIndex(byId(dst));
		
		if (srcBoardIdx === -1 || dstBoardIdx === -1) {
			return state;
		}
		const srcBoardData = items[srcBoardIdx];
		const movingCardData = srcBoardData.items[srcIdx];
		if (!movingCardData) {
			return state;
		}
		const changes = {};
		const srcCardSplice = [srcIdx, 1];
		const dstCardSplice = [dstIdx, 0, movingCardData];
		changes[srcBoardIdx] = {
			items: {
				$splice: [srcCardSplice]
			}
		};
		// move from same board
		if (srcBoardIdx === dstBoardIdx) {
			changes[srcBoardIdx].items.$splice.push(dstCardSplice);
		} else {
			changes[dstBoardIdx] = {
				items: {
					$splice: [ dstCardSplice ]
				}
			};
		}
		return update(state, {
			items: changes,
			dirty: {
				$set: true
			},
		});
	},
	[Board.fetchRequest](state) {
		return {
			...state,
			fetch: true,
			error: null,
		};
	},
	[Board.fetchSucceed](state, action) {
		return {
			...state,
			items: action.payload,
			fetch: false,
			dirty: false,
			error: null,
			lastUpdate: Date.now(),
		};
	},
	[Board.fetchFailure](state, action) {
		return {
			...state,
			fetch: false,
			error: action.payload,
		};
	},
}, initialState);
