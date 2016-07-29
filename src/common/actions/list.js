import App from './app';
import Lists from '../data/lists';
import { request } from './data';

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
	return async dispatch => {
		try {
			const data = await request(dispatch, Lists.all(id));
			dispatch({
				type: ActionTypes.load,
				payload: data
			});
		} catch (e) {
			dispatch(App.error(e));
		}
	};
}
