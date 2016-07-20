
export function getElementParentNodes(element) {
	let ancestors = [];
	for (let node = element;
		node && node !== document.body;
		node = node.parentNode) {
		ancestors.push(node);
	}
	return ancestors;
}

export function isEqual(value) {
	return (item) => (item === value);
}

export function isEqualWith(key, value) {
	return (item) => (item[key] === value);
}
