import Rx from 'rx';

export function createScrollSpy(handle) {
	return Rx.Observable.fromEvent(window, 'scroll')
		.map(() => document.body.scrollTop)
		.distinctUntilChanged()
		.subscribe(handle);
}

export function createResizeSpy(handle, capture) {
	return Rx.Observable.fromEvent(window, 'resize')
		.map(() => capture())
		.distinctUntilChanged()
		.subscribe(handle);
}

export function getViewportWidth() {
	return window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;
}

export function getViewportHeight() {
	return window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;
}