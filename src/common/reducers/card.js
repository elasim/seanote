import { handleActions } from 'redux-actions';
import cloneDeep from 'lodash/cloneDeep';
import { ActionTypes } from '../actions/card';

const initialState = {};

export default handleActions({
	[ActionTypes.sort]: sort
}, initialState);

function sort(list, a, b) {
	
}
