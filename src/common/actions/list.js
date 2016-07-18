import request from '../lib/request';

export default {
	load,
};

export const ActionTypes = {
	loadStart: 'LIST_LOAD_START',
	loadSuccess: 'LIST_LOAD_SUCCESS',
	loadFailure: 'LIST_LOAD_FAILURE',
};

export function load(id) {
	return async dispatch => {
		dispatch(loadStart());
		try {
			const res = await request.get(`/api/board/${id}`);
			if (200 < res.status || res.status >= 300) throw new Error('Request Status Error');
			const data = await res.json();
			dispatch(loadSuccess(data));
		} catch (e) {
			dispatch(loadFailure(e));
		}
	};
}

function loadStart() {
	return {
		type: ActionTypes.loadStart
	};
}

function loadSuccess(data) {
	return {
		type: ActionTypes.loadSuccess,
		payload: data
	};
}

function loadFailure(error) {
	return {
		type: ActionTypes.loadFailure,
		payload: error,
	};
}