import { createAction } from 'redux-actions';
import request from '../lib/request';
import BoardAction from './board';

export default { prefetch };

export const ActionTypes = {
	prefetchStart: 'DATA_PREFETCH_START',
	prefetchSuccess: 'DATA_PREFETCH_SUCCESS',
	prefetchFailure: 'DATA_PREFETCH_FAILURE',
};

const prefetchStart = createAction(ActionTypes.prefetchStart);
// const prefetchSuccess = createAction(ActionTypes.prefetchSuccess);
const prefetchFailure = createAction(ActionTypes.prefetchFailure);

function prefetch() {
	return async dispatch => {
		dispatch(prefetchStart());
		try {
			const res = await request.post('/api/_bulk', {
				// change these tag to action type
				// so, that can use them later
				boardList: ['/board/list', { sort: 'updatedAt' }],
				groupList: ['/group/list', { filter: 'favorite', sort: 'accessAt'}],
				messages: ['/message', { filter: 'unread', sort: 'updatedAt' }],
				notification: ['/notification', { filter: 'unread', sort: 'updatedAt' }],
			});
			const data = await res.json();
			dispatch(BoardAction.update({
				items: data.boardList.items,
				counts: data.boardList.counts
			}));
		} catch (e) {
			dispatch(prefetchFailure(e));
		}
	};
}