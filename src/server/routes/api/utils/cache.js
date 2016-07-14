import Rx from 'rx';

export function createTimeoutCache(store, key, value, timeout) {
	const cache = { value };
	store[key] = cache;
	const cacheControl = new Rx.Subject();
	const cacheExpires = cacheControl
		.debounce(timeout)
		.subscribe(() => {
			cacheControl.dispose();
			cacheExpires.dispose();
			delete store[key];
		});
	cacheControl.onNext();
	cache.hit = () => cacheControl.onNext();
	return cache;
}
