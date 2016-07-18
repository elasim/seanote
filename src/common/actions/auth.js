import { browserHistory } from 'react-router';
import emptyFunction from 'fbjs/lib/emptyFunction';
import User from '../data/user';
import execute from '../data/execute';

export default {
	acquireToken,
};

export const ActionTypes = {
	requestToken: 'AUTH_TOKEN_REQUEST',
	responseToken: 'AUTH_TOKEN_RESPONSE',
	tokenFailure: 'AUTH_TOKEN_FAIL',
};

export function acquireToken(callback = emptyFunction) {
	return async dispatch => {
		dispatch(requestToken());
		const user = await execute(User.whoami());
		if (user) {
			dispatch(responseToken(user.token));
			if (!user.token) {
				redirectToHome();
			}
			callback();
		} else {
			const e = new Error('not logged');
			dispatch(notifyFailure(e));
			callback(e);
			redirectToHome();
		}
	};
}

function requestToken() {
	return {
		type: ActionTypes.requestToken,
	};
}
function responseToken(token) {
	return {
		type: ActionTypes.responseToken,
		payload: token,
	};
}
function notifyFailure(error) {
	return {
		type: ActionTypes.tokenFailure,
		payload: error,
	};
}

function redirectToHome() {
	browserHistory.push('/');
}
