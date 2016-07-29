export function selectable(predicate) {
	return obj => ({
		...obj,
		selectable: predicate
	});
}

export function comparable(predicate) {
	return obj => ({
		...obj,
		comparable: predicate
	});
}

export function issuedAt() {
	return obj => ({
		...obj,
		timestamp: Date.now(),
	});
}

export function deferrable() {
	return obj => ({
		...obj,
		deferrable: {}
	});
}
