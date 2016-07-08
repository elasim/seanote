import { combineReducers } from 'redux';
import app from './app';
import auth from './auth';
// import board from './board';

export default combineReducers({
	app,
	auth,
//	board,
});
