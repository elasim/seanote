import { combineReducers } from 'redux';
import app from './app';
import auth from './auth';
import board from './board';
import list from './list';
import message from './message';

export default combineReducers({
	app,
	auth,
	board,
	list,
	message
});
