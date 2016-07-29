import { bulkRequest } from './request';
import Boards from '../../data/boards';
// import Groups from '../../data/groups';
// import Messages from '../../data/messages';
// import Notifications from '../../data/notifications';

export const ActionTypes = {
	prefetch: 'DATA_PREFETCH',
};

export function prefetch() {
	return dispatch => bulkRequest(dispatch, [
		Boards.all(0, 10),
		// Groups.find(
		// 	{ favorite: true },
		// 	{ offset: 0, limit: 10 }
		// ),
		// Messages.get(
		// 	{ unread: true },
		// 	{ offset: 0, limit: 10 }
		// ),
		// Notifications.get(),
	])
	.then(result => {
		const [board] = result.results;
		dispatch({
			type: ActionTypes.prefetch,
			payload: {
				board,
			}
		});
	});
}
