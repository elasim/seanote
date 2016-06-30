import Rx from 'rx';
//import io from '../lib/socket.io';

export function createLink() {
	//const data$ = new Rx.Subject();

	return (dispatch, getState) => {
		console.log('Thunk Dispatch');
		//board$.subscribe(action => dispatch(action));
	};
}

export function destroyLink() {
	return (distpach, getState) => {

	};
}

export function updateList() {
	return (dispatch, getState) => {

	};
}
