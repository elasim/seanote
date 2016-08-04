import path from 'path';

export function combine(routes) {
	const edges = {};
	for (const path in routes) {
		Object.assign(edges, extend(path, routes[path]));
	}
	return edges;
}

export function extend(base, routes) {
	return Object.assign(
		...Object.keys(routes).map(edge => {
			return {
				[path.join(base, edge).replace(new RegExp('\\\\', 'g'), '/')]: routes[edge]
			};
		})
	);
}
