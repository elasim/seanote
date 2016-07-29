import { combineReducers } from 'redux';
import app from './app';
import board from './board';
import list from './list';
import card from './card';
import message from './message';

export default combineReducers({
	app,
	board,
	list,
	card,
	message
});
