import { combineReducers } from 'redux';
import app from './app';
import auth from './auth';
import message from './message';

export default combineReducers({
	app,
	auth,
	message
});
