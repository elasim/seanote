import request from '../lib/request';
import BoardAction from './board';

export default { prefetch };

export const ActionTypes = {
	prefetchStart: 'DATA_PREFETCH_START',
	prefetchSuccess: 'DATA_PREFETCH_SUCCESS',
	prefetchFailure: 'DATA_PREFETCH_FAILURE',
};

export function prefetch() {
	return async dispatch => {
		dispatch(prefetchStart());
		try {
			const res = await request.bulk('/api/_bulk', [
				{ '/board?offset=0&limit=10': 'get' },
				{ '/group?sort=updatedAt&filter=favorites': 'get' },
				{ '/message?sort=updatedAt&filter=unread': 'get' },
				{ '/notification?sort=updatedAt&filter=unread': 'get' },
			]);
			const data = await res.json();
			const [ board, group, message, notification ] = data.results;
			dispatch(BoardAction.receiveServerData(board));
		} catch (e) {
			dispatch(prefetchFailure(e));
		}
	};
}

function prefetchStart() {
	return {
		type: ActionTypes.prefetchStart,
	};
}
function prefetchFailure() {
	return {
		type: ActionTypes.prefetchFailure,
	};
}
