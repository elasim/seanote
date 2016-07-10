import { createAction } from 'redux-actions';
import request from '../lib/request';

export default {
	prefetch,
};

export const ActionTypes = {
	prefetchStart: 'DATA_PREFETCH_START',
	prefetchSuccess: 'DATA_PREFETCH_SUCCESS',
	prefetchFailure: 'DATA_PREFETCH_FAILURE',
};

const prefetchStart = createAction(ActionTypes.prefetchStart);
const prefetchSuccess = createAction(ActionTypes.prefetchSuccess);
const prefetchFailure = createAction(ActionTypes.prefetchFailure);

function prefetch() {
	return async (dispatch, getState) => {
		dispatch(prefetchStart());
		try {
			const res = await request.post('/api/_bulk', {
				// change these tag to action type
				// so, we can use them later
				boardList: ['/board/list', { sort: 'updatedAt' }],
				groupList: ['/group/list', { filter: 'favorite', sort: 'accessAt'}],
				messages: ['/message', { filter: 'unread', sort: 'updatedAt' }],
				notification: ['/notification', { filter: 'unread', sort: 'updatedAt' }],
				token: '/user',
			});
			const data = await res.json();
			console.log('Prefetch', data);
		} catch (e) {
			dispatch(prefetchFailure(e));
		}
	};
}