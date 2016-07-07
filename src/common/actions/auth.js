import { createAction } from 'redux-actions';
import emptyFunction from 'fbjs/lib/emptyFunction';
import request from '../lib/request';

export default {
	acquireToken,
};

export const ActionTypes = {
	requestToken: 'AUTH_TOKEN_REQUEST',
	responseToken: 'AUTH_TOKEN_RESPONSE',
	tokenFailure: 'AUTH_TOKEN_FAIL',
};

const requestToken = createAction(
	ActionTypes.requestToken
);
const responseToken = createAction(
	ActionTypes.responseToken,
	token => token
);
const notifyFailure = createAction(
	ActionTypes.tokenFailure,
	e => e
);

function acquireToken(callback = emptyFunction) {
	return async dispatch => {
		try {
			dispatch(requestToken());
			const res = await request.get('/api/user/');
			const data = await res.json();
			dispatch(responseToken(data.token));
			callback();
		} catch (e) {
			dispatch(notifyFailure(e));
			callback(e);
		}
	};
}
