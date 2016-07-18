import Rx from 'rx';

export function createScrollSpy(handle, element = window, value = 'scrollTop') {
	if (element !== window) {
		return Rx.Observable.fromEvent(element, 'scroll')
			.map(() => element[value])
			.distinctUntilChanged()
			.subscribe(handle);
	} else {
		return Rx.Observable.fromEvent(window, 'scroll')
			.map(() => document.body[value])
			.distinctUntilChanged()
			.subscribe(handle);
	}
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
