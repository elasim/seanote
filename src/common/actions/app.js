export default {
	setTitle,
	setHeaderVisibility,
	setContextMenu,
	setLocale,
};

export const ActionTypes = {
	setTitle: 'APP_SET_TITLE',
	setHeaderVisibility: 'APP_SET_HEADER_VISIBILITY',
	setContextMenu: 'APP_SET_CONTEXT_MENU',
	setLocale: 'APP_SET_LOCALE',
};

function setTitle(title) {
	return { type: ActionTypes.setTitle, payload: title };
}

function setHeaderVisibility(visibility) {
	return { type: ActionTypes.setHeaderVisibility, payload: visibility };
}

function setContextMenu(contextMenu) {
	return { type: ActionTypes.setContextMenu, payload: contextMenu };
}

function setLocale(locale) {
	return { type: ActionTypes.setLocale, payload: locale };
}
