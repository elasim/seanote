import App from './app';
import Lists from '../data/lists';
import { request } from './request';

export default {
	load,
	sort,
};

export const ActionTypes = {
	load: 'LIST_LOAD',
	sort: 'LIST_SORT',
};

export function sort(source, a, b) {
	return {
		type: ActionTypes.sort,
		payload: { source, a, b },
	};
}

export function load(id) {
	return async (dispatch, getState) => {
		try {
			const token = getState().app.token;
			const data = await request(dispatch, Lists.all(token,  id));
			dispatch({
				type: ActionTypes.load,
				payload: data
			});
		} catch (e) {
			dispatch(App.error(e));
		}
	};
}
