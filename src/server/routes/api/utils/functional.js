
export function assign(object, prop, value, pred) {
	if (pred(value)) {
		object[prop] = value;
	}
}

export function $not(pred) {
	return (val) => !pred(val);
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
