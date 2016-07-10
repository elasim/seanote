import { createAction } from 'redux-actions';
import { browserHistory } from 'react-router';
import emptyFunction from 'fbjs/lib/emptyFunction';
import User from '../data/user';

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
		dispatch(requestToken());
		const user = await User.whoami();
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

function redirectToHome() {
	browserHistory.push('/');
}
