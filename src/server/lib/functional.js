
export function assign(object, prop, value, pred) {
	if (pred(value)) {
		object[prop] = value;
	}
}

export function $bindRight(pred, ...params) {
	return (...args) => pred(...args, ...params);
}
export function $or(...preds) {
	return val => {
		for (const pred of preds) {
			if (pred(val)) {
				return true;
			}
		}
		return false;
	};
}

export function $not(pred, ...params) {
	return (val) => !pred(val, ...params);
}

export function $select(preds) {
	return (obj) => {
		const selected = {};
		for (const prop in preds) {
			selected[prop] = preds[prop](obj);
		}
		return selected;
	};
}

export function $selects(...selectors) {
	return obj => selectors.reduce((result, selector) => {
		return Object.assign(result, selector(obj));
	}, {});
}
