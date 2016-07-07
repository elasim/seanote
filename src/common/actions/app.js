export default {
	setTitle,
	setContextMenu,
	setLocale,
};

export const ActionTypes = {
	setTitle: 'APP_SET_TITLE',
	setContextMenu: 'APP_SET_CONTEXT_MENU',
	setLocale: 'APP_SET_LOCALE',
};

function setTitle(title) {
	return { type: ActionTypes.setTitle, payload: title };
}

function setContextMenu(contextMenu) {
	return { type: ActionTypes.setContextMenu, payload: contextMenu };
}

function setLocale(locale) {
	return { type: ActionTypes.setLocale, payload: locale };
}
