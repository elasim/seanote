import _ from 'lodash';
import { handleActions } from 'redux-actions';
import update from 'react/lib/update';
import { ActionTypes } from '../actions/board';

const DEFAULT_STATE = {
	items: [],
	trashItems: [],
	lastUpdate: 0, // never updated
	dirty: true,
	fetch: false,
	error: null,
};

export default handleActions({
	[ActionTypes.setName]: setBoardName,
	[ActionTypes.moveBoard]: setBoardIndex,
	[ActionTypes.updateCard]: updateCardDetail,
	[ActionTypes.moveBoardToTrash]: trashBoard,
	[ActionTypes.createCard]: createCard,
	[ActionTypes.moveCard]: setCardIndex,
	[ActionTypes.moveCardToTrash]: trashCard,
	[ActionTypes.fetchDataReceived]: setItems,
}, DEFAULT_STATE);

function setItems(state, action) {
	return {
		...state,
		items: action.payload,
	};
}

function setBoardName(state, action) {
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
}

function setBoardIndex(state, action) {
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
}

function trashBoard(state, action) {
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
}

function createCard(state, action) {
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
}

function setCardIndex(state, action) {
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
}

function updateCardDetail(state, action) {
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
}

function trashCard(state, action) {
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
}

// predicate functions
function byId(id) {
	return item => item.id === id;
}
