import { combineReducers } from 'redux';
import { reducer as reduxAsyncConnect  } from 'redux-connect';
import app from './app';
import board from './board';
import list from './list';
import card from './card';
import message from './message';

export default combineReducers({
	reduxAsyncConnect ,
	app,
	board,
	list,
	card,
	message,
});
