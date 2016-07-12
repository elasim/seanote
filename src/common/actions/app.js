export default {
	setTitle,
	setHeaderVisibility,
	setDim,
	setLocale,
};

export const ActionTypes = {
	setTitle: 'APP_SET_TITLE',
	setHeaderVisibility: 'APP_SET_HEADER_VISIBILITY',
	setDim: 'APP_SET_DIM',
	setLocale: 'APP_SET_LOCALE',
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
