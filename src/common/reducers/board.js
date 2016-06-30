import _ from 'lodash';
import { handleActions } from 'redux-actions';
import update from 'react/lib/update';
import * as Board from '../actions/board';

const initialState = {
	items: [],
	trashItems: [],
	lastUpdate: 0, // never updated
	dirty: true,
	fetch: false,
	error: null,
};
const byId = id => item => item.id === id;

export default handleActions({
	[Board.$setName](state, action) {
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
	[Board.$updateCard](state, action) {
		const { id, cardId, detail } = action.payload;
		const boardIdx = state.items.findIndex(byId(id));
		if (boardIdx === -1) {
			return state;
		}
		const board = state.items[boardIdx];
		const cardIdx = board.items.findIndex(byId(cardId));
		if (cardIdx === -1) {
			return state;
		}
		return update(state, {
			items: {
				[boardIdx]: {
					items: {
						[cardIdx]: {
							detail: {
								$set: detail
							}
						}
					}
				}
			}
		});
	},
	[Board.$moveBoard](state, action) {
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
	[Board.$moveBoardToTrash](state, action) {
		const idx = action.payload;
		const boardData = state.items[idx];
		if (!boardData) {
			return state;
		}
		return update(state, {
			items: {
				$splice: [
					[idx, 1]
				]
			},
			trashItems: {
				$push: [boardData]
			}
		});
	},
	[Board.$createCard](state, action) {
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
	[Board.$moveCard](state, action) {
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
	[Board.$moveCardToTrash](state, action) {
		const { id, idx } = action.payload;
		const boardIdx = state.items.findIndex(byId(id));
		if (boardIdx === -1) {
			return state;
		}
		const boardData = state.items[boardIdx];
		const cardData = boardData.items[idx];
		if (!cardData) {
			return state;
		}
		return update(state, {
			items: {
				[boardIdx]: {
					items: {
						$splice: [
							[idx, 1]
						]
					},
					trashItems: {
						$push: [cardData]
					}
				}
			}
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
