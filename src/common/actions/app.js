import { createAction } from 'redux-actions';

export const setTitle = createAction(
	'APP_SET_TITLE',
	title => title);

export const setContextMenu = createAction(
	'APP_SET_CONTEXT_MENU',
	context => context);

export const setLocale = createAction(
	'APP_SET_LOCALE',
	locale => locale);
