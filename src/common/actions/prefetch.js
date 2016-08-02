import App from './app';
import { bulkRequest } from './request';
import Boards from '../data/boards';
// import Groups from '../../data/groups';
// import Messages from '../../data/messages';
// import Notifications from '../../data/notifications';

export const ActionTypes = {
	prefetch: 'DATA_PREFETCH',
};

export function prefetch() {
	return async (dispatch, getState) => {
		const token = getState().app.token;
		try {
			const bulkResult = await bulkRequest(dispatch, [
				Boards.all(token, 0, 10),
				// Groups.find(
				// 	{ favorite: true },
				// 	{ offset: 0, limit: 10 }
				// ),
				// Messages.get(
				// 	{ unread: true },
				// 	{ offset: 0, limit: 10 }
				// ),
				// Notifications.get(),
			]);
			const [board] = bulkResult.results;
			dispatch({
				type: ActionTypes.prefetch,
				payload: {
					board,
				}
			});
		} catch (e) {
			dispatch(App.error(e));
		}
	};
}
