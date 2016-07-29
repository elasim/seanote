import Users from '../data/users';
import { request } from './data';

export default {
	setTitle,
	setHeaderVisibility,
	setDim,
	setLocale,
	error,
	getToken,
};

export const ActionTypes = {
	setTitle: 'APP_SET_TITLE',
	setHeaderVisibility: 'APP_SET_HEADER_VISIBILITY',
	setDim: 'APP_SET_DIM',
	setLocale: 'APP_SET_LOCALE',
	getToken: 'APP_GET_TOKEN',
	error: 'APP_ERROR',
};

export function setTitle(title) {
	return { type: ActionTypes.setTitle, payload: title };
}

export function setHeaderVisibility(visibility) {
	return { type: ActionTypes.setHeaderVisibility, payload: visibility };
}

export function setDim(obj) {
	return { type: ActionTypes.setDim, payload: obj };
}

export function setLocale(locale) {
	return { type: ActionTypes.setLocale, payload: locale };
}

export function getToken() {
	return async dispatch => {
		try {
			const user = await request(dispatch, Users.getToken());
			dispatch({
				type: ActionTypes.getToken,
				payload: user.token
			});
		} catch (e) {
			dispatch(error(e));
		}
	};
}

export function error(e) {
	return { type: ActionTypes.error, payload: e };
}
